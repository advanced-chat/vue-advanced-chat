export function translate(key) {
  if (typeof __ === 'function') {
    return __(key)
  }
  console.warn('No translation function found')
  return key
}
