import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import ChatsItem from './ChatsItem.vue'

import users from '../../.test/users.json' with { type: 'json' }
import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat, User } from '../models/index.ts'

const meta = {
  component: ChatsItem,
  tags: ['autodocs'],
  args: {
    currentUser: users[0]!,
    chat: chats[0] as Chat,
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
  },
}

export const UnreadBadge: Story = {
  args: {
    chat: { ...(chats[0] as Chat), unreadCount: 5 },
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('.acc-badge-counter')
    expect(badge?.textContent).toContain('5')
  },
}

export const TypingIndicator: Story = {
  args: {
    chat: {
      ...(chats[0] as Chat),
      lastMessage: undefined,
      users: users as User[],
      typingUsers: [{ id: '2' }],
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('typing')
  },
}

export const OnlineDot: Story = {
  args: {
    currentUser: users[0]!,
    chat: { ...(chats[0] as Chat), users: [users[0], users[1]] as User[] } as Chat,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-state-circle')).toBeTruthy()
  },
}

export const AudioLastMessage: Story = {
  args: {
    chat: {
      ...(chats[0] as Chat),
      lastMessage: {
        id: '1',
        content: '',
        createdAt: '2025-12-01T10:00:00Z',
        sender: users[0]! as User,
        files: [
          {
            name: 'voice.mp3',
            type: 'audio/mpeg',
            extension: 'mp3',
            url: 'https://example.com/voice.mp3',
            duration: 65,
          },
        ],
      },
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-icon-microphone')).toBeTruthy()
    expect(canvasElement.textContent).toContain('1:05')
  },
}
