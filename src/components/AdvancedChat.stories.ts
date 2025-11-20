import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AdvancedChat from '@/components/AdvancedChat.vue'

const meta = {
  component: AdvancedChat,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof AdvancedChat>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
