<template>
	<div class="col-messages" v-show="(isMobile && !showRoomsList) || !isMobile">
		<div class="room-header app-border-b">
			<div
				v-if="!singleRoom"
				class="svg-button toggle-button"
				:class="{ 'rotate-icon': !showRoomsList && !isMobile }"
				@click="$emit('toggleRoomsList')"
			>
				<svg-icon name="toggle" />
			</div>
			<div
				v-if="room.avatar"
				class="room-avatar"
				:style="{ 'background-image': `url(${room.avatar})` }"
			></div>
			<div>
				<div class="room-name">{{ room.roomName }}</div>
				<div v-if="typingUsers" class="room-info">
					{{ typingUsers }} {{ textMessages.IS_TYPING }}
				</div>
				<div v-else class="room-info">
					{{ userStatus }}
				</div>
			</div>
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
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div ref="scrollContainer" class="container-scroll">
			<loader :show="loadingMessages"></loader>
			<div class="messages-container">
				<div :class="{ 'messages-hidden': loadingMessages }">
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
							<div slot="spinner">
								<loader :show="true" :infinite="true"></loader>
							</div>
							<div slot="no-results"></div>
							<div slot="no-more"></div>
						</infinite-loading>
					</transition>
					<transition-group name="fade-message">
						<div v-for="(message, i) in messages" :key="message._id">
							<message
								:currentUserId="currentUserId"
								:message="message"
								:index="i"
								:messages="messages"
								:editedMessage="editedMessage"
								:messageActions="messageActions"
								:roomUsers="room.users"
								:textMessages="textMessages"
								:roomFooterRef="$refs.roomFooter"
								:newMessages="newMessages"
								:showReactionEmojis="showReactionEmojis"
								:emojisList="emojisList"
								:hideOptions="hideOptions"
								@messageActionHandler="messageActionHandler"
								@openFile="openFile"
								@addNewMessage="addNewMessage"
								@sendMessageReaction="sendMessageReaction"
								@hideOptions="hideOptions = $event"
							></message>
						</div>
					</transition-group>
					<transition name="bounce">
						<div class="icon-scroll" v-if="scrollIcon" @click="scrollToBottom">
							<svg-icon name="dropdown" param="scroll" />
						</div>
					</transition>
				</div>
			</div>
		</div>
		<div ref="roomFooter" class="room-footer" v-if="Object.keys(room).length">
			<transition name="slide-up">
				<div v-if="messageReply" class="reply-container">
					<div class="reply-box">
						<img
							v-if="isImageCheck(messageReply.file)"
							:src="messageReply.file.url"
							class="image-reply"
						/>
						<div class="reply-info">
							<div class="reply-username">{{ messageReply.username }}</div>
							<div class="reply-content">{{ messageReply.content }}</div>
						</div>
					</div>

					<div class="icon-reply">
						<div class="svg-button" @click="resetMessage">
							<svg-icon name="close-outline" />
						</div>
					</div>
				</div>
			</transition>

			<div class="box-footer">
				<div class="image-container" v-if="imageFile">
					<div class="svg-button icon-image" @click="resetImageFile">
						<svg-icon name="close" param="image" />
					</div>
					<div class="image-file">
						<img ref="imageFile" :src="imageFile" />
					</div>
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
					:class="{
						'textarea-outline': editedMessage._id,
						'textarea-image': imageFile
					}"
					:style="{
						'min-height': `${imageDimensions ? imageDimensions.height : 20}px`,
						'padding-left': `${imageDimensions ? imageDimensions.width : 16}px`
					}"
					v-model="message"
					@input="onChangeInput"
					@keydown.esc="resetMessage"
					@keydown.enter.exact.prevent="sendMessage"
				></textarea>

				<div class="icon-textarea">
					<emoji-picker
						v-if="showEmojis && (!file || imageFile)"
						:emojiOpened="emojiOpened"
						@addEmoji="addEmoji"
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
import Loader from './Loader'
import Message from './Message'
import SvgIcon from './SvgIcon'
import EmojiPicker from './EmojiPicker'
import emojis from 'vue-emoji-picker/src/emojis'
const { messagesValid } = require('../utils/roomValidation')

export default {
	name: 'room',
	components: {
		InfiniteLoading,
		Loader,
		Message,
		SvgIcon,
		EmojiPicker
	},

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		singleRoom: { type: Boolean, required: true },
		showRoomsList: { type: Boolean, required: true },
		isMobile: { type: Boolean, required: true },
		rooms: { type: Array, required: true },
		roomId: { type: String, required: true },
		messages: { type: Array, required: true },
		messagesLoaded: { type: Boolean, required: true },
		menuActions: { type: Array, required: true },
		messageActions: { type: Array, required: true },
		showFiles: { type: Boolean, required: true },
		showEmojis: { type: Boolean, required: true },
		showReactionEmojis: { type: Boolean, required: true },
		loadingRooms: { type: Boolean, required: true }
	},

	data() {
		return {
			message: '',
			editedMessage: {},
			messageReply: null,
			infiniteState: null,
			loadingMessages: false,
			loadingMoreMessages: false,
			file: null,
			imageFile: null,
			imageDimensions: null,
			menuOpened: false,
			emojiOpened: false,
			emojisList: {},
			hideOptions: true,
			scrollIcon: false,
			newMessages: []
		}
	},

	mounted() {
		this.newMessages = []

		window.addEventListener('keypress', e => {
			if (e.keyCode === 13 && !e.shiftKey) this.sendMessage()
		})

		this.$refs.scrollContainer.addEventListener('scroll', e => {
			this.hideOptions = true
			this.scrollIcon =
				e.target.scrollHeight > 500 &&
				e.target.scrollHeight - e.target.scrollTop > 1000
		})

		const emojisTable = Object.keys(emojis).map(key => emojis[key])
		this.emojisList = Object.assign({}, ...emojisTable)
	},

	watch: {
		loadingMessages(val) {
			if (val) this.infiniteState = null
			else this.focusTextarea()
		},
		room(newVal, oldVal) {
			if (newVal.roomId && newVal.roomId !== oldVal.roomId) {
				this.loadingMessages = true
				this.resetMessage()
				this.$emit('typingMessage', this.message)
			}
		},
		messages(newVal, oldVal) {
			newVal.forEach(message => {
				if (!messagesValid(message)) {
					throw 'Messages object is not valid! Must contain _id[String, Number], content[String, Number] and sender_id[String, Number]'
				}
			})

			const element = this.$refs.scrollContainer
			if (!element) return

			const options = { top: element.scrollHeight }

			if (oldVal && newVal && oldVal.length === newVal.length - 1) {
				return setTimeout(() => {
					options.behavior = 'smooth'
					element.scrollTo(options)
				}, 50)
			}

			if (this.infiniteState) {
				this.infiniteState.loaded()
				setTimeout(() => (this.loadingMoreMessages = false), 0)
			} else if (newVal.length) {
				setTimeout(() => {
					element.scrollTo(options)
					this.loadingMessages = false
				}, 0)
			}
		},
		messagesLoaded(val) {
			if (val) this.loadingMessages = false
			if (this.infiniteState) this.infiniteState.complete()
		},
		imageFile() {
			setTimeout(() => {
				if (!this.$refs.imageFile) {
					this.imageDimensions = null
					setTimeout(() => this.resizeTextarea(), 0)
				} else {
					this.imageDimensions = {
						height: this.$refs.imageFile.height - 10,
						width: this.$refs.imageFile.width + 26
					}
				}
			}, 20)
		}
	},

	computed: {
		room() {
			return this.rooms.find(room => room.roomId === this.roomId) || {}
		},
		showNoMessages() {
			return (
				this.room.roomId &&
				!this.messages.length &&
				!this.loadingMessages &&
				!this.loadingRooms
			)
		},
		showMessagesStarted() {
			return this.messages.length && this.messagesLoaded
		},
		inputDisabled() {
			return this.isMessageEmpty()
		},
		typingUsers() {
			if (!this.room.typingUsers || !this.room.typingUsers.length) return

			const typingUsers = this.room.users.filter(user => {
				if (user._id === this.currentUserId) return
				if (this.room.typingUsers.indexOf(user._id) === -1) return
				if (user.status && user.status.state === 'offline') return
				return true
			})

			return typingUsers.map(user => user.username).join(', ')
		},
		userStatus() {
			if (!this.room.users || this.room.users.length !== 2) return

			const user = this.room.users.find(u => u._id !== this.currentUserId)

			if (!user.status) return

			let text = ''

			if (user.status.state === 'online') {
				text = this.textMessages.IS_ONLINE
			} else if (user.status.last_changed) {
				text = this.textMessages.LAST_SEEN + user.status.last_changed
			}

			return text
		}
	},

	methods: {
		addNewMessage(message) {
			this.newMessages.push(message)
		},
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
			if (!this.$refs['roomTextarea']) return
			this.$refs['roomTextarea'].style.height = '20px'
		},
		focusTextarea() {
			if (this.isMobile) return
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
			if (this.loadingMoreMessages) return

			if (this.messagesLoaded || !this.room.roomId) {
				return infiniteState.complete()
			}

			this.infiniteState = infiniteState
			this.$emit('fetchMessages')
			this.loadingMoreMessages = true
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
		sendMessageReaction(messageReaction) {
			this.$emit('sendMessageReaction', messageReaction)
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

			setTimeout(() => this.resizeTextarea(), 0)
		},
		scrollToBottom() {
			const element = this.$refs.scrollContainer
			element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
		},
		onChangeInput() {
			this.resizeTextarea()
			this.$emit('typingMessage', this.message)
		},
		resizeTextarea() {
			const el = this.$refs['roomTextarea']
			el.style.height = 0
			el.style.height = el.scrollHeight - 24 + 'px'
		},
		addEmoji(emoji) {
			this.message += emoji.icon
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
	position: relative;
	height: 100%;
	flex: 1;
	overflow: hidden;
}

.room-header {
	position: relative;
	display: flex;
	align-items: center;
	height: 64px;
	margin-right: 1px;
	padding: 0 16px;
	background: var(--chat-header-bg-color);
	border-top-right-radius: var(--chat-container-border-radius);
}

.toggle-button {
	margin-right: 15px;

	svg {
		height: 26px;
		width: 26px;
	}
}

.rotate-icon {
	transform: rotate(180deg) !important;
}

.room-name {
	font-size: 17px;
	line-height: 18px;
	color: var(--chat-header-color-name);
}

.room-info {
	font-size: 13px;
	line-height: 18px;
	color: var(--chat-header-color-info);
}

.room-options {
	margin-left: auto;
}

.container-scroll {
	background: var(--chat-content-bg-color);
	height: calc(100% - 110px);
	overflow-y: auto;
	margin-right: 1px;
}

.messages-container {
	padding: 0 5px 20px;
}

.text-started {
	font-size: 14px;
	color: var(--chat-message-color-started);
	font-style: italic;
	text-align: center;
	margin-top: 30px;
	margin-bottom: 20px;
}

.icon-scroll {
	position: absolute;
	bottom: 80px;
	right: 20px;
	padding: 8px;
	background: var(--chat-bg-scroll-icon);
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
	border-bottom-right-radius: 4px;
}

.box-footer {
	display: flex;
	background: var(--chat-footer-bg-color);
	padding: 0 8px 10px;
}

.reply-container {
	display: flex;
	padding: 10px 10px 10px;
	background: var(--chat-content-bg-color);
	align-items: center;
	max-width: 100%;

	.reply-box {
		width: 100%;
		overflow: hidden;
		background: var(--chat-footer-bg-color-reply);
		border-radius: 4px;
		padding: 8px 10px;
		display: flex;
	}

	.reply-info {
		overflow: hidden;
	}

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

	.icon-reply {
		margin-left: 10px;
	}

	.image-reply {
		max-height: 100px;
		margin-right: 10px;
	}
}

textarea {
	height: 20px;
	width: 100%;
	line-height: 20px;
	overflow: hidden;
	outline: 0;
	resize: none;
	border-radius: 20px;
	padding: 12px 140px 12px 16px;
	box-sizing: content-box;
	font-size: 16px;
	background: var(--chat-bg-color-input);
	color: var(--chat-color);
	caret-color: var(--chat-color-caret);
	border: var(--chat-border-style-input);

	&::placeholder {
		color: var(--chat-color-placeholder);
	}
}

.textarea-outline {
	border: 2px solid var(--chat-border-color-input-selected);
}

.textarea-image {
	padding-left: 200px;
}

.icon-textarea {
	position: absolute;
	right: 20px;
	display: flex;
	margin: 12px 0 0 5px;

	svg,
	.wrapper {
		margin: 0 7px;
	}
}

.image-container {
	position: absolute;
	max-width: 20%;
	left: 16px;
	bottom: 18px;
}

.image-file {
	display: flex;

	img {
		border-radius: 15px;
		width: 100%;
		max-width: 150px;
		max-height: 100%;
	}
}

.icon-image {
	position: absolute;
	top: 8px;
	left: 8px;

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
	height: 20px;
	padding: 12px 0;
	box-sizing: content-box;
	background: var(--chat-bg-color-input);
	border: var(--chat-border-style-input);
	border-radius: 20px;
}

.icon-file {
	display: flex;
	margin: 0 8px 0 15px;
}

.icon-remove {
	margin-left: 8px;

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

.messages-hidden {
	opacity: 0;
}
</style>
