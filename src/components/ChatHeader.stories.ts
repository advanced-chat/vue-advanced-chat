import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import ChatHeader from './ChatHeader.vue'

import users from '../../.test/users.json' with { type: 'json' }
import chats from '../../.test/chats.json' with { type: 'json' }
import type { Chat } from '../models/index.ts'

const meta = {
  component: ChatHeader,
  tags: ['autodocs'],
  args: {
    user: users[0]!,
    chat: chats[0] as Chat,
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
    const toggle = canvasElement.querySelector('.vac-toggle-button') as HTMLElement
    expect(toggle).toBeTruthy()
    await userEvent.click(toggle)
    await expect(args['onToggle-chat-list']).toHaveBeenCalled()
  },
}

export const Standalone: Story = {
  args: { standalone: true },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-toggle-button')).toBeFalsy()
  },
}

export const ChatInfoClickEmits: Story = {
  args: {
    chatInfoEnabled: true,
    'onShow-chat-info': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const info = canvasElement.querySelector('.vac-info-wrapper.vac-item-clickable') as HTMLElement
    expect(info).toBeTruthy()
    await userEvent.click(info)
    await expect(args['onShow-chat-info']).toHaveBeenCalled()
  },
}

export const MenuActionHandler: Story = {
  args: {
    actions: [
      { name: 'archive', title: 'Archive' },
      { name: 'mute', title: 'Mute' },
    ],
    'onMenu-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const menuTrigger = canvasElement.querySelector('.vac-room-options') as HTMLElement
    expect(menuTrigger).toBeTruthy()
    await userEvent.click(menuTrigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const archive = within(canvasElement).getByText('Archive')
    await userEvent.click(archive)
    await expect(args['onMenu-action-handler']).toHaveBeenCalledWith({
      name: 'archive',
      title: 'Archive',
    })
  },
}

export const SelectionToolbar: Story = {
  args: {
    messageSelection: { enabled: true, actions: [{ name: 'delete', title: 'Delete' }] },
    selectedMessagesTotal: 2,
    'onCancel-message-selection': fn(),
    'onMessage-selection-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    expect(canvasElement.querySelector('.vac-room-selection')).toBeTruthy()
    const deleteBtn = canvasElement.querySelector('.vac-selection-button') as HTMLElement
    await userEvent.click(deleteBtn)
    await expect(args['onMessage-selection-action-handler']).toHaveBeenCalledWith({
      name: 'delete',
      title: 'Delete',
    })

    const cancel = canvasElement.querySelector('.vac-selection-cancel') as HTMLElement
    await userEvent.click(cancel)
    await expect(args['onCancel-message-selection']).toHaveBeenCalled()
  },
}

export const TypingIndicator: Story = {
  args: {
    chat: {
      id: 1,
      name: 'Group',
      users: [users[0]! as never, users[1]! as never, users[2]! as never],
      typingUsers: [{ id: users[1]!.id }],
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    const info = canvasElement.querySelector('.vac-room-info')
    expect(info?.textContent).toContain('Bob')
    expect(info?.textContent).toContain('typing')
  },
}

export const OnlineStatus: Story = {
  args: {
    chat: {
      id: 1,
      name: '1:1',
      users: [users[0]! as never, users[2]! as never],
    } as Chat,
  },
  play: async ({ canvasElement }) => {
    const info = canvasElement.querySelector('.vac-room-info')
    expect(info?.textContent?.length).toBeGreaterThan(0)
  },
}
