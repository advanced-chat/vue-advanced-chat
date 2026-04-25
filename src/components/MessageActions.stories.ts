import type { Meta, StoryObj } from '@storybook/vue3-vite'
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
}
