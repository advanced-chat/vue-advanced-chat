<script setup lang="ts">
import { computed } from 'vue'

import { type Message, type ChatReference, type User, findUserById } from '../models'

import { formatText, type TextFormattingOptions } from '../utils/text-formatter'

export interface MessageTemplateProps {
  message?: Message
  chat?: ChatReference
  users?: Array<User>
  formattingOptions?: Partial<TextFormattingOptions>
}

export interface MessageTemplateEvents {
  /**
   * Emitted when a user tag is clicked
   */
  (event: 'click-user-tag', user: User): void
}

const props = defineProps<MessageTemplateProps>()

const options = computed<TextFormattingOptions>(() => ({
  markdown: true,
  linkify: true,
  singleLine: false,
  linkOptions: {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  ...(props.formattingOptions || {}),
}))

const singleLine = computed(() => options.value.singleLine === true)

const formattedMessageParts = computed(() => {
  return [
    formatText(props.message?.content || '', options.value, {
      users: props.users,
    }),
  ]
})

const emit = defineEmits<MessageTemplateEvents>()

const onUserTagClick = (event: Event) => {
  const target = event.target as HTMLElement

  const userId = target.getAttribute('data-user-id')

  if (!singleLine.value && userId) {
    const user = findUserById(props.users || [], userId)

    if (user) {
      emit('click-user-tag', user)
    }
  }
}
</script>

<template>
  <div class="vac-format-message-wrapper" :class="{ 'vac-text-ellipsis': singleLine }">
    <template v-for="(part, i) in formattedMessageParts" :key="i">
      <div
        v-if="part.markdown && !part.singleLine"
        :key="`md-${i}`"
        class="markdown"
        @click="onUserTagClick"
        v-html="part.value"
      />
      <span v-else :key="`txt-${i}`" class="vac-format-text">{{ part.value }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.vac-format-message-wrapper {
  .vac-format-container {
    display: inline;
  }

  .vac-icon-deleted {
    height: 14px;
    width: 14px;
    vertical-align: middle;
    margin: -2px 2px 0 0;
    fill: var(--chat-message-color-deleted);

    &.vac-icon-deleted-room {
      margin: -3px 1px 0 0;
      fill: var(--chat-room-color-message);
    }
  }

  .vac-image-link-container {
    background-color: var(--chat-message-bg-color-media);
    padding: 8px;
    margin: 2px auto;
    border-radius: 4px;
  }

  .vac-image-link {
    position: relative;
    background-color: var(--chat-message-bg-color-image) !important;
    background-size: contain;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    height: 150px;
    width: 150px;
    max-width: 100%;
    border-radius: 4px;
    margin: 0 auto;
  }

  .vac-image-link-message {
    max-width: 166px;
    font-size: 12px;
  }
}
</style>
