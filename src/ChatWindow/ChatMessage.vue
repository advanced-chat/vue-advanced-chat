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
			:class="{
				'offset-current': message.sender_id === 'me'
			}"
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
							<transition name="fade">
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
							class="svg-button message-options"
							v-if="messageActions.length && messageReply && !message.deleted"
							@click="optionsOpened = !optionsOpened"
						>
							<svg-icon name="dropdown" />
						</div>
					</transition>

					<transition
						:name="message.sender_id === 'me' ? 'slide-left' : 'slide-right'"
						v-if="messageActions.length"
					>
						<div
							v-if="optionsOpened"
							v-click-outside="closeOptions"
							class="menu-options"
							:class="{ 'menu-left': message.sender_id !== 'me' }"
						>
							<div class="menu-list">
								<div v-for="action in messageActions" :key="action.name">
									<div class="menu-item" @click="messageActionHandler(action)">
										{{ action.title }}
									</div>
									<hr class="menu-divider" />
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
		messageActions: { type: Array, required: true }
	},

	data() {
		return {
			hoverMessageId: null,
			imageLoading: false,
			imageHover: false,
			messageReply: false,
			optionsOpened: false
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
			this.messageReply = false
			this.hoverMessageId = null
		},
		openFile() {
			this.$emit('openFile', this.message)
		},
		messageActionHandler(action) {
			this.closeOptions()
			this.$emit('messageActionHandler', { action, message: this.message })
		},
		closeOptions() {
			this.optionsOpened = false
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
	color: var(--chat-color-message-date);
	background: var(--chat-bg-color-message-date);
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
	background: var(--chat-bg-color-message);
	color: var(--chat-color-message-text);
	border-radius: 4px;
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
	background: var(--chat-bg-color-message-me) !important;
}

.message-deleted {
	color: var(--chat-color-message-deleted) !important;
	font-size: 13px !important;
	font-style: italic !important;
	background: var(--chat-bg-color-message-deleted) !important;
}

.image-container {
	padding-bottom: 2px;
	width: 250px;
}

.message-image {
	position: relative;
	background-color: #ddd !important;
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
	background: var(--chat-bg-color-message-reply);
	border-radius: 4px;
	margin: -1px -5px 8px;

	.reply-username {
		padding: 5px 5px 0 5px;
		color: var(--chat-color-message-reply-username);
		font-size: 13px;
		line-height: 15px;
		margin-bottom: 2px;
	}

	.reply-content {
		padding: 0 5px 5px 5px;
		color: var(--chat-color-message-reply-content);
	}
}

.text-username {
	font-size: 13px;
	color: var(--chat-color-message-username);
	line-height: 15px;
	margin-bottom: 2px;
}

.text-timestamp {
	font-size: 10px;
	color: var(--chat-color-message-timestamp);
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
	position: absolute;
	top: 5px;
	right: 10px;
}

.menu-options {
	position: absolute;
	right: 15px;
	top: 28px;
	z-index: 9999;
	min-width: 150px;
	display: inline-block;
	border-radius: 4px;
	max-width: 80%;
	font-size: 15px;
	overflow-y: auto;
	overflow-x: hidden;
	contain: content;
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
		0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.menu-left {
	right: -118px;
}

.menu-list {
	border-radius: 4px;
	display: block;
	cursor: pointer;
	background: var(--chat-bg-menu);

	:hover {
		background: var(--chat-bg-menu-hover);
		-webkit-transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}

	:not(:hover) {
		-webkit-transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}
}

.menu-item {
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-flex: 1;
	-ms-flex: 1 1 100%;
	flex: 1 1 100%;
	min-height: 30px;
	padding: 8px 16px;
	position: relative;
}

.menu-divider {
	display: block;
	-webkit-box-flex: 1;
	-ms-flex: 1 1 0px;
	flex: 1 1 0px;
	max-width: 100%;
	height: 0;
	max-height: 0;
	border: solid;
	border-width: thin 0 0 0;
	border-color: rgba(0, 0, 0, 0.12);
	margin: 0;
}

.fade-enter {
	opacity: 0;
}

.fade-enter-active {
	transition: opacity 1s;
}

.fade-leave-active {
	transition: opacity 0.5s;
	opacity: 0;
}

.icon-check {
	height: 14px;
	width: 14px;
	vertical-align: middle;
	margin: -3px 0 0 3px;
}

.slide-left-enter-active,
.slide-right-enter-active {
	transition: all 0.3s ease;
}

.slide-left-leave-active,
.slide-right-leave-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-left-enter,
.slide-left-leave-to {
	transform: translateX(10px);
	opacity: 0;
}

.slide-right-enter,
.slide-right-leave-to {
	transform: translateX(-10px);
	opacity: 0;
}
</style>
