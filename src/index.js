/**
 * Don't use async/await or spread/rest.
 *
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
            let _registerElement = registerElement.bind(this)
            if (Array.isArray(options))
                options.forEach(_registerElement)
            else
                _registerElement(options)
        },
        $unsmoothReflow(options) {
            let _unregisterElement = unregisterElement.bind(this)
            if (Array.isArray(options))
                options.forEach(_unregisterElement)
            else
                _unregisterElement(options)
        },
    },
    beforeCreate() {
        this._smoothElements = []
        this._endListener = event => {
            for (let smoothEl of this._smoothElements) {
                smoothEl.endListener(event)
            }
        }
    },
    mounted() {
        this.$el.addEventListener('transitionend', this._endListener, { passive: true })
    },
    destroyed() {
        this.$el.removeEventListener('transitionend', this._endListener)
    },
    beforeUpdate() {
        flushRemoved(this)
        for (let smoothEl of this._smoothElements) {
            smoothEl.setBeforeValues()
        }
    },
    updated() {
        this.$nextTick(() => {
            for (let smoothEl of this._smoothElements) {
                smoothEl.doSmoothReflow()
            }
            flushRemoved(this)
        })
    }
}

function flushRemoved(vm) {
    let i = vm._smoothElements.length
    while (i--) {
        let smoothEl = vm._smoothElements[i]
        if (smoothEl.isRemoved) {
            smoothEl.stopTransition()
            vm._smoothElements.splice(i, 1)
        }
    }
}

// 'this' is vue component
function registerElement(option = {}) {
    this._smoothElements.push(new SmoothElement(option, this.$el))
}

// 'this' is vue component
function unregisterElement(option) {
    let root = this.$el
    let index = this._smoothElements.findIndex(d => {
        return select(root, d.options.el) === select(root, option.el)
    })
    if (index == -1) {
        console.error("VSR_ERROR: $unsmoothReflow failed due to invalid el option")
        return
    }
    // Don't remove right away, as it might be in the middle of
    // a doSmoothReflow, and leave the element in a broken state.
    this._smoothElements[index].scheduleRemoval()
}

function select(rootEl, el) {
    if (typeof el === 'string')
        return rootEl.matches(el) ? rootEl : rootEl.querySelector(el)
    else
        return el
}

const STATES = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE'
}

class SmoothElement {
    constructor(userOptions, $componentEl) {
        let options = {
            // Element or selector string.
            // By default it is the component's root el.
            el: $componentEl,
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
        Object.assign(options, userOptions)

        let properties = this.parsePropertyOption(options.property)
        if (!options.transition) {
            options.transition = properties.map(p => `${p} .5s`).join(',')
        }

        let internal = {
            $componentEl,
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
    }
    // Retrieve registered element on demand
    // El could have been hidden by v-if/v-show
    findRegisteredEl() {
        let { $componentEl, options } = this
        // $componentEl could be hidden by v-if
        if (!$componentEl) {
            return null
        }
        return select($componentEl, options.el)
    } // Save the DOM properties of the $smoothEl before the data update
    setBeforeValues() {
        let $smoothEl = this.findRegisteredEl()

        this.beforeRect = {}

        if (!$smoothEl){
            return
        }

        let computedStyle = window.getComputedStyle($smoothEl)
        // getComputedStyle() can return null in iframe
        let { transition, overflowX, overflowY } = computedStyle || {}
        this.computedTransition = transition

        // Margin collapse needs to be prevented when calculating beforeRect
        // Setting overflow: 'hidden'|'auto' is just one way to prevent margin collapse
        if (this.options.hideOverflow) {
            //save overflow properties before overwriting
            this.overflowX = overflowX
            this.overflowY = overflowY

            $smoothEl.style.overflowX = 'hidden'
            $smoothEl.style.overflowY = 'hidden'
        }

        this.beforeRect = $smoothEl.getBoundingClientRect()

        // Important to stopTransition after we've saved this.beforeRect
        if (this.state === STATES.ACTIVE) {
            this.stopTransition()
            this.debug('Transition was interrupted.')
        }
    }
    didValuesChange(beforeRect, afterRect) {
        let b = beforeRect
        let a = afterRect
        for (let prop of this.properties) {
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
        let $smoothEl = this.findRegisteredEl()
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
        let { beforeRect, properties, options, debug } = this

        this.$smoothEl = $smoothEl
        this.transitionTo(STATES.ACTIVE)

        let triggeredBy = (typeof event === 'string') ? event : event.target
        debug(`doSmoothReflow triggered by:`, triggeredBy)

        let afterRect = $smoothEl.getBoundingClientRect()
        if (!this.didValuesChange(beforeRect, afterRect)) {
            debug(`Property values did not change.`)
            this.transitionTo(STATES.INACTIVE)
            return
        }
        debug('beforeRect', beforeRect)
        debug('afterRect', afterRect)

        for (let prop of properties) {
            if (prop === 'transform') {
                let invertLeft = beforeRect['left'] - afterRect['left']
                var invertTop = beforeRect['top'] - afterRect['top']
                $smoothEl.style.transform = `translate(${invertLeft}px, ${invertTop}px)`
            } else {
                $smoothEl.style[prop] = beforeRect[prop] + 'px'
            }
        }

        $smoothEl.offsetHeight // Force reflow

        let t = [this.computedTransition, options.transition].filter(d=>d).join(',')
        $smoothEl.style.transition = t

        for (let prop of properties) {
            if (prop === 'transform') {
                $smoothEl.style.transform = ''
            } else {
                $smoothEl.style[prop] = afterRect[prop] + 'px'
            }
        }
    }
    endListener(event) {
        let { $smoothEl } = this
        let $targetEl = event.target
        let { properties } = this
        // Transition on smooth element finished
        if ($smoothEl === $targetEl) {
            // The transition property is one that was registered
            if (properties.includes(event.propertyName)) {
                this.stopTransition()
                // Record the height AFTER the data change, but potentially
                // BEFORE any transitionend events.
                // Useful for cases like transition mode="out-in"
                this.setBeforeValues()
            }
        }
        else if (this.isRegisteredEventEmitter($smoothEl, event)) {
            this.doSmoothReflow(event)
        }
    } // Check if we should perform doSmoothReflow() after a transitionend event.
    isRegisteredEventEmitter($smoothEl, event) {
        let $targetEl = event.target
        let { transitionEvent } = this.options
        if (transitionEvent === null || Object.keys(transitionEvent).length === 0) {
            return false
        }

        let { selector, propertyName } = transitionEvent
        if (propertyName != null && propertyName !== event.propertyName) {
            return false
        }
        // coerce type to also check for undefined.
        if (selector != null && !$targetEl.matches(selector)) {
            return false
        }

        // If the $smoothEl hasn't registered 'transform'
        // then we don't need to act on transitionend
        // events that occur outside the $smoothEl
        if (this.properties.indexOf('transform') === -1) {
            // Checks if $targetEl IS or WAS a descendent
            // of $smoothEl.
            let smoothElContainsTarget = false
            // composedPath is missing in ie/edge of course.
            let path = event.composedPath ? event.composedPath() : []
            for (let el of path) {
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
    stopTransition() {
        let {
            $smoothEl, options, overflowX, overflowY,
            properties,
        } = this
        // Change prop back to auto
        for (let prop of properties) {
            $smoothEl.style[prop] = null
        }
        if (options.hideOverflow) {
            // Restore original overflow properties
            $smoothEl.style.overflowX = overflowX
            $smoothEl.style.overflowY = overflowY
        }
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
        let args = [`VSR_DEBUG:`].concat(Array.from(arguments))
        console.log.apply(null, args)
    }
}

export default mixin
