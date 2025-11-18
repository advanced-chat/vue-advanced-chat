import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MessageTemplate from './MessageTemplate.vue';

const meta = {
  component: MessageTemplate,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof MessageTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
