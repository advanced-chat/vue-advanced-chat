// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'

import {
  createAdvancedChatElement,
  DEFAULT_CUSTOM_ELEMENT_TAG,
  registerAdvancedChat,
} from './web-component-core'

describe('side-effect-free web component entrypoint', () => {
  it('does not register the default tag on import', () => {
    expect(DEFAULT_CUSTOM_ELEMENT_TAG).toBe('advanced-chat-components')
    expect(customElements.get(DEFAULT_CUSTOM_ELEMENT_TAG)).toBeUndefined()
  })

  it('exports explicit creation and registration APIs', () => {
    expect(createAdvancedChatElement()).toBeTypeOf('function')
    expect(registerAdvancedChat({ tagName: 'advanced-chat-core-test' })).toBeTypeOf('function')
  })
})
