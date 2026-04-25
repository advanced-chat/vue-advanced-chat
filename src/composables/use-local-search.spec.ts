import { describe, it, expect, vi } from 'vitest'
import { effectScope, ref } from 'vue'
import { useLocalSearch } from './use-local-search'

const runScope = <T>(fn: () => T): { result: T; dispose: () => void } => {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return { result, dispose: () => scope.stop() }
}

interface Chat {
  id: string
  name: string
}

const seed = (): Chat[] => [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Alicia' },
]

describe('useLocalSearch', () => {
  it('passes items through unchanged when no query is set', () => {
    const items = ref<Chat[]>(seed())
    const { result, dispose } = runScope(() => useLocalSearch<Chat>({ items, field: 'name' }))

    expect(result.filtered.value).toHaveLength(3)
    dispose()
  })

  it('filters items by the configured field', () => {
    const items = ref<Chat[]>(seed())
    const { result, dispose } = runScope(() => useLocalSearch<Chat>({ items, field: 'name' }))

    result.setQuery('al')
    expect(result.filtered.value.map((c) => c.id).sort()).toEqual(['1', '3'])

    dispose()
  })

  it('clears the filter when the query is reset to an empty string', () => {
    const items = ref<Chat[]>(seed())
    const { result, dispose } = runScope(() => useLocalSearch<Chat>({ items, field: 'name' }))

    result.setQuery('al')
    expect(result.filtered.value).toHaveLength(2)

    result.setQuery('')
    expect(result.filtered.value).toHaveLength(3)
    expect(result.query.value).toBe(null)

    dispose()
  })

  it('emits onSearch on every setQuery call', () => {
    const items = ref<Chat[]>([])
    const onSearch = vi.fn()
    const { result, dispose } = runScope(() =>
      useLocalSearch<Chat>({ items, field: 'name', onSearch }),
    )

    result.setQuery('foo')
    result.setQuery('')

    expect(onSearch).toHaveBeenCalledTimes(2)
    expect(onSearch).toHaveBeenNthCalledWith(1, 'foo')
    expect(onSearch).toHaveBeenNthCalledWith(2, '')

    dispose()
  })

  it('passes raw items through when custom is true and never updates the local query', () => {
    const items = ref<Chat[]>(seed())
    const custom = ref(true)
    const onSearch = vi.fn()
    const { result, dispose } = runScope(() =>
      useLocalSearch<Chat>({ items, field: 'name', custom, onSearch }),
    )

    result.setQuery('al')

    expect(result.filtered.value).toHaveLength(3)
    expect(result.query.value).toBe(null)
    expect(onSearch).toHaveBeenCalledWith('al')

    dispose()
  })

  it('reacts when items change after construction', () => {
    const items = ref<Chat[]>([{ id: '1', name: 'Alice' }])
    const { result, dispose } = runScope(() => useLocalSearch<Chat>({ items, field: 'name' }))

    result.setQuery('bo')
    expect(result.filtered.value).toEqual([])

    items.value = [...items.value, { id: '2', name: 'Bob' }]
    expect(result.filtered.value.map((c) => c.id)).toEqual(['2'])

    dispose()
  })
})
