
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

      <div v-else-if="isPdf" class="vac-media-preview-container">
				<div class="vac-iframe-preview-container">
          <iframe
            :src="file.url"
            title="PDF Viewer"
            class="vac-iframe-preview-pdf"
            @load="onIframeFinishedLoading"
          />
					<loader :show="isLoadingIframe" type="messages" />
				</div>
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

import Loader from '../../components/Loader/Loader'
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import { isImageFile, isVideoFile, isPdfFile } from '../../utils/media-file'
import { translate } from '../../utils/i18n/index'

export default {
  name: 'MediaPreview',
  components: {
    Loader,
    SvgIcon
  },

  props: {
    file: { type: Object, required: true }
  },

  emits: ['close-media-preview'],

  data() {
    return {
      isLoadingIframe: true
    }
  },

  computed: {
    isImage() {
      return isImageFile(this.file)
    },
    isVideo() {
      return isVideoFile(this.file)
    },
    isPdf() {
      return isPdfFile(this.file)
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
    },
    onIframeFinishedLoading() {
      this.isLoadingIframe = false
    }
  }
}
</script>
