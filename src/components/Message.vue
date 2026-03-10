<script setup lang="ts">
import { computed } from 'vue'

import MessageActions from '@/components/MessageActions.vue'
import MessageFiles from '@/components/MessageFiles.vue'
import MessageReactions from '@/components/MessageReactions.vue'
import MessageReply from '@/components/MessageReply.vue'
import MessageTemplate from '@/components/MessageTemplate.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { Action, Message, MessageFile, User, UserReference } from '../models'
import { isAudioFile } from '../utils/media-types'

export interface MessageProps {
  user: UserReference
  message: Message
  users?: User[]
  actions?: Action[]
  showReactionEmojis?: boolean
  messageSelectionEnabled?: boolean
  selected?: boolean
}

export interface MessageEvents {
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
  (e: 'opened:file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  (e: 'clicked:user-tag', user: User): void
  (e: 'select-message', message: Message): void
  (e: 'open-failed-message', payload: { message: Message }): void
}

const props = withDefaults(defineProps<MessageProps>(), {
  users: () => [],
  actions: () => [],
  showReactionEmojis: true,
  messageSelectionEnabled: false,
  selected: false,
})

const emit = defineEmits<MessageEvents>()

const isOwnMessage = computed(() => props.message.sender.id.toString() === props.user.id.toString())

const timestamp = computed(() => {
  const date = new Date(props.message.createdAt)

  if (Number.isNaN(date.getTime())) return props.message.createdAt

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
})

const firstFile = computed(() => props.message.files?.[0] || null)

const isAudioMessage = computed(
  () => !!firstFile.value && props.message.files?.length === 1 && isAudioFile(firstFile.value),
)
</script>

<template>
  <div
    class="vac-message-row"
    :class="{
      'vac-message-row-me': isOwnMessage,
      'vac-message-row-selected': selected,
      'vac-message-row-selectable': messageSelectionEnabled,
    }"
    @click="messageSelectionEnabled ? emit('select-message', message) : undefined"
  >
    <div class="vac-message-card" :class="{ 'vac-message-current': isOwnMessage }">
      <div v-if="!isOwnMessage" class="vac-message-author">
        {{ message.sender.name }}
      </div>

      <MessageReply
        v-if="message.reply && !message.deleted"
        :message="message"
        :users="users"
        class="vac-reply-block"
      />

      <div v-if="message.deleted" class="vac-message-deleted">
        <slot :name="'deleted-icon_' + message.id">
          <SvgIcon name="deleted" />
        </slot>
        <span>Message deleted</span>
      </div>

      <MessageTemplate
        v-else-if="!message.files?.length"
        :message="message"
        :users="users"
        @clicked:user-tag="emit('clicked:user-tag', $event)"
      />

      <MessageFiles
        v-else-if="!isAudioMessage"
        :user="user"
        :message="message"
        :users="users"
        :message-selection-enabled="messageSelectionEnabled"
        @opened:file="emit('opened:file', $event)"
        @clicked:user-tag="emit('clicked:user-tag', $event)"
      />

      <div v-else class="vac-audio-summary">
        <slot :name="'microphone-icon_' + message.id">
          <SvgIcon name="microphone" />
        </slot>
        <span>{{ firstFile?.name }}</span>
      </div>

      <div class="vac-message-meta">
        <span>{{ timestamp }}</span>
        <span v-if="isOwnMessage && !message.deleted">
          <slot :name="'checkmark-icon_' + message.id">
            <SvgIcon
              :name="message.read || message.delivered ? 'double-checkmark' : 'checkmark'"
              :param="message.read ? 'seen' : ''"
            />
          </slot>
        </span>
      </div>

      <MessageActions
        :user="user"
        :message="message"
        :actions="actions"
        :show-reaction-emojis="showReactionEmojis"
        @message-action-handler="emit('message-action-handler', $event)"
        @send-message-reaction="emit('send-message-reaction', $event)"
      />
    </div>

    <MessageReactions
      v-if="message.reactions"
      :user="user"
      :message="message"
      @send-message-reaction="emit('send-message-reaction', { emoji: $event.emoji, message })"
    />

    <button
      v-if="message.failure && isOwnMessage"
      class="vac-failure-container"
      @click.stop="emit('open-failed-message', { message })"
    >
      !
    </button>
  </div>
</template>

<style scoped lang="scss">
.vac-message-row {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 8px 0;

  &.vac-message-row-me {
    align-items: flex-end;
  }

  &.vac-message-row-selected .vac-message-card {
    background: var(--chat-message-bg-color-selected);
  }

  &.vac-message-row-selectable {
    cursor: pointer;
  }
}

.vac-message-card {
  position: relative;
  max-width: min(100%, 560px);
  padding: 12px 14px;
  border-radius: 18px;
  background: var(--chat-message-bg-color);
  color: var(--chat-message-color);

  &.vac-message-current {
    background: var(--chat-message-bg-color-me);
  }
}

.vac-message-author {
  margin-bottom: 4px;
  color: var(--chat-message-color-username);
  font-size: 12px;
  font-weight: 600;
}

.vac-reply-block {
  margin-bottom: 8px;
}

.vac-message-deleted {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--chat-message-color-deleted);
}

.vac-audio-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vac-message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 11px;
  color: var(--chat-message-color-timestamp);
}

.vac-failure-container {
  margin-top: 4px;
  border: 0;
  background: transparent;
  color: #d12e2e;
  cursor: pointer;
  font-weight: 700;
}
</style>
