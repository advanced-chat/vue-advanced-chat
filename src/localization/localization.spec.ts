import { describe, it, expect, vi, afterEach } from 'vitest'
import { getLocalizationStrings } from './index'
import en from './en.json' with { type: 'json' }

describe('getLocalizationStrings', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
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
