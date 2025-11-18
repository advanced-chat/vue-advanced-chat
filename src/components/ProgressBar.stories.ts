import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ProgressBar from './ProgressBar.vue'

const meta = {
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    progress: 50,
  },
  argTypes: {
    progress: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)',
    },
  },
} satisfies Meta<typeof ProgressBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
