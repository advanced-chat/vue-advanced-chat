import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AdvancedChat from '@/components/AdvancedChat.vue'
import {
  chatActions,
  currentUser,
  messageActions,
  sampleChat,
  sampleChats,
  sampleMessages,
} from './stories.fixtures.ts'

const meta = {
  component: AdvancedChat,
  tags: ['autodocs'],
  parameters: {
    skipLayout: true,
  },
  args: {
    height: '600px',
    user: currentUser,
    chats: sampleChats,
    chat: sampleChat,
    messages: sampleMessages,
    headerActions: chatActions,
    messageActions,
  },
} satisfies Meta<typeof AdvancedChat>

export default meta

type Story = StoryObj<typeof meta>

export const LightMode: Story = {
  args: {
    theme: 'light',
  },
}

export const DarkMode: Story = {
  args: {
    theme: 'dark',
  },
}
