<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'

import ChatEmojis from '@/components/ChatEmojis.vue'
import ChatFiles from '@/components/ChatFiles.vue'
import ChatUserTag from '@/components/ChatUserTag.vue'
import EmojiPicker from '@/components/EmojiPicker.vue'
import MessageReply from '@/components/MessageReply.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import type { Chat, Message, User } from '../models'
import type { ChatFileItem } from './ChatFile.vue'
import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

const QUICK_EMOJIS = ['😀', '😂', '😍', '🔥', '👍', '🎉', '🚀', '🙌']

export interface ChatFooterProps {
  chat?: Chat | null
  users?: User[]
  roomMessage?: string
  showSendIcon?: boolean
  showFiles?: boolean
  showEmojis?: boolean
  showFooter?: boolean
  disabled?: boolean
  initReplyMessage?: Message | null
  initEditMessage?: Message | null
  /** MIME-type filter for the file input. */
  accept?: string
  /** Allow multi-file selection. */
  multiple?: boolean
  /** Mobile capture mode for the file input (e.g. `user`, `environment`). */
  capture?: '' | 'user' | 'environment'
  /**
   * Maximum number of pending files in the composer at once. Files added
   * past this limit are rejected with `invalid-file: { reason: 'count' }`.
   * `0` / unset disables the cap.
   */
  maxFiles?: number
  /**
   * Maximum size in bytes for any single file. Files exceeding this size
   * are rejected with `invalid-file: { reason: 'size' }`. `0` / unset
   * disables the cap.
   */
  maxFileSize?: number
}

/** Reason a file addition was rejected by `ChatFooter`. */
export type InvalidFileReason = 'size' | 'count'

export interface ChatFooterEvents {
  /**
   * Transfers ownership of every emitted file's `localUrl` to the listener.
   * The listener must revoke those object URLs when it no longer needs them.
   */
  (
    e: 'send-message',
    payload: {
      content: string
      files: ChatFileItem[]
      mentionedUsers: User[]
      reply?: Message | null
    },
  ): void

  /**
   * Transfers ownership of every emitted file's `localUrl` to the listener.
   * The listener must revoke those object URLs when it no longer needs them.
   */
  (
    e: 'edit-message',
    payload: {
      messageId: Message['id']
      content: string
      files: ChatFileItem[]
      mentionedUsers: User[]
    },
  ): void

  (e: 'update-edited-message-id', value: Message['id'] | null): void

  (e: 'typing-message', value: string): void

  (e: 'reset-reply-message'): void

  (e: 'reset-edit-message'): void

  (e: 'focus-textarea'): void

  (e: 'blur-textarea'): void

  /**
   * Fired once per file the composer rejected because of a configured
   * `maxFiles` / `maxFileSize` limit. Carries the original `File` so the
   * host can show its own error UI (toast, inline message, etc.).
   */
  (e: 'invalid-file', payload: { file: File; reason: InvalidFileReason }): void
}

const props = withDefaults(defineProps<ChatFooterProps>(), {
  users: () => [],
  roomMessage: '',
  showSendIcon: true,
  showFiles: true,
  showEmojis: true,
  showFooter: true,
  disabled: false,
  initReplyMessage: null,
  initEditMessage: null,
  accept: '*',
  multiple: true,
  capture: '',
  maxFiles: 0,
  maxFileSize: 0,
})

const emit = defineEmits<ChatFooterEvents>()

const message = ref(props.roomMessage)
const files = ref<ChatFileItem[]>([])
const emojiOpened = ref(false)
const autocompleteDismissed = ref(false)
const selectEmojiItem = ref(false)
const selectUserTagItem = ref(false)
const activeUpOrDownEmojis = ref<number | null>(null)
const activeUpOrDownUsers = ref<number | null>(null)
const activeEmojiDescendant = ref<string | null>(null)
const activeUserDescendant = ref<string | null>(null)
const replyMessage = ref<Message | null>(props.initReplyMessage)
const editedMessage = ref<Message | null>(props.initEditMessage)
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const ownedObjectUrls = new Set<string>()
const composerId = useId()
const textareaId = `${composerId}-textarea`
const emojiSuggestionsId = `${composerId}-emoji-suggestions`
const userSuggestionsId = `${composerId}-user-suggestions`
const emojiPickerId = `${composerId}-emoji-picker`
const emojiPickerButtonId = `${composerId}-emoji-picker-button`
let typingTimer: ReturnType<typeof setTimeout> | null = null
let typingActive = false

const filteredEmojis = computed(() => {
  if (autocompleteDismissed.value) return []

  const match = message.value.match(/:([\w+-]*)$/)

  if (!match) return []

  const query = match[1]?.toLowerCase() || ''

  return QUICK_EMOJIS.filter((emoji) => emoji.includes(query)).slice(0, 6)
})

const filteredUsers = computed(() => {
  if (autocompleteDismissed.value) return []

  const match = message.value.match(/@([\w-]*)$/)

  if (!match) return []

  const query = match[1]?.toLowerCase() || ''

  return props.users.filter((user) => user.name.toLowerCase().includes(query)).slice(0, 5)
})

const autocompleteExpanded = computed(
  () => filteredEmojis.value.length > 0 || filteredUsers.value.length > 0,
)
const activeListboxId = computed(() => {
  if (filteredUsers.value.length) return userSuggestionsId
  if (filteredEmojis.value.length) return emojiSuggestionsId
  return undefined
})
const activeDescendantId = computed(() => {
  if (filteredUsers.value.length) return activeUserDescendant.value ?? undefined
  if (filteredEmojis.value.length) return activeEmojiDescendant.value ?? undefined
  return undefined
})
const isMessageEmpty = computed(() => !files.value.length && !message.value.trim())

watch(
  () => props.roomMessage,
  (value) => {
    message.value = value
  },
)

const revokeFile = (file: ChatFileItem) => {
  if (!file.localUrl || !ownedObjectUrls.delete(file.localUrl)) return

  URL.revokeObjectURL(file.localUrl)
}

const revokeFiles = () => {
  files.value.forEach(revokeFile)
  files.value = []
}

const transferFiles = () => {
  const transferredFiles = [...files.value]

  transferredFiles.forEach((file) => {
    if (file.localUrl) ownedObjectUrls.delete(file.localUrl)
  })
  files.value = []

  return transferredFiles
}

watch(
  () => props.chat?.id,
  () => {
    revokeFiles()
    message.value = props.roomMessage
    emojiOpened.value = false
    replyMessage.value = null
    editedMessage.value = null
    emit('reset-reply-message')
    emit('reset-edit-message')
    emit('update-edited-message-id', null)
  },
)

watch(
  () => props.initReplyMessage,
  (value) => {
    replyMessage.value = value
  },
)

watch(
  () => props.initEditMessage,
  (value) => {
    const wasEditing = editedMessage.value !== null
    editedMessage.value = value
    if (value) {
      message.value = value.content || ''
    } else if (wasEditing) {
      message.value = props.roomMessage
    }
    emit('update-edited-message-id', value?.id ?? null)
  },
  { immediate: true },
)

watch(message, (value) => {
  autocompleteDismissed.value = false

  if (typingTimer !== null) clearTimeout(typingTimer)

  if (!value) {
    typingActive = false
    emit('typing-message', '')
    return
  }

  if (!typingActive) {
    typingActive = true
    emit('typing-message', value)
  }

  typingTimer = setTimeout(() => emit('typing-message', value), 300)
})

onBeforeUnmount(() => {
  if (typingTimer !== null) clearTimeout(typingTimer)
  if (typingActive) emit('typing-message', '')
  revokeFiles()
})

const updateFiles = (fileList: FileList | null) => {
  if (!fileList?.length) return

  const accepted: ChatFileItem[] = []
  let remainingSlots =
    props.maxFiles > 0 ? Math.max(0, props.maxFiles - files.value.length) : Infinity

  for (const file of Array.from(fileList)) {
    if (props.maxFileSize > 0 && file.size > props.maxFileSize) {
      emit('invalid-file', { file, reason: 'size' })
      continue
    }

    if (remainingSlots <= 0) {
      emit('invalid-file', { file, reason: 'count' })
      continue
    }

    const objectUrl = URL.createObjectURL(file)
    ownedObjectUrls.add(objectUrl)

    accepted.push({
      name: file.name,
      type: file.type,
      extension: file.name.split('.').pop() || '',
      url: objectUrl,
      localUrl: objectUrl,
      blob: file,
    })

    remainingSlots -= 1
  }

  if (accepted.length) {
    files.value = [...files.value, ...accepted]
  }
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement

  try {
    updateFiles(input.files)
  } finally {
    input.value = ''
  }
}

const removeFile = (index: number) => {
  const [removed] = files.value.splice(index, 1)

  if (removed) revokeFile(removed)
}

const resetMessage = () => {
  revokeFiles()
  message.value = ''

  if (replyMessage.value) {
    replyMessage.value = null
    emit('reset-reply-message')
  }

  if (editedMessage.value) {
    editedMessage.value = null
    emit('reset-edit-message')
  }

  emit('update-edited-message-id', null)
}

const cancelEdit = () => {
  if (!editedMessage.value) return

  editedMessage.value = null
  message.value = ''
  emit('update-edited-message-id', null)
  emit('reset-edit-message')
}

const cancelReply = () => {
  if (!replyMessage.value) return

  replyMessage.value = null
  emit('reset-reply-message')
}

const replaceTrailingToken = (pattern: RegExp, replacement: string) => {
  message.value = message.value.replace(pattern, replacement)
}

const selectEmoji = (emoji: string) => {
  replaceTrailingToken(/:[\w+-]*$/, emoji + ' ')
  selectEmojiItem.value = false
}

const selectUserTag = (user: User) => {
  replaceTrailingToken(/@[\w-]*$/, `<@${user.id}> `)
  selectUserTagItem.value = false
}

const addEmoji = (event: Event) => {
  const target = event as CustomEvent<{ unicode: string }>
  const unicode = target.detail?.unicode

  if (!unicode) return

  message.value += `${message.value.endsWith(' ') || !message.value ? '' : ' '}${unicode}`
  emojiOpened.value = false
}

const closePopups = (event?: KeyboardEvent) => {
  if (!autocompleteExpanded.value && !emojiOpened.value) return

  autocompleteDismissed.value = true
  emojiOpened.value = false
  selectEmojiItem.value = false
  selectUserTagItem.value = false
  activeUpOrDownEmojis.value = null
  activeUpOrDownUsers.value = null
  event?.preventDefault()
  event?.stopPropagation()
}

const toggleEmojiPicker = () => {
  emojiOpened.value = !emojiOpened.value
  if (emojiOpened.value) autocompleteDismissed.value = true
}

const getMentionedUsers = (content: string) => {
  const mentionedUsers = new Map<User['id'], User>()

  for (const match of content.matchAll(/<@([^>]+)>/g)) {
    const user = props.users.find(({ id }) => id === match[1])
    if (user) mentionedUsers.set(user.id, user)
  }

  return [...mentionedUsers.values()]
}

const sendMessage = () => {
  if (props.disabled || isMessageEmpty.value) return

  const content = message.value.trim()
  const payload = {
    content,
    files: transferFiles(),
    mentionedUsers: getMentionedUsers(content),
  }

  if (editedMessage.value) {
    emit('edit-message', {
      messageId: editedMessage.value.id,
      ...payload,
    })
  } else {
    emit('send-message', {
      ...payload,
      reply: replyMessage.value,
    })
  }

  resetMessage()
}

const onKeydown = (event: KeyboardEvent) => {
  if (filteredEmojis.value.length) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      activeUpOrDownEmojis.value = 1
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      activeUpOrDownEmojis.value = -1
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      selectEmojiItem.value = !selectEmojiItem.value
    }
  }

  if (filteredUsers.value.length) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      activeUpOrDownUsers.value = 1
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      activeUpOrDownUsers.value = -1
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      selectUserTagItem.value = !selectUserTagItem.value
    }
  }

  if (
    event.key === 'Enter' &&
    !event.shiftKey &&
    !filteredEmojis.value.length &&
    !filteredUsers.value.length
  ) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div
    v-if="showFooter && chat"
    id="room-footer"
    class="vac-room-footer"
    @keydown.esc="closePopups"
  >
    <ChatEmojis
      :filtered-emojis="filteredEmojis"
      :select-item="selectEmojiItem"
      :active-up-or-down="activeUpOrDownEmojis"
      :listbox-id="emojiSuggestionsId"
      @select-emoji="selectEmoji"
      @activate-item="activeUpOrDownEmojis = null"
      @active-descendant-change="activeEmojiDescendant = $event"
    />

    <ChatUserTag
      :filtered-users="filteredUsers"
      :select-item="selectUserTagItem"
      :active-up-or-down="activeUpOrDownUsers"
      :listbox-id="userSuggestionsId"
      @select-user-tag="selectUserTag"
      @activate-item="activeUpOrDownUsers = null"
      @active-descendant-change="activeUserDescendant = $event"
    />

    <div v-if="replyMessage" class="vac-footer-reply-wrapper">
      <MessageReply
        :message="{ ...replyMessage, reply: replyMessage }"
        :users="users"
        class="vac-footer-reply"
      />
      <button
        type="button"
        class="vac-svg-button vac-footer-reply-close"
        :aria-label="strings['chat.cancel-reply']"
        @click="cancelReply"
      >
        <!-- @slot Icon for the "cancel reply" button. -->
        <slot name="reply-close-icon">
          <SvgIcon name="close-outline" />
        </slot>
      </button>
    </div>

    <ChatFiles :files="files" @remove-file="removeFile" @reset-message="resetMessage" />

    <div
      class="vac-box-footer"
      :class="{ 'vac-box-footer-border': !files.length && !replyMessage }"
    >
      <div
        class="vac-composer-combobox"
        role="combobox"
        aria-label="Message suggestions"
        aria-haspopup="listbox"
        :aria-expanded="autocompleteExpanded"
        :aria-controls="activeListboxId"
        :aria-activedescendant="activeDescendantId"
      >
        <textarea
          :id="textareaId"
          v-model="message"
          :placeholder="strings['chat.message.placeholder']"
          class="vac-textarea"
          :disabled="disabled"
          :class="{ 'vac-textarea-outline': editedMessage }"
          :aria-label="strings['chat.message.placeholder']"
          aria-autocomplete="list"
          :aria-controls="activeListboxId"
          :aria-activedescendant="activeDescendantId"
          @keydown="onKeydown"
          @focus="emit('focus-textarea')"
          @blur="emit('blur-textarea')"
        />
      </div>

      <div class="vac-icon-textarea">
        <button
          v-if="editedMessage"
          type="button"
          class="vac-svg-button"
          :aria-label="strings['chat.cancel-edit']"
          @click="cancelEdit"
        >
          <!-- @slot Icon for the "cancel edit" button. -->
          <slot name="edit-close-icon">
            <SvgIcon name="close-outline" />
          </slot>
        </button>

        <div v-if="showEmojis" class="vac-emoji-button">
          <button
            :id="emojiPickerButtonId"
            type="button"
            class="vac-svg-button"
            :disabled="disabled"
            aria-label="Choose an emoji"
            aria-haspopup="dialog"
            :aria-expanded="emojiOpened"
            :aria-controls="emojiPickerId"
            @click="toggleEmojiPicker"
          >
            <!-- @slot Icon that toggles the emoji picker. -->
            <slot name="emoji-picker-icon">
              <SvgIcon name="emoji" />
            </slot>
          </button>
          <div
            v-if="emojiOpened"
            :id="emojiPickerId"
            class="vac-picker-shell"
            role="dialog"
            aria-label="Emoji picker"
            :aria-labelledby="emojiPickerButtonId"
            @emoji-click="addEmoji"
          >
            <EmojiPicker :opened="emojiOpened" />
          </div>
        </div>

        <button
          v-if="showFiles"
          type="button"
          class="vac-svg-button"
          :disabled="disabled"
          aria-label="Attach files"
          @click="fileInput?.click()"
        >
          <!-- @slot Icon for the "attach file" button. -->
          <slot name="paperclip-icon">
            <SvgIcon name="paperclip" />
          </slot>
        </button>
        <input
          v-if="showFiles"
          ref="fileInput"
          hidden
          type="file"
          :multiple="multiple"
          :accept="accept"
          :capture="capture || undefined"
          :disabled="disabled"
          @change="onFileChange"
        />

        <button
          v-if="showSendIcon"
          type="button"
          class="vac-svg-button"
          :class="{ 'vac-send-disabled': isMessageEmpty }"
          :disabled="disabled || isMessageEmpty"
          aria-label="Send message"
          @click="sendMessage"
        >
          <!-- @slot Icon for the send button. Receives no slot props. -->
          <slot name="send-icon">
            <SvgIcon :name="'send'" :param="isMessageEmpty ? 'disabled' : ''" />
          </slot>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-room-footer {
  position: relative;
  padding: 0 0 16px;
  background: var(--chat-footer-bg-color);
  border-top: var(--chat-border-style);
}

.vac-footer-reply-wrapper {
  position: relative;
}

.vac-footer-reply {
  margin: 12px 16px 0;
  padding-right: 36px;
}

.vac-footer-reply-close {
  position: absolute;
  top: 14px;
  right: 18px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.vac-box-footer {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 12px 16px 0;

  &.vac-box-footer-border {
    border-top: 0;
  }
}

.vac-textarea {
  width: 100%;
  min-height: 46px;
  max-height: 140px;
  resize: vertical;
  padding: 12px 14px;
  border-radius: 18px;
  border: var(--chat-border-style-input);
  background: var(--chat-bg-color-input);
  color: var(--chat-color);
  outline: 0;

  &.vac-textarea-outline {
    border-color: var(--chat-border-color-input-selected);
  }
}

.vac-composer-combobox {
  width: 100%;
}

.vac-icon-textarea {
  display: flex;
  align-items: center;
  gap: 10px;

  .vac-svg-button {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
  }
}

.vac-emoji-button {
  position: relative;
}

.vac-picker-shell {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 8;
}

.vac-send-disabled {
  opacity: 0.35;
}
</style>
