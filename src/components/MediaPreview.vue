<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

import type { MessageFile } from '../models'
import { isImageFile, isVideoFile } from '../utils/media-types'

export interface MediaPreviewProps {
  /** Image or video to preview. The modal is hidden when `null` / unset. */
  file?: MessageFile | null
}

export interface MediaPreviewEvents {
  /** Fires when the user closes the preview via the close button, backdrop click, or Escape. */
  (e: 'close-media-preview'): void
}

const props = defineProps<MediaPreviewProps>()

const emit = defineEmits<MediaPreviewEvents>()

const modal = useTemplateRef('modal')
let previouslyFocused: HTMLElement | null = null

const isImage = computed(() => isImageFile(props.file))

const isVideo = computed(() => isVideoFile(props.file))

const closeModal = () => {
  emit('close-media-preview')
  previouslyFocused?.focus()
}

const trapFocus = (event: KeyboardEvent) => {
  const element = modal.value
  if (!element) return
  const focusable = Array.from(
    element.querySelectorAll<HTMLElement>('button, video, [href], [tabindex]:not([tabindex="-1"])'),
  ).filter((item) => !item.hasAttribute('disabled'))
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => props.file,
  async (file) => {
    if (!file) return

    previouslyFocused = document.activeElement as HTMLElement | null
    await nextTick()
    modal.value?.focus()
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="file"
    ref="modal"
    tabindex="-1"
    class="vac-media-preview"
    role="dialog"
    aria-modal="true"
    :aria-label="`Preview ${file.name}`"
    @click.self="closeModal"
    @keydown.esc="closeModal"
    @keydown.tab="trapFocus"
  >
    <transition name="vac-bounce-preview" appear>
      <div v-if="isImage" class="vac-media-preview-container">
        <div class="vac-image-preview" :style="{ 'background-image': `url('${file.url}')` }" />
      </div>

      <div v-else-if="isVideo" class="vac-media-preview-container">
        <video controls autoplay>
          <source :src="file.url" />
        </video>
      </div>
    </transition>

    <button
      type="button"
      class="vac-svg-button vac-close-button"
      aria-label="Close media preview"
      @click="closeModal"
    >
      <slot name="preview-close-icon">
        <SvgIcon name="close-outline" param="preview" />
      </slot>
    </button>
  </div>
</template>

<style scoped lang="scss">
.vac-media-preview {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.86);

  .vac-media-preview-container {
    width: min(90vw, 960px);
    max-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vac-image-preview {
    width: 100%;
    min-height: 320px;
    max-height: 85vh;
    border-radius: 12px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  video {
    width: 100%;
    max-height: 85vh;
    border-radius: 12px;
  }

  .vac-close-button {
    position: absolute;
    top: 18px;
    right: 18px;
    padding: 0;
    border: 0;
    background: transparent;
  }
}
</style>
