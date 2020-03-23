<template>
	<div>
		<div class="card-date" v-if="showDate">
			{{ message.date }}
		</div>

		<div class="line-new" v-if="newMessage._id === message._id">
			{{ textMessages.NEW_MESSAGES }}
		</div>

		<div
			class="message-box"
			:class="{ 'offset-current': message.sender_id === currentUserId }"
		>
			<div
				class="message-container"
				@mouseover="onHoverMessage(message)"
				@mouseleave="onLeaveMessage"
			>
				<div
					ref="imageRef"
					class="message-card"
					:class="{
						'message-highlight': isMessageHover(message),
						'message-current': message.sender_id === currentUserId,
						'message-deleted': message.deleted
					}"
				>
					<div
						v-if="roomUsers.length > 2 && message.sender_id !== currentUserId"
						class="text-username"
						:class="{
							'username-reply': !message.deleted && message.replyMessage
						}"
					>
						<span>{{ message.username }}</span>
					</div>

					<div
						v-if="!message.deleted && message.replyMessage"
						class="reply-message"
					>
						<div class="reply-username">{{ replyUsername }}</div>

						<div class="image-reply-container" v-if="isImageReply">
							<div
								class="message-image message-image-reply"
								:style="{ background: `url(${message.replyMessage.file.url})` }"
							></div>
						</div>

						<div class="reply-content">{{ message.replyMessage.content }}</div>
					</div>

					<div v-if="message.deleted">
						<span>{{ textMessages.MESSAGE_DELETED }}</span>
					</div>

					<div v-else-if="!message.file">
						<span>{{ message.content }}</span>
					</div>

					<div class="image-container" v-else-if="isImage">
						<loader
							:style="{ top: `${imageResponsive.loaderTop}px` }"
							:show="isImageLoading"
						></loader>
						<div
							class="message-image"
							:class="{
								'image-loading':
									isImageLoading && message.sender_id === currentUserId
							}"
							:style="{
								background: `url(${message.file.url})`,
								'max-height': `${imageResponsive.maxHeight}px`
							}"
						>
							<transition name="fade-image">
								<div class="image-buttons" v-if="imageHover && !isImageLoading">
									<div
										class="svg-button button-view"
										@click.stop="openFile(message.file)"
									>
										<svg-icon name="eye" />
									</div>
									<div
										class="svg-button button-download"
										@click.stop="openFile(message.file)"
									>
										<svg-icon name="document" />
									</div>
								</div>
							</transition>
						</div>
						<span>{{ message.content }}</span>
					</div>

					<div v-else class="file-message">
						<div
							class="svg-button icon-file"
							@click.stop="openFile(message.file)"
						>
							<svg-icon name="document" />
						</div>
						<span>{{ message.content }}</span>
					</div>

					<div class="text-timestamp">
						<div class="icon-edited" v-if="message.edited && !message.deleted">
							<svg-icon name="pencil" />
						</div>
						<span>{{ message.timestamp }}</span>
						<span v-if="isMessageSeen">
							<svg-icon name="checkmark" class="icon-check" />
						</span>
					</div>

					<transition name="slide-left">
						<div
							ref="actionIcon"
							class="svg-button message-options"
							v-if="isMessageActions"
							@click="openOptions"
						>
							<svg-icon name="dropdown" />
						</div>
					</transition>

					<transition name="fade-image">
						<emoji-picker
							class="message-reactions"
							v-if="isMessageReactions"
							v-click-outside="closeEmoji"
							:emojiOpened="emojiOpened"
							:emojiReaction="true"
							:roomFooterRef="roomFooterRef"
							:positionRight="message.sender_id === currentUserId"
							@addEmoji="sendMessageReaction"
							@openEmoji="openEmoji"
						></emoji-picker>
					</transition>

					<transition
						:name="
							message.sender_id === currentUserId ? 'slide-left' : 'slide-right'
						"
						v-if="filteredMessageActions.length"
					>
						<div
							ref="menuOptions"
							v-if="optionsOpened"
							v-click-outside="closeOptions"
							class="menu-options"
							:class="{ 'menu-left': message.sender_id !== currentUserId }"
							:style="{ top: `${menuOptionsHeight}px` }"
						>
							<div class="menu-list">
								<div
									v-for="action in filteredMessageActions"
									:key="action.name"
								>
									<div class="menu-item" @click="messageActionHandler(action)">
										{{ action.title }}
									</div>
								</div>
							</div>
						</div>
					</transition>
				</div>

				<transition-group name="slide-left" v-if="!message.deleted">
					<button
						v-for="(reaction, key) in message.reactions"
						v-show="reaction.length"
						:key="key + 0"
						class="button-reaction"
						:class="{
							'reaction-me': reaction.indexOf(currentUserId) !== -1
						}"
						:style="{
							float: message.sender_id === currentUserId ? 'right' : 'left'
						}"
						@click="sendMessageReaction({ name: key }, reaction)"
					>
						{{ getEmojiByName(key) }}<span>{{ reaction.length }}</span>
					</button>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
import SvgIcon from './SvgIcon'
import vClickOutside from 'v-click-outside'
import Loader from './Loader'
import EmojiPicker from './EmojiPicker'

export default {
	name: 'message',
	components: { SvgIcon, Loader, EmojiPicker },

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		index: { type: Number, required: true },
		message: { type: Object, required: true },
		messages: { type: Array, required: true },
		editedMessage: { type: Object, required: true },
		roomUsers: { type: Array, default: () => [] },
		messageActions: { type: Array, required: true },
		roomFooterRef: { type: HTMLDivElement },
		newMessages: { type: Array },
		showReactionEmojis: { type: Boolean, required: true },
		emojisList: { type: Object, required: true },
		hideOptions: { type: Boolean, required: true }
	},

	data() {
		return {
			hoverMessageId: null,
			imageLoading: false,
			imageHover: false,
			messageHover: false,
			optionsOpened: false,
			menuOptionsHeight: 0,
			messageReaction: '',
			newMessage: {},
			emojiOpened: false,
			imageResponsive: ''
		}
	},

	watch: {
		message: {
			immediate: true,
			handler() {
				this.checkImgLoad()
			}
		},
		newMessages(val) {
			if (!val.length) return
			this.newMessage = val.reduce((res, obj) =>
				obj.index < res.index ? obj : res
			)
		},
		emojiOpened(val) {
			if (val) this.optionsOpened = false
		},
		hideOptions(val) {
			if (val) {
				this.closeEmoji()
				this.closeOptions()
			}
		}
	},

	mounted() {
		if (!this.message.seen && this.message.sender_id !== this.currentUserId) {
			this.$emit('addNewMessage', {
				_id: this.message._id,
				index: this.index
			})
		}
		this.imageResponsive = {
			maxHeight: this.$refs.imageRef.clientWidth - 18,
			loaderTop: this.$refs.imageRef.clientWidth / 2
		}
	},

	computed: {
		showDate() {
			return (
				this.index > 0 &&
				this.message.date !== this.messages[this.index - 1].date
			)
		},
		isImage() {
			return this.checkImageFile()
		},
		isImageReply() {
			return this.checkImageReplyFile()
		},
		isImageLoading() {
			return (
				this.message.file.url.indexOf('blob:http') !== -1 || this.imageLoading
			)
		},
		isEditable() {
			return this.canEditMessage()
		},
		isMessageSeen() {
			return (
				this.message.sender_id === this.currentUserId &&
				this.message.seen &&
				!this.message.deleted
			)
		},
		replyUsername() {
			const { sender_id } = this.message.replyMessage
			const replyUser = this.roomUsers.find(user => user._id === sender_id)
			return replyUser ? replyUser.username : ''
		},
		isMessageActions() {
			return (
				this.filteredMessageActions.length &&
				this.messageHover &&
				!this.message.deleted
			)
		},
		isMessageReactions() {
			return (
				this.showReactionEmojis && this.messageHover && !this.message.deleted
			)
		},
		filteredMessageActions() {
			return this.message.sender_id === this.currentUserId
				? this.messageActions
				: this.messageActions.filter(message => !message.onlyMe)
		}
	},

	methods: {
		isMessageHover() {
			return (
				this.editedMessage._id === this.message._id ||
				this.hoverMessageId === this.message._id
			)
		},
		onHoverMessage() {
			this.imageHover = true
			this.messageHover = true
			if (this.canEditMessage()) this.hoverMessageId = this.message._id
		},
		canEditMessage() {
			return (
				this.message.sender_id === this.currentUserId && !this.message.deleted
			)
		},
		onLeaveMessage() {
			this.imageHover = false
			if (!this.optionsOpened && !this.emojiOpened) this.messageHover = false
			this.hoverMessageId = null
		},
		openFile() {
			this.$emit('openFile', this.message)
		},
		messageActionHandler(action) {
			this.closeOptions()
			setTimeout(() => {
				this.$emit('messageActionHandler', { action, message: this.message })
			}, 300)
		},
		checkImageFile() {
			return this.checkImageType(this.message.file)
		},
		checkImageReplyFile() {
			return this.checkImageType(this.message.replyMessage.file)
		},
		checkImageType(file) {
			if (!file) return
			const imageTypes = ['png', 'jpg']
			const { type } = file
			return imageTypes.some(t => type.includes(t))
		},
		checkImgLoad() {
			if (!this.checkImageFile()) return
			this.imageLoading = true
			const image = new Image()
			image.src = this.message.file.url
			image.addEventListener('load', () => (this.imageLoading = false))
		},
		openOptions() {
			this.optionsOpened = !this.optionsOpened

			if (!this.optionsOpened) return

			this.$emit('hideOptions', false)

			setTimeout(() => {
				if (
					!this.roomFooterRef ||
					!this.$refs.menuOptions ||
					!this.$refs.actionIcon
				)
					return

				const menuOptionsHeight = this.$refs.menuOptions.getBoundingClientRect()
					.height

				const actionIconTop = this.$refs.actionIcon.getBoundingClientRect().top
				const roomFooterTop = this.roomFooterRef.getBoundingClientRect().top

				const optionsTopPosition =
					roomFooterTop - actionIconTop > menuOptionsHeight + 50

				if (optionsTopPosition) this.menuOptionsHeight = 28
				else this.menuOptionsHeight = -menuOptionsHeight
			}, 0)
		},
		closeOptions() {
			this.optionsOpened = false
			if (this.hoverMessageId !== this.message._id) this.messageHover = false
		},
		openEmoji(ev) {
			this.emojiOpened = ev
			this.$emit('hideOptions', false)
		},
		closeEmoji() {
			this.emojiOpened = false
			if (this.hoverMessageId !== this.message._id) this.messageHover = false
		},
		getEmojiByName(emojiName) {
			return this.emojisList[emojiName]
		},
		sendMessageReaction(emoji, reaction) {
			this.$emit('sendMessageReaction', {
				messageId: this.message._id,
				reaction: emoji,
				remove: reaction && reaction.indexOf(this.currentUserId) !== -1
			})
			this.closeEmoji()
			this.messageHover = false
		}
	}
}
</script>

<style lang="scss" scoped>
.card-date {
	border-radius: 4px;
	max-width: 150px;
	text-align: center;
	margin: 10px auto;
	font-size: 12px;
	text-transform: uppercase;
	padding: 4px;
	color: var(--chat-message-color-date);
	background: var(--chat-message-bg-color-date);
	display: block;
	overflow-wrap: break-word;
	position: relative;
	white-space: normal;
	box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 1px 2px 0 rgba(0, 0, 0, 0.12);
}

.line-new {
	color: var(--chat-message-color-new-messages);
	position: relative;
	text-align: center;
	font-size: 13px;
}

.line-new:after,
.line-new:before {
	border-top: 1px solid var(--chat-message-color-new-messages);
	content: '';
	left: 0;
	position: absolute;
	top: 50%;
	width: calc(50% - 60px);
}

.line-new:before {
	left: auto;
	right: 0;
}

.message-box {
	display: flex;
	flex: 0 0 50%;
	max-width: 50%;
	justify-content: flex-start;
	line-height: 1.4;
}

.message-container {
	position: relative;
	padding: 3px 10px;
	align-items: end;
	min-width: 100px;
	box-sizing: content-box;
}

.offset-current {
	margin-left: 50%;
	justify-content: flex-end;
}

.message-card {
	background: var(--chat-message-bg-color);
	color: var(--chat-message-color);
	border-radius: 8px;
	font-size: 14px;
	padding: 6px 9px 3px;
	white-space: pre-wrap;
	max-width: 100%;
	-webkit-transition-property: box-shadow, opacity;
	transition-property: box-shadow, opacity;
	transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
	will-change: box-shadow;
	box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 1px 2px 0 rgba(0, 0, 0, 0.12);
}

.message-highlight {
	box-shadow: 0px 2px 2px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 4px 0px rgba(0, 0, 0, 0.12);
}

.message-current {
	background: var(--chat-message-bg-color-me) !important;
}

.message-deleted {
	color: var(--chat-message-color-deleted) !important;
	font-size: 13px !important;
	font-style: italic !important;
	background: var(--chat-message-bg-color-deleted) !important;
}

.image-container {
	width: 250px;
	max-width: 100%;
}

.image-reply-container {
	width: 70px;
}

.message-image {
	position: relative;
	background-color: var(--chat-message-bg-color-image) !important;
	background-size: cover !important;
	background-position: center center !important;
	background-repeat: no-repeat !important;
	height: 250px;
	width: 250px;
	max-width: 100%;
	border-radius: 4px;
	margin: 4px auto 5px;
	transition: 0.4s filter linear;
}

.message-image-reply {
	height: 70px;
	width: 70px;
	margin: 4px auto 3px;
}

.image-loading {
	filter: blur(3px);
}

.reply-message {
	background: var(--chat-message-bg-color-reply);
	border-radius: 4px;
	margin: -1px -5px 8px;
	padding: 8px 10px;

	.reply-username {
		color: var(--chat-message-color-reply-username);
		font-size: 12px;
		line-height: 15px;
		margin-bottom: 2px;
	}

	.reply-content {
		font-size: 12px;
		color: var(--chat-message-color-reply-content);
	}
}

.text-username {
	font-size: 13px;
	color: var(--chat-message-color-username);
	margin-bottom: 2px;
}

.username-reply {
	margin-bottom: 5px;
}

.text-timestamp {
	font-size: 10px;
	color: var(--chat-message-color-timestamp);
	text-align: right;
}

.file-message {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin-top: 3px;

	.icon-file svg {
		margin-right: 5px;
	}
}

.icon-edited {
	-webkit-box-align: center;
	align-items: center;
	display: -webkit-inline-box;
	display: inline-flex;
	justify-content: center;
	letter-spacing: normal;
	line-height: 1;
	text-indent: 0;
	vertical-align: middle;
	margin: 0 4px 2px;

	svg {
		height: 12px;
		width: 12px;
	}
}

.image-buttons {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 4px;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0) 55%,
		rgba(0, 0, 0, 0.02) 60%,
		rgba(0, 0, 0, 0.05) 65%,
		rgba(0, 0, 0, 0.1) 70%,
		rgba(0, 0, 0, 0.2) 75%,
		rgba(0, 0, 0, 0.3) 80%,
		rgba(0, 0, 0, 0.5) 85%,
		rgba(0, 0, 0, 0.6) 90%,
		rgba(0, 0, 0, 0.7) 95%,
		rgba(0, 0, 0, 0.8) 100%
	);

	svg {
		height: 26px;
		width: 26px;
	}

	.button-view,
	.button-download {
		position: absolute;
		bottom: 6px;
		left: 7px;
	}

	:first-child {
		left: 40px;
	}

	.button-view {
		max-width: 18px;
		bottom: 8px;
	}
}

.message-options {
	background: rgba(0, 0, 0, 0.25);
	border-radius: 50%;
	position: absolute;
	top: 7px;
	right: 14px;

	svg {
		height: 17px;
		width: 17px;
	}
}

.message-reactions {
	z-index: 9999;
	position: absolute;
	top: 6px;
	right: 37px;
}

.menu-options {
	right: 15px;
}

.menu-left {
	right: -118px;
}

.icon-check {
	height: 14px;
	width: 14px;
	vertical-align: middle;
	margin: -3px -3px 0 3px;
}

.button-reaction {
	display: inline-flex;
	align-items: center;
	border: var(--chat-message-border-style-reaction);
	outline: none;
	background: var(--chat-message-bg-color-reaction);
	border-radius: 4px;
	margin: 4px 2px 0;
	transition: 0.3s;
	padding: 0 5px;
	font-size: 18px;
	line-height: 23px;

	span {
		font-size: 11px;
		font-weight: 500;
		min-width: 7px;
		color: var(--chat-message-color-reaction-counter);
	}

	&:hover {
		border: var(--chat-message-border-style-reaction-hover);
		background: var(--chat-message-bg-color-reaction-hover);
		cursor: pointer;
	}
}

.reaction-me {
	border: var(--chat-message-border-style-reaction-me);
	background: var(--chat-message-bg-color-reaction-me);

	span {
		color: var(--chat-message-color-reaction-counter-me);
	}

	&:hover {
		border: var(--chat-message-border-style-reaction-hover-me);
		background: var(--chat-message-bg-color-reaction-hover-me);
	}
}
</style>
