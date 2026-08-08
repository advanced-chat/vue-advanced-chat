import type { Id } from './id.ts'

export interface User {
  id: Id
  name: string
  /**
   * Optional URL of the user's profile picture. Rendered as an avatar
   * in the message author block, the user-tag autocomplete row, and
   * (for 1:1 chats) as a fallback for `Chat.avatar`.
   */
  avatar?: string
  status: {
    state: 'online' | 'offline' | 'away' | 'busy'
    lastActiveAt?: string
  }
}

export interface UserReference {
  id: Id
}

export const findUserById = (users: User[] | undefined, id: Id): User | undefined => {
  return users?.find((user) => user.id === id)
}
