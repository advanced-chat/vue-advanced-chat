import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MediaPreview from './MediaPreview.vue'

const meta = {
  component: MediaPreview,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof MediaPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
