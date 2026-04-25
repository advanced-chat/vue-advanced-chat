import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { h } from 'vue'

import MessageActions from './MessageActions.vue'
import { currentUser, messageActions, sampleMessages } from './stories.fixtures.ts'

const meta = {
  component: MessageActions,
  tags: ['autodocs'],
  args: {
    user: currentUser,
    message: sampleMessages[2],
    actions: messageActions,
  },
  decorators: [
    (story) => () =>
      h(
        'div',
        {
          style:
            'position: relative; max-width: 360px; margin: 32px auto; padding: 24px 16px 12px; ' +
            'border-radius: 18px; background: var(--chat-message-bg-color); color: var(--chat-message-color); ' +
            'border: var(--chat-border-style);',
        },
        [
          h('div', { style: 'font-size: 13px; opacity: 0.7;' }, 'Hover the bubble or open a menu.'),
          h(story()),
        ],
      ),
  ],
} satisfies Meta<typeof MessageActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const ReactionsOnly: Story = {
  args: {
    actions: [],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-dropdown-picker')).toBeFalsy()
    expect(canvasElement.querySelector('.vac-reaction-picker')).toBeTruthy()
  },
}

export const ActionsOnly: Story = {
  args: {
    showReactionEmojis: false,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-reaction-picker')).toBeFalsy()
    expect(canvasElement.querySelector('.vac-dropdown-picker')).toBeTruthy()
  },
}

export const ReactionMenuOpen: Story = {
  args: {
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const trigger = canvasElement.querySelector(
      '.vac-reaction-picker .vac-message-options',
    ) as HTMLElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-reactions-menu')).toBeTruthy()
    })
    const reactions = canvasElement.querySelectorAll('.vac-reaction-option')
    expect(reactions.length).toBe(5)
    await userEvent.click(reactions[2] as Element)
    await expect(args['onSend-message-reaction']).toHaveBeenCalled()
  },
}

export const DropdownMenuOpen: Story = {
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const trigger = canvasElement.querySelector(
      '.vac-dropdown-picker .vac-message-options',
    ) as HTMLElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const items = canvasElement.querySelectorAll('.vac-menu-item')
    expect(items.length).toBeGreaterThan(0)
    await userEvent.click(items[0] as Element)
    await expect(args['onMessage-action-handler']).toHaveBeenCalled()
  },
}

export const FilterOnlyMeWhenOtherUser: Story = {
  args: {
    user: { id: '99' }, // not the sender
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector(
      '.vac-dropdown-picker .vac-message-options',
    ) as HTMLElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    // messageActions has 3 items: reply, edit (onlyMe), delete (onlyMe)
    const items = canvasElement.querySelectorAll('.vac-menu-item')
    expect(items.length).toBe(1)
  },
}

export const HiddenForDeletedMessage: Story = {
  args: {
    message: { ...sampleMessages[2]!, deleted: true },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-message-actions-wrapper')).toBeFalsy()
  },
}
