<template>
	<div
		v-show="Object.keys(room).length && showFooter"
		id="room-footer"
		class="vac-room-footer"
		:class="{
			'vac-app-box-shadow': shadowFooter
		}"
	>
		<room-emojis
			:filtered-emojis="filteredEmojis"
			:select-item="selectEmojiItem"
			:active-up-or-down="activeUpOrDownEmojis"
			@select-emoji="selectEmoji($event)"
			@activate-item="activeUpOrDownEmojis = 0"
		/>

		<room-users-tag
			:filtered-users-tag="filteredUsersTag"
			:select-item="selectUsersTagItem"
			:active-up-or-down="activeUpOrDownUsersTag"
			@select-user-tag="selectUserTag($event)"
			@activate-item="activeUpOrDownUsersTag = 0"
		/>

		<room-templates-text
			:filtered-templates-text="filteredTemplatesText"
			:select-item="selectTemplatesTextItem"
			:active-up-or-down="activeUpOrDownTemplatesText"
			@select-template-text="selectTemplateText($event)"
			@activate-item="activeUpOrDownTemplatesText = 0"
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

		<div
			class="vac-box-footer"
			:class="{ 'vac-box-footer-border': !files.length }"
		>
			<div v-if="showAudio && !files.length" class="vac-icon-textarea-left">
				<template v-if="isRecording">
					<div class="vac-svg-button vac-icon-audio-stop" @click="stopRecorder">
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
				id="roomTextarea"
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
				@keydown.enter.exact.prevent="selectItem"
				@paste="onPasteImage"
				@keydown.tab.exact.prevent=""
				@keydown.tab="selectItem"
				@keydown.up.exact.prevent=""
				@keydown.up="updateActiveUpOrDown(-1)"
				@keydown.down.exact.prevent=""
				@keydown.down="updateActiveUpOrDown(1)"
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

				<div v-if="showEmojis" v-click-outside="() => (emojiOpened = false)">
					<slot
						name="emoji-picker"
						v-bind="{ emojiOpened }"
						:add-emoji="addEmoji"
					>
						<emoji-picker-container
							:emoji-opened="emojiOpened"
							:position-top="true"
							@add-emoji="addEmoji"
							@open-emoji="emojiOpened = $event"
						>
							<template #emoji-picker-icon>
								<slot name="emoji-picker-icon" />
							</template>
						</emoji-picker-container>
					</slot>
				</div>

				<div v-if="showFiles" class="vac-svg-button" @click="launchFilePicker">
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
					style="display: none"
					@change="onFileChange($event.target.files)"
				/>

				<div
					v-if="showSendIcon"
					class="vac-svg-button"
					:class="{ 'vac-send-disabled': isMessageEmpty }"
					@click="sendMessage"
				>
					<slot name="send-icon">
						<svg-icon
							name="send"
							:param="isMessageEmpty || isFileLoading ? 'disabled' : ''"
						/>
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Database } from 'emoji-picker-element'
import vClickOutside from 'v-click-outside'

import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import EmojiPickerContainer from '../../../components/EmojiPickerContainer/EmojiPickerContainer'

import RoomFiles from './RoomFiles/RoomFiles'
import RoomMessageReply from './RoomMessageReply/RoomMessageReply'
import RoomUsersTag from './RoomUsersTag/RoomUsersTag'
import RoomEmojis from './RoomEmojis/RoomEmojis'
import RoomTemplatesText from './RoomTemplatesText/RoomTemplatesText'

import filteredItems from '../../../utils/filter-items'
import Recorder from '../../../utils/recorder'

const { detectMobile } = require('../../../utils/mobile-detection')

export default {
	name: 'RoomFooter',

	components: {
		SvgIcon,
		EmojiPickerContainer,
		RoomFiles,
		RoomMessageReply,
		RoomUsersTag,
		RoomEmojis,
		RoomTemplatesText
	},

	directives: {
		clickOutside: vClickOutside.directive
	},

	props: {
		room: { type: Object, required: true },
		roomId: { type: [String, Number], required: true },
		roomMessage: { type: String, default: null },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		textMessages: { type: Object, required: true },
		showSendIcon: { type: Boolean, required: true },
		showFiles: { type: Boolean, required: true },
		showAudio: { type: Boolean, required: true },
		showEmojis: { type: Boolean, required: true },
		showFooter: { type: Boolean, required: true },
		acceptedFiles: { type: String, required: true },
		textareaActionEnabled: { type: Boolean, required: true },
		userTagsEnabled: { type: Boolean, required: true },
		emojisSuggestionEnabled: { type: Boolean, required: true },
		templatesText: { type: Array, default: null },
		audioBitRate: { type: Number, required: true },
		audioSampleRate: { type: Number, required: true },
		initReplyMessage: { type: Object, default: null },
		initEditMessage: { type: Object, default: null }
	},

	emits: [
		'edit-message',
		'send-message',
		'update-edited-message-id',
		'textarea-action-handler',
		'typing-message'
	],

	data() {
		return {
			message: '',
			editedMessage: {},
			messageReply: null,
			cursorRangePosition: null,
			files: [],
			fileDialog: false,
			selectUsersTagItem: null,
			selectEmojiItem: null,
			selectTemplatesTextItem: null,
			format: 'mp3',
			activeUpOrDownEmojis: null,
			activeUpOrDownUsersTag: null,
			activeUpOrDownTemplatesText: null,
			emojisDB: new Database(),
			emojiOpened: false,
			keepKeyboardOpen: false,
			filteredEmojis: [],
			filteredUsersTag: [],
			selectedUsersTag: [],
			filteredTemplatesText: [],
			recorder: this.initRecorder(),
			isRecording: false
		}
	},

	computed: {
		isMessageEmpty() {
			return !this.files.length && !this.message.trim()
		},
		isFileLoading() {
			return this.files.some(e => e.loading)
		},
		recordedTime() {
			return new Date(this.recorder.duration * 1000).toISOString().substr(14, 5)
		},
		shadowFooter() {
			return (
				!!this.filteredEmojis.length ||
				!!this.filteredUsersTag.length ||
				!!this.filteredTemplatesText.length ||
				!!this.files.length ||
				!!this.messageReply
			)
		}
	},

	watch: {
		roomId() {
			this.resetMessage(true, true)

			if (this.roomMessage) {
				this.message = this.roomMessage
				setTimeout(() => this.onChangeInput())
			}
		},
		message(val) {
			this.getTextareaRef().value = val
		},
		roomMessage: {
			immediate: true,
			handler(val) {
				if (val) this.message = this.roomMessage
			}
		},
		editedMessage(val) {
			this.$emit('update-edited-message-id', val._id)
		},
		initReplyMessage(val) {
			this.replyMessage(val)
		},
		initEditMessage(val) {
			this.editMessage(val)
		}
	},

	mounted() {
		const isMobile = detectMobile()

		this.getTextareaRef().addEventListener('keyup', e => {
			if (e.key === 'Enter' && !e.shiftKey && !this.fileDialog) {
				if (isMobile) {
					this.message = this.message + '\n'
					setTimeout(() => this.onChangeInput())
				} else if (
					!this.filteredEmojis.length &&
					!this.filteredUsersTag.length &&
					!this.filteredTemplatesText.length
				) {
					this.sendMessage()
				}
			}

			setTimeout(() => {
				this.updateFooterLists()
			}, 60)
		})

		this.getTextareaRef().addEventListener('click', () => {
			if (isMobile) this.keepKeyboardOpen = true
			this.updateFooterLists()
		})

		this.getTextareaRef().addEventListener('blur', () => {
			this.resetFooterList()
			if (isMobile) setTimeout(() => (this.keepKeyboardOpen = false))
		})
	},

	beforeDestroy() {
		this.stopRecorder()
	},

	methods: {
		getTextareaRef() {
			return this.$refs.roomTextarea
		},
		focusTextarea(disableMobileFocus) {
			if (detectMobile() && disableMobileFocus) return
			if (!this.getTextareaRef()) return
			this.getTextareaRef().focus()

			if (this.cursorRangePosition) {
				setTimeout(() => {
					this.getTextareaRef().setSelectionRange(
						this.cursorRangePosition,
						this.cursorRangePosition
					)
					this.cursorRangePosition = null
				})
			}
		},
		onChangeInput() {
			if (this.getTextareaRef()?.value || this.getTextareaRef()?.value === '') {
				this.message = this.getTextareaRef()?.value
			}
			this.keepKeyboardOpen = true
			this.resizeTextarea()
			this.$emit('typing-message', this.message)
		},
		resizeTextarea() {
			const el = this.getTextareaRef()

			if (!el) return

			const padding = window
				.getComputedStyle(el, null)
				.getPropertyValue('padding-top')
				.replace('px', '')

			el.style.height = 0
			el.style.height = el.scrollHeight - padding * 2 + 'px'
		},
		escapeTextarea() {
			if (this.filteredEmojis.length) this.filteredEmojis = []
			else if (this.filteredUsersTag.length) this.filteredUsersTag = []
			else if (this.filteredTemplatesText.length) {
				this.filteredTemplatesText = []
			} else this.resetMessage()
		},
		onPasteImage(pasteEvent) {
			const items = pasteEvent.clipboardData?.items

			if (items) {
				Array.from(items).forEach(item => {
					if (item.type.includes('image')) {
						const blob = item.getAsFile()
						this.onFileChange([blob])
					}
				})
			}
		},
		updateActiveUpOrDown(direction) {
			if (this.filteredEmojis.length) {
				this.activeUpOrDownEmojis = direction
			} else if (this.filteredUsersTag.length) {
				this.activeUpOrDownUsersTag = direction
			} else if (this.filteredTemplatesText.length) {
				this.activeUpOrDownTemplatesText = direction
			}
		},
		selectItem() {
			if (this.filteredEmojis.length) {
				this.selectEmojiItem = true
			} else if (this.filteredUsersTag.length) {
				this.selectUsersTagItem = true
			} else if (this.filteredTemplatesText.length) {
				this.selectTemplatesTextItem = true
			}
		},
		selectEmoji(emoji) {
			this.selectEmojiItem = false

			if (!emoji) return

			const { position, endPosition } = this.getCharPosition(':')

			this.message =
				this.message.substr(0, position - 1) +
				emoji +
				this.message.substr(endPosition, this.message.length - 1)

			this.cursorRangePosition = position
			this.focusTextarea()
		},
		selectTemplateText(template) {
			this.selectTemplatesTextItem = false

			if (!template) return

			const { position, endPosition } = this.getCharPosition('/')

			const space = this.message.substr(endPosition, endPosition).length
				? ''
				: ' '

			this.message =
				this.message.substr(0, position - 1) +
				template.text +
				space +
				this.message.substr(endPosition, this.message.length - 1)

			this.cursorRangePosition =
				position + template.text.length + space.length + 1

			this.focusTextarea()
		},
		addEmoji(emoji) {
			this.message += emoji.unicode
			this.focusTextarea(true)
		},
		launchFilePicker() {
			this.$refs.file.value = ''
			this.$refs.file.click()
		},
		async onFileChange(files) {
			this.fileDialog = true
			this.focusTextarea()

			Array.from(files).forEach(async file => {
				const fileURL = URL.createObjectURL(file)
				const typeIndex = file.name.lastIndexOf('.')

				this.files.push({
					loading: true,
					name: file.name.substring(0, typeIndex),
					size: file.size,
					type: file.type,
					extension: file.name.substring(typeIndex + 1),
					localUrl: fileURL
				})

				const blobFile = await fetch(fileURL).then(res => res.blob())

				let loadedFile = this.files.find(file => file.localUrl === fileURL)

				if (loadedFile) {
					loadedFile.blob = blobFile
					loadedFile.loading = false
					delete loadedFile.loading
				}
			})

			setTimeout(() => (this.fileDialog = false), 500)
		},
		removeFile(index) {
			this.files.splice(index, 1)
			this.focusTextarea()
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
		textareaActionHandler() {
			this.$emit('textarea-action-handler', this.message)
		},
		sendMessage() {
			let message = this.message.trim()

			if (!this.files.length && !message) return

			if (this.isFileLoading) return

			this.selectedUsersTag.forEach(user => {
				message = message.replace(
					`@${user.username}`,
					`<usertag>${user._id}</usertag>`
				)
			})

			const files = this.files.length ? this.files : null

			if (this.editedMessage._id) {
				if (
					this.editedMessage.content !== message ||
					this.editedMessage.files?.length ||
					this.files.length
				) {
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
		// eslint-disable-next-line vue/no-unused-properties
		editMessage(message) {
			this.resetMessage()

			this.editedMessage = { ...message }

			let messageContent = message.content
			const initialContent = messageContent

			const firstTag = '<usertag>'
			const secondTag = '</usertag>'

			const usertags = [
				...messageContent.matchAll(new RegExp(firstTag, 'gi'))
			].map(a => a.index)

			usertags.forEach(index => {
				const userId = initialContent.substring(
					index + firstTag.length,
					initialContent.indexOf(secondTag, index)
				)

				const user = this.room.users.find(user => user._id === userId)

				messageContent = messageContent.replace(
					`${firstTag}${userId}${secondTag}`,
					`@${user?.username || 'unknown'}`
				)

				this.selectUserTag(user, true)
			})

			this.message = messageContent

			if (message.files) {
				this.files = [...message.files]
			}

			setTimeout(() => this.resizeTextarea())
		},
		// eslint-disable-next-line vue/no-unused-properties
		replyMessage(message) {
			this.editedMessage = {}
			this.messageReply = message
			this.focusTextarea()
		},
		updateFooterLists() {
			this.updateFooterList('@')
			this.updateFooterList(':')
			this.updateFooterList('/')
		},
		updateFooterList(tagChar) {
			if (!this.getTextareaRef()) return

			if (tagChar === ':' && !this.emojisSuggestionEnabled) {
				return
			}

			if (tagChar === '@' && (!this.userTagsEnabled || !this.room.users)) {
				return
			}

			if (tagChar === '/' && !this.templatesText) {
				return
			}

			const textareaCursorPosition = this.getTextareaRef().selectionStart

			let position = textareaCursorPosition

			while (
				position > 0 &&
				this.message.charAt(position - 1) !== tagChar &&
				// eslint-disable-next-line no-unmodified-loop-condition
				(this.message.charAt(position - 1) !== ' ' || tagChar !== ':')
			) {
				position--
			}

			const beforeTag = this.message.charAt(position - 2)
			const notLetterNumber = !beforeTag.match(/^[0-9a-zA-Z]+$/)

			if (
				this.message.charAt(position - 1) === tagChar &&
				(!beforeTag || beforeTag === ' ' || notLetterNumber)
			) {
				const query = this.message.substring(position, textareaCursorPosition)
				if (tagChar === ':') {
					this.updateEmojis(query)
				} else if (tagChar === '@') {
					this.updateShowUsersTag(query)
				} else if (tagChar === '/') {
					this.updateShowTemplatesText(query)
				}
			} else {
				this.resetFooterList(tagChar)
			}
		},
		updateShowUsersTag(query) {
			this.filteredUsersTag = filteredItems(
				this.room.users,
				'username',
				query,
				true
			).filter(user => user._id !== this.currentUserId)
		},
		selectUserTag(user, editMode = false) {
			this.selectUsersTagItem = false

			if (!user) return

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

			if (!editMode) {
				this.cursorRangePosition =
					position + user.username.length + space.length + 1
			}

			this.focusTextarea()
		},
		updateShowTemplatesText(query) {
			this.filteredTemplatesText = filteredItems(
				this.templatesText,
				'tag',
				query,
				true
			)
		},
		getCharPosition(tagChar) {
			const cursorPosition = this.getTextareaRef().selectionStart

			let position = cursorPosition
			while (position > 0 && this.message.charAt(position - 1) !== tagChar) {
				position--
			}

			const endPosition = this.getTextareaRef().selectionEnd

			return { position, endPosition }
		},
		async updateEmojis(query) {
			if (!query) return

			const emojis = await this.emojisDB.getEmojiBySearchQuery(query)
			this.filteredEmojis = emojis.map(emoji => emoji.unicode)
		},
		resetFooterList(tagChar = null) {
			if (tagChar === ':') {
				this.filteredEmojis = []
			} else if (tagChar === '@') {
				this.filteredUsersTag = []
			} else if (tagChar === '/') {
				this.filteredTemplatesText = []
			} else {
				this.filteredEmojis = []
				this.filteredUsersTag = []
				this.filteredTemplatesText = []
			}
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
			if (this.getTextareaRef()) {
				this.getTextareaRef().style.height = '20px'
			}
		},
		preventKeyboardFromClosing() {
			if (this.keepKeyboardOpen) this.getTextareaRef().focus()
		},
		initRecorder() {
			this.isRecording = false

			return new Recorder({
				bitRate: this.audioBitRate,
				sampleRate: this.audioSampleRate,
				beforeRecording: null,
				afterRecording: null,
				pauseRecording: null,
				micFailed: this.micFailed
			})
		},
		micFailed() {
			this.isRecording = false
			this.recorder = this.initRecorder()
		}
	}
}
</script>
