import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Chats from './Chats.vue'

const meta = {
  component: Chats,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Chats>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
