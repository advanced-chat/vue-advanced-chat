import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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

const setBarBounds = (bar: HTMLElement) => {
  Object.defineProperty(bar, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ left: 100, width: 200 }),
  })
}

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Audio progress' })
    const dot = canvasElement.querySelector('.acc-line-dot') as HTMLElement

    expect(dot.style.left).toBe('25%')
    expect(slider.getAttribute('aria-valuenow')).toBe('25')
  },
}

export const MouseDownEmitsZeroLineHead: Story = {
  args: {
    'onChange-linehead': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.acc-player-bar') as HTMLElement
    setBarBounds(bar)
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 100 }))
    await expect(args['onChange-linehead']).toHaveBeenCalledWith(0)
  },
}

export const DragMovesLineHead: Story = {
  args: {
    'onChange-linehead': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.acc-player-bar') as HTMLElement
    setBarBounds(bar)
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 150 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 200 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 1000 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: -100 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 200 }))
    const calls = (args['onChange-linehead'] as ReturnType<typeof fn>).mock.calls.length
    expect(calls).toBeGreaterThanOrEqual(3)
  },
}

export const KeyboardSeeks: Story = {
  args: {
    'onChange-linehead': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Audio progress' })

    slider.focus()
    await userEvent.keyboard('{Home}{End}{ArrowLeft}{ArrowRight}')
    await expect(args['onChange-linehead']).toHaveBeenNthCalledWith(1, 0)
    await expect(args['onChange-linehead']).toHaveBeenNthCalledWith(2, 1)
    await expect(args['onChange-linehead']).toHaveBeenNthCalledWith(3, 0.2)
    await expect(args['onChange-linehead']).toHaveBeenNthCalledWith(4, 0.3)
  },
}

export const HoverEmitsHoverFlag: Story = {
  args: {
    'onHover-audio-progress': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.acc-player-bar') as HTMLElement
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
    const bar = canvasElement.querySelector('.acc-player-bar') as HTMLElement
    setBarBounds(bar)
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 50 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 50 }))
    expect(args['onChange-linehead']).not.toHaveBeenCalled()
    expect(bar.getAttribute('aria-disabled')).toBe('true')
    expect(bar.getAttribute('tabindex')).toBe('-1')
  },
}

export const UnmountDuringDragRemovesDocumentListeners: Story = {
  args: {
    'onChange-linehead': fn(),
  },
  render: (args) => ({
    components: { AudioControl },
    setup() {
      const mounted = ref(true)
      return { args, mounted }
    },
    template: `
      <AudioControl
        v-if="mounted"
        v-bind="args"
        :message-selection-enabled="args.messageSelectionEnabled"
      />
      <button type="button" class="unmount-control" @click="mounted = false">Unmount control</button>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const bar = canvasElement.querySelector('.acc-player-bar') as HTMLElement
    setBarBounds(bar)
    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 150 }))
    expect(args['onChange-linehead']).toHaveBeenCalledTimes(1)
    ;(canvasElement.querySelector('.unmount-control') as HTMLButtonElement).click()
    await waitFor(() => expect(canvasElement.querySelector('.acc-player-bar')).toBeFalsy())
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 200 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 200 }))
    expect(args['onChange-linehead']).toHaveBeenCalledTimes(1)
  },
}
