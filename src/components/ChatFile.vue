<script setup lang="ts">
import { computed } from 'vue'

import Loader from '@/components/Loader.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { MessageFile } from '../models'
import { isImageFile, isVideoFile } from '../utils/media-types'

export interface ChatFileItem extends MessageFile {
  loading?: boolean
  localUrl?: string
}

export interface ChatFileProps {
  file: ChatFileItem
  index: number
}

export interface ChatFileEvents {
  (e: 'remove-file', index: number): void
}

const props = defineProps<ChatFileProps>()

const emit = defineEmits<ChatFileEvents>()

const previewUrl = computed(() => props.file.localUrl || props.file.previewUrl || props.file.url)

const isImage = computed(() => isImageFile(props.file))

const isVideo = computed(() => isVideoFile(props.file))
</script>

<template>
  <div class="vac-room-file-container">
    <Loader :show="!!file.loading" />

    <div class="vac-svg-button vac-icon-remove" @click="emit('remove-file', index)">
      <slot name="image-close-icon">
        <SvgIcon name="close" param="image" />
      </slot>
    </div>

    <div
      v-if="isImage"
      class="vac-message-image"
      :class="{ 'vac-blur-loading': file.loading }"
      :style="{ 'background-image': `url('${previewUrl}')` }"
    />

    <video v-else-if="isVideo" controls :class="{ 'vac-blur-loading': file.loading }">
      <source :src="previewUrl" />
    </video>

    <div v-else class="vac-file-container" :class="{ 'vac-blur-loading': file.loading }">
      <div>
        <slot name="file-icon">
          <SvgIcon name="file" />
        </slot>
      </div>
      <div class="vac-text-ellipsis">
        {{ file.name }}
      </div>
      <div v-if="file.extension" class="vac-text-ellipsis vac-text-extension">
        {{ file.extension }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-room-file-container {
  position: relative;
  width: 100px;

  .vac-icon-remove {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
  }

  .vac-message-image,
  video,
  .vac-file-container {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  .vac-message-image {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  video {
    object-fit: cover;
  }
}
</style>
