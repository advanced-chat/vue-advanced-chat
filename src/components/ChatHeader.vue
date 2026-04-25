<script setup lang="ts">
import { type Action, type Chat, typingUsersString, type User, type UserReference } from '../models'
import { vOnClickOutside } from '@vueuse/components'

import { useLocalizationStrings } from '../localization'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const strings = useLocalizationStrings()

export interface ChatHeaderProps {
  currentUser: UserReference
  chat: Chat
  standalone?: boolean
  showChatList?: boolean
  isMobile?: boolean
  chatInfoEnabled?: boolean
  actions?: Array<Action>
  /**
   * Bulk-action items rendered in the selection toolbar. When non-empty
   * and at least one message is selected, the toolbar replaces the
   * default header until the user cancels.
   */
  selectionActions?: Array<Action>
  selectedCount?: number
  /**
   * When `false`, the typing-users line is suppressed in the header
   * (the `userStatus` line still renders). `Chat` flips this when its
   * `typingIndicatorPosition` excludes `header` so the indicator
   * doesn't render in two places at once.
   */
  showTypingIndicator?: boolean
}

export interface ChatHeaderEvents {
  (e: 'toggle-chat-list'): void
  (e: 'show-chat-info'): void
  (e: 'menu-action-handler', payload: { chat: Chat; action: Action }): void
  (e: 'cancel-message-selection'): void
  (e: 'message-selection-action-handler', payload: { chat: Chat; action: Action }): void
}

const props = withDefaults(defineProps<ChatHeaderProps>(), {
  standalone: false,
  showChatList: false,
  isMobile: false,
  chatInfoEnabled: false,
  actions: () => [],
  selectionActions: () => [],
  selectedCount: 0,
  showTypingIndicator: true,
})

const typingUsers = computed(() => typingUsersString(props.chat, strings))
const showMessageSelection = computed(
  () => props.selectionActions.length > 0 && props.selectedCount > 0,
)

const formatLastActive = (value: string): string => {
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
}

const otherUser = computed(() => {
  if (!props.chat.users || props.chat.users.length !== 2) return null
  return props.chat.users.find((u: User) => u.id !== props.currentUser.id) || null
})

const avatarUrl = computed(() => props.chat.avatar || otherUser.value?.avatar || null)

const userStatus = computed(() => {
  const u = otherUser.value
  if (!u?.status) return ''

  if (u.status.state === 'online') {
    return strings['chat.user.is-online']
  }

  if (u.status.lastActiveAt) {
    return strings['chat.user.last-seen'] + formatLastActive(u.status.lastActiveAt)
  }

  return ''
})

const emit = defineEmits<ChatHeaderEvents>()

const messageSelectionActionHandler = (action: Action) => {
  emit('message-selection-action-handler', { chat: props.chat, action })
}

const messageSelectionAnimationEnded = ref(true)
let messageSelectionAnimationTimeout: ReturnType<typeof setTimeout> | null = null

watch(showMessageSelection, (val) => {
  if (messageSelectionAnimationTimeout !== null) {
    clearTimeout(messageSelectionAnimationTimeout)
    messageSelectionAnimationTimeout = null
  }

  if (val) {
    messageSelectionAnimationEnded.value = false
  } else {
    messageSelectionAnimationTimeout = setTimeout(() => {
      messageSelectionAnimationEnded.value = true
      messageSelectionAnimationTimeout = null
    }, 300)
  }
})

onBeforeUnmount(() => {
  if (messageSelectionAnimationTimeout !== null) {
    clearTimeout(messageSelectionAnimationTimeout)
  }
})

const menuOpened = ref(false)

const closeMenu = () => {
  menuOpened.value = false
}

const menuActionHandler = (action: Action) => {
  closeMenu()
  emit('menu-action-handler', { chat: props.chat, action })
}
</script>

<template>
  <div class="vac-room-header vac-app-border-b">
    <!-- @slot Full replacement for the default header layout. -->
    <slot name="chat-header">
      <div class="vac-room-wrapper">
        <transition name="vac-slide-up">
          <div v-if="showMessageSelection" class="vac-room-selection">
            <div v-for="action in selectionActions" :id="action.id" :key="action.id">
              <div class="vac-selection-button" @click="messageSelectionActionHandler(action)">
                {{ action.label }}
                <span class="vac-selection-button-count">
                  {{ selectedCount }}
                </span>
              </div>
            </div>
            <div
              class="vac-selection-cancel vac-item-clickable"
              @click="emit('cancel-message-selection')"
            >
              {{ strings['chat.cancel-selection'] }}
            </div>
          </div>
        </transition>
        <template v-if="!showMessageSelection && messageSelectionAnimationEnded">
          <div
            v-if="!standalone"
            class="vac-svg-button vac-toggle-button"
            :class="{
              'vac-rotate-icon-init': !isMobile,
              'vac-rotate-icon': !showChatList && !isMobile,
            }"
            @click="emit('toggle-chat-list')"
          >
            <!-- @slot Icon for the chat-list toggle button. -->
            <slot name="toggle-icon">
              <SvgIcon name="toggle" />
            </slot>
          </div>
          <div
            class="vac-info-wrapper"
            :class="{ 'vac-item-clickable': chatInfoEnabled }"
            @click="emit('show-chat-info')"
          >
            <!-- @slot Avatar element. Default renders a CSS background-image div. -->
            <slot name="chat-header-avatar">
              <div
                v-if="avatarUrl"
                class="vac-avatar"
                :style="{ 'background-image': `url('${avatarUrl}')` }"
              />
            </slot>
            <!-- @slot Name + status block to the right of the avatar. -->
            <slot name="chat-header-info">
              <div class="vac-text-ellipsis">
                <div class="vac-room-name vac-text-ellipsis">
                  {{ chat.name }}
                </div>
                <div
                  v-if="showTypingIndicator && typingUsers"
                  class="vac-room-info vac-text-ellipsis"
                >
                  {{ typingUsers }}
                </div>
                <div v-else class="vac-room-info vac-text-ellipsis">
                  {{ userStatus }}
                </div>
              </div>
            </slot>
          </div>
          <!-- @slot Replacement for the chat-options menu trigger + dropdown. -->
          <slot v-if="chat.id" name="chat-options">
            <div
              v-if="actions.length"
              class="vac-svg-button vac-room-options"
              @click="menuOpened = !menuOpened"
            >
              <!-- @slot Icon for the chat-options menu trigger. -->
              <slot name="menu-icon">
                <svg-icon name="menu" />
              </slot>
            </div>
            <transition v-if="actions.length" name="vac-slide-left">
              <div
                v-if="menuOpened"
                v-on-click-outside="closeMenu"
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
                    @click="menuActionHandler(action)"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>
            </transition>
          </slot>
        </template>
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.vac-room-header {
  position: var(--chat-header-position);
  display: flex;
  align-items: center;
  height: 64px;
  width: var(--chat-header-width);
  z-index: 10;
  margin-right: 1px;
  background: var(--chat-header-bg-color);
  border-top-right-radius: var(--chat-container-border-radius);

  .vac-room-wrapper {
    display: flex;
    align-items: center;
    min-width: 0;
    height: 100%;
    width: 100%;
    padding: 0 16px;
  }

  .vac-toggle-button {
    margin-right: 15px;

    svg {
      height: 26px;
      width: 26px;
    }
  }

  .vac-rotate-icon {
    &-init {
      transform: rotate(360deg);
    }
    transform: rotate(180deg) !important;
  }

  .vac-info-wrapper {
    display: flex;
    align-items: center;
    min-width: 0;
    width: 100%;
    height: 100%;
  }

  .vac-room-selection {
    display: flex;
    align-items: center;
    min-width: 0;
    width: 100%;
    height: 100%;

    .vac-selection-button {
      padding: 8px 16px;
      color: var(--chat-color-button);
      background-color: var(--chat-bg-color-button);
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.7;
      }

      &:active {
        opacity: 0.9;
      }

      .vac-selection-button-count {
        margin-left: 6px;
        opacity: 0.9;
      }
    }

    .vac-selection-cancel {
      display: flex;
      align-items: center;
      margin-left: auto;
      white-space: nowrap;
      color: var(--chat-color-button-clear);
      transition: all 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .vac-room-name {
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    color: var(--chat-header-color-name);
  }

  .vac-room-info {
    font-size: 13px;
    line-height: 18px;
    color: var(--chat-header-color-info);
  }

  .vac-room-options {
    margin-left: auto;
  }

  @media only screen and (max-width: 768px) {
    height: 50px;

    .vac-room-wrapper {
      padding: 0 10px;
    }

    .vac-room-name {
      font-size: 16px;
      line-height: 22px;
    }

    .vac-room-info {
      font-size: 12px;
      line-height: 16px;
    }

    .vac-avatar {
      height: 37px;
      width: 37px;
      min-height: 37px;
      min-width: 37px;
    }
  }
}
</style>
