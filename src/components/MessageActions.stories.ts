import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { h } from 'vue'

import MessageActions from './MessageActions.vue'
import { currentUser, messageActions, sampleMessages } from './stories.fixtures.ts'

const meta = {
  component: MessageActions,
  tags: ['autodocs'],
  args: {
    currentUser: currentUser,
    message: sampleMessages[2],
    actions: messageActions,
  },
  decorators: [
    (story) => () =>
      h(
        'div',
        {
          style:
            'position: relative; max-width: 360px; margin: 32px auto; padding: 24px 16px 12px; ' +
            'border-radius: 18px; background: var(--chat-message-bg-color); color: var(--chat-message-color); ' +
            'border: var(--chat-border-style);',
        },
        [
          h('div', { style: 'font-size: 13px; opacity: 0.7;' }, 'Hover the bubble or open a menu.'),
          h(story()),
        ],
      ),
  ],
} satisfies Meta<typeof MessageActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const ReactionsOnly: Story = {
  args: {
    actions: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByRole('button', { name: 'Message actions' })).not.toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Add reaction' })).toBeInTheDocument()
  },
}

export const ActionsOnly: Story = {
  args: {
    showReactionEmojis: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByRole('button', { name: 'Add reaction' })).not.toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Message actions' })).toBeInTheDocument()
  },
}

export const ReactionMenuOpen: Story = {
  args: {
    'onSend-message-reaction': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Add reaction' })
    await userEvent.click(trigger)
    const menu = await canvas.findByRole('menu', { name: 'Add reaction' })

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(5)
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'React with 😂' }))
    await expect(args['onSend-message-reaction']).toHaveBeenCalledWith({
      emoji: '😂',
      message: sampleMessages[2],
    })
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() =>
      expect(canvas.queryByRole('menu', { name: 'Add reaction' })).not.toBeInTheDocument(),
    )
  },
}

export const DropdownMenuOpen: Story = {
  args: {
    'onMessage-action-handler': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Message actions' })
    await userEvent.click(trigger)
    const menu = await canvas.findByRole('menu', { name: 'Message actions' })
    const reply = within(menu).getByRole('menuitem', { name: 'Reply' })

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(reply)
    await expect(args['onMessage-action-handler']).toHaveBeenCalledWith({
      action: messageActions[0],
      message: sampleMessages[2],
    })
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

export const EscapeClosesMenuAndReturnsFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Message actions' })

    await userEvent.click(trigger)
    const menu = await canvas.findByRole('menu', { name: 'Message actions' })
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Reply' })).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(canvas.queryByRole('menu', { name: 'Message actions' })).not.toBeInTheDocument(),
    )
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const FilterOnlyMeWhenOtherUser: Story = {
  args: {
    currentUser: { id: '99' }, // not the sender
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Message actions' })
    await userEvent.click(trigger)
    const menu = await canvas.findByRole('menu', { name: 'Message actions' })
    // messageActions has 3 items: reply, edit (ownMessageOnly), delete (ownMessageOnly)
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(1)
    expect(within(menu).getByRole('menuitem', { name: 'Reply' })).toBeInTheDocument()
  },
}

export const HiddenForDeletedMessage: Story = {
  args: {
    message: { ...sampleMessages[2]!, deleted: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByRole('button', { name: 'Add reaction' })).not.toBeInTheDocument()
    expect(canvas.queryByRole('button', { name: 'Message actions' })).not.toBeInTheDocument()
  },
}
