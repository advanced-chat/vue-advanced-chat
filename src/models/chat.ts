import type { User, UserReference } from './user.ts'
import type { Message } from './message.ts'
import { type Strings } from '../localization/index.ts'
import type { Id } from './id.ts'

export interface Chat {
  id: Id
  name: string
  icon?: string
  unreadCount?: number
  lastMessage?: Message
  users?: User[]
  typingUsers?: UserReference[]
}

export interface ChatReference {
  id: Id
}

export const typingUsersString = (chat: Chat, strings: Strings): string => {
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
