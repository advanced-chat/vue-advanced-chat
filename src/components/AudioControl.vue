<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'

export interface AudioControlProps {
  /** Playback position as `0`–`100`. Drives the progress bar fill and dot. Defaults to `0`. */
  percentage?: number
  /** When `true`, scrubbing is disabled so clicks toggle message selection instead. */
  messageSelectionEnabled: boolean
}

export interface AudioControlEvents {
  /** Fires when the cursor enters or leaves the progress bar. */
  (e: 'hover-audio-progress', hovering: boolean): void
  /** Fires when the user scrubs; `position` is `0`–`1` along the bar. */
  (e: 'change-linehead', position: number): void
}

const props = withDefaults(defineProps<AudioControlProps>(), {
  percentage: 0,
})

const emit = defineEmits<AudioControlEvents>()

const isMouseDown = ref(false)
const progress = useTemplateRef('progress')
const normalizedPercentage = computed(() => {
  if (!Number.isFinite(props.percentage)) return 0

  return Math.min(100, Math.max(0, props.percentage))
})

const calculateLineHeadPosition = (ev: MouseEvent, element: HTMLElement) => {
  const { width: progressWidth, left: leftPosition } = element.getBoundingClientRect()
  if (progressWidth <= 0) return 0

  let pos = (ev.clientX - leftPosition) / progressWidth

  pos = pos < 0 ? 0 : pos
  pos = pos > 1 ? 1 : pos

  return pos
}

const onMouseMove = (ev: MouseEvent) => {
  if (props.messageSelectionEnabled || !progress.value) return

  const seekPos = calculateLineHeadPosition(ev, progress.value)
  emit('change-linehead', seekPos)
}

const removeDragListeners = () => {
  isMouseDown.value = false
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mousemove', onMouseMove)
}

const onMouseUp = (ev: MouseEvent) => {
  removeDragListeners()
  if (props.messageSelectionEnabled || !progress.value) return

  const seekPos = calculateLineHeadPosition(ev, progress.value)
  emit('change-linehead', seekPos)
}

const onMouseDown = (ev: MouseEvent) => {
  if (props.messageSelectionEnabled || !progress.value) return

  isMouseDown.value = true
  const seekPos = calculateLineHeadPosition(ev, progress.value)
  emit('change-linehead', seekPos)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onKeyDown = (ev: KeyboardEvent) => {
  if (props.messageSelectionEnabled) return

  const position = normalizedPercentage.value / 100
  let nextPosition: number

  switch (ev.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      nextPosition = position - 0.05
      break
    case 'ArrowRight':
    case 'ArrowUp':
      nextPosition = position + 0.05
      break
    case 'Home':
      nextPosition = 0
      break
    case 'End':
      nextPosition = 1
      break
    default:
      return
  }

  ev.preventDefault()
  emit('change-linehead', Math.min(1, Math.max(0, nextPosition)))
}

watch(
  () => props.messageSelectionEnabled,
  (enabled) => {
    if (enabled) removeDragListeners()
  },
)

onBeforeUnmount(removeDragListeners)
</script>

<template>
  <div
    ref="progress"
    class="vac-player-bar"
    role="slider"
    aria-label="Audio progress"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="normalizedPercentage"
    :aria-disabled="messageSelectionEnabled"
    :tabindex="messageSelectionEnabled ? -1 : 0"
    @mousedown="onMouseDown"
    @keydown.stop="onKeyDown"
    @mouseover="$emit('hover-audio-progress', true)"
    @mouseout="$emit('hover-audio-progress', false)"
  >
    <div class="vac-player-progress">
      <div class="vac-line-container">
        <div class="vac-line-progress" :style="{ width: `${normalizedPercentage}%` }" />
        <div
          class="vac-line-dot"
          :class="{ 'vac-line-dot__active': isMouseDown }"
          :style="{ left: `${normalizedPercentage}%` }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-player-bar {
  display: flex;
  align-items: center;
  max-width: calc(100% - 18px);
  margin-right: 7px;
  margin-left: 20px;

  .vac-player-progress {
    width: 190px;

    .vac-line-container {
      position: relative;
      height: 4px;
      border-radius: 5px;
      background-color: var(--chat-message-bg-color-audio-line);

      .vac-line-progress {
        position: absolute;
        height: inherit;
        background-color: var(--chat-message-bg-color-audio-progress);
        border-radius: inherit;
      }

      .vac-line-dot {
        position: absolute;
        top: -5px;
        margin-left: -7px;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background-color: var(--chat-message-bg-color-audio-progress-selector);
        transition: transform 0.25s;

        &__active {
          transform: scale(1.2);
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .vac-player-bar {
    margin-right: 5px;

    .vac-player-progress .vac-line-container {
      height: 3px;

      .vac-line-dot {
        height: 12px;
        width: 12px;
        top: -5px;
        margin-left: -5px;
      }
    }
  }
}
</style>
