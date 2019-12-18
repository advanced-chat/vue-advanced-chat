export const defaultThemeColors = {
	light: {
		general: {
			color: '#0a0a0a',
			backgroundInput: '#fff',
			colorPlaceholder: '#9ca6af',
			colorCaret: '#1976d2',
			colorSpinner: '#333',
			colorBorder: '#d3dde7',
			backgroundScrollIcon: '#fff'
		},

		header: {
			background: '#fff'
		},

		footer: {
			background: '#f0f0f0',
			borderInputSelected: '#1976d2'
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
			colorReply: '#6e6e6e',
			backgroundImage: '#ddd'
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
			colorPlaceholder: '#596269',
			colorCaret: '#1976d2',
			colorSpinner: '#fff',
			colorBorder: '#63686e',
			backgroundScrollIcon: '#fff'
		},

		header: {
			background: '#181a1b'
		},

		footer: {
			background: '#181a1b',
			borderInputSelected: '#1976d2'
		},

		content: {
			background: '#131415'
		},

		sidemenu: {
			background: '#181a1b',
			backgroundHover: '#202224',
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
			colorReply: '#d6d6d6',
			backgroundImage: '#ddd'
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
		'--chat-color-placeholder': general.colorPlaceholder,
		'--chat-color-caret': general.colorCaret,
		'--chat-border-color': general.colorBorder,
		'--chat-bg-scroll-icon': general.backgroundScrollIcon,

		// header
		'--chat-header-bg-color': header.background,

		// footer
		'--chat-footer-bg-color': footer.background,
		'--chat-border-color-input-selected': footer.borderInputSelected,

		// content
		'--chat-content-bg-color': content.background,

		// sidemenu
		'--chat-sidemenu-bg-color': sidemenu.background,
		'--chat-sidemenu-bg-color-hover': sidemenu.backgroundHover,
		'--chat-sidemenu-bg-color-active': sidemenu.backgroundActive,
		'--chat-sidemenu-color-active': sidemenu.colorActive,

		// dropdown
		'--chat-dropdown-bg-color': dropdown.background,
		'--chat-dropdown-bg-color-hover': dropdown.backgroundHover,

		// message
		// '--chat-bg-color-message-image': message.backgroundImage,
		'--chat-message-bg-color': message.background,
		'--chat-message-bg-color-me': message.backgroundMe,
		'--chat-message-bg-color-deleted': message.backgroundDeleted,
		'--chat-message-color-deleted': message.colorDeleted,
		'--chat-message-color-username': message.colorUsername,
		'--chat-message-color-timestamp': message.colorTimestamp,
		'--chat-message-bg-color-date': message.backgroundDate,
		'--chat-message-color-date': message.colorDate,
		'--chat-message-color': message.color,
		'--chat-message-bg-color-reply': message.backgroundReply,
		'--chat-message-color-reply-username': message.colorReplyUsername,
		'--chat-message-color-reply-content': message.colorReply,
		'--chat-message-bg-color-image': message.backgroundImage,

		// room
		'--chat-room-color-username': room.colorUsername,
		'--chat-room-color-message': room.colorMessage,
		'--chat-room-color-timestamp': room.colorTimestamp,

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
