import dompurify from 'dompurify'

export function sanitize(html) {
  return !html || !html.length ? '' : dompurify.sanitize(html)
}
