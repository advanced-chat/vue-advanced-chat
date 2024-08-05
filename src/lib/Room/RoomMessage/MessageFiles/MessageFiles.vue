<template>
  <div class="vac-message-files-container">
    <div v-for="(file, i) in allFiles" :key="i + 'iv'">
      <message-file
        :file="file"
        :current-user-id="currentUserId"
        :message="message"
        :index="i"
        :message-selection-enabled="messageSelectionEnabled"
        @open-file="$emit('open-file', { index: i, files: allFiles, action: $event?.action ?? 'preview' })"
      >
        <template v-for="(idx, name) in $slots" #[name]>
          <slot :name="name" />
        </template>
      </message-file>
    </div>

    <format-message
      :message-id="message._id"
      :content="message.content"
      :users="roomUsers"
      :text-formatting="textFormatting"
      :link-options="linkOptions"
      @open-user-tag="$emit('open-user-tag', $event)"
    />
  </div>
</template>

<script>
import FormatMessage from '../../../../components/FormatMessage/FormatMessage'

import MessageFile from './MessageFile/MessageFile'

import { isImageVideoFile } from '../../../../utils/media-file'

export default {
  name: 'MessageFiles',
  components: { FormatMessage, MessageFile },

  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    roomUsers: { type: Array, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    messageSelectionEnabled: { type: Boolean, required: true }
  },

  emits: ['open-file', 'open-user-tag'],

  computed: {
    imageVideoFiles() {
      return this.message.files.filter(file => isImageVideoFile(file))
    },
    otherFiles() {
      return this.message.files.filter(file => !isImageVideoFile(file))
    },
    allFiles() {
      return [ ...this.imageVideoFiles, ...this.otherFiles ]
    }
  }
}
</script>
