import type { Meta, StoryObj } from '@storybook/vue3-vite';

import AudioPlayer from '@/AudioPlayer.vue';

const meta = {
  component: AudioPlayer,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof AudioPlayer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
