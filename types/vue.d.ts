import Vue from 'vue';
import { Options } from './vue-smooth-reflow';

declare module 'vue/types/vue' {
  interface Vue {
    $smoothReflow(options?: Options): void;
    $unsmoothReflow(options?: Options): void;
  }
}
