import { getLocalizationStrings, type Localization, type Strings } from '../localization/index.ts'
import { STRINGS_SYMBOL } from './symbols.ts'
import type { App } from 'vue'
import { deepMerge } from '../utils/deep-merge.ts'

export interface AdvancedChatOptions {
  localization?: Localization
  strings?: Partial<Strings>
}

export interface AdvancedChatPlugin {
  install: (app: App) => void
}

export default ({ localization, strings }: AdvancedChatOptions = {}): AdvancedChatPlugin => {
  const baseStrings = getLocalizationStrings(localization || 'auto')

  const mergedStrings = deepMerge(baseStrings, strings || {})

  return {
    install(app: App) {
      app.provide(STRINGS_SYMBOL, mergedStrings)

      app.config.globalProperties.$advancedChatString = (key: keyof Strings) => {
        return mergedStrings[key] || ''
      }
    },
  }
}
