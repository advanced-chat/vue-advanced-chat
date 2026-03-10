<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

import type { MessageFile } from '../models'
import { isImageFile, isVideoFile } from '../utils/media-types'

export interface MediaPreviewProps {
  file?: MessageFile | null
}

export interface MediaPreviewEvents {
  (e: 'close-media-preview'): void
}

const props = defineProps<MediaPreviewProps>()

const emit = defineEmits<MediaPreviewEvents>()

const modal = useTemplateRef('modal')

const isImage = computed(() => isImageFile(props.file))

const isVideo = computed(() => isVideoFile(props.file))

const closeModal = () => {
  emit('close-media-preview')
}

watch(
  () => props.file,
  async (file) => {
    if (!file) return

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
    tabindex="0"
    class="vac-media-preview"
    @click.self="closeModal"
    @keydown.esc="closeModal"
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

    <div class="vac-svg-button vac-close-button" @click="closeModal">
      <slot name="preview-close-icon">
        <SvgIcon name="close-outline" param="preview" />
      </slot>
    </div>
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
  }
}
</style>
