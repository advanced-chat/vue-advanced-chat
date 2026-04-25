<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import ChatFooter from '@/components/ChatFooter.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import Loader from '@/components/Loader.vue'
import MediaPreview from '@/components/MediaPreview.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { Action, Chat, Message, MessageFile, User, UserReference } from '../models'
import { useLocalizationStrings } from '../localization'
import type { ChatFileItem } from './ChatFile.vue'
import type { TextFormattingOptions } from '../utils/text-formatter'

import { EDIT_ACTION, REPLY_ACTION } from './actions'

const strings = useLocalizationStrings()

const SCROLL_THRESHOLD = 60

export interface ChatProps {
  currentUser?: UserReference | null
  chat?: Chat | null
  messages?: Message[]
  loadingMessages?: boolean
  /**
   * Set to `true` once every available message has been delivered for the
   * active chat. Disables further `fetch-messages` emissions.
   */
  messagesLoaded?: boolean
  standalone?: boolean
  showChatList?: boolean
  isMobile?: boolean
  chatInfoEnabled?: boolean
  headerActions?: Action[]
  messageActions?: Action[]
  /**
   * Bulk-action items rendered in the selection toolbar. When non-empty,
   * clicking a message starts selection mode; the toolbar replaces the
   * default header until cancelled. Pass an empty array (default) to
   * disable selection mode entirely.
   */
  selectionActions?: Action[]
  showFiles?: boolean
  showEmojis?: boolean
  showFooter?: boolean
  showReactionEmojis?: boolean
  showNewMessagesDivider?: boolean
  /**
   * Markdown / linkify / autolink configuration applied to every message
   * body in this chat. Per-render overrides (e.g. `singleLine` in reply
   * previews) compose on top.
   */
  textFormatting?: Partial<TextFormattingOptions>
  accept?: string
  multiple?: boolean
  capture?: '' | 'user' | 'environment'
}

export interface ChatEvents {
  (e: 'toggle-chat-list'): void
  (e: 'show-chat-info'): void
  (e: 'menu-action-handler', payload: { chat: Chat; action: Action }): void
  (
    e: 'message-selection-action-handler',
    payload: { chat: Chat; action: Action; messages: Message[] },
  ): void
  (e: 'cancel-message-selection'): void
  (e: 'open-file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  (e: 'typing-message', value: string): void
  (
    e: 'send-message',
    payload: { content: string; files: ChatFileItem[]; reply?: Message | null },
  ): void
  (
    e: 'edit-message',
    payload: { messageId: Message['id']; content: string; files: ChatFileItem[] },
  ): void
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (e: 'click-user-tag', user: User): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
  (e: 'open-failed-message', message: Message): void
  /**
   * Fired when the user scrolls near the top of the message list and more
   * messages should be paginated in. Suppressed while `loadingMessages` is
   * `true` or `messagesLoaded` is `true`.
   */
  (e: 'fetch-messages'): void
}

const props = withDefaults(defineProps<ChatProps>(), {
  currentUser: null,
  chat: null,
  messages: () => [],
  loadingMessages: false,
  messagesLoaded: false,
  standalone: false,
  showChatList: false,
  isMobile: false,
  chatInfoEnabled: false,
  headerActions: () => [],
  messageActions: () => [],
  selectionActions: () => [],
  showFiles: true,
  showEmojis: true,
  showFooter: true,
  showReactionEmojis: true,
  showNewMessagesDivider: true,
  textFormatting: () => ({}),
  accept: '*',
  multiple: true,
  capture: '',
})

const emit = defineEmits<ChatEvents>()

const selectedMessages = ref<Message[]>([])
const previewFile = ref<MessageFile | null>(null)
const replyMessage = ref<Message | null>(null)
const editMessage = ref<Message | null>(null)

const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer')
const userAtBottom = ref(true)
const newMessagesAvailable = ref(false)

const users = computed(() => props.chat?.users || [])

const newMessagesPillCount = computed(() => {
  return props.messages.filter((m) => m.unread).length
})

const scrollToBottom = (smooth = true) => {
  const el = scrollContainer.value
  if (!el) return

  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

const onScroll = () => {
  const el = scrollContainer.value
  if (!el) return

  const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  userAtBottom.value = distFromBottom < SCROLL_THRESHOLD

  if (userAtBottom.value) {
    newMessagesAvailable.value = false
  }

  if (
    el.scrollTop < SCROLL_THRESHOLD &&
    !props.loadingMessages &&
    !props.messagesLoaded &&
    props.messages.length > 0
  ) {
    emit('fetch-messages')
  }
}

watch(
  () => props.chat?.id,
  () => {
    selectedMessages.value = []
    replyMessage.value = null
    editMessage.value = null
    newMessagesAvailable.value = false
    userAtBottom.value = true
    nextTick(() => scrollToBottom(false))
  },
)

watch(
  () => props.messages.length,
  (newLen, oldLen = 0) => {
    if (newLen <= oldLen) return

    const last = props.messages[newLen - 1]
    const isOwnLast = !!last && !!props.currentUser && last.sender.id === props.currentUser.id

    nextTick(() => {
      if (userAtBottom.value || isOwnLast) {
        scrollToBottom()
      } else {
        newMessagesAvailable.value = true
      }
    })
  },
)

onMounted(() => {
  nextTick(() => scrollToBottom(false))
})

const messageSelectionActionHandler = (payload: { chat: Chat; action: Action }) => {
  emit('message-selection-action-handler', {
    chat: payload.chat,
    action: payload.action,
    messages: selectedMessages.value,
  })
}

const cancelMessageSelection = () => {
  selectedMessages.value = []
  emit('cancel-message-selection')
}

const handleOpenedFile = (payload: { file: MessageFile; action: 'preview' | 'download' }) => {
  if (payload.action === 'preview') {
    previewFile.value = payload.file
  }

  emit('open-file', payload)
}

const onMessageAction = (payload: { action: Action; message: Message }) => {
  if (payload.action.id === REPLY_ACTION) {
    editMessage.value = null
    replyMessage.value = payload.message
  } else if (payload.action.id === EDIT_ACTION) {
    replyMessage.value = null
    editMessage.value = payload.message
  }

  emit('message-action-handler', payload)
}

const selectionEnabled = computed(() => props.selectionActions.length > 0)

const onSelectMessage = (message: Message) => {
  if (!selectionEnabled.value) return

  const exists = selectedMessages.value.some((item) => item.id === message.id)

  if (exists) {
    selectedMessages.value = selectedMessages.value.filter((item) => item.id !== message.id)
  } else {
    selectedMessages.value = [...selectedMessages.value, message]
  }
}
</script>

<template>
  <div class="vac-col-messages">
    <template v-if="!currentUser || !chat">
      <div class="vac-container-center vac-room-empty">
        <slot name="no-chat-selected">
          <div>{{ strings['chat.empty'] }}</div>
        </slot>
      </div>
    </template>

    <template v-else>
      <ChatHeader
        :current-user="currentUser"
        :chat="chat"
        :standalone="standalone"
        :show-chat-list="showChatList"
        :is-mobile="isMobile"
        :chat-info-enabled="chatInfoEnabled"
        :actions="headerActions"
        :selection-actions="selectionActions"
        :selected-count="selectedMessages.length"
        @toggle-chat-list="emit('toggle-chat-list')"
        @show-chat-info="emit('show-chat-info')"
        @menu-action-handler="emit('menu-action-handler', $event)"
        @message-selection-action-handler="messageSelectionActionHandler($event)"
        @cancel-message-selection="cancelMessageSelection"
      />

      <div ref="scrollContainer" class="vac-container-scroll" @scroll.passive="onScroll">
        <Loader :show="loadingMessages" />

        <div v-if="!loadingMessages && !messages.length" class="vac-room-empty">
          {{ strings['chat.messages.empty'] }}
        </div>

        <div v-else class="vac-messages-container">
          <ChatMessage
            v-for="(message, index) in messages"
            :key="message.id"
            :current-user="currentUser"
            :message="message"
            :messages="messages"
            :index="index"
            :users="users"
            :actions="messageActions"
            :show-reaction-emojis="showReactionEmojis"
            :show-new-messages-divider="showNewMessagesDivider"
            :text-formatting="textFormatting"
            :message-selection-enabled="selectionEnabled"
            :selected="selectedMessages.some((selected) => selected.id === message.id)"
            @message-action-handler="onMessageAction"
            @send-message-reaction="emit('send-message-reaction', $event)"
            @open-file="handleOpenedFile($event)"
            @click-user-tag="emit('click-user-tag', $event)"
            @select-message="onSelectMessage"
            @open-failed-message="emit('open-failed-message', $event)"
          />
        </div>

        <transition name="vac-bounce">
          <button
            v-if="newMessagesAvailable && !userAtBottom"
            type="button"
            class="vac-scroll-bottom"
            :aria-label="strings['chat.scroll-to-bottom']"
            @click="scrollToBottom()"
          >
            <slot name="scroll-icon">
              <SvgIcon name="dropdown" param="scroll" />
            </slot>
            <span v-if="newMessagesPillCount" class="vac-scroll-bottom-badge">
              {{ newMessagesPillCount }}
            </span>
          </button>
        </transition>
      </div>

      <ChatFooter
        :chat="chat"
        :users="users"
        :show-files="showFiles"
        :show-emojis="showEmojis"
        :show-footer="showFooter"
        :accept="accept"
        :multiple="multiple"
        :capture="capture"
        :init-reply-message="replyMessage"
        :init-edit-message="editMessage"
        @typing-message="emit('typing-message', $event)"
        @send-message="emit('send-message', $event)"
        @edit-message="emit('edit-message', $event)"
        @reset-reply-message="replyMessage = null"
        @reset-edit-message="editMessage = null"
      />
    </template>

    <transition name="vac-fade-preview" appear>
      <MediaPreview :file="previewFile" @close-media-preview="previewFile = null" />
    </transition>
  </div>
</template>

<style scoped lang="scss">
.vac-col-messages {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

.vac-container-scroll {
  position: relative;
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 16px 16px;
  background: var(--chat-content-bg-color);
}

.vac-messages-container {
  padding: 12px 0;
}

.vac-room-empty {
  margin: auto;
  color: var(--chat-message-color-started);
  text-align: center;
  padding: 24px;
}

.vac-container-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.vac-scroll-bottom {
  position: sticky;
  bottom: 12px;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: var(--chat-border-style);
  background: var(--chat-bg-scroll-icon);
  color: var(--chat-message-color);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  z-index: 4;

  :deep(svg) {
    height: 14px;
    width: 14px;
    transform: rotate(0deg);
  }
}

.vac-scroll-bottom-badge {
  min-width: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--chat-message-bg-color-scroll-counter);
  color: var(--chat-message-color-scroll-counter);
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
}
</style>
