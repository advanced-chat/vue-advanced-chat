import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatMessage from '@/ChatMessage.vue';

const meta = {
  component: ChatMessage,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
