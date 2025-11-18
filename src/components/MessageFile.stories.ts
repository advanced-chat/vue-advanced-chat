import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageFile from './MessageFile.vue'

const meta = {
  component: MessageFile,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof MessageFile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
