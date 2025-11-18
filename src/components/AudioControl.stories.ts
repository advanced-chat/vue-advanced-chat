import type { Meta, StoryObj } from '@storybook/vue3-vite';

import AudioControl from './AudioControl.vue';

const meta = {
  component: AudioControl,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof AudioControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
