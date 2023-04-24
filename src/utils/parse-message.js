import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import formatString from './format-string'

const EMOJI_REGEX =
	/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu

export default (text, { textFormatting, markdown, html }) => {
	if (textFormatting) {
		return handleTextFormatting(text, textFormatting)
	}

	let processor = unified()

	if (markdown) {
		const content = processor
			.use(remarkParse)
			.use(remarkRehype)
			.use(rehypeStringify)
			.processSync(text)

		return [
			{
				types: ['html'],
				value: String(content)
			}
		]
	}

	if (html) {
		const content = processor
			.use(rehypeParse, { fragment: true })
			.use(rehypeSanitize)
			.use(rehypeStringify)
			.processSync(text)

		return [
			{
				types: ['html'],
				value: String(content)
			}
		]
	}

	return [
		{
			types: ['unknown'],
			value: text
		}
	]
}

function handleTextFormatting(
	content,
	{ linkify, linkOptions, singleLine, users, ...formatting }
) {
	const message = formatString(
		formatTags(content, users),
		linkify && !linkOptions.disabled,
		formatting
	)

	message.forEach(m => {
		const { html, value } = replaceEmojiByElement(content, m.value, {
			singleLine
		})

		if (html) {
			m.types = [...m.types, 'html']
			m.value = value
		}
	})

	return message
}

function formatTags(content, users) {
	const firstTag = '<usertag>'
	const secondTag = '</usertag>'

	const usertags = [...content.matchAll(new RegExp(firstTag, 'gi'))].map(
		a => a.index
	)

	const initialContent = content

	usertags.forEach(index => {
		const userId = initialContent.substring(
			index + firstTag.length,
			initialContent.indexOf(secondTag, index)
		)

		const user = users.find(user => user._id === userId)

		content = content.replaceAll(userId, `@${user?.username || 'unknown'}`)
	})

	return content
}

function replaceEmojiByElement(content, value, { singleLine }) {
	let emojiSize
	if (singleLine) {
		emojiSize = 16
	} else {
		const onlyEmojis = containsOnlyEmojis(content)
		emojiSize = onlyEmojis ? 28 : 20
	}

	const html = EMOJI_REGEX.test(value)

	return {
		html,
		value: value.replaceAll(EMOJI_REGEX, v => {
			return `<span style="font-size: ${emojiSize}px">${v}</span>`
		})
	}
}

function containsOnlyEmojis(content) {
	const onlyEmojis = content.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
	const visibleChars = content.replace(new RegExp('[\n\rs]+|( )+', 'g'), '')
	return onlyEmojis.length === visibleChars.length
}
