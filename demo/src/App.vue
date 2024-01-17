<template>
	<div class="wrapper">
		<h1>Display this</h1>
		<vue-advanced-chat
			id="chatWindow"
			:current-user-id="currentUserId"
			:rooms="JSON.stringify(rooms)"
			:messages="JSON.stringify(messages)"
			:single-room="true"
			:messages-loaded="messagesLoaded"
			:show-audio="false"
			:show-files="false"
			:show-emojis="false"
			:show-reaction-emojis="false"
			:styles="JSON.stringify(chatStyles)"
			:text-messages="JSON.stringify(textMessages)"
			:message-actions="JSON.stringify(messageActions)"
			:is-waiting-for-reply="isWaitingForReply"
			@fetch-messages="fetchMessages($event.detail[0])"
			@send-message="sendMessage($event.detail[0])"
		>
			<div slot="room-header" class="roomHeader">
				<div class="headingWrapper">
					<div class="roomAvatar" />
					<div class="textEllipsis">
						<div class="roomName textEllipsis">{{ aiName }}</div>
					</div>
				</div>
				<div class="closeButton" />
			</div>

			<div
				slot="spinner-icon-waiting-for-reply"
				class="loadingMessageContainer"
			>
				{{ aiName }}
			</div>
		</vue-advanced-chat>
	</div>
</template>

<script>
import { register } from './../../dist/vue-advanced-chat.es.js'
register()
export default {
	setup() {},
	data() {
		return {
			isChatVisibile: false,
			messagesLoaded: true,
			windowWidth: window.innerWidth,
			currentUserId: '1234',
			chat: {},
			rooms: [
				{
					roomId: '1',
					users: [
						{ _id: '1234', username: 'John Doe' },
						{ _id: '4321', username: 'Warenwissen Helfer' }
					]
				}
			],
			messages: [],
			chatStyles: {
				message: {
					background: '#72BA5B',
					color: '#ffffff',
					backgroundMe: '#616e7e'
				}
			},
			messageActions: [], // need empty array to remove default set of options
			textMessages: {
				ROOMS_EMPTY: 'Aucune conversation',
				ROOM_EMPTY: 'Aucune conversation sélectionnée',
				NEW_MESSAGES: 'Neue Nachrichten',
				MESSAGE_DELETED: 'Ce message a été supprimé',
				MESSAGES_EMPTY: 'Aucun message',
				CONVERSATION_STARTED: 'Das Gespräch begann am:',
				TYPE_MESSAGE: 'Schreibe deine Nachricht',
				SEARCH: 'Rechercher',
				IS_ONLINE: 'est en ligne',
				LAST_SEEN: 'dernière connexion ',
				IS_TYPING: 'est en train de taper...',
				CANCEL_SELECT_MESSAGE: 'Annuler Sélection'
			},
			aiName: 'Warenwissen Helfer',
			isWaitingForReply: false
		}
	},
	methods: {
		async fetchMessages({ options }) {
			console.log(options)
			if (options?.reset) {
				this.messages = await this.addMessages(true)
			} else {
				this.messages = await this.addMessages()
			}
		},
		async refactorMessages(messages) {
			let newMessages = []
			for (let msg of messages) {
				console.log(msg)
				newMessages.push({
					_id: msg.id,
					content: msg.content[0].text.value,
					senderId:
						msg.role === 'assistant' ? '4322' : this.currentUserId,
					timestamp: new Date(msg.created_at)
						.toString()
						.substring(16, 21),
					date: new Date(msg.created_at).toDateString()
				})
			}
			return newMessages
		},
		async addMessages(reset = false) {
			let messages = []
			if (reset || !this.chat.thread_id) {
				messages = [
					{
						_id: this.messages.length + 1,
						content: `Frage mich etwas zu Biowaren!`,
						senderId: '4322',
						username: this.aiName,
						timestamp: new Date().toString().substring(16, 21),
						date: new Date().toDateString()
					}
				]
			} else {
				const { data } = await this.$http.get(
					'/ai-chat/chat/' + this.chat.thread_id
				)
				console.log(data)
				this.messages = await this.refactorMessages(data)
			}
			console.log(reset)
			this.messagesLoaded = true

			return messages
		},
		async sendMessage(message) {
			this.messages = [
				...this.messages,
				{
					_id: this.messages.length,
					content: message.content,
					senderId: this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString()
				}
			]
			this.messagesLoaded = false
			this.isWaitingForReply = true
			const { data } = await this.$http.post('/ai-chat/chat', {
				message: message.content,
				chat: this.chat
			})

			this.chat = data.chat
			this.messages = await this.refactorMessages(data.messages)

			this.messagesLoaded = true
			this.isWaitingForReply = false
		},
		getChatWindowHeight() {
			if (this.windowWidth > 991) {
				return 'calc(100vh - 3rem)'
			}

			return '100vh'
		},
		onResize() {
			this.windowWidth = window.innerWidth
		}
	}
}
</script>
