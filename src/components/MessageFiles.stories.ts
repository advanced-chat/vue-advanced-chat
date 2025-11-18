import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageFiles from './MessageFiles.vue'

const meta = {
  component: MessageFiles,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof MessageFiles>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
