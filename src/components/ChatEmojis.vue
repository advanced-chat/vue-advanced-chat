<script setup lang="ts">
import { ref, watch } from 'vue'

export interface ChatEmojisProps {
  filteredEmojis: string[]
  selectItem?: boolean | null
  activeUpOrDown?: number | null
}

export interface ChatEmojisEvents {
  (e: 'select-emoji', emoji: string): void
  (e: 'activate-item'): void
}

const props = withDefaults(defineProps<ChatEmojisProps>(), {
  selectItem: null,
  activeUpOrDown: null,
})

const emit = defineEmits<ChatEmojisEvents>()

const activeItem = ref<number | null>(null)

watch(
  () => props.filteredEmojis,
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

    const emoji = props.filteredEmojis[activeItem.value]

    if (emoji) emit('select-emoji', emoji)
  },
)

watch(
  () => props.activeUpOrDown,
  (direction) => {
    if (!direction || activeItem.value == null) return

    if (direction > 0 && activeItem.value < props.filteredEmojis.length - 1) activeItem.value += 1
    if (direction < 0 && activeItem.value > 0) activeItem.value -= 1

    emit('activate-item')
  },
)
</script>

<template>
  <transition name="vac-slide-up">
    <div v-if="filteredEmojis.length" class="vac-emojis-container">
      <div
        v-for="(emoji, index) in filteredEmojis"
        :key="emoji"
        class="vac-emoji-element"
        :class="{ 'vac-emoji-element-active': index === activeItem }"
        @mouseover="activeItem = index"
        @click="emit('select-emoji', emoji)"
      >
        {{ emoji }}
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.vac-emojis-container {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: calc(100% + 8px);
  display: flex;
  gap: 6px;
  padding: 8px;
  border-radius: 12px;
  background: var(--chat-footer-bg-color);
  border: var(--chat-border-style);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  overflow-x: auto;
}

.vac-emoji-element {
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;

  &.vac-emoji-element-active,
  &:hover {
    background: var(--chat-footer-bg-color-tag-active);
  }
}
</style>
