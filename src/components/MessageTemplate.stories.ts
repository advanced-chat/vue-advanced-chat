import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageTemplate from './MessageTemplate.vue'

const meta = {
  component: MessageTemplate,
  tags: ['autodocs'],
  args: {},
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
