import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

export interface UseAutocompleteOptions<T> {
  /** Reactive list of currently-suggested items. */
  items: MaybeRefOrGetter<T[]>
  /** When this signal flips truthy, the active item is committed via `onCommit`. */
  selectSignal?: MaybeRefOrGetter<boolean | null>
  /** Positive number → step forward; negative → step backward. */
  navSignal?: MaybeRefOrGetter<number | null>
  /** Fired with the active item when `selectSignal` flips truthy. */
  onCommit?: (item: T) => void
  /** Fired after `navSignal` moves the active index. */
  onNavigate?: () => void
}

export interface UseAutocompleteReturn {
  /** Currently highlighted index, or `null` when the list is empty. */
  activeIndex: Readonly<Ref<number | null>>
  /** Manually set the active index (e.g. on hover). */
  setActiveIndex: (index: number | null) => void
}

/**
 * Shared state machine for the floating autocomplete menus that surface
 * emoji and user-tag suggestions in `ChatFooter`. Owns the active-index
 * logic; the host component renders the items and forwards the parent's
 * keyboard signals.
 *
 * The signal-driven shape (rather than direct keyboard handlers) lets
 * the parent component decide which keys mean navigate / commit so the
 * same composable can power user-tag, emoji, slash-command, etc.
 */
export const useAutocomplete = <T>(options: UseAutocompleteOptions<T>): UseAutocompleteReturn => {
  const activeIndex = ref<number | null>(null)

  watch(
    () => toValue(options.items).length,
    (length) => {
      activeIndex.value = length ? 0 : null
    },
    { immediate: true },
  )

  watch(
    () => toValue(options.selectSignal),
    (val) => {
      if (!val || activeIndex.value == null) return

      const items = toValue(options.items)
      const item = items[activeIndex.value]

      if (item !== undefined && options.onCommit) {
        options.onCommit(item)
      }
    },
  )

  watch(
    () => toValue(options.navSignal),
    (direction) => {
      if (!direction || activeIndex.value == null) return

      const items = toValue(options.items)

      if (direction > 0 && activeIndex.value < items.length - 1) {
        activeIndex.value += 1
      }
      if (direction < 0 && activeIndex.value > 0) {
        activeIndex.value -= 1
      }

      options.onNavigate?.()
    },
  )

  return {
    activeIndex,
    setActiveIndex: (index: number | null) => {
      activeIndex.value = index
    },
  }
}
