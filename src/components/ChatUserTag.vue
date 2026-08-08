<script setup lang="ts">
import AutocompleteMenu from './AutocompleteMenu.vue'
import type { User } from '../models'
import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatUserTagProps {
  /** Users matching the active `@` query. Pass an empty array to hide the popup. */
  filteredUsers: User[]
  /** Truthy edge commits the active user. The host typically wires this to Enter. */
  selectItem?: boolean | null
  /** Positive steps forward, negative backward. The host typically wires this to ArrowUp/ArrowDown. */
  activeUpOrDown?: number | null
  /** ID used to connect the suggestion listbox to the composer combobox. */
  listboxId?: string
}

export interface ChatUserTagEvents {
  /** Fires when the user commits a tag from the popup. */
  (e: 'select-user-tag', user: User): void
  /** Fires after the active user moves via `activeUpOrDown`. */
  (e: 'activate-item'): void
  /** Reports the active option ID for the owning combobox. */
  (e: 'active-descendant-change', value: string | null): void
}

withDefaults(defineProps<ChatUserTagProps>(), {
  selectItem: null,
  activeUpOrDown: null,
  listboxId: undefined,
})

const emit = defineEmits<ChatUserTagEvents>()
</script>

<template>
  <AutocompleteMenu
    :items="filteredUsers"
    :item-key="(user) => user.id"
    :select-item="selectItem"
    :active-up-or-down="activeUpOrDown"
    :listbox-id="listboxId"
    layout="vertical"
    :aria-label="strings['chat.autocomplete.users']"
    class="acc-user-tag-menu"
    @commit="(user) => emit('select-user-tag', user)"
    @activate-item="emit('activate-item')"
    @active-descendant-change="(value) => emit('active-descendant-change', value)"
  >
    <template #default="{ item: user }">
      <div class="acc-tags-info">
        <div
          v-if="user.avatar"
          class="acc-tags-avatar acc-tags-avatar-image"
          :style="{ 'background-image': `url('${user.avatar}')` }"
        />
        <div v-else class="acc-tags-avatar">
          {{ user.name.slice(0, 1) }}
        </div>
        <div class="acc-tags-username">
          {{ user.name }}
        </div>
      </div>
    </template>
  </AutocompleteMenu>
</template>

<style scoped lang="scss">
.acc-tags-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
}

.acc-tags-avatar {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--chat-footer-bg-color-tag);
  font-size: 12px;
  font-weight: 700;

  &.acc-tags-avatar-image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.acc-tags-username {
  font-size: 14px;
}
</style>
