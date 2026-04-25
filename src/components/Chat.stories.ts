import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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
    messagesLoaded: true,
    headerActions: chatActions,
    messageActions,
    standalone: true,
    messageSelection: {
      enabled: false,
      actions: [{ id: 'delete', label: 'Delete' }],
    },
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
    messageSelection: {
      enabled: true,
      actions: [{ id: 'delete', label: 'Delete' }],
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-message-row-selectable')).toBeTruthy()
  },
}

export const SelectionToolbarFiresAction: Story = {
  args: {
    messageSelection: {
      enabled: true,
      actions: [{ id: 'delete', label: 'Delete' }],
    },
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
    const image = canvasElement.querySelector('.vac-message-image-container') as HTMLElement
    expect(image).toBeTruthy()
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
