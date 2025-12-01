/// <reference lib="dom" />
import en from './en.json' with { type: 'json' }

export type Localization = 'en' | 'auto'

export type Strings = {
  'chats.empty': string
  'chats.search.placeholder': string
  'chat.typing': string
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
