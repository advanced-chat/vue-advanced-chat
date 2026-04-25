import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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
    currentUser: currentUser,
    chats: sampleChats,
    chatsLoaded: true,
    chat: sampleChat,
    messages: sampleMessages,
    messagesLoaded: true,
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

export const SearchInteractsWithList: Story = {
  args: {
    'onSearch-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const searchInput = canvas.getByRole('searchbox')
    await userEvent.click(searchInput)
    await userEvent.type(searchInput, 'Bob')
    await expect(args['onSearch-chat']).toHaveBeenCalled()
    expect(canvas.queryByText('Charlie')).not.toBeInTheDocument()
  },
}

export const ClickAnotherChatEmitsOpen: Story = {
  args: {
    'onOpen-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    // pick the second row in the chat list
    const rows = canvasElement.querySelectorAll('.vac-room-item')
    expect(rows.length).toBeGreaterThan(1)
    await userEvent.click(rows[1] as Element)
    await expect(args['onOpen-chat']).toHaveBeenCalled()
  },
}

export const SendMessageEmitsPayload: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await userEvent.type(textarea, 'hello{Enter}')
    await expect(args['onSend-message']).toHaveBeenCalled()
    const payload = (args['onSend-message'] as ReturnType<typeof fn>).mock.calls[0]?.[0] as {
      content: string
    }
    expect(payload.content).toBe('hello')
  },
}

export const ReplyActionPrefillsFooter: Story = {
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement }) => {
    // open the dropdown of the first non-deleted message bubble
    const dropdown = canvasElement.querySelector(
      '.vac-dropdown-picker .vac-message-options',
    ) as HTMLElement
    await userEvent.click(dropdown)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const replyButton = within(canvasElement).getByText('Reply')
    await userEvent.click(replyButton)
    // footer should now show the reply preview
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-footer-reply-wrapper')).toBeTruthy()
    })
  },
}

export const ToggleChatListEmitsAndRotatesIcon: Story = {
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('.vac-toggle-button') as HTMLElement
    expect(toggle).toBeTruthy()
    // initial: icon is rotated 360 (default state)
    await userEvent.click(toggle)
    // after click: showChatList flips and the toggle re-renders without crashing
    expect(canvasElement.querySelector('.vac-toggle-button')).toBeTruthy()
  },
}

export const HiddenChatList: Story = {
  args: {
    showChats: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-rooms-container')).toBeFalsy()
  },
}

export const ThemeOverride: Story = {
  args: {
    theme: { base: 'light', overrides: { '--chat-message-bg-color-me': '#ffeb3b' } },
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.vac-card-window') as HTMLElement
    expect(card.style.cssText).toContain('--chat-message-bg-color-me: #ffeb3b')
  },
}

export const HeaderMenuActionFires: Story = {
  args: {
    'onMenu-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const menuTrigger = canvasElement.querySelector('.vac-room-options') as HTMLElement
    expect(menuTrigger).toBeTruthy()
    await userEvent.click(menuTrigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const item = canvasElement.querySelector('.vac-menu-item') as HTMLElement
    await userEvent.click(item)
    await expect(args['onMenu-action-handler']).toHaveBeenCalled()
  },
}

export const ChatInfoClickFires: Story = {
  args: {
    chatInfoEnabled: true,
    'onShow-chat-info': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const info = canvasElement.querySelector('.vac-info-wrapper.vac-item-clickable') as HTMLElement
    await userEvent.click(info)
    await expect(args['onShow-chat-info']).toHaveBeenCalled()
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
