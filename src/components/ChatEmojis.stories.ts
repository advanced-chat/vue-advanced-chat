import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { h } from 'vue'

import ChatEmojis from './ChatEmojis.vue'

const meta = {
  component: ChatEmojis,
  tags: ['autodocs'],
  args: {
    filteredEmojis: ['😀', '😂', '🔥', '🎉'],
  },
  decorators: [
    (story) => () =>
      h(
        'div',
        {
          style:
            'position: relative; min-height: 160px; max-width: 360px; ' +
            'margin: 110px auto 16px;',
        },
        h(story()),
      ),
  ],
} satisfies Meta<typeof ChatEmojis>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const ManyResults: Story = {
  args: {
    filteredEmojis: ['😀', '😅', '😆', '😂', '🔥', '🎉'],
  },
}

export const Empty: Story = {
  args: {
    filteredEmojis: [],
  },
}

export const ClickEmits: Story = {
  args: {
    'onSelect-emoji': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const first = canvasElement.querySelector('.vac-autocomplete-item') as HTMLElement
    await userEvent.click(first)
    await expect(args['onSelect-emoji']).toHaveBeenCalledWith('😀')
  },
}

export const HoverHighlightsItem: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.vac-autocomplete-item')
    expect(items[0]?.classList.contains('vac-autocomplete-item-active')).toBe(true)
    items[2]?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    await Promise.resolve()
    expect(items[2]?.classList.contains('vac-autocomplete-item-active')).toBe(true)
  },
}
