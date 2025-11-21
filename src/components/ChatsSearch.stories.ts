import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatsSearch from './ChatsSearch.vue'

const meta = {
  component: ChatsSearch,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ChatsSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
