import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MediaPreview from './MediaPreview.vue'

const meta = {
  component: MediaPreview,
  tags: ['autodocs'],
  parameters: {
    skipLayout: true,
  },
  args: {
    file: {
      name: 'preview.png',
      type: 'image/png',
      extension: 'png',
      url: 'https://picsum.photos/900/600',
    },
  },
} satisfies Meta<typeof MediaPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
