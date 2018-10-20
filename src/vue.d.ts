import Vue from "vue"
import { IOptions } from "./interfaces"

declare module "vue/types/vue" {
  interface Vue {
    $smoothReflow?(options?: IOptions | Array<IOptions>): void
    $unsmoothReflow?(options?: IOptions | Array<IOptions>): void
  }
}
