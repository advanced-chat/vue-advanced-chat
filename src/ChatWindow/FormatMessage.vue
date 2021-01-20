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
						'vac-text-italic': checkType(message, 'italic') || deleted,
						'vac-text-strike': checkType(message, 'strike'),
						'vac-text-underline': checkType(message, 'underline'),
						'vac-text-inline-code':
							!singleLine && checkType(message, 'inline-code'),
						'vac-text-multiline-code':
							!singleLine && checkType(message, 'multiline-code'),
						'vac-text-tag': checkType(message, 'tag')
					}"
					:href="message.href"
					:target="message.href ? '_blank' : null"
					@click="openTag(message)"
				>
					<slot name="deleted-icon" v-bind="{ deleted }">
						<svg-icon v-if="deleted" name="deleted" class="vac-icon-deleted" />
					</slot>
					{{ message.value }}
				</component>
			</template>
		</div>
		<div v-else>{{ formattedContent }}</div>
	</div>
</template>

<script>
import SvgIcon from './SvgIcon'

import formatString from '../utils/formatString'

export default {
	name: 'format-message',
	components: { SvgIcon },

	props: {
		content: { type: [String, Number], required: true },
		deleted: { type: Boolean, default: false },
		users: { type: Array, default: () => [] },
		linkify: { type: Boolean, default: true },
		singleLine: { type: Boolean, default: false },
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
				// TODO: emit event
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
</style>
