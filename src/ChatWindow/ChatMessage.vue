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
						'message-highlight': setMessageElevation(message),
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
						{{ message.username }}
					</div>

					<div v-if="message.deleted">
						{{ textMessages.MESSAGE_DELETED }}
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
						<span>{{ message.content }}</span>
					</div>

					<div v-else :class="{ 'file-message': message.file && !isImage }">
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
			imageLoading: false
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
		setMessageElevation() {
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
			if (this.canEditMessage()) this.hoverMessageId = this.message._id
		},
		canEditMessage() {
			return this.message.sender_id === 'me' && !this.message.deleted
		},
		onLeaveMessage() {
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
		openFile({ url }) {
			window.open(url, '_blank')
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
	color: #505a62;
	background: rgba(33, 148, 243, 0.15);
	display: block;
	overflow-wrap: break-word;
	position: relative;
	white-space: normal;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.message-box {
	display: flex;
	flex: 0 0 50%;
	max-width: 50%;
	justify-content: flex-start;
}

.message-cursor {
	cursor: pointer;
}

.message-container {
	padding: 8px 10px;
	align-items: end;
	min-width: 100px;
}

.offset-current {
	margin-left: 50%;
	justify-content: flex-end;
}

.message-card {
	background: #fff;
	color: var(--chat-color-dark);
	border-radius: 4px;
	font-size: 14px;
	padding: 8px 8px 3px;
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
	box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.message-highlight {
	box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
		0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
}

.message-current {
	background: #ccf2cf !important;

	&.slide-up {
		animation: slide-up 0.3s ease-out forwards;
	}

	&.slide-down {
		animation: slide-down 0.3s ease-out forwards;
	}
}

.message-deleted {
	color: #757e85 !important;
	font-size: 13px !important;
	font-style: italic !important;
	background: #dadfe2 !important;
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
	margin-bottom: 5px;
	border-radius: 4px;
	margin: 0 auto 5px;
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
	color: #9ca6af;
	margin-bottom: 2px;
}

.text-timestamp {
	font-size: 10px;
	font-weight: 300;
	color: #828c94;
	text-align: right;
}

.file-message {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}

.icon-file svg {
	margin-right: 5px;
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
	margin: 0 5px 2px;

	svg {
		height: 13px;
		width: 13px;
	}
}

.action-buttons {
	position: relative;

	.button-delete,
	.button-edit {
		max-width: 18px;
		right: 5px;
		z-index: 0;
		position: absolute;
		width: 100%;
	}

	.button-delete {
		bottom: 26px;
	}

	.button-edit {
		bottom: 2px;
	}

	svg {
		height: 18px;
		width: 18px;
	}
}

.icon-check {
	height: 14px;
	width: 14px;
	vertical-align: middle;
	margin: -3px 0 0 3px;
}
</style>
