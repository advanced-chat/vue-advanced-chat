import ChatContainer from './ChatContainer'

Object.defineProperty(ChatContainer, 'install', {
	configurable: false,
	enumerable: false,
	value(Vue) {
		Vue.component('chat-window', ChatContainer)
	}
})

export default ChatContainer
