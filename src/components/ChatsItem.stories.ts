import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import ChatsItem from './ChatsItem.vue'

import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat, User } from '../models/index.ts'
import { sampleUsers, storyAudioUrl, storyPhotoUrl } from './stories.fixtures.ts'

const storyChats = (chats as Chat[]).map((chat) => ({ ...chat, avatar: storyPhotoUrl }))

const meta = {
  title: 'Components/ChatsItem',
  component: ChatsItem,
  tags: ['autodocs'],
  args: {
    currentUser: sampleUsers[0]!,
    chat: storyChats[0] as Chat,
  },
} satisfies Meta<typeof ChatsItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithActions: Story = {
  args: {
    actions: [
      { id: 'archive', label: 'Archive' },
      { id: 'mute', label: 'Mute' },
    ],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-list-room-options')).toBeTruthy()
  },
}

export const ActionHandlerEmits: Story = {
  name: 'Choose a chat action',
  args: {
    actions: [{ id: 'archive', label: 'Archive' }],
    'onChat-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const trigger = canvasElement.querySelector('.acc-list-room-options') as HTMLElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const item = canvasElement.querySelector('.acc-menu-item') as HTMLElement
    await userEvent.click(item)
    await expect(args['onChat-action-handler']).toHaveBeenCalledWith(
      expect.objectContaining({
        action: { id: 'archive', label: 'Archive' },
      }),
    )
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-item')).toBeNull()
    })
  },
}

export const UnreadBadge: Story = {
  args: {
    chat: { ...storyChats[0]!, unreadCount: 5 },
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('.acc-badge-counter')
    expect(badge?.textContent).toContain('5')
  },
}

export const TypingIndicator: Story = {
  args: {
    chat: {
      ...storyChats[0]!,
      lastMessage: undefined,
      users: sampleUsers,
      typingUsers: [{ id: '2' }],
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('typing')
  },
}

export const OnlineDot: Story = {
  name: 'Online conversation',
  args: {
    currentUser: sampleUsers[0]!,
    chat: { ...storyChats[0]!, users: [sampleUsers[0], sampleUsers[1]] as User[] } as Chat,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-state-circle')).toBeTruthy()
  },
}

export const AudioLastMessage: Story = {
  name: 'Audio message preview',
  args: {
    chat: {
      ...storyChats[0]!,
      lastMessage: {
        id: '1',
        content: '',
        createdAt: '2025-12-01T10:00:00Z',
        sender: sampleUsers[0]! as User,
        files: [
          {
            name: 'voice.wav',
            type: 'audio/wav',
            extension: 'wav',
            url: storyAudioUrl,
            duration: 0.5,
          },
        ],
      },
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-icon-microphone')).toBeTruthy()
    expect(canvasElement.textContent).toContain('0:00.5')
  },
}
