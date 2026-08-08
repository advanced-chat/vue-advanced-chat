<script setup lang="ts">
import {
  findUserById,
  typingUsersString,
  type Action,
  type Chat,
  type Id,
  type UserReference,
} from '../models'
import { vOnClickOutside } from '@vueuse/components'
import { computed, ref } from 'vue'
import { isAudioFile } from '../utils/media-types'

import SvgIcon from '@/components/SvgIcon.vue'
import MessageTemplate from '@/components/MessageTemplate.vue'

import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatsItemProps {
  /** Identifies the viewer; used to derive the "other user" in 1:1 chats and to format checkmarks on the last message. */
  currentUser: UserReference
  /** Chat rendered by this list item. */
  chat: Chat
  /** Items rendered in this chat's overflow menu. */
  actions?: Array<Action>
}

export interface ChatsItemEvents {
  /**
   * Emitted when a chat action is triggered.
   */
  (event: 'chat-action-handler', payload: { chat: Chat; action: Action }): void
}

const props = withDefaults(defineProps<ChatsItemProps>(), {})

const otherUser = computed(() => {
  const { chat, currentUser } = props

  if (!chat.users || chat.users.length !== 2) return null

  return chat.users.find((u) => u.id !== currentUser.id) || null
})

const userStatus = computed(() => otherUser.value?.status?.state || null)

const avatarUrl = computed(() => props.chat.avatar || otherUser.value?.avatar || null)

const formattedTimestamp = computed(() => {
  const { chat } = props
  const value = chat.lastMessage?.createdAt

  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
})

const typingUsers = computed(() => typingUsersString(props.chat, strings))

const lastMessageCheckmark = computed<{ name: string; param: string } | null>(() => {
  const { chat, currentUser } = props
  const last = chat.lastMessage

  if (!last || typingUsers.value || last.deleted) return null
  if (last.sender.id !== currentUser.id) return null

  switch (last.status) {
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

const isAudio = computed(() => {
  const { chat } = props

  return chat.lastMessage?.files ? isAudioFile(chat.lastMessage.files[0]) : false
})

const formattedDuration = computed(() => {
  const { chat } = props

  if (!chat.lastMessage?.files || !isAudio.value) return ''

  const duration = chat.lastMessage?.files?.[0]?.duration || 0

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

const lastMessage = computed(() => {
  if (typingUsers.value) return typingUsers.value

  const { chat, currentUser } = props

  const lastMessage = chat.lastMessage

  if (!lastMessage) return ''

  const content = lastMessage.content

  if (chat?.users && chat.users.length <= 2) {
    return content
  }

  const sender = findUserById(chat.users, lastMessage.sender.id)

  if (chat.users && chat.users.length <= 2) {
    return content
  }

  if (lastMessage.sender.name) {
    return `${lastMessage.sender.name} - ${content}`
  } else if (!sender || sender.id === currentUser.id) {
    return content
  }

  return `${sender.name} - ${content}`
})

const emit = defineEmits<ChatsItemEvents>()

const openedChatMenu = ref<Id | null>(null)

const closeChatMenu = () => {
  openedChatMenu.value = null
}

const chatActionHandler = (action: Action) => {
  emit('chat-action-handler', { chat: props.chat, action })
  closeChatMenu()
}
</script>

<template>
  <div class="vac-room-container">
    <slot :name="'chat-list-item_' + chat.id">
      <slot :name="'chat-list-avatar_' + chat.id">
        <div
          v-if="avatarUrl"
          class="vac-avatar"
          :style="{ 'background-image': `url('${avatarUrl}')` }"
        />
      </slot>
      <div class="vac-name-container vac-text-ellipsis">
        <div class="vac-title-container">
          <div
            v-if="userStatus"
            class="vac-state-circle"
            :class="{ 'vac-state-online': userStatus === 'online' }"
          />
          <slot :name="'chat-list-info_' + chat.id">
            <div class="vac-room-name vac-text-ellipsis">
              {{ chat.name }}
            </div>
          </slot>
          <div v-if="formattedTimestamp" class="vac-text-date">
            {{ formattedTimestamp }}
          </div>
        </div>
        <div
          class="vac-text-last"
          :class="{
            'vac-message-new': !!chat.unreadCount && !typingUsers,
          }"
        >
          <span v-if="lastMessageCheckmark">
            <slot :name="'checkmark-icon_' + chat.id">
              <SvgIcon
                :name="lastMessageCheckmark.name"
                :param="lastMessageCheckmark.param"
                class="vac-icon-check"
              />
            </slot>
          </span>
          <div
            v-if="chat.lastMessage && !chat.lastMessage.deleted && isAudio"
            class="vac-text-ellipsis"
          >
            <slot :name="'microphone-icon_' + chat.id">
              <svg-icon name="microphone" class="vac-icon-microphone" />
            </slot>
            {{ formattedDuration }}
          </div>
          <MessageTemplate
            v-else-if="chat.lastMessage"
            :message="{
              ...chat.lastMessage,
              content: lastMessage,
            }"
            :users="chat.users"
            :formatting-options="{ singleLine: true, markdown: false }"
          >
          </MessageTemplate>
          <div v-if="!chat.lastMessage && typingUsers" class="vac-text-ellipsis">
            {{ typingUsers }}
          </div>
          <div class="vac-room-options-container">
            <div v-if="chat.unreadCount" class="vac-badge-counter vac-room-badge">
              {{ chat.unreadCount }}
            </div>
            <slot :name="'chat-list-options_' + chat.id">
              <template v-if="actions && actions.length">
                <button
                  type="button"
                  class="vac-svg-button vac-list-room-options"
                  :aria-label="`Options for ${chat.name}`"
                  aria-haspopup="menu"
                  :aria-expanded="openedChatMenu === chat.id"
                  @click.stop="openedChatMenu = chat.id"
                >
                  <slot :name="'chat-list-options-icon_' + chat.id">
                    <svg-icon name="dropdown" param="room" />
                  </slot>
                </button>
                <transition name="vac-slide-left">
                  <div
                    v-if="openedChatMenu === chat.id"
                    v-on-click-outside="closeChatMenu"
                    class="vac-menu-options"
                    role="menu"
                  >
                    <div class="vac-menu-list">
                      <button
                        v-for="action in actions"
                        :key="action.id"
                        type="button"
                        role="menuitem"
                        class="vac-menu-item"
                        @click.stop="chatActionHandler(action)"
                      >
                        {{ action.label }}
                      </button>
                    </div>
                  </div>
                </transition>
              </template>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.vac-room-container {
  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;

  .vac-name-container {
    flex: 1;
  }

  .vac-title-container {
    display: flex;
    align-items: center;
    line-height: 22px;
  }

  .vac-state-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--chat-room-color-offline);
    margin-right: 6px;
    transition: 0.3s;
  }

  .vac-state-online {
    background-color: var(--chat-room-color-online);
  }

  .vac-room-name {
    flex: 1;
    color: var(--chat-room-color-username);
    font-size: 14px;
    font-weight: 700;
  }

  .vac-text-date {
    margin-left: 5px;
    font-size: 10px;
    font-weight: 600;
    color: var(--chat-room-color-timestamp);
  }

  .vac-text-last {
    display: flex;
    align-items: center;
    min-width: 0;
    margin-top: 3px;
    font-size: 12px;
    line-height: 18px;
    color: var(--chat-room-color-message);
  }

  .vac-message-new {
    color: var(--chat-room-color-username);
    font-weight: 500;
  }

  .vac-icon-check {
    display: flex;
    vertical-align: middle;
    height: 14px;
    width: 14px;
    margin-top: -2px;
    margin-right: 2px;
  }

  .vac-icon-microphone {
    height: 15px;
    width: 15px;
    vertical-align: middle;
    margin: -3px 1px 0 -2px;
    fill: var(--chat-room-color-message);
  }

  .vac-room-options-container {
    position: relative;
    z-index: 2;
    display: flex;
    margin-left: auto;
  }

  .vac-room-badge {
    background-color: var(--chat-room-bg-color-badge);
    color: var(--chat-room-color-badge);
    margin-left: 5px;
  }

  .vac-list-room-options {
    height: 19px;
    width: 19px;
    align-items: center;
    margin-left: 5px;
    padding: 0;
    border: 0;
    background: transparent;
  }
}
</style>
