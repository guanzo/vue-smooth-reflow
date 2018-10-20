export function select($root: HTMLElement, el: HTMLElement | string): HTMLElement | null {
  if (typeof el === "string") {
    return $root.matches(el) ? $root : $root.querySelector(el)
  } else {
    return el
  }
}
