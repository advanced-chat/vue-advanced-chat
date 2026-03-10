import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatUserTag from './ChatUserTag.vue'
import { sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatUserTag,
  tags: ['autodocs'],
  args: {
    filteredUsers: sampleUsers,
  },
} satisfies Meta<typeof ChatUserTag>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
