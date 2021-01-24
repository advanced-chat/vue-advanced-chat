<template>
	<div :class="{ 'vac-text-ellipsis': singleLine }">
		<div :class="{ 'vac-text-ellipsis': singleLine }" v-if="textFormatting">
			<template v-for="(message, i) in linkifiedMessage">
				<component
					:is="checkType(message, 'url') ? 'a' : 'span'"
					:key="i"
					:class="{
						'vac-text-ellipsis': singleLine,
						'vac-text-bold': checkType(message, 'bold'),
						'vac-text-italic': deleted || checkType(message, 'italic'),
						'vac-text-strike': checkType(message, 'strike'),
						'vac-text-underline': checkType(message, 'underline'),
						'vac-text-inline-code':
							!singleLine && checkType(message, 'inline-code'),
						'vac-text-multiline-code':
							!singleLine && checkType(message, 'multiline-code'),
						'vac-text-tag': !singleLine && !reply && checkType(message, 'tag')
					}"
					:href="message.href"
					:target="message.href ? '_blank' : null"
					@click="openTag(message)"
				>
					<template>
						<slot name="deleted-icon" v-bind="{ deleted }">
							<svg-icon
								v-if="deleted"
								name="deleted"
								class="vac-icon-deleted"
							/>
						</slot>
						<div
							v-if="checkType(message, 'url') && checkImageType(message)"
							class="vac-image-link-container"
						>
							<div
								class="vac-image-link"
								:style="{
									'background-image': `url('${message.value}')`,
									height: message.height
								}"
							></div>
						</div>
						{{ message.value }}
					</template>
				</component>
			</template>
		</div>
		<div v-else>{{ formattedContent }}</div>
	</div>
</template>

<script>
import SvgIcon from './SvgIcon'

import formatString from '../utils/formatString'
import { IMAGE_TYPES } from '../utils/constants'

export default {
	name: 'format-message',
	components: { SvgIcon },

	props: {
		content: { type: [String, Number], required: true },
		deleted: { type: Boolean, default: false },
		users: { type: Array, default: () => [] },
		linkify: { type: Boolean, default: true },
		singleLine: { type: Boolean, default: false },
		reply: { type: Boolean, default: false },
		textFormatting: { type: Boolean, required: true }
	},

	computed: {
		linkifiedMessage() {
			return formatString(this.formatTags(this.content), this.linkify)
		},
		formattedContent() {
			return this.formatTags(this.content)
		}
	},

	methods: {
		checkType(message, type) {
			return message.types.indexOf(type) !== -1
		},
		checkImageType(message) {
			let index = message.value.lastIndexOf('.')
			const slashIndex = message.value.lastIndexOf('/')
			if (slashIndex > index) index = -1

			const imageTypes = IMAGE_TYPES
			const type = message.value.substring(index + 1, message.value.length)

			const isMedia = index > 0 && imageTypes.some(t => type.toLowerCase().includes(t))

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
			this.users.forEach(user => {
				const index = content.indexOf(user._id)
				const isTag = content.substring(index - 9, index) === '<usertag>'
				if (isTag) content = content.replace(user._id, `@${user.username}`)
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
		}
	}
}
</script>

<style>
.vac-icon-deleted {
	height: 14px;
	width: 14px;
	vertical-align: middle;
	margin: -3px 1px 0 0;
	fill: var(--chat-room-color-message);
}

.vac-text-ellipsis {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.vac-image-link-container {
	background-color: var(--chat-message-bg-color-media);
	padding: 8px;
	margin: 4px auto 5px;
	border-radius: 4px;
}

.vac-image-link {
	position: relative;
	background-color: var(--chat-message-bg-color-image) !important;
	background-size: contain;
	background-position: center center !important;
	background-repeat: no-repeat !important;
	height: 150px;
	width: 150px;
	max-width: 100%;
	border-radius: 4px;
	margin: 0 auto;
}
</style>
