import chats from '../../.test/chats.json' with { type: 'json' }
import users from '../../.test/users.json' with { type: 'json' }

import type { Action, Chat, Message, User } from '../models/index.ts'
import storyAudioAssetUrl from './story-assets/sample-audio.wav?url&no-inline'
import storyDocumentAssetUrl from './story-assets/sample-document.pdf?url&no-inline'
import storyImageAssetUrl from './story-assets/sample-image.png?url&no-inline'
import storyPhotoAssetUrl from './story-assets/sample-photo.jpg?url&no-inline'
import storyVideoAssetUrl from './story-assets/sample-video.mp4?url&no-inline'

export const storyImageUrl = storyImageAssetUrl
export const storyPhotoUrl = storyPhotoAssetUrl
export const storyAudioUrl = storyAudioAssetUrl
export const storyVideoUrl = storyVideoAssetUrl
export const storyDocumentUrl = storyDocumentAssetUrl

export const sampleUsers = (users as User[]).map((user) => ({
  ...user,
  avatar: storyPhotoUrl,
}))

export const currentUser = sampleUsers[0]!

export const otherUser = sampleUsers[1]!

export const sampleMessages: Message[] = [
  {
    id: '1',
    sender: otherUser,
    content: 'Hey there! Welcome to the thread.',
    createdAt: '2025-12-01T10:00:00Z',
    status: 'read',
  },
  {
    id: '2',
    sender: currentUser,
    content: 'Here is a screenshot from the latest build.',
    createdAt: '2025-12-01T10:02:00Z',
    status: 'delivered',
    edited: true,
    files: [
      {
        name: 'dashboard.png',
        type: 'image/png',
        extension: 'png',
        url: storyImageUrl,
        previewUrl: storyImageUrl,
      },
    ],
  },
  {
    id: '3',
    sender: otherUser,
    content: 'Looks good. Can we ship this with reactions?',
    createdAt: '2025-12-01T10:03:00Z',
    reactions: {
      '👍': ['1', '2'],
      '🔥': ['1'],
    },
    reply: {
      id: '1',
      sender: otherUser,
      content: 'Hey there! Welcome to the thread.',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
  {
    id: '4',
    sender: currentUser,
    content: 'Audio note attached.',
    createdAt: '2025-12-01T10:05:00Z',
    files: [
      {
        name: 'voice-note.wav',
        type: 'audio/wav',
        extension: 'wav',
        url: storyAudioUrl,
        duration: 0.5,
      },
    ],
    status: 'sent',
  },
  {
    id: '5',
    sender: otherUser,
    content: '',
    createdAt: '2025-12-01T10:08:00Z',
    deleted: true,
  },
  {
    id: '6',
    sender: { ...otherUser, name: 'system' },
    content: 'Bob joined the thread.',
    createdAt: '2025-12-01T10:09:00Z',
    system: true,
  },
  {
    id: '7',
    sender: currentUser,
    content: 'Tried to send but failed — tap to retry.',
    createdAt: '2025-12-01T10:10:00Z',
    status: 'failed',
  },
]

export const sampleChats: Chat[] = (chats as Chat[]).map((chat, index) => ({
  ...chat,
  avatar: storyPhotoUrl,
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
  { id: 'archive', label: 'Archive' },
  { id: 'mute', label: 'Mute' },
]

export const messageActions: Action[] = [
  { id: 'reply', label: 'Reply' },
  { id: 'edit', label: 'Edit', icon: 'pencil', ownMessageOnly: true },
  { id: 'delete', label: 'Delete', icon: 'deleted', ownMessageOnly: true },
]
