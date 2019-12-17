export const defaultThemeColors = {
	light: {
		general: {
			color: '#0a0a0a',
			backgroundInput: '#fff',
			colorSpinner: '#333',
			colorBorder: '#d3dde7'
		},

		header: {
			background: '#fff'
		},

		footer: {
			background: '#f0f0f0'
		},

		content: {
			background: '#f8f9fa'
		},

		sidemenu: {
			background: '#fff',
			backgroundHover: '#f6f6f6',
			backgroundActive: '#e5effa',
			colorActive: '#1976d2'
		},

		dropdown: {
			background: '#fff',
			backgroundHover: '#f6f6f6'
		},

		message: {
			background: '#fff',
			backgroundMe: '#ccf2cf',
			color: '#0a0a0a',
			backgroundDeleted: '#dadfe2',
			colorDeleted: '#757e85',
			colorUsername: '#9ca6af',
			colorTimestamp: '#828c94',
			backgroundDate: '#e5effa',
			colorDate: '#505a62',
			backgroundReply: 'rgba(0, 0, 0, 0.08)',
			colorReplyUsername: '#0a0a0a',
			colorReply: '#6e6e6e'
		},

		room: {
			colorUsername: '#0a0a0a',
			colorMessage: '#67717a',
			colorTimestamp: '#a2aeb8'
		},

		icons: {
			search: '#9ca6af',
			add: '#1976d2',
			menu: '#0a0a0a',
			close: '#9ca6af',
			closeImage: '#fff',
			file: '#1976d2',
			paperclip: '#1976d2',
			closeOutline: '#000',
			send: '#1976d2',
			sendDisabled: '#9ca6af',
			emoji: '#1976d2',
			document: '#1976d2',
			pencil: '#9e9e9e',
			checkmark: '#0696c7',
			eye: '#fff',
			dropdown: '#fff',
			dropdownScroll: '#0a0a0a'
		}
	},
	dark: {
		general: {
			color: '#fff',
			backgroundInput: '#202223',
			colorSpinner: '#fff',
			colorBorder: '#63686e'
		},

		header: {
			background: '#181a1b'
		},

		footer: {
			background: '#181a1b'
		},

		content: {
			background: '#131415'
		},

		sidemenu: {
			background: '#181a1b',
			backgroundHover: '#202024',
			backgroundActive: '#151617',
			colorActive: '#fff'
		},

		dropdown: {
			background: '#343740',
			backgroundHover: '#2b2e36'
		},

		message: {
			background: '#22242a',
			backgroundMe: '#1F87EC',
			color: '#fff',
			backgroundDeleted: '#1b1c21',
			colorDeleted: '#dadfe2',
			colorUsername: '#b3bac9',
			colorTimestamp: '#ebedf2',
			backgroundDate: 'rgba(0, 0, 0, 0.2)',
			colorDate: '#9ca6af',
			backgroundReply: 'rgba(0, 0, 0, 0.18)',
			colorReplyUsername: '#fff',
			colorReply: '#d6d6d6'
		},

		room: {
			colorUsername: '#fff',
			colorMessage: '#a2aeb8',
			colorTimestamp: '#67717a'
		},

		icons: {
			search: '#9ca6af',
			add: '#fff',
			menu: '#fff',
			close: '#9ca6af',
			closeImage: '#fff',
			file: '#1976d2',
			paperclip: '#fff',
			closeOutline: '#fff',
			send: '#fff',
			sendDisabled: '#9ca6af',
			emoji: '#fff',
			document: '#1976d2',
			pencil: '#ebedf2',
			checkmark: '#f0d90a',
			eye: '#fff',
			dropdown: '#fff',
			dropdownScroll: '#0a0a0a'
		}
	}
}

export const cssThemeVars = ({
	general,
	header,
	footer,
	sidemenu,
	content,
	dropdown,
	message,
	room,
	icons
}) => {
	return {
		// general
		'--chat-color': general.color,
		'--chat-bg-color-input': general.backgroundInput,
		'--chat-color-spinner': general.colorSpinner,
		'--chat-border-color': general.colorBorder,

		// layout
		'--chat-header-bg-color': header.background,
		'--chat-bg-color-footer': footer.background,
		'--chat-bg-color-content': content.background,

		// sidemenu
		'--chat-bg-color': sidemenu.background,
		'--chat-bg-color-hover': sidemenu.backgroundHover,
		'--chat-bg-color-active': sidemenu.backgroundActive,
		'--chat-color-active': sidemenu.colorActive,

		// dropdown
		'--chat-bg-menu': dropdown.background,
		'--chat-bg-menu-hover': dropdown.backgroundHover,

		// message
		'--chat-bg-color-message': message.background,
		'--chat-bg-color-message-me': message.backgroundMe,
		'--chat-bg-color-message-deleted': message.backgroundDeleted,
		'--chat-color-message-deleted': message.colorDeleted,
		'--chat-color-message-username': message.colorUsername,
		'--chat-color-message-timestamp': message.colorTimestamp,
		'--chat-bg-color-message-date': message.backgroundDate,
		'--chat-color-message-date': message.colorDate,
		'--chat-color-message-text': message.color,
		'--chat-bg-color-message-reply': message.backgroundReply,
		'--chat-color-message-reply-username': message.colorReplyUsername,
		'--chat-color-message-reply-content': message.colorReply,

		// room
		'--chat-color-room-username': room.colorUsername,
		'--chat-color-room-last': room.colorMessage,
		'--chat-color-room-timestamp': room.colorTimestamp,

		// icons
		'--chat-icon-color-search': icons.search,
		'--chat-icon-color-add': icons.add,
		'--chat-icon-color-menu': icons.menu,
		'--chat-icon-color-close': icons.close,
		'--chat-icon-color-close-image': icons.closeImage,
		'--chat-icon-color-file': icons.file,
		'--chat-icon-color-paperclip': icons.paperclip,
		'--chat-icon-color-close-outline': icons.closeOutline,
		'--chat-icon-color-send': icons.send,
		'--chat-icon-color-send-disabled': icons.sendDisabled,
		'--chat-icon-color-emoji': icons.emoji,
		'--chat-icon-color-document': icons.document,
		'--chat-icon-color-pencil': icons.pencil,
		'--chat-icon-color-checkmark': icons.checkmark,
		'--chat-icon-color-eye': icons.eye,
		'--chat-icon-color-dropdown': icons.dropdown,
		'--chat-icon-color-dropdown-scroll': icons.dropdownScroll
	}
}
