import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Loader from '@/Loader.vue';

const meta = {
  component: Loader,
  tags: ['autodocs'],
  args: {
    show: true
  },
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {

    infinite: false,
  },
};

export const Infinite: Story = {
  args: {
    infinite: true,
  },
};

