<template>
	<div>
		<div
			class="card-date"
			v-if="index > 0 && message.date !== messages[index - 1].date"
		>
			{{ message.date }}
		</div>
		<div
			class="message-box"
			:class="{ 'offset-current': message.sender_id === 'me' }"
		>
			<div
				class="message-container"
				@mouseover="onHoverMessage(message)"
				@mouseleave="onLeaveMessage"
			>
				<div
					class="message-card"
					:class="{
						'message-highlight': isMessageHover(message),
						'message-current': message.sender_id === 'me',
						'message-deleted': message.deleted
					}"
				>
					<div
						v-if="roomUsers.length > 2 && message.sender_id !== 'me'"
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
						<div class="reply-content">{{ message.replyMessage.content }}</div>
					</div>

					<div v-if="message.deleted">
						<span>{{ textMessages.MESSAGE_DELETED }}</span>
					</div>

					<div v-else-if="!message.file">
						<span>{{ message.content }}</span>
					</div>

					<div class="image-container" v-else-if="isImage">
						<chat-loader :show="isImageLoading"></chat-loader>
						<div
							class="message-image"
							:class="{
								'image-loading': isImageLoading && message.sender_id === 'me'
							}"
							:style="{ background: `url(${message.file.url})` }"
						>
							<transition name="fade-image">
								<div class="image-buttons" v-if="imageHover">
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

					<transition
						:name="message.sender_id === 'me' ? 'slide-left' : 'slide-right'"
						v-if="messageActions.length"
					>
						<div
							ref="menuOptions"
							v-if="optionsOpened"
							v-click-outside="closeOptions"
							class="menu-options"
							:class="{ 'menu-left': message.sender_id !== 'me' }"
							:style="{ top: `${menuOptionsHeight}px` }"
						>
							<div class="menu-list">
								<div v-for="action in messageActions" :key="action.name">
									<div class="menu-item" @click="messageActionHandler(action)">
										{{ action.title }}
									</div>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SvgIcon from './SvgIcon'
import vClickOutside from 'v-click-outside'
import ChatLoader from './ChatLoader'

export default {
	name: 'chat-message',
	components: { SvgIcon, ChatLoader },

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		index: { type: Number, required: true },
		message: { type: Object, required: true },
		messages: { type: Array, required: true },
		editedMessage: { type: Object, required: true },
		roomUsers: { type: Array, default: () => [] },
		textMessages: { type: Object, required: true },
		messageActions: { type: Array, required: true },
		roomFooterRef: { type: HTMLDivElement }
	},

	data() {
		return {
			hoverMessageId: null,
			imageLoading: false,
			imageHover: false,
			messageReply: false,
			optionsOpened: false,
			menuOptionsHeight: 0
		}
	},

	watch: {
		message: {
			immediate: true,
			handler() {
				this.checkImgLoad()
			}
		}
	},

	computed: {
		isImage() {
			return this.checkImageFile()
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
				this.message.sender_id === 'me' &&
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
				this.messageActions.length && this.messageReply && !this.message.deleted
			)
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
			this.messageReply = true
			if (this.canEditMessage()) this.hoverMessageId = this.message._id
		},
		canEditMessage() {
			return this.message.sender_id === 'me' && !this.message.deleted
		},
		onLeaveMessage() {
			this.imageHover = false
			if (!this.optionsOpened) this.messageReply = false
			this.hoverMessageId = null
		},
		openFile() {
			this.$emit('openFile', this.message)
		},
		messageActionHandler(action) {
			this.closeOptions()
			this.$emit('messageActionHandler', { action, message: this.message })
		},
		checkImageFile() {
			if (!this.message.file) return
			const imageTypes = ['png', 'jpg']
			const { type } = this.message.file
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

			setTimeout(() => {
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
			if (this.hoverMessageId !== this.message._id) this.messageReply = false
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
	z-index: 1;
	display: block;
	max-width: 100%;
	-webkit-transition-property: box-shadow, opacity;
	transition-property: box-shadow, opacity;
	overflow-wrap: break-word;
	-webkit-transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
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
	padding-bottom: 2px;
	width: 250px;
}

.message-image {
	position: relative;
	background-color: var(--chat-message-bg-color-image) !important;
	background-size: cover !important;
	background-position: center center !important;
	background-repeat: no-repeat !important;
	height: 250px;
	width: 250px;
	border-radius: 4px;
	margin: 4px auto 5px;
	transition: 0.4s filter linear;
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
	margin: -3px 0 0 3px;
}
</style>
