import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import ChatHeader from './ChatHeader.vue'

import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat } from '../models/index.ts'
import { sampleUsers, storyPhotoUrl } from './stories.fixtures.ts'

const storyChat = { ...(chats[0] as Chat), avatar: storyPhotoUrl }

const meta = {
  title: 'Components/ChatHeader',
  component: ChatHeader,
  tags: ['autodocs'],
  args: {
    currentUser: sampleUsers[0]!,
    chat: storyChat,
  },
} satisfies Meta<typeof ChatHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const ToggleChatList: Story = {
  args: {
    'onToggle-chat-list': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const toggle = canvasElement.querySelector('.acc-toggle-button') as HTMLElement
    expect(toggle).toBeTruthy()
    await userEvent.click(toggle)
    await expect(args['onToggle-chat-list']).toHaveBeenCalled()
  },
}

export const Standalone: Story = {
  args: { standalone: true },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-toggle-button')).toBeFalsy()
  },
}

export const ChatInfoClickEmits: Story = {
  name: 'Open chat details',
  args: {
    chatInfoEnabled: true,
    'onShow-chat-info': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const info = canvasElement.querySelector('.acc-info-wrapper.acc-item-clickable') as HTMLElement
    expect(info).toBeTruthy()
    await userEvent.click(info)
    await expect(args['onShow-chat-info']).toHaveBeenCalled()
  },
}

export const MenuActionHandler: Story = {
  name: 'Choose a header action',
  args: {
    actions: [
      { id: 'archive', label: 'Archive' },
      { id: 'mute', label: 'Mute' },
    ],
    'onMenu-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const menuTrigger = canvasElement.querySelector('.acc-room-options') as HTMLElement
    expect(menuTrigger).toBeTruthy()
    await userEvent.click(menuTrigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const archive = within(canvasElement).getByText('Archive')
    await userEvent.click(archive)
    await expect(args['onMenu-action-handler']).toHaveBeenCalledWith(
      expect.objectContaining({
        action: { id: 'archive', label: 'Archive' },
      }),
    )
  },
}

export const SelectionToolbar: Story = {
  args: {
    selectionActions: [{ id: 'delete', label: 'Delete' }],
    selectedCount: 2,
    'onCancel-message-selection': fn(),
    'onMessage-selection-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    expect(canvasElement.querySelector('.acc-room-selection')).toBeTruthy()
    const deleteBtn = canvasElement.querySelector('.acc-selection-button') as HTMLElement
    await userEvent.click(deleteBtn)
    await expect(args['onMessage-selection-action-handler']).toHaveBeenCalledWith(
      expect.objectContaining({
        action: { id: 'delete', label: 'Delete' },
      }),
    )

    const cancel = canvasElement.querySelector('.acc-selection-cancel') as HTMLElement
    await userEvent.click(cancel)
    await expect(args['onCancel-message-selection']).toHaveBeenCalled()
  },
}

export const TypingIndicator: Story = {
  args: {
    chat: {
      id: '1',
      name: 'Group',
      users: [sampleUsers[0]! as never, sampleUsers[1]! as never, sampleUsers[2]! as never],
      typingUsers: [{ id: sampleUsers[1]!.id }],
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    const info = canvasElement.querySelector('.acc-room-info')
    expect(info?.textContent).toContain('Bob')
    expect(info?.textContent).toContain('typing')
  },
}

export const OnlineStatus: Story = {
  args: {
    chat: {
      id: '1',
      name: '1:1',
      users: [sampleUsers[0]! as never, sampleUsers[2]! as never],
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    const info = canvasElement.querySelector('.acc-room-info')
    expect(info?.textContent?.length).toBeGreaterThan(0)
  },
}
