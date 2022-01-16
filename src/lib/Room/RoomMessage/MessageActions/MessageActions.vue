<template>
	<div class="vac-message-actions-wrapper">
		<div
			class="vac-options-container"
			:style="{
				display: hoverAudioProgress ? 'none' : 'initial',
				width:
					filteredMessageActions.length && showReactionEmojis ? '70px' : '45px'
			}"
		>
			<transition-group name="vac-slide-left" tag="span">
				<div
					v-if="isMessageActions || isMessageReactions"
					key="1"
					class="vac-blur-container"
					:class="{
						'vac-options-me': message.senderId === currentUserId
					}"
				/>

				<div
					v-if="isMessageActions"
					ref="actionIcon"
					key="2"
					class="vac-svg-button vac-message-options"
					@click="openOptions"
				>
					<slot name="dropdown-icon">
						<svg-icon name="dropdown" param="message" />
					</slot>
				</div>

				<emoji-picker-container
					v-if="isMessageReactions"
					key="3"
					v-click-outside="closeEmoji"
					class="vac-message-emojis"
					:style="{ right: isMessageActions ? '30px' : '5px' }"
					:emoji-opened="emojiOpened"
					:emoji-reaction="true"
					:position-right="message.senderId === currentUserId"
					@add-emoji="sendMessageReaction"
					@open-emoji="openEmoji"
				>
					<template #emoji-picker-icon>
						<slot name="emoji-picker-reaction-icon" />
					</template>
				</emoji-picker-container>
			</transition-group>
		</div>

		<transition
			v-if="filteredMessageActions.length"
			:name="
				message.senderId === currentUserId
					? 'vac-slide-left'
					: 'vac-slide-right'
			"
		>
			<div
				v-if="optionsOpened"
				ref="menuOptions"
				v-click-outside="closeOptions"
				class="vac-menu-options"
				:class="{
					'vac-menu-left': message.senderId !== currentUserId
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

import SvgIcon from '../../../../components/SvgIcon/SvgIcon'
import EmojiPickerContainer from '../../../../components/EmojiPickerContainer/EmojiPickerContainer'

export default {
	name: 'MessageActions',
	components: { SvgIcon, EmojiPickerContainer },

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		messageActions: { type: Array, required: true },
		showReactionEmojis: { type: Boolean, required: true },
		messageHover: { type: Boolean, required: true },
		hoverMessageId: { type: [String, Number], default: null },
		hoverAudioProgress: { type: Boolean, required: true }
	},

	emits: [
		'update-emoji-opened',
		'update-options-opened',
		'update-message-hover',
		'message-action-handler',
		'send-message-reaction'
	],

	data() {
		return {
			menuOptionsTop: 0,
			optionsOpened: false,
			optionsClosing: false,
			emojiOpened: false
		}
	},

	computed: {
		isMessageActions() {
			return (
				this.filteredMessageActions.length &&
				this.messageHover &&
				!this.message.deleted &&
				!this.message.disableActions &&
				!this.hoverAudioProgress
			)
		},
		isMessageReactions() {
			return (
				this.showReactionEmojis &&
				this.messageHover &&
				!this.message.deleted &&
				!this.message.disableReactions &&
				!this.hoverAudioProgress
			)
		},
		filteredMessageActions() {
			return this.message.senderId === this.currentUserId
				? this.messageActions
				: this.messageActions.filter(message => !message.onlyMe)
		}
	},

	watch: {
		emojiOpened(val) {
			this.$emit('update-emoji-opened', val)
			if (val) this.optionsOpened = false
		},
		optionsOpened(val) {
			this.$emit('update-options-opened', val)
		}
	},

	methods: {
		openOptions() {
			if (this.optionsClosing) return

			this.optionsOpened = !this.optionsOpened
			if (!this.optionsOpened) return

			setTimeout(() => {
				const roomFooterRef = document.getElementById('room-footer')

				if (
					!roomFooterRef ||
					!this.$refs.menuOptions ||
					!this.$refs.actionIcon
				) {
					return
				}

				const menuOptionsTop =
					this.$refs.menuOptions.getBoundingClientRect().height

				const actionIconTop = this.$refs.actionIcon.getBoundingClientRect().top
				const roomFooterTop = roomFooterRef.getBoundingClientRect().top

				const optionsTopPosition =
					roomFooterTop - actionIconTop > menuOptionsTop + 50

				if (optionsTopPosition) this.menuOptionsTop = 30
				else this.menuOptionsTop = -menuOptionsTop
			})
		},
		closeOptions() {
			this.optionsOpened = false
			this.optionsClosing = true
			this.updateMessageHover()
			setTimeout(() => (this.optionsClosing = false), 100)
		},
		openEmoji() {
			this.emojiOpened = !this.emojiOpened
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
