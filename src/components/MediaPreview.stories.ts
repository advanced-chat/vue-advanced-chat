import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import MediaPreview from './MediaPreview.vue'
import { storyImageUrl, storyVideoUrl } from './stories.fixtures.ts'

const meta = {
  title: 'Components/MediaPreview',
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
      url: storyImageUrl,
    },
  },
} satisfies Meta<typeof MediaPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-media-preview')).toBeTruthy()
    expect(canvasElement.querySelector('.acc-image-preview')).toBeTruthy()
  },
}

export const VideoPreview: Story = {
  args: {
    file: {
      name: 'clip.mp4',
      type: 'video/mp4',
      extension: 'mp4',
      url: storyVideoUrl,
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('video')).toBeTruthy()
  },
}

export const HiddenWhenNoFile: Story = {
  name: 'No media selected',
  args: {
    file: null,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-media-preview')).toBeFalsy()
  },
}

export const ClickBackdropEmitsClose: Story = {
  name: 'Close from backdrop',
  args: {
    'onClose-media-preview': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const backdrop = canvasElement.querySelector('.acc-media-preview') as HTMLElement
    await userEvent.click(backdrop)
    await expect(args['onClose-media-preview']).toHaveBeenCalled()
  },
}

export const CloseButtonEmitsClose: Story = {
  name: 'Close button',
  args: {
    'onClose-media-preview': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const closeBtn = canvasElement.querySelector('.acc-close-button') as HTMLElement
    await userEvent.click(closeBtn)
    await expect(args['onClose-media-preview']).toHaveBeenCalled()
  },
}

export const EscapeKeyEmitsClose: Story = {
  name: 'Close with Escape',
  args: {
    'onClose-media-preview': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const modal = canvasElement.querySelector('.acc-media-preview') as HTMLElement
    modal.focus()
    await userEvent.keyboard('{Escape}')
    await expect(args['onClose-media-preview']).toHaveBeenCalled()
  },
}
