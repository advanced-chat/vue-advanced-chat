import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'

import MessageReply from './MessageReply.vue'
import { sampleUsers } from './stories.fixtures.ts'
import type { Message } from '../models/index.ts'

const baseReply = {
  id: '1',
  content: 'Hey there!',
  createdAt: '2025-12-01T10:00:00Z',
  sender: sampleUsers[0]!,
  reply: {
    id: '2',
    content: "What's up?",
    createdAt: '2025-12-01T10:05:00Z',
    sender: sampleUsers[1]!,
  },
} satisfies Message

const meta = {
  component: MessageReply,
  tags: ['autodocs'],
  args: {
    message: baseReply,
    users: sampleUsers,
  },
} satisfies Meta<typeof MessageReply>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-reply-username')?.textContent).toContain('Bob')
    expect(canvasElement.querySelector('.vac-reply-message')).toBeTruthy()
  },
}

export const ImageReply: Story = {
  args: {
    message: {
      ...baseReply,
      reply: {
        ...baseReply.reply!,
        content: '',
        files: [
          {
            name: 'photo.png',
            type: 'image/png',
            extension: 'png',
            url: 'https://picsum.photos/200/200',
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-image-reply-container')).toBeTruthy()
  },
}

export const VideoReply: Story = {
  args: {
    message: {
      ...baseReply,
      reply: {
        ...baseReply.reply!,
        content: '',
        files: [
          {
            name: 'clip.mp4',
            type: 'video/mp4',
            extension: 'mp4',
            url: 'https://example.com/clip.mp4',
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-video-reply-container')).toBeTruthy()
  },
}

export const AudioReply: Story = {
  args: {
    message: {
      ...baseReply,
      reply: {
        ...baseReply.reply!,
        content: '',
        files: [
          {
            name: 'voice.mp3',
            type: 'audio/mpeg',
            extension: 'mp3',
            url: 'https://example.com/voice.mp3',
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-audio-player')).toBeTruthy()
  },
}

export const FileReply: Story = {
  args: {
    message: {
      ...baseReply,
      reply: {
        ...baseReply.reply!,
        content: '',
        files: [
          {
            name: 'notes.pdf',
            type: 'application/pdf',
            extension: 'pdf',
            url: 'https://example.com/notes.pdf',
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-file-container')).toBeTruthy()
  },
}
