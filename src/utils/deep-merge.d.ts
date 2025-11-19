/**
 * Deep merge two objects.
 * Mutates and returns `target`.
 * @param target
 * @param sources
 */
export function deepMerge<T extends object>(target: T, ...sources: object[]): T
