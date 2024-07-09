
<template>
  <div
    ref="modal"
    tabindex="0"
    class="vac-media-preview"
    @click.stop="closeModal"
    @keydown.esc="closeModal"
  >
    <transition name="vac-bounce-preview" appear>
      <div v-if="isImage" class="vac-media-preview-container">
        <div
          class="vac-image-preview"
          :style="{
            'background-image': `url('${file.url}')`
          }"
        />
      </div>

      <div v-else-if="isVideo" class="vac-media-preview-container">
        <video controls autoplay>
          <source :src="file.url" />
        </video>
      </div>
    </transition>

    <div class="vac-preview-download-button" @click.stop.prevent="downloadFile($event, file)">
      <slot :name="'document-icon_' + file.url">
        <svg-icon name="document" />
        <span>{{ translate('Download') }}</span>
      </slot>
    </div>

    <div class="vac-svg-button">
      <slot name="preview-close-icon">
        <svg-icon name="close-outline" param="preview" />
      </slot>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import { translate } from '../../utils/i18n/index'

import { isImageFile, isVideoFile } from '../../utils/media-file'

export default {
  name: 'MediaPreview',
  components: {
    SvgIcon
  },

  props: {
    file: { type: Object, required: true }
  },

  emits: ['close-media-preview'],

  computed: {
    isImage() {
      return isImageFile(this.file)
    },
    isVideo() {
      return isVideoFile(this.file)
    }
  },

  mounted() {
    this.$refs.modal.focus()
  },

  methods: {
    translate(str) {
      return translate(str)
    },
    closeModal() {
      this.$emit('close-media-preview')
    },
    downloadFile(event, file) {
      event.preventDefault()
      event.stopPropagation()
      window.open(file.downloadUrl, '_self')
    }
  }
}
</script>
