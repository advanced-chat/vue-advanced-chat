import Vue, { VNode, Component } from 'vue'

export type StringNumber = string | number

export type Rooms = Room[]

export interface Room {
	roomId: StringNumber
	roomName: string
	users: Users[]
	unreadCount?: StringNumber
	index?: StringNumber | Date
	lastMessage?: LastMessage
	typingUsers?: StringNumber[]
}

export interface LastMessage {
	content: string
	sender_id: StringNumber
	username?: string
	timestamp?: string
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	new?: boolean
}

export interface Users {
	_id: StringNumber
	username: string
	avatar: string
	status: UserStatus
}

export interface UserStatus {
	state: 'online' | 'offline'
	last_changed: string
}

export type Messages = Message[]

export interface Message {
	_id: StringNumber
	content: string
	sender_id: StringNumber
	date: string
	timestamp: string
	username?: string
	system?: boolean
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	disable_actions?: boolean
	disable_reactions?: boolean
	file?: MessageFile
	reactions: MessageReactions
}

export interface MessageFile {
	name: string
	type: string
	url: 'https://firebasestorage.googleapis.com/...'
	size?: number
	audio?: boolean
	duration?: number
}

export interface MessageReactions {
	[key: string]: StringNumber[]
}

export interface Slots {
	'rooms-header': VNode[]
	'room-list-item': VNode[]
	'room-list-options': VNode[]
	'room-header': VNode[]
	'room-header-avatar': VNode[]
	'room-header-info': VNode[]
	'room-options': VNode[]
	message: VNode[]
	'messages-empty': VNode[]
	'rooms-empty': VNode[]
	'no-room-selected': VNode[]
	'menu-icon': VNode[]
	'toggle-icon': VNode[]
	'scroll-icon': VNode[]
	'reply-close-icon': VNode[]
	'image-close-icon': VNode[]
	'file-icon': VNode[]
	'file-close-icon': VNode[]
	'edit-close-icon': VNode[]
	'emoji-picker-icon': VNode[]
	'emoji-picker-reaction-icon': VNode[]
	'paperclip-icon': VNode[]
	'send-icon': VNode[]
	'eye-icon': VNode[]
	'document-icon': VNode[]
	'pencil-icon': VNode[]
	'checkmark-icon': VNode[]
	'deleted-icon': VNode[]
	'microphone-icon': VNode[]
	'microphone-off-icon': VNode[]
	'dropdown-icon': VNode[]
	'room-list-options-icon': VNode[]
	'search-icon': VNode[]
	'add-icon': VNode[]
	[key: string]: VNode[]
}

export default class VueAdvancedChat extends Vue {
	rooms: Rooms
	messages: Messages
	$slots: Slots
}
