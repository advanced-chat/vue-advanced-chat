import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Message from './Message.vue'
import { currentUser, messageActions, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: Message,
  tags: ['autodocs'],
  args: {
    user: currentUser,
    message: sampleMessages[2],
    users: sampleUsers,
    actions: messageActions,
  },
} satisfies Meta<typeof Message>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const OwnEdited: Story = {
  args: {
    message: sampleMessages[1],
  },
}

export const Reply: Story = {
  args: {
    message: sampleMessages[2],
  },
}

export const AudioOnly: Story = {
  args: {
    message: sampleMessages[3],
  },
}

export const Deleted: Story = {
  args: {
    message: sampleMessages[4],
  },
}

export const System: Story = {
  args: {
    message: sampleMessages[5],
  },
}

export const Failure: Story = {
  args: {
    message: sampleMessages[6],
  },
}
