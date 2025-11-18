import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ChatFile from '@/ChatFile.vue';

const meta = {
  component: ChatFile,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof ChatFile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
