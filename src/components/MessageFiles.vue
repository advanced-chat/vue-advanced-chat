<script setup lang="ts">
import { computed } from 'vue'

import type { Message, MessageFile as MessageFileModel, User, UserReference } from '../models'
import { isVisualMediaFile } from '../utils/media-types.ts'
import MessageFile from '@/components/MessageFile.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import MessageTemplate from '@/components/MessageTemplate.vue'
import type { TextFormattingOptions } from '../utils/text-formatter'

export interface MessageFilesProps {
  /** Identifies the viewer; forwarded to each `MessageFile`. */
  currentUser: UserReference
  /** Owning message; visual media files are rendered first, then other files, then the message body. */
  message: Message
  /** Chat members; used to resolve `@user` tags in the message body. */
  users: Array<User>
  /** When `true`, file click events are suppressed in favor of message selection. */
  messageSelectionEnabled: boolean
  /** Markdown / linkify configuration applied to the message body that follows the files. */
  textFormatting?: Partial<TextFormattingOptions>
}

export interface MessageFilesEvents {
  /** Fires when any file is clicked; `action` is `'preview'` for media and `'download'` for other files. */
  (e: 'open-file', payload: { file: MessageFileModel; action: 'preview' | 'download' }): void

  /** Fires when an `@user` tag in the message body is clicked. */
  (e: 'click-user-tag', user: User): void
}

const props = withDefaults(defineProps<MessageFilesProps>(), {
  textFormatting: () => ({}),
})

const emit = defineEmits<MessageFilesEvents>()

const visualMediaFiles = computed(
  () =>
    props.message.files?.filter((file) => file.previewable !== false && isVisualMediaFile(file)) ||
    [],
)

const otherFiles = computed(
  () =>
    props.message.files?.filter((file) => file.previewable === false || !isVisualMediaFile(file)) ||
    [],
)

const clampProgress = (progress: number) => {
  if (Number.isNaN(progress)) return 0

  return Math.min(100, Math.max(0, progress))
}

const openFile = (event: Event, file: MessageFileModel, action: 'preview' | 'download') => {
  if (props.messageSelectionEnabled) return

  event.stopPropagation()

  emit('open-file', { file, action })
}

const clickUserTag = (user: User) => {
  if (!props.messageSelectionEnabled) emit('click-user-tag', user)
}
</script>

<template>
  <div class="vac-message-files-container">
    <div v-for="(file, i) in visualMediaFiles" :key="i + 'iv'">
      <MessageFile
        :file="file"
        :current-user="currentUser"
        :message="message"
        :index="i"
        :message-selection-enabled="messageSelectionEnabled"
        @open-file="emit('open-file', $event)"
      >
      </MessageFile>
    </div>

    <div v-for="(file, i) in otherFiles" :key="i + 'a'" class="vac-file-wrapper">
      <ProgressBar
        v-if="file.progress != null"
        :progress="clampProgress(file.progress)"
        :style="{ top: '44px' }"
      />
      <button
        type="button"
        class="vac-file-container"
        :class="{ 'vac-file-container-progress': file.progress != null }"
        :aria-label="
          messageSelectionEnabled
            ? `Select message containing ${file.name}`
            : `Download ${file.name}`
        "
        @click="openFile($event, file, 'download')"
      >
        <span class="vac-svg-button">
          <slot name="document-icon">
            <SvgIcon name="document" />
          </slot>
        </span>
        <span class="vac-text-ellipsis">
          {{ file.name }}
        </span>
        <span v-if="file.extension" class="vac-text-ellipsis vac-text-extension">
          {{ file.extension }}
        </span>
      </button>
    </div>

    <MessageTemplate
      :message="message"
      :users="users"
      :formatting-options="{ ...textFormatting, singleLine: false }"
      @click-user-tag="clickUserTag"
    />
  </div>
</template>

<style scoped lang="scss">
.vac-message-files-container {
  .vac-file-wrapper {
    position: relative;
    width: fit-content;

    .vac-file-container {
      height: 60px;
      width: 60px;
      margin: 3px 0 5px;
      cursor: pointer;
      transition: all 0.6s;
      color: inherit;
      padding: 0;
      border: 0;
      background: transparent;
      font: inherit;

      &:hover {
        opacity: 0.85;
      }

      svg {
        height: 30px;
        width: 30px;
      }

      &.vac-file-container-progress {
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;

        :deep(.vac-text-extension) {
          color: #fff;
        }
      }
    }
  }
}
</style>
