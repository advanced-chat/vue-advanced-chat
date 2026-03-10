import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Chats from './Chats.vue'

import users from '../../.test/users.json' with { type: 'json' }
import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat } from '../models/index.ts'

const meta = {
  component: Chats,
  tags: ['autodocs'],
  parameters: {
    height: '600px',
  },
  args: {
    user: users[0],
    chats: chats as Chat[],
    chat: chats[0] as Chat,
  },
} satisfies Meta<typeof Chats>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
