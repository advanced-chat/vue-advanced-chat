import { computed, ref, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { toValue } from 'vue'

import filterItems from '../utils/filter-items'

export interface UseLocalSearchOptions<T> {
  /** Items to filter. */
  items: MaybeRefOrGetter<T[]>
  /** Item field to match against (e.g. `'name'`). */
  field: keyof T
  /**
   * When `true`, `query` is exposed and emitted but the local list is
   * passed through unfiltered — the host renders server-driven results.
   */
  custom?: MaybeRefOrGetter<boolean>
  /** Fired with the current query on every change (after `null`-to-empty conversion). */
  onSearch?: (query: string) => void
}

export interface UseLocalSearchReturn<T> {
  /** Current search query. `null` means no filter is active. */
  query: Ref<string | null>
  /** Filtered items, or the raw input when `custom` is true. */
  filtered: ComputedRef<T[]>
  /** Update the query and forward it via `onSearch`. */
  setQuery: (value: string) => void
}

/**
 * Wraps the project's tiny `filterItems` helper in a reactive composable
 * with the custom-search escape hatch already plumbed in. Used by `Chats`
 * for chat-list search and reusable for other id-bearing collections.
 */
export const useLocalSearch = <T>(options: UseLocalSearchOptions<T>): UseLocalSearchReturn<T> => {
  const query = ref<string | null>(null)

  const filtered = computed<T[]>(() => {
    const items = toValue(options.items) ?? []

    if (toValue(options.custom)) return items

    return filterItems(items, options.field, query.value)
  })

  const setQuery = (value: string) => {
    if (!toValue(options.custom)) {
      query.value = value || null
    }

    options.onSearch?.(value)
  }

  return { query, filtered, setQuery }
}
