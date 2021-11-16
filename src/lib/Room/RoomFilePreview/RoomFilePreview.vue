<template>
  <div class="vac-room-file-preview">
    <div
      v-if="isImage"
      class="vac-room-file-preview-container"
      @click.stop="$emit('close-file-modal')"
      @keypress.esc="$emit('close-file-modal')"
    >
      <loader
        :show="isImageLoading"
      />
      <div
        class="vac-image-preview"
        :style="{
					'background-image': `url('${
						isImageLoading ? file.preview || file.url : file.url
					}')`
				}"
        @keypress.esc="$emit('close-file-modal')"
      />
    </div>

    <div
      v-else-if="isVideo"
      class="vac-video-preview"
      @keypress.esc="$emit('close-file-modal')"
    >
      <video width="100%" height="100%" controls>
        <source :src="file.url" />
      </video>
    </div>
    <button @click="$emit('close-file-modal')">
      Close
    </button>
  </div>
</template>
<script>

import Loader from '../../../components/Loader/Loader'
// import SvgIcon from '../../../components/SvgIcon/SvgIcon'

const { isImageFile, isVideoFile } = require('../../../utils/media-file')

export default {
  name: 'RoomFilePreview',
  components: {
    // SvgIcon,
    Loader
  },

  props: {
    file: { type: Object, required: true }
  },

  emits: ['open-file'],

  data() {
    return {
      imageLoading: false
    }
  },
  computed: {
    isImageLoading() {
      return this.file.url.indexOf('blob:http') !== -1 || this.imageLoading
    },
    isImage() {
      return isImageFile(this.file)
    },
    isVideo() {
      if (this.file.url) return isVideoFile(this.file)
      else return false
    }
  },

  watch: {
    file: {
      immediate: true,
      deep: true,
      handler() {
        this.checkImgLoad()
      }
    }
  },
  methods: {
    checkImgLoad() {
      if (!isImageFile(this.file)) return
      this.imageLoading = true
      const image = new Image()
      image.src = this.file.url
      image.addEventListener('load', () => (this.imageLoading = false))
    }
  }
}
</script>
