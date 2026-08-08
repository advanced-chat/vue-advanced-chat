<script setup lang="ts">
import type { MessageReference } from '../models'
import { computed, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import AudioControl from '@/components/AudioControl.vue'

export interface AudioPlayerProps {
  /** Owning message; its `id` namespaces the underlying `<audio>` element and slot names. */
  message?: MessageReference
  /** Audio source URL. Pass `null` to render a disabled player. */
  src?: string | null
  /** When `true`, playback and scrubbing are disabled so clicks toggle message selection instead. */
  messageSelectionEnabled?: boolean
}

export interface AudioPlayerEvents {
  /** Fires when the cursor enters or leaves the progress bar. */
  (e: 'hover-audio-progress', hovering: boolean): void
  /** Fires as playback advances; payload is the current `mm:ss` time, or total duration before playback starts. */
  (e: 'update-progress-time', value: string): void
}

const props = defineProps<AudioPlayerProps>()

const emit = defineEmits<AudioPlayerEvents>()

const convertTimeMMSS = (seconds: number): string => {
  const totalSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const isPlaying = ref(false)
const duration = ref(convertTimeMMSS(0))
const playedTime = ref(convertTimeMMSS(0))
const progress = ref(0)
const fallbackPlayerId = useId()

const playerUniqId = computed(() => {
  return `audio-player${props.message?.id ?? fallbackPlayerId}`
})

const player = useTemplateRef<HTMLAudioElement>('player')
let playbackRequest = 0
let playPending = false

const updateProgressTime = () => {
  emit('update-progress-time', progress.value > 0 ? playedTime.value : duration.value)
}

const resetProgress = () => {
  playbackRequest += 1
  playPending = false

  if (player.value) {
    player.value.pause()
    player.value.currentTime = 0
  }

  duration.value = convertTimeMMSS(0)
  playedTime.value = convertTimeMMSS(0)
  progress.value = 0
  isPlaying.value = false
  updateProgressTime()
}

const onTimeUpdate = () => {
  if (!player.value) return

  const currentTime = Number.isFinite(player.value.currentTime) ? player.value.currentTime : 0
  const playerDuration = Number.isFinite(player.value.duration) ? player.value.duration : 0

  playedTime.value = convertTimeMMSS(currentTime)
  progress.value =
    playerDuration > 0 ? Math.min(100, Math.max(0, (currentTime / playerDuration) * 100)) : 0
  updateProgressTime()
}

const onUpdateProgress = (position: number) => {
  if (!player.value || !Number.isFinite(player.value.duration) || player.value.duration <= 0) return

  player.value.currentTime = Math.min(1, Math.max(0, position)) * player.value.duration
  onTimeUpdate()
}

const onEnded = () => {
  isPlaying.value = false
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

const onLoadedData = () => {
  resetProgress()

  if (player.value) duration.value = convertTimeMMSS(player.value.duration)

  updateProgressTime()
}

const addPlayerListeners = (element: HTMLAudioElement) => {
  element.addEventListener('ended', onEnded)
  element.addEventListener('loadeddata', onLoadedData)
  element.addEventListener('pause', onPause)
  element.addEventListener('play', onPlay)
  element.addEventListener('timeupdate', onTimeUpdate)
}

const removePlayerListeners = (element: HTMLAudioElement) => {
  element.removeEventListener('ended', onEnded)
  element.removeEventListener('loadeddata', onLoadedData)
  element.removeEventListener('pause', onPause)
  element.removeEventListener('play', onPlay)
  element.removeEventListener('timeupdate', onTimeUpdate)
}

const playback = async () => {
  const element = player.value

  if (props.messageSelectionEnabled || !audioSource.value || !element || playPending) return

  if (isPlaying.value || !element.paused) {
    playbackRequest += 1
    element.pause()
    isPlaying.value = false
    return
  }

  const request = ++playbackRequest
  playPending = true

  try {
    await element.play()

    if (request !== playbackRequest || player.value !== element) {
      element.pause()
      return
    }

    isPlaying.value = true
  } catch {
    if (request === playbackRequest) isPlaying.value = false
  } finally {
    if (request === playbackRequest) playPending = false
  }
}

const audioSource = computed(() => {
  return props.src || null
})

watch(player, (element, previousElement) => {
  if (previousElement) removePlayerListeners(previousElement)
  if (element) addPlayerListeners(element)
})

watch(
  () => props.src,
  () => resetProgress(),
)

watch(
  () => props.messageSelectionEnabled,
  (enabled) => {
    if (enabled) resetProgress()
  },
)

onBeforeUnmount(() => {
  playbackRequest += 1
  playPending = false

  if (player.value) {
    player.value.pause()
    removePlayerListeners(player.value)
  }
})
</script>

<template>
  <div>
    <div class="vac-audio-player">
      <button
        type="button"
        class="vac-svg-button"
        :disabled="!audioSource"
        :tabindex="messageSelectionEnabled || !audioSource ? -1 : 0"
        :aria-label="isPlaying ? 'Pause audio' : 'Play audio'"
        :aria-pressed="isPlaying"
        :aria-disabled="messageSelectionEnabled || !audioSource"
        :aria-controls="audioSource ? playerUniqId : undefined"
        @click="playback"
      >
        <slot v-if="isPlaying" :name="'audio-pause-icon_' + message?.id">
          <SvgIcon name="audio-pause" />
        </slot>
        <slot v-else :name="'audio-play-icon_' + message?.id">
          <svg-icon name="audio-play" />
        </slot>
      </button>
      <AudioControl
        :percentage="progress"
        :message-selection-enabled="messageSelectionEnabled || !audioSource"
        @change-linehead="onUpdateProgress"
        @hover-audio-progress="emit('hover-audio-progress', $event)"
      />

      <audio v-if="audioSource" :id="playerUniqId" ref="player" :src="audioSource" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-audio-player {
  display: flex;
  margin: 8px 0 5px;

  .vac-svg-button {
    display: flex;
    align-items: center;
    max-width: 18px;
    margin-left: 7px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;

    &:disabled {
      cursor: default;
    }
  }
}

@media only screen and (max-width: 768px) {
  .vac-audio-player {
    margin: 4px 0 0;

    .vac-svg-button {
      max-width: 16px;
      margin-left: 5px;
    }
  }
}
</style>
