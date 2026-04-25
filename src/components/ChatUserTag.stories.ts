import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { h } from 'vue'

import ChatUserTag from './ChatUserTag.vue'
import { sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatUserTag,
  tags: ['autodocs'],
  args: {
    filteredUsers: sampleUsers,
  },
  decorators: [
    (story) => () =>
      h(
        'div',
        {
          style:
            'position: relative; min-height: 240px; max-width: 360px; ' +
            'margin: 220px auto 16px;',
        },
        h(story()),
      ),
  ],
} satisfies Meta<typeof ChatUserTag>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Empty: Story = {
  args: {
    filteredUsers: [],
  },
}
