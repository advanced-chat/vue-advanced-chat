import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatsListSearch from './ChatsListSearch.vue';

const meta = {
  component: ChatsListSearch,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatsListSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
