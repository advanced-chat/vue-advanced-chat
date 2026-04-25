import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'

import AudioPlayer from './AudioPlayer.vue'

const meta = {
  component: AudioPlayer,
  tags: ['autodocs'],
  args: {
    src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
    message: { id: 'sample-1' },
  },
} satisfies Meta<typeof AudioPlayer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-audio-player')).toBeTruthy()
    expect(canvasElement.querySelector('audio')).toBeTruthy()
  },
}

export const PlayButtonIsRendered: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('#vac-icon-audio-play')).toBeTruthy()
  },
}

export const NoSrc: Story = {
  args: {
    src: null,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('audio')).toBeFalsy()
  },
}
