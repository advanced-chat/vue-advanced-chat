<template>
	<div
		class="vac-format-message-wrapper"
		:class="{ 'vac-text-ellipsis': singleLine }"
	>
		<div
			v-if="!textFormatting.disabled"
			:class="{ 'vac-text-ellipsis': singleLine }"
		>
			<div
				v-for="(message, i) in linkifiedMessage"
				:key="i"
				class="vac-format-container"
			>
				<component
					:is="message.url ? 'a' : 'span'"
					:class="{
						'vac-text-ellipsis': singleLine,
						'vac-text-bold': message.bold,
						'vac-text-italic': deleted || message.italic,
						'vac-text-strike': message.strike,
						'vac-text-underline': message.underline,
						'vac-text-inline-code': !singleLine && message.inline,
						'vac-text-multiline-code': !singleLine && message.multiline,
						'vac-text-tag': !singleLine && !reply && message.tag
					}"
					:href="message.href"
					:target="message.href ? linkOptions.target : null"
					:rel="message.href ? linkOptions.rel : null"
					@click="openTag(message)"
				>
					<template v-if="deleted">
						<slot
							:name="
								roomList
									? 'deleted-icon-room_' + roomId
									: 'deleted-icon_' + messageId
							"
						>
							<svg-icon
								name="deleted"
								class="vac-icon-deleted"
								:class="{ 'vac-icon-deleted-room': roomList }"
							/>
						</slot>
						{{ textMessages.MESSAGE_DELETED }}
					</template>
					<template v-else-if="message.url && message.image">
						<div class="vac-image-link-container">
							<div
								class="vac-image-link"
								:style="{
									'background-image': `url('${message.value}')`,
									height: message.height
								}"
							/>
						</div>
						<div class="vac-image-link-message">
							<span>{{ message.value }}</span>
						</div>
					</template>
					<template v-else>
						<span v-html="message.value" />
					</template>
				</component>
			</div>
		</div>
		<div v-else v-html="formattedContent" />
	</div>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon'

import formatString from '../../utils/format-string'
import { IMAGE_TYPES } from '../../utils/constants'

export default {
	name: 'FormatMessage',
	components: { SvgIcon },

	props: {
		messageId: { type: String, default: '' },
		roomId: { type: String, default: '' },
		roomList: { type: Boolean, default: false },
		content: { type: [String, Number], required: true },
		deleted: { type: Boolean, default: false },
		users: { type: Array, default: () => [] },
		linkify: { type: Boolean, default: true },
		singleLine: { type: Boolean, default: false },
		reply: { type: Boolean, default: false },
		textFormatting: { type: Object, required: true },
		textMessages: { type: Object, default: () => {} },
		linkOptions: { type: Object, required: true }
	},

	emits: ['open-user-tag'],

	computed: {
		linkifiedMessage() {
			if (this.deleted) {
				return [{ value: this.textMessages.MESSAGE_DELETED }]
			}

			const message = formatString(
				this.formatTags(this.content),
				this.linkify && !this.linkOptions.disabled,
				this.textFormatting
			)

			message.forEach(m => {
				m.url = this.checkType(m, 'url')
				m.bold = this.checkType(m, 'bold')
				m.italic = this.checkType(m, 'italic')
				m.strike = this.checkType(m, 'strike')
				m.underline = this.checkType(m, 'underline')
				m.inline = this.checkType(m, 'inline-code')
				m.multiline = this.checkType(m, 'multiline-code')
				m.tag = this.checkType(m, 'tag')
				m.image = this.checkImageType(m)
				m.value = this.replaceEmojiByElement(m.value)
			})

			return message
		},
		formattedContent() {
			if (this.deleted) {
				return this.textMessages.MESSAGE_DELETED
			} else {
				return this.formatTags(this.content)
			}
		}
	},

	methods: {
		checkType(message, type) {
			return message.types && message.types.indexOf(type) !== -1
		},
		checkImageType(message) {
			let index = message.value.lastIndexOf('.')
			const slashIndex = message.value.lastIndexOf('/')
			if (slashIndex > index) index = -1

			const type = message.value.substring(index + 1, message.value.length)

			const isMedia =
				index > 0 && IMAGE_TYPES.some(t => type.toLowerCase().includes(t))

			if (isMedia) this.setImageSize(message)

			return isMedia
		},
		setImageSize(message) {
			const image = new Image()
			image.src = message.value

			image.addEventListener('load', onLoad)

			function onLoad(img) {
				const ratio = img.path[0].width / 150
				message.height = Math.round(img.path[0].height / ratio) + 'px'
				image.removeEventListener('load', onLoad)
			}
		},
		formatTags(content) {
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

				const user = this.users.find(user => user._id === userId)

				content = content.replaceAll(userId, `@${user?.username || 'unknown'}`)
			})

			return content
		},
		openTag(message) {
			if (!this.singleLine && this.checkType(message, 'tag')) {
				const user = this.users.find(
					u => message.value.indexOf(u.username) !== -1
				)
				this.$emit('open-user-tag', user)
			}
		},
		replaceEmojiByElement(value) {
			let emojiSize
			if (this.singleLine) {
				emojiSize = 16
			} else {
				const onlyEmojis = this.containsOnlyEmojis()
				emojiSize = onlyEmojis ? 28 : 20
			}

			return value.replaceAll(
				/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu,
				v => {
					return `<span style="font-size: ${emojiSize}px">${v}</span>`
				}
			)
		},
		containsOnlyEmojis() {
			const onlyEmojis = this.content.replace(
				new RegExp('[\u0000-\u1eeff]', 'g'),
				''
			)
			const visibleChars = this.content.replace(
				new RegExp('[\n\rs]+|( )+', 'g'),
				''
			)
			return onlyEmojis.length === visibleChars.length
		}
	}
}
</script>
