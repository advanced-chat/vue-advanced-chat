import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { getLocalizationStrings, negotiateLocale } from './index'
import en from './en.json' with { type: 'json' }

describe('getLocalizationStrings', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns the English strings for "en"', () => {
    expect(getLocalizationStrings('en')).toEqual(en)
  })

  it('returns English when "auto" detects an English browser locale', () => {
    vi.stubGlobal('navigator', { language: 'en-US' })
    expect(getLocalizationStrings('auto')).toEqual(en)
  })

  it('falls back to English for non-English browser locales for now', () => {
    vi.stubGlobal('navigator', { language: 'fr-FR' })
    expect(getLocalizationStrings('auto')).toEqual(en)
  })
})

describe('negotiateLocale', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    warnSpy.mockRestore()
  })

  it('returns "en" when navigator is undefined (SSR)', () => {
    vi.stubGlobal('navigator', undefined)
    expect(negotiateLocale()).toBe('en')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('matches case-insensitive English variants', () => {
    vi.stubGlobal('navigator', { language: 'en-GB' })
    expect(negotiateLocale()).toBe('en')
    vi.stubGlobal('navigator', { language: 'EN' })
    expect(negotiateLocale()).toBe('en')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('falls back to "en" and warns under DEV for unsupported locales', () => {
    vi.stubGlobal('navigator', { language: 'fr-FR' })
    expect(negotiateLocale()).toBe('en')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0]?.[0]).toContain('fr-fr')
  })

  it('does not warn for an empty navigator.language', () => {
    vi.stubGlobal('navigator', { language: '' })
    expect(negotiateLocale()).toBe('en')
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
