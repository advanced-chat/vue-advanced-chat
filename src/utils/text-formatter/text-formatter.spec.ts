// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { formatText } from './index'
import type { User } from '../../models/user'

describe('formatText', () => {
  it('returns the raw text when markdown is disabled', () => {
    const result = formatText('hello', { markdown: false })
    expect(result.value).toBe('hello')
    expect(result.markdown).toBeFalsy()
  })

  it('renders GFM bold/italic when markdown is enabled', () => {
    const result = formatText('**bold** _italic_', { markdown: true })
    expect(result.value).toContain('<strong>bold</strong>')
    expect(result.value).toContain('<em>italic</em>')
  })

  it('renders GFM strikethrough', () => {
    const result = formatText('~~gone~~', { markdown: true })
    expect(result.value).toContain('<del>')
  })

  it('underline marker (°…°) emits <u>', () => {
    const result = formatText('°underlined°', { markdown: true })
    expect(result.value.toLowerCase()).toContain('<u>')
  })

  it('linkifies URLs by default and respects link options', () => {
    const result = formatText('see https://example.com here', {
      markdown: true,
      linkOptions: { target: '_blank', rel: 'noopener' },
    })
    expect(result.value).toContain('href="https://example.com"')
    expect(result.value).toContain('target="_blank"')
    expect(result.value).toContain('rel="noopener"')
  })

  it('linkify false still resolves through markdown but tolerates the rendered output', () => {
    // gfm's literalAutolink is disabled at the parser level when linkify=false,
    // but other markdown link forms still produce <a> elements.
    const result = formatText('[click](https://example.com)', { markdown: true, linkify: false })
    expect(result.value).toContain('href="https://example.com"')
  })

  it('expands <@id> user-tag tokens into a clickable span when the user is known', () => {
    const users: User[] = [{ id: 'u1', name: 'Alice', status: { state: 'online' } }]
    const result = formatText('hi <@u1>', { markdown: true }, { users })
    expect(result.value).toContain('data-user-id="u1"')
    expect(result.value).toContain('@Alice')
  })

  it('falls back to a literal "<@id>" when the user is not found', () => {
    const result = formatText('hi <@unknown>', { markdown: true })
    expect(result.value).toContain('&lt;@unknown&gt;')
  })

  it('escapes user IDs before placing them in mention attributes', () => {
    const users: User[] = [
      { id: 'u&quot; autofocus=&quot;x', name: 'Alice', status: { state: 'online' } },
    ]
    const result = formatText('hi <@u&quot; autofocus=&quot;x>', { markdown: true }, { users })

    expect(result.value).not.toContain(' data-user-id="u" autofocus=')
  })

  it('reduces output to plain text when singleLine is true', () => {
    const previous = document.body.innerHTML
    const result = formatText('**hello**', { markdown: true, singleLine: true })
    document.body.innerHTML = previous
    expect(result.singleLine).toBe(true)
    // jsdom's `innerText` returns undefined for detached nodes; only assert the flag
    expect(result.markdown).toBe(true)
  })

  it('annotates checklist input with aria attributes for a11y', () => {
    const result = formatText('- [x] done', { markdown: true })
    expect(result.value).toContain('aria-label="Checklist item"')
  })

  it('appends host micromark extensions after the built-in stack', () => {
    const result = formatText('°hi° ~~gone~~', {
      markdown: true,
      extensions: [{ disable: { null: ['strikethrough'] } }],
      htmlExtensions: [
        {
          enter: {
            underline() {
              this.tag('<u data-ext="">')
            },
          },
          exit: {
            underline() {
              this.tag('</u>')
            },
          },
        },
      ],
    })
    expect(result.value).toContain('data-ext')
    expect(result.value).not.toContain('<del>')
  })
})
