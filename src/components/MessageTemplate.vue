<script setup lang="ts">
import { computed } from 'vue'

import { type Message, type ChatReference, type User, findUserById } from '../models'
import type { Styles } from '../themes'

import { getLocalizationStrings, type Strings } from '../localization'
import { formatText, type TextFormattingOptions } from '../utils/text-formatter'

export interface MessageTemplateProps {
  message?: Message
  chat?: ChatReference
  users?: Array<User>
  formattingOptions?: Partial<TextFormattingOptions>
  styles?: Partial<Styles>
  strings?: Partial<Strings>
}

export interface MessageTemplateEvents {
  /**
   * Emitted when a user tag is clicked
   */
  (event: 'clicked:user-tag', user: User): void
}

const props = withDefaults(defineProps<MessageTemplateProps>(), {
  formattingOptions: () => ({
    markdown: true,
    linkify: true,
    singleLine: false,
    linkOptions: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
  styles: () => ({}),
  strings: () => getLocalizationStrings('auto'),
})

const singleLine = computed(() => {
  return props.formattingOptions?.singleLine || false
})

const formattedMessageParts = computed(() => {
  return [
    formatText(props.message?.content || '', props.formattingOptions || {}, {
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
      emit('clicked:user-tag', user)
    }
  }
}
</script>

<template>
  <div class="vac-format-message-wrapper" :class="{ 'vac-text-ellipsis': singleLine }">
    <template v-for="(part, i) in formattedMessageParts" :key="i">
      <div v-if="part.markdown" class="markdown" @click="onUserTagClick" v-html="part.value" />
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
