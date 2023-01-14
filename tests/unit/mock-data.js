const height = '100px'
const currentUserId = 'user_1'
const rooms = [{ _id: 1 }]
const loadingRooms = false
const roomsLoaded = true
const roomId = 'room_1'
const loadFirstRoom = true
const messages = [{ _id: 1 }]
const roomMessage = ''
const messagesLoaded = true
const roomActions = [{ title: 'A room action' }]
const menuActions = [{ title: 'A menu action' }]
const messageActions = [{ title: 'A message action' }]
const showSearch = true
const showAddRoom = true
const showSendIcon = true
const showFiles = true
const showAudio = true
const showEmojis = true
const showReactionEmojis = true
const showNewMessagesDivider = true
const showFooter = true
const textMessages = { ROOMS_EMPTY: 'No rooms' }
const textFormatting = {
	disabled: false,
	italic: '_',
	bold: '*',
	strike: '~',
	underline: '°',
	multilineCode: '```',
	inlineCode: '`'
}
const responsiveBreakpoint = 10
const singleRoom = false
const theme = 'dark'
const acceptedFiles = '*'
const captureFiles = undefined
const linkOptions = { disabled: false, target: '_blank' }
const styles = { general: { color: '#0a0a0a' } }

export default {
	height,
	currentUserId,
	rooms,
	loadingRooms,
	roomsLoaded,
	roomId,
	loadFirstRoom,
	messages,
	roomMessage,
	messagesLoaded,
	roomActions,
	menuActions,
	messageActions,
	showSearch,
	showAddRoom,
	showSendIcon,
	showFiles,
	showAudio,
	showEmojis,
	showReactionEmojis,
	showNewMessagesDivider,
	showFooter,
	textMessages,
	textFormatting,
	responsiveBreakpoint,
	singleRoom,
	theme,
	acceptedFiles,
	captureFiles,
	linkOptions,
	styles
}
