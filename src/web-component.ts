import { registerAdvancedChat } from './web-component-core'

export * from './web-component-core'

if (typeof customElements !== 'undefined') {
  registerAdvancedChat()
}
