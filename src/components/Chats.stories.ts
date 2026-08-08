import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { nextTick, ref } from 'vue'

import Chats from './Chats.vue'

import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat } from '../models/index.ts'
import { sampleUsers, storyPhotoUrl } from './stories.fixtures.ts'

const storyChats = (chats as Chat[]).map((chat) => ({ ...chat, avatar: storyPhotoUrl }))

const meta = {
  title: 'Components/Chats',
  component: Chats,
  tags: ['autodocs'],
  parameters: {
    height: '600px',
  },
  args: {
    currentUser: sampleUsers[0],
    chats: storyChats,
    chatsLoaded: true,
    chat: storyChats[0] as Chat,
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
    expect(canvasElement.querySelector('.acc-loader-wrapper')).toBeTruthy()
  },
}

export const Empty: Story = {
  args: {
    chats: [],
    chatsLoaded: true,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-rooms-empty')).toBeTruthy()
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
    const triggers = canvasElement.querySelectorAll('.acc-list-room-options')
    expect(triggers.length).toBe(3)
  },
}

export const SearchFiltersList: Story = {
  name: 'Search conversations',
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

export const LocalSearchEmpty: Story = {
  name: 'No search results',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchInput = canvas.getByRole('searchbox')

    await userEvent.type(searchInput, 'no matching chat')

    await expect(canvas.getByText('No chats available.')).toBeInTheDocument()
    expect(canvasElement.querySelectorAll('.acc-room-item')).toHaveLength(0)
  },
}

export const CustomSearchKeepsList: Story = {
  name: 'Host-managed search results',
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
  name: 'Open a conversation',
  args: {
    'onOpen-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const rows = canvasElement.querySelectorAll('.acc-room-item')
    expect(rows.length).toBe(3)
    await userEvent.click(rows[1] as Element)
    await expect(args['onOpen-chat']).toHaveBeenCalled()
    const calls = (args['onOpen-chat'] as ReturnType<typeof fn>).mock.calls
    expect((calls[0]?.[0] as Chat).name).toBe('Bob')
  },
}

export const ChatActionHandlerEmits: Story = {
  name: 'Choose a chat action',
  args: {
    chatActions: [{ id: 'archive', label: 'Archive' }],
    'onChat-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const trigger = canvasElement.querySelector('.acc-list-room-options') as HTMLElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const action = canvasElement.querySelector('.acc-menu-item') as HTMLElement
    await userEvent.click(action)
    await expect(args['onChat-action-handler']).toHaveBeenCalled()
  },
}

export const AddChatEmits: Story = {
  name: 'Start a new chat',
  args: {
    'onAdd-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const addButton = canvasElement.querySelector('.acc-add-icon') as HTMLElement
    await userEvent.click(addButton)
    await expect(args['onAdd-chat']).toHaveBeenCalled()
  },
}

export const FewerThanMinimumTriggersLoadMore: Story = {
  name: 'Load more when the list is short',
  args: {
    chats: storyChats.slice(0, 1),
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

export const LoadingRecovery: Story = {
  name: 'Continue loading chats',
  args: {
    chats: storyChats.slice(0, 1),
    chatsLoaded: false,
    minimumVisibleChats: 5,
    'onFetch-more-chats': fn(),
    'onLoading-more-chats': fn(),
  },
  render: (args) => ({
    components: { Chats },
    setup() {
      const loadingChats = ref(true)
      const chatsLoaded = ref(false)
      const completeLoading = async () => {
        loadingChats.value = true
        await nextTick()
        loadingChats.value = false
      }

      return { args, chatsLoaded, completeLoading, loadingChats }
    },
    template: `
      <div>
        <button type="button" @click="completeLoading">Complete host loading</button>
        <button type="button" @click="chatsLoaded = true">Mark all chats loaded</button>
        <Chats
          v-bind="args"
          :chats-loaded="chatsLoaded"
          :loading-chats="loadingChats"
        />
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const completeLoading = canvas.getByRole('button', { name: 'Complete host loading' })

    expect(args['onFetch-more-chats']).not.toHaveBeenCalled()

    await userEvent.click(completeLoading)
    await waitFor(() => expect(args['onFetch-more-chats']).toHaveBeenCalledTimes(1))

    await userEvent.click(completeLoading)
    await waitFor(() => expect(args['onFetch-more-chats']).toHaveBeenCalledTimes(2))
    await expect(args['onLoading-more-chats']).toHaveBeenCalledWith(false)

    await userEvent.click(canvas.getByRole('button', { name: 'Mark all chats loaded' }))
    await waitFor(() => {
      expect(canvasElement.querySelector('#infinite-loader-rooms .acc-loader-wrapper')).toBeFalsy()
    })
    expect(args['onFetch-more-chats']).toHaveBeenCalledTimes(2)
  },
}

export const HostAppendClearsPending: Story = {
  name: 'Receive more chats',
  args: {
    chats: storyChats.slice(0, 1),
    chatsLoaded: false,
    minimumVisibleChats: 2,
    'onFetch-more-chats': fn(),
    'onLoading-more-chats': fn(),
  },
  render: (args) => ({
    components: { Chats },
    setup() {
      const chatList = ref(args.chats)

      return {
        args,
        chatList,
        supplyMoreChats: () => {
          chatList.value = storyChats.slice(0, 2)
        },
      }
    },
    template: `
      <div>
        <button type="button" @click="supplyMoreChats">Supply more chats</button>
        <Chats v-bind="args" :chats="chatList" />
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await waitFor(() => expect(args['onFetch-more-chats']).toHaveBeenCalledTimes(1))
    await expect(
      canvasElement.querySelector('#infinite-loader-rooms .acc-loader-wrapper'),
    ).toBeTruthy()

    await userEvent.click(canvas.getByRole('button', { name: 'Supply more chats' }))
    await waitFor(() => expect(args['onLoading-more-chats']).toHaveBeenCalledWith(false))
  },
}

export const StopsLoadingMoreWhenAllLoaded: Story = {
  name: 'All chats loaded',
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
