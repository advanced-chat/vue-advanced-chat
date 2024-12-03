<template>
  <div class="vac-room-file-container" :title="fileNameAndExtension">
    <loader :show="file.loading" type="room-file">
      <template v-for="(idx, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </loader>

    <div
      class="vac-svg-button vac-icon-remove"
      @click="$emit('remove-file', index)"
    >
      <slot name="image-close-icon">
        <svg-icon name="close" param="image" />
      </slot>
    </div>

    <div
      v-if="isFileFromOptiwork"
      class="vac-optiwork-file"
      :title="file.name"
    >
      <div>
        <i :class="file.icon" class="vac-optiwork-file-icon" />
      </div>

      <div class="vac-optiwork-file-name vac-text-ellipsis">
        {{ file.name }}
      </div>
    </div>

    <div
      v-else-if="isImage"
      class="vac-message-image"
      :class="{ 'vac-blur-loading': file.loading }"
      :style="{
        'background-image': `url('${file.localUrl || file.url}')`
      }"
    />

    <video
      v-else-if="isVideo"
      controls
      :class="{ 'vac-blur-loading': file.loading }"
    >
      <source :src="file.localUrl || file.url" />
    </video>

    <div
      v-else
      class="vac-file-container"
      :class="{ 'vac-blur-loading': file.loading }"
    >
      <div class="vac-room-file-icon">
        <i :class="fileIconClass" />
      </div>
      <div class="vac-text-ellipsis">
        {{ file.name }}
      </div>
      <div v-if="file.extension" class="vac-text-ellipsis vac-text-extension">
        {{ fileSizeAndExtension }}
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../../../../../components/Loader/Loader'
import SvgIcon from '../../../../../components/SvgIcon/SvgIcon'

import { isImageFile, isVideoFile } from '../../../../../utils/media-file'
import { humanFileSize } from '../../../../../utils/adhoc'

const SOURCE_OPTIWORK_DRIVE = 'SOURCE_OPTIWORK_DRIVE'

export default {
  name: 'RoomFiles',
  components: {
    Loader,
    SvgIcon
  },

  props: {
    file: { type: Object, required: true },
    index: { type: Number, required: true }
  },

  emits: ['remove-file'],

  computed: {
    isImage() {
      return isImageFile(this.file)
    },
    isVideo() {
      return isVideoFile(this.file)
    },
    isFileFromOptiwork() {
      return this.file.source === SOURCE_OPTIWORK_DRIVE
    },
    fileIconClass() {
      return Optidata.MimeTypeIcons.getIconByMimeType(this.file.type)
    },
    fileNameAndExtension() {
      if (this.file.extension) {
        return `${this.file.name}.${this.file.extension}`
      }
      return this.file.name
    },
    fileSizeAndExtension() {
      return `${humanFileSize(this.file.size, true)} · ${this.file.extension}`
    }
  }
}
</script>
