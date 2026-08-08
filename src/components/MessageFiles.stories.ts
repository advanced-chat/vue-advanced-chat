import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import MessageFiles from './MessageFiles.vue'

const baseUser = { id: '1', name: 'Alice', status: { state: 'online' as const } }

const meta = {
  component: MessageFiles,
  tags: ['autodocs'],
  args: {
    currentUser: { id: '1' },
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
    const fileEntry = within(canvasElement).getByRole('button', { name: 'Download notes.pdf' })

    fileEntry.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args['onOpen-file']).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'download' }),
    )
  },
}

export const AuthenticatedMediaEmitsDownload: Story = {
  args: {
    message: {
      id: '1',
      content: '',
      createdAt: '2025-12-01T10:00:00Z',
      sender: baseUser,
      files: [
        {
          name: 'protected.jpg',
          type: 'image/jpeg',
          extension: 'jpg',
          url: 'https://example.com/protected.jpg',
          previewable: false,
        },
      ],
    },
    'onOpen-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    expect(canvasElement.querySelector('.vac-message-image-container')).toBeFalsy()

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
          progress: 125,
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  },
}

export const SelectionModeBubblesWithoutDownloading: Story = {
  args: {
    message: {
      id: '1',
      content: 'Selection mode attachment',
      createdAt: '2025-12-01T10:00:00Z',
      sender: baseUser,
      files: [
        {
          name: 'notes.pdf',
          type: 'application/pdf',
          extension: 'pdf',
          url: 'https://example.com/notes.pdf',
        },
      ],
    },
    messageSelectionEnabled: true,
    'onOpen-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const selectMessage = fn()
    canvasElement.addEventListener('click', selectMessage)

    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Select message containing notes.pdf',
      }),
    )

    await expect(args['onOpen-file']).not.toHaveBeenCalled()
    await expect(selectMessage).toHaveBeenCalledTimes(1)
  },
}
