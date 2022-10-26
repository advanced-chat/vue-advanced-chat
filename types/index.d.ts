import Vue, { PluginFunction } from 'vue'

export function register(): void;

export type StringNumber = string | number

export interface UserStatus {
	state: 'online' | 'offline'
	lastChanged: string
}

export interface RoomUser {
	_id: String
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
	senderId: String
	username?: string
	timestamp?: string
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	new?: boolean
	files?: MessageFile[]
}

export interface Room {
	roomId: String
	roomName: string
	avatar: String
	users: RoomUsers
	unreadCount?: Number
	index?: StringNumber | Date
	lastMessage?: LastMessage
	typingUsers?: String[]
}

export type Rooms = Room[]

export interface MessageReactions {
	[key: string]: StringNumber[]
}

export interface Message {
	_id: StringNumber
	indexId?: StringNumber
	content: string
	senderId: String
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
	send?: {
		new?: boolean
		newAfterScrollUp?: boolean
	}
	receive?: {
		new?: boolean
		newAfterScrollUp?: boolean
	}
}

export interface UsernameOptions {
	minUsers?: number
	currentUser?: boolean
}

export interface LinkOptions {
	disabled?: string
	target?: string
	rel?: boolean
}

export interface Props {
	height?: string
	'current-user-id': String
	rooms: Rooms
	'rooms-order'?: 'desc' | 'asc'
	'loading-rooms'?: boolean
	'rooms-loaded'?: boolean
	'room-id'?: String
	'load-first-room'?: boolean
	'rooms-list-opened'?: boolean
	messages: Messages
	'room-message'?: string
	'username-options'?: UsernameOptions
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
	'audio-bit-rate'?: number
	'audio-sample-rate'?: number
	'show-emojis'?: boolean
	'show-reaction-emojis'?: boolean
	'show-new-messages-divider'?: boolean
	'show-footer'?: boolean
	'text-messages'?: Record<string, StringNumber>
	'text-formatting'?: TextFormatting
	'link-options'?: LinkOptions
	'room-info-enabled': boolean
	'textarea-action-enabled'?: boolean
	'textarea-auto-focus'?: boolean
	'user-tags-enabled'?: boolean
	'emojis-suggestion-enabled'?: boolean
	'media-preview-enabled'?: boolean
	'responsive-breakpoint'?: number
	'single-room'?: boolean
	'scroll-distance'?: number
	theme?: 'light' | 'dark'
	'accepted-files'?: string
	styles?: Record<string, Record<string, string>>
}

export interface AdvancedChatOptions {
	props: Props
}

export default class AdvancedChat extends Vue {
	rooms: Rooms
	messages: Messages

	$props: Props

	static install: PluginFunction<AdvancedChatOptions>
}
