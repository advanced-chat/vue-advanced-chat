import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MessageTemplate from './MessageTemplate.vue'
import { fn } from 'storybook/test'

const meta = {
  component: MessageTemplate,
  tags: ['autodocs'],
  args: {
    'onClicked:user-tag': fn(),
  },
} satisfies Meta<typeof MessageTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: {
      id: '1',
      content: 'This is a sample message content.',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
}

export const UnderlinedMessage: Story = {
  args: {
    message: {
      id: '1',
      content: '°This text is underlined°.',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
}

export const UserTaggedMessage: Story = {
  args: {
    message: {
      id: '1',
      content: 'Hello <@1>, how are you?',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
}

export const MarkdownMessage: Story = {
  args: {
    message: {
      id: '1',
      content: `
# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |

## Tag filter

<plaintext>

## Tasklist

* [ ] to do
* [x] done
      `,
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
}
