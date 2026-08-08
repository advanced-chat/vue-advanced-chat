import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import MessageFile from './MessageFile.vue'
import { storyImageUrl, storyPhotoUrl, storyVideoUrl } from './stories.fixtures.ts'

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
      url: storyPhotoUrl,
    },
  ],
}

const meta = {
  title: 'Components/MessageFile',
  component: MessageFile,
  tags: ['autodocs'],
  args: {
    currentUser: { id: '1' },
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
    expect(canvasElement.querySelector('.acc-message-image-container')).toBeTruthy()
  },
}

export const VideoFile: Story = {
  args: {
    file: {
      name: 'clip.mp4',
      type: 'video/mp4',
      extension: 'mp4',
      url: storyVideoUrl,
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-video-container')).toBeTruthy()
  },
}

export const ClickImageEmitsPreview: Story = {
  name: 'Open image preview',
  args: {
    'onOpen-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const preview = within(canvasElement).getByRole('button', { name: 'Preview example.jpg' })

    preview.focus()
    await userEvent.keyboard('{Enter}')
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
      url: storyImageUrl,
      progress: 0,
    },
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  },
}

export const SelectionModeBubblesWithoutOpening: Story = {
  name: 'Select a message with an attachment',
  args: {
    messageSelectionEnabled: true,
    'onOpen-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const selectMessage = fn()
    canvasElement.addEventListener('click', selectMessage)

    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Select message containing example.jpg',
      }),
    )

    await expect(args['onOpen-file']).not.toHaveBeenCalled()
    await expect(selectMessage).toHaveBeenCalledTimes(1)
  },
}
