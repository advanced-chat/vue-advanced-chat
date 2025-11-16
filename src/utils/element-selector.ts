export function findParentBySelector(
  node: Node | null,
  selector: string
): Element | null {
  let current: Node | null = node

  while (current instanceof Element) {
    const match = current.querySelector(selector)
    if (match) return match

    current = current.parentNode
  }

  return null
}
