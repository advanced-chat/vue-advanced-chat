import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatsItem from './ChatsItem.vue'

const meta = {
  component: ChatsItem,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ChatsItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
