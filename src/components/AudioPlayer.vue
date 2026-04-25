<script setup lang="ts">
import type { MessageReference } from '../models'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
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
  return new Date(seconds * 1000).toISOString().substring(14, 19)
}

const isPlaying = ref(false)
const duration = ref(convertTimeMMSS(0))
const playedTime = ref(convertTimeMMSS(0))
const progress = ref(0)

const playerUniqId = computed(() => {
  return `audio-player${props.message?.id ?? ''}`
})

const root = useTemplateRef('root')

const player = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  player.value = root.value?.querySelector(`#${playerUniqId.value}`) as HTMLAudioElement | null

  player.value?.addEventListener('ended', () => {
    isPlaying.value = false
  })

  player.value?.addEventListener('loadeddata', () => {
    resetProgress()
    if (player.value) {
      duration.value = convertTimeMMSS(player.value.duration)
    }
    updateProgressTime()
  })

  player.value?.addEventListener('timeupdate', onTimeUpdate)
})

const playback = () => {
  if (props.messageSelectionEnabled || !audioSource.value) return

  if (isPlaying.value) player.value?.pause()
  else setTimeout(() => player.value?.play())

  isPlaying.value = !isPlaying.value
}

const resetProgress = () => {
  if (isPlaying.value) player.value?.pause()

  duration.value = convertTimeMMSS(0)
  playedTime.value = convertTimeMMSS(0)
  progress.value = 0
  isPlaying.value = false
  updateProgressTime()
}

const onTimeUpdate = () => {
  if (!player.value) return

  playedTime.value = convertTimeMMSS(player.value.currentTime)
  progress.value = (player.value.currentTime / player.value.duration) * 100
  updateProgressTime()
}

const onUpdateProgress = (pos: number | null) => {
  if (pos && player.value) player.value.currentTime = pos * player.value.duration
}

const updateProgressTime = () => {
  emit('update-progress-time', progress.value > 1 ? playedTime.value : duration.value)
}

const audioSource = computed(() => {
  if (props.src) return props.src
  resetProgress()
  return null
})
</script>

<template>
  <div ref="root">
    <div class="vac-audio-player">
      <div class="vac-svg-button" @click="playback">
        <slot v-if="isPlaying" :name="'audio-pause-icon_' + message?.id">
          <SvgIcon name="audio-pause" />
        </slot>
        <slot v-else :name="'audio-play-icon_' + message?.id">
          <svg-icon name="audio-play" />
        </slot>
      </div>
      <AudioControl
        :percentage="progress"
        :message-selection-enabled="!!messageSelectionEnabled"
        @change-linehead="onUpdateProgress"
        @hover-audio-progress="emit('hover-audio-progress', $event)"
      />

      <audio v-if="audioSource" :id="playerUniqId" :src="audioSource" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-audio-player {
  display: flex;
  margin: 8px 0 5px;

  .vac-svg-button {
    max-width: 18px;
    margin-left: 7px;
  }
}

@media only screen and (max-width: 768px) {
  .vac-audio-player {
    margin: 4px 0 0px;

    .vac-svg-button {
      max-width: 16px;
      margin-left: 5px;
    }
  }
}
</style>
