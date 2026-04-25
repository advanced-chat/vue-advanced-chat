import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { h } from 'vue'

import ChatEmojis from './ChatEmojis.vue'

const meta = {
  component: ChatEmojis,
  tags: ['autodocs'],
  args: {
    filteredEmojis: ['😀', '😂', '🔥', '🎉'],
  },
  decorators: [
    (story) => () =>
      h(
        'div',
        {
          style:
            'position: relative; min-height: 160px; max-width: 360px; ' +
            'margin: 110px auto 16px;',
        },
        h(story()),
      ),
  ],
} satisfies Meta<typeof ChatEmojis>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const ManyResults: Story = {
  args: {
    filteredEmojis: ['😀', '😅', '😆', '😂', '🔥', '🎉'],
  },
}

export const Empty: Story = {
  args: {
    filteredEmojis: [],
  },
}
