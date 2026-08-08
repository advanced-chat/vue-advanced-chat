export type DeepPartial<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T
