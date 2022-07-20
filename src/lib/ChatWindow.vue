<template>
	<div class="vac-card-window" :style="[{ height }, cssVars]">
		<div class="vac-chat-container">
			<rooms-list
				v-if="!singleRoom"
				:current-user-id="currentUserId"
				:rooms="orderedRooms"
				:loading-rooms="loadingRooms"
				:rooms-loaded="roomsLoaded"
				:room="room"
				:room-actions="roomActions"
				:text-messages="t"
				:show-search="showSearch"
				:show-add-room="showAddRoom"
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
				:rooms="rooms"
				:room-id="room.roomId || ''"
				:load-first-room="loadFirstRoom"
				:messages="messages"
				:room-message="roomMessage"
				:messages-loaded="messagesLoaded"
				:menu-actions="menuActions"
				:message-actions="messageActions"
				:message-selection-actions="messageSelectionActions"
				:auto-scroll="autoScroll"
				:show-send-icon="showSendIcon"
				:show-files="showFiles"
				:show-audio="showAudio"
				:audio-bit-rate="audioBitRate"
				:audio-sample-rate="audioSampleRate"
				:show-emojis="showEmojis"
				:show-reaction-emojis="showReactionEmojis"
				:show-new-messages-divider="showNewMessagesDivider"
				:show-footer="showFooter"
				:text-messages="t"
				:single-room="singleRoom"
				:show-rooms-list="showRoomsList"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				:is-mobile="isMobile"
				:loading-rooms="loadingRooms"
				:room-info-enabled="roomInfoEnabled"
				:textarea-action-enabled="textareaActionEnabled"
				:textarea-auto-focus="textareaAutoFocus"
				:user-tags-enabled="userTagsEnabled"
				:emojis-suggestion-enabled="emojisSuggestionEnabled"
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
		styles: { type: Object, default: () => ({}) },
		responsiveBreakpoint: { type: Number, default: 900 },
		singleRoom: { type: Boolean, default: false },
		roomsListOpened: { type: Boolean, default: true },
		textMessages: { type: Object, default: null },
		currentUserId: { type: [String, Number], default: '' },
		rooms: { type: Array, default: () => [] },
		roomsOrder: { type: String, default: 'desc' },
		loadingRooms: { type: Boolean, default: false },
		roomsLoaded: { type: Boolean, default: false },
		roomId: { type: [String, Number], default: null },
		loadFirstRoom: { type: Boolean, default: true },
		messages: { type: Array, default: () => [] },
		messagesLoaded: { type: Boolean, default: false },
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
		showSearch: { type: Boolean, default: true },
		showAddRoom: { type: Boolean, default: true },
		showSendIcon: { type: Boolean, default: true },
		showFiles: { type: Boolean, default: true },
		showAudio: { type: Boolean, default: true },
		audioBitRate: { type: Number, default: 128 },
		audioSampleRate: { type: Number, default: 44100 },
		showEmojis: { type: Boolean, default: true },
		showReactionEmojis: { type: Boolean, default: true },
		showNewMessagesDivider: { type: Boolean, default: true },
		showFooter: { type: Boolean, default: true },
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
		roomInfoEnabled: { type: Boolean, default: false },
		textareaActionEnabled: { type: Boolean, default: false },
		textareaAutoFocus: { type: Boolean, default: true },
		userTagsEnabled: { type: Boolean, default: true },
		emojisSuggestionEnabled: { type: Boolean, default: true },
		roomMessage: { type: String, default: '' },
		scrollDistance: { type: Number, default: 60 },
		acceptedFiles: { type: String, default: '*' },
		templatesText: { type: Array, default: null },
		mediaPreviewEnabled: { type: Boolean, default: true },
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
			return this.rooms.slice().sort((a, b) => {
				const aVal = a.index || 0
				const bVal = b.index || 0

				if (this.roomsOrder === 'asc') {
					return aVal < bVal ? -1 : bVal < aVal ? 1 : 0
				}

				return aVal > bVal ? -1 : bVal > aVal ? 1 : 0
			})
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
					this.loadFirstRoom &&
					newVal[0] &&
					(!oldVal || newVal.length !== oldVal.length)
				) {
					if (this.roomId) {
						const room = newVal.find(r => r.roomId === this.roomId) || {}
						this.fetchRoom({ room })
					} else if (!this.isMobile || this.singleRoom) {
						this.fetchRoom({ room: this.orderedRooms[0] })
					} else {
						this.showRoomsList = true
					}
				}
			}
		},

		loadingRooms(val) {
			if (val) this.room = {}
		},

		roomId: {
			immediate: true,
			handler(newVal, oldVal) {
				if (newVal && !this.loadingRooms && this.rooms.length) {
					const room = this.rooms.find(r => r.roomId === newVal)
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

		roomsListOpened(val) {
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
		updateResponsive() {
			this.isMobile = window.innerWidth < this.responsiveBreakpoint
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
			if (this.mediaPreviewEnabled && file.action === 'preview') {
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
