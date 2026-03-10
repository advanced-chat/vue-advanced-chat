import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageFile from './MessageFile.vue'

const meta = {
  component: MessageFile,
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
    file: {
      name: 'example.jpg',
      type: 'image/jpeg',
      extension: 'jpg',
      url: 'https://picsum.photos/200',
    },
  },
} satisfies Meta<typeof MessageFile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    index: 0,
    messageSelectionEnabled: false,
  },
}
