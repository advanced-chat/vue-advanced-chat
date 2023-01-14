import Vue, { PluginFunction } from 'vue'

export function register(): void

export type StringNumber = string | number

export interface UserStatus {
	state: 'online' | 'offline'
	lastChanged: string
}

export interface RoomUser {
	_id: string
	username: string
	avatar: string
	status: UserStatus
}

export interface MessageFile {
	name: string
	type: string
	extension: string
	url: string
	localUrl?: string
	preview?: string
	size?: number
	audio?: boolean
	duration?: number
	progress?: number
	blob?: Blob
}

export interface LastMessage {
	content: string
	senderId: string
	username?: string
	timestamp?: string
	saved?: boolean
	distributed?: boolean
	seen?: boolean
	new?: boolean
	files?: MessageFile[]
}

export interface Room {
	roomId: string
	roomName: string
	avatar: string
	users: RoomUser[]
	unreadCount?: number
	index?: StringNumber | Date
	lastMessage?: LastMessage
	typingUsers?: string[]
}

export interface MessageReactions {
	[key: string]: StringNumber[]
}

export interface Message {
	_id: string
	senderId: string
	indexId?: StringNumber
	content?: string
	username?: string
	avatar?: string
	date?: string
	timestamp?: string
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

export interface CustomAction {
	name: string
	title: string
}

export interface MessageAction {
	name: string
	title: string
	onlyMe?: boolean
}

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
	'current-user-id': string
	rooms: Room[]
	'rooms-order'?: 'desc' | 'asc'
	'loading-rooms'?: boolean
	'rooms-loaded'?: boolean
	'room-id'?: string
	'load-first-room'?: boolean
	'rooms-list-opened'?: boolean
	messages: Message[]
	'room-message'?: string
	'username-options'?: UsernameOptions
	'messages-loaded'?: boolean
	'room-actions'?: CustomAction[]
	'menu-actions'?: CustomAction[]
	'message-actions'?: MessageActions
	'message-selection-actions'?: CustomAction[]
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
	'capture-files'?: string
	styles?: Record<string, Record<string, string>>
}

export interface AdvancedChatOptions {
	props: Props
}

export class VueAdvancedChat extends Vue {
	rooms: Room[]
	messages: Message[]

	$props: Props

	static install: PluginFunction<AdvancedChatOptions>
}
