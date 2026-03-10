import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatFooter from './ChatFooter.vue'
import { sampleChat, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatFooter,
  tags: ['autodocs'],
  args: {
    chat: sampleChat,
    users: sampleUsers,
  },
} satisfies Meta<typeof ChatFooter>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Replying: Story = {
  args: {
    initReplyMessage: sampleMessages[0],
  },
}
