<template>
	<div class="vac-card-window" :style="[{ height }, cssVars]">
		<div class="vac-chat-container">
			<rooms-list
				v-if="!singleRoomCasted"
				:current-user-id="currentUserId"
				:rooms="orderedRooms"
				:loading-rooms="loadingRoomsCasted"
				:rooms-loaded="roomsLoadedCasted"
				:room="room"
				:room-actions="roomActions"
				:text-messages="t"
				:show-search="showSearchCasted"
				:show-add-room="showAddRoomCasted"
				:show-rooms-list="showRoomsList"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				:is-mobile="isMobile"
				:scroll-distance="scrollDistance"
				@fetch-room="fetchRoom"
				@fetch-more-rooms="fetchMoreRooms"
				@loading-more-rooms="loadingMoreRooms = $event"
				@add-room="addRoom"
				@room-action-handler="roomActionHandler"
			>
				<template v-for="(i, name) in $slots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</rooms-list>

			<room
				:current-user-id="currentUserId"
				:rooms="roomsCasted"
				:room-id="room.roomId || ''"
				:load-first-room="loadFirstRoomCasted"
				:messages="messagesCasted"
				:room-message="roomMessage"
				:messages-loaded="messagesLoadedCasted"
				:menu-actions="menuActions"
				:message-actions="messageActions"
				:message-selection-actions="messageSelectionActions"
				:auto-scroll="autoScroll"
				:show-send-icon="showSendIconCasted"
				:show-files="showFilesCasted"
				:show-audio="showAudioCasted"
				:audio-bit-rate="audioBitRate"
				:audio-sample-rate="audioSampleRate"
				:show-emojis="showEmojisCasted"
				:show-reaction-emojis="showReactionEmojisCasted"
				:show-new-messages-divider="showNewMessagesDividerCasted"
				:show-footer="showFooterCasted"
				:text-messages="t"
				:single-room="singleRoomCasted"
				:show-rooms-list="showRoomsList"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				:is-mobile="isMobile"
				:loading-rooms="loadingRoomsCasted"
				:room-info-enabled="roomInfoEnabledCasted"
				:textarea-action-enabled="textareaActionEnabledCasted"
				:textarea-auto-focus="textareaAutoFocusCasted"
				:user-tags-enabled="userTagsEnabledCasted"
				:emojis-suggestion-enabled="emojisSuggestionEnabledCasted"
				:scroll-distance="scrollDistance"
				:accepted-files="acceptedFiles"
				:templates-text="templatesText"
				:username-options="usernameOptions"
				@toggle-rooms-list="toggleRoomsList"
				@room-info="roomInfo"
				@fetch-messages="fetchMessages"
				@send-message="sendMessage"
				@edit-message="editMessage"
				@delete-message="deleteMessage"
				@open-file="openFile"
				@open-user-tag="openUserTag"
				@open-failed-message="openFailedMessage"
				@menu-action-handler="menuActionHandler"
				@message-action-handler="messageActionHandler"
				@message-selection-action-handler="messageSelectionActionHandler"
				@send-message-reaction="sendMessageReaction"
				@typing-message="typingMessage"
				@textarea-action-handler="textareaActionHandler"
			>
				<template v-for="(i, name) in $slots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</room>
		</div>
		<transition name="vac-fade-preview" appear>
			<media-preview
				v-if="showMediaPreview"
				:file="previewFile"
				@close-media-preview="showMediaPreview = false"
			/>
		</transition>
	</div>
</template>

<script>
import RoomsList from './RoomsList/RoomsList'
import Room from './Room/Room'
import MediaPreview from './MediaPreview/MediaPreview'

import locales from '../locales'
import { defaultThemeStyles, cssThemeVars } from '../themes'
import {
	roomsValidation,
	partcipantsValidation
} from '../utils/data-validation'

export default {
	name: 'ChatContainer',
	components: {
		RoomsList,
		Room,
		MediaPreview
	},

	props: {
		height: { type: String, default: '600px' },
		theme: { type: String, default: 'light' },
		styles: { type: [Object, String], default: () => ({}) },
		responsiveBreakpoint: { type: Number, default: 900 },
		singleRoom: { type: [Boolean, String], default: false },
		roomsListOpened: { type: [Boolean, String], default: true },
		textMessages: { type: [Object, String], default: null },
		currentUserId: { type: String, default: '' },
		rooms: { type: [Array, String], default: null },
		roomsOrder: { type: String, default: 'desc' },
		loadingRooms: { type: [Boolean, String], default: false },
		roomsLoaded: { type: [Boolean, String], default: false },
		roomId: { type: String, default: null },
		loadFirstRoom: { type: [Boolean, String], default: true },
		messages: { type: [Array, String], default: null },
		messagesLoaded: { type: [Boolean, String], default: false },
		roomActions: { type: Array, default: () => [] },
		menuActions: { type: Array, default: () => [] },
		messageActions: {
			type: Array,
			default: () => [
				{ name: 'replyMessage', title: 'Reply' },
				{ name: 'editMessage', title: 'Edit Message', onlyMe: true },
				{ name: 'deleteMessage', title: 'Delete Message', onlyMe: true },
				{ name: 'selectMessages', title: 'Select' }
			]
		},
		messageSelectionActions: { type: Array, default: () => [] },
		autoScroll: {
			type: Object,
			default: () => {
				return {
					send: {
						new: true,
						newAfterScrollUp: true
					},
					receive: {
						new: true,
						newAfterScrollUp: false
					}
				}
			}
		},
		showSearch: { type: [Boolean, String], default: true },
		showAddRoom: { type: [Boolean, String], default: true },
		showSendIcon: { type: [Boolean, String], default: true },
		showFiles: { type: [Boolean, String], default: true },
		showAudio: { type: [Boolean, String], default: true },
		audioBitRate: { type: Number, default: 128 },
		audioSampleRate: { type: Number, default: 44100 },
		showEmojis: { type: [Boolean, String], default: true },
		showReactionEmojis: { type: [Boolean, String], default: true },
		showNewMessagesDivider: { type: [Boolean, String], default: true },
		showFooter: { type: [Boolean, String], default: true },
		textFormatting: {
			type: Object,
			default: () => ({
				disabled: false,
				italic: '_',
				bold: '*',
				strike: '~',
				underline: '°',
				multilineCode: '```',
				inlineCode: '`'
			})
		},
		linkOptions: {
			type: Object,
			default: () => ({ disabled: false, target: '_blank', rel: null })
		},
		roomInfoEnabled: { type: [Boolean, String], default: false },
		textareaActionEnabled: { type: [Boolean, String], default: false },
		textareaAutoFocus: { type: [Boolean, String], default: true },
		userTagsEnabled: { type: [Boolean, String], default: true },
		emojisSuggestionEnabled: { type: [Boolean, String], default: true },
		roomMessage: { type: String, default: '' },
		scrollDistance: { type: Number, default: 60 },
		acceptedFiles: { type: String, default: '*' },
		templatesText: { type: [Array, String], default: null },
		mediaPreviewEnabled: { type: [Boolean, String], default: true },
		usernameOptions: {
			type: Object,
			default: () => ({ minUsers: 3, currentUser: false })
		}
	},

	emits: [
		'toggle-rooms-list',
		'room-info',
		'fetch-messages',
		'send-message',
		'edit-message',
		'delete-message',
		'open-file',
		'open-user-tag',
		'open-failed-message',
		'menu-action-handler',
		'message-action-handler',
		'send-message-reaction',
		'typing-message',
		'textarea-action-handler',
		'fetch-more-rooms',
		'add-room',
		'room-action-handler',
		'message-selection-action-handler'
	],

	data() {
		return {
			room: {},
			loadingMoreRooms: false,
			showRoomsList: true,
			isMobile: false,
			showMediaPreview: false,
			previewFile: {}
		}
	},

	computed: {
		t() {
			return {
				...locales,
				...this.textMessages
			}
		},
		cssVars() {
			const defaultStyles = defaultThemeStyles[this.theme]
			const customStyles = {}

			Object.keys(defaultStyles).map(key => {
				customStyles[key] = {
					...defaultStyles[key],
					...(this.styles[key] || {})
				}
			})

			return cssThemeVars(customStyles)
		},
		orderedRooms() {
			return this.roomsCasted.slice().sort((a, b) => {
				const aVal = a.index || 0
				const bVal = b.index || 0

				if (this.roomsOrder === 'asc') {
					return aVal < bVal ? -1 : bVal < aVal ? 1 : 0
				}

				return aVal > bVal ? -1 : bVal > aVal ? 1 : 0
			})
		},
		roomsCasted() {
			return this.rooms || []
		},
		messagesCasted() {
			return this.messages || []
		},
		singleRoomCasted() {
			return this.castBooleanToString(this.singleRoom)
		},
		roomsListOpenedCasted() {
			return this.castBooleanToString(this.roomsListOpened)
		},
		loadingRoomsCasted() {
			return this.castBooleanToString(this.loadingRooms)
		},
		roomsLoadedCasted() {
			return this.castBooleanToString(this.roomsLoaded)
		},
		loadFirstRoomCasted() {
			return this.castBooleanToString(this.loadFirstRoom)
		},
		messagesLoadedCasted() {
			return this.castBooleanToString(this.messagesLoaded)
		},
		showSearchCasted() {
			return this.castBooleanToString(this.showSearch)
		},
		showAddRoomCasted() {
			return this.castBooleanToString(this.showAddRoom)
		},
		showSendIconCasted() {
			return this.castBooleanToString(this.showSendIcon)
		},
		showFilesCasted() {
			return this.castBooleanToString(this.showFiles)
		},
		showAudioCasted() {
			return this.castBooleanToString(this.showAudio)
		},
		showEmojisCasted() {
			return this.castBooleanToString(this.showEmojis)
		},
		showReactionEmojisCasted() {
			return this.castBooleanToString(this.showReactionEmojis)
		},
		showNewMessagesDividerCasted() {
			return this.castBooleanToString(this.showNewMessagesDivider)
		},
		showFooterCasted() {
			return this.castBooleanToString(this.showFooter)
		},
		roomInfoEnabledCasted() {
			return this.castBooleanToString(this.roomInfoEnabled)
		},
		textareaActionEnabledCasted() {
			return this.castBooleanToString(this.textareaActionEnabled)
		},
		textareaAutoFocusCasted() {
			return this.castBooleanToString(this.textareaAutoFocus)
		},
		userTagsEnabledCasted() {
			return this.castBooleanToString(this.userTagsEnabled)
		},
		emojisSuggestionEnabledCasted() {
			return this.castBooleanToString(this.emojisSuggestionEnabled)
		},
		mediaPreviewEnabledCasted() {
			return this.castBooleanToString(this.mediaPreviewEnabled)
		}
	},

	watch: {
		rooms: {
			immediate: true,
			deep: true,
			handler(newVal, oldVal) {
				if (
					!newVal[0] ||
					!newVal.find(room => room.roomId === this.room.roomId)
				) {
					this.showRoomsList = true
				}

				if (
					!this.loadingMoreRooms &&
					this.loadFirstRoomCasted &&
					newVal[0] &&
					(!oldVal || newVal.length !== oldVal.length)
				) {
					if (this.roomId) {
						const room = newVal.find(r => r.roomId === this.roomId) || {}
						this.fetchRoom({ room })
					} else if (!this.isMobile || this.singleRoomCasted) {
						this.fetchRoom({ room: this.orderedRooms[0] })
					} else {
						this.showRoomsList = true
					}
				}
			}
		},

		loadingRoomsCasted(val) {
			if (val) this.room = {}
		},

		roomId: {
			immediate: true,
			handler(newVal, oldVal) {
				if (newVal && !this.loadingRoomsCasted && this.roomsCasted.length) {
					const room = this.roomsCasted.find(r => r.roomId === newVal)
					this.fetchRoom({ room })
				} else if (oldVal && !newVal) {
					this.room = {}
				}
			}
		},

		room(val) {
			if (!val || Object.entries(val).length === 0) return

			roomsValidation(val)

			val.users.forEach(user => {
				partcipantsValidation(user)
			})
		},

		roomsListOpenedCasted(val) {
			this.showRoomsList = val
		}
	},

	created() {
		this.updateResponsive()
		window.addEventListener('resize', ev => {
			if (ev.isTrusted) this.updateResponsive()
		})
	},

	methods: {
		castBooleanToString(val) {
			return val === 'true' || val === true
		},
		updateResponsive() {
			this.isMobile = window.innerWidth < Number(this.responsiveBreakpoint)
		},
		toggleRoomsList() {
			this.showRoomsList = !this.showRoomsList
			if (this.isMobile) this.room = {}
			this.$emit('toggle-rooms-list', { opened: this.showRoomsList })
		},
		fetchRoom({ room }) {
			this.room = room
			this.fetchMessages({ reset: true })
			if (this.isMobile) this.showRoomsList = false
		},
		fetchMoreRooms() {
			this.$emit('fetch-more-rooms')
		},
		roomInfo() {
			this.$emit('room-info', this.room)
		},
		addRoom() {
			this.$emit('add-room')
		},
		fetchMessages(options) {
			this.$emit('fetch-messages', { room: this.room, options })
		},
		sendMessage(message) {
			this.$emit('send-message', { ...message, roomId: this.room.roomId })
		},
		editMessage(message) {
			this.$emit('edit-message', { ...message, roomId: this.room.roomId })
		},
		deleteMessage(message) {
			this.$emit('delete-message', { message, roomId: this.room.roomId })
		},
		openFile({ message, file }) {
			if (this.mediaPreviewEnabledCasted && file.action === 'preview') {
				this.previewFile = file.file
				this.showMediaPreview = true
			} else {
				this.$emit('open-file', { message, file })
			}
		},
		openUserTag({ user }) {
			this.$emit('open-user-tag', { user })
		},
		openFailedMessage({ message }) {
			this.$emit('open-failed-message', {
				message,
				roomId: this.room.roomId
			})
		},
		menuActionHandler(ev) {
			this.$emit('menu-action-handler', {
				action: ev,
				roomId: this.room.roomId
			})
		},
		roomActionHandler({ action, roomId }) {
			this.$emit('room-action-handler', {
				action,
				roomId
			})
		},
		messageActionHandler(ev) {
			this.$emit('message-action-handler', {
				...ev,
				roomId: this.room.roomId
			})
		},
		messageSelectionActionHandler(ev) {
			this.$emit('message-selection-action-handler', {
				...ev,
				roomId: this.room.roomId
			})
		},
		sendMessageReaction(messageReaction) {
			this.$emit('send-message-reaction', {
				...messageReaction,
				roomId: this.room.roomId
			})
		},
		typingMessage(message) {
			this.$emit('typing-message', {
				message,
				roomId: this.room.roomId
			})
		},
		textareaActionHandler(message) {
			this.$emit('textarea-action-handler', {
				message,
				roomId: this.room.roomId
			})
		}
	}
}
</script>

<style lang="scss">
@import '../styles/index.scss';
</style>
