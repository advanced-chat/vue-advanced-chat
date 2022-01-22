import Vue, { VNode, PluginFunction } from 'vue'

export type StringNumber = string | number

export interface UserStatus {
	state: 'online' | 'offline'
	lastChanged: string
}

export interface RoomUser {
	_id: StringNumber
	username: string
	avatar: string
	status: UserStatus
}

export type RoomUsers = RoomUser[]

export interface MessageFile {
	name: string
	type: string
	url: string
	preview: string
	size?: number
	audio?: boolean
	duration?: number
	progress?: number
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
	files?: MessageFile[]
}

export interface Room {
	roomId: StringNumber
	roomName: string
	avatar: String
	users: RoomUsers
	unreadCount?: StringNumber
	index?: StringNumber | Date
	lastMessage?: LastMessage
	typingUsers?: StringNumber[]
}

export type Rooms = Room[]

export interface MessageReactions {
	[key: string]: StringNumber[]
}

export interface Message {
	_id: StringNumber
	indexId?: StringNumber
	content: string
	senderId: StringNumber
	username?: string
	avatar?: string
	date: string
	timestamp: string
	system?: boolean
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	deleted?: boolean
	failure?: boolean
	disableActions?: boolean
	disableReactions?: boolean
	files?: MessageFile[]
	reactions?: MessageReactions
	replyMessage?: Message
}

export type Messages = Message[]

export interface CustomAction {
	name: string
	title: string
}

export type CustomActions = CustomAction[]

export interface MessageAction {
	name: string
	title: string
	onlyMe?: boolean
}

export type MessageActions = MessageAction[]

export interface TextFormatting {
	disabled?: boolean
	italic?: string
	bold?: string
	strike?: string
	underline?: string
	multilineCode?: string
	inlineCode?: string
}
export type TemplateText = { tag: string; text: string }

export type TemplatesText = TemplateText[]

export interface AutoScroll {
	send: {
		new: boolean
		newAfterScrollUp: boolean
	}
	receive: {
		new: boolean
		newAfterScrollUp: boolean
	}
}

export type UsernameOptions = { minUsers: number; currentUser: StringNumber }

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
	'rooms-order': 'desc' | 'asc'
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
	'message-actions'?: MessageActions
	'message-selection-actions'?: CustomActions
	'templates-text'?: TemplatesText
	'auto-scroll'?: AutoScroll
	'show-search'?: boolean
	'show-add-room'?: boolean
	'show-send-icon'?: boolean
	'show-files'?: boolean
	'show-audio'?: boolean
	'show-emojis'?: boolean
	'show-reaction-emojis'?: boolean
	'show-new-messages-divider'?: boolean
	'show-footer'?: boolean
	'text-messages'?: Record<string, StringNumber>
	'text-formatting'?: TextFormatting
	'responsive-breakpoint'?: boolean
	'single-room'?: boolean
	'accepted-files'?: string
	'username-options'?: UsernameOptions
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
