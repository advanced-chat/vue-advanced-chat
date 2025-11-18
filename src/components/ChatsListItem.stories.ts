import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatsListItem from './ChatsListItem.vue'

const meta = {
  component: ChatsListItem,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ChatsListItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
