import Vue from "vue"
import { ComponentOptions } from "vue/types/options"

export interface TransitionEvent {
  selector?: string;
  propertyName?: string;
}

export interface Options {
  el?: Element | string;
  property?: string | Array<string>;
  transition?: string;
  transitionEvent?: TransitionEvent;
  hideOverflow?: boolean;
}

declare const mixin: ComponentOptions<Vue>;

export default mixin;
