import { type InjectionKey } from 'vue'
import { type Strings } from '../localization/index.ts'

export const STRINGS_SYMBOL: InjectionKey<Strings> = Symbol.for('advanced-chat-components:strings')
