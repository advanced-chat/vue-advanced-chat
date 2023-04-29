import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { underline, underlineHtml } from './underline'
import { usertag, usertagHtml } from './usertag'

export default (text, { textFormatting }) => {
	if (textFormatting) {
		let gfmDisabled = []

		if (!textFormatting.linkify) {
			gfmDisabled = ['literalAutolink', 'literalAutolinkEmail']
		}

		const markdown = micromark(
			text.replaceAll('<usertag>', '<@').replaceAll('</usertag>', '>'),
			{
				extensions: [
					{
						...gfm(),
						disable: { null: gfmDisabled }
					},
					underline,
					usertag
				],
				htmlExtensions: [
					gfmHtml(),
					underlineHtml,
					usertagHtml(textFormatting.users)
				]
			}
		)

		if (textFormatting.singleLine) {
			const element = document.createElement('div')

			element.innerHTML = markdown

			return [
				{
					types: [],
					value: element.innerText
				}
			]
		}

		return [
			{
				types: ['markdown'],
				value: markdown
			}
		]
	}

	return [
		{
			types: [],
			value: text
		}
	]
}
