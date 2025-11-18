import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Layout from './Layout.vue'

const meta = {
  component: Layout,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Layout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
