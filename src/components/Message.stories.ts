import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import Message from './Message.vue'
import { currentUser, messageActions, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
  title: 'Components/Message',
  component: Message,
  tags: ['autodocs'],
  args: {
    currentUser: currentUser,
    message: sampleMessages[2],
    users: sampleUsers,
    actions: messageActions,
  },
} satisfies Meta<typeof Message>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const OwnEdited: Story = {
  args: {
    message: sampleMessages[1],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('#acc-icon-pencil')).toBeTruthy()
  },
}

export const Reply: Story = {
  args: {
    message: sampleMessages[2],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-reply-message')).toBeTruthy()
  },
}

export const AudioOnly: Story = {
  args: {
    message: sampleMessages[3],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement
    let paused = true
    const play = fn(async () => {
      paused = false
      audio.dispatchEvent(new Event('play'))
    })

    Object.defineProperties(audio, {
      paused: { configurable: true, get: () => paused },
      play: { configurable: true, value: play },
    })

    expect(canvasElement.querySelector('.acc-audio-player')).toBeTruthy()
    expect(audio.getAttribute('src')).toBe(sampleMessages[3]!.files![0]!.url)

    await userEvent.click(canvas.getByRole('button', { name: 'Play audio' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Pause audio' })).toBeTruthy())
    expect(play).toHaveBeenCalledOnce()
  },
}

export const Deleted: Story = {
  args: {
    message: sampleMessages[4],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-message-deleted')).toBeTruthy()
    // deleted messages hide the actions chip
    expect(canvasElement.querySelector('.acc-message-actions-wrapper')).toBeFalsy()
  },
}

export const System: Story = {
  args: {
    message: sampleMessages[5],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-message-system')).toBeTruthy()
    expect(canvasElement.querySelector('.acc-message-actions-wrapper')).toBeFalsy()
  },
}

export const Failure: Story = {
  args: {
    message: sampleMessages[6],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-failure-container')).toBeTruthy()
  },
}

export const FailureClickEmits: Story = {
  name: 'Retry a failed message',
  args: {
    message: sampleMessages[6],
    'onOpen-failed-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const failure = canvasElement.querySelector('.acc-failure-container') as HTMLElement
    await userEvent.click(failure)
    await expect(args['onOpen-failed-message']).toHaveBeenCalledWith(sampleMessages[6])
  },
}

export const ReactionPickerEmits: Story = {
  name: 'Choose a reaction',
  args: {
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const reactionToggle = canvasElement.querySelector(
      '.acc-reaction-picker .acc-message-options',
    ) as HTMLElement
    expect(reactionToggle).toBeTruthy()
    await userEvent.click(reactionToggle)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-reactions-menu')).toBeTruthy()
    })
    const firstReaction = canvasElement.querySelector('.acc-reaction-option') as HTMLElement
    await userEvent.click(firstReaction)
    await expect(args['onSend-message-reaction']).toHaveBeenCalled()
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-reactions-menu')).toBeNull()
    })
  },
}

export const DropdownActionEmits: Story = {
  name: 'Choose a message action',
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const dropdownToggle = canvasElement.querySelector(
      '.acc-dropdown-picker .acc-message-options',
    ) as HTMLElement
    expect(dropdownToggle).toBeTruthy()
    await userEvent.click(dropdownToggle)
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-options')).toBeTruthy()
    })
    const firstAction = canvasElement.querySelector('.acc-menu-item') as HTMLElement
    await userEvent.click(firstAction)
    await expect(args['onMessage-action-handler']).toHaveBeenCalled()
    await waitFor(() => {
      expect(canvasElement.querySelector('.acc-menu-item')).toBeNull()
      expect(canvasElement.querySelector('.acc-menu-options')).toBeNull()
    })
  },
}

export const SelectionModeClickEmits: Story = {
  name: 'Select a message',
  args: {
    message: sampleMessages[2],
    messageSelectionEnabled: true,
    'onSelect-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const row = canvasElement.querySelector('.acc-message-row-selectable') as HTMLElement
    expect(row).toBeTruthy()
    expect(canvasElement.querySelector('.acc-button-reaction')).toBeFalsy()
    await userEvent.click(row)
    await expect(args['onSelect-message']).toHaveBeenCalled()
  },
}

export const ExistingReactionsRender: Story = {
  name: 'Message with reactions',
  args: {
    message: sampleMessages[2],
  },
  play: async ({ canvasElement }) => {
    const reactionPills = canvasElement.querySelectorAll('.acc-button-reaction')
    expect(reactionPills.length).toBeGreaterThan(0)
  },
}

export const ClickReactionPillEmits: Story = {
  name: 'Toggle an existing reaction',
  args: {
    message: sampleMessages[2],
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const pill = canvasElement.querySelector('.acc-button-reaction') as HTMLElement
    await userEvent.click(pill)
    await expect(args['onSend-message-reaction']).toHaveBeenCalled()
  },
}

export const DisabledActionsHidesChip: Story = {
  name: 'Message without actions',
  args: {
    message: { ...sampleMessages[2]!, disableActions: true, disableReactions: true },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.acc-message-actions-wrapper')).toBeFalsy()
  },
}
