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
				:class="{
					'message-cursor': isEditable
				}"
				@click="onClickMessage(message)"
				@mouseover="onHoverMessage(message)"
				@mouseleave="onLeaveMessage"
			>
				<div
					class="message-card"
					:class="{
						'message-highlight': isMessageHover(message),
						'message-current': message.sender_id === 'me',
						'message-deleted': message.deleted,
						'slide-up':
							openMessageId.id === message._id && openMessageId.toggle,
						'slide-down':
							openMessageId.id === message._id && !openMessageId.toggle
					}"
				>
					<div
						v-if="roomUsers.length > 2 && message.sender_id !== 'me'"
						class="text-username"
					>
						<span>{{ message.username }}</span>
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
						></div>
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
							<svg-icon name="pencil" param="edited" />
						</div>
						<span>{{ message.timestamp }}</span>
						<span v-if="isMessageSeen">
							<svg-icon name="checkmark" class="icon-check" />
						</span>
					</div>
				</div>
				<div class="action-buttons" v-if="isEditable">
					<div class="svg-button button-delete" @click.stop="deleteMessage">
						<svg-icon name="trash" />
					</div>
					<div class="svg-button button-edit" @click.stop="editMessage">
						<svg-icon name="pencil" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SvgIcon from './SvgIcon'
import ChatLoader from './ChatLoader'

export default {
	components: { SvgIcon, ChatLoader },

	props: {
		index: { type: Number, required: true },
		message: { type: Object, required: true },
		messages: { type: Array, required: true },
		editedMessage: { type: Object, required: true },
		roomUsers: { type: Array, default: () => [] },
		textMessages: { type: Object, required: true }
	},

	data() {
		return {
			openMessageId: {},
			hoverMessageId: null,
			imageLoading: false,
			imageHover: false
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
		}
	},

	methods: {
		isMessageHover() {
			return (
				this.editedMessage._id === this.message._id ||
				this.hoverMessageId === this.message._id ||
				(this.openMessageId.id === this.message._id &&
					this.openMessageId.toggle)
			)
		},
		onClickMessage() {
			if (this.canEditMessage()) {
				this.openMessageId = {
					id: this.message._id,
					toggle: !this.openMessageId.toggle
				}
			}
		},
		onHoverMessage() {
			this.imageHover = true
			if (this.canEditMessage()) this.hoverMessageId = this.message._id
		},
		canEditMessage() {
			return this.message.sender_id === 'me' && !this.message.deleted
		},
		onLeaveMessage() {
			this.imageHover = false
			this.openMessageId.toggle = false
			this.hoverMessageId = null
		},
		editMessage() {
			this.$emit('editMessage', this.message)
		},
		deleteMessage() {
			this.$emit('deleteMessage', this.message)
			this.onLeaveMessage()
		},
		openFile() {
			this.$emit('openFile', this.message)
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
	background: var(--chat-color-message-date-bg);
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
	font-weight: 300;
	line-height: 1.4;
}

.message-cursor {
	cursor: pointer;
}

.message-container {
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
	position: relative;
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

	&.slide-up {
		animation: slide-up 0.3s ease-out forwards;
	}

	&.slide-down {
		animation: slide-down 0.3s ease-out forwards;
	}
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

@keyframes slide-up {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-35px);
	}
}

@keyframes slide-down {
	from {
		transform: translateX(-35px);
	}
	to {
		transform: translateX(0);
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
	font-weight: 300;
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

.action-buttons {
	position: relative;

	svg {
		height: 18px;
		width: 18px;
	}

	.button-delete,
	.button-edit {
		right: 5px;
		position: absolute;
	}

	.button-delete {
		bottom: 24px;
	}

	.button-edit {
		bottom: 2px;
	}
}

.image-buttons {
	svg {
		height: 20px;
		width: 20px;
	}

	.button-view,
	.button-download {
		position: absolute;
		bottom: 2px;
		left: 5px;
	}

	:first-child {
		left: 30px;
	}

	.button-view {
		max-width: 18px;
		bottom: 4px;

		svg {
			height: 18px;
			width: 18px;
		}
	}
}

.fade-enter {
	opacity: 0;
}

.fade-enter-active {
	transition: opacity 1.5s;
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
</style>
