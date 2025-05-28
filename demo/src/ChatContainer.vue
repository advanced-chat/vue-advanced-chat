<template>
	<vue-advanced-chat
		:height="screenHeight"
		:theme="theme"
		:styles="JSON.stringify(styles)"
		:current-user-id="currentUserId"
		:room-id="roomId"
		:rooms="JSON.stringify(rooms)"
		:messages="JSON.stringify(messages)"
		:room-message="roomMessage"
		:messages-loaded="messagesLoaded"
		:rooms-loaded="roomsLoaded"
		:show-search="showSearch"
		:show-add-room="showAddRoom"
		:show-send-icon="showSendIcon"
		:show-files="showFiles"
		:show-audio="showAudio"
		:audio-bit-rate="audioBitRate"
		:audio-sample-rate="audioSampleRate"
		:show-emojis="showEmojis"
		:show-reaction-emojis="showReactionEmojis"
		:show-new-messages-divider="showNewMessagesDivider"
		:show-footer="showFooter"
		:text-messages="JSON.stringify(textMessages)"
		:text-formatting="JSON.stringify(textFormatting)"
		:link-options="JSON.stringify(linkOptions)"
		:room-info-enabled="roomInfoEnabled"
		:textarea-action-enabled="textareaActionEnabled"
		:textarea-auto-focus="textareaAutoFocus"
		:user-tags-enabled="userTagsEnabled"
		:emojis-suggestion-enabled="emojisSuggestionEnabled"
		:media-preview-enabled="mediaPreviewEnabled"
		:single-room="singleRoom"
		:rooms-list-opened="roomsListOpened"
		:loading-rooms="loadingRooms"
		:load-first-room="loadFirstRoom"
		:room-actions="JSON.stringify(roomActions)"
		:menu-actions="JSON.stringify(menuActions)"
		:message-actions="JSON.stringify(messageActions)"
		:message-selection-actions="JSON.stringify(messageSelectionActions)"
		:multiple-files="multipleFiles"
		:templates-text="JSON.stringify(templatesText)"
		:auto-scroll="JSON.stringify(autoScroll)"
		:username-options="JSON.stringify(usernameOptions)"
		:responsive-breakpoint="responsiveBreakpoint"
		:scroll-distance="scrollDistance"
		:accepted-files="acceptedFiles"
		:capture-files="captureFiles"
		:emoji-data-source="emojiDataSource"
		:jjsip-sip-uri="jjsipSipUri"
		:jjsip-password="jjsipPassword"
		:jjsip-web-socket-server="jjsipWebSocketServer"
		:jjsip-display-name="jjsipDisplayName"
		@fetch-messages="fetchMessages($event.detail[0])"
		@send-message="sendMessage($event.detail[0])"
		@edit-message="editMessage($event.detail[0])"
		@delete-message="deleteMessage($event.detail[0])"
		@open-file="openFile($event.detail[0])"
		@open-user-tag="openUserTag($event.detail[0])"
		@add-room="addRoom"
		@search-room="searchRoom($event.detail[0])"
		@room-action-handler="roomActionHandler($event.detail[0])"
		@menu-action-handler="menuActionHandler($event.detail[0])"
		@message-action-handler="messageActionHandler($event.detail[0])"
		@message-selection-action-handler="
			messageSelectionActionHandler($event.detail[0])
		"
		@send-message-reaction="sendMessageReaction($event.detail[0])"
		@typing-message="typingMessage($event.detail[0])"
		@textarea-action-handler="textareaActionHandler($event.detail[0])"
		@fetch-more-rooms="fetchMoreRooms"
		@toggle-rooms-list="$emit('show-demo-options', $event.detail[0].opened)"
		@room-info="roomInfo($event.detail[0])"
	>
		<!-- <template #room-header="{ room }">
			{{ room.roomName }}
		</template> -->
	</vue-advanced-chat>
</template>

<script>
import {ްްregister } from 'vue-advanced-chat'
// import {ްްregister } from '../../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
// import {ްްregister } from 'vue-advanced-chat/dist/vue-advanced-chat.umd.min.js'

import * as firestoreService from '@/database/firestore'
import * as storageService from '@/database/storage'
import { parseTimestamp, formatTimestamp } from '@/utils/dates'

register()

// registerComponent('MediaPreview', MediaPreview)

export default {
	props: {
		currentUserId: { type: String, required: true },
		theme: { type: String, required: true },
		isDevice: { type: Boolean, required: true },
		// JJSIP Props to receive from App.vue and pass to ChatWindow
		jjsipSipUri: { type: String, default: 'sip:defaultcontaineruser@example.com' },
		jjsipPassword: { type: String, default: 'containerpassword' },
		jjsipWebSocketServer: { type: String, default: 'wss://defaultcontainerws.example.com' },
		jjsipDisplayName: { type: String, default: 'Default Container User' }
	},
	emits: ['show-demo-options'],
	data() {
		return {
			rooms: [],
			roomId: '',
			messages: [],
			roomMessage: '',
			messagesLoaded: false,
			roomsLoaded: false,
			loadingRooms: true,
			loadFirstRoom: true,
			showSearch: true,
			showAddRoom: true,
			showSendIcon: true,
			showFiles: true,
			showAudio: true,
			audioBitRate: 128,
			audioSampleRate: 44100,
			showEmojis: true,
			showReactionEmojis: true,
			showNewMessagesDivider: true,
			showFooter: true,
			textMessages: {
				ROOMS_EMPTY: 'No rooms',
				ROOM_EMPTY: 'Select a room to start messaging',
				NEW_MESSAGES: 'New Messages',
				MESSAGE_DELETED: 'This message was deleted',
				MESSAGES_EMPTY: 'No messages yet',
				CONVERSATION_STARTED: 'Conversation started on:',
				TYPE_MESSAGE: 'Type your message',
				SEARCH: 'Search',
				IS_ONLINE: 'is online',
				LAST_SEEN: 'last seen ',
				IS_TYPING: 'is typing...'
				// User Tags
				// USER_TAG_LABEL: 'was mentioned',
				// USER_TAG_LABEL_ME: 'You were mentioned'
			},
			textFormatting: {
				disabled: false
				// italic: '_',
				// bold: '*',
				// strike: '~',
				// underline: '°',
				// multilineCode: '```',
				// inlineCode: '`'
			},
			linkOptions: { disabled: false, target: '_blank' },
			roomInfoEnabled: true,
			textareaActionEnabled: false,
			textareaAutoFocus: true,
			userTagsEnabled: true,
			emojisSuggestionEnabled: true,
			mediaPreviewEnabled: true,
			responsiveBreakpoint: 900,
			roomsListOpened: !this.isDevice,
			singleRoom: this.isDevice,
			roomActions: [
				{ name: 'archiveRoom', title: 'Archive Room' },
				{ name: 'deleteRoom', title: 'Delete Room' }
			],
			menuActions: [
				{ name: 'inviteUser', title: 'Invite User' },
				{ name: 'removeUser', title: 'Remove User' },
				{ name: 'deleteRoom', title: 'Delete Room' }
			],
			messageActions: [
				{ name: 'replyMessage', title: 'Reply' },
				{ name: 'editMessage', title: 'Edit Message', onlyMe: true },
				{ name: 'deleteMessage', title: 'Delete Message', onlyMe: true },
				{ name: 'selectMessages', title: 'Select Messages' }
				// { name: 'downloadMessageFile', title: 'Download File' }
			],
			messageSelectionActions: [
				{ name: 'deleteMessages', title: 'Delete Messages' }
			],
			// eslint-disable-next-line
			styles: {
				// container: {
				//   borderRadius: '10px'
				// },
				// header: {
				//   background: '#272727',
				//   colorRoomName: 'red',
				//   colorRoomInfo: 'green'
				// },
				// list: {
				//   background: '#1c1c1c'
				// },
				// messageDate: {
				//   color: 'yellow'
				// },
				// message: {
				//   backgroundMe: '#272727',
				//   colorMe: 'red',
				//   background: '#1c1c1c',
				//   color: 'green',
				//   borderRadius: '10px',
				//   padding: '0 10px',
				//   maxWidth: '70%'
				// },
				// content: {
				//   background: '#141414'
				// },
				/* replyMessage: {
					background: 'red',
					color: 'black',
					backgroundMe: 'blue',
					colorMe: 'yellow'
				}, */
				/* ReactionEmojis: {
					background: 'red',
					color: 'black',
					backgroundMe: 'blue',
					colorMe: 'yellow'
				}, */
				// footer: {
				//   background: '#272727',
				//   borderTop: 'none'
				// },
				/* scrollbar: {
					background: 'red',
					backgroundThumb: 'yellow'
				}, */
				/* emojiPicker: {
					background: '#272727',
					backgroundSearch: '#1c1c1c',
					colorSearch: 'yellow',
					color: 'red'
				}, */
				/* sendIcon: {
					fill: 'red'
				} */
				// dropdownMenu: {
				//   background: 'black',
				//   color: 'white',
				//   backgroundHover: 'red'
				// }
			},
			multipleFiles: true,
			templatesText: [
				{
					tag: 'help',
					text: 'This is the help'
				},
				{
					tag: 'action',
					text: 'This is the action'
				}
			],
			autoScroll: { send: { new: true, newAfterScrollUp: true } },
			usernameOptions: { minUsers: 3, currentUser: true },
			//
			scrollDistance: 0, // default: 60
			acceptedFiles: '*', // default: '*'
			captureFiles: '' // default: ''
			// emojiDataSource: ''
		}
	},

	computed: {
		screenHeight() {
			return this.isDevice ? window.innerHeight + 'px' : 'calc(100vh - 80px)'
		}
	},

	watch: {
		currentUserId() {
			this.loadFirstRoom = true
			this.fetchRooms()
		}
	},

	created() {
		this.fetchRooms()
		// this.updateUserOnlineStatus()
	},

	methods: {
		// updateUserOnlineStatus() {
		// 	const PERIOD_MS = 60 * 1000
		// 	setInterval(async () => {
		// 		if (!this.currentUserId) return
		// 		await firestoreService.updateUser(this.currentUserId, {
		// 			status: { state: 'online', lastChanged: new Date() }
		// 		})
		// 	}, PERIOD_MS)
		// },
		async fetchRooms() {
			this.loadingRooms = true
			this.roomsLoaded = false
			this.rooms = []

			const { data } = await firestoreService.getRooms(this.currentUserId)
			// console.log('getRooms', data)

			// this.rooms = data.map(room => {
			data.forEach(async room => {
				await firestoreService.updateRoom(room.roomId, { typingUsers: null })

				const { data: users } = await firestoreService.getRoomUsers(room.roomId)
				// console.log('getRoomUsers', users)

				const roomContacts = users.filter(
					user => user._id !== this.currentUserId
				)

				room.users = users
				room.roomName =
					roomContacts.map(user => user.username).join(', ') || 'Myself'

				const roomAvatar =
					roomContacts.length === 1 && roomContacts[0].avatar
						? roomContacts[0].avatar
						: '' // room.avatar

				const item = {
					...room,
					roomId: room.roomId,
					avatar: roomAvatar,
					index: parseTimestamp(room.lastUpdated, 'HH:mm'),
					lastUpdated: formatTimestamp(
						new Date(parseTimestamp(room.lastUpdated)),
						room.lastUpdated
					)
				}
				this.rooms.push(item)

				// this.listenLastMessage(item)
				this.listenUsersOnlineStatus(item)
				this.listenRoomTypingUsers(item)
			})

			if (this.loadFirstRoom && this.rooms.length) {
				this.roomId = this.rooms[0].roomId
				this.fetchMessages({ room: this.rooms[0] })
			}

			this.roomsLoaded = true
			this.loadingRooms = false
		},
		listenLastMessage(room) {
			const { unsubscribe } = firestoreService.listenLastMessage(
				room.roomId,
				messages => {
					messages.forEach(message => {
						const lastMessage = this.formatLastMessage(message)
						const roomIndex = this.rooms.findIndex(
							r => room.roomId === r.roomId
						)
						this.rooms[roomIndex].lastMessage = {
							...lastMessage,
							...{ readBySender: true }
						}
					})
				}
			)
			this.rooms.find(r => r.roomId === room.roomId).unsubscribe = unsubscribe
		},
		listenUsersOnlineStatus(room) {
			room.users.forEach(user => {
				const { unsubscribe } = firestoreService.listenUserOnlineStatus(
					user._id,
					userStatus => {
						const roomIndex = this.rooms.findIndex(
							r => room.roomId === r.roomId
						)
						if (!this.rooms[roomIndex]) return
						const userIndex = this.rooms[roomIndex].users.findIndex(
							u => u._id === user._id
						)
						this.rooms[roomIndex].users[userIndex] = {
							...this.rooms[roomIndex].users[userIndex],
							...{ status: userStatus }
						}
					}
				)
				this.rooms.find(r => r.roomId === room.roomId).unsubscribeUsers =
					unsubscribe
			})
		},
		listenRoomTypingUsers(room) {
			const { unsubscribe } = firestoreService.listenRoomTypingUsers(
				room.roomId,
				({ typingUsers }) => {
					const roomIndex = this.rooms.findIndex(
						r => room.roomId === r.roomId
					)
					this.rooms[roomIndex] = { ...this.rooms[roomIndex], typingUsers }
				}
			)
			this.rooms.find(r => r.roomId === room.roomId).unsubscribeTypingUsers =
				unsubscribe
		},
		formatLastMessage(message) {
			let content = message.content
			if (message.files?.length) {
				const file = message.files[0]
				content = `${file.name}.${file.extension || file.type}`
			}

			return {
				...message,
				...{
					content,
					timestamp: formatTimestamp(
						new Date(parseTimestamp(message.timestamp)),
						message.timestamp
					),
					date: parseTimestamp(message.timestamp, 'DD MMMM YYYY'),
					seen: message.senderId === this.currentUserId ? message.seen : null,
					new:
						message.senderId !== this.currentUserId &&
						(!message.seen || !message.seen[this.currentUserId]),
					saved: true, // message.viewed ? true : false,
					distributed: true,
					disableActions: false,
					disableReactions: false
				}
			}
		},
		async fetchMessages({ room, options = {} }) {
			if (options.reset) {
				this.messages = []
				this.messagesLoaded = false
			}

			if (this.previousLastLoadedMessage && !this.messages.length) return

			const { data, next } = await firestoreService.getMessages(
				room.roomId,
				this.previousLastLoadedMessage
			)

			if (!data?.length && !this.messages.length) {
				this.messagesLoaded = true
				return
			}

			if (this.roomId !== room.roomId) this.messages = []

			this.roomId = room.roomId

			const formattedMessages = []
			data.forEach(message => {
				const formattedMessage = this.formatMessage(room, message)
				formattedMessages.push(formattedMessage)
			})

			if (this.messages.length) {
				this.messages = [...formattedMessages, ...this.messages]
			} else {
				this.messages = formattedMessages
			}

			this.previousLastLoadedMessage = next

			if (!data.length) {
				this.messagesLoaded = true
				return
			}

			this.listenMessages(room)
		},
		listenMessages(room) {
			const { unsubscribe } = firestoreService.listenMessages(
				room.roomId,
				this.lastLoadedMessage || this.previousLastLoadedMessage,
				messages => {
					messages.forEach(message => {
						this.addMessage(room, message)
					})
				}
			)
			this.rooms.find(r => r.roomId === room.roomId).unsubscribeMessages =
				unsubscribe
		},
		async sendMessage(message) {
			const files = message.files?.map(file => {
				return {
					name: file.name,
					size: file.size,
					type: file.type,
					extension: file.extension,
					url: file.url,
					localUrl: file.localUrl,
					audio: file.audio,
					duration: file.duration,
					progress: file.progress
				}
			})

			const newMessage = {
				sender_id: this.currentUserId,
				content: message.content,
				system: false,
				// date: String(new Date().getDate()),
				timestamp: new Date(),
				files: files || null,
				replyMessage: message.replyMessage || null
			}

			const { id } = await firestoreService.addMessage(
				this.roomId,
				newMessage
			)

			if (files) {
				for (let i = 0; i < files.length; i++) {
					await this.uploadFile({ file: message.files[i], messageId: id })
				}
			}

			// this.fetchRooms()
			// this.fetchMessages({ room: { roomId: this.roomId } })
		},
		async editMessage(message) {
			const newMessage = {
				content: message.content,
				edited: new Date()
			}

			const files = message.files?.map(file => {
				return {
					name: file.name,
					size: file.size,
					type: file.type,
					extension: file.extension,
					url: file.url,
					localUrl: file.localUrl,
					audio: file.audio,
					duration: file.duration,
					progress: file.progress
				}
			})

			if (files) newMessage.files = files

			await firestoreService.updateMessage(
				this.roomId,
				message._id,
				newMessage
			)

			if (files) {
				for (let i = 0; i < files.length; i++) {
					if (message.files[i].blob) {
						await this.uploadFile({ file: message.files[i], messageId: message._id })
					}
				}
			}
		},
		async deleteMessage(message) {
			await firestoreService.updateMessage(this.roomId, message._id, {
				deleted: new Date(),
				content: '',
				files: null
			})

			if (message.files) {
				message.files.forEach(file => {
					storageService.deleteFile(this.currentUserId, message._id, file)
				})
			}
		},
		async uploadFile({ file, messageId }) {
			storageService.listenUploadImageProgress(
				this.currentUserId,
				messageId,
				file,
				progress => {
					this.updateFileProgress(messageId, file.localUrl, progress)
				},
				_error => {
					// error code
				},
				async url => {
					const message = this.messages.find(m => m._id === messageId)
					if (!message) return

					const fileIndex = message.files.findIndex(
						f => f.localUrl === file.localUrl
					)
					const files = message.files
					files[fileIndex].url = url
					files[fileIndex].progress = null

					await firestoreService.updateMessage(this.roomId, messageId, { files })
				}
			)
		},
		updateFileProgress(messageId, fileUrl, progress) {
			const message = this.messages.find(m => m._id === messageId)
			if (!message) return

			const fileIndex = message.files.findIndex(f => f.localUrl === fileUrl)
			message.files[fileIndex].progress = progress
			this.messages = [...this.messages]
		},
		formatMessage(room, message) {
			const senderUser = room.users.find(user => user._id === message.sender_id)

			const formattedMessage = {
				...message,
				...{
					_id: message.id,
					roomId: room.roomId,
					senderId: message.sender_id,
					username: senderUser ? senderUser.username : 'unknown',
					avatar: senderUser ? senderUser.avatar : null,
					timestamp: formatTimestamp(
						new Date(parseTimestamp(message.timestamp)),
						message.timestamp
					),
					date: parseTimestamp(message.timestamp, 'DD MMMM YYYY'),
					seen: message.seen ? message.seen[this.currentUserId] : null,
					disableActions: false,
					disableReactions: false
				}
			}

			if (message.replyMessage) {
				formattedMessage.replyMessage = {
					...message.replyMessage,
					...{
						username: room.users.find(
							user => user._id === message.replyMessage.senderId
						)?.username
					}
				}
			}

			return formattedMessage
		},
		async addMessage(room, message) {
			const formattedMessage = this.formatMessage(room, message)
			const messageIndex = this.messages.findIndex(m => m._id === message.id)

			if (messageIndex !== -1) {
				this.messages[messageIndex] = formattedMessage
				this.messages = [...this.messages]
			} else {
				this.messages = [...this.messages, formattedMessage]
				this.lastLoadedMessage = formattedMessage
			}

			this.markMessagesSeen(room, message)
		},
		async markMessagesSeen(room, message) {
			if (
				message.sender_id !== this.currentUserId &&
				(!message.seen || !message.seen[this.currentUserId])
			) {
				let seen = {}
				if (message.seen) seen = message.seen
				seen[this.currentUserId] = new Date()

				await firestoreService.updateMessage(room.roomId, message.id, {
					seen: seen
				})
			}
		},
		fetchMoreRooms() {
			// your code here
		},
		async roomActionHandler({ action, roomId }) {
			switch (action.name) {
				case 'archiveRoom':
					return console.log('archive room', roomId)
				case 'deleteRoom': {
					const room = this.rooms.find(r => r.roomId === roomId)
					room.unsubscribe()
					room.unsubscribeUsers()
					room.unsubscribeMessages()
					room.unsubscribeTypingUsers()
					await firestoreService.deleteRoom(roomId)
					this.fetchRooms()
				}
			}
		},
		menuActionHandler({ action, roomId }) {
			switch (action.name) {
				case 'inviteUser':
					return console.log('invite user', roomId)
				case 'removeUser':
					return console.log('remove user', roomId)
				case 'deleteRoom':
					return console.log('delete room', roomId)
			}
		},
		messageActionHandler({ action, message, roomId }) {
			switch (action.name) {
				case 'replyMessage':
					return console.log('reply message', message, roomId)
				case 'editMessage':
					return console.log('edit message', message, roomId)
				case 'deleteMessage':
					return console.log('delete message', message, roomId)
				case 'selectMessages':
					return console.log('select messages', message, roomId)
				case 'downloadMessageFile':
					return console.log('download file', message, roomId)
			}
		},
		messageSelectionActionHandler({ action, messages, roomId }) {
			switch (action.name) {
				case 'deleteMessages':
					messages.forEach(message => {
						this.deleteMessage(message)
					})
					console.log('delete messages', messages, roomId)
			}
		},
		openFile({ message, file }) {
			window.open(file.file.url, '_blank')
			console.log(message, file)
		},
		openUserTag({ user }) {
			console.log(user)
		},
		async addRoom() {
			this.resetForms()

			const { id } = await firestoreService.addRoom({
				users: [this.currentUserId, 'SGmFnBZB4xxMv9V4CVlW'], // , 'SGmFnBZB4xxMv9V4CVlW'
				lastUpdated: new Date()
			})
			await firestoreService.addMessage(id, {
				sender_id: this.currentUserId,
				content: 'Room created',
				system: true,
				timestamp: new Date()
			})
			this.fetchRooms()
		},
		searchRoom(val) {
			this.loadingRooms = true
			setTimeout(() => (this.loadingRooms = false), 500)
			console.log(val)
		},
		async sendMessageReaction({ reaction, messageId, roomId }) {
			const message = this.messages.find(m => m._id === messageId)

			const reactionIndex = message.reactions[this.currentUserId]
			if (reactionIndex && reactionIndex === reaction.name) {
				delete message.reactions[this.currentUserId]
			} else {
				message.reactions[this.currentUserId] = reaction.name
			}

			await firestoreService.updateMessage(roomId, messageId, {
				reactions: message.reactions
			})
		},
		typingMessage({ message, roomId }) {
			if (roomId) {
				let typingUsers = []
				if (message) typingUsers = [this.currentUserId]
				firestoreService.updateRoom(roomId, { typingUsers })
			}
		},
		textareaActionHandler({ message, roomId }) {
			console.log('textarea action', message, roomId)
		},
		roomInfo(room) {
			console.log('room info', room)
		},
		resetForms() {
			this.roomId = null
			this.roomMessage = null
			this.previousLastLoadedMessage = null
			this.lastLoadedMessage = null
			this.messages = []
			this.messagesLoaded = false
		}
	}
}
</script>

<style lang="scss">
body {
	font-size: 16px;
}
</style>
