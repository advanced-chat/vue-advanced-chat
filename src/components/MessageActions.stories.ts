import type { Meta, StoryObj } from '@storybook/vue3-vite'

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
} satisfies Meta<typeof MessageActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
