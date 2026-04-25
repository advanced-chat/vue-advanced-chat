import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import ChatFooter from './ChatFooter.vue'
import { sampleChat, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatFooter,
  tags: ['autodocs'],
  args: {
    chat: sampleChat,
    users: sampleUsers,
  },
} satisfies Meta<typeof ChatFooter>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Replying: Story = {
  args: {
    initReplyMessage: sampleMessages[0],
  },
}

export const TypingEmitsTypingMessage: Story = {
  args: {
    'onTyping-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await userEvent.type(textarea, 'hi')
    await expect(args['onTyping-message']).toHaveBeenCalled()
    const calls = (args['onTyping-message'] as ReturnType<typeof fn>).mock.calls
    expect(calls[calls.length - 1]?.[0]).toBe('hi')
  },
}

export const EnterSendsMessage: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await userEvent.type(textarea, 'hello world{Enter}')
    await expect(args['onSend-message']).toHaveBeenCalledTimes(1)
    const payload = (args['onSend-message'] as ReturnType<typeof fn>).mock.calls[0]?.[0] as {
      content: string
      files: unknown[]
    }
    expect(payload.content).toBe('hello world')
    expect(payload.files).toEqual([])
    // textarea is reset after send
    expect((textarea as HTMLTextAreaElement).value).toBe('')
  },
}

export const ShiftEnterDoesNotSend: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await userEvent.type(textarea, 'line one{Shift>}{Enter}{/Shift}line two')
    expect(args['onSend-message']).not.toHaveBeenCalled()
    expect((textarea as HTMLTextAreaElement).value).toBe('line one\nline two')
  },
}

export const SendButtonDisabledWhenEmpty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sendButton = canvasElement.querySelector('.vac-send-disabled')
    expect(sendButton).toBeTruthy()
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await userEvent.type(textarea, 'something')
    expect(canvasElement.querySelector('.vac-send-disabled')).toBeFalsy()
  },
}

export const ClickingSendIconEmits: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await userEvent.type(textarea, 'click test')
    const sendButton = canvasElement.querySelector(
      '.vac-icon-textarea > .vac-svg-button:last-child',
    )
    expect(sendButton).toBeTruthy()
    await userEvent.click(sendButton as Element)
    await expect(args['onSend-message']).toHaveBeenCalled()
  },
}

export const EmojiAutocompleteSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message') as HTMLTextAreaElement
    await userEvent.click(textarea)
    await userEvent.type(textarea, ':')
    // wait for the emoji suggestions chip to appear
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-emojis-menu')).toBeTruthy()
    })
    const firstEmoji = canvasElement.querySelector('.vac-emojis-menu .vac-autocomplete-item')
    expect(firstEmoji).toBeTruthy()
    await userEvent.click(firstEmoji as Element)
    expect(textarea.value).not.toBe(':')
  },
}

export const UserTagAutocompleteSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message') as HTMLTextAreaElement
    await userEvent.click(textarea)
    await userEvent.type(textarea, '@')
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-user-tag-menu')).toBeTruthy()
    })
    const firstUser = canvasElement.querySelector('.vac-user-tag-menu .vac-autocomplete-item')
    await userEvent.click(firstUser as Element)
    expect(textarea.value).toContain('@')
  },
}

export const CancelReplyEmitsReset: Story = {
  args: {
    initReplyMessage: sampleMessages[0],
    'onReset-reply-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const closeButton = canvasElement.querySelector('.vac-footer-reply-close')
    expect(closeButton).toBeTruthy()
    await userEvent.click(closeButton as Element)
    await expect(args['onReset-reply-message']).toHaveBeenCalled()
  },
}

export const CancelEditEmitsReset: Story = {
  args: {
    initEditMessage: sampleMessages[1],
    'onReset-edit-message': fn(),
    'onUpdate-edited-message-id': fn(),
  },
  play: async ({ canvasElement, args }) => {
    // edit-close-icon button is the first button in icon-textarea
    const cancelButton = canvasElement.querySelector('.vac-icon-textarea > button') as HTMLElement
    expect(cancelButton).toBeTruthy()
    await userEvent.click(cancelButton)
    await expect(args['onReset-edit-message']).toHaveBeenCalled()
  },
}

export const FocusBlurEvents: Story = {
  args: {
    'onFocus-textarea': fn(),
    'onBlur-textarea': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message')
    await userEvent.click(textarea)
    await expect(args['onFocus-textarea']).toHaveBeenCalled()
    ;(textarea as HTMLElement).blur()
    await waitFor(() => expect(args['onBlur-textarea']).toHaveBeenCalled())
  },
}

export const EmojiArrowKeysSelect: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message') as HTMLTextAreaElement
    await userEvent.click(textarea)
    await userEvent.type(textarea, ':')
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-emojis-menu')).toBeTruthy()
    })
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{Enter}')
    expect(textarea.value).not.toBe(':')
  },
}

export const UserTagArrowKeysSelect: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message') as HTMLTextAreaElement
    await userEvent.click(textarea)
    await userEvent.type(textarea, '@')
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-user-tag-menu')).toBeTruthy()
    })
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{Tab}')
    expect(textarea.value).toContain('@')
  },
}

export const EditModePrefillsContent: Story = {
  args: {
    initEditMessage: { ...sampleMessages[1]! } as never,
    'onUpdate-edited-message-id': fn(),
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('#roomTextarea') as HTMLTextAreaElement
    expect(textarea.value).toBe('Here is a screenshot from the latest build.')
    expect(canvasElement.querySelector('.vac-textarea-outline')).toBeTruthy()
  },
}

export const EditedMessageEmitsEdit: Story = {
  args: {
    initEditMessage: { ...sampleMessages[1]! } as never,
    'onEdit-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const textarea = canvasElement.querySelector('#roomTextarea') as HTMLTextAreaElement
    textarea.focus()
    await userEvent.type(textarea, '!')
    // Trigger send via Enter
    await userEvent.keyboard('{Enter}')
    await expect(args['onEdit-message']).toHaveBeenCalled()
  },
}
