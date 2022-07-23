import { defineCustomElement } from 'vue'
import ChatWindow from './ChatWindow'

export const VueAdvancedChat = defineCustomElement(ChatWindow)

export function register() {
	customElements.define('vue-advanced-chat', VueAdvancedChat)
}
