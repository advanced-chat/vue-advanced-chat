<script setup lang="ts">
import AutocompleteMenu from './AutocompleteMenu.vue'
import type { User } from '../models'
import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatUserTagProps {
  filteredUsers: User[]
  selectItem?: boolean | null
  activeUpOrDown?: number | null
}

export interface ChatUserTagEvents {
  (e: 'select-user-tag', user: User): void
  (e: 'activate-item'): void
}

withDefaults(defineProps<ChatUserTagProps>(), {
  selectItem: null,
  activeUpOrDown: null,
})

const emit = defineEmits<ChatUserTagEvents>()
</script>

<template>
  <AutocompleteMenu
    :items="filteredUsers"
    :item-key="(user) => user.id"
    :select-item="selectItem"
    :active-up-or-down="activeUpOrDown"
    layout="vertical"
    :aria-label="strings['chat.autocomplete.users']"
    class="vac-user-tag-menu"
    @commit="(user) => emit('select-user-tag', user)"
    @activate-item="emit('activate-item')"
  >
    <template #default="{ item: user }">
      <div class="vac-tags-info">
        <div
          v-if="user.avatar"
          class="vac-tags-avatar vac-tags-avatar-image"
          :style="{ 'background-image': `url('${user.avatar}')` }"
        />
        <div v-else class="vac-tags-avatar">
          {{ user.name.slice(0, 1) }}
        </div>
        <div class="vac-tags-username">
          {{ user.name }}
        </div>
      </div>
    </template>
  </AutocompleteMenu>
</template>

<style scoped lang="scss">
.vac-tags-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
}

.vac-tags-avatar {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--chat-footer-bg-color-tag);
  font-size: 12px;
  font-weight: 700;

  &.vac-tags-avatar-image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.vac-tags-username {
  font-size: 14px;
}
</style>
