import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MessageReply from './MessageReply.vue';

const meta = {
  component: MessageReply,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof MessageReply>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
