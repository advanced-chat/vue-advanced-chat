export const defaultThemeColors = {
	light: {
		headerBg: '#fff',
		sidemenuBg: '#fff',
		sidemenuBgHover: '#f6f6f6',
		sidemenuBgActive: '#e5effa',
		sidemenuColorActive: '#1976d2',
		messagesBg: '#f8f9fa',
		textColorDark: '#0a0a0a',
		textColor: '#0a0a0a',
		inputBg: '#fff'
	},
	dark: {
		headerBg: '#26272e',
		sidemenuBg: '#26272e',
		sidemenuBgHover: '#202024',
		sidemenuBgActive: '#1C1D21',
		sidemenuColorActive: '#fff',
		messagesBg: '#1C1D21',
		textColorDark: '#0a0a0a',
		textColor: '#fff',
		inputBg: '#34343b'
	}
}

export const cssThemeVars = ({
	headerBg,
	sidemenuBg,
	sidemenuBgHover,
	sidemenuBgActive,
	sidemenuColorActive,
	messagesBg,
	textColorDark,
	textColor,
	inputBg
}) => {
	return {
		'--chat-header-bg-color': headerBg,
		'--chat-bg-color': sidemenuBg,
		'--chat-bg-color-hover': sidemenuBgHover,
		'--chat-bg-color-active': sidemenuBgActive,
		'--chat-bg-color-content': messagesBg,
		'--chat-color-dark': textColorDark,
		'--chat-color': textColor,
		'--chat-color-active': sidemenuColorActive,
		'--chat-color-input': inputBg
	}
}
