import { describe, it, expect } from 'vitest'
import { pruneKeys } from './prune-keys'

describe('pruneKeys', () => {
  it('removes only undefined values', () => {
    expect(pruneKeys({ a: 1, b: undefined, c: 'hi', d: null })).toEqual({
      a: 1,
      c: 'hi',
      d: null,
    })
  })

  it('returns an empty object for an all-undefined input', () => {
    expect(pruneKeys({ a: undefined, b: undefined })).toEqual({})
  })

  it('returns the original keys when nothing is undefined', () => {
    expect(pruneKeys({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })
})
