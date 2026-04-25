import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { h } from 'vue'

import ChatUserTag from './ChatUserTag.vue'
import { sampleUsers } from './stories.fixtures.ts'

const meta = {
  component: ChatUserTag,
  tags: ['autodocs'],
  args: {
    filteredUsers: sampleUsers,
  },
  decorators: [
    (story) => () =>
      h(
        'div',
        {
          style:
            'position: relative; min-height: 240px; max-width: 360px; ' +
            'margin: 220px auto 16px;',
        },
        h(story()),
      ),
  ],
} satisfies Meta<typeof ChatUserTag>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Empty: Story = {
  args: {
    filteredUsers: [],
  },
}

export const ClickEmits: Story = {
  args: {
    'onSelect-user-tag': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const firstRow = canvasElement.querySelector('.vac-autocomplete-item') as HTMLElement
    await userEvent.click(firstRow)
    await expect(args['onSelect-user-tag']).toHaveBeenCalled()
    const calls = (args['onSelect-user-tag'] as ReturnType<typeof fn>).mock.calls
    expect(calls[0]?.[0]).toMatchObject({ id: sampleUsers[0]!.id, name: sampleUsers[0]!.name })
  },
}

export const HoverHighlightsRow: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('.vac-autocomplete-item')
    rows[2]?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    await Promise.resolve()
    expect(rows[2]?.classList.contains('vac-autocomplete-item-active')).toBe(true)
  },
}
