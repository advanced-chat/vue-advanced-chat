<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import Loader from '@/components/Loader.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import { isImageFile, isVideoFile } from '../utils/media-types.ts'
import type { Message, MessageFile, UserReference } from '../models'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

export interface MessageFileProps {
  /** File rendered by this row. Image and video MIME types render rich previews. */
  file: MessageFile
  /** Identifies the viewer; used to apply the blur-loading effect only on the sender's side. */
  currentUser: UserReference
  /** Owning message; its `id` namespaces the slot names used to override icons. */
  message: Message
  /** Position of `file` within `message.files`. */
  index: number
  /** When `true`, click events on this file are suppressed in favor of message selection. */
  messageSelectionEnabled: boolean
}

export interface MessageFileEvents {
  /** Fires when the file is clicked; `action` is `'preview'` for the eye icon and `'download'` for the document icon. */
  (e: 'open-file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
}

const props = withDefaults(defineProps<MessageFileProps>(), {
  messageSelectionEnabled: false,
})

const emit = defineEmits<MessageFileEvents>()

const imageResponsive = ref<{ maxHeight: number; loaderTop: number }>({
  maxHeight: 280,
  loaderTop: 130,
})

const imageLoading = ref(false)

const imageHover = ref(false)

const imageRef = useTemplateRef('imageRef')

const isImageLoading = computed(() => {
  return props.file.url.indexOf('blob:http') !== -1 || imageLoading.value
})

const isImage = computed(() => {
  return props.file.previewable !== false && isImageFile(props.file)
})

const isVideo = computed(() => {
  return props.file.previewable !== false && isVideoFile(props.file)
})

const displayProgress = computed(() => {
  if (props.file.progress == null) return null

  if (Number.isNaN(props.file.progress)) return 0

  return Math.min(100, Math.max(0, props.file.progress))
})

const checkImgLoad = () => {
  if (props.file.previewable === false || !isImageFile(props.file)) return

  imageLoading.value = true

  const image = new Image()

  image.src = props.file.url

  const done = () => {
    imageLoading.value = false
  }

  image.addEventListener('load', done)
  image.addEventListener('error', done)
}

const openFile = (event: Event, action: 'preview' | 'download') => {
  if (props.messageSelectionEnabled) return

  event.stopPropagation()
  emit('open-file', { file: props.file, action })
}

watch(
  () => props.file,
  () => {
    checkImgLoad()
  },
  { immediate: true },
)

onMounted(() => {
  if (imageRef.value) {
    const width = imageRef.value.clientWidth || 0
    const height = imageRef.value.clientHeight || 0

    imageResponsive.value = {
      maxHeight: Math.max(120, width - 18),
      loaderTop: Math.max(0, height / 2 - 9),
    }
  }
})
</script>

<template>
  <div class="acc-message-file-container">
    <div
      v-if="isImage"
      ref="imageRef"
      class="acc-message-image-container"
      @mouseover="imageHover = true"
      @mouseleave="imageHover = false"
      @focusin="imageHover = true"
      @focusout="imageHover = false"
    >
      <progress-bar
        v-if="displayProgress !== null"
        :progress="displayProgress"
        :style="{ top: `${imageResponsive.loaderTop}px` }"
      />
      <loader
        v-else
        :show="isImageLoading"
        type="message-file"
        :message-id="message.id"
        :style="{ top: `${imageResponsive.loaderTop}px` }"
      >
      </loader>
      <button
        type="button"
        class="acc-message-image"
        :aria-label="
          messageSelectionEnabled
            ? `Select message containing ${file.name}`
            : `Preview ${file.name}`
        "
        :class="{
          'acc-blur-loading': isImageLoading && message.sender.id === currentUser.id,
        }"
        :style="{
          'background-image': `url('${isImageLoading ? file.previewUrl || file.url : file.url}')`,
          'max-height': `${imageResponsive.maxHeight}px`,
        }"
        @click="openFile($event, 'preview')"
      />
      <transition name="acc-fade-image">
        <div
          v-if="imageHover && !isImageLoading && !messageSelectionEnabled"
          class="acc-image-buttons"
        >
          <button
            type="button"
            class="acc-svg-button acc-button-view"
            :aria-label="`Preview ${file.name}`"
            @click="openFile($event, 'preview')"
          >
            <slot :name="'eye-icon_' + message.id">
              <svg-icon name="eye" />
            </slot>
          </button>
          <button
            type="button"
            class="acc-svg-button acc-button-download"
            :aria-label="`Download ${file.name}`"
            @click="openFile($event, 'download')"
          >
            <slot :name="'document-icon_' + message.id">
              <svg-icon name="document" />
            </slot>
          </button>
        </div>
      </transition>
    </div>

    <div
      v-else-if="isVideo"
      class="acc-video-container"
      role="button"
      tabindex="0"
      :aria-label="
        messageSelectionEnabled ? `Select message containing ${file.name}` : `Preview ${file.name}`
      "
      @click.prevent="openFile($event, 'preview')"
      @keydown.enter.self.prevent="openFile($event, 'preview')"
      @keydown.space.self.prevent="openFile($event, 'preview')"
    >
      <progress-bar v-if="displayProgress !== null" :progress="displayProgress" />
      <video :controls="!messageSelectionEnabled">
        <source :src="file.url" />
      </video>
    </div>
  </div>
</template>

<style scoped lang="scss">
.acc-message-file-container {
  position: relative;
  z-index: 0;

  .acc-message-image-container {
    position: relative;
    cursor: pointer;
    width: 320px;
    max-width: 100%;
  }

  .acc-message-image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 8px;
    height: 200px;
    min-height: 120px;
    width: 100%;
    position: relative;
    display: block;
    padding: 0;
    border: 0;
    cursor: pointer;
  }

  .acc-image-buttons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 55%,
      rgba(0, 0, 0, 0.02) 60%,
      rgba(0, 0, 0, 0.05) 65%,
      rgba(0, 0, 0, 0.1) 70%,
      rgba(0, 0, 0, 0.2) 75%,
      rgba(0, 0, 0, 0.3) 80%,
      rgba(0, 0, 0, 0.5) 85%,
      rgba(0, 0, 0, 0.6) 90%,
      rgba(0, 0, 0, 0.7) 95%,
      rgba(0, 0, 0, 0.8) 100%
    );
    pointer-events: none;

    svg {
      height: 26px;
      width: 26px;
    }

    .acc-button-view,
    .acc-button-download {
      position: absolute;
      bottom: 6px;
      left: 7px;
      padding: 0;
      border: 0;
      background: transparent;
      pointer-events: auto;
    }

    :first-child {
      left: 40px;
    }

    .acc-button-view {
      max-width: 18px;
      bottom: 8px;
    }
  }

  .acc-video-container {
    width: 350px;
    max-width: 100%;
    margin: 4px auto 5px;
    cursor: pointer;

    video {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
</style>
