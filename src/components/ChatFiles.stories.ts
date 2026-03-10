import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatFiles from './ChatFiles.vue'

const meta = {
  component: ChatFiles,
  tags: ['autodocs'],
  args: {
    files: [
      {
        name: 'dashboard.png',
        type: 'image/png',
        extension: 'png',
        url: 'https://picsum.photos/200/200',
      },
      {
        name: 'notes.pdf',
        type: 'application/pdf',
        extension: 'pdf',
        url: 'https://example.com/notes.pdf',
      },
    ],
  },
} satisfies Meta<typeof ChatFiles>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
