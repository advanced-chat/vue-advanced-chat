import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatFile from './ChatFile.vue'

const meta = {
  component: ChatFile,
  tags: ['autodocs'],
  args: {
    index: 0,
    file: {
      name: 'dashboard.png',
      type: 'image/png',
      extension: 'png',
      url: 'https://picsum.photos/200/200',
    },
  },
} satisfies Meta<typeof ChatFile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
