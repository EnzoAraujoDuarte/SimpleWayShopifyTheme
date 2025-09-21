// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"api/product.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Product API component
 *
 * @module product
 */
var component = {
  // Cache configuration
  CACHE_CONFIG: {
    MAX_SIZE: 50000,
    // Maximum size in characters for cached items
    EXPIRY_TIME: 1800000,
    // 30 minutes in milliseconds
    PREFIX: 'product_cache_'
  },
  /**
   * Initialize the product component
   * 
   * @returns {void}
   */
  init: function init() {
    /**
     * Product module api
     * 
     * @global
     */
    window.theme.product = component;

    // Clean expired cache entries on init
    component.cleanExpiredCache();
  },
  /**
   * Load product object by handle
   * 
   * @public
   * @method
   * @name loadProduct
   * 
   * @param {string} handle - Product handle
   * @param {boolean} [force=false] - Force load from server, bypassing cache
   * @returns {Promise<Object>} Promise object represents a product
   * @throws {Error} When handle is not provided or invalid
   */
  loadProduct: function loadProduct(handle) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!handle || typeof handle !== 'string') {
      return Promise.reject(new Error('Invalid product handle'));
    }
    return new Promise(function (resolve, reject) {
      try {
        var cache = !force && component.getCache(handle);
        if (cache) {
          resolve(cache);
        } else {
          component.loadProductDataFromShopify(handle).then(function (product) {
            var data = component.normalizeData(product);
            component.cache(data.product);
            resolve(data.product);
          }).catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * Load product data from Shopify
   * 
   * This function loads product data through the custom product JSON template
   * 
   * @private
   * @method
   * @name loadProductDataFromShopify
   * 
   * @param {string} handle - Product handle
   * @returns {Promise<Object>} Promise object represents a product
   * @throws {Error} When the API request fails
   */
  loadProductDataFromShopify: function loadProductDataFromShopify(handle) {
    return new Promise(function (resolve, reject) {
      var url = "/products/".concat(handle, "?view=json");
      fetch(url).then(function (resp) {
        if (!resp.ok) {
          throw new Error("HTTP error! status: ".concat(resp.status));
        }
        return resp.json();
      }).then(function (productData) {
        if (!productData) {
          throw new Error('No product data received');
        }
        resolve(productData);
      }).catch(function (error) {
        reject(new Error("Failed to load product data: ".concat(error.message)));
      });
    });
  },
  /**
   * Normalize product data
   * 
   * @private
   * @method
   * @name normalizeData
   * @param {object} data - Request data
   * @param {object} data.product - Product object
   * @param {array} [data.options_with_values] - Product options with values
   * @param {object} [data.options_by_name] - Product options indexed by name
   * @param {array} [data.product_metafields] - Product metafields
   * @returns {object} Normalized data
   * @throws {Error} When required product data is missing
   */
  normalizeData: function normalizeData(data) {
    if (!data || !data.product) {
      throw new Error('Invalid product data structure');
    }
    var normalizedData = {
      product: _objectSpread({}, data.product)
    };

    // Fix options
    if (data.options_with_values) {
      normalizedData.product.options = data.options_with_values;
    }

    // Add options by name
    if (data.options_by_name) {
      normalizedData.product.options_by_name = data.options_by_name;
    }

    // Product metafields
    if (data.product_metafields) {
      normalizedData.product.metafields = data.product_metafields;
    }

    // Set product URL
    normalizedData.product.url = "".concat(window.location.origin, "/products/").concat(normalizedData.product.handle);
    return normalizedData;
  },
  /**
   * Cache a product data
   * 
   * @private
   * @method
   * @name cache
   * @param {object} product - Product data
   * @returns {boolean} Whether caching was successful
   */
  cache: function cache(product) {
    if (!(product !== null && product !== void 0 && product.handle)) {
      return false;
    }
    var cacheKey = "".concat(component.CACHE_CONFIG.PREFIX).concat(product.handle);
    var cacheData = {
      data: product,
      timestamp: Date.now()
    };
    try {
      var productValue = JSON.stringify(cacheData);
      if (productValue.length < component.CACHE_CONFIG.MAX_SIZE) {
        sessionStorage.setItem(cacheKey, productValue);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to cache product:', error);
      return false;
    }
  },
  /**
   * Get product from cache
   * 
   * @private
   * @method
   * @name getCache
   * @param {string} handle - Product handle
   * @returns {object|null} Cached product data or null if not found/expired
   */
  getCache: function getCache(handle) {
    try {
      var cacheKey = "".concat(component.CACHE_CONFIG.PREFIX).concat(handle);
      var cachedValue = sessionStorage.getItem(cacheKey);
      if (!cachedValue) {
        return null;
      }
      var cacheData = JSON.parse(cachedValue);
      var now = Date.now();

      // Check if cache has expired
      if (now - cacheData.timestamp > component.CACHE_CONFIG.EXPIRY_TIME) {
        sessionStorage.removeItem(cacheKey);
        return null;
      }
      return cacheData.data;
    } catch (error) {
      console.warn('Failed to retrieve cache:', error);
      return null;
    }
  },
  /**
   * Clean expired cache entries
   * 
   * @private
   * @method
   * @name cleanExpiredCache
   */
  cleanExpiredCache: function cleanExpiredCache() {
    try {
      var now = Date.now();
      Object.keys(sessionStorage).forEach(function (key) {
        if (key.startsWith(component.CACHE_CONFIG.PREFIX)) {
          try {
            var cacheData = JSON.parse(sessionStorage.getItem(key));
            if (now - cacheData.timestamp > component.CACHE_CONFIG.EXPIRY_TIME) {
              sessionStorage.removeItem(key);
            }
          } catch (error) {
            // Remove invalid cache entries
            sessionStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to clean cache:', error);
    }
  },
  /**
   * Get variant data by ID from a product
   * 
   * @public
   * @method
   * @name getVariant
   * @param {number} variantId - The ID of the variant to find
   * @param {object} product - Product data containing variants array
   * @returns {object|null} The matching variant object or null if not found
   */
  getVariant: function getVariant(variantId, product) {
    var _product$variants;
    if (!(product !== null && product !== void 0 && (_product$variants = product.variants) !== null && _product$variants !== void 0 && _product$variants.length) || !variantId) {
      return null;
    }
    return product.variants.find(function (variant) {
      return variant.id === Number(variantId);
    }) || null;
  }
};
var _default = exports.default = component;
},{}],"api/cart.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Cart Module
 * 
 * This module provides a comprehensive interface for cart operations in a Shopify store.
 * It handles all cart-related functionality including fetching, adding, updating, and removing items.
 * All methods dispatch custom events that can be listened to for cart state changes.
 * 
 * Events dispatched:
 * - 'addtocart': When an item is added to cart
 * - 'update': When cart items are updated
 * - 'remove': When an item is removed from cart
 * 
 * @module cart
 */
var component = {
  /**
   * Initialize the cart module
   * Sets up the cart component in the global theme object
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.cart = component;

    // Listen for cart events to invalidate cache
    ['addtocart', 'update', 'remove', 'cart:change'].forEach(function (eventName) {
      window.addEventListener(eventName, function () {
        return component._clearCache();
      });
    });
  },
  /**
   * Fetch current cart data from Shopify
   * @returns {Promise<Object>} The cart data containing items, total price, and other cart information
   * @throws {Error} If the request fails or returns an error status
   * @example
   * cart.get().then(cartData => {
   *     console.log('Cart items:', cartData.items);
   *     console.log('Total price:', cartData.total_price);
   * });
   */
  get: function () {
    var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var response, _data, error;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch('/cart.js', {
              credentials: 'same-origin'
            });
          case 3:
            response = _context.sent;
            _context.next = 6;
            return response.json();
          case 6:
            _data = _context.sent;
            if (response.ok) {
              _context.next = 11;
              break;
            }
            error = new Error(_data.description || 'Failed to fetch cart');
            error.status = response.status;
            throw error;
          case 11:
            return _context.abrupt("return", _data);
          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            console.error('Error fetching cart:', _context.t0);
            throw _context.t0;
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 14]]);
    }));
    function get() {
      return _get.apply(this, arguments);
    }
    return get;
  }(),
  /**
   * Add a product to the cart
   * Dispatches 'addtocart' event on successful addition
   * 
   * @param {number|string} id - Shopify variant ID
   * @param {number} [qty=1] - Quantity to add, defaults to 1
   * @param {Object} [properties=null] - Additional line item properties
   * @returns {Promise<Object>} The updated cart item data
   * @throws {Error} If the request fails or returns an error status
   * @example
   * // Add 2 items with custom properties using variant ID
   * cart.add(12345678, 2, { 'Gift': 'Yes' })
   *     .then(data => console.log('Added to cart:', data))
   *     .catch(error => console.error('Error:', error));
   */
  add: function () {
    var _add = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(id) {
      var qty,
        properties,
        body,
        response,
        _data2,
        error,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            qty = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 1;
            properties = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
            _context2.prev = 2;
            body = _objectSpread({
              id: id,
              quantity: qty
            }, properties && {
              properties: properties
            });
            _context2.next = 6;
            return fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            });
          case 6:
            response = _context2.sent;
            _context2.next = 9;
            return response.json();
          case 9:
            _data2 = _context2.sent;
            if (response.ok) {
              _context2.next = 14;
              break;
            }
            error = new Error(_data2.description || 'Failed to add item to cart');
            error.status = response.status;
            throw error;
          case 14:
            component.triggerEvent('addtocart', {
              cart: _data2,
              product_id: id,
              qty: qty,
              properties: properties
            });
            component.triggerEvent('cart:change', {
              cart: _data2
            });
            return _context2.abrupt("return", _data2);
          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](2);
            console.error('Error adding item to cart:', _context2.t0);
            throw _context2.t0;
          case 23:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[2, 19]]);
    }));
    function add(_x) {
      return _add.apply(this, arguments);
    }
    return add;
  }(),
  /**
   * Remove a product from the cart
   * This is implemented by setting its quantity to 0
   * Dispatches 'remove' event on successful removal
   * 
   * @param {number|string} id - Shopify variant ID
   * @returns {Promise<Object>} The updated cart data
   * @throws {Error} If the request fails or returns an error status
   * @example
   * cart.remove(12345678)
   *     .then(data => console.log('Item removed, updated cart:', data))
   *     .catch(error => console.error('Error:', error));
   */
  remove: function () {
    var _remove = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(id) {
      var cart;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return component.update(id, 0, null);
          case 3:
            cart = _context3.sent;
            component.triggerEvent('remove', {
              cart: cart
            });
            component.triggerEvent('cart:change', {
              cart: data
            });
            return _context3.abrupt("return", cart);
          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.error('Error removing item from cart:', _context3.t0);
            throw _context3.t0;
          case 13:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 9]]);
    }));
    function remove(_x2) {
      return _remove.apply(this, arguments);
    }
    return remove;
  }(),
  /**
   * Update product quantity in cart
   * Dispatches 'update' event on successful update
   * 
   * @param {number|string} id - Shopify variant ID
   * @param {number} qty - New quantity (0 to remove item)
   * @param {Object} [properties=null] - Updated line item properties
   * @returns {Promise<Object>} The updated cart data
   * @throws {Error} If the request fails or returns an error status
   * @example
   * // Update quantity to 3 using variant ID
   * cart.update(12345678, 3)
   *     .then(data => console.log('Updated cart:', data))
   *     .catch(error => console.error('Error:', error));
   */
  update: function () {
    var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(id, qty) {
      var properties,
        body,
        response,
        _data3,
        error,
        _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            properties = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : null;
            _context4.prev = 1;
            body = _objectSpread({
              id: id,
              quantity: qty
            }, properties && {
              properties: properties
            });
            _context4.next = 5;
            return fetch('/cart/change.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            });
          case 5:
            response = _context4.sent;
            _context4.next = 8;
            return response.json();
          case 8:
            _data3 = _context4.sent;
            if (response.ok) {
              _context4.next = 13;
              break;
            }
            error = new Error(_data3.description || 'Failed to update cart item');
            error.status = response.status;
            throw error;
          case 13:
            component.triggerEvent('update', {
              cart: _data3
            });
            component.triggerEvent('cart:change', {
              cart: _data3
            });
            return _context4.abrupt("return", _data3);
          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](1);
            console.error('Error updating cart item:', _context4.t0);
            throw _context4.t0;
          case 22:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[1, 18]]);
    }));
    function update(_x3, _x4) {
      return _update.apply(this, arguments);
    }
    return update;
  }(),
  /**
   * Get specific item data from cart
   * Uses caching to avoid unnecessary requests
   * Cache is invalidated on cart updates or after maxAge (5 seconds)
   * 
   * @param {number|string} id - Shopify variant ID
   * @returns {Promise<Object|null>} The cart item data or null if not found
   * @throws {Error} If the request fails or returns an error status
   * @example
   * cart.getItem(12345678)
   *     .then(item => {
   *         if (item) {
   *             console.log('Found item:', item);
   *         } else {
   *             console.log('Item not in cart');
   *         }
   *     });
   */
  getItem: function () {
    var _getItem = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id) {
      var _cartData$items, cartData;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            if (!component._isCacheValid()) {
              _context5.next = 3;
              break;
            }
            return _context5.abrupt("return", component._cache.items.find(function (item) {
              return item.id == id;
            }) || null);
          case 3:
            _context5.next = 5;
            return component.get();
          case 5:
            cartData = _context5.sent;
            component._updateCache(cartData);
            if ((_cartData$items = cartData.items) !== null && _cartData$items !== void 0 && _cartData$items.length) {
              _context5.next = 9;
              break;
            }
            return _context5.abrupt("return", null);
          case 9:
            return _context5.abrupt("return", cartData.items.find(function (item) {
              return item.id == id;
            }) || null);
          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](0);
            console.error('Error fetching cart item:', _context5.t0);
            throw _context5.t0;
          case 16:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[0, 12]]);
    }));
    function getItem(_x5) {
      return _getItem.apply(this, arguments);
    }
    return getItem;
  }(),
  /**
   * Trigger a custom event for cart state changes
   * Events bubble up through the DOM and are cancelable
   * 
   * @param {string} eventName - Name of the event to trigger ('addtocart', 'update', 'remove')
   * @param {Object} data - Data to pass with the event
   * @example
   * // Listen for cart updates anywhere in the DOM
   * document.addEventListener('addtocart', (event) => {
   *     // Prevent adding more than 10 items
   *     if (event.detail.qty > 10) {
   *         event.preventDefault();
   *         alert('Cannot add more than 10 items');
   *     }
   * });
   */
  triggerEvent: function triggerEvent(eventName, data) {
    var event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      // Event bubbles up through DOM
      cancelable: true // Event can be canceled with preventDefault()
    });
    window.dispatchEvent(event);
  },
  // Private cache-related properties and methods
  _cache: {
    items: null,
    lastUpdated: null,
    maxAge: 5000 // Cache lifetime in milliseconds (5 seconds)
  },
  /**
   * Clear the cart cache
   * @private
   */
  _clearCache: function _clearCache() {
    component._cache.items = null;
    component._cache.lastUpdated = null;
  },
  /**
   * Check if cache is valid
   * @private
   * @returns {boolean} True if cache is valid, false otherwise
   */
  _isCacheValid: function _isCacheValid() {
    return component._cache.items !== null && component._cache.lastUpdated !== null && Date.now() - component._cache.lastUpdated < component._cache.maxAge;
  },
  /**
   * Update the cache with new cart data
   * @private
   * @param {Object} cartData - The cart data to cache
   */
  _updateCache: function _updateCache(cartData) {
    component._cache.items = cartData.items || [];
    component._cache.lastUpdated = Date.now();
  }
};
var _default = exports.default = component;
},{}],"utils/detect-breakpoint.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var detectBreakpoint = {
  /**
   * Init module
   */
  init: function init() {
    detectBreakpoint.initBreakpoints();
    detectBreakpoint.detect(true);
    window.addEventListener("resize", function (event) {
      detectBreakpoint.detect();
    });
  },
  initBreakpoints: function initBreakpoints() {
    window.breakpoints = window.breakpoints || {
      largemobile: 640,
      tablet: 768,
      laptop: 1024,
      desktop: 1280,
      wide: 1536
    };
  },
  /**
   * Detect current breakpoint
   */
  detect: function detect(updateDom) {
    detectBreakpoint.updateMode(updateDom);
    if (detectBreakpoint.detectChange()) {
      detectBreakpoint.triggerEvent();
    }
  },
  /**
   * Update screen mode
   */
  updateMode: function updateMode() {
    var updateDom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var windowWidth = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
    if (windowWidth < window.breakpoints.wide) {
      if (windowWidth < window.breakpoints.desktop) {
        if (windowWidth < window.breakpoints.laptop) {
          if (windowWidth < window.breakpoints.tablet) {
            if (windowWidth < window.breakpoints.largemobile) {
              window.screenMode = "mobile";
            } else {
              window.screenMode = "largemobile";
            }
          } else {
            window.screenMode = "tablet";
          }
        } else {
          window.screenMode = "laptop";
        }
      } else {
        window.screenMode = "desktop";
      }
    } else {
      window.screenMode = "wide";
    }
    if (updateDom) {
      document.querySelector("body").setAttribute("data-screen-mode", window.screenMode);
    }
  },
  /**
   * Get current screen mode
   */
  getMode: function getMode() {
    return window.screenMode;
  },
  /**
   * Trigger breakpoint change event
   */
  triggerEvent: function triggerEvent() {
    detectBreakpoint.updateMode(true);
    var event = new CustomEvent("screen-breakpoint", {
      detail: {
        mode: detectBreakpoint.getMode()
      }
    });
    window.dispatchEvent(event);
  },
  /**
   * Detect breakpoint change
   */
  detectChange: function detectChange() {
    var mode = detectBreakpoint.getMode(),
      swap = window.screenSwapMode;
    if (mode === undefined && swap === undefined) {
      return true;
    }
    if (mode === "mobile" && swap !== "mobile") {
      window.screenSwapMode = "mobile";
      return true;
    }
    if (mode === "largemobile" && swap !== "largemobile") {
      window.screenSwapMode = "largemobile";
      return true;
    }
    if (mode === "tablet" && swap !== "tablet") {
      window.screenSwapMode = "tablet";
      return true;
    }
    if (mode === "laptop" && swap !== "laptop") {
      window.screenSwapMode = "laptop";
      return true;
    }
    if (mode === "desktop" && swap !== "desktop") {
      window.screenSwapMode = "desktop";
      return true;
    }
    if (mode === "wide" && swap !== "wide") {
      window.screenSwapMode = "wide";
      return true;
    }
    return false;
  }
};
var _default = exports.default = detectBreakpoint;
},{}],"utils/countries.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contries = void 0;
var contries = exports.contries = [{
  "name": "Afghanistan",
  "alpha2": "AF",
  "alpha3": "AFG",
  "numeric": "004",
  "locales": ["ps-AF", "fa-AF", "uz-Arab-AF"],
  "default_locale": "ps-AF",
  "currency": "AFN",
  "currency_name": "Afghani",
  "languages": ["ps", "uz", "tk"],
  "capital": "Kabul",
  "emoji": "🇦🇫",
  "emojiU": "U+1F1E6 U+1F1EB",
  "fips": "AF",
  "internet": "AF",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Albania",
  "alpha2": "AL",
  "alpha3": "ALB",
  "numeric": "008",
  "locales": ["sq-AL"],
  "default_locale": "sq-AL",
  "currency": "ALL",
  "currency_name": "Lek",
  "languages": ["sq"],
  "capital": "Tirana",
  "emoji": "🇦🇱",
  "emojiU": "U+1F1E6 U+1F1F1",
  "fips": "AL",
  "internet": "AL",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Algeria",
  "alpha2": "DZ",
  "alpha3": "DZA",
  "numeric": "012",
  "locales": ["ar-DZ", "kab-DZ"],
  "default_locale": "ar-DZ",
  "currency": "DZD",
  "currency_name": "Algerian Dinar",
  "languages": ["ar"],
  "capital": "Algiers",
  "emoji": "🇩🇿",
  "emojiU": "U+1F1E9 U+1F1FF",
  "fips": "AG",
  "internet": "DZ",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "American Samoa",
  "alpha2": "AS",
  "alpha3": "ASM",
  "numeric": "016",
  "locales": ["en-AS"],
  "default_locale": "en-AS",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en", "sm"],
  "capital": "Pago Pago",
  "emoji": "🇦🇸",
  "emojiU": "U+1F1E6 U+1F1F8",
  "fips": "AQ",
  "internet": "AS",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Andorra",
  "alpha2": "AD",
  "alpha3": "AND",
  "numeric": "020",
  "locales": ["ca"],
  "default_locale": "ca",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["ca"],
  "capital": "Andorra la Vella",
  "emoji": "🇦🇩",
  "emojiU": "U+1F1E6 U+1F1E9",
  "fips": "AN",
  "internet": "AD",
  "continent": "Europe",
  "region": "South West Europe"
}, {
  "name": "Angola",
  "alpha2": "AO",
  "alpha3": "AGO",
  "numeric": "024",
  "locales": ["pt"],
  "default_locale": "pt",
  "currency": "AOA",
  "currency_name": "Kwanza",
  "languages": ["pt"],
  "capital": "Luanda",
  "emoji": "🇦🇴",
  "emojiU": "U+1F1E6 U+1F1F4",
  "fips": "AO",
  "internet": "AO",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Anguilla",
  "alpha2": "AI",
  "alpha3": "AIA",
  "numeric": "660",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "The Valley",
  "emoji": "🇦🇮",
  "emojiU": "U+1F1E6 U+1F1EE",
  "fips": "AV",
  "internet": "AI",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Antarctica",
  "alpha2": "AQ",
  "alpha3": "ATA",
  "numeric": "010",
  "locales": ["en-US"],
  "default_locale": "en-US",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": [],
  "capital": "",
  "emoji": "🇦🇶",
  "emojiU": "U+1F1E6 U+1F1F6",
  "fips": "AY",
  "internet": "AQ",
  "continent": "Antarctica",
  "region": "Antarctica"
}, {
  "name": "Antigua and Barbuda",
  "alpha2": "AG",
  "alpha3": "ATG",
  "numeric": "028",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "Saint John's",
  "emoji": "🇦🇬",
  "emojiU": "U+1F1E6 U+1F1EC",
  "fips": "AC",
  "internet": "AG",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Argentina",
  "alpha2": "AR",
  "alpha3": "ARG",
  "numeric": "032",
  "locales": ["es-AR"],
  "default_locale": "es-AR",
  "currency": "ARS",
  "currency_name": "Argentine Peso",
  "languages": ["es", "gn"],
  "capital": "Buenos Aires",
  "emoji": "🇦🇷",
  "emojiU": "U+1F1E6 U+1F1F7",
  "fips": "AR",
  "internet": "AR",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Armenia",
  "alpha2": "AM",
  "alpha3": "ARM",
  "numeric": "051",
  "locales": ["hy-AM"],
  "default_locale": "hy-AM",
  "currency": "AMD",
  "currency_name": "Armenian Dram",
  "languages": ["hy", "ru"],
  "capital": "Yerevan",
  "emoji": "🇦🇲",
  "emojiU": "U+1F1E6 U+1F1F2",
  "fips": "AM",
  "internet": "AM",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Aruba",
  "alpha2": "AW",
  "alpha3": "ABW",
  "numeric": "533",
  "locales": ["nl"],
  "default_locale": "nl",
  "currency": "AWG",
  "currency_name": "Aruban Florin",
  "languages": ["nl", "pa"],
  "capital": "Oranjestad",
  "emoji": "🇦🇼",
  "emojiU": "U+1F1E6 U+1F1FC",
  "fips": "AA",
  "internet": "AW",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Australia",
  "alpha2": "AU",
  "alpha3": "AUS",
  "numeric": "036",
  "locales": ["en-AU"],
  "default_locale": "en-AU",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "Canberra",
  "emoji": "🇦🇺",
  "emojiU": "U+1F1E6 U+1F1FA",
  "fips": "AS",
  "internet": "AU",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Austria",
  "alpha2": "AT",
  "alpha3": "AUT",
  "numeric": "040",
  "locales": ["de-AT"],
  "default_locale": "de-AT",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["de"],
  "capital": "Vienna",
  "emoji": "🇦🇹",
  "emojiU": "U+1F1E6 U+1F1F9",
  "fips": "AU",
  "internet": "AT",
  "continent": "Europe",
  "region": "Central Europe"
}, {
  "name": "Azerbaijan",
  "alpha2": "AZ",
  "alpha3": "AZE",
  "numeric": "031",
  "locales": ["az-Cyrl-AZ", "az-Latn-AZ"],
  "default_locale": "az-Cyrl-AZ",
  "currency": "AZN",
  "currency_name": "Azerbaijan Manat",
  "languages": ["az"],
  "capital": "Baku",
  "emoji": "🇦🇿",
  "emojiU": "U+1F1E6 U+1F1FF",
  "fips": "AJ",
  "internet": "AZ",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Bahamas",
  "alpha2": "BS",
  "alpha3": "BHS",
  "numeric": "044",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "BSD",
  "currency_name": "Bahamian Dollar",
  "languages": ["en"],
  "capital": "Nassau",
  "emoji": "🇧🇸",
  "emojiU": "U+1F1E7 U+1F1F8",
  "fips": "BF",
  "internet": "BS",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Bahrain",
  "alpha2": "BH",
  "alpha3": "BHR",
  "numeric": "048",
  "locales": ["ar-BH"],
  "default_locale": "ar-BH",
  "currency": "BHD",
  "currency_name": "Bahraini Dinar",
  "languages": ["ar"],
  "capital": "Manama",
  "emoji": "🇧🇭",
  "emojiU": "U+1F1E7 U+1F1ED",
  "fips": "BA",
  "internet": "BH",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Bangladesh",
  "alpha2": "BD",
  "alpha3": "BGD",
  "numeric": "050",
  "locales": ["bn-BD"],
  "default_locale": "bn-BD",
  "currency": "BDT",
  "currency_name": "Taka",
  "languages": ["bn"],
  "capital": "Dhaka",
  "emoji": "🇧🇩",
  "emojiU": "U+1F1E7 U+1F1E9",
  "fips": "BG",
  "internet": "BD",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Barbados",
  "alpha2": "BB",
  "alpha3": "BRB",
  "numeric": "052",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "BBD",
  "currency_name": "Barbados Dollar",
  "languages": ["en"],
  "capital": "Bridgetown",
  "emoji": "🇧🇧",
  "emojiU": "U+1F1E7 U+1F1E7",
  "fips": "BB",
  "internet": "BB",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Belarus",
  "alpha2": "BY",
  "alpha3": "BLR",
  "numeric": "112",
  "locales": ["be-BY"],
  "default_locale": "be-BY",
  "currency": "BYN",
  "currency_name": "Belarusian Ruble",
  "languages": ["be", "ru"],
  "capital": "Minsk",
  "emoji": "🇧🇾",
  "emojiU": "U+1F1E7 U+1F1FE",
  "fips": "BO",
  "internet": "BY",
  "continent": "Europe",
  "region": "Eastern Europe"
}, {
  "name": "Belgium",
  "alpha2": "BE",
  "alpha3": "BEL",
  "numeric": "056",
  "locales": ["nl-BE", "en-BE", "fr-BE", "de-BE"],
  "default_locale": "nl-BE",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["nl", "fr", "de"],
  "capital": "Brussels",
  "emoji": "🇧🇪",
  "emojiU": "U+1F1E7 U+1F1EA",
  "fips": "BE",
  "internet": "BE",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Belize",
  "alpha2": "BZ",
  "alpha3": "BLZ",
  "numeric": "084",
  "locales": ["en-BZ"],
  "default_locale": "en-BZ",
  "currency": "BZD",
  "currency_name": "Belize Dollar",
  "languages": ["en", "es"],
  "capital": "Belmopan",
  "emoji": "🇧🇿",
  "emojiU": "U+1F1E7 U+1F1FF",
  "fips": "BH",
  "internet": "BZ",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Benin",
  "alpha2": "BJ",
  "alpha3": "BEN",
  "numeric": "204",
  "locales": ["fr-BJ"],
  "default_locale": "fr-BJ",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["fr"],
  "capital": "Porto-Novo",
  "emoji": "🇧🇯",
  "emojiU": "U+1F1E7 U+1F1EF",
  "fips": "BN",
  "internet": "BJ",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Bermuda",
  "alpha2": "BM",
  "alpha3": "BMU",
  "numeric": "060",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "BMD",
  "currency_name": "Bermudian Dollar",
  "languages": ["en"],
  "capital": "Hamilton",
  "emoji": "🇧🇲",
  "emojiU": "U+1F1E7 U+1F1F2",
  "fips": "BD",
  "internet": "BM",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Bhutan",
  "alpha2": "BT",
  "alpha3": "BTN",
  "numeric": "064",
  "locales": ["dz"],
  "default_locale": "dz",
  "currency": "BTN",
  "currency_name": "Ngultrum",
  "languages": ["dz"],
  "capital": "Thimphu",
  "emoji": "🇧🇹",
  "emojiU": "U+1F1E7 U+1F1F9",
  "fips": "BT",
  "internet": "BT",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Bolivia",
  "alpha2": "BO",
  "alpha3": "BOL",
  "numeric": "068",
  "locales": ["es-BO"],
  "default_locale": "es-BO",
  "currency": "BTN",
  "currency_name": "Ngultrum",
  "languages": ["es", "ay", "qu"],
  "capital": "Sucre",
  "emoji": "🇧🇴",
  "emojiU": "U+1F1E7 U+1F1F4",
  "fips": "BL",
  "internet": "BO",
  "continent": "Americas",
  "region": "South America",
  "alternate_names": ["Plurinational State of Bolivia"]
}, {
  "name": "Bonaire",
  "alpha2": "BQ",
  "alpha3": "BES",
  "numeric": "535",
  "locales": ["nl"],
  "default_locale": "nl",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["nl"],
  "capital": "Kralendijk",
  "emoji": "🇧🇶",
  "emojiU": "U+1F1E7 U+1F1F6",
  "fips": "BQ",
  "internet": "BQ",
  "continent": "Americas",
  "region": "West Indies",
  "alternate_names": ["Bonaire, Sint Eustatius and Saba"]
}, {
  "name": "Bosnia and Herzegovina",
  "alpha2": "BA",
  "alpha3": "BIH",
  "numeric": "070",
  "locales": ["bs-BA", "sr-Cyrl-BA", "sr-Latn-BA"],
  "default_locale": "bs-BA",
  "currency": "BAM",
  "currency_name": "Convertible Mark",
  "languages": ["bs", "hr", "sr"],
  "capital": "Sarajevo",
  "emoji": "🇧🇦",
  "emojiU": "U+1F1E7 U+1F1E6",
  "fips": "BK",
  "internet": "BA",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Botswana",
  "alpha2": "BW",
  "alpha3": "BWA",
  "numeric": "072",
  "locales": ["en-BW"],
  "default_locale": "en-BW",
  "currency": "BWP",
  "currency_name": "Pula",
  "languages": ["en", "tn"],
  "capital": "Gaborone",
  "emoji": "🇧🇼",
  "emojiU": "U+1F1E7 U+1F1FC",
  "fips": "BC",
  "internet": "BW",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Bouvet Island",
  "alpha2": "BV",
  "alpha3": "BVT",
  "numeric": "074",
  "locales": ["no"],
  "default_locale": "no",
  "currency": "NOK",
  "currency_name": "Norwegian Krone",
  "languages": ["no", "nb", "nn"],
  "capital": "",
  "emoji": "🇧🇻",
  "emojiU": "U+1F1E7 U+1F1FB",
  "fips": "BV",
  "internet": "BV",
  "continent": "Atlantic Ocean",
  "region": "South Atlantic Ocean"
}, {
  "name": "Brazil",
  "alpha2": "BR",
  "alpha3": "BRA",
  "numeric": "076",
  "locales": ["pt-BR"],
  "default_locale": "pt-BR",
  "currency": "BRL",
  "currency_name": "Brazilian Real",
  "languages": ["pt"],
  "capital": "Brasília",
  "emoji": "🇧🇷",
  "emojiU": "U+1F1E7 U+1F1F7",
  "fips": "BR",
  "internet": "BR",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "British Indian Ocean Territory",
  "alpha2": "IO",
  "alpha3": "IOT",
  "numeric": "086",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "Diego Garcia",
  "emoji": "🇮🇴",
  "emojiU": "U+1F1EE U+1F1F4",
  "fips": "IO",
  "internet": "IO",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Brunei Darussalam",
  "alpha2": "BN",
  "alpha3": "BRN",
  "numeric": "096",
  "locales": ["ms-BN"],
  "default_locale": "ms-BN",
  "currency": "BND",
  "currency_name": "Brunei Dollar",
  "languages": ["ms"],
  "capital": "Bandar Seri Begawan",
  "emoji": "🇧🇳",
  "emojiU": "U+1F1E7 U+1F1F3",
  "fips": "BX",
  "internet": "BN",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Bulgaria",
  "alpha2": "BG",
  "alpha3": "BGR",
  "numeric": "100",
  "locales": ["bg-BG"],
  "default_locale": "bg-BG",
  "currency": "BGN",
  "currency_name": "Bulgarian Lev",
  "languages": ["bg"],
  "capital": "Sofia",
  "emoji": "🇧🇬",
  "emojiU": "U+1F1E7 U+1F1EC",
  "fips": "BU",
  "internet": "BG",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Burkina Faso",
  "alpha2": "BF",
  "alpha3": "BFA",
  "numeric": "854",
  "locales": ["fr-BF"],
  "default_locale": "fr-BF",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["fr", "ff"],
  "capital": "Ouagadougou",
  "emoji": "🇧🇫",
  "emojiU": "U+1F1E7 U+1F1EB",
  "fips": "UV",
  "internet": "BF",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Burundi",
  "alpha2": "BI",
  "alpha3": "BDI",
  "numeric": "108",
  "locales": ["fr-BI"],
  "default_locale": "fr-BI",
  "currency": "BIF",
  "currency_name": "Burundi Franc",
  "languages": ["fr", "rn"],
  "capital": "Bujumbura",
  "emoji": "🇧🇮",
  "emojiU": "U+1F1E7 U+1F1EE",
  "fips": "BY",
  "internet": "BI",
  "continent": "Africa",
  "region": "Central Africa"
}, {
  "name": "Cabo Verde",
  "alpha2": "CV",
  "alpha3": "CPV",
  "numeric": "132",
  "locales": ["kea-CV"],
  "default_locale": "kea-CV",
  "currency": "CVE",
  "currency_name": "Cabo Verde Escudo",
  "languages": ["pt"],
  "capital": "Praia",
  "emoji": "🇨🇻",
  "emojiU": "U+1F1E8 U+1F1FB",
  "fips": "CV",
  "internet": "CV",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Cambodia",
  "alpha2": "KH",
  "alpha3": "KHM",
  "numeric": "116",
  "locales": ["km-KH"],
  "default_locale": "km-KH",
  "currency": "KHR",
  "currency_name": "Riel",
  "languages": ["km"],
  "capital": "Phnom Penh",
  "emoji": "🇰🇭",
  "emojiU": "U+1F1F0 U+1F1ED",
  "fips": "CB",
  "internet": "KH",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Cameroon",
  "alpha2": "CM",
  "alpha3": "CMR",
  "numeric": "120",
  "locales": ["fr-CM"],
  "default_locale": "fr-CM",
  "currency": "XAF",
  "currency_name": "CFA Franc BEAC",
  "languages": ["en", "fr"],
  "capital": "Yaoundé",
  "emoji": "🇨🇲",
  "emojiU": "U+1F1E8 U+1F1F2",
  "fips": "CM",
  "internet": "CM",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Canada",
  "alpha2": "CA",
  "alpha3": "CAN",
  "numeric": "124",
  "locales": ["en-CA", "fr-CA"],
  "default_locale": "en-CA",
  "currency": "CAD",
  "currency_name": "Canadian Dollar",
  "languages": ["en", "fr"],
  "capital": "Ottawa",
  "emoji": "🇨🇦",
  "emojiU": "U+1F1E8 U+1F1E6",
  "fips": "CA",
  "internet": "CA",
  "continent": "Americas",
  "region": "North America"
}, {
  "name": "Cayman Islands",
  "alpha2": "KY",
  "alpha3": "CYM",
  "numeric": "136",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "KYD",
  "currency_name": "Cayman Islands Dollar",
  "languages": ["en"],
  "capital": "George Town",
  "emoji": "🇰🇾",
  "emojiU": "U+1F1F0 U+1F1FE",
  "fips": "CJ",
  "internet": "KY",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Central African Republic",
  "alpha2": "CF",
  "alpha3": "CAF",
  "numeric": "140",
  "locales": ["fr-CF", "sg-CF"],
  "default_locale": "fr-CF",
  "currency": "XAF",
  "currency_name": "CFA Franc BEAC",
  "languages": ["fr", "sg"],
  "capital": "Bangui",
  "emoji": "🇨🇫",
  "emojiU": "U+1F1E8 U+1F1EB",
  "fips": "CT",
  "internet": "CF",
  "continent": "Africa",
  "region": "Central Africa"
}, {
  "name": "Chad",
  "alpha2": "TD",
  "alpha3": "TCD",
  "numeric": "148",
  "locales": ["fr-TD"],
  "default_locale": "fr-TD",
  "currency": "XAF",
  "currency_name": "CFA Franc BEAC",
  "languages": ["fr", "ar"],
  "capital": "N'Djamena",
  "emoji": "🇹🇩",
  "emojiU": "U+1F1F9 U+1F1E9",
  "fips": "CD",
  "internet": "TD",
  "continent": "Africa",
  "region": "Central Africa"
}, {
  "name": "Chile",
  "alpha2": "CL",
  "alpha3": "CHL",
  "numeric": "152",
  "locales": ["es-CL"],
  "default_locale": "es-CL",
  "currency": "CLF",
  "currency_name": "Unidad de Fomento",
  "languages": ["es"],
  "capital": "Santiago",
  "emoji": "🇨🇱",
  "emojiU": "U+1F1E8 U+1F1F1",
  "fips": "CI",
  "internet": "CL",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "China",
  "alpha2": "CN",
  "alpha3": "CHN",
  "numeric": "156",
  "locales": ["zh-CN", "zh-Hans-CN", "ii-CN", "bo-CN"],
  "default_locale": "zh-CN",
  "currency": "CNY",
  "currency_name": "Yuan Renminbi",
  "languages": ["zh"],
  "capital": "Beijing",
  "emoji": "🇨🇳",
  "emojiU": "U+1F1E8 U+1F1F3",
  "fips": "CH",
  "internet": "CN",
  "continent": "Asia",
  "region": "East Asia"
}, {
  "name": "Christmas Island",
  "alpha2": "CX",
  "alpha3": "CXR",
  "numeric": "162",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "Flying Fish Cove",
  "emoji": "🇨🇽",
  "emojiU": "U+1F1E8 U+1F1FD",
  "fips": "KT",
  "internet": "CX",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Cocos Islands",
  "alpha2": "CC",
  "alpha3": "CCK",
  "numeric": "166",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "West Island",
  "emoji": "🇨🇨",
  "emojiU": "U+1F1E8 U+1F1E8",
  "fips": "CK",
  "internet": "CC",
  "continent": "Asia",
  "region": "South East Asia",
  "alternate_names": ["Cocos Keeling Islands"]
}, {
  "name": "Colombia",
  "alpha2": "CO",
  "alpha3": "COL",
  "numeric": "170",
  "locales": ["es-CO"],
  "default_locale": "es-CO",
  "currency": "COU",
  "currency_name": "Unidad de Valor Real",
  "languages": ["es"],
  "capital": "Bogotá",
  "emoji": "🇨🇴",
  "emojiU": "U+1F1E8 U+1F1F4",
  "fips": "CO",
  "internet": "CO",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Comoros",
  "alpha2": "KM",
  "alpha3": "COM",
  "numeric": "174",
  "locales": ["fr-KM"],
  "default_locale": "fr-KM",
  "currency": "KMF",
  "currency_name": "Comorian Franc ",
  "languages": ["ar", "fr"],
  "capital": "Moroni",
  "emoji": "🇰🇲",
  "emojiU": "U+1F1F0 U+1F1F2",
  "fips": "CN",
  "internet": "KM",
  "continent": "Africa",
  "region": "Indian Ocean"
}, {
  "name": "Democratic Republic of the Congo",
  "alpha2": "CD",
  "alpha3": "COD",
  "numeric": "180",
  "locales": ["fr-CD"],
  "default_locale": "fr-CD",
  "currency": "CDF",
  "currency_name": "Congolese Franc",
  "languages": ["fr", "ln", "kg", "sw", "lu"],
  "capital": "Kinshasa",
  "emoji": "🇨🇩",
  "emojiU": "U+1F1E8 U+1F1E9",
  "fips": "CG",
  "internet": "ZR",
  "continent": "Africa",
  "region": "Central Africa"
}, {
  "name": "Congo",
  "alpha2": "CG",
  "alpha3": "COG",
  "numeric": "178",
  "locales": ["fr-CG"],
  "default_locale": "fr-CG",
  "currency": "XAF",
  "currency_name": "CFA Franc BEAC",
  "languages": ["fr", "ln"],
  "capital": "Brazzaville",
  "emoji": "🇨🇬",
  "emojiU": "U+1F1E8 U+1F1EC",
  "fips": "CF",
  "internet": "CG",
  "continent": "Africa",
  "region": "Central Africa"
}, {
  "name": "Cook Islands",
  "alpha2": "CK",
  "alpha3": "COK",
  "numeric": "184",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "NZD",
  "currency_name": "New Zealand Dollar",
  "languages": ["en"],
  "capital": "Avarua",
  "emoji": "🇨🇰",
  "emojiU": "U+1F1E8 U+1F1F0",
  "fips": "CW",
  "internet": "CK",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Costa Rica",
  "alpha2": "CR",
  "alpha3": "CRI",
  "numeric": "188",
  "locales": ["es-CR"],
  "default_locale": "es-CR",
  "currency": "CRC",
  "currency_name": "Costa Rican Colon",
  "languages": ["es"],
  "capital": "San José",
  "emoji": "🇨🇷",
  "emojiU": "U+1F1E8 U+1F1F7",
  "fips": "CS",
  "internet": "CR",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Croatia",
  "alpha2": "HR",
  "alpha3": "HRV",
  "numeric": "191",
  "locales": ["hr-HR"],
  "default_locale": "hr-HR",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["hr"],
  "capital": "Zagreb",
  "emoji": "🇭🇷",
  "emojiU": "U+1F1ED U+1F1F7",
  "fips": "HR",
  "internet": "HR",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Cuba",
  "alpha2": "CU",
  "alpha3": "CUB",
  "numeric": "192",
  "locales": ["es"],
  "default_locale": "es",
  "currency": "CUC",
  "currency_name": "Peso Convertible",
  "languages": ["es"],
  "capital": "Havana",
  "emoji": "🇨🇺",
  "emojiU": "U+1F1E8 U+1F1FA",
  "fips": "CU",
  "internet": "CU",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Curaçao",
  "alpha2": "CW",
  "alpha3": "CUW",
  "numeric": "531",
  "locales": ["nl"],
  "default_locale": "nl",
  "currency": "ANG",
  "currency_name": "Netherlands Antillean Guilder",
  "languages": ["nl", "pa", "en"],
  "capital": "Willemstad",
  "emoji": "🇨🇼",
  "emojiU": "U+1F1E8 U+1F1FC",
  "fips": "UC",
  "internet": "CW",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Cyprus",
  "alpha2": "CY",
  "alpha3": "CYP",
  "numeric": "196",
  "locales": ["el-CY"],
  "default_locale": "el-CY",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["el", "tr", "hy"],
  "capital": "Nicosia",
  "emoji": "🇨🇾",
  "emojiU": "U+1F1E8 U+1F1FE",
  "fips": "CY",
  "internet": "CY",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Czechia",
  "alpha2": "CZ",
  "alpha3": "CZE",
  "numeric": "203",
  "locales": ["cs-CZ"],
  "default_locale": "cs-CZ",
  "currency": "CZK",
  "currency_name": "Czech Koruna",
  "languages": ["cs", "sk"],
  "capital": "Prague",
  "emoji": "🇨🇿",
  "emojiU": "U+1F1E8 U+1F1FF",
  "fips": "EZ",
  "internet": "CZ",
  "continent": "Europe",
  "region": "Central Europe"
}, {
  "name": "Côte d'Ivoire",
  "alpha2": "CI",
  "alpha3": "CIV",
  "numeric": "384",
  "locales": ["fr-CI"],
  "default_locale": "fr-CI",
  "currency": "CZK",
  "currency_name": "Czech Koruna",
  "languages": ["fr"],
  "capital": "Yamoussoukro",
  "emoji": "🇨🇮",
  "emojiU": "U+1F1E8 U+1F1EE",
  "fips": "IV",
  "internet": "CI",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Denmark",
  "alpha2": "DK",
  "alpha3": "DNK",
  "numeric": "208",
  "locales": ["da-DK"],
  "default_locale": "da-DK",
  "currency": "DKK",
  "currency_name": "Danish Krone",
  "languages": ["da"],
  "capital": "Copenhagen",
  "emoji": "🇩🇰",
  "emojiU": "U+1F1E9 U+1F1F0",
  "fips": "DA",
  "internet": "DK",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "Djibouti",
  "alpha2": "DJ",
  "alpha3": "DJI",
  "numeric": "262",
  "locales": ["fr-DJ", "so-DJ"],
  "default_locale": "fr-DJ",
  "currency": "DJF",
  "currency_name": "Djibouti Franc",
  "languages": ["fr", "ar"],
  "capital": "Djibouti",
  "emoji": "🇩🇯",
  "emojiU": "U+1F1E9 U+1F1EF",
  "fips": "DJ",
  "internet": "DJ",
  "continent": "Africa",
  "region": "Eastern Africa"
}, {
  "name": "Dominica",
  "alpha2": "DM",
  "alpha3": "DMA",
  "numeric": "212",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "Roseau",
  "emoji": "🇩🇲",
  "emojiU": "U+1F1E9 U+1F1F2",
  "fips": "DO",
  "internet": "DM",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Dominican Republic",
  "alpha2": "DO",
  "alpha3": "DOM",
  "numeric": "214",
  "locales": ["es-DO"],
  "default_locale": "es-DO",
  "currency": "DOP",
  "currency_name": "Dominican Peso",
  "languages": ["es"],
  "capital": "Santo Domingo",
  "emoji": "🇩🇴",
  "emojiU": "U+1F1E9 U+1F1F4",
  "fips": "DR",
  "internet": "DO",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Ecuador",
  "alpha2": "EC",
  "alpha3": "ECU",
  "numeric": "218",
  "locales": ["es-EC"],
  "default_locale": "es-EC",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["es"],
  "capital": "Quito",
  "emoji": "🇪🇨",
  "emojiU": "U+1F1EA U+1F1E8",
  "fips": "EC",
  "internet": "EC",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Egypt",
  "alpha2": "EG",
  "alpha3": "EGY",
  "numeric": "818",
  "locales": ["ar-EG"],
  "default_locale": "ar-EG",
  "currency": "EGP",
  "currency_name": "Egyptian Pound",
  "languages": ["ar"],
  "capital": "Cairo",
  "emoji": "🇪🇬",
  "emojiU": "U+1F1EA U+1F1EC",
  "fips": "EG",
  "internet": "EG",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "El Salvador",
  "alpha2": "SV",
  "alpha3": "SLV",
  "numeric": "222",
  "locales": ["es-SV"],
  "default_locale": "es-SV",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["es"],
  "capital": "San Salvador",
  "emoji": "🇸🇻",
  "emojiU": "U+1F1F8 U+1F1FB",
  "fips": "ES",
  "internet": "SV",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Equatorial Guinea",
  "alpha2": "GQ",
  "alpha3": "GNQ",
  "numeric": "226",
  "locales": ["fr-GQ", "es-GQ"],
  "default_locale": "fr-GQ",
  "currency": "XAF",
  "currency_name": "CFA Franc BEAC",
  "languages": ["es", "fr"],
  "capital": "Malabo",
  "emoji": "🇬🇶",
  "emojiU": "U+1F1EC U+1F1F6",
  "fips": "EK",
  "internet": "GQ",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Eritrea",
  "alpha2": "ER",
  "alpha3": "ERI",
  "numeric": "232",
  "locales": ["ti-ER"],
  "default_locale": "ti-ER",
  "currency": "ERN",
  "currency_name": "Nakfa",
  "languages": ["ti", "ar", "en"],
  "capital": "Asmara",
  "emoji": "🇪🇷",
  "emojiU": "U+1F1EA U+1F1F7",
  "fips": "ER",
  "internet": "ER",
  "continent": "Africa",
  "region": "Eastern Africa"
}, {
  "name": "Estonia",
  "alpha2": "EE",
  "alpha3": "EST",
  "numeric": "233",
  "locales": ["et-EE"],
  "default_locale": "et-EE",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["et"],
  "capital": "Tallinn",
  "emoji": "🇪🇪",
  "emojiU": "U+1F1EA U+1F1EA",
  "fips": "EN",
  "internet": "EE",
  "continent": "Europe",
  "region": "Eastern Europe"
}, {
  "name": "Eswatini",
  "alpha2": "SZ",
  "alpha3": "SWZ",
  "numeric": "748",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["en", "ss"],
  "capital": "Lobamba",
  "emoji": "🇸🇿",
  "emojiU": "U+1F1F8 U+1F1FF",
  "fips": "WZ",
  "internet": "SZ",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Ethiopia",
  "alpha2": "ET",
  "alpha3": "ETH",
  "numeric": "231",
  "locales": ["am-ET", "om-ET", "so-ET", "ti-ET"],
  "default_locale": "am-ET",
  "currency": "ETB",
  "currency_name": "Ethiopian Birr",
  "languages": ["am"],
  "capital": "Addis Ababa",
  "emoji": "🇪🇹",
  "emojiU": "U+1F1EA U+1F1F9",
  "fips": "ET",
  "internet": "ET",
  "continent": "Africa",
  "region": "Eastern Africa"
}, {
  "name": "Falkland Islands",
  "alpha2": "FK",
  "alpha3": "FLK",
  "numeric": "238",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "DKK",
  "currency_name": "Danish Krone",
  "languages": ["en"],
  "capital": "Stanley",
  "emoji": "🇫🇰",
  "emojiU": "U+1F1EB U+1F1F0",
  "fips": "FA",
  "internet": "FK",
  "continent": "Americas",
  "region": "South America",
  "alternate_names": ["Malvinas Falkland Islands"]
}, {
  "name": "Faroe Islands",
  "alpha2": "FO",
  "alpha3": "FRO",
  "numeric": "234",
  "locales": ["fo-FO"],
  "default_locale": "fo-FO",
  "currency": "DKK",
  "currency_name": "Danish Krone",
  "languages": ["fo"],
  "capital": "Tórshavn",
  "emoji": "🇫🇴",
  "emojiU": "U+1F1EB U+1F1F4",
  "fips": "FO",
  "internet": "FO",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "Fiji",
  "alpha2": "FJ",
  "alpha3": "FJI",
  "numeric": "242",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "FJD",
  "currency_name": "Fiji Dollar",
  "languages": ["en", "fj", "hi", "ur"],
  "capital": "Suva",
  "emoji": "🇫🇯",
  "emojiU": "U+1F1EB U+1F1EF",
  "fips": "FJ",
  "internet": "FJ",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Finland",
  "alpha2": "FI",
  "alpha3": "FIN",
  "numeric": "246",
  "locales": ["fi-FI", "sv-FI"],
  "default_locale": "fi-FI",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fi", "sv"],
  "capital": "Helsinki",
  "emoji": "🇫🇮",
  "emojiU": "U+1F1EB U+1F1EE",
  "fips": "FI",
  "internet": "FI",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "France",
  "alpha2": "FR",
  "alpha3": "FRA",
  "numeric": "250",
  "locales": ["fr-FR"],
  "default_locale": "fr-FR",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Paris",
  "emoji": "🇫🇷",
  "emojiU": "U+1F1EB U+1F1F7",
  "fips": "FR",
  "internet": "FR",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "French Guiana",
  "alpha2": "GF",
  "alpha3": "GUF",
  "numeric": "254",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Cayenne",
  "emoji": "🇬🇫",
  "emojiU": "U+1F1EC U+1F1EB",
  "fips": "FG",
  "internet": "GF",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "French Polynesia",
  "alpha2": "PF",
  "alpha3": "PYF",
  "numeric": "258",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "XPF",
  "currency_name": "CFP Franc",
  "languages": ["fr"],
  "capital": "Papeetē",
  "emoji": "🇵🇫",
  "emojiU": "U+1F1F5 U+1F1EB",
  "fips": "FP",
  "internet": "PF",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "French Southern Territories",
  "alpha2": "TF",
  "alpha3": "ATF",
  "numeric": "260",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Port-aux-Français",
  "emoji": "🇹🇫",
  "emojiU": "U+1F1F9 U+1F1EB",
  "fips": "FS",
  "internet": "--",
  "continent": "Indian Ocean",
  "region": "Southern Indian Ocean"
}, {
  "name": "Gabon",
  "alpha2": "GA",
  "alpha3": "GAB",
  "numeric": "266",
  "locales": ["fr-GA"],
  "default_locale": "fr-GA",
  "currency": "XAF",
  "currency_name": "CFA Franc BEAC",
  "languages": ["fr"],
  "capital": "Libreville",
  "emoji": "🇬🇦",
  "emojiU": "U+1F1EC U+1F1E6",
  "fips": "GB",
  "internet": "GA",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Gambia",
  "alpha2": "GM",
  "alpha3": "GMB",
  "numeric": "270",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "GMD",
  "currency_name": "Dalasi",
  "languages": ["en"],
  "capital": "Banjul",
  "emoji": "🇬🇲",
  "emojiU": "U+1F1EC U+1F1F2",
  "fips": "GA",
  "internet": "GM",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Georgia",
  "alpha2": "GE",
  "alpha3": "GEO",
  "numeric": "268",
  "locales": ["ka-GE"],
  "default_locale": "ka-GE",
  "currency": "GEL",
  "currency_name": "Lari",
  "languages": ["ka"],
  "capital": "Tbilisi",
  "emoji": "🇬🇪",
  "emojiU": "U+1F1EC U+1F1EA",
  "fips": "GG",
  "internet": "GE",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Germany",
  "alpha2": "DE",
  "alpha3": "DEU",
  "numeric": "276",
  "locales": ["de-DE"],
  "default_locale": "de-DE",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["de"],
  "capital": "Berlin",
  "emoji": "🇩🇪",
  "emojiU": "U+1F1E9 U+1F1EA",
  "fips": "GM",
  "internet": "DE",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Ghana",
  "alpha2": "GH",
  "alpha3": "GHA",
  "numeric": "288",
  "locales": ["ak-GH", "ee-GH", "ha-Latn-GH"],
  "default_locale": "ak-GH",
  "currency": "GHS",
  "currency_name": "Ghana Cedi",
  "languages": ["en"],
  "capital": "Accra",
  "emoji": "🇬🇭",
  "emojiU": "U+1F1EC U+1F1ED",
  "fips": "GH",
  "internet": "GH",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Gibraltar",
  "alpha2": "GI",
  "alpha3": "GIB",
  "numeric": "292",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "GIP",
  "currency_name": "Gibraltar Pound",
  "languages": ["en"],
  "capital": "Gibraltar",
  "emoji": "🇬🇮",
  "emojiU": "U+1F1EC U+1F1EE",
  "fips": "GI",
  "internet": "GI",
  "continent": "Europe",
  "region": "South West Europe"
}, {
  "name": "Greece",
  "alpha2": "GR",
  "alpha3": "GRC",
  "numeric": "300",
  "locales": ["el-GR"],
  "default_locale": "el-GR",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["el"],
  "capital": "Athens",
  "emoji": "🇬🇷",
  "emojiU": "U+1F1EC U+1F1F7",
  "fips": "GR",
  "internet": "GR",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Greenland",
  "alpha2": "GL",
  "alpha3": "GRL",
  "numeric": "304",
  "locales": ["kl-GL"],
  "default_locale": "kl-GL",
  "currency": "DKK",
  "currency_name": "Danish Krone",
  "languages": ["kl"],
  "capital": "Nuuk",
  "emoji": "🇬🇱",
  "emojiU": "U+1F1EC U+1F1F1",
  "fips": "GL",
  "internet": "GL",
  "continent": "Americas",
  "region": "North America"
}, {
  "name": "Grenada",
  "alpha2": "GD",
  "alpha3": "GRD",
  "numeric": "308",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "St. George's",
  "emoji": "🇬🇩",
  "emojiU": "U+1F1EC U+1F1E9",
  "fips": "GJ",
  "internet": "GD",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Guadeloupe",
  "alpha2": "GP",
  "alpha3": "GLP",
  "numeric": "312",
  "locales": ["fr-GP"],
  "default_locale": "fr-GP",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Basse-Terre",
  "emoji": "🇬🇵",
  "emojiU": "U+1F1EC U+1F1F5",
  "fips": "GP",
  "internet": "GP",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Guam",
  "alpha2": "GU",
  "alpha3": "GUM",
  "numeric": "316",
  "locales": ["en-GU"],
  "default_locale": "en-GU",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en", "ch", "es"],
  "capital": "Hagåtña",
  "emoji": "🇬🇺",
  "emojiU": "U+1F1EC U+1F1FA",
  "fips": "GQ",
  "internet": "GU",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Guatemala",
  "alpha2": "GT",
  "alpha3": "GTM",
  "numeric": "320",
  "locales": ["es-GT"],
  "default_locale": "es-GT",
  "currency": "GTQ",
  "currency_name": "Quetzal",
  "languages": ["es"],
  "capital": "Guatemala City",
  "emoji": "🇬🇹",
  "emojiU": "U+1F1EC U+1F1F9",
  "fips": "GT",
  "internet": "GT",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Guernsey",
  "alpha2": "GG",
  "alpha3": "GGY",
  "numeric": "831",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "GBP",
  "currency_name": "Pound Sterling",
  "languages": ["en", "fr"],
  "capital": "St. Peter Port",
  "emoji": "🇬🇬",
  "emojiU": "U+1F1EC U+1F1EC",
  "fips": "GK",
  "internet": "GG",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Guinea",
  "alpha2": "GN",
  "alpha3": "GIN",
  "numeric": "324",
  "locales": ["fr-GN"],
  "default_locale": "fr-GN",
  "currency": "GNF",
  "currency_name": "Guinean Franc",
  "languages": ["fr", "ff"],
  "capital": "Conakry",
  "emoji": "🇬🇳",
  "emojiU": "U+1F1EC U+1F1F3",
  "fips": "GV",
  "internet": "GN",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Guinea-Bissau",
  "alpha2": "GW",
  "alpha3": "GNB",
  "numeric": "624",
  "locales": ["pt-GW"],
  "default_locale": "pt-GW",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["pt"],
  "capital": "Bissau",
  "emoji": "🇬🇼",
  "emojiU": "U+1F1EC U+1F1FC",
  "fips": "PU",
  "internet": "GW",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Guyana",
  "alpha2": "GY",
  "alpha3": "GUY",
  "numeric": "328",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "GYD",
  "currency_name": "Guyana Dollar",
  "languages": ["en"],
  "capital": "Georgetown",
  "emoji": "🇬🇾",
  "emojiU": "U+1F1EC U+1F1FE",
  "fips": "GY",
  "internet": "GY",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Haiti",
  "alpha2": "HT",
  "alpha3": "HTI",
  "numeric": "332",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["fr", "ht"],
  "capital": "Port-au-Prince",
  "emoji": "🇭🇹",
  "emojiU": "U+1F1ED U+1F1F9",
  "fips": "HA",
  "internet": "HT",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Heard Island and McDonald Islands",
  "alpha2": "HM",
  "alpha3": "HMD",
  "numeric": "334",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "",
  "emoji": "🇭🇲",
  "emojiU": "U+1F1ED U+1F1F2",
  "fips": "HM",
  "internet": "HM",
  "continent": "Indian Ocean",
  "region": "Southern Indian Ocean"
}, {
  "name": "Holy See",
  "alpha2": "VA",
  "alpha3": "VAT",
  "numeric": "336",
  "locales": ["it"],
  "default_locale": "it",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["it", "la"],
  "capital": "Vatican City",
  "emoji": "🇻🇦",
  "emojiU": "U+1F1FB U+1F1E6",
  "fips": "VT",
  "internet": "VA",
  "continent": "Europe",
  "region": "Southern Europe"
}, {
  "name": "Honduras",
  "alpha2": "HN",
  "alpha3": "HND",
  "numeric": "340",
  "locales": ["es-HN"],
  "default_locale": "es-HN",
  "currency": "HNL",
  "currency_name": "Lempira",
  "languages": ["es"],
  "capital": "Tegucigalpa",
  "emoji": "🇭🇳",
  "emojiU": "U+1F1ED U+1F1F3",
  "fips": "HO",
  "internet": "HN",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Hong Kong",
  "alpha2": "HK",
  "alpha3": "HKG",
  "numeric": "344",
  "locales": ["yue-Hant-HK", "zh-Hans-HK", "zh-Hant-HK", "en-HK"],
  "default_locale": "en-HK",
  "currency": "HKD",
  "currency_name": "Hong Kong Dollar",
  "languages": ["zh", "en"],
  "capital": "City of Victoria",
  "emoji": "🇭🇰",
  "emojiU": "U+1F1ED U+1F1F0",
  "fips": "HK",
  "internet": "HK",
  "continent": "Asia",
  "region": "East Asia"
}, {
  "name": "Hungary",
  "alpha2": "HU",
  "alpha3": "HUN",
  "numeric": "348",
  "locales": ["hu-HU"],
  "default_locale": "hu-HU",
  "currency": "HUF",
  "currency_name": "Forint",
  "languages": ["hu"],
  "capital": "Budapest",
  "emoji": "🇭🇺",
  "emojiU": "U+1F1ED U+1F1FA",
  "fips": "HU",
  "internet": "HU",
  "continent": "Europe",
  "region": "Central Europe"
}, {
  "name": "Iceland",
  "alpha2": "IS",
  "alpha3": "ISL",
  "numeric": "352",
  "locales": ["is-IS"],
  "default_locale": "is-IS",
  "currency": "ISK",
  "currency_name": "Iceland Krona",
  "languages": ["is"],
  "capital": "Reykjavik",
  "emoji": "🇮🇸",
  "emojiU": "U+1F1EE U+1F1F8",
  "fips": "IC",
  "internet": "IS",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "India",
  "alpha2": "IN",
  "alpha3": "IND",
  "numeric": "356",
  "locales": ["as-IN", "bn-IN", "en-IN", "gu-IN", "hi-IN", "kn-IN", "kok-IN", "ml-IN", "mr-IN", "ne-IN", "or-IN", "pa-Guru-IN", "ta-IN", "te-IN", "bo-IN", "ur-IN"],
  "default_locale": "hi-IN",
  "currency": "INR",
  "currency_name": "Indian Rupee",
  "languages": ["hi", "en"],
  "capital": "New Delhi",
  "emoji": "🇮🇳",
  "emojiU": "U+1F1EE U+1F1F3",
  "fips": "IN",
  "internet": "IN",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Indonesia",
  "alpha2": "ID",
  "alpha3": "IDN",
  "numeric": "360",
  "locales": ["id-ID"],
  "default_locale": "id-ID",
  "currency": "IDR",
  "currency_name": "Rupiah",
  "languages": ["id"],
  "capital": "Jakarta",
  "emoji": "🇮🇩",
  "emojiU": "U+1F1EE U+1F1E9",
  "fips": "ID",
  "internet": "ID",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Iran",
  "alpha2": "IR",
  "alpha3": "IRN",
  "numeric": "364",
  "locales": ["fa-IR"],
  "default_locale": "fa-IR",
  "currency": "XDR",
  "currency_name": "SDR (Special Drawing Right)",
  "languages": ["fa"],
  "capital": "Tehran",
  "emoji": "🇮🇷",
  "emojiU": "U+1F1EE U+1F1F7",
  "fips": "IR",
  "internet": "IR",
  "continent": "Asia",
  "region": "South West Asia",
  "alternate_names": ["Islamic Republic of Iran"]
}, {
  "name": "Iraq",
  "alpha2": "IQ",
  "alpha3": "IRQ",
  "numeric": "368",
  "locales": ["ar-IQ"],
  "default_locale": "ar-IQ",
  "currency": "IQD",
  "currency_name": "Iraqi Dinar",
  "languages": ["ar", "ku"],
  "capital": "Baghdad",
  "emoji": "🇮🇶",
  "emojiU": "U+1F1EE U+1F1F6",
  "fips": "IZ",
  "internet": "IQ",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Ireland",
  "alpha2": "IE",
  "alpha3": "IRL",
  "numeric": "372",
  "locales": ["en-IE", "ga-IE"],
  "default_locale": "en-IE",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["ga", "en"],
  "capital": "Dublin",
  "emoji": "🇮🇪",
  "emojiU": "U+1F1EE U+1F1EA",
  "fips": "EI",
  "internet": "IE",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Isle of Man",
  "alpha2": "IM",
  "alpha3": "IMN",
  "numeric": "833",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "GBP",
  "currency_name": "Pound Sterling",
  "languages": ["en", "gv"],
  "capital": "Douglas",
  "emoji": "🇮🇲",
  "emojiU": "U+1F1EE U+1F1F2",
  "fips": "IM",
  "internet": "IM",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Israel",
  "alpha2": "IL",
  "alpha3": "ISR",
  "numeric": "376",
  "locales": ["en-IL", "he-IL"],
  "default_locale": "he-IL",
  "currency": "ILS",
  "currency_name": "New Israeli Sheqel",
  "languages": ["he", "ar"],
  "capital": "Jerusalem",
  "emoji": "🇮🇱",
  "emojiU": "U+1F1EE U+1F1F1",
  "fips": "IS",
  "internet": "IL",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Italy",
  "alpha2": "IT",
  "alpha3": "ITA",
  "numeric": "380",
  "locales": ["it-IT"],
  "default_locale": "it-IT",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["it"],
  "capital": "Rome",
  "emoji": "🇮🇹",
  "emojiU": "U+1F1EE U+1F1F9",
  "fips": "IT",
  "internet": "IT",
  "continent": "Europe",
  "region": "Southern Europe"
}, {
  "name": "Jamaica",
  "alpha2": "JM",
  "alpha3": "JAM",
  "numeric": "388",
  "locales": ["en-JM"],
  "default_locale": "en-JM",
  "currency": "JMD",
  "currency_name": "Jamaican Dollar",
  "languages": ["en"],
  "capital": "Kingston",
  "emoji": "🇯🇲",
  "emojiU": "U+1F1EF U+1F1F2",
  "fips": "JM",
  "internet": "JM",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Japan",
  "alpha2": "JP",
  "alpha3": "JPN",
  "numeric": "392",
  "locales": ["ja-JP"],
  "default_locale": "ja-JP",
  "currency": "JPY",
  "currency_name": "Yen",
  "languages": ["ja"],
  "capital": "Tokyo",
  "emoji": "🇯🇵",
  "emojiU": "U+1F1EF U+1F1F5",
  "fips": "JA",
  "internet": "JP",
  "continent": "Asia",
  "region": "East Asia"
}, {
  "name": "Jersey",
  "alpha2": "JE",
  "alpha3": "JEY",
  "numeric": "832",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "GBP",
  "currency_name": "Pound Sterling",
  "languages": ["en", "fr"],
  "capital": "Saint Helier",
  "emoji": "🇯🇪",
  "emojiU": "U+1F1EF U+1F1EA",
  "fips": "JE",
  "internet": "JE",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Jordan",
  "alpha2": "JO",
  "alpha3": "JOR",
  "numeric": "400",
  "locales": ["ar-JO"],
  "default_locale": "ar-JO",
  "currency": "JOD",
  "currency_name": "Jordanian Dinar",
  "languages": ["ar"],
  "capital": "Amman",
  "emoji": "🇯🇴",
  "emojiU": "U+1F1EF U+1F1F4",
  "fips": "JO",
  "internet": "JO",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Kazakhstan",
  "alpha2": "KZ",
  "alpha3": "KAZ",
  "numeric": "398",
  "locales": ["kk-Cyrl-KZ"],
  "default_locale": "kk-Cyrl-KZ",
  "currency": "KZT",
  "currency_name": "Tenge",
  "languages": ["kk", "ru"],
  "capital": "Astana",
  "emoji": "🇰🇿",
  "emojiU": "U+1F1F0 U+1F1FF",
  "fips": "KZ",
  "internet": "KZ",
  "continent": "Asia",
  "region": "Central Asia"
}, {
  "name": "Kenya",
  "alpha2": "KE",
  "alpha3": "KEN",
  "numeric": "404",
  "locales": ["ebu-KE", "guz-KE", "kln-KE", "kam-KE", "ki-KE", "luo-KE", "luy-KE", "mas-KE", "mer-KE", "om-KE", "saq-KE", "so-KE", "sw-KE", "dav-KE", "teo-KE"],
  "default_locale": "ebu-KE",
  "currency": "KES",
  "currency_name": "Kenyan Shilling",
  "languages": ["en", "sw"],
  "capital": "Nairobi",
  "emoji": "🇰🇪",
  "emojiU": "U+1F1F0 U+1F1EA",
  "fips": "KE",
  "internet": "KE",
  "continent": "Africa",
  "region": "Eastern Africa"
}, {
  "name": "Kiribati",
  "alpha2": "KI",
  "alpha3": "KIR",
  "numeric": "296",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "South Tarawa",
  "emoji": "🇰🇮",
  "emojiU": "U+1F1F0 U+1F1EE",
  "fips": "KR",
  "internet": "KI",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "North Korea",
  "alpha2": "KP",
  "alpha3": "PRK",
  "numeric": "408",
  "locales": ["ko"],
  "default_locale": "ko",
  "currency": "KPW",
  "currency_name": "North Korean Won",
  "languages": ["ko"],
  "capital": "Pyongyang",
  "emoji": "🇰🇵",
  "emojiU": "U+1F1F0 U+1F1F5",
  "fips": "KN",
  "internet": "KP",
  "continent": "Asia",
  "region": "East Asia",
  "alternate_names": ["Democratic People's Republic of Korea"]
}, {
  "name": "South Korea",
  "alpha2": "KR",
  "alpha3": "KOR",
  "numeric": "410",
  "locales": ["ko-KR"],
  "default_locale": "ko-KR",
  "currency": "KRW",
  "currency_name": "South Korean Won",
  "languages": ["ko"],
  "capital": "Seoul",
  "emoji": "🇰🇷",
  "emojiU": "U+1F1F0 U+1F1F7",
  "fips": "KS",
  "internet": "KR",
  "continent": "Asia",
  "region": "East Asia",
  "alternate_names": ["Republic of Korea"]
}, {
  "name": "Kuwait",
  "alpha2": "KW",
  "alpha3": "KWT",
  "numeric": "414",
  "locales": ["ar-KW"],
  "default_locale": "ar-KW",
  "currency": "KWD",
  "currency_name": "Kuwaiti Dinar",
  "languages": ["ar"],
  "capital": "Kuwait City",
  "emoji": "🇰🇼",
  "emojiU": "U+1F1F0 U+1F1FC",
  "fips": "KU",
  "internet": "KW",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Kyrgyzstan",
  "alpha2": "KG",
  "alpha3": "KGZ",
  "numeric": "417",
  "locales": ["ky"],
  "default_locale": "ky",
  "currency": "KGS",
  "currency_name": "Som",
  "languages": ["ky", "ru"],
  "capital": "Bishkek",
  "emoji": "🇰🇬",
  "emojiU": "U+1F1F0 U+1F1EC",
  "fips": "KG",
  "internet": "KG",
  "continent": "Asia",
  "region": "Central Asia"
}, {
  "name": "Lao People's Democratic Republic",
  "alpha2": "LA",
  "alpha3": "LAO",
  "numeric": "418",
  "locales": ["lo"],
  "default_locale": "lo",
  "currency": "LAK",
  "currency_name": "Lao Kip",
  "languages": ["lo"],
  "capital": "Vientiane",
  "emoji": "🇱🇦",
  "emojiU": "U+1F1F1 U+1F1E6",
  "fips": "LA",
  "internet": "LA",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Latvia",
  "alpha2": "LV",
  "alpha3": "LVA",
  "numeric": "428",
  "locales": ["lv-LV"],
  "default_locale": "lv-LV",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["lv"],
  "capital": "Riga",
  "emoji": "🇱🇻",
  "emojiU": "U+1F1F1 U+1F1FB",
  "fips": "LG",
  "internet": "LV",
  "continent": "Europe",
  "region": "Eastern Europe"
}, {
  "name": "Lebanon",
  "alpha2": "LB",
  "alpha3": "LBN",
  "numeric": "422",
  "locales": ["ar-LB"],
  "default_locale": "ar-LB",
  "currency": "LBP",
  "currency_name": "Lebanese Pound",
  "languages": ["ar", "fr"],
  "capital": "Beirut",
  "emoji": "🇱🇧",
  "emojiU": "U+1F1F1 U+1F1E7",
  "fips": "LE",
  "internet": "LB",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Lesotho",
  "alpha2": "LS",
  "alpha3": "LSO",
  "numeric": "426",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "ZAR",
  "currency_name": "Rand",
  "languages": ["en", "st"],
  "capital": "Maseru",
  "emoji": "🇱🇸",
  "emojiU": "U+1F1F1 U+1F1F8",
  "fips": "LT",
  "internet": "LS",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Liberia",
  "alpha2": "LR",
  "alpha3": "LBR",
  "numeric": "430",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "LRD",
  "currency_name": "Liberian Dollar",
  "languages": ["en"],
  "capital": "Monrovia",
  "emoji": "🇱🇷",
  "emojiU": "U+1F1F1 U+1F1F7",
  "fips": "LI",
  "internet": "LR",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Libya",
  "alpha2": "LY",
  "alpha3": "LBY",
  "numeric": "434",
  "locales": ["ar-LY"],
  "default_locale": "ar-LY",
  "currency": "LYD",
  "currency_name": "Libyan Dinar",
  "languages": ["ar"],
  "capital": "Tripoli",
  "emoji": "🇱🇾",
  "emojiU": "U+1F1F1 U+1F1FE",
  "fips": "LY",
  "internet": "LY",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "Liechtenstein",
  "alpha2": "LI",
  "alpha3": "LIE",
  "numeric": "438",
  "locales": ["de-LI"],
  "default_locale": "de-LI",
  "currency": "CHF",
  "currency_name": "Swiss Franc",
  "languages": ["de"],
  "capital": "Vaduz",
  "emoji": "🇱🇮",
  "emojiU": "U+1F1F1 U+1F1EE",
  "fips": "LS",
  "internet": "LI",
  "continent": "Europe",
  "region": "Central Europe"
}, {
  "name": "Lithuania",
  "alpha2": "LT",
  "alpha3": "LTU",
  "numeric": "440",
  "locales": ["lt-LT"],
  "default_locale": "lt-LT",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["lt"],
  "capital": "Vilnius",
  "emoji": "🇱🇹",
  "emojiU": "U+1F1F1 U+1F1F9",
  "fips": "LH",
  "internet": "LT",
  "continent": "Europe",
  "region": "Eastern Europe"
}, {
  "name": "Luxembourg",
  "alpha2": "LU",
  "alpha3": "LUX",
  "numeric": "442",
  "locales": ["fr-LU", "de-LU"],
  "default_locale": "fr-LU",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr", "de", "lb"],
  "capital": "Luxembourg",
  "emoji": "🇱🇺",
  "emojiU": "U+1F1F1 U+1F1FA",
  "fips": "LU",
  "internet": "LU",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Macao",
  "alpha2": "MO",
  "alpha3": "MAC",
  "numeric": "446",
  "locales": ["zh-Hans-MO", "zh-Hant-MO"],
  "default_locale": "zh-Hans-MO",
  "currency": "MOP",
  "currency_name": "Pataca",
  "languages": ["zh", "pt"],
  "capital": "",
  "emoji": "🇲🇴",
  "emojiU": "U+1F1F2 U+1F1F4",
  "fips": "MC",
  "internet": "MO",
  "continent": "Asia",
  "region": "East Asia"
}, {
  "name": "Madagascar",
  "alpha2": "MG",
  "alpha3": "MDG",
  "numeric": "450",
  "locales": ["fr-MG", "mg-MG"],
  "default_locale": "fr-MG",
  "currency": "MGA",
  "currency_name": "Malagasy Ariary",
  "languages": ["fr", "mg"],
  "capital": "Antananarivo",
  "emoji": "🇲🇬",
  "emojiU": "U+1F1F2 U+1F1EC",
  "fips": "MA",
  "internet": "MG",
  "continent": "Africa",
  "region": "Indian Ocean"
}, {
  "name": "Malawi",
  "alpha2": "MW",
  "alpha3": "MWI",
  "numeric": "454",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "MWK",
  "currency_name": "Malawi Kwacha",
  "languages": ["en", "ny"],
  "capital": "Lilongwe",
  "emoji": "🇲🇼",
  "emojiU": "U+1F1F2 U+1F1FC",
  "fips": "MI",
  "internet": "MW",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Malaysia",
  "alpha2": "MY",
  "alpha3": "MYS",
  "numeric": "458",
  "locales": ["ms-MY"],
  "default_locale": "ms-MY",
  "currency": "MYR",
  "currency_name": "Malaysian Ringgit",
  "languages": ["ms"],
  "capital": "Kuala Lumpur",
  "emoji": "🇲🇾",
  "emojiU": "U+1F1F2 U+1F1FE",
  "fips": "MY",
  "internet": "MY",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Maldives",
  "alpha2": "MV",
  "alpha3": "MDV",
  "numeric": "462",
  "locales": ["dv"],
  "default_locale": "dv",
  "currency": "MVR",
  "currency_name": "Rufiyaa",
  "languages": ["dv"],
  "capital": "Malé",
  "emoji": "🇲🇻",
  "emojiU": "U+1F1F2 U+1F1FB",
  "fips": "MV",
  "internet": "MV",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Mali",
  "alpha2": "ML",
  "alpha3": "MLI",
  "numeric": "466",
  "locales": ["bm-ML", "fr-ML", "khq-ML", "ses-ML"],
  "default_locale": "fr-ML",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["fr"],
  "capital": "Bamako",
  "emoji": "🇲🇱",
  "emojiU": "U+1F1F2 U+1F1F1",
  "fips": "ML",
  "internet": "ML",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Malta",
  "alpha2": "MT",
  "alpha3": "MLT",
  "numeric": "470",
  "locales": ["en-MT", "mt-MT"],
  "default_locale": "en-MT",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["mt", "en"],
  "capital": "Valletta",
  "emoji": "🇲🇹",
  "emojiU": "U+1F1F2 U+1F1F9",
  "fips": "MT",
  "internet": "MT",
  "continent": "Europe",
  "region": "Southern Europe"
}, {
  "name": "Marshall Islands",
  "alpha2": "MH",
  "alpha3": "MHL",
  "numeric": "584",
  "locales": ["en-MH"],
  "default_locale": "en-MH",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en", "mh"],
  "capital": "Majuro",
  "emoji": "🇲🇭",
  "emojiU": "U+1F1F2 U+1F1ED",
  "fips": "RM",
  "internet": "MH",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Martinique",
  "alpha2": "MQ",
  "alpha3": "MTQ",
  "numeric": "474",
  "locales": ["fr-MQ"],
  "default_locale": "fr-MQ",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Fort-de-France",
  "emoji": "🇲🇶",
  "emojiU": "U+1F1F2 U+1F1F6",
  "fips": "MB",
  "internet": "MQ",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Mauritania",
  "alpha2": "MR",
  "alpha3": "MRT",
  "numeric": "478",
  "locales": ["ar"],
  "default_locale": "ar",
  "currency": "MRU",
  "currency_name": "Ouguiya",
  "languages": ["ar"],
  "capital": "Nouakchott",
  "emoji": "🇲🇷",
  "emojiU": "U+1F1F2 U+1F1F7",
  "fips": "MR",
  "internet": "MR",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Mauritius",
  "alpha2": "MU",
  "alpha3": "MUS",
  "numeric": "480",
  "locales": ["en-MU", "mfe-MU"],
  "default_locale": "en-MU",
  "currency": "MUR",
  "currency_name": "Mauritius Rupee",
  "languages": ["en"],
  "capital": "Port Louis",
  "emoji": "🇲🇺",
  "emojiU": "U+1F1F2 U+1F1FA",
  "fips": "MP",
  "internet": "MU",
  "continent": "Africa",
  "region": "Indian Ocean"
}, {
  "name": "Mayotte",
  "alpha2": "YT",
  "alpha3": "MYT",
  "numeric": "175",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Mamoudzou",
  "emoji": "🇾🇹",
  "emojiU": "U+1F1FE U+1F1F9",
  "fips": "MF",
  "internet": "YT",
  "continent": "Africa",
  "region": "Indian Ocean"
}, {
  "name": "Mexico",
  "alpha2": "MX",
  "alpha3": "MEX",
  "numeric": "484",
  "locales": ["es-MX"],
  "default_locale": "es-MX",
  "currency": "MXN",
  "currency_name": "Mexican Peso",
  "languages": ["es"],
  "capital": "Mexico City",
  "emoji": "🇲🇽",
  "emojiU": "U+1F1F2 U+1F1FD",
  "fips": "MX",
  "internet": "MX",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Micronesia",
  "alpha2": "FM",
  "alpha3": "FSM",
  "numeric": "583",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "RUB",
  "currency_name": "Russian Ruble",
  "languages": ["en"],
  "capital": "Palikir",
  "emoji": "🇫🇲",
  "emojiU": "U+1F1EB U+1F1F2",
  "fips": "",
  "internet": "FM",
  "continent": "Oceania",
  "region": "Pacific",
  "alternate_names": ["Federated States of Micronesia"]
}, {
  "name": "Moldova",
  "alpha2": "MD",
  "alpha3": "MDA",
  "numeric": "498",
  "locales": ["ro-MD", "ru-MD"],
  "default_locale": "ro-MD",
  "currency": "MDL",
  "currency_name": "Moldovan Leu",
  "languages": ["ro"],
  "capital": "Chișinău",
  "emoji": "🇲🇩",
  "emojiU": "U+1F1F2 U+1F1E9",
  "fips": "MD",
  "internet": "MD",
  "continent": "Europe",
  "region": "Eastern Europe",
  "alternate_names": ["Republic of Moldova"]
}, {
  "name": "Monaco",
  "alpha2": "MC",
  "alpha3": "MCO",
  "numeric": "492",
  "locales": ["fr-MC"],
  "default_locale": "fr-MC",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Monaco",
  "emoji": "🇲🇨",
  "emojiU": "U+1F1F2 U+1F1E8",
  "fips": "MN",
  "internet": "MC",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Mongolia",
  "alpha2": "MN",
  "alpha3": "MNG",
  "numeric": "496",
  "locales": ["mn"],
  "default_locale": "mn",
  "currency": "MNT",
  "currency_name": "Tugrik",
  "languages": ["mn"],
  "capital": "Ulan Bator",
  "emoji": "🇲🇳",
  "emojiU": "U+1F1F2 U+1F1F3",
  "fips": "MG",
  "internet": "MN",
  "continent": "Asia",
  "region": "Northern Asia"
}, {
  "name": "Montenegro",
  "alpha2": "ME",
  "alpha3": "MNE",
  "numeric": "499",
  "locales": ["sr-Cyrl-ME", "sr-Latn-ME"],
  "default_locale": "sr-Cyrl-ME",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["sr", "bs", "sq", "hr"],
  "capital": "Podgorica",
  "emoji": "🇲🇪",
  "emojiU": "U+1F1F2 U+1F1EA",
  "fips": "MJ",
  "internet": "ME",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Montserrat",
  "alpha2": "MS",
  "alpha3": "MSR",
  "numeric": "500",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "Plymouth",
  "emoji": "🇲🇸",
  "emojiU": "U+1F1F2 U+1F1F8",
  "fips": "MH",
  "internet": "MS",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Morocco",
  "alpha2": "MA",
  "alpha3": "MAR",
  "numeric": "504",
  "locales": ["ar-MA", "tzm-Latn-MA", "shi-Latn-MA", "shi-Tfng-MA"],
  "default_locale": "ar-MA",
  "currency": "MAD",
  "currency_name": "Moroccan Dirham",
  "languages": ["ar"],
  "capital": "Rabat",
  "emoji": "🇲🇦",
  "emojiU": "U+1F1F2 U+1F1E6",
  "fips": "MO",
  "internet": "MA",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "Mozambique",
  "alpha2": "MZ",
  "alpha3": "MOZ",
  "numeric": "508",
  "locales": ["pt-MZ", "seh-MZ"],
  "default_locale": "pt-MZ",
  "currency": "MZN",
  "currency_name": "Mozambique Metical",
  "languages": ["pt"],
  "capital": "Maputo",
  "emoji": "🇲🇿",
  "emojiU": "U+1F1F2 U+1F1FF",
  "fips": "MZ",
  "internet": "MZ",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Myanmar",
  "alpha2": "MM",
  "alpha3": "MMR",
  "numeric": "104",
  "locales": ["my-MM"],
  "default_locale": "my-MM",
  "currency": "MMK",
  "currency_name": "Kyat",
  "languages": ["my"],
  "capital": "Naypyidaw",
  "emoji": "🇲🇲",
  "emojiU": "U+1F1F2 U+1F1F2",
  "fips": "BM",
  "internet": "MM",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Namibia",
  "alpha2": "NA",
  "alpha3": "NAM",
  "numeric": "516",
  "locales": ["af-NA", "en-NA", "naq-NA"],
  "default_locale": "en-NA",
  "currency": "ZAR",
  "currency_name": "Rand",
  "languages": ["en", "af"],
  "capital": "Windhoek",
  "emoji": "🇳🇦",
  "emojiU": "U+1F1F3 U+1F1E6",
  "fips": "WA",
  "internet": "NA",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Nauru",
  "alpha2": "NR",
  "alpha3": "NRU",
  "numeric": "520",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en", "na"],
  "capital": "Yaren",
  "emoji": "🇳🇷",
  "emojiU": "U+1F1F3 U+1F1F7",
  "fips": "NR",
  "internet": "NR",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Nepal",
  "alpha2": "NP",
  "alpha3": "NPL",
  "numeric": "524",
  "locales": ["ne-NP"],
  "default_locale": "ne-NP",
  "currency": "NPR",
  "currency_name": "Nepalese Rupee",
  "languages": ["ne"],
  "capital": "Kathmandu",
  "emoji": "🇳🇵",
  "emojiU": "U+1F1F3 U+1F1F5",
  "fips": "NP",
  "internet": "NP",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Netherlands",
  "alpha2": "NL",
  "alpha3": "NLD",
  "numeric": "528",
  "locales": ["nl-NL"],
  "default_locale": "nl-NL",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["nl"],
  "capital": "Amsterdam",
  "emoji": "🇳🇱",
  "emojiU": "U+1F1F3 U+1F1F1",
  "fips": "NL",
  "internet": "NL",
  "continent": "Europe",
  "region": "Western Europe"
}, {
  "name": "Netherlands Antilles",
  "alpha2": "AN",
  "alpha3": "ANT",
  "numeric": "530",
  "locales": ["nl-AN"],
  "default_locale": "nl-AN",
  "currency": "ANG",
  "currency_name": "Netherlands Antillean Guilder",
  "fips": "NT",
  "internet": "AN",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "New Caledonia",
  "alpha2": "NC",
  "alpha3": "NCL",
  "numeric": "540",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "XPF",
  "currency_name": "CFP Franc",
  "languages": ["fr"],
  "capital": "Nouméa",
  "emoji": "🇳🇨",
  "emojiU": "U+1F1F3 U+1F1E8",
  "fips": "NC",
  "internet": "NC",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "New Zealand",
  "alpha2": "NZ",
  "alpha3": "NZL",
  "numeric": "554",
  "locales": ["en-NZ"],
  "default_locale": "en-NZ",
  "currency": "NZD",
  "currency_name": "New Zealand Dollar",
  "languages": ["en", "mi"],
  "capital": "Wellington",
  "emoji": "🇳🇿",
  "emojiU": "U+1F1F3 U+1F1FF",
  "fips": "NZ",
  "internet": "NZ",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Nicaragua",
  "alpha2": "NI",
  "alpha3": "NIC",
  "numeric": "558",
  "locales": ["es-NI"],
  "default_locale": "es-NI",
  "currency": "NIO",
  "currency_name": "Cordoba Oro",
  "languages": ["es"],
  "capital": "Managua",
  "emoji": "🇳🇮",
  "emojiU": "U+1F1F3 U+1F1EE",
  "fips": "NU",
  "internet": "NI",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Niger",
  "alpha2": "NE",
  "alpha3": "NER",
  "numeric": "562",
  "locales": ["fr-NE", "ha-Latn-NE"],
  "default_locale": "fr-NE",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["fr"],
  "capital": "Niamey",
  "emoji": "🇳🇪",
  "emojiU": "U+1F1F3 U+1F1EA",
  "fips": "NG",
  "internet": "NE",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Nigeria",
  "alpha2": "NG",
  "alpha3": "NGA",
  "numeric": "566",
  "locales": ["ha-Latn-NG", "ig-NG", "yo-NG"],
  "default_locale": "ha-Latn-NG",
  "currency": "NGN",
  "currency_name": "Naira",
  "languages": ["en"],
  "capital": "Abuja",
  "emoji": "🇳🇬",
  "emojiU": "U+1F1F3 U+1F1EC",
  "fips": "NI",
  "internet": "NG",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Niue",
  "alpha2": "NU",
  "alpha3": "NIU",
  "numeric": "570",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "NZD",
  "currency_name": "New Zealand Dollar",
  "languages": ["en"],
  "capital": "Alofi",
  "emoji": "🇳🇺",
  "emojiU": "U+1F1F3 U+1F1FA",
  "fips": "NE",
  "internet": "NU",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Norfolk Island",
  "alpha2": "NF",
  "alpha3": "NFK",
  "numeric": "574",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "Kingston",
  "emoji": "🇳🇫",
  "emojiU": "U+1F1F3 U+1F1EB",
  "fips": "NF",
  "internet": "NF",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "North Macedonia",
  "alpha2": "MK",
  "alpha3": "MKD",
  "numeric": "807",
  "locales": ["mk-MK"],
  "default_locale": "mk-MK",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["mk"],
  "capital": "Skopje",
  "emoji": "🇲🇰",
  "emojiU": "U+1F1F2 U+1F1F0",
  "fips": "MK",
  "internet": "MK",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Northern Mariana Islands",
  "alpha2": "MP",
  "alpha3": "MNP",
  "numeric": "580",
  "locales": ["en-MP"],
  "default_locale": "en-MP",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en", "ch"],
  "capital": "Saipan",
  "emoji": "🇲🇵",
  "emojiU": "U+1F1F2 U+1F1F5",
  "fips": "CQ",
  "internet": "MP",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Norway",
  "alpha2": "NO",
  "alpha3": "NOR",
  "numeric": "578",
  "locales": ["nb-NO", "nn-NO"],
  "default_locale": "nb-NO",
  "currency": "NOK",
  "currency_name": "Norwegian Krone",
  "languages": ["no", "nb", "nn"],
  "capital": "Oslo",
  "emoji": "🇳🇴",
  "emojiU": "U+1F1F3 U+1F1F4",
  "fips": "NO",
  "internet": "NO",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "Oman",
  "alpha2": "OM",
  "alpha3": "OMN",
  "numeric": "512",
  "locales": ["ar-OM"],
  "default_locale": "ar-OM",
  "currency": "OMR",
  "currency_name": "Rial Omani",
  "languages": ["ar"],
  "capital": "Muscat",
  "emoji": "🇴🇲",
  "emojiU": "U+1F1F4 U+1F1F2",
  "fips": "MU",
  "internet": "OM",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Pakistan",
  "alpha2": "PK",
  "alpha3": "PAK",
  "numeric": "586",
  "locales": ["en-PK", "pa-Arab-PK", "ur-PK"],
  "default_locale": "en-PK",
  "currency": "PKR",
  "currency_name": "Pakistan Rupee",
  "languages": ["en", "ur"],
  "capital": "Islamabad",
  "emoji": "🇵🇰",
  "emojiU": "U+1F1F5 U+1F1F0",
  "fips": "PK",
  "internet": "PK",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Palau",
  "alpha2": "PW",
  "alpha3": "PLW",
  "numeric": "585",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "Ngerulmud",
  "emoji": "🇵🇼",
  "emojiU": "U+1F1F5 U+1F1FC",
  "fips": "PS",
  "internet": "PW",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Palestine",
  "alpha2": "PS",
  "alpha3": "PSE",
  "numeric": "275",
  "locales": ["ar"],
  "default_locale": "ar",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["ar"],
  "capital": "Ramallah",
  "emoji": "🇵🇸",
  "emojiU": "U+1F1F5 U+1F1F8",
  "fips": "WE",
  "internet": "PS",
  "continent": "Asia",
  "region": "South West Asia",
  "alternate_names": ["State of Palestine"]
}, {
  "name": "Panama",
  "alpha2": "PA",
  "alpha3": "PAN",
  "numeric": "591",
  "locales": ["es-PA"],
  "default_locale": "es-PA",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["es"],
  "capital": "Panama City",
  "emoji": "🇵🇦",
  "emojiU": "U+1F1F5 U+1F1E6",
  "fips": "PM",
  "internet": "PA",
  "continent": "Americas",
  "region": "Central America"
}, {
  "name": "Papua New Guinea",
  "alpha2": "PG",
  "alpha3": "PNG",
  "numeric": "598",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "PGK",
  "currency_name": "Kina",
  "languages": ["en"],
  "capital": "Port Moresby",
  "emoji": "🇵🇬",
  "emojiU": "U+1F1F5 U+1F1EC",
  "fips": "PP",
  "internet": "PG",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Paraguay",
  "alpha2": "PY",
  "alpha3": "PRY",
  "numeric": "600",
  "locales": ["es-PY"],
  "default_locale": "es-PY",
  "currency": "PYG",
  "currency_name": "Guarani",
  "languages": ["es", "gn"],
  "capital": "Asunción",
  "emoji": "🇵🇾",
  "emojiU": "U+1F1F5 U+1F1FE",
  "fips": "PA",
  "internet": "PY",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Peru",
  "alpha2": "PE",
  "alpha3": "PER",
  "numeric": "604",
  "locales": ["es-PE"],
  "default_locale": "es-PE",
  "currency": "PEN",
  "currency_name": "Sol",
  "languages": ["es"],
  "capital": "Lima",
  "emoji": "🇵🇪",
  "emojiU": "U+1F1F5 U+1F1EA",
  "fips": "PE",
  "internet": "PE",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Philippines",
  "alpha2": "PH",
  "alpha3": "PHL",
  "numeric": "608",
  "locales": ["en-PH", "fil-PH"],
  "default_locale": "en-PH",
  "currency": "PHP",
  "currency_name": "Philippine Peso",
  "languages": ["en"],
  "capital": "Manila",
  "emoji": "🇵🇭",
  "emojiU": "U+1F1F5 U+1F1ED",
  "fips": "RP",
  "internet": "PH",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Pitcairn",
  "alpha2": "PN",
  "alpha3": "PCN",
  "numeric": "612",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "NZD",
  "currency_name": "New Zealand Dollar",
  "languages": ["en"],
  "capital": "Adamstown",
  "emoji": "🇵🇳",
  "emojiU": "U+1F1F5 U+1F1F3",
  "fips": "PC",
  "internet": "PN",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Poland",
  "alpha2": "PL",
  "alpha3": "POL",
  "numeric": "616",
  "locales": ["pl-PL"],
  "default_locale": "pl-PL",
  "currency": "PLN",
  "currency_name": "Zloty",
  "languages": ["pl"],
  "capital": "Warsaw",
  "emoji": "🇵🇱",
  "emojiU": "U+1F1F5 U+1F1F1",
  "fips": "PL",
  "internet": "PL",
  "continent": "Europe",
  "region": "Eastern Europe"
}, {
  "name": "Portugal",
  "alpha2": "PT",
  "alpha3": "PRT",
  "numeric": "620",
  "locales": ["pt-PT"],
  "default_locale": "pt-PT",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["pt"],
  "capital": "Lisbon",
  "emoji": "🇵🇹",
  "emojiU": "U+1F1F5 U+1F1F9",
  "fips": "PO",
  "internet": "PT",
  "continent": "Europe",
  "region": "South West Europe"
}, {
  "name": "Puerto Rico",
  "alpha2": "PR",
  "alpha3": "PRI",
  "numeric": "630",
  "locales": ["es-PR"],
  "default_locale": "es-PR",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["es", "en"],
  "capital": "San Juan",
  "emoji": "🇵🇷",
  "emojiU": "U+1F1F5 U+1F1F7",
  "fips": "RQ",
  "internet": "PR",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Qatar",
  "alpha2": "QA",
  "alpha3": "QAT",
  "numeric": "634",
  "locales": ["ar-QA"],
  "default_locale": "ar-QA",
  "currency": "QAR",
  "currency_name": "Qatari Rial",
  "languages": ["ar"],
  "capital": "Doha",
  "emoji": "🇶🇦",
  "emojiU": "U+1F1F6 U+1F1E6",
  "fips": "QA",
  "internet": "QA",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Romania",
  "alpha2": "RO",
  "alpha3": "ROU",
  "numeric": "642",
  "locales": ["ro-RO"],
  "default_locale": "ro-RO",
  "currency": "RON",
  "currency_name": "Romanian Leu",
  "languages": ["ro"],
  "capital": "Bucharest",
  "emoji": "🇷🇴",
  "emojiU": "U+1F1F7 U+1F1F4",
  "fips": "RO",
  "internet": "RO",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Russia",
  "alpha2": "RU",
  "alpha3": "RUS",
  "numeric": "643",
  "locales": ["ru-RU"],
  "default_locale": "ru-RU",
  "currency": "RUB",
  "currency_name": "Russian Ruble",
  "languages": ["ru"],
  "capital": "Moscow",
  "emoji": "🇷🇺",
  "emojiU": "U+1F1F7 U+1F1FA",
  "fips": "RS",
  "internet": "RU",
  "continent": "Asia",
  "region": "Northern Asia",
  "alternate_names": ["Russian Federation"]
}, {
  "name": "Rwanda",
  "alpha2": "RW",
  "alpha3": "RWA",
  "numeric": "646",
  "locales": ["fr-RW", "rw-RW"],
  "default_locale": "fr-RW",
  "currency": "RWF",
  "currency_name": "Rwanda Franc",
  "languages": ["rw", "en", "fr"],
  "capital": "Kigali",
  "emoji": "🇷🇼",
  "emojiU": "U+1F1F7 U+1F1FC",
  "fips": "RW",
  "internet": "RW",
  "continent": "Africa",
  "region": "Central Africa"
}, {
  "name": "Réunion",
  "alpha2": "RE",
  "alpha3": "REU",
  "numeric": "638",
  "locales": ["fr-RE"],
  "default_locale": "fr-RE",
  "currency": "RWF",
  "currency_name": "Rwanda Franc",
  "languages": ["fr"],
  "capital": "Saint-Denis",
  "emoji": "🇷🇪",
  "emojiU": "U+1F1F7 U+1F1EA",
  "fips": "RE",
  "internet": "RE",
  "continent": "Africa",
  "region": "Indian Ocean"
}, {
  "name": "Saint Barthélemy",
  "alpha2": "BL",
  "alpha3": "BLM",
  "numeric": "652",
  "locales": ["fr-BL"],
  "default_locale": "fr-BL",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Gustavia",
  "emoji": "🇧🇱",
  "emojiU": "U+1F1E7 U+1F1F1",
  "fips": "TB",
  "internet": "BL",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Saint Helena",
  "alpha2": "SH",
  "alpha3": "SHN",
  "numeric": "654",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "SHP",
  "currency_name": "Saint Helena Pound",
  "languages": ["en"],
  "capital": "Jamestown",
  "emoji": "🇸🇭",
  "emojiU": "U+1F1F8 U+1F1ED",
  "fips": "SH",
  "internet": "SH",
  "continent": "Atlantic Ocean",
  "region": "South Atlantic Ocean",
  "alternate_names": ["Saint Helena, Ascension and Tristan da Cunha"]
}, {
  "name": "Saint Kitts and Nevis",
  "alpha2": "KN",
  "alpha3": "KNA",
  "numeric": "659",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "Basseterre",
  "emoji": "🇰🇳",
  "emojiU": "U+1F1F0 U+1F1F3",
  "fips": "SC",
  "internet": "KN",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Saint Lucia",
  "alpha2": "LC",
  "alpha3": "LCA",
  "numeric": "662",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "Castries",
  "emoji": "🇱🇨",
  "emojiU": "U+1F1F1 U+1F1E8",
  "fips": "ST",
  "internet": "LC",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Saint Martin",
  "alpha2": "MF",
  "alpha3": "MAF",
  "numeric": "663",
  "locales": ["fr-MF"],
  "default_locale": "fr-MF",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["en", "fr", "nl"],
  "capital": "Marigot",
  "emoji": "🇲🇫",
  "emojiU": "U+1F1F2 U+1F1EB",
  "fips": "RN",
  "internet": "MF",
  "continent": "Americas",
  "region": "West Indies",
  "alternate_names": ["Saint Martin French part"]
}, {
  "name": "Saint Pierre and Miquelon",
  "alpha2": "PM",
  "alpha3": "SPM",
  "numeric": "666",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["fr"],
  "capital": "Saint-Pierre",
  "emoji": "🇵🇲",
  "emojiU": "U+1F1F5 U+1F1F2",
  "fips": "SB",
  "internet": "PM",
  "continent": "Americas",
  "region": "North America"
}, {
  "name": "Saint Vincent and the Grenadines",
  "alpha2": "VC",
  "alpha3": "VCT",
  "numeric": "670",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "XCD",
  "currency_name": "East Caribbean Dollar",
  "languages": ["en"],
  "capital": "Kingstown",
  "emoji": "🇻🇨",
  "emojiU": "U+1F1FB U+1F1E8",
  "fips": "VC",
  "internet": "VC",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Samoa",
  "alpha2": "WS",
  "alpha3": "WSM",
  "numeric": "882",
  "locales": ["sm"],
  "default_locale": "sm",
  "currency": "WST",
  "currency_name": "Tala",
  "languages": ["sm", "en"],
  "capital": "Apia",
  "emoji": "🇼🇸",
  "emojiU": "U+1F1FC U+1F1F8",
  "fips": "WS",
  "internet": "WS",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "San Marino",
  "alpha2": "SM",
  "alpha3": "SMR",
  "numeric": "674",
  "locales": ["it"],
  "default_locale": "it",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["it"],
  "capital": "City of San Marino",
  "emoji": "🇸🇲",
  "emojiU": "U+1F1F8 U+1F1F2",
  "fips": "SM",
  "internet": "SM",
  "continent": "Europe",
  "region": "Southern Europe"
}, {
  "name": "Sao Tome and Principe",
  "alpha2": "ST",
  "alpha3": "STP",
  "numeric": "678",
  "locales": ["pt"],
  "default_locale": "pt",
  "currency": "STN",
  "currency_name": "Dobra",
  "languages": ["pt"],
  "capital": "São Tomé",
  "emoji": "🇸🇹",
  "emojiU": "U+1F1F8 U+1F1F9",
  "fips": "TP",
  "internet": "ST",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Saudi Arabia",
  "alpha2": "SA",
  "alpha3": "SAU",
  "numeric": "682",
  "locales": ["ar-SA"],
  "default_locale": "ar-SA",
  "currency": "SAR",
  "currency_name": "Saudi Riyal",
  "languages": ["ar"],
  "capital": "Riyadh",
  "emoji": "🇸🇦",
  "emojiU": "U+1F1F8 U+1F1E6",
  "fips": "SA",
  "internet": "SA",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Senegal",
  "alpha2": "SN",
  "alpha3": "SEN",
  "numeric": "686",
  "locales": ["fr-SN", "ff-SN"],
  "default_locale": "fr-SN",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["fr"],
  "capital": "Dakar",
  "emoji": "🇸🇳",
  "emojiU": "U+1F1F8 U+1F1F3",
  "fips": "SG",
  "internet": "SN",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Serbia",
  "alpha2": "RS",
  "alpha3": "SRB",
  "numeric": "688",
  "locales": ["sr-Cyrl-RS", "sr-Latn-RS"],
  "default_locale": "sr-Cyrl-RS",
  "currency": "RSD",
  "currency_name": "Serbian Dinar",
  "languages": ["sr"],
  "capital": "Belgrade",
  "emoji": "🇷🇸",
  "emojiU": "U+1F1F7 U+1F1F8",
  "fips": "RI",
  "internet": "RS",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Seychelles",
  "alpha2": "SC",
  "alpha3": "SYC",
  "numeric": "690",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "SCR",
  "currency_name": "Seychelles Rupee",
  "languages": ["fr", "en"],
  "capital": "Victoria",
  "emoji": "🇸🇨",
  "emojiU": "U+1F1F8 U+1F1E8",
  "fips": "SE",
  "internet": "SC",
  "continent": "Africa",
  "region": "Indian Ocean"
}, {
  "name": "Sierra Leone",
  "alpha2": "SL",
  "alpha3": "SLE",
  "numeric": "694",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "SLL",
  "currency_name": "Leone",
  "languages": ["en"],
  "capital": "Freetown",
  "emoji": "🇸🇱",
  "emojiU": "U+1F1F8 U+1F1F1",
  "fips": "SL",
  "internet": "SL",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Singapore",
  "alpha2": "SG",
  "alpha3": "SGP",
  "numeric": "702",
  "locales": ["zh-Hans-SG", "en-SG"],
  "default_locale": "en-SG",
  "currency": "SGD",
  "currency_name": "Singapore Dollar",
  "languages": ["en", "ms", "ta", "zh"],
  "capital": "Singapore",
  "emoji": "🇸🇬",
  "emojiU": "U+1F1F8 U+1F1EC",
  "fips": "SN",
  "internet": "SG",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Sint Maarten",
  "alpha2": "SX",
  "alpha3": "SXM",
  "numeric": "534",
  "locales": ["nl"],
  "default_locale": "nl",
  "currency": "ANG",
  "currency_name": "Netherlands Antillean Guilder",
  "languages": ["nl", "en"],
  "capital": "Philipsburg",
  "emoji": "🇸🇽",
  "emojiU": "U+1F1F8 U+1F1FD",
  "fips": "NN",
  "internet": "SX",
  "continent": "Americas",
  "region": "West Indies",
  "alternate_names": ["Sint Maarten Dutch part"]
}, {
  "name": "Slovakia",
  "alpha2": "SK",
  "alpha3": "SVK",
  "numeric": "703",
  "locales": ["sk-SK"],
  "default_locale": "sk-SK",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["sk"],
  "capital": "Bratislava",
  "emoji": "🇸🇰",
  "emojiU": "U+1F1F8 U+1F1F0",
  "fips": "LO",
  "internet": "SK",
  "continent": "Europe",
  "region": "Central Europe"
}, {
  "name": "Slovenia",
  "alpha2": "SI",
  "alpha3": "SVN",
  "numeric": "705",
  "locales": ["sl-SI"],
  "default_locale": "sl-SI",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["sl"],
  "capital": "Ljubljana",
  "emoji": "🇸🇮",
  "emojiU": "U+1F1F8 U+1F1EE",
  "fips": "SI",
  "internet": "SI",
  "continent": "Europe",
  "region": "South East Europe"
}, {
  "name": "Solomon Islands",
  "alpha2": "SB",
  "alpha3": "SLB",
  "numeric": "090",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "SBD",
  "currency_name": "Solomon Islands Dollar",
  "languages": ["en"],
  "capital": "Honiara",
  "emoji": "🇸🇧",
  "emojiU": "U+1F1F8 U+1F1E7",
  "fips": "BP",
  "internet": "SB",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Somalia",
  "alpha2": "SO",
  "alpha3": "SOM",
  "numeric": "706",
  "locales": ["so-SO"],
  "default_locale": "so-SO",
  "currency": "SOS",
  "currency_name": "Somali Shilling",
  "languages": ["so", "ar"],
  "capital": "Mogadishu",
  "emoji": "🇸🇴",
  "emojiU": "U+1F1F8 U+1F1F4",
  "fips": "SO",
  "internet": "SO",
  "continent": "Africa",
  "region": "Eastern Africa"
}, {
  "name": "South Africa",
  "alpha2": "ZA",
  "alpha3": "ZAF",
  "numeric": "710",
  "locales": ["af-ZA", "en-ZA", "zu-ZA"],
  "default_locale": "af-ZA",
  "currency": "ZAR",
  "currency_name": "Rand",
  "languages": ["af", "en", "nr", "st", "ss", "tn", "ts", "ve", "xh", "zu"],
  "capital": "Pretoria",
  "emoji": "🇿🇦",
  "emojiU": "U+1F1FF U+1F1E6",
  "fips": "SF",
  "internet": "ZA",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "South Georgia and the South Sandwich Islands",
  "alpha2": "GS",
  "alpha3": "SGS",
  "numeric": "239",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "King Edward Point",
  "emoji": "🇬🇸",
  "emojiU": "U+1F1EC U+1F1F8",
  "fips": "SX",
  "internet": "GS",
  "continent": "Atlantic Ocean",
  "region": "South Atlantic Ocean"
}, {
  "name": "South Sudan",
  "alpha2": "SS",
  "alpha3": "SSD",
  "numeric": "728",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "SSP",
  "currency_name": "South Sudanese Pound",
  "languages": ["en"],
  "capital": "Juba",
  "emoji": "🇸🇸",
  "emojiU": "U+1F1F8 U+1F1F8",
  "fips": "OD",
  "internet": "SS",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "Spain",
  "alpha2": "ES",
  "alpha3": "ESP",
  "numeric": "724",
  "locales": ["eu-ES", "ca-ES", "gl-ES", "es-ES"],
  "default_locale": "es-ES",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["es", "eu", "ca", "gl", "oc"],
  "capital": "Madrid",
  "emoji": "🇪🇸",
  "emojiU": "U+1F1EA U+1F1F8",
  "fips": "SP",
  "internet": "ES",
  "continent": "Europe",
  "region": "South West Europe"
}, {
  "name": "Sri Lanka",
  "alpha2": "LK",
  "alpha3": "LKA",
  "numeric": "144",
  "locales": ["si-LK", "ta-LK"],
  "default_locale": "si-LK",
  "currency": "LKR",
  "currency_name": "Sri Lanka Rupee",
  "languages": ["si", "ta"],
  "capital": "Colombo",
  "emoji": "🇱🇰",
  "emojiU": "U+1F1F1 U+1F1F0",
  "fips": "CE",
  "internet": "LK",
  "continent": "Asia",
  "region": "South Asia"
}, {
  "name": "Sudan",
  "alpha2": "SD",
  "alpha3": "SDN",
  "numeric": "729",
  "locales": ["ar-SD"],
  "default_locale": "ar-SD",
  "currency": "SDG",
  "currency_name": "Sudanese Pound",
  "languages": ["ar", "en"],
  "capital": "Khartoum",
  "emoji": "🇸🇩",
  "emojiU": "U+1F1F8 U+1F1E9",
  "fips": "SU",
  "internet": "SD",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "Suriname",
  "alpha2": "SR",
  "alpha3": "SUR",
  "numeric": "740",
  "locales": ["nl"],
  "default_locale": "nl",
  "currency": "SRD",
  "currency_name": "Surinam Dollar",
  "languages": ["nl"],
  "capital": "Paramaribo",
  "emoji": "🇸🇷",
  "emojiU": "U+1F1F8 U+1F1F7",
  "fips": "NS",
  "internet": "SR",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Svalbard and Jan Mayen",
  "alpha2": "SJ",
  "alpha3": "SJM",
  "numeric": "744",
  "locales": ["no"],
  "default_locale": "no",
  "currency": "NOK",
  "currency_name": "Norwegian Krone",
  "languages": ["no"],
  "capital": "Longyearbyen",
  "emoji": "🇸🇯",
  "emojiU": "U+1F1F8 U+1F1EF",
  "fips": "SV",
  "internet": "SJ",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "Sweden",
  "alpha2": "SE",
  "alpha3": "SWE",
  "numeric": "752",
  "locales": ["sv-SE"],
  "default_locale": "sv-SE",
  "currency": "SEK",
  "currency_name": "Swedish Krona",
  "languages": ["sv"],
  "capital": "Stockholm",
  "emoji": "🇸🇪",
  "emojiU": "U+1F1F8 U+1F1EA",
  "fips": "SW",
  "internet": "SE",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "Switzerland",
  "alpha2": "CH",
  "alpha3": "CHE",
  "numeric": "756",
  "locales": ["fr-CH", "de-CH", "it-CH", "rm-CH", "gsw-CH"],
  "default_locale": "fr-CH",
  "currency": "CHW",
  "currency_name": "WIR Franc",
  "languages": ["de", "fr", "it"],
  "capital": "Bern",
  "emoji": "🇨🇭",
  "emojiU": "U+1F1E8 U+1F1ED",
  "fips": "SZ",
  "internet": "CH",
  "continent": "Europe",
  "region": "Central Europe"
}, {
  "name": "Syrian Arab Republic",
  "alpha2": "SY",
  "alpha3": "SYR",
  "numeric": "760",
  "locales": ["ar-SY"],
  "default_locale": "ar-SY",
  "currency": "SYP",
  "currency_name": "Syrian Pound",
  "languages": ["ar"],
  "capital": "Damascus",
  "emoji": "🇸🇾",
  "emojiU": "U+1F1F8 U+1F1FE",
  "fips": "SY",
  "internet": "SY",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Taiwan",
  "alpha2": "TW",
  "alpha3": "TWN",
  "numeric": "158",
  "locales": ["zh-Hant-TW"],
  "default_locale": "zh-Hant-TW",
  "currency": "TWD",
  "currency_name": "New Taiwan Dollar",
  "languages": ["zh"],
  "capital": "Taipei",
  "emoji": "🇹🇼",
  "emojiU": "U+1F1F9 U+1F1FC",
  "fips": "TW",
  "internet": "TW",
  "continent": "Asia",
  "region": "East Asia",
  "alternate_names": ["Province of China Taiwan"]
}, {
  "name": "Tajikistan",
  "alpha2": "TJ",
  "alpha3": "TJK",
  "numeric": "762",
  "locales": ["tg"],
  "default_locale": "tg",
  "currency": "TJS",
  "currency_name": "Somoni",
  "languages": ["tg", "ru"],
  "capital": "Dushanbe",
  "emoji": "🇹🇯",
  "emojiU": "U+1F1F9 U+1F1EF",
  "fips": "TI",
  "internet": "TJ",
  "continent": "Asia",
  "region": "Central Asia"
}, {
  "name": "Tanzania",
  "alpha2": "TZ",
  "alpha3": "TZA",
  "numeric": "834",
  "locales": ["asa-TZ", "bez-TZ", "lag-TZ", "jmc-TZ", "kde-TZ", "mas-TZ", "rof-TZ", "rwk-TZ", "sw-TZ", "vun-TZ"],
  "default_locale": "asa-TZ",
  "currency": "TZS",
  "currency_name": "Tanzanian Shilling",
  "languages": ["sw", "en"],
  "capital": "Dodoma",
  "emoji": "🇹🇿",
  "emojiU": "U+1F1F9 U+1F1FF",
  "fips": "TZ",
  "internet": "TZ",
  "continent": "Africa",
  "region": "Eastern Africa",
  "alternate_names": ["United Republic of Tanzania"]
}, {
  "name": "Thailand",
  "alpha2": "TH",
  "alpha3": "THA",
  "numeric": "764",
  "locales": ["th-TH"],
  "default_locale": "th-TH",
  "currency": "THB",
  "currency_name": "Baht",
  "languages": ["th"],
  "capital": "Bangkok",
  "emoji": "🇹🇭",
  "emojiU": "U+1F1F9 U+1F1ED",
  "fips": "TH",
  "internet": "TH",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Timor-Leste",
  "alpha2": "TL",
  "alpha3": "TLS",
  "numeric": "626",
  "locales": ["pt"],
  "default_locale": "pt",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["pt"],
  "capital": "Dili",
  "emoji": "🇹🇱",
  "emojiU": "U+1F1F9 U+1F1F1",
  "fips": "TT",
  "internet": "TL",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Togo",
  "alpha2": "TG",
  "alpha3": "TGO",
  "numeric": "768",
  "locales": ["ee-TG", "fr-TG"],
  "default_locale": "fr-TG",
  "currency": "XOF",
  "currency_name": "CFA Franc BCEAO",
  "languages": ["fr"],
  "capital": "Lomé",
  "emoji": "🇹🇬",
  "emojiU": "U+1F1F9 U+1F1EC",
  "fips": "TO",
  "internet": "TG",
  "continent": "Africa",
  "region": "Western Africa"
}, {
  "name": "Tokelau",
  "alpha2": "TK",
  "alpha3": "TKL",
  "numeric": "772",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "NZD",
  "currency_name": "New Zealand Dollar",
  "languages": ["en"],
  "capital": "Fakaofo",
  "emoji": "🇹🇰",
  "emojiU": "U+1F1F9 U+1F1F0",
  "fips": "TL",
  "internet": "TK",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Tonga",
  "alpha2": "TO",
  "alpha3": "TON",
  "numeric": "776",
  "locales": ["to-TO"],
  "default_locale": "to-TO",
  "currency": "TOP",
  "currency_name": "Pa’anga",
  "languages": ["en", "to"],
  "capital": "Nuku'alofa",
  "emoji": "🇹🇴",
  "emojiU": "U+1F1F9 U+1F1F4",
  "fips": "TN",
  "internet": "TO",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Trinidad and Tobago",
  "alpha2": "TT",
  "alpha3": "TTO",
  "numeric": "780",
  "locales": ["en-TT"],
  "default_locale": "en-TT",
  "currency": "TTD",
  "currency_name": "Trinidad and Tobago Dollar",
  "languages": ["en"],
  "capital": "Port of Spain",
  "emoji": "🇹🇹",
  "emojiU": "U+1F1F9 U+1F1F9",
  "fips": "TD",
  "internet": "TT",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Tunisia",
  "alpha2": "TN",
  "alpha3": "TUN",
  "numeric": "788",
  "locales": ["ar-TN"],
  "default_locale": "ar-TN",
  "currency": "TND",
  "currency_name": "Tunisian Dinar",
  "languages": ["ar"],
  "capital": "Tunis",
  "emoji": "🇹🇳",
  "emojiU": "U+1F1F9 U+1F1F3",
  "fips": "TS",
  "internet": "TN",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "Turkey",
  "alpha2": "TR",
  "alpha3": "TUR",
  "numeric": "792",
  "locales": ["tr-TR"],
  "default_locale": "tr-TR",
  "currency": "TRY",
  "currency_name": "Turkish Lira",
  "languages": ["tr"],
  "capital": "Ankara",
  "emoji": "🇹🇷",
  "emojiU": "U+1F1F9 U+1F1F7",
  "fips": "TU",
  "internet": "TR",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Turkmenistan",
  "alpha2": "TM",
  "alpha3": "TKM",
  "numeric": "795",
  "locales": ["tk"],
  "default_locale": "tk",
  "currency": "TMT",
  "currency_name": "Turkmenistan New Manat",
  "languages": ["tk", "ru"],
  "capital": "Ashgabat",
  "emoji": "🇹🇲",
  "emojiU": "U+1F1F9 U+1F1F2",
  "fips": "TX",
  "internet": "TM",
  "continent": "Asia",
  "region": "Central Asia"
}, {
  "name": "Turks and Caicos Islands",
  "alpha2": "TC",
  "alpha3": "TCA",
  "numeric": "796",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "Cockburn Town",
  "emoji": "🇹🇨",
  "emojiU": "U+1F1F9 U+1F1E8",
  "fips": "TK",
  "internet": "TC",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Tuvalu",
  "alpha2": "TV",
  "alpha3": "TUV",
  "numeric": "798",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "AUD",
  "currency_name": "Australian Dollar",
  "languages": ["en"],
  "capital": "Funafuti",
  "emoji": "🇹🇻",
  "emojiU": "U+1F1F9 U+1F1FB",
  "fips": "TV",
  "internet": "TV",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Uganda",
  "alpha2": "UG",
  "alpha3": "UGA",
  "numeric": "800",
  "locales": ["cgg-UG", "lg-UG", "nyn-UG", "xog-UG", "teo-UG"],
  "default_locale": "cgg-UG",
  "currency": "UGX",
  "currency_name": "Uganda Shilling",
  "languages": ["en", "sw"],
  "capital": "Kampala",
  "emoji": "🇺🇬",
  "emojiU": "U+1F1FA U+1F1EC",
  "fips": "UG",
  "internet": "UG",
  "continent": "Africa",
  "region": "Eastern Africa"
}, {
  "name": "Ukraine",
  "alpha2": "UA",
  "alpha3": "UKR",
  "numeric": "804",
  "locales": ["ru-UA", "uk-UA"],
  "default_locale": "uk-UA",
  "currency": "UAH",
  "currency_name": "Hryvnia",
  "languages": ["uk"],
  "capital": "Kyiv",
  "emoji": "🇺🇦",
  "emojiU": "U+1F1FA U+1F1E6",
  "fips": "UP",
  "internet": "UA",
  "continent": "Europe",
  "region": "Eastern Europe"
}, {
  "name": "United Arab Emirates",
  "alpha2": "AE",
  "alpha3": "ARE",
  "numeric": "784",
  "locales": ["ar-AE"],
  "default_locale": "ar-AE",
  "currency": "AED",
  "currency_name": "UAE Dirham",
  "languages": ["ar"],
  "capital": "Abu Dhabi",
  "emoji": "🇦🇪",
  "emojiU": "U+1F1E6 U+1F1EA",
  "fips": "TC",
  "internet": "AE",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "United Kingdom",
  "alpha2": "GB",
  "alpha3": "GBR",
  "numeric": "826",
  "locales": ["kw-GB", "en-GB", "gv-GB", "cy-GB"],
  "default_locale": "en-GB",
  "currency": "GBP",
  "currency_name": "Pound Sterling",
  "languages": ["en"],
  "capital": "London",
  "emoji": "🇬🇧",
  "emojiU": "U+1F1EC U+1F1E7",
  "fips": "UK",
  "internet": "UK",
  "continent": "Europe",
  "region": "Western Europe",
  "alternate_names": ["United Kingdom of Great Britain and Northern Ireland"]
}, {
  "name": "United States Minor Outlying Islands",
  "alpha2": "UM",
  "alpha3": "UMI",
  "numeric": "581",
  "locales": ["en-UM"],
  "default_locale": "en-UM",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "",
  "emoji": "🇺🇲",
  "emojiU": "U+1F1FA U+1F1F2",
  "fips": "",
  "internet": "US",
  "continent": "Americas",
  "region": "North America"
}, {
  "name": "United States",
  "alpha2": "US",
  "alpha3": "USA",
  "numeric": "840",
  "locales": ["chr-US", "en-US", "haw-US", "es-US"],
  "default_locale": "en-US",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "Washington D.C.",
  "emoji": "🇺🇸",
  "emojiU": "U+1F1FA U+1F1F8",
  "fips": "US",
  "internet": "US",
  "continent": "Americas",
  "region": "North America",
  "alternate_names": ["United States of America"]
}, {
  "name": "Uruguay",
  "alpha2": "UY",
  "alpha3": "URY",
  "numeric": "858",
  "locales": ["es-UY"],
  "default_locale": "es-UY",
  "currency": "UYU",
  "currency_name": "Peso Uruguayo",
  "languages": ["es"],
  "capital": "Montevideo",
  "emoji": "🇺🇾",
  "emojiU": "U+1F1FA U+1F1FE",
  "fips": "UY",
  "internet": "UY",
  "continent": "Americas",
  "region": "South America"
}, {
  "name": "Uzbekistan",
  "alpha2": "UZ",
  "alpha3": "UZB",
  "numeric": "860",
  "locales": ["uz-Cyrl-UZ", "uz-Latn-UZ"],
  "default_locale": "uz-Cyrl-UZ",
  "currency": "UZS",
  "currency_name": "Uzbekistan Sum",
  "languages": ["uz", "ru"],
  "capital": "Tashkent",
  "emoji": "🇺🇿",
  "emojiU": "U+1F1FA U+1F1FF",
  "fips": "UZ",
  "internet": "UZ",
  "continent": "Asia",
  "region": "Central Asia"
}, {
  "name": "Vanuatu",
  "alpha2": "VU",
  "alpha3": "VUT",
  "numeric": "548",
  "locales": ["bi"],
  "default_locale": "bi",
  "currency": "VUV",
  "currency_name": "Vatu",
  "languages": ["bi", "en", "fr"],
  "capital": "Port Vila",
  "emoji": "🇻🇺",
  "emojiU": "U+1F1FB U+1F1FA",
  "fips": "NH",
  "internet": "VU",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Venezuela",
  "alpha2": "VE",
  "alpha3": "VEN",
  "numeric": "862",
  "locales": ["es-VE"],
  "default_locale": "es-VE",
  "currency": "VUV",
  "currency_name": "Vatu",
  "languages": ["es"],
  "capital": "Caracas",
  "emoji": "🇻🇪",
  "emojiU": "U+1F1FB U+1F1EA",
  "fips": "VE",
  "internet": "UE",
  "continent": "Americas",
  "region": "South America",
  "alternate_names": ["Bolivarian Republic of Venezuela"]
}, {
  "name": "Viet Nam",
  "alpha2": "VN",
  "alpha3": "VNM",
  "numeric": "704",
  "locales": ["vi-VN"],
  "default_locale": "vi-VN",
  "currency": "VND",
  "currency_name": "Dong",
  "languages": ["vi"],
  "capital": "Hanoi",
  "emoji": "🇻🇳",
  "emojiU": "U+1F1FB U+1F1F3",
  "fips": "VN",
  "internet": "VN",
  "continent": "Asia",
  "region": "South East Asia"
}, {
  "name": "Virgin Islands (British)",
  "alpha2": "VG",
  "alpha3": "VGB",
  "numeric": "092",
  "locales": ["en"],
  "default_locale": "en",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "Road Town",
  "emoji": "🇻🇬",
  "emojiU": "U+1F1FB U+1F1EC",
  "fips": "VI",
  "internet": "VG",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Virgin Islands (U.S.)",
  "alpha2": "VI",
  "alpha3": "VIR",
  "numeric": "850",
  "locales": ["en-VI"],
  "default_locale": "en-VI",
  "currency": "USD",
  "currency_name": "US Dollar",
  "languages": ["en"],
  "capital": "Charlotte Amalie",
  "emoji": "🇻🇮",
  "emojiU": "U+1F1FB U+1F1EE",
  "fips": "VQ",
  "internet": "VI",
  "continent": "Americas",
  "region": "West Indies"
}, {
  "name": "Wallis and Futuna",
  "alpha2": "WF",
  "alpha3": "WLF",
  "numeric": "876",
  "locales": ["fr"],
  "default_locale": "fr",
  "currency": "XPF",
  "currency_name": "CFP Franc",
  "languages": ["fr"],
  "capital": "Mata-Utu",
  "emoji": "🇼🇫",
  "emojiU": "U+1F1FC U+1F1EB",
  "fips": "WF",
  "internet": "WF",
  "continent": "Oceania",
  "region": "Pacific"
}, {
  "name": "Western Sahara",
  "alpha2": "EH",
  "alpha3": "ESH",
  "numeric": "732",
  "locales": ["es"],
  "default_locale": "es",
  "currency": "MAD",
  "currency_name": "Moroccan Dirham",
  "languages": ["es"],
  "capital": "El Aaiún",
  "emoji": "🇪🇭",
  "emojiU": "U+1F1EA U+1F1ED",
  "fips": "WI",
  "internet": "EH",
  "continent": "Africa",
  "region": "Northern Africa"
}, {
  "name": "Yemen",
  "alpha2": "YE",
  "alpha3": "YEM",
  "numeric": "887",
  "locales": ["ar-YE"],
  "default_locale": "ar-YE",
  "currency": "YER",
  "currency_name": "Yemeni Rial",
  "languages": ["ar"],
  "capital": "Sana'a",
  "emoji": "🇾🇪",
  "emojiU": "U+1F1FE U+1F1EA",
  "fips": "YM",
  "internet": "YE",
  "continent": "Asia",
  "region": "South West Asia"
}, {
  "name": "Zambia",
  "alpha2": "ZM",
  "alpha3": "ZMB",
  "numeric": "894",
  "locales": ["bem-ZM"],
  "default_locale": "bem-ZM",
  "currency": "ZMW",
  "currency_name": "Zambian Kwacha",
  "languages": ["en"],
  "capital": "Lusaka",
  "emoji": "🇿🇲",
  "emojiU": "U+1F1FF U+1F1F2",
  "fips": "ZA",
  "internet": "ZM",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Zimbabwe",
  "alpha2": "ZW",
  "alpha3": "ZWE",
  "numeric": "716",
  "locales": ["en-ZW", "nd-ZW", "sn-ZW"],
  "default_locale": "en-ZW",
  "currency": "ZWL",
  "currency_name": "Zimbabwe Dollar",
  "languages": ["en", "sn", "nd"],
  "capital": "Harare",
  "emoji": "🇿🇼",
  "emojiU": "U+1F1FF U+1F1FC",
  "fips": "ZI",
  "internet": "ZW",
  "continent": "Africa",
  "region": "Southern Africa"
}, {
  "name": "Åland Islands",
  "alpha2": "AX",
  "alpha3": "ALA",
  "numeric": "248",
  "locales": ["sv"],
  "default_locale": "sv",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["sv"],
  "capital": "Mariehamn",
  "emoji": "🇦🇽",
  "emojiU": "U+1F1E6 U+1F1FD",
  "fips": "AX",
  "internet": "AX",
  "continent": "Europe",
  "region": "Northern Europe"
}, {
  "name": "Kosovo",
  "alpha2": "XK",
  "alpha3": "XKX",
  "numeric": "383",
  "locales": ["sq"],
  "default_locale": "sq",
  "currency": "EUR",
  "currency_name": "Euro",
  "languages": ["sq", "sr"],
  "capital": "Pristina",
  "emoji": "🇽🇰",
  "emojiU": "U+1F1FD U+1F1F0"
}];
},{}],"utils/money.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _countries = require("./countries.js");
/**
 * Gets the default locale for a given country code
 * @param {string} countryCode - The two-letter country code (ISO 3166-1 alpha-2)
 * @returns {string} The default locale for the country, falls back to 'en-US'
 */
var getDefaultLocaleByCountry = function getDefaultLocaleByCountry(countryCode) {
  var defaultLocale = "en-US";
  var country = _countries.contries.find(function (item) {
    return item.alpha2 === countryCode;
  });
  return country ? country.default_locale : defaultLocale;
};

/**
 * Formats a monetary value according to the current Shopify store settings
 * @param {number} value - The monetary value in cents
 * @returns {string} The formatted monetary value
 */
var format = function format(value) {
  var defaultCurrency = "USD";
  var defaultCountry = "US";
  var defaultLocale = "en-US";
  var currency = window.Shopify && window.Shopify.currency && window.Shopify.currency.active ? window.Shopify.currency.active : defaultCurrency;
  var country = window.Shopify && window.Shopify.country ? window.Shopify.country : defaultCountry;
  var locale = window.Shopify && window.Shopify.country ? getDefaultLocaleByCountry(country) : defaultLocale;
  var formattedValue = value;
  try {
    var formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency
    });
    formattedValue = formatter.format(value / 100.0);
  } catch (error) {
    console.error("Error formatting monetary value: ".concat(error.message));
  }
  return formattedValue;
};
var component = {
  /**
   * Initializes the money formatting module
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.money = component;
    component.money_format = typeof Shopify !== "undefined" && Shopify.money_format ? Shopify.money_format : "${{amount}}";
    component.initMoneyFormat();
  },
  /**
   * Initializes the money format functionality
   */
  initMoneyFormat: function initMoneyFormat() {
    component.format = format;
  }
};
var _default = exports.default = component;
},{"./countries.js":"utils/countries.js"}],"utils/escape.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var escape = {
  /**
   * Init component
   */
  init: function init() {
    document.onkeydown = function (event) {
      event = event || window.event;
      var key = event.key || event.keyCode;
      if (key === "Escape" || key === "Esc" || key === 27) {
        var _event = new CustomEvent("escape", {
          detail: {}
        });
        window.dispatchEvent(_event);
      }
    };
  }
};
var _default = exports.default = escape;
},{}],"utils/debounce.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _this = void 0;
var debounce = {
  /**
   * Init component
   */
  init: function init() {
    /**
     * Debounce module api
     *
     * @global
     */
    window.theme.debounce = debounce;
  },
  /**
   * Apply debounce.
   *
   * @param {function} fn A function.
   * @param {int} waint A time to wait.
   * @returns {function} A function.
   */
  apply: function apply(fn, wait) {
    var t;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      clearTimeout(t);
      t = setTimeout(function () {
        return fn.apply(_this, args);
      }, wait);
    };
  }
};
var _default = exports.default = debounce;
},{}],"../../node_modules/tabbable/dist/index.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabbable = exports.isTabbable = exports.isFocusable = exports.getTabIndex = exports.focusable = void 0;
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
// NOTE: separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)
// CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
//  the entire query to fail, resulting in no nodes found, which will break a lot
//  of things... so we have to rely on JS to identify nodes inside an inert container
var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function (element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};

/**
 * Determines if a node is inert or in an inert ancestor.
 * @param {Element} [node]
 * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
 *  see if any of them are inert. If false, only `node` itself is considered.
 * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
 *  False if `node` is falsy.
 */
var isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
  //  JS API property; we have to check the attribute, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's an active element
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
  var inert = inertAtt === '' || inertAtt === 'true';

  // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
  //  if it weren't for `matches()` not being a function on shadow roots; the following
  //  code works for any kind of node
  // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
  //  so it likely would not support `:is([inert] *)` either...
  var result = inert || lookUp && node && isInert(node.parentNode); // recursive

  return result;
};

/**
 * Determines if a node's content is editable.
 * @param {Element} [node]
 * @returns True if it's content-editable; false if it's not or `node` is falsy.
 */
var isContentEditable = function isContentEditable(node) {
  var _node$getAttribute2;
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
  //  to use the attribute directly to check for this, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's a non-editable element
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
  return attValue === '' || attValue === 'true';
};

/**
 * @param {Element} el container to check in
 * @param {boolean} includeContainer add container to check
 * @param {(node: Element) => boolean} filter filter candidates
 * @returns {Element[]}
 */
var getCandidates = function getCandidates(el, includeContainer, filter) {
  // even if `includeContainer=false`, we still have to check it for inertness because
  //  if it's inert, all its children are inert
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};

/**
 * @callback GetShadowRoot
 * @param {Element} element to check for shadow root
 * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
 */

/**
 * @callback ShadowRootFilter
 * @param {Element} shadowHostNode the element which contains shadow content
 * @returns {boolean} true if a shadow root could potentially contain valid candidates.
 */

/**
 * @typedef {Object} CandidateScope
 * @property {Element} scopeParent contains inner candidates
 * @property {Element[]} candidates list of candidates found in the scope parent
 */

/**
 * @typedef {Object} IterativeOptions
 * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
 *  if a function, implies shadow support is enabled and either returns the shadow root of an element
 *  or a boolean stating if it has an undisclosed shadow root
 * @property {(node: Element) => boolean} filter filter candidates
 * @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
 * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
 */

/**
 * @param {Element[]} elements list of element containers to match candidates from
 * @param {boolean} includeContainer add container list to check
 * @param {IterativeOptions} options
 * @returns {Array.<Element|CandidateScope>}
 */
var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      // no need to look up since we're drilling down
      // anything inside this container will also be inert
      continue;
    }
    if (element.tagName === 'SLOT') {
      // add shadow dom slot scope (slot itself cannot be focusable)
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      // check candidate element
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }

      // iterate over shadow content if possible
      var shadowRoot = element.shadowRoot ||
      // check for an undisclosed shadow
      typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);

      // no inert look up because we're already drilling down and checking for inertness
      //  on the way down, so all containers to this root node should have already been
      //  vetted as non-inert
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        // there's not shadow so just dig into the element's (light dom) children
        //  __without__ giving the element special scope treatment
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};

/**
 * @private
 * Determines if the node has an explicitly specified `tabindex` attribute.
 * @param {HTMLElement} node
 * @returns {boolean} True if so; false if not.
 */
var hasTabIndex = function hasTabIndex(node) {
  return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
};

/**
 * Determine the tab index of a given node.
 * @param {HTMLElement} node
 * @returns {number} Tab order (negative, 0, or positive number).
 * @throws {Error} If `node` is falsy.
 */
var getTabIndex = exports.getTabIndex = function getTabIndex(node) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};

/**
 * Determine the tab index of a given node __for sort order purposes__.
 * @param {HTMLElement} node
 * @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
 *  has tabIndex -1, but needs to be sorted by document order in order for its content to be
 *  inserted into the correct sort position.
 * @returns {number} Tab order (negative, 0, or positive number).
 */
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
  return node.tagName === 'INPUT';
};
var isHiddenInput = function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio(node) {
  return isInput(node) && node.type === 'radio';
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

// determines if a node is ultimately attached to the window's document
var isNodeAttached = function isNodeAttached(node) {
  var _nodeRoot;
  // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
  //  (but NOT _the_ document; see second 'If' comment below for more).
  // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
  //  is attached, and the one we need to check if it's in the document or not (because the
  //  shadow, and all nodes it contains, is never considered in the document since shadows
  //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
  //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
  //  visibility, including all the nodes it contains). The host could be any normal node,
  //  or a custom element (i.e. web component). Either way, that's the one that is considered
  //  part of the document, not the shadow root, nor any of its children (i.e. the node being
  //  tested).
  // To further complicate things, we have to look all the way up until we find a shadow HOST
  //  that is attached (or find none) because the node might be in nested shadows...
  // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
  //  document (per the docs) and while it's a Document-type object, that document does not
  //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
  //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
  //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
  //  node is actually detached.
  // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
  //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
  //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
  //  `ownerDocument` will be `null`, hence the optional chaining on it.
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

  // in some cases, a detached node will return itself as the root instead of a document or
  //  shadow root object, in which case, we shouldn't try to look further up the host chain
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
      //  which means we need to get the host's host and check if that parent host is contained
      //  in (i.e. attached to) the document
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    width = _node$getBoundingClie.width,
    height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
  var displayCheck = _ref.displayCheck,
    getShadowRoot = _ref.getShadowRoot;
  // NOTE: visibility will be `undefined` if node is detached from the document
  //  (see notes about this further down), which means we will consider it visible
  //  (this is legacy behavior from a very long way back)
  // NOTE: we check this regardless of `displayCheck="none"` because this is a
  //  _visibility_ check, not a _display_ check
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }
  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }
  if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
    if (typeof getShadowRoot === 'function') {
      // figure out if we should consider the node to be in an undisclosed shadow and use the
      //  'non-zero-area' fallback
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
        ) {
          // node has an undisclosed shadow which means we can only treat it as a black box, so we
          //  fall back to a non-zero-area test
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          // iterate up slot
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          // cross shadow boundary
          node = rootNode.host;
        } else {
          // iterate up normal dom
          node = parentElement;
        }
      }
      node = originalNode;
    }
    // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
    //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
    //  it might be a falsy value, which means shadow DOM support is disabled

    // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
    //  now we can just test to see if it would normally be visible or not, provided it's
    //  attached to the main document.
    // NOTE: We must consider case where node is inside a shadow DOM and given directly to
    //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

    if (isNodeAttached(node)) {
      // this works wherever the node is: if there's at least one client rect, it's
      //  somehow displayed; it also covers the CSS 'display: contents' case where the
      //  node itself is hidden in place of its contents; and there's no need to search
      //  up the hierarchy either
      return !node.getClientRects().length;
    }

    // Else, the node isn't attached to the document, which means the `getClientRects()`
    //  API will __always__ return zero rects (this can happen, for example, if React
    //  is used to render nodes onto a detached tree, as confirmed in this thread:
    //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
    //
    // It also means that even window.getComputedStyle(node).display will return `undefined`
    //  because styles are only computed for nodes that are in the document.
    //
    // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
    //  somehow. Though it was never stated officially, anyone who has ever used tabbable
    //  APIs on nodes in detached containers has actually implicitly used tabbable in what
    //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
    //  considering __everything__ to be visible because of the innability to determine styles.
    //
    // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
    //  nodes as visible with the 'none' fallback.__
    if (displayCheck !== 'legacy-full') {
      return true; // hidden
    }
    // else, fallback to 'none' mode and consider the node visible
  } else if (displayCheck === 'non-zero-area') {
    // NOTE: Even though this tests that the node's client rect is non-zero to determine
    //  whether it's displayed, and that a detached node will __always__ have a zero-area
    //  client rect, we don't special-case for whether the node is attached or not. In
    //  this mode, we do want to consider nodes that have a zero area to be hidden at all
    //  times, and that includes attached or not.
    return isZeroArea(node);
  }

  // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
  //  it's visible
  return false;
};

// form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
          }
        }
        // the disabled <fieldset> containing `node` has no <legend>
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled ||
  // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
  // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false;
};

/**
 * @param {Array.<Element|CandidateScope>} candidates
 * @returns Element[]
 */
var sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function (item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item: item,
        isScope: isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = exports.tabbable = function tabbable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = exports.focusable = function focusable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = exports.isTabbable = function isTabbable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');
var isFocusable = exports.isFocusable = function isFocusable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};
},{}],"libs/focus-trap.js":[function(require,module,exports) {
var define;
var global = arguments[3];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*!
* focus-trap 7.6.4
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, require('tabbable')) : typeof define === 'function' && define.amd ? define(['exports', 'tabbable'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, function () {
    var current = global.focusTrap;
    var exports = global.focusTrap = {};
    factory(exports, global.tabbable);
    exports.noConflict = function () {
      global.focusTrap = current;
      return exports;
    };
  }());
})(this, function (exports, tabbable) {
  'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != _typeof(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (undefined !== e) {
      var i = e.call(t, r || "default");
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : undefined;
    }
  }
  var activeFocusTraps = {
    activateTrap: function activateTrap(trapStack, trap) {
      if (trapStack.length > 0) {
        var activeTrap = trapStack[trapStack.length - 1];
        if (activeTrap !== trap) {
          activeTrap._setPausedState(true);
        }
      }
      var trapIndex = trapStack.indexOf(trap);
      if (trapIndex === -1) {
        trapStack.push(trap);
      } else {
        // move this existing trap to the front of the queue
        trapStack.splice(trapIndex, 1);
        trapStack.push(trap);
      }
    },
    deactivateTrap: function deactivateTrap(trapStack, trap) {
      var trapIndex = trapStack.indexOf(trap);
      if (trapIndex !== -1) {
        trapStack.splice(trapIndex, 1);
      }
      if (trapStack.length > 0 && !trapStack[trapStack.length - 1]._isManuallyPaused()) {
        trapStack[trapStack.length - 1]._setPausedState(false);
      }
    }
  };
  var isSelectableInput = function isSelectableInput(node) {
    return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
  };
  var isEscapeEvent = function isEscapeEvent(e) {
    return (e === null || e === undefined ? undefined : e.key) === 'Escape' || (e === null || e === undefined ? undefined : e.key) === 'Esc' || (e === null || e === undefined ? undefined : e.keyCode) === 27;
  };
  var isTabEvent = function isTabEvent(e) {
    return (e === null || e === undefined ? undefined : e.key) === 'Tab' || (e === null || e === undefined ? undefined : e.keyCode) === 9;
  };

  // checks for TAB by default
  var isKeyForward = function isKeyForward(e) {
    return isTabEvent(e) && !e.shiftKey;
  };

  // checks for SHIFT+TAB by default
  var isKeyBackward = function isKeyBackward(e) {
    return isTabEvent(e) && e.shiftKey;
  };
  var delay = function delay(fn) {
    return setTimeout(fn, 0);
  };

  /**
   * Get an option's value when it could be a plain value, or a handler that provides
   *  the value.
   * @param {*} value Option's value to check.
   * @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
   * @returns {*} The `value`, or the handler's returned value.
   */
  var valueOrHandler = function valueOrHandler(value) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    return typeof value === 'function' ? value.apply(undefined, params) : value;
  };
  var getActualTarget = function getActualTarget(event) {
    // NOTE: If the trap is _inside_ a shadow DOM, event.target will always be the
    //  shadow host. However, event.target.composedPath() will be an array of
    //  nodes "clicked" from inner-most (the actual element inside the shadow) to
    //  outer-most (the host HTML document). If we have access to composedPath(),
    //  then use its first element; otherwise, fall back to event.target (and
    //  this only works for an _open_ shadow DOM; otherwise,
    //  composedPath()[0] === event.target always).
    return event.target.shadowRoot && typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target;
  };

  // NOTE: this must be _outside_ `createFocusTrap()` to make sure all traps in this
  //  current instance use the same stack if `userOptions.trapStack` isn't specified
  var internalTrapStack = [];
  var createFocusTrap = function createFocusTrap(elements, userOptions) {
    // SSR: a live trap shouldn't be created in this type of environment so this
    //  should be safe code to execute if the `document` option isn't specified
    var doc = (userOptions === null || userOptions === undefined ? undefined : userOptions.document) || document;
    var trapStack = (userOptions === null || userOptions === undefined ? undefined : userOptions.trapStack) || internalTrapStack;
    var config = _objectSpread2({
      returnFocusOnDeactivate: true,
      escapeDeactivates: true,
      delayInitialFocus: true,
      isKeyForward: isKeyForward,
      isKeyBackward: isKeyBackward
    }, userOptions);
    var state = {
      // containers given to createFocusTrap()
      // @type {Array<HTMLElement>}
      containers: [],
      // list of objects identifying tabbable nodes in `containers` in the trap
      // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
      //  is active, but the trap should never get to a state where there isn't at least one group
      //  with at least one tabbable node in it (that would lead to an error condition that would
      //  result in an error being thrown)
      // @type {Array<{
      //   container: HTMLElement,
      //   tabbableNodes: Array<HTMLElement>, // empty if none
      //   focusableNodes: Array<HTMLElement>, // empty if none
      //   posTabIndexesFound: boolean,
      //   firstTabbableNode: HTMLElement|undefined,
      //   lastTabbableNode: HTMLElement|undefined,
      //   firstDomTabbableNode: HTMLElement|undefined,
      //   lastDomTabbableNode: HTMLElement|undefined,
      //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
      // }>}
      containerGroups: [],
      // same order/length as `containers` list

      // references to objects in `containerGroups`, but only those that actually have
      //  tabbable nodes in them
      // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
      //  the same length
      tabbableGroups: [],
      nodeFocusedBeforeActivation: null,
      mostRecentlyFocusedNode: null,
      active: false,
      paused: false,
      manuallyPaused: false,
      // timer ID for when delayInitialFocus is true and initial focus in this trap
      //  has been delayed during activation
      delayInitialFocusTimer: undefined,
      // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
      recentNavEvent: undefined
    };
    var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

    /**
     * Gets a configuration option value.
     * @param {Object|undefined} configOverrideOptions If true, and option is defined in this set,
     *  value will be taken from this object. Otherwise, value will be taken from base configuration.
     * @param {string} optionName Name of the option whose value is sought.
     * @param {string|undefined} [configOptionName] Name of option to use __instead of__ `optionName`
     *  IIF `configOverrideOptions` is not defined. Otherwise, `optionName` is used.
     */
    var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
      return configOverrideOptions && configOverrideOptions[optionName] !== undefined ? configOverrideOptions[optionName] : config[configOptionName || optionName];
    };

    /**
     * Finds the index of the container that contains the element.
     * @param {HTMLElement} element
     * @param {Event} [event] If available, and `element` isn't directly found in any container,
     *  the event's composed path is used to see if includes any known trap containers in the
     *  case where the element is inside a Shadow DOM.
     * @returns {number} Index of the container in either `state.containers` or
     *  `state.containerGroups` (the order/length of these lists are the same); -1
     *  if the element isn't found.
     */
    var findContainerIndex = function findContainerIndex(element, event) {
      var composedPath = typeof (event === null || event === undefined ? undefined : event.composedPath) === 'function' ? event.composedPath() : undefined;
      // NOTE: search `containerGroups` because it's possible a group contains no tabbable
      //  nodes, but still contains focusable nodes (e.g. if they all have `tabindex=-1`)
      //  and we still need to find the element in there
      return state.containerGroups.findIndex(function (_ref) {
        var container = _ref.container,
          tabbableNodes = _ref.tabbableNodes;
        return container.contains(element) || (
        // fall back to explicit tabbable search which will take into consideration any
        //  web components if the `tabbableOptions.getShadowRoot` option was used for
        //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
        //  look inside web components even if open)
        composedPath === null || composedPath === undefined ? undefined : composedPath.includes(container)) || tabbableNodes.find(function (node) {
          return node === element;
        });
      });
    };

    /**
     * Gets the node for the given option, which is expected to be an option that
     *  can be either a DOM node, a string that is a selector to get a node, `false`
     *  (if a node is explicitly NOT given), or a function that returns any of these
     *  values.
     * @param {string} optionName
     * @param {Object} options
     * @param {boolean} [options.hasFallback] True if the option could be a selector string
     *  and the option allows for a fallback scenario in the case where the selector is
     *  valid but does not match a node (i.e. the queried node doesn't exist in the DOM).
     * @param {Array} [options.params] Params to pass to the option if it's a function.
     * @returns {undefined | null | false | HTMLElement | SVGElement} Returns
     *  `undefined` if the option is not specified; `null` if the option didn't resolve
     *  to a node but `options.hasFallback=true`, `false` if the option resolved to `false`
     *  (node explicitly not given); otherwise, the resolved DOM node.
     * @throws {Error} If the option is set, not `false`, and is not, or does not
     *  resolve to a node, unless the option is a selector string and `options.hasFallback=true`.
     */
    var getNodeForOption = function getNodeForOption(optionName) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$hasFallback = _ref2.hasFallback,
        hasFallback = _ref2$hasFallback === undefined ? false : _ref2$hasFallback,
        _ref2$params = _ref2.params,
        params = _ref2$params === undefined ? [] : _ref2$params;
      var optionValue = config[optionName];
      if (typeof optionValue === 'function') {
        optionValue = optionValue.apply(undefined, _toConsumableArray(params));
      }
      if (optionValue === true) {
        optionValue = undefined; // use default value
      }
      if (!optionValue) {
        if (optionValue === undefined || optionValue === false) {
          return optionValue;
        }
        // else, empty string (invalid), null (invalid), 0 (invalid)

        throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
      }
      var node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

      if (typeof optionValue === 'string') {
        try {
          node = doc.querySelector(optionValue); // resolve to node, or null if fails
        } catch (err) {
          throw new Error("`".concat(optionName, "` appears to be an invalid selector; error=\"").concat(err.message, "\""));
        }
        if (!node) {
          if (!hasFallback) {
            throw new Error("`".concat(optionName, "` as selector refers to no known node"));
          }
          // else, `node` MUST be `null` because that's what `Document.querySelector()` returns
          //  if the selector is valid but doesn't match anything
        }
      }
      return node;
    };
    var getInitialFocusNode = function getInitialFocusNode() {
      var node = getNodeForOption('initialFocus', {
        hasFallback: true
      });

      // false explicitly indicates we want no initialFocus at all
      if (node === false) {
        return false;
      }
      if (node === undefined || node && !tabbable.isFocusable(node, config.tabbableOptions)) {
        // option not specified nor focusable: use fallback options
        if (findContainerIndex(doc.activeElement) >= 0) {
          node = doc.activeElement;
        } else {
          var firstTabbableGroup = state.tabbableGroups[0];
          var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;

          // NOTE: `fallbackFocus` option function cannot return `false` (not supported)
          node = firstTabbableNode || getNodeForOption('fallbackFocus');
        }
      } else if (node === null) {
        // option is a VALID selector string that doesn't yield a node: use the `fallbackFocus`
        //  option instead of the default behavior when the option isn't specified at all
        node = getNodeForOption('fallbackFocus');
      }
      if (!node) {
        throw new Error('Your focus-trap needs to have at least one focusable element');
      }
      return node;
    };
    var updateTabbableNodes = function updateTabbableNodes() {
      state.containerGroups = state.containers.map(function (container) {
        var tabbableNodes = tabbable.tabbable(container, config.tabbableOptions);

        // NOTE: if we have tabbable nodes, we must have focusable nodes; focusable nodes
        //  are a superset of tabbable nodes since nodes with negative `tabindex` attributes
        //  are focusable but not tabbable
        var focusableNodes = tabbable.focusable(container, config.tabbableOptions);
        var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : undefined;
        var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : undefined;
        var firstDomTabbableNode = focusableNodes.find(function (node) {
          return tabbable.isTabbable(node);
        });
        var lastDomTabbableNode = focusableNodes.slice().reverse().find(function (node) {
          return tabbable.isTabbable(node);
        });
        var posTabIndexesFound = !!tabbableNodes.find(function (node) {
          return tabbable.getTabIndex(node) > 0;
        });
        return {
          container: container,
          tabbableNodes: tabbableNodes,
          focusableNodes: focusableNodes,
          /** True if at least one node with positive `tabindex` was found in this container. */
          posTabIndexesFound: posTabIndexesFound,
          /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
          firstTabbableNode: firstTabbableNode,
          /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
          lastTabbableNode: lastTabbableNode,
          // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
          //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          //  because that API doesn't work with Shadow DOM as well as it should (@see
          //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
          //  to address an edge case related to positive tabindex support, this seems like a much easier,
          //  "close enough most of the time" alternative for positive tabindexes which should generally
          //  be avoided anyway...
          /** First tabbable node in container, __DOM__ order; `undefined` if none. */
          firstDomTabbableNode: firstDomTabbableNode,
          /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
          lastDomTabbableNode: lastDomTabbableNode,
          /**
           * Finds the __tabbable__ node that follows the given node in the specified direction,
           *  in this container, if any.
           * @param {HTMLElement} node
           * @param {boolean} [forward] True if going in forward tab order; false if going
           *  in reverse.
           * @returns {HTMLElement|undefined} The next tabbable node, if any.
           */
          nextTabbableNode: function nextTabbableNode(node) {
            var forward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var nodeIdx = tabbableNodes.indexOf(node);
            if (nodeIdx < 0) {
              // either not tabbable nor focusable, or was focused but not tabbable (negative tabindex):
              //  since `node` should at least have been focusable, we assume that's the case and mimic
              //  what browsers do, which is set focus to the next node in __document position order__,
              //  regardless of positive tabindexes, if any -- and for reasons explained in the NOTE
              //  above related to `firstDomTabbable` and `lastDomTabbable` properties, we fall back to
              //  basic DOM order
              if (forward) {
                return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function (el) {
                  return tabbable.isTabbable(el);
                });
              }
              return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function (el) {
                return tabbable.isTabbable(el);
              });
            }
            return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
          }
        };
      });
      state.tabbableGroups = state.containerGroups.filter(function (group) {
        return group.tabbableNodes.length > 0;
      });

      // throw if no groups have tabbable nodes and we don't have a fallback focus node either
      if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus') // returning false not supported for this option
      ) {
        throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
      }

      // NOTE: Positive tabindexes are only properly supported in single-container traps because
      //  doing it across multiple containers where tabindexes could be all over the place
      //  would require Tabbable to support multiple containers, would require additional
      //  specialized Shadow DOM support, and would require Tabbable's multi-container support
      //  to look at those containers in document position order rather than user-provided
      //  order (as they are treated in Focus-trap, for legacy reasons). See discussion on
      //  https://github.com/focus-trap/focus-trap/issues/375 for more details.
      if (state.containerGroups.find(function (g) {
        return g.posTabIndexesFound;
      }) && state.containerGroups.length > 1) {
        throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
      }
    };

    /**
     * Gets the current activeElement. If it's a web-component and has open shadow-root
     * it will recursively search inside shadow roots for the "true" activeElement.
     *
     * @param {Document | ShadowRoot} el
     *
     * @returns {HTMLElement} The element that currently has the focus
     **/
    var _getActiveElement = function getActiveElement(el) {
      var activeElement = el.activeElement;
      if (!activeElement) {
        return;
      }
      if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
        return _getActiveElement(activeElement.shadowRoot);
      }
      return activeElement;
    };
    var _tryFocus = function tryFocus(node) {
      if (node === false) {
        return;
      }
      if (node === _getActiveElement(document)) {
        return;
      }
      if (!node || !node.focus) {
        _tryFocus(getInitialFocusNode());
        return;
      }
      node.focus({
        preventScroll: !!config.preventScroll
      });
      // NOTE: focus() API does not trigger focusIn event so set MRU node manually
      state.mostRecentlyFocusedNode = node;
      if (isSelectableInput(node)) {
        node.select();
      }
    };
    var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
      var node = getNodeForOption('setReturnFocus', {
        params: [previousActiveElement]
      });
      return node ? node : node === false ? false : previousActiveElement;
    };

    /**
     * Finds the next node (in either direction) where focus should move according to a
     *  keyboard focus-in event.
     * @param {Object} params
     * @param {Node} [params.target] Known target __from which__ to navigate, if any.
     * @param {KeyboardEvent|FocusEvent} [params.event] Event to use if `target` isn't known (event
     *  will be used to determine the `target`). Ignored if `target` is specified.
     * @param {boolean} [params.isBackward] True if focus should move backward.
     * @returns {Node|undefined} The next node, or `undefined` if a next node couldn't be
     *  determined given the current state of the trap.
     */
    var findNextNavNode = function findNextNavNode(_ref3) {
      var target = _ref3.target,
        event = _ref3.event,
        _ref3$isBackward = _ref3.isBackward,
        isBackward = _ref3$isBackward === undefined ? false : _ref3$isBackward;
      target = target || getActualTarget(event);
      updateTabbableNodes();
      var destinationNode = null;
      if (state.tabbableGroups.length > 0) {
        // make sure the target is actually contained in a group
        // NOTE: the target may also be the container itself if it's focusable
        //  with tabIndex='-1' and was given initial focus
        var containerIndex = findContainerIndex(target, event);
        var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : undefined;
        if (containerIndex < 0) {
          // target not found in any group: quite possible focus has escaped the trap,
          //  so bring it back into...
          if (isBackward) {
            // ...the last node in the last group
            destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
          } else {
            // ...the first node in the first group
            destinationNode = state.tabbableGroups[0].firstTabbableNode;
          }
        } else if (isBackward) {
          // REVERSE

          // is the target the first tabbable node in a group?
          var startOfGroupIndex = state.tabbableGroups.findIndex(function (_ref4) {
            var firstTabbableNode = _ref4.firstTabbableNode;
            return target === firstTabbableNode;
          });
          if (startOfGroupIndex < 0 && (containerGroup.container === target || tabbable.isFocusable(target, config.tabbableOptions) && !tabbable.isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
            // an exception case where the target is either the container itself, or
            //  a non-tabbable node that was given focus (i.e. tabindex is negative
            //  and user clicked on it or node was programmatically given focus)
            //  and is not followed by any other tabbable node, in which
            //  case, we should handle shift+tab as if focus were on the container's
            //  first tabbable node, and go to the last tabbable node of the LAST group
            startOfGroupIndex = containerIndex;
          }
          if (startOfGroupIndex >= 0) {
            // YES: then shift+tab should go to the last tabbable node in the
            //  previous group (and wrap around to the last tabbable node of
            //  the LAST group if it's the first tabbable node of the FIRST group)
            var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
            var destinationGroup = state.tabbableGroups[destinationGroupIndex];
            destinationNode = tabbable.getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
          } else if (!isTabEvent(event)) {
            // user must have customized the nav keys so we have to move focus manually _within_
            //  the active group: do this based on the order determined by tabbable()
            destinationNode = containerGroup.nextTabbableNode(target, false);
          }
        } else {
          // FORWARD

          // is the target the last tabbable node in a group?
          var lastOfGroupIndex = state.tabbableGroups.findIndex(function (_ref5) {
            var lastTabbableNode = _ref5.lastTabbableNode;
            return target === lastTabbableNode;
          });
          if (lastOfGroupIndex < 0 && (containerGroup.container === target || tabbable.isFocusable(target, config.tabbableOptions) && !tabbable.isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
            // an exception case where the target is the container itself, or
            //  a non-tabbable node that was given focus (i.e. tabindex is negative
            //  and user clicked on it or node was programmatically given focus)
            //  and is not followed by any other tabbable node, in which
            //  case, we should handle tab as if focus were on the container's
            //  last tabbable node, and go to the first tabbable node of the FIRST group
            lastOfGroupIndex = containerIndex;
          }
          if (lastOfGroupIndex >= 0) {
            // YES: then tab should go to the first tabbable node in the next
            //  group (and wrap around to the first tabbable node of the FIRST
            //  group if it's the last tabbable node of the LAST group)
            var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
            var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
            destinationNode = tabbable.getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
          } else if (!isTabEvent(event)) {
            // user must have customized the nav keys so we have to move focus manually _within_
            //  the active group: do this based on the order determined by tabbable()
            destinationNode = containerGroup.nextTabbableNode(target);
          }
        }
      } else {
        // no groups available
        // NOTE: the fallbackFocus option does not support returning false to opt-out
        destinationNode = getNodeForOption('fallbackFocus');
      }
      return destinationNode;
    };

    // This needs to be done on mousedown and touchstart instead of click
    // so that it precedes the focus event.
    var checkPointerDown = function checkPointerDown(e) {
      var target = getActualTarget(e);
      if (findContainerIndex(target, e) >= 0) {
        // allow the click since it ocurred inside the trap
        return;
      }
      if (valueOrHandler(config.clickOutsideDeactivates, e)) {
        // immediately deactivate the trap
        trap.deactivate({
          // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
          //  which will result in the outside click setting focus to the node
          //  that was clicked (and if not focusable, to "nothing"); by setting
          //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
          //  on activation (or the configured `setReturnFocus` node), whether the
          //  outside click was on a focusable node or not
          returnFocus: config.returnFocusOnDeactivate
        });
        return;
      }

      // This is needed for mobile devices.
      // (If we'll only let `click` events through,
      // then on mobile they will be blocked anyways if `touchstart` is blocked.)
      if (valueOrHandler(config.allowOutsideClick, e)) {
        // allow the click outside the trap to take place
        return;
      }

      // otherwise, prevent the click
      e.preventDefault();
    };

    // In case focus escapes the trap for some strange reason, pull it back in.
    // NOTE: the focusIn event is NOT cancelable, so if focus escapes, it may cause unexpected
    //  scrolling if the node that got focused was out of view; there's nothing we can do to
    //  prevent that from happening by the time we discover that focus escaped
    var checkFocusIn = function checkFocusIn(event) {
      var target = getActualTarget(event);
      var targetContained = findContainerIndex(target, event) >= 0;

      // In Firefox when you Tab out of an iframe the Document is briefly focused.
      if (targetContained || target instanceof Document) {
        if (targetContained) {
          state.mostRecentlyFocusedNode = target;
        }
      } else {
        // escaped! pull it back in to where it just left
        event.stopImmediatePropagation();

        // focus will escape if the MRU node had a positive tab index and user tried to nav forward;
        //  it will also escape if the MRU node had a 0 tab index and user tried to nav backward
        //  toward a node with a positive tab index
        var nextNode; // next node to focus, if we find one
        var navAcrossContainers = true;
        if (state.mostRecentlyFocusedNode) {
          if (tabbable.getTabIndex(state.mostRecentlyFocusedNode) > 0) {
            // MRU container index must be >=0 otherwise we wouldn't have it as an MRU node...
            var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
            // there MAY not be any tabbable nodes in the container if there are at least 2 containers
            //  and the MRU node is focusable but not tabbable (focus-trap requires at least 1 container
            //  with at least one tabbable node in order to function, so this could be the other container
            //  with nothing tabbable in it)
            var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
            if (tabbableNodes.length > 0) {
              // MRU tab index MAY not be found if the MRU node is focusable but not tabbable
              var mruTabIdx = tabbableNodes.findIndex(function (node) {
                return node === state.mostRecentlyFocusedNode;
              });
              if (mruTabIdx >= 0) {
                if (config.isKeyForward(state.recentNavEvent)) {
                  if (mruTabIdx + 1 < tabbableNodes.length) {
                    nextNode = tabbableNodes[mruTabIdx + 1];
                    navAcrossContainers = false;
                  }
                  // else, don't wrap within the container as focus should move to next/previous
                  //  container
                } else {
                  if (mruTabIdx - 1 >= 0) {
                    nextNode = tabbableNodes[mruTabIdx - 1];
                    navAcrossContainers = false;
                  }
                  // else, don't wrap within the container as focus should move to next/previous
                  //  container
                }
                // else, don't find in container order without considering direction too
              }
            }
            // else, no tabbable nodes in that container (which means we must have at least one other
            //  container with at least one tabbable node in it, otherwise focus-trap would've thrown
            //  an error the last time updateTabbableNodes() was run): find next node among all known
            //  containers
          } else {
            // check to see if there's at least one tabbable node with a positive tab index inside
            //  the trap because focus seems to escape when navigating backward from a tabbable node
            //  with tabindex=0 when this is the case (instead of wrapping to the tabbable node with
            //  the greatest positive tab index like it should)
            if (!state.containerGroups.some(function (g) {
              return g.tabbableNodes.some(function (n) {
                return tabbable.getTabIndex(n) > 0;
              });
            })) {
              // no containers with tabbable nodes with positive tab indexes which means the focus
              //  escaped for some other reason and we should just execute the fallback to the
              //  MRU node or initial focus node, if any
              navAcrossContainers = false;
            }
          }
        } else {
          // no MRU node means we're likely in some initial condition when the trap has just
          //  been activated and initial focus hasn't been given yet, in which case we should
          //  fall through to trying to focus the initial focus node, which is what should
          //  happen below at this point in the logic
          navAcrossContainers = false;
        }
        if (navAcrossContainers) {
          nextNode = findNextNavNode({
            // move FROM the MRU node, not event-related node (which will be the node that is
            //  outside the trap causing the focus escape we're trying to fix)
            target: state.mostRecentlyFocusedNode,
            isBackward: config.isKeyBackward(state.recentNavEvent)
          });
        }
        if (nextNode) {
          _tryFocus(nextNode);
        } else {
          _tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
        }
      }
      state.recentNavEvent = undefined; // clear
    };

    // Hijack key nav events on the first and last focusable nodes of the trap,
    // in order to prevent focus from escaping. If it escapes for even a
    // moment it can end up scrolling the page and causing confusion so we
    // kind of need to capture the action at the keydown phase.
    var checkKeyNav = function checkKeyNav(event) {
      var isBackward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      state.recentNavEvent = event;
      var destinationNode = findNextNavNode({
        event: event,
        isBackward: isBackward
      });
      if (destinationNode) {
        if (isTabEvent(event)) {
          // since tab natively moves focus, we wouldn't have a destination node unless we
          //  were on the edge of a container and had to move to the next/previous edge, in
          //  which case we want to prevent default to keep the browser from moving focus
          //  to where it normally would
          event.preventDefault();
        }
        _tryFocus(destinationNode);
      }
      // else, let the browser take care of [shift+]tab and move the focus
    };
    var checkTabKey = function checkTabKey(event) {
      if (config.isKeyForward(event) || config.isKeyBackward(event)) {
        checkKeyNav(event, config.isKeyBackward(event));
      }
    };

    // we use a different event phase for the Escape key to allow canceling the event and checking for this in escapeDeactivates
    var checkEscapeKey = function checkEscapeKey(event) {
      if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
        event.preventDefault();
        trap.deactivate();
      }
    };
    var checkClick = function checkClick(e) {
      var target = getActualTarget(e);
      if (findContainerIndex(target, e) >= 0) {
        return;
      }
      if (valueOrHandler(config.clickOutsideDeactivates, e)) {
        return;
      }
      if (valueOrHandler(config.allowOutsideClick, e)) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    //
    // EVENT LISTENERS
    //

    var addListeners = function addListeners() {
      if (!state.active) {
        return;
      }

      // There can be only one listening focus trap at a time
      activeFocusTraps.activateTrap(trapStack, trap);

      // Delay ensures that the focused element doesn't capture the event
      // that caused the focus trap activation.
      state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function () {
        _tryFocus(getInitialFocusNode());
      }) : _tryFocus(getInitialFocusNode());
      doc.addEventListener('focusin', checkFocusIn, true);
      doc.addEventListener('mousedown', checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener('touchstart', checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener('click', checkClick, {
        capture: true,
        passive: false
      });
      doc.addEventListener('keydown', checkTabKey, {
        capture: true,
        passive: false
      });
      doc.addEventListener('keydown', checkEscapeKey);
      return trap;
    };
    var removeListeners = function removeListeners() {
      if (!state.active) {
        return;
      }
      doc.removeEventListener('focusin', checkFocusIn, true);
      doc.removeEventListener('mousedown', checkPointerDown, true);
      doc.removeEventListener('touchstart', checkPointerDown, true);
      doc.removeEventListener('click', checkClick, true);
      doc.removeEventListener('keydown', checkTabKey, true);
      doc.removeEventListener('keydown', checkEscapeKey);
      return trap;
    };

    //
    // MUTATION OBSERVER
    //

    var checkDomRemoval = function checkDomRemoval(mutations) {
      var isFocusedNodeRemoved = mutations.some(function (mutation) {
        var removedNodes = Array.from(mutation.removedNodes);
        return removedNodes.some(function (node) {
          return node === state.mostRecentlyFocusedNode;
        });
      });

      // If the currently focused is removed then browsers will move focus to the
      // <body> element. If this happens, try to move focus back into the trap.
      if (isFocusedNodeRemoved) {
        _tryFocus(getInitialFocusNode());
      }
    };

    // Use MutationObserver - if supported - to detect if focused node is removed
    // from the DOM.
    var mutationObserver = typeof window !== 'undefined' && 'MutationObserver' in window ? new MutationObserver(checkDomRemoval) : undefined;
    var updateObservedNodes = function updateObservedNodes() {
      if (!mutationObserver) {
        return;
      }
      mutationObserver.disconnect();
      if (state.active && !state.paused) {
        state.containers.map(function (container) {
          mutationObserver.observe(container, {
            subtree: true,
            childList: true
          });
        });
      }
    };

    //
    // TRAP DEFINITION
    //

    trap = {
      get active() {
        return state.active;
      },
      get paused() {
        return state.paused;
      },
      activate: function activate(activateOptions) {
        if (state.active) {
          return this;
        }
        var onActivate = getOption(activateOptions, 'onActivate');
        var onPostActivate = getOption(activateOptions, 'onPostActivate');
        var checkCanFocusTrap = getOption(activateOptions, 'checkCanFocusTrap');
        if (!checkCanFocusTrap) {
          updateTabbableNodes();
        }
        state.active = true;
        state.paused = false;
        state.nodeFocusedBeforeActivation = doc.activeElement;
        onActivate === null || onActivate === undefined || onActivate();
        var finishActivation = function finishActivation() {
          if (checkCanFocusTrap) {
            updateTabbableNodes();
          }
          addListeners();
          updateObservedNodes();
          onPostActivate === null || onPostActivate === undefined || onPostActivate();
        };
        if (checkCanFocusTrap) {
          checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
          return this;
        }
        finishActivation();
        return this;
      },
      deactivate: function deactivate(deactivateOptions) {
        if (!state.active) {
          return this;
        }
        var options = _objectSpread2({
          onDeactivate: config.onDeactivate,
          onPostDeactivate: config.onPostDeactivate,
          checkCanReturnFocus: config.checkCanReturnFocus
        }, deactivateOptions);
        clearTimeout(state.delayInitialFocusTimer); // noop if undefined
        state.delayInitialFocusTimer = undefined;
        removeListeners();
        state.active = false;
        state.paused = false;
        updateObservedNodes();
        activeFocusTraps.deactivateTrap(trapStack, trap);
        var onDeactivate = getOption(options, 'onDeactivate');
        var onPostDeactivate = getOption(options, 'onPostDeactivate');
        var checkCanReturnFocus = getOption(options, 'checkCanReturnFocus');
        var returnFocus = getOption(options, 'returnFocus', 'returnFocusOnDeactivate');
        onDeactivate === null || onDeactivate === undefined || onDeactivate();
        var finishDeactivation = function finishDeactivation() {
          delay(function () {
            if (returnFocus) {
              _tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
            }
            onPostDeactivate === null || onPostDeactivate === undefined || onPostDeactivate();
          });
        };
        if (returnFocus && checkCanReturnFocus) {
          checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
          return this;
        }
        finishDeactivation();
        return this;
      },
      pause: function pause(pauseOptions) {
        if (!state.active) {
          return this;
        }
        state.manuallyPaused = true;
        return this._setPausedState(true, pauseOptions);
      },
      unpause: function unpause(unpauseOptions) {
        if (!state.active) {
          return this;
        }
        state.manuallyPaused = false;
        if (trapStack[trapStack.length - 1] !== this) {
          return this;
        }
        return this._setPausedState(false, unpauseOptions);
      },
      updateContainerElements: function updateContainerElements(containerElements) {
        var elementsAsArray = [].concat(containerElements).filter(Boolean);
        state.containers = elementsAsArray.map(function (element) {
          return typeof element === 'string' ? doc.querySelector(element) : element;
        });
        if (state.active) {
          updateTabbableNodes();
        }
        updateObservedNodes();
        return this;
      }
    };
    Object.defineProperties(trap, {
      _isManuallyPaused: {
        value: function value() {
          return state.manuallyPaused;
        }
      },
      _setPausedState: {
        value: function value(paused, options) {
          if (state.paused === paused) {
            return this;
          }
          state.paused = paused;
          if (paused) {
            var onPause = getOption(options, 'onPause');
            var onPostPause = getOption(options, 'onPostPause');
            onPause === null || onPause === undefined || onPause();
            removeListeners();
            updateObservedNodes();
            onPostPause === null || onPostPause === undefined || onPostPause();
          } else {
            var onUnpause = getOption(options, 'onUnpause');
            var onPostUnpause = getOption(options, 'onPostUnpause');
            onUnpause === null || onUnpause === undefined || onUnpause();
            updateTabbableNodes();
            addListeners();
            updateObservedNodes();
            onPostUnpause === null || onPostUnpause === undefined || onPostUnpause();
          }
          return this;
        }
      }
    });

    // initialize container elements
    trap.updateContainerElements(elements);
    return trap;
  };
  exports.createFocusTrap = createFocusTrap;
});
},{"tabbable":"../../node_modules/tabbable/dist/index.esm.js"}],"components/component-template.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Component template
 * 
 * Extends HTMLTemplateElement to create a custom element that can be used as a template for other components.
 * 
 * @module component
 * @version 1.0.0
 * @extends HTMLTemplateElement
 */

customElements.component = 'component-template';
if (!customElements.get(customElements.component)) {
  var Component = /*#__PURE__*/function (_HTMLTemplateElement) {
    /**
     * Web component constructor
     * 
     * @constructor
     */
    function Component() {
      _classCallCheck(this, Component);
      return _callSuper(this, Component);
    }

    /**
     * Called when the element is connected to the DOM
     */
    _inherits(Component, _HTMLTemplateElement);
    return _createClass(Component, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        // The template content won't be rendered by default
        // as it inherits this behavior from HTMLTemplateElement
      }

      /**
       * Get the template content
       * 
       * @returns {DocumentFragment} The template content
       */
    }, {
      key: "getContent",
      value: function getContent() {
        return this.content.cloneNode(true);
      }

      /**
       * Get the HTML content of the template
       * 
       * @param {Object} variables The variables to replace in the template
       * @returns {string} The HTML content of the template
       */
    }, {
      key: "getHTML",
      value: function getHTML() {
        var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var content = this.getContent();
        var firstElement = content.firstElementChild;

        // Replace variables in the template
        Object.keys(variables).forEach(function (key) {
          var regex = new RegExp("{{\\s*".concat(key, "\\s*}}"), 'g');
          firstElement.innerHTML = firstElement.innerHTML.replace(regex, variables[key]);
        });
        return firstElement.outerHTML;
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLTemplateElement)); // Note: When extending built-in elements, we need to pass options to define
  customElements.define(customElements.component, Component, {
    extends: 'template'
  });

  // Add a helper function to get a template by type
  window.theme.getTemplate = function (type) {
    return document.querySelector("template[is=\"component-template\"][data-type=\"".concat(type, "\"]"));
  };
}
},{}],"components/variant-selector.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @fileoverview Variant selector web component for e-commerce product variants
 * This component provides a user-friendly interface for selecting product variants
 * with built-in support for:
 * - Loading states
 * - Error handling
 * - Accessibility
 * - Event handling
 * 
 * @example Basic Usage:
 * ```html
 * <variant-selector data-handle="my-product-handle"></variant-selector>
 * ```
 * 
 * @example With Event Handling:
 * ```javascript
 * const selector = document.querySelector('variant-selector');
 * 
 * // Listen for variant changes
 * selector.addEventListener('variant-change', (event) => {
 *     const { variantId, variant, product, handle, reference } = event.detail;
 *     console.log('Selected variant:', variant);
 * });
 * 
 * // Listen for component ready state
 * selector.addEventListener('ready', (event) => {
 *     const { product } = event.detail;
 *     console.log('Component ready with product:', product);
 * });
 * ```
 * 
 * @example Programmatic Control:
 * ```javascript
 * const selector = document.querySelector('variant-selector');
 * 
 * // Update selected variant
 * selector.update('variant-id-123');
 * 
 * // Get current variant
 * const currentVariant = selector.getVariant();
 * 
 * // Disable/Enable selector
 * selector.disable();
 * selector.enable();
 * ```
 * 
 * @typedef {Object} Product
 * @property {string} id - Product ID
 * @property {string} handle - Product handle
 * @property {Array<Variant>} variants - Product variants
 * @property {Array<Option>} options - Product options
 * 
 * @typedef {Object} Variant
 * @property {string} id - Variant ID
 * @property {string} title - Variant title
 * @property {boolean} available - Whether the variant is available
 * @property {Array<string>} options - Variant option values
 * 
 * @typedef {Object} Option
 * @property {string} name - Option name
 * @property {Array<string>} values - Option values
 * 
 * @module variant-selector
 * @version 2.0.0
 */

// Define component name in a more maintainable way
var COMPONENT_NAME = 'variant-selector';
if (!customElements.get(COMPONENT_NAME)) {
  /**
   * VariantSelector class
   * @class
   * @extends HTMLElement
   * 
   * @property {Product|null} product - The loaded product data
   * @property {boolean} isLoading - Loading state flag
   * @property {string} errorMessage - Error message if any
   * 
   * @fires VariantSelector#variant-change
   * @fires VariantSelector#ready
   */
  var VariantSelector = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Constructor
     * Initializes the component
     */
    function VariantSelector() {
      var _this;
      _classCallCheck(this, VariantSelector);
      _this = _callSuper(this, VariantSelector);
      /** @type {Product|null} */
      _defineProperty(_this, "product", void 0);
      if (!_this.dataset.handle) {
        throw new Error('Product handle is required');
      }
      _this.classList.add('hidden');
      _this.classList.add('variant-selector');
      return _this;
    }

    /**
     * Lifecycle callback when component is mounted
     * Initiates product loading
     */
    _inherits(VariantSelector, _HTMLElement);
    return _createClass(VariantSelector, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;
        window.theme.product.loadProduct(this.dataset.handle).then(function (product) {
          _this2.product = product;
          _this2.render();
        });
      }

      /**
       * Initializes component event listeners
       * Sets up variant change handling
       * @private
       */
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this3 = this;
        var select = this.querySelector('select');
        if (select) {
          // Set initial variant
          this.triggerVariantChange(select.value, 'init');

          // Handle select change
          select.addEventListener('change', function (event) {
            _this3.triggerVariantChange(event.target.value, 'input');
          });
        }
      }

      /**
       * Generates component HTML template
       * Handles loading, error, and normal states
       * @private
       * @returns {string} Component HTML
       */
    }, {
      key: "getTemplate",
      value: function getTemplate() {
        var _this$product,
          _this4 = this;
        if (!((_this$product = this.product) !== null && _this$product !== void 0 && (_this$product = _this$product.variants) !== null && _this$product !== void 0 && _this$product.length)) {
          return "<div class=\"error\" role=\"alert\">No variants available</div>";
        }
        var options = this.product.variants.map(function (variant) {
          var isAvailable = variant.available;
          var title = isAvailable ? variant.title : "".concat(variant.title, " - Sold Out");
          var disabled = !isAvailable ? 'disabled' : '';
          var reference = _this4.getVariantOptionReferenceHtml(variant);
          return "<option data-variant-id=\"".concat(variant.id, "\" value=\"").concat(variant.id, "\" ").concat(reference, " ").concat(disabled, ">").concat(title, " - ").concat(variant.id, "</option>");
        }).join('');
        return "<select name=\"id\" aria-label=\"Product variants\">".concat(options, "</select>");
      }

      /**
       * Generates HTML for variant option references
       * 
       * @param {Variant} variant - The variant object
       * @returns {string} HTML for variant option references
       */
    }, {
      key: "getVariantOptionReferenceHtml",
      value: function getVariantOptionReferenceHtml(variant) {
        return this.product.options.map(function (option, index) {
          var optionName = option.name.replace(/ /g, '-');
          var optionValue = variant.options[index].replace(/ /g, '-');
          return "data-option-".concat(optionName, "=\"").concat(optionValue, "\"");
        }).join(' ');
      }

      /**
       * Renders the component in the DOM
       * @private
       */
    }, {
      key: "render",
      value: function render() {
        this.innerHTML = this.getTemplate();
        this.initEvents();
        this.triggerRender();
      }

      /**
       * Triggers the ready event
       * Indicates component has finished initialization
       * @private
       * @fires VariantSelector#ready
       */
    }, {
      key: "triggerRender",
      value: function triggerRender() {
        this.dataset.ready = 'true';
        var event = new CustomEvent('ready', {
          detail: {
            product: this.product
          }
        });
        this.dispatchEvent(event);
      }

      /**
       * Triggers variant change event
       * @param {string} variantId - Selected variant ID
       * @param {string} reference - Reference for the change trigger ('init', 'change', 'update', or 'default')
       * @fires VariantSelector#variant-change
       */
    }, {
      key: "triggerVariantChange",
      value: function triggerVariantChange(variantId) {
        var reference = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        if (!this.product) return;
        var variant = window.theme.product.getVariant(variantId, this.product);
        var event = new CustomEvent('variant-change', {
          detail: {
            variantId: variantId,
            variant: variant,
            product: this.product,
            handle: this.dataset.handle,
            reference: reference
          },
          bubbles: true
        });
        this.dispatchEvent(event);
        window.dispatchEvent(event);
      }

      /**
       * Checks if component is ready
       * @returns {boolean} Ready state
       */
    }, {
      key: "isReady",
      value: function isReady() {
        return this.dataset.ready === 'true';
      }

      /**
       * Updates selected variant
       * @param {string} variantId - Variant ID to select
       * @public
       */
    }, {
      key: "update",
      value: function update(variantId) {
        var select = this.querySelector('select');
        if (select && this.product) {
          select.value = variantId;
          this.triggerVariantChange(variantId, 'update');
        }
      }

      /**
       * Gets current variant
       * @returns {Variant|null} Current variant or null if none selected
       * @public
       */
    }, {
      key: "getVariant",
      value: function getVariant() {
        var select = this.querySelector('select');
        return select && this.product ? window.theme.product.getVariant(select.value, this.product) : null;
      }

      /**
       * Disables the selector
       * @public
       */
    }, {
      key: "disable",
      value: function disable() {
        var select = this.querySelector('select');
        if (select) {
          this.classList.add('disabled');
          select.disabled = true;
        }
      }

      /**
       * Enables the selector
       * @public
       */
    }, {
      key: "enable",
      value: function enable() {
        var select = this.querySelector('select');
        if (select) {
          this.classList.remove('disabled');
          select.disabled = false;
        }
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // Register the custom element
  customElements.define(COMPONENT_NAME, VariantSelector);
}
},{}],"components/addtocart-button.js":[function(require,module,exports) {
var define;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Add to cart button component
 * 
 * @module component-addtocart
 * @version 1.0.0
 * @extends HTMLElement
 */

var COMPONENT_NAME = 'addtocart-button';
var BUTTON_TEXT = 'Add to Cart';
var SOLD_OUT_TEXT = 'Sold Out';
var LOADING_TEXT = 'Adding to cart...';
if (!customElements.get(COMPONENT_NAME)) {
  var AddToCartButton = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Add to cart button web component.
     * @constructor
     */
    function AddToCartButton() {
      var _this;
      _classCallCheck(this, AddToCartButton);
      _this = _callSuper(this, AddToCartButton);
      var productHandle = _this.dataset.handle;
      if (!productHandle) {
        console.warn('AddToCartButton: Missing product handle', _this);
        return _possibleConstructorReturn(_this);
      }
      _this.loadProductData(productHandle);
      return _this;
    }

    /**
     * Load product data from the theme
     * @private
     * @param {string} handle - Product handle
     */
    _inherits(AddToCartButton, _HTMLElement);
    return _createClass(AddToCartButton, [{
      key: "loadProductData",
      value: (function () {
        var _loadProductData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(handle) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return window.theme.product.loadProduct(handle);
              case 3:
                this.product = _context.sent;
                this.ensureSubmitButton();
                this.render();
                _context.next = 11;
                break;
              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.error('AddToCartButton: Failed to load product data', _context.t0);
              case 11:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[0, 8]]);
        }));
        function loadProductData(_x) {
          return _loadProductData.apply(this, arguments);
        }
        return loadProductData;
      }()
      /**
       * Ensure submit button exists, create if not present
       * @private
       */
      )
    }, {
      key: "ensureSubmitButton",
      value: function ensureSubmitButton() {
        if (!this.getSubmitButton()) {
          var button = document.createElement('button');
          button.type = 'submit';
          button.innerHTML = BUTTON_TEXT;
          button.className = 'btn w-full';
          this.appendChild(button);
        }
      }

      /**
       * Get the submit button element
       * @returns {HTMLButtonElement|null}
       */
    }, {
      key: "getSubmitButton",
      value: function getSubmitButton() {
        return this.querySelector('button[type="submit"]');
      }

      /**
       * Render component
       */
    }, {
      key: "render",
      value: function render() {
        this.updateAvailability(this.product.available);
      }

      /**
       * Update component data by variant id
       * @param {number} variantId - Variant id
       */
    }, {
      key: "update",
      value: function update(variantId) {
        var variant = window.theme.product.getVariant(variantId, this.product);
        if (variant) {
          this.updateAvailability(variant.available);
        }
      }

      /**
       * Disable the submit button
       */
    }, {
      key: "disable",
      value: function disable() {
        var button = this.getSubmitButton();
        if (button) {
          var _button$querySelector;
          button.disabled = true;
          button.innerText = SOLD_OUT_TEXT;
          (_button$querySelector = button.querySelector('[data-add-to-cart-icon]')) === null || _button$querySelector === void 0 || (_button$querySelector = _button$querySelector.classList) === null || _button$querySelector === void 0 || _button$querySelector.add('hidden');
        }
      }

      /**
       * Enable the submit button
       */
    }, {
      key: "enable",
      value: function enable() {
        var button = this.getSubmitButton();
        if (button) {
          var _button$querySelector2;
          button.disabled = false;
          button.innerText = BUTTON_TEXT;
          (_button$querySelector2 = button.querySelector('[data-add-to-cart-icon]')) === null || _button$querySelector2 === void 0 || (_button$querySelector2 = _button$querySelector2.classList) === null || _button$querySelector2 === void 0 || _button$querySelector2.remove('hidden');
        }
      }

      /**
       * Set button to loading state
       */
    }, {
      key: "loading",
      value: function loading() {
        var button = this.getSubmitButton();
        if (button) {
          button.disabled = true;
          button.innerText = LOADING_TEXT;
        }
      }

      /**
       * Update component availability status
       * @param {boolean} isAvailable - Product availability status
       */
    }, {
      key: "updateAvailability",
      value: function updateAvailability(isAvailable) {
        isAvailable ? this.enable() : this.disable();
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  customElements.define(COMPONENT_NAME, AddToCartButton);
}
},{}],"components/component-accordion.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Component Accordion
 * 
 * @module component-accordion
 * @version 1.0.1
 * @extends HTMLElement
 */

customElements.component = 'component-accordion';
if (!customElements.get(customElements.component)) {
  var componentAccordion = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Accordion web component.
     * 
     * @constructor
     */
    function componentAccordion() {
      var _this;
      _classCallCheck(this, componentAccordion);
      _this = _callSuper(this, componentAccordion);
      _this.trigger = _this.querySelector('[data-accordion-trigger]');
      _this.container = _this.querySelector('[data-accordion-container]');
      _this.isOpen = false;
      _this.transitionDuration = 300; // ms
      _this.isDisabled = false; // New property to track disabled state

      // Bind methods to preserve context
      _this.handleClick = _this.handleClick.bind(_this);
      _this.handleKeydown = _this.handleKeydown.bind(_this);
      _this.initEvents();
      if (_this.dataset.defaultOpen === 'true') {
        requestAnimationFrame(function () {
          var _this$trigger;
          (_this$trigger = _this.trigger) === null || _this$trigger === void 0 || _this$trigger.click();
        });
      }
      return _this;
    }

    /**
     * Called when the element is connected to the DOM
     */
    _inherits(componentAccordion, _HTMLElement);
    return _createClass(componentAccordion, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        // Add transition styles
        if (this.container) {
          this.container.style.transition = "max-height ".concat(this.transitionDuration, "ms ease-in-out");
        }
      }

      /**
       * Called when the element is disconnected from the DOM
       */
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.cleanup();
      }

      /**
       * Disable accordion functionality
       */
    }, {
      key: "disable",
      value: function disable() {
        if (this.isDisabled) return;
        this.isDisabled = true;
        this.setAttribute('data-disabled', 'true');
        if (this.trigger) {
          this.trigger.style.pointerEvents = 'none';
          this.trigger.setAttribute('tabindex', '-1');
        }
        if (this.container) {
          var _this$trigger2;
          this.container.classList.remove('hidden');
          this.container.classList.add('active');
          this.container.style.maxHeight = 'none';
          (_this$trigger2 = this.trigger) === null || _this$trigger2 === void 0 || _this$trigger2.classList.add('active');
        }
        this.open();
      }

      /**
       * Enable accordion functionality
       */
    }, {
      key: "enable",
      value: function enable() {
        if (!this.isDisabled) return;
        this.isDisabled = false;
        this.removeAttribute('data-disabled');
        if (this.trigger) {
          this.trigger.style.pointerEvents = '';
          this.trigger.setAttribute('tabindex', '0');
        }
        this.close();
      }

      /**
       * Init component events.
       * 
       * @returns {boolean}
       */
    }, {
      key: "initEvents",
      value: function initEvents() {
        if (!this.container || !this.trigger) {
          console.warn('Accordion: Missing required elements');
          return false;
        }
        this.loadAttributes();

        // Add click handler
        this.trigger.addEventListener('click', this.handleClick);

        // Add keyboard handler
        this.trigger.addEventListener('keydown', this.handleKeydown);
        return true;
      }

      /**
       * Handle keyboard events
       * @param {KeyboardEvent} event 
       */
    }, {
      key: "handleKeydown",
      value: function handleKeydown(event) {
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            this.trigger.click();
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.focusNextAccordion();
            break;
          case 'ArrowUp':
            event.preventDefault();
            this.focusPreviousAccordion();
            break;
        }
      }

      /**
       * Handle click events
       * @param {Event} event 
       */
    }, {
      key: "handleClick",
      value: function handleClick(event) {
        var _this2 = this;
        event.preventDefault();
        if (this.isDisabled) return;
        this.toggle().then(function (newContentHeight) {
          _this2.applyMaxHeightOnParent(newContentHeight);
        }).catch(function (error) {
          console.error('Error toggling accordion:', error);
        });
      }

      /**
       * Focus the next accordion trigger in the document
       */
    }, {
      key: "focusNextAccordion",
      value: function focusNextAccordion() {
        var _nextAccordion$queryS;
        var accordions = Array.from(document.querySelectorAll(customElements.component));
        var currentIndex = accordions.indexOf(this);
        var nextAccordion = accordions[currentIndex + 1];
        nextAccordion === null || nextAccordion === void 0 || (_nextAccordion$queryS = nextAccordion.querySelector('[data-accordion-trigger]')) === null || _nextAccordion$queryS === void 0 || _nextAccordion$queryS.focus();
      }

      /**
       * Focus the previous accordion trigger in the document
       */
    }, {
      key: "focusPreviousAccordion",
      value: function focusPreviousAccordion() {
        var _prevAccordion$queryS;
        var accordions = Array.from(document.querySelectorAll(customElements.component));
        var currentIndex = accordions.indexOf(this);
        var prevAccordion = accordions[currentIndex - 1];
        prevAccordion === null || prevAccordion === void 0 || (_prevAccordion$queryS = prevAccordion.querySelector('[data-accordion-trigger]')) === null || _prevAccordion$queryS === void 0 || _prevAccordion$queryS.focus();
      }

      /**
       * Change the parent max-height
       * @param {number} newContentHeight A data-accordion-container height
       */
    }, {
      key: "applyMaxHeightOnParent",
      value: function applyMaxHeightOnParent(newContentHeight) {
        if (!this.container) return;
        if (this.isOpen) {
          this.container.style.maxHeight = "".concat(this.container.scrollHeight + newContentHeight, "px");
        } else {
          this.container.style.maxHeight = "0px";
        }
      }

      /**
       * Load accordion attributes
       */
    }, {
      key: "loadAttributes",
      value: function loadAttributes() {
        this.close();
        var id = "accordion_".concat(Math.random().toString(36).substr(2, 9));
        if (this.trigger) {
          this.trigger.setAttribute('aria-controls', "".concat(id, "_content"));
          this.trigger.setAttribute('aria-expanded', 'false');
          this.trigger.setAttribute('role', 'button');
          this.trigger.setAttribute('tabindex', '0');
          this.trigger.id = "".concat(id, "_trigger");
        }
        if (this.container) {
          this.container.setAttribute('role', 'region');
          this.container.setAttribute('aria-labelledby', "".concat(id, "_trigger"));
          this.container.id = "".concat(id, "_content");
        }
      }

      /**
       * Init Accordion toggle
       * 
       * @returns {Promise<number>} Promise object represents the container height
       */
    }, {
      key: "toggle",
      value: function toggle() {
        var _this3 = this;
        return new Promise(function (resolve, reject) {
          if (!_this3.container) {
            reject(new Error('Container element not found'));
            return;
          }
          try {
            if (_this3.isOpen) {
              _this3.close();
            } else {
              _this3.open();
            }
            resolve(_this3.container.scrollHeight);
          } catch (error) {
            reject(error);
          }
        });
      }

      /**
       * Close accordion
       */
    }, {
      key: "close",
      value: function close() {
        var _this4 = this;
        if (!this.trigger || !this.container) return;
        this.classList.remove('active');
        this.trigger.classList.remove('active');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.container.classList.remove('active');
        this.isOpen = false;
        setTimeout(function () {
          if (_this4.container && !_this4.isDisabled) {
            _this4.container.classList.add('hidden');
          }
        }, this.transitionDuration);
      }

      /**
       * Open accordion
       */
    }, {
      key: "open",
      value: function open() {
        if (!this.trigger || !this.container) return;
        this.classList.add('active');
        this.trigger.classList.add('active');
        this.trigger.setAttribute('aria-expanded', 'true');
        this.container.classList.add('active');
        this.container.classList.remove('hidden');
        this.isOpen = true;
      }

      /**
       * Clean up event listeners
       */
    }, {
      key: "cleanup",
      value: function cleanup() {
        var _this$trigger3, _this$trigger4;
        (_this$trigger3 = this.trigger) === null || _this$trigger3 === void 0 || _this$trigger3.removeEventListener('click', this.handleClick);
        (_this$trigger4 = this.trigger) === null || _this$trigger4 === void 0 || _this$trigger4.removeEventListener('keydown', this.handleKeydown);
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  customElements.define('component-accordion', componentAccordion);
}
},{}],"components/base-component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseComponent = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Base component
 * 
 * Base class for all components that need template functionality
 * 
 * @module base-component
 * @version 1.0.0
 * @extends HTMLElement
 */
var BaseComponent = exports.BaseComponent = /*#__PURE__*/function (_HTMLElement) {
  /**
   * Web component constructor
   * 
   * @constructor
   */
  function BaseComponent() {
    _classCallCheck(this, BaseComponent);
    return _callSuper(this, BaseComponent);
  }

  /**
   * Get template
   * 
   * @param {string} type Template type to get
   * @returns {HTMLTemplateElement} Template element.
   */
  _inherits(BaseComponent, _HTMLElement);
  return _createClass(BaseComponent, [{
    key: "getTemplate",
    value: function getTemplate(type) {
      var template = window.theme.getTemplate(type);
      if (!template) {
        console.error("Template ".concat(type, " not found"));
        return null;
      }
      return template;
    }

    /**
     * Render component in the DOM
     * 
     * @param {object} variables Variables to replace in the template
     * @returns {undefined}
     */
  }, {
    key: "render",
    value: function render() {
      var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var template = this.getTemplate(this.tagName.toLowerCase());
      if (!template) {
        return;
      }
      this.innerHTML = template.getHTML(variables);
      this.dataset.ready = true;
    }

    /**
     * Synchronizes data by updating specific elements in the template marked with data-variable attributes.
     * This method allows for partial updates without re-rendering the entire component.
     * 
     * @param {Object} variables - Key-value pairs where keys match data-variable attributes
     * @returns {void}
     * @example
     * this.syncData({
     *   counter: '42',
     *   status: 'active'
     * });
     */
  }, {
    key: "syncData",
    value: function syncData(variables) {
      var _this = this;
      Object.entries(variables).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        var element = _this.querySelector("[data-variable=\"".concat(key, "\"]"));
        if (element) {
          element.innerHTML = value;
        }
      });
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
},{}],"components/product-card.js":[function(require,module,exports) {
"use strict";

var _baseComponent = require("./base-component.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * Product Card Component
 * 
 * @module product-card
 * @version 1.0.0
 * @extends HTMLElement
 */
customElements.component = 'product-card';
if (!customElements.get(customElements.component)) {
  var ProductCard = /*#__PURE__*/function (_BaseComponent) {
    /**
     * Product card web component
     * 
     * @constructor 
     */
    function ProductCard() {
      var _this;
      _classCallCheck(this, ProductCard);
      _this = _callSuper(this, ProductCard);
      theme.product.loadProduct(_this.dataset.handle).then(function (product) {
        // Get second image if available
        var secondImage = product.images && product.images.length > 1 ? product.images[1] : null;
        _this.render({
          image: product.featured_image,
          secondImage: secondImage,
          title: product.title,
          vendor: product.vendor,
          url: product.url,
          price: window.theme.money.format(product.variants[0].price),
          firstVariantId: product.variants[0].id
        });

        // Add second image if available
        if (secondImage) {
          _this.addSecondImage(secondImage, product.title);
        }
        _this.initEvents();
      });
      return _this;
    }
    _inherits(ProductCard, _BaseComponent);
    return _createClass(ProductCard, [{
      key: "addSecondImage",
      value: function addSecondImage(imageUrl, altText) {
        var imageContainer = this.querySelector('.product-image-container');
        if (imageContainer) {
          var secondImage = document.createElement('img');
          secondImage.src = imageUrl;
          secondImage.alt = altText;
          secondImage.className = 'product-image product-image-secondary';
          imageContainer.appendChild(secondImage);
        }
      }
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;
        var addToCartButton = this.querySelector('[data-add-to-cart]');
        if (addToCartButton) {
          addToCartButton.addEventListener('click', function () {
            var variantId = _this2.querySelector('[name="variant-id"]').value;
            if (variantId) {
              theme.cart.add(variantId, 1).then(function (data) {
                alert('Product added to cart');
              }).catch(function (error) {
                alert('Error adding product to cart');
              });
            }
          });
        }
      }
    }]);
  }(_baseComponent.BaseComponent);
  customElements.define(customElements.component, ProductCard);
}
},{"./base-component.js":"components/base-component.js"}],"components/upsell-product-card.js":[function(require,module,exports) {
"use strict";

var _baseComponent = require("./base-component.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * Product Card Component
 * 
 * @module product-card
 * @version 1.0.0
 * @extends HTMLElement
 */
customElements.component = 'upsell-product-card';
if (!customElements.get(customElements.component)) {
  var UpsellProductCard = /*#__PURE__*/function (_BaseComponent) {
    /**
     * Upsell product card web component
     * 
     * @constructor 
     */
    function UpsellProductCard() {
      var _this;
      _classCallCheck(this, UpsellProductCard);
      _this = _callSuper(this, UpsellProductCard);
      theme.product.getProduct(_this.dataset.handle).then(function (product) {
        _this.render({
          image: product.product.image.src,
          title: product.product.title,
          vendor: product.product.vendor
        });
      });
      return _this;
    }
    _inherits(UpsellProductCard, _BaseComponent);
    return _createClass(UpsellProductCard);
  }(_baseComponent.BaseComponent);
  customElements.define(customElements.component, UpsellProductCard);
}
},{"./base-component.js":"components/base-component.js"}],"components/product-form.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductForm = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * ProductForm Web Component
 * Handles the product form functionality including:
 * - Product data loading
 * - Variant selection
 * - Cart addition
 * - Form validation
 * - Error handling
 *
 * @element product-form
 * @attr {string} data-handle - The product handle to load
 * @fires variant-change - When a variant is changed
 * @fires ready - When the component is ready
 */
var ProductForm = exports.ProductForm = /*#__PURE__*/function (_HTMLElement) {
  /**
   * Initialize the component and set up instance properties
   */
  function ProductForm() {
    var _this;
    _classCallCheck(this, ProductForm);
    _this = _callSuper(this, ProductForm);

    /** @type {HTMLFormElement} Form element reference */
    _this.form = null;

    /** @type {Object} Product data */
    _this.product = null;

    /** @type {HTMLElement} Variant selector component reference */
    _this.variantSelector = null;

    /** @type {boolean} Flag to prevent double submission */
    _this.isSubmitting = false;
    return _this;
  }

  /**
   * Lifecycle callback when element is connected to DOM
   * Initializes form and product data
   */
  _inherits(ProductForm, _HTMLElement);
  return _createClass(ProductForm, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.form = this.querySelector("form");
      if (!this.form) {
        console.warn("No form element found inside product-form component");
        return;
      }
      if (!this.dataset.handle) {
        console.error("Missing product handle", this);
        return;
      }
      this.initializeProduct();
    }

    /**
     * Loads product data from the theme's product API
     * @async
     * @throws {Error} If product loading fails
     */
  }, {
    key: "initializeProduct",
    value: (function () {
      var _initializeProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return window.theme.product.loadProduct(this.dataset.handle);
            case 3:
              this.product = _context.sent;
              this.initEvents();
              _context.next = 11;
              break;
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error("Error loading product:", _context.t0);
              this.displayErrorMessage(null, null, {
                message: "Error loading product. Please try again."
              });
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 7]]);
      }));
      function initializeProduct() {
        return _initializeProduct.apply(this, arguments);
      }
      return initializeProduct;
    }()
    /**
     * Initializes event listeners for form and variant selector
     */
    )
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this2 = this;
      // Form submission handler
      this.form.addEventListener("submit", function (event) {
        return _this2.onFormSubmit(event);
      });

      // Variant selector handling
      var variantSelector = this.getVariantSelector();
      if (variantSelector) {
        this.setupVariantSelectorEvents(variantSelector);
      }
    }

    /**
     * Sets up event listeners for variant selector component
     * @param {HTMLElement} variantSelector - The variant selector component
     */
  }, {
    key: "setupVariantSelectorEvents",
    value: function setupVariantSelectorEvents(variantSelector) {
      var _this3 = this;
      variantSelector.addEventListener("ready", function () {
        _this3.updateFormState();
      });
      if (variantSelector.isReady()) {
        this.updateFormState();
      }
      variantSelector.addEventListener("variant-change", function (event) {
        _this3.updateFormState(event.detail);
      });
    }

    /**
     * Updates form UI based on variant availability
     * @param {Object} variantData - Data about the selected variant
     * @param {boolean} variantData.available - Whether the variant is available
     */
  }, {
    key: "updateFormState",
    value: function updateFormState(variantData) {
      console.log('updateFormState', variantData);

      // Update form state based on variant data
      // This will be called when variants change or when the selector is ready
      if (!variantData) return;

      // TODO: Rewrite this code to handle other elements dynamically
      var price = document.querySelector('[data-price]');
      price.innerHTML = theme.money.format(variantData.variant.price);
      var sku = document.querySelector('[data-sku]');
      sku.innerHTML = 'SKU: ' + variantData.variant.sku;
    }

    /**
     * Gets or creates reference to variant selector component
     * @returns {HTMLElement|null} The variant selector component
     */
  }, {
    key: "getVariantSelector",
    value: function getVariantSelector() {
      if (!this.variantSelector) {
        this.variantSelector = this.querySelector("variant-selector[data-handle=\"".concat(this.dataset.handle, "\"]"));
      }
      return this.variantSelector;
    }

    /**
     * Validates form data before submission
     * @param {FormData} formData - The form data to validate
     * @returns {Object} Validated form data
     * @throws {Error} If validation fails
     */
  }, {
    key: "validateForm",
    value: function validateForm(formData) {
      var id = formData.get("id");
      var qty = formData.get("qty") || "1"; // Default to 1 if quantity not provided

      if (!id) {
        throw new Error("Please select a product variant");
      }
      var quantity = parseInt(qty, 10);
      if (isNaN(quantity) || quantity < 1) {
        throw new Error("Please enter a valid quantity");
      }
      return {
        id: id,
        quantity: quantity
      };
    }

    /**
     * Extracts custom properties from form data
     * @param {FormData} formData - The form data to process
     * @returns {Object} Extracted properties
     */
  }, {
    key: "getFormProperties",
    value: function getFormProperties(formData) {
      var properties = {};
      var _iterator = _createForOfIteratorHelper(formData),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];
          var propertyMatch = key.match(/properties\[([^\]]*)\]/i);
          if (propertyMatch && value !== "") {
            properties[propertyMatch[1]] = value;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return properties;
    }

    /**
     * Handles form submission
     * @async
     * @param {Event} event - The submit event
     */
  }, {
    key: "onFormSubmit",
    value: (function () {
      var _onFormSubmit = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
        var _this4 = this;
        var form, variantId, quantity, customName, properties, addToCartBtn;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              event.preventDefault();
              if (!this.isSubmitting) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return");
            case 3:
              // Get form elements
              form = event.target;
              variantId = form.querySelector('[name="id"]').value;
              quantity = form.querySelector('input[name="quantity"]').value;
              customName = form.querySelector('input[name="properties[Custom Name]"]').value;
              this.isSubmitting = true;
              properties = {};
              if (customName) {
                properties['Custom Name'] = customName;
              }

              // Get add to cart component
              addToCartBtn = this.querySelector('addtocart-button'); // Set loading state
              addToCartBtn.loading();

              // Add to cart
              theme.cart.add(variantId, quantity, properties).then(function (data) {
                // Enable submit button
                addToCartBtn.enable();

                // TODO: Open mini cart

                _this4.isSubmitting = false;
              }).catch(function (error) {
                console.error(error);

                // Enable submit button
                addToCartBtn.enable();
                _this4.isSubmitting = false;
              });
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function onFormSubmit(_x) {
        return _onFormSubmit.apply(this, arguments);
      }
      return onFormSubmit;
    }()
    /**
     * Displays error messages to the user
     * @param {string} id - The variant ID
     * @param {string} qty - The quantity
     * @param {Error} error - The error object
     */
    )
  }, {
    key: "displayErrorMessage",
    value: function displayErrorMessage(id, qty, error) {
      // Create or get error message container
      var errorContainer = this.form.querySelector(".form-error");
      if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.className = "form-error text-red-500 text-sm mt-2";
        this.form.appendChild(errorContainer);
      }
      errorContainer.textContent = error.message;
      errorContainer.style.display = "block";

      // Hide error after 5 seconds
      setTimeout(function () {
        errorContainer.style.display = "none";
      }, 5000);
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("product-form", ProductForm);
},{}],"components/variant-picker.js":[function(require,module,exports) {
"use strict";

var _baseComponent = require("./base-component.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * Product card component
 * 
 * @module variant-picker
 * @version 1.0.0
 * @extends BaseComponent
 */
customElements.component = 'variant-picker';
if (!customElements.get(customElements.component)) {
  var VariantPicker = /*#__PURE__*/function (_BaseComponent) {
    /**
     * Web component constructor
     * 
     * @constructor
     */
    function VariantPicker() {
      var _this;
      _classCallCheck(this, VariantPicker);
      _this = _callSuper(this, VariantPicker);
      if (!_this.dataset.handle) {
        console.error('Product handle is required for variant-picker');
        return _possibleConstructorReturn(_this);
      }
      return _this;
    }

    /**
     * Connected callback
     * 
     * @returns {undefined}
     */
    _inherits(VariantPicker, _BaseComponent);
    return _createClass(VariantPicker, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;
        window.theme.product.loadProduct(this.dataset.handle).then(function (product) {
          _this2.product = product;
          _this2.render();
          _this2.initEvents();
        });
      }

      /**
       * Render the variant picker
       */
    }, {
      key: "render",
      value: function render() {
        var html = '';
        if (this.product.options.length > 1 || this.product.options.length == 1 && this.product.options[0].values.length > 1) {
          this.product.options.forEach(function (option, index) {
            index++;
            html = html + "<div>\n                        <label for=\"".concat(option.name, "\" class=\"normal-case text-base tracking-normal\">").concat(option.name, "</label>\n                        <select id=\"").concat(option.name, "\" name=\"").concat(option.name, "\" data-index=\"").concat(index, "\" aria-label=\"").concat(option.name, "\">\n                            ").concat(option.values.map(function (value) {
              return "<option value=\"".concat(value, "\">").concat(value, "</option>");
            }).join(''), "\n                        </select>\n                    </div>");
          });
          this.innerHTML = html;
        }
      }

      /**
       * Init component events
       * 
       * @returns {undefined}
       */
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this3 = this;
        this.addEventListener('change', function () {
          var variant = _this3.getSelectedVariant();
          if (variant) {
            _this3.updateVariantSelector(variant.id);
          }
        });
      }

      /**
       * Get the selected variant
       * 
       * @returns {Variant} The selected variant
       */
    }, {
      key: "getSelectedVariant",
      value: function getSelectedVariant() {
        // Create object with selected options 
        var selectedOptions = {};

        // Save the selected options in to the object
        this.querySelectorAll('select').forEach(function (select) {
          var optionIndex = select.dataset.index;
          selectedOptions['option' + optionIndex] = select.value;
        });

        // Find a product variant based on the selected options
        var variant = this.product.variants.find(function (item) {
          return item.option1 == selectedOptions.option1 && item.option2 == selectedOptions.option2 && item.option3 == selectedOptions.option3;
        });
        return variant;
      }

      /**
       * Update the variant selector
       * 
       * @param {string} variantId - The variant ID
       */
    }, {
      key: "updateVariantSelector",
      value: function updateVariantSelector(variantId) {
        // TODO: Simulate a variant change event issue because of the document.querySelector
        document.querySelector('variant-selector[data-handle="' + this.dataset.handle + '"]').update(variantId);
      }
    }]);
  }(_baseComponent.BaseComponent);
  customElements.define(customElements.component, VariantPicker);
}
},{"./base-component.js":"components/base-component.js"}],"components/side-drawer.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Side drawer component
 * 
 * @module side-drawer
 * @version 1.0.0
 * @extends HTMLElement
 */

customElements.component = 'side-drawer';
if (!customElements.get(customElements.component)) {
  var SideDrawer = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Web component constructor
     * 
     * @constructor
     */
    function SideDrawer() {
      var _this;
      _classCallCheck(this, SideDrawer);
      _this = _callSuper(this, SideDrawer);
      _this.style.display = 'none';
      _this.classList.add('side-drawer');

      // Default configuration
      _this.config = {
        side: 'left',
        width: '375px',
        animationDuration: 300,
        overlayOpacity: 0.3
      };

      // Callback functions
      _this.afterOpen = null;
      _this.beforeClose = null;

      // Store original scroll position
      _this.scrollPosition = 0;
      _this.render();
      return _this;
    }
    _inherits(SideDrawer, _HTMLElement);
    return _createClass(SideDrawer, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-modal', 'true');
        this.setAttribute('aria-hidden', 'true');
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
          case 'side':
            this.config.side = newValue;
            this.setAttribute('data-side', newValue);
            break;
          case 'width':
            this.config.width = newValue;
            this.querySelector('[data-container]').style.width = newValue;
            break;
          case 'animation-duration':
            this.config.animationDuration = parseInt(newValue);
            break;
        }
      }

      /**
       * Render component in the DOM
       * 
       * @returns {undefined}
       */
    }, {
      key: "render",
      value: function render() {
        // Render template

        var html = this.template();
        html = html.replace(/{{content}}/g, this.innerHTML);
        this.innerHTML = html;

        // After render template

        this.initEvents();
      }

      /**
       * Component template
       * 
       * @returns {undefined}
       */
    }, {
      key: "template",
      value: function template() {
        if (window.templateSideDrawer) {
          return window.templateSideDrawer;
        } else {
          return "\n                    <div data-overlay aria-hidden=\"true\"></div>\n                    <div data-container>\n                        <button data-close aria-label=\"Close drawer\">\n                            <svg\n                            width=\"100%\"\n                            height=\"100%\"\n                            viewBox=\"0 0 24 24\"\n                            fill=\"none\"\n                            xmlns=\"http://www.w3.org/2000/svg\">\n                            <path\n                                fill-rule=\"evenodd\"\n                                clip-rule=\"evenodd\"\n                                d=\"M18.1872 5.81292C18.4801 6.10581 18.4801 6.58068 18.1872 6.87358L13.0607 12.0001L18.1872 17.1266C18.4801 17.4195 18.4801 17.8944 18.1872 18.1873C17.8943 18.4802 17.4194 18.4802 17.1265 18.1873L12 13.0608L6.87348 18.1873C6.58058 18.4802 6.10571 18.4802 5.81282 18.1873C5.51992 17.8944 5.51992 17.4195 5.81282 17.1266L10.9393 12.0001L5.81282 6.87358C5.51992 6.58068 5.51992 6.10581 5.81282 5.81292C6.10571 5.52002 6.58058 5.52002 6.87348 5.81292L12 10.9394L17.1265 5.81292C17.4194 5.52002 17.8943 5.52002 18.1872 5.81292Z\"\n                                fill=\"currentColor\" />\n                            </svg>\n                            Close\n                        </button>\n                        <div data-content>{{content}}</div>\n                    </div>\n                ";
        }
      }

      /**
       * Init component events
       * 
       * @returns {undefined}
       */
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;
        this.initFocusTrap();
        this.initTriggers();

        // Close on press escape
        window.addEventListener('escape', function () {
          _this2.close();
        });
      }

      /**
       * Init triggers
       * 
       * @returns {undefined}
       */
    }, {
      key: "initTriggers",
      value: function initTriggers() {
        var _this3 = this;
        if (this.id) {
          document.querySelectorAll('[data-drawer-target="' + this.id + '"]').forEach(function (element) {
            element.addEventListener('click', _this3.open.bind(_this3));
          });
        }
        this.querySelector('[data-overlay]').addEventListener('click', this.close.bind(this));
        this.querySelector('[data-close]').addEventListener('click', this.close.bind(this));
      }

      /**
       * Check if the drawer is open
       * 
       * @returns {boolean}
       */
    }, {
      key: "isOpen",
      value: function isOpen() {
        return this.classList.contains('active') ? true : false;
      }

      /**
       * Disable scroll on html and body
       * 
       * @returns {undefined}
       */
    }, {
      key: "disableScroll",
      value: function disableScroll() {
        this.scrollPosition = window.pageYOffset;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = "-".concat(this.scrollPosition, "px");
        document.body.style.width = '100%';
      }

      /**
       * Enable scroll on html and body
       * 
       * @returns {undefined}
       */
    }, {
      key: "enableScroll",
      value: function enableScroll() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollPosition);
      }

      /**
       * Open drawer
       * 
       * @returns {undefined}
       */
    }, {
      key: "open",
      value: function open(event) {
        var _this4 = this;
        if (event) event.preventDefault();
        if (!this.isOpen()) {
          this.disableScroll();
          this.style.display = '';
          this.setAttribute('aria-hidden', 'false');
          setTimeout(function () {
            _this4.classList.add('active');
            _this4.classList.add('transition-in');
          }, 100);
          setTimeout(function () {
            _this4.classList.remove('transition-in');
            _this4.activeFocusTrap();
            // Execute afterOpen callback if it exists
            if (typeof _this4.afterOpen === 'function') {
              _this4.afterOpen();
            }
          }, this.config.animationDuration);
        }
      }

      /**
       * Close drawer
       * 
       * @returns {undefined}
       */
    }, {
      key: "close",
      value: function close() {
        var _this5 = this;
        if (this.isOpen()) {
          // Execute beforeClose callback if it exists
          if (typeof this.beforeClose === 'function') {
            this.beforeClose();
          }
          this.classList.add('transition-out');
          this.disableFocusTrap();

          // Remove focus from any element inside the drawer
          if (document.activeElement && this.contains(document.activeElement)) {
            document.activeElement.blur();
          }
          setTimeout(function () {
            _this5.classList.remove('transition-out');
            _this5.classList.remove('active');
            // Set aria-hidden after transition and focus management
            _this5.setAttribute('aria-hidden', 'true');
            _this5.enableScroll();
          }, this.config.animationDuration);
          setTimeout(function () {
            _this5.style.display = 'none';
          }, this.config.animationDuration + 100);
        }
      }

      /**
       * Init focus trap
       * 
       * @returns {undefined}
       */
    }, {
      key: "initFocusTrap",
      value: function initFocusTrap() {
        if (focusTrap) {
          this.focusTrap = focusTrap.createFocusTrap(this, {
            clickOutsideDeactivates: true
          });
        }
      }

      /**
       * Disable focus trap
       * 
       * @returns {undefined}
       */
    }, {
      key: "disableFocusTrap",
      value: function disableFocusTrap() {
        if (this.focusTrap) {
          this.focusTrap.deactivate();
        }
      }

      /**
       * Active focus trap
       * 
       * @returns {undefined}
       */
    }, {
      key: "activeFocusTrap",
      value: function activeFocusTrap() {
        if (this.focusTrap) {
          this.focusTrap.activate();
        }
      }

      /**
       * Disable the side drawer functionality
       * Removes event listeners and prevents opening
       * 
       * @returns {undefined}
       */
    }, {
      key: "disable",
      value: function disable() {
        this.classList.add('disabled');
      }

      /**
       * Enable the side drawer functionality
       * Restores event listeners and allows opening
       * 
       * @returns {undefined}
       */
    }, {
      key: "enable",
      value: function enable() {
        this.classList.remove('disabled');
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['side', 'width', 'animation-duration'];
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  customElements.define(customElements.component, SideDrawer);
}
},{}],"components/mini-cart.js":[function(require,module,exports) {
var define;
"use strict";

var _baseComponent = require("./base-component.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * Mini cart component
 * 
 * A web component that implements a sliding mini cart functionality.
 * It uses the side-drawer component for the sliding panel and displays cart contents.
 * 
 * Features:
 * - Automatic opening when items are added to cart
 * - Real-time updates when cart changes
 * - Displays cart items, subtotal, shipping, tax, and total
 * - Quantity controls for each item
 * - Remove item functionality
 * 
 * Global Access:
 * The component exposes a global 'minicart' object with the following methods:
 * - window.minicart.open() - Opens the mini cart
 * - window.minicart.close() - Closes the mini cart
 * 
 * Events Handled:
 * - 'addtocart': Opens mini cart and updates contents
 * - 'update': Updates cart contents
 * - 'remove': Updates cart contents
 * 
 * @module mini-cart
 * @version 1.0.0
 * @extends BaseComponent
 * 
 * @example
 * // In theme.liquid
 * {% render 'mini-cart-template' %}
 * <mini-cart></mini-cart>
 * 
 * // Opening mini cart from anywhere
 * window.minicart.open();
 */
customElements.component = 'mini-cart';
if (!customElements.get(customElements.component)) {
  var MiniCart = /*#__PURE__*/function (_BaseComponent) {
    /**
     * Creates an instance of MiniCart.
     * Initializes the drawer reference and event listeners.
     * Exposes the global minicart object.
     */
    function MiniCart() {
      var _this;
      _classCallCheck(this, MiniCart);
      _this = _callSuper(this, MiniCart);
      _this.drawer = null;
      return _this;
    }

    /**
     * Lifecycle callback when element is connected to DOM.
     * Initializes the template and cart data.
     */
    _inherits(MiniCart, _BaseComponent);
    return _createClass(MiniCart, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var variables = this.prepareCartData();
        this.render(variables);
        this.drawer = this.querySelector('side-drawer');
        if (!this.drawer) {
          console.error('Mini-cart template must contain a side-drawer element');
          return;
        }
        this.initEvents();
        this.exposeComponent();
        this.init();
      }

      /**
       * Initializes the cart by fetching and rendering current cart data.
       * @async
       */
    }, {
      key: "init",
      value: (function () {
        var _init = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var cartData, variables;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return window.theme.cart.get();
              case 2:
                cartData = _context.sent;
                // Prepare cart data for template rendering
                variables = this.prepareCartData(cartData); // Sync data with new cart data
                this.syncData(variables);
              case 5:
              case "end":
                return _context.stop();
            }
          }, _callee, this);
        }));
        function init() {
          return _init.apply(this, arguments);
        }
        return init;
      }()
      /**
       * Prepares cart data for template rendering.
       * @param {Object} cartData - Cart data from API
       * @returns {Object} Formatted data for template
       */
      )
    }, {
      key: "prepareCartData",
      value: function prepareCartData() {
        var cartData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        // Default empty cart data
        var emptyCart = {
          item_count: 0,
          items: [],
          items_subtotal_price: 0,
          shipping_price: 0,
          tax_price: 0,
          total_price: 0
        };

        // Use empty cart if no data provided
        var cart = cartData || emptyCart;
        var itemCount = cart.item_count || 0;
        var hasItems = itemCount > 0;
        return {
          itemCountText: hasItems ? "".concat(itemCount) : '',
          itemsHtml: this.buildItemsHtml(cart.items),
          subtotal: theme.money.format(cart.items_subtotal_price),
          shipping: theme.money.format(cart.shipping_price || 0),
          tax: theme.money.format(cart.tax_price || 0),
          total: theme.money.format(cart.total_price)
        };
      }

      /**
       * Binds event listeners for cart updates.
       * 
       * @private
       */
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;
        window.addEventListener('addtocart', this.handleAddToCart.bind(this));
        window.addEventListener('update', this.handleCartUpdate.bind(this));
        window.addEventListener('remove', this.handleCartUpdate.bind(this));
        document.querySelectorAll('[data-mini-cart-trigger]').forEach(function (trigger) {
          trigger.addEventListener('click', function (event) {
            event.preventDefault();
            _this2.open();
          });
        });
      }

      /**
       * Exposes the global minicart object.
       * 
       * @private
       */
    }, {
      key: "exposeComponent",
      value: function exposeComponent() {
        // Check if minicart object already exists
        if (window.minicart) {
          return;
        }

        // Expose global minicart object
        window.minicart = {
          open: this.open.bind(this),
          close: this.close.bind(this)
        };
      }

      /**
       * Handles the addtocart event.
       * Updates cart contents and opens the mini cart.
       * @async
       */
    }, {
      key: "handleAddToCart",
      value: (function () {
        var _handleAddToCart = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var cartData;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return window.theme.cart.get();
              case 2:
                cartData = _context2.sent;
                this.syncData(this.prepareCartData(cartData));
                this.open();
              case 5:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this);
        }));
        function handleAddToCart() {
          return _handleAddToCart.apply(this, arguments);
        }
        return handleAddToCart;
      }()
      /**
       * Handles cart update events.
       * Updates the cart contents.
       * @async
       */
      )
    }, {
      key: "handleCartUpdate",
      value: (function () {
        var _handleCartUpdate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var cartData;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return window.theme.cart.get();
              case 2:
                cartData = _context3.sent;
                this.syncData(this.prepareCartData(cartData));
              case 4:
              case "end":
                return _context3.stop();
            }
          }, _callee3, this);
        }));
        function handleCartUpdate() {
          return _handleCartUpdate.apply(this, arguments);
        }
        return handleCartUpdate;
      }()
      /**
       * Builds HTML for cart items.
       * @param {Array} items - Array of cart items
       * @returns {string} HTML string of cart items
       */
      )
    }, {
      key: "buildItemsHtml",
      value: function buildItemsHtml(items) {
        var _this3 = this;
        if (!items || items.length === 0) {
          return '<div class="p-5 text-center text-primary-300">Your bag is empty</div>';
        }
        return items.map(function (item) {
          var itemElement = document.createElement('mini-cart-item');
          itemElement.dataset.variantId = item.variant_id;
          itemElement.dataset.productId = item.product_id;
          itemElement.dataset.key = item.key;
          itemElement.dataset.quantity = item.quantity;
          var options = '';

          // Add SKU into options
          if (item.sku) {
            options += "<li>STYLE# ".concat(item.sku, "</li>");
          }

          // Add cart item options into options
          if (!item.product_has_only_default_variant) {
            item.options_with_values.forEach(function (option) {
              options += "<li>".concat(option.name, ": ").concat(option.value, "</li>");
            });
          }

          // Add properties into options
          Object.entries(item.properties).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];
            options += "<li>".concat(key, ": ").concat(value, "</li>");
          });

          // Pre-render the item with its data
          var template = _this3.getTemplate('mini-cart-item');
          var itemHtml = template.getHTML({
            // image: item.image || window.theme.productImagePlaceholder,
            image: item.featured_image.url || window.theme.productImagePlaceholder,
            title: item.product_title,
            price: theme.money.format(item.price),
            url: item.url,
            quantity: item.quantity,
            options: options
          });
          itemElement.innerHTML = itemHtml;
          return itemElement.outerHTML;
        }).join('');
      }

      /**
       * Opens the mini cart.
       * @public
       */
    }, {
      key: "open",
      value: function open() {
        if (this.drawer) {
          this.drawer.open();
        }
      }

      /**
       * Closes the mini cart.
       * @public
       */
    }, {
      key: "close",
      value: function close() {
        if (this.drawer) {
          this.drawer.close();
        }
      }
    }]);
  }(_baseComponent.BaseComponent);
  customElements.define(customElements.component, MiniCart);
}
},{"./base-component.js":"components/base-component.js"}],"components/mini-cart-item.js":[function(require,module,exports) {
var define;
"use strict";

var _baseComponent = require("./base-component.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * Mini cart item component
 * 
 * @module mini-cart-item
 * @version 1.0.0
 * @extends BaseComponent
 */
customElements.component = 'mini-cart-item';
if (!customElements.get(customElements.component)) {
  var MiniCartItem = /*#__PURE__*/function (_BaseComponent) {
    function MiniCartItem() {
      var _this;
      _classCallCheck(this, MiniCartItem);
      _this = _callSuper(this, MiniCartItem);
      _this.variantId = _this.dataset.variantId;
      _this.quantity = parseInt(_this.dataset.quantity);
      return _this;
    }
    _inherits(MiniCartItem, _BaseComponent);
    return _createClass(MiniCartItem, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var quantitySelector = this.querySelector('quantity-selector');
        if (quantitySelector) {
          this.quantitySelector = quantitySelector;
          quantitySelector.addEventListener('quantity:remove', this.handleRemove.bind(this));
          quantitySelector.addEventListener('quantity:change', this.handleQuantityChange.bind(this));
        } else {
          console.error('Quantity selector not found');
        }
      }

      /**
       * Handle remove event
       * 
       * @param {*} event 
       */
    }, {
      key: "handleRemove",
      value: (function () {
        var _handleRemove = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                event.preventDefault();
                _context.next = 3;
                return window.theme.cart.remove(this.variantId);
              case 3:
              case "end":
                return _context.stop();
            }
          }, _callee, this);
        }));
        function handleRemove(_x) {
          return _handleRemove.apply(this, arguments);
        }
        return handleRemove;
      }()
      /**
       * Handle quantity change event
       * 
       * @param {*} event 
       */
      )
    }, {
      key: "handleQuantityChange",
      value: (function () {
        var _handleQuantityChange = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return window.theme.cart.update(this.variantId, this.quantitySelector.getValue());
              case 2:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this);
        }));
        function handleQuantityChange(_x2) {
          return _handleQuantityChange.apply(this, arguments);
        }
        return handleQuantityChange;
      }())
    }]);
  }(_baseComponent.BaseComponent);
  customElements.define(customElements.component, MiniCartItem);
}
},{"./base-component.js":"components/base-component.js"}],"components/quantity-selector.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Quantity selector component
 * 
 * @module quantity-selector
 * @version 1.1.0
 * @extends HTMLElement
 */

var COMPONENT_NAME = 'quantity-selector';
if (!customElements.get(COMPONENT_NAME)) {
  var QuantitySelector = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Quantity selector web component
     * 
     * @constructor
     */
    function QuantitySelector() {
      var _this;
      _classCallCheck(this, QuantitySelector);
      _this = _callSuper(this, QuantitySelector);

      // Add default values
      _this.minValue = parseInt(_this.getAttribute('min') || 0, 10);
      _this.maxValue = parseInt(_this.getAttribute('max') || Number.MAX_SAFE_INTEGER, 10);
      return _this;
    }

    /**
     * Connected callback lifecycle method
     */
    _inherits(QuantitySelector, _HTMLElement);
    return _createClass(QuantitySelector, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this.render();
        this.initEvents();
        this.updateButtonStates();

        // Initially hide the remove button if value is not 1
        var value = this.getValue();
        var removeBtn = this.getRemoveButton();
        if (value !== 1) {
          removeBtn.style.display = 'none';
        }
      }

      /**
       * Render the component
       */
    }, {
      key: "render",
      value: function render() {
        var id = "quantity-".concat(Math.random().toString(36).substring(2, 9));

        // Create the input element
        var input = document.createElement('input');
        input.type = 'number';
        input.min = this.minValue;
        input.max = this.maxValue;
        input.size = 4;
        input.autocomplete = 'off';
        input.pattern = '[0-9]*';
        input.name = this.getAttribute('name') || '';
        input.id = id;
        this.dataset.id = id;
        input.setAttribute('aria-label', 'Quantity');
        input.setAttribute('inputmode', 'numeric');

        // Set the initial value
        input.value = this.getAttribute('value') ? parseInt(this.getAttribute('value'), 10) : this.minValue;

        // Check if remove button should be rendered
        var shouldShowRemoveButton = this.getAttribute('remove-button') !== 'false';

        // Create the decrease button
        var decreaseBtn = document.createElement('button');
        decreaseBtn.setAttribute('aria-label', 'Decrease quantity');
        decreaseBtn.dataset.action = 'decrease';
        decreaseBtn.type = "button";
        decreaseBtn.innerHTML = '<span class="visually-hidden">Decrease quantity</span>';
        decreaseBtn.setAttribute('aria-controls', input.id);

        // Create the increase button
        var increaseBtn = document.createElement('button');
        increaseBtn.setAttribute('aria-label', 'Increase quantity');
        increaseBtn.dataset.action = 'increase';
        increaseBtn.type = "button";
        increaseBtn.innerHTML = '<span class="visually-hidden">Increase quantity</span>';
        increaseBtn.setAttribute('aria-controls', input.id);

        // Create the remove button if not disabled
        if (shouldShowRemoveButton) {
          var removeBtn = document.createElement('button');
          removeBtn.setAttribute('aria-label', 'Remove');
          removeBtn.dataset.action = 'remove';
          removeBtn.type = "button";
          removeBtn.innerHTML = '<span class="visually-hidden">Remove quantity</span>';
          removeBtn.setAttribute('aria-controls', input.id);

          // Add the remove button to the component
          this.append(removeBtn);
        }

        // Add the elements to the component
        this.append(decreaseBtn);
        this.append(input);
        this.append(increaseBtn);
      }

      /**
       * Initialize event listeners
       */
    }, {
      key: "initEvents",
      value: function initEvents() {
        // Add input change event
        this.getInput().addEventListener('change', this.handleInputChange.bind(this));
        this.getInput().addEventListener('input', this.handleInputChange.bind(this));

        // Add button click events
        var decreaseBtn = this.getDecreaseButton();
        var removeBtn = this.getRemoveButton();
        var increaseBtn = this.getIncreaseButton();
        if (decreaseBtn) {
          decreaseBtn.addEventListener('click', this.decrease.bind(this));
        }
        if (increaseBtn) {
          increaseBtn.addEventListener('click', this.increase.bind(this));
        }
        if (removeBtn) {
          removeBtn.addEventListener('click', this.remove.bind(this));
        }
      }

      /**
       * Get the input element
       * 
       * @returns {HTMLInputElement} The input element
       */
    }, {
      key: "getInput",
      value: function getInput() {
        if (!this.input) {
          this.input = this.querySelector('input');
        }
        return this.input;
      }

      /**
       * Get the decrease button element
       * 
       * @returns {HTMLButtonElement} The decrease button element
       */
    }, {
      key: "getDecreaseButton",
      value: function getDecreaseButton() {
        if (!this.decreaseButton) {
          this.decreaseButton = this.querySelector('[data-action="decrease"]');
        }
        return this.decreaseButton;
      }

      /**
       * Get the increase button element
       * 
       * @returns {HTMLButtonElement} The increase button element
       */
    }, {
      key: "getIncreaseButton",
      value: function getIncreaseButton() {
        if (!this.increaseButton) {
          this.increaseButton = this.querySelector('[data-action="increase"]');
        }
        return this.increaseButton;
      }

      /**
       * Get the remove button element
       * 
       * @returns {HTMLButtonElement|null} The remove button element or null if not present
       */
    }, {
      key: "getRemoveButton",
      value: function getRemoveButton() {
        if (!this.hasAttribute('remove-button') || this.getAttribute('remove-button') !== 'false') {
          if (!this.removeButton) {
            this.removeButton = this.querySelector('[data-action="remove"]');
          }
          return this.removeButton;
        }
        return null;
      }

      /**
       * Get the value of the input element
       * 
       * @returns {number} The value of the input element
       */
    }, {
      key: "getValue",
      value: function getValue() {
        return parseInt(this.getInput().value, 10);
      }

      /**
       * Set quantity value
       * @param {number} value - New quantity value
       */
    }, {
      key: "setValue",
      value: function setValue(value) {
        var newValue = parseInt(value, 10);
        if (!isNaN(newValue)) {
          this.getInput().value = Math.max(this.minValue, Math.min(newValue, this.maxValue));
          this.updateButtonStates();
        }
      }

      /**
       * Dispatch custom event
       * 
       * @param {string} eventName - The name of the event to dispatch
       */
    }, {
      key: "dispatchCustomEvent",
      value: function dispatchCustomEvent(eventName) {
        var event = new CustomEvent(eventName, {
          bubbles: true,
          detail: {
            input: this.getInput(),
            value: this.getValue()
          }
        });
        this.dispatchEvent(event);
      }

      /**
       * Handle input changes
       * @param {Event} event - Input event
       */
    }, {
      key: "handleInputChange",
      value: function handleInputChange(event) {
        var value = this.getValue();

        // Handle invalid input (NaN)
        if (isNaN(value)) {
          this.setValue(this.minValue);
        } else {
          // Check if value is 0, trigger remove event
          if (value === 0) {
            this.updateButtonStates();
            this.dispatchCustomEvent('quantity:remove');
            return;
          }

          // Ensure value is within min/max bounds
          if (value < this.minValue) {
            this.setValue(this.minValue);
          } else if (value > this.maxValue) {
            this.setValue(this.maxValue);
          }
        }
        this.updateButtonStates();
        this.dispatchCustomEvent('quantity:change');
      }

      /**
       * Decrease quantity
       */
    }, {
      key: "decrease",
      value: function decrease() {
        var value = this.getValue();
        if (value > this.minValue) {
          this.setValue(value - 1);
          this.updateButtonStates();
          this.dispatchCustomEvent('quantity:change');
        }
      }

      /**
       * Increase quantity
       */
    }, {
      key: "increase",
      value: function increase() {
        var value = this.getValue();
        if (value < this.maxValue) {
          this.setValue(value + 1);
          this.updateButtonStates();
          this.dispatchCustomEvent('quantity:change');
        }
      }

      /**
       * Update button states based on current value
       */
    }, {
      key: "updateButtonStates",
      value: function updateButtonStates() {
        var value = this.getValue();
        var decreaseBtn = this.getDecreaseButton();
        var increaseBtn = this.getIncreaseButton();
        var removeBtn = this.getRemoveButton();

        // Check if remove button should be shown
        var shouldShowRemoveButton = this.getAttribute('remove-button') !== 'false';

        // Show/hide decrease and remove buttons based on value
        if (value === 1 && shouldShowRemoveButton && removeBtn) {
          // When value is 1, show remove button and hide decrease button
          removeBtn.style.display = 'block';
          decreaseBtn.style.display = 'none';
        } else {
          // Otherwise, hide remove button (if it exists) and show decrease button
          if (removeBtn) {
            removeBtn.style.display = 'none';
          }
          decreaseBtn.style.display = 'block';

          // Disable decrease button if at min value (other than 1)
          decreaseBtn.disabled = value <= this.minValue;
        }

        // Disable increase button if at max value
        increaseBtn.disabled = value >= this.maxValue;
      }

      /**
       * Handle remove button click
       */
    }, {
      key: "remove",
      value: function remove() {
        this.dispatchCustomEvent('quantity:remove');
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['name', 'value', 'min', 'max', 'remove-button'];
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  customElements.define(COMPONENT_NAME, QuantitySelector);
}
},{}],"components/component-menu.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Menu component
 * 
 * @module component-menu
 * @version 1.0.0
 * @extends HTMLElement
 */

customElements.component = 'component-menu';
if (!customElements.get(customElements.component)) {
  var ComponentMenu = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Constructor
     */
    function ComponentMenu() {
      var _this;
      _classCallCheck(this, ComponentMenu);
      _this = _callSuper(this, ComponentMenu);
      _this.initEvents();
      _this.previousActiveElement = null;
      _this.dataset.activeLevel = 1;
      _this.submenuTraps = new Map();
      return _this;
    }
    _inherits(ComponentMenu, _HTMLElement);
    return _createClass(ComponentMenu, [{
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;
        // Open submenu
        this.querySelectorAll('[data-open-submenu]').forEach(function (button) {
          button.addEventListener('click', function () {
            _this2.openSubmenu(button.dataset.openSubmenu);
          });
        });

        // Close submenu
        this.querySelectorAll('[data-close-submenu]').forEach(function (button) {
          button.addEventListener('click', function () {
            _this2.closeSubmenu(button.dataset.closeSubmenu);
          });
        });

        // Toggle submenu (for third level)
        this.querySelectorAll('[data-toggle-submenu]').forEach(function (button) {
          button.addEventListener('click', function () {
            _this2.toggleSubmenu(button.dataset.toggleSubmenu);
          });
        });

        // Handle escape key for submenus
        this.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            var activeSubmenu = _this2.querySelector('.submenu.active');
            if (activeSubmenu) {
              var submenuId = activeSubmenu.dataset.submenu;
              // Only handle escape for level 2 submenus (those with data-open-submenu)
              if (_this2.querySelector("[data-open-submenu=\"".concat(submenuId, "\"]"))) {
                _this2.closeSubmenu(submenuId);
                e.preventDefault();
              }
            }
          }
        });
      }

      /**
       * Get all focusable elements within a container
       * @param {HTMLElement} container - The container to search within
       * @returns {Array} Array of focusable elements
       */
    }, {
      key: "getFocusableElements",
      value: function getFocusableElements() {
        var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
        return Array.from(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(function (el) {
          return !el.hasAttribute('disabled') && el.offsetParent !== null;
        });
      }

      /**
       * Create a focus trap for a submenu
       * @param {HTMLElement} submenu - The submenu element
       * @param {string} submenuId - The submenu ID
       * @returns {Object} The focus trap instance
       */
    }, {
      key: "createSubmenuTrap",
      value: function createSubmenuTrap(submenu, submenuId) {
        var _this3 = this;
        // Create a new focus trap for the submenu
        var submenuTrap = focusTrap.createFocusTrap(submenu, {
          escapeDeactivates: false,
          // We handle escape key ourselves
          allowOutsideClick: true,
          returnFocusOnDeactivate: true,
          fallbackFocus: submenu,
          onDeactivate: function onDeactivate() {
            // Clean up when deactivated
            _this3.submenuTraps.delete(submenuId);
          }
        });
        this.submenuTraps.set(submenuId, submenuTrap);
        return submenuTrap;
      }
    }, {
      key: "enable",
      value: function enable() {
        this.classList.add('active');
      }
    }, {
      key: "disable",
      value: function disable() {
        // Deactivate any active submenu traps
        this.submenuTraps.forEach(function (trap) {
          return trap.deactivate();
        });
        this.submenuTraps.clear();
        this.classList.remove('active');

        // Remove all aria-hidden attributes
        this.querySelectorAll('[aria-hidden]').forEach(function (el) {
          el.removeAttribute('aria-hidden');
        });
      }
    }, {
      key: "openSubmenu",
      value: function openSubmenu(submenuId) {
        var _this4 = this;
        var submenu = this.querySelector("[data-submenu=\"".concat(submenuId, "\"]"));
        if (submenu) {
          this.classList.add('loading');
          setTimeout(function () {
            submenu.classList.add('active');
            _this4.dataset.activeLevel++;
            _this4.classList.remove('loading');

            // Create and activate focus trap for this submenu
            var submenuTrap = _this4.createSubmenuTrap(submenu, submenuId);
            submenuTrap.activate();

            // Focus the first focusable element in submenu
            var firstFocusable = submenu.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
              firstFocusable.focus();
            }
          }, 300);
        }
      }
    }, {
      key: "closeSubmenu",
      value: function closeSubmenu(submenuId) {
        var _this5 = this;
        var submenu = document.querySelector("[data-submenu=\"".concat(submenuId, "\"]"));
        if (submenu) {
          this.classList.add('loading');

          // Deactivate the focus trap for this submenu
          var submenuTrap = this.submenuTraps.get(submenuId);
          if (submenuTrap) {
            submenuTrap.deactivate();
          }
          setTimeout(function () {
            _this5.classList.remove('loading');
            submenu.classList.remove('active');
            _this5.dataset.activeLevel--;

            // Focus back to the parent menu item
            var parentButton = _this5.querySelector("[data-open-submenu=\"".concat(submenuId, "\"]"));
            if (parentButton) {
              parentButton.focus();
            }
          }, 300);
        }
      }
    }, {
      key: "toggleSubmenu",
      value: function toggleSubmenu(submenuId) {
        var submenu = this.querySelector("[data-submenu=\"".concat(submenuId, "\"]"));
        if (submenu) {
          // Simple toggle for third level - no focus trap needed
          submenu.classList.toggle('active');
        }
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  customElements.define(customElements.component, ComponentMenu);
}
},{}],"components/product-slider.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * @class ProductSlideItem
 * @extends HTMLElement
 * @description A custom web component that represents a single item in the product slider.
 * It automatically creates a swiper-slide container and includes a product-card.
 * 
 * @example
 * // Usage in HTML/Liquid
 * <product-slide-item data-handle="product-handle"></product-slide-item>
 */
var ProductSlideItem = /*#__PURE__*/function (_HTMLElement) {
  /**
   * Creates an instance of ProductSlideItem.
   */
  function ProductSlideItem() {
    var _this;
    _classCallCheck(this, ProductSlideItem);
    _this = _callSuper(this, ProductSlideItem);
    _this.initialized = false;
    return _this;
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Creates the product card and necessary structure.
   * @override
   */
  _inherits(ProductSlideItem, _HTMLElement);
  return _createClass(ProductSlideItem, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      if (this.initialized) return;
      this.className = 'swiper-slide';
      this.setupProductCard();
      this.initialized = true;
    }

    /**
     * Sets up the product card inside the slide.
     * @private
     */
  }, {
    key: "setupProductCard",
    value: function setupProductCard() {
      var productHandle = this.dataset.handle;
      if (!productHandle) {
        console.error('Product handle is required for product-slide-item');
        return;
      }

      // Only create product card if it doesn't exist
      if (!this.querySelector('product-card')) {
        var productCard = document.createElement('div');
        productCard.innerHTML = "<product-card data-handle=\"".concat(productHandle, "\"></product-card>");
        this.appendChild(productCard.firstElementChild);
      }
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
/**
 * @class ProductSlide
 * @extends HTMLElement
 * @description A custom web component that creates a responsive product slider using Swiper.js.
 * The slider automatically adapts to different screen sizes, showing 2 products on mobile,
 * 3 on tablet, and 4 on desktop.
 * 
 * @example
 * // Usage in HTML/Liquid
 * <product-slide data-title="Recommended Products" data-link="/collections/all">
 *   <product-slide-item data-handle="product-1"></product-slide-item>
 *   <product-slide-item data-handle="product-2"></product-slide-item>
 * </product-slide>
 */
var ProductSlide = /*#__PURE__*/function (_HTMLElement2) {
  /**
   * Creates an instance of ProductSlide.
   * Initializes the Swiper instance and state tracking variables.
   */
  function ProductSlide() {
    var _this2;
    _classCallCheck(this, ProductSlide);
    _this2 = _callSuper(this, ProductSlide);
    /** @private {Swiper|null} Reference to the Swiper instance */
    _this2.swiper = null;
    /** @private {boolean} Flag to track initialization state */
    _this2.isInitialized = false;
    /** @private {number|null} Reference to the interval check */
    _this2.swiperCheckInterval = null;
    return _this2;
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Ensures Swiper is only initialized after the page and required resources are loaded.
   * @override
   */
  _inherits(ProductSlide, _HTMLElement2);
  return _createClass(ProductSlide, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this3 = this;
      if (this.isInitialized) return;

      // Setup structure only once
      this.setupSliderStructure();

      // Wait for both window load and Swiper to be available
      if (document.readyState === 'complete') {
        this.waitForSwiper();
      } else {
        window.addEventListener('load', function () {
          return _this3.waitForSwiper();
        }, {
          once: true
        });
      }
    }

    /**
     * Lifecycle callback when the element is removed from the DOM.
     * Cleans up Swiper instance.
     * @override
     */
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.destroySwiper();
      if (this.swiperCheckInterval) {
        clearInterval(this.swiperCheckInterval);
        this.swiperCheckInterval = null;
      }
    }

    /**
     * Waits for the Swiper library to be available before initialization.
     * Implements a polling mechanism with a timeout.
     * @private
     */
  }, {
    key: "waitForSwiper",
    value: function waitForSwiper() {
      var _this4 = this;
      if (this.isInitialized) return;

      // Clear any existing interval
      if (this.swiperCheckInterval) {
        clearInterval(this.swiperCheckInterval);
        this.swiperCheckInterval = null;
      }

      // Check if Swiper is available
      if (typeof Swiper !== 'undefined') {
        this.initSwiper();
        this.isInitialized = true;
        return;
      }

      // Poll for Swiper availability
      var attempts = 0;
      var maxAttempts = 50; // 5 seconds with 100ms interval

      this.swiperCheckInterval = setInterval(function () {
        attempts++;
        if (typeof Swiper !== 'undefined') {
          clearInterval(_this4.swiperCheckInterval);
          _this4.swiperCheckInterval = null;
          _this4.initSwiper();
          _this4.isInitialized = true;
        } else if (attempts >= maxAttempts) {
          clearInterval(_this4.swiperCheckInterval);
          _this4.swiperCheckInterval = null;
          console.error('Swiper failed to load within timeout period');
        }
      }, 100);
    }

    /**
     * Sets up the HTML structure required for the Swiper slider.
     * @private
     */
  }, {
    key: "setupSliderStructure",
    value: function setupSliderStructure() {
      // Only setup if not already done
      if (this.querySelector('.swiper')) return;

      // Add overflow-hidden to the parent container
      this.className = 'overflow-hidden block w-full';

      // Add title if provided
      if (this.dataset.title && !this.querySelector('.product-slide__title')) {
        var titleElement = document.createElement('h2');
        titleElement.className = 'product-slide__title text-2xl tablet:text-4xl inline-block';
        titleElement.textContent = this.dataset.title;

        // Create a container for title and link
        var titleContainer = document.createElement('div');
        titleContainer.className = 'flex items-center justify-between px-4 mb-5 mt-5';
        titleContainer.appendChild(titleElement);

        // If data-link is present, add the View All link
        if (this.dataset.link) {
          var viewAllLink = document.createElement('a');
          viewAllLink.href = this.dataset.link;
          viewAllLink.textContent = 'View All';
          viewAllLink.className = 'product-slider-view-all-btn';
          titleContainer.appendChild(viewAllLink);
        }
        this.insertBefore(titleContainer, this.firstChild);
      }

      // Create wrapper and container for Swiper
      var swiperWrapper = document.createElement('div');
      swiperWrapper.className = 'swiper overflow-visible px-4';
      var swiperContainer = document.createElement('div');
      swiperContainer.className = 'swiper-wrapper';

      // Move existing product-slide-items into the swiper container
      var items = Array.from(this.children).filter(function (child) {
        var _child$tagName;
        return ((_child$tagName = child.tagName) === null || _child$tagName === void 0 ? void 0 : _child$tagName.toLowerCase()) === 'product-slide-item';
      });
      items.forEach(function (item) {
        return swiperContainer.appendChild(item);
      });
      swiperWrapper.appendChild(swiperContainer);

      // Add navigation
      var prevButton = document.createElement('div');
      prevButton.className = 'swiper-button-prev hidden -top-[40px] right-[70px] left-auto tablet:flex';
      var nextButton = document.createElement('div');
      nextButton.className = 'swiper-button-next hidden -top-[40px] right-[20px] left-auto tablet:flex';
      swiperWrapper.appendChild(prevButton);
      swiperWrapper.appendChild(nextButton);
      this.appendChild(swiperWrapper);
    }

    /**
     * Getter for Swiper configuration options.
     * @returns {Object} Configuration object for Swiper initialization
     * @private
     */
  }, {
    key: "swiperConfig",
    get: function get() {
      return {
        slidesPerView: 1.6,
        // Mobile default
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          // Tablet
          768: {
            slidesPerView: 3
          },
          // Desktop
          1024: {
            slidesPerView: 4
          }
        }
      };
    }

    /**
     * Initializes the Swiper instance with the configured options.
     * @private
     */
  }, {
    key: "initSwiper",
    value: function initSwiper() {
      if (this.swiper) return;
      var swiperElement = this.querySelector('.swiper');
      if (swiperElement) {
        this.swiper = new Swiper(swiperElement, this.swiperConfig);
      }
    }

    /**
     * Destroys the Swiper instance and cleans up references.
     * @private
     */
  }, {
    key: "destroySwiper",
    value: function destroySwiper() {
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // Register both web components
customElements.define('product-slide-item', ProductSlideItem);
customElements.define('product-slide', ProductSlide);
},{}],"components/filters-form.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * Filters Form
 * 
 * @module filters-form
 * @version 1.0.0
 * @extends HTMLElement
 */

// Constants for DOM selectors and configuration
var SELECTORS = {
  PRODUCT_GRID: '#product_grid',
  FILTER_SUBMIT: '[data-filter-submit]',
  FILTER_COUNT: '[data-filter-count]',
  ACTIVE_FACETS: '[data-active-facets]',
  SORT_BY: '#sort-by',
  FILTER_RESET: '[data-filter-reset]'
};
customElements.component = 'filters-form';
if (!customElements.get(customElements.component)) {
  var FiltersForm = /*#__PURE__*/function (_HTMLElement) {
    /**
     * Collection filters web component.
     * 
     * @constructor
     */
    function FiltersForm() {
      var _this;
      _classCallCheck(this, FiltersForm);
      _this = _callSuper(this, FiltersForm);

      // This variable is used to store data as cache
      _this.filterData = [];
      _this.initEvents();
      return _this;
    }

    /**
     * Init component events.
     * 
     * @returns {undefined}
     */
    _inherits(FiltersForm, _HTMLElement);
    return _createClass(FiltersForm, [{
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;
        try {
          // Bind this to the onActiveFilterClick method
          this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

          // On submit handler
          this.debouncedOnSubmit = window.theme.debounce.apply(function (event) {
            _this2.onSubmitHandler(event);
          }, 500);
          this.filterForm = this.querySelector('form');
          if (this.filterForm) {
            this.filterForm.addEventListener('input', this.debouncedOnSubmit.bind(this));
          }

          // Close drawer when the filter submit button is clicked
          var filterSubmitBtn = this.querySelector(SELECTORS.FILTER_SUBMIT);
          if (filterSubmitBtn) {
            filterSubmitBtn.addEventListener('click', function (event) {
              event.preventDefault();
              _this2.closeDrawer();
            });
          }

          // Handle filter reset
          var filterResetBtn = this.querySelector(SELECTORS.FILTER_RESET);
          if (filterResetBtn) {
            filterResetBtn.addEventListener('click', function (event) {
              event.preventDefault();
              console.log('filter reset');
              _this2.renderPage(new URLSearchParams().toString());
            });
          }

          // Handle history change
          window.addEventListener('popstate', this.onHistoryChange.bind(this));
        } catch (error) {
          console.error('Error initializing events:', error);
        }
      }

      /**
       * On submit handler event.
       * 
       * @param {object} event Event.
       * @returns {undefined}
       */
    }, {
      key: "onSubmitHandler",
      value: function onSubmitHandler(event) {
        event.preventDefault();
        var formData = new FormData(event.target.closest('form'));
        var searchParams = new URLSearchParams(formData).toString();
        this.renderPage(searchParams, event);
      }

      /**
       * On active filter click event.
       * 
       * @param {object} event Click event.
       * @returns {undefined}
       */
    }, {
      key: "onActiveFilterClick",
      value: function onActiveFilterClick(event) {
        event.preventDefault();
        this.renderPage(new URL(event.currentTarget.href).searchParams.toString());
      }

      /**
       * Render page content.
       * 
       * @param {string} searchParams URL params.
       * @param {object} event Click event.
       * @param {boolean} updateURLHash update URL hash.
       * @returns {undefined}
       */
    }, {
      key: "renderPage",
      value: function renderPage(searchParams, event) {
        var updateURLHash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var productGrid = document.querySelector(SELECTORS.PRODUCT_GRID);
        if (productGrid) {
          productGrid.classList.add('loading');
        }
        var url = "".concat(window.location.pathname, "?").concat(searchParams);
        var filterDataUrl = function filterDataUrl(element) {
          return element.url === url;
        };
        this.filterData.some(filterDataUrl) ? this.renderSectionFromCache(filterDataUrl, event) : this.renderSectionFromFetch(url, event);
        if (updateURLHash) this.updateURLHash(searchParams);
      }

      /**
       * Render section from fetch.
       * 
       * @param {string} url String url.
       * @param {object} event Event.
       * @returns {undefined}
       */
    }, {
      key: "renderSectionFromFetch",
      value: function renderSectionFromFetch(url, event) {
        var _this3 = this;
        try {
          fetch(url).then(function (response) {
            if (!response.ok) {
              throw new Error("HTTP error! status: ".concat(response.status));
            }
            return response.text();
          }).then(function (responseText) {
            var html = responseText;
            var html_dom = new DOMParser().parseFromString(html, 'text/html');
            _this3.filterData = [].concat(_toConsumableArray(_this3.filterData), [{
              html: html,
              url: url
            }]);
            _this3.render(html_dom, event);
          }).catch(function (error) {
            console.error('Error fetching filter data:', error);
            // TODO: Optionally show user-friendly error message
          });
        } catch (error) {
          console.error('Error in renderSectionFromFetch:', error);
        }
      }

      /**
       * Render section from catch.
       * 
       * @param {function} filterDataUrl A function.
       * @param {object} event Event.
       * @returns {undefined}
       */
    }, {
      key: "renderSectionFromCache",
      value: function renderSectionFromCache(filterDataUrl, event) {
        var html = this.filterData.find(filterDataUrl).html;
        var html_dom = new DOMParser().parseFromString(html, 'text/html');
        this.render(html_dom, event);
      }

      /**
       * Render results in the page.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
    }, {
      key: "render",
      value: function render(html_dom, event) {
        this.renderProductGrid(html_dom);
        this.renderProductCount(html_dom);
        this.renderActiveFacets(html_dom);
        this.renderFilters(html_dom, event);
        this.renderSortBy(html_dom);
      }

      /**
       * Render product grid.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
    }, {
      key: "renderProductGrid",
      value: function renderProductGrid(html_dom) {
        var productGrid = document.querySelector(SELECTORS.PRODUCT_GRID);
        if (productGrid) {
          var newProductGrid = html_dom.querySelector(SELECTORS.PRODUCT_GRID);
          if (newProductGrid) {
            productGrid.innerHTML = newProductGrid.innerHTML;
            productGrid.classList.remove('loading');
          }
        } else {
          console.error('Product grid not found. Selector: ', SELECTORS.PRODUCT_GRID);
        }
      }

      /**
       * Render product filtercount.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
    }, {
      key: "renderProductCount",
      value: function renderProductCount(html_dom) {
        var productCount = document.querySelector(SELECTORS.FILTER_COUNT);
        if (productCount) {
          productCount.innerHTML = html_dom.querySelector(SELECTORS.FILTER_COUNT).innerHTML;
        } else {
          console.error('Product count not found. Selector: ', SELECTORS.FILTER_COUNT);
        }
      }

      /**
       * Render filters.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
    }, {
      key: "renderFilters",
      value: function renderFilters(html_dom, event) {
        var facetDetailsElementsFromFetch = html_dom.querySelectorAll('[data-facet]');
        var facetDetailsElementsFromDom = document.querySelectorAll('[data-facet]');

        // Remove facets that are no longer returned from the server
        Array.from(facetDetailsElementsFromDom).forEach(function (currentElement) {
          if (!Array.from(facetDetailsElementsFromFetch).some(function (_ref) {
            var id = _ref.id;
            return currentElement.id === id;
          })) {
            currentElement.remove();
          }
        });

        // Find the facet that is currently being clicked
        var matchesId = function matchesId(element) {
          var facet = event ? event.target.closest('[data-facet]') : undefined;
          return facet ? element.id === facet.id : false;
        };

        // Filter out the facet that is not being clicked
        var facetsToRender = Array.from(facetDetailsElementsFromFetch).filter(function (element) {
          return !matchesId(element);
        });
        facetsToRender.forEach(function (elementToRender, index) {
          var currentElement = document.getElementById(elementToRender.id);

          // Element already rendered in the DOM so just update the innerHTML
          if (currentElement) {
            // Update the innerHTML of the accordion container
            currentElement.querySelector('[data-facet-container]').innerHTML = elementToRender.querySelector('[data-facet-container]').innerHTML;
          }
        });
      }

      /**
       * Render active facets.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
    }, {
      key: "renderActiveFacets",
      value: function renderActiveFacets(html_dom) {
        var facetsToRender = html_dom.querySelector(SELECTORS.ACTIVE_FACETS);
        if (facetsToRender) {
          document.querySelectorAll(SELECTORS.ACTIVE_FACETS).forEach(function (element) {
            element.innerHTML = facetsToRender.innerHTML;
          });
        } else {
          console.error('Facets to render not found. Selector: ', SELECTORS.ACTIVE_FACETS);
        }
      }

      /**
       * Render counts.
       * 
       * @returns {undefined}
       */
    }, {
      key: "renderCounts",
      value: function renderCounts() {
        document.querySelectorAll('[data-filter-count-label]').forEach(function (element) {
          element.innerText = "(".concat(count, ")");
        });
      }

      /**
       * Render sort by.
       * 
       * @param {object} html_dom Page html dom.
       * @returns {undefined}
       */
    }, {
      key: "renderSortBy",
      value: function renderSortBy(html_dom) {
        var sortBy = this.querySelector(SELECTORS.SORT_BY);
        if (sortBy) {
          sortBy.innerHTML = html_dom.querySelector(SELECTORS.SORT_BY).innerHTML;
        } else {
          console.error('Sort by not found. Selector: ', SELECTORS.SORT_BY);
        }
      }

      /**
       * On history change.
       * 
       * @param {object} event Event.
       * @returns {undefined}
       */
    }, {
      key: "onHistoryChange",
      value: function onHistoryChange(event) {
        var _event$state;
        var searchParams = ((_event$state = event.state) === null || _event$state === void 0 ? void 0 : _event$state.searchParams) || '';
        this.renderPage(searchParams, null, false);
      }

      /**
       * Update URL hash.
       * 
       * @returns {undefined}
       */
    }, {
      key: "updateURLHash",
      value: function updateURLHash(searchParams) {
        history.pushState({
          searchParams: searchParams
        }, '', "".concat(window.location.pathname).concat(searchParams && '?'.concat(searchParams)));
      }

      /**
       * Close drawer.
       * 
       * @returns {undefined}
       */
    }, {
      key: "closeDrawer",
      value: function closeDrawer() {
        var drawer = this.querySelector('side-drawer');
        if (drawer) {
          drawer.close();
        }
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  customElements.define('filters-form', FiltersForm);
}
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _product = _interopRequireDefault(require("./api/product"));
var _cart = _interopRequireDefault(require("./api/cart"));
var _detectBreakpoint = _interopRequireDefault(require("./utils/detect-breakpoint"));
var _money = _interopRequireDefault(require("./utils/money"));
var _escape = _interopRequireDefault(require("./utils/escape"));
var _debounce = _interopRequireDefault(require("./utils/debounce"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//
//  API
//  _____________________________________________

_product.default.init();
_cart.default.init();

//
//  Utils
//  _____________________________________________

_detectBreakpoint.default.init();
_money.default.init();
_escape.default.init();
_debounce.default.init();

//
//  Libs
//  _____________________________________________

window.focusTrap = require('./libs/focus-trap');

//
//  Web components
//  _____________________________________________

require('./components/component-template');
require('./components/variant-selector');
require('./components/addtocart-button');
require('./components/component-accordion');
require('./components/product-card');
require('./components/upsell-product-card');
require('./components/product-form');
require('./components/variant-picker');
require('./components/side-drawer');
require('./components/mini-cart');
require('./components/mini-cart-item');
require('./components/quantity-selector');
require('./components/component-menu');
require('./components/product-slider');
require('./components/filters-form');
},{"./api/product":"api/product.js","./api/cart":"api/cart.js","./utils/detect-breakpoint":"utils/detect-breakpoint.js","./utils/money":"utils/money.js","./utils/escape":"utils/escape.js","./utils/debounce":"utils/debounce.js","./libs/focus-trap":"libs/focus-trap.js","./components/component-template":"components/component-template.js","./components/variant-selector":"components/variant-selector.js","./components/addtocart-button":"components/addtocart-button.js","./components/component-accordion":"components/component-accordion.js","./components/product-card":"components/product-card.js","./components/upsell-product-card":"components/upsell-product-card.js","./components/product-form":"components/product-form.js","./components/variant-picker":"components/variant-picker.js","./components/side-drawer":"components/side-drawer.js","./components/mini-cart":"components/mini-cart.js","./components/mini-cart-item":"components/mini-cart-item.js","./components/quantity-selector":"components/quantity-selector.js","./components/component-menu":"components/component-menu.js","./components/product-slider":"components/product-slider.js","./components/filters-form":"components/filters-form.js"}]},{},["app.js"], null)
//# sourceMappingURL=/bundle.js.map