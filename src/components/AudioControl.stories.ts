import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn } from 'storybook/test'

import AudioControl from './AudioControl.vue'

const meta = {
  component: AudioControl,
  tags: ['autodocs'],
  args: {
    messageSelectionEnabled: false,
    percentage: 25,
  },
} satisfies Meta<typeof AudioControl>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('.vac-line-dot') as HTMLElement
    expect(dot.style.left).toBe('25%')
  },
}

export const MouseDownEmitsLineHead: Story = {
  args: {
    'onChange-linehead': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.vac-player-bar') as HTMLElement
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 100 }))
    await expect(args['onChange-linehead']).toHaveBeenCalled()
  },
}

export const DragMovesLineHead: Story = {
  args: {
    'onChange-linehead': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.vac-player-bar') as HTMLElement
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 50 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 75 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 1000 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: -100 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 75 }))
    const calls = (args['onChange-linehead'] as ReturnType<typeof fn>).mock.calls.length
    expect(calls).toBeGreaterThanOrEqual(3)
  },
}

export const HoverEmitsHoverFlag: Story = {
  args: {
    'onHover-audio-progress': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.vac-player-bar') as HTMLElement
    bar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    bar.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    await expect(args['onHover-audio-progress']).toHaveBeenCalledWith(true)
    await expect(args['onHover-audio-progress']).toHaveBeenCalledWith(false)
  },
}

export const SelectionModeBlocksScrub: Story = {
  args: {
    messageSelectionEnabled: true,
    'onChange-linehead': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.vac-player-bar') as HTMLElement
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 50 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 50 }))
    expect(args['onChange-linehead']).not.toHaveBeenCalled()
  },
}
