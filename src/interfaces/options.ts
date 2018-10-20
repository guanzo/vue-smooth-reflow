import { ITransitionEvent } from "./transition-event"

export interface IOptions extends ITransitionEvent {
  el?: HTMLElement | string
  property?: string | Array<string>
  transition?: string
  hideOverflow?: boolean
  debug?: boolean
}
