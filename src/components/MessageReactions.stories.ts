import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import MessageReactions from './MessageReactions.vue'
import { currentUser, sampleMessages } from './stories.fixtures.ts'

const meta = {
  component: MessageReactions,
  tags: ['autodocs'],
  args: {
    currentUser: currentUser,
    message: sampleMessages[2],
  },
} satisfies Meta<typeof MessageReactions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const pills = canvasElement.querySelectorAll('.vac-button-reaction')
    expect(pills.length).toBe(2)
  },
}

export const ClickEmits: Story = {
  args: {
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const pill = canvasElement.querySelector('.vac-button-reaction') as HTMLElement
    await userEvent.click(pill)
    await expect(args['onSend-message-reaction']).toHaveBeenCalled()
  },
}

export const SelectionModeBubblesWithoutReacting: Story = {
  args: {
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const selectMessage = fn()
    canvasElement.classList.add('vac-message-row-selectable')
    canvasElement.addEventListener('click', selectMessage)

    const pill = canvasElement.querySelector('.vac-button-reaction') as HTMLElement
    await userEvent.click(pill)

    await expect(args['onSend-message-reaction']).not.toHaveBeenCalled()
    await expect(selectMessage).toHaveBeenCalledTimes(1)
  },
}

export const HighlightsCurrentUserReactions: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const pills = canvasElement.querySelectorAll('.vac-reaction-me')
    expect(pills.length).toBeGreaterThan(0)
  },
}

export const HiddenWhenDeleted: Story = {
  args: {
    message: { ...sampleMessages[2]!, deleted: true },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-button-reaction')).toBeFalsy()
  },
}
