<template>
	<div class="card-window" :style="[{ height }, cssVars]">
		<div class="chat-container">
			<rooms-list
				:rooms="rooms"
				:loadingRooms="loadingRooms"
				:room="room"
				:textMessages="t"
				:showRoomsList="showRoomsList"
				:isMobile="isMobile"
				@fetchRoom="fetchRoom"
				@addRoom="addRoom"
			>
			</rooms-list>
			<messages-list
				:currentUserId="currentUserId"
				:room="room"
				:messages="messages"
				:messagesLoaded="messagesLoaded"
				:menuActions="menuActions"
				:messageActions="messageActions"
				:showFiles="showFiles"
				:showEmojis="showEmojis"
				:showReactionEmojis="showReactionEmojis"
				:textMessages="t"
				:showRoomsList="showRoomsList"
				:isMobile="isMobile"
				@toggleRoomsList="toggleRoomsList"
				@fetchMessages="fetchMessages"
				@sendMessage="sendMessage"
				@editMessage="editMessage"
				@deleteMessage="deleteMessage"
				@openFile="openFile"
				@menuActionHandler="menuActionHandler"
				@messageActionHandler="messageActionHandler"
				@sendMessageReaction="sendMessageReaction"
			>
			</messages-list>
		</div>
	</div>
</template>

<script>
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'
const { roomsValid, partcipantsValid } = require('../utils/roomValidation')
import locales from '../locales'
import { defaultThemeColors, cssThemeVars } from '../themes'

export default {
	name: 'chat-container',
	components: {
		RoomsList,
		MessagesList
	},

	props: {
		height: { type: String, default: '600px' },
		theme: { type: String, default: 'light' },
		colors: { type: Object, default: null },
		textMessages: { type: Object, default: null },
		currentUserId: { type: String, default: '' },
		rooms: { type: Array, default: () => [] },
		loadingRooms: { type: Boolean, default: false },
		messages: { type: Array, default: () => [] },
		messagesLoaded: { type: Boolean, default: false },
		menuActions: { type: Array, default: () => [] },
		messageActions: {
			type: Array,
			default: () => [
				{ name: 'replyMessage', title: 'Reply' },
				{ name: 'editMessage', title: 'Edit Message', onlyMe: true },
				{ name: 'deleteMessage', title: 'Delete Message', onlyMe: true }
			]
		},
		showFiles: { type: Boolean, default: true },
		showEmojis: { type: Boolean, default: true },
		showReactionEmojis: { type: Boolean, default: true },
		newMessage: { type: Object, default: null }
	},

	data() {
		return {
			room: {},
			showRoomsList: true,
			mobileBreakpoint: 700,
			isMobile: false
		}
	},

	watch: {
		rooms(val) {
			if (val[0]) this.fetchRoom({ room: val[0] })
		},

		room(val) {
			if (!val) return

			if (Object.entries(val).length === 0) return

			if (!roomsValid(val))
				throw 'Rooms object is not valid! Must contain roomId[String, Number], roomName[String] and users[Array]'

			val.users.forEach(user => {
				if (!partcipantsValid(user))
					throw 'Participants object is not valid! Must contain _id[String, Number] and username[String]'
			})
		},

		newMessage(val) {
			this.$set(this.messages, val.index, val.message)
		}
	},

	mounted() {
		this.updateResponsive()
		window.addEventListener('resize', () => this.updateResponsive())
	},

	computed: {
		t() {
			return {
				...locales,
				...this.textMessages
			}
		},
		cssVars() {
			const themeColors = {
				...defaultThemeColors[this.theme],
				...this.colors
			}

			return cssThemeVars(themeColors)
		}
	},

	methods: {
		updateResponsive() {
			this.isMobile = window.innerWidth < this.mobileBreakpoint
			this.showRoomsList = !this.isMobile
		},
		toggleRoomsList() {
			this.showRoomsList = !this.showRoomsList
			if (this.isMobile) this.room = {}
		},
		fetchRoom({ room }) {
			this.room = room
			this.fetchMessages({ reset: true })
			if (this.isMobile) this.showRoomsList = false
		},
		addRoom() {
			this.$emit('addRoom')
		},
		fetchMessages(options) {
			this.$emit('fetchMessages', { room: this.room, options })
		},
		sendMessage(message) {
			this.$emit('sendMessage', { ...message, roomId: this.room.roomId })
		},
		editMessage(message) {
			this.$emit('editMessage', { ...message, roomId: this.room.roomId })
		},
		deleteMessage(messageId) {
			this.$emit('deleteMessage', { messageId, roomId: this.room.roomId })
		},
		openFile(message) {
			this.$emit('openFile', message)
		},
		menuActionHandler(ev) {
			this.$emit('menuActionHandler', { action: ev, roomId: this.room.roomId })
		},
		messageActionHandler(ev) {
			this.$emit('messageActionHandler', {
				action: ev,
				roomId: this.room.roomId
			})
		},
		sendMessageReaction(messageReaction) {
			this.$emit('sendMessageReaction', {
				...messageReaction,
				roomId: this.room.roomId
			})
		}
	}
}
</script>

<style lang="scss">
@import '../styles/index.scss';

* {
	font-family: inherit;
}

.card-window {
	width: 100%;
	border-radius: 4px;
	display: block;
	max-width: 100%;
	background: var(--chat-content-bg-color);
	color: var(--chat-color);
	overflow-wrap: break-word;
	position: relative;
	white-space: normal;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.chat-container {
	height: 100%;
	display: flex;
}
</style>
