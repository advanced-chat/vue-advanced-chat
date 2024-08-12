
<template>
  <div
    ref="modal"
    tabindex="0"
    class="vac-media-preview"
    @click.stop="closeModal"
    @keydown.esc="closeModal"
  >
    <div v-if="isImage" class="vac-media-preview-container">
      <div v-if="isSVG" class="vac-svg-preview">
        <div v-if="!isSVGLoading" v-html="fileContent" />
        <loader v-else show="true" type="messages" />
      </div>
      <div v-else class="vac-image-preview" :style="{ 'background-image': `url('${file.url}')` }" />
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

    <div v-else-if="isText" class="vac-media-preview-container">
      <div class="vac-text-preview-container" @click.stop.prevent="null">
        <div v-if="fileContent" class="vac-preview-text">
          <code>
            {{ fileContent }}
          </code>
        </div>
        <loader v-else-if="isFetchingFile" show="true" type="messages" />
        <div v-else class="vac-media-preview-container">
          <div class="vac-preview-failed-container" @click.stop.prevent="null">
            <span>
              {{ translate('Was not possible to load file content at this time, try downloading instead') }}
            </span>
            <div class="vac-preview-download-button" @click.stop.prevent="downloadFile($event, file)">
              <slot :name="'document-icon_' + file.url">
                <svg-icon name="document" />
                <span>{{ translate('Download') }}</span>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="vac-media-preview-container">
      <div class="vac-preview-failed-container" @click.stop.prevent="null">
        <span>
          {{ translate('Can not preview file, try downloading instead') }}
        </span>
        <div class="vac-preview-download-button" @click.stop.prevent="downloadFile($event, file)">
          <slot :name="'document-icon_' + file.url">
            <svg-icon name="document" />
            <span>{{ translate('Download') }}</span>
          </slot>
        </div>
      </div>
    </div>
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

    <div v-if="showArrows" class="vac-carousel-arrows">
      <button class="vac-carousel-arrow" @click.stop.prevent="prevMedia()">
        <i class="bi bi-chevron-left" />
      </button>
      <button class="vac-carousel-arrow" @click.stop.prevent="nextMedia()">
        <i class="bi bi-chevron-right" />
      </button>
    </div>
  </div>
</template>

<script>

import Loader from '../../components/Loader/Loader'
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import { sanitize } from '../../utils/dompurify'
import { isImageFile, isVideoFile, isPdfFile, isTextFile, isSVGFile } from '../../utils/media-file'
import { translate } from '../../utils/i18n/index'

export default {
  name: 'MediaPreview',
  components: {
    Loader,
    SvgIcon
  },

  props: {
    files: { type: Array, required: true },
    index: { type: Number, required: true }
  },

  emits: ['close-media-preview'],

  data() {
    return {
      isLoadingIframe: true,
      file: this.files[this.index],
      showArrows: this.files.length > 1,
      fileIndex: this.index,
      fileContent: null,
      cachedFiles: {},
      isFetchingFile: false,
      isSVGLoading: true
    }
  },

  computed: {
    isImage() {
      return isImageFile(this.file)
    },
    isSVG() {
      return isSVGFile(this.file)
    },
    isVideo() {
      return isVideoFile(this.file)
    },
    isPdf() {
      return isPdfFile(this.file)
    },
    isText() {
      if (!isTextFile(this.file)) {
        return false
      }
      this.loadAndCacheFileContent(this.file)
      return true
    }
  },

  watch: {
    'file.url': function(newVal) {
      if (this.isSVG) {
        this.loadSVG(this.file)
      }
    }
  },

  mounted() {
    this.$refs.modal.focus()
    if (this.isSVG) {
      this.loadSVG(this.file)
    }

    this.getModal().addEventListener('keyup', e => {
      if (!this.showArrows) {
        return
      }

      switch (e.key) {
      case 'ArrowLeft':
        this.prevMedia()
        break
      case 'ArrowRight':
        this.nextMedia()
        break
      default:
        break
      }
    })
  },

  methods: {
    getModal() {
      return this.$refs.modal
    },
    setSVGLoading(state) {
      this.isSVGLoading = state
    },
    prevMedia() {
      this.fileIndex = this.fileIndex - 1 < 0 ? this.files.length - 1 : this.fileIndex - 1
      this.file = this.files[this.fileIndex]
      this.fileContent = null
    },
    nextMedia() {
      this.fileIndex = this.fileIndex + 1 > this.files.length - 1 ? 0 : this.fileIndex + 1
      this.file = this.files[this.fileIndex]
      this.fileContent = null
    },
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
    },
    async loadAndCacheFileContent(file) {
      this.isFetchingFile = true

      const url = file?.downloadUrl ?? file?.previewUrl

      if (this.cachedFiles[url]) {
        this.fileContent = this.cachedFiles[url]
        this.isFetchingFile = false
        return this.fileContent
      }

      const content = await this.getFileContentFromURL(url)
      this.cachedFiles[url] = content
      this.isFetchingFile = false
      return content
    },
    async getFileContentFromURL(url) {
      let content = null

      try {
        await fetch(url)
          .then(async res => {
            content = await res.text()
          })
      } catch (error) {
      }
      this.fileContent = content
      return content
    },
    async loadSVG(file) {
      this.setSVGLoading(true)
      const svg = await this.loadAndCacheFileContent(file)
      if (svg) {
        this.fileContent = sanitize(svg)
      }

      this.setSVGLoading(false)
    }
  }
}
</script>
