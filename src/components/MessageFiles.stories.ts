import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import MessageFiles from './MessageFiles.vue'

const baseUser = { id: '1', name: 'Alice', status: { state: 'online' as const } }

const meta = {
  component: MessageFiles,
  tags: ['autodocs'],
  args: {
    user: { id: '1' },
    message: {
      id: '1',
      content: 'Multiple attachments',
      createdAt: '2025-12-01T10:00:00Z',
      sender: baseUser,
      files: [
        {
          name: 'photo.jpg',
          type: 'image/jpeg',
          extension: 'jpg',
          url: 'https://picsum.photos/200',
        },
        {
          name: 'notes.pdf',
          type: 'application/pdf',
          extension: 'pdf',
          url: 'https://example.com/notes.pdf',
        },
      ],
    },
    users: [baseUser],
    messageSelectionEnabled: false,
  },
} satisfies Meta<typeof MessageFiles>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-message-image-container')).toBeTruthy()
    expect(canvasElement.querySelector('.vac-file-wrapper')).toBeTruthy()
  },
}

export const ClickFileEmitsDownload: Story = {
  args: {
    'onOpen-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const fileEntry = canvasElement.querySelector('.vac-file-container') as HTMLElement
    await userEvent.click(fileEntry)
    await expect(args['onOpen-file']).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'download' }),
    )
  },
}

export const FileWithProgressShowsBar: Story = {
  args: {
    message: {
      id: '1',
      content: '',
      createdAt: '2025-12-01T10:00:00Z',
      sender: baseUser,
      files: [
        {
          name: 'uploading.pdf',
          type: 'application/pdf',
          extension: 'pdf',
          url: 'https://example.com/uploading.pdf',
          progress: 33,
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-progress-wrapper')).toBeTruthy()
  },
}
