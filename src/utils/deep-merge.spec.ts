import { describe, it, expect } from 'vitest'
import { deepMerge } from './deep-merge'

describe('deepMerge', () => {
  it('returns the source when target is empty', () => {
    expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 })
  })

  it('returns the target when source is empty', () => {
    expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 })
  })

  it('overrides primitives in target with source values', () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 99 })).toEqual({ a: 1, b: 99 })
  })

  it('recursively merges nested plain objects', () => {
    const result = deepMerge({ a: { x: 1, y: 2 }, b: 3 }, { a: { y: 20, z: 30 }, c: 4 })
    expect(result).toEqual({ a: { x: 1, y: 20, z: 30 }, b: 3, c: 4 })
  })

  it('replaces arrays rather than merging them', () => {
    const result = deepMerge({ a: [1, 2, 3] }, { a: [9] })
    expect(result.a).toEqual([9])
  })

  it('mutates the target in place and returns it', () => {
    const target = { a: { x: 1 } }
    const result = deepMerge(target, { a: { y: 2 } })
    expect(result).toBe(target)
    expect(target).toEqual({ a: { x: 1, y: 2 } })
  })

  it('merges multiple sources left-to-right', () => {
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })
})
