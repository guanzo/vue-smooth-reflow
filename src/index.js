/**
 * The general flow is:
 *
 * 1. Save element DOM state in beforeUpdate()
 * 2. Get element DOM state in updated()
 * 3. Animate the diff in doSmoothReflow()
 * 4. Listen for transitionend event in endListener().
 * 5. If the event matches the user's event filters, Go back to #1
 */

const mixin = {
    methods: {
        $smoothReflow(options) {
            const _registerElement = registerElement.bind(this)
            if (Array.isArray(options))
                options.forEach(_registerElement)
            else
                _registerElement(options)
        },
        $unsmoothReflow(options) {
            const _unregisterElement = unregisterElement.bind(this)
            if (Array.isArray(options))
                options.forEach(_unregisterElement)
            else
                _unregisterElement(options)
        },
    },
    beforeMount() {
        this._smoothElements = []

        this._endListener = event => {
            for (const smoothEl of this._smoothElements) {
                smoothEl.endListener(event)
            }
        }
    },
    mounted() {
        this.$el.addEventListener('transitionend', this._endListener, { passive: true })
    },
    destroyed() {
        this.$el.removeEventListener('transitionend', this._endListener, { passive: true })
    },
    beforeUpdate() {
        // The component $el can be null during mounted, if it's hidden by a falsy v-if
        // Duplicate event listeners are ignored, so it's safe to add this listener multiple times.
        this.$el.addEventListener('transitionend', this._endListener, { passive: true })
        flushRemoved(this)
        // Retrieve component element on demand
        // It could have been hidden by v-if/v-show
        for (const smoothEl of this._smoothElements) {
            const $smoothEl = findRegisteredEl(this.$el, smoothEl.options.el)
            smoothEl.setSmoothElement($smoothEl)
            smoothEl.setBeforeValues()
        }
    },
    updated() {
        this.$nextTick(() => {
            // Retrieve component element on demand
            // It could have been hidden by v-if/v-show
            for (const smoothEl of this._smoothElements) {
                const $smoothEl = findRegisteredEl(this.$el, smoothEl.options.el)
                smoothEl.setSmoothElement($smoothEl)
                smoothEl.doSmoothReflow()
            }
            flushRemoved(this)
        })
    }
}

function flushRemoved(vm) {
    let i = vm._smoothElements.length
    while (i--) {
        const smoothEl = vm._smoothElements[i]
        if (smoothEl.isRemoved) {
            smoothEl.stopTransition()
            vm._smoothElements.splice(i, 1)
        }
    }
}

// 'this' is vue component
function registerElement(option = {}) {
    this._smoothElements.push(new SmoothElement(option))
}

// 'this' is vue component
// If no 'el' was pass during registration, then we register the root element.
function unregisterElement(option = defaultOptions()) {
    const root = this.$el
    const index = this._smoothElements.findIndex(smoothEl => {
        return findRegisteredEl(root, smoothEl.options.el) === findRegisteredEl(root, option.el)
    })
    if (index === -1) {
        console.error("VSR_ERROR: $unsmoothReflow failed due to invalid el option")
        return
    }
    // Don't remove right away, as it might be in the middle of
    // a doSmoothReflow, and leave the element in a broken state.
    this._smoothElements[index].scheduleRemoval()
}

function findRegisteredEl($root, registeredEl) {
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

function select($root, el) {
    if (typeof el === 'string')
        return $root.matches(el) ? $root : $root.querySelector(el)
    else
        return el
}

const STATES = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE'
}

const defaultOptions = () => {
    return {
        // Element or selector string.
        // If null, VSR will use the component's root el.
        el: null,
        // Valid values: height, width, transform
        property: 'height',
        // Selector string that will emit a transitionend event.
        // Note that you can specify multiple transitionend
        // event emitters through the use of commas.
        transitionEvent: null,
        // Hide scrollbar during transition. This should be on 99% of the time.
        hideOverflow: true,
        debug: false,
    }
}

class SmoothElement {
    constructor(userOptions) {
        const options = defaultOptions()
        Object.assign(options, userOptions)

        const properties = this.parsePropertyOption(options.property)
        if (!options.transition) {
            options.transition = properties.map(p => `${p} .5s`).join(',')
        }

        const internal = {
            // Resolved Element from el
            $smoothEl: null,
            // Resolved properties from property
            properties,
            beforeRect: {},
            state: STATES.INACTIVE,
            isRemoved: false
        }
        Object.assign(this, { options }, internal)

        this.endListener = this.endListener.bind(this)
        this.debug = this.debug.bind(this)
    }
    setSmoothElement($smoothEl) {
        this.$smoothEl = $smoothEl
    }
    transitionTo(to) {
        this.state = to
    }
    parsePropertyOption(property) {
        if (typeof property === 'string') {
            return [property]
        } else if (Array.isArray(property)) {
            return property
        }
        return []
    } // Save the DOM properties of the $smoothEl before the data update
    setBeforeValues() {
        const { $smoothEl } = this
        this.beforeRect = {}

        if (!$smoothEl){
            return
        }

        const computedStyle = window.getComputedStyle($smoothEl)
        // getComputedStyle() can return null in iframe
        const { transition, overflowX, overflowY } = computedStyle || {}
        this.computedTransition = transition
        // Save overflow values now
        this.overflowX = overflowX
        this.overflowY = overflowY

        this.beforeRect = getBoundingClientRect($smoothEl)

        // Important to stopTransition after we've saved this.beforeRect
        if (this.state === STATES.ACTIVE) {
            this.stopTransition()
            this.debug('Transition was interrupted.')
        }
    }
    didValuesChange(beforeRect, afterRect) {
        const b = beforeRect
        const a = afterRect
        // There's nothing to transition from.
        if (Object.keys(beforeRect).length === 0) {
            return false
        }
        for (const prop of this.properties) {
            if (prop === 'transform' &&
                    (b['top'] !== a['top'] || b['left'] !== a['left'])) {
                return true
            } else if (b[prop] !== a[prop]) {
                return true
            }
        }
        return false
    }
    doSmoothReflow(event = 'data update') {
        const { $smoothEl } = this
        if (!$smoothEl) {
            this.debug("Could not find registered el to perform doSmoothReflow.")
            this.transitionTo(STATES.INACTIVE)
            return
        }
        // A transition is already occurring, don't interrupt it.
        if (this.state === STATES.ACTIVE) {
            return
        }
        // TODO: This listener might be necessary if the smoothEl is not rendered inside the component
        // for example if smoothEl is inside a <template></template>
        // https://github.com/guanzo/vue-smooth-reflow/issues/1
        //$smoothEl.addEventListener('transitionend', this.endListener, { passive: true })
        const { beforeRect, properties, options, overflowX, overflowY, debug } = this

        this.transitionTo(STATES.ACTIVE)

        const triggeredBy = (typeof event === 'string') ? event : event.target
        debug(`doSmoothReflow triggered by:`, triggeredBy)

        const afterRect = getBoundingClientRect($smoothEl)
        if (!this.didValuesChange(beforeRect, afterRect)) {
            debug(`Property values did not change.`)
            this.transitionTo(STATES.INACTIVE)
            return
        }
        debug('beforeRect', beforeRect)
        debug('afterRect', afterRect)

        this.saveOverflowValues($smoothEl, overflowX, overflowY)

        for (const prop of properties) {
            if (prop === 'transform') {
                const invertLeft = beforeRect['left'] - afterRect['left']
                var invertTop = beforeRect['top'] - afterRect['top']
                $smoothEl.style.transform = `translate(${invertLeft}px, ${invertTop}px)`
            } else {
                $smoothEl.style[prop] = beforeRect[prop] + 'px'
            }
        }

        $smoothEl.offsetHeight // Force reflow

        $smoothEl.style.transition = [this.computedTransition, options.transition].filter(d=>d).join(',')

        for (const prop of properties) {
            if (prop === 'transform') {
                $smoothEl.style.transform = ''
            } else {
                $smoothEl.style[prop] = afterRect[prop] + 'px'
            }
        }

        // Transition is now started.
    }
    endListener(event) {
        const { $smoothEl, properties } = this
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
        }
        else if (this.isRegisteredEventEmitter($smoothEl, event)) {
            this.doSmoothReflow(event)
        }
    }
    hasRegisteredEventEmitter() {
        const { transitionEvent } = this.options
        return transitionEvent !== null && Object.keys(transitionEvent).length > 0
    }
    // Check if we should perform doSmoothReflow() after a transitionend event.
    isRegisteredEventEmitter($smoothEl, event) {
        if (!this.hasRegisteredEventEmitter()) {
            return false
        }
        const $targetEl = event.target
        const { selector, propertyName } = this.options.transitionEvent
        if (propertyName != null && propertyName !== event.propertyName) {
            return false
        }
        // '!= null' coerces the type to also check for undefined.
        if (selector != null && !$targetEl.matches(selector)) {
            return false
        }

        // If 'transform' isn't a registered property,
        // then we don't need to act on any transitionend
        // events that occur outside the $smoothEl
        if (this.properties.indexOf('transform') === -1) {
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
    saveOverflowValues($smoothEl, overflowX, overflowY) {
        if (this.options.hideOverflow) {
            //save overflow properties before overwriting
            this.overflowX = overflowX
            this.overflowY = overflowY

            $smoothEl.style.overflowX = 'hidden'
            $smoothEl.style.overflowY = 'hidden'
        }
    }
    restoreOverflowValues($smoothEl) {
        const { options, overflowX, overflowY } = this
        if (options.hideOverflow) {
            // Restore original overflow properties
            $smoothEl.style.overflowX = overflowX
            $smoothEl.style.overflowY = overflowY
        }
    }
    stopTransition() {
        const { $smoothEl, properties } = this
        // Change prop back to auto
        for (const prop of properties) {
            $smoothEl.style[prop] = null
        }

        this.restoreOverflowValues($smoothEl)
        // Clean up inline transition
        $smoothEl.style.transition = null

        this.transitionTo(STATES.INACTIVE)
    }
    scheduleRemoval() {
        this.isRemoved = true
    }
    debug() {
        if (!this.options.debug) {
            return
        }
        const args = [`VSR_DEBUG:`].concat(Array.from(arguments))
        console.log.apply(null, args)
    }
}

// Converts DOMRect into plain object.
// Overflow is temporarily forced to 'hidden' to prevent margin collapse,
// and receive an accurate height/width value.
const getBoundingClientRect = $el => {
    $el.style.overflow = 'hidden'
    const { top, right, bottom, left, width, height, x, y } = $el.getBoundingClientRect()
    $el.style.overflow = null
    return { top, right, bottom, left, width, height, x, y }
}

// Element.matches polyfill: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
if (typeof Element !== 'undefined' && Element.prototype && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}


export default mixin
