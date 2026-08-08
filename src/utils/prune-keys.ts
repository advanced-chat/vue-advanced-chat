export const pruneKeys = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined)) as Partial<T>
