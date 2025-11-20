import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AdvancedChat from '@/components/AdvancedChat.vue'

const meta = {
  component: AdvancedChat,
  tags: ['autodocs'],
  parameters: {
    skipLayout: true,
  },
  args: {
    height: '600px',
  },
} satisfies Meta<typeof AdvancedChat>

export default meta

type Story = StoryObj<typeof meta>

export const LightMode: Story = {
  args: {
    theme: 'light',
  },
}

export const DarkMode: Story = {
  args: {
    theme: 'dark',
  },
}
