import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import AudioPlayer from './AudioPlayer.vue'

const meta = {
  component: AudioPlayer,
  tags: ['autodocs'],
  args: {
    src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
    message: { id: 'sample-1' },
  },
} satisfies Meta<typeof AudioPlayer>

export default meta

type Story = StoryObj<typeof meta>

const mockAudio = (
  audio: HTMLAudioElement,
  { duration = 100, rejectPlay = false }: { duration?: number; rejectPlay?: boolean } = {},
) => {
  let currentTime = 0
  let paused = true
  const play = fn(async () => {
    if (rejectPlay) throw new Error('Playback was blocked')

    paused = false
    audio.dispatchEvent(new Event('play'))
  })
  const pause = fn(() => {
    paused = true
    audio.dispatchEvent(new Event('pause'))
  })

  Object.defineProperties(audio, {
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (value: number) => {
        currentTime = value
      },
    },
    duration: { configurable: true, get: () => duration },
    paused: { configurable: true, get: () => paused },
    pause: { configurable: true, value: pause },
    play: { configurable: true, value: play },
  })

  return { pause, play, setCurrentTime: (value: number) => (currentTime = value) }
}

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement
    const media = mockAudio(audio)

    audio.dispatchEvent(new Event('loadeddata'))
    await userEvent.click(canvas.getByRole('button', { name: 'Play audio' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Pause audio' })).toBeTruthy())
    expect(media.play).toHaveBeenCalledOnce()

    await userEvent.click(canvas.getByRole('button', { name: 'Pause audio' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Play audio' })).toBeTruthy())
    expect(media.pause).toHaveBeenCalled()
  },
}

export const PlayButtonIsRendered: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('#acc-icon-audio-play')).toBeTruthy()
  },
}

export const SeekIncludesZero: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement
    const bar = canvasElement.querySelector('.acc-player-bar') as HTMLElement
    const media = mockAudio(audio)

    Object.defineProperty(bar, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 20, width: 200 }),
    })
    media.setCurrentTime(50)
    audio.dispatchEvent(new Event('timeupdate'))
    await waitFor(() => expect(bar.getAttribute('aria-valuenow')).toBe('50'))

    bar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 20 }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 20 }))
    await waitFor(() => expect(audio.currentTime).toBe(0))
    await waitFor(() => expect(bar.getAttribute('aria-valuenow')).toBe('0'))
  },
}

export const RejectedPlayStaysPaused: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement
    const media = mockAudio(audio, { rejectPlay: true })

    await userEvent.click(canvas.getByRole('button', { name: 'Play audio' }))
    await waitFor(() => expect(media.play).toHaveBeenCalledOnce())
    expect(canvas.getByRole('button', { name: 'Play audio' }).getAttribute('aria-pressed')).toBe(
      'false',
    )
  },
}

export const SourceChangeResetsProgress: Story = {
  render: (args) => ({
    components: { AudioPlayer },
    setup() {
      const source = ref<string | null | undefined>(args.src)
      return { args, source }
    },
    template: `
      <AudioPlayer v-bind="args" :src="source" />
      <button type="button" @click="source = 'replacement-audio.mp3'">Change source</button>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement
    const bar = canvas.getByRole('slider', { name: 'Audio progress' })
    const media = mockAudio(audio)

    media.setCurrentTime(50)
    audio.dispatchEvent(new Event('timeupdate'))
    await waitFor(() => expect(bar.getAttribute('aria-valuenow')).toBe('50'))

    await userEvent.click(canvas.getByRole('button', { name: 'Change source' }))
    await waitFor(() => expect(audio.getAttribute('src')).toBe('replacement-audio.mp3'))
    expect(audio.currentTime).toBe(0)
    await waitFor(() => expect(bar.getAttribute('aria-valuenow')).toBe('0'))
    expect(media.pause).toHaveBeenCalled()
  },
}

export const UnmountPausesAndRemovesListeners: Story = {
  render: (args) => ({
    components: { AudioPlayer },
    setup() {
      const mounted = ref(true)
      return { args, mounted }
    },
    template: `
      <AudioPlayer v-if="mounted" v-bind="args" />
      <button type="button" class="unmount-player" @click="mounted = false">Unmount player</button>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement
    const media = mockAudio(audio)
    const nativeRemoveEventListener = audio.removeEventListener.bind(audio)
    const removeEventListener = fn(nativeRemoveEventListener)

    Object.defineProperty(audio, 'removeEventListener', {
      configurable: true,
      value: removeEventListener,
    })

    await userEvent.click(canvas.getByRole('button', { name: 'Play audio' }))
    ;(canvasElement.querySelector('.unmount-player') as HTMLButtonElement).click()

    await waitFor(() => expect(canvasElement.querySelector('audio')).toBeFalsy())
    expect(media.pause).toHaveBeenCalled()
    expect(removeEventListener).toHaveBeenCalledTimes(5)
  },
}

export const NoSrc: Story = {
  args: {
    src: null,
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('audio')).toBeFalsy()
    expect(within(canvasElement).getByRole('button', { name: 'Play audio' })).toBeDisabled()
  },
}
