/// <reference lib="dom" />
import en from './en.json' with { type: 'json' }
import { inject } from 'vue'
import { STRINGS_SYMBOL } from '../plugin/symbols.ts'

export type Localization = 'en' | 'auto'

export type Strings = {
  'chats.empty': string
  'chats.search.placeholder': string
  'chat.typing': string
  'chat.cancel-selection': string
  'chat.user.is-online': string
  'chat.user.last-seen': string
}

export const getLocalizationStrings = (locale: Localization): Strings => {
  switch (locale) {
    case 'en':
      return en
    case 'auto':
      if (navigator.language.startsWith('en')) {
        return en
      }

      return en
  }
}

export const useLocalizationStrings = (): Strings => {
  const strings = inject(STRINGS_SYMBOL, null)

  if (strings) {
    return strings
  }

  return getLocalizationStrings('auto')
}
