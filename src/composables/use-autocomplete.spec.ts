import { describe, it, expect, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useAutocomplete } from './use-autocomplete'

const runScope = <T>(fn: () => T): { result: T; dispose: () => void } => {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return { result, dispose: () => scope.stop() }
}

describe('useAutocomplete', () => {
  it('starts with a null active index when items are empty', () => {
    const items = ref<string[]>([])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))
    expect(result.activeIndex.value).toBe(null)
    dispose()
  })

  it('initializes the active index to 0 when items are populated', () => {
    const items = ref(['a', 'b', 'c'])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))
    expect(result.activeIndex.value).toBe(0)
    dispose()
  })

  it('resets the active index when a replacement item list changes length', async () => {
    const items = ref(['a', 'b', 'c'])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))
    result.setActiveIndex(2)
    items.value = ['x']
    await nextTick()
    expect(result.activeIndex.value).toBe(0)
    dispose()
  })

  it('preserves a valid active index when a replacement item list has the same length', async () => {
    const items = ref(['a', 'b', 'c'])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))

    result.setActiveIndex(2)
    items.value = ['x', 'y', 'z']
    await nextTick()

    expect(result.activeIndex.value).toBe(2)
    dispose()
  })

  it('resets the active index for in-place push and splice length changes', async () => {
    const items = ref(['a', 'b', 'c'])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))

    result.setActiveIndex(2)
    items.value.push('d')
    await nextTick()
    expect(result.activeIndex.value).toBe(0)

    result.setActiveIndex(3)
    items.value.splice(1, 2)
    await nextTick()
    expect(result.activeIndex.value).toBe(0)

    items.value.splice(0)
    await nextTick()
    expect(result.activeIndex.value).toBe(null)

    dispose()
  })

  it('navigates and commits against the current list after an in-place length change', async () => {
    const items = ref(['a', 'b'])
    const navSignal = ref<number | null>(null)
    const selectSignal = ref<boolean | null>(null)
    const onCommit = vi.fn()
    const { result, dispose } = runScope(() =>
      useAutocomplete({ items, navSignal, selectSignal, onCommit }),
    )

    result.setActiveIndex(1)
    items.value.push('c')
    await nextTick()
    expect(result.activeIndex.value).toBe(0)

    navSignal.value = 1
    await nextTick()
    expect(result.activeIndex.value).toBe(1)

    selectSignal.value = true
    await nextTick()
    expect(onCommit).toHaveBeenCalledOnce()
    expect(onCommit).toHaveBeenCalledWith('b')

    dispose()
  })

  it('does not traverse item objects while watching the list length', () => {
    const readNestedValue = vi.fn(() => ({ value: 'nested' }))
    const item = Object.defineProperty({ id: 'a' }, 'nested', {
      enumerable: true,
      get: readNestedValue,
    })
    const items = ref([item])
    const { dispose } = runScope(() => useAutocomplete({ items }))

    expect(readNestedValue).not.toHaveBeenCalled()
    dispose()
  })

  it('drops the active index back to null when items become empty', async () => {
    const items = ref(['a'])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))
    items.value = []
    await nextTick()
    expect(result.activeIndex.value).toBe(null)
    dispose()
  })

  it('navSignal moves the active index forward and clamps at the end', async () => {
    const items = ref(['a', 'b', 'c'])
    const navSignal = ref<number | null>(null)
    const { result, dispose } = runScope(() => useAutocomplete({ items, navSignal }))

    navSignal.value = 1
    await nextTick()
    expect(result.activeIndex.value).toBe(1)

    navSignal.value = 2
    await nextTick()
    expect(result.activeIndex.value).toBe(2)

    navSignal.value = 3
    await nextTick()
    expect(result.activeIndex.value).toBe(2)

    dispose()
  })

  it('navSignal moves the active index backward and clamps at the start', async () => {
    const items = ref(['a', 'b', 'c'])
    const navSignal = ref<number | null>(null)
    const { result, dispose } = runScope(() => useAutocomplete({ items, navSignal }))
    result.setActiveIndex(2)

    navSignal.value = -1
    await nextTick()
    expect(result.activeIndex.value).toBe(1)

    navSignal.value = -2
    await nextTick()
    expect(result.activeIndex.value).toBe(0)

    navSignal.value = -3
    await nextTick()
    expect(result.activeIndex.value).toBe(0)

    dispose()
  })

  it('fires onNavigate after each nav-signal step', async () => {
    const items = ref(['a', 'b'])
    const navSignal = ref<number | null>(null)
    const onNavigate = vi.fn()
    const { dispose } = runScope(() => useAutocomplete({ items, navSignal, onNavigate }))

    navSignal.value = 1
    await nextTick()
    navSignal.value = -1
    await nextTick()

    expect(onNavigate).toHaveBeenCalledTimes(2)
    dispose()
  })

  it('selectSignal commits the active item via onCommit', async () => {
    const items = ref(['a', 'b', 'c'])
    const selectSignal = ref<boolean | null>(null)
    const onCommit = vi.fn()
    const { result, dispose } = runScope(() => useAutocomplete({ items, selectSignal, onCommit }))
    result.setActiveIndex(1)

    selectSignal.value = true
    await nextTick()
    expect(onCommit).toHaveBeenCalledTimes(1)
    expect(onCommit).toHaveBeenLastCalledWith('b')

    dispose()
  })

  it('selectSignal toggling false→true→false→true commits twice', async () => {
    const items = ref(['x', 'y'])
    const selectSignal = ref<boolean | null>(false)
    const onCommit = vi.fn()
    const { dispose } = runScope(() => useAutocomplete({ items, selectSignal, onCommit }))

    selectSignal.value = true
    await nextTick()
    selectSignal.value = false
    await nextTick()
    selectSignal.value = true
    await nextTick()

    expect(onCommit).toHaveBeenCalledTimes(2)
    dispose()
  })

  it('does not commit when items are empty', async () => {
    const items = ref<string[]>([])
    const selectSignal = ref<boolean | null>(null)
    const onCommit = vi.fn()
    const { dispose } = runScope(() => useAutocomplete({ items, selectSignal, onCommit }))

    selectSignal.value = true
    await nextTick()

    expect(onCommit).not.toHaveBeenCalled()
    dispose()
  })

  it('setActiveIndex(null) clears the active item', () => {
    const items = ref(['a'])
    const { result, dispose } = runScope(() => useAutocomplete({ items }))
    result.setActiveIndex(null)
    expect(result.activeIndex.value).toBe(null)
    dispose()
  })
})
