import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import MediaPreview from './MediaPreview.vue'

const meta = {
  component: MediaPreview,
  tags: ['autodocs'],
  parameters: {
    skipLayout: true,
  },
  args: {
    file: {
      name: 'preview.png',
      type: 'image/png',
      extension: 'png',
      url: 'https://picsum.photos/900/600',
    },
  },
} satisfies Meta<typeof MediaPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-media-preview')).toBeTruthy()
    expect(canvasElement.querySelector('.vac-image-preview')).toBeTruthy()
  },
}

export const VideoPreview: Story = {
  args: {
    file: {
      name: 'clip.mp4',
      type: 'video/mp4',
      extension: 'mp4',
      url: 'https://example.com/clip.mp4',
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('video')).toBeTruthy()
  },
}

export const HiddenWhenNoFile: Story = {
  args: {
    file: null,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-media-preview')).toBeFalsy()
  },
}

export const ClickBackdropEmitsClose: Story = {
  args: {
    'onClose-media-preview': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const backdrop = canvasElement.querySelector('.vac-media-preview') as HTMLElement
    await userEvent.click(backdrop)
    await expect(args['onClose-media-preview']).toHaveBeenCalled()
  },
}

export const CloseButtonEmitsClose: Story = {
  args: {
    'onClose-media-preview': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const closeBtn = canvasElement.querySelector('.vac-close-button') as HTMLElement
    await userEvent.click(closeBtn)
    await expect(args['onClose-media-preview']).toHaveBeenCalled()
  },
}

export const EscapeKeyEmitsClose: Story = {
  args: {
    'onClose-media-preview': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const modal = canvasElement.querySelector('.vac-media-preview') as HTMLElement
    modal.focus()
    await userEvent.keyboard('{Escape}')
    await expect(args['onClose-media-preview']).toHaveBeenCalled()
  },
}
