import type { Meta, StoryObj } from '@storybook/vue3-vite'

import EmojiPicker from '@/EmojiPicker.vue'

const meta = {
  component: EmojiPicker,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof EmojiPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    opened: true
  },
}
