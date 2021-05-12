<template>
	<div
		v-show="(isMobile && !showRoomsList) || !isMobile || singleRoom"
		class="vac-col-messages"
	>
		<slot v-if="showNoRoom" name="no-room-selected">
			<div class="vac-container-center vac-room-empty">
				<div>{{ textMessages.ROOM_EMPTY }}</div>
			</div>
		</slot>

		<room-header
			v-else
			:current-user-id="currentUserId"
			:text-messages="textMessages"
			:single-room="singleRoom"
			:show-rooms-list="showRoomsList"
			:is-mobile="isMobile"
			:room-info="roomInfo"
			:menu-actions="menuActions"
			:room="room"
			@toggle-rooms-list="$emit('toggle-rooms-list')"
			@room-info="$emit('room-info')"
			@menu-action-handler="$emit('menu-action-handler', $event)"
		>
			<template v-for="(i, name) in $scopedSlots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</room-header>

		<div
			ref="scrollContainer"
			class="vac-container-scroll"
			@scroll="onContainerScroll"
		>
			<loader :show="loadingMessages" />
			<div class="vac-messages-container">
				<div :class="{ 'vac-messages-hidden': loadingMessages }">
					<transition name="vac-fade-message">
						<div v-if="showNoMessages" class="vac-text-started">
							<slot name="messages-empty">
								{{ textMessages.MESSAGES_EMPTY }}
							</slot>
						</div>
						<div v-if="showMessagesStarted" class="vac-text-started">
							{{ textMessages.CONVERSATION_STARTED }} {{ messages[0].date }}
						</div>
					</transition>
					<transition name="vac-fade-message">
						<infinite-loading
							v-if="messages.length"
							:class="{ 'vac-infinite-loading': !messagesLoaded }"
							force-use-infinite-wrapper=".vac-container-scroll"
							web-component-name="vue-advanced-chat"
							spinner="spiral"
							direction="top"
							:distance="40"
							@infinite="loadMoreMessages"
						>
							<div slot="spinner">
								<loader :show="true" :infinite="true" />
							</div>
							<div slot="no-results" />
							<div slot="no-more" />
						</infinite-loading>
					</transition>
					<transition-group :key="roomId" name="vac-fade-message">
						<div v-for="(m, i) in messages" :key="m._id">
							<message
								:current-user-id="currentUserId"
								:message="m"
								:index="i"
								:messages="messages"
								:edited-message="editedMessage"
								:message-actions="messageActions"
								:room-users="room.users"
								:text-messages="textMessages"
								:room-footer-ref="$refs.roomFooter"
								:new-messages="newMessages"
								:show-reaction-emojis="showReactionEmojis"
								:show-new-messages-divider="showNewMessagesDivider"
								:text-formatting="textFormatting"
								:link-options="linkOptions"
								:emojis-list="emojisList"
								:hide-options="hideOptions"
								@message-added="onMessageAdded"
								@message-action-handler="messageActionHandler"
								@open-file="openFile"
								@open-user-tag="openUserTag"
								@send-message-reaction="sendMessageReaction"
								@hide-options="hideOptions = $event"
							>
								<template v-for="(idx, name) in $scopedSlots" #[name]="data">
									<slot :name="name" v-bind="data" />
								</template>
							</message>
						</div>
					</transition-group>
				</div>
			</div>
		</div>
		<div v-if="!loadingMessages">
			<transition name="vac-bounce">
				<div v-if="scrollIcon" class="vac-icon-scroll" @click="scrollToBottom">
					<transition name="vac-bounce">
						<div
							v-if="scrollMessagesCount"
							class="vac-badge-counter vac-messages-count"
						>
							{{ scrollMessagesCount }}
						</div>
					</transition>
					<slot name="scroll-icon">
						<svg-icon name="dropdown" param="scroll" />
					</slot>
				</div>
			</transition>
		</div>
		<div
			v-show="Object.keys(room).length && showFooter"
			ref="roomFooter"
			class="vac-room-footer"
		>
			<room-message-reply
				:room="room"
				:message-reply="messageReply"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				@reset-message="resetMessage"
			>
				<template v-for="(i, name) in $scopedSlots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</room-message-reply>

			<room-emojis
				:filtered-emojis="filteredEmojis"
				@select-emoji="selectEmoji($event)"
			/>

			<room-users-tag
				:filtered-users-tag="filteredUsersTag"
				@select-user-tag="selectUserTag($event)"
			/>

			<div
				class="vac-box-footer"
				:class="{
					'vac-app-box-shadow': filteredEmojis.length || filteredUsersTag.length
				}"
			>
				<div
					v-if="showAudio && !imageFile && !videoFile"
					class="vac-icon-textarea-left"
				>
					<template v-if="isRecording">
						<div
							class="vac-svg-button vac-icon-audio-stop"
							@click="stopRecorder"
						>
							<slot name="audio-stop-icon">
								<svg-icon name="close-outline" />
							</slot>
						</div>

						<div class="vac-dot-audio-record" />

						<div class="vac-dot-audio-record-time">
							{{ recordedTime }}
						</div>

						<div
							class="vac-svg-button vac-icon-audio-confirm"
							@click="toggleRecorder(false)"
						>
							<slot name="audio-stop-icon">
								<svg-icon name="checkmark" />
							</slot>
						</div>
					</template>

					<div v-else class="vac-svg-button" @click="toggleRecorder(true)">
						<slot name="microphone-icon">
							<svg-icon name="microphone" class="vac-icon-microphone" />
						</slot>
					</div>
				</div>

				<div v-if="imageFile" class="vac-media-container">
					<div class="vac-svg-button vac-icon-media" @click="resetMediaFile">
						<slot name="image-close-icon">
							<svg-icon name="close" param="image" />
						</slot>
					</div>
					<div class="vac-media-file">
						<img ref="mediaFile" :src="imageFile" @load="onMediaLoad" />
					</div>
				</div>

				<div v-else-if="videoFile" class="vac-media-container">
					<div class="vac-svg-button vac-icon-media" @click="resetMediaFile">
						<slot name="image-close-icon">
							<svg-icon name="close" param="image" />
						</slot>
					</div>
					<div ref="mediaFile" class="vac-media-file">
						<video width="100%" height="100%" controls>
							<source :src="videoFile" />
						</video>
					</div>
				</div>

				<div
					v-else-if="file"
					class="vac-file-container"
					:class="{ 'vac-file-container-edit': editedMessage._id }"
				>
					<div class="vac-icon-file">
						<slot name="file-icon">
							<svg-icon name="file" />
						</slot>
					</div>
					<div class="vac-file-message">
						{{ file.audio ? file.name : message }}
					</div>
					<div
						class="vac-svg-button vac-icon-remove"
						@click="resetMessage(null, true)"
					>
						<slot name="file-close-icon">
							<svg-icon name="close" />
						</slot>
					</div>
				</div>

				<textarea
					v-show="!file || imageFile || videoFile"
					ref="roomTextarea"
					v-model="message"
					:placeholder="textMessages.TYPE_MESSAGE"
					class="vac-textarea"
					:class="{
						'vac-textarea-outline': editedMessage._id
					}"
					:style="{
						'min-height': `${mediaDimensions ? mediaDimensions.height : 20}px`,
						'padding-left': `${
							mediaDimensions ? mediaDimensions.width - 10 : 12
						}px`
					}"
					@input="onChangeInput"
					@keydown.esc="escapeTextarea"
					@keydown.enter.exact.prevent=""
				/>

				<div class="vac-icon-textarea">
					<div
						v-if="editedMessage._id"
						class="vac-svg-button"
						@click="resetMessage"
					>
						<slot name="edit-close-icon">
							<svg-icon name="close-outline" />
						</slot>
					</div>

					<emoji-picker
						v-if="showEmojis && (!file || imageFile || videoFile)"
						:emoji-opened="emojiOpened"
						:position-top="true"
						@add-emoji="addEmoji"
						@open-emoji="emojiOpened = $event"
					>
						<template v-for="(i, name) in $scopedSlots" #[name]="data">
							<slot :name="name" v-bind="data" />
						</template>
					</emoji-picker>

					<div
						v-if="showFiles"
						class="vac-svg-button"
						@click="launchFilePicker"
					>
						<slot name="paperclip-icon">
							<svg-icon name="paperclip" />
						</slot>
					</div>

					<div
						v-if="textareaAction"
						class="vac-svg-button"
						@click="textareaActionHandler"
					>
						<slot name="custom-action-icon">
							<svg-icon name="deleted" />
						</slot>
					</div>

					<input
						v-if="showFiles"
						ref="file"
						type="file"
						:accept="acceptedFiles"
						style="display:none"
						@change="onFileChange($event.target.files)"
					/>

					<div
						v-if="showSendIcon"
						class="vac-svg-button"
						:class="{ 'vac-send-disabled': isMessageEmpty }"
						@click="sendMessage"
					>
						<slot name="send-icon">
							<svg-icon name="send" :param="isMessageEmpty ? 'disabled' : ''" />
						</slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import vClickOutside from 'v-click-outside'
import emojis from 'vue-emoji-picker/src/emojis'

import Loader from '../../components/Loader'
import SvgIcon from '../../components/SvgIcon'
import EmojiPicker from '../../components/EmojiPicker'

import RoomHeader from './RoomHeader'
import RoomMessageReply from './RoomMessageReply'
import RoomUsersTag from './RoomUsersTag'
import RoomEmojis from './RoomEmojis'
import Message from '../Message/Message'

import filteredUsers from '../../utils/filter-items'
import Recorder from '../../utils/recorder'
const { detectMobile, iOSDevice } = require('../../utils/mobile-detection')
const { isImageFile, isVideoFile } = require('../../utils/media-file')

export default {
	name: 'Room',
	components: {
		InfiniteLoading,
		Loader,
		SvgIcon,
		EmojiPicker,
		RoomHeader,
		RoomMessageReply,
		RoomUsersTag,
		RoomEmojis,
		Message
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
		roomId: { type: [String, Number], required: true },
		loadFirstRoom: { type: Boolean, required: true },
		messages: { type: Array, required: true },
		roomMessage: { type: String, default: null },
		messagesLoaded: { type: Boolean, required: true },
		menuActions: { type: Array, required: true },
		messageActions: { type: Array, required: true },
		showSendIcon: { type: Boolean, required: true },
		showFiles: { type: Boolean, required: true },
		showAudio: { type: Boolean, required: true },
		showEmojis: { type: Boolean, required: true },
		showReactionEmojis: { type: Boolean, required: true },
		showNewMessagesDivider: { type: Boolean, required: true },
		showFooter: { type: Boolean, required: true },
		acceptedFiles: { type: String, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		loadingRooms: { type: Boolean, required: true },
		roomInfo: { type: Function, default: null },
		textareaAction: { type: Function, default: null }
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
			videoFile: null,
			mediaDimensions: null,
			fileDialog: false,
			emojiOpened: false,
			hideOptions: true,
			scrollIcon: false,
			scrollMessagesCount: 0,
			newMessages: [],
			keepKeyboardOpen: false,
			filteredEmojis: [],
			filteredUsersTag: [],
			selectedUsersTag: [],
			textareaCursorPosition: null,
			cursorRangePosition: null,
			recorder: this.initRecorder(),
			isRecording: false,
			format: 'mp3'
		}
	},

	computed: {
		emojisList() {
			const emojisTable = Object.keys(emojis).map(key => emojis[key])
			return Object.assign({}, ...emojisTable)
		},
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
		showNoRoom() {
			const noRoomSelected =
				(!this.rooms.length && !this.loadingRooms) ||
				(!this.room.roomId && !this.loadFirstRoom)

			if (noRoomSelected) {
				this.loadingMessages = false /* eslint-disable-line vue/no-side-effects-in-computed-properties */
			}
			return noRoomSelected
		},
		showMessagesStarted() {
			return this.messages.length && this.messagesLoaded
		},
		isMessageEmpty() {
			return !this.file && !this.message.trim()
		},
		recordedTime() {
			return new Date(this.recorder.duration * 1000).toISOString().substr(14, 5)
		}
	},

	watch: {
		loadingMessages(val) {
			if (val) {
				this.infiniteState = null
			} else {
				if (this.infiniteState) this.infiniteState.loaded()
				this.focusTextarea(true)
			}
		},
		room: {
			immediate: true,
			handler(newVal, oldVal) {
				if (newVal.roomId && (!oldVal || newVal.roomId !== oldVal.roomId)) {
					this.onRoomChanged()
				}
			}
		},
		roomMessage: {
			immediate: true,
			handler(val) {
				if (val) this.message = this.roomMessage
			}
		},
		messages(newVal, oldVal) {
			newVal.forEach((message, i) => {
				if (
					this.showNewMessagesDivider &&
					!message.seen &&
					message.senderId !== this.currentUserId
				) {
					this.newMessages.push({
						_id: message._id,
						index: i
					})
				}
			})

			if (oldVal?.length === newVal?.length - 1) {
				this.newMessages = []
			}

			if (this.infiniteState) {
				this.infiniteState.loaded()
			}

			setTimeout(() => (this.loadingMoreMessages = false))
		},
		messagesLoaded(val) {
			if (val) this.loadingMessages = false
			if (this.infiniteState) this.infiniteState.complete()
		}
	},

	mounted() {
		this.newMessages = []
		const isMobile = detectMobile()

		window.addEventListener('keyup', e => {
			if (e.key === 'Enter' && !e.shiftKey && !this.fileDialog) {
				if (isMobile) {
					this.message = this.message + '\n'
					setTimeout(() => this.onChangeInput())
				} else {
					this.sendMessage()
				}
			}

			this.updateFooterList('@')
			this.updateFooterList(':')
		})

		this.$refs['roomTextarea'].addEventListener('click', () => {
			if (isMobile) this.keepKeyboardOpen = true
			this.updateFooterList('@')
			this.updateFooterList(':')
		})

		this.$refs['roomTextarea'].addEventListener('blur', () => {
			this.resetFooterList()
			if (isMobile) setTimeout(() => (this.keepKeyboardOpen = false))
		})
	},

	beforeDestroy() {
		this.stopRecorder()
	},

	methods: {
		onRoomChanged() {
			this.loadingMessages = true
			this.scrollIcon = false
			this.scrollMessagesCount = 0
			this.resetMessage(true, null, true)

			if (this.roomMessage) {
				this.message = this.roomMessage
				setTimeout(() => this.onChangeInput())
			}

			if (!this.messages.length && this.messagesLoaded) {
				this.loadingMessages = false
			}

			const unwatch = this.$watch(
				() => this.messages,
				val => {
					if (!val || !val.length) return

					const element = this.$refs.scrollContainer
					if (!element) return

					unwatch()

					setTimeout(() => {
						element.scrollTo({ top: element.scrollHeight })
						this.loadingMessages = false
					})
				}
			)
		},
		onMessageAdded({ message, index, ref }) {
			if (index !== this.messages.length - 1) return

			const autoScrollOffset = ref.offsetHeight + 60

			setTimeout(() => {
				if (
					this.getBottomScroll(this.$refs.scrollContainer) < autoScrollOffset
				) {
					this.scrollToBottom()
				} else {
					if (message.senderId === this.currentUserId) {
						this.scrollToBottom()
					} else {
						this.scrollIcon = true
						this.scrollMessagesCount++
					}
				}
			})
		},
		onContainerScroll(e) {
			this.hideOptions = true

			if (!e.target) return

			const bottomScroll = this.getBottomScroll(e.target)
			if (bottomScroll < 60) this.scrollMessagesCount = 0
			this.scrollIcon = bottomScroll > 500 || this.scrollMessagesCount
		},
		updateFooterList(tagChar) {
			if (!this.$refs['roomTextarea']) return

			if (
				tagChar === '@' &&
				(!this.room.users || this.room.users.length <= 2)
			) {
				return
			}

			if (
				this.textareaCursorPosition ===
				this.$refs['roomTextarea'].selectionStart
			) {
				return
			}

			this.textareaCursorPosition = this.$refs['roomTextarea'].selectionStart

			let position = this.textareaCursorPosition

			while (
				position > 0 &&
				this.message.charAt(position - 1) !== tagChar &&
				this.message.charAt(position - 1) !== ' '
			) {
				position--
			}

			const beforeTag = this.message.charAt(position - 2)
			const notLetterNumber = !beforeTag.match(/^[0-9a-zA-Z]+$/)

			if (
				this.message.charAt(position - 1) === tagChar &&
				(!beforeTag || beforeTag === ' ' || notLetterNumber)
			) {
				const query = this.message.substring(
					position,
					this.textareaCursorPosition
				)
				if (tagChar === ':') {
					this.updateEmojis(query)
				} else if (tagChar === '@') {
					this.updateShowUsersTag(query)
				}
			} else {
				this.resetFooterList()
			}
		},
		getCharPosition(tagChar) {
			const cursorPosition = this.$refs['roomTextarea'].selectionStart

			let position = cursorPosition
			while (position > 0 && this.message.charAt(position - 1) !== tagChar) {
				position--
			}

			let endPosition = position
			while (
				this.message.charAt(endPosition) &&
				this.message.charAt(endPosition).trim()
			) {
				endPosition++
			}

			return { position, endPosition }
		},
		updateEmojis(query) {
			if (!query) return

			const emojisListKeys = Object.keys(this.emojisList)
			const matchingKeys = emojisListKeys.filter(key => key.startsWith(query))

			this.filteredEmojis = matchingKeys.map(key => this.emojisList[key])
		},
		selectEmoji(emoji) {
			const { position, endPosition } = this.getCharPosition(':')

			this.message =
				this.message.substr(0, position - 1) +
				emoji +
				this.message.substr(endPosition, this.message.length - 1)

			this.cursorRangePosition = position
			this.focusTextarea()
		},
		updateShowUsersTag(query) {
			this.filteredUsersTag = filteredUsers(
				this.room.users,
				'username',
				query,
				true
			).filter(user => user._id !== this.currentUserId)
		},
		selectUserTag(user) {
			const { position, endPosition } = this.getCharPosition('@')

			const space = this.message.substr(endPosition, endPosition).length
				? ''
				: ' '

			this.message =
				this.message.substr(0, position) +
				user.username +
				space +
				this.message.substr(endPosition, this.message.length - 1)

			this.selectedUsersTag = [...this.selectedUsersTag, { ...user }]

			this.cursorRangePosition =
				position + user.username.length + space.length + 1
			this.focusTextarea()
		},
		resetFooterList() {
			this.filteredEmojis = []
			this.filteredUsersTag = []
			this.textareaCursorPosition = null
		},
		onMediaLoad() {
			let height = this.$refs.mediaFile.clientHeight
			if (height < 30) height = 30

			this.mediaDimensions = {
				height: this.$refs.mediaFile.clientHeight - 10,
				width: this.$refs.mediaFile.clientWidth + 26
			}
		},
		escapeTextarea() {
			if (this.filteredEmojis.length) this.filteredEmojis = []
			else if (this.filteredUsersTag.length) this.filteredUsersTag = []
			else this.resetMessage()
		},
		resetMessage(
			disableMobileFocus = false,
			editFile = false,
			initRoom = false
		) {
			if (!initRoom) {
				this.$emit('typing-message', null)
			}

			if (editFile) {
				this.file = null
				this.message = ''
				this.preventKeyboardFromClosing()
				setTimeout(() => this.focusTextarea(disableMobileFocus))
				return
			}

			this.selectedUsersTag = []
			this.resetFooterList()
			this.resetTextareaSize()
			this.message = ''
			this.editedMessage = {}
			this.messageReply = null
			this.file = null
			this.mediaDimensions = null
			this.imageFile = null
			this.videoFile = null
			this.emojiOpened = false
			this.preventKeyboardFromClosing()
			setTimeout(() => this.focusTextarea(disableMobileFocus))
		},
		resetMediaFile() {
			this.mediaDimensions = null
			this.imageFile = null
			this.videoFile = null
			this.editedMessage.file = null
			this.file = null
			this.focusTextarea()
		},
		resetTextareaSize() {
			if (!this.$refs['roomTextarea']) return
			this.$refs['roomTextarea'].style.height = '20px'
		},
		focusTextarea(disableMobileFocus) {
			if (detectMobile() && disableMobileFocus) return
			if (!this.$refs['roomTextarea']) return
			this.$refs['roomTextarea'].focus()

			if (this.cursorRangePosition) {
				setTimeout(() => {
					this.$refs['roomTextarea'].setSelectionRange(
						this.cursorRangePosition,
						this.cursorRangePosition
					)
					this.cursorRangePosition = null
				})
			}
		},
		preventKeyboardFromClosing() {
			if (this.keepKeyboardOpen) this.$refs['roomTextarea'].focus()
		},
		sendMessage() {
			let message = this.message.trim()

			if (!this.file && !message) return

			this.selectedUsersTag.forEach(user => {
				message = message.replace(
					`@${user.username}`,
					`<usertag>${user._id}</usertag>`
				)
			})

			if (this.editedMessage._id) {
				if (this.editedMessage.content !== message || this.file) {
					this.$emit('edit-message', {
						messageId: this.editedMessage._id,
						newContent: message,
						file: this.file,
						replyMessage: this.messageReply,
						usersTag: this.selectedUsersTag
					})
				}
			} else {
				this.$emit('send-message', {
					content: message,
					file: this.file,
					replyMessage: this.messageReply,
					usersTag: this.selectedUsersTag
				})
			}

			this.resetMessage(true)
		},
		loadMoreMessages(infiniteState) {
			if (this.loadingMessages) {
				this.infiniteState = infiniteState
				return
			}

			setTimeout(
				() => {
					if (this.loadingMoreMessages) return

					if (this.messagesLoaded || !this.room.roomId) {
						return infiniteState.complete()
					}

					this.infiniteState = infiniteState
					this.$emit('fetch-messages')
					this.loadingMoreMessages = true
				},
				// prevent scroll bouncing issue on iOS devices
				iOSDevice() ? 500 : 0
			)
		},
		messageActionHandler({ action, message }) {
			switch (action.name) {
				case 'replyMessage':
					return this.replyMessage(message)
				case 'editMessage':
					return this.editMessage(message)
				case 'deleteMessage':
					return this.$emit('delete-message', message)
				default:
					return this.$emit('message-action-handler', { action, message })
			}
		},
		sendMessageReaction(messageReaction) {
			this.$emit('send-message-reaction', messageReaction)
		},
		replyMessage(message) {
			this.messageReply = message
			this.focusTextarea()
		},
		editMessage(message) {
			this.resetMessage()
			this.editedMessage = { ...message }
			this.file = message.file

			if (isImageFile(this.file)) {
				this.imageFile = message.file.url
				setTimeout(() => this.onMediaLoad())
			} else if (isVideoFile(this.file)) {
				this.videoFile = message.file.url
				setTimeout(() => this.onMediaLoad(), 50)
			}

			this.message = message.content
		},
		getBottomScroll(element) {
			const { scrollHeight, clientHeight, scrollTop } = element
			return scrollHeight - clientHeight - scrollTop
		},
		scrollToBottom() {
			setTimeout(() => {
				const element = this.$refs.scrollContainer
				element.classList.add('vac-scroll-smooth')
				element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
				setTimeout(() => element.classList.remove('vac-scroll-smooth'))
			}, 50)
		},
		onChangeInput() {
			this.keepKeyboardOpen = true
			this.resizeTextarea()
			this.$emit('typing-message', this.message)
		},
		resizeTextarea() {
			const el = this.$refs['roomTextarea']

			if (!el) return

			const padding = window
				.getComputedStyle(el, null)
				.getPropertyValue('padding-top')
				.replace('px', '')

			el.style.height = 0
			el.style.height = el.scrollHeight - padding * 2 + 'px'
		},
		addEmoji(emoji) {
			this.message += emoji.icon
			this.focusTextarea(true)
		},
		launchFilePicker() {
			this.$refs.file.value = ''
			this.$refs.file.click()
		},
		async onFileChange(files) {
			this.fileDialog = true
			this.resetMediaFile()

			const file = files[0]
			const fileURL = URL.createObjectURL(file)
			const blobFile = await fetch(fileURL).then(res => res.blob())
			const typeIndex = file.name.lastIndexOf('.')

			this.file = {
				blob: blobFile,
				name: file.name.substring(0, typeIndex),
				size: file.size,
				type: file.type,
				extension: file.name.substring(typeIndex + 1),
				localUrl: fileURL
			}

			if (isImageFile(this.file)) {
				this.imageFile = fileURL
			} else if (isVideoFile(this.file)) {
				this.videoFile = fileURL
				setTimeout(() => this.onMediaLoad(), 50)
			} else {
				this.message = file.name
			}

			setTimeout(() => (this.fileDialog = false), 500)
		},
		initRecorder() {
			this.isRecording = false

			return new Recorder({
				beforeRecording: null,
				afterRecording: null,
				pauseRecording: null,
				micFailed: this.micFailed
			})
		},
		micFailed() {
			this.isRecording = false
			this.recorder = this.initRecorder()
		},
		toggleRecorder(recording) {
			this.isRecording = recording

			if (!this.recorder.isRecording) {
				setTimeout(() => this.recorder.start(), 200)
			} else {
				try {
					this.recorder.stop()

					const record = this.recorder.records[0]

					this.file = {
						blob: record.blob,
						name: `audio.${this.format}`,
						size: record.blob.size,
						duration: record.duration,
						type: record.blob.type,
						audio: true,
						localUrl: URL.createObjectURL(record.blob)
					}

					this.recorder = this.initRecorder()
					this.sendMessage()
				} catch {
					setTimeout(() => this.stopRecorder(), 100)
				}
			}
		},
		stopRecorder() {
			if (this.recorder.isRecording) {
				try {
					this.recorder.stop()
					this.recorder = this.initRecorder()
				} catch {
					setTimeout(() => this.stopRecorder(), 100)
				}
			}
		},
		openFile({ message, action }) {
			this.$emit('open-file', { message, action })
		},
		openUserTag(user) {
			this.$emit('open-user-tag', user)
		},
		textareaActionHandler() {
			this.$emit('textarea-action-handler', this.message)
		}
	}
}
</script>

<style lang="scss">
.vac-col-messages {
	position: relative;
	height: 100%;
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-flow: column;

	.vac-container-center {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.vac-room-empty {
		font-size: 14px;
		color: #9ca6af;
		font-style: italic;
		line-height: 20px;
		white-space: pre-line;

		div {
			padding: 0 10%;
		}
	}

	.vac-container-scroll {
		background: var(--chat-content-bg-color);
		flex: 1;
		overflow-y: auto;
		margin-right: 1px;
		margin-top: 60px;
		-webkit-overflow-scrolling: touch;

		&.vac-scroll-smooth {
			scroll-behavior: smooth;
		}
	}

	.vac-messages-container {
		padding: 0 5px 5px;
	}

	.vac-text-started {
		font-size: 14px;
		color: var(--chat-message-color-started);
		font-style: italic;
		text-align: center;
		margin-top: 30px;
		margin-bottom: 20px;
	}

	.vac-infinite-loading {
		height: 68px;
	}

	.vac-icon-scroll {
		position: absolute;
		bottom: 80px;
		right: 20px;
		padding: 8px;
		background: var(--chat-bg-scroll-icon);
		border-radius: 50%;
		box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2),
			0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 2px 0 rgba(0, 0, 0, 0.12);
		display: flex;
		cursor: pointer;
		z-index: 10;

		svg {
			height: 25px;
			width: 25px;
		}
	}

	.vac-messages-count {
		position: absolute;
		top: -8px;
		left: 11px;
		background-color: var(--chat-message-bg-color-scroll-counter);
		color: var(--chat-message-color-scroll-counter);
	}

	.vac-room-footer {
		width: 100%;
		border-bottom-right-radius: 4px;
		z-index: 10;
	}

	.vac-box-footer {
		display: flex;
		position: relative;
		background: var(--chat-footer-bg-color);
		padding: 10px 8px 10px;
	}

	.vac-textarea {
		height: 20px;
		width: 100%;
		line-height: 20px;
		overflow: hidden;
		outline: 0;
		resize: none;
		border-radius: 20px;
		padding: 12px 16px;
		box-sizing: content-box;
		font-size: 16px;
		background: var(--chat-bg-color-input);
		color: var(--chat-color);
		caret-color: var(--chat-color-caret);
		border: var(--chat-border-style-input);

		&::placeholder {
			color: var(--chat-color-placeholder);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.vac-textarea-outline {
		border: 1px solid var(--chat-border-color-input-selected);
		box-shadow: inset 0px 0px 0px 1px var(--chat-border-color-input-selected);
	}

	.vac-icon-textarea,
	.vac-icon-textarea-left {
		display: flex;
		align-items: center;

		svg,
		.vac-wrapper {
			margin: 0 7px;
		}
	}

	.vac-icon-textarea {
		margin-left: 5px;
	}

	.vac-icon-textarea-left {
		display: flex;
		align-items: center;
		margin-right: 5px;

		svg,
		.vac-wrapper {
			margin: 0 7px;
		}

		.vac-icon-microphone {
			fill: var(--chat-icon-color-microphone);
			margin: 0 7px;
		}

		.vac-dot-audio-record {
			height: 15px;
			width: 15px;
			border-radius: 50%;
			background-color: var(--chat-message-bg-color-audio-record);
			animation: vac-scaling 0.8s ease-in-out infinite alternate;

			@keyframes vac-scaling {
				0% {
					transform: scale(1);
					opacity: 0.4;
				}
				100% {
					transform: scale(1.1);
					opacity: 1;
				}
			}
		}

		.vac-dot-audio-record-time {
			font-size: 16px;
			color: var(--chat-color);
			margin-left: 8px;
			width: 45px;
		}

		$audio-icon-size: 28px;

		.vac-icon-audio-stop,
		.vac-icon-audio-confirm {
			min-height: $audio-icon-size;
			min-width: $audio-icon-size;

			svg {
				min-height: $audio-icon-size;
				min-width: $audio-icon-size;
			}
		}

		.vac-icon-audio-stop {
			margin-right: 20px;

			#vac-icon-close-outline {
				fill: var(--chat-icon-color-audio-cancel);
			}
		}

		.vac-icon-audio-confirm {
			margin-right: 3px;
			margin-left: 12px;

			#vac-icon-checkmark {
				fill: var(--chat-icon-color-audio-confirm);
			}
		}
	}

	.vac-media-container {
		position: absolute;
		max-width: 25%;
		left: 16px;
		top: 18px;
	}

	.vac-media-file {
		display: flex;
		justify-content: center;
		flex-direction: column;
		min-height: 30px;

		img {
			border-radius: 15px;
			width: 100%;
			max-width: 150px;
			max-height: 100%;
		}

		video {
			border-radius: 15px;
			width: 100%;
			max-width: 250px;
			max-height: 100%;
		}
	}

	.vac-icon-media {
		position: absolute;
		top: 6px;
		left: 6px;
		z-index: 10;

		svg {
			height: 20px;
			width: 20px;
			border-radius: 50%;
		}

		&:before {
			content: ' ';
			position: absolute;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 50%;
			z-index: -1;
		}
	}

	.vac-file-container {
		display: flex;
		align-items: center;
		width: calc(100% - 115px);
		height: 20px;
		padding: 12px 0;
		box-sizing: content-box;
		background: var(--chat-bg-color-input);
		border: var(--chat-border-style-input);
		border-radius: 20px;

		&.vac-file-container-edit {
			width: calc(100% - 150px);
		}

		.vac-icon-file {
			display: flex;
			margin: 0 8px 0 15px;
		}

		.vac-file-message {
			max-width: calc(100% - 75px);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.vac-icon-remove {
			margin: 0 8px;

			svg {
				height: 18px;
				width: 18px;
			}
		}
	}

	.vac-send-disabled,
	.vac-send-disabled svg {
		cursor: none !important;
		pointer-events: none !important;
		transform: none !important;
	}

	.vac-messages-hidden {
		opacity: 0;
	}

	@media only screen and (max-width: 768px) {
		.vac-container-scroll {
			margin-top: 50px;
		}

		.vac-infinite-loading {
			height: 58px;
		}

		.vac-box-footer {
			border-top: var(--chat-border-style-input);
			padding: 7px 2px 7px 7px;
		}

		.vac-text-started {
			margin-top: 20px;
		}

		.vac-textarea {
			padding: 7px;
			line-height: 18px;

			&::placeholder {
				color: transparent;
			}
		}

		.vac-icon-textarea,
		.vac-icon-textarea-left {
			svg,
			.vac-wrapper {
				margin: 0 5px !important;
			}
		}

		.vac-media-container {
			top: 10px;
			left: 10px;
		}

		.vac-media-file {
			img,
			video {
				transform: scale(0.97);
			}
		}

		.vac-room-footer {
			width: 100%;
		}

		.vac-file-container {
			padding: 7px 0;

			.icon-file {
				margin-left: 10px;
			}
		}

		.vac-icon-scroll {
			bottom: 70px;
		}
	}
}
</style>
