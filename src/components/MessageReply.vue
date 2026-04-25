<script setup lang="ts">
import type { Message, User } from '../models'
import { computed } from 'vue'
import { isAudioFile, isImageFile, isVideoFile } from '../utils/media-types.ts'
import MessageTemplate from '@/components/MessageTemplate.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import type { TextFormattingOptions } from '../utils/text-formatter'

export interface MessageReplyProps {
  message: Message
  users: Array<User>
  textFormatting?: Partial<TextFormattingOptions>
}

const props = withDefaults(defineProps<MessageReplyProps>(), {
  textFormatting: () => ({}),
})

const replyUsername = computed(() => props.message.reply?.sender.name || '')

const firstFile = computed(() => {
  return props.message.reply?.files?.length ? props.message.reply.files[0] : null
})

const isAudio = computed(() => isAudioFile(firstFile.value))

const isImage = computed(() => isImageFile(firstFile.value))

const isVideo = computed(() => isVideoFile(firstFile.value))

const isOtherFile = computed(() => {
  return props.message.reply?.files?.length && !isAudio.value && !isVideo.value && !isImage.value
})
</script>

<template>
  <div class="vac-reply-message">
    <div class="vac-reply-username">
      {{ replyUsername }}
    </div>

    <div v-if="isImage" class="vac-image-reply-container">
      <div
        class="vac-message-image vac-message-image-reply"
        :style="{
          'background-image': `url('${firstFile?.url}')`,
        }"
      />
    </div>

    <div v-else-if="isVideo" class="vac-video-reply-container">
      <video controls>
        <source :src="firstFile?.url" />
      </video>
    </div>

    <AudioPlayer v-else-if="isAudio" :src="firstFile?.url" :message-selection-enabled="false">
    </AudioPlayer>

    <div v-else-if="isOtherFile" class="vac-file-container">
      <div>
        <slot name="file-icon">
          <SvgIcon name="file" />
        </slot>
      </div>
      <div class="vac-text-ellipsis">
        {{ firstFile?.name }}
      </div>
      <div v-if="firstFile?.extension" class="vac-text-ellipsis vac-text-extension">
        {{ firstFile.extension }}
      </div>
    </div>

    <div class="vac-reply-content">
      <MessageTemplate
        :message="message?.reply"
        :users="users"
        :formatting-options="{ ...props.textFormatting, singleLine: true }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-reply-message {
  background: var(--chat-message-bg-color-reply);
  border-radius: 4px;
  margin: -1px -5px 8px;
  padding: 8px 10px;

  .vac-reply-username {
    color: var(--chat-message-color-reply-username);
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 2px;
  }

  .vac-image-reply-container {
    width: 70px;

    .vac-message-image-reply {
      height: 70px;
      width: 70px;
      margin: 4px auto 3px;
    }
  }

  .vac-video-reply-container {
    width: 200px;
    max-width: 100%;

    video {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }

  .vac-reply-content {
    font-size: 12px;
    color: var(--chat-message-color-reply-content);
  }

  .vac-file-container {
    height: 60px;
    width: 60px;
  }
}
</style>
