import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatMessage from './ChatMessage.vue'
import { currentUser, messageActions, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatMessage,
  tags: ['autodocs'],
  args: {
    user: currentUser,
    message: sampleMessages[2],
    messages: sampleMessages,
    index: 2,
    users: sampleUsers,
    actions: messageActions,
  },
} satisfies Meta<typeof ChatMessage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
