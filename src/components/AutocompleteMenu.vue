<script setup lang="ts" generic="T">
import { useAutocomplete } from '../composables/use-autocomplete'

export interface AutocompleteMenuProps<T> {
  /** Items to render. Pass an empty array to hide the menu. */
  items: T[]
  /**
   * Stable per-item key. Avoids re-keying when item identity is stable
   * (e.g. `(user) => user.id`). Defaults to the array index, which is
   * fine for primitive lists like the emoji picker.
   */
  itemKey?: (item: T, index: number) => string | number
  /**
   * When this signal flips truthy, the active item is committed via the
   * `commit` event. The host typically wires this to the Enter key.
   */
  selectItem?: boolean | null
  /**
   * Positive → step forward; negative → step backward. The host wires
   * this to ArrowUp/ArrowDown.
   */
  activeUpOrDown?: number | null
  /**
   * Layout used by the popup. `vertical` is a stacked list (user tags),
   * `horizontal` is a single-row chip strip (emoji suggestions).
   */
  layout?: 'vertical' | 'horizontal'
  /** Accessible name for the listbox. Required to satisfy axe `aria-input-field-name`. */
  ariaLabel?: string
}

export interface AutocompleteMenuEvents<T> {
  /** Fired when the active item is committed. */
  (e: 'commit', item: T): void
  /** Fired after the active index moves via `activeUpOrDown`. */
  (e: 'activate-item'): void
}

const props = withDefaults(defineProps<AutocompleteMenuProps<T>>(), {
  itemKey: undefined,
  selectItem: null,
  activeUpOrDown: null,
  layout: 'vertical',
  ariaLabel: 'Suggestions',
})

const emit = defineEmits<AutocompleteMenuEvents<T>>()

const { activeIndex, setActiveIndex } = useAutocomplete<T>({
  items: () => props.items,
  selectSignal: () => props.selectItem,
  navSignal: () => props.activeUpOrDown,
  onCommit: (item) => emit('commit', item),
  onNavigate: () => emit('activate-item'),
})

const resolveKey = (item: T, index: number): string | number =>
  props.itemKey ? props.itemKey(item, index) : index
</script>

<template>
  <transition name="vac-slide-up">
    <div
      v-if="items.length"
      class="vac-autocomplete-container"
      :class="[`vac-autocomplete-${layout}`]"
      role="listbox"
      :aria-label="ariaLabel"
    >
      <div
        v-for="(item, index) in items"
        :key="resolveKey(item, index)"
        class="vac-autocomplete-item"
        :class="{ 'vac-autocomplete-item-active': index === activeIndex }"
        role="option"
        :aria-selected="index === activeIndex"
        @mouseover="setActiveIndex(index)"
        @click="emit('commit', item)"
      >
        <slot :item="item" :index="index" :active="index === activeIndex" />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.vac-autocomplete-container {
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

  &.vac-autocomplete-vertical {
    flex-direction: column;
    gap: 4px;
  }

  &.vac-autocomplete-horizontal {
    flex-direction: row;
    overflow-x: auto;
  }
}

.vac-autocomplete-item {
  border-radius: 10px;
  cursor: pointer;

  &.vac-autocomplete-item-active,
  &:hover {
    background: var(--chat-footer-bg-color-tag-active);
  }
}
</style>
