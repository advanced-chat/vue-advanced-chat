<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

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

const calculateLineHeadPosition = (ev: MouseEvent, element: HTMLElement) => {
  const progressWidth = element.getBoundingClientRect().width
  const leftPosition = element.getBoundingClientRect().left
  let pos = (ev.clientX - leftPosition) / progressWidth

  pos = pos < 0 ? 0 : pos
  pos = pos > 1 ? 1 : pos

  return pos
}

const onMouseMove = (ev: MouseEvent) => {
  if (props.messageSelectionEnabled) return

  const seekPos = calculateLineHeadPosition(ev, progress.value!)
  emit('change-linehead', seekPos)
}

const onMouseUp = (ev: MouseEvent) => {
  if (props.messageSelectionEnabled) return

  isMouseDown.value = false
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mousemove', onMouseMove)
  const seekPos = calculateLineHeadPosition(ev, progress.value!)
  emit('change-linehead', seekPos)
}

const onMouseDown = (ev: MouseEvent) => {
  if (props.messageSelectionEnabled) return

  isMouseDown.value = true
  const seekPos = calculateLineHeadPosition(ev, progress.value!)
  emit('change-linehead', seekPos)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div
    ref="progress"
    class="vac-player-bar"
    @mousedown="onMouseDown"
    @mouseover="$emit('hover-audio-progress', true)"
    @mouseout="$emit('hover-audio-progress', false)"
  >
    <div class="vac-player-progress">
      <div class="vac-line-container">
        <div class="vac-line-progress" :style="{ width: `${percentage}%` }" />
        <div
          class="vac-line-dot"
          :class="{ 'vac-line-dot__active': isMouseDown }"
          :style="{ left: `${percentage}%` }"
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
