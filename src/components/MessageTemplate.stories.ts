import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'

import MessageTemplate from './MessageTemplate.vue'

import users from '../../.test/users.json' with { type: 'json' }
import type { User } from '../models/index.ts'

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
      id: 1,
      sender: users[0] as User,
      content: 'This is a sample message content.',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('This is a sample message content.')
  },
}

export const UnderlinedMessage: Story = {
  args: {
    message: {
      id: 1,
      sender: users[0] as User,
      content: '°This text is underlined°.',
      createdAt: '2025-12-01T10:00:00Z',
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('u')).toBeTruthy()
  },
}

export const UserTaggedMessage: Story = {
  args: {
    message: {
      id: 1,
      sender: users[0] as User,
      content: 'Hello <@1>, how are you?',
      createdAt: '2025-12-01T10:00:00Z',
    },
    users: users as User[],
  },
  play: async ({ canvasElement, args }) => {
    const tag = canvasElement.querySelector('[data-user-id="1"]') as HTMLElement
    expect(tag).toBeTruthy()
    await userEvent.click(tag)
    await expect(args['onClicked:user-tag']).toHaveBeenCalled()
  },
}

export const MarkdownMessage: Story = {
  args: {
    message: {
      id: 1,
      sender: users[0] as User,
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
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('h1')).toBeTruthy()
    expect(canvasElement.querySelector('table')).toBeTruthy()
    expect(canvasElement.querySelector('del')).toBeTruthy()
    expect(canvasElement.querySelector('input[type="checkbox"]')).toBeTruthy()
  },
}

export const SingleLineCollapses: Story = {
  args: {
    message: {
      id: 1,
      sender: users[0] as User,
      content: '**bold** preview text',
      createdAt: '2025-12-01T10:00:00Z',
    },
    formattingOptions: { singleLine: true, markdown: true },
  },
  play: async ({ canvasElement }) => {
    // singleLine collapses to plain text and uses ellipsis class
    expect(canvasElement.querySelector('.vac-text-ellipsis')).toBeTruthy()
  },
}

export const MarkdownDisabled: Story = {
  args: {
    message: {
      id: 1,
      sender: users[0] as User,
      content: '**not bold**',
      createdAt: '2025-12-01T10:00:00Z',
    },
    formattingOptions: { markdown: false },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('**not bold**')
    expect(canvasElement.querySelector('strong')).toBeFalsy()
  },
}
