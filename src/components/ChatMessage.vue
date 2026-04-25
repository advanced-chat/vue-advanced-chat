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
import { useLocalizationStrings } from '../localization'
import type { TextFormattingOptions } from '../utils/text-formatter'

const strings = useLocalizationStrings()

export interface ChatMessageProps {
  /** Identifies the viewer; used to render own vs. other styling and own-only actions. */
  currentUser: UserReference
  /** Message rendered by this row. */
  message: ChatMessageModel
  /** Surrounding messages; used to decide whether to render a date divider above this row. */
  messages?: ChatMessageModel[]
  /** Position of `message` within `messages`. Defaults to `0`. */
  index?: number
  /** Chat members; used to resolve `@user` tags and reply previews. */
  users?: User[]
  /** Items rendered in this message's actions menu. */
  actions?: Action[]
  /** Shows the inline emoji-reaction picker on this message. Defaults to `true`. */
  showReactionEmojis?: boolean
  /** Renders the "new messages" divider above this row when `message.unread` is true. Defaults to `true`. */
  showNewMessagesDivider?: boolean
  /** Markdown / linkify configuration applied to the message body. */
  textFormatting?: Partial<TextFormattingOptions>
  /** When `true`, clicks toggle this message's selection instead of opening menus. Defaults to `false`. */
  messageSelectionEnabled?: boolean
  /** Whether this message is currently selected. Defaults to `false`. */
  selected?: boolean
}

export interface ChatMessageEvents {
  /** Fires when an item in the message's actions menu is selected. */
  (e: 'message-action-handler', payload: { action: Action; message: ChatMessageModel }): void
  /** Fires when the viewer adds or removes a reaction; the host should toggle the emoji on the message. */
  (e: 'send-message-reaction', payload: { emoji: string; message: ChatMessageModel }): void
  /** Fires when a file is clicked; `action` is `'preview'` for media and `'download'` otherwise. */
  (e: 'open-file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  /** Fires when an `@user` tag in the message body is clicked. */
  (e: 'click-user-tag', user: User): void
  /** Fires when the message is clicked while `messageSelectionEnabled` is `true`. */
  (e: 'select-message', message: ChatMessageModel): void
  /** Fires when the viewer clicks a failed message to retry sending. */
  (e: 'open-failed-message', message: ChatMessageModel): void
}

const props = withDefaults(defineProps<ChatMessageProps>(), {
  messages: () => [],
  index: 0,
  users: () => [],
  actions: () => [],
  showReactionEmojis: true,
  showNewMessagesDivider: true,
  textFormatting: () => ({}),
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

    <div v-if="message.unread && showNewMessagesDivider" class="vac-line-new">
      {{ strings['chat.messages.new'] }}
    </div>

    <Message
      :current-user="currentUser"
      :message="message"
      :users="users"
      :actions="actions"
      :show-reaction-emojis="showReactionEmojis"
      :text-formatting="textFormatting"
      :message-selection-enabled="messageSelectionEnabled"
      :selected="selected"
      @message-action-handler="emit('message-action-handler', $event)"
      @send-message-reaction="emit('send-message-reaction', $event)"
      @open-file="emit('open-file', $event)"
      @click-user-tag="emit('click-user-tag', $event)"
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
