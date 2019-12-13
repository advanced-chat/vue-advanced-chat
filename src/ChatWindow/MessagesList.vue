<template>
	<div class="col-messages">
		<div>
			<div class="room-header app-border-b">
				<div
					v-if="room.avatar"
					class="room-avatar"
					:style="{ background: `url(${room.avatar})` }"
				></div>
				<div>{{ room.roomName }}</div>
				<div
					class="svg-button room-options"
					v-if="menuActions.length"
					@click="menuOpened = !menuOpened"
				>
					<svg-icon name="menu" />
				</div>
				<transition name="slide-fade" v-if="menuActions.length">
					<div
						v-if="menuOpened"
						v-click-outside="closeMenu"
						class="menu-options"
					>
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
		</div>
		<div class="container-scroll">
			<div class="messages-container">
				<chat-loader :show="loadingMessages"></chat-loader>
				<transition name="fade">
					<div class="text-started" v-if="showNoMessages">
						{{ textMessages.MESSAGES_EMPTY }}
					</div>
					<div class="text-started" v-if="showMessagesStarted">
						{{ textMessages.CONVERSATION_STARTED }} {{ messages[0].date }}
					</div>
				</transition>
				<transition name="fade">
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
				<transition-group name="fade">
					<div v-for="(message, i) in messages" :key="message._id">
						<chat-message
							:message="message"
							:index="i"
							:messages="messages"
							:editedMessage="editedMessage"
							:roomUsers="room.users"
							:textMessages="textMessages"
							@editMessage="editMessage"
							@deleteMessage="deleteMessage"
						></chat-message>
					</div>
				</transition-group>
			</div>
		</div>
		<div class="room-footer" :class="{ 'textarea-outline': editedMessage._id }">
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
					<div class="svg-button icon-remove" @click="resetFile">
						<svg-icon name="close" />
					</div>
				</div>

				<textarea
					v-show="!file || imageFile"
					ref="roomTextarea"
					rows="1"
					:placeholder="textMessages.TYPE_MESSAGE"
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
		showFiles: { type: Boolean, required: true },
		showEmojis: { type: Boolean, required: true },
		textMessages: { type: Object, required: true }
	},

	data() {
		return {
			message: '',
			editedMessage: {},
			infiniteState: null,
			loadingMessages: false,
			file: null,
			imageFile: null,
			menuOpened: false,
			emojiOpened: false
		}
	},

	mounted() {
		window.addEventListener('keypress', e => {
			if (e.keyCode === 13) this.sendMessage()
		})
	},

	watch: {
		loadingMessages(val) {
			if (val) this.infiniteState = null
			else this.$refs['roomTextarea'].focus()
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
			this.$refs['roomTextarea'].style.height = '38px'
			this.message = ''
			this.editedMessage = {}
			this.file = null
			this.imageFile = null
			this.emojiOpened = false
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
						file: this.file
					})
				}
			} else {
				this.$emit('sendMessage', { content: this.message, file: this.file })
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
		editMessage(message) {
			this.resetFile()
			this.$refs['roomTextarea'].focus()
			this.editedMessage = { ...message }
			this.file = message.file
			if (this.isImageCheck(this.file)) this.imageFile = message.file.url
			this.message = message.content

			setTimeout(() => this.resizeTextarea(this.$refs['roomTextarea']), 0)
		},
		deleteMessage(message) {
			this.$emit('deleteMessage', message._id)
		},
		autoGrow(el) {
			this.resizeTextarea(el.srcElement)
		},
		resizeTextarea(textarea) {
			textarea.style.height = 0
			textarea.style.height = textarea.scrollHeight + 'px'
		},
		addEmoji(emoji) {
			this.message += emoji
			this.$refs['roomTextarea'].focus()
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
		resetImageFile() {
			this.imageFile = null
			this.editedMessage.file = null
			this.file = null
		},
		resetFile() {
			this.message = ''
			this.imageFile = null
			this.editedMessage.file = null
			this.file = null
		},
		isImageCheck(file) {
			if (!file) return
			const imageTypes = ['png', 'jpg']
			const { type } = file
			return imageTypes.some(t => type.includes(t))
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
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	align-items: center;
	display: flex;
	flex: 1 1 100%;
	padding: 0 16px;
	position: relative;
	height: 64px;
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

.room-options {
	margin-left: auto;
}

.menu-options {
	position: absolute;
	right: 10px;
	top: 20px;
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
	min-height: 35px;
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

.container-scroll {
	background: var(--chat-bg-color-content);
	height: calc(100% - 120px);
	overflow-y: auto;
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

.room-footer {
	position: absolute;
	bottom: 0;
	width: 100%;
	background: var(--chat-color-input);
	border-top: 1px solid var(--chat-border-color);
	z-index: 10;
}

.box-footer {
	display: flex;
}

.image-file {
	padding: 10px;
	max-width: 250px;
}

textarea {
	background: var(--chat-color-input);
	color: var(--chat-color);
	margin: 2px;
	padding: 15px 15px 5px 10px;
	overflow: hidden;
	outline: 0;
	width: 100%;
	resize: none;
	height: 38px;
	caret-color: #1976d2;
	border: none;
	font-size: 16px;

	&::placeholder {
		color: #9ca6af;
	}
}

.textarea-outline {
	box-shadow: inset 0px 0px 0px 2px #1976d2;
}

.icon-textarea {
	display: flex;
	margin: 18px 10px 0 0;

	svg,
	.wrapper {
		margin: 0 7px;
	}
}

.icon-image {
	position: absolute;
	top: 16px;
	left: 16px;

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
	height: 62px;
}

.icon-file {
	display: flex;
	margin: 0 10px;
}

.icon-remove {
	margin-left: 5px;

	svg {
		height: 20px;
		width: 20px;
	}
}

.send-disabled,
.send-disabled svg {
	cursor: none !important;
	pointer-events: none !important;
	transform: none !important;
}

.fade-enter {
	opacity: 0;
}

.fade-enter-active {
	transition: opacity 0.5s;
}

.fade-leave-active {
	transition: opacity 0.2s;
	opacity: 0;
}

.slide-fade-enter-active {
	transition: all 0.3s ease;
}
.slide-fade-leave-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateX(10px);
	opacity: 0;
}
</style>
