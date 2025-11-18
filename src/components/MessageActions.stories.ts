import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageActions from './MessageActions.vue'

const meta = {
  component: MessageActions,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof MessageActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
