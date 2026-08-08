import { describe, it, expect, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useMessageSelection } from './use-message-selection'

const runScope = <T>(fn: () => T): { result: T; dispose: () => void } => {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return { result, dispose: () => scope.stop() }
}

interface Item {
  id: string
}

describe('useMessageSelection', () => {
  it('toggles items in and out of the selection by id', () => {
    const enabled = ref(true)
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled }))

    result.toggle({ id: 'a' })
    result.toggle({ id: 'b' })
    expect(result.selected.value.map((i) => i.id)).toEqual(['a', 'b'])
    expect(result.selectedIds.value.has('a')).toBe(true)

    result.toggle({ id: 'a' })
    expect(result.selected.value.map((i) => i.id)).toEqual(['b'])
    expect(result.selectedIds.value.has('a')).toBe(false)

    dispose()
  })

  it('toggle is a no-op when enabled is false', () => {
    const enabled = ref(false)
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled }))

    result.toggle({ id: 'a' })
    expect(result.selected.value).toEqual([])

    dispose()
  })

  it('reacts to enabled flipping after construction', () => {
    const enabled = ref(false)
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled }))

    result.toggle({ id: 'a' })
    expect(result.selected.value).toEqual([])

    enabled.value = true
    result.toggle({ id: 'a' })
    expect(result.selected.value.map((i) => i.id)).toEqual(['a'])

    dispose()
  })

  it('clears the selection when the resetKey changes', async () => {
    const enabled = ref(true)
    const resetKey = ref('chat-1')
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled, resetKey }))

    result.toggle({ id: 'a' })
    expect(result.selected.value).toHaveLength(1)

    resetKey.value = 'chat-2'
    await nextTick()
    expect(result.selected.value).toEqual([])

    dispose()
  })

  it('clear empties the selection without invoking onCancel', () => {
    const onCancel = vi.fn()
    const enabled = ref(true)
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled, onCancel }))

    result.toggle({ id: 'a' })
    result.clear()

    expect(result.selected.value).toEqual([])
    expect(onCancel).not.toHaveBeenCalled()

    dispose()
  })

  it('cancel clears the selection and invokes onCancel exactly once', () => {
    const onCancel = vi.fn()
    const enabled = ref(true)
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled, onCancel }))

    result.toggle({ id: 'a' })
    result.cancel()

    expect(result.selected.value).toEqual([])
    expect(onCancel).toHaveBeenCalledTimes(1)

    dispose()
  })

  it('selectedIds reflects the current selection', () => {
    const enabled = ref(true)
    const { result, dispose } = runScope(() => useMessageSelection<Item>({ enabled }))

    result.toggle({ id: 'a' })
    result.toggle({ id: 'b' })

    expect(result.selectedIds.value.has('a')).toBe(true)
    expect(result.selectedIds.value.has('b')).toBe(true)
    expect(result.selectedIds.value.has('c')).toBe(false)

    dispose()
  })
})
