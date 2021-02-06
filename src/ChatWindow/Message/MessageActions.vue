<template>
	<div>
		<div
			class="vac-options-container"
			:class="{ 'vac-options-image': isImage && !message.replyMessage }"
			:style="{
				width:
					filteredMessageActions.length && showReactionEmojis ? '70px' : '45px'
			}"
		>
			<transition-group name="vac-slide-left">
				<div
					key="1"
					class="vac-blur-container"
					:class="{
						'vac-options-me': message.sender_id === currentUserId
					}"
					v-if="isMessageActions || isMessageReactions"
				></div>

				<div
					ref="actionIcon"
					key="2"
					class="vac-svg-button vac-message-options"
					v-if="isMessageActions"
					@click="openOptions"
				>
					<slot name="dropdown-icon">
						<svg-icon name="dropdown" param="message" />
					</slot>
				</div>

				<emoji-picker
					key="3"
					class="vac-message-reactions"
					:style="{ right: isMessageActions ? '30px' : '5px' }"
					v-if="isMessageReactions"
					v-click-outside="closeEmoji"
					:emoji-opened="emojiOpened"
					:emoji-reaction="true"
					:room-footer-ref="roomFooterRef"
					:position-right="message.sender_id === currentUserId"
					@add-emoji="sendMessageReaction"
					@open-emoji="openEmoji"
				>
					<template v-slot:emoji-picker-icon>
						<slot name="emoji-picker-reaction-icon"></slot>
					</template>
				</emoji-picker>
			</transition-group>
		</div>

		<transition
			:name="
				message.sender_id === currentUserId
					? 'vac-slide-left'
					: 'vac-slide-right'
			"
			v-if="filteredMessageActions.length"
		>
			<div
				ref="menuOptions"
				v-if="optionsOpened"
				v-click-outside="closeOptions"
				class="vac-menu-options"
				:class="{
					'vac-menu-left': message.sender_id !== currentUserId
				}"
				:style="{ top: `${menuOptionsTop}px` }"
			>
				<div class="vac-menu-list">
					<div v-for="action in filteredMessageActions" :key="action.name">
						<div class="vac-menu-item" @click="messageActionHandler(action)">
							{{ action.title }}
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import vClickOutside from 'v-click-outside'

import SvgIcon from '../../components/SvgIcon'
import EmojiPicker from '../../components/EmojiPicker'

const { isImageFile } = require('../../utils/mediaFile')

export default {
	name: 'message-actions',
	components: { SvgIcon, EmojiPicker },

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		messageActions: { type: Array, required: true },
		roomFooterRef: { type: HTMLDivElement },
		showReactionEmojis: { type: Boolean, required: true },
		hideOptions: { type: Boolean, required: true },
		messageHover: { type: Boolean, required: true },
		hoverMessageId: { type: [String, Number] }
	},

	data() {
		return {
			menuOptionsTop: 0,
			optionsOpened: false,
			optionsClosing: false,
			emojiOpened: false
		}
	},

	watch: {
		emojiOpened(val) {
			this.$emit('update-emoji-opened', val)
			if (val) this.optionsOpened = false
		},
		hideOptions(val) {
			if (val) {
				this.closeEmoji()
				this.closeOptions()
			}
		},
		optionsOpened(val) {
			this.$emit('update-options-opened', val)
		}
	},

	computed: {
		isImage() {
			return isImageFile(this.message.file)
		},
		isMessageActions() {
			return (
				this.filteredMessageActions.length &&
				this.messageHover &&
				!this.message.deleted &&
				!this.message.disable_actions
			)
		},
		isMessageReactions() {
			return (
				this.showReactionEmojis &&
				this.messageHover &&
				!this.message.deleted &&
				!this.message.disable_reactions
			)
		},
		filteredMessageActions() {
			return this.message.sender_id === this.currentUserId
				? this.messageActions
				: this.messageActions.filter(message => !message.onlyMe)
		}
	},

	methods: {
		openOptions() {
			if (this.optionsClosing) return

			this.optionsOpened = !this.optionsOpened
			if (!this.optionsOpened) return

			this.$emit('hide-options', false)

			setTimeout(() => {
				if (
					!this.roomFooterRef ||
					!this.$refs.menuOptions ||
					!this.$refs.actionIcon
				)
					return

				const menuOptionsTop = this.$refs.menuOptions.getBoundingClientRect()
					.height

				const actionIconTop = this.$refs.actionIcon.getBoundingClientRect().top
				const roomFooterTop = this.roomFooterRef.getBoundingClientRect().top

				const optionsTopPosition =
					roomFooterTop - actionIconTop > menuOptionsTop + 50

				if (optionsTopPosition) this.menuOptionsTop = 30
				else this.menuOptionsTop = -menuOptionsTop
			}, 0)
		},
		closeOptions() {
			this.optionsOpened = false
			this.optionsClosing = true
			this.updateMessageHover()
			setTimeout(() => (this.optionsClosing = false), 100)
		},
		openEmoji() {
			this.emojiOpened = !this.emojiOpened
			this.$emit('hide-options', false)
		},
		closeEmoji() {
			this.emojiOpened = false
			this.updateMessageHover()
		},
		updateMessageHover() {
			if (this.hoverMessageId !== this.message._id) {
				this.$emit('update-message-hover', false)
			}
		},
		messageActionHandler(action) {
			this.closeOptions()

			this.$emit('message-action-handler', action)
		},
		sendMessageReaction(emoji, reaction) {
			this.$emit('send-message-reaction', { emoji, reaction })
			this.closeEmoji()
		}
	}
}
</script>

<style lang="scss" scoped>
.vac-options-container {
	position: absolute;
	top: 2px;
	right: 10px;
	height: 40px;
	width: 70px;
	overflow: hidden;
	z-index: 1;
	border-top-right-radius: 8px;
}

.vac-options-image .vac-blur-container {
	background: rgba(255, 255, 255, 0.6);
	border-bottom-left-radius: 15px;
}

.vac-blur-container {
	position: absolute;
	height: 100%;
	width: 100%;
	left: 8px;
	bottom: 10px;
	background: var(--chat-message-bg-color);
	filter: blur(3px);
	border-bottom-left-radius: 8px;
}

.vac-options-me {
	background: var(--chat-message-bg-color-me);
}

.vac-message-options {
	background: var(--chat-icon-bg-dropdown-message);
	border-radius: 50%;
	position: absolute;
	top: 7px;
	right: 7px;

	svg {
		height: 17px;
		width: 17px;
		padding: 5px;
		margin: -5px;
	}
}

.vac-message-reactions {
	position: absolute;
	top: 6px;
	right: 30px;
}

.vac-menu-options {
	right: 15px;
}

.vac-menu-left {
	right: -118px;
}

@media only screen and (max-width: 768px) {
	.vac-options-container {
		right: 3px;
	}

	.vac-menu-left {
		right: -50px;
	}
}
</style>
