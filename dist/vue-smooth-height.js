(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-smooth-height"] = factory();
	else
		root["vue-smooth-height"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var mixin = {
  methods: {
    $smoothReflow: function $smoothReflow(options) {
      var _registerElement = registerElement.bind(this);

      if (Array.isArray(options)) options.forEach(_registerElement);else _registerElement(options);
    },
    $unsmoothReflow: function $unsmoothReflow(options) {
      var _unregisterElement = unregisterElement.bind(this);

      if (Array.isArray(options)) options.forEach(_unregisterElement);else _unregisterElement(options);
    }
  },
  beforeCreate: function beforeCreate() {
    var _this = this;

    this._smoothElements = [];

    this._endListener = function (event) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this._smoothElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var smoothEl = _step.value;
          smoothEl.endListener(event);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    };
  },
  mounted: function mounted() {
    this.$el.addEventListener('transitionend', this._endListener, {
      passive: true
    });
  },
  destroyed: function destroyed() {
    this.$el.removeEventListener('transitionend', this._endListener);
  },
  beforeUpdate: function beforeUpdate() {
    flushRemoved(this);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this._smoothElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var smoothEl = _step2.value;
        smoothEl.setBeforeValues();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  },
  updated: function () {
    var _updated = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, smoothEl;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.$nextTick();

            case 2:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context.prev = 5;

              for (_iterator3 = this._smoothElements[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                smoothEl = _step3.value;
                smoothEl.doSmoothReflow();
              }

              _context.next = 13;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](5);
              _didIteratorError3 = true;
              _iteratorError3 = _context.t0;

            case 13:
              _context.prev = 13;
              _context.prev = 14;

              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }

            case 16:
              _context.prev = 16;

              if (!_didIteratorError3) {
                _context.next = 19;
                break;
              }

              throw _iteratorError3;

            case 19:
              return _context.finish(16);

            case 20:
              return _context.finish(13);

            case 21:
              flushRemoved(this);

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 9, 13, 21], [14,, 16, 20]]);
    }));

    return function updated() {
      return _updated.apply(this, arguments);
    };
  }()
};

function flushRemoved(vm) {
  var i = vm._smoothElements.length;

  while (i--) {
    var smoothEl = vm._smoothElements[i];

    if (smoothEl.isRemoved) {
      smoothEl.stopTransition();

      vm._smoothElements.splice(i, 1);
    }
  }
} // 'this' is vue component


function registerElement() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._smoothElements.push(new SmoothElement(option, this.$el));
} // 'this' is vue component


function unregisterElement(option) {
  var root = this.$el;

  var index = this._smoothElements.findIndex(function (d) {
    return select(root, d.options.el) === select(root, option.el);
  });

  if (index == -1) {
    console.error("VSR_ERROR: $unsmoothReflow failed due to invalid el option");
    return;
  } // Don't remove right away, as it might be in the middle of
  // a doSmoothReflow, and leave the element in a broken state.


  this._smoothElements[index].scheduleRemoval();
}

function select(rootEl, el) {
  if (typeof el === 'string') return rootEl.matches(el) ? rootEl : rootEl.querySelector(el);else return el;
}

var STATES = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE'
};

var SmoothElement =
/*#__PURE__*/
function () {
  function SmoothElement(userOptions, $componentEl) {
    _classCallCheck(this, SmoothElement);

    var options = _objectSpread({
      // Element or selector string.
      // By default it is the $componentEl
      el: $componentEl,
      // Valid values: height, width, transform
      property: 'height',
      // Selector string that will emit a transitionend event.
      // Note that you can specify multiple transitionend
      // event emitters through the use of commas.
      transitionEvent: null,
      // Hide scrollbar during transition.
      hideOverflow: true,
      debug: false
    }, userOptions);

    var properties = this.parsePropertyOption(options.property);

    if (!options.transition) {
      options.transition = properties.map(function (p) {
        return "".concat(p, " .5s");
      }).join(',');
    }

    var internal = {
      $componentEl: $componentEl,
      // Resolved Element from el
      $smoothEl: null,
      // Resolved properties from property
      properties: properties,
      beforeRect: {},
      afterRect: {},
      state: STATES.INACTIVE,
      isRemoved: false
    };
    Object.assign(this, {
      options: options
    }, internal);
    this.endListener = this.endListener.bind(this);
  }

  _createClass(SmoothElement, [{
    key: "transitionTo",
    value: function transitionTo(to) {
      this.state = to;
    }
    /**
    *
    * @param {String|Array} property
    */

  }, {
    key: "parsePropertyOption",
    value: function parsePropertyOption(property) {
      var properties = [];

      if (typeof property === 'string') {
        properties.push(property);
      } else if (Array.isArray(property)) {
        properties = property;
      }

      return properties;
    } // Retrieve registered element on demand
    // El could have been hidden by v-if/v-show

  }, {
    key: "findRegisteredEl",
    value: function findRegisteredEl() {
      var $componentEl = this.$componentEl,
          options = this.options; // $componentEl could be hidden by v-if

      if (!$componentEl) {
        return null;
      }

      return select($componentEl, options.el);
    } // Save the DOM properties of the $smoothEl
    // before the data update

  }, {
    key: "setBeforeValues",
    value: function setBeforeValues() {
      var $smoothEl = this.findRegisteredEl(); // This property could be set by a previous update
      // Reset it so it doesn't affect the current update

      this.afterRect = {};
      var beforeRect = {};

      if ($smoothEl) {
        beforeRect = $smoothEl.getBoundingClientRect();
      }

      this.beforeRect = beforeRect;

      if (this.state === STATES.ACTIVE) {
        this.stopTransition();
        this.debug('Transition was interrupted.');
      }
    }
  }, {
    key: "didValuesChange",
    value: function didValuesChange(beforeRect, afterRect) {
      var b = beforeRect;
      var a = afterRect;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.properties[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var prop = _step4.value;

          if (prop === 'transform' && (b['top'] !== a['top'] || b['left'] !== a['left'])) {
            return true;
          } else if (b[prop] !== a[prop]) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: "doSmoothReflow",
    value: function doSmoothReflow() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data update';
      var $smoothEl = this.findRegisteredEl();

      if (!$smoothEl) {
        this.debug("Could not find registered el.");
        this.transitionTo(STATES.INACTIVE);
        return;
      } // A transition is already occurring, don't interrupt it.


      if (this.state === STATES.ACTIVE) {
        return;
      }

      var beforeRect = this.beforeRect,
          properties = this.properties,
          options = this.options;
      this.$smoothEl = $smoothEl;
      this.transitionTo(STATES.ACTIVE);
      var triggeredBy = typeof event === 'string' ? event : event.target;
      this.debug("Reflow triggered by:", triggeredBy);
      var afterRect = $smoothEl.getBoundingClientRect();
      this.afterRect = afterRect;

      if (!this.didValuesChange(beforeRect, afterRect)) {
        this.debug("Property values did not change.");
        this.transitionTo(STATES.INACTIVE);
        return;
      }

      this.debug('beforeRect', beforeRect);
      this.debug('afterRect', afterRect);
      var computedStyle = window.getComputedStyle($smoothEl);

      if (options.hideOverflow) {
        //save overflow properties before overwriting
        var overflowY = computedStyle.overflowY,
            overflowX = computedStyle.overflowX;
        this.overflowX = overflowX;
        this.overflowY = overflowY;
        $smoothEl.style.overflowX = 'hidden';
        $smoothEl.style.overflowY = 'hidden';
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = properties[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var prop = _step5.value;

          if (prop === 'transform') {
            var invertLeft = beforeRect['left'] - afterRect['left'];
            var invertTop = beforeRect['top'] - afterRect['top'];
            $smoothEl.style.transform = "translate(".concat(invertLeft, "px, ").concat(invertTop, "px)");
          } else {
            $smoothEl.style[prop] = beforeRect[prop] + 'px';
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      $smoothEl.offsetHeight; // Force reflow

      var t = [computedStyle.transition, options.transition].filter(function (d) {
        return d;
      }).join(',');
      $smoothEl.style.transition = t;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = properties[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _prop = _step6.value;

          if (_prop === 'transform') {
            $smoothEl.style.transform = '';
          } else {
            $smoothEl.style[_prop] = afterRect[_prop] + 'px';
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: "endListener",
    value: function endListener(event) {
      var $smoothEl = this.$smoothEl;
      var $targetEl = event.target;
      var properties = this.properties; // Transition on smooth element finished

      if ($smoothEl === $targetEl) {
        // The transition property is one that was registered
        if (properties.includes(event.propertyName)) {
          this.stopTransition(); // Record the height AFTER the data change, but potentially
          // BEFORE any transitionend events.
          // Useful for cases like transition mode="out-in"

          this.setBeforeValues();
        }
      } else if (this.isRegisteredEventEmitter($smoothEl, event)) {
        this.doSmoothReflow(event);
      }
    } // Check if we should perform doSmoothReflow()
    // after a transitionend event.

  }, {
    key: "isRegisteredEventEmitter",
    value: function isRegisteredEventEmitter($smoothEl, event) {
      var $targetEl = event.target;
      var transitionEvent = this.options.transitionEvent;

      if (transitionEvent === null || Object.keys(transitionEvent).length === 0) {
        return false;
      }

      var selector = transitionEvent.selector,
          propertyName = transitionEvent.propertyName;

      if (propertyName != null && propertyName !== event.propertyName) {
        return false;
      } // coerce type to also check for undefined.


      if (selector != null && !$targetEl.matches(selector)) {
        return false;
      } // If the $smoothEl hasn't registered 'transform'
      // then we don't need to act on transitionend
      // events that occur outside the $smoothEl


      if (this.properties.indexOf('transform') === -1) {
        // Checks if $targetEl IS or WAS a descendent
        // of $smoothEl.
        var smoothElContainsTarget = false; // composedPath is missing in ie/edge of course.

        var path = event.composedPath ? event.composedPath() : [];
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = path[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var el = _step7.value;

            if ($smoothEl === el) {
              smoothElContainsTarget = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        if (!smoothElContainsTarget) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "stopTransition",
    value: function stopTransition() {
      var $smoothEl = this.$smoothEl,
          options = this.options,
          overflowX = this.overflowX,
          overflowY = this.overflowY,
          properties = this.properties; // Change prop back to auto

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = properties[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var prop = _step8.value;
          $smoothEl.style[prop] = null;
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      if (options.hideOverflow) {
        // Restore original overflow properties
        $smoothEl.style.overflowX = overflowX;
        $smoothEl.style.overflowY = overflowY;
      } // Clean up inline transition


      $smoothEl.style.transition = null;
      this.transitionTo(STATES.INACTIVE);
    }
  }, {
    key: "scheduleRemoval",
    value: function scheduleRemoval() {
      this.isRemoved = true;
    }
  }, {
    key: "debug",
    value: function debug() {
      var _console;

      if (!this.options.debug) {
        return;
      }

      for (var _len = arguments.length, obj = new Array(_len), _key = 0; _key < _len; _key++) {
        obj[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ["VSR_DEBUG:"].concat(obj));
    }
  }]);

  return SmoothElement;
}();

var _default = mixin;
exports.default = _default;

/***/ })

/******/ });
});
//# sourceMappingURL=vue-smooth-height.js.map