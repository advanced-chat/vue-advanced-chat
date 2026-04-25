import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import ChatFiles from './ChatFiles.vue'

const meta = {
  component: ChatFiles,
  tags: ['autodocs'],
  args: {
    files: [
      {
        name: 'dashboard.png',
        type: 'image/png',
        extension: 'png',
        url: 'https://picsum.photos/200/200',
      },
      {
        name: 'notes.pdf',
        type: 'application/pdf',
        extension: 'pdf',
        url: 'https://example.com/notes.pdf',
      },
    ],
  },
} satisfies Meta<typeof ChatFiles>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Empty: Story = {
  args: {
    files: [],
  },
  play: async ({ canvasElement }) => {
    // empty list is hidden behind v-if
    expect(canvasElement.querySelector('.vac-room-files-container')).toBeFalsy()
  },
}

export const RemoveFile: Story = {
  args: {
    'onRemove-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const remove = canvasElement.querySelector('.vac-icon-remove') as HTMLElement
    await userEvent.click(remove)
    await expect(args['onRemove-file']).toHaveBeenCalledWith(0)
  },
}

export const ResetEmits: Story = {
  args: {
    'onReset-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const close = canvasElement.querySelector('.vac-icon-close .vac-svg-button') as HTMLElement
    await userEvent.click(close)
    await expect(args['onReset-message']).toHaveBeenCalled()
  },
}
