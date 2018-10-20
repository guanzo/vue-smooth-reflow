// Converts DOMRect into plain object.
// Overflow is temporarily forced to "hidden" to prevent margin collapse,
// and receive an accurate height/width value.
export interface IRect {
  top?: number
  right?: number
  bottom?: number
  left?: number
  width?: number
  height?: number
  x?: number
  y?: number
}

export function getBoundingClientRect($el): IRect {
  $el.style.overflow = "hidden"
  const {top, right, bottom, left, width, height, x, y} = $el.getBoundingClientRect()
  $el.style.overflow = null
  return {top, right, bottom, left, width, height, x, y}
}
