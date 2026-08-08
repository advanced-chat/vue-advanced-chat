// @vitest-environment jsdom
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import {
  DEFAULT_CUSTOM_ELEMENT_TAG,
  registerAdvancedChat,
  type AdvancedChatHTMLElement,
} from './web-component'

const mount = async (element: AdvancedChatHTMLElement) => {
  document.body.append(element)
  await Promise.resolve()
  await nextTick()
}

describe('web component entrypoint', () => {
  afterEach(() => document.body.replaceChildren())

  it('registers the default custom element on import', () => {
    expect(customElements.get(DEFAULT_CUSTOM_ELEMENT_TAG)).toBeTypeOf('function')
  })

  it('is idempotent and supports an explicit tag name', () => {
    const first = registerAdvancedChat({ tagName: 'advanced-chat-components-test' })
    const second = registerAdvancedChat({ tagName: 'advanced-chat-components-test' })

    expect(first).toBe(second)
    expect(customElements.get('advanced-chat-components-test')).toBe(first)
  })

  it('does not silently discard options for a foreign registration', () => {
    customElements.define('advanced-chat-components-foreign-test', class extends HTMLElement {})

    expect(() =>
      registerAdvancedChat({
        tagName: 'advanced-chat-components-foreign-test',
        strings: { 'chat.state.error': 'Ignored error' },
      }),
    ).toThrow('already registered by another constructor')
  })

  it('mounts with assigned DOM properties and renders them', async () => {
    const Element = registerAdvancedChat({ tagName: 'advanced-chat-components-props-test' })
    const element = new Element()
    element.status = 'error'
    element.statusMessage = 'Could not load this chat'
    element.retryLabel = 'Try again'

    await mount(element)

    expect(element.querySelector('.acc-chat-root')?.getAttribute('data-status')).toBe('error')
    expect(element.querySelector('.acc-state-panel p')?.textContent).toBe(
      'Could not load this chat',
    )
    expect(element.querySelector<HTMLButtonElement>('.acc-state-panel button')?.textContent).toBe(
      'Try again',
    )
  })

  it('exposes actual component event payloads as typed direct details', async () => {
    const Element = registerAdvancedChat({ tagName: 'advanced-chat-components-events-test' })
    const element = new Element()
    element.currentUser = { id: 'current-user' }
    element.chats = []
    element.chatsLoaded = true
    element.showAddChat = false
    let detail: string | undefined
    element.addEventListener('search-chat', (event) => {
      detail = event.detail
    })

    await mount(element)

    const input = element.querySelector<HTMLInputElement>('input[type="search"]')
    expect(input).not.toBeNull()
    input!.value = 'general'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    expect(detail).toBe('general')
  })

  it('emits delegated standards-based DOM events', async () => {
    const Element = registerAdvancedChat({ tagName: 'advanced-chat-components-bubbling-test' })
    const container = document.createElement('div')
    const element = new Element()
    element.status = 'error'
    container.append(element)
    document.body.append(container)
    let receivedEvent: CustomEvent | undefined
    container.addEventListener('retry', (event) => {
      receivedEvent = event as CustomEvent
    })

    await Promise.resolve()
    await nextTick()
    element.querySelector<HTMLButtonElement>('.acc-state-panel button')?.click()

    expect(receivedEvent?.detail).toBeNull()
    expect(receivedEvent?.bubbles).toBe(true)
    expect(receivedEvent?.composed).toBe(true)
  })

  it('applies options supplied after default auto-registration to future mounts', async () => {
    registerAdvancedChat({
      strings: { 'chat.state.error': 'Localized web-component error' },
    })
    const element = document.createElement(DEFAULT_CUSTOM_ELEMENT_TAG)
    element.status = 'error'

    await mount(element)

    expect(element.querySelector('.acc-state-panel p')?.textContent).toBe(
      'Localized web-component error',
    )
  })
})
