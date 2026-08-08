<script setup lang="ts">
import type { Message, User } from '../models'
import { computed } from 'vue'
import { isAudioFile, isImageFile, isVideoFile } from '../utils/media-types.ts'
import MessageTemplate from '@/components/MessageTemplate.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import type { TextFormattingOptions } from '../utils/text-formatter'

export interface MessageReplyProps {
  /** Outer message; its `reply` field provides the quoted preview body, sender, and first attachment. */
  message: Message
  /** Chat members; used to resolve `@user` tags in the quoted body. */
  users: Array<User>
  /** Markdown / linkify configuration applied to the quoted body. `singleLine` is forced to `true`. */
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
  <div class="acc-reply-message">
    <div class="acc-reply-username">
      {{ replyUsername }}
    </div>

    <div v-if="isImage" class="acc-image-reply-container">
      <div
        class="acc-message-image acc-message-image-reply"
        :style="{
          'background-image': `url('${firstFile?.url}')`,
        }"
      />
    </div>

    <div v-else-if="isVideo" class="acc-video-reply-container">
      <video controls>
        <source :src="firstFile?.url" />
      </video>
    </div>

    <AudioPlayer v-else-if="isAudio" :src="firstFile?.url" :message-selection-enabled="false">
    </AudioPlayer>

    <div v-else-if="isOtherFile" class="acc-file-container">
      <div>
        <slot name="file-icon">
          <SvgIcon name="file" />
        </slot>
      </div>
      <div class="acc-text-ellipsis">
        {{ firstFile?.name }}
      </div>
      <div v-if="firstFile?.extension" class="acc-text-ellipsis acc-text-extension">
        {{ firstFile.extension }}
      </div>
    </div>

    <div class="acc-reply-content">
      <MessageTemplate
        :message="message?.reply"
        :users="users"
        :formatting-options="{ ...props.textFormatting, singleLine: true }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.acc-reply-message {
  background: var(--chat-message-bg-color-reply);
  border-left: 3px solid var(--chat-border-color-input-selected);
  border-radius: 8px;
  margin: -1px -5px 8px;
  padding: 8px 10px;

  .acc-reply-username {
    color: var(--chat-message-color-reply-username);
    font-size: 11px;
    font-weight: 700;
    line-height: 15px;
    margin-bottom: 2px;
  }

  .acc-image-reply-container {
    width: 70px;

    .acc-message-image-reply {
      height: 70px;
      width: 70px;
      margin: 4px auto 3px;
    }
  }

  .acc-video-reply-container {
    width: 200px;
    max-width: 100%;

    video {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }

  .acc-reply-content {
    font-size: 12px;
    color: var(--chat-message-color-reply-content);
  }

  .acc-file-container {
    height: 60px;
    width: 60px;
  }
}
</style>
