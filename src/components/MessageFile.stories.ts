import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import MessageFile from './MessageFile.vue'

const sampleMessage = {
  id: '1',
  content: 'Hey there!',
  createdAt: '2025-12-01T10:00:00Z',
  sender: { id: '1', name: 'Alice', status: { state: 'online' as const } },
  files: [
    {
      name: 'example.jpg',
      type: 'image/jpeg',
      extension: 'jpg',
      url: 'https://picsum.photos/200',
    },
  ],
}

const meta = {
  component: MessageFile,
  tags: ['autodocs'],
  args: {
    user: { id: '1' },
    message: sampleMessage,
    file: sampleMessage.files[0]!,
    index: 0,
    messageSelectionEnabled: false,
  },
} satisfies Meta<typeof MessageFile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-message-image-container')).toBeTruthy()
  },
}

export const VideoFile: Story = {
  args: {
    file: {
      name: 'clip.mp4',
      type: 'video/mp4',
      extension: 'mp4',
      url: 'https://example.com/clip.mp4',
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-video-container')).toBeTruthy()
  },
}

export const ClickImageEmitsPreview: Story = {
  args: {
    'onOpen-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const container = canvasElement.querySelector('.vac-message-image-container') as HTMLElement
    await userEvent.click(container)
    await expect(args['onOpen-file']).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'preview' }),
    )
  },
}

export const UploadProgress: Story = {
  args: {
    file: {
      name: 'uploading.png',
      type: 'image/png',
      extension: 'png',
      url: 'https://picsum.photos/200',
      progress: 42,
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-progress-wrapper')).toBeTruthy()
  },
}
