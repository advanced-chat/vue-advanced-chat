(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("lamejs"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["lamejs"], factory);
	else if(typeof exports === 'object')
		exports["vue-advanced-chat"] = factory((function webpackLoadOptionalExternalModule() { try { return require("lamejs"); } catch(e) {} }()));
	else
		root["vue-advanced-chat"] = factory(root["lamejs"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE_db18__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02bd":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "06db":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__("23c6");
var test = {};
test[__webpack_require__("2b4c")('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__("2aba")(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),

/***/ "09fa":
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__("4588");
var toLength = __webpack_require__("9def");
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0cd8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $reduce = __webpack_require__("7b23");

$export($export.P + $export.F * !__webpack_require__("2f21")([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "0ed5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomUsersTag_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e8d3");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomUsersTag_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomUsersTag_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "0f88":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var uid = __webpack_require__("ca5a");
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};


/***/ }),

/***/ "10aa":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1448":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__("386b")('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "15ac":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("ec30")('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),

/***/ "1606":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a818");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "1652":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.stateify = exports.TokenState = exports.CharacterState = undefined;

var _class = __webpack_require__("254c");

function createStateClass() {
	return function (tClass) {
		this.j = [];
		this.T = tClass || null;
	};
}

/**
	A simple state machine that can emit token classes

	The `j` property in this class refers to state jumps. It's a
	multidimensional array where for each element:

	* index [0] is a symbol or class of symbols to transition to.
	* index [1] is a State instance which matches

	The type of symbol will depend on the target implementation for this class.
	In Linkify, we have a two-stage scanner. Each stage uses this state machine
	but with a slighly different (polymorphic) implementation.

	The `T` property refers to the token class.

	TODO: Can the `on` and `next` methods be combined?

	@class BaseState
*/
var BaseState = createStateClass();
BaseState.prototype = {
	defaultTransition: false,

	/**
 	@method constructor
 	@param {Class} tClass Pass in the kind of token to emit if there are
 		no jumps after this state and the state is accepting.
 */

	/**
 	On the given symbol(s), this machine should go to the given state
 		@method on
 	@param {Array|Mixed} symbol
 	@param {BaseState} state Note that the type of this state should be the
 		same as the current instance (i.e., don't pass in a different
 		subclass)
 */
	on: function on(symbol, state) {
		if (symbol instanceof Array) {
			for (var i = 0; i < symbol.length; i++) {
				this.j.push([symbol[i], state]);
			}
			return this;
		}
		this.j.push([symbol, state]);
		return this;
	},


	/**
 	Given the next item, returns next state for that item
 	@method next
 	@param {Mixed} item Should be an instance of the symbols handled by
 		this particular machine.
 	@return {State} state Returns false if no jumps are available
 */
	next: function next(item) {
		for (var i = 0; i < this.j.length; i++) {
			var jump = this.j[i];
			var symbol = jump[0]; // Next item to check for
			var state = jump[1]; // State to jump to if items match

			// compare item with symbol
			if (this.test(item, symbol)) {
				return state;
			}
		}

		// Nowhere left to jump!
		return this.defaultTransition;
	},


	/**
 	Does this state accept?
 	`true` only of `this.T` exists
 		@method accepts
 	@return {Boolean}
 */
	accepts: function accepts() {
		return !!this.T;
	},


	/**
 	Determine whether a given item "symbolizes" the symbol, where symbol is
 	a class of items handled by this state machine.
 		This method should be overriden in extended classes.
 		@method test
 	@param {Mixed} item Does this item match the given symbol?
 	@param {Mixed} symbol
 	@return {Boolean}
 */
	test: function test(item, symbol) {
		return item === symbol;
	},


	/**
 	Emit the token for this State (just return it in this case)
 	If this emits a token, this instance is an accepting state
 	@method emit
 	@return {Class} T
 */
	emit: function emit() {
		return this.T;
	}
};

/**
	State machine for string-based input

	@class CharacterState
	@extends BaseState
*/
var CharacterState = (0, _class.inherits)(BaseState, createStateClass(), {
	/**
 	Does the given character match the given character or regular
 	expression?
 		@method test
 	@param {String} char
 	@param {String|RegExp} charOrRegExp
 	@return {Boolean}
 */
	test: function test(character, charOrRegExp) {
		return character === charOrRegExp || charOrRegExp instanceof RegExp && charOrRegExp.test(character);
	}
});

/**
	State machine for input in the form of TextTokens

	@class TokenState
	@extends BaseState
*/
var TokenState = (0, _class.inherits)(BaseState, createStateClass(), {

	/**
  * Similar to `on`, but returns the state the results in the transition from
  * the given item
  * @method jump
  * @param {Mixed} item
  * @param {Token} [token]
  * @return state
  */
	jump: function jump(token) {
		var tClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var state = this.next(new token('')); // dummy temp token
		if (state === this.defaultTransition) {
			// Make a new state!
			state = new this.constructor(tClass);
			this.on(token, state);
		} else if (tClass) {
			state.T = tClass;
		}
		return state;
	},


	/**
 	Is the given token an instance of the given token class?
 		@method test
 	@param {TextToken} token
 	@param {Class} tokenClass
 	@return {Boolean}
 */
	test: function test(token, tokenClass) {
		return token instanceof tokenClass;
	}
});

/**
	Given a non-empty target string, generates states (if required) for each
	consecutive substring of characters in str starting from the beginning of
	the string. The final state will have a special value, as specified in
	options. All other "in between" substrings will have a default end state.

	This turns the state machine into a Trie-like data structure (rather than a
	intelligently-designed DFA).

	Note that I haven't really tried these with any strings other than
	DOMAIN.

	@param {String} str
	@param {CharacterState} start State to jump from the first character
	@param {Class} endToken Token class to emit when the given string has been
		matched and no more jumps exist.
	@param {Class} defaultToken "Filler token", or which token type to emit when
		we don't have a full match
	@return {Array} list of newly-created states
*/
function stateify(str, start, endToken, defaultToken) {
	var i = 0,
	    len = str.length,
	    state = start,
	    newStates = [],
	    nextState = void 0;

	// Find the next state without a jump to the next character
	while (i < len && (nextState = state.next(str[i]))) {
		state = nextState;
		i++;
	}

	if (i >= len) {
		return [];
	} // no new tokens were added

	while (i < len - 1) {
		nextState = new CharacterState(defaultToken);
		newStates.push(nextState);
		state.on(str[i], nextState);
		state = nextState;
		i++;
	}

	nextState = new CharacterState(endToken);
	newStates.push(nextState);
	state.on(str[len - 1], nextState);

	return newStates;
}

exports.CharacterState = CharacterState;
exports.TokenState = TokenState;
exports.stateify = stateify;

/***/ }),

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1a98":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectMobile", function() { return detectMobile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iOSDevice", function() { return iOSDevice; });
/* harmony import */ var core_js_modules_es7_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6762");
/* harmony import */ var core_js_modules_es7_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_string_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2fdb");
/* harmony import */ var core_js_modules_es6_string_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_includes_js__WEBPACK_IMPORTED_MODULE_1__);


function detectMobile() {
  var userAgent = getUserAgent();
  var userAgentPart = userAgent.substr(0, 4);
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(userAgentPart);
}

function getUserAgent() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera || null;
  if (!userAgent) throw new Error('Failed to look for user agent information.');
  return userAgent;
}

function iOSDevice() {
  return ['iPad', 'iPhone', 'iPod'].includes(navigator.platform) || navigator.userAgent.includes('Mac') && 'ontouchend' in document;
}

/***/ }),

/***/ "1c01":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__("9e1e"), 'Object', { defineProperty: __webpack_require__("86cc").f });


/***/ }),

/***/ "1c4c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__("9b43");
var $export = __webpack_require__("5ca1");
var toObject = __webpack_require__("4bf8");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var toLength = __webpack_require__("9def");
var createProperty = __webpack_require__("f1ae");
var getIterFn = __webpack_require__("27ee");

$export($export.S + $export.F * !__webpack_require__("5cc5")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23bf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var html = __webpack_require__("fab2");
var cof = __webpack_require__("2d95");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__("79e5")(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "254c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.inherits = inherits;
function inherits(parent, child) {
	var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var extended = Object.create(parent.prototype);
	for (var p in props) {
		extended[p] = props[p];
	}
	extended.constructor = child;
	child.prototype = extended;
	return child;
}

/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "2a92":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Message_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4ec5");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Message_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Message_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2caf":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__("5ca1");

$export($export.S, 'Array', { isArray: __webpack_require__("1169") });


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d78":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.tokenize = exports.test = exports.scanner = exports.parser = exports.options = exports.inherits = exports.find = undefined;

var _class = __webpack_require__("254c");

var _options = __webpack_require__("316e");

var options = _interopRequireWildcard(_options);

var _scanner = __webpack_require__("b7fe");

var scanner = _interopRequireWildcard(_scanner);

var _parser = __webpack_require__("4128");

var parser = _interopRequireWildcard(_parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/**
	Converts a string into tokens that represent linkable and non-linkable bits
	@method tokenize
	@param {String} str
	@return {Array} tokens
*/
var tokenize = function tokenize(str) {
	return parser.run(scanner.run(str));
};

/**
	Returns a list of linkable items in the given string.
*/
var find = function find(str) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	var tokens = tokenize(str);
	var filtered = [];

	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		if (token.isLink && (!type || token.type === type)) {
			filtered.push(token.toObject());
		}
	}

	return filtered;
};

/**
	Is the given string valid linkable text of some sort
	Note that this does not trim the text for you.

	Optionally pass in a second `type` param, which is the type of link to test
	for.

	For example,

		test(str, 'email');

	Will return `true` if str is a valid email.
*/
var test = function test(str) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	var tokens = tokenize(str);
	return tokens.length === 1 && tokens[0].isLink && (!type || tokens[0].type === type);
};

// Scanner and parser provide states and tokens for the lexicographic stage
// (will be used to add additional link types)
exports.find = find;
exports.inherits = _class.inherits;
exports.options = options;
exports.parser = parser;
exports.scanner = scanner;
exports.test = test;
exports.tokenize = tokenize;

/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2f21":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("79e5");

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("5ca1");
var context = __webpack_require__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "316e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var defaults = {
	defaultProtocol: 'http',
	events: null,
	format: noop,
	formatHref: noop,
	nl2br: false,
	tagName: 'a',
	target: typeToTarget,
	validate: true,
	ignoreTags: [],
	attributes: null,
	className: 'linkified' // Deprecated value - no default class will be provided in the future
};

exports.defaults = defaults;
exports.Options = Options;
exports.contains = contains;


function Options(opts) {
	opts = opts || {};

	this.defaultProtocol = opts.hasOwnProperty('defaultProtocol') ? opts.defaultProtocol : defaults.defaultProtocol;
	this.events = opts.hasOwnProperty('events') ? opts.events : defaults.events;
	this.format = opts.hasOwnProperty('format') ? opts.format : defaults.format;
	this.formatHref = opts.hasOwnProperty('formatHref') ? opts.formatHref : defaults.formatHref;
	this.nl2br = opts.hasOwnProperty('nl2br') ? opts.nl2br : defaults.nl2br;
	this.tagName = opts.hasOwnProperty('tagName') ? opts.tagName : defaults.tagName;
	this.target = opts.hasOwnProperty('target') ? opts.target : defaults.target;
	this.validate = opts.hasOwnProperty('validate') ? opts.validate : defaults.validate;
	this.ignoreTags = [];

	// linkAttributes and linkClass is deprecated
	this.attributes = opts.attributes || opts.linkAttributes || defaults.attributes;
	this.className = opts.hasOwnProperty('className') ? opts.className : opts.linkClass || defaults.className;

	// Make all tags names upper case
	var ignoredTags = opts.hasOwnProperty('ignoreTags') ? opts.ignoreTags : defaults.ignoreTags;
	for (var i = 0; i < ignoredTags.length; i++) {
		this.ignoreTags.push(ignoredTags[i].toUpperCase());
	}
}

Options.prototype = {
	/**
  * Given the token, return all options for how it should be displayed
  */
	resolve: function resolve(token) {
		var href = token.toHref(this.defaultProtocol);
		return {
			formatted: this.get('format', token.toString(), token),
			formattedHref: this.get('formatHref', href, token),
			tagName: this.get('tagName', href, token),
			className: this.get('className', href, token),
			target: this.get('target', href, token),
			events: this.getObject('events', href, token),
			attributes: this.getObject('attributes', href, token)
		};
	},


	/**
  * Returns true or false based on whether a token should be displayed as a
  * link based on the user options. By default,
  */
	check: function check(token) {
		return this.get('validate', token.toString(), token);
	},


	// Private methods

	/**
  * Resolve an option's value based on the value of the option and the given
  * params.
  * @param {String} key Name of option to use
  * @param operator will be passed to the target option if it's method
  * @param {MultiToken} token The token from linkify.tokenize
  */
	get: function get(key, operator, token) {
		var optionValue = void 0,
		    option = this[key];
		if (!option) {
			return option;
		}

		switch (typeof option === 'undefined' ? 'undefined' : _typeof(option)) {
			case 'function':
				return option(operator, token.type);
			case 'object':
				optionValue = option.hasOwnProperty(token.type) ? option[token.type] : defaults[key];
				return typeof optionValue === 'function' ? optionValue(operator, token.type) : optionValue;
		}

		return option;
	},
	getObject: function getObject(key, operator, token) {
		var option = this[key];
		return typeof option === 'function' ? option(operator, token.type) : option;
	}
};

/**
 * Quick indexOf replacement for checking the ignoreTags option
 */
function contains(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === value) {
			return true;
		}
	}
	return false;
}

function noop(val) {
	return val;
}

function typeToTarget(href, type) {
	return type === 'url' ? '_blank' : null;
}

/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "32ff":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "34fe":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "35f2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SvgIcon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("62ed");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SvgIcon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SvgIcon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "3687":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("32ff");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "36bd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__("4bf8");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ "37c8":
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__("2b4c");


/***/ }),

/***/ "386b":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),

/***/ "386d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var sameValue = __webpack_require__("83a1");
var regExpExec = __webpack_require__("5f1b");

// @@search logic
__webpack_require__("214f")('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3a72":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var LIBRARY = __webpack_require__("2d00");
var wksExt = __webpack_require__("37c8");
var defineProperty = __webpack_require__("86cc").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "3b2b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var inheritIfRequired = __webpack_require__("5dbc");
var dP = __webpack_require__("86cc").f;
var gOPN = __webpack_require__("9093").f;
var isRegExp = __webpack_require__("aae3");
var $flags = __webpack_require__("0bfb");
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__("9e1e") && (!CORRECT_NEW || __webpack_require__("79e5")(function () {
  re2[__webpack_require__("2b4c")('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__("2aba")(global, 'RegExp', $RegExp);
}

__webpack_require__("7a56")('RegExp');


/***/ }),

/***/ "3c0d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EmojiPicker_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f7a7");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EmojiPicker_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EmojiPicker_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "3cd7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomMessageReply_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c390");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomMessageReply_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomMessageReply_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "4128":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.start = exports.run = exports.TOKENS = exports.State = undefined;

var _state = __webpack_require__("1652");

var _multi = __webpack_require__("bea1");

var MULTI_TOKENS = _interopRequireWildcard(_multi);

var _text = __webpack_require__("7656");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
	Not exactly parser, more like the second-stage scanner (although we can
	theoretically hotswap the code here with a real parser in the future... but
	for a little URL-finding utility abstract syntax trees may be a little
	overkill).

	URL format: http://en.wikipedia.org/wiki/URI_scheme
	Email format: http://en.wikipedia.org/wiki/Email_address (links to RFC in
	reference)

	@module linkify
	@submodule parser
	@main parser
*/

var makeState = function makeState(tokenClass) {
	return new _state.TokenState(tokenClass);
};

// The universal starting state.
var S_START = makeState();

// Intermediate states for URLs. Note that domains that begin with a protocol
// are treated slighly differently from those that don't.
var S_PROTOCOL = makeState(); // e.g., 'http:'
var S_MAILTO = makeState(); // 'mailto:'
var S_PROTOCOL_SLASH = makeState(); // e.g., '/', 'http:/''
var S_PROTOCOL_SLASH_SLASH = makeState(); // e.g., '//', 'http://'
var S_DOMAIN = makeState(); // parsed string ends with a potential domain name (A)
var S_DOMAIN_DOT = makeState(); // (A) domain followed by DOT
var S_TLD = makeState(_multi.URL); // (A) Simplest possible URL with no query string
var S_TLD_COLON = makeState(); // (A) URL followed by colon (potential port number here)
var S_TLD_PORT = makeState(_multi.URL); // TLD followed by a port number
var S_URL = makeState(_multi.URL); // Long URL with optional port and maybe query string
var S_URL_NON_ACCEPTING = makeState(); // URL followed by some symbols (will not be part of the final URL)
var S_URL_OPENBRACE = makeState(); // URL followed by {
var S_URL_OPENBRACKET = makeState(); // URL followed by [
var S_URL_OPENANGLEBRACKET = makeState(); // URL followed by <
var S_URL_OPENPAREN = makeState(); // URL followed by (
var S_URL_OPENBRACE_Q = makeState(_multi.URL); // URL followed by { and some symbols that the URL can end it
var S_URL_OPENBRACKET_Q = makeState(_multi.URL); // URL followed by [ and some symbols that the URL can end it
var S_URL_OPENANGLEBRACKET_Q = makeState(_multi.URL); // URL followed by < and some symbols that the URL can end it
var S_URL_OPENPAREN_Q = makeState(_multi.URL); // URL followed by ( and some symbols that the URL can end it
var S_URL_OPENBRACE_SYMS = makeState(); // S_URL_OPENBRACE_Q followed by some symbols it cannot end it
var S_URL_OPENBRACKET_SYMS = makeState(); // S_URL_OPENBRACKET_Q followed by some symbols it cannot end it
var S_URL_OPENANGLEBRACKET_SYMS = makeState(); // S_URL_OPENANGLEBRACKET_Q followed by some symbols it cannot end it
var S_URL_OPENPAREN_SYMS = makeState(); // S_URL_OPENPAREN_Q followed by some symbols it cannot end it
var S_EMAIL_DOMAIN = makeState(); // parsed string starts with local email info + @ with a potential domain name (C)
var S_EMAIL_DOMAIN_DOT = makeState(); // (C) domain followed by DOT
var S_EMAIL = makeState(_multi.EMAIL); // (C) Possible email address (could have more tlds)
var S_EMAIL_COLON = makeState(); // (C) URL followed by colon (potential port number here)
var S_EMAIL_PORT = makeState(_multi.EMAIL); // (C) Email address with a port
var S_MAILTO_EMAIL = makeState(_multi.MAILTOEMAIL); // Email that begins with the mailto prefix (D)
var S_MAILTO_EMAIL_NON_ACCEPTING = makeState(); // (D) Followed by some non-query string chars
var S_LOCALPART = makeState(); // Local part of the email address
var S_LOCALPART_AT = makeState(); // Local part of the email address plus @
var S_LOCALPART_DOT = makeState(); // Local part of the email address plus '.' (localpart cannot end in .)
var S_NL = makeState(_multi.NL); // single new line

// Make path from start to protocol (with '//')
S_START.on(_text.NL, S_NL).on(_text.PROTOCOL, S_PROTOCOL).on(_text.MAILTO, S_MAILTO).on(_text.SLASH, S_PROTOCOL_SLASH);

S_PROTOCOL.on(_text.SLASH, S_PROTOCOL_SLASH);
S_PROTOCOL_SLASH.on(_text.SLASH, S_PROTOCOL_SLASH_SLASH);

// The very first potential domain name
S_START.on(_text.TLD, S_DOMAIN).on(_text.DOMAIN, S_DOMAIN).on(_text.LOCALHOST, S_TLD).on(_text.NUM, S_DOMAIN);

// Force URL for protocol followed by anything sane
S_PROTOCOL_SLASH_SLASH.on(_text.TLD, S_URL).on(_text.DOMAIN, S_URL).on(_text.NUM, S_URL).on(_text.LOCALHOST, S_URL);

// Account for dots and hyphens
// hyphens are usually parts of domain names
S_DOMAIN.on(_text.DOT, S_DOMAIN_DOT);
S_EMAIL_DOMAIN.on(_text.DOT, S_EMAIL_DOMAIN_DOT);

// Hyphen can jump back to a domain name

// After the first domain and a dot, we can find either a URL or another domain
S_DOMAIN_DOT.on(_text.TLD, S_TLD).on(_text.DOMAIN, S_DOMAIN).on(_text.NUM, S_DOMAIN).on(_text.LOCALHOST, S_DOMAIN);

S_EMAIL_DOMAIN_DOT.on(_text.TLD, S_EMAIL).on(_text.DOMAIN, S_EMAIL_DOMAIN).on(_text.NUM, S_EMAIL_DOMAIN).on(_text.LOCALHOST, S_EMAIL_DOMAIN);

// S_TLD accepts! But the URL could be longer, try to find a match greedily
// The `run` function should be able to "rollback" to the accepting state
S_TLD.on(_text.DOT, S_DOMAIN_DOT);
S_EMAIL.on(_text.DOT, S_EMAIL_DOMAIN_DOT);

// Become real URLs after `SLASH` or `COLON NUM SLASH`
// Here PSS and non-PSS converge
S_TLD.on(_text.COLON, S_TLD_COLON).on(_text.SLASH, S_URL);
S_TLD_COLON.on(_text.NUM, S_TLD_PORT);
S_TLD_PORT.on(_text.SLASH, S_URL);
S_EMAIL.on(_text.COLON, S_EMAIL_COLON);
S_EMAIL_COLON.on(_text.NUM, S_EMAIL_PORT);

// Types of characters the URL can definitely end in
var qsAccepting = [_text.DOMAIN, _text.AT, _text.LOCALHOST, _text.NUM, _text.PLUS, _text.POUND, _text.PROTOCOL, _text.SLASH, _text.TLD, _text.UNDERSCORE, _text.SYM, _text.AMPERSAND];

// Types of tokens that can follow a URL and be part of the query string
// but cannot be the very last characters
// Characters that cannot appear in the URL at all should be excluded
var qsNonAccepting = [_text.COLON, _text.DOT, _text.QUERY, _text.PUNCTUATION, _text.CLOSEBRACE, _text.CLOSEBRACKET, _text.CLOSEANGLEBRACKET, _text.CLOSEPAREN, _text.OPENBRACE, _text.OPENBRACKET, _text.OPENANGLEBRACKET, _text.OPENPAREN];

// These states are responsible primarily for determining whether or not to
// include the final round bracket.

// URL, followed by an opening bracket
S_URL.on(_text.OPENBRACE, S_URL_OPENBRACE).on(_text.OPENBRACKET, S_URL_OPENBRACKET).on(_text.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(_text.OPENPAREN, S_URL_OPENPAREN);

// URL with extra symbols at the end, followed by an opening bracket
S_URL_NON_ACCEPTING.on(_text.OPENBRACE, S_URL_OPENBRACE).on(_text.OPENBRACKET, S_URL_OPENBRACKET).on(_text.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(_text.OPENPAREN, S_URL_OPENPAREN);

// Closing bracket component. This character WILL be included in the URL
S_URL_OPENBRACE.on(_text.CLOSEBRACE, S_URL);
S_URL_OPENBRACKET.on(_text.CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET.on(_text.CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN.on(_text.CLOSEPAREN, S_URL);
S_URL_OPENBRACE_Q.on(_text.CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_Q.on(_text.CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET_Q.on(_text.CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN_Q.on(_text.CLOSEPAREN, S_URL);
S_URL_OPENBRACE_SYMS.on(_text.CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_SYMS.on(_text.CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET_SYMS.on(_text.CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN_SYMS.on(_text.CLOSEPAREN, S_URL);

// URL that beings with an opening bracket, followed by a symbols.
// Note that the final state can still be `S_URL_OPENBRACE_Q` (if the URL only
// has a single opening bracket for some reason).
S_URL_OPENBRACE.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// URL that begins with an opening bracket, followed by some symbols
S_URL_OPENBRACE_Q.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_Q.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_Q.on(qsNonAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsNonAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_Q.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsNonAccepting, S_URL_OPENPAREN_Q);

S_URL_OPENBRACE_SYMS.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_SYMS.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_SYMS.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_SYMS.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_SYMS.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN_SYMS.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// Account for the query string
S_URL.on(qsAccepting, S_URL);
S_URL_NON_ACCEPTING.on(qsAccepting, S_URL);

S_URL.on(qsNonAccepting, S_URL_NON_ACCEPTING);
S_URL_NON_ACCEPTING.on(qsNonAccepting, S_URL_NON_ACCEPTING);

// Email address-specific state definitions
// Note: We are not allowing '/' in email addresses since this would interfere
// with real URLs

// For addresses with the mailto prefix
// 'mailto:' followed by anything sane is a valid email
S_MAILTO.on(_text.TLD, S_MAILTO_EMAIL).on(_text.DOMAIN, S_MAILTO_EMAIL).on(_text.NUM, S_MAILTO_EMAIL).on(_text.LOCALHOST, S_MAILTO_EMAIL);

// Greedily get more potential valid email values
S_MAILTO_EMAIL.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);
S_MAILTO_EMAIL_NON_ACCEPTING.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);

// For addresses without the mailto prefix
// Tokens allowed in the localpart of the email
var localpartAccepting = [_text.DOMAIN, _text.NUM, _text.PLUS, _text.POUND, _text.QUERY, _text.UNDERSCORE, _text.SYM, _text.AMPERSAND, _text.TLD];

// Some of the tokens in `localpartAccepting` are already accounted for here and
// will not be overwritten (don't worry)
S_DOMAIN.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT);
S_TLD.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT);
S_DOMAIN_DOT.on(localpartAccepting, S_LOCALPART);

// Okay we're on a localpart. Now what?
// TODO: IP addresses and what if the email starts with numbers?
S_LOCALPART.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT) // close to an email address now
.on(_text.DOT, S_LOCALPART_DOT);
S_LOCALPART_DOT.on(localpartAccepting, S_LOCALPART);
S_LOCALPART_AT.on(_text.TLD, S_EMAIL_DOMAIN).on(_text.DOMAIN, S_EMAIL_DOMAIN).on(_text.LOCALHOST, S_EMAIL);
// States following `@` defined above

var run = function run(tokens) {
	var len = tokens.length;
	var cursor = 0;
	var multis = [];
	var textTokens = [];

	while (cursor < len) {
		var state = S_START;
		var secondState = null;
		var nextState = null;
		var multiLength = 0;
		var latestAccepting = null;
		var sinceAccepts = -1;

		while (cursor < len && !(secondState = state.next(tokens[cursor]))) {
			// Starting tokens with nowhere to jump to.
			// Consider these to be just plain text
			textTokens.push(tokens[cursor++]);
		}

		while (cursor < len && (nextState = secondState || state.next(tokens[cursor]))) {

			// Get the next state
			secondState = null;
			state = nextState;

			// Keep track of the latest accepting state
			if (state.accepts()) {
				sinceAccepts = 0;
				latestAccepting = state;
			} else if (sinceAccepts >= 0) {
				sinceAccepts++;
			}

			cursor++;
			multiLength++;
		}

		if (sinceAccepts < 0) {

			// No accepting state was found, part of a regular text token
			// Add all the tokens we looked at to the text tokens array
			for (var i = cursor - multiLength; i < cursor; i++) {
				textTokens.push(tokens[i]);
			}
		} else {

			// Accepting state!

			// First close off the textTokens (if available)
			if (textTokens.length > 0) {
				multis.push(new _multi.TEXT(textTokens));
				textTokens = [];
			}

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			multiLength -= sinceAccepts;

			// Create a new multitoken
			var MULTI = latestAccepting.emit();
			multis.push(new MULTI(tokens.slice(cursor - multiLength, cursor)));
		}
	}

	// Finally close off the textTokens (if available)
	if (textTokens.length > 0) {
		multis.push(new _multi.TEXT(textTokens));
	}

	return multis;
};

exports.State = _state.TokenState;
exports.TOKENS = MULTI_TOKENS;
exports.run = run;
exports.start = S_START;

/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "43f5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "4421":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "46f3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function createTokenClass() {
	return function (value) {
		if (value) {
			this.v = value;
		}
	};
}

exports.createTokenClass = createTokenClass;

/***/ }),

/***/ "48c0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__("386b")('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});


/***/ }),

/***/ "4917":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");

// @@match logic
__webpack_require__("214f")('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "4c1d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "roomsValidation", function() { return /* binding */ roomsValidation; });
__webpack_require__.d(__webpack_exports__, "partcipantsValidation", function() { return /* binding */ partcipantsValidation; });
__webpack_require__.d(__webpack_exports__, "messagesValidation", function() { return /* binding */ messagesValidation; });

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.symbol.js
var es6_symbol = __webpack_require__("8a81");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.iterator.js
var es6_string_iterator = __webpack_require__("5df3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.to-string.js
var es6_object_to_string = __webpack_require__("06db");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js





function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.every.js
var es6_array_every = __webpack_require__("6095");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.is-array.js
var es6_array_is_array = __webpack_require__("2caf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// CONCATENATED MODULE: ./src/utils/data-validation.js




function roomsValidation(obj) {
  var roomsValidate = [{
    key: 'roomId',
    type: ['string', 'number']
  }, {
    key: 'roomName',
    type: ['string']
  }, {
    key: 'users',
    type: ['array']
  }];

  var validate = function validate(obj, props) {
    return props.every(function (prop) {
      var validType = false;

      if (prop.type[0] === 'array' && Array.isArray(obj[prop.key])) {
        validType = true;
      } else if (prop.type.find(function (t) {
        return t === _typeof(obj[prop.key]);
      })) {
        validType = true;
      }

      return validType && checkObjectValid(obj, prop.key);
    });
  };

  if (!validate(obj, roomsValidate)) {
    throw new Error('Rooms object is not valid! Must contain roomId[String, Number], roomName[String] and users[Array]');
  }
}
function partcipantsValidation(obj) {
  var participantsValidate = [{
    key: '_id',
    type: ['string', 'number']
  }, {
    key: 'username',
    type: ['string']
  }];

  var validate = function validate(obj, props) {
    return props.every(function (prop) {
      var validType = prop.type.find(function (t) {
        return t === _typeof(obj[prop.key]);
      });
      return validType && checkObjectValid(obj, prop.key);
    });
  };

  if (!validate(obj, participantsValidate)) {
    throw new Error('Participants object is not valid! Must contain _id[String, Number] and username[String]');
  }
}
function messagesValidation(obj) {
  var messagesValidate = [{
    key: '_id',
    type: ['string', 'number']
  }, {
    key: 'content',
    type: ['string', 'number']
  }, {
    key: 'senderId',
    type: ['string', 'number']
  }];

  var validate = function validate(obj, props) {
    return props.every(function (prop) {
      var validType = prop.type.find(function (t) {
        return t === _typeof(obj[prop.key]);
      });
      return validType && checkObjectValid(obj, prop.key);
    });
  };

  if (!validate(obj, messagesValidate)) {
    throw new Error('Messages object is not valid! Must contain _id[String, Number], content[String, Number] and senderId[String, Number]');
  }
}

function checkObjectValid(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== undefined;
}

/***/ }),

/***/ "4ec5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "4f37":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__("aa77")('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});


/***/ }),

/***/ "504c":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("9e1e");
var getKeys = __webpack_require__("0d58");
var toIObject = __webpack_require__("6821");
var isEnum = __webpack_require__("52a7").f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "55dd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var aFunction = __webpack_require__("d8e8");
var toObject = __webpack_require__("4bf8");
var fails = __webpack_require__("79e5");
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__("2f21")($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),

/***/ "57e7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $indexOf = __webpack_require__("c366")(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__("2f21")($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),

/***/ "589c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioControl_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c8ce");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioControl_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioControl_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "58b2":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__("9e1e"), 'Object', { defineProperties: __webpack_require__("1495") });


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5df3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("02f4")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("01f9")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "6095":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $every = __webpack_require__("0a49")(4);

$export($export.P + $export.F * !__webpack_require__("2f21")([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "62ed":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "63d9":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("ec30")('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),

/***/ "669f":
/***/ (function(module, exports, __webpack_require__) {

!function(e,o){ true?module.exports=o():undefined}(this,function(){return function(e){function o(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,o),n.l=!0,n.exports}var t={};return o.m=e,o.c=t,o.i=function(e){return e},o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:a})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},o.p="/dist-module/",o(o.s=3)}([function(e,o,t){var a=t(4)(t(1),t(5),null,null,null);e.exports=a.exports},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var a=t(2),n=function(e){return e&&e.__esModule?e:{default:e}}(a);o.default={props:{search:{type:String,required:!1,default:""},emojiTable:{type:Object,required:!1,default:function(){return n.default}}},data:function(){return{display:{x:0,y:0,visible:!1}}},computed:{emojis:function(){if(this.search){var e={};for(var o in this.emojiTable){e[o]={};for(var t in this.emojiTable[o])new RegExp(".*"+this.search+".*").test(t)&&(e[o][t]=this.emojiTable[o][t]);0===Object.keys(e[o]).length&&delete e[o]}return e}return this.emojiTable}},methods:{insert:function(e){this.$emit("emoji",e)},toggle:function(e){this.display.visible=!this.display.visible,this.display.x=e.clientX,this.display.y=e.clientY},hide:function(){this.display.visible=!1},escape:function(e){!0===this.display.visible&&27===e.keyCode&&(this.display.visible=!1)}},directives:{"click-outside":{bind:function(e,o,t){if("function"==typeof o.value){var a=o.modifiers.bubble,n=function(t){(a||!e.contains(t.target)&&e!==t.target)&&o.value(t)};e.__vueClickOutside__=n,document.addEventListener("click",n)}},unbind:function(e,o){document.removeEventListener("click",e.__vueClickOutside__),e.__vueClickOutside__=null}}},mounted:function(){document.addEventListener("keyup",this.escape)},destroyed:function(){document.removeEventListener("keyup",this.escape)}}},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.default={"Frequently used":{thumbs_up:"👍","-1":"👎",sob:"😭",confused:"😕",neutral_face:"😐",blush:"😊",heart_eyes:"😍"},People:{smile:"😄",smiley:"😃",grinning:"😀",blush:"😊",wink:"😉",heart_eyes:"😍",kissing_heart:"😘",kissing_closed_eyes:"😚",kissing:"😗",kissing_smiling_eyes:"😙",stuck_out_tongue_winking_eye:"😜",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",flushed:"😳",grin:"😁",pensive:"😔",relieved:"😌",unamused:"😒",disappointed:"😞",persevere:"😣",cry:"😢",joy:"😂",sob:"😭",sleepy:"😪",disappointed_relieved:"😥",cold_sweat:"😰",sweat_smile:"😅",sweat:"😓",weary:"😩",tired_face:"😫",fearful:"😨",scream:"😱",angry:"😠",rage:"😡",triumph:"😤",confounded:"😖",laughing:"😆",yum:"😋",mask:"😷",sunglasses:"😎",sleeping:"😴",dizzy_face:"😵",astonished:"😲",worried:"😟",frowning:"😦",anguished:"😧",imp:"👿",open_mouth:"😮",grimacing:"😬",neutral_face:"😐",confused:"😕",hushed:"😯",smirk:"😏",expressionless:"😑",man_with_gua_pi_mao:"👲",man_with_turban:"👳",cop:"👮",construction_worker:"👷",guardsman:"💂",baby:"👶",boy:"👦",girl:"👧",man:"👨",woman:"👩",older_man:"👴",older_woman:"👵",person_with_blond_hair:"👱",angel:"👼",princess:"👸",smiley_cat:"😺",smile_cat:"😸",heart_eyes_cat:"😻",kissing_cat:"😽",smirk_cat:"😼",scream_cat:"🙀",crying_cat_face:"😿",joy_cat:"😹",pouting_cat:"😾",japanese_ogre:"👹",japanese_goblin:"👺",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",skull:"💀",alien:"👽",hankey:"💩",fire:"🔥",sparkles:"✨",star2:"🌟",dizzy:"💫",boom:"💥",anger:"💢",sweat_drops:"💦",droplet:"💧",zzz:"💤",dash:"💨",ear:"👂",eyes:"👀",nose:"👃",tongue:"👅",lips:"👄",thumbs_up:"👍","-1":"👎",ok_hand:"👌",facepunch:"👊",fist:"✊",wave:"👋",hand:"✋",open_hands:"👐",point_up_2:"👆",point_down:"👇",point_right:"👉",point_left:"👈",raised_hands:"🙌",pray:"🙏",clap:"👏",muscle:"💪",walking:"🚶",runner:"🏃",dancer:"💃",couple:"👫",family:"👪",couplekiss:"💏",couple_with_heart:"💑",dancers:"👯",ok_woman:"🙆",no_good:"🙅",information_desk_person:"💁",raising_hand:"🙋",massage:"💆",haircut:"💇",nail_care:"💅",bride_with_veil:"👰",person_with_pouting_face:"🙎",person_frowning:"🙍",bow:"🙇",tophat:"🎩",crown:"👑",womans_hat:"👒",athletic_shoe:"👟",mans_shoe:"👞",sandal:"👡",high_heel:"👠",boot:"👢",shirt:"👕",necktie:"👔",womans_clothes:"👚",dress:"👗",running_shirt_with_sash:"🎽",jeans:"👖",kimono:"👘",bikini:"👙",briefcase:"💼",handbag:"👜",pouch:"👝",purse:"👛",eyeglasses:"👓",ribbon:"🎀",closed_umbrella:"🌂",lipstick:"💄",yellow_heart:"💛",blue_heart:"💙",purple_heart:"💜",green_heart:"💚",broken_heart:"💔",heartpulse:"💗",heartbeat:"💓",two_hearts:"💕",sparkling_heart:"💖",revolving_hearts:"💞",cupid:"💘",love_letter:"💌",kiss:"💋",ring:"💍",gem:"💎",bust_in_silhouette:"👤",speech_balloon:"💬",footprints:"👣"},Nature:{dog:"🐶",wolf:"🐺",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",frog:"🐸",tiger:"🐯",koala:"🐨",bear:"🐻",pig:"🐷",pig_nose:"🐽",cow:"🐮",boar:"🐗",monkey_face:"🐵",monkey:"🐒",horse:"🐴",sheep:"🐑",elephant:"🐘",panda_face:"🐼",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatched_chick:"🐥",hatching_chick:"🐣",chicken:"🐔",snake:"🐍",turtle:"🐢",bug:"🐛",bee:"🐝",ant:"🐜",beetle:"🐞",snail:"🐌",octopus:"🐙",shell:"🐚",tropical_fish:"🐠",fish:"🐟",dolphin:"🐬",whale:"🐳",racehorse:"🐎",dragon_face:"🐲",blowfish:"🐡",camel:"🐫",poodle:"🐩",feet:"🐾",bouquet:"💐",cherry_blossom:"🌸",tulip:"🌷",four_leaf_clover:"🍀",rose:"🌹",sunflower:"🌻",hibiscus:"🌺",maple_leaf:"🍁",leaves:"🍃",fallen_leaf:"🍂",herb:"🌿",ear_of_rice:"🌾",mushroom:"🍄",cactus:"🌵",palm_tree:"🌴",chestnut:"🌰",seedling:"🌱",blossom:"🌼",new_moon:"🌑",first_quarter_moon:"🌓",moon:"🌔",full_moon:"🌕",first_quarter_moon_with_face:"🌛",crescent_moon:"🌙",earth_asia:"🌏",volcano:"🌋",milky_way:"🌌",stars:"🌠",partly_sunny:"⛅",snowman:"⛄",cyclone:"🌀",foggy:"🌁",rainbow:"🌈",ocean:"🌊"},Objects:{bamboo:"🎍",gift_heart:"💝",dolls:"🎎",school_satchel:"🎒",mortar_board:"🎓",flags:"🎏",fireworks:"🎆",sparkler:"🎇",wind_chime:"🎐",rice_scene:"🎑",jack_o_lantern:"🎃",ghost:"👻",santa:"🎅",christmas_tree:"🎄",gift:"🎁",tanabata_tree:"🎋",tada:"🎉",confetti_ball:"🎊",balloon:"🎈",crossed_flags:"🎌",crystal_ball:"🔮",movie_camera:"🎥",camera:"📷",video_camera:"📹",vhs:"📼",cd:"💿",dvd:"📀",minidisc:"💽",floppy_disk:"💾",computer:"💻",iphone:"📱",telephone_receiver:"📞",pager:"📟",fax:"📠",satellite:"📡",tv:"📺",radio:"📻",loud_sound:"🔊",bell:"🔔",loudspeaker:"📢",mega:"📣",hourglass_flowing_sand:"⏳",hourglass:"⌛",alarm_clock:"⏰",watch:"⌚",unlock:"🔓",lock:"🔒",lock_with_ink_pen:"🔏",closed_lock_with_key:"🔐",key:"🔑",mag_right:"🔎",bulb:"💡",flashlight:"🔦",electric_plug:"🔌",battery:"🔋",mag:"🔍",bath:"🛀",toilet:"🚽",wrench:"🔧",nut_and_bolt:"🔩",hammer:"🔨",door:"🚪",smoking:"🚬",bomb:"💣",gun:"🔫",hocho:"🔪",pill:"💊",syringe:"💉",moneybag:"💰",yen:"💴",dollar:"💵",credit_card:"💳",money_with_wings:"💸",calling:"📲","e-mail":"📧",inbox_tray:"📥",outbox_tray:"📤",envelope_with_arrow:"📩",incoming_envelope:"📨",mailbox:"📫",mailbox_closed:"📪",postbox:"📮",package:"📦",memo:"📝",page_facing_up:"📄",page_with_curl:"📃",bookmark_tabs:"📑",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",scroll:"📜",clipboard:"📋",date:"📅",calendar:"📆",card_index:"📇",file_folder:"📁",open_file_folder:"📂",pushpin:"📌",paperclip:"📎",straight_ruler:"📏",triangular_ruler:"📐",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook:"📓",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",book:"📖",bookmark:"🔖",name_badge:"📛",newspaper:"📰",art:"🎨",clapper:"🎬",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_note:"🎵",notes:"🎶",musical_keyboard:"🎹",violin:"🎻",trumpet:"🎺",saxophone:"🎷",guitar:"🎸",space_invader:"👾",video_game:"🎮",black_joker:"🃏",flower_playing_cards:"🎴",mahjong:"🀄",game_die:"🎲",dart:"🎯",football:"🏈",basketball:"🏀",soccer:"⚽",baseball:"⚾",tennis:"🎾","8ball":"🎱",bowling:"🎳",golf:"⛳",checkered_flag:"🏁",trophy:"🏆",ski:"🎿",snowboarder:"🏂",swimmer:"🏊",surfer:"🏄",fishing_pole_and_fish:"🎣",tea:"🍵",sake:"🍶",beer:"🍺",beers:"🍻",cocktail:"🍸",tropical_drink:"🍹",wine_glass:"🍷",fork_and_knife:"🍴",pizza:"🍕",hamburger:"🍔",fries:"🍟",poultry_leg:"🍗",meat_on_bone:"🍖",spaghetti:"🍝",curry:"🍛",fried_shrimp:"🍤",bento:"🍱",sushi:"🍣",fish_cake:"🍥",rice_ball:"🍙",rice_cracker:"🍘",rice:"🍚",ramen:"🍜",stew:"🍲",oden:"🍢",dango:"🍡",egg:"🍳",bread:"🍞",doughnut:"🍩",custard:"🍮",icecream:"🍦",ice_cream:"🍨",shaved_ice:"🍧",birthday:"🎂",cake:"🍰",cookie:"🍪",chocolate_bar:"🍫",candy:"🍬",lollipop:"🍭",honey_pot:"🍯",apple:"🍎",green_apple:"🍏",tangerine:"🍊",cherries:"🍒",grapes:"🍇",watermelon:"🍉",strawberry:"🍓",peach:"🍑",melon:"🍈",banana:"🍌",pineapple:"🍍",sweet_potato:"🍠",eggplant:"🍆",tomato:"🍅",corn:"🌽"},Places:{house:"🏠",house_with_garden:"🏡",school:"🏫",office:"🏢",post_office:"🏣",hospital:"🏥",bank:"🏦",convenience_store:"🏪",love_hotel:"🏩",hotel:"🏨",wedding:"💒",church:"⛪",department_store:"🏬",city_sunrise:"🌇",city_sunset:"🌆",japanese_castle:"🏯",european_castle:"🏰",tent:"⛺",factory:"🏭",tokyo_tower:"🗼",japan:"🗾",mount_fuji:"🗻",sunrise_over_mountains:"🌄",sunrise:"🌅",night_with_stars:"🌃",statue_of_liberty:"🗽",bridge_at_night:"🌉",carousel_horse:"🎠",ferris_wheel:"🎡",fountain:"⛲",roller_coaster:"🎢",ship:"🚢",boat:"⛵",speedboat:"🚤",rocket:"🚀",seat:"💺",station:"🚉",bullettrain_side:"🚄",bullettrain_front:"🚅",metro:"🚇",railway_car:"🚃",bus:"🚌",blue_car:"🚙",car:"🚗",taxi:"🚕",truck:"🚚",rotating_light:"🚨",police_car:"🚓",fire_engine:"🚒",ambulance:"🚑",bike:"🚲",barber:"💈",busstop:"🚏",ticket:"🎫",traffic_light:"🚥",construction:"🚧",beginner:"🔰",fuelpump:"⛽",izakaya_lantern:"🏮",slot_machine:"🎰",moyai:"🗿",circus_tent:"🎪",performing_arts:"🎭",round_pushpin:"📍",triangular_flag_on_post:"🚩"},Symbols:{keycap_ten:"🔟",1234:"🔢",symbols:"🔣",capital_abcd:"🔠",abcd:"🔡",abc:"🔤",arrow_up_small:"🔼",arrow_down_small:"🔽",rewind:"⏪",fast_forward:"⏩",arrow_double_up:"⏫",arrow_double_down:"⏬",ok:"🆗",new:"🆕",up:"🆙",cool:"🆒",free:"🆓",ng:"🆖",signal_strength:"📶",cinema:"🎦",koko:"🈁",u6307:"🈯",u7a7a:"🈳",u6e80:"🈵",u5408:"🈴",u7981:"🈲",ideograph_advantage:"🉐",u5272:"🈹",u55b6:"🈺",u6709:"🈶",u7121:"🈚",restroom:"🚻",mens:"🚹",womens:"🚺",baby_symbol:"🚼",wc:"🚾",no_smoking:"🚭",u7533:"🈸",accept:"🉑",cl:"🆑",sos:"🆘",id:"🆔",no_entry_sign:"🚫",underage:"🔞",no_entry:"⛔",negative_squared_cross_mark:"❎",white_check_mark:"✅",heart_decoration:"💟",vs:"🆚",vibration_mode:"📳",mobile_phone_off:"📴",ab:"🆎",diamond_shape_with_a_dot_inside:"💠",ophiuchus:"⛎",six_pointed_star:"🔯",atm:"🏧",chart:"💹",heavy_dollar_sign:"💲",currency_exchange:"💱",x:"❌",exclamation:"❗",question:"❓",grey_exclamation:"❕",grey_question:"❔",o:"⭕",top:"🔝",end:"🔚",back:"🔙",on:"🔛",soon:"🔜",arrows_clockwise:"🔃",clock12:"🕛",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",white_flower:"💮",100:"💯",radio_button:"🔘",link:"🔗",curly_loop:"➰",trident:"🔱",small_red_triangle:"🔺",black_square_button:"🔲",white_square_button:"🔳",red_circle:"🔴",large_blue_circle:"🔵",small_red_triangle_down:"🔻",white_large_square:"⬜",black_large_square:"⬛",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_orange_diamond:"🔸",small_blue_diamond:"🔹"}}},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.EmojiPickerPlugin=o.EmojiPicker=void 0;var a=t(0),n=function(e){return e&&e.__esModule?e:{default:e}}(a),i={install:function(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.component("emoji-picker",n.default)}};"undefined"!=typeof window&&(window.EmojiPicker=i),o.EmojiPicker=n.default,o.EmojiPickerPlugin=i,o.default=n.default},function(e,o){e.exports=function(e,o,t,a,n){var i,r=e=e||{},s=typeof e.default;"object"!==s&&"function"!==s||(i=e,r=e.default);var l="function"==typeof r?r.options:r;o&&(l.render=o.render,l.staticRenderFns=o.staticRenderFns),a&&(l._scopeId=a);var _;if(n?(_=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(n)},l._ssrRegister=_):t&&(_=t),_){var c=l.functional,u=c?l.render:l.beforeCreate;c?l.render=function(e,o){return _.call(o),u(e,o)}:l.beforeCreate=u?[].concat(u,_):[_]}return{esModule:i,exports:r,options:l}}},function(e,o){e.exports={render:function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",[e._t("emoji-invoker",null,{events:{click:function(o){return e.toggle(o)}}}),e._v(" "),e.display.visible?t("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:e.hide,expression:"hide"}]},[e._t("emoji-picker",null,{emojis:e.emojis,insert:e.insert,display:e.display})],2):e._e()],2)},staticRenderFns:[]}}])});
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "6762":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("5ca1");
var $includes = __webpack_require__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("9c6c")('includes');


/***/ }),

/***/ "67ab":
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__("ca5a")('meta');
var isObject = __webpack_require__("d3f4");
var has = __webpack_require__("69a8");
var setDesc = __webpack_require__("86cc").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__("79e5")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6d67":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $map = __webpack_require__("0a49")(1);

$export($export.P + $export.F * !__webpack_require__("2f21")([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__("9e1e");
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "74fe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("2d78");


/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "759f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $some = __webpack_require__("0a49")(3);

$export($export.P + $export.F * !__webpack_require__("2f21")([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "7656":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.AMPERSAND = exports.CLOSEPAREN = exports.CLOSEANGLEBRACKET = exports.CLOSEBRACKET = exports.CLOSEBRACE = exports.OPENPAREN = exports.OPENANGLEBRACKET = exports.OPENBRACKET = exports.OPENBRACE = exports.WS = exports.TLD = exports.SYM = exports.UNDERSCORE = exports.SLASH = exports.MAILTO = exports.PROTOCOL = exports.QUERY = exports.POUND = exports.PLUS = exports.NUM = exports.NL = exports.LOCALHOST = exports.PUNCTUATION = exports.DOT = exports.COLON = exports.AT = exports.DOMAIN = exports.Base = undefined;

var _createTokenClass = __webpack_require__("46f3");

var _class = __webpack_require__("254c");

/******************************************************************************
	Text Tokens
	Tokens composed of strings
******************************************************************************/

/**
	Abstract class used for manufacturing text tokens.
	Pass in the value this token represents

	@class TextToken
	@abstract
*/
var TextToken = (0, _createTokenClass.createTokenClass)();
TextToken.prototype = {
	toString: function toString() {
		return this.v + '';
	}
};

function inheritsToken(value) {
	var props = value ? { v: value } : {};
	return (0, _class.inherits)(TextToken, (0, _createTokenClass.createTokenClass)(), props);
}

/**
	A valid domain token
	@class DOMAIN
	@extends TextToken
*/
var DOMAIN = inheritsToken();

/**
	@class AT
	@extends TextToken
*/
var AT = inheritsToken('@');

/**
	Represents a single colon `:` character

	@class COLON
	@extends TextToken
*/
var COLON = inheritsToken(':');

/**
	@class DOT
	@extends TextToken
*/
var DOT = inheritsToken('.');

/**
	A character class that can surround the URL, but which the URL cannot begin
	or end with. Does not include certain English punctuation like parentheses.

	@class PUNCTUATION
	@extends TextToken
*/
var PUNCTUATION = inheritsToken();

/**
	The word localhost (by itself)
	@class LOCALHOST
	@extends TextToken
*/
var LOCALHOST = inheritsToken();

/**
	Newline token
	@class NL
	@extends TextToken
*/
var NL = inheritsToken('\n');

/**
	@class NUM
	@extends TextToken
*/
var NUM = inheritsToken();

/**
	@class PLUS
	@extends TextToken
*/
var PLUS = inheritsToken('+');

/**
	@class POUND
	@extends TextToken
*/
var POUND = inheritsToken('#');

/**
	Represents a web URL protocol. Supported types include

	* `http:`
	* `https:`
	* `ftp:`
	* `ftps:`

	@class PROTOCOL
	@extends TextToken
*/
var PROTOCOL = inheritsToken();

/**
	Represents the start of the email URI protocol

	@class MAILTO
	@extends TextToken
*/
var MAILTO = inheritsToken('mailto:');

/**
	@class QUERY
	@extends TextToken
*/
var QUERY = inheritsToken('?');

/**
	@class SLASH
	@extends TextToken
*/
var SLASH = inheritsToken('/');

/**
	@class UNDERSCORE
	@extends TextToken
*/
var UNDERSCORE = inheritsToken('_');

/**
	One ore more non-whitespace symbol.
	@class SYM
	@extends TextToken
*/
var SYM = inheritsToken();

/**
	@class TLD
	@extends TextToken
*/
var TLD = inheritsToken();

/**
	Represents a string of consecutive whitespace characters

	@class WS
	@extends TextToken
*/
var WS = inheritsToken();

/**
	Opening/closing bracket classes
*/

var OPENBRACE = inheritsToken('{');
var OPENBRACKET = inheritsToken('[');
var OPENANGLEBRACKET = inheritsToken('<');
var OPENPAREN = inheritsToken('(');
var CLOSEBRACE = inheritsToken('}');
var CLOSEBRACKET = inheritsToken(']');
var CLOSEANGLEBRACKET = inheritsToken('>');
var CLOSEPAREN = inheritsToken(')');

var AMPERSAND = inheritsToken('&');

exports.Base = TextToken;
exports.DOMAIN = DOMAIN;
exports.AT = AT;
exports.COLON = COLON;
exports.DOT = DOT;
exports.PUNCTUATION = PUNCTUATION;
exports.LOCALHOST = LOCALHOST;
exports.NL = NL;
exports.NUM = NUM;
exports.PLUS = PLUS;
exports.POUND = POUND;
exports.QUERY = QUERY;
exports.PROTOCOL = PROTOCOL;
exports.MAILTO = MAILTO;
exports.SLASH = SLASH;
exports.UNDERSCORE = UNDERSCORE;
exports.SYM = SYM;
exports.TLD = TLD;
exports.WS = WS;
exports.OPENBRACE = OPENBRACE;
exports.OPENBRACKET = OPENBRACKET;
exports.OPENANGLEBRACKET = OPENANGLEBRACKET;
exports.OPENPAREN = OPENPAREN;
exports.CLOSEBRACE = CLOSEBRACE;
exports.CLOSEBRACKET = CLOSEBRACKET;
exports.CLOSEANGLEBRACKET = CLOSEANGLEBRACKET;
exports.CLOSEPAREN = CLOSEPAREN;
exports.AMPERSAND = AMPERSAND;

/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "78ce":
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__("5ca1");

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),

/***/ "798f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsSearch_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7d8d");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsSearch_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsSearch_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7b23":
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__("d8e8");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var toLength = __webpack_require__("9def");

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};


/***/ }),

/***/ "7bbc":
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__("6821");
var gOPN = __webpack_require__("9093").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "7cec":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageActions_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f6a0");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageActions_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageActions_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "7d66":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsList_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43f5");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsList_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsList_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "7d8d":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "83a1":
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "8a81":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var DESCRIPTORS = __webpack_require__("9e1e");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var META = __webpack_require__("67ab").KEY;
var $fails = __webpack_require__("79e5");
var shared = __webpack_require__("5537");
var setToStringTag = __webpack_require__("7f20");
var uid = __webpack_require__("ca5a");
var wks = __webpack_require__("2b4c");
var wksExt = __webpack_require__("37c8");
var wksDefine = __webpack_require__("3a72");
var enumKeys = __webpack_require__("d4c0");
var isArray = __webpack_require__("1169");
var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var toObject = __webpack_require__("4bf8");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var createDesc = __webpack_require__("4630");
var _create = __webpack_require__("2aeb");
var gOPNExt = __webpack_require__("7bbc");
var $GOPD = __webpack_require__("11e9");
var $GOPS = __webpack_require__("2621");
var $DP = __webpack_require__("86cc");
var $keys = __webpack_require__("0d58");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__("9093").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__("52a7").f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__("2d00")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__("32e9")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "8e6e":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__("5ca1");
var ownKeys = __webpack_require__("990b");
var toIObject = __webpack_require__("6821");
var gOPD = __webpack_require__("11e9");
var createProperty = __webpack_require__("f1ae");

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),

/***/ "8ea5":
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__("5ca1");
var toISOString = __webpack_require__("8ed0");

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});


/***/ }),

/***/ "8ed0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = __webpack_require__("79e5");
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "96cf":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "9865":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var toIObject = __webpack_require__("6821");
var toInteger = __webpack_require__("4588");
var toLength = __webpack_require__("9def");
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__("2f21")($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});


/***/ }),

/***/ "990b":
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__("9093");
var gOPS = __webpack_require__("2621");
var anObject = __webpack_require__("cb7c");
var Reflect = __webpack_require__("7726").Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),

/***/ "996f":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "9986":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__("6821");
var $getOwnPropertyDescriptor = __webpack_require__("11e9").f;

__webpack_require__("5eda")('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a071":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c25f");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var toInteger = __webpack_require__("4588");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "a6d4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Room_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e2d4");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Room_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Room_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "a818":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "a916":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReply_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("34fe");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReply_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReply_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b05c":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("ec30")('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "b7fe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.start = exports.run = exports.TOKENS = exports.State = undefined;

var _state = __webpack_require__("1652");

var _text = __webpack_require__("7656");

var TOKENS = _interopRequireWildcard(_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tlds = 'aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|ac|academy|accenture|accountant|accountants|aco|active|actor|ad|adac|ads|adult|ae|aeg|aero|aetna|af|afamilycompany|afl|africa|ag|agakhan|agency|ai|aig|aigo|airbus|airforce|airtel|akdn|al|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|am|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|ao|aol|apartments|app|apple|aq|aquarelle|ar|arab|aramco|archi|army|arpa|art|arte|as|asda|asia|associates|at|athleta|attorney|au|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aw|aws|ax|axa|az|azure|ba|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bb|bbc|bbt|bbva|bcg|bcn|bd|be|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|blanco|blockbuster|blog|bloomberg|blue|bm|bms|bmw|bn|bnl|bnpparibas|bo|boats|boehringer|bofa|bom|bond|boo|book|booking|boots|bosch|bostik|boston|bot|boutique|box|br|bradesco|bridgestone|broadway|broker|brother|brussels|bs|bt|budapest|bugatti|build|builders|business|buy|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|call|calvinklein|cam|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|cartier|casa|case|caseih|cash|casino|cat|catering|catholic|cba|cbn|cbre|cbs|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|chase|chat|cheap|chintai|chloe|christmas|chrome|chrysler|church|ci|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|ck|cl|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|cr|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|data|date|dating|datsun|day|dclk|dds|de|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dj|dk|dm|dnp|do|docs|doctor|dodge|dog|doha|domains|dot|download|drive|dtv|dubai|duck|dunlop|duns|dupont|durban|dvag|dvr|dz|earth|eat|ec|eco|edeka|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epost|epson|equipment|er|ericsson|erni|es|esq|estate|esurance|et|etisalat|eu|eurovision|eus|events|everbank|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fi|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|fj|fk|flickr|flights|flir|florist|flowers|fly|fm|fo|foo|food|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|fr|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fujixerox|fun|fund|furniture|futbol|fyi|ga|gal|gallery|gallo|gallup|game|games|gap|garden|gb|gbiz|gd|gdn|ge|gea|gent|genting|george|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glade|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn|godaddy|gold|goldpoint|golf|goo|goodhands|goodyear|goog|google|gop|got|gov|gp|gq|gr|grainger|graphics|gratis|green|gripe|grocery|group|gs|gt|gu|guardian|gucci|guge|guide|guitars|guru|gw|gy|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hk|hkt|hm|hn|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|honeywell|horse|hospital|host|hosting|hot|hoteles|hotels|hotmail|house|how|hr|hsbc|ht|htc|hu|hughes|hyatt|hyundai|ibm|icbc|ice|icu|id|ie|ieee|ifm|ikano|il|im|imamat|imdb|immo|immobilien|in|industries|infiniti|info|ing|ink|institute|insurance|insure|int|intel|international|intuit|investments|io|ipiranga|iq|ir|irish|is|iselect|ismaili|ist|istanbul|it|itau|itv|iveco|iwc|jaguar|java|jcb|jcp|je|jeep|jetzt|jewelry|jio|jlc|jll|jm|jmp|jnj|jo|jobs|joburg|jot|joy|jp|jpmorgan|jprs|juegos|juniper|kaufen|kddi|ke|kerryhotels|kerrylogistics|kerryproperties|kfh|kg|kh|ki|kia|kim|kinder|kindle|kitchen|kiwi|km|kn|koeln|komatsu|kosher|kp|kpmg|kpn|kr|krd|kred|kuokgroup|kw|ky|kyoto|kz|la|lacaixa|ladbrokes|lamborghini|lamer|lancaster|lancia|lancome|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|li|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lixil|lk|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|lr|ls|lt|ltd|ltda|lu|lundbeck|lupin|luxe|luxury|lv|ly|ma|macys|madrid|maif|maison|makeup|man|management|mango|map|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mc|mckinsey|md|me|med|media|meet|melbourne|meme|memorial|men|menu|meo|merckmsd|metlife|mg|mh|miami|microsoft|mil|mini|mint|mit|mitsubishi|mk|ml|mlb|mls|mm|mma|mn|mo|mobi|mobile|mobily|moda|moe|moi|mom|monash|money|monster|mopar|mormon|mortgage|moscow|moto|motorcycles|mov|movie|movistar|mp|mq|mr|ms|msd|mt|mtn|mtr|mu|museum|mutual|mv|mw|mx|my|mz|na|nab|nadex|nagoya|name|nationwide|natura|navy|nba|nc|ne|nec|net|netbank|netflix|network|neustar|new|newholland|news|next|nextdirect|nexus|nf|nfl|ng|ngo|nhk|ni|nico|nike|nikon|ninja|nissan|nissay|nl|no|nokia|northwesternmutual|norton|now|nowruz|nowtv|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|observer|off|office|okinawa|olayan|olayangroup|oldnavy|ollo|om|omega|one|ong|onl|online|onyourside|ooo|open|oracle|orange|org|organic|origins|osaka|otsuka|ott|ovh|pa|page|panasonic|panerai|paris|pars|partners|parts|party|passagens|pay|pccw|pe|pet|pf|pfizer|pg|ph|pharmacy|phd|philips|phone|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|pk|pl|place|play|playstation|plumbing|plus|pm|pn|pnc|pohl|poker|politie|porn|post|pr|pramerica|praxi|press|prime|pro|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|ps|pt|pub|pw|pwc|py|qa|qpon|quebec|quest|qvc|racing|radio|raid|re|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|rightathome|ril|rio|rip|rmit|ro|rocher|rocks|rodeo|rogers|room|rs|rsvp|ru|rugby|ruhr|run|rw|rwe|ryukyu|sa|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|save|saxo|sb|sbi|sbs|sc|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scjohnson|scor|scot|sd|se|search|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|sg|sh|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|showtime|shriram|si|silk|sina|singles|site|sj|sk|ski|skin|sky|skype|sl|sling|sm|smart|smile|sn|sncf|so|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|spiegel|spot|spreadbetting|sr|srl|srt|st|stada|staples|star|starhub|statebank|statefarm|statoil|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiftcover|swiss|sx|sy|sydney|symantec|systems|sz|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|tdk|team|tech|technology|tel|telecity|telefonica|temasek|tennis|teva|tf|tg|th|thd|theater|theatre|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tj|tjmaxx|tjx|tk|tkmaxx|tl|tm|tmall|tn|to|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tr|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|trust|trv|tt|tube|tui|tunes|tushu|tv|tvs|tw|tz|ua|ubank|ubs|uconnect|ug|uk|unicom|university|uno|uol|ups|us|uy|uz|va|vacations|vana|vanguard|vc|ve|vegas|ventures|verisign|versicherung|vet|vg|vi|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|vista|vistaprint|viva|vivo|vlaanderen|vn|vodka|volkswagen|volvo|vote|voting|voto|voyage|vu|vuelos|wales|walmart|walter|wang|wanggou|warman|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weibo|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|ws|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--30rr7y|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--3hcrj9c|xn--3oq18vl8pn36a|xn--3pxu8k|xn--42c2d9a|xn--45br5cyl|xn--45brj9c|xn--45q11c|xn--4gbrim|xn--54b7fta0cc|xn--55qw42g|xn--55qx5d|xn--5su34j936bgsg|xn--5tzm5g|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80aqecdr1a|xn--80asehdb|xn--80aswg|xn--8y0a063a|xn--90a3ac|xn--90ae|xn--90ais|xn--9dbq2a|xn--9et52u|xn--9krt00a|xn--b4w605ferd|xn--bck1b9a5dre4c|xn--c1avg|xn--c2br7g|xn--cck2b3b|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czrs0t|xn--czru2d|xn--d1acj3b|xn--d1alf|xn--e1a4c|xn--eckvdtc9d|xn--efvy88h|xn--estv75g|xn--fct429k|xn--fhbei|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fjq720a|xn--flw351e|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--fzys8d69uvgm|xn--g2xx48c|xn--gckr3f0f|xn--gecrj9c|xn--gk3at1e|xn--h2breg3eve|xn--h2brj9c|xn--h2brj9c8c|xn--hxt814e|xn--i1b6b1a6a2e|xn--imr513n|xn--io0a7i|xn--j1aef|xn--j1amh|xn--j6w193g|xn--jlq61u9w7b|xn--jvr189m|xn--kcrx77d1x4a|xn--kprw13d|xn--kpry57d|xn--kpu716f|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a3ejt|xn--mgba3a4f16a|xn--mgba7c0bbn0a|xn--mgbaakc7dvf|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbai9azgqp6j|xn--mgbayh7gpa|xn--mgbb9fbpob|xn--mgbbh1a|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgbca7dzdo|xn--mgberp4a5d4ar|xn--mgbgu82a|xn--mgbi4ecexp|xn--mgbpl2fh|xn--mgbt3dhd|xn--mgbtx2b|xn--mgbx4cd0ab|xn--mix891f|xn--mk1bu44c|xn--mxtq1m|xn--ngbc5azd|xn--ngbe9e0a|xn--ngbrx|xn--node|xn--nqv7f|xn--nqv7fs00ema|xn--nyqy26a|xn--o3cw4h|xn--ogbpf8fl|xn--p1acf|xn--p1ai|xn--pbt977c|xn--pgbs0dh|xn--pssy2u|xn--q9jyb4c|xn--qcka1pmc|xn--qxam|xn--rhqv96g|xn--rovu88b|xn--rvc1e0am3e|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--tckwe|xn--tiq49xqyj|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--vuq861b|xn--w4r85el8fhu5dnra|xn--w4rs40l|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--y9a3aq|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xperia|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye|yodobashi|yoga|yokohama|you|youtube|yt|yun|za|zappos|zara|zero|zip|zippo|zm|zone|zuerich|zw'.split('|'); // macro, see gulpfile.js

/**
	The scanner provides an interface that takes a string of text as input, and
	outputs an array of tokens instances that can be used for easy URL parsing.

	@module linkify
	@submodule scanner
	@main scanner
*/

var NUMBERS = '0123456789'.split('');
var ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
var WHITESPACE = [' ', '\f', '\r', '\t', '\v', '\xA0', '\u1680', '\u180E']; // excluding line breaks

var domainStates = []; // states that jump to DOMAIN on /[a-z0-9]/
var makeState = function makeState(tokenClass) {
	return new _state.CharacterState(tokenClass);
};

// Frequently used states
var S_START = makeState();
var S_NUM = makeState(_text.NUM);
var S_DOMAIN = makeState(_text.DOMAIN);
var S_DOMAIN_HYPHEN = makeState(); // domain followed by 1 or more hyphen characters
var S_WS = makeState(_text.WS);

// States for special URL symbols
S_START.on('@', makeState(_text.AT)).on('.', makeState(_text.DOT)).on('+', makeState(_text.PLUS)).on('#', makeState(_text.POUND)).on('?', makeState(_text.QUERY)).on('/', makeState(_text.SLASH)).on('_', makeState(_text.UNDERSCORE)).on(':', makeState(_text.COLON)).on('{', makeState(_text.OPENBRACE)).on('[', makeState(_text.OPENBRACKET)).on('<', makeState(_text.OPENANGLEBRACKET)).on('(', makeState(_text.OPENPAREN)).on('}', makeState(_text.CLOSEBRACE)).on(']', makeState(_text.CLOSEBRACKET)).on('>', makeState(_text.CLOSEANGLEBRACKET)).on(')', makeState(_text.CLOSEPAREN)).on('&', makeState(_text.AMPERSAND)).on([',', ';', '!', '"', '\''], makeState(_text.PUNCTUATION));

// Whitespace jumps
// Tokens of only non-newline whitespace are arbitrarily long
S_START.on('\n', makeState(_text.NL)).on(WHITESPACE, S_WS);

// If any whitespace except newline, more whitespace!
S_WS.on(WHITESPACE, S_WS);

// Generates states for top-level domains
// Note that this is most accurate when tlds are in alphabetical order
for (var i = 0; i < tlds.length; i++) {
	var newStates = (0, _state.stateify)(tlds[i], S_START, _text.TLD, _text.DOMAIN);
	domainStates.push.apply(domainStates, newStates);
}

// Collect the states generated by different protocls
var partialProtocolFileStates = (0, _state.stateify)('file', S_START, _text.DOMAIN, _text.DOMAIN);
var partialProtocolFtpStates = (0, _state.stateify)('ftp', S_START, _text.DOMAIN, _text.DOMAIN);
var partialProtocolHttpStates = (0, _state.stateify)('http', S_START, _text.DOMAIN, _text.DOMAIN);
var partialProtocolMailtoStates = (0, _state.stateify)('mailto', S_START, _text.DOMAIN, _text.DOMAIN);

// Add the states to the array of DOMAINeric states
domainStates.push.apply(domainStates, partialProtocolFileStates);
domainStates.push.apply(domainStates, partialProtocolFtpStates);
domainStates.push.apply(domainStates, partialProtocolHttpStates);
domainStates.push.apply(domainStates, partialProtocolMailtoStates);

// Protocol states
var S_PROTOCOL_FILE = partialProtocolFileStates.pop();
var S_PROTOCOL_FTP = partialProtocolFtpStates.pop();
var S_PROTOCOL_HTTP = partialProtocolHttpStates.pop();
var S_MAILTO = partialProtocolMailtoStates.pop();
var S_PROTOCOL_SECURE = makeState(_text.DOMAIN);
var S_FULL_PROTOCOL = makeState(_text.PROTOCOL); // Full protocol ends with COLON
var S_FULL_MAILTO = makeState(_text.MAILTO); // Mailto ends with COLON

// Secure protocols (end with 's')
S_PROTOCOL_FTP.on('s', S_PROTOCOL_SECURE).on(':', S_FULL_PROTOCOL);

S_PROTOCOL_HTTP.on('s', S_PROTOCOL_SECURE).on(':', S_FULL_PROTOCOL);

domainStates.push(S_PROTOCOL_SECURE);

// Become protocol tokens after a COLON
S_PROTOCOL_FILE.on(':', S_FULL_PROTOCOL);
S_PROTOCOL_SECURE.on(':', S_FULL_PROTOCOL);
S_MAILTO.on(':', S_FULL_MAILTO);

// Localhost
var partialLocalhostStates = (0, _state.stateify)('localhost', S_START, _text.LOCALHOST, _text.DOMAIN);
domainStates.push.apply(domainStates, partialLocalhostStates);

// Everything else
// DOMAINs make more DOMAINs
// Number and character transitions
S_START.on(NUMBERS, S_NUM);
S_NUM.on('-', S_DOMAIN_HYPHEN).on(NUMBERS, S_NUM).on(ALPHANUM, S_DOMAIN); // number becomes DOMAIN

S_DOMAIN.on('-', S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN);

// All the generated states should have a jump to DOMAIN
for (var _i = 0; _i < domainStates.length; _i++) {
	domainStates[_i].on('-', S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN);
}

S_DOMAIN_HYPHEN.on('-', S_DOMAIN_HYPHEN).on(NUMBERS, S_DOMAIN).on(ALPHANUM, S_DOMAIN);

// Set default transition
S_START.defaultTransition = makeState(_text.SYM);

/**
	Given a string, returns an array of TOKEN instances representing the
	composition of that string.

	@method run
	@param {String} str Input string to scan
	@return {Array} Array of TOKEN instances
*/
var run = function run(str) {

	// The state machine only looks at lowercase strings.
	// This selective `toLowerCase` is used because lowercasing the entire
	// string causes the length and character position to vary in some in some
	// non-English strings. This happens only on V8-based runtimes.
	var lowerStr = str.replace(/[A-Z]/g, function (c) {
		return c.toLowerCase();
	});
	var len = str.length;
	var tokens = []; // return value

	var cursor = 0;

	// Tokenize the string
	while (cursor < len) {
		var state = S_START;
		var nextState = null;
		var tokenLength = 0;
		var latestAccepting = null;
		var sinceAccepts = -1;

		while (cursor < len && (nextState = state.next(lowerStr[cursor]))) {
			state = nextState;

			// Keep track of the latest accepting state
			if (state.accepts()) {
				sinceAccepts = 0;
				latestAccepting = state;
			} else if (sinceAccepts >= 0) {
				sinceAccepts++;
			}

			tokenLength++;
			cursor++;
		}

		if (sinceAccepts < 0) {
			continue;
		} // Should never happen

		// Roll back to the latest accepting state
		cursor -= sinceAccepts;
		tokenLength -= sinceAccepts;

		// Get the class for the new token
		var TOKEN = latestAccepting.emit(); // Current token class

		// No more jumps, just make a new token
		tokens.push(new TOKEN(str.substr(cursor - tokenLength, tokenLength)));
	}

	return tokens;
};

var start = S_START;
exports.State = _state.CharacterState;
exports.TOKENS = TOKENS;
exports.run = run;
exports.start = start;

/***/ }),

/***/ "ba92":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__("4bf8");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "bd43":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isImageFile", function() { return isImageFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVideoFile", function() { return isVideoFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAudioFile", function() { return isAudioFile; });
/* harmony import */ var core_js_modules_es6_array_some_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("759f");
/* harmony import */ var core_js_modules_es6_array_some_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_some_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_string_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2fdb");
/* harmony import */ var core_js_modules_es6_string_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es7_array_includes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6762");
/* harmony import */ var core_js_modules_es7_array_includes_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_array_includes_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c9d9");





function checkMediaType(types, file) {
  if (!file || !file.type) return;
  return types.some(function (t) {
    return file.type.toLowerCase().includes(t);
  });
}

function isImageFile(file) {
  return checkMediaType(_constants__WEBPACK_IMPORTED_MODULE_3__[/* IMAGE_TYPES */ "b"], file);
}
function isVideoFile(file) {
  return checkMediaType(_constants__WEBPACK_IMPORTED_MODULE_3__[/* VIDEO_TYPES */ "c"], file);
}
function isAudioFile(file) {
  return checkMediaType(_constants__WEBPACK_IMPORTED_MODULE_3__[/* AUDIO_TYPES */ "a"], file);
}

/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "bea1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.URL = exports.TEXT = exports.NL = exports.EMAIL = exports.MAILTOEMAIL = exports.Base = undefined;

var _createTokenClass = __webpack_require__("46f3");

var _class = __webpack_require__("254c");

var _text = __webpack_require__("7656");

/******************************************************************************
	Multi-Tokens
	Tokens composed of arrays of TextTokens
******************************************************************************/

// Is the given token a valid domain token?
// Should nums be included here?
function isDomainToken(token) {
	return token instanceof _text.DOMAIN || token instanceof _text.TLD;
}

/**
	Abstract class used for manufacturing tokens of text tokens. That is rather
	than the value for a token being a small string of text, it's value an array
	of text tokens.

	Used for grouping together URLs, emails, hashtags, and other potential
	creations.

	@class MultiToken
	@abstract
*/
var MultiToken = (0, _createTokenClass.createTokenClass)();

MultiToken.prototype = {
	/**
 	String representing the type for this token
 	@property type
 	@default 'TOKEN'
 */
	type: 'token',

	/**
 	Is this multitoken a link?
 	@property isLink
 	@default false
 */
	isLink: false,

	/**
 	Return the string this token represents.
 	@method toString
 	@return {String}
 */
	toString: function toString() {
		var result = [];
		for (var i = 0; i < this.v.length; i++) {
			result.push(this.v[i].toString());
		}
		return result.join('');
	},


	/**
 	What should the value for this token be in the `href` HTML attribute?
 	Returns the `.toString` value by default.
 		@method toHref
 	@return {String}
 */
	toHref: function toHref() {
		return this.toString();
	},


	/**
 	Returns a hash of relevant values for this token, which includes keys
 	* type - Kind of token ('url', 'email', etc.)
 	* value - Original text
 	* href - The value that should be added to the anchor tag's href
 		attribute
 		@method toObject
 	@param {String} [protocol] `'http'` by default
 	@return {Object}
 */
	toObject: function toObject() {
		var protocol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';

		return {
			type: this.type,
			value: this.toString(),
			href: this.toHref(protocol)
		};
	}
};

/**
	Represents an arbitrarily mailto email address with the prefix included
	@class MAILTO
	@extends MultiToken
*/
var MAILTOEMAIL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
	type: 'email',
	isLink: true
});

/**
	Represents a list of tokens making up a valid email address
	@class EMAIL
	@extends MultiToken
*/
var EMAIL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
	type: 'email',
	isLink: true,
	toHref: function toHref() {
		return 'mailto:' + this.toString();
	}
});

/**
	Represents some plain text
	@class TEXT
	@extends MultiToken
*/
var TEXT = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), { type: 'text' });

/**
	Multi-linebreak token - represents a line break
	@class NL
	@extends MultiToken
*/
var NL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), { type: 'nl' });

/**
	Represents a list of tokens making up a valid URL
	@class URL
	@extends MultiToken
*/
var URL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
	type: 'url',
	isLink: true,

	/**
 	Lowercases relevant parts of the domain and adds the protocol if
 	required. Note that this will not escape unsafe HTML characters in the
 	URL.
 		@method href
 	@param {String} protocol
 	@return {String}
 */
	toHref: function toHref() {
		var protocol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';

		var hasProtocol = false;
		var hasSlashSlash = false;
		var tokens = this.v;
		var result = [];
		var i = 0;

		// Make the first part of the domain lowercase
		// Lowercase protocol
		while (tokens[i] instanceof _text.PROTOCOL) {
			hasProtocol = true;
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Skip slash-slash
		while (tokens[i] instanceof _text.SLASH) {
			hasSlashSlash = true;
			result.push(tokens[i].toString());
			i++;
		}

		// Lowercase all other characters in the domain
		while (isDomainToken(tokens[i])) {
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Leave all other characters as they were written
		for (; i < tokens.length; i++) {
			result.push(tokens[i].toString());
		}

		result = result.join('');

		if (!(hasProtocol || hasSlashSlash)) {
			result = protocol + '://' + result;
		}

		return result;
	},
	hasProtocol: function hasProtocol() {
		return this.v[0] instanceof _text.PROTOCOL;
	}
});

exports.Base = MultiToken;
exports.MAILTOEMAIL = MAILTOEMAIL;
exports.EMAIL = EMAIL;
exports.NL = NL;
exports.TEXT = TEXT;
exports.URL = URL;

/***/ }),

/***/ "c25f":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c28b":
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){ true?module.exports=n():undefined}(this,function(){var e="undefined"!=typeof window,n="undefined"!=typeof navigator,t=e&&("ontouchstart"in window||n&&navigator.msMaxTouchPoints>0)?["touchstart"]:["click"];function i(e){var n=e.event,t=e.handler;(0,e.middleware)(n)&&t(n)}function r(e,n){var r=function(e){var n="function"==typeof e;if(!n&&"object"!=typeof e)throw new Error("v-click-outside: Binding value must be a function or an object");return{handler:n?e:e.handler,middleware:e.middleware||function(e){return e},events:e.events||t,isActive:!(!1===e.isActive),detectIframe:!(!1===e.detectIframe)}}(n.value),d=r.handler,o=r.middleware,a=r.detectIframe;if(r.isActive){if(e["__v-click-outside"]=r.events.map(function(n){return{event:n,srcTarget:document.documentElement,handler:function(n){return function(e){var n=e.el,t=e.event,r=e.handler,d=e.middleware,o=t.path||t.composedPath&&t.composedPath();(o?o.indexOf(n)<0:!n.contains(t.target))&&i({event:t,handler:r,middleware:d})}({el:e,event:n,handler:d,middleware:o})}}}),a){var c={event:"blur",srcTarget:window,handler:function(n){return function(e){var n=e.el,t=e.event,r=e.handler,d=e.middleware;setTimeout(function(){var e=document.activeElement;e&&"IFRAME"===e.tagName&&!n.contains(e)&&i({event:t,handler:r,middleware:d})},0)}({el:e,event:n,handler:d,middleware:o})}};e["__v-click-outside"]=[].concat(e["__v-click-outside"],[c])}e["__v-click-outside"].forEach(function(n){var t=n.event,i=n.srcTarget,r=n.handler;return setTimeout(function(){e["__v-click-outside"]&&i.addEventListener(t,r,!1)},0)})}}function d(e){(e["__v-click-outside"]||[]).forEach(function(e){return e.srcTarget.removeEventListener(e.event,e.handler,!1)}),delete e["__v-click-outside"]}var o=e?{bind:r,update:function(e,n){var t=n.value,i=n.oldValue;JSON.stringify(t)!==JSON.stringify(i)&&(d(e),r(e,{value:t}))},unbind:d}:{};return{install:function(e){e.directive("click-outside",o)},directive:o}});
//# sourceMappingURL=v-click-outside.umd.js.map


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c390":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c3ec":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormatMessage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4421");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormatMessage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormatMessage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "c48f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageImage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d8ec");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageImage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageImage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "c8ce":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c8fb":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c9d9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return IMAGE_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return VIDEO_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AUDIO_TYPES; });
var IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'];
var VIDEO_TYPES = ['mp4', 'video/ogg', 'webm', 'quicktime'];
var AUDIO_TYPES = ['mp3', 'audio/ogg', 'wav', 'mpeg'];

/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d25f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $filter = __webpack_require__("0a49")(2);

$export($export.P + $export.F * !__webpack_require__("2f21")([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("aae3");
var defined = __webpack_require__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d4c0":
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "d8ec":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "d92a":
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__("5ca1");

$export($export.P, 'Function', { bind: __webpack_require__("f0c1") });


/***/ }),

/***/ "db18":
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_db18__ === 'undefined') {var e = new Error("Cannot find module 'lamejs'"); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_db18__;

/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e166":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * vue-infinite-loading v2.4.5
 * (c) 2016-2021 PeachScript
 * MIT License
 */
!function(t,e){ true?module.exports=e():undefined}(this,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=9)}([function(t,e,n){var i=n(6);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);(0,n(3).default)("09280948",i,!0,{})},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",i=t[3];if(!i)return n;if(e&&"function"==typeof btoa){var r=(o=i,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),a=i.sources.map((function(t){return"/*# sourceURL="+i.sourceRoot+t+" */"}));return[n].concat(a).concat([r]).join("\n")}var o;return[n].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n})).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var i={},r=0;r<this.length;r++){var a=this[r][0];"number"==typeof a&&(i[a]=!0)}for(r=0;r<t.length;r++){var o=t[r];"number"==typeof o[0]&&i[o[0]]||(n&&!o[2]?o[2]=n:n&&(o[2]="("+o[2]+") and ("+n+")"),e.push(o))}},e}},function(t,e,n){var i=n(8);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);(0,n(3).default)("5f444915",i,!0,{})},function(t,e,n){"use strict";function i(t,e){for(var n=[],i={},r=0;r<e.length;r++){var a=e[r],o=a[0],s={id:t+":"+r,css:a[1],media:a[2],sourceMap:a[3]};i[o]?i[o].parts.push(s):n.push(i[o]={id:o,parts:[s]})}return n}n.r(e),n.d(e,"default",(function(){return f}));var r="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!r)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},o=r&&(document.head||document.getElementsByTagName("head")[0]),s=null,l=0,d=!1,c=function(){},u=null,p="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function f(t,e,n,r){d=n,u=r||{};var o=i(t,e);return b(o),function(e){for(var n=[],r=0;r<o.length;r++){var s=o[r];(l=a[s.id]).refs--,n.push(l)}e?b(o=i(t,e)):o=[];for(r=0;r<n.length;r++){var l;if(0===(l=n[r]).refs){for(var d=0;d<l.parts.length;d++)l.parts[d]();delete a[l.id]}}}}function b(t){for(var e=0;e<t.length;e++){var n=t[e],i=a[n.id];if(i){i.refs++;for(var r=0;r<i.parts.length;r++)i.parts[r](n.parts[r]);for(;r<n.parts.length;r++)i.parts.push(m(n.parts[r]));i.parts.length>n.parts.length&&(i.parts.length=n.parts.length)}else{var o=[];for(r=0;r<n.parts.length;r++)o.push(m(n.parts[r]));a[n.id]={id:n.id,refs:1,parts:o}}}}function h(){var t=document.createElement("style");return t.type="text/css",o.appendChild(t),t}function m(t){var e,n,i=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(i){if(d)return c;i.parentNode.removeChild(i)}if(p){var r=l++;i=s||(s=h()),e=w.bind(null,i,r,!1),n=w.bind(null,i,r,!0)}else i=h(),e=x.bind(null,i),n=function(){i.parentNode.removeChild(i)};return e(t),function(i){if(i){if(i.css===t.css&&i.media===t.media&&i.sourceMap===t.sourceMap)return;e(t=i)}else n()}}var g,v=(g=[],function(t,e){return g[t]=e,g.filter(Boolean).join("\n")});function w(t,e,n,i){var r=n?"":i.css;if(t.styleSheet)t.styleSheet.cssText=v(e,r);else{var a=document.createTextNode(r),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(a,o[e]):t.appendChild(a)}}function x(t,e){var n=e.css,i=e.media,r=e.sourceMap;if(i&&t.setAttribute("media",i),u.ssrId&&t.setAttribute("data-vue-ssr-id",e.id),r&&(n+="\n/*# sourceURL="+r.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},function(t,e){function n(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?(t.exports=n=function(t){return typeof t},t.exports.default=t.exports,t.exports.__esModule=!0):(t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t.exports.default=t.exports,t.exports.__esModule=!0),n(e)}t.exports=n,t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e,n){"use strict";n.r(e);var i=n(0);for(var r in i)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(r)},function(t,e,n){(t.exports=n(1)(!1)).push([t.i,'.loading-wave-dots[data-v-46b20d22]{position:relative}.loading-wave-dots[data-v-46b20d22] .wave-item{position:absolute;top:50%;left:50%;display:inline-block;margin-top:-4px;width:8px;height:8px;border-radius:50%;-webkit-animation:loading-wave-dots-data-v-46b20d22 linear 2.8s infinite;animation:loading-wave-dots-data-v-46b20d22 linear 2.8s infinite}.loading-wave-dots[data-v-46b20d22] .wave-item:first-child{margin-left:-36px}.loading-wave-dots[data-v-46b20d22] .wave-item:nth-child(2){margin-left:-20px;-webkit-animation-delay:.14s;animation-delay:.14s}.loading-wave-dots[data-v-46b20d22] .wave-item:nth-child(3){margin-left:-4px;-webkit-animation-delay:.28s;animation-delay:.28s}.loading-wave-dots[data-v-46b20d22] .wave-item:nth-child(4){margin-left:12px;-webkit-animation-delay:.42s;animation-delay:.42s}.loading-wave-dots[data-v-46b20d22] .wave-item:last-child{margin-left:28px;-webkit-animation-delay:.56s;animation-delay:.56s}@-webkit-keyframes loading-wave-dots-data-v-46b20d22{0%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}10%{-webkit-transform:translateY(-6px);transform:translateY(-6px);background:#999}20%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}to{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}}@keyframes loading-wave-dots-data-v-46b20d22{0%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}10%{-webkit-transform:translateY(-6px);transform:translateY(-6px);background:#999}20%{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}to{-webkit-transform:translateY(0);transform:translateY(0);background:#bbb}}.loading-circles[data-v-46b20d22] .circle-item{width:5px;height:5px;-webkit-animation:loading-circles-data-v-46b20d22 linear .75s infinite;animation:loading-circles-data-v-46b20d22 linear .75s infinite}.loading-circles[data-v-46b20d22] .circle-item:first-child{margin-top:-14.5px;margin-left:-2.5px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(2){margin-top:-11.26px;margin-left:6.26px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(3){margin-top:-2.5px;margin-left:9.5px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(4){margin-top:6.26px;margin-left:6.26px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(5){margin-top:9.5px;margin-left:-2.5px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(6){margin-top:6.26px;margin-left:-11.26px}.loading-circles[data-v-46b20d22] .circle-item:nth-child(7){margin-top:-2.5px;margin-left:-14.5px}.loading-circles[data-v-46b20d22] .circle-item:last-child{margin-top:-11.26px;margin-left:-11.26px}@-webkit-keyframes loading-circles-data-v-46b20d22{0%{background:#dfdfdf}90%{background:#505050}to{background:#dfdfdf}}@keyframes loading-circles-data-v-46b20d22{0%{background:#dfdfdf}90%{background:#505050}to{background:#dfdfdf}}.loading-bubbles[data-v-46b20d22] .bubble-item{background:#666;-webkit-animation:loading-bubbles-data-v-46b20d22 linear .75s infinite;animation:loading-bubbles-data-v-46b20d22 linear .75s infinite}.loading-bubbles[data-v-46b20d22] .bubble-item:first-child{margin-top:-12.5px;margin-left:-.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(2){margin-top:-9.26px;margin-left:8.26px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(3){margin-top:-.5px;margin-left:11.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(4){margin-top:8.26px;margin-left:8.26px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(5){margin-top:11.5px;margin-left:-.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(6){margin-top:8.26px;margin-left:-9.26px}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(7){margin-top:-.5px;margin-left:-12.5px}.loading-bubbles[data-v-46b20d22] .bubble-item:last-child{margin-top:-9.26px;margin-left:-9.26px}@-webkit-keyframes loading-bubbles-data-v-46b20d22{0%{width:1px;height:1px;box-shadow:0 0 0 3px #666}90%{width:1px;height:1px;box-shadow:0 0 0 0 #666}to{width:1px;height:1px;box-shadow:0 0 0 3px #666}}@keyframes loading-bubbles-data-v-46b20d22{0%{width:1px;height:1px;box-shadow:0 0 0 3px #666}90%{width:1px;height:1px;box-shadow:0 0 0 0 #666}to{width:1px;height:1px;box-shadow:0 0 0 3px #666}}.loading-default[data-v-46b20d22]{position:relative;border:1px solid #999;-webkit-animation:loading-rotating-data-v-46b20d22 ease 1.5s infinite;animation:loading-rotating-data-v-46b20d22 ease 1.5s infinite}.loading-default[data-v-46b20d22]:before{content:"";position:absolute;display:block;top:0;left:50%;margin-top:-3px;margin-left:-3px;width:6px;height:6px;background-color:#999;border-radius:50%}.loading-spiral[data-v-46b20d22]{border:2px solid #777;border-right-color:transparent;-webkit-animation:loading-rotating-data-v-46b20d22 linear .85s infinite;animation:loading-rotating-data-v-46b20d22 linear .85s infinite}@-webkit-keyframes loading-rotating-data-v-46b20d22{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes loading-rotating-data-v-46b20d22{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.loading-bubbles[data-v-46b20d22],.loading-circles[data-v-46b20d22]{position:relative}.loading-bubbles[data-v-46b20d22] .bubble-item,.loading-circles[data-v-46b20d22] .circle-item{position:absolute;top:50%;left:50%;display:inline-block;border-radius:50%}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(2),.loading-circles[data-v-46b20d22] .circle-item:nth-child(2){-webkit-animation-delay:93ms;animation-delay:93ms}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(3),.loading-circles[data-v-46b20d22] .circle-item:nth-child(3){-webkit-animation-delay:.186s;animation-delay:.186s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(4),.loading-circles[data-v-46b20d22] .circle-item:nth-child(4){-webkit-animation-delay:.279s;animation-delay:.279s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(5),.loading-circles[data-v-46b20d22] .circle-item:nth-child(5){-webkit-animation-delay:.372s;animation-delay:.372s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(6),.loading-circles[data-v-46b20d22] .circle-item:nth-child(6){-webkit-animation-delay:.465s;animation-delay:.465s}.loading-bubbles[data-v-46b20d22] .bubble-item:nth-child(7),.loading-circles[data-v-46b20d22] .circle-item:nth-child(7){-webkit-animation-delay:.558s;animation-delay:.558s}.loading-bubbles[data-v-46b20d22] .bubble-item:last-child,.loading-circles[data-v-46b20d22] .circle-item:last-child{-webkit-animation-delay:.651s;animation-delay:.651s}',""])},function(t,e,n){"use strict";n.r(e);var i=n(2);for(var r in i)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(r)},function(t,e,n){(t.exports=n(1)(!1)).push([t.i,".infinite-loading-container[data-v-670d0042]{clear:both;text-align:center}.infinite-loading-container[data-v-670d0042] [class^=loading-]{display:inline-block;margin:5px 0;width:28px;height:28px;font-size:28px;line-height:28px;border-radius:50%}.btn-try-infinite[data-v-670d0042]{margin-top:5px;padding:5px 10px;color:#999;font-size:14px;line-height:1;background:transparent;border:1px solid #ccc;border-radius:3px;outline:none;cursor:pointer}.btn-try-infinite[data-v-670d0042]:not(:active):hover{opacity:.8}",""])},function(t,e,n){"use strict";n.r(e);var i={throttleLimit:50,loopCheckTimeout:1e3,loopCheckMaxCalls:10},r=function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){return t={passive:!0},!0}});window.addEventListener("testpassive",e,e),window.remove("testpassive",e,e)}catch(t){}return t}(),a={STATE_CHANGER:["emit `loaded` and `complete` event through component instance of `$refs` may cause error, so it will be deprecated soon, please use the `$state` argument instead (`$state` just the special `$event` variable):","\ntemplate:",'<infinite-loading @infinite="infiniteHandler"></infinite-loading>',"\nscript:\n...\ninfiniteHandler($state) {\n  ajax('https://www.example.com/api/news')\n    .then((res) => {\n      if (res.data.length) {\n        $state.loaded();\n      } else {\n        $state.complete();\n      }\n    });\n}\n...","","more details: https://github.com/PeachScript/vue-infinite-loading/issues/57#issuecomment-324370549"].join("\n"),INFINITE_EVENT:"`:on-infinite` property will be deprecated soon, please use `@infinite` event instead.",IDENTIFIER:"the `reset` event will be deprecated soon, please reset this component by change the `identifier` property."},o={INFINITE_LOOP:["executed the callback function more than ".concat(i.loopCheckMaxCalls," times for a short time, it looks like searched a wrong scroll wrapper that doest not has fixed height or maximum height, please check it. If you want to force to set a element as scroll wrapper ranther than automatic searching, you can do this:"),'\n\x3c!-- add a special attribute for the real scroll wrapper --\x3e\n<div infinite-wrapper>\n  ...\n  \x3c!-- set force-use-infinite-wrapper --\x3e\n  <infinite-loading force-use-infinite-wrapper></infinite-loading>\n</div>\nor\n<div class="infinite-wrapper">\n  ...\n  \x3c!-- set force-use-infinite-wrapper as css selector of the real scroll wrapper --\x3e\n  <infinite-loading force-use-infinite-wrapper=".infinite-wrapper"></infinite-loading>\n</div>\n    ',"more details: https://github.com/PeachScript/vue-infinite-loading/issues/55#issuecomment-316934169"].join("\n")},s={READY:0,LOADING:1,COMPLETE:2,ERROR:3},l={color:"#666",fontSize:"14px",padding:"10px 0"},d={mode:"development",props:{spinner:"default",distance:100,forceUseInfiniteWrapper:!1},system:i,slots:{noResults:"No results :(",noMore:"No more data :)",error:"Opps, something went wrong :(",errorBtnText:"Retry",spinner:""},WARNINGS:a,ERRORS:o,STATUS:s},c=n(4),u=n.n(c),p={BUBBLES:{render:function(t){return t("span",{attrs:{class:"loading-bubbles"}},Array.apply(Array,Array(8)).map((function(){return t("span",{attrs:{class:"bubble-item"}})})))}},CIRCLES:{render:function(t){return t("span",{attrs:{class:"loading-circles"}},Array.apply(Array,Array(8)).map((function(){return t("span",{attrs:{class:"circle-item"}})})))}},DEFAULT:{render:function(t){return t("i",{attrs:{class:"loading-default"}})}},SPIRAL:{render:function(t){return t("i",{attrs:{class:"loading-spiral"}})}},WAVEDOTS:{render:function(t){return t("span",{attrs:{class:"loading-wave-dots"}},Array.apply(Array,Array(5)).map((function(){return t("span",{attrs:{class:"wave-item"}})})))}}};function f(t,e,n,i,r,a,o,s){var l,d="function"==typeof t?t.options:t;if(e&&(d.render=e,d.staticRenderFns=n,d._compiled=!0),i&&(d.functional=!0),a&&(d._scopeId="data-v-"+a),o?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},d._ssrRegister=l):r&&(l=s?function(){r.call(this,(d.functional?this.parent:this).$root.$options.shadowRoot)}:r),l)if(d.functional){d._injectStyles=l;var c=d.render;d.render=function(t,e){return l.call(e),c(t,e)}}else{var u=d.beforeCreate;d.beforeCreate=u?[].concat(u,l):[l]}return{exports:t,options:d}}var b=f({name:"Spinner",computed:{spinnerView:function(){return p[(this.$attrs.spinner||"").toUpperCase()]||this.spinnerInConfig},spinnerInConfig:function(){return d.slots.spinner&&"string"==typeof d.slots.spinner?{render:function(){return this._v(d.slots.spinner)}}:"object"===u()(d.slots.spinner)?d.slots.spinner:p[d.props.spinner.toUpperCase()]||p.DEFAULT}}},(function(){var t=this.$createElement;return(this._self._c||t)(this.spinnerView,{tag:"component"})}),[],!1,(function(t){var e=n(5);e.__inject__&&e.__inject__(t)}),"46b20d22",null).exports;function h(t){"production"!==d.mode&&console.warn("[Vue-infinite-loading warn]: ".concat(t))}function m(t){console.error("[Vue-infinite-loading error]: ".concat(t))}var g={timers:[],caches:[],throttle:function(t){var e=this;-1===this.caches.indexOf(t)&&(this.caches.push(t),this.timers.push(setTimeout((function(){t(),e.caches.splice(e.caches.indexOf(t),1),e.timers.shift()}),d.system.throttleLimit)))},reset:function(){this.timers.forEach((function(t){clearTimeout(t)})),this.timers.length=0,this.caches=[]}},v={isChecked:!1,timer:null,times:0,track:function(){var t=this;this.times+=1,clearTimeout(this.timer),this.timer=setTimeout((function(){t.isChecked=!0}),d.system.loopCheckTimeout),this.times>d.system.loopCheckMaxCalls&&(m(o.INFINITE_LOOP),this.isChecked=!0)}},w={key:"_infiniteScrollHeight",getScrollElm:function(t){return t===window?document.documentElement:t},save:function(t){var e=this.getScrollElm(t);e[this.key]=e.scrollHeight},restore:function(t){var e=this.getScrollElm(t);"number"==typeof e[this.key]&&(e.scrollTop=e.scrollHeight-e[this.key]+e.scrollTop),this.remove(e)},remove:function(t){void 0!==t[this.key]&&delete t[this.key]}};function x(t){return t.replace(/[A-Z]/g,(function(t){return"-".concat(t.toLowerCase())}))}function y(t){return t.offsetWidth+t.offsetHeight>0}var k=f({name:"InfiniteLoading",data:function(){return{scrollParent:null,scrollHandler:null,isFirstLoad:!0,status:s.READY,slots:d.slots}},components:{Spinner:b},computed:{isShowSpinner:function(){return this.status===s.LOADING},isShowError:function(){return this.status===s.ERROR},isShowNoResults:function(){return this.status===s.COMPLETE&&this.isFirstLoad},isShowNoMore:function(){return this.status===s.COMPLETE&&!this.isFirstLoad},slotStyles:function(){var t=this,e={};return Object.keys(d.slots).forEach((function(n){var i=x(n);(!t.$slots[i]&&!d.slots[n].render||t.$slots[i]&&!t.$slots[i][0].tag)&&(e[n]=l)})),e}},props:{distance:{type:Number,default:d.props.distance},spinner:String,direction:{type:String,default:"bottom"},forceUseInfiniteWrapper:{type:[Boolean,String],default:d.props.forceUseInfiniteWrapper},identifier:{default:+new Date},webComponentName:{type:[String]},onInfinite:Function},watch:{identifier:function(){this.stateChanger.reset()}},mounted:function(){var t=this;this.$watch("forceUseInfiniteWrapper",(function(){t.scrollParent=t.getScrollParent()}),{immediate:!0}),this.scrollHandler=function(e){t.status===s.READY&&(e&&e.constructor===Event&&y(t.$el)?g.throttle(t.attemptLoad):t.attemptLoad())},setTimeout((function(){t.scrollHandler(),t.scrollParent.addEventListener("scroll",t.scrollHandler,r)}),1),this.$on("$InfiniteLoading:loaded",(function(e){t.isFirstLoad=!1,"top"===t.direction&&t.$nextTick((function(){w.restore(t.scrollParent)})),t.status===s.LOADING&&t.$nextTick(t.attemptLoad.bind(null,!0)),e&&e.target===t||h(a.STATE_CHANGER)})),this.$on("$InfiniteLoading:complete",(function(e){t.status=s.COMPLETE,t.$nextTick((function(){t.$forceUpdate()})),t.scrollParent.removeEventListener("scroll",t.scrollHandler,r),e&&e.target===t||h(a.STATE_CHANGER)})),this.$on("$InfiniteLoading:reset",(function(e){t.status=s.READY,t.isFirstLoad=!0,w.remove(t.scrollParent),t.scrollParent.addEventListener("scroll",t.scrollHandler,r),setTimeout((function(){g.reset(),t.scrollHandler()}),1),e&&e.target===t||h(a.IDENTIFIER)})),this.stateChanger={loaded:function(){t.$emit("$InfiniteLoading:loaded",{target:t})},complete:function(){t.$emit("$InfiniteLoading:complete",{target:t})},reset:function(){t.$emit("$InfiniteLoading:reset",{target:t})},error:function(){t.status=s.ERROR,g.reset()}},this.onInfinite&&h(a.INFINITE_EVENT)},deactivated:function(){this.status===s.LOADING&&(this.status=s.READY),this.scrollParent.removeEventListener("scroll",this.scrollHandler,r)},activated:function(){this.scrollParent.addEventListener("scroll",this.scrollHandler,r)},methods:{attemptLoad:function(t){var e=this;this.status!==s.COMPLETE&&y(this.$el)&&this.getCurrentDistance()<=this.distance?(this.status=s.LOADING,"top"===this.direction&&this.$nextTick((function(){w.save(e.scrollParent)})),"function"==typeof this.onInfinite?this.onInfinite.call(null,this.stateChanger):this.$emit("infinite",this.stateChanger),!t||this.forceUseInfiniteWrapper||v.isChecked||v.track()):this.status===s.LOADING&&(this.status=s.READY)},getCurrentDistance:function(){var t;"top"===this.direction?t="number"==typeof this.scrollParent.scrollTop?this.scrollParent.scrollTop:this.scrollParent.pageYOffset:t=this.$el.getBoundingClientRect().top-(this.scrollParent===window?window.innerHeight:this.scrollParent.getBoundingClientRect().bottom);return t},getScrollParent:function(){var t,e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.$el;"string"==typeof this.forceUseInfiniteWrapper&&(this.webComponentName&&(e=document.querySelector(this.webComponentName)),t=e?e.shadowRoot.querySelector(this.forceUseInfiniteWrapper):document.querySelector(this.forceUseInfiniteWrapper));return t||("BODY"===n.tagName?t=window:(!this.forceUseInfiniteWrapper&&["scroll","auto"].indexOf(getComputedStyle(n).overflowY)>-1||n.hasAttribute("infinite-wrapper")||n.hasAttribute("data-infinite-wrapper"))&&(t=n)),t||this.getScrollParent(n.parentNode)}},destroyed:function(){!this.status!==s.COMPLETE&&(g.reset(),w.remove(this.scrollParent),this.scrollParent.removeEventListener("scroll",this.scrollHandler,r))}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"infinite-loading-container"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowSpinner,expression:"isShowSpinner"}],staticClass:"infinite-status-prompt",style:t.slotStyles.spinner},[t._t("spinner",[n("spinner",{attrs:{spinner:t.spinner}})],null,{isFirstLoad:t.isFirstLoad})],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowNoResults,expression:"isShowNoResults"}],staticClass:"infinite-status-prompt",style:t.slotStyles.noResults},[t._t("no-results",[t.slots.noResults.render?n(t.slots.noResults,{tag:"component"}):[t._v(t._s(t.slots.noResults))]])],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowNoMore,expression:"isShowNoMore"}],staticClass:"infinite-status-prompt",style:t.slotStyles.noMore},[t._t("no-more",[t.slots.noMore.render?n(t.slots.noMore,{tag:"component"}):[t._v(t._s(t.slots.noMore))]])],2),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowError,expression:"isShowError"}],staticClass:"infinite-status-prompt",style:t.slotStyles.error},[t._t("error",[t.slots.error.render?n(t.slots.error,{tag:"component",attrs:{trigger:t.attemptLoad}}):[t._v("\n        "+t._s(t.slots.error)+"\n        "),n("br"),t._v(" "),n("button",{staticClass:"btn-try-infinite",domProps:{textContent:t._s(t.slots.errorBtnText)},on:{click:t.attemptLoad}})]],{trigger:t.attemptLoad})],2)])}),[],!1,(function(t){var e=n(7);e.__inject__&&e.__inject__(t)}),"670d0042",null).exports;function _(t){d.mode=t.config.productionTip?"development":"production"}Object.defineProperty(k,"install",{configurable:!1,enumerable:!1,value:function(t,e){Object.assign(d.props,e&&e.props),Object.assign(d.slots,e&&e.slots),Object.assign(d.system,e&&e.system),t.component("infinite-loading",k),_(t)}}),"undefined"!=typeof window&&window.Vue&&(window.Vue.component("infinite-loading",k),_(window.Vue));e.default=k}])}));

/***/ }),

/***/ "e2d4":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e498":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReactions_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("996f");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReactions_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReactions_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "e83d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomHeader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("02bd");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomHeader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomHeader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "e8d3":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "ec30":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (__webpack_require__("9e1e")) {
  var LIBRARY = __webpack_require__("2d00");
  var global = __webpack_require__("7726");
  var fails = __webpack_require__("79e5");
  var $export = __webpack_require__("5ca1");
  var $typed = __webpack_require__("0f88");
  var $buffer = __webpack_require__("ed0b");
  var ctx = __webpack_require__("9b43");
  var anInstance = __webpack_require__("f605");
  var propertyDesc = __webpack_require__("4630");
  var hide = __webpack_require__("32e9");
  var redefineAll = __webpack_require__("dcbc");
  var toInteger = __webpack_require__("4588");
  var toLength = __webpack_require__("9def");
  var toIndex = __webpack_require__("09fa");
  var toAbsoluteIndex = __webpack_require__("77f1");
  var toPrimitive = __webpack_require__("6a99");
  var has = __webpack_require__("69a8");
  var classof = __webpack_require__("23c6");
  var isObject = __webpack_require__("d3f4");
  var toObject = __webpack_require__("4bf8");
  var isArrayIter = __webpack_require__("33a4");
  var create = __webpack_require__("2aeb");
  var getPrototypeOf = __webpack_require__("38fd");
  var gOPN = __webpack_require__("9093").f;
  var getIterFn = __webpack_require__("27ee");
  var uid = __webpack_require__("ca5a");
  var wks = __webpack_require__("2b4c");
  var createArrayMethod = __webpack_require__("0a49");
  var createArrayIncludes = __webpack_require__("c366");
  var speciesConstructor = __webpack_require__("ebd6");
  var ArrayIterators = __webpack_require__("cadf");
  var Iterators = __webpack_require__("84f2");
  var $iterDetect = __webpack_require__("5cc5");
  var setSpecies = __webpack_require__("7a56");
  var arrayFill = __webpack_require__("36bd");
  var arrayCopyWithin = __webpack_require__("ba92");
  var $DP = __webpack_require__("86cc");
  var $GOPD = __webpack_require__("11e9");
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };


/***/ }),

/***/ "ed0b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var DESCRIPTORS = __webpack_require__("9e1e");
var LIBRARY = __webpack_require__("2d00");
var $typed = __webpack_require__("0f88");
var hide = __webpack_require__("32e9");
var redefineAll = __webpack_require__("dcbc");
var fails = __webpack_require__("79e5");
var anInstance = __webpack_require__("f605");
var toInteger = __webpack_require__("4588");
var toLength = __webpack_require__("9def");
var toIndex = __webpack_require__("09fa");
var gOPN = __webpack_require__("9093").f;
var dP = __webpack_require__("86cc").f;
var arrayFill = __webpack_require__("36bd");
var setToStringTag = __webpack_require__("7f20");
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;


/***/ }),

/***/ "f0c1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__("d8e8");
var isObject = __webpack_require__("d3f4");
var invoke = __webpack_require__("31f4");
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};


/***/ }),

/***/ "f1ae":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ "f3e2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $forEach = __webpack_require__("0a49")(0);
var STRICT = __webpack_require__("2f21")([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "f43c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioPlayer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c8fb");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioPlayer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioPlayer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "f559":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__("5ca1");
var toLength = __webpack_require__("9def");
var context = __webpack_require__("d2c8");
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__("5147")(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "f6a0":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "f7a7":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb0c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomEmojis_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("10aa");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomEmojis_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomEmojis_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.define-property.js
var es6_object_define_property = __webpack_require__("1c01");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/ChatWindow.vue?vue&type=template&id=f0bab23a&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-card-window",style:([{ height: _vm.height }, _vm.cssVars])},[_c('div',{staticClass:"vac-chat-container"},[(!_vm.singleRoom)?_c('rooms-list',{attrs:{"current-user-id":_vm.currentUserId,"rooms":_vm.orderedRooms,"loading-rooms":_vm.loadingRooms,"rooms-loaded":_vm.roomsLoaded,"room":_vm.room,"room-actions":_vm.roomActions,"text-messages":_vm.t,"show-add-room":_vm.showAddRoom,"show-rooms-list":_vm.showRoomsList,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"is-mobile":_vm.isMobile},on:{"fetch-room":_vm.fetchRoom,"fetch-more-rooms":_vm.fetchMoreRooms,"loading-more-rooms":function($event){_vm.loadingMoreRooms = $event},"add-room":_vm.addRoom,"room-action-handler":_vm.roomActionHandler},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):_vm._e(),_c('room',{attrs:{"current-user-id":_vm.currentUserId,"rooms":_vm.rooms,"room-id":_vm.room.roomId || '',"load-first-room":_vm.loadFirstRoom,"messages":_vm.messages,"room-message":_vm.roomMessage,"messages-loaded":_vm.messagesLoaded,"menu-actions":_vm.menuActions,"message-actions":_vm.messageActions,"show-send-icon":_vm.showSendIcon,"show-files":_vm.showFiles,"show-audio":_vm.showAudio,"show-emojis":_vm.showEmojis,"show-reaction-emojis":_vm.showReactionEmojis,"show-new-messages-divider":_vm.showNewMessagesDivider,"show-footer":_vm.showFooter,"text-messages":_vm.t,"single-room":_vm.singleRoom,"show-rooms-list":_vm.showRoomsList,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"is-mobile":_vm.isMobile,"loading-rooms":_vm.loadingRooms,"room-info":_vm.$listeners['room-info'],"textarea-action":_vm.$listeners['textarea-action-handler'],"accepted-files":_vm.acceptedFiles},on:{"toggle-rooms-list":_vm.toggleRoomsList,"room-info":_vm.roomInfo,"fetch-messages":_vm.fetchMessages,"send-message":_vm.sendMessage,"edit-message":_vm.editMessage,"delete-message":_vm.deleteMessage,"open-file":_vm.openFile,"open-user-tag":_vm.openUserTag,"menu-action-handler":_vm.menuActionHandler,"message-action-handler":_vm.messageActionHandler,"send-message-reaction":_vm.sendMessageReaction,"typing-message":_vm.typingMessage,"textarea-action-handler":_vm.textareaActionHandler},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/ChatWindow.vue?vue&type=template&id=f0bab23a&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.symbol.js
var es6_symbol = __webpack_require__("8a81");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.filter.js
var es6_array_filter = __webpack_require__("d25f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.get-own-property-descriptor.js
var es6_object_get_own_property_descriptor = __webpack_require__("9986");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.for-each.js
var es6_array_for_each = __webpack_require__("f3e2");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js
var es7_object_get_own_property_descriptors = __webpack_require__("8e6e");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.define-properties.js
var es6_object_define_properties = __webpack_require__("58b2");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js










function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.map.js
var es6_array_map = __webpack_require__("6d67");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.sort.js
var es6_array_sort = __webpack_require__("55dd");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.slice.js
var es6_array_slice = __webpack_require__("23bf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.entries.js
var es7_object_entries = __webpack_require__("ffc1");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=template&id=3c4495e5&
var RoomsListvue_type_template_id_3c4495e5_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showRoomsList),expression:"showRoomsList"}],staticClass:"vac-rooms-container vac-app-border-r",class:{ 'vac-rooms-container-full': _vm.isMobile }},[_vm._t("rooms-header"),_c('rooms-search',{attrs:{"rooms":_vm.rooms,"loading-rooms":_vm.loadingRooms,"text-messages":_vm.textMessages,"show-add-room":_vm.showAddRoom},on:{"search-room":_vm.searchRoom,"add-room":function($event){return _vm.$emit('add-room')}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}),_c('loader',{attrs:{"show":_vm.loadingRooms}}),(!_vm.loadingRooms && !_vm.rooms.length)?_c('div',{staticClass:"vac-rooms-empty"},[_vm._t("rooms-empty",[_vm._v(" "+_vm._s(_vm.textMessages.ROOMS_EMPTY)+" ")])],2):_vm._e(),(!_vm.loadingRooms)?_c('div',{staticClass:"vac-room-list"},[_vm._l((_vm.filteredRooms),function(fRoom){return _c('div',{key:fRoom.roomId,staticClass:"vac-room-item",class:{ 'vac-room-selected': _vm.selectedRoomId === fRoom.roomId },attrs:{"id":fRoom.roomId},on:{"click":function($event){return _vm.openRoom(fRoom)}}},[_c('room-content',{attrs:{"current-user-id":_vm.currentUserId,"room":fRoom,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"text-messages":_vm.textMessages,"room-actions":_vm.roomActions},on:{"room-action-handler":function($event){return _vm.$emit('room-action-handler', $event)}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1)}),_c('transition',{attrs:{"name":"vac-fade-message"}},[(_vm.rooms.length && !_vm.loadingRooms)?_c('infinite-loading',{attrs:{"force-use-infinite-wrapper":".vac-room-list","web-component-name":"vue-advanced-chat","spinner":"spiral"},on:{"infinite":_vm.loadMoreRooms}},[_c('div',{attrs:{"slot":"spinner"},slot:"spinner"},[_c('loader',{attrs:{"show":true,"infinite":true}})],1),_c('div',{attrs:{"slot":"no-results"},slot:"no-results"}),_c('div',{attrs:{"slot":"no-more"},slot:"no-more"})]):_vm._e()],1)],2):_vm._e()],2)}
var RoomsListvue_type_template_id_3c4495e5_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=template&id=3c4495e5&

// EXTERNAL MODULE: ./node_modules/vue-infinite-loading/dist/vue-infinite-loading.js
var vue_infinite_loading = __webpack_require__("e166");
var vue_infinite_loading_default = /*#__PURE__*/__webpack_require__.n(vue_infinite_loading);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Loader.vue?vue&type=template&id=115a59fa&
var Loadervue_type_template_id_115a59fa_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"vac-fade-spinner","appear":""}},[(_vm.show)?_c('div',{staticClass:"vac-loader-wrapper",class:{
			'vac-container-center': !_vm.infinite,
			'vac-container-top': _vm.infinite
		}},[_c('div',{attrs:{"id":"vac-circle"}})]):_vm._e()])}
var Loadervue_type_template_id_115a59fa_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Loader.vue?vue&type=template&id=115a59fa&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Loader.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var Loadervue_type_script_lang_js_ = ({
  name: 'Loader',
  props: {
    show: {
      type: Boolean,
      "default": false
    },
    infinite: {
      type: Boolean,
      "default": false
    }
  }
});
// CONCATENATED MODULE: ./src/components/Loader.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Loadervue_type_script_lang_js_ = (Loadervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Loader.vue?vue&type=style&index=0&lang=scss&
var Loadervue_type_style_index_0_lang_scss_ = __webpack_require__("a071");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/Loader.vue






/* normalize component */

var component = normalizeComponent(
  components_Loadervue_type_script_lang_js_,
  Loadervue_type_template_id_115a59fa_render,
  Loadervue_type_template_id_115a59fa_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Loader = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=template&id=079ff11e&
var RoomsSearchvue_type_template_id_079ff11e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-box-search"},[(!_vm.loadingRooms && _vm.rooms.length)?_c('div',{staticClass:"vac-icon-search"},[_vm._t("search-icon",[_c('svg-icon',{attrs:{"name":"search"}})])],2):_vm._e(),(!_vm.loadingRooms && _vm.rooms.length)?_c('input',{staticClass:"vac-input",attrs:{"type":"search","placeholder":_vm.textMessages.SEARCH,"autocomplete":"off"},on:{"input":function($event){return _vm.$emit('search-room', $event)}}}):_vm._e(),(_vm.showAddRoom)?_c('div',{staticClass:"vac-svg-button vac-add-icon",on:{"click":function($event){return _vm.$emit('add-room')}}},[_vm._t("add-icon",[_c('svg-icon',{attrs:{"name":"add"}})])],2):_vm._e()])}
var RoomsSearchvue_type_template_id_079ff11e_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=template&id=079ff11e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SvgIcon.vue?vue&type=template&id=34aa1382&
var SvgIconvue_type_template_id_34aa1382_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","version":"1.1","width":"24","height":"24","viewBox":("0 0 " + _vm.size + " " + _vm.size)}},[_c('path',{attrs:{"id":_vm.svgId,"d":_vm.svgItem[_vm.name].path}}),(_vm.svgItem[_vm.name].path2)?_c('path',{attrs:{"id":_vm.svgId,"d":_vm.svgItem[_vm.name].path2}}):_vm._e()])}
var SvgIconvue_type_template_id_34aa1382_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/SvgIcon.vue?vue&type=template&id=34aa1382&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SvgIcon.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var SvgIconvue_type_script_lang_js_ = ({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      "default": null
    },
    param: {
      type: String,
      "default": null
    }
  },
  data: function data() {
    return {
      svgItem: {
        search: {
          path: 'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z'
        },
        add: {
          path: 'M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
        },
        toggle: {
          path: 'M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z'
        },
        menu: {
          path: 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z'
        },
        close: {
          path: 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
        },
        file: {
          path: 'M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z'
        },
        paperclip: {
          path: 'M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z'
        },
        'close-outline': {
          path: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'
        },
        send: {
          path: 'M2,21L23,12L2,3V10L17,12L2,14V21Z'
        },
        emoji: {
          path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'
        },
        document: {
          path: 'M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z'
        },
        pencil: {
          path: 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z'
        },
        checkmark: {
          path: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'
        },
        'double-checkmark': {
          path: 'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z'
        },
        eye: {
          path: 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z'
        },
        dropdown: {
          path: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'
        },
        deleted: {
          path: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z'
        },
        microphone: {
          size: 'large',
          path: 'M432.8,216.4v39.2c0,45.2-15.3,84.3-45.2,118.4c-29.8,33.2-67.3,52.8-111.6,57.9v40.9h78.4c5.1,0,10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6c0,5.1-1.7,10.2-6,13.6c-4.3,4.3-8.5,6-13.6,6H157.6c-5.1,0-10.2-1.7-13.6-6c-4.3-4.3-6-8.5-6-13.6c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6H236v-40.9c-44.3-5.1-81.8-23.9-111.6-57.9s-45.2-73.3-45.2-118.4v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6s10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6v39.2c0,37.5,13.6,70.7,40,97.1s59.6,40,97.1,40s70.7-13.6,97.1-40c26.4-26.4,40-59.6,40-97.1v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6c5.1,0,10.2,1.7,13.6,6C430.2,206.2,432.8,211.3,432.8,216.4z M353.5,98v157.6c0,27.3-9.4,50.3-29,69c-19.6,19.6-42.6,29-69,29s-50.3-9.4-69-29c-19.6-19.6-29-42.6-29-69V98c0-27.3,9.4-50.3,29-69c19.6-19.6,42.6-29,69-29s50.3,9.4,69,29C344.2,47.7,353.5,71.6,353.5,98z'
        },
        'audio-play': {
          size: 'medium',
          path: 'M43.331,21.237L7.233,0.397c-0.917-0.529-2.044-0.529-2.96,0c-0.916,0.528-1.48,1.505-1.48,2.563v41.684   c0,1.058,0.564,2.035,1.48,2.563c0.458,0.268,0.969,0.397,1.48,0.397c0.511,0,1.022-0.133,1.48-0.397l36.098-20.84   c0.918-0.529,1.479-1.506,1.479-2.564S44.247,21.767,43.331,21.237z'
        },
        'audio-pause': {
          size: 'medium',
          path: 'M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z',
          path2: 'M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z'
        }
      }
    };
  },
  computed: {
    svgId: function svgId() {
      var param = this.param ? '-' + this.param : '';
      return "vac-icon-".concat(this.name).concat(param);
    },
    size: function size() {
      var item = this.svgItem[this.name];
      if (item.size === 'large') return 512;else if (item.size === 'medium') return 48;else return 24;
    }
  }
});
// CONCATENATED MODULE: ./src/components/SvgIcon.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_SvgIconvue_type_script_lang_js_ = (SvgIconvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/SvgIcon.vue?vue&type=style&index=0&lang=scss&
var SvgIconvue_type_style_index_0_lang_scss_ = __webpack_require__("35f2");

// CONCATENATED MODULE: ./src/components/SvgIcon.vue






/* normalize component */

var SvgIcon_component = normalizeComponent(
  components_SvgIconvue_type_script_lang_js_,
  SvgIconvue_type_template_id_34aa1382_render,
  SvgIconvue_type_template_id_34aa1382_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var SvgIcon = (SvgIcon_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var RoomsSearchvue_type_script_lang_js_ = ({
  name: 'RoomsSearch',
  components: {
    SvgIcon: SvgIcon
  },
  props: {
    textMessages: {
      type: Object,
      required: true
    },
    showAddRoom: {
      type: Boolean,
      required: true
    },
    rooms: {
      type: Array,
      required: true
    },
    loadingRooms: {
      type: Boolean,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=script&lang=js&
 /* harmony default export */ var RoomsList_RoomsSearchvue_type_script_lang_js_ = (RoomsSearchvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=style&index=0&lang=scss&
var RoomsSearchvue_type_style_index_0_lang_scss_ = __webpack_require__("798f");

// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsSearch.vue






/* normalize component */

var RoomsSearch_component = normalizeComponent(
  RoomsList_RoomsSearchvue_type_script_lang_js_,
  RoomsSearchvue_type_template_id_079ff11e_render,
  RoomsSearchvue_type_template_id_079ff11e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomsSearch = (RoomsSearch_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=template&id=2d7743ae&
var RoomContentvue_type_template_id_2d7743ae_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-room-container"},[_vm._t("room-list-item",[(_vm.room.avatar)?_c('div',{staticClass:"vac-avatar",style:({ 'background-image': ("url('" + (_vm.room.avatar) + "')") })}):_vm._e(),_c('div',{staticClass:"vac-name-container vac-text-ellipsis"},[_c('div',{staticClass:"vac-title-container"},[(_vm.userStatus)?_c('div',{staticClass:"vac-state-circle",class:{ 'vac-state-online': _vm.userStatus === 'online' }}):_vm._e(),_c('div',{staticClass:"vac-room-name vac-text-ellipsis"},[_vm._v(" "+_vm._s(_vm.room.roomName)+" ")]),(_vm.room.lastMessage)?_c('div',{staticClass:"vac-text-date"},[_vm._v(" "+_vm._s(_vm.room.lastMessage.timestamp)+" ")]):_vm._e()]),_c('div',{staticClass:"vac-text-last",class:{
					'vac-message-new':
						_vm.room.lastMessage && _vm.room.lastMessage.new && !_vm.typingUsers
				}},[(_vm.isMessageCheckmarkVisible)?_c('span',[_vm._t("checkmark-icon",[_c('svg-icon',{staticClass:"vac-icon-check",attrs:{"name":_vm.room.lastMessage.distributed
									? 'double-checkmark'
									: 'checkmark',"param":_vm.room.lastMessage.seen ? 'seen' : ''}})],null,_vm.room.lastMessage)],2):_vm._e(),(_vm.room.lastMessage && !_vm.room.lastMessage.deleted && _vm.isAudio)?_c('div',{staticClass:"vac-text-ellipsis"},[_vm._t("microphone-icon",[_c('svg-icon',{staticClass:"vac-icon-microphone",attrs:{"name":"microphone"}})]),_vm._v(" "+_vm._s(_vm.formattedDuration)+" ")],2):(_vm.room.lastMessage)?_c('format-message',{attrs:{"content":_vm.getLastMessage,"deleted":!!_vm.room.lastMessage.deleted && !_vm.typingUsers,"users":_vm.room.users,"linkify":false,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"single-line":true},scopedSlots:_vm._u([{key:"deleted-icon",fn:function(data){return [_vm._t("deleted-icon",null,null,data)]}}],null,true)}):_vm._e(),(!_vm.room.lastMessage && _vm.typingUsers)?_c('div',{staticClass:"vac-text-ellipsis"},[_vm._v(" "+_vm._s(_vm.typingUsers)+" ")]):_vm._e(),_c('div',{staticClass:"vac-room-options-container"},[(_vm.room.unreadCount)?_c('div',{staticClass:"vac-badge-counter vac-room-badge"},[_vm._v(" "+_vm._s(_vm.room.unreadCount)+" ")]):_vm._e(),_vm._t("room-list-options",[(_vm.roomActions.length)?_c('div',{staticClass:"vac-svg-button vac-list-room-options",on:{"click":function($event){$event.stopPropagation();_vm.roomMenuOpened = _vm.room.roomId}}},[_vm._t("room-list-options-icon",[_c('svg-icon',{attrs:{"name":"dropdown","param":"room"}})])],2):_vm._e(),(_vm.roomActions.length)?_c('transition',{attrs:{"name":"vac-slide-left"}},[(_vm.roomMenuOpened === _vm.room.roomId)?_c('div',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.closeRoomMenu),expression:"closeRoomMenu"}],staticClass:"vac-menu-options"},[_c('div',{staticClass:"vac-menu-list"},_vm._l((_vm.roomActions),function(action){return _c('div',{key:action.name},[_c('div',{staticClass:"vac-menu-item",on:{"click":function($event){$event.stopPropagation();return _vm.roomActionHandler(action)}}},[_vm._v(" "+_vm._s(action.title)+" ")])])}),0)]):_vm._e()]):_vm._e()],null,{ room: _vm.room })],2)],1)])],null,{ room: _vm.room })],2)}
var RoomContentvue_type_template_id_2d7743ae_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=template&id=2d7743ae&

// EXTERNAL MODULE: ./node_modules/v-click-outside/dist/v-click-outside.umd.js
var v_click_outside_umd = __webpack_require__("c28b");
var v_click_outside_umd_default = /*#__PURE__*/__webpack_require__.n(v_click_outside_umd);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FormatMessage.vue?vue&type=template&id=0ef5045f&
var FormatMessagevue_type_template_id_0ef5045f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-format-message-wrapper",class:{ 'vac-text-ellipsis': _vm.singleLine }},[(_vm.textFormatting)?_c('div',{class:{ 'vac-text-ellipsis': _vm.singleLine }},[_vm._l((_vm.linkifiedMessage),function(message,i){return [_c(message.url ? 'a' : 'span',{key:i,tag:"component",class:{
					'vac-text-ellipsis': _vm.singleLine,
					'vac-text-bold': message.bold,
					'vac-text-italic': _vm.deleted || message.italic,
					'vac-text-strike': message.strike,
					'vac-text-underline': message.underline,
					'vac-text-inline-code': !_vm.singleLine && message.inline,
					'vac-text-multiline-code': !_vm.singleLine && message.multiline,
					'vac-text-tag': !_vm.singleLine && !_vm.reply && message.tag
				},attrs:{"href":message.href,"target":message.href ? _vm.linkOptions.target : null},on:{"click":function($event){return _vm.openTag(message)}}},[_vm._t("deleted-icon",[(_vm.deleted)?_c('svg-icon',{staticClass:"vac-icon-deleted",attrs:{"name":"deleted"}}):_vm._e()],null,{ deleted: _vm.deleted }),(message.url && message.image)?[_c('div',{staticClass:"vac-image-link-container"},[_c('div',{staticClass:"vac-image-link",style:({
								'background-image': ("url('" + (message.value) + "')"),
								height: message.height
							})})]),_c('div',{staticClass:"vac-image-link-message"},[_c('span',[_vm._v(_vm._s(message.value))])])]:[_c('span',[_vm._v(_vm._s(message.value))])]],2)]})],2):_c('div',[_vm._v(" "+_vm._s(_vm.formattedContent)+" ")])])}
var FormatMessagevue_type_template_id_0ef5045f_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FormatMessage.vue?vue&type=template&id=0ef5045f&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.bold.js
var es6_string_bold = __webpack_require__("48c0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.strike.js
var es6_string_strike = __webpack_require__("1448");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.index-of.js
var es6_array_index_of = __webpack_require__("57e7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.last-index-of.js
var es6_array_last_index_of = __webpack_require__("9865");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.some.js
var es6_array_some = __webpack_require__("759f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("2fdb");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.match.js
var es6_regexp_match = __webpack_require__("4917");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.constructor.js
var es6_regexp_constructor = __webpack_require__("3b2b");

// CONCATENATED MODULE: ./src/utils/format-string.js


var _pseudoMarkdown;









var linkify = __webpack_require__("74fe"); // require('linkifyjs/plugins/hashtag')(linkify)


/* harmony default export */ var format_string = (function (text, doLinkify) {
  var json = compileToJSON(text);
  var html = compileToHTML(json);
  var result = [].concat.apply([], html);
  if (doLinkify) linkifyResult(result);
  return result;
});
var typeMarkdown = {
  bold: '*',
  italic: '_',
  strike: '~',
  underline: '°'
};
var pseudoMarkdown = (_pseudoMarkdown = {}, _defineProperty(_pseudoMarkdown, typeMarkdown.bold, {
  end: '\\' + [typeMarkdown.bold],
  allowed_chars: '.',
  type: 'bold'
}), _defineProperty(_pseudoMarkdown, typeMarkdown.italic, {
  end: [typeMarkdown.italic],
  allowed_chars: '.',
  type: 'italic'
}), _defineProperty(_pseudoMarkdown, typeMarkdown.strike, {
  end: [typeMarkdown.strike],
  allowed_chars: '.',
  type: 'strike'
}), _defineProperty(_pseudoMarkdown, typeMarkdown.underline, {
  end: [typeMarkdown.underline],
  allowed_chars: '.',
  type: 'underline'
}), _defineProperty(_pseudoMarkdown, '```', {
  end: '```',
  allowed_chars: '(.|\n)',
  type: 'multiline-code'
}), _defineProperty(_pseudoMarkdown, '`', {
  end: '`',
  allowed_chars: '.',
  type: 'inline-code'
}), _defineProperty(_pseudoMarkdown, '<usertag>', {
  allowed_chars: '.',
  end: '</usertag>',
  type: 'tag'
}), _pseudoMarkdown);

function compileToJSON(str) {
  var result = [];
  var minIndexOf = -1;
  var minIndexOfKey = null;
  var links = linkify.find(str);
  var minIndexFromLink = false;

  if (links.length > 0) {
    minIndexOf = str.indexOf(links[0].value);
    minIndexFromLink = true;
  }

  Object.keys(pseudoMarkdown).forEach(function (startingValue) {
    var io = str.indexOf(startingValue);

    if (io >= 0 && (minIndexOf < 0 || io < minIndexOf)) {
      minIndexOf = io;
      minIndexOfKey = startingValue;
      minIndexFromLink = false;
    }
  });

  if (minIndexFromLink && minIndexOfKey !== -1) {
    var strLeft = str.substr(0, minIndexOf);
    var strLink = str.substr(minIndexOf, links[0].value.length);
    var strRight = str.substr(minIndexOf + links[0].value.length);
    result.push(strLeft);
    result.push(strLink);
    result = result.concat(compileToJSON(strRight));
    return result;
  }

  if (minIndexOfKey) {
    var _strLeft = str.substr(0, minIndexOf);

    var _char = minIndexOfKey;

    var _strRight = str.substr(minIndexOf + _char.length);

    if (str.replace(/\s/g, '').length === _char.length * 2) {
      return [str];
    }

    var match = _strRight.match(new RegExp('^(' + (pseudoMarkdown[_char].allowed_chars || '.') + '*' + (pseudoMarkdown[_char].end ? '?' : '') + ')' + (pseudoMarkdown[_char].end ? '(' + pseudoMarkdown[_char].end + ')' : ''), 'm'));

    if (!match || !match[1]) {
      _strLeft = _strLeft + _char;
      result.push(_strLeft);
    } else {
      if (_strLeft) {
        result.push(_strLeft);
      }

      var object = {
        start: _char,
        content: compileToJSON(match[1]),
        end: match[2],
        type: pseudoMarkdown[_char].type
      };
      result.push(object);
      _strRight = _strRight.substr(match[0].length);
    }

    result = result.concat(compileToJSON(_strRight));
    return result;
  } else {
    if (str) {
      return [str];
    } else {
      return [];
    }
  }
}

function compileToHTML(json) {
  var result = [];
  json.forEach(function (item) {
    if (typeof item === 'string') {
      result.push({
        types: [],
        value: item
      });
    } else {
      if (pseudoMarkdown[item.start]) {
        result.push(parseContent(item));
      }
    }
  });
  return result;
}

function parseContent(item) {
  var result = [];
  item.content.forEach(function (it) {
    if (typeof it === 'string') {
      result.push({
        types: [item.type],
        value: it
      });
    } else {
      it.content.forEach(function (i) {
        if (typeof i === 'string') {
          result.push({
            types: [it.type].concat([item.type]),
            value: i
          });
        } else {
          result.push({
            types: [i.type].concat([it.type]).concat([item.type]),
            value: parseContent(i)
          });
        }
      });
    }
  });
  return result;
}

function linkifyResult(array) {
  var result = [];
  array.forEach(function (arr) {
    var links = linkify.find(arr.value);

    if (links.length) {
      var spaces = arr.value.replace(links[0].value, '');
      result.push({
        types: arr.types,
        value: spaces
      });
      arr.types = ['url'].concat(arr.types);
      arr.href = links[0].href;
      arr.value = links[0].value;
    }

    result.push(arr);
  });
  return result;
}
// EXTERNAL MODULE: ./src/utils/constants.js
var constants = __webpack_require__("c9d9");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FormatMessage.vue?vue&type=script&lang=js&











//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var FormatMessagevue_type_script_lang_js_ = ({
  name: 'FormatMessage',
  components: {
    SvgIcon: SvgIcon
  },
  props: {
    content: {
      type: [String, Number],
      required: true
    },
    deleted: {
      type: Boolean,
      "default": false
    },
    users: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    linkify: {
      type: Boolean,
      "default": true
    },
    singleLine: {
      type: Boolean,
      "default": false
    },
    reply: {
      type: Boolean,
      "default": false
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    }
  },
  computed: {
    linkifiedMessage: function linkifiedMessage() {
      var _this = this;

      var message = format_string(this.formatTags(this.content), this.linkify && !this.linkOptions.disabled, this.linkOptions);
      message.forEach(function (m) {
        m.url = _this.checkType(m, 'url');
        m.bold = _this.checkType(m, 'bold');
        m.italic = _this.checkType(m, 'italic');
        m.strike = _this.checkType(m, 'strike');
        m.underline = _this.checkType(m, 'underline');
        m.inline = _this.checkType(m, 'inline-code');
        m.multiline = _this.checkType(m, 'multiline-code');
        m.tag = _this.checkType(m, 'tag');
        m.image = _this.checkImageType(m);
      });
      return message;
    },
    formattedContent: function formattedContent() {
      return this.formatTags(this.content);
    }
  },
  methods: {
    checkType: function checkType(message, type) {
      return message.types.indexOf(type) !== -1;
    },
    checkImageType: function checkImageType(message) {
      var index = message.value.lastIndexOf('.');
      var slashIndex = message.value.lastIndexOf('/');
      if (slashIndex > index) index = -1;
      var type = message.value.substring(index + 1, message.value.length);
      var isMedia = index > 0 && constants["b" /* IMAGE_TYPES */].some(function (t) {
        return type.toLowerCase().includes(t);
      });
      if (isMedia) this.setImageSize(message);
      return isMedia;
    },
    setImageSize: function setImageSize(message) {
      var image = new Image();
      image.src = message.value;
      image.addEventListener('load', onLoad);

      function onLoad(img) {
        var ratio = img.path[0].width / 150;
        message.height = Math.round(img.path[0].height / ratio) + 'px';
        image.removeEventListener('load', onLoad);
      }
    },
    formatTags: function formatTags(content) {
      this.users.forEach(function (user) {
        var index = content.indexOf(user._id);
        var isTag = content.substring(index - 9, index) === '<usertag>';
        if (isTag) content = content.replace(user._id, "@".concat(user.username));
      });
      return content;
    },
    openTag: function openTag(message) {
      if (!this.singleLine && this.checkType(message, 'tag')) {
        var user = this.users.find(function (u) {
          return message.value.indexOf(u.username) !== -1;
        });
        this.$emit('open-user-tag', user);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/FormatMessage.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FormatMessagevue_type_script_lang_js_ = (FormatMessagevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FormatMessage.vue?vue&type=style&index=0&lang=scss&
var FormatMessagevue_type_style_index_0_lang_scss_ = __webpack_require__("c3ec");

// CONCATENATED MODULE: ./src/components/FormatMessage.vue






/* normalize component */

var FormatMessage_component = normalizeComponent(
  components_FormatMessagevue_type_script_lang_js_,
  FormatMessagevue_type_template_id_0ef5045f_render,
  FormatMessagevue_type_template_id_0ef5045f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var FormatMessage = (FormatMessage_component.exports);
// CONCATENATED MODULE: ./src/utils/typing-text.js



/* harmony default export */ var typing_text = (function (room, currentUserId, textMessages) {
  if (room.typingUsers && room.typingUsers.length) {
    var typingUsers = room.users.filter(function (user) {
      if (user._id === currentUserId) return;
      if (room.typingUsers.indexOf(user._id) === -1) return;
      if (user.status && user.status.state === 'offline') return;
      return true;
    });
    if (!typingUsers.length) return;

    if (room.users.length === 2) {
      return textMessages.IS_TYPING;
    } else {
      return typingUsers.map(function (user) {
        return user.username;
      }).join(', ') + ' ' + textMessages.IS_TYPING;
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var _require = __webpack_require__("bd43"),
    isAudioFile = _require.isAudioFile;

/* harmony default export */ var RoomContentvue_type_script_lang_js_ = ({
  name: 'RoomsContent',
  components: {
    SvgIcon: SvgIcon,
    FormatMessage: FormatMessage
  },
  directives: {
    clickOutside: v_click_outside_umd_default.a.directive
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    room: {
      type: Object,
      required: true
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    },
    textMessages: {
      type: Object,
      required: true
    },
    roomActions: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      roomMenuOpened: null
    };
  },
  computed: {
    getLastMessage: function getLastMessage() {
      var _this = this;

      var isTyping = this.typingUsers;
      if (isTyping) return isTyping;
      var content = this.room.lastMessage.deleted ? this.textMessages.MESSAGE_DELETED : this.room.lastMessage.content;

      if (this.room.users.length <= 2) {
        return content;
      }

      var user = this.room.users.find(function (user) {
        return user._id === _this.room.lastMessage.senderId;
      });

      if (this.room.lastMessage.username) {
        return "".concat(this.room.lastMessage.username, " - ").concat(content);
      } else if (!user || user._id === this.currentUserId) {
        return content;
      }

      return "".concat(user.username, " - ").concat(content);
    },
    userStatus: function userStatus() {
      var _this2 = this;

      if (!this.room.users || this.room.users.length !== 2) return;
      var user = this.room.users.find(function (u) {
        return u._id !== _this2.currentUserId;
      });
      if (user && user.status) return user.status.state;
      return null;
    },
    typingUsers: function typingUsers() {
      return typing_text(this.room, this.currentUserId, this.textMessages);
    },
    isMessageCheckmarkVisible: function isMessageCheckmarkVisible() {
      return !this.typingUsers && this.room.lastMessage && !this.room.lastMessage.deleted && this.room.lastMessage.senderId === this.currentUserId && (this.room.lastMessage.saved || this.room.lastMessage.distributed || this.room.lastMessage.seen);
    },
    formattedDuration: function formattedDuration() {
      var file = this.room.lastMessage.file;

      if (!file.duration) {
        return "".concat(file.name, ".").concat(file.extension);
      }

      var s = Math.floor(file.duration);
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s;
    },
    isAudio: function isAudio() {
      return isAudioFile(this.room.lastMessage.file);
    }
  },
  methods: {
    roomActionHandler: function roomActionHandler(action) {
      this.closeRoomMenu();
      this.$emit('room-action-handler', {
        action: action,
        roomId: this.room.roomId
      });
    },
    closeRoomMenu: function closeRoomMenu() {
      this.roomMenuOpened = null;
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=script&lang=js&
 /* harmony default export */ var RoomsList_RoomContentvue_type_script_lang_js_ = (RoomContentvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=style&index=0&lang=scss&
var RoomContentvue_type_style_index_0_lang_scss_ = __webpack_require__("3687");

// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomContent.vue






/* normalize component */

var RoomContent_component = normalizeComponent(
  RoomsList_RoomContentvue_type_script_lang_js_,
  RoomContentvue_type_template_id_2d7743ae_render,
  RoomContentvue_type_template_id_2d7743ae_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomContent = (RoomContent_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.starts-with.js
var es6_string_starts_with = __webpack_require__("f559");

// CONCATENATED MODULE: ./src/utils/filter-items.js





/* harmony default export */ var filter_items = (function (items, prop, val) {
  var startsWith = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!val || val === '') return items;
  return items.filter(function (v) {
    if (startsWith) return formatString(v[prop]).startsWith(formatString(val));
    return formatString(v[prop]).includes(formatString(val));
  });
});

function formatString(string) {
  return string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var RoomsListvue_type_script_lang_js_ = ({
  name: 'RoomsList',
  components: {
    InfiniteLoading: vue_infinite_loading_default.a,
    Loader: Loader,
    RoomsSearch: RoomsSearch,
    RoomContent: RoomContent
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    textMessages: {
      type: Object,
      required: true
    },
    showRoomsList: {
      type: Boolean,
      required: true
    },
    showAddRoom: {
      type: Boolean,
      required: true
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    rooms: {
      type: Array,
      required: true
    },
    loadingRooms: {
      type: Boolean,
      required: true
    },
    roomsLoaded: {
      type: Boolean,
      required: true
    },
    room: {
      type: Object,
      required: true
    },
    roomActions: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      filteredRooms: this.rooms || [],
      infiniteState: null,
      loadingMoreRooms: false,
      selectedRoomId: ''
    };
  },
  watch: {
    rooms: function rooms(newVal, oldVal) {
      this.filteredRooms = newVal;

      if (this.infiniteState && (newVal.length !== oldVal.length || this.roomsLoaded)) {
        this.infiniteState.loaded();
        this.loadingMoreRooms = false;
      }
    },
    loadingRooms: function loadingRooms(val) {
      if (val) this.infiniteState = null;
    },
    loadingMoreRooms: function loadingMoreRooms(val) {
      this.$emit('loading-more-rooms', val);
    },
    roomsLoaded: function roomsLoaded(val) {
      if (val && this.infiniteState) {
        this.loadingMoreRooms = false;
        this.infiniteState.complete();
      }
    },
    room: {
      immediate: true,
      handler: function handler(val) {
        if (val && !this.isMobile) this.selectedRoomId = val.roomId;
      }
    }
  },
  methods: {
    searchRoom: function searchRoom(ev) {
      this.filteredRooms = filter_items(this.rooms, 'roomName', ev.target.value);
    },
    openRoom: function openRoom(room) {
      if (room.roomId === this.room.roomId && !this.isMobile) return;
      if (!this.isMobile) this.selectedRoomId = room.roomId;
      this.$emit('fetch-room', {
        room: room
      });
    },
    loadMoreRooms: function loadMoreRooms(infiniteState) {
      if (this.loadingMoreRooms) return;

      if (this.roomsLoaded) {
        this.loadingMoreRooms = false;
        return infiniteState.complete();
      }

      this.infiniteState = infiniteState;
      this.$emit('fetch-more-rooms');
      this.loadingMoreRooms = true;
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=script&lang=js&
 /* harmony default export */ var RoomsList_RoomsListvue_type_script_lang_js_ = (RoomsListvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=style&index=0&lang=scss&
var RoomsListvue_type_style_index_0_lang_scss_ = __webpack_require__("7d66");

// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsList.vue






/* normalize component */

var RoomsList_component = normalizeComponent(
  RoomsList_RoomsListvue_type_script_lang_js_,
  RoomsListvue_type_template_id_3c4495e5_render,
  RoomsListvue_type_template_id_3c4495e5_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomsList = (RoomsList_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/Room.vue?vue&type=template&id=1a1a6e46&
var Roomvue_type_template_id_1a1a6e46_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:((_vm.isMobile && !_vm.showRoomsList) || !_vm.isMobile || _vm.singleRoom),expression:"(isMobile && !showRoomsList) || !isMobile || singleRoom"}],staticClass:"vac-col-messages"},[(_vm.showNoRoom)?_vm._t("no-room-selected",[_c('div',{staticClass:"vac-container-center vac-room-empty"},[_c('div',[_vm._v(_vm._s(_vm.textMessages.ROOM_EMPTY))])])]):_c('room-header',{attrs:{"current-user-id":_vm.currentUserId,"text-messages":_vm.textMessages,"single-room":_vm.singleRoom,"show-rooms-list":_vm.showRoomsList,"is-mobile":_vm.isMobile,"room-info":_vm.roomInfo,"menu-actions":_vm.menuActions,"room":_vm.room},on:{"toggle-rooms-list":function($event){return _vm.$emit('toggle-rooms-list')},"room-info":function($event){return _vm.$emit('room-info')},"menu-action-handler":function($event){return _vm.$emit('menu-action-handler', $event)}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}),_c('div',{ref:"scrollContainer",staticClass:"vac-container-scroll",on:{"scroll":_vm.onContainerScroll}},[_c('loader',{attrs:{"show":_vm.loadingMessages}}),_c('div',{staticClass:"vac-messages-container"},[_c('div',{class:{ 'vac-messages-hidden': _vm.loadingMessages }},[_c('transition',{attrs:{"name":"vac-fade-message"}},[(_vm.showNoMessages)?_c('div',{staticClass:"vac-text-started"},[_vm._t("messages-empty",[_vm._v(" "+_vm._s(_vm.textMessages.MESSAGES_EMPTY)+" ")])],2):_vm._e(),(_vm.showMessagesStarted)?_c('div',{staticClass:"vac-text-started"},[_vm._v(" "+_vm._s(_vm.textMessages.CONVERSATION_STARTED)+" "+_vm._s(_vm.messages[0].date)+" ")]):_vm._e()]),_c('transition',{attrs:{"name":"vac-fade-message"}},[(_vm.messages.length)?_c('infinite-loading',{class:{ 'vac-infinite-loading': !_vm.messagesLoaded },attrs:{"force-use-infinite-wrapper":".vac-container-scroll","web-component-name":"vue-advanced-chat","spinner":"spiral","direction":"top","distance":40},on:{"infinite":_vm.loadMoreMessages}},[_c('div',{attrs:{"slot":"spinner"},slot:"spinner"},[_c('loader',{attrs:{"show":true,"infinite":true}})],1),_c('div',{attrs:{"slot":"no-results"},slot:"no-results"}),_c('div',{attrs:{"slot":"no-more"},slot:"no-more"})]):_vm._e()],1),_c('transition-group',{key:_vm.roomId,attrs:{"name":"vac-fade-message"}},_vm._l((_vm.messages),function(m,i){return _c('div',{key:m._id},[_c('message',{attrs:{"current-user-id":_vm.currentUserId,"message":m,"index":i,"messages":_vm.messages,"edited-message":_vm.editedMessage,"message-actions":_vm.messageActions,"room-users":_vm.room.users,"text-messages":_vm.textMessages,"room-footer-ref":_vm.$refs.roomFooter,"new-messages":_vm.newMessages,"show-reaction-emojis":_vm.showReactionEmojis,"show-new-messages-divider":_vm.showNewMessagesDivider,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"emojis-list":_vm.emojisList,"hide-options":_vm.hideOptions},on:{"message-added":_vm.onMessageAdded,"message-action-handler":_vm.messageActionHandler,"open-file":_vm.openFile,"open-user-tag":_vm.openUserTag,"send-message-reaction":_vm.sendMessageReaction,"hide-options":function($event){_vm.hideOptions = $event}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(idx,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1)}),0)],1)])],1),(!_vm.loadingMessages)?_c('div',[_c('transition',{attrs:{"name":"vac-bounce"}},[(_vm.scrollIcon)?_c('div',{staticClass:"vac-icon-scroll",on:{"click":_vm.scrollToBottom}},[_c('transition',{attrs:{"name":"vac-bounce"}},[(_vm.scrollMessagesCount)?_c('div',{staticClass:"vac-badge-counter vac-messages-count"},[_vm._v(" "+_vm._s(_vm.scrollMessagesCount)+" ")]):_vm._e()]),_vm._t("scroll-icon",[_c('svg-icon',{attrs:{"name":"dropdown","param":"scroll"}})])],2):_vm._e()])],1):_vm._e(),_c('div',{directives:[{name:"show",rawName:"v-show",value:(Object.keys(_vm.room).length && _vm.showFooter),expression:"Object.keys(room).length && showFooter"}],ref:"roomFooter",staticClass:"vac-room-footer"},[_c('room-message-reply',{attrs:{"room":_vm.room,"message-reply":_vm.messageReply,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions},on:{"reset-message":_vm.resetMessage},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}),_c('room-emojis',{attrs:{"filtered-emojis":_vm.filteredEmojis},on:{"select-emoji":function($event){return _vm.selectEmoji($event)}}}),_c('room-users-tag',{attrs:{"filtered-users-tag":_vm.filteredUsersTag},on:{"select-user-tag":function($event){return _vm.selectUserTag($event)}}}),_c('div',{staticClass:"vac-box-footer",class:{
				'vac-app-box-shadow': _vm.filteredEmojis.length || _vm.filteredUsersTag.length
			}},[(_vm.showAudio && !_vm.imageFile && !_vm.videoFile)?_c('div',{staticClass:"vac-icon-textarea-left"},[(_vm.isRecording)?[_c('div',{staticClass:"vac-svg-button vac-icon-audio-stop",on:{"click":_vm.stopRecorder}},[_vm._t("audio-stop-icon",[_c('svg-icon',{attrs:{"name":"close-outline"}})])],2),_c('div',{staticClass:"vac-dot-audio-record"}),_c('div',{staticClass:"vac-dot-audio-record-time"},[_vm._v(" "+_vm._s(_vm.recordedTime)+" ")]),_c('div',{staticClass:"vac-svg-button vac-icon-audio-confirm",on:{"click":function($event){return _vm.toggleRecorder(false)}}},[_vm._t("audio-stop-icon",[_c('svg-icon',{attrs:{"name":"checkmark"}})])],2)]:_c('div',{staticClass:"vac-svg-button",on:{"click":function($event){return _vm.toggleRecorder(true)}}},[_vm._t("microphone-icon",[_c('svg-icon',{staticClass:"vac-icon-microphone",attrs:{"name":"microphone"}})])],2)],2):_vm._e(),(_vm.imageFile)?_c('div',{staticClass:"vac-media-container"},[_c('div',{staticClass:"vac-svg-button vac-icon-media",on:{"click":_vm.resetMediaFile}},[_vm._t("image-close-icon",[_c('svg-icon',{attrs:{"name":"close","param":"image"}})])],2),_c('div',{staticClass:"vac-media-file"},[_c('img',{ref:"mediaFile",attrs:{"src":_vm.imageFile},on:{"load":_vm.onMediaLoad}})])]):(_vm.videoFile)?_c('div',{staticClass:"vac-media-container"},[_c('div',{staticClass:"vac-svg-button vac-icon-media",on:{"click":_vm.resetMediaFile}},[_vm._t("image-close-icon",[_c('svg-icon',{attrs:{"name":"close","param":"image"}})])],2),_c('div',{ref:"mediaFile",staticClass:"vac-media-file"},[_c('video',{attrs:{"width":"100%","height":"100%","controls":""}},[_c('source',{attrs:{"src":_vm.videoFile}})])])]):(_vm.file)?_c('div',{staticClass:"vac-file-container",class:{ 'vac-file-container-edit': _vm.editedMessage._id }},[_c('div',{staticClass:"vac-icon-file"},[_vm._t("file-icon",[_c('svg-icon',{attrs:{"name":"file"}})])],2),_c('div',{staticClass:"vac-file-message"},[_vm._v(" "+_vm._s(_vm.file.audio ? _vm.file.name : _vm.message)+" ")]),_c('div',{staticClass:"vac-svg-button vac-icon-remove",on:{"click":function($event){return _vm.resetMessage(null, true)}}},[_vm._t("file-close-icon",[_c('svg-icon',{attrs:{"name":"close"}})])],2)]):_vm._e(),_c('textarea',{directives:[{name:"show",rawName:"v-show",value:(!_vm.file || _vm.imageFile || _vm.videoFile),expression:"!file || imageFile || videoFile"},{name:"model",rawName:"v-model",value:(_vm.message),expression:"message"}],ref:"roomTextarea",staticClass:"vac-textarea",class:{
					'vac-textarea-outline': _vm.editedMessage._id
				},style:({
					'min-height': ((_vm.mediaDimensions ? _vm.mediaDimensions.height : 20) + "px"),
					'padding-left': ((_vm.mediaDimensions ? _vm.mediaDimensions.width - 10 : 12) + "px")
				}),attrs:{"placeholder":_vm.textMessages.TYPE_MESSAGE},domProps:{"value":(_vm.message)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.message=$event.target.value},_vm.onChangeInput],"keydown":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.escapeTextarea($event)},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }if($event.ctrlKey||$event.shiftKey||$event.altKey||$event.metaKey){ return null; }$event.preventDefault();}]}}),_c('div',{staticClass:"vac-icon-textarea"},[(_vm.editedMessage._id)?_c('div',{staticClass:"vac-svg-button",on:{"click":_vm.resetMessage}},[_vm._t("edit-close-icon",[_c('svg-icon',{attrs:{"name":"close-outline"}})])],2):_vm._e(),(_vm.showEmojis && (!_vm.file || _vm.imageFile || _vm.videoFile))?_c('emoji-picker',{attrs:{"emoji-opened":_vm.emojiOpened,"position-top":true},on:{"add-emoji":_vm.addEmoji,"open-emoji":function($event){_vm.emojiOpened = $event}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):_vm._e(),(_vm.showFiles)?_c('div',{staticClass:"vac-svg-button",on:{"click":_vm.launchFilePicker}},[_vm._t("paperclip-icon",[_c('svg-icon',{attrs:{"name":"paperclip"}})])],2):_vm._e(),(_vm.textareaAction)?_c('div',{staticClass:"vac-svg-button",on:{"click":_vm.textareaActionHandler}},[_vm._t("custom-action-icon",[_c('svg-icon',{attrs:{"name":"deleted"}})])],2):_vm._e(),(_vm.showFiles)?_c('input',{ref:"file",staticStyle:{"display":"none"},attrs:{"type":"file","accept":_vm.acceptedFiles},on:{"change":function($event){return _vm.onFileChange($event.target.files)}}}):_vm._e(),(_vm.showSendIcon)?_c('div',{staticClass:"vac-svg-button",class:{ 'vac-send-disabled': _vm.isMessageEmpty },on:{"click":_vm.sendMessage}},[_vm._t("send-icon",[_c('svg-icon',{attrs:{"name":"send","param":_vm.isMessageEmpty ? 'disabled' : ''}})])],2):_vm._e()],1)])],1)],2)}
var Roomvue_type_template_id_1a1a6e46_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Room/Room.vue?vue&type=template&id=1a1a6e46&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.to-string.js
var es6_object_to_string = __webpack_require__("06db");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.is-array.js
var es6_array_is_array = __webpack_require__("2caf");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js


function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.iterator.js
var es6_string_iterator = __webpack_require__("5df3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.from.js
var es6_array_from = __webpack_require__("1c4c");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js






function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js









function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__("96cf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.trim.js
var es6_string_trim = __webpack_require__("4f37");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.date.to-iso-string.js
var es6_date_to_iso_string = __webpack_require__("8ea5");

// CONCATENATED MODULE: ./node_modules/vue-emoji-picker/src/emojis.js
/* harmony default export */ var emojis = ({
    'Frequently used': {
        'thumbs_up': '👍',
        '-1': '👎',
        'sob': '😭',
        'confused': '😕',
        'neutral_face': '😐',
        'blush': '😊',
        'heart_eyes': '😍',
    },
    'People': {
        'smile': '😄',
        'smiley': '😃',
        'grinning': '😀',
        'blush': '😊',
        'wink': '😉',
        'heart_eyes': '😍',
        'kissing_heart': '😘',
        'kissing_closed_eyes': '😚',
        'kissing': '😗',
        'kissing_smiling_eyes': '😙',
        'stuck_out_tongue_winking_eye': '😜',
        'stuck_out_tongue_closed_eyes': '😝',
        'stuck_out_tongue': '😛',
        'flushed': '😳',
        'grin': '😁',
        'pensive': '😔',
        'relieved': '😌',
        'unamused': '😒',
        'disappointed': '😞',
        'persevere': '😣',
        'cry': '😢',
        'joy': '😂',
        'sob': '😭',
        'sleepy': '😪',
        'disappointed_relieved': '😥',
        'cold_sweat': '😰',
        'sweat_smile': '😅',
        'sweat': '😓',
        'weary': '😩',
        'tired_face': '😫',
        'fearful': '😨',
        'scream': '😱',
        'angry': '😠',
        'rage': '😡',
        'triumph': '😤',
        'confounded': '😖',
        'laughing': '😆',
        'yum': '😋',
        'mask': '😷',
        'sunglasses': '😎',
        'sleeping': '😴',
        'dizzy_face': '😵',
        'astonished': '😲',
        'worried': '😟',
        'frowning': '😦',
        'anguished': '😧',
        'imp': '👿',
        'open_mouth': '😮',
        'grimacing': '😬',
        'neutral_face': '😐',
        'confused': '😕',
        'hushed': '😯',
        'smirk': '😏',
        'expressionless': '😑',
        'man_with_gua_pi_mao': '👲',
        'man_with_turban': '👳',
        'cop': '👮',
        'construction_worker': '👷',
        'guardsman': '💂',
        'baby': '👶',
        'boy': '👦',
        'girl': '👧',
        'man': '👨',
        'woman': '👩',
        'older_man': '👴',
        'older_woman': '👵',
        'person_with_blond_hair': '👱',
        'angel': '👼',
        'princess': '👸',
        'smiley_cat': '😺',
        'smile_cat': '😸',
        'heart_eyes_cat': '😻',
        'kissing_cat': '😽',
        'smirk_cat': '😼',
        'scream_cat': '🙀',
        'crying_cat_face': '😿',
        'joy_cat': '😹',
        'pouting_cat': '😾',
        'japanese_ogre': '👹',
        'japanese_goblin': '👺',
        'see_no_evil': '🙈',
        'hear_no_evil': '🙉',
        'speak_no_evil': '🙊',
        'skull': '💀',
        'alien': '👽',
        'hankey': '💩',
        'fire': '🔥',
        'sparkles': '✨',
        'star2': '🌟',
        'dizzy': '💫',
        'boom': '💥',
        'anger': '💢',
        'sweat_drops': '💦',
        'droplet': '💧',
        'zzz': '💤',
        'dash': '💨',
        'ear': '👂',
        'eyes': '👀',
        'nose': '👃',
        'tongue': '👅',
        'lips': '👄',
        'thumbs_up': '👍',
        '-1': '👎',
        'ok_hand': '👌',
        'facepunch': '👊',
        'fist': '✊',
        'wave': '👋',
        'hand': '✋',
        'open_hands': '👐',
        'point_up_2': '👆',
        'point_down': '👇',
        'point_right': '👉',
        'point_left': '👈',
        'raised_hands': '🙌',
        'pray': '🙏',
        'clap': '👏',
        'muscle': '💪',
        'walking': '🚶',
        'runner': '🏃',
        'dancer': '💃',
        'couple': '👫',
        'family': '👪',
        'couplekiss': '💏',
        'couple_with_heart': '💑',
        'dancers': '👯',
        'ok_woman': '🙆',
        'no_good': '🙅',
        'information_desk_person': '💁',
        'raising_hand': '🙋',
        'massage': '💆',
        'haircut': '💇',
        'nail_care': '💅',
        'bride_with_veil': '👰',
        'person_with_pouting_face': '🙎',
        'person_frowning': '🙍',
        'bow': '🙇',
        'tophat': '🎩',
        'crown': '👑',
        'womans_hat': '👒',
        'athletic_shoe': '👟',
        'mans_shoe': '👞',
        'sandal': '👡',
        'high_heel': '👠',
        'boot': '👢',
        'shirt': '👕',
        'necktie': '👔',
        'womans_clothes': '👚',
        'dress': '👗',
        'running_shirt_with_sash': '🎽',
        'jeans': '👖',
        'kimono': '👘',
        'bikini': '👙',
        'briefcase': '💼',
        'handbag': '👜',
        'pouch': '👝',
        'purse': '👛',
        'eyeglasses': '👓',
        'ribbon': '🎀',
        'closed_umbrella': '🌂',
        'lipstick': '💄',
        'yellow_heart': '💛',
        'blue_heart': '💙',
        'purple_heart': '💜',
        'green_heart': '💚',
        'broken_heart': '💔',
        'heartpulse': '💗',
        'heartbeat': '💓',
        'two_hearts': '💕',
        'sparkling_heart': '💖',
        'revolving_hearts': '💞',
        'cupid': '💘',
        'love_letter': '💌',
        'kiss': '💋',
        'ring': '💍',
        'gem': '💎',
        'bust_in_silhouette': '👤',
        'speech_balloon': '💬',
        'footprints': '👣',
    },
    'Nature': {
        'dog': '🐶',
        'wolf': '🐺',
        'cat': '🐱',
        'mouse': '🐭',
        'hamster': '🐹',
        'rabbit': '🐰',
        'frog': '🐸',
        'tiger': '🐯',
        'koala': '🐨',
        'bear': '🐻',
        'pig': '🐷',
        'pig_nose': '🐽',
        'cow': '🐮',
        'boar': '🐗',
        'monkey_face': '🐵',
        'monkey': '🐒',
        'horse': '🐴',
        'sheep': '🐑',
        'elephant': '🐘',
        'panda_face': '🐼',
        'penguin': '🐧',
        'bird': '🐦',
        'baby_chick': '🐤',
        'hatched_chick': '🐥',
        'hatching_chick': '🐣',
        'chicken': '🐔',
        'snake': '🐍',
        'turtle': '🐢',
        'bug': '🐛',
        'bee': '🐝',
        'ant': '🐜',
        'beetle': '🐞',
        'snail': '🐌',
        'octopus': '🐙',
        'shell': '🐚',
        'tropical_fish': '🐠',
        'fish': '🐟',
        'dolphin': '🐬',
        'whale': '🐳',
        'racehorse': '🐎',
        'dragon_face': '🐲',
        'blowfish': '🐡',
        'camel': '🐫',
        'poodle': '🐩',
        'feet': '🐾',
        'bouquet': '💐',
        'cherry_blossom': '🌸',
        'tulip': '🌷',
        'four_leaf_clover': '🍀',
        'rose': '🌹',
        'sunflower': '🌻',
        'hibiscus': '🌺',
        'maple_leaf': '🍁',
        'leaves': '🍃',
        'fallen_leaf': '🍂',
        'herb': '🌿',
        'ear_of_rice': '🌾',
        'mushroom': '🍄',
        'cactus': '🌵',
        'palm_tree': '🌴',
        'chestnut': '🌰',
        'seedling': '🌱',
        'blossom': '🌼',
        'new_moon': '🌑',
        'first_quarter_moon': '🌓',
        'moon': '🌔',
        'full_moon': '🌕',
        'first_quarter_moon_with_face': '🌛',
        'crescent_moon': '🌙',
        'earth_asia': '🌏',
        'volcano': '🌋',
        'milky_way': '🌌',
        'stars': '🌠',
        'partly_sunny': '⛅',
        'snowman': '⛄',
        'cyclone': '🌀',
        'foggy': '🌁',
        'rainbow': '🌈',
        'ocean': '🌊',
    },
    'Objects': {
        'bamboo': '🎍',
        'gift_heart': '💝',
        'dolls': '🎎',
        'school_satchel': '🎒',
        'mortar_board': '🎓',
        'flags': '🎏',
        'fireworks': '🎆',
        'sparkler': '🎇',
        'wind_chime': '🎐',
        'rice_scene': '🎑',
        'jack_o_lantern': '🎃',
        'ghost': '👻',
        'santa': '🎅',
        'christmas_tree': '🎄',
        'gift': '🎁',
        'tanabata_tree': '🎋',
        'tada': '🎉',
        'confetti_ball': '🎊',
        'balloon': '🎈',
        'crossed_flags': '🎌',
        'crystal_ball': '🔮',
        'movie_camera': '🎥',
        'camera': '📷',
        'video_camera': '📹',
        'vhs': '📼',
        'cd': '💿',
        'dvd': '📀',
        'minidisc': '💽',
        'floppy_disk': '💾',
        'computer': '💻',
        'iphone': '📱',
        'telephone_receiver': '📞',
        'pager': '📟',
        'fax': '📠',
        'satellite': '📡',
        'tv': '📺',
        'radio': '📻',
        'loud_sound': '🔊',
        'bell': '🔔',
        'loudspeaker': '📢',
        'mega': '📣',
        'hourglass_flowing_sand': '⏳',
        'hourglass': '⌛',
        'alarm_clock': '⏰',
        'watch': '⌚',
        'unlock': '🔓',
        'lock': '🔒',
        'lock_with_ink_pen': '🔏',
        'closed_lock_with_key': '🔐',
        'key': '🔑',
        'mag_right': '🔎',
        'bulb': '💡',
        'flashlight': '🔦',
        'electric_plug': '🔌',
        'battery': '🔋',
        'mag': '🔍',
        'bath': '🛀',
        'toilet': '🚽',
        'wrench': '🔧',
        'nut_and_bolt': '🔩',
        'hammer': '🔨',
        'door': '🚪',
        'smoking': '🚬',
        'bomb': '💣',
        'gun': '🔫',
        'hocho': '🔪',
        'pill': '💊',
        'syringe': '💉',
        'moneybag': '💰',
        'yen': '💴',
        'dollar': '💵',
        'credit_card': '💳',
        'money_with_wings': '💸',
        'calling': '📲',
        'e-mail': '📧',
        'inbox_tray': '📥',
        'outbox_tray': '📤',
        'envelope_with_arrow': '📩',
        'incoming_envelope': '📨',
        'mailbox': '📫',
        'mailbox_closed': '📪',
        'postbox': '📮',
        'package': '📦',
        'memo': '📝',
        'page_facing_up': '📄',
        'page_with_curl': '📃',
        'bookmark_tabs': '📑',
        'bar_chart': '📊',
        'chart_with_upwards_trend': '📈',
        'chart_with_downwards_trend': '📉',
        'scroll': '📜',
        'clipboard': '📋',
        'date': '📅',
        'calendar': '📆',
        'card_index': '📇',
        'file_folder': '📁',
        'open_file_folder': '📂',
        'pushpin': '📌',
        'paperclip': '📎',
        'straight_ruler': '📏',
        'triangular_ruler': '📐',
        'closed_book': '📕',
        'green_book': '📗',
        'blue_book': '📘',
        'orange_book': '📙',
        'notebook': '📓',
        'notebook_with_decorative_cover': '📔',
        'ledger': '📒',
        'books': '📚',
        'book': '📖',
        'bookmark': '🔖',
        'name_badge': '📛',
        'newspaper': '📰',
        'art': '🎨',
        'clapper': '🎬',
        'microphone': '🎤',
        'headphones': '🎧',
        'musical_score': '🎼',
        'musical_note': '🎵',
        'notes': '🎶',
        'musical_keyboard': '🎹',
        'violin': '🎻',
        'trumpet': '🎺',
        'saxophone': '🎷',
        'guitar': '🎸',
        'space_invader': '👾',
        'video_game': '🎮',
        'black_joker': '🃏',
        'flower_playing_cards': '🎴',
        'mahjong': '🀄',
        'game_die': '🎲',
        'dart': '🎯',
        'football': '🏈',
        'basketball': '🏀',
        'soccer': '⚽',
        'baseball': '⚾',
        'tennis': '🎾',
        '8ball': '🎱',
        'bowling': '🎳',
        'golf': '⛳',
        'checkered_flag': '🏁',
        'trophy': '🏆',
        'ski': '🎿',
        'snowboarder': '🏂',
        'swimmer': '🏊',
        'surfer': '🏄',
        'fishing_pole_and_fish': '🎣',
        'tea': '🍵',
        'sake': '🍶',
        'beer': '🍺',
        'beers': '🍻',
        'cocktail': '🍸',
        'tropical_drink': '🍹',
        'wine_glass': '🍷',
        'fork_and_knife': '🍴',
        'pizza': '🍕',
        'hamburger': '🍔',
        'fries': '🍟',
        'poultry_leg': '🍗',
        'meat_on_bone': '🍖',
        'spaghetti': '🍝',
        'curry': '🍛',
        'fried_shrimp': '🍤',
        'bento': '🍱',
        'sushi': '🍣',
        'fish_cake': '🍥',
        'rice_ball': '🍙',
        'rice_cracker': '🍘',
        'rice': '🍚',
        'ramen': '🍜',
        'stew': '🍲',
        'oden': '🍢',
        'dango': '🍡',
        'egg': '🍳',
        'bread': '🍞',
        'doughnut': '🍩',
        'custard': '🍮',
        'icecream': '🍦',
        'ice_cream': '🍨',
        'shaved_ice': '🍧',
        'birthday': '🎂',
        'cake': '🍰',
        'cookie': '🍪',
        'chocolate_bar': '🍫',
        'candy': '🍬',
        'lollipop': '🍭',
        'honey_pot': '🍯',
        'apple': '🍎',
        'green_apple': '🍏',
        'tangerine': '🍊',
        'cherries': '🍒',
        'grapes': '🍇',
        'watermelon': '🍉',
        'strawberry': '🍓',
        'peach': '🍑',
        'melon': '🍈',
        'banana': '🍌',
        'pineapple': '🍍',
        'sweet_potato': '🍠',
        'eggplant': '🍆',
        'tomato': '🍅',
        'corn': '🌽',
    },
    'Places': {
        'house': '🏠',
        'house_with_garden': '🏡',
        'school': '🏫',
        'office': '🏢',
        'post_office': '🏣',
        'hospital': '🏥',
        'bank': '🏦',
        'convenience_store': '🏪',
        'love_hotel': '🏩',
        'hotel': '🏨',
        'wedding': '💒',
        'church': '⛪',
        'department_store': '🏬',
        'city_sunrise': '🌇',
        'city_sunset': '🌆',
        'japanese_castle': '🏯',
        'european_castle': '🏰',
        'tent': '⛺',
        'factory': '🏭',
        'tokyo_tower': '🗼',
        'japan': '🗾',
        'mount_fuji': '🗻',
        'sunrise_over_mountains': '🌄',
        'sunrise': '🌅',
        'night_with_stars': '🌃',
        'statue_of_liberty': '🗽',
        'bridge_at_night': '🌉',
        'carousel_horse': '🎠',
        'ferris_wheel': '🎡',
        'fountain': '⛲',
        'roller_coaster': '🎢',
        'ship': '🚢',
        'boat': '⛵',
        'speedboat': '🚤',
        'rocket': '🚀',
        'seat': '💺',
        'station': '🚉',
        'bullettrain_side': '🚄',
        'bullettrain_front': '🚅',
        'metro': '🚇',
        'railway_car': '🚃',
        'bus': '🚌',
        'blue_car': '🚙',
        'car': '🚗',
        'taxi': '🚕',
        'truck': '🚚',
        'rotating_light': '🚨',
        'police_car': '🚓',
        'fire_engine': '🚒',
        'ambulance': '🚑',
        'bike': '🚲',
        'barber': '💈',
        'busstop': '🚏',
        'ticket': '🎫',
        'traffic_light': '🚥',
        'construction': '🚧',
        'beginner': '🔰',
        'fuelpump': '⛽',
        'izakaya_lantern': '🏮',
        'slot_machine': '🎰',
        'moyai': '🗿',
        'circus_tent': '🎪',
        'performing_arts': '🎭',
        'round_pushpin': '📍',
        'triangular_flag_on_post': '🚩',
    },
    'Symbols': {
        'keycap_ten': '🔟',
        '1234': '🔢',
        'symbols': '🔣',
        'capital_abcd': '🔠',
        'abcd': '🔡',
        'abc': '🔤',
        'arrow_up_small': '🔼',
        'arrow_down_small': '🔽',
        'rewind': '⏪',
        'fast_forward': '⏩',
        'arrow_double_up': '⏫',
        'arrow_double_down': '⏬',
        'ok': '🆗',
        'new': '🆕',
        'up': '🆙',
        'cool': '🆒',
        'free': '🆓',
        'ng': '🆖',
        'signal_strength': '📶',
        'cinema': '🎦',
        'koko': '🈁',
        'u6307': '🈯',
        'u7a7a': '🈳',
        'u6e80': '🈵',
        'u5408': '🈴',
        'u7981': '🈲',
        'ideograph_advantage': '🉐',
        'u5272': '🈹',
        'u55b6': '🈺',
        'u6709': '🈶',
        'u7121': '🈚',
        'restroom': '🚻',
        'mens': '🚹',
        'womens': '🚺',
        'baby_symbol': '🚼',
        'wc': '🚾',
        'no_smoking': '🚭',
        'u7533': '🈸',
        'accept': '🉑',
        'cl': '🆑',
        'sos': '🆘',
        'id': '🆔',
        'no_entry_sign': '🚫',
        'underage': '🔞',
        'no_entry': '⛔',
        'negative_squared_cross_mark': '❎',
        'white_check_mark': '✅',
        'heart_decoration': '💟',
        'vs': '🆚',
        'vibration_mode': '📳',
        'mobile_phone_off': '📴',
        'ab': '🆎',
        'diamond_shape_with_a_dot_inside': '💠',
        'ophiuchus': '⛎',
        'six_pointed_star': '🔯',
        'atm': '🏧',
        'chart': '💹',
        'heavy_dollar_sign': '💲',
        'currency_exchange': '💱',
        'x': '❌',
        'exclamation': '❗',
        'question': '❓',
        'grey_exclamation': '❕',
        'grey_question': '❔',
        'o': '⭕',
        'top': '🔝',
        'end': '🔚',
        'back': '🔙',
        'on': '🔛',
        'soon': '🔜',
        'arrows_clockwise': '🔃',
        'clock12': '🕛',
        'clock1': '🕐',
        'clock2': '🕑',
        'clock3': '🕒',
        'clock4': '🕓',
        'clock5': '🕔',
        'clock6': '🕕',
        'clock7': '🕖',
        'clock8': '🕗',
        'clock9': '🕘',
        'clock10': '🕙',
        'clock11': '🕚',
        'heavy_plus_sign': '➕',
        'heavy_minus_sign': '➖',
        'heavy_division_sign': '➗',
        'white_flower': '💮',
        '100': '💯',
        'radio_button': '🔘',
        'link': '🔗',
        'curly_loop': '➰',
        'trident': '🔱',
        'small_red_triangle': '🔺',
        'black_square_button': '🔲',
        'white_square_button': '🔳',
        'red_circle': '🔴',
        'large_blue_circle': '🔵',
        'small_red_triangle_down': '🔻',
        'white_large_square': '⬜',
        'black_large_square': '⬛',
        'large_orange_diamond': '🔶',
        'large_blue_diamond': '🔷',
        'small_orange_diamond': '🔸',
        'small_blue_diamond': '🔹',
    },
});

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/EmojiPicker.vue?vue&type=template&id=0e56d761&
var EmojiPickervue_type_template_id_0e56d761_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-wrapper"},[_c('emoji-picker',{attrs:{"search":_vm.search},on:{"emoji":_vm.append},scopedSlots:_vm._u([{key:"emoji-invoker",fn:function(ref){
var clickEvent = ref.events.click;
return _c('div',{staticClass:"vac-svg-button",class:{ 'vac-emoji-reaction': _vm.emojiReaction },on:{"click":[function($event){$event.stopPropagation();return clickEvent($event)},_vm.openEmoji]}},[_vm._t("emoji-picker-icon",[_c('svg-icon',{attrs:{"name":"emoji","param":_vm.emojiReaction ? 'reaction' : ''}})])],2)}},{key:"emoji-picker",fn:function(ref){
var emojis = ref.emojis;
var insert = ref.insert;
return (_vm.emojiOpened)?_c('div',{},[_c('transition',{attrs:{"name":"vac-slide-up","appear":""}},[_c('div',{staticClass:"vac-emoji-picker",class:{ 'vac-picker-reaction': _vm.emojiReaction },style:({
						height: (_vm.emojiPickerHeight + "px"),
						top: _vm.positionTop ? _vm.emojiPickerHeight : (_vm.emojiPickerTop + "px"),
						right: _vm.emojiPickerRight,
						display: _vm.emojiPickerTop || !_vm.emojiReaction ? 'initial' : 'none'
					})},[_c('div',{staticClass:"vac-emoji-picker__search"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.search),expression:"search"}],attrs:{"type":"text"},domProps:{"value":(_vm.search)},on:{"input":function($event){if($event.target.composing){ return; }_vm.search=$event.target.value}}})]),_c('div',_vm._l((emojis),function(emojiGroup,category){return _c('div',{key:category},[(category !== 'Frequently used')?_c('h5',[_vm._v(" "+_vm._s(category)+" ")]):_vm._e(),(category !== 'Frequently used')?_c('div',{staticClass:"vac-emojis"},_vm._l((emojiGroup),function(emoji,emojiName){return _c('span',{key:emojiName,attrs:{"title":emojiName},on:{"click":function($event){return insert({ emoji: emoji, emojiName: emojiName })}}},[_vm._v(" "+_vm._s(emoji)+" ")])}),0):_vm._e()])}),0)])])],1):_vm._e()}}],null,true)})],1)}
var EmojiPickervue_type_template_id_0e56d761_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/EmojiPicker.vue?vue&type=template&id=0e56d761&

// EXTERNAL MODULE: ./node_modules/vue-emoji-picker/dist-module/main.js
var main = __webpack_require__("669f");
var main_default = /*#__PURE__*/__webpack_require__.n(main);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/EmojiPicker.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var EmojiPickervue_type_script_lang_js_ = ({
  components: {
    EmojiPicker: main_default.a,
    SvgIcon: SvgIcon
  },
  props: {
    emojiOpened: {
      type: Boolean,
      "default": false
    },
    emojiReaction: {
      type: Boolean,
      "default": false
    },
    roomFooterRef: {
      type: HTMLDivElement,
      "default": null
    },
    positionTop: {
      type: Boolean,
      "default": false
    },
    positionRight: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      search: '',
      emojiPickerHeight: 320,
      emojiPickerTop: 0,
      emojiPickerRight: ''
    };
  },
  methods: {
    append: function append(_ref) {
      var emoji = _ref.emoji,
          emojiName = _ref.emojiName;
      this.$emit('add-emoji', {
        icon: emoji,
        name: emojiName
      });
    },
    openEmoji: function openEmoji(ev) {
      this.$emit('open-emoji', true);
      this.setEmojiPickerPosition(ev.clientY, ev.view.innerWidth, ev.view.innerHeight);
    },
    setEmojiPickerPosition: function setEmojiPickerPosition(clientY, innerWidth, innerHeight) {
      var _this = this;

      setTimeout(function () {
        var mobileSize = innerWidth < 500 || innerHeight < 700;

        if (!_this.roomFooterRef) {
          if (mobileSize) _this.emojiPickerRight = '0px';
          return;
        }

        if (mobileSize) {
          _this.emojiPickerRight = innerWidth / 2 - 120 + 'px';
          _this.emojiPickerTop = 100;
          _this.emojiPickerHeight = innerHeight - 200;
        } else {
          var roomFooterTop = _this.roomFooterRef.getBoundingClientRect().top;

          var pickerTopPosition = roomFooterTop - clientY > _this.emojiPickerHeight - 50;
          if (pickerTopPosition) _this.emojiPickerTop = clientY + 10;else _this.emojiPickerTop = clientY - _this.emojiPickerHeight - 10;
          _this.emojiPickerRight = _this.positionTop ? '-50px' : _this.positionRight ? '60px' : '';
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/EmojiPicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_EmojiPickervue_type_script_lang_js_ = (EmojiPickervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/EmojiPicker.vue?vue&type=style&index=0&lang=scss&
var EmojiPickervue_type_style_index_0_lang_scss_ = __webpack_require__("3c0d");

// CONCATENATED MODULE: ./src/components/EmojiPicker.vue






/* normalize component */

var EmojiPicker_component = normalizeComponent(
  components_EmojiPickervue_type_script_lang_js_,
  EmojiPickervue_type_template_id_0e56d761_render,
  EmojiPickervue_type_template_id_0e56d761_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var EmojiPicker = (EmojiPicker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomHeader.vue?vue&type=template&id=0afde938&
var RoomHeadervue_type_template_id_0afde938_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-room-header vac-app-border-b"},[_vm._t("room-header",[_c('div',{staticClass:"vac-room-wrapper"},[(!_vm.singleRoom)?_c('div',{staticClass:"vac-svg-button vac-toggle-button",class:{ 'vac-rotate-icon': !_vm.showRoomsList && !_vm.isMobile },on:{"click":function($event){return _vm.$emit('toggle-rooms-list')}}},[_vm._t("toggle-icon",[_c('svg-icon',{attrs:{"name":"toggle"}})])],2):_vm._e(),_c('div',{staticClass:"vac-info-wrapper",class:{ 'vac-item-clickable': _vm.roomInfo },on:{"click":function($event){return _vm.$emit('room-info')}}},[_vm._t("room-header-avatar",[(_vm.room.avatar)?_c('div',{staticClass:"vac-avatar",style:({ 'background-image': ("url('" + (_vm.room.avatar) + "')") })}):_vm._e()],null,{ room: _vm.room }),_vm._t("room-header-info",[_c('div',{staticClass:"vac-text-ellipsis"},[_c('div',{staticClass:"vac-room-name vac-text-ellipsis"},[_vm._v(" "+_vm._s(_vm.room.roomName)+" ")]),(_vm.typingUsers)?_c('div',{staticClass:"vac-room-info vac-text-ellipsis"},[_vm._v(" "+_vm._s(_vm.typingUsers)+" ")]):_c('div',{staticClass:"vac-room-info vac-text-ellipsis"},[_vm._v(" "+_vm._s(_vm.userStatus)+" ")])])],null,{ room: _vm.room, typingUsers: _vm.typingUsers, userStatus: _vm.userStatus })],2),(_vm.room.roomId)?_vm._t("room-options",[(_vm.menuActions.length)?_c('div',{staticClass:"vac-svg-button vac-room-options",on:{"click":function($event){_vm.menuOpened = !_vm.menuOpened}}},[_vm._t("menu-icon",[_c('svg-icon',{attrs:{"name":"menu"}})])],2):_vm._e(),(_vm.menuActions.length)?_c('transition',{attrs:{"name":"vac-slide-left"}},[(_vm.menuOpened)?_c('div',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.closeMenu),expression:"closeMenu"}],staticClass:"vac-menu-options"},[_c('div',{staticClass:"vac-menu-list"},_vm._l((_vm.menuActions),function(action){return _c('div',{key:action.name},[_c('div',{staticClass:"vac-menu-item",on:{"click":function($event){return _vm.menuActionHandler(action)}}},[_vm._v(" "+_vm._s(action.title)+" ")])])}),0)]):_vm._e()]):_vm._e()]):_vm._e()],2)],null,{ room: _vm.room, typingUsers: _vm.typingUsers, userStatus: _vm.userStatus })],2)}
var RoomHeadervue_type_template_id_0afde938_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomHeader.vue?vue&type=template&id=0afde938&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomHeader.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var RoomHeadervue_type_script_lang_js_ = ({
  name: 'RoomHeader',
  components: {
    SvgIcon: SvgIcon
  },
  directives: {
    clickOutside: v_click_outside_umd_default.a.directive
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    textMessages: {
      type: Object,
      required: true
    },
    singleRoom: {
      type: Boolean,
      required: true
    },
    showRoomsList: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    roomInfo: {
      type: Function,
      "default": null
    },
    menuActions: {
      type: Array,
      required: true
    },
    room: {
      type: Object,
      required: true
    }
  },
  data: function data() {
    return {
      menuOpened: false
    };
  },
  computed: {
    typingUsers: function typingUsers() {
      return typing_text(this.room, this.currentUserId, this.textMessages);
    },
    userStatus: function userStatus() {
      var _this = this;

      if (!this.room.users || this.room.users.length !== 2) return;
      var user = this.room.users.find(function (u) {
        return u._id !== _this.currentUserId;
      });
      if (!user.status) return;
      var text = '';

      if (user.status.state === 'online') {
        text = this.textMessages.IS_ONLINE;
      } else if (user.status.lastChanged) {
        text = this.textMessages.LAST_SEEN + user.status.lastChanged;
      }

      return text;
    }
  },
  methods: {
    menuActionHandler: function menuActionHandler(action) {
      this.closeMenu();
      this.$emit('menu-action-handler', action);
    },
    closeMenu: function closeMenu() {
      this.menuOpened = false;
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomHeader.vue?vue&type=script&lang=js&
 /* harmony default export */ var Room_RoomHeadervue_type_script_lang_js_ = (RoomHeadervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomHeader.vue?vue&type=style&index=0&lang=scss&
var RoomHeadervue_type_style_index_0_lang_scss_ = __webpack_require__("e83d");

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomHeader.vue






/* normalize component */

var RoomHeader_component = normalizeComponent(
  Room_RoomHeadervue_type_script_lang_js_,
  RoomHeadervue_type_template_id_0afde938_render,
  RoomHeadervue_type_template_id_0afde938_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomHeader = (RoomHeader_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=template&id=168137bc&
var RoomMessageReplyvue_type_template_id_168137bc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"vac-slide-up"}},[(_vm.messageReply)?_c('div',{staticClass:"vac-reply-container",style:({ bottom: ((_vm.$parent.$refs.roomFooter.clientHeight) + "px") })},[_c('div',{staticClass:"vac-reply-box"},[(_vm.isImageFile)?_c('img',{staticClass:"vac-image-reply",attrs:{"src":_vm.messageReply.file.url}}):_vm._e(),_c('div',{staticClass:"vac-reply-info"},[_c('div',{staticClass:"vac-reply-username"},[_vm._v(" "+_vm._s(_vm.messageReply.username)+" ")]),_c('div',{staticClass:"vac-reply-content"},[_c('format-message',{attrs:{"content":_vm.messageReply.content,"users":_vm.room.users,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"reply":true},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1)])]),_c('div',{staticClass:"vac-icon-reply"},[_c('div',{staticClass:"vac-svg-button",on:{"click":function($event){return _vm.$emit('reset-message')}}},[_vm._t("reply-close-icon",[_c('svg-icon',{attrs:{"name":"close-outline"}})])],2)])]):_vm._e()])}
var RoomMessageReplyvue_type_template_id_168137bc_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=template&id=168137bc&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var RoomMessageReplyvue_type_script_lang_js_require = __webpack_require__("bd43"),
    _isImageFile = RoomMessageReplyvue_type_script_lang_js_require.isImageFile;

/* harmony default export */ var RoomMessageReplyvue_type_script_lang_js_ = ({
  name: 'RoomMessageReply',
  components: {
    SvgIcon: SvgIcon,
    FormatMessage: FormatMessage
  },
  props: {
    room: {
      type: Object,
      required: true
    },
    messageReply: {
      type: Object,
      "default": null
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    }
  },
  computed: {
    isImageFile: function isImageFile() {
      return _isImageFile(this.messageReply.file);
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=script&lang=js&
 /* harmony default export */ var Room_RoomMessageReplyvue_type_script_lang_js_ = (RoomMessageReplyvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=style&index=0&lang=scss&
var RoomMessageReplyvue_type_style_index_0_lang_scss_ = __webpack_require__("3cd7");

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue






/* normalize component */

var RoomMessageReply_component = normalizeComponent(
  Room_RoomMessageReplyvue_type_script_lang_js_,
  RoomMessageReplyvue_type_template_id_168137bc_render,
  RoomMessageReplyvue_type_template_id_168137bc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomMessageReply = (RoomMessageReply_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=template&id=adecc494&
var RoomUsersTagvue_type_template_id_adecc494_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"vac-slide-up"}},[(_vm.filteredUsersTag.length)?_c('div',{staticClass:"vac-tags-container vac-app-box-shadow",style:({ bottom: ((_vm.$parent.$refs.roomFooter.clientHeight) + "px") })},_vm._l((_vm.filteredUsersTag),function(user){return _c('div',{key:user._id,staticClass:"vac-tags-box",on:{"click":function($event){return _vm.$emit('select-user-tag', user)}}},[_c('div',{staticClass:"vac-tags-info"},[(user.avatar)?_c('div',{staticClass:"vac-avatar vac-tags-avatar",style:({ 'background-image': ("url('" + (user.avatar) + "')") })}):_vm._e(),_c('div',{staticClass:"vac-tags-username"},[_vm._v(" "+_vm._s(user.username)+" ")])])])}),0):_vm._e()])}
var RoomUsersTagvue_type_template_id_adecc494_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=template&id=adecc494&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var RoomUsersTagvue_type_script_lang_js_ = ({
  name: 'RoomUsersTag',
  props: {
    filteredUsersTag: {
      type: Array,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=script&lang=js&
 /* harmony default export */ var Room_RoomUsersTagvue_type_script_lang_js_ = (RoomUsersTagvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=style&index=0&lang=scss&
var RoomUsersTagvue_type_style_index_0_lang_scss_ = __webpack_require__("0ed5");

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomUsersTag.vue






/* normalize component */

var RoomUsersTag_component = normalizeComponent(
  Room_RoomUsersTagvue_type_script_lang_js_,
  RoomUsersTagvue_type_template_id_adecc494_render,
  RoomUsersTagvue_type_template_id_adecc494_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomUsersTag = (RoomUsersTag_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomEmojis.vue?vue&type=template&id=04b99276&
var RoomEmojisvue_type_template_id_04b99276_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"vac-slide-up"}},[(_vm.filteredEmojis.length)?_c('div',{staticClass:"vac-emojis-container vac-app-box-shadow",style:({ bottom: ((_vm.$parent.$refs.roomFooter.clientHeight) + "px") })},_vm._l((_vm.filteredEmojis),function(emoji){return _c('div',{key:emoji,staticClass:"vac-emoji-element",on:{"click":function($event){return _vm.$emit('select-emoji', emoji)}}},[_vm._v(" "+_vm._s(emoji)+" ")])}),0):_vm._e()])}
var RoomEmojisvue_type_template_id_04b99276_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomEmojis.vue?vue&type=template&id=04b99276&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomEmojis.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var RoomEmojisvue_type_script_lang_js_ = ({
  name: 'RoomEmojis',
  props: {
    filteredEmojis: {
      type: Array,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomEmojis.vue?vue&type=script&lang=js&
 /* harmony default export */ var Room_RoomEmojisvue_type_script_lang_js_ = (RoomEmojisvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomEmojis.vue?vue&type=style&index=0&lang=scss&
var RoomEmojisvue_type_style_index_0_lang_scss_ = __webpack_require__("fb0c");

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomEmojis.vue






/* normalize component */

var RoomEmojis_component = normalizeComponent(
  Room_RoomEmojisvue_type_script_lang_js_,
  RoomEmojisvue_type_template_id_04b99276_render,
  RoomEmojisvue_type_template_id_04b99276_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomEmojis = (RoomEmojis_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/Message.vue?vue&type=template&id=916bd03c&
var Messagevue_type_template_id_916bd03c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:_vm.message._id,staticClass:"vac-message-wrapper",attrs:{"id":_vm.message._id}},[(_vm.showDate)?_c('div',{staticClass:"vac-card-info vac-card-date"},[_vm._v(" "+_vm._s(_vm.message.date)+" ")]):_vm._e(),(_vm.newMessage._id === _vm.message._id)?_c('div',{staticClass:"vac-line-new"},[_vm._v(" "+_vm._s(_vm.textMessages.NEW_MESSAGES)+" ")]):_vm._e(),(_vm.message.system)?_c('div',{staticClass:"vac-card-info vac-card-system"},[_vm._v(" "+_vm._s(_vm.message.content)+" ")]):_c('div',{staticClass:"vac-message-box",class:{ 'vac-offset-current': _vm.message.senderId === _vm.currentUserId }},[_vm._t("message",[(_vm.message.avatar && _vm.message.senderId !== _vm.currentUserId)?_c('div',{staticClass:"vac-avatar",style:({ 'background-image': ("url('" + (_vm.message.avatar) + "')") })}):_vm._e(),_c('div',{staticClass:"vac-message-container",class:{
					'vac-message-container-offset': _vm.messageOffset
				}},[_c('div',{staticClass:"vac-message-card",class:{
						'vac-message-highlight': _vm.isMessageHover,
						'vac-message-current': _vm.message.senderId === _vm.currentUserId,
						'vac-message-deleted': _vm.message.deleted
					},on:{"mouseover":_vm.onHoverMessage,"mouseleave":_vm.onLeaveMessage}},[(_vm.roomUsers.length > 2 && _vm.message.senderId !== _vm.currentUserId)?_c('div',{staticClass:"vac-text-username",class:{
							'vac-username-reply': !_vm.message.deleted && _vm.message.replyMessage
						}},[_c('span',[_vm._v(_vm._s(_vm.message.username))])]):_vm._e(),(!_vm.message.deleted && _vm.message.replyMessage)?_c('message-reply',{attrs:{"message":_vm.message,"room-users":_vm.roomUsers,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):_vm._e(),(_vm.message.deleted)?_c('div',[_vm._t("deleted-icon",[_c('svg-icon',{staticClass:"vac-icon-deleted",attrs:{"name":"deleted"}})]),_c('span',[_vm._v(_vm._s(_vm.textMessages.MESSAGE_DELETED))])],2):(!_vm.message.file)?_c('format-message',{attrs:{"content":_vm.message.content,"users":_vm.roomUsers,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions},on:{"open-user-tag":_vm.openUserTag},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):(_vm.isImage)?_c('message-image',{attrs:{"current-user-id":_vm.currentUserId,"message":_vm.message,"room-users":_vm.roomUsers,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"image-hover":_vm.imageHover},on:{"open-file":_vm.openFile},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):(_vm.isVideo)?_c('div',{staticClass:"vac-video-container"},[_c('video',{attrs:{"width":"100%","height":"100%","controls":""}},[_c('source',{attrs:{"src":_vm.message.file.url}})]),_c('format-message',{attrs:{"content":_vm.message.content,"users":_vm.roomUsers,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions},on:{"open-user-tag":_vm.openUserTag},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1):(_vm.isAudio)?_c('audio-player',{attrs:{"src":_vm.message.file.url},on:{"update-progress-time":function($event){_vm.progressTime = $event},"hover-audio-progress":function($event){_vm.hoverAudioProgress = $event}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):_c('div',{staticClass:"vac-file-message"},[_c('div',{staticClass:"vac-svg-button vac-icon-file",on:{"click":function($event){$event.stopPropagation();return _vm.openFile('download')}}},[_vm._t("document-icon",[_c('svg-icon',{attrs:{"name":"document"}})])],2),_c('span',[_vm._v(_vm._s(_vm.message.content))])]),(_vm.isAudio && !_vm.message.deleted)?_c('div',{staticClass:"vac-progress-time"},[_vm._v(" "+_vm._s(_vm.progressTime)+" ")]):_vm._e(),_c('div',{staticClass:"vac-text-timestamp"},[(_vm.message.edited && !_vm.message.deleted)?_c('div',{staticClass:"vac-icon-edited"},[_vm._t("pencil-icon",[_c('svg-icon',{attrs:{"name":"pencil"}})])],2):_vm._e(),_c('span',[_vm._v(_vm._s(_vm.message.timestamp))]),(_vm.isCheckmarkVisible)?_c('span',[_vm._t("checkmark-icon",[_c('svg-icon',{staticClass:"vac-icon-check",attrs:{"name":_vm.message.distributed ? 'double-checkmark' : 'checkmark',"param":_vm.message.seen ? 'seen' : ''}})],null,{ message: _vm.message })],2):_vm._e()]),_c('message-actions',{attrs:{"current-user-id":_vm.currentUserId,"message":_vm.message,"message-actions":_vm.messageActions,"room-footer-ref":_vm.roomFooterRef,"show-reaction-emojis":_vm.showReactionEmojis,"hide-options":_vm.hideOptions,"message-hover":_vm.messageHover,"hover-message-id":_vm.hoverMessageId,"hover-audio-progress":_vm.hoverAudioProgress},on:{"hide-options":function($event){return _vm.$emit('hide-options', false)},"update-message-hover":function($event){_vm.messageHover = $event},"update-options-opened":function($event){_vm.optionsOpened = $event},"update-emoji-opened":function($event){_vm.emojiOpened = $event},"message-action-handler":_vm.messageActionHandler,"send-message-reaction":function($event){return _vm.sendMessageReaction($event)}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1),_c('message-reactions',{attrs:{"current-user-id":_vm.currentUserId,"message":_vm.message,"emojis-list":_vm.emojisList},on:{"send-message-reaction":function($event){return _vm.sendMessageReaction($event)}}})],1)],null,{ message: _vm.message })],2)])}
var Messagevue_type_template_id_916bd03c_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/Message.vue?vue&type=template&id=916bd03c&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.reduce.js
var es6_array_reduce = __webpack_require__("0cd8");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReply.vue?vue&type=template&id=e3400edc&
var MessageReplyvue_type_template_id_e3400edc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-reply-message"},[_c('div',{staticClass:"vac-reply-username"},[_vm._v(" "+_vm._s(_vm.replyUsername)+" ")]),(_vm.isImage)?_c('div',{staticClass:"vac-image-reply-container"},[_c('div',{staticClass:"vac-message-image vac-message-image-reply",style:({
				'background-image': ("url('" + (_vm.message.replyMessage.file.url) + "')")
			})})]):(_vm.isVideo)?_c('div',{staticClass:"vac-video-reply-container"},[_c('video',{attrs:{"width":"100%","height":"100%","controls":""}},[_c('source',{attrs:{"src":_vm.message.replyMessage.file.url}})])]):(_vm.isAudio)?_c('audio-player',{attrs:{"src":_vm.message.replyMessage.file.url},on:{"update-progress-time":function($event){_vm.progressTime = $event},"hover-audio-progress":function($event){_vm.hoverAudioProgress = $event}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)}):_vm._e(),_c('div',{staticClass:"vac-reply-content"},[_c('format-message',{attrs:{"content":_vm.message.replyMessage.content,"users":_vm.roomUsers,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions,"reply":true},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1)],1)}
var MessageReplyvue_type_template_id_e3400edc_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReply.vue?vue&type=template&id=e3400edc&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioPlayer.vue?vue&type=template&id=122955c2&
var AudioPlayervue_type_template_id_122955c2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"vac-audio-player"},[_c('div',{staticClass:"vac-svg-button",on:{"click":_vm.playback}},[(_vm.isPlaying)?_vm._t("audio-pause-icon",[_c('svg-icon',{attrs:{"name":"audio-pause"}})]):_vm._t("audio-play-icon",[_c('svg-icon',{attrs:{"name":"audio-play"}})])],2),_c('audio-control',{attrs:{"percentage":_vm.progress},on:{"change-linehead":_vm.onUpdateProgress,"hover-audio-progress":function($event){return _vm.$emit('hover-audio-progress', $event)}}}),_c('audio',{attrs:{"id":_vm.playerUniqId,"src":_vm.audioSource}})],1)])}
var AudioPlayervue_type_template_id_122955c2_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioPlayer.vue?vue&type=template&id=122955c2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioControl.vue?vue&type=template&id=57945bd0&
var AudioControlvue_type_template_id_57945bd0_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"progress",staticClass:"vac-player-bar",on:{"mousedown":_vm.onMouseDown,"mouseover":function($event){return _vm.$emit('hover-audio-progress', true)},"mouseout":function($event){return _vm.$emit('hover-audio-progress', false)}}},[_c('div',{staticClass:"vac-player-progress"},[_c('div',{staticClass:"vac-line-container"},[_c('div',{staticClass:"vac-line-progress",style:({ width: (_vm.percentage + "%") })}),_c('div',{staticClass:"vac-line-dot",class:{ 'vac-line-dot__active': _vm.isMouseDown },style:({ left: (_vm.percentage + "%") })})])])])}
var AudioControlvue_type_template_id_57945bd0_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioControl.vue?vue&type=template&id=57945bd0&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioControl.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var AudioControlvue_type_script_lang_js_ = ({
  props: {
    percentage: {
      type: Number,
      "default": 0
    }
  },
  data: function data() {
    return {
      isMouseDown: false
    };
  },
  methods: {
    onMouseDown: function onMouseDown(ev) {
      this.isMouseDown = true;
      var seekPos = this.calculateLineHeadPosition(ev, this.$refs['progress']);
      this.$emit('change-linehead', seekPos);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    },
    onMouseUp: function onMouseUp(ev) {
      this.isMouseDown = false;
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('mousemove', this.onMouseMove);
      var seekPos = this.calculateLineHeadPosition(ev, this.$refs['progress']);
      this.$emit('change-linehead', seekPos);
    },
    onMouseMove: function onMouseMove(ev) {
      var seekPos = this.calculateLineHeadPosition(ev, this.$refs['progress']);
      this.$emit('change-linehead', seekPos);
    },
    calculateLineHeadPosition: function calculateLineHeadPosition(ev, element) {
      var progressWidth = element.getBoundingClientRect().width;
      var leftPosition = element.getBoundingClientRect().left;
      var pos = (ev.clientX - leftPosition) / progressWidth;
      pos = pos < 0 ? 0 : pos;
      pos = pos > 1 ? 1 : pos;
      return pos;
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioControl.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_AudioControlvue_type_script_lang_js_ = (AudioControlvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/AudioControl.vue?vue&type=style&index=0&lang=scss&
var AudioControlvue_type_style_index_0_lang_scss_ = __webpack_require__("589c");

// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioControl.vue






/* normalize component */

var AudioControl_component = normalizeComponent(
  Message_AudioControlvue_type_script_lang_js_,
  AudioControlvue_type_template_id_57945bd0_render,
  AudioControlvue_type_template_id_57945bd0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var AudioControl = (AudioControl_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioPlayer.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var AudioPlayervue_type_script_lang_js_ = ({
  name: 'AudioPlayer',
  components: {
    SvgIcon: SvgIcon,
    AudioControl: AudioControl
  },
  props: {
    src: {
      type: String,
      "default": null
    }
  },
  data: function data() {
    return {
      isPlaying: false,
      duration: this.convertTimeMMSS(0),
      playedTime: this.convertTimeMMSS(0),
      progress: 0
    };
  },
  computed: {
    playerUniqId: function playerUniqId() {
      return "audio-player".concat(this._uid);
    },
    audioSource: function audioSource() {
      if (this.src) return this.src;
      this.resetProgress();
      return null;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.player = document.getElementById(this.playerUniqId);
    this.player.addEventListener('ended', function () {
      _this.isPlaying = false;
    });
    this.player.addEventListener('loadeddata', function () {
      _this.resetProgress();

      _this.duration = _this.convertTimeMMSS(_this.player.duration);

      _this.updateProgressTime();
    });
    this.player.addEventListener('timeupdate', this.onTimeUpdate);
  },
  methods: {
    convertTimeMMSS: function convertTimeMMSS(seconds) {
      return new Date(seconds * 1000).toISOString().substr(14, 5);
    },
    playback: function playback() {
      var _this2 = this;

      if (!this.audioSource) return;
      if (this.isPlaying) this.player.pause();else setTimeout(function () {
        return _this2.player.play();
      });
      this.isPlaying = !this.isPlaying;
    },
    resetProgress: function resetProgress() {
      if (this.isPlaying) this.player.pause();
      this.duration = this.convertTimeMMSS(0);
      this.playedTime = this.convertTimeMMSS(0);
      this.progress = 0;
      this.isPlaying = false;
      this.updateProgressTime();
    },
    onTimeUpdate: function onTimeUpdate() {
      this.playedTime = this.convertTimeMMSS(this.player.currentTime);
      this.progress = this.player.currentTime / this.player.duration * 100;
      this.updateProgressTime();
    },
    onUpdateProgress: function onUpdateProgress(pos) {
      if (pos) this.player.currentTime = pos * this.player.duration;
    },
    updateProgressTime: function updateProgressTime() {
      this.$emit('update-progress-time', this.progress > 1 ? this.playedTime : this.duration);
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioPlayer.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_AudioPlayervue_type_script_lang_js_ = (AudioPlayervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/AudioPlayer.vue?vue&type=style&index=0&lang=scss&
var AudioPlayervue_type_style_index_0_lang_scss_ = __webpack_require__("f43c");

// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioPlayer.vue






/* normalize component */

var AudioPlayer_component = normalizeComponent(
  Message_AudioPlayervue_type_script_lang_js_,
  AudioPlayervue_type_template_id_122955c2_render,
  AudioPlayervue_type_template_id_122955c2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var AudioPlayer = (AudioPlayer_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReply.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var MessageReplyvue_type_script_lang_js_require = __webpack_require__("bd43"),
    MessageReplyvue_type_script_lang_js_isAudioFile = MessageReplyvue_type_script_lang_js_require.isAudioFile,
    isImageFile = MessageReplyvue_type_script_lang_js_require.isImageFile,
    isVideoFile = MessageReplyvue_type_script_lang_js_require.isVideoFile;

/* harmony default export */ var MessageReplyvue_type_script_lang_js_ = ({
  name: 'MessageReply',
  components: {
    AudioPlayer: AudioPlayer,
    FormatMessage: FormatMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    },
    roomUsers: {
      type: Array,
      required: true
    }
  },
  computed: {
    replyUsername: function replyUsername() {
      var senderId = this.message.replyMessage.senderId;
      var replyUser = this.roomUsers.find(function (user) {
        return user._id === senderId;
      });
      return replyUser ? replyUser.username : '';
    },
    isAudio: function isAudio() {
      return MessageReplyvue_type_script_lang_js_isAudioFile(this.message.replyMessage.file);
    },
    isImage: function isImage() {
      return isImageFile(this.message.replyMessage.file);
    },
    isVideo: function isVideo() {
      return isVideoFile(this.message.replyMessage.file);
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReply.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_MessageReplyvue_type_script_lang_js_ = (MessageReplyvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageReply.vue?vue&type=style&index=0&lang=scss&
var MessageReplyvue_type_style_index_0_lang_scss_ = __webpack_require__("a916");

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReply.vue






/* normalize component */

var MessageReply_component = normalizeComponent(
  Message_MessageReplyvue_type_script_lang_js_,
  MessageReplyvue_type_template_id_e3400edc_render,
  MessageReplyvue_type_template_id_e3400edc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var MessageReply = (MessageReply_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageImage.vue?vue&type=template&id=db8562da&
var MessageImagevue_type_template_id_db8562da_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"imageRef",staticClass:"vac-image-container"},[_c('loader',{style:({ top: ((_vm.imageResponsive.loaderTop) + "px") }),attrs:{"show":_vm.isImageLoading}}),_c('div',{staticClass:"vac-message-image",class:{
			'vac-image-loading':
				_vm.isImageLoading && _vm.message.senderId === _vm.currentUserId
		},style:({
			'background-image': ("url('" + _vm.imageBackground + "')"),
			'max-height': ((_vm.imageResponsive.maxHeight) + "px")
		})},[_c('transition',{attrs:{"name":"vac-fade-image"}},[(_vm.imageHover && !_vm.isImageLoading)?_c('div',{staticClass:"vac-image-buttons"},[_c('div',{staticClass:"vac-svg-button vac-button-view",on:{"click":function($event){$event.stopPropagation();return _vm.$emit('open-file', 'preview')}}},[_vm._t("eye-icon",[_c('svg-icon',{attrs:{"name":"eye"}})])],2),_c('div',{staticClass:"vac-svg-button vac-button-download",on:{"click":function($event){$event.stopPropagation();return _vm.$emit('open-file', 'download')}}},[_vm._t("document-icon",[_c('svg-icon',{attrs:{"name":"document"}})])],2)]):_vm._e()])],1),_c('format-message',{attrs:{"content":_vm.message.content,"users":_vm.roomUsers,"text-formatting":_vm.textFormatting,"link-options":_vm.linkOptions},on:{"open-user-tag":function($event){return _vm.$emit('open-user-tag')}},scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(i,name){return {key:name,fn:function(data){return [_vm._t(name,null,null,data)]}}})],null,true)})],1)}
var MessageImagevue_type_template_id_db8562da_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageImage.vue?vue&type=template&id=db8562da&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageImage.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var MessageImagevue_type_script_lang_js_require = __webpack_require__("bd43"),
    MessageImagevue_type_script_lang_js_isImageFile = MessageImagevue_type_script_lang_js_require.isImageFile;

/* harmony default export */ var MessageImagevue_type_script_lang_js_ = ({
  name: 'MessageImage',
  components: {
    SvgIcon: SvgIcon,
    Loader: Loader,
    FormatMessage: FormatMessage
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    roomUsers: {
      type: Array,
      required: true
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    },
    imageHover: {
      type: Boolean,
      required: true
    }
  },
  data: function data() {
    return {
      imageLoading: false,
      imageResponsive: ''
    };
  },
  computed: {
    isImageLoading: function isImageLoading() {
      return this.message.file.url.indexOf('blob:http') !== -1 || this.imageLoading;
    },
    imageBackground: function imageBackground() {
      return this.isImageLoading ? this.message.file.preview || this.message.file.url : this.message.file.url;
    }
  },
  watch: {
    message: {
      immediate: true,
      handler: function handler() {
        this.checkImgLoad();
      }
    }
  },
  mounted: function mounted() {
    this.imageResponsive = {
      maxHeight: this.$refs.imageRef.clientWidth - 18,
      loaderTop: this.$refs.imageRef.clientWidth / 2
    };
  },
  methods: {
    checkImgLoad: function checkImgLoad() {
      var _this = this;

      if (!MessageImagevue_type_script_lang_js_isImageFile(this.message.file)) return;
      this.imageLoading = true;
      var image = new Image();
      image.src = this.message.file.url;
      image.addEventListener('load', function () {
        return _this.imageLoading = false;
      });
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_MessageImagevue_type_script_lang_js_ = (MessageImagevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageImage.vue?vue&type=style&index=0&lang=scss&
var MessageImagevue_type_style_index_0_lang_scss_ = __webpack_require__("c48f");

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageImage.vue






/* normalize component */

var MessageImage_component = normalizeComponent(
  Message_MessageImagevue_type_script_lang_js_,
  MessageImagevue_type_template_id_db8562da_render,
  MessageImagevue_type_template_id_db8562da_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var MessageImage = (MessageImage_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageActions.vue?vue&type=template&id=e5cea174&
var MessageActionsvue_type_template_id_e5cea174_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vac-message-actions-wrapper"},[_c('div',{staticClass:"vac-options-container",class:{ 'vac-options-image': _vm.isImage && !_vm.message.replyMessage },style:({
			display: _vm.hoverAudioProgress ? 'none' : 'initial',
			width:
				_vm.filteredMessageActions.length && _vm.showReactionEmojis ? '70px' : '45px'
		})},[_c('transition-group',{attrs:{"name":"vac-slide-left"}},[(_vm.isMessageActions || _vm.isMessageReactions)?_c('div',{key:"1",staticClass:"vac-blur-container",class:{
					'vac-options-me': _vm.message.senderId === _vm.currentUserId
				}}):_vm._e(),(_vm.isMessageActions)?_c('div',{key:"2",ref:"actionIcon",staticClass:"vac-svg-button vac-message-options",on:{"click":_vm.openOptions}},[_vm._t("dropdown-icon",[_c('svg-icon',{attrs:{"name":"dropdown","param":"message"}})])],2):_vm._e(),(_vm.isMessageReactions)?_c('emoji-picker',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.closeEmoji),expression:"closeEmoji"}],key:"3",staticClass:"vac-message-emojis",style:({ right: _vm.isMessageActions ? '30px' : '5px' }),attrs:{"emoji-opened":_vm.emojiOpened,"emoji-reaction":true,"room-footer-ref":_vm.roomFooterRef,"position-right":_vm.message.senderId === _vm.currentUserId},on:{"add-emoji":_vm.sendMessageReaction,"open-emoji":_vm.openEmoji},scopedSlots:_vm._u([{key:"emoji-picker-icon",fn:function(){return [_vm._t("emoji-picker-reaction-icon")]},proxy:true}],null,true)}):_vm._e()],1)],1),(_vm.filteredMessageActions.length)?_c('transition',{attrs:{"name":_vm.message.senderId === _vm.currentUserId
				? 'vac-slide-left'
				: 'vac-slide-right'}},[(_vm.optionsOpened)?_c('div',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.closeOptions),expression:"closeOptions"}],ref:"menuOptions",staticClass:"vac-menu-options",class:{
				'vac-menu-left': _vm.message.senderId !== _vm.currentUserId
			},style:({ top: (_vm.menuOptionsTop + "px") })},[_c('div',{staticClass:"vac-menu-list"},_vm._l((_vm.filteredMessageActions),function(action){return _c('div',{key:action.name},[_c('div',{staticClass:"vac-menu-item",on:{"click":function($event){return _vm.messageActionHandler(action)}}},[_vm._v(" "+_vm._s(action.title)+" ")])])}),0)]):_vm._e()]):_vm._e()],1)}
var MessageActionsvue_type_template_id_e5cea174_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageActions.vue?vue&type=template&id=e5cea174&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageActions.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var MessageActionsvue_type_script_lang_js_require = __webpack_require__("bd43"),
    MessageActionsvue_type_script_lang_js_isImageFile = MessageActionsvue_type_script_lang_js_require.isImageFile;

/* harmony default export */ var MessageActionsvue_type_script_lang_js_ = ({
  name: 'MessageActions',
  components: {
    SvgIcon: SvgIcon,
    EmojiPicker: EmojiPicker
  },
  directives: {
    clickOutside: v_click_outside_umd_default.a.directive
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    messageActions: {
      type: Array,
      required: true
    },
    roomFooterRef: {
      type: HTMLDivElement,
      "default": null
    },
    showReactionEmojis: {
      type: Boolean,
      required: true
    },
    hideOptions: {
      type: Boolean,
      required: true
    },
    messageHover: {
      type: Boolean,
      required: true
    },
    hoverMessageId: {
      type: [String, Number],
      "default": null
    },
    hoverAudioProgress: {
      type: Boolean,
      required: true
    }
  },
  data: function data() {
    return {
      menuOptionsTop: 0,
      optionsOpened: false,
      optionsClosing: false,
      emojiOpened: false
    };
  },
  computed: {
    isImage: function isImage() {
      return MessageActionsvue_type_script_lang_js_isImageFile(this.message.file);
    },
    isMessageActions: function isMessageActions() {
      return this.filteredMessageActions.length && this.messageHover && !this.message.deleted && !this.message.disableActions && !this.hoverAudioProgress;
    },
    isMessageReactions: function isMessageReactions() {
      return this.showReactionEmojis && this.messageHover && !this.message.deleted && !this.message.disableReactions && !this.hoverAudioProgress;
    },
    filteredMessageActions: function filteredMessageActions() {
      return this.message.senderId === this.currentUserId ? this.messageActions : this.messageActions.filter(function (message) {
        return !message.onlyMe;
      });
    }
  },
  watch: {
    emojiOpened: function emojiOpened(val) {
      this.$emit('update-emoji-opened', val);
      if (val) this.optionsOpened = false;
    },
    hideOptions: function hideOptions(val) {
      if (val) {
        this.closeEmoji();
        this.closeOptions();
      }
    },
    optionsOpened: function optionsOpened(val) {
      this.$emit('update-options-opened', val);
    }
  },
  methods: {
    openOptions: function openOptions() {
      var _this = this;

      if (this.optionsClosing) return;
      this.optionsOpened = !this.optionsOpened;
      if (!this.optionsOpened) return;
      this.$emit('hide-options', false);
      setTimeout(function () {
        if (!_this.roomFooterRef || !_this.$refs.menuOptions || !_this.$refs.actionIcon) {
          return;
        }

        var menuOptionsTop = _this.$refs.menuOptions.getBoundingClientRect().height;

        var actionIconTop = _this.$refs.actionIcon.getBoundingClientRect().top;

        var roomFooterTop = _this.roomFooterRef.getBoundingClientRect().top;

        var optionsTopPosition = roomFooterTop - actionIconTop > menuOptionsTop + 50;
        if (optionsTopPosition) _this.menuOptionsTop = 30;else _this.menuOptionsTop = -menuOptionsTop;
      });
    },
    closeOptions: function closeOptions() {
      var _this2 = this;

      this.optionsOpened = false;
      this.optionsClosing = true;
      this.updateMessageHover();
      setTimeout(function () {
        return _this2.optionsClosing = false;
      }, 100);
    },
    openEmoji: function openEmoji() {
      this.emojiOpened = !this.emojiOpened;
      this.$emit('hide-options', false);
    },
    closeEmoji: function closeEmoji() {
      this.emojiOpened = false;
      this.updateMessageHover();
    },
    updateMessageHover: function updateMessageHover() {
      if (this.hoverMessageId !== this.message._id) {
        this.$emit('update-message-hover', false);
      }
    },
    messageActionHandler: function messageActionHandler(action) {
      this.closeOptions();
      this.$emit('message-action-handler', action);
    },
    sendMessageReaction: function sendMessageReaction(emoji, reaction) {
      this.$emit('send-message-reaction', {
        emoji: emoji,
        reaction: reaction
      });
      this.closeEmoji();
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageActions.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_MessageActionsvue_type_script_lang_js_ = (MessageActionsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageActions.vue?vue&type=style&index=0&lang=scss&
var MessageActionsvue_type_style_index_0_lang_scss_ = __webpack_require__("7cec");

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageActions.vue






/* normalize component */

var MessageActions_component = normalizeComponent(
  Message_MessageActionsvue_type_script_lang_js_,
  MessageActionsvue_type_template_id_e5cea174_render,
  MessageActionsvue_type_template_id_e5cea174_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var MessageActions = (MessageActions_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"710e1ed1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReactions.vue?vue&type=template&id=87a49e5e&
var MessageReactionsvue_type_template_id_87a49e5e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.message.deleted)?_c('transition-group',{attrs:{"name":"vac-slide-left"}},_vm._l((_vm.message.reactions),function(reaction,key){return _c('button',{directives:[{name:"show",rawName:"v-show",value:(reaction.length),expression:"reaction.length"}],key:key + 0,staticClass:"vac-button-reaction",class:{
			'vac-reaction-me': reaction.indexOf(_vm.currentUserId) !== -1
		},style:({
			float: _vm.message.senderId === _vm.currentUserId ? 'right' : 'left'
		}),on:{"click":function($event){return _vm.sendMessageReaction({ name: key }, reaction)}}},[_vm._v(" "+_vm._s(_vm.getEmojiByName(key))),_c('span',[_vm._v(_vm._s(reaction.length))])])}),0):_vm._e()}
var MessageReactionsvue_type_template_id_87a49e5e_staticRenderFns = []


// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReactions.vue?vue&type=template&id=87a49e5e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReactions.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MessageReactionsvue_type_script_lang_js_ = ({
  name: 'MessageReactions',
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    emojisList: {
      type: Object,
      required: true
    }
  },
  methods: {
    getEmojiByName: function getEmojiByName(emojiName) {
      return this.emojisList[emojiName];
    },
    sendMessageReaction: function sendMessageReaction(emoji, reaction) {
      this.$emit('send-message-reaction', {
        emoji: emoji,
        reaction: reaction
      });
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReactions.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_MessageReactionsvue_type_script_lang_js_ = (MessageReactionsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageReactions.vue?vue&type=style&index=0&lang=scss&
var MessageReactionsvue_type_style_index_0_lang_scss_ = __webpack_require__("e498");

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReactions.vue






/* normalize component */

var MessageReactions_component = normalizeComponent(
  Message_MessageReactionsvue_type_script_lang_js_,
  MessageReactionsvue_type_template_id_87a49e5e_render,
  MessageReactionsvue_type_template_id_87a49e5e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var MessageReactions = (MessageReactions_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/Message.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








var Messagevue_type_script_lang_js_require = __webpack_require__("4c1d"),
    messagesValidation = Messagevue_type_script_lang_js_require.messagesValidation;

var _require2 = __webpack_require__("bd43"),
    Messagevue_type_script_lang_js_isImageFile = _require2.isImageFile,
    Messagevue_type_script_lang_js_isVideoFile = _require2.isVideoFile,
    Messagevue_type_script_lang_js_isAudioFile = _require2.isAudioFile;

/* harmony default export */ var Messagevue_type_script_lang_js_ = ({
  name: 'Message',
  components: {
    SvgIcon: SvgIcon,
    FormatMessage: FormatMessage,
    AudioPlayer: AudioPlayer,
    MessageReply: MessageReply,
    MessageImage: MessageImage,
    MessageActions: MessageActions,
    MessageReactions: MessageReactions
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    textMessages: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    editedMessage: {
      type: Object,
      required: true
    },
    roomUsers: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    messageActions: {
      type: Array,
      required: true
    },
    roomFooterRef: {
      type: HTMLDivElement,
      "default": null
    },
    newMessages: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    showReactionEmojis: {
      type: Boolean,
      required: true
    },
    showNewMessagesDivider: {
      type: Boolean,
      required: true
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    },
    emojisList: {
      type: Object,
      required: true
    },
    hideOptions: {
      type: Boolean,
      required: true
    }
  },
  data: function data() {
    return {
      hoverMessageId: null,
      imageHover: false,
      messageHover: false,
      optionsOpened: false,
      emojiOpened: false,
      newMessage: {},
      progressTime: '- : -',
      hoverAudioProgress: false
    };
  },
  computed: {
    showDate: function showDate() {
      return this.index > 0 && this.message.date !== this.messages[this.index - 1].date;
    },
    messageOffset: function messageOffset() {
      return this.index > 0 && this.message.senderId !== this.messages[this.index - 1].senderId;
    },
    isMessageHover: function isMessageHover() {
      return this.editedMessage._id === this.message._id || this.hoverMessageId === this.message._id;
    },
    isImage: function isImage() {
      return Messagevue_type_script_lang_js_isImageFile(this.message.file);
    },
    isVideo: function isVideo() {
      return Messagevue_type_script_lang_js_isVideoFile(this.message.file);
    },
    isAudio: function isAudio() {
      return Messagevue_type_script_lang_js_isAudioFile(this.message.file);
    },
    isCheckmarkVisible: function isCheckmarkVisible() {
      return this.message.senderId === this.currentUserId && !this.message.deleted && (this.message.saved || this.message.distributed || this.message.seen);
    }
  },
  watch: {
    newMessages: {
      immediate: true,
      handler: function handler(val) {
        if (!val.length || !this.showNewMessagesDivider) {
          return this.newMessage = {};
        }

        this.newMessage = val.reduce(function (res, obj) {
          return obj.index < res.index ? obj : res;
        });
      }
    }
  },
  mounted: function mounted() {
    messagesValidation(this.message);
    this.$emit('message-added', {
      message: this.message,
      index: this.index,
      ref: this.$refs[this.message._id]
    });
  },
  methods: {
    onHoverMessage: function onHoverMessage() {
      this.imageHover = true;
      this.messageHover = true;
      if (this.canEditMessage()) this.hoverMessageId = this.message._id;
    },
    canEditMessage: function canEditMessage() {
      return !this.message.deleted;
    },
    onLeaveMessage: function onLeaveMessage() {
      this.imageHover = false;
      if (!this.optionsOpened && !this.emojiOpened) this.messageHover = false;
      this.hoverMessageId = null;
    },
    openFile: function openFile(action) {
      this.$emit('open-file', {
        message: this.message,
        action: action
      });
    },
    openUserTag: function openUserTag(user) {
      this.$emit('open-user-tag', {
        user: user
      });
    },
    messageActionHandler: function messageActionHandler(action) {
      var _this = this;

      this.messageHover = false;
      this.hoverMessageId = null;
      setTimeout(function () {
        _this.$emit('message-action-handler', {
          action: action,
          message: _this.message
        });
      }, 300);
    },
    sendMessageReaction: function sendMessageReaction(_ref) {
      var emoji = _ref.emoji,
          reaction = _ref.reaction;
      this.$emit('send-message-reaction', {
        messageId: this.message._id,
        reaction: emoji,
        remove: reaction && reaction.indexOf(this.currentUserId) !== -1
      });
      this.messageHover = false;
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Message/Message.vue?vue&type=script&lang=js&
 /* harmony default export */ var Message_Messagevue_type_script_lang_js_ = (Messagevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Message/Message.vue?vue&type=style&index=0&lang=scss&
var Messagevue_type_style_index_0_lang_scss_ = __webpack_require__("2a92");

// CONCATENATED MODULE: ./src/ChatWindow/Message/Message.vue






/* normalize component */

var Message_component = normalizeComponent(
  Message_Messagevue_type_script_lang_js_,
  Messagevue_type_template_id_916bd03c_render,
  Messagevue_type_template_id_916bd03c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Message = (Message_component.exports);
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js


function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.bind.js
var es6_function_bind = __webpack_require__("d92a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.typed.int8-array.js
var es6_typed_int8_array = __webpack_require__("b05c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.date.now.js
var es6_date_now = __webpack_require__("78ce");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.typed.float32-array.js
var es6_typed_float32_array = __webpack_require__("63d9");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.typed.int16-array.js
var es6_typed_int16_array = __webpack_require__("15ac");

// CONCATENATED MODULE: ./src/utils/mp3-encoder.js






// Credits to https://github.com/grishkovelli/vue-audio-recorder
var lamejs;

try {
  lamejs = __webpack_require__("db18");
} catch (_) {
  lamejs = {
    missing: true
  };
}

var _lamejs = lamejs,
    Mp3Encoder = _lamejs.Mp3Encoder;

var mp3_encoder_default = /*#__PURE__*/function () {
  function _default(config) {
    _classCallCheck(this, _default);

    if (lamejs.missing) {
      throw new Error('You must add lamejs in your dependencies to use the audio recorder. Please run "npm install lamejs --save"');
    }

    this.bitRate = config.bitRate;
    this.sampleRate = config.sampleRate;
    this.dataBuffer = [];
    this.encoder = new Mp3Encoder(1, this.sampleRate, this.bitRate);
  }

  _createClass(_default, [{
    key: "encode",
    value: function encode(arrayBuffer) {
      var maxSamples = 1152;

      var samples = this._convertBuffer(arrayBuffer);

      var remaining = samples.length;

      for (var i = 0; remaining >= 0; i += maxSamples) {
        var left = samples.subarray(i, i + maxSamples);
        var buffer = this.encoder.encodeBuffer(left);
        this.dataBuffer.push(new Int8Array(buffer));
        remaining -= maxSamples;
      }
    }
  }, {
    key: "finish",
    value: function finish() {
      this.dataBuffer.push(this.encoder.flush());
      var blob = new Blob(this.dataBuffer, {
        type: 'audio/mp3'
      });
      this.dataBuffer = [];
      return {
        id: Date.now(),
        blob: blob,
        url: URL.createObjectURL(blob)
      };
    }
  }, {
    key: "_floatTo16BitPCM",
    value: function _floatTo16BitPCM(input, output) {
      for (var i = 0; i < input.length; i++) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
    }
  }, {
    key: "_convertBuffer",
    value: function _convertBuffer(arrayBuffer) {
      var data = new Float32Array(arrayBuffer);
      var out = new Int16Array(arrayBuffer.length);

      this._floatTo16BitPCM(data, out);

      return out;
    }
  }]);

  return _default;
}();


// CONCATENATED MODULE: ./src/utils/recorder.js




// Credits to https://github.com/grishkovelli/vue-audio-recorder


var recorder_default = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    this.beforeRecording = options.beforeRecording;
    this.pauseRecording = options.pauseRecording;
    this.afterRecording = options.afterRecording;
    this.micFailed = options.micFailed;
    this.encoderOptions = {
      bitRate: 128,
      sampleRate: 44100
    };
    this.bufferSize = 4096;
    this.records = [];
    this.isPause = false;
    this.isRecording = false;
    this.duration = 0;
    this.volume = 0;
    this._duration = 0;
  }

  _createClass(_default, [{
    key: "start",
    value: function start() {
      var constraints = {
        video: false,
        audio: {
          channelCount: 1,
          echoCancellation: false
        }
      };
      this.beforeRecording && this.beforeRecording('start recording');
      navigator.mediaDevices.getUserMedia(constraints).then(this._micCaptured.bind(this))["catch"](this._micError.bind(this));
      this.isPause = false;
      this.isRecording = true;

      if (!this.lameEncoder) {
        this.lameEncoder = new mp3_encoder_default(this.encoderOptions);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stream.getTracks().forEach(function (track) {
        return track.stop();
      });
      this.input.disconnect();
      this.processor.disconnect();
      this.context.close();
      var record = null;
      record = this.lameEncoder.finish();
      record.duration = this.duration;
      this.records.push(record);
      this._duration = 0;
      this.duration = 0;
      this.isPause = false;
      this.isRecording = false;
      this.afterRecording && this.afterRecording(record);
    }
  }, {
    key: "pause",
    value: function pause() {
      this.stream.getTracks().forEach(function (track) {
        return track.stop();
      });
      this.input.disconnect();
      this.processor.disconnect();
      this._duration = this.duration;
      this.isPause = true;
      this.pauseRecording && this.pauseRecording('pause recording');
    }
  }, {
    key: "_micCaptured",
    value: function _micCaptured(stream) {
      var _this = this;

      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.duration = this._duration;
      this.input = this.context.createMediaStreamSource(stream);
      this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1);
      this.stream = stream;

      this.processor.onaudioprocess = function (ev) {
        var sample = ev.inputBuffer.getChannelData(0);
        var sum = 0.0;

        if (_this.lameEncoder) {
          _this.lameEncoder.encode(sample);
        }

        for (var i = 0; i < sample.length; ++i) {
          sum += sample[i] * sample[i];
        }

        _this.duration = parseFloat(_this._duration) + parseFloat(_this.context.currentTime.toFixed(2));
        _this.volume = Math.sqrt(sum / sample.length).toFixed(2);
      };

      this.input.connect(this.processor);
      this.processor.connect(this.context.destination);
    }
  }, {
    key: "_micError",
    value: function _micError(error) {
      this.micFailed && this.micFailed(error);
    }
  }]);

  return _default;
}();


// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/Room.vue?vue&type=script&lang=js&


















//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//














var Roomvue_type_script_lang_js_require = __webpack_require__("1a98"),
    detectMobile = Roomvue_type_script_lang_js_require.detectMobile,
    iOSDevice = Roomvue_type_script_lang_js_require.iOSDevice;

var Roomvue_type_script_lang_js_require2 = __webpack_require__("bd43"),
    Roomvue_type_script_lang_js_isImageFile = Roomvue_type_script_lang_js_require2.isImageFile,
    Roomvue_type_script_lang_js_isVideoFile = Roomvue_type_script_lang_js_require2.isVideoFile;

/* harmony default export */ var Roomvue_type_script_lang_js_ = ({
  name: 'Room',
  components: {
    InfiniteLoading: vue_infinite_loading_default.a,
    Loader: Loader,
    SvgIcon: SvgIcon,
    EmojiPicker: EmojiPicker,
    RoomHeader: RoomHeader,
    RoomMessageReply: RoomMessageReply,
    RoomUsersTag: RoomUsersTag,
    RoomEmojis: RoomEmojis,
    Message: Message
  },
  directives: {
    clickOutside: v_click_outside_umd_default.a.directive
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    textMessages: {
      type: Object,
      required: true
    },
    singleRoom: {
      type: Boolean,
      required: true
    },
    showRoomsList: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    rooms: {
      type: Array,
      required: true
    },
    roomId: {
      type: [String, Number],
      required: true
    },
    loadFirstRoom: {
      type: Boolean,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    roomMessage: {
      type: String,
      "default": null
    },
    messagesLoaded: {
      type: Boolean,
      required: true
    },
    menuActions: {
      type: Array,
      required: true
    },
    messageActions: {
      type: Array,
      required: true
    },
    showSendIcon: {
      type: Boolean,
      required: true
    },
    showFiles: {
      type: Boolean,
      required: true
    },
    showAudio: {
      type: Boolean,
      required: true
    },
    showEmojis: {
      type: Boolean,
      required: true
    },
    showReactionEmojis: {
      type: Boolean,
      required: true
    },
    showNewMessagesDivider: {
      type: Boolean,
      required: true
    },
    showFooter: {
      type: Boolean,
      required: true
    },
    acceptedFiles: {
      type: String,
      required: true
    },
    textFormatting: {
      type: Boolean,
      required: true
    },
    linkOptions: {
      type: Object,
      required: true
    },
    loadingRooms: {
      type: Boolean,
      required: true
    },
    roomInfo: {
      type: Function,
      "default": null
    },
    textareaAction: {
      type: Function,
      "default": null
    }
  },
  data: function data() {
    return {
      message: '',
      editedMessage: {},
      messageReply: null,
      infiniteState: null,
      loadingMessages: false,
      loadingMoreMessages: false,
      file: null,
      imageFile: null,
      videoFile: null,
      mediaDimensions: null,
      fileDialog: false,
      emojiOpened: false,
      hideOptions: true,
      scrollIcon: false,
      scrollMessagesCount: 0,
      newMessages: [],
      keepKeyboardOpen: false,
      filteredEmojis: [],
      filteredUsersTag: [],
      selectedUsersTag: [],
      textareaCursorPosition: null,
      cursorRangePosition: null,
      recorder: this.initRecorder(),
      isRecording: false,
      format: 'mp3'
    };
  },
  computed: {
    emojisList: function emojisList() {
      var emojisTable = Object.keys(emojis).map(function (key) {
        return emojis[key];
      });
      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(emojisTable)));
    },
    room: function room() {
      var _this = this;

      return this.rooms.find(function (room) {
        return room.roomId === _this.roomId;
      }) || {};
    },
    showNoMessages: function showNoMessages() {
      return this.room.roomId && !this.messages.length && !this.loadingMessages && !this.loadingRooms;
    },
    showNoRoom: function showNoRoom() {
      var noRoomSelected = !this.rooms.length && !this.loadingRooms || !this.room.roomId && !this.loadFirstRoom;

      if (noRoomSelected) {
        this.loadingMessages = false;
        /* eslint-disable-line vue/no-side-effects-in-computed-properties */
      }

      return noRoomSelected;
    },
    showMessagesStarted: function showMessagesStarted() {
      return this.messages.length && this.messagesLoaded;
    },
    isMessageEmpty: function isMessageEmpty() {
      return !this.file && !this.message.trim();
    },
    recordedTime: function recordedTime() {
      return new Date(this.recorder.duration * 1000).toISOString().substr(14, 5);
    }
  },
  watch: {
    loadingMessages: function loadingMessages(val) {
      if (val) {
        this.infiniteState = null;
      } else {
        if (this.infiniteState) this.infiniteState.loaded();
        this.focusTextarea(true);
      }
    },
    room: {
      immediate: true,
      handler: function handler(newVal, oldVal) {
        if (newVal.roomId && (!oldVal || newVal.roomId !== oldVal.roomId)) {
          this.onRoomChanged();
        }
      }
    },
    roomMessage: {
      immediate: true,
      handler: function handler(val) {
        if (val) this.message = this.roomMessage;
      }
    },
    messages: function messages(newVal, oldVal) {
      var _this2 = this;

      newVal.forEach(function (message, i) {
        if (_this2.showNewMessagesDivider && !message.seen && message.senderId !== _this2.currentUserId) {
          _this2.newMessages.push({
            _id: message._id,
            index: i
          });
        }
      });

      if ((oldVal === null || oldVal === void 0 ? void 0 : oldVal.length) === (newVal === null || newVal === void 0 ? void 0 : newVal.length) - 1) {
        this.newMessages = [];
      }

      if (this.infiniteState) {
        this.infiniteState.loaded();
      }

      setTimeout(function () {
        return _this2.loadingMoreMessages = false;
      });
    },
    messagesLoaded: function messagesLoaded(val) {
      if (val) this.loadingMessages = false;
      if (this.infiniteState) this.infiniteState.complete();
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    this.newMessages = [];
    var isMobile = detectMobile();
    window.addEventListener('keyup', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !_this3.fileDialog) {
        if (isMobile) {
          _this3.message = _this3.message + '\n';
          setTimeout(function () {
            return _this3.onChangeInput();
          });
        } else {
          _this3.sendMessage();
        }
      }

      _this3.updateFooterList('@');

      _this3.updateFooterList(':');
    });
    this.$refs['roomTextarea'].addEventListener('click', function () {
      if (isMobile) _this3.keepKeyboardOpen = true;

      _this3.updateFooterList('@');

      _this3.updateFooterList(':');
    });
    this.$refs['roomTextarea'].addEventListener('blur', function () {
      _this3.resetFooterList();

      if (isMobile) setTimeout(function () {
        return _this3.keepKeyboardOpen = false;
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.stopRecorder();
  },
  methods: {
    onRoomChanged: function onRoomChanged() {
      var _this4 = this;

      this.loadingMessages = true;
      this.scrollIcon = false;
      this.scrollMessagesCount = 0;
      this.resetMessage(true, null, true);

      if (this.roomMessage) {
        this.message = this.roomMessage;
        setTimeout(function () {
          return _this4.onChangeInput();
        });
      }

      if (!this.messages.length && this.messagesLoaded) {
        this.loadingMessages = false;
      }

      var unwatch = this.$watch(function () {
        return _this4.messages;
      }, function (val) {
        if (!val || !val.length) return;
        var element = _this4.$refs.scrollContainer;
        if (!element) return;
        unwatch();
        setTimeout(function () {
          element.scrollTo({
            top: element.scrollHeight
          });
          _this4.loadingMessages = false;
        });
      });
    },
    onMessageAdded: function onMessageAdded(_ref) {
      var _this5 = this;

      var message = _ref.message,
          index = _ref.index,
          ref = _ref.ref;
      if (index !== this.messages.length - 1) return;
      var autoScrollOffset = ref.offsetHeight + 60;
      setTimeout(function () {
        if (_this5.getBottomScroll(_this5.$refs.scrollContainer) < autoScrollOffset) {
          _this5.scrollToBottom();
        } else {
          if (message.senderId === _this5.currentUserId) {
            _this5.scrollToBottom();
          } else {
            _this5.scrollIcon = true;
            _this5.scrollMessagesCount++;
          }
        }
      });
    },
    onContainerScroll: function onContainerScroll(e) {
      this.hideOptions = true;
      if (!e.target) return;
      var bottomScroll = this.getBottomScroll(e.target);
      if (bottomScroll < 60) this.scrollMessagesCount = 0;
      this.scrollIcon = bottomScroll > 500 || this.scrollMessagesCount;
    },
    updateFooterList: function updateFooterList(tagChar) {
      if (!this.$refs['roomTextarea']) return;

      if (tagChar === '@' && (!this.room.users || this.room.users.length <= 2)) {
        return;
      }

      if (this.textareaCursorPosition === this.$refs['roomTextarea'].selectionStart) {
        return;
      }

      this.textareaCursorPosition = this.$refs['roomTextarea'].selectionStart;
      var position = this.textareaCursorPosition;

      while (position > 0 && this.message.charAt(position - 1) !== tagChar && this.message.charAt(position - 1) !== ' ') {
        position--;
      }

      var beforeTag = this.message.charAt(position - 2);
      var notLetterNumber = !beforeTag.match(/^[0-9a-zA-Z]+$/);

      if (this.message.charAt(position - 1) === tagChar && (!beforeTag || beforeTag === ' ' || notLetterNumber)) {
        var query = this.message.substring(position, this.textareaCursorPosition);

        if (tagChar === ':') {
          this.updateEmojis(query);
        } else if (tagChar === '@') {
          this.updateShowUsersTag(query);
        }
      } else {
        this.resetFooterList();
      }
    },
    getCharPosition: function getCharPosition(tagChar) {
      var cursorPosition = this.$refs['roomTextarea'].selectionStart;
      var position = cursorPosition;

      while (position > 0 && this.message.charAt(position - 1) !== tagChar) {
        position--;
      }

      var endPosition = position;

      while (this.message.charAt(endPosition) && this.message.charAt(endPosition).trim()) {
        endPosition++;
      }

      return {
        position: position,
        endPosition: endPosition
      };
    },
    updateEmojis: function updateEmojis(query) {
      var _this6 = this;

      if (!query) return;
      var emojisListKeys = Object.keys(this.emojisList);
      var matchingKeys = emojisListKeys.filter(function (key) {
        return key.startsWith(query);
      });
      this.filteredEmojis = matchingKeys.map(function (key) {
        return _this6.emojisList[key];
      });
    },
    selectEmoji: function selectEmoji(emoji) {
      var _this$getCharPosition = this.getCharPosition(':'),
          position = _this$getCharPosition.position,
          endPosition = _this$getCharPosition.endPosition;

      this.message = this.message.substr(0, position - 1) + emoji + this.message.substr(endPosition, this.message.length - 1);
      this.cursorRangePosition = position;
      this.focusTextarea();
    },
    updateShowUsersTag: function updateShowUsersTag(query) {
      var _this7 = this;

      this.filteredUsersTag = filter_items(this.room.users, 'username', query, true).filter(function (user) {
        return user._id !== _this7.currentUserId;
      });
    },
    selectUserTag: function selectUserTag(user) {
      var _this$getCharPosition2 = this.getCharPosition('@'),
          position = _this$getCharPosition2.position,
          endPosition = _this$getCharPosition2.endPosition;

      var space = this.message.substr(endPosition, endPosition).length ? '' : ' ';
      this.message = this.message.substr(0, position) + user.username + space + this.message.substr(endPosition, this.message.length - 1);
      this.selectedUsersTag = [].concat(_toConsumableArray(this.selectedUsersTag), [_objectSpread2({}, user)]);
      this.cursorRangePosition = position + user.username.length + space.length + 1;
      this.focusTextarea();
    },
    resetFooterList: function resetFooterList() {
      this.filteredEmojis = [];
      this.filteredUsersTag = [];
      this.textareaCursorPosition = null;
    },
    onMediaLoad: function onMediaLoad() {
      var height = this.$refs.mediaFile.clientHeight;
      if (height < 30) height = 30;
      this.mediaDimensions = {
        height: this.$refs.mediaFile.clientHeight - 10,
        width: this.$refs.mediaFile.clientWidth + 26
      };
    },
    escapeTextarea: function escapeTextarea() {
      if (this.filteredEmojis.length) this.filteredEmojis = [];else if (this.filteredUsersTag.length) this.filteredUsersTag = [];else this.resetMessage();
    },
    resetMessage: function resetMessage() {
      var _this8 = this;

      var disableMobileFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var editFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var initRoom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!initRoom) {
        this.$emit('typing-message', null);
      }

      if (editFile) {
        this.file = null;
        this.message = '';
        this.preventKeyboardFromClosing();
        setTimeout(function () {
          return _this8.focusTextarea(disableMobileFocus);
        });
        return;
      }

      this.selectedUsersTag = [];
      this.resetFooterList();
      this.resetTextareaSize();
      this.message = '';
      this.editedMessage = {};
      this.messageReply = null;
      this.file = null;
      this.mediaDimensions = null;
      this.imageFile = null;
      this.videoFile = null;
      this.emojiOpened = false;
      this.preventKeyboardFromClosing();
      setTimeout(function () {
        return _this8.focusTextarea(disableMobileFocus);
      });
    },
    resetMediaFile: function resetMediaFile() {
      this.mediaDimensions = null;
      this.imageFile = null;
      this.videoFile = null;
      this.editedMessage.file = null;
      this.file = null;
      this.focusTextarea();
    },
    resetTextareaSize: function resetTextareaSize() {
      if (!this.$refs['roomTextarea']) return;
      this.$refs['roomTextarea'].style.height = '20px';
    },
    focusTextarea: function focusTextarea(disableMobileFocus) {
      var _this9 = this;

      if (detectMobile() && disableMobileFocus) return;
      if (!this.$refs['roomTextarea']) return;
      this.$refs['roomTextarea'].focus();

      if (this.cursorRangePosition) {
        setTimeout(function () {
          _this9.$refs['roomTextarea'].setSelectionRange(_this9.cursorRangePosition, _this9.cursorRangePosition);

          _this9.cursorRangePosition = null;
        });
      }
    },
    preventKeyboardFromClosing: function preventKeyboardFromClosing() {
      if (this.keepKeyboardOpen) this.$refs['roomTextarea'].focus();
    },
    sendMessage: function sendMessage() {
      var message = this.message.trim();
      if (!this.file && !message) return;
      this.selectedUsersTag.forEach(function (user) {
        message = message.replace("@".concat(user.username), "<usertag>".concat(user._id, "</usertag>"));
      });

      if (this.editedMessage._id) {
        if (this.editedMessage.content !== message || this.file) {
          this.$emit('edit-message', {
            messageId: this.editedMessage._id,
            newContent: message,
            file: this.file,
            replyMessage: this.messageReply,
            usersTag: this.selectedUsersTag
          });
        }
      } else {
        this.$emit('send-message', {
          content: message,
          file: this.file,
          replyMessage: this.messageReply,
          usersTag: this.selectedUsersTag
        });
      }

      this.resetMessage(true);
    },
    loadMoreMessages: function loadMoreMessages(infiniteState) {
      var _this10 = this;

      if (this.loadingMessages) {
        this.infiniteState = infiniteState;
        return;
      }

      setTimeout(function () {
        if (_this10.loadingMoreMessages) return;

        if (_this10.messagesLoaded || !_this10.room.roomId) {
          return infiniteState.complete();
        }

        _this10.infiniteState = infiniteState;

        _this10.$emit('fetch-messages');

        _this10.loadingMoreMessages = true;
      }, // prevent scroll bouncing issue on iOS devices
      iOSDevice() ? 500 : 0);
    },
    messageActionHandler: function messageActionHandler(_ref2) {
      var action = _ref2.action,
          message = _ref2.message;

      switch (action.name) {
        case 'replyMessage':
          return this.replyMessage(message);

        case 'editMessage':
          return this.editMessage(message);

        case 'deleteMessage':
          return this.$emit('delete-message', message);

        default:
          return this.$emit('message-action-handler', {
            action: action,
            message: message
          });
      }
    },
    sendMessageReaction: function sendMessageReaction(messageReaction) {
      this.$emit('send-message-reaction', messageReaction);
    },
    replyMessage: function replyMessage(message) {
      this.messageReply = message;
      this.focusTextarea();
    },
    editMessage: function editMessage(message) {
      var _this11 = this;

      this.resetMessage();
      this.editedMessage = _objectSpread2({}, message);
      this.file = message.file;

      if (Roomvue_type_script_lang_js_isImageFile(this.file)) {
        this.imageFile = message.file.url;
        setTimeout(function () {
          return _this11.onMediaLoad();
        });
      } else if (Roomvue_type_script_lang_js_isVideoFile(this.file)) {
        this.videoFile = message.file.url;
        setTimeout(function () {
          return _this11.onMediaLoad();
        }, 50);
      }

      this.message = message.content;
    },
    getBottomScroll: function getBottomScroll(element) {
      var scrollHeight = element.scrollHeight,
          clientHeight = element.clientHeight,
          scrollTop = element.scrollTop;
      return scrollHeight - clientHeight - scrollTop;
    },
    scrollToBottom: function scrollToBottom() {
      var _this12 = this;

      setTimeout(function () {
        var element = _this12.$refs.scrollContainer;
        element.classList.add('vac-scroll-smooth');
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        });
        setTimeout(function () {
          return element.classList.remove('vac-scroll-smooth');
        });
      }, 50);
    },
    onChangeInput: function onChangeInput() {
      this.keepKeyboardOpen = true;
      this.resizeTextarea();
      this.$emit('typing-message', this.message);
    },
    resizeTextarea: function resizeTextarea() {
      var el = this.$refs['roomTextarea'];
      if (!el) return;
      var padding = window.getComputedStyle(el, null).getPropertyValue('padding-top').replace('px', '');
      el.style.height = 0;
      el.style.height = el.scrollHeight - padding * 2 + 'px';
    },
    addEmoji: function addEmoji(emoji) {
      this.message += emoji.icon;
      this.focusTextarea(true);
    },
    launchFilePicker: function launchFilePicker() {
      this.$refs.file.value = '';
      this.$refs.file.click();
    },
    onFileChange: function onFileChange(files) {
      var _this13 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var file, fileURL, blobFile, typeIndex;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this13.fileDialog = true;

                _this13.resetMediaFile();

                file = files[0];
                fileURL = URL.createObjectURL(file);
                _context.next = 6;
                return fetch(fileURL).then(function (res) {
                  return res.blob();
                });

              case 6:
                blobFile = _context.sent;
                typeIndex = file.name.lastIndexOf('.');
                _this13.file = {
                  blob: blobFile,
                  name: file.name.substring(0, typeIndex),
                  size: file.size,
                  type: file.type,
                  extension: file.name.substring(typeIndex + 1),
                  localUrl: fileURL
                };

                if (Roomvue_type_script_lang_js_isImageFile(_this13.file)) {
                  _this13.imageFile = fileURL;
                } else if (Roomvue_type_script_lang_js_isVideoFile(_this13.file)) {
                  _this13.videoFile = fileURL;
                  setTimeout(function () {
                    return _this13.onMediaLoad();
                  }, 50);
                } else {
                  _this13.message = file.name;
                }

                setTimeout(function () {
                  return _this13.fileDialog = false;
                }, 500);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    initRecorder: function initRecorder() {
      this.isRecording = false;
      return new recorder_default({
        beforeRecording: null,
        afterRecording: null,
        pauseRecording: null,
        micFailed: this.micFailed
      });
    },
    micFailed: function micFailed() {
      this.isRecording = false;
      this.recorder = this.initRecorder();
    },
    toggleRecorder: function toggleRecorder(recording) {
      var _this14 = this;

      this.isRecording = recording;

      if (!this.recorder.isRecording) {
        setTimeout(function () {
          return _this14.recorder.start();
        }, 200);
      } else {
        try {
          this.recorder.stop();
          var record = this.recorder.records[0];
          this.file = {
            blob: record.blob,
            name: "audio.".concat(this.format),
            size: record.blob.size,
            duration: record.duration,
            type: record.blob.type,
            audio: true,
            localUrl: URL.createObjectURL(record.blob)
          };
          this.recorder = this.initRecorder();
          this.sendMessage();
        } catch (_unused) {
          setTimeout(function () {
            return _this14.stopRecorder();
          }, 100);
        }
      }
    },
    stopRecorder: function stopRecorder() {
      var _this15 = this;

      if (this.recorder.isRecording) {
        try {
          this.recorder.stop();
          this.recorder = this.initRecorder();
        } catch (_unused2) {
          setTimeout(function () {
            return _this15.stopRecorder();
          }, 100);
        }
      }
    },
    openFile: function openFile(_ref3) {
      var message = _ref3.message,
          action = _ref3.action;
      this.$emit('open-file', {
        message: message,
        action: action
      });
    },
    openUserTag: function openUserTag(user) {
      this.$emit('open-user-tag', user);
    },
    textareaActionHandler: function textareaActionHandler() {
      this.$emit('textarea-action-handler', this.message);
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Room/Room.vue?vue&type=script&lang=js&
 /* harmony default export */ var Room_Roomvue_type_script_lang_js_ = (Roomvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Room/Room.vue?vue&type=style&index=0&lang=scss&
var Roomvue_type_style_index_0_lang_scss_ = __webpack_require__("a6d4");

// CONCATENATED MODULE: ./src/ChatWindow/Room/Room.vue






/* normalize component */

var Room_component = normalizeComponent(
  Room_Roomvue_type_script_lang_js_,
  Roomvue_type_template_id_1a1a6e46_render,
  Roomvue_type_template_id_1a1a6e46_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Room = (Room_component.exports);
// CONCATENATED MODULE: ./src/locales/index.js
/* harmony default export */ var locales = ({
  ROOMS_EMPTY: 'No rooms',
  ROOM_EMPTY: 'No room selected',
  NEW_MESSAGES: 'New Messages',
  MESSAGE_DELETED: 'This message was deleted',
  MESSAGES_EMPTY: 'No messages',
  CONVERSATION_STARTED: 'Conversation started on:',
  TYPE_MESSAGE: 'Type message',
  SEARCH: 'Search',
  IS_ONLINE: 'is online',
  LAST_SEEN: 'last seen ',
  IS_TYPING: 'is writing...'
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.search.js
var es6_regexp_search = __webpack_require__("386d");

// CONCATENATED MODULE: ./src/themes/index.js

var defaultThemeStyles = {
  light: {
    general: {
      color: '#0a0a0a',
      backgroundInput: '#fff',
      colorPlaceholder: '#9ca6af',
      colorCaret: '#1976d2',
      colorSpinner: '#333',
      borderStyle: '1px solid #e1e4e8',
      backgroundScrollIcon: '#fff'
    },
    container: {
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
    },
    header: {
      background: '#fff',
      colorRoomName: '#0a0a0a',
      colorRoomInfo: '#9ca6af'
    },
    footer: {
      background: '#f8f9fa',
      borderStyleInput: '1px solid #e1e4e8',
      borderInputSelected: '#1976d2',
      backgroundReply: '#e5e5e6',
      backgroundTagActive: '#e5e5e6'
    },
    content: {
      background: '#f8f9fa'
    },
    sidemenu: {
      background: '#fff',
      backgroundHover: '#f6f6f6',
      backgroundActive: '#e5effa',
      colorActive: '#1976d2',
      borderColorSearch: '#e1e5e8'
    },
    dropdown: {
      background: '#fff',
      backgroundHover: '#f6f6f6'
    },
    message: {
      background: '#fff',
      backgroundMe: '#ccf2cf',
      color: '#0a0a0a',
      colorStarted: '#9ca6af',
      backgroundDeleted: '#dadfe2',
      colorDeleted: '#757e85',
      colorUsername: '#9ca6af',
      colorTimestamp: '#828c94',
      backgroundDate: '#e5effa',
      colorDate: '#505a62',
      backgroundSystem: '#e5effa',
      colorSystem: '#505a62',
      backgroundMedia: 'rgba(0, 0, 0, 0.15)',
      backgroundReply: 'rgba(0, 0, 0, 0.08)',
      colorReplyUsername: '#0a0a0a',
      colorReply: '#6e6e6e',
      colorTag: '#0d579c',
      backgroundImage: '#ddd',
      colorNewMessages: '#1976d2',
      backgroundScrollCounter: '#0696c7',
      colorScrollCounter: '#fff',
      backgroundReaction: '#eee',
      borderStyleReaction: '1px solid #eee',
      backgroundReactionHover: '#fff',
      borderStyleReactionHover: '1px solid #ddd',
      colorReactionCounter: '#0a0a0a',
      backgroundReactionMe: '#cfecf5',
      borderStyleReactionMe: '1px solid #3b98b8',
      backgroundReactionHoverMe: '#cfecf5',
      borderStyleReactionHoverMe: '1px solid #3b98b8',
      colorReactionCounterMe: '#0b59b3',
      backgroundAudioRecord: '#eb4034',
      backgroundAudioLine: 'rgba(0, 0, 0, 0.15)',
      backgroundAudioProgress: '#455247',
      backgroundAudioProgressSelector: '#455247'
    },
    markdown: {
      background: 'rgba(239, 239, 239, 0.7)',
      border: 'rgba(212, 212, 212, 0.9)',
      color: '#e01e5a',
      colorMulti: '#0a0a0a'
    },
    room: {
      colorUsername: '#0a0a0a',
      colorMessage: '#67717a',
      colorTimestamp: '#a2aeb8',
      colorStateOnline: '#4caf50',
      colorStateOffline: '#9ca6af',
      backgroundCounterBadge: '#0696c7',
      colorCounterBadge: '#fff'
    },
    emoji: {
      background: '#fff'
    },
    icons: {
      search: '#9ca6af',
      add: '#1976d2',
      toggle: '#0a0a0a',
      menu: '#0a0a0a',
      close: '#9ca6af',
      closeImage: '#fff',
      file: '#1976d2',
      paperclip: '#1976d2',
      closeOutline: '#000',
      send: '#1976d2',
      sendDisabled: '#9ca6af',
      emoji: '#1976d2',
      emojiReaction: 'rgba(0, 0, 0, 0.3)',
      document: '#1976d2',
      pencil: '#9e9e9e',
      checkmark: '#9e9e9e',
      checkmarkSeen: '#0696c7',
      eye: '#fff',
      dropdownMessage: '#fff',
      dropdownMessageBackground: 'rgba(0, 0, 0, 0.25)',
      dropdownRoom: '#9e9e9e',
      dropdownScroll: '#0a0a0a',
      microphone: '#1976d2',
      audioPlay: '#455247',
      audioPause: '#455247',
      audioCancel: '#eb4034',
      audioConfirm: '#1ba65b'
    }
  },
  dark: {
    general: {
      color: '#fff',
      backgroundInput: '#202223',
      colorPlaceholder: '#596269',
      colorCaret: '#fff',
      colorSpinner: '#fff',
      borderStyle: 'none',
      backgroundScrollIcon: '#fff'
    },
    container: {
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
    },
    header: {
      background: '#181a1b',
      colorRoomName: '#fff',
      colorRoomInfo: '#9ca6af'
    },
    footer: {
      background: '#131415',
      borderStyleInput: 'none',
      borderInputSelected: '#1976d2',
      backgroundReply: '#1b1c1c',
      backgroundTagActive: '#1b1c1c'
    },
    content: {
      background: '#131415'
    },
    sidemenu: {
      background: '#181a1b',
      backgroundHover: '#202224',
      backgroundActive: '#151617',
      colorActive: '#fff',
      borderColorSearch: '#181a1b'
    },
    dropdown: {
      background: '#2a2c33',
      backgroundHover: '#26282e'
    },
    message: {
      background: '#22242a',
      backgroundMe: '#1f7e80',
      color: '#fff',
      colorStarted: '#9ca6af',
      backgroundDeleted: '#1b1c21',
      colorDeleted: '#a2a5a8',
      colorUsername: '#b3bac9',
      colorTimestamp: '#ebedf2',
      backgroundDate: 'rgba(0, 0, 0, 0.3)',
      colorDate: '#bec5cc',
      backgroundSystem: 'rgba(0, 0, 0, 0.3)',
      colorSystem: '#bec5cc',
      backgroundMedia: 'rgba(0, 0, 0, 0.18)',
      backgroundReply: 'rgba(0, 0, 0, 0.18)',
      colorReplyUsername: '#fff',
      colorReply: '#d6d6d6',
      colorTag: '#f0c60a',
      backgroundImage: '#ddd',
      colorNewMessages: '#fff',
      backgroundScrollCounter: '#1976d2',
      colorScrollCounter: '#fff',
      backgroundReaction: 'none',
      borderStyleReaction: 'none',
      backgroundReactionHover: '#202223',
      borderStyleReactionHover: 'none',
      colorReactionCounter: '#fff',
      backgroundReactionMe: '#4e9ad1',
      borderStyleReactionMe: 'none',
      backgroundReactionHoverMe: '#4e9ad1',
      borderStyleReactionHoverMe: 'none',
      colorReactionCounterMe: '#fff',
      backgroundAudioRecord: '#eb4034',
      backgroundAudioLine: 'rgba(255, 255, 255, 0.15)',
      backgroundAudioProgress: '#b7d4d3',
      backgroundAudioProgressSelector: '#b7d4d3'
    },
    markdown: {
      background: 'rgba(239, 239, 239, 0.7)',
      border: 'rgba(212, 212, 212, 0.9)',
      color: '#e01e5a',
      colorMulti: '#0a0a0a'
    },
    room: {
      colorUsername: '#fff',
      colorMessage: '#6c7278',
      colorTimestamp: '#6c7278',
      colorStateOnline: '#4caf50',
      colorStateOffline: '#596269',
      backgroundCounterBadge: '#1976d2',
      colorCounterBadge: '#fff'
    },
    emoji: {
      background: '#343740'
    },
    icons: {
      search: '#596269',
      add: '#fff',
      toggle: '#fff',
      menu: '#fff',
      close: '#9ca6af',
      closeImage: '#fff',
      file: '#1976d2',
      paperclip: '#fff',
      closeOutline: '#fff',
      send: '#fff',
      sendDisabled: '#646a70',
      emoji: '#fff',
      emojiReaction: '#fff',
      document: '#1976d2',
      pencil: '#ebedf2',
      checkmark: '#ebedf2',
      checkmarkSeen: '#f0d90a',
      eye: '#fff',
      dropdownMessage: '#fff',
      dropdownMessageBackground: 'rgba(0, 0, 0, 0.25)',
      dropdownRoom: '#fff',
      dropdownScroll: '#0a0a0a',
      microphone: '#fff',
      audioPlay: '#b7d4d3',
      audioPause: '#b7d4d3',
      audioCancel: '#eb4034',
      audioConfirm: '#1ba65b'
    }
  }
};
var cssThemeVars = function cssThemeVars(_ref) {
  var general = _ref.general,
      container = _ref.container,
      header = _ref.header,
      footer = _ref.footer,
      sidemenu = _ref.sidemenu,
      content = _ref.content,
      dropdown = _ref.dropdown,
      message = _ref.message,
      markdown = _ref.markdown,
      room = _ref.room,
      emoji = _ref.emoji,
      icons = _ref.icons;
  return {
    // general
    '--chat-color': general.color,
    '--chat-bg-color-input': general.backgroundInput,
    '--chat-color-spinner': general.colorSpinner,
    '--chat-color-placeholder': general.colorPlaceholder,
    '--chat-color-caret': general.colorCaret,
    '--chat-border-style': general.borderStyle,
    '--chat-bg-scroll-icon': general.backgroundScrollIcon,
    // container
    '--chat-container-border': container.border,
    '--chat-container-border-radius': container.borderRadius,
    '--chat-container-box-shadow': container.boxShadow,
    // header
    '--chat-header-bg-color': header.background,
    '--chat-header-color-name': header.colorRoomName,
    '--chat-header-color-info': header.colorRoomInfo,
    // footer
    '--chat-footer-bg-color': footer.background,
    '--chat-border-style-input': footer.borderStyleInput,
    '--chat-border-color-input-selected': footer.borderInputSelected,
    '--chat-footer-bg-color-reply': footer.backgroundReply,
    '--chat-footer-bg-color-tag-active': footer.backgroundTagActive,
    // content
    '--chat-content-bg-color': content.background,
    // sidemenu
    '--chat-sidemenu-bg-color': sidemenu.background,
    '--chat-sidemenu-bg-color-hover': sidemenu.backgroundHover,
    '--chat-sidemenu-bg-color-active': sidemenu.backgroundActive,
    '--chat-sidemenu-color-active': sidemenu.colorActive,
    '--chat-sidemenu-border-color-search': sidemenu.borderColorSearch,
    // dropdown
    '--chat-dropdown-bg-color': dropdown.background,
    '--chat-dropdown-bg-color-hover': dropdown.backgroundHover,
    // message
    '--chat-message-bg-color': message.background,
    '--chat-message-bg-color-me': message.backgroundMe,
    '--chat-message-color-started': message.colorStarted,
    '--chat-message-bg-color-deleted': message.backgroundDeleted,
    '--chat-message-color-deleted': message.colorDeleted,
    '--chat-message-color-username': message.colorUsername,
    '--chat-message-color-timestamp': message.colorTimestamp,
    '--chat-message-bg-color-date': message.backgroundDate,
    '--chat-message-color-date': message.colorDate,
    '--chat-message-bg-color-system': message.backgroundSystem,
    '--chat-message-color-system': message.colorSystem,
    '--chat-message-color': message.color,
    '--chat-message-bg-color-media': message.backgroundMedia,
    '--chat-message-bg-color-reply': message.backgroundReply,
    '--chat-message-color-reply-username': message.colorReplyUsername,
    '--chat-message-color-reply-content': message.colorReply,
    '--chat-message-color-tag': message.colorTag,
    '--chat-message-bg-color-image': message.backgroundImage,
    '--chat-message-color-new-messages': message.colorNewMessages,
    '--chat-message-bg-color-scroll-counter': message.backgroundScrollCounter,
    '--chat-message-color-scroll-counter': message.colorScrollCounter,
    '--chat-message-bg-color-reaction': message.backgroundReaction,
    '--chat-message-border-style-reaction': message.borderStyleReaction,
    '--chat-message-bg-color-reaction-hover': message.backgroundReactionHover,
    '--chat-message-border-style-reaction-hover': message.borderStyleReactionHover,
    '--chat-message-color-reaction-counter': message.colorReactionCounter,
    '--chat-message-bg-color-reaction-me': message.backgroundReactionMe,
    '--chat-message-border-style-reaction-me': message.borderStyleReactionMe,
    '--chat-message-bg-color-reaction-hover-me': message.backgroundReactionHoverMe,
    '--chat-message-border-style-reaction-hover-me': message.borderStyleReactionHoverMe,
    '--chat-message-color-reaction-counter-me': message.colorReactionCounterMe,
    '--chat-message-bg-color-audio-record': message.backgroundAudioRecord,
    '--chat-message-bg-color-audio-line': message.backgroundAudioLine,
    '--chat-message-bg-color-audio-progress': message.backgroundAudioProgress,
    '--chat-message-bg-color-audio-progress-selector': message.backgroundAudioProgressSelector,
    // markdown
    '--chat-markdown-bg': markdown.background,
    '--chat-markdown-border': markdown.border,
    '--chat-markdown-color': markdown.color,
    '--chat-markdown-color-multi': markdown.colorMulti,
    // room
    '--chat-room-color-username': room.colorUsername,
    '--chat-room-color-message': room.colorMessage,
    '--chat-room-color-timestamp': room.colorTimestamp,
    '--chat-room-color-online': room.colorStateOnline,
    '--chat-room-color-offline': room.colorStateOffline,
    '--chat-room-bg-color-badge': room.backgroundCounterBadge,
    '--chat-room-color-badge': room.colorCounterBadge,
    // emoji
    '--chat-emoji-bg-color': emoji.background,
    // icons
    '--chat-icon-color-search': icons.search,
    '--chat-icon-color-add': icons.add,
    '--chat-icon-color-toggle': icons.toggle,
    '--chat-icon-color-menu': icons.menu,
    '--chat-icon-color-close': icons.close,
    '--chat-icon-color-close-image': icons.closeImage,
    '--chat-icon-color-file': icons.file,
    '--chat-icon-color-paperclip': icons.paperclip,
    '--chat-icon-color-close-outline': icons.closeOutline,
    '--chat-icon-color-send': icons.send,
    '--chat-icon-color-send-disabled': icons.sendDisabled,
    '--chat-icon-color-emoji': icons.emoji,
    '--chat-icon-color-emoji-reaction': icons.emojiReaction,
    '--chat-icon-color-document': icons.document,
    '--chat-icon-color-pencil': icons.pencil,
    '--chat-icon-color-checkmark': icons.checkmark,
    '--chat-icon-color-checkmark-seen': icons.checkmarkSeen,
    '--chat-icon-color-eye': icons.eye,
    '--chat-icon-color-dropdown-message': icons.dropdownMessage,
    '--chat-icon-bg-dropdown-message': icons.dropdownMessageBackground,
    '--chat-icon-color-dropdown-room': icons.dropdownRoom,
    '--chat-icon-color-dropdown-scroll': icons.dropdownScroll,
    '--chat-icon-color-microphone': icons.microphone,
    '--chat-icon-color-audio-play': icons.audioPlay,
    '--chat-icon-color-audio-pause': icons.audioPause,
    '--chat-icon-color-audio-cancel': icons.audioCancel,
    '--chat-icon-color-audio-confirm': icons.audioConfirm
  };
};
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/ChatWindow.vue?vue&type=script&lang=js&









//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var ChatWindowvue_type_script_lang_js_require = __webpack_require__("4c1d"),
    roomsValidation = ChatWindowvue_type_script_lang_js_require.roomsValidation,
    partcipantsValidation = ChatWindowvue_type_script_lang_js_require.partcipantsValidation;

/* harmony default export */ var ChatWindowvue_type_script_lang_js_ = ({
  name: 'ChatContainer',
  components: {
    RoomsList: RoomsList,
    Room: Room
  },
  props: {
    height: {
      type: String,
      "default": '600px'
    },
    theme: {
      type: String,
      "default": 'light'
    },
    styles: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    responsiveBreakpoint: {
      type: Number,
      "default": 900
    },
    singleRoom: {
      type: Boolean,
      "default": false
    },
    textMessages: {
      type: Object,
      "default": null
    },
    currentUserId: {
      type: [String, Number],
      "default": ''
    },
    rooms: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    loadingRooms: {
      type: Boolean,
      "default": false
    },
    roomsLoaded: {
      type: Boolean,
      "default": false
    },
    roomId: {
      type: [String, Number],
      "default": null
    },
    loadFirstRoom: {
      type: Boolean,
      "default": true
    },
    messages: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    messagesLoaded: {
      type: Boolean,
      "default": false
    },
    roomActions: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    menuActions: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    messageActions: {
      type: Array,
      "default": function _default() {
        return [{
          name: 'replyMessage',
          title: 'Reply'
        }, {
          name: 'editMessage',
          title: 'Edit Message',
          onlyMe: true
        }, {
          name: 'deleteMessage',
          title: 'Delete Message',
          onlyMe: true
        }];
      }
    },
    showAddRoom: {
      type: Boolean,
      "default": true
    },
    showSendIcon: {
      type: Boolean,
      "default": true
    },
    showFiles: {
      type: Boolean,
      "default": true
    },
    showAudio: {
      type: Boolean,
      "default": true
    },
    showEmojis: {
      type: Boolean,
      "default": true
    },
    showReactionEmojis: {
      type: Boolean,
      "default": true
    },
    showNewMessagesDivider: {
      type: Boolean,
      "default": true
    },
    showFooter: {
      type: Boolean,
      "default": true
    },
    textFormatting: {
      type: Boolean,
      "default": true
    },
    linkOptions: {
      type: Object,
      "default": function _default() {
        return {
          disabled: false,
          target: '_blank'
        };
      }
    },
    newMessage: {
      type: Object,
      "default": null
    },
    roomMessage: {
      type: String,
      "default": ''
    },
    acceptedFiles: {
      type: String,
      "default": '*'
    }
  },
  data: function data() {
    return {
      room: {},
      loadingMoreRooms: false,
      showRoomsList: true,
      isMobile: false
    };
  },
  computed: {
    t: function t() {
      return _objectSpread2(_objectSpread2({}, locales), this.textMessages);
    },
    cssVars: function cssVars() {
      var _this = this;

      var defaultStyles = defaultThemeStyles[this.theme];
      var customStyles = {};
      Object.keys(defaultStyles).map(function (key) {
        customStyles[key] = _objectSpread2(_objectSpread2({}, defaultStyles[key]), _this.styles[key] || {});
      });
      return cssThemeVars(customStyles);
    },
    orderedRooms: function orderedRooms() {
      return this.rooms.slice().sort(function (a, b) {
        var aVal = a.index || 0;
        var bVal = b.index || 0;
        return aVal > bVal ? -1 : bVal > aVal ? 1 : 0;
      });
    }
  },
  watch: {
    rooms: {
      immediate: true,
      handler: function handler(newVal, oldVal) {
        var _this2 = this;

        if (!newVal[0] || !newVal.find(function (room) {
          return room.roomId === _this2.room.roomId;
        })) {
          this.showRoomsList = true;
        }

        if (!this.loadingMoreRooms && this.loadFirstRoom && newVal[0] && (!oldVal || newVal.length !== oldVal.length)) {
          if (this.roomId) {
            var room = newVal.find(function (r) {
              return r.roomId === _this2.roomId;
            });
            this.fetchRoom({
              room: room
            });
          } else if (!this.isMobile || this.singleRoom) {
            this.fetchRoom({
              room: this.orderedRooms[0]
            });
          } else {
            this.showRoomsList = true;
          }
        }
      }
    },
    loadingRooms: function loadingRooms(val) {
      if (val) this.room = {};
    },
    roomId: {
      immediate: true,
      handler: function handler(newVal, oldVal) {
        if (newVal && !this.loadingRooms && this.rooms.length) {
          var room = this.rooms.find(function (r) {
            return r.roomId === newVal;
          });
          this.fetchRoom({
            room: room
          });
        } else if (oldVal && !newVal) {
          this.room = {};
        }
      }
    },
    room: function room(val) {
      if (!val || Object.entries(val).length === 0) return;
      roomsValidation(val);
      val.users.forEach(function (user) {
        partcipantsValidation(user);
      });
    },
    newMessage: function newMessage(val) {
      this.$set(this.messages, val.index, val.message);
    }
  },
  created: function created() {
    var _this3 = this;

    this.updateResponsive();
    window.addEventListener('resize', function (ev) {
      if (ev.isTrusted) _this3.updateResponsive();
    });
  },
  methods: {
    updateResponsive: function updateResponsive() {
      this.isMobile = window.innerWidth < this.responsiveBreakpoint;
    },
    toggleRoomsList: function toggleRoomsList() {
      this.showRoomsList = !this.showRoomsList;
      if (this.isMobile) this.room = {};
      this.$emit('toggle-rooms-list', {
        opened: this.showRoomsList
      });
    },
    fetchRoom: function fetchRoom(_ref) {
      var room = _ref.room;
      this.room = room;
      this.fetchMessages({
        reset: true
      });
      if (this.isMobile) this.showRoomsList = false;
    },
    fetchMoreRooms: function fetchMoreRooms() {
      this.$emit('fetch-more-rooms');
    },
    roomInfo: function roomInfo() {
      this.$emit('room-info', this.room);
    },
    addRoom: function addRoom() {
      this.$emit('add-room');
    },
    fetchMessages: function fetchMessages(options) {
      this.$emit('fetch-messages', {
        room: this.room,
        options: options
      });
    },
    sendMessage: function sendMessage(message) {
      this.$emit('send-message', _objectSpread2(_objectSpread2({}, message), {}, {
        roomId: this.room.roomId
      }));
    },
    editMessage: function editMessage(message) {
      this.$emit('edit-message', _objectSpread2(_objectSpread2({}, message), {}, {
        roomId: this.room.roomId
      }));
    },
    deleteMessage: function deleteMessage(message) {
      this.$emit('delete-message', {
        message: message,
        roomId: this.room.roomId
      });
    },
    openFile: function openFile(_ref2) {
      var message = _ref2.message,
          action = _ref2.action;
      this.$emit('open-file', {
        message: message,
        action: action
      });
    },
    openUserTag: function openUserTag(_ref3) {
      var user = _ref3.user;
      this.$emit('open-user-tag', {
        user: user
      });
    },
    menuActionHandler: function menuActionHandler(ev) {
      this.$emit('menu-action-handler', {
        action: ev,
        roomId: this.room.roomId
      });
    },
    roomActionHandler: function roomActionHandler(_ref4) {
      var action = _ref4.action,
          roomId = _ref4.roomId;
      this.$emit('room-action-handler', {
        action: action,
        roomId: roomId
      });
    },
    messageActionHandler: function messageActionHandler(ev) {
      this.$emit('message-action-handler', _objectSpread2(_objectSpread2({}, ev), {}, {
        roomId: this.room.roomId
      }));
    },
    sendMessageReaction: function sendMessageReaction(messageReaction) {
      this.$emit('send-message-reaction', _objectSpread2(_objectSpread2({}, messageReaction), {}, {
        roomId: this.room.roomId
      }));
    },
    typingMessage: function typingMessage(message) {
      this.$emit('typing-message', {
        message: message,
        roomId: this.room.roomId
      });
    },
    textareaActionHandler: function textareaActionHandler(message) {
      this.$emit('textarea-action-handler', {
        message: message,
        roomId: this.room.roomId
      });
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/ChatWindow.vue?vue&type=script&lang=js&
 /* harmony default export */ var ChatWindow_ChatWindowvue_type_script_lang_js_ = (ChatWindowvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/ChatWindow.vue?vue&type=style&index=0&lang=scss&
var ChatWindowvue_type_style_index_0_lang_scss_ = __webpack_require__("1606");

// CONCATENATED MODULE: ./src/ChatWindow/ChatWindow.vue






/* normalize component */

var ChatWindow_component = normalizeComponent(
  ChatWindow_ChatWindowvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ChatWindow = (ChatWindow_component.exports);
// CONCATENATED MODULE: ./src/ChatWindow/index.js


Object.defineProperty(ChatWindow, 'install', {
  configurable: false,
  enumerable: false,
  value: function value(Vue) {
    Vue.component('ChatWindow', ChatWindow);
  }
});
/* harmony default export */ var src_ChatWindow = (ChatWindow);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_ChatWindow);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "ffc1":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__("5ca1");
var $entries = __webpack_require__("504c")(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ })

/******/ });
});
//# sourceMappingURL=vue-advanced-chat.umd.js.map