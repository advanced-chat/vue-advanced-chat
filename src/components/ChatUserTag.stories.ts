import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatUserTag from './ChatUserTag.vue';

const meta = {
  component: ChatUserTag,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatUserTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
