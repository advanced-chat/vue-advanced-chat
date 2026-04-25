import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

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

export const Loading: Story = {
  args: {
    loadingChats: true,
  },
}

export const Empty: Story = {
  args: {
    chats: [],
    chatsLoaded: true,
  },
}

export const WithActions: Story = {
  args: {
    chatActions: [
      { name: 'archive', title: 'Archive' },
      { name: 'mute', title: 'Mute' },
    ],
  },
}

export const SearchFiltersList: Story = {
  args: {
    'onSearch-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Alice')).toBeInTheDocument()
    await expect(canvas.getByText('Bob')).toBeInTheDocument()
    await expect(canvas.getByText('Charlie')).toBeInTheDocument()

    const searchInput = canvas.getByRole('searchbox')

    await userEvent.click(searchInput)
    await userEvent.type(searchInput, 'Bob')

    await expect(args['onSearch-chat']).toHaveBeenCalled()
    await expect(canvas.getByText('Bob')).toBeInTheDocument()
    await expect(canvas.queryByText('Alice')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Charlie')).not.toBeInTheDocument()
  },
}
