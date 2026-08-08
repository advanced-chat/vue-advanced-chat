import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'

import ChatMessage from './ChatMessage.vue'
import { currentUser, messageActions, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatMessage,
  tags: ['autodocs'],
  args: {
    currentUser: currentUser,
    message: sampleMessages[2],
    messages: sampleMessages,
    index: 2,
    users: sampleUsers,
    actions: messageActions,
  },
} satisfies Meta<typeof ChatMessage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const NewMessageDivider: Story = {
  args: {
    message: { ...sampleMessages[2]!, unread: true },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-line-new')).toBeTruthy()
  },
}

export const NewMessageDividerHidden: Story = {
  args: {
    message: { ...sampleMessages[2]!, unread: true },
    showNewMessagesDivider: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-line-new')).toBeFalsy()
  },
}

export const DateDividerWhenDayChanges: Story = {
  args: {
    message: { ...sampleMessages[2]!, createdAt: '2025-12-02T10:00:00Z' },
    messages: [
      { ...sampleMessages[1]!, createdAt: '2025-12-01T10:00:00Z' },
      { ...sampleMessages[2]!, createdAt: '2025-12-02T10:00:00Z' },
    ],
    index: 1,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-card-date')).toBeTruthy()
  },
}

export const FirstMessageDateDivider: Story = {
  args: {
    message: sampleMessages[0],
    messages: sampleMessages,
    index: 0,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-card-date')).toBeTruthy()
  },
}
