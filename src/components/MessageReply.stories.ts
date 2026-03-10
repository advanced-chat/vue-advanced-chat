import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageReply from './MessageReply.vue'

const meta = {
  component: MessageReply,
  tags: ['autodocs'],
  args: {
    message: {
      id: 1,
      content: 'Hey there!',
      createdAt: '2025-12-01T10:00:00Z',
      sender: {
        id: 1,
        name: 'Alice',
        status: {
          state: 'online',
        },
      },
      reply: {
        id: 2,
        content: "What's up?",
        createdAt: '2025-12-01T10:05:00Z',
        sender: {
          id: 2,
          name: 'Bob',
          status: {
            state: 'away',
          },
        },
      },
    },
    users: [
      {
        id: 1,
        name: 'Alice',
        status: {
          state: 'online',
        },
      },
      {
        id: 2,
        name: 'Bob',
        status: {
          state: 'away',
        },
      },
      {
        id: 3,
        name: 'Charlie',
        status: {
          state: 'offline',
          lastActiveAt: '2025-11-30T13:22:23Z',
        },
      },
    ],
  },
} satisfies Meta<typeof MessageReply>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
