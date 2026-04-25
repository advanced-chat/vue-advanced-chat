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
  currentUser: UserReference
  message: Message
  users: Array<User>
  messageSelectionEnabled: boolean
  textFormatting?: Partial<TextFormattingOptions>
}

export interface MessageFilesEvents {
  (e: 'open-file', payload: { file: MessageFileModel; action: 'preview' | 'download' }): void
  (e: 'click-user-tag', user: User): void
}

const props = withDefaults(defineProps<MessageFilesProps>(), {
  textFormatting: () => ({}),
})

const emit = defineEmits<MessageFilesEvents>()

const visualMediaFiles = computed(
  () => props.message.files?.filter((file) => isVisualMediaFile(file)) || [],
)

const otherFiles = computed(
  () => props.message.files?.filter((file) => !isVisualMediaFile(file)) || [],
)

const openFile = (event: Event, file: MessageFileModel, action: 'preview' | 'download') => {
  event.stopPropagation()

  emit('open-file', { file, action })
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
        v-if="file.progress && file.progress >= 0"
        :progress="file.progress"
        :style="{ top: '44px' }"
      />
      <div
        class="vac-file-container"
        :class="{ 'vac-file-container-progress': file.progress && file.progress >= 0 }"
        @click="openFile($event, file, 'download')"
      >
        <div class="vac-svg-button">
          <slot name="document-icon">
            <SvgIcon name="document" />
          </slot>
        </div>
        <div class="vac-text-ellipsis">
          {{ file.name }}
        </div>
        <div v-if="file.extension" class="vac-text-ellipsis vac-text-extension">
          {{ file.extension }}
        </div>
      </div>
    </div>

    <MessageTemplate
      :message="message"
      :users="users"
      :formatting-options="{ ...textFormatting, singleLine: false }"
      @click-user-tag="emit('click-user-tag', $event)"
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
