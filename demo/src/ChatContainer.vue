<template>
	<div class="window-container">
		<div class="chat-forms">
			<form @submit.prevent="createRoom" v-if="addNewRoom">
				<input
					type="text"
					placeholder="Add username to create a room"
					v-model="addRoomUsername"
				/>
				<button type="submit" :disabled="disableForm || !addRoomUsername">
					Create Room
				</button>
				<button class="button-cancel" @click="addNewRoom = false">
					Cancel
				</button>
			</form>

			<form @submit.prevent="addRoomUser" v-if="inviteRoomId">
				<input
					type="text"
					placeholder="Add user to the room"
					v-model="invitedUsername"
				/>
				<button type="submit" :disabled="disableForm || !invitedUsername">
					Add User
				</button>
				<button class="button-cancel" @click="inviteRoomId = null">
					Cancel
				</button>
			</form>

			<form @submit.prevent="deleteRoomUser" v-if="removeRoomId">
				<select v-model="removeUserId">
					<option default value="">Select User</option>
					<option v-for="user in removeUsers" :key="user._id" :value="user._id">
						{{ user.username }}
					</option>
				</select>
				<button type="submit" :disabled="disableForm || !removeUserId">
					Remove User
				</button>
				<button class="button-cancel" @click="removeRoomId = null">
					Cancel
				</button>
			</form>
		</div>

		<chat-window
			height="calc(100vh - 80px)"
			:theme="theme"
			:rooms="rooms"
			:loadingRooms="loadingRooms"
			:messages="messages"
			:messagesLoaded="messagesLoaded"
			:menuActions="menuActions"
			@fetchMessages="fetchMessages"
			@sendMessage="sendMessage"
			@editMessage="editMessage"
			@deleteMessage="deleteMessage"
			@openFile="openFile"
			@addRoom="addRoom"
			@menuActionHandler="menuActionHandler"
		/>
	</div>
</template>

<script>
import {
	roomsRef,
	usersRef,
	filesRef,
	deleteDbField,
	firebase
} from '@/firestore'
import { parseTimestamp, isSameDay } from '@/utils/dates'
import ChatWindow from './../../src/ChatWindow'
// import ChatWindow from 'vue-advanced-chat'
// import 'vue-advanced-chat/dist/vue-advanced-chat.css'

export default {
	components: {
		ChatWindow
	},

	props: ['currentUserId', 'theme'],

	data() {
		return {
			perPage: 20,
			rooms: [],
			loadingRooms: true,
			messages: [],
			messagesLoaded: false,
			start: null,
			end: null,
			roomsListeners: [],
			listeners: [],
			disableForm: false,
			addNewRoom: null,
			addRoomUsername: '',
			inviteRoomId: null,
			invitedUsername: '',
			removeRoomId: null,
			removeUserId: '',
			removeUsers: [],
			menuActions: [
				{
					name: 'inviteUser',
					title: 'Invite User'
				},
				{
					name: 'removeUser',
					title: 'Remove User'
				},
				{
					name: 'deleteRoom',
					title: 'Delete Room'
				}
			]
		}
	},

	mounted() {
		this.fetchRooms()
	},

	destroyed() {
		this.resetRooms()
	},

	methods: {
		resetRooms() {
			this.loadingRooms = true
			this.rooms = []
			this.roomsListeners.forEach(listener => listener())
			this.resetMessages()
		},

		resetMessages() {
			this.messages = []
			this.messagesLoaded = false
			this.start = null
			this.end = null
			this.listeners.forEach(listener => listener())
			this.listeners = []
		},

		async fetchRooms() {
			this.resetRooms()

			const rooms = await roomsRef
				.where('users', 'array-contains', this.currentUserId)
				.get()

			const rawRoomUsers = []
			const rawMessages = []

			rooms.forEach(room => {
				const rawUsers = []

				room.data().users.map(userId => {
					const promise = usersRef
						.doc(userId)
						.get()
						.then(user => {
							return {
								...user.data(),
								...{
									roomId: room.id,
									username: user.data().username
								}
							}
						})

					rawUsers.push(promise)
				})

				rawUsers.map(users => rawRoomUsers.push(users))
				rawMessages.push(this.getLastMessage(room))
			})

			let roomList = []

			const users = await Promise.all(rawRoomUsers)

			users.map(user => {
				if (roomList[user.roomId]) roomList[user.roomId].users.push(user)
				else roomList[user.roomId] = { users: [user] }
			})

			const roomMessages = await Promise.all(rawMessages).then(messages => {
				return messages.map(message => {
					return {
						lastMessage: this.formatLastMessage(message),
						roomId: message.roomId
					}
				})
			})

			roomMessages.map(ms => (roomList[ms.roomId].lastMessage = ms.lastMessage))

			const formattedRooms = []

			Object.keys(roomList).forEach(key => {
				const room = roomList[key]

				const roomContacts = room.users.filter(
					user => user._id !== this.currentUserId
				)

				room.roomName =
					roomContacts.map(user => user.username).join(', ') || 'Myself'

				const roomAvatar =
					roomContacts.length === 1 && roomContacts[0].avatar
						? roomContacts[0].avatar
						: require('@/assets/logo.svg')

				formattedRooms.push({
					...{
						roomId: key,
						avatar: roomAvatar,
						...room
					}
				})
			})

			this.rooms = this.rooms.concat(formattedRooms)
			this.loadingRooms = false
			this.rooms.map((room, index) => this.listenLastMessage(room, index))
		},

		getLastMessage(room) {
			return roomsRef
				.doc(room.id)
				.collection('messages')
				.orderBy('timestamp', 'desc')
				.limit(1)
				.get()
				.then(messages => {
					const array = []
					messages.forEach(m => array.push(m.data()))
					return { ...array[0], roomId: room.id }
				})
		},

		listenLastMessage(room, index) {
			const listener = roomsRef
				.doc(room.roomId)
				.collection('messages')
				.orderBy('timestamp', 'desc')
				.limit(1)
				.onSnapshot(messages => {
					messages.forEach(message => {
						const lastMessage = this.formatLastMessage(message.data())
						this.rooms[index].lastMessage = lastMessage
					})
				})

			this.roomsListeners.push(listener)
		},

		formatLastMessage(message) {
			if (!message.timestamp) return
			const date = new Date(message.timestamp.seconds * 1000)
			const timestampFormat = isSameDay(date, new Date())
				? 'HH:mm'
				: 'DD MMMM YYYY'

			let timestamp = parseTimestamp(message.timestamp, timestampFormat)
			if (timestampFormat === 'HH:mm') timestamp = 'Today, ' + timestamp

			let content = message.content
			if (message.file) content = `${message.file.name}.${message.file.type}`
			if (message.deleted) content = 'This message was deleted'

			return { content, timestamp, seen: message.seen }
		},

		fetchMessages({ room, options = {} }) {
			if (options.reset) this.resetMessages()

			if (this.end && !this.start) return (this.messagesLoaded = true)

			let ref = roomsRef.doc(room.roomId).collection('messages')

			let query = ref.orderBy('timestamp', 'desc').limit(this.perPage)

			if (this.start) query = query.startAfter(this.start)

			query.get().then(messages => {
				if (messages.empty) this.messagesLoaded = true

				if (this.start) this.end = this.start
				this.start = messages.docs[messages.docs.length - 1]

				let listenerQuery = ref.orderBy('timestamp')

				if (this.start) listenerQuery = listenerQuery.startAfter(this.start)
				if (this.end) listenerQuery = listenerQuery.endAt(this.end)

				messages.forEach(message => {
					const formattedMessage = this.formatMessage(room, message)
					this.messages.unshift(formattedMessage)
				})

				const listener = listenerQuery.onSnapshot(snapshots => {
					this.listenMessages(snapshots, room)
				})
				this.listeners.push(listener)
			})
		},

		listenMessages(messages, room) {
			messages.forEach(message => {
				const formattedMessage = this.formatMessage(room, message)
				const messageIndex = this.messages.findIndex(m => m._id === message.id)

				if (messageIndex === -1) {
					this.messages = this.messages.concat([formattedMessage])
				} else {
					this.$set(this.messages, messageIndex, formattedMessage)
				}

				this.markMessagesSeen(room, message)
			})
		},

		markMessagesSeen(room, message) {
			if (
				room.users.length === 2 &&
				!message.data().seen &&
				message.data().sender_id !== this.currentUserId
			) {
				roomsRef
					.doc(room.roomId)
					.collection('messages')
					.doc(message.id)
					.update({ seen: new Date() })
			}
		},

		formatMessage(room, message) {
			const senderUser = room.users.find(
				user => message.data().sender_id === user._id
			)

			const { sender_id, timestamp } = message.data()

			return {
				...message.data(),
				...{
					sender_id: sender_id === this.currentUserId ? 'me' : sender_id,
					_id: message.id,
					seconds: timestamp.seconds,
					timestamp: parseTimestamp(timestamp, 'HH:mm'),
					date: parseTimestamp(timestamp, 'DD MMMM YYYY'),
					username: senderUser ? senderUser.username : null
				}
			}
		},

		async sendMessage({ content, roomId, file, replyMessage }) {
			const message = {
				sender_id: this.currentUserId,
				content,
				timestamp: new Date()
			}

			if (file) {
				message.file = {
					name: file.name,
					size: file.size,
					type: file.type,
					url: file.localUrl
				}
			}

			if (replyMessage) {
				message.replyMessage = {
					_id: replyMessage._id,
					content: replyMessage.content,
					sender_id:
						replyMessage.sender_id === 'me'
							? this.currentUserId
							: replyMessage.sender_id
				}
			}

			const { id } = await roomsRef
				.doc(roomId)
				.collection('messages')
				.add(message)

			if (file) this.uploadFile({ file, messageId: id, roomId })
		},

		openFile(message) {
			window.open(message.file.url, '_blank')
		},

		async editMessage({ messageId, newContent, roomId, file }) {
			const newMessage = { edited: new Date() }
			newMessage.content = newContent

			if (file) {
				newMessage.file = {
					name: file.name,
					size: file.size,
					type: file.type,
					url: file.url || file.localUrl
				}
			} else {
				newMessage.file = deleteDbField
			}

			await roomsRef
				.doc(roomId)
				.collection('messages')
				.doc(messageId)
				.update(newMessage)
		},

		async deleteMessage({ messageId, roomId }) {
			await roomsRef
				.doc(roomId)
				.collection('messages')
				.doc(messageId)
				.update({ deleted: new Date() })
		},

		async uploadFile({ file, messageId, roomId }) {
			const uploadFileRef = filesRef
				.child(this.currentUserId)
				.child(messageId)
				.child(`${file.name}.${file.type}`)

			await uploadFileRef.put(file.blob, { contentType: file.type })
			const url = await uploadFileRef.getDownloadURL()

			await roomsRef
				.doc(roomId)
				.collection('messages')
				.doc(messageId)
				.update({
					['file.url']: url
				})
		},

		menuActionHandler({ action, roomId }) {
			switch (action.name) {
				case 'inviteUser':
					return this.inviteUser(roomId)
				case 'removeUser':
					return this.removeUser(roomId)
				case 'deleteRoom':
					return this.deleteRoom(roomId)
			}
		},

		addRoom() {
			this.resetForms()
			this.addNewRoom = true
		},

		async createRoom() {
			this.disableForm = true

			const { id } = await usersRef.add({ username: this.addRoomUsername })
			await usersRef.doc(id).update({ _id: id })
			await roomsRef.add({ users: [id, this.currentUserId] })

			this.addNewRoom = false
			this.addRoomUsername = ''
			this.fetchRooms()
		},

		inviteUser(roomId) {
			this.resetForms()
			this.inviteRoomId = roomId
		},

		async addRoomUser() {
			this.disableForm = true

			const { id } = await usersRef.add({ username: this.invitedUsername })
			await usersRef.doc(id).update({ _id: id })

			await roomsRef
				.doc(this.inviteRoomId)
				.update({ users: firebase.firestore.FieldValue.arrayUnion(id) })

			this.inviteRoomId = null
			this.invitedUsername = ''
			this.fetchRooms()
		},

		removeUser(roomId) {
			this.resetForms()
			this.removeRoomId = roomId
			this.removeUsers = this.rooms.find(room => room.roomId === roomId).users
		},

		async deleteRoomUser() {
			this.disableForm = true

			await roomsRef.doc(this.removeRoomId).update({
				users: firebase.firestore.FieldValue.arrayRemove(this.removeUserId)
			})

			this.removeRoomId = null
			this.removeUserId = ''
			this.fetchRooms()
		},

		async deleteRoom(roomId) {
			const ref = roomsRef.doc(roomId).collection('messages')

			roomsRef
				.doc(roomId)
				.collection('messages')
				.get()
				.then(res => {
					if (res.empty) return
					res.docs.map(doc => ref.doc(doc.id).delete())
				})

			await roomsRef.doc(roomId).delete()

			const i = this.rooms.map(room => room.roomId).indexOf(roomId)
			if (i !== -1) this.rooms.splice(i, 1)
		},

		resetForms() {
			this.disableForm = false
			this.addNewRoom = null
			this.addRoomUsername = ''
			this.inviteRoomId = null
			this.invitedUsername = ''
			this.removeRoomId = null
			this.removeUserId = ''
		}
	}
}
</script>

<style lang="scss" scoped>
.window-container {
	width: 100%;
}

.chat-forms {
	padding-bottom: 20px;

	form {
		padding-top: 20px;
	}

	input {
		padding: 5px;
		width: 180px;
		height: 21px;
		border-radius: 4px;
		border: 1px solid #d2d6da;
		outline: none;
		font-size: 14px;
		vertical-align: middle;

		&::placeholder {
			color: #9ca6af;
		}
	}

	button {
		background: #1976d2;
		color: #fff;
		outline: none;
		cursor: pointer;
		border-radius: 4px;
		padding: 8px 12px;
		margin-left: 10px;
		border: none;
		font-size: 14px;
		transition: 0.3s;
		vertical-align: middle;

		&:hover {
			opacity: 0.8;
		}

		&:active {
			opacity: 0.6;
		}

		&:disabled {
			cursor: initial;
			background: #c6c9cc;
			opacity: 0.6;
		}
	}

	.button-cancel {
		color: #a8aeb3;
		background: none;
		margin-left: 5px;
	}

	select {
		vertical-align: middle;
		height: 33px;
		width: 120px;
		font-size: 13px;
	}
}
</style>
