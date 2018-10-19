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

declare const mixin: {
  methods: {
    $smoothReflow(options?: Options): void;
    $unsmoothReflow(options?: Options): void;
  };
  beforeMount(): void;
  mounted(): void;
  destroyed(): void;
  beforeUpdate(): void;
  updated(): void;
};

export default mixin;
