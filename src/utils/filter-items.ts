const formatString = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/**
 * Filter `items` by matching the given `prop` against `query`. Comparison is
 * case-insensitive and ignores diacritics. By default `query` matches as a
 * substring; pass `startsWith=true` to anchor at the start.
 */
export default function filterItems<T>(
  items: T[],
  prop: keyof T,
  query: string | null | undefined,
  startsWith = false,
): T[] {
  if (!query) return items

  const needle = formatString(query)

  return items.filter((item) => {
    const haystack = formatString(item[prop])
    return startsWith ? haystack.startsWith(needle) : haystack.includes(needle)
  })
}
