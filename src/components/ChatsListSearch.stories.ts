import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ChatsListSearch from './ChatsListSearch.vue'

const meta = {
  component: ChatsListSearch,
  tags: ['autodocs'],
  args: {
    chats: [
      { id: 1, name: 'Alice', lastMessage: 'Hey there!' },
      { id: 2, name: 'Bob', lastMessage: "What's up?" },
      { id: 3, name: 'Charlie', lastMessage: 'See you soon.' },
    ],
  },
} satisfies Meta<typeof ChatsListSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
