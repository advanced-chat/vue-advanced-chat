import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageFiles from './MessageFiles.vue'

const meta = {
  component: MessageFiles,
  tags: ['autodocs'],
  args: {
    user: {
      id: 1,
    },
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
      files: [
        {
          name: 'example.jpg',
          type: 'image/jpeg',
          extension: 'jpg',
          url: 'https://picsum.photos/200',
        },
      ],
    },
    users: [
      {
        id: 1,
        name: 'Alice',
        status: {
          state: 'online',
        },
      },
    ],
  },
} satisfies Meta<typeof MessageFiles>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messageSelectionEnabled: false,
  },
}
