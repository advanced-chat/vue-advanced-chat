import type { Id } from './id.ts'

export interface User {
  id: Id
  name: string
  status: {
    state: 'online' | 'offline' | 'away' | 'busy'
    lastActiveAt?: string
  }
}

export interface UserReference {
  id: Id
}

export const findUserById = (users: User[] | undefined, id: Id): User | undefined => {
  const userId = id.toString()

  return users?.find((user) => user.id.toString() === userId)
}
