import { onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

export interface UseInfiniteScrollOptions {
  /**
   * Element whose visibility triggers loading (the bottom-of-list
   * sentinel). Accepts a `Ref` (e.g. from `useTemplateRef`) or a
   * lazy getter for elements behind a `v-if`.
   */
  target: MaybeRefOrGetter<HTMLElement | null>
  /**
   * Element used as the `IntersectionObserver` root (the scroll
   * container). Same shape as `target`.
   */
  scrollRoot: MaybeRefOrGetter<HTMLElement | null>
  /** Stops the observer once the consumer has delivered every available item. */
  exhausted: MaybeRefOrGetter<boolean>
  /** Margin around the root, forwarded to IntersectionObserver. Defaults to `100px`. */
  rootMargin?: string
  /** Fired when the sentinel intersects the root. */
  onLoadMore: () => void
}

export interface UseInfiniteScrollReturn {
  /** True between an `onLoadMore` invocation and the consumer flipping `exhausted` or
   *  appending new items (which the host is expected to detect and reset via `setLoading(false)`). */
  loading: Readonly<Ref<boolean>>
  /** Manually toggle the loading flag (e.g. when the host knows new items have arrived). */
  setLoading: (value: boolean) => void
  /** Manually re-attach the observer (the composable already does this when `target`/`scrollRoot` change). */
  reset: () => void
}

/**
 * IntersectionObserver-driven `loadMore` trigger. Re-attaches automatically
 * when the target or scroll root changes, and releases the observer on
 * unmount. The host owns the actual fetch — this composable just decides
 * when to call it.
 */
export const useInfiniteScroll = (options: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const observer = ref<IntersectionObserver | null>(null)
  const loading = ref(false)

  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  const reset = () => {
    disconnect()

    const target = toValue(options.target)
    const scrollRoot = toValue(options.scrollRoot)

    if (!target || !scrollRoot) return

    observer.value = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (loading.value || toValue(options.exhausted)) return

        loading.value = true
        options.onLoadMore()
      },
      { root: scrollRoot, rootMargin: options.rootMargin ?? '100px', threshold: 0 },
    )

    observer.value.observe(target)
  }

  watch([() => toValue(options.target), () => toValue(options.scrollRoot)], reset, {
    immediate: true,
    flush: 'post',
  })

  onBeforeUnmount(disconnect)

  return {
    loading,
    setLoading: (value: boolean) => {
      loading.value = value
    },
    reset,
  }
}
