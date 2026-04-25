import { computed, ref, watch, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { toValue } from 'vue'

import type { Id } from '../models'

export interface UseMessageSelectionOptions {
  /** When non-empty, selection mode is enabled. Pass the configured action list. */
  enabled: MaybeRefOrGetter<boolean>
  /** Resets the selection whenever this value changes (e.g. the active chat id). */
  resetKey?: MaybeRefOrGetter<unknown>
  /** Fired when the user explicitly cancels selection. */
  onCancel?: () => void
}

export interface UseMessageSelectionReturn<T extends { id: Id }> {
  /** Currently selected items, in selection order. */
  selected: Ref<T[]>
  /** Convenience predicate for templates: `selectedIds.value.has(id)`. */
  selectedIds: ComputedRef<Set<Id>>
  /** Toggle membership of `item` in the selection. No-op when disabled. */
  toggle: (item: T) => void
  /** Clear the selection without invoking `onCancel`. */
  clear: () => void
  /** Clear the selection and invoke `onCancel` (host-driven cancel button). */
  cancel: () => void
}

/**
 * Tracks the currently selected messages while bulk-selection mode is active.
 * Used by `Chat.vue` and any host that wants to expose multi-select actions
 * (forward, delete, etc.). The composable is generic so consumers can select
 * any id-bearing entity, not just `Message`.
 */
export const useMessageSelection = <T extends { id: Id }>(
  options: UseMessageSelectionOptions,
): UseMessageSelectionReturn<T> => {
  const selected = ref([]) as Ref<T[]>

  const selectedIds = computed(() => new Set(selected.value.map((item) => item.id)))

  if (options.resetKey !== undefined) {
    watch(
      () => toValue(options.resetKey),
      () => {
        selected.value = []
      },
    )
  }

  const toggle = (item: T) => {
    if (!toValue(options.enabled)) return

    if (selectedIds.value.has(item.id)) {
      selected.value = selected.value.filter((existing) => existing.id !== item.id)
    } else {
      selected.value = [...selected.value, item]
    }
  }

  const clear = () => {
    selected.value = []
  }

  const cancel = () => {
    clear()
    options.onCancel?.()
  }

  return { selected, selectedIds, toggle, clear, cancel }
}
