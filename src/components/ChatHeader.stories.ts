import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatHeader from './ChatHeader.vue';

const meta = {
  component: ChatHeader,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
