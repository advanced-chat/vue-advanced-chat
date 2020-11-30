<template>
	<div class="card-window" :style="[{ height }, cssVars]">
		<div class="chat-container">
			<rooms-list
				v-if="!singleRoom"
				:currentUserId="currentUserId"
				:rooms="orderedRooms"
				:loadingRooms="loadingRooms"
				:room="room"
				:textMessages="t"
				:showAddRoom="showAddRoom"
				:showRoomsList="showRoomsList"
				:textFormatting="textFormatting"
				:isMobile="isMobile"
				@fetchRoom="fetchRoom"
				@addRoom="addRoom"
			>
				<template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
					<slot :name="name" v-bind="data"></slot>
				</template>
			</rooms-list>

			<room
				:currentUserId="currentUserId"
				:rooms="rooms"
				:roomId="room.roomId || ''"
				:messages="messages"
				:roomMessage="roomMessage"
				:messagesLoaded="messagesLoaded"
				:menuActions="menuActions"
				:messageActions="messageActions"
				:showSendIcon="showSendIcon"
				:showFiles="showFiles"
				:showAudio="showAudio"
				:showEmojis="showEmojis"
				:showReactionEmojis="showReactionEmojis"
				:showNewMessagesDivider="showNewMessagesDivider"
				:textMessages="t"
				:singleRoom="singleRoom"
				:showRoomsList="showRoomsList"
				:textFormatting="textFormatting"
				:isMobile="isMobile"
				:loadingRooms="loadingRooms"
				:roomInfo="$listeners.roomInfo"
				:textareaAction="$listeners.textareaActionHandler"
				@toggleRoomsList="toggleRoomsList"
				@roomInfo="roomInfo"
				@fetchMessages="fetchMessages"
				@sendMessage="sendMessage"
				@editMessage="editMessage"
				@deleteMessage="deleteMessage"
				@openFile="openFile"
				@menuActionHandler="menuActionHandler"
				@messageActionHandler="messageActionHandler"
				@sendMessageReaction="sendMessageReaction"
				@typingMessage="typingMessage"
				@textareaActionHandler="textareaActionHandler"
			>
				<template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
					<slot :name="name" v-bind="data"></slot>
				</template>
			</room>
		</div>
	</div>
</template>

<script>
import RoomsList from './RoomsList'
import Room from './Room'

import locales from '../locales'
import { defaultThemeStyles, cssThemeVars } from '../themes'
const { roomsValid, partcipantsValid } = require('../utils/roomValidation')

export default {
	name: 'chat-container',
	components: {
		RoomsList,
		Room
	},

	props: {
		height: { type: String, default: '600px' },
		theme: { type: String, default: 'light' },
		styles: { type: Object, default: () => ({}) },
		responsiveBreakpoint: { type: Number, default: 900 },
		singleRoom: { type: Boolean, default: false },
		textMessages: { type: Object, default: null },
		currentUserId: { type: [String, Number], default: '' },
		rooms: { type: Array, default: () => [] },
		loadingRooms: { type: Boolean, default: false },
		roomId: { type: [String, Number], default: null },
		loadFirstRoom: { type: Boolean, default: true },
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
		showAddRoom: { type: Boolean, default: true },
		showSendIcon: { type: Boolean, default: true },
		showFiles: { type: Boolean, default: true },
		showAudio: { type: Boolean, default: true },
		showEmojis: { type: Boolean, default: true },
		showReactionEmojis: { type: Boolean, default: true },
		showNewMessagesDivider: { type: Boolean, default: true },
		textFormatting: { type: Boolean, default: true },
		newMessage: { type: Object, default: null },
		roomMessage: { type: String, default: '' }
	},

	data() {
		return {
			room: {},
			showRoomsList: true,
			isMobile: false
		}
	},

	watch: {
		rooms: {
			immediate: true,
			handler(newVal, oldVal) {
				if (!this.loadFirstRoom) return (this.showRoomsList = true)

				if (
					!newVal[0] ||
					!newVal.find(room => room.roomId === this.room.roomId)
				) {
					this.showRoomsList = true
				}

				if (newVal[0] && (!oldVal || newVal.length !== oldVal.length)) {
					if (this.roomId) {
						const room = newVal.find(r => r.roomId === this.roomId)
						this.fetchRoom({ room })
					} else if (!this.isMobile || this.singleRoom) {
						this.fetchRoom({ room: this.orderedRooms[0] })
					} else {
						this.showRoomsList = true
					}
				}
			}
		},

		roomId: {
			immediate: true,
			handler(val) {
				if (val && !this.loadingRooms && this.rooms.length) {
					const room = this.rooms.find(r => r.roomId === val)
					this.fetchRoom({ room })
				}
			}
		},

		room(val) {
			if (!val) return

			if (Object.entries(val).length === 0) return

			if (!roomsValid(val)) {
				throw 'Rooms object is not valid! Must contain roomId[String, Number], roomName[String] and users[Array]'
			}

			val.users.forEach(user => {
				if (!partcipantsValid(user)) {
					throw 'Participants object is not valid! Must contain _id[String, Number] and username[String]'
				}
			})
		},

		newMessage(val) {
			this.$set(this.messages, val.index, val.message)
		}
	},

	created() {
		this.updateResponsive()
		window.addEventListener('resize', ev => {
			if (ev.isTrusted) this.updateResponsive()
		})
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
				const aVal = a.lastMessage || { date: 0 }
				const bVal = b.lastMessage || { date: 0 }

				return aVal.date > bVal.date ? -1 : bVal.date > aVal.date ? 1 : 0
			})
		}
	},

	methods: {
		updateResponsive() {
			this.isMobile = window.innerWidth < this.responsiveBreakpoint
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
		roomInfo() {
			this.$emit('roomInfo', this.room)
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
		openFile({ message, action }) {
			this.$emit('openFile', { message, action })
		},
		menuActionHandler(ev) {
			this.$emit('menuActionHandler', { action: ev, roomId: this.room.roomId })
		},
		messageActionHandler(ev) {
			this.$emit('messageActionHandler', {
				...ev,
				roomId: this.room.roomId
			})
		},
		sendMessageReaction(messageReaction) {
			this.$emit('sendMessageReaction', {
				...messageReaction,
				roomId: this.room.roomId
			})
		},
		typingMessage(message) {
			this.$emit('typingMessage', {
				message,
				roomId: this.room.roomId
			})
		},
		textareaActionHandler(message) {
			this.$emit('textareaActionHandler', {
				message,
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

a {
	color: #0d579c;
}

.card-window {
	width: 100%;
	display: block;
	max-width: 100%;
	background: var(--chat-content-bg-color);
	color: var(--chat-color);
	overflow-wrap: break-word;
	position: relative;
	white-space: normal;
	border: var(--chat-container-border);
	border-radius: var(--chat-container-border-radius);
	box-shadow: var(--chat-container-box-shadow);
}

.chat-container {
	height: 100%;
	display: flex;

	input {
		min-width: 10px;
	}

	textarea,
	input[type='text'],
	input[type='search'] {
		-webkit-appearance: none;
	}
}
</style>
