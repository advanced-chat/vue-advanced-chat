import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import ChatFile from './ChatFile.vue'

const meta = {
  component: ChatFile,
  tags: ['autodocs'],
  args: {
    index: 0,
    file: {
      name: 'dashboard.png',
      type: 'image/png',
      extension: 'png',
      url: 'https://picsum.photos/200/200',
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
      url: 'https://example.com/clip.mp4',
    },
  },
}

export const Document: Story = {
  args: {
    file: {
      name: 'notes.pdf',
      type: 'application/pdf',
      extension: 'pdf',
      url: 'https://example.com/notes.pdf',
    },
  },
}

export const RemoveEmits: Story = {
  args: {
    'onRemove-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const remove = canvasElement.querySelector('.vac-icon-remove') as HTMLElement
    expect(remove).toBeTruthy()
    await userEvent.click(remove)
    await expect(args['onRemove-file']).toHaveBeenCalledWith(0)
  },
}

export const LoadingShowsLoader: Story = {
  args: {
    file: {
      name: 'uploading.png',
      type: 'image/png',
      extension: 'png',
      url: 'https://picsum.photos/200/200',
      loading: true,
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-blur-loading')).toBeTruthy()
    expect(canvasElement.querySelector('.vac-loader-wrapper')).toBeTruthy()
  },
}
