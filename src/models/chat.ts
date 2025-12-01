import type { User, UserReference } from './user.ts'
import type { Message } from './message.ts'
import { getLocalizationStrings, type Strings } from '../localization/index.ts'
import { deepMerge } from '../utils/deep-merge.js'

export interface Chat {
  id: string | number
  name: string
  icon?: string
  lastMessage?: Message
  users?: User[]
  typingUsers?: UserReference[]
}

export interface ChatReference {
  id: string | number
}

export const typingUsersString = (chat: Chat, partial: Partial<Strings>): string => {
  const strings = deepMerge(getLocalizationStrings('auto'), partial)

  if (chat.typingUsers && chat.typingUsers.length) {
    if (chat.users) {
      const typingUsers = chat.users.filter((user) => {
        return chat.typingUsers!.some(
          (typingUserRef) => typingUserRef.id.toString() === user.id.toString(),
        )
      })

      if (!typingUsers.length) return ''

      if (chat.users.length === 2) {
        return strings['chat.typing']
      } else {
        const names = typingUsers.map((user) => user.name).join(', ')

        return `${names} ${strings['chat.typing']}`
      }
    }
  }

  return ''
}
