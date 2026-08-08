import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import Message from './Message.vue'
import { currentUser, messageActions, sampleMessages, sampleUsers } from './stories.fixtures.ts'

const meta = {
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
    expect(canvasElement.querySelector('#vac-icon-pencil')).toBeTruthy()
  },
}

export const Reply: Story = {
  args: {
    message: sampleMessages[2],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-reply-message')).toBeTruthy()
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

    expect(canvasElement.querySelector('.vac-audio-player')).toBeTruthy()
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
    expect(canvasElement.querySelector('.vac-message-deleted')).toBeTruthy()
    // deleted messages hide the actions chip
    expect(canvasElement.querySelector('.vac-message-actions-wrapper')).toBeFalsy()
  },
}

export const System: Story = {
  args: {
    message: sampleMessages[5],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-message-system')).toBeTruthy()
    expect(canvasElement.querySelector('.vac-message-actions-wrapper')).toBeFalsy()
  },
}

export const Failure: Story = {
  args: {
    message: sampleMessages[6],
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-failure-container')).toBeTruthy()
  },
}

export const FailureClickEmits: Story = {
  args: {
    message: sampleMessages[6],
    'onOpen-failed-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const failure = canvasElement.querySelector('.vac-failure-container') as HTMLElement
    await userEvent.click(failure)
    await expect(args['onOpen-failed-message']).toHaveBeenCalledWith(sampleMessages[6])
  },
}

export const ReactionPickerEmits: Story = {
  args: {
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const reactionToggle = canvasElement.querySelector(
      '.vac-reaction-picker .vac-message-options',
    ) as HTMLElement
    expect(reactionToggle).toBeTruthy()
    await userEvent.click(reactionToggle)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-reactions-menu')).toBeTruthy()
    })
    const firstReaction = canvasElement.querySelector('.vac-reaction-option') as HTMLElement
    await userEvent.click(firstReaction)
    await expect(args['onSend-message-reaction']).toHaveBeenCalled()
  },
}

export const DropdownActionEmits: Story = {
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const dropdownToggle = canvasElement.querySelector(
      '.vac-dropdown-picker .vac-message-options',
    ) as HTMLElement
    expect(dropdownToggle).toBeTruthy()
    await userEvent.click(dropdownToggle)
    await waitFor(() => {
      expect(canvasElement.querySelector('.vac-menu-options')).toBeTruthy()
    })
    const firstAction = canvasElement.querySelector('.vac-menu-item') as HTMLElement
    await userEvent.click(firstAction)
    await expect(args['onMessage-action-handler']).toHaveBeenCalled()
  },
}

export const SelectionModeClickEmits: Story = {
  args: {
    message: sampleMessages[2],
    messageSelectionEnabled: true,
    'onSelect-message': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const row = canvasElement.querySelector('.vac-message-row-selectable') as HTMLElement
    expect(row).toBeTruthy()
    expect(canvasElement.querySelector('.vac-button-reaction')).toBeFalsy()
    await userEvent.click(row)
    await expect(args['onSelect-message']).toHaveBeenCalled()
  },
}

export const ExistingReactionsRender: Story = {
  args: {
    message: sampleMessages[2],
  },
  play: async ({ canvasElement }) => {
    const reactionPills = canvasElement.querySelectorAll('.vac-button-reaction')
    expect(reactionPills.length).toBeGreaterThan(0)
  },
}

export const ClickReactionPillEmits: Story = {
  args: {
    message: sampleMessages[2],
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const pill = canvasElement.querySelector('.vac-button-reaction') as HTMLElement
    await userEvent.click(pill)
    await expect(args['onSend-message-reaction']).toHaveBeenCalled()
  },
}

export const DisabledActionsHidesChip: Story = {
  args: {
    message: { ...sampleMessages[2]!, disableActions: true, disableReactions: true },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.vac-message-actions-wrapper')).toBeFalsy()
  },
}
