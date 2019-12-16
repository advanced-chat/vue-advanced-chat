<template>
	<div class="col-messages">
		<div class="room-header app-border-b">
			<div
				v-if="room.avatar"
				class="room-avatar"
				:style="{ background: `url(${room.avatar})` }"
			></div>
			<div class="room-name">{{ room.roomName }}</div>
			<div
				class="svg-button room-options"
				v-if="menuActions.length"
				@click="menuOpened = !menuOpened"
			>
				<svg-icon name="menu" />
			</div>
			<transition name="slide-left" v-if="menuActions.length">
				<div v-if="menuOpened" v-click-outside="closeMenu" class="menu-options">
					<div class="menu-list">
						<div v-for="action in menuActions" :key="action.name">
							<div class="menu-item" @click="menuActionHandler(action)">
								{{ action.title }}
							</div>
							<hr class="menu-divider" />
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div class="container-scroll">
			<div class="messages-container">
				<chat-loader :show="loadingMessages"></chat-loader>
				<transition name="fade-message">
					<div class="text-started" v-if="showNoMessages">
						{{ textMessages.MESSAGES_EMPTY }}
					</div>
					<div class="text-started" v-if="showMessagesStarted">
						{{ textMessages.CONVERSATION_STARTED }} {{ messages[0].date }}
					</div>
				</transition>
				<transition name="fade-message">
					<infinite-loading
						v-if="messages.length"
						spinner="spiral"
						direction="top"
						@infinite="loadMoreMessages"
					>
						<div slot="no-results"></div>
						<div slot="no-more"></div>
					</infinite-loading>
				</transition>
				<transition-group name="fade-message">
					<div v-for="(message, i) in messages" :key="message._id">
						<chat-message
							:message="message"
							:index="i"
							:messages="messages"
							:editedMessage="editedMessage"
							:messageActions="messageActions"
							:roomUsers="room.users"
							:textMessages="textMessages"
							:roomFooterRef="$refs.roomFooter"
							@messageActionHandler="messageActionHandler"
							@openFile="openFile"
						></chat-message>
					</div>
				</transition-group>
			</div>
			<transition name="bounce">
				<div class="icon-scroll" v-if="scrollIcon" @click="scrollToBottom">
					<svg-icon name="dropdown" param="scroll" />
				</div>
			</transition>
		</div>
		<div ref="roomFooter" class="room-footer">
			<transition name="slide-up">
				<div v-if="messageReply" class="reply-container">
					<img
						v-if="isImageCheck(messageReply.file)"
						:src="messageReply.file.url"
						class="image-reply"
					/>

					<div class="message-reply">{{ messageReply.content }}</div>

					<div class="icon-reply">
						<div class="svg-button" @click="resetMessage">
							<svg-icon name="close-outline" />
						</div>
					</div>
				</div>
			</transition>

			<div class="box-footer">
				<div v-if="imageFile">
					<div class="svg-button icon-image" @click="resetImageFile">
						<svg-icon name="close" param="image" />
					</div>
					<img :src="imageFile" class="image-file" />
				</div>

				<div class="file-container" v-else-if="file">
					<div class="icon-file">
						<svg-icon name="file" />
					</div>
					<div>{{ message }}</div>
					<div class="svg-button icon-remove" @click="resetMessage">
						<svg-icon name="close" />
					</div>
				</div>

				<textarea
					v-show="!file || imageFile"
					ref="roomTextarea"
					:placeholder="textMessages.TYPE_MESSAGE"
					:class="{ 'textarea-outline': editedMessage._id }"
					v-model="message"
					@input="autoGrow"
					@keydown.esc="resetMessage"
					@keydown.enter.exact.prevent="sendMessage"
				></textarea>

				<div class="icon-textarea">
					<emoji-picker
						v-if="showEmojis && (!file || imageFile)"
						@addEmoji="addEmoji"
						:emojiOpened="emojiOpened"
						@openEmoji="emojiOpened = $event"
					></emoji-picker>

					<div v-if="showFiles" class="svg-button" @click="launchFilePicker">
						<svg-icon name="paperclip" />
					</div>

					<input
						v-if="showFiles"
						type="file"
						ref="file"
						@change="onFileChange($event.target.files)"
						style="display:none"
					/>

					<div
						class="svg-button"
						v-if="editedMessage._id"
						@click="resetMessage"
					>
						<svg-icon name="close-outline" />
					</div>

					<div
						v-else
						@click="sendMessage"
						class="svg-button"
						:class="{ 'send-disabled': inputDisabled }"
					>
						<svg-icon name="send" :param="inputDisabled ? 'disabled' : ''" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import vClickOutside from 'v-click-outside'
import ChatLoader from './ChatLoader'
import ChatMessage from './ChatMessage'
import SvgIcon from './SvgIcon'
import EmojiPicker from './EmojiPicker'

export default {
	name: 'messages-list',
	components: {
		InfiniteLoading,
		ChatLoader,
		ChatMessage,
		SvgIcon,
		EmojiPicker
	},

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		room: { type: Object, required: true },
		messages: { type: Array, required: true },
		messagesLoaded: { type: Boolean, required: true },
		menuActions: { type: Array, required: true },
		messageActions: { type: Array, required: true },
		showFiles: { type: Boolean, required: true },
		showEmojis: { type: Boolean, required: true },
		textMessages: { type: Object, required: true }
	},

	data() {
		return {
			message: '',
			editedMessage: {},
			messageReply: null,
			infiniteState: null,
			loadingMessages: false,
			file: null,
			imageFile: null,
			menuOpened: false,
			emojiOpened: false,
			scrollIcon: true
		}
	},

	mounted() {
		window.addEventListener('keypress', e => {
			if (e.keyCode === 13 && !e.shiftKey) this.sendMessage()
		})

		document
			.getElementsByClassName('container-scroll')[0]
			.addEventListener('scroll', e => {
				this.scrollIcon =
					e.target.scrollHeight > 500 &&
					e.target.scrollHeight - e.target.scrollTop > 1000
			})
	},

	watch: {
		loadingMessages(val) {
			if (val) this.infiniteState = null
			else this.focusTextarea()
		},
		room() {
			this.loadingMessages = true
			this.resetMessage()
		},
		messages(newVal, oldVal) {
			const element = document.getElementsByClassName('container-scroll')[0]
			const options = { top: element.scrollHeight }

			if (oldVal && newVal && oldVal.length === newVal.length - 1) {
				setTimeout(() => {
					options.behavior = 'smooth'
					element.scrollTo(options)
				}, 0)
			}

			if (this.infiniteState) {
				this.infiniteState.loaded()
			} else if (newVal.length) {
				this.loadingMessages = false
				setTimeout(() => element.scrollTo(options), 0)
			}
		},
		messagesLoaded(val) {
			if (val) this.loadingMessages = false
			if (this.infiniteState) this.infiniteState.complete()
		}
	},

	computed: {
		showNoMessages() {
			return this.room.roomId && !this.messages.length && !this.loadingMessages
		},
		showMessagesStarted() {
			return this.messages.length && this.messagesLoaded
		},
		inputDisabled() {
			return this.isMessageEmpty()
		}
	},

	methods: {
		resetMessage() {
			this.resetTextareaSize()
			this.message = ''
			this.editedMessage = {}
			this.messageReply = null
			this.file = null
			this.imageFile = null
			this.emojiOpened = false
			setTimeout(() => this.focusTextarea(), 0)
		},
		resetImageFile() {
			this.imageFile = null
			this.editedMessage.file = null
			this.file = null
			this.focusTextarea()
		},
		resetTextareaSize() {
			this.$refs['roomTextarea'].style.height = '32px'
		},
		focusTextarea() {
			this.$refs['roomTextarea'].focus()
		},
		isMessageEmpty() {
			return !this.file && !this.message.trim()
		},
		sendMessage() {
			if (!this.file && !this.message.trim()) return

			if (this.editedMessage._id) {
				if (this.editedMessage.content !== this.message || this.file) {
					this.$emit('editMessage', {
						messageId: this.editedMessage._id,
						newContent: this.message.trim(),
						file: this.file,
						replyMessage: this.messageReply
					})
				}
			} else {
				this.$emit('sendMessage', {
					content: this.message.trim(),
					file: this.file,
					replyMessage: this.messageReply
				})
			}

			this.resetMessage()
		},
		loadMoreMessages(infiniteState) {
			if (this.messagesLoaded || !this.room.roomId) {
				return infiniteState.complete()
			}
			this.infiniteState = infiniteState
			this.$emit('fetchMessages')
		},
		messageActionHandler({ action, message }) {
			switch (action.name) {
				case 'replyMessage':
					return this.replyMessage(message)
				case 'editMessage':
					return this.editMessage(message)
				case 'deleteMessage':
					return this.$emit('deleteMessage', message._id)
				default:
					return this.$emit('messageActionHandler', message)
			}
		},
		replyMessage(message) {
			this.resetMessage()
			this.messageReply = message
		},
		editMessage(message) {
			this.resetMessage()
			this.editedMessage = { ...message }
			this.file = message.file
			if (this.isImageCheck(this.file)) this.imageFile = message.file.url
			this.message = message.content

			setTimeout(() => this.resizeTextarea(this.$refs['roomTextarea']), 0)
		},
		scrollToBottom() {
			const element = document.getElementsByClassName('container-scroll')[0]
			element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
		},
		autoGrow(el) {
			this.resizeTextarea(el.srcElement)
		},
		resizeTextarea(textarea) {
			textarea.style.height = 0
			textarea.style.height = textarea.scrollHeight + 2 + 'px'
		},
		addEmoji(emoji) {
			this.message += emoji
			this.focusTextarea()
		},
		launchFilePicker() {
			this.$refs.file.value = ''
			this.$refs.file.click()
		},
		async onFileChange(files) {
			this.resetImageFile()
			const file = files[0]
			const fileURL = URL.createObjectURL(file)
			const blobFile = await fetch(fileURL).then(res => res.blob())

			this.file = {
				blob: blobFile,
				name: file.name.split('.')[0],
				size: file.size,
				type: file.name.split('.')[1] || file.type,
				localUrl: fileURL
			}
			if (this.isImageCheck(this.file)) this.imageFile = fileURL
			else this.message = file.name
		},
		isImageCheck(file) {
			if (!file) return
			const imageTypes = ['png', 'jpg']
			const { type } = file
			return imageTypes.some(t => type.includes(t))
		},
		openFile(message) {
			this.$emit('openFile', message)
		},
		menuActionHandler(action) {
			this.closeMenu()
			this.$emit('menuActionHandler', action)
		},
		closeMenu() {
			this.menuOpened = false
		}
	}
}
</script>

<style lang="scss" scoped>
.col-messages {
	flex: 0 0 75%;
	max-width: 75%;
	position: relative;
	height: 100%;
}

.room-header {
	align-items: center;
	display: flex;
	flex: 1 1 100%;
	padding: 0 16px;
	position: relative;
	height: 64px;
	margin-right: 1px;
	background: var(--chat-header-bg-color);
	border-top-right-radius: 4px;
}

.room-avatar {
	background-size: cover !important;
	background-position: center center !important;
	background-repeat: no-repeat !important;
	height: 42px;
	width: 42px;
	margin-right: 15px;
	border-radius: 50%;
}

.room-name {
	font-size: 17px;
}

.room-options {
	margin-left: auto;
}

.container-scroll {
	background: var(--chat-bg-color-content);
	height: calc(100% - 120px);
	overflow-y: auto;
	margin-right: 1px;
}

.messages-container {
	padding: 0 5px 20px;
}

.text-started {
	font-size: 14px;
	color: #9ca6af;
	font-style: italic;
	text-align: center;
	margin-top: 27px;
	margin-bottom: 20px;
}

.icon-scroll {
	position: absolute;
	bottom: 80px;
	right: 20px;
	padding: 8px;
	background: #fff;
	border-radius: 50%;
	box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 1px 2px 0 rgba(0, 0, 0, 0.12);
	display: flex;
	cursor: pointer;

	svg {
		height: 25px;
		width: 25px;
	}
}

.room-footer {
	position: absolute;
	bottom: 0;
	width: calc(100% - 1px);
	z-index: 10;
	border-bottom-right-radius: 4px;
}

.box-footer {
	display: flex;
	background: var(--chat-bg-color-footer);
	padding: 8px;

	* {
		z-index: 1;
	}
}

.reply-container {
	display: flex;
	padding: 10px;
	background: var(--chat-bg-color-footer);
	z-index: -1;
}

.message-reply {
	overflow: hidden;
	width: 100%;
}

.icon-reply {
	margin-left: 10px;
}

.image-reply {
	max-height: 100px;
	margin-right: 10px;
}

.image-file {
	padding: 10px;
	max-width: 250px;
}

textarea {
	background: var(--chat-bg-color-input);
	color: var(--chat-color);
	border-radius: 20px;
	margin: 2px;
	padding: 12px 15px 0 10px;
	overflow: hidden;
	outline: 0;
	width: 100%;
	resize: none;
	height: 32px;
	caret-color: #1976d2;
	border: none;
	font-size: 16px;

	&::placeholder {
		color: #9ca6af;
	}
}

.textarea-outline {
	box-shadow: inset 0px 0px 0px 1px #1976d2;
}

.icon-textarea {
	display: flex;
	margin: 12px 0 0 5px;

	svg,
	.wrapper {
		margin: 0 7px;
	}
}

.icon-image {
	position: absolute;
	top: 25px;
	left: 25px;

	svg {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.2),
			0 1px 3px 1px rgba(0, 0, 0, 0.12), 0 1px 3px 1px rgba(0, 0, 0, 0.1);
	}
}

.file-container {
	display: flex;
	align-items: center;
	width: 100%;
	height: 48px;
}

.icon-file {
	display: flex;
	margin: 0 10px;
}

.icon-remove {
	margin-left: 10px;

	svg {
		height: 18px;
		width: 18px;
	}
}

.send-disabled,
.send-disabled svg {
	cursor: none !important;
	pointer-events: none !important;
	transform: none !important;
}
</style>
