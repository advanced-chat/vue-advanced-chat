import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatsList from './ChatsList.vue';

const meta = {
  component: ChatsList,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
