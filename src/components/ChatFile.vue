<script setup lang="ts">
import { computed } from 'vue'

import Loader from '@/components/Loader.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { MessageFile } from '../models'
import { isImageFile, isVideoFile } from '../utils/media-types'

export interface ChatFileItem extends MessageFile {
  loading?: boolean
  /**
   * Object URL used for a local preview. `ChatFooter` owns and revokes it
   * while pending; ownership transfers to the send/edit event listener.
   */
  localUrl?: string
}

export interface ChatFileProps {
  /** File to render in the composer. Renders an image preview, video player, or generic file tile based on MIME type. */
  file: ChatFileItem
  /** Position of this file within the composer's pending list; echoed back in `remove-file`. */
  index: number
}

export interface ChatFileEvents {
  /** Fires when the user clicks the remove button on this file tile. */
  (e: 'remove-file', index: number): void
}

const props = defineProps<ChatFileProps>()

const emit = defineEmits<ChatFileEvents>()

const previewUrl = computed(() => props.file.localUrl || props.file.previewUrl || props.file.url)

const isImage = computed(() => isImageFile(props.file))

const isVideo = computed(() => isVideoFile(props.file))
</script>

<template>
  <div class="acc-room-file-container">
    <Loader :show="!!file.loading" />

    <button
      type="button"
      class="acc-svg-button acc-icon-remove"
      :aria-label="`Remove ${file.name}`"
      @click="emit('remove-file', index)"
    >
      <slot name="image-close-icon">
        <SvgIcon name="close" param="image" />
      </slot>
    </button>

    <div
      v-if="isImage"
      class="acc-message-image"
      :class="{ 'acc-blur-loading': file.loading }"
      :style="{ 'background-image': `url('${previewUrl}')` }"
    />

    <video v-else-if="isVideo" controls :class="{ 'acc-blur-loading': file.loading }">
      <source :src="previewUrl" />
    </video>

    <div v-else class="acc-file-container" :class="{ 'acc-blur-loading': file.loading }">
      <div>
        <slot name="file-icon">
          <SvgIcon name="file" />
        </slot>
      </div>
      <div class="acc-text-ellipsis">
        {{ file.name }}
      </div>
      <div v-if="file.extension" class="acc-text-ellipsis acc-text-extension">
        {{ file.extension }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.acc-room-file-container {
  position: relative;
  width: 100px;

  .acc-icon-remove {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    padding: 0;
    border: 0;
    background: transparent;
  }

  .acc-message-image,
  video,
  .acc-file-container {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  .acc-message-image {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  video {
    object-fit: cover;
  }
}
</style>
