<script setup lang="ts">
import { computed } from 'vue'

import AudioPlayer from '@/components/AudioPlayer.vue'
import MessageActions from '@/components/MessageActions.vue'
import MessageFiles from '@/components/MessageFiles.vue'
import MessageReactions from '@/components/MessageReactions.vue'
import MessageReply from '@/components/MessageReply.vue'
import MessageTemplate from '@/components/MessageTemplate.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { Action, Message, MessageFile, User, UserReference } from '../models'
import { isAudioFile } from '../utils/media-types'
import { useLocalizationStrings } from '../localization'
import type { TextFormattingOptions } from '../utils/text-formatter'

const strings = useLocalizationStrings()

export interface MessageProps {
  currentUser: UserReference
  message: Message
  users?: User[]
  actions?: Action[]
  showReactionEmojis?: boolean
  /**
   * Text-formatting options applied to this message body. Composes with
   * downstream per-render overrides (single-line previews, etc.).
   */
  textFormatting?: Partial<TextFormattingOptions>
  messageSelectionEnabled?: boolean
  selected?: boolean
}

export interface MessageEvents {
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void

  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void

  (e: 'open-file', payload: { file: MessageFile; action: 'preview' | 'download' }): void

  (e: 'click-user-tag', user: User): void

  (e: 'select-message', message: Message): void

  (e: 'open-failed-message', message: Message): void
}

const props = withDefaults(defineProps<MessageProps>(), {
  users: () => [],
  actions: () => [],
  showReactionEmojis: true,
  textFormatting: () => ({}),
  messageSelectionEnabled: false,
  selected: false,
})

const emit = defineEmits<MessageEvents>()

const isOwnMessage = computed(() => props.message.sender.id === props.currentUser.id)

const timestamp = computed(() => {
  const date = new Date(props.message.createdAt)

  if (Number.isNaN(date.getTime())) return props.message.createdAt

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
})

const firstFile = computed(() => props.message.files?.[0] || null)

const isAudioMessage = computed(
  () => !!firstFile.value && props.message.files?.length === 1 && isAudioFile(firstFile.value),
)

const showActions = computed(
  () => props.actions.length > 0 && !props.message.disableActions && !props.messageSelectionEnabled,
)

const showReactions = computed(
  () =>
    props.showReactionEmojis && !props.message.disableReactions && !props.messageSelectionEnabled,
)

const checkmarkIcon = computed<{ name: string; param: string } | null>(() => {
  switch (props.message.status) {
    case 'read':
      return { name: 'double-checkmark', param: 'seen' }
    case 'delivered':
      return { name: 'double-checkmark', param: '' }
    case 'sent':
      return { name: 'checkmark', param: '' }
    default:
      return null
  }
})

const isFailed = computed(() => props.message.status === 'failed')
</script>

<template>
  <div v-if="message.system" class="acc-message-row acc-message-row-system">
    <div class="acc-message-system">
      <MessageTemplate
        :message="message"
        :users="users"
        :formatting-options="{ ...textFormatting, markdown: true, singleLine: false }"
        @click-user-tag="emit('click-user-tag', $event)"
      />
    </div>
  </div>

  <div
    v-else
    class="acc-message-row"
    :class="{
      'acc-message-row-me': isOwnMessage,
      'acc-message-row-selected': selected,
      'acc-message-row-selectable': messageSelectionEnabled,
    }"
    @click="messageSelectionEnabled ? emit('select-message', message) : undefined"
  >
    <div class="acc-message-card" :class="{ 'acc-message-current': isOwnMessage }">
      <div v-if="!isOwnMessage" class="acc-message-author">
        {{ message.sender.name }}
      </div>

      <MessageReply
        v-if="message.reply && !message.deleted"
        :message="message"
        :users="users"
        :text-formatting="textFormatting"
        class="acc-reply-block"
      />

      <div v-if="message.deleted" class="acc-message-deleted">
        <!-- @slot Per-message deleted-icon override. Slot name is `deleted-icon_<message.id>`. -->
        <slot :name="'deleted-icon_' + message.id">
          <SvgIcon name="deleted" />
        </slot>
        <span>{{ strings['chat.message.deleted'] }}</span>
      </div>

      <MessageTemplate
        v-else-if="!message.files?.length"
        :message="message"
        :users="users"
        :formatting-options="textFormatting"
        @click-user-tag="emit('click-user-tag', $event)"
      />

      <MessageFiles
        v-else-if="!isAudioMessage"
        :current-user="currentUser"
        :message="message"
        :users="users"
        :text-formatting="textFormatting"
        :message-selection-enabled="messageSelectionEnabled"
        @open-file="emit('open-file', $event)"
        @click-user-tag="emit('click-user-tag', $event)"
      />

      <AudioPlayer
        v-else
        :message="message"
        :src="firstFile?.url"
        :message-selection-enabled="messageSelectionEnabled"
      />

      <div class="acc-message-meta">
        <span v-if="message.edited && !message.deleted" class="acc-message-edited">
          <!-- @slot Per-message pencil-icon override. Slot name is `pencil-icon_<message.id>`. -->
          <slot :name="'pencil-icon_' + message.id">
            <SvgIcon name="pencil" />
          </slot>
        </span>
        <span>{{ timestamp }}</span>
        <span v-if="isOwnMessage && !message.deleted && checkmarkIcon">
          <!-- @slot Per-message checkmark-icon override. Slot name is `checkmark-icon_<message.id>`. -->
          <slot :name="'checkmark-icon_' + message.id">
            <SvgIcon :name="checkmarkIcon.name" :param="checkmarkIcon.param" />
          </slot>
        </span>
      </div>

      <MessageActions
        v-if="showActions || showReactions"
        :current-user="currentUser"
        :message="message"
        :actions="showActions ? actions : []"
        :show-reaction-emojis="showReactions"
        @message-action-handler="emit('message-action-handler', $event)"
        @send-message-reaction="emit('send-message-reaction', $event)"
      />
    </div>

    <MessageReactions
      v-if="message.reactions && !messageSelectionEnabled"
      :current-user="currentUser"
      :message="message"
      @send-message-reaction="emit('send-message-reaction', { emoji: $event.emoji, message })"
    />

    <button
      v-if="isFailed && isOwnMessage"
      type="button"
      class="acc-failure-container"
      :title="strings['chat.message.failure']"
      @click.stop="emit('open-failed-message', message)"
    >
      <span class="acc-failure-icon" aria-hidden="true">!</span>
      <span class="acc-failure-label">{{ strings['chat.message.failure'] }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.acc-message-row {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;

  &.acc-message-row-me {
    align-items: flex-end;
  }

  &.acc-message-row-selected .acc-message-card {
    background: var(--chat-message-bg-color-selected);
  }

  &.acc-message-row-selectable {
    cursor: pointer;
  }
}

.acc-message-card {
  position: relative;
  max-width: min(78%, 560px);
  margin-bottom: 16px; // reserve space for the floating actions chip below the bubble
  padding: 11px 14px 10px;
  border: var(--chat-border-style);
  border-radius: 18px 18px 18px 6px;
  background: var(--chat-message-bg-color);
  color: var(--chat-message-color);
  box-shadow: 0 8px 24px rgba(30, 28, 48, 0.07);
  line-height: 1.52;

  &.acc-message-current {
    background: var(--chat-message-bg-color-me);
    border-radius: 18px 18px 6px 18px;
    border-color: transparent;
  }
}

.acc-message-author {
  margin-bottom: 4px;
  color: var(--chat-message-color-username);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.01em;
}

.acc-reply-block {
  margin-bottom: 8px;
}

.acc-message-deleted {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--chat-message-color-deleted);
}

.acc-message-row-system {
  align-items: center;
}

.acc-message-system {
  width: fit-content;
  margin: 8px auto;
  padding: 6px 13px;
  border-radius: 999px;
  background: var(--chat-message-bg-color-system);
  color: var(--chat-message-color-system);
  font-size: 12px;
  font-weight: 600;
}

.acc-message-edited {
  display: inline-flex;
  align-items: center;
  margin-right: 2px;
  opacity: 0.7;

  :deep(svg) {
    height: 12px;
    width: 12px;
  }
}

.acc-message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 5px;
  font-size: 10px;
  font-weight: 550;
  color: var(--chat-message-color-timestamp);
}

.acc-failure-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 4px 10px;
  border: 1px solid var(--chat-message-bg-color-failure);
  background: transparent;
  color: var(--chat-message-color-failure);
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.acc-failure-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--chat-message-bg-color-failure);
  color: #fff;
  font-size: 10px;
  line-height: 1;
}

.acc-failure-label {
  white-space: nowrap;
}
</style>
