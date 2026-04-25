<script setup lang="ts">
import { ref, watch } from 'vue'

import type { User } from '../models'

export interface ChatUserTagProps {
  filteredUsers: User[]
  selectItem?: boolean | null
  activeUpOrDown?: number | null
}

export interface ChatUserTagEvents {
  (e: 'select-user-tag', user: User): void
  (e: 'activate-item'): void
}

const props = withDefaults(defineProps<ChatUserTagProps>(), {
  selectItem: null,
  activeUpOrDown: null,
})

const emit = defineEmits<ChatUserTagEvents>()

const activeItem = ref<number | null>(null)

watch(
  () => props.filteredUsers,
  (val, oldVal = []) => {
    if (!oldVal.length || val.length !== oldVal.length) {
      activeItem.value = val.length ? 0 : null
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.selectItem,
  (val) => {
    if (!val || activeItem.value == null) return

    const user = props.filteredUsers[activeItem.value]

    if (user) emit('select-user-tag', user)
  },
)

watch(
  () => props.activeUpOrDown,
  (direction) => {
    if (!direction || activeItem.value == null) return

    if (direction > 0 && activeItem.value < props.filteredUsers.length - 1) activeItem.value += 1
    if (direction < 0 && activeItem.value > 0) activeItem.value -= 1

    emit('activate-item')
  },
)
</script>

<template>
  <transition name="vac-slide-up">
    <div v-if="filteredUsers.length" class="vac-tags-container">
      <div
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        class="vac-tags-box"
        :class="{ 'vac-tags-box-active': index === activeItem }"
        @mouseover="activeItem = index"
        @click="emit('select-user-tag', user)"
      >
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
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.vac-tags-container {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: calc(100% + 8px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-radius: 12px;
  background: var(--chat-footer-bg-color);
  border: var(--chat-border-style);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.vac-tags-box {
  border-radius: 10px;
  cursor: pointer;

  &.vac-tags-box-active,
  &:hover {
    background: var(--chat-footer-bg-color-tag-active);
  }
}

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
