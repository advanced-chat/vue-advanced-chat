export function findParentBySelector(node, selector) {
  while (node && !node.querySelector(selector)) {
      node = node.parentNode
      const element = node.querySelector(selector)
      if (element) return element
  }
  return null
}
