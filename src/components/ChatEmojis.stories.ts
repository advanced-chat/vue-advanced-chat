import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatEmojis from './ChatEmojis.vue'

const meta = {
  component: ChatEmojis,
  tags: ['autodocs'],
  args: {
    filteredEmojis: ['😀', '😂', '🔥', '🎉'],
  },
} satisfies Meta<typeof ChatEmojis>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
