import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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
    chatsLoaded: true,
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
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-loader-wrapper')).toBeTruthy()
  },
}

export const Empty: Story = {
  args: {
    chats: [],
    chatsLoaded: true,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-rooms-empty')).toBeTruthy()
  },
}

export const WithActions: Story = {
  args: {
    chatActions: [
      { id: 'archive', label: 'Archive' },
      { id: 'mute', label: 'Mute' },
    ],
  },
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll('.vac-list-room-options')
    expect(triggers.length).toBe(3)
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

export const CustomSearchKeepsList: Story = {
  args: {
    customSearchEnabled: true,
    'onSearch-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const searchInput = canvas.getByRole('searchbox')
    await userEvent.click(searchInput)
    await userEvent.type(searchInput, 'zzz')
    await expect(args['onSearch-chat']).toHaveBeenCalled()
    // local list is NOT filtered when customSearchEnabled is true
    expect(canvas.getByText('Alice')).toBeInTheDocument()
    expect(canvas.getByText('Bob')).toBeInTheDocument()
  },
}

export const ClickOpensChat: Story = {
  args: {
    'onOpen-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const rows = canvasElement.querySelectorAll('.vac-room-item')
    expect(rows.length).toBe(3)
    await userEvent.click(rows[1] as Element)
    await expect(args['onOpen-chat']).toHaveBeenCalled()
    const calls = (args['onOpen-chat'] as ReturnType<typeof fn>).mock.calls
    expect((calls[0]?.[0] as Chat).name).toBe('Bob')
  },
}

export const ChatActionHandlerEmits: Story = {
  args: {
    chatActions: [{ id: 'archive', label: 'Archive' }],
    'onChat-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const trigger = canvasElement.querySelector('.vac-list-room-options') as HTMLElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const action = canvasElement.querySelector('.vac-menu-item') as HTMLElement
    await userEvent.click(action)
    await expect(args['onChat-action-handler']).toHaveBeenCalled()
  },
}

export const AddChatEmits: Story = {
  args: {
    'onAdd-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const addButton = canvasElement.querySelector('.vac-add-icon') as HTMLElement
    await userEvent.click(addButton)
    await expect(args['onAdd-chat']).toHaveBeenCalled()
  },
}

export const FewerThanMinimumTriggersLoadMore: Story = {
  args: {
    chats: chats.slice(0, 1) as Chat[],
    chatsLoaded: false,
    minimumVisibleChats: 5,
    'onFetch-more-chats': fn(),
    'onLoading-more-chats': fn(),
  },
  play: async ({ args }) => {
    await waitFor(() => {
      expect(args['onFetch-more-chats']).toHaveBeenCalled()
    })
    await expect(args['onLoading-more-chats']).toHaveBeenCalledWith(true)
  },
}

export const StopsLoadingMoreWhenAllLoaded: Story = {
  args: {
    chats: [],
    chatsLoaded: true,
    'onFetch-more-chats': fn(),
  },
  play: async ({ args }) => {
    // chatsLoaded=true short-circuits the watch; loadMoreChats never emits.
    expect(args['onFetch-more-chats']).not.toHaveBeenCalled()
  },
}
