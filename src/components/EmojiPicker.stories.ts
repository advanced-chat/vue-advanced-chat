import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'

import EmojiPicker from './EmojiPicker.vue'

const meta = {
  component: EmojiPicker,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof EmojiPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    opened: true,
  },
  play: async ({ canvasElement }) => {
    // emoji-picker-element appends <emoji-picker> via setTimeout(0)
    await waitFor(() => {
      expect(canvasElement.querySelector('emoji-picker')).toBeTruthy()
    })
  },
}

export const Closed: Story = {
  args: {
    opened: false,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('emoji-picker')).toBeFalsy()
    })
  },
}
