import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test'

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
    await waitFor(() => {
      const calls = (args['onTyping-message'] as ReturnType<typeof fn>).mock.calls
      expect(calls[calls.length - 1]?.[0]).toBe('hi')
    })
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
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox', {
      name: 'Message suggestions',
    })
    const textarea = canvas.getByRole('textbox', {
      name: 'Type a message',
    }) as HTMLTextAreaElement
    await userEvent.click(textarea)
    await userEvent.type(textarea, '@')
    const listbox = await canvas.findByRole('listbox', { name: 'User suggestions' })
    const firstUser = within(listbox).getByRole('option', { name: 'Alice' })

    expect(combobox).toHaveAttribute('aria-expanded', 'true')
    expect(combobox).toHaveAttribute('aria-controls', listbox.id)
    expect(textarea).toHaveAttribute('aria-controls', listbox.id)
    expect(textarea).toHaveAttribute('aria-activedescendant', firstUser.id)

    await userEvent.click(firstUser)
    expect(textarea.value).toBe('<@1> ')

    await userEvent.type(textarea, 'and @a')
    const secondListbox = await canvas.findByRole('listbox', { name: 'User suggestions' })
    await userEvent.click(within(secondListbox).getByRole('option', { name: 'Alice' }))
    expect(textarea.value).toBe('<@1> and <@1> ')

    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(args['onSend-message']).toHaveBeenCalledTimes(1)

    const payload = (args['onSend-message'] as ReturnType<typeof fn>).mock.calls[0]?.[0] as {
      content: string
      files: unknown[]
      mentionedUsers: unknown[]
    }
    expect(payload.content).toBe('<@1> and <@1>')
    expect(payload.files).toEqual([])
    expect(payload.mentionedUsers).toEqual([sampleUsers[0]])
  },
}

export const EscapeClosesComposerPopupsWithoutSending: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox', { name: 'Message suggestions' })
    const textarea = canvas.getByRole('textbox', { name: 'Type a message' })

    await userEvent.click(textarea)
    await userEvent.type(textarea, '@')
    await canvas.findByRole('listbox', { name: 'User suggestions' })
    expect(combobox).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(canvas.queryByRole('listbox', { name: 'User suggestions' })).not.toBeInTheDocument(),
    )
    expect(combobox).toHaveAttribute('aria-expanded', 'false')
    expect(args['onSend-message']).not.toHaveBeenCalled()

    const pickerButton = canvas.getByRole('button', { name: 'Choose an emoji' })
    await userEvent.click(pickerButton)
    await canvas.findByRole('dialog', { name: 'Choose an emoji' })
    expect(pickerButton).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    expect(canvas.queryByRole('dialog', { name: 'Choose an emoji' })).not.toBeInTheDocument()
    expect(pickerButton).toHaveAttribute('aria-expanded', 'false')
    expect(args['onSend-message']).not.toHaveBeenCalled()
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
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', {
      name: 'Type a message',
    }) as HTMLTextAreaElement
    expect(textarea.value).toBe('Here is a screenshot from the latest build.')
    expect(canvasElement.querySelector('.vac-textarea-outline')).toBeTruthy()
  },
}

const dropFiles = (input: HTMLInputElement, files: File[]) => {
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  input.files = transfer.files
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

export const SameFileReselectionTransfersPreviewOwnership: Story = {
  args: {
    'onSend-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['attachment contents'], 'attachment.png', { type: 'image/png' })
    const revokeObjectURL = spyOn(URL, 'revokeObjectURL')

    await userEvent.upload(input, file, { applyAccept: false })
    const removeButton = await canvas.findByRole('button', { name: 'Remove attachment.png' })
    const preview = canvasElement.querySelector('.vac-message-image') as HTMLElement
    const firstLocalUrl = preview.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1]

    expect(firstLocalUrl).toBeTruthy()
    expect(input.value).toBe('')

    await userEvent.click(removeButton)
    await waitFor(() =>
      expect(
        canvas.queryByRole('button', { name: 'Remove attachment.png' }),
      ).not.toBeInTheDocument(),
    )
    await expect(revokeObjectURL).toHaveBeenCalledWith(firstLocalUrl)

    await userEvent.upload(input, file, { applyAccept: false })
    await canvas.findByRole('button', { name: 'Remove attachment.png' })
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))

    await expect(args['onSend-message']).toHaveBeenCalledTimes(1)
    const payload = (args['onSend-message'] as ReturnType<typeof fn>).mock.calls[0]?.[0] as {
      files: Array<{ localUrl?: string }>
    }
    const localUrl = payload.files[0]?.localUrl

    expect(localUrl).toBeTruthy()
    await expect((await fetch(localUrl!)).text()).resolves.toBe('attachment contents')
    URL.revokeObjectURL(localUrl!)
    revokeObjectURL.mockRestore()
  },
}

/**
 * Regression for [#474](https://github.com/advanced-chat/advanced-chat-components/issues/474):
 * `maxFiles` caps the pending-file count. Files past the cap are
 * rejected via `invalid-file` with `reason: 'count'`; the existing
 * pending list is left untouched.
 */
export const MaxFilesRejectsOverflow: Story = {
  args: {
    maxFiles: 2,
    'onInvalid-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeTruthy()

    dropFiles(input, [
      new File(['a'], 'a.txt', { type: 'text/plain' }),
      new File(['b'], 'b.txt', { type: 'text/plain' }),
      new File(['c'], 'c.txt', { type: 'text/plain' }),
    ])

    await waitFor(() => {
      expect(canvasElement.querySelectorAll('.vac-room-file-container').length).toBe(2)
    })

    const calls = (args['onInvalid-file'] as ReturnType<typeof fn>).mock.calls
    expect(calls.length).toBe(1)
    const payload = calls[0]?.[0] as { file: File; reason: string }
    expect(payload.reason).toBe('count')
    expect(payload.file.name).toBe('c.txt')
  },
}

/**
 * Regression for [#461](https://github.com/advanced-chat/advanced-chat-components/issues/461):
 * `maxFileSize` rejects single files above the byte cap, but leaves
 * smaller files in the same selection alone.
 */
export const MaxFileSizeRejectsLarge: Story = {
  args: {
    maxFileSize: 1024,
    'onInvalid-file': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement

    dropFiles(input, [
      new File([new Uint8Array(256)], 'small.bin', { type: 'application/octet-stream' }),
      new File([new Uint8Array(2048)], 'large.bin', { type: 'application/octet-stream' }),
    ])

    await waitFor(() => {
      expect(canvasElement.querySelectorAll('.vac-room-file-container').length).toBe(1)
    })

    const calls = (args['onInvalid-file'] as ReturnType<typeof fn>).mock.calls
    expect(calls.length).toBe(1)
    const payload = calls[0]?.[0] as { file: File; reason: string }
    expect(payload.reason).toBe('size')
    expect(payload.file.name).toBe('large.bin')
  },
}

export const EditedMessageEmitsEdit: Story = {
  args: {
    initEditMessage: { ...sampleMessages[1]!, content: 'Review with <@1>' } as never,
    'onEdit-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', {
      name: 'Type a message',
    }) as HTMLTextAreaElement
    await userEvent.click(textarea)
    await userEvent.type(textarea, '!')
    await userEvent.keyboard('{Enter}')
    await expect(args['onEdit-message']).toHaveBeenCalledTimes(1)

    const payload = (args['onEdit-message'] as ReturnType<typeof fn>).mock.calls[0]?.[0] as {
      messageId: string
      content: string
      files: unknown[]
      mentionedUsers: unknown[]
    }
    expect(payload.messageId).toBe(sampleMessages[1]!.id)
    expect(payload.content).toBe('Review with <@1>!')
    expect(payload.files).toEqual([])
    expect(payload.mentionedUsers).toEqual([sampleUsers[0]])
  },
}
