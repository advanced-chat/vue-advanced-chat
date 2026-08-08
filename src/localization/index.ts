/// <reference lib="dom" />
import en from './en.json' with { type: 'json' }
import { inject } from 'vue'
import { STRINGS_SYMBOL } from '../plugin/symbols.ts'

export type Localization = 'en' | 'auto'

/**
 * Locales the package ships strings for. Add new BCP 47 prefixes here
 * when introducing additional `*.json` dictionaries.
 */
const SUPPORTED_LOCALE_PREFIXES = ['en'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALE_PREFIXES)[number]

export type Strings = {
  'chats.empty': string
  'chats.search.placeholder': string
  'chat.empty': string
  'chat.messages.empty': string
  'chat.messages.new': string
  'chat.message.placeholder': string
  'chat.message.deleted': string
  'chat.message.failure': string
  'chat.typing': string
  'chat.cancel-selection': string
  'chat.cancel-reply': string
  'chat.cancel-edit': string
  'chat.scroll-to-bottom': string
  'chat.user.is-online': string
  'chat.user.last-seen': string
  'chat.autocomplete.emojis': string
  'chat.autocomplete.users': string
  'chat.state.loading': string
  'chat.state.empty': string
  'chat.state.error': string
  'chat.state.offline': string
  'chat.state.reconnecting': string
  'chat.state.permission-denied': string
  'chat.state.retry': string
}

/**
 * Negotiate against `navigator.language` for the closest supported
 * locale. Returns the fallback (`'en'`) and warns under DEV when the
 * detected language has no bundled dictionary.
 *
 * Exposed for tests and for consumers who want to make the same call
 * outside of Vue (e.g. SSR).
 */
export const negotiateLocale = (): SupportedLocale => {
  if (typeof navigator === 'undefined') return 'en'

  const lang = (navigator.language || '').toLowerCase()

  for (const prefix of SUPPORTED_LOCALE_PREFIXES) {
    if (lang.startsWith(prefix)) return prefix
  }

  if (import.meta.env.DEV && lang) {
    console.warn(
      `[advanced-chat] No bundled localization for "${lang}". ` +
        'Falling back to English. Pass overrides via AdvancedChatPlugin({ strings }).',
    )
  }

  return 'en'
}

export const getLocalizationStrings = (locale: Localization): Strings => {
  const resolved: SupportedLocale = locale === 'auto' ? negotiateLocale() : locale

  switch (resolved) {
    case 'en':
      return en
  }
}

export const useLocalizationStrings = (): Strings => {
  const strings = inject(STRINGS_SYMBOL, null)

  if (strings) {
    return strings
  }

  if (import.meta.env.DEV) {
    console.warn(
      '[advanced-chat] No AdvancedChatPlugin found — falling back to bundled English strings. ' +
        'Call `app.use(AdvancedChatPlugin())` so consumer overrides take effect.',
    )
  }

  return getLocalizationStrings('auto')
}
