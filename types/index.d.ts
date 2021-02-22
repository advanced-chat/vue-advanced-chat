import Vue, { VNode, Component, PluginFunction } from 'vue'

export type StringNumber = string | number

export type Rooms = Room[]

export interface Room {
	roomId: StringNumber
	roomName: string
	users: RoomUsers
	unreadCount?: StringNumber
	index?: StringNumber | Date
	lastMessage?: LastMessage
	typingUsers?: StringNumber[]
}

export interface LastMessage {
	content: string
	senderId: StringNumber
	username?: string
	timestamp?: string
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	new?: boolean
}

export type RoomUsers = RoomUser[]

export interface RoomUser {
	_id: StringNumber
	username: string
	avatar: string
	status: UserStatus
}

export interface UserStatus {
	state: 'online' | 'offline'
	lastChanged: string
}

export type Messages = Message[]

export interface Message {
	_id: StringNumber
	content: string
	senderId: StringNumber
	date: string
	timestamp: string
	username?: string
	system?: boolean
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	disableActions?: boolean
	disableReactions?: boolean
	file?: MessageFile
	reactions: MessageReactions
}

export interface MessageFile {
	name: string
	type: string
	url: string
	size?: number
	audio?: boolean
	duration?: number
}

export interface MessageReactions {
	[key: string]: StringNumber[]
}

export interface CustomAction {
	name: string
	title: string
}

export type CustomActions = CustomAction[]

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

export interface Props {
	'current-user-id': StringNumber
	rooms: Rooms
	messages: Messages
	height?: string
	theme?: 'light' | 'dark'
	styles?: Record<string, Record<string, string>>
	'loading-rooms'?: boolean
	'rooms-loaded'?: boolean
	'room-id'?: StringNumber
	'load-first-room'?: boolean
	'room-message'?: string
	'messages-loaded'?: boolean
	'room-actions'?: CustomActions
	'menu-actions'?: CustomActions
	'message-actions'?: CustomActions
	'show-add-room'?: boolean
	'show-send-icon'?: boolean
	'show-files'?: boolean
	'show-audio'?: boolean
	'show-emojis'?: boolean
	'show-reaction-emojis'?: boolean
	'show-new-messages-divider'?: boolean
	'show-footer'?: boolean
	'text-messages'?: Record<string, StringNumber>
	'text-formatting'?: number
	'responsive-breakpoint'?: boolean
	'single-room'?: boolean
	'accepted-files'?: string
}

export interface AdvancedChatOptions {
	props: Props
	slots?: Slots
}

export default class AdvancedChat extends Vue {
	rooms: Rooms
	messages: Messages

	$slots: Slots
	$props: Props

	static install: PluginFunction<AdvancedChatOptions>
}
