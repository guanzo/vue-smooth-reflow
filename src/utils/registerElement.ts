import { SmoothElement } from "../classes"
import { IOptions } from "../interfaces"

// "this" is vue component
export function registerElement(option: IOptions = {}): void {
  this._smoothElements.push(new SmoothElement(option))
}
