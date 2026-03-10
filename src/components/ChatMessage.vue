<script setup lang="ts">
import { computed } from 'vue'

import Message from '@/components/Message.vue'

import type {
  Action,
  Message as ChatMessageModel,
  MessageFile,
  User,
  UserReference,
} from '../models'

export interface ChatMessageProps {
  user: UserReference
  message: ChatMessageModel
  messages?: ChatMessageModel[]
  index?: number
  users?: User[]
  actions?: Action[]
  showReactionEmojis?: boolean
  messageSelectionEnabled?: boolean
  selected?: boolean
}

export interface ChatMessageEvents {
  (e: 'message-action-handler', payload: { action: Action; message: ChatMessageModel }): void
  (e: 'send-message-reaction', payload: { emoji: string; message: ChatMessageModel }): void
  (e: 'opened:file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  (e: 'clicked:user-tag', user: User): void
  (e: 'select-message', message: ChatMessageModel): void
  (e: 'open-failed-message', payload: { message: ChatMessageModel }): void
}

const props = withDefaults(defineProps<ChatMessageProps>(), {
  messages: () => [],
  index: 0,
  users: () => [],
  actions: () => [],
  showReactionEmojis: true,
  messageSelectionEnabled: false,
  selected: false,
})

const emit = defineEmits<ChatMessageEvents>()

const showDateDivider = computed(() => {
  if (!props.index || !props.messages.length) return false

  const previous = props.messages[props.index - 1]

  if (!previous) return false

  return (
    new Date(previous.createdAt).toDateString() !== new Date(props.message.createdAt).toDateString()
  )
})

const dateLabel = computed(() => {
  const date = new Date(props.message.createdAt)

  if (Number.isNaN(date.getTime())) return props.message.createdAt

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
})
</script>

<template>
  <div class="vac-chat-message">
    <div v-if="showDateDivider" class="vac-card-info vac-card-date">
      {{ dateLabel }}
    </div>

    <div v-if="message.new" class="vac-line-new">New messages</div>

    <Message
      :user="user"
      :message="message"
      :users="users"
      :actions="actions"
      :show-reaction-emojis="showReactionEmojis"
      :message-selection-enabled="messageSelectionEnabled"
      :selected="selected"
      @message-action-handler="emit('message-action-handler', $event)"
      @send-message-reaction="emit('send-message-reaction', $event)"
      @opened:file="emit('opened:file', $event)"
      @clicked:user-tag="emit('clicked:user-tag', $event)"
      @select-message="emit('select-message', $event)"
      @open-failed-message="emit('open-failed-message', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.vac-card-info {
  width: fit-content;
  margin: 12px auto;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--chat-message-bg-color-date);
  color: var(--chat-message-color-date);
  font-size: 12px;
}

.vac-line-new {
  margin: 12px 0;
  color: var(--chat-message-color-new-messages);
  font-size: 12px;
  text-align: center;
}
</style>
