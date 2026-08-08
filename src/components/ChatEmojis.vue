<script setup lang="ts">
import AutocompleteMenu from './AutocompleteMenu.vue'
import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatEmojisProps {
  /** Emojis matching the active `:` query. Pass an empty array to hide the popup. */
  filteredEmojis: string[]
  /** Truthy edge commits the active emoji. The host typically wires this to Enter. */
  selectItem?: boolean | null
  /** Positive steps forward, negative backward. The host typically wires this to ArrowLeft/ArrowRight. */
  activeUpOrDown?: number | null
  /** ID used to connect the suggestion listbox to the composer combobox. */
  listboxId?: string
}

export interface ChatEmojisEvents {
  /** Fires when the user commits an emoji from the popup. */
  (e: 'select-emoji', emoji: string): void
  /** Fires after the active emoji moves via `activeUpOrDown`. */
  (e: 'activate-item'): void
  /** Reports the active option ID for the owning combobox. */
  (e: 'active-descendant-change', value: string | null): void
}

withDefaults(defineProps<ChatEmojisProps>(), {
  selectItem: null,
  activeUpOrDown: null,
  listboxId: undefined,
})

const emit = defineEmits<ChatEmojisEvents>()
</script>

<template>
  <AutocompleteMenu
    :items="filteredEmojis"
    :item-key="(emoji) => emoji"
    :select-item="selectItem"
    :active-up-or-down="activeUpOrDown"
    :listbox-id="listboxId"
    layout="horizontal"
    :aria-label="strings['chat.autocomplete.emojis']"
    class="vac-emojis-menu"
    @commit="(emoji) => emit('select-emoji', emoji)"
    @activate-item="emit('activate-item')"
    @active-descendant-change="(value) => emit('active-descendant-change', value)"
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
