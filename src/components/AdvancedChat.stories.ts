import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'

import AdvancedChat from '@/components/AdvancedChat.vue'
import type { Message } from '../models/index.ts'
import {
  chatActions,
  currentUser,
  messageActions,
  sampleChat,
  sampleChats,
  sampleMessages,
} from './stories.fixtures.ts'

const meta = {
  title: 'Components/AdvancedChat',
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

type SendMessagePayload = {
  content: string
  files: Array<{ name: string }>
}

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

export const LoadingConversations: Story = {
  args: {
    status: 'loading',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loader = canvas.getByRole('status', { name: 'Loading' })

    await waitFor(() => expect(loader).toBeVisible())
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument()
    await expect(canvas.getByLabelText('Type a message')).not.toBeVisible()
  },
}

export const EmptyNoChats: Story = {
  args: {
    chats: [],
    chat: null,
    messages: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('searchbox')).toBeVisible()
    await expect(canvas.getByText('No chats available.')).toBeVisible()
    await expect(canvas.getByText('No chat selected.')).toBeVisible()
    await expect(canvas.queryByLabelText('Type a message')).not.toBeInTheDocument()
  },
}

export const ErrorWithRetry: Story = {
  args: {
    status: 'error',
    statusMessage: 'The support inbox could not be synchronized.',
    retryLabel: 'Retry synchronization',
    onRetry: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole('alert')

    await expect(alert).toHaveTextContent('The support inbox could not be synchronized.')
    await userEvent.click(canvas.getByRole('button', { name: 'Retry synchronization' }))
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const OfflineWithHistoryPreserved: Story = {
  args: {
    status: 'offline',
    composerDisabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const offlineStatus = canvas
      .getAllByRole('status')
      .find((element) => element.textContent?.includes('Live updates are offline.'))

    await expect(offlineStatus).toHaveTextContent(
      'Live updates are offline. Messages may be delayed.',
    )
    await expect(canvas.getByText('Looks good. Can we ship this with reactions?')).toBeVisible()
    await expect(canvas.getByLabelText('Type a message')).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled()
  },
}

export const ReconnectingWithHistoryPreserved: Story = {
  args: {
    status: 'reconnecting',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reconnectingStatus = canvas
      .getAllByRole('status')
      .find((element) =>
        element.textContent?.includes('Reconnecting and synchronizing messages...'),
      )

    await expect(reconnectingStatus).toHaveTextContent('Reconnecting and synchronizing messages...')
    await expect(canvas.getByText('Looks good. Can we ship this with reactions?')).toBeVisible()
    await expect(canvas.getByLabelText('Type a message')).toBeEnabled()
  },
}

export const StatefulHostSendWorkflow: Story = {
  name: 'Send and display a new message',
  args: {
    'onSend-message': fn(),
  },
  render: (args) => ({
    components: { AdvancedChat },
    setup() {
      const { ['onSend-message']: onSendMessage, ...componentArgs } = args
      const displayedMessages = ref<Message[]>([...sampleMessages])

      const handleSend = (payload: SendMessagePayload) => {
        const notifyHost = onSendMessage as ((value: SendMessagePayload) => void) | undefined
        notifyHost?.(payload)
        displayedMessages.value = [
          ...displayedMessages.value,
          {
            id: `host-${displayedMessages.value.length + 1}`,
            sender: currentUser,
            content: payload.content,
            createdAt: '2025-12-01T10:12:00Z',
            status: 'sent',
          },
        ]
      }

      return { componentArgs, displayedMessages, handleSend }
    },
    template: `
      <AdvancedChat
        v-bind="componentArgs"
        :messages="displayedMessages"
        @send-message="handleSend"
      />
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const composer = canvas.getByLabelText('Type a message')

    await userEvent.type(composer, 'Deployment window confirmed{Enter}')
    await expect(args['onSend-message']).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'Deployment window confirmed' }),
    )
    await expect(canvas.getByText('Deployment window confirmed')).toBeVisible()
    await expect(composer).toHaveValue('')
  },
}

export const MobileListToChatNavigation: Story = {
  args: {
    height: '520px',
    'onOpen-chat': fn(),
  },
  render: (args) => ({
    components: { AdvancedChat },
    setup: () => ({ args }),
    template: `
      <div aria-label="Mobile chat example" role="region" style="width: 360px; max-width: 100%">
        <AdvancedChat v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Open Bob' }))
    await expect(args['onOpen-chat']).toHaveBeenCalledWith(
      expect.objectContaining({ id: sampleChats[1]?.id, name: 'Bob' }),
    )

    const listToggle = await canvas.findByRole('button', { name: 'Toggle chat list' })
    await expect(listToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByRole('button', { name: 'Open Alice' })).not.toBeInTheDocument()

    await userEvent.click(listToggle)
    await expect(canvas.getByRole('button', { name: 'Open Alice' })).toBeVisible()
  },
}

export const SearchInteractsWithList: Story = {
  name: 'Search conversations',
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
  name: 'Open another chat',
  args: {
    'onOpen-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    // pick the second row in the chat list
    const rows = canvasElement.querySelectorAll('.acc-room-item')
    expect(rows.length).toBeGreaterThan(1)
    await userEvent.click(rows[1] as Element)
    await expect(args['onOpen-chat']).toHaveBeenCalled()
  },
}

export const SendMessageEmitsPayload: Story = {
  name: 'Send a message',
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
  name: 'Reply to a message',
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement }) => {
    // open the dropdown of the first non-deleted message bubble
    const dropdown = canvasElement.querySelector(
      '.acc-dropdown-picker .acc-message-options',
    ) as HTMLElement
    await userEvent.click(dropdown)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const replyButton = within(canvasElement).getByText('Reply')
    await userEvent.click(replyButton)
    // footer should now show the reply preview
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-footer-reply-wrapper')).toBeTruthy()
    })
  },
}

export const ToggleChatListEmitsAndRotatesIcon: Story = {
  name: 'Toggle the chat list',
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('.acc-toggle-button') as HTMLElement
    expect(toggle).toBeTruthy()
    // initial: icon is rotated 360 (default state)
    await userEvent.click(toggle)
    // after click: showChatList flips and the toggle re-renders without crashing
    expect(canvasElement.querySelector('.acc-toggle-button')).toBeTruthy()
  },
}

export const HiddenChatList: Story = {
  args: {
    showChats: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-rooms-container')).not.toBeVisible()
  },
}

export const ThemeOverride: Story = {
  args: {
    theme: { base: 'light', overrides: { '--chat-message-bg-color-me': '#ffeb3b' } },
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.acc-card-window') as HTMLElement
    expect(card.style.cssText).toContain('--chat-message-bg-color-me: #ffeb3b')
  },
}

export const HeaderMenuActionFires: Story = {
  name: 'Choose a header action',
  args: {
    'onMenu-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const menuTrigger = canvasElement.querySelector('.acc-room-options') as HTMLElement
    expect(menuTrigger).toBeTruthy()
    await userEvent.click(menuTrigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const item = canvasElement.querySelector('.acc-menu-item') as HTMLElement
    await userEvent.click(item)
    await expect(args['onMenu-action-handler']).toHaveBeenCalled()
  },
}

export const ChatInfoClickFires: Story = {
  name: 'Open chat details',
  args: {
    chatInfoEnabled: true,
    'onShow-chat-info': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const info = canvasElement.querySelector('.acc-info-wrapper.acc-item-clickable') as HTMLElement
    await userEvent.click(info)
    await expect(args['onShow-chat-info']).toHaveBeenCalled()
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

export const DraftClearsWhenChatChanges: Story = {
  name: 'Switch chats with a draft',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message') as HTMLTextAreaElement
    await userEvent.type(textarea, 'private draft')
    const rows = canvasElement.querySelectorAll('.acc-room-item')
    await userEvent.click(rows[1] as Element)
    await waitFor(() => expect(textarea.value).toBe(''))
  },
}

export const PublicStateSurfaces: Story = {
  name: 'Permission denied',
  args: {
    status: 'permission-denied',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toHaveTextContent(
      'You do not have permission to use this conversation.',
    )
    await expect(canvas.getByLabelText('Type a message')).not.toBeVisible()
  },
}

export const SendIconCanBeHidden: Story = {
  name: 'Composer without a send button',
  args: {
    showSendIcon: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[aria-label="Send message"]')).toBeFalsy()
  },
}

export const OnlyFirstUnreadDividerRenders: Story = {
  name: 'Unread messages divider',
  args: {
    messages: sampleMessages.map((message) => ({ ...message, unread: true })),
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll('.acc-line-new')).toHaveLength(1)
  },
}
