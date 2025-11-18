import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Chat from '@/Chat.vue';

const meta = {
  component: Chat,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof Chat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
