import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import ChatsSearch from './ChatsSearch.vue'
import { sampleChats } from './stories.fixtures.ts'

const meta = {
  component: ChatsSearch,
  tags: ['autodocs'],
  args: {
    chats: sampleChats,
  },
} satisfies Meta<typeof ChatsSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const TypingEmitsSearch: Story = {
  args: {
    'onSearch-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox')
    await userEvent.click(input)
    await userEvent.type(input, 'Bob')
    await expect(args['onSearch-chat']).toHaveBeenCalled()
    const calls = (args['onSearch-chat'] as ReturnType<typeof fn>).mock.calls
    expect(calls[calls.length - 1]?.[0]).toBe('Bob')
  },
}

export const AddChatEmits: Story = {
  args: {
    'onAdd-chat': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const addButton = canvasElement.querySelector('.vac-add-icon') as HTMLElement
    expect(addButton).toBeTruthy()
    await userEvent.click(addButton)
    await expect(args['onAdd-chat']).toHaveBeenCalledTimes(1)
  },
}

export const HiddenSearchInput: Story = {
  args: {
    showSearch: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('input[type="search"]')).toBeFalsy()
  },
}

export const HiddenAddButton: Story = {
  args: {
    showAddChat: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-add-icon')).toBeFalsy()
  },
}
