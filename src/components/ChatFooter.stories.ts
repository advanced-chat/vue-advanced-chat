import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatFooter from './ChatFooter.vue';

const meta = {
  component: ChatFooter,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
