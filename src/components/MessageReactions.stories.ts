import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageReactions from './MessageReactions.vue'
import { currentUser, sampleMessages } from './stories.fixtures.ts'

const meta = {
  component: MessageReactions,
  tags: ['autodocs'],
  args: {
    user: currentUser,
    message: sampleMessages[2],
  },
} satisfies Meta<typeof MessageReactions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
