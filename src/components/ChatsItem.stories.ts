import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatsItem from './ChatsItem.vue'

import users from '../../.test/users.json' with { type: 'json' }
import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat } from '../models/index.ts'

const meta = {
  component: ChatsItem,
  tags: ['autodocs'],
  args: {
    user: users[0],
    chat: chats[0] as Chat,
  },
} satisfies Meta<typeof ChatsItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
