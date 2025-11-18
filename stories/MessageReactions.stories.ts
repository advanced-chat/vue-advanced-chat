import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MessageReactions from '@/MessageReactions.vue';

const meta = {
  component: MessageReactions,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof MessageReactions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
