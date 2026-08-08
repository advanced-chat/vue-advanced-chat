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
    expect(canvasElement.querySelector('.vac-loader-wrapper')).toBeTruthy()
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
    expect(canvasElement.querySelector('.vac-message-row-selectable')).toBeTruthy()
  },
}

export const SelectionToolbarFiresAction: Story = {
  args: {
    selectionActions: [{ id: 'delete', label: 'Delete' }],
    'onMessage-selection-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const rows = canvasElement.querySelectorAll('.vac-message-row-selectable')
    await userEvent.click(rows[0] as Element)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-selection-button')).toBeTruthy()
    })
    const deleteBtn = canvasElement.querySelector('.vac-selection-button') as HTMLElement
    await userEvent.click(deleteBtn)
    await expect(args['onMessage-selection-action-handler']).toHaveBeenCalled()
  },
}

export const ReplyActionPrefillsFooter: Story = {
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement }) => {
    const dropdown = canvasElement.querySelector(
      '.vac-dropdown-picker .vac-message-options',
    ) as HTMLElement
    await userEvent.click(dropdown)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const reply = within(canvasElement).getByText('Reply')
    await userEvent.click(reply)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-footer-reply-wrapper')).toBeTruthy()
    })
  },
}

export const EditActionPrefillsFooter: Story = {
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement }) => {
    // find the own-message dropdown (the second message in fixtures is from currentUser)
    const dropdowns = canvasElement.querySelectorAll('.vac-dropdown-picker .vac-message-options')
    const ownDropdown = Array.from(dropdowns).find((el) => {
      const card = el.closest('.vac-message-current')
      return card !== null
    }) as HTMLElement | undefined
    if (!ownDropdown) throw new Error('no own-message dropdown found')
    await userEvent.click(ownDropdown)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const edit = within(canvasElement).getByText('Edit')
    await userEvent.click(edit)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-textarea-outline')).toBeTruthy()
    })
  },
}

export const MediaPreviewOpensOnImageClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const image = canvas.getByRole('button', { name: /^Preview / })
    await userEvent.click(image)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-media-preview')).toBeTruthy()
    })
  },
}

export const EmptyMessagesShowsFooter: Story = {
  args: {
    messages: [],
    showFooter: true,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-room-footer')).toBeTruthy()
  },
}

export const HiddenFooter: Story = {
  args: {
    showFooter: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-room-footer')).toBeFalsy()
  },
}

export const ScrollToTopFiresFetchMessages: Story = {
  args: {
    messagesLoaded: false,
    'onFetch-messages': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const scrollEl = canvasElement.querySelector('.vac-container-scroll') as HTMLElement
    expect(scrollEl).toBeTruthy()

    scrollEl.scrollTop = 0
    scrollEl.dispatchEvent(new Event('scroll', { bubbles: true }))

    await waitFor(() => {
      expect(args['onFetch-messages']).toHaveBeenCalled()
    })
  },
}

export const NoFetchWhenLoaded: Story = {
  args: {
    messagesLoaded: true,
    'onFetch-messages': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const scrollEl = canvasElement.querySelector('.vac-container-scroll') as HTMLElement
    scrollEl.scrollTop = 0
    scrollEl.dispatchEvent(new Event('scroll', { bubbles: true }))
    expect(args['onFetch-messages']).not.toHaveBeenCalled()
  },
}

/**
 * Regression for [#513](https://github.com/advanced-chat/vue-advanced-chat/issues/513):
 * setting `typingIndicatorPosition: 'composer'` moves the typing line
 * from the header (default) to a band above the textarea.
 */
export const TypingIndicatorAboveComposer: Story = {
  args: {
    typingIndicatorPosition: 'composer',
    chat: { ...sampleChat, typingUsers: [{ id: otherUser.id }] },
  },
  play: async ({ canvasElement }) => {
    const composer = canvasElement.querySelector('.vac-composer-typing')
    expect(composer).toBeTruthy()
    expect(composer?.textContent).toContain('is typing')
    // and the header should not show it (only the user-status line)
    const headerInfo = canvasElement.querySelector('.vac-info-wrapper .vac-room-info')
    expect(headerInfo?.textContent).not.toContain('is typing')
  },
}

/**
 * Regression for [#513](https://github.com/advanced-chat/vue-advanced-chat/issues/513):
 * `typingIndicatorPosition: 'both'` shows the indicator in the header
 * AND above the composer at once.
 */
export const TypingIndicatorBoth: Story = {
  args: {
    typingIndicatorPosition: 'both',
    chat: { ...sampleChat, typingUsers: [{ id: otherUser.id }] },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-composer-typing')).toBeTruthy()
    const headerInfo = canvasElement.querySelector('.vac-info-wrapper .vac-room-info')
    expect(headerInfo?.textContent).toContain('is typing')
  },
}

/**
 * Regression for [#513](https://github.com/advanced-chat/vue-advanced-chat/issues/513):
 * `typingIndicatorPosition: 'none'` suppresses the indicator entirely.
 */
export const TypingIndicatorNone: Story = {
  args: {
    typingIndicatorPosition: 'none',
    chat: { ...sampleChat, typingUsers: [{ id: otherUser.id }] },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-composer-typing')).toBeFalsy()
    const headerInfo = canvasElement.querySelector('.vac-info-wrapper .vac-room-info')
    expect(headerInfo?.textContent).not.toContain('is typing')
  },
}

/**
 * Regression for the GA `autoScroll` policy: setting `onMount: false`
 * prevents the post-mount auto-scroll, so the message list stays at
 * the top of the scroll container instead of jumping to the latest
 * message.
 */
export const AutoScrollOnMountSuppressed: Story = {
  args: {
    autoScroll: { onMount: false },
  },
  play: async ({ canvasElement }) => {
    const scrollEl = canvasElement.querySelector('.vac-container-scroll') as HTMLElement
    expect(scrollEl).toBeTruthy()
    // Wait one tick for any post-mount nextTick scrolls to settle.
    await waitFor(() => {
      expect(scrollEl.scrollTop).toBe(0)
    })
  },
}

export const NoFetchWhileLoadingMessages: Story = {
  args: {
    loadingMessages: true,
    messages: [],
    'onFetch-messages': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const scrollEl = canvasElement.querySelector('.vac-container-scroll') as HTMLElement | null
    if (scrollEl) {
      scrollEl.scrollTop = 0
      scrollEl.dispatchEvent(new Event('scroll', { bubbles: true }))
    }
    expect(args['onFetch-messages']).not.toHaveBeenCalled()
  },
}
