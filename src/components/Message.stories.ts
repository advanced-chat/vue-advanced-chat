import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Message from './Message.vue';

const meta = {
  component: Message,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
