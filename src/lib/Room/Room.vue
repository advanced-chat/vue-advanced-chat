<template>
	<div
		v-show="(isMobile && !showRoomsList) || !isMobile || singleRoom"
		class="vac-col-messages"
		@touchstart="touchStart"
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
			:room-info-enabled="roomInfoEnabled"
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
						<div>
							<div v-if="showNoMessages" class="vac-text-started">
								<slot name="messages-empty">
									{{ textMessages.MESSAGES_EMPTY }}
								</slot>
							</div>
							<div v-if="showMessagesStarted" class="vac-text-started">
								{{ textMessages.CONVERSATION_STARTED }} {{ messages[0].date }}
							</div>
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
							<template #spinner>
								<loader :show="true" :infinite="true" />
							</template>
							<template #no-results>
								<div />
							</template>
							<template #no-more>
								<div />
							</template>
						</infinite-loading>
					</transition>
					<transition-group :key="roomId" name="vac-fade-message" tag="span">
						<div v-for="(m, i) in messages" :key="m.indexId || m._id">
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
			:class="{
				'vac-app-box-shadow': shadowFooter
			}"
		>
			<room-emojis
				:filtered-emojis="filteredEmojis"
				@select-emoji="selectEmoji($event)"
			/>

			<room-users-tag
				:filtered-users-tag="filteredUsersTag"
				@select-user-tag="selectUserTag($event)"
			/>

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

			<room-files
				:files="files"
				@remove-file="removeFile"
				@reset-message="resetMessage"
			>
				<template v-for="(i, name) in $scopedSlots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</room-files>

			<div class="vac-box-footer">
				<div v-if="showAudio && !files.length" class="vac-icon-textarea-left">
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

				<textarea
					ref="roomTextarea"
					:placeholder="textMessages.TYPE_MESSAGE"
					class="vac-textarea"
					:class="{
						'vac-textarea-outline': editedMessage._id
					}"
					:style="{
						'min-height': `20px`,
						'padding-left': `12px`
					}"
					@input="onChangeInput"
					@keydown.esc="escapeTextarea"
					@keydown.enter.exact.prevent=""
					@paste="onPasteImage"
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

					<emoji-picker-container
						v-if="showEmojis"
						v-click-outside="() => (emojiOpened = false)"
						:emoji-opened="emojiOpened"
						:position-top="true"
						@add-emoji="addEmoji"
						@open-emoji="emojiOpened = $event"
					>
						<template v-for="(i, name) in $scopedSlots" #[name]="data">
							<slot :name="name" v-bind="data" />
						</template>
					</emoji-picker-container>

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
						v-if="textareaActionEnabled"
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
						multiple
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
import { Database } from 'emoji-picker-element'

import Loader from '../../components/Loader/Loader'
import SvgIcon from '../../components/SvgIcon/SvgIcon'
import EmojiPickerContainer from '../../components/EmojiPickerContainer/EmojiPickerContainer'

import RoomHeader from './RoomHeader/RoomHeader'
import RoomFiles from './RoomFiles/RoomFiles'
import RoomMessageReply from './RoomMessageReply/RoomMessageReply'
import RoomUsersTag from './RoomUsersTag/RoomUsersTag'
import RoomEmojis from './RoomEmojis/RoomEmojis'
import Message from '../Message/Message'

import filteredUsers from '../../utils/filter-items'
import Recorder from '../../utils/recorder'

const { detectMobile, iOSDevice } = require('../../utils/mobile-detection')

const debounce = (func, delay) => {
	let inDebounce
	return function() {
		const context = this
		const args = arguments
		clearTimeout(inDebounce)
		inDebounce = setTimeout(() => func.apply(context, args), delay)
	}
}

export default {
	name: 'Room',
	components: {
		InfiniteLoading,
		Loader,
		SvgIcon,
		EmojiPickerContainer,
		RoomHeader,
		RoomFiles,
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
		roomInfoEnabled: { type: Boolean, required: true },
		textareaActionEnabled: { type: Boolean, required: true }
	},

	emits: [
		'toggle-rooms-list',
		'room-info',
		'menu-action-handler',
		'edit-message',
		'send-message',
		'delete-message',
		'message-action-handler',
		'fetch-messages',
		'send-message-reaction',
		'typing-message',
		'open-file',
		'open-user-tag',
		'textarea-action-handler'
	],

	data() {
		return {
			message: '',
			editedMessage: {},
			messageReply: null,
			infiniteState: null,
			loadingMessages: false,
			loadingMoreMessages: false,
			files: [],
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
			emojisDB: new Database(),
			recorder: this.initRecorder(),
			isRecording: false,
			format: 'mp3'
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
			return !this.files.length && !this.message.trim()
		},
		recordedTime() {
			return new Date(this.recorder.duration * 1000).toISOString().substr(14, 5)
		},
		shadowFooter() {
			return (
				!!this.filteredEmojis.length ||
				!!this.filteredUsersTag.length ||
				!!this.files.length ||
				!!this.messageReply
			)
		}
	},

	watch: {
		message(val) {
			this.$refs.roomTextarea.value = val
		},
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
		messages: {
			deep: true,
			handler(newVal, oldVal) {
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
			}
		},
		messagesLoaded(val) {
			if (val) this.loadingMessages = false
			if (this.infiniteState) this.infiniteState.complete()
		}
	},

	mounted() {
		this.newMessages = []
		const isMobile = detectMobile()

		this.$refs.roomTextarea.addEventListener(
			'keyup',
			debounce(e => {
				if (e.key === 'Enter' && !e.shiftKey && !this.fileDialog) {
					if (isMobile) {
						this.message = this.message + '\n'
						setTimeout(() => this.onChangeInput())
					} else {
						this.sendMessage()
					}
				}

				setTimeout(() => {
					this.updateFooterList('@')
					this.updateFooterList(':')
				}, 60)
			}),
			50
		)

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
		touchStart(touchEvent) {
			if (touchEvent.changedTouches.length === 1) {
				const posXStart = touchEvent.changedTouches[0].clientX
				const posYStart = touchEvent.changedTouches[0].clientY

				addEventListener(
					'touchend',
					touchEvent => this.touchEnd(touchEvent, posXStart, posYStart),
					{ once: true }
				)
			}
		},
		touchEnd(touchEvent, posXStart, posYStart) {
			if (touchEvent.changedTouches.length === 1) {
				const posXEnd = touchEvent.changedTouches[0].clientX
				const posYEnd = touchEvent.changedTouches[0].clientY

				const swippedRight = posXEnd - posXStart > 30
				const swippedVertically = Math.abs(posYEnd - posYStart) > 50

				if (swippedRight && !swippedVertically) {
					this.$emit('toggle-rooms-list')
				}
			}
		},
		onRoomChanged() {
			this.loadingMessages = true
			this.scrollIcon = false
			this.scrollMessagesCount = 0
			this.resetMessage(true, true)

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
				this.resetFooterList(tagChar)
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
		async updateEmojis(query) {
			if (!query) return

			const emojis = await this.emojisDB.getEmojiBySearchQuery(query)
			this.filteredEmojis = emojis.map(emoji => emoji.unicode)
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
		resetFooterList(tagChar = null) {
			if (tagChar === ':') {
				this.filteredEmojis = []
			} else if (tagChar === '@') {
				this.filteredUsersTag = []
			} else {
				this.filteredEmojis = []
				this.filteredUsersTag = []
			}

			this.textareaCursorPosition = null
		},
		escapeTextarea() {
			if (this.filteredEmojis.length) this.filteredEmojis = []
			else if (this.filteredUsersTag.length) this.filteredUsersTag = []
			else this.resetMessage()
		},
		resetMessage(disableMobileFocus = false, initRoom = false) {
			if (!initRoom) {
				this.$emit('typing-message', null)
			}

			this.selectedUsersTag = []
			this.resetFooterList()
			this.resetTextareaSize()
			this.message = ''
			this.editedMessage = {}
			this.messageReply = null
			this.files = []
			this.emojiOpened = false
			this.preventKeyboardFromClosing()
			setTimeout(() => this.focusTextarea(disableMobileFocus))
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

			if (!this.files.length && !message) return

			this.selectedUsersTag.forEach(user => {
				message = message.replace(
					`@${user.username}`,
					`<usertag>${user._id}</usertag>`
				)
			})

			const files = this.files.length ? this.files : null

			if (this.editedMessage._id) {
				if (this.editedMessage.content !== message || files) {
					this.$emit('edit-message', {
						messageId: this.editedMessage._id,
						newContent: message,
						files: files,
						replyMessage: this.messageReply,
						usersTag: this.selectedUsersTag
					})
				}
			} else {
				this.$emit('send-message', {
					content: message,
					files: files,
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
			this.editedMessage = {}
			this.messageReply = message
			this.focusTextarea()
		},
		editMessage(message) {
			this.resetMessage()

			this.editedMessage = { ...message }
			this.message = message.content

			if (message.files) {
				this.files = [...message.files]
			}
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
		onChangeInput: debounce(function(e) {
			if (e?.target?.value) {
				this.message = e.target.value
			}
			this.keepKeyboardOpen = true
			this.resizeTextarea()
			this.$emit('typing-message', this.message)
		}, 100),
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
			this.message += emoji.unicode
			this.focusTextarea(true)
		},
		launchFilePicker() {
			this.$refs.file.value = ''
			this.$refs.file.click()
		},
		onPasteImage(pasteEvent) {
			const items = pasteEvent.clipboardData?.items

			if (items) {
				items.forEach(item => {
					if (item.type.includes('image')) {
						const blob = item.getAsFile()
						this.onFileChange([blob])
					}
				})
			}
		},
		async onFileChange(files) {
			this.fileDialog = true
			this.focusTextarea()

			files.forEach(async file => {
				const fileURL = URL.createObjectURL(file)
				const blobFile = await fetch(fileURL).then(res => res.blob())
				const typeIndex = file.name.lastIndexOf('.')

				this.files.push({
					blob: blobFile,
					name: file.name.substring(0, typeIndex),
					size: file.size,
					type: file.type,
					extension: file.name.substring(typeIndex + 1),
					localUrl: fileURL
				})
			})

			setTimeout(() => (this.fileDialog = false), 500)
		},
		removeFile(index) {
			this.files.splice(index, 1)
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

					this.files.push({
						blob: record.blob,
						name: `audio.${this.format}`,
						size: record.blob.size,
						duration: record.duration,
						type: record.blob.type,
						audio: true,
						localUrl: URL.createObjectURL(record.blob)
					})

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
		openFile({ message, file }) {
			this.$emit('open-file', { message, file })
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
