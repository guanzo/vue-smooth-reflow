import { select } from "./select"

export function findRegisteredEl($root: HTMLElement, registeredEl: HTMLElement | string): HTMLElement | null {
  // Is an element hidden by v-if
  if (!$root || ($root instanceof Node && $root.nodeType === Node.COMMENT_NODE)) {
    return null
  }
  // Fallback to component root el.
  if (registeredEl === null) {
    return $root
  }
  return select($root, registeredEl)
}
