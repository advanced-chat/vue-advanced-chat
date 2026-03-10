import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatFiles from './ChatFiles.vue'

const meta = {
  component: ChatFiles,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ChatFiles>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
