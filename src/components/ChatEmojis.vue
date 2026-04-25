<script setup lang="ts">
import AutocompleteMenu from './AutocompleteMenu.vue'
import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatEmojisProps {
  filteredEmojis: string[]
  selectItem?: boolean | null
  activeUpOrDown?: number | null
}

export interface ChatEmojisEvents {
  (e: 'select-emoji', emoji: string): void
  (e: 'activate-item'): void
}

withDefaults(defineProps<ChatEmojisProps>(), {
  selectItem: null,
  activeUpOrDown: null,
})

const emit = defineEmits<ChatEmojisEvents>()
</script>

<template>
  <AutocompleteMenu
    :items="filteredEmojis"
    :item-key="(emoji) => emoji"
    :select-item="selectItem"
    :active-up-or-down="activeUpOrDown"
    layout="horizontal"
    :aria-label="strings['chat.autocomplete.emojis']"
    class="vac-emojis-menu"
    @commit="(emoji) => emit('select-emoji', emoji)"
    @activate-item="emit('activate-item')"
  >
    <template #default="{ item }">
      <div class="vac-emoji-chip">{{ item }}</div>
    </template>
  </AutocompleteMenu>
</template>

<style scoped lang="scss">
.vac-emoji-chip {
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
