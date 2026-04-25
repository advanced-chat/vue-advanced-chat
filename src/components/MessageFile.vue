<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import Loader from '@/components/Loader.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import { isImageFile, isVideoFile } from '../utils/media-types.ts'
import type { Message, MessageFile, UserReference } from '../models'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

export interface MessageFileProps {
  file: MessageFile
  currentUser: UserReference
  message: Message
  index: number
  messageSelectionEnabled: boolean
}

export interface MessageFileEvents {
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
  return isImageFile(props.file)
})

const isVideo = computed(() => {
  return isVideoFile(props.file)
})

const checkImgLoad = () => {
  if (!isImageFile(props.file)) return

  imageLoading.value = true

  const image = new Image()

  image.src = props.file.url

  image.addEventListener('load', () => (imageLoading.value = false))
}

const openFile = (event: MouseEvent, action: 'preview' | 'download') => {
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
  <div class="vac-message-file-container">
    <div
      v-if="isImage"
      ref="imageRef"
      class="vac-message-image-container"
      @mouseover="imageHover = true"
      @mouseleave="imageHover = false"
      @click="openFile($event, 'preview')"
    >
      <progress-bar
        v-if="file.progress && file.progress >= 0"
        :progress="file.progress"
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
      <div
        class="vac-message-image"
        :class="{
          'vac-blur-loading': isImageLoading && message.sender.id === currentUser.id,
        }"
        :style="{
          'background-image': `url('${isImageLoading ? file.previewUrl || file.url : file.url}')`,
          'max-height': `${imageResponsive.maxHeight}px`,
        }"
      >
        <transition name="vac-fade-image">
          <div v-if="imageHover && !isImageLoading" class="vac-image-buttons">
            <div class="vac-svg-button vac-button-view" @click="openFile($event, 'preview')">
              <slot :name="'eye-icon_' + message.id">
                <svg-icon name="eye" />
              </slot>
            </div>
            <div class="vac-svg-button vac-button-download" @click="openFile($event, 'download')">
              <slot :name="'document-icon_' + message.id">
                <svg-icon name="document" />
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div
      v-else-if="isVideo"
      class="vac-video-container"
      @click.prevent="openFile($event, 'preview')"
    >
      <progress-bar v-if="file.progress && file.progress >= 0" :progress="file.progress" />
      <video controls>
        <source :src="file.url" />
      </video>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-message-file-container {
  position: relative;
  z-index: 0;

  .vac-message-image-container {
    cursor: pointer;
    width: 320px;
    max-width: 100%;
  }

  .vac-message-image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 8px;
    height: 200px;
    min-height: 120px;
    width: 100%;
    position: relative;
  }

  .vac-image-buttons {
    position: absolute;
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

    svg {
      height: 26px;
      width: 26px;
    }

    .vac-button-view,
    .vac-button-download {
      position: absolute;
      bottom: 6px;
      left: 7px;
    }

    :first-child {
      left: 40px;
    }

    .vac-button-view {
      max-width: 18px;
      bottom: 8px;
    }
  }

  .vac-video-container {
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
