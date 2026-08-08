<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import ChatFooter from '@/components/ChatFooter.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import Loader from '@/components/Loader.vue'
import MediaPreview from '@/components/MediaPreview.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { Action, Chat, Message, MessageFile, User, UserReference } from '../models'
import { typingUsersString } from '../models/chat'
import { useLocalizationStrings } from '../localization'
import { useMessageSelection } from '../composables/use-message-selection'
import { useReplyEdit } from '../composables/use-reply-edit'
import type { ChatFileItem } from './ChatFile.vue'
import type { TextFormattingOptions } from '../utils/text-formatter'

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
  showSendIcon?: boolean
  composerDisabled?: boolean
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
  /** Max files in the composer at once. `0` / unset disables. */
  maxFiles?: number
  /** Max bytes per file. `0` / unset disables. */
  maxFileSize?: number
  /**
   * Where to render the typing-users indicator.
   * - `'header'` (default): under the chat name, matches v2.
   * - `'composer'`: as a small line above `ChatFooter`'s textarea.
   * - `'both'`: render in both places.
   * - `'none'`: suppress entirely.
   */
  typingIndicatorPosition?: 'header' | 'composer' | 'both' | 'none'
  /**
   * Auto-scroll policy for the message list. Each leg defaults to the
   * v2-equivalent behavior: scroll on mount, on chat switch, on send,
   * and on receive *only when the user is already at the bottom*.
   * Set a leg to `false` to suppress that auto-scroll.
   */
  autoScroll?: {
    onMount?: boolean
    onChatSwitch?: boolean
    onSend?: boolean
    onReceive?: boolean
  }
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
    payload: {
      content: string
      files: ChatFileItem[]
      mentionedUsers: User[]
      reply?: Message | null
    },
  ): void

  (
    e: 'edit-message',
    payload: {
      messageId: Message['id']
      content: string
      files: ChatFileItem[]
      mentionedUsers: User[]
    },
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

  /**
   * Re-emitted from `ChatFooter` when a pending file is rejected by a
   * configured `maxFiles` / `maxFileSize` limit.
   */
  (e: 'invalid-file', payload: { file: File; reason: 'size' | 'count' }): void
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
  showSendIcon: true,
  composerDisabled: false,
  showReactionEmojis: true,
  showNewMessagesDivider: true,
  textFormatting: () => ({}),
  accept: '*',
  multiple: true,
  capture: '',
  maxFiles: 0,
  maxFileSize: 0,
  typingIndicatorPosition: 'header',
  autoScroll: () => ({ onMount: true, onChatSwitch: true, onSend: true, onReceive: true }),
})

const emit = defineEmits<ChatEvents>()

const previewFile = ref<MessageFile | null>(null)

const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer')
const userAtBottom = ref(true)
const newMessagesAvailable = ref(false)
const paginationPending = ref(false)
const paginationScrollHeight = ref(0)

const users = computed(() => props.chat?.users || [])

const showTypingInHeader = computed(
  () => props.typingIndicatorPosition === 'header' || props.typingIndicatorPosition === 'both',
)
const showTypingInComposer = computed(
  () => props.typingIndicatorPosition === 'composer' || props.typingIndicatorPosition === 'both',
)
const composerTypingUsers = computed(() =>
  props.chat ? typingUsersString(props.chat, strings) : '',
)

const selectionEnabled = computed(() => props.selectionActions.length > 0)

const {
  selected: selectedMessages,
  selectedIds: selectedMessageIds,
  toggle: toggleMessageSelection,
  clear: clearMessageSelection,
  cancel: cancelSelection,
} = useMessageSelection<Message>({
  enabled: selectionEnabled,
  resetKey: () => props.chat?.id,
  onCancel: () => emit('cancel-message-selection'),
})

const {
  replyMessage,
  editMessage,
  dispatch: dispatchReplyEdit,
  resetReply,
  resetEdit,
} = useReplyEdit({ resetKey: () => props.chat?.id })

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
    !paginationPending.value &&
    !props.loadingMessages &&
    !props.messagesLoaded &&
    props.messages.length > 0
  ) {
    paginationPending.value = true
    paginationScrollHeight.value = el.scrollHeight
    emit('fetch-messages')
  }
}

const autoScrollPolicy = computed(() => ({
  onMount: props.autoScroll.onMount ?? true,
  onChatSwitch: props.autoScroll.onChatSwitch ?? true,
  onSend: props.autoScroll.onSend ?? true,
  onReceive: props.autoScroll.onReceive ?? true,
}))

watch(
  () => props.chat?.id,
  () => {
    newMessagesAvailable.value = false
    userAtBottom.value = true
    paginationPending.value = false
    if (autoScrollPolicy.value.onChatSwitch) {
      nextTick(() => scrollToBottom(false))
    }
  },
)

watch(
  () => props.messages.map((message) => message.id),
  (newIds, oldIds = []) => {
    const newLen = newIds.length
    const oldLen = oldIds.length
    if (newLen <= oldLen) {
      paginationPending.value = false
      return
    }

    const oldFirst = oldIds[0]
    const oldLast = oldIds[oldLen - 1]
    const newFirst = newIds[0]
    const newLast = newIds[newLen - 1]
    const prepended = oldLen > 0 && oldLast === newLast && oldFirst !== newFirst
    const last = props.messages[newLen - 1]
    const isOwnLast = !!last && !!props.currentUser && last.sender.id === props.currentUser.id
    const policy = autoScrollPolicy.value

    nextTick(() => {
      if (prepended) {
        const el = scrollContainer.value
        if (el) el.scrollTop += el.scrollHeight - paginationScrollHeight.value
        paginationPending.value = false
        return
      }

      if (isOwnLast) {
        if (policy.onSend) scrollToBottom()
      } else if (policy.onReceive && userAtBottom.value) {
        scrollToBottom()
      } else {
        newMessagesAvailable.value = true
      }
      paginationPending.value = false
    })
  },
)

watch(
  () => props.loadingMessages,
  (loading, previous) => {
    if (previous && !loading) paginationPending.value = false
  },
)

onMounted(() => {
  if (autoScrollPolicy.value.onMount) {
    nextTick(() => scrollToBottom(false))
  }
})

const messageSelectionActionHandler = (payload: { chat: Chat; action: Action }) => {
  emit('message-selection-action-handler', {
    chat: payload.chat,
    action: payload.action,
    messages: selectedMessages.value,
  })
  clearMessageSelection()
}

const handleOpenedFile = (payload: { file: MessageFile; action: 'preview' | 'download' }) => {
  if (payload.action === 'preview') {
    previewFile.value = payload.file
  }

  emit('open-file', payload)
}

const onMessageAction = (payload: { action: Action; message: Message }) => {
  dispatchReplyEdit(payload)
  emit('message-action-handler', payload)
}
</script>

<template>
  <div class="vac-col-messages">
    <template v-if="!currentUser || !chat">
      <div class="vac-container-center vac-room-empty">
        <!-- @slot Empty-state content rendered when `chat` or `currentUser` is missing. -->
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
        :show-typing-indicator="showTypingInHeader"
        @toggle-chat-list="emit('toggle-chat-list')"
        @show-chat-info="emit('show-chat-info')"
        @menu-action-handler="emit('menu-action-handler', $event)"
        @message-selection-action-handler="messageSelectionActionHandler($event)"
        @cancel-message-selection="cancelSelection"
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
            :selected="selectedMessageIds.has(message.id)"
            @message-action-handler="onMessageAction"
            @send-message-reaction="emit('send-message-reaction', $event)"
            @open-file="handleOpenedFile($event)"
            @click-user-tag="emit('click-user-tag', $event)"
            @select-message="toggleMessageSelection"
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
            <!-- @slot Icon for the scroll-to-latest pill. Defaults to a downward chevron. -->
            <slot name="scroll-icon">
              <SvgIcon name="dropdown" param="scroll" />
            </slot>
            <span v-if="newMessagesPillCount" class="vac-scroll-bottom-badge">
              {{ newMessagesPillCount }}
            </span>
          </button>
        </transition>
      </div>

      <div
        v-if="showTypingInComposer && composerTypingUsers"
        class="vac-composer-typing"
        aria-live="polite"
      >
        <!--
          @slot Typing indicator rendered above the composer when
          `typingIndicatorPosition` includes `composer`. Receives the
          resolved `typingUsers` string as a slot prop.
          @binding {string} typing-users Localized "X is typing..." string.
        -->
        <slot name="composer-typing" :typing-users="composerTypingUsers">
          {{ composerTypingUsers }}
        </slot>
      </div>

      <ChatFooter
        :chat="chat"
        :users="users"
        :show-files="showFiles"
        :show-emojis="showEmojis"
        :show-footer="showFooter"
        :show-send-icon="showSendIcon"
        :disabled="composerDisabled"
        :accept="accept"
        :multiple="multiple"
        :capture="capture"
        :max-files="maxFiles"
        :max-file-size="maxFileSize"
        :init-reply-message="replyMessage"
        :init-edit-message="editMessage"
        @typing-message="emit('typing-message', $event)"
        @send-message="emit('send-message', $event)"
        @edit-message="emit('edit-message', $event)"
        @reset-reply-message="resetReply"
        @reset-edit-message="resetEdit"
        @invalid-file="emit('invalid-file', $event)"
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
  padding: 0 22px 18px;
  background: var(--chat-content-bg-color);
  scrollbar-color: color-mix(in srgb, var(--chat-color) 20%, transparent) transparent;
  scrollbar-width: thin;
}

.vac-messages-container {
  padding: 18px 0 8px;
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
  padding: 9px 13px;
  border-radius: 999px;
  border: var(--chat-border-style);
  background: var(--chat-bg-scroll-icon);
  color: var(--chat-message-color);
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(25, 23, 43, 0.18);
  z-index: 4;

  :deep(svg) {
    height: 14px;
    width: 14px;
    transform: rotate(0deg);
  }
}

.vac-composer-typing {
  padding: 4px 16px 0;
  font-size: 12px;
  color: var(--chat-message-color-timestamp);
  font-style: italic;
  background: var(--chat-footer-bg-color);
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
