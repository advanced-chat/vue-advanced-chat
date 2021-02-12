import Vue, { VNode, Component } from 'vue'

export type StringNumber = string | number

export interface Rooms {
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

export interface Messages {
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
	spinner: VNode[]
	'no-result': VNode[]
	'no-more': VNode[]
	error: VNode[]
	[key: string]: VNode[]
}

export default class VueAdvancedChat extends Vue {
	rooms: Rooms
	messages: Messages
	$slots: Slots
}
