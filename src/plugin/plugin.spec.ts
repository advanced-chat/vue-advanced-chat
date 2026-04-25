// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import AdvancedChatPlugin from './index'
import { STRINGS_SYMBOL } from './symbols'
import en from '../localization/en.json' with { type: 'json' }

const harness = (assert: (capturedStrings: unknown) => void) => {
  let provided: unknown = null
  const Component = defineComponent({
    inject: { strings: { from: STRINGS_SYMBOL, default: null } },
    mounted() {
      provided = (this as { strings?: unknown }).strings
    },
    render: () => h('div'),
  })

  const app = createApp(Component)
  return { app, getProvided: () => provided, assert: () => assert(provided) }
}

describe('AdvancedChatPlugin', () => {
  it('provides the English strings dictionary by default', () => {
    const plugin = AdvancedChatPlugin()
    const { app, getProvided } = harness(() => {})
    app.use(plugin)
    const root = document.createElement('div')
    app.mount(root)
    expect(getProvided()).toEqual(en)
    app.unmount()
  })

  it('merges consumer string overrides on top of the base locale', () => {
    const plugin = AdvancedChatPlugin({
      strings: { 'chats.empty': 'Nothing here yet' },
    })
    const { app, getProvided } = harness(() => {})
    app.use(plugin)
    const root = document.createElement('div')
    app.mount(root)
    const provided = getProvided() as Record<string, string>
    expect(provided['chats.empty']).toBe('Nothing here yet')
    expect(provided['chat.typing']).toBe(en['chat.typing'])
    app.unmount()
  })

  it('exposes a global $advancedChatString helper that returns merged strings', () => {
    const plugin = AdvancedChatPlugin({ strings: { 'chats.empty': 'X' } })
    const app = createApp({ render: () => h('div') })
    app.use(plugin)
    const root = document.createElement('div')
    app.mount(root)
    const fn = app.config.globalProperties.$advancedChatString
    expect(fn('chats.empty')).toBe('X')
    expect(fn('chat.typing')).toBe(en['chat.typing'])
    app.unmount()
  })

  it('returns "" when an unknown string key is requested via the helper', () => {
    const plugin = AdvancedChatPlugin()
    const app = createApp({ render: () => h('div') })
    app.use(plugin)
    const root = document.createElement('div')
    app.mount(root)
    const fn = app.config.globalProperties.$advancedChatString
    expect(fn('does.not.exist' as never)).toBe('')
    app.unmount()
  })
})
