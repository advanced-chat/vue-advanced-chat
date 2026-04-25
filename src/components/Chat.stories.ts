import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'

import Chat from './Chat.vue'
import {
  chatActions,
  currentUser,
  messageActions,
  sampleChat,
  sampleMessages,
} from './stories.fixtures.ts'

const meta = {
  component: Chat,
  tags: ['autodocs'],
  args: {
    user: currentUser,
    chat: sampleChat,
    messages: sampleMessages,
    headerActions: chatActions,
    messageActions,
    standalone: true,
    messageSelection: {
      enabled: false,
      actions: [{ name: 'delete', title: 'Delete' }],
    },
    'onClicked:user-tag': fn(),
  },
} satisfies Meta<typeof Chat>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  args: {
    loadingMessages: true,
    messages: [],
  },
}

export const Empty: Story = {
  args: {
    messages: [],
  },
}

export const NoChatSelected: Story = {
  args: {
    chat: null,
  },
}

export const SelectionMode: Story = {
  args: {
    messageSelection: {
      enabled: true,
      actions: [{ name: 'delete', title: 'Delete' }],
    },
  },
}
