import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageTemplate from './MessageTemplate.vue'
import { fn } from 'storybook/test'

const meta = {
  component: MessageTemplate,
  tags: ['autodocs'],
  args: {
    'onClicked:user-tag': fn(),
  },
} satisfies Meta<typeof MessageTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: {
      id: '1',
      content: 'This is a sample message content.',
      nestedLevel: 0,
      deleted: false,
    },
  },
}

export const UnderlinedMessage: Story = {
  args: {
    message: {
      id: '1',
      content: '°This text is underlined°.',
      nestedLevel: 0,
      deleted: false,
    },
  },
}

export const UserTaggedMessage: Story = {
  args: {
    message: {
      id: '1',
      content: 'Hello <@1>, how are you?',
      nestedLevel: 0,
      deleted: false,
    },
  },
}
