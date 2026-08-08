import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

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
    expect(canvasElement.querySelector('.acc-room-files-container')).toBeFalsy()
  },
}

export const RemoveFile: Story = {
  args: {
    'onRemove-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const remove = canvasElement.querySelector('.acc-icon-remove') as HTMLElement
    await userEvent.click(remove)
    await expect(args['onRemove-file']).toHaveBeenCalledWith(0)
  },
}

export const ResetEmits: Story = {
  args: {
    'onReset-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const close = within(canvasElement).getByRole('button', { name: 'Remove all attachments' })

    close.focus()
    await userEvent.keyboard(' ')
    await expect(args['onReset-message']).toHaveBeenCalled()
  },
}
