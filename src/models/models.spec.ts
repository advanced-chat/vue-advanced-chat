import { describe, it, expect } from 'vitest'
import { findUserById } from './user'
import { typingUsersString } from './chat'
import type { User, Chat } from './index'

const alice: User = { id: 1, name: 'Alice', status: { state: 'online' } }
const bob: User = { id: 2, name: 'Bob', status: { state: 'offline' } }
const charlie: User = { id: '3', name: 'Charlie', status: { state: 'online' } }

const strings = {
  'chats.empty': '',
  'chats.search.placeholder': '',
  'chat.empty': '',
  'chat.messages.empty': '',
  'chat.messages.new': '',
  'chat.message.placeholder': '',
  'chat.message.deleted': '',
  'chat.message.failure': '',
  'chat.typing': 'is typing...',
  'chat.cancel-selection': '',
  'chat.cancel-reply': '',
  'chat.cancel-edit': '',
  'chat.scroll-to-bottom': '',
  'chat.user.is-online': '',
  'chat.user.last-seen': '',
}

describe('findUserById', () => {
  it('returns the user when present', () => {
    expect(findUserById([alice, bob], 1)).toBe(alice)
  })

  it('coerces id types to strings before comparison', () => {
    expect(findUserById([charlie], 3)).toBe(charlie)
    expect(findUserById([charlie], '3')).toBe(charlie)
  })

  it('returns undefined when the user list is missing', () => {
    expect(findUserById(undefined, 1)).toBeUndefined()
    expect(findUserById([alice], 999)).toBeUndefined()
  })
})

describe('typingUsersString', () => {
  it('returns empty when no one is typing', () => {
    const chat: Chat = { id: 1, name: 'Room', users: [alice, bob], typingUsers: [] }
    expect(typingUsersString(chat, strings)).toBe('')
  })

  it('returns the i18n base string when only two users in the room', () => {
    const chat: Chat = { id: 1, name: 'Room', users: [alice, bob], typingUsers: [{ id: 2 }] }
    expect(typingUsersString(chat, strings)).toBe('is typing...')
  })

  it('prefixes names when there are more than two participants', () => {
    const chat: Chat = {
      id: 1,
      name: 'Room',
      users: [alice, bob, charlie],
      typingUsers: [{ id: 2 }, { id: '3' }],
    }
    expect(typingUsersString(chat, strings)).toBe('Bob, Charlie is typing...')
  })

  it('returns empty when typing-user ids do not match any room member', () => {
    const chat: Chat = {
      id: 1,
      name: 'Room',
      users: [alice, bob, charlie],
      typingUsers: [{ id: 999 }],
    }
    expect(typingUsersString(chat, strings)).toBe('')
  })

  it('returns empty when chat.users is missing', () => {
    const chat: Chat = { id: 1, name: 'Room', typingUsers: [{ id: 1 }] }
    expect(typingUsersString(chat, strings)).toBe('')
  })
})
