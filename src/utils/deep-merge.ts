type Plain = Record<string, unknown>

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Deep-merge `sources` into `target` in place. Plain objects are merged
 * recursively; arrays and primitives are replaced (not concatenated).
 *
 * Returns the mutated `target` for fluent use.
 */
export function deepMerge<T extends object>(target: T, ...sources: Array<object>): T {
  if (!sources.length) return target

  const source = sources.shift()

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key of Object.keys(source)) {
      const sourceValue = (source as Plain)[key]

      if (isPlainObject(sourceValue)) {
        const targetValue = (target as Plain)[key]
        if (!isPlainObject(targetValue)) {
          ;(target as Plain)[key] = {}
        }
        deepMerge((target as Plain)[key] as object, sourceValue)
      } else {
        ;(target as Plain)[key] = sourceValue
      }
    }
  }

  return deepMerge(target, ...sources)
}
