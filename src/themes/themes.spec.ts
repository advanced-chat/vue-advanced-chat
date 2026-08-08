import { describe, it, expect, vi, afterEach } from 'vitest'
import { getThemeStyles } from './index'
import light from './light.json' with { type: 'json' }
import dark from './dark.json' with { type: 'json' }

describe('getThemeStyles', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the light palette for theme="light"', () => {
    expect(getThemeStyles('light')).toEqual(light)
  })

  it('returns the dark palette for theme="dark"', () => {
    expect(getThemeStyles('dark')).toEqual(dark)
  })

  it('returns light when prefers-color-scheme is light under "auto"', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: false }),
    })

    expect(getThemeStyles('auto')).toEqual(light)
  })

  it('returns dark when prefers-color-scheme is dark under "auto"', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: true }),
    })

    expect(getThemeStyles('auto')).toEqual(dark)
  })

  it('falls back to light when matchMedia is unavailable', () => {
    vi.stubGlobal('window', undefined)

    expect(getThemeStyles('auto')).toEqual(light)
  })

  it('deep-merges overrides onto the chosen base theme', () => {
    const result = getThemeStyles({
      base: 'light',
      overrides: { '--chat-color': '#ff00aa' },
    })

    expect(result['--chat-color']).toBe('#ff00aa')
    expect(result['--chat-message-bg-color-me']).toBe(light['--chat-message-bg-color-me'])
  })

  it('uses dark base when an override object specifies it', () => {
    const result = getThemeStyles({ base: 'dark', overrides: {} })

    expect(result['--chat-content-bg-color']).toBe(dark['--chat-content-bg-color'])
  })

  it('does not mutate a built-in palette when overrides are applied', () => {
    const original = light['--chat-color']

    getThemeStyles({ base: 'light', overrides: { '--chat-color': '#ff00aa' } })

    expect(getThemeStyles('light')['--chat-color']).toBe(original)
  })
})
