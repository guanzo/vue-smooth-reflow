import { STATE } from "../enums"
import { IOptions } from "../interfaces"
import { getBoundingClientRect, IRect, isNull, isUndefined } from "../utils"

export class SmoothElement {
  public static defaultOptions: IOptions = {
    // Element or selector string.
    // If null, VSR will use the component's root el.
    el: null,
    // Valid values: height, width, transform
    property: "height",
    // Selector string that will emit a transitionend event.
    // Note that you can specify multiple transitionend
    // event emitters through the use of commas.
    transitionEvent: null,
    // Hide scrollbar during transition. This should be on 99% of the time.
    hideOverflow: true,
    debug: false
  }

  private static parsePropertyOption(property: string | Array<string>): Array<string> {
    if (typeof property === "string") {
      return [property]
    } else if (Array.isArray(property)) {
      return property
    }
    return []
  }

  private readonly options: IOptions
  private readonly properties: Array<string>

  // Resolved Element from el
  private $smoothEl: HTMLElement = null

  private beforeRect: IRect = {}
  private state: STATE = STATE.INACTIVE
  private isRemoved: boolean = false

  private computedTransition: string
  private overflowX: string
  private overflowY: string

  constructor(userOptions: IOptions) {
    this.options = {...{}, ...SmoothElement.defaultOptions, ...userOptions}
    this.properties = SmoothElement.parsePropertyOption(this.options.property)
    if (!this.options.transition) {
      this.options.transition = this.properties.map((p) => `${p} .5s`).join(",")
    }

    this.endListener = this.endListener.bind(this)
    this.debug = this.debug.bind(this)
  }

  private debug(...args: Array<string | any>): void {
    if (!this.options.debug) {
      return
    }
    args = [`VSR_DEBUG:`].concat(Array.from(arguments))
    // tslint:disable-next-line
    console.log.apply(null, args)
  }

  public setSmoothElement($smoothEl: HTMLElement): void {
    this.$smoothEl = $smoothEl
  }

  private transitionTo(to: STATE): void {
    this.state = to
  }

  // TODO add type of event
  public endListener(event: any): void {
    const {$smoothEl, properties} = this
    const $targetEl = event.target
    // Transition on smooth element finished
    if ($smoothEl === $targetEl) {
      // The transition property is one that was registered
      if (properties.includes(event.propertyName)) {
        this.stopTransition()
        // Record the beforeValues AFTER the data change, but potentially
        // BEFORE any transitionend events.
        if (this.hasRegisteredEventEmitter()) {
          this.setBeforeValues()
        }
      }
    } else if (this.isRegisteredEventEmitter($smoothEl, event)) {
      this.doSmoothReflow(event)
    }
  }

  // Save the DOM properties of the $smoothEl before the data update
  public setBeforeValues(): void {
    const {$smoothEl} = this
    this.beforeRect = {}

    if (!$smoothEl) {
      return
    }

    // getComputedStyle() can return null in iframe
    const {transition, overflowX, overflowY} = window.getComputedStyle($smoothEl) || {transition: null, overflowX: null, overflowY: null}
    this.computedTransition = transition
    // Save overflow values now
    this.overflowX = overflowX
    this.overflowY = overflowY

    this.beforeRect = getBoundingClientRect($smoothEl)

    // Important to stopTransition after we've saved this.beforeRect
    if (this.state === STATE.ACTIVE) {
      this.stopTransition()
      this.debug("Transition was interrupted.")
    }
  }

  private didValuesChange(beforeRect, afterRect): boolean {
    const b = beforeRect
    const a = afterRect
    // There's nothing to transition from.
    if (Object.keys(beforeRect).length === 0) {
      return false
    }
    for (const prop of this.properties) {
      if (prop === "transform" &&
        (b.top !== a.top || b.left !== a.left)) {
        return true
      } else if (b[prop] !== a[prop]) {
        return true
      }
    }
    return false
  }

  public doSmoothReflow(event: Event | string = "data update"): void {
    const {$smoothEl} = this
    if (!$smoothEl) {
      this.debug("Could not find registered el to perform doSmoothReflow.")
      this.transitionTo(STATE.INACTIVE)
      return
    }
    // A transition is already occurring, don't interrupt it.
    if (this.state === STATE.ACTIVE) {
      return
    }
    // TODO: This listener might be necessary if the smoothEl is not rendered inside the component
    // for example if smoothEl is inside a <template></template>
    // https://github.com/guanzo/vue-smooth-reflow/issues/1
    // $smoothEl.addEventListener("transitionend", this.endListener, { passive: true })
    const {beforeRect, properties, options, overflowX, overflowY, debug} = this

    this.transitionTo(STATE.ACTIVE)

    const triggeredBy = (typeof event === "string") ? event : event.target
    debug(`doSmoothReflow triggered by:`, triggeredBy)

    const afterRect = getBoundingClientRect($smoothEl)
    if (!this.didValuesChange(beforeRect, afterRect)) {
      debug(`Property values did not change.`)
      this.transitionTo(STATE.INACTIVE)
      return
    }
    debug("beforeRect", beforeRect)
    debug("afterRect", afterRect)

    this.saveOverflowValues($smoothEl, overflowX, overflowY)

    for (const prop of properties) {
      if (prop === "transform") {
        const invertLeft = beforeRect.left - afterRect.left
        const invertTop = beforeRect.top - afterRect.top
        $smoothEl.style.transform = `translate(${invertLeft}px, ${invertTop}px)`
      } else {
        $smoothEl.style[prop] = beforeRect[prop] + "px"
      }
    }

    // tslint:disable-next-line
    $smoothEl.offsetHeight // Force reflow

    $smoothEl.style.transition = [this.computedTransition, options.transition].filter((d) => d).join(",")

    for (const prop of properties) {
      prop === "transform" ? $smoothEl.style.transform = "" : $smoothEl.style[prop] = afterRect[prop] + "px"
    }

    // Transition is now started.
  }

  private hasRegisteredEventEmitter(): boolean {
    const {transitionEvent} = this.options
    return !isNull(transitionEvent) && Object.keys(transitionEvent).length > 0
  }

  // Check if we should perform doSmoothReflow() after a transitionend event.
  private isRegisteredEventEmitter($smoothEl, event): boolean {
    if (!this.hasRegisteredEventEmitter()) {
      return false
    }

    const $targetEl = event.target
    const {selector, propertyName} = this.options.transitionEvent

    if (!isNull(propertyName) && !isUndefined(propertyName) && propertyName !== event.propertyName) {
      return false
    }

    if (!isNull(selector) && !isUndefined(selector) && !$targetEl.matches(selector)) {
      return false
    }

    // If "transform" isn't a registered property,
    // then we don't need to act on any transitionend
    // events that occur outside the $smoothEl
    if (this.properties.indexOf("transform") === -1) {
      // Checks if $targetEl IS or WAS a descendent of $smoothEl.
      let smoothElContainsTarget = false
      // composedPath is missing in ie/edge of course.
      const path = event.composedPath ? event.composedPath() : []
      for (const el of path) {
        if ($smoothEl === el) {
          smoothElContainsTarget = true
          break
        }
      }
      if (!smoothElContainsTarget) {
        return false
      }
    }
    return true
  }

  private saveOverflowValues($smoothEl: HTMLElement, overflowX: string, overflowY: string): void {
    if (this.options.hideOverflow) {
      // save overflow properties before overwriting
      this.overflowX = overflowX
      this.overflowY = overflowY

      $smoothEl.style.overflowX = "hidden"
      $smoothEl.style.overflowY = "hidden"
    }
  }

  private restoreOverflowValues($smoothEl): void {
    const {options, overflowX, overflowY} = this
    if (options.hideOverflow) {
      // Restore original overflow properties
      $smoothEl.style.overflowX = overflowX
      $smoothEl.style.overflowY = overflowY
    }
  }

  private stopTransition(): void {
    const {$smoothEl, properties} = this
    // Change prop back to auto
    for (const prop of properties) {
      $smoothEl.style[prop] = null
    }

    this.restoreOverflowValues($smoothEl)
    // Clean up inline transition
    $smoothEl.style.transition = null

    this.transitionTo(STATE.INACTIVE)
  }

  public scheduleRemoval(): void {
    this.isRemoved = true
  }

  public getElement(): HTMLElement | string | undefined {
    return this.options.el
  }
}
