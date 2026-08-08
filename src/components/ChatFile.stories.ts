import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import ChatFile from './ChatFile.vue'
import { storyDocumentUrl, storyImageUrl, storyVideoUrl } from './stories.fixtures.ts'

const meta = {
  title: 'Components/ChatFile',
  component: ChatFile,
  tags: ['autodocs'],
  args: {
    index: 0,
    file: {
      name: 'dashboard.png',
      type: 'image/png',
      extension: 'png',
      url: storyImageUrl,
    },
  },
} satisfies Meta<typeof ChatFile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Video: Story = {
  args: {
    file: {
      name: 'clip.mp4',
      type: 'video/mp4',
      extension: 'mp4',
      url: storyVideoUrl,
    },
  },
}

export const Document: Story = {
  args: {
    file: {
      name: 'notes.pdf',
      type: 'application/pdf',
      extension: 'pdf',
      url: storyDocumentUrl,
    },
  },
}

export const RemoveEmits: Story = {
  name: 'Remove attachment',
  args: {
    'onRemove-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const remove = within(canvasElement).getByRole('button', { name: 'Remove dashboard.png' })

    remove.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args['onRemove-file']).toHaveBeenCalledWith(0)
  },
}

export const LoadingShowsLoader: Story = {
  name: 'Uploading an attachment',
  args: {
    file: {
      name: 'uploading.png',
      type: 'image/png',
      extension: 'png',
      url: storyImageUrl,
      loading: true,
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-blur-loading')).toBeTruthy()
    expect(canvasElement.querySelector('.acc-loader-wrapper')).toBeTruthy()
  },
}
