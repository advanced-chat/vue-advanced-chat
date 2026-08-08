<script setup lang="ts">
import { type Action, type Chat, typingUsersString, type User, type UserReference } from '../models'
import { vOnClickOutside } from '@vueuse/components'

import { useLocalizationStrings } from '../localization'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const strings = useLocalizationStrings()

export interface ChatHeaderProps {
  /** Identifies the viewer; used to derive the "other user" in 1:1 chats for avatar/status fallback. */
  currentUser: UserReference
  /** Active chat being shown. */
  chat: Chat
  /** When `true`, hides the chat-list toggle button (used when `Chat` is rendered without a sidebar). Defaults to `false`. */
  standalone?: boolean
  /** Reflects whether the chats sidebar is currently expanded; controls the toggle-button rotation. Defaults to `false`. */
  showChatList?: boolean
  /** Disables the toggle-button rotation animation on small viewports. Defaults to `false`. */
  isMobile?: boolean
  /** When `true`, the avatar/name area becomes clickable and emits `show-chat-info`. Defaults to `false`. */
  chatInfoEnabled?: boolean
  /** Items rendered in the chat-header overflow menu. */
  actions?: Array<Action>
  /**
   * Bulk-action items rendered in the selection toolbar. When non-empty
   * and at least one message is selected, the toolbar replaces the
   * default header until the user cancels.
   */
  selectionActions?: Array<Action>
  /** Number of currently-selected messages; rendered as a counter on each selection-action button. */
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
  /** Fires when the chat-list toggle button is clicked. */
  (e: 'toggle-chat-list'): void

  /** Fires when the avatar/name area is clicked while `chatInfoEnabled` is `true`. */
  (e: 'show-chat-info'): void

  /** Fires when an item in the overflow menu is selected. */
  (e: 'menu-action-handler', payload: { chat: Chat; action: Action }): void

  /** Fires when the user clicks the "cancel" button in the selection toolbar. */
  (e: 'cancel-message-selection'): void

  /** Fires when a button in the selection toolbar is clicked. */
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
              <button
                type="button"
                class="vac-selection-button"
                @click="messageSelectionActionHandler(action)"
              >
                {{ action.label }}
                <span class="vac-selection-button-count">
                  {{ selectedCount }}
                </span>
              </button>
            </div>
            <button
              type="button"
              class="vac-selection-cancel vac-item-clickable"
              @click="emit('cancel-message-selection')"
            >
              {{ strings['chat.cancel-selection'] }}
            </button>
          </div>
        </transition>
        <template v-if="!showMessageSelection && messageSelectionAnimationEnded">
          <button
            v-if="!standalone"
            type="button"
            class="vac-svg-button vac-toggle-button"
            :class="{
              'vac-rotate-icon-init': !isMobile,
              'vac-rotate-icon': !showChatList && !isMobile,
            }"
            @click="emit('toggle-chat-list')"
            aria-label="Toggle chat list"
            :aria-expanded="showChatList"
          >
            <!-- @slot Icon for the chat-list toggle button. -->
            <slot name="toggle-icon">
              <SvgIcon name="toggle" />
            </slot>
          </button>
          <component
            :is="chatInfoEnabled ? 'button' : 'div'"
            :type="chatInfoEnabled ? 'button' : undefined"
            class="vac-info-wrapper"
            :class="{ 'vac-item-clickable': chatInfoEnabled }"
            @click="chatInfoEnabled && emit('show-chat-info')"
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
          </component>
          <!-- @slot Replacement for the chat-options menu trigger + dropdown. -->
          <slot v-if="chat.id" name="chat-options">
            <button
              v-if="actions.length"
              type="button"
              class="vac-svg-button vac-room-options"
              aria-label="Chat options"
              aria-haspopup="menu"
              :aria-expanded="menuOpened"
              @click="menuOpened = !menuOpened"
            >
              <!-- @slot Icon for the chat-options menu trigger. -->
              <slot name="menu-icon">
                <svg-icon name="menu" />
              </slot>
            </button>
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
  height: 72px;
  width: var(--chat-header-width);
  z-index: 10;
  background: var(--chat-header-bg-color);
  border-top-right-radius: var(--chat-container-border-radius);

  .vac-room-wrapper {
    display: flex;
    align-items: center;
    min-width: 0;
    height: 100%;
    width: 100%;
    gap: 12px;
    padding: 0 18px;
  }

  .vac-toggle-button {
    flex: 0 0 38px;
    width: 38px;
    height: 38px;
    max-height: 38px;
    margin-right: 0;
    border: var(--chat-border-style);
    background: var(--chat-bg-color-input);

    svg {
      height: 20px;
      width: 20px;
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
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;

    &.vac-item-clickable {
      border-radius: 10px;

      &:focus-visible {
        outline: 2px solid var(--chat-border-color-input-selected);
        outline-offset: 3px;
      }
    }
  }

  .vac-room-selection {
    display: flex;
    align-items: center;
    min-width: 0;
    width: 100%;
    height: 100%;

    .vac-selection-button {
      border: 0;
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
      border: 0;
      background: transparent;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .vac-room-name {
    font-size: 16px;
    font-weight: 750;
    line-height: 22px;
    color: var(--chat-header-color-name);
  }

  .vac-room-info {
    font-size: 12px;
    line-height: 18px;
    color: var(--chat-header-color-info);
  }

  .vac-room-options {
    flex: 0 0 38px;
    width: 38px;
    height: 38px;
    max-height: 38px;
    margin-left: auto;
    border: 0;
    background: var(--chat-bg-color-input);
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
