import chats from '../../.test/chats.json' with { type: 'json' }
import users from '../../.test/users.json' with { type: 'json' }

import type { Action, Chat, Message, User } from '../models/index.ts'

export const sampleUsers = users as User[]

export const currentUser = sampleUsers[0]!

export const otherUser = sampleUsers[1]!

export const sampleMessages: Message[] = [
  {
    id: 1,
    sender: otherUser,
    content: 'Hey there! Welcome to the thread.',
    createdAt: '2025-12-01T10:00:00Z',
    read: true,
  },
  {
    id: 2,
    sender: currentUser,
    content: 'Here is a screenshot from the latest build.',
    createdAt: '2025-12-01T10:02:00Z',
    delivered: true,
    edited: true,
    files: [
      {
        name: 'dashboard.png',
        type: 'image/png',
        extension: 'png',
        url: 'https://picsum.photos/420/240',
        previewUrl: 'https://picsum.photos/420/240',
      },
    ],
  },
  {
    id: 3,
    sender: otherUser,
    content: 'Looks good. Can we ship this with reactions?',
    createdAt: '2025-12-01T10:03:00Z',
    reactions: {
      '👍': [1, 2],
      '🔥': [1],
    },
    reply: {
      id: 1,
      sender: otherUser,
      content: 'Hey there! Welcome to the thread.',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
  {
    id: 4,
    sender: currentUser,
    content: 'Audio note attached.',
    createdAt: '2025-12-01T10:05:00Z',
    files: [
      {
        name: 'voice-note.mp3',
        type: 'audio/mpeg',
        extension: 'mp3',
        url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        duration: 104,
      },
    ],
    saved: true,
  },
  {
    id: 5,
    sender: otherUser,
    content: '',
    createdAt: '2025-12-01T10:08:00Z',
    deleted: true,
  },
  {
    id: 6,
    sender: { ...otherUser, name: 'system' },
    content: 'Bob joined the thread.',
    createdAt: '2025-12-01T10:09:00Z',
    system: true,
  },
  {
    id: 7,
    sender: currentUser,
    content: 'Tried to send but failed — tap to retry.',
    createdAt: '2025-12-01T10:10:00Z',
    failure: true,
  },
]

export const sampleChats: Chat[] = (chats as Chat[]).map((chat, index) => ({
  ...chat,
  users: sampleUsers,
  unreadCount: index === 0 ? 3 : 0,
  typingUsers: index === 1 ? [otherUser] : [],
}))

export const sampleChat = {
  ...sampleChats[0]!,
  users: sampleUsers,
  typingUsers: [],
} satisfies Chat

export const chatActions: Action[] = [
  { name: 'archive', title: 'Archive' },
  { name: 'mute', title: 'Mute' },
]

export const messageActions: Action[] = [
  { name: 'reply', title: 'Reply' },
  { name: 'edit', title: 'Edit', onlyMe: true },
  { name: 'delete', title: 'Delete', onlyMe: true },
]
