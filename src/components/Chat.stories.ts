import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import Chat from './Chat.vue'
import {
  chatActions,
  currentUser,
  messageActions,
  otherUser,
  sampleChat,
  sampleMessages,
} from './stories.fixtures.ts'

const meta = {
  title: 'Components/Chat',
  component: Chat,
  tags: ['autodocs'],
  args: {
    currentUser: currentUser,
    chat: sampleChat,
    messages: sampleMessages,
    messagesLoaded: true,
    headerActions: chatActions,
    messageActions,
    standalone: true,
    'onClick-user-tag': fn(),
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
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-loader-wrapper')).toBeTruthy()
  },
}

export const Empty: Story = {
  args: {
    messages: [],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('No messages yet')
  },
}

export const NoChatSelected: Story = {
  args: {
    chat: null,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('No chat selected')
  },
}

export const SelectionMode: Story = {
  args: {
    selectionActions: [{ id: 'delete', label: 'Delete' }],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-message-row-selectable')).toBeTruthy()
  },
}

export const SelectionToolbarFiresAction: Story = {
  name: 'Run a bulk action',
  args: {
    selectionActions: [{ id: 'delete', label: 'Delete' }],
    'onMessage-selection-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const rows = canvasElement.querySelectorAll('.acc-message-row-selectable')
    await userEvent.click(rows[0] as Element)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-selection-button')).toBeTruthy()
    })
    const deleteBtn = canvasElement.querySelector('.acc-selection-button') as HTMLElement
    await userEvent.click(deleteBtn)
    await expect(args['onMessage-selection-action-handler']).toHaveBeenCalled()
  },
}

export const ReplyActionPrefillsFooter: Story = {
  name: 'Reply to a message',
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement }) => {
    const dropdown = canvasElement.querySelector(
      '.acc-dropdown-picker .acc-message-options',
    ) as HTMLElement
    await userEvent.click(dropdown)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const reply = within(canvasElement).getByText('Reply')
    await userEvent.click(reply)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-footer-reply-wrapper')).toBeTruthy()
    })
  },
}

export const EditActionPrefillsFooter: Story = {
  name: 'Edit a message',
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement }) => {
    // find the own-message dropdown (the second message in fixtures is from currentUser)
    const dropdowns = canvasElement.querySelectorAll('.acc-dropdown-picker .acc-message-options')
    const ownDropdown = Array.from(dropdowns).find((el) => {
      const card = el.closest('.acc-message-current')
      return card !== null
    }) as HTMLElement | undefined
    if (!ownDropdown) throw new Error('no own-message dropdown found')
    await userEvent.click(ownDropdown)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const edit = within(canvasElement).getByText('Edit')
    await userEvent.click(edit)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-textarea-outline')).toBeTruthy()
    })
  },
}

export const MediaPreviewOpensOnImageClick: Story = {
  name: 'Open an image preview',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const image = canvas.getByRole('button', { name: /^Preview / })
    await userEvent.click(image)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-media-preview')).toBeTruthy()
    })
  },
}

export const EmptyMessagesShowsFooter: Story = {
  name: 'Start a conversation',
  args: {
    messages: [],
    showFooter: true,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-room-footer')).toBeTruthy()
  },
}

export const HiddenFooter: Story = {
  name: 'Read-only chat',
  args: {
    showFooter: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-room-footer')).toBeFalsy()
  },
}

export const ScrollToTopFiresFetchMessages: Story = {
  name: 'Load earlier messages',
  args: {
    messagesLoaded: false,
    'onFetch-messages': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const scrollEl = canvasElement.querySelector('.acc-container-scroll') as HTMLElement
    expect(scrollEl).toBeTruthy()

    scrollEl.scrollTop = 0
    scrollEl.dispatchEvent(new Event('scroll', { bubbles: true }))

    await waitFor(() => {
      expect(args['onFetch-messages']).toHaveBeenCalled()
    })
  },
}

export const NoFetchWhenLoaded: Story = {
  name: 'Message history already loaded',
  args: {
    messagesLoaded: true,
    'onFetch-messages': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const scrollEl = canvasElement.querySelector('.acc-container-scroll') as HTMLElement
    scrollEl.scrollTop = 0
    scrollEl.dispatchEvent(new Event('scroll', { bubbles: true }))
    expect(args['onFetch-messages']).not.toHaveBeenCalled()
  },
}

/** Shows typing activity above the composer instead of in the chat header. */
export const TypingIndicatorAboveComposer: Story = {
  args: {
    typingIndicatorPosition: 'composer',
    chat: { ...sampleChat, typingUsers: [{ id: otherUser.id }] },
  },
  play: async ({ canvasElement }) => {
    const composer = canvasElement.querySelector('.acc-composer-typing')
    expect(composer).toBeTruthy()
    expect(composer?.textContent).toContain('is typing')
    // and the header should not show it (only the user-status line)
    const headerInfo = canvasElement.querySelector('.acc-info-wrapper .acc-room-info')
    expect(headerInfo?.textContent).not.toContain('is typing')
  },
}

/** Shows typing activity in both the chat header and above the composer. */
export const TypingIndicatorBoth: Story = {
  args: {
    typingIndicatorPosition: 'both',
    chat: { ...sampleChat, typingUsers: [{ id: otherUser.id }] },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-composer-typing')).toBeTruthy()
    const headerInfo = canvasElement.querySelector('.acc-info-wrapper .acc-room-info')
    expect(headerInfo?.textContent).toContain('is typing')
  },
}

/** Hides typing activity while users compose messages. */
export const TypingIndicatorNone: Story = {
  args: {
    typingIndicatorPosition: 'none',
    chat: { ...sampleChat, typingUsers: [{ id: otherUser.id }] },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-composer-typing')).toBeFalsy()
    const headerInfo = canvasElement.querySelector('.acc-info-wrapper .acc-room-info')
    expect(headerInfo?.textContent).not.toContain('is typing')
  },
}

/** Keeps the current message-list position when the chat first opens. */
export const AutoScrollOnMountSuppressed: Story = {
  name: 'Keep position when chat opens',
  args: {
    autoScroll: { onMount: false },
  },
  play: async ({ canvasElement }) => {
    const scrollEl = canvasElement.querySelector('.acc-container-scroll') as HTMLElement
    expect(scrollEl).toBeTruthy()
    // Wait one tick for any post-mount nextTick scrolls to settle.
    await waitFor(() => {
      expect(scrollEl.scrollTop).toBe(0)
    })
  },
}

export const NoFetchWhileLoadingMessages: Story = {
  name: 'Loading message history',
  args: {
    loadingMessages: true,
    messages: [],
    'onFetch-messages': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const scrollEl = canvasElement.querySelector('.acc-container-scroll') as HTMLElement | null
    if (scrollEl) {
      scrollEl.scrollTop = 0
      scrollEl.dispatchEvent(new Event('scroll', { bubbles: true }))
    }
    expect(args['onFetch-messages']).not.toHaveBeenCalled()
  },
}
