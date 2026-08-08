import { describe, it, expect } from 'vitest'
import filterItems from './filter-items'

describe('filterItems', () => {
  const items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Élise' }, { name: 'Charlie' }]

  it('returns the input unchanged when value is null/undefined/empty', () => {
    expect(filterItems(items, 'name', null)).toBe(items)
    expect(filterItems(items, 'name', undefined)).toBe(items)
    expect(filterItems(items, 'name', '')).toBe(items)
  })

  it('matches case-insensitively by substring by default', () => {
    expect(filterItems(items, 'name', 'lice')).toEqual([{ name: 'Alice' }])
  })

  it('strips diacritics on both sides of the comparison', () => {
    expect(filterItems(items, 'name', 'elise')).toEqual([{ name: 'Élise' }])
    expect(filterItems(items, 'name', 'Élise')).toEqual([{ name: 'Élise' }])
  })

  it('uses startsWith mode when requested', () => {
    expect(filterItems(items, 'name', 'b', true)).toEqual([{ name: 'Bob' }])
    expect(filterItems(items, 'name', 'lice', true)).toEqual([])
  })
})
