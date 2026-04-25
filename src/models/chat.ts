import type { User, UserReference } from './user.ts'
import type { MessageSummary } from './message.ts'
import { type Strings } from '../localization/index.ts'
import type { Id } from './id.ts'

export interface Chat {
  id: Id
  name: string
  /**
   * Display picture for the chat — usually a group icon for multi-user
   * rooms; for 1:1 rooms consumers can leave this unset and let the
   * library fall back to the other user's avatar.
   */
  avatar?: string
  unreadCount?: number
  /**
   * Latest message in the chat, used to render the chat-list preview
   * row. Typed as `MessageSummary` so consumers can supply a tiny
   * projection without filling in `reactions`, `reply`, `disableActions`,
   * etc.; any full `Message` value is also assignable.
   */
  lastMessage?: MessageSummary
  users?: User[]
  typingUsers?: UserReference[]
}

export interface ChatReference {
  id: Id
}

export const typingUsersString = (chat: Chat, strings: Pick<Strings, 'chat.typing'>): string => {
  if (chat.typingUsers && chat.typingUsers.length) {
    if (chat.users) {
      const typingUsers = chat.users.filter((user) => {
        return chat.typingUsers!.some((typingUserRef) => typingUserRef.id === user.id)
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
