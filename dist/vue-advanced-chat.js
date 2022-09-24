/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "5a74");
/******/ })
/************************************************************************/
/******/ ({

/***/ "00ee":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "0366":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var aCallable = __webpack_require__("59ed");
var NATIVE_BIND = __webpack_require__("40d5");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "06cf":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var call = __webpack_require__("c65b");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var createPropertyDescriptor = __webpack_require__("5c6c");
var toIndexedObject = __webpack_require__("fc6a");
var toPropertyKey = __webpack_require__("a04b");
var hasOwn = __webpack_require__("1a2d");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "06e5":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-room-header{position:absolute;display:flex;align-items:center;height:64px;width:100%;z-index:10;margin-right:1px;background:var(--chat-header-bg-color);border-top-right-radius:var(--chat-container-border-radius)}.vac-room-header .vac-room-wrapper{display:flex;align-items:center;min-width:0;height:100%;width:100%;padding:0 16px}.vac-room-header .vac-toggle-button{margin-right:15px}.vac-room-header .vac-toggle-button svg{height:26px;width:26px}.vac-room-header .vac-rotate-icon{transform:rotate(180deg)!important}.vac-room-header .vac-info-wrapper{display:flex;align-items:center;min-width:0;width:100%;height:100%}.vac-room-header .vac-room-name{font-size:17px;font-weight:500;line-height:22px;color:var(--chat-header-color-name)}.vac-room-header .vac-room-info{font-size:13px;line-height:18px;color:var(--chat-header-color-info)}.vac-room-header .vac-room-options{margin-left:auto}@media only screen and (max-width:768px){.vac-room-header{height:50px}.vac-room-header .vac-room-wrapper{padding:0 10px}.vac-room-header .vac-room-name{font-size:16px;line-height:22px}.vac-room-header .vac-room-info{font-size:12px;line-height:16px}.vac-room-header .vac-avatar{height:37px;width:37px;min-height:37px;min-width:37px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "07fa":
/***/ (function(module, exports, __webpack_require__) {

var toLength = __webpack_require__("50c4");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "0cfb":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");
var createElement = __webpack_require__("cc12");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "0d51":
/***/ (function(module, exports) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "1229":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomEmojis_vue_vue_type_style_index_0_id_04b99276_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9013");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomEmojis_vue_vue_type_style_index_0_id_04b99276_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomEmojis_vue_vue_type_style_index_0_id_04b99276_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "13d2":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var isCallable = __webpack_require__("1626");
var hasOwn = __webpack_require__("1a2d");
var DESCRIPTORS = __webpack_require__("83ab");
var CONFIGURABLE_FUNCTION_NAME = __webpack_require__("5e77").CONFIGURABLE;
var inspectSource = __webpack_require__("8925");
var InternalStateModule = __webpack_require__("69f3");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "13d5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $reduce = __webpack_require__("d58f").left;
var arrayMethodIsStrict = __webpack_require__("a640");
var CHROME_VERSION = __webpack_require__("2d00");
var IS_NODE = __webpack_require__("605d");

var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "13e4":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-col-messages{position:relative;height:100%;flex:1;overflow:hidden;display:flex;flex-flow:column}.vac-col-messages .vac-container-center{height:100%;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.vac-col-messages .vac-room-empty{font-size:14px;color:#9ca6af;font-style:italic;line-height:20px;white-space:pre-line}.vac-col-messages .vac-room-empty div{padding:0 10%}.vac-col-messages .vac-container-scroll{background:var(--chat-content-bg-color);flex:1;overflow-y:auto;margin-right:1px;margin-top:60px;-webkit-overflow-scrolling:touch}.vac-col-messages .vac-container-scroll.vac-scroll-smooth{scroll-behavior:smooth}.vac-col-messages .vac-messages-container{padding:0 5px 5px}.vac-col-messages .vac-text-started{font-size:14px;color:var(--chat-message-color-started);font-style:italic;text-align:center;margin-top:30px;margin-bottom:20px}.vac-col-messages .vac-infinite-loading{height:68px}.vac-col-messages .vac-icon-scroll{position:absolute;bottom:80px;right:20px;padding:8px;background:var(--chat-bg-scroll-icon);border-radius:50%;box-shadow:0 1px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 2px 0 rgba(0,0,0,.12);display:flex;cursor:pointer;z-index:10}.vac-col-messages .vac-icon-scroll svg{height:25px;width:25px}.vac-col-messages .vac-messages-count{position:absolute;top:-8px;left:11px;background-color:var(--chat-message-bg-color-scroll-counter);color:var(--chat-message-color-scroll-counter)}.vac-col-messages .vac-room-footer{width:100%;border-bottom-right-radius:4px;z-index:10}.vac-col-messages .vac-box-footer{display:flex;position:relative;background:var(--chat-footer-bg-color);padding:10px 8px 10px}.vac-col-messages .vac-textarea{height:20px;width:100%;line-height:20px;overflow:hidden;outline:0;resize:none;border-radius:20px;padding:12px 16px;box-sizing:content-box;font-size:16px;background:var(--chat-bg-color-input);color:var(--chat-color);caret-color:var(--chat-color-caret);border:var(--chat-border-style-input)}.vac-col-messages .vac-textarea::-moz-placeholder{color:var(--chat-color-placeholder);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-col-messages .vac-textarea::placeholder{color:var(--chat-color-placeholder);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-col-messages .vac-textarea-outline{border:1px solid var(--chat-border-color-input-selected);box-shadow:inset 0 0 0 1px var(--chat-border-color-input-selected)}.vac-col-messages .vac-icon-textarea,.vac-col-messages .vac-icon-textarea-left{display:flex;align-items:center}.vac-col-messages .vac-icon-textarea-left .vac-wrapper,.vac-col-messages .vac-icon-textarea-left svg,.vac-col-messages .vac-icon-textarea .vac-wrapper,.vac-col-messages .vac-icon-textarea svg{margin:0 7px}.vac-col-messages .vac-icon-textarea{margin-left:5px}.vac-col-messages .vac-icon-textarea-left{display:flex;align-items:center;margin-right:5px}.vac-col-messages .vac-icon-textarea-left .vac-wrapper,.vac-col-messages .vac-icon-textarea-left svg{margin:0 7px}.vac-col-messages .vac-icon-textarea-left .vac-icon-microphone{fill:var(--chat-icon-color-microphone);margin:0 7px}.vac-col-messages .vac-icon-textarea-left .vac-dot-audio-record{height:15px;width:15px;border-radius:50%;background-color:var(--chat-message-bg-color-audio-record);-webkit-animation:vac-scaling .8s ease-in-out infinite alternate;animation:vac-scaling .8s ease-in-out infinite alternate}@-webkit-keyframes vac-scaling{0%{transform:scale(1);opacity:.4}to{transform:scale(1.1);opacity:1}}@keyframes vac-scaling{0%{transform:scale(1);opacity:.4}to{transform:scale(1.1);opacity:1}}.vac-col-messages .vac-icon-textarea-left .vac-dot-audio-record-time{font-size:16px;color:var(--chat-color);margin-left:8px;width:45px}.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-confirm,.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-confirm svg,.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-stop,.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-stop svg{min-height:28px;min-width:28px}.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-stop{margin-right:20px}.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-stop #vac-icon-close-outline{fill:var(--chat-icon-color-audio-cancel)}.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-confirm{margin-right:3px;margin-left:12px}.vac-col-messages .vac-icon-textarea-left .vac-icon-audio-confirm #vac-icon-checkmark{fill:var(--chat-icon-color-audio-confirm)}.vac-col-messages .vac-media-container{position:absolute;max-width:25%;left:16px;top:18px}.vac-col-messages .vac-media-file{display:flex;justify-content:center;flex-direction:column;min-height:30px}.vac-col-messages .vac-media-file img{border-radius:15px;width:100%;max-width:150px;max-height:100%}.vac-col-messages .vac-media-file video{border-radius:15px;width:100%;max-width:250px;max-height:100%}.vac-col-messages .vac-icon-media{position:absolute;top:6px;left:6px;z-index:10}.vac-col-messages .vac-icon-media svg{height:20px;width:20px;border-radius:50%}.vac-col-messages .vac-icon-media:before{content:\" \";position:absolute;width:100%;height:100%;background:rgba(0,0,0,.5);border-radius:50%;z-index:-1}.vac-col-messages .vac-file-container{display:flex;align-items:center;width:calc(100% - 115px);height:20px;padding:12px 0;box-sizing:content-box;background:var(--chat-bg-color-input);border:var(--chat-border-style-input);border-radius:20px}.vac-col-messages .vac-file-container.vac-file-container-edit{width:calc(100% - 150px)}.vac-col-messages .vac-file-container .vac-icon-file{display:flex;margin:0 8px 0 15px}.vac-col-messages .vac-file-container .vac-file-message{max-width:calc(100% - 75px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-col-messages .vac-file-container .vac-icon-remove{margin:0 8px}.vac-col-messages .vac-file-container .vac-icon-remove svg{height:18px;width:18px}.vac-col-messages .vac-send-disabled,.vac-col-messages .vac-send-disabled svg{cursor:none!important;pointer-events:none!important;transform:none!important}.vac-col-messages .vac-messages-hidden{opacity:0}@media only screen and (max-width:768px){.vac-col-messages .vac-container-scroll{margin-top:50px}.vac-col-messages .vac-infinite-loading{height:58px}.vac-col-messages .vac-box-footer{border-top:var(--chat-border-style-input);padding:7px 2px 7px 7px}.vac-col-messages .vac-text-started{margin-top:20px}.vac-col-messages .vac-textarea{padding:7px;line-height:18px}.vac-col-messages .vac-textarea::-moz-placeholder{color:transparent}.vac-col-messages .vac-textarea::placeholder{color:transparent}.vac-col-messages .vac-icon-textarea-left .vac-wrapper,.vac-col-messages .vac-icon-textarea-left svg,.vac-col-messages .vac-icon-textarea .vac-wrapper,.vac-col-messages .vac-icon-textarea svg{margin:0 5px!important}.vac-col-messages .vac-media-container{top:10px;left:10px}.vac-col-messages .vac-media-file img,.vac-col-messages .vac-media-file video{transform:scale(.97)}.vac-col-messages .vac-room-footer{width:100%}.vac-col-messages .vac-file-container{padding:7px 0}.vac-col-messages .vac-file-container .icon-file{margin-left:10px}.vac-col-messages .vac-icon-scroll{bottom:70px}}.files-list{display:flex;align-items:center;padding:10px 6px 0 6px}.vac-files-box{display:flex;overflow:auto;width:calc(100% - 30px)}.vac-close-all-files{float:right;padding-top:2px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "1446":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-tags-container{position:absolute;display:flex;flex-direction:column;align-items:center;width:100%}.vac-tags-container .vac-tags-box{display:flex;width:100%;height:54px;overflow:hidden;cursor:pointer;background:var(--chat-footer-bg-color)}.vac-tags-container .vac-tags-box:hover{background:var(--chat-footer-bg-color-tag-active)}.vac-tags-container .vac-tags-box:hover,.vac-tags-container .vac-tags-box:not(:hover){transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-tags-container .vac-tags-info{display:flex;overflow:hidden;padding:0 20px;align-items:center}.vac-tags-container .vac-tags-avatar{height:34px;width:34px;min-height:34px;min-width:34px}.vac-tags-container .vac-tags-username{font-size:14px}@media only screen and (max-width:768px){.vac-tags-container .vac-tags-box{height:50px}.vac-tags-container .vac-tags-info{padding:0 12px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "1626":
/***/ (function(module, exports) {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


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

/***/ "182d":
/***/ (function(module, exports, __webpack_require__) {

var toPositiveInteger = __webpack_require__("f8cd");

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw $RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ "19ce":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("d2b2");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("a2b7ff06", content, shadowRoot)
};

/***/ }),

/***/ "1a2d":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var toObject = __webpack_require__("7b0b");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "1a98":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectMobile", function() { return detectMobile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iOSDevice", function() { return iOSDevice; });
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d9e2");
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__);

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

/***/ "1bbc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _vue_style_loader_index_js_ref_7_oneOf_1_0_css_loader_dist_cjs_js_ref_7_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_7_oneOf_1_2_postcss_loader_src_index_js_ref_7_oneOf_1_3_cache_loader_dist_cjs_js_ref_1_0_vue_loader_lib_index_js_vue_loader_options_ProgressCircle_vue_vue_type_style_index_0_id_74af930e_prod_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9af0");
/* harmony import */ var _vue_style_loader_index_js_ref_7_oneOf_1_0_css_loader_dist_cjs_js_ref_7_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_7_oneOf_1_2_postcss_loader_src_index_js_ref_7_oneOf_1_3_cache_loader_dist_cjs_js_ref_1_0_vue_loader_lib_index_js_vue_loader_options_ProgressCircle_vue_vue_type_style_index_0_id_74af930e_prod_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vue_style_loader_index_js_ref_7_oneOf_1_0_css_loader_dist_cjs_js_ref_7_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_7_oneOf_1_2_postcss_loader_src_index_js_ref_7_oneOf_1_3_cache_loader_dist_cjs_js_ref_1_0_vue_loader_lib_index_js_vue_loader_options_ProgressCircle_vue_vue_type_style_index_0_id_74af930e_prod_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "1d02":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var $findLastIndex = __webpack_require__("a258").findLastIndex;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "1d80":
/***/ (function(module, exports) {

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "23cb":
/***/ (function(module, exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__("5926");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "23e7":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var createNonEnumerableProperty = __webpack_require__("9112");
var defineBuiltIn = __webpack_require__("cb2d");
var defineGlobalProperty = __webpack_require__("6374");
var copyConstructorProperties = __webpack_require__("e893");
var isForced = __webpack_require__("94ca");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "241c":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("ca84");
var enumBugKeys = __webpack_require__("7839");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "24fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

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

/***/ "271f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageActions_vue_vue_type_style_index_0_id_e5cea174_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3699");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageActions_vue_vue_type_style_index_0_id_e5cea174_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageActions_vue_vue_type_style_index_0_id_e5cea174_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "299d":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("997b");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("9a2bf97e", content, shadowRoot)
};

/***/ }),

/***/ "2a6e":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("06e5");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("3467790b", content, shadowRoot)
};

/***/ }),

/***/ "2ba4":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__("40d5");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es-x/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "2d00":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var userAgent = __webpack_require__("342f");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


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

/***/ "342f":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "35d6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesToShadowDOM; });

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesShadow.js


function addStylesToShadowDOM (parentId, list, shadowRoot) {
  var styles = listToStyles(parentId, list)
  addStyles(styles, shadowRoot)
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

function addStyles (styles /* Array<StyleObject> */, shadowRoot) {
  const injectedStyles =
    shadowRoot._injectedStyles ||
    (shadowRoot._injectedStyles = {})
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var style = injectedStyles[item.id]
    if (!style) {
      for (var j = 0; j < item.parts.length; j++) {
        addStyle(item.parts[j], shadowRoot)
      }
      injectedStyles[item.id] = true
    }
  }
}

function createStyleElement (shadowRoot) {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  shadowRoot.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */, shadowRoot) {
  var styleElement = createStyleElement(shadowRoot)
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "35fe":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("ad18");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("8abdd878", content, shadowRoot)
};

/***/ }),

/***/ "3699":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("d422");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("72859d28", content, shadowRoot)
};

/***/ }),

/***/ "3881":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("d9ba");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("2319080a", content, shadowRoot)
};

/***/ }),

/***/ "39f6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomHeader_vue_vue_type_style_index_0_id_0afde938_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a6e");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomHeader_vue_vue_type_style_index_0_id_0afde938_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomHeader_vue_vue_type_style_index_0_id_0afde938_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "3a9b":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "3bbe":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "3c5d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("da84");
var call = __webpack_require__("c65b");
var ArrayBufferViewCore = __webpack_require__("ebb5");
var lengthOfArrayLike = __webpack_require__("07fa");
var toOffset = __webpack_require__("182d");
var toIndexedObject = __webpack_require__("7b0b");
var fails = __webpack_require__("d039");

var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es-x/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ }),

/***/ "3f09":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("5515");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("434904d8", content, shadowRoot)
};

/***/ }),

/***/ "40d5":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


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

/***/ "44ad":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var fails = __webpack_require__("d039");
var classof = __webpack_require__("c6b6");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "45f4":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("1446");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("bc864020", content, shadowRoot)
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

/***/ "4731":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-button-reaction{display:inline-flex;align-items:center;border:var(--chat-message-border-style-reaction);outline:none;background:var(--chat-message-bg-color-reaction);border-radius:4px;margin:4px 2px 0;transition:.3s;padding:0 5px;font-size:18px;line-height:23px}.vac-button-reaction span{font-size:11px;font-weight:500;min-width:7px;color:var(--chat-message-color-reaction-counter)}.vac-button-reaction:hover{border:var(--chat-message-border-style-reaction-hover);background:var(--chat-message-bg-color-reaction-hover);cursor:pointer}.vac-button-reaction.vac-reaction-me{border:var(--chat-message-border-style-reaction-me);background:var(--chat-message-bg-color-reaction-me)}.vac-button-reaction.vac-reaction-me span{color:var(--chat-message-color-reaction-counter-me)}.vac-button-reaction.vac-reaction-me:hover{border:var(--chat-message-border-style-reaction-hover-me);background:var(--chat-message-bg-color-reaction-hover-me)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "485a":
/***/ (function(module, exports, __webpack_require__) {

var call = __webpack_require__("c65b");
var isCallable = __webpack_require__("1626");
var isObject = __webpack_require__("861d");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "4930":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__("2d00");
var fails = __webpack_require__("d039");

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "4c1d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roomsValidation", function() { return roomsValidation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partcipantsValidation", function() { return partcipantsValidation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messagesValidation", function() { return messagesValidation; });
/* harmony import */ var _Users_user_vue_advanced_chat_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("53ca");
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d9e2");
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_1__);


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
        return t === Object(_Users_user_vue_advanced_chat_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(obj[prop.key]);
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
        return t === Object(_Users_user_vue_advanced_chat_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(obj[prop.key]);
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
        return t === Object(_Users_user_vue_advanced_chat_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(obj[prop.key]);
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

/***/ "4d64":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("fc6a");
var toAbsoluteIndex = __webpack_require__("23cb");
var lengthOfArrayLike = __webpack_require__("07fa");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "50c4":
/***/ (function(module, exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__("5926");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "518e":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "#vac-icon-search{fill:var(--chat-icon-color-search)}#vac-icon-add{fill:var(--chat-icon-color-add)}#vac-icon-toggle{fill:var(--chat-icon-color-toggle)}#vac-icon-menu{fill:var(--chat-icon-color-menu)}#vac-icon-close{fill:var(--chat-icon-color-close)}#vac-icon-close-image{fill:var(--chat-icon-color-close-image)}#vac-icon-file{fill:var(--chat-icon-color-file)}#vac-icon-paperclip{fill:var(--chat-icon-color-paperclip)}#vac-icon-close-outline{fill:var(--chat-icon-color-close-outline)}#vac-icon-send{fill:var(--chat-icon-color-send)}#vac-icon-send-disabled{fill:var(--chat-icon-color-send-disabled)}#vac-icon-emoji{fill:var(--chat-icon-color-emoji)}#vac-icon-emoji-reaction{fill:var(--chat-icon-color-emoji-reaction)}#vac-icon-document{fill:var(--chat-icon-color-document)}#vac-icon-pencil{fill:var(--chat-icon-color-pencil)}#vac-icon-checkmark,#vac-icon-double-checkmark{fill:var(--chat-icon-color-checkmark)}#vac-icon-checkmark-seen,#vac-icon-double-checkmark-seen{fill:var(--chat-icon-color-checkmark-seen)}#vac-icon-eye{fill:var(--chat-icon-color-eye)}#vac-icon-dropdown-message{fill:var(--chat-icon-color-dropdown-message)}#vac-icon-dropdown-room{fill:var(--chat-icon-color-dropdown-room)}#vac-icon-dropdown-scroll{fill:var(--chat-icon-color-dropdown-scroll)}#vac-icon-audio-play{fill:var(--chat-icon-color-audio-play)}#vac-icon-audio-pause{fill:var(--chat-icon-color-audio-pause)}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "51c4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsSearch_vue_vue_type_style_index_0_id_079ff11e_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ac31");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsSearch_vue_vue_type_style_index_0_id_079ff11e_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsSearch_vue_vue_type_style_index_0_id_079ff11e_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "52bc":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("b517");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("965f9836", content, shadowRoot)
};

/***/ }),

/***/ "53ca":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _typeof; });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "5496":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("75cc");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("05cb19c0", content, shadowRoot)
};

/***/ }),

/***/ "5515":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-reply-container{position:absolute;display:flex;padding:10px 10px 0 10px;background:var(--chat-footer-bg-color);align-items:center;width:calc(100% - 20px)}.vac-reply-container .vac-reply-box{width:100%;overflow:hidden;background:var(--chat-footer-bg-color-reply);border-radius:4px;padding:8px 10px;display:flex}.vac-reply-container .vac-reply-info{overflow:hidden}.vac-reply-container .vac-reply-username{color:var(--chat-message-color-reply-username);font-size:12px;line-height:15px;margin-bottom:2px}.vac-reply-container .vac-reply-content{font-size:12px;color:var(--chat-message-color-reply-content);white-space:pre-line}.vac-reply-container .vac-icon-reply{margin-left:10px}.vac-reply-container .vac-icon-reply svg{height:20px;width:20px}.vac-reply-container .vac-image-reply{max-height:100px;margin-right:10px;border-radius:4px}.vac-non-preview-icon{text-align:center}.vac-non-preview-content{white-space:nowrap;overflow:hidden;font-size:12px;margin:0 5px 0 5px;color:var(--chat-message-color-reply-content)}@media only screen and (max-width:768px){.vac-reply-container{padding:5px 8px;width:calc(100% - 16px)}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "5692":
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__("c430");
var store = __webpack_require__("c6cd");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.24.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.24.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "56ef":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");
var uncurryThis = __webpack_require__("e330");
var getOwnPropertyNamesModule = __webpack_require__("241c");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var anObject = __webpack_require__("825a");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "576b":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReactions_vue_vue_type_style_index_0_id_87a49e5e_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b29f");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReactions_vue_vue_type_style_index_0_id_87a49e5e_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReactions_vue_vue_type_style_index_0_id_87a49e5e_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "577e":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("f5df");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "5926":
/***/ (function(module, exports, __webpack_require__) {

var trunc = __webpack_require__("b42e");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "5970":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("13e4");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("bb316378", content, shadowRoot)
};

/***/ }),

/***/ "59ed":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var tryToString = __webpack_require__("0d51");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "5a74":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (Object({"NODE_ENV":"production","BASE_URL":"/"}).NEED_CURRENTSCRIPT_POLYFILL) {
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

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__("8bbf");
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// CONCATENATED MODULE: ./node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js
const camelizeRE = /-(\w)/g;
const camelize = str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
};

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
};

function getInitialProps (propsList) {
  const res = {};
  propsList.forEach(key => {
    res[key] = undefined;
  });
  return res
}

function injectHook (options, key, hook) {
  options[key] = [].concat(options[key] || []);
  options[key].unshift(hook);
}

function callHooks (vm, hook) {
  if (vm) {
    const hooks = vm.$options[hook] || [];
    hooks.forEach(hook => {
      hook.call(vm);
    });
  }
}

function createCustomEvent (name, args) {
  return new CustomEvent(name, {
    bubbles: false,
    cancelable: false,
    detail: args
  })
}

const isBoolean = val => /function Boolean/.test(String(val));
const isNumber = val => /function Number/.test(String(val));

function convertAttributeValue (value, name, { type } = {}) {
  if (isBoolean(type)) {
    if (value === 'true' || value === 'false') {
      return value === 'true'
    }
    if (value === '' || value === name || value != null) {
      return true
    }
    return value
  } else if (isNumber(type)) {
    const parsed = parseFloat(value, 10);
    return isNaN(parsed) ? value : parsed
  } else {
    return value
  }
}

function toVNodes (h, children) {
  const res = [];
  for (let i = 0, l = children.length; i < l; i++) {
    res.push(toVNode(h, children[i]));
  }
  return res
}

function toVNode (h, node) {
  if (node.nodeType === 3) {
    return node.data.trim() ? node.data : null
  } else if (node.nodeType === 1) {
    const data = {
      attrs: getAttributes(node),
      domProps: {
        innerHTML: node.innerHTML
      }
    };
    if (data.attrs.slot) {
      data.slot = data.attrs.slot;
      delete data.attrs.slot;
    }
    return h(node.tagName, data)
  } else {
    return null
  }
}

function getAttributes (node) {
  const res = {};
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i];
    res[attr.nodeName] = attr.nodeValue;
  }
  return res
}

function vue_wc_wrapper_wrap (Vue, Component) {
  const isAsync = typeof Component === 'function' && !Component.cid;
  let isInitialized = false;
  let hyphenatedPropsList;
  let camelizedPropsList;
  let camelizedPropsMap;

  function initialize (Component) {
    if (isInitialized) return

    const options = typeof Component === 'function'
      ? Component.options
      : Component;

    // extract props info
    const propsList = Array.isArray(options.props)
      ? options.props
      : Object.keys(options.props || {});
    hyphenatedPropsList = propsList.map(hyphenate);
    camelizedPropsList = propsList.map(camelize);
    const originalPropsAsObject = Array.isArray(options.props) ? {} : options.props || {};
    camelizedPropsMap = camelizedPropsList.reduce((map, key, i) => {
      map[key] = originalPropsAsObject[propsList[i]];
      return map
    }, {});

    // proxy $emit to native DOM events
    injectHook(options, 'beforeCreate', function () {
      const emit = this.$emit;
      this.$emit = (name, ...args) => {
        this.$root.$options.customElement.dispatchEvent(createCustomEvent(name, args));
        return emit.call(this, name, ...args)
      };
    });

    injectHook(options, 'created', function () {
      // sync default props values to wrapper on created
      camelizedPropsList.forEach(key => {
        this.$root.props[key] = this[key];
      });
    });

    // proxy props as Element properties
    camelizedPropsList.forEach(key => {
      Object.defineProperty(CustomElement.prototype, key, {
        get () {
          return this._wrapper.props[key]
        },
        set (newVal) {
          this._wrapper.props[key] = newVal;
        },
        enumerable: false,
        configurable: true
      });
    });

    isInitialized = true;
  }

  function syncAttribute (el, key) {
    const camelized = camelize(key);
    const value = el.hasAttribute(key) ? el.getAttribute(key) : undefined;
    el._wrapper.props[camelized] = convertAttributeValue(
      value,
      key,
      camelizedPropsMap[camelized]
    );
  }

  class CustomElement extends HTMLElement {
    constructor () {
      const self = super();
      self.attachShadow({ mode: 'open' });

      const wrapper = self._wrapper = new Vue({
        name: 'shadow-root',
        customElement: self,
        shadowRoot: self.shadowRoot,
        data () {
          return {
            props: {},
            slotChildren: []
          }
        },
        render (h) {
          return h(Component, {
            ref: 'inner',
            props: this.props
          }, this.slotChildren)
        }
      });

      // Use MutationObserver to react to future attribute & slot content change
      const observer = new MutationObserver(mutations => {
        let hasChildrenChange = false;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (isInitialized && m.type === 'attributes' && m.target === self) {
            syncAttribute(self, m.attributeName);
          } else {
            hasChildrenChange = true;
          }
        }
        if (hasChildrenChange) {
          wrapper.slotChildren = Object.freeze(toVNodes(
            wrapper.$createElement,
            self.childNodes
          ));
        }
      });
      observer.observe(self, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    }

    get vueComponent () {
      return this._wrapper.$refs.inner
    }

    connectedCallback () {
      const wrapper = this._wrapper;
      if (!wrapper._isMounted) {
        // initialize attributes
        const syncInitialAttributes = () => {
          wrapper.props = getInitialProps(camelizedPropsList);
          hyphenatedPropsList.forEach(key => {
            syncAttribute(this, key);
          });
        };

        if (isInitialized) {
          syncInitialAttributes();
        } else {
          // async & unresolved
          Component().then(resolved => {
            if (resolved.__esModule || resolved[Symbol.toStringTag] === 'Module') {
              resolved = resolved.default;
            }
            initialize(resolved);
            syncInitialAttributes();
          });
        }
        // initialize children
        wrapper.slotChildren = Object.freeze(toVNodes(
          wrapper.$createElement,
          this.childNodes
        ));
        wrapper.$mount();
        this.shadowRoot.appendChild(wrapper.$el);
      } else {
        callHooks(this.vueComponent, 'activated');
      }
    }

    disconnectedCallback () {
      callHooks(this.vueComponent, 'deactivated');
    }
  }

  if (!isAsync) {
    initialize(Component);
  }

  return CustomElement
}

/* harmony default export */ var vue_wc_wrapper = (vue_wc_wrapper_wrap);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/runtime/api.js
var api = __webpack_require__("24fb");

// EXTERNAL MODULE: ./node_modules/vue-style-loader/lib/addStylesShadow.js + 1 modules
var addStylesShadow = __webpack_require__("35d6");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

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
  if (moduleIdentifier) {
    // server build
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
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/ChatWindow.vue?vue&type=template&id=2b335c5a&shadow
var render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-card-window",
    style: [{
      height: _vm.height
    }, _vm.cssVars]
  }, [_c('div', {
    staticClass: "vac-chat-container"
  }, [!_vm.singleRoom ? _c('rooms-list', {
    attrs: {
      "current-user-id": _vm.currentUserId,
      "rooms": _vm.orderedRooms,
      "loading-rooms": _vm.loadingRooms,
      "rooms-loaded": _vm.roomsLoaded,
      "room": _vm.room,
      "room-actions": _vm.roomActions,
      "text-messages": _vm.t,
      "show-add-room": _vm.showAddRoom,
      "show-rooms-list": _vm.showRoomsList,
      "text-formatting": _vm.textFormatting,
      "link-options": _vm.linkOptions,
      "is-mobile": _vm.isMobile
    },
    on: {
      "fetch-room": _vm.fetchRoom,
      "fetch-more-rooms": _vm.fetchMoreRooms,
      "loading-more-rooms": function loadingMoreRooms($event) {
        _vm.loadingMoreRooms = $event;
      },
      "add-room": _vm.addRoom,
      "room-action-handler": _vm.roomActionHandler
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  }) : _vm._e(), _c('room', {
    attrs: {
      "current-user-id": _vm.currentUserId,
      "rooms": _vm.rooms,
      "room-id": _vm.room.roomId || '',
      "load-first-room": _vm.loadFirstRoom,
      "messages": _vm.messages,
      "room-message": _vm.roomMessage,
      "messages-loaded": _vm.messagesLoaded,
      "menu-actions": _vm.menuActions,
      "message-actions": _vm.messageActions,
      "show-send-icon": _vm.showSendIcon,
      "show-files": _vm.showFiles,
      "show-audio": _vm.showAudio,
      "show-emojis": _vm.showEmojis,
      "show-reaction-emojis": _vm.showReactionEmojis,
      "show-new-messages-divider": _vm.showNewMessagesDivider,
      "show-footer": _vm.showFooter,
      "text-messages": _vm.t,
      "single-room": _vm.singleRoom,
      "show-rooms-list": _vm.showRoomsList,
      "text-formatting": _vm.textFormatting,
      "link-options": _vm.linkOptions,
      "is-mobile": _vm.isMobile,
      "loading-rooms": _vm.loadingRooms,
      "room-info": _vm.$listeners['room-info'],
      "textarea-action": _vm.$listeners['textarea-action-handler'],
      "accepted-files": _vm.acceptedFiles,
      "max-file-size": _vm.maxFileSize,
      "max-files-sum-size": _vm.maxFilesSumSize
    },
    on: {
      "toggle-rooms-list": _vm.toggleRoomsList,
      "room-info": _vm.roomInfo,
      "fetch-messages": _vm.fetchMessages,
      "send-message": _vm.sendMessage,
      "edit-message": _vm.editMessage,
      "delete-message": _vm.deleteMessage,
      "open-file": _vm.openFile,
      "limit-size-exceeded": _vm.limitSizeExceeded,
      "open-user-tag": _vm.openUserTag,
      "menu-action-handler": _vm.menuActionHandler,
      "message-action-handler": _vm.messageActionHandler,
      "send-message-reaction": _vm.sendMessageReaction,
      "typing-message": _vm.typingMessage,
      "textarea-action-handler": _vm.textareaActionHandler
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  })], 1)]);
};

var staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/ChatWindow.vue?vue&type=template&id=2b335c5a&shadow

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
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=template&id=3c4495e5&
var RoomsListvue_type_template_id_3c4495e5_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showRoomsList,
      expression: "showRoomsList"
    }],
    staticClass: "vac-rooms-container vac-app-border-r",
    "class": {
      'vac-rooms-container-full': _vm.isMobile
    }
  }, [_vm._t("rooms-header"), _c('rooms-search', {
    attrs: {
      "rooms": _vm.rooms,
      "loading-rooms": _vm.loadingRooms,
      "text-messages": _vm.textMessages,
      "show-add-room": _vm.showAddRoom
    },
    on: {
      "search-room": _vm.searchRoom,
      "add-room": function addRoom($event) {
        return _vm.$emit('add-room');
      }
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  }), _c('loader', {
    attrs: {
      "show": _vm.loadingRooms
    }
  }), !_vm.loadingRooms && !_vm.rooms.length ? _c('div', {
    staticClass: "vac-rooms-empty"
  }, [_vm._t("rooms-empty", function () {
    return [_vm._v(" " + _vm._s(_vm.textMessages.ROOMS_EMPTY) + " ")];
  })], 2) : _vm._e(), !_vm.loadingRooms ? _c('div', {
    staticClass: "vac-room-list"
  }, [_vm._l(_vm.filteredRooms, function (fRoom) {
    return _c('div', {
      key: fRoom.roomId,
      staticClass: "vac-room-item",
      "class": {
        'vac-room-selected': _vm.selectedRoomId === fRoom.roomId
      },
      attrs: {
        "id": fRoom.roomId
      },
      on: {
        "click": function click($event) {
          return _vm.openRoom(fRoom);
        }
      }
    }, [_c('room-content', {
      attrs: {
        "current-user-id": _vm.currentUserId,
        "room": fRoom,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions,
        "text-messages": _vm.textMessages,
        "room-actions": _vm.roomActions
      },
      on: {
        "room-action-handler": function roomActionHandler($event) {
          return _vm.$emit('room-action-handler', $event);
        }
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    })], 1);
  }), _c('transition', {
    attrs: {
      "name": "vac-fade-message"
    }
  }, [_vm.rooms.length && !_vm.loadingRooms ? _c('infinite-loading', {
    attrs: {
      "force-use-infinite-wrapper": ".vac-room-list",
      "web-component-name": "vue-advanced-chat",
      "spinner": "spiral"
    },
    on: {
      "infinite": _vm.loadMoreRooms
    }
  }, [_c('div', {
    attrs: {
      "slot": "spinner"
    },
    slot: "spinner"
  }, [_c('loader', {
    attrs: {
      "show": true,
      "infinite": true
    }
  })], 1), _c('div', {
    attrs: {
      "slot": "no-results"
    },
    slot: "no-results"
  }), _c('div', {
    attrs: {
      "slot": "no-more"
    },
    slot: "no-more"
  })]) : _vm._e()], 1)], 2) : _vm._e()], 2);
};

var RoomsListvue_type_template_id_3c4495e5_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=template&id=3c4495e5&

// EXTERNAL MODULE: ./node_modules/vue-infinite-loading/dist/vue-infinite-loading.js
var vue_infinite_loading = __webpack_require__("e166");
var vue_infinite_loading_default = /*#__PURE__*/__webpack_require__.n(vue_infinite_loading);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Loader.vue?vue&type=template&id=115a59fa&
var Loadervue_type_template_id_115a59fa_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('transition', {
    attrs: {
      "name": "vac-fade-spinner",
      "appear": ""
    }
  }, [_vm.show ? _c('div', {
    staticClass: "vac-loader-wrapper",
    "class": {
      'vac-container-center': !_vm.infinite,
      'vac-container-top': _vm.infinite
    }
  }, [_c('div', {
    attrs: {
      "id": "vac-circle"
    }
  })]) : _vm._e()]);
};

var Loadervue_type_template_id_115a59fa_staticRenderFns = [];

// CONCATENATED MODULE: ./src/components/Loader.vue?vue&type=template&id=115a59fa&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Loader.vue?vue&type=script&lang=js&
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
// EXTERNAL MODULE: ./src/components/Loader.vue?vue&type=style&index=0&id=115a59fa&prod&lang=scss&
var Loadervue_type_style_index_0_id_115a59fa_prod_lang_scss_ = __webpack_require__("a136");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=template&id=079ff11e&
var RoomsSearchvue_type_template_id_079ff11e_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-box-search"
  }, [!_vm.loadingRooms && _vm.rooms.length ? _c('div', {
    staticClass: "vac-icon-search"
  }, [_vm._t("search-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "search"
      }
    })];
  })], 2) : _vm._e(), !_vm.loadingRooms && _vm.rooms.length ? _c('input', {
    staticClass: "vac-input",
    attrs: {
      "type": "search",
      "placeholder": _vm.textMessages.SEARCH,
      "autocomplete": "off"
    },
    on: {
      "input": function input($event) {
        return _vm.$emit('search-room', $event);
      }
    }
  }) : _vm._e(), _vm.showAddRoom ? _c('div', {
    staticClass: "vac-svg-button vac-add-icon",
    on: {
      "click": function click($event) {
        return _vm.$emit('add-room');
      }
    }
  }, [_vm._t("add-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "add"
      }
    })];
  })], 2) : _vm._e()]);
};

var RoomsSearchvue_type_template_id_079ff11e_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=template&id=079ff11e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SvgIcon.vue?vue&type=template&id=4b04b8f8&
var SvgIconvue_type_template_id_4b04b8f8_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "version": "1.1",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 ".concat(_vm.size, " ").concat(_vm.size)
    }
  }, [_c('path', {
    attrs: {
      "id": _vm.svgId,
      "d": _vm.svgItem[_vm.name].path,
      "stroke": _vm.stroke,
      "strokeWidth": "{1}"
    }
  }), _vm.svgItem[_vm.name].path2 ? _c('path', {
    attrs: {
      "id": _vm.svgId,
      "d": _vm.svgItem[_vm.name].path2
    }
  }) : _vm._e()]);
};

var SvgIconvue_type_template_id_4b04b8f8_staticRenderFns = [];

// CONCATENATED MODULE: ./src/components/SvgIcon.vue?vue&type=template&id=4b04b8f8&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SvgIcon.vue?vue&type=script&lang=js&
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
    },
    stroke: function stroke() {
      return this.name === 'close' ? 'black' : null;
    }
  }
});
// CONCATENATED MODULE: ./src/components/SvgIcon.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_SvgIconvue_type_script_lang_js_ = (SvgIconvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/SvgIcon.vue?vue&type=style&index=0&id=4b04b8f8&prod&lang=scss&
var SvgIconvue_type_style_index_0_id_4b04b8f8_prod_lang_scss_ = __webpack_require__("7ef0");

// CONCATENATED MODULE: ./src/components/SvgIcon.vue






/* normalize component */

var SvgIcon_component = normalizeComponent(
  components_SvgIconvue_type_script_lang_js_,
  SvgIconvue_type_template_id_4b04b8f8_render,
  SvgIconvue_type_template_id_4b04b8f8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var SvgIcon = (SvgIcon_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=script&lang=js&

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
// EXTERNAL MODULE: ./src/ChatWindow/RoomsList/RoomsSearch.vue?vue&type=style&index=0&id=079ff11e&prod&lang=scss&
var RoomsSearchvue_type_style_index_0_id_079ff11e_prod_lang_scss_ = __webpack_require__("51c4");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=template&id=2d7743ae&
var RoomContentvue_type_template_id_2d7743ae_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-room-container"
  }, [_vm._t("room-list-item", function () {
    return [_vm.room.avatar ? _c('div', {
      staticClass: "vac-avatar",
      style: {
        'background-image': "url('".concat(_vm.room.avatar, "')")
      }
    }) : _vm._e(), _c('div', {
      staticClass: "vac-name-container vac-text-ellipsis"
    }, [_c('div', {
      staticClass: "vac-title-container"
    }, [_vm.userStatus ? _c('div', {
      staticClass: "vac-state-circle",
      "class": {
        'vac-state-online': _vm.userStatus === 'online'
      }
    }) : _vm._e(), _c('div', {
      staticClass: "vac-room-name vac-text-ellipsis"
    }, [_vm._v(" " + _vm._s(_vm.room.roomName) + " ")]), _vm.room.lastMessage ? _c('div', {
      staticClass: "vac-text-date"
    }, [_vm._v(" " + _vm._s(_vm.room.lastMessage.timestamp) + " ")]) : _vm._e()]), _c('div', {
      staticClass: "vac-text-last",
      "class": {
        'vac-message-new': _vm.room.lastMessage && _vm.room.lastMessage["new"] && !_vm.typingUsers
      }
    }, [_vm.isMessageCheckmarkVisible ? _c('span', [_vm._t("checkmark-icon", function () {
      return [_c('svg-icon', {
        staticClass: "vac-icon-check",
        attrs: {
          "name": _vm.room.lastMessage.distributed ? 'double-checkmark' : 'checkmark',
          "param": _vm.room.lastMessage.seen ? 'seen' : ''
        }
      })];
    }, null, _vm.room.lastMessage)], 2) : _vm._e(), _vm.room.lastMessage && !_vm.room.lastMessage.deleted && _vm.isAudio ? _c('div', {
      staticClass: "vac-text-ellipsis"
    }, [_vm._t("microphone-icon", function () {
      return [_c('svg-icon', {
        staticClass: "vac-icon-microphone",
        attrs: {
          "name": "microphone"
        }
      })];
    }), _vm._v(" " + _vm._s(_vm.formattedDuration) + " ")], 2) : _vm.room.lastMessage ? _c('format-message', {
      attrs: {
        "content": _vm.getLastMessage,
        "deleted": !!_vm.room.lastMessage.deleted && !_vm.typingUsers,
        "users": _vm.room.users,
        "linkify": false,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions,
        "single-line": true
      },
      scopedSlots: _vm._u([{
        key: "deleted-icon",
        fn: function fn(data) {
          return [_vm._t("deleted-icon", null, null, data)];
        }
      }], null, true)
    }) : _vm._e(), !_vm.room.lastMessage && _vm.typingUsers ? _c('div', {
      staticClass: "vac-text-ellipsis"
    }, [_vm._v(" " + _vm._s(_vm.typingUsers) + " ")]) : _vm._e(), _c('div', {
      staticClass: "vac-room-options-container"
    }, [_vm.room.unreadCount ? _c('div', {
      staticClass: "vac-badge-counter vac-room-badge"
    }, [_vm._v(" " + _vm._s(_vm.room.unreadCount) + " ")]) : _vm._e(), _vm._t("room-list-options", function () {
      return [_vm.roomActions.length ? _c('div', {
        staticClass: "vac-svg-button vac-list-room-options",
        on: {
          "click": function click($event) {
            $event.stopPropagation();
            _vm.roomMenuOpened = _vm.room.roomId;
          }
        }
      }, [_vm._t("room-list-options-icon", function () {
        return [_c('svg-icon', {
          attrs: {
            "name": "dropdown",
            "param": "room"
          }
        })];
      })], 2) : _vm._e(), _vm.roomActions.length ? _c('transition', {
        attrs: {
          "name": "vac-slide-left"
        }
      }, [_vm.roomMenuOpened === _vm.room.roomId ? _c('div', {
        directives: [{
          name: "click-outside",
          rawName: "v-click-outside",
          value: _vm.closeRoomMenu,
          expression: "closeRoomMenu"
        }],
        staticClass: "vac-menu-options"
      }, [_c('div', {
        staticClass: "vac-menu-list"
      }, _vm._l(_vm.roomActions, function (action) {
        return _c('div', {
          key: action.name
        }, [_c('div', {
          staticClass: "vac-menu-item",
          on: {
            "click": function click($event) {
              $event.stopPropagation();
              return _vm.roomActionHandler(action);
            }
          }
        }, [_vm._v(" " + _vm._s(action.title) + " ")])]);
      }), 0)]) : _vm._e()]) : _vm._e()];
    }, null, {
      room: _vm.room
    })], 2)], 1)])];
  }, null, {
    room: _vm.room
  })], 2);
};

var RoomContentvue_type_template_id_2d7743ae_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=template&id=2d7743ae&

// EXTERNAL MODULE: ./node_modules/v-click-outside/dist/v-click-outside.umd.js
var v_click_outside_umd = __webpack_require__("c28b");
var v_click_outside_umd_default = /*#__PURE__*/__webpack_require__.n(v_click_outside_umd);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FormatMessage.vue?vue&type=template&id=0ef5045f&
var FormatMessagevue_type_template_id_0ef5045f_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-format-message-wrapper",
    "class": {
      'vac-text-ellipsis': _vm.singleLine
    }
  }, [_vm.textFormatting ? _c('div', {
    "class": {
      'vac-text-ellipsis': _vm.singleLine
    }
  }, [_vm._l(_vm.linkifiedMessage, function (message, i) {
    return [_c(message.url ? 'a' : 'span', {
      key: i,
      tag: "component",
      "class": {
        'vac-text-ellipsis': _vm.singleLine,
        'vac-text-bold': message.bold,
        'vac-text-italic': _vm.deleted || message.italic,
        'vac-text-strike': message.strike,
        'vac-text-underline': message.underline,
        'vac-text-inline-code': !_vm.singleLine && message.inline,
        'vac-text-multiline-code': !_vm.singleLine && message.multiline,
        'vac-text-tag': !_vm.singleLine && !_vm.reply && message.tag
      },
      attrs: {
        "href": message.href,
        "target": message.href ? _vm.linkOptions.target : null
      },
      on: {
        "click": function click($event) {
          return _vm.openTag(message);
        }
      }
    }, [_vm._t("deleted-icon", function () {
      return [_vm.deleted ? _c('svg-icon', {
        staticClass: "vac-icon-deleted",
        attrs: {
          "name": "deleted"
        }
      }) : _vm._e()];
    }, null, {
      deleted: _vm.deleted
    }), message.url && message.image ? [_c('div', {
      staticClass: "vac-image-link-container"
    }, [_c('div', {
      staticClass: "vac-image-link",
      style: {
        'background-image': "url('".concat(message.value, "')"),
        height: message.height
      }
    })]), _c('div', {
      staticClass: "vac-image-link-message"
    }, [_c('span', [_vm._v(_vm._s(message.value))])])] : [_c('span', [_vm._v(_vm._s(message.value))])]], 2)];
  })], 2) : _c('div', [_vm._v(" " + _vm._s(_vm.formattedContent) + " ")])]);
};

var FormatMessagevue_type_template_id_0ef5045f_staticRenderFns = [];

// CONCATENATED MODULE: ./src/components/FormatMessage.vue?vue&type=template&id=0ef5045f&

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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FormatMessage.vue?vue&type=script&lang=js&



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
// EXTERNAL MODULE: ./src/components/FormatMessage.vue?vue&type=style&index=0&id=0ef5045f&prod&lang=scss&
var FormatMessagevue_type_style_index_0_id_0ef5045f_prod_lang_scss_ = __webpack_require__("c22c");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=script&lang=js&





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
// EXTERNAL MODULE: ./src/ChatWindow/RoomsList/RoomContent.vue?vue&type=style&index=0&id=2d7743ae&prod&lang=scss&
var RoomContentvue_type_style_index_0_id_2d7743ae_prod_lang_scss_ = __webpack_require__("9ca8");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=script&lang=js&





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
// EXTERNAL MODULE: ./src/ChatWindow/RoomsList/RoomsList.vue?vue&type=style&index=0&id=3c4495e5&prod&lang=scss&
var RoomsListvue_type_style_index_0_id_3c4495e5_prod_lang_scss_ = __webpack_require__("6919");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/Room.vue?vue&type=template&id=05b0c3b4&
var Roomvue_type_template_id_05b0c3b4_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.isMobile && !_vm.showRoomsList || !_vm.isMobile || _vm.singleRoom,
      expression: "(isMobile && !showRoomsList) || !isMobile || singleRoom"
    }],
    staticClass: "vac-col-messages"
  }, [_vm.showNoRoom ? _vm._t("no-room-selected", function () {
    return [_c('div', {
      staticClass: "vac-container-center vac-room-empty"
    }, [_c('div', [_vm._v(_vm._s(_vm.textMessages.ROOM_EMPTY))])])];
  }) : _c('room-header', {
    attrs: {
      "current-user-id": _vm.currentUserId,
      "text-messages": _vm.textMessages,
      "single-room": _vm.singleRoom,
      "show-rooms-list": _vm.showRoomsList,
      "is-mobile": _vm.isMobile,
      "room-info": _vm.roomInfo,
      "menu-actions": _vm.menuActions,
      "room": _vm.room
    },
    on: {
      "toggle-rooms-list": function toggleRoomsList($event) {
        return _vm.$emit('toggle-rooms-list');
      },
      "room-info": function roomInfo($event) {
        return _vm.$emit('room-info');
      },
      "menu-action-handler": function menuActionHandler($event) {
        return _vm.$emit('menu-action-handler', $event);
      }
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  }), _c('div', {
    ref: "scrollContainer",
    staticClass: "vac-container-scroll",
    on: {
      "scroll": _vm.onContainerScroll
    }
  }, [_c('loader', {
    attrs: {
      "show": _vm.loadingMessages
    }
  }), _c('div', {
    staticClass: "vac-messages-container"
  }, [_c('div', {
    "class": {
      'vac-messages-hidden': _vm.loadingMessages
    }
  }, [_c('transition', {
    attrs: {
      "name": "vac-fade-message"
    }
  }, [_vm.showNoMessages ? _c('div', {
    staticClass: "vac-text-started"
  }, [_vm._t("messages-empty", function () {
    return [_vm._v(" " + _vm._s(_vm.textMessages.MESSAGES_EMPTY) + " ")];
  })], 2) : _vm._e(), _vm.showMessagesStarted ? _c('div', {
    staticClass: "vac-text-started"
  }, [_vm._v(" " + _vm._s(_vm.textMessages.CONVERSATION_STARTED) + " " + _vm._s(_vm.messages[0].date) + " ")]) : _vm._e()]), _c('transition', {
    attrs: {
      "name": "vac-fade-message"
    }
  }, [_vm.messages.length ? _c('infinite-loading', {
    "class": {
      'vac-infinite-loading': !_vm.messagesLoaded
    },
    attrs: {
      "force-use-infinite-wrapper": ".vac-container-scroll",
      "web-component-name": "vue-advanced-chat",
      "spinner": "spiral",
      "direction": "top",
      "distance": 40
    },
    on: {
      "infinite": _vm.loadMoreMessages
    }
  }, [_c('div', {
    attrs: {
      "slot": "spinner"
    },
    slot: "spinner"
  }, [_c('loader', {
    attrs: {
      "show": true,
      "infinite": true
    }
  })], 1), _c('div', {
    attrs: {
      "slot": "no-results"
    },
    slot: "no-results"
  }), _c('div', {
    attrs: {
      "slot": "no-more"
    },
    slot: "no-more"
  })]) : _vm._e()], 1), _c('transition-group', {
    key: _vm.roomId,
    attrs: {
      "name": "vac-fade-message"
    }
  }, _vm._l(_vm.messages, function (m, i) {
    return _c('div', {
      key: m._id
    }, [_c('message', {
      attrs: {
        "current-user-id": _vm.currentUserId,
        "message": m,
        "index": i,
        "messages": _vm.messages,
        "edited-message": _vm.editedMessage,
        "message-actions": _vm.messageActions,
        "room-users": _vm.room.users,
        "text-messages": _vm.textMessages,
        "room-footer-ref": _vm.$refs.roomFooter,
        "new-messages": _vm.newMessages,
        "show-reaction-emojis": _vm.showReactionEmojis,
        "show-new-messages-divider": _vm.showNewMessagesDivider,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions,
        "emojis-list": _vm.emojisList,
        "hide-options": _vm.hideOptions
      },
      on: {
        "message-added": _vm.onMessageAdded,
        "message-action-handler": _vm.messageActionHandler,
        "open-file": _vm.openFile,
        "open-user-tag": _vm.openUserTag,
        "send-message-reaction": _vm.sendMessageReaction,
        "hide-options": function hideOptions($event) {
          _vm.hideOptions = $event;
        }
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (idx, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    })], 1);
  }), 0)], 1)])], 1), !_vm.loadingMessages ? _c('div', [_c('transition', {
    attrs: {
      "name": "vac-bounce"
    }
  }, [_vm.scrollIcon ? _c('div', {
    staticClass: "vac-icon-scroll",
    on: {
      "click": _vm.scrollToBottom
    }
  }, [_c('transition', {
    attrs: {
      "name": "vac-bounce"
    }
  }, [_vm.scrollMessagesCount ? _c('div', {
    staticClass: "vac-badge-counter vac-messages-count"
  }, [_vm._v(" " + _vm._s(_vm.scrollMessagesCount) + " ")]) : _vm._e()]), _vm._t("scroll-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "dropdown",
        "param": "scroll"
      }
    })];
  })], 2) : _vm._e()])], 1) : _vm._e(), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !!_vm.files.length,
      expression: "!!files.length"
    }],
    staticClass: "vac-app-box-shadow files-list",
    staticStyle: {
      "bottom": "66px"
    }
  }, [_c('div', {
    staticClass: "vac-files-box"
  }, _vm._l(_vm.files, function (item, index) {
    return _c('file-upload', {
      key: index,
      attrs: {
        "index": index,
        "file": item
      },
      on: {
        "close-single-file": _vm.removeSingleFile
      }
    });
  }), 1), _c('div', {
    staticClass: "vac-svg-button vac-close-all-files",
    on: {
      "click": _vm.closeUploadedFiles
    }
  }, [_c('svg-icon', {
    attrs: {
      "name": "close-outline"
    }
  })], 1)]), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: Object.keys(_vm.room).length && _vm.showFooter,
      expression: "Object.keys(room).length && showFooter"
    }],
    ref: "roomFooter",
    staticClass: "vac-room-footer"
  }, [_c('room-message-reply', {
    attrs: {
      "room": _vm.room,
      "message-reply": _vm.messageReply,
      "text-formatting": _vm.textFormatting,
      "link-options": _vm.linkOptions
    },
    on: {
      "reset-message": _vm.resetMessage
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  }), _c('room-emojis', {
    attrs: {
      "filtered-emojis": _vm.filteredEmojis
    },
    on: {
      "select-emoji": function selectEmoji($event) {
        return _vm.selectEmoji($event);
      }
    }
  }), _c('room-users-tag', {
    attrs: {
      "filtered-users-tag": _vm.filteredUsersTag
    },
    on: {
      "select-user-tag": function selectUserTag($event) {
        return _vm.selectUserTag($event);
      }
    }
  }), _c('div', {
    staticClass: "vac-box-footer",
    "class": {
      'vac-app-box-shadow': _vm.filteredEmojis.length || _vm.filteredUsersTag.length
    }
  }, [_vm.showAudio && !_vm.imageFile && !_vm.videoFile ? _c('div', {
    staticClass: "vac-icon-textarea-left"
  }, [_vm.isRecording ? [_c('div', {
    staticClass: "vac-svg-button vac-icon-audio-stop",
    on: {
      "click": _vm.stopRecorder
    }
  }, [_vm._t("audio-stop-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "close-outline"
      }
    })];
  })], 2), _c('div', {
    staticClass: "vac-dot-audio-record"
  }), _c('div', {
    staticClass: "vac-dot-audio-record-time"
  }, [_vm._v(" " + _vm._s(_vm.recordedTime) + " ")]), _c('div', {
    staticClass: "vac-svg-button vac-icon-audio-confirm",
    on: {
      "click": function click($event) {
        return _vm.toggleRecorder(false);
      }
    }
  }, [_vm._t("audio-stop-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "checkmark"
      }
    })];
  })], 2)] : _c('div', {
    staticClass: "vac-svg-button",
    on: {
      "click": function click($event) {
        return _vm.toggleRecorder(true);
      }
    }
  }, [_vm._t("microphone-icon", function () {
    return [_c('svg-icon', {
      staticClass: "vac-icon-microphone",
      attrs: {
        "name": "microphone"
      }
    })];
  })], 2)], 2) : _vm._e(), _c('textarea', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.file || _vm.imageFile || _vm.videoFile,
      expression: "!file || imageFile || videoFile"
    }, {
      name: "model",
      rawName: "v-model",
      value: _vm.message,
      expression: "message"
    }],
    ref: "roomTextarea",
    staticClass: "vac-textarea",
    "class": {
      'vac-textarea-outline': _vm.editedMessage._id
    },
    style: {
      'min-height': '20px',
      'padding-left': '12px'
    },
    attrs: {
      "placeholder": _vm.textMessages.TYPE_MESSAGE
    },
    domProps: {
      "value": _vm.message
    },
    on: {
      "input": [function ($event) {
        if ($event.target.composing) return;
        _vm.message = $event.target.value;
      }, _vm.onChangeInput],
      "keydown": function keydown($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) return null;
        return _vm.escapeTextarea.apply(null, arguments);
      }
    }
  }), _c('div', {
    staticClass: "vac-icon-textarea"
  }, [_vm.editedMessage._id ? _c('div', {
    staticClass: "vac-svg-button",
    on: {
      "click": _vm.resetMessage
    }
  }, [_vm._t("edit-close-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "close-outline"
      }
    })];
  })], 2) : _vm._e(), _vm.showEmojis && (!_vm.file || _vm.imageFile || _vm.videoFile) ? _c('emoji-picker', {
    attrs: {
      "emoji-opened": _vm.emojiOpened,
      "position-top": true
    },
    on: {
      "add-emoji": _vm.addEmoji,
      "open-emoji": function openEmoji($event) {
        _vm.emojiOpened = $event;
      }
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  }) : _vm._e(), _vm.showFiles ? _c('div', {
    staticClass: "vac-svg-button",
    on: {
      "click": _vm.launchFilePicker
    }
  }, [_vm._t("paperclip-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "paperclip"
      }
    })];
  })], 2) : _vm._e(), _vm.textareaAction ? _c('div', {
    staticClass: "vac-svg-button",
    on: {
      "click": _vm.textareaActionHandler
    }
  }, [_vm._t("custom-action-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "deleted"
      }
    })];
  })], 2) : _vm._e(), _vm.showFiles ? _c('input', {
    ref: "file",
    staticStyle: {
      "display": "none"
    },
    attrs: {
      "type": "file",
      "multiple": "multiple",
      "accept": _vm.acceptedFiles
    },
    on: {
      "change": function change($event) {
        return _vm.onFileChange($event.target.files);
      }
    }
  }) : _vm._e(), _vm.showSendIcon ? _c('div', {
    staticClass: "vac-svg-button",
    "class": {
      'vac-send-disabled': _vm.isMessageEmpty
    },
    on: {
      "click": _vm.sendMessage
    }
  }, [_vm._t("send-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "send",
        "param": _vm.isMessageEmpty ? 'disabled' : ''
      }
    })];
  })], 2) : _vm._e()], 1)])], 1)], 2);
};

var Roomvue_type_template_id_05b0c3b4_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Room/Room.vue?vue&type=template&id=05b0c3b4&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__("d9e2");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__("53ca");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js


function _regeneratorRuntime() {
  "use strict";
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == Object(esm_typeof["a" /* default */])(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) {
            if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
          }

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) {
        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      }
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
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
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/EmojiPicker.vue?vue&type=template&id=0e56d761&
var EmojiPickervue_type_template_id_0e56d761_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-wrapper"
  }, [_c('emoji-picker', {
    attrs: {
      "search": _vm.search
    },
    on: {
      "emoji": _vm.append
    },
    scopedSlots: _vm._u([{
      key: "emoji-invoker",
      fn: function fn(_ref) {
        var clickEvent = _ref.events.click;
        return _c('div', {
          staticClass: "vac-svg-button",
          "class": {
            'vac-emoji-reaction': _vm.emojiReaction
          },
          on: {
            "click": [function ($event) {
              $event.stopPropagation();
              return clickEvent.apply(null, arguments);
            }, _vm.openEmoji]
          }
        }, [_vm._t("emoji-picker-icon", function () {
          return [_c('svg-icon', {
            attrs: {
              "name": "emoji",
              "param": _vm.emojiReaction ? 'reaction' : ''
            }
          })];
        })], 2);
      }
    }, {
      key: "emoji-picker",
      fn: function fn(_ref2) {
        var emojis = _ref2.emojis,
            insert = _ref2.insert;
        return _vm.emojiOpened ? _c('div', {}, [_c('transition', {
          attrs: {
            "name": "vac-slide-up",
            "appear": ""
          }
        }, [_c('div', {
          staticClass: "vac-emoji-picker",
          "class": {
            'vac-picker-reaction': _vm.emojiReaction
          },
          style: {
            height: "".concat(_vm.emojiPickerHeight, "px"),
            top: _vm.positionTop ? _vm.emojiPickerHeight : "".concat(_vm.emojiPickerTop, "px"),
            right: _vm.emojiPickerRight,
            display: _vm.emojiPickerTop || !_vm.emojiReaction ? 'initial' : 'none'
          }
        }, [_c('div', {
          staticClass: "vac-emoji-picker__search"
        }, [_c('input', {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: _vm.search,
            expression: "search"
          }],
          attrs: {
            "type": "text"
          },
          domProps: {
            "value": _vm.search
          },
          on: {
            "input": function input($event) {
              if ($event.target.composing) return;
              _vm.search = $event.target.value;
            }
          }
        })]), _c('div', _vm._l(emojis, function (emojiGroup, category) {
          return _c('div', {
            key: category
          }, [category !== 'Frequently used' ? _c('h5', [_vm._v(" " + _vm._s(category) + " ")]) : _vm._e(), category !== 'Frequently used' ? _c('div', {
            staticClass: "vac-emojis"
          }, _vm._l(emojiGroup, function (emoji, emojiName) {
            return _c('span', {
              key: emojiName,
              attrs: {
                "title": emojiName
              },
              on: {
                "click": function click($event) {
                  return insert({
                    emoji: emoji,
                    emojiName: emojiName
                  });
                }
              }
            }, [_vm._v(" " + _vm._s(emoji) + " ")]);
          }), 0) : _vm._e()]);
        }), 0)])])], 1) : _vm._e();
      }
    }], null, true)
  })], 1);
};

var EmojiPickervue_type_template_id_0e56d761_staticRenderFns = [];

// CONCATENATED MODULE: ./src/components/EmojiPicker.vue?vue&type=template&id=0e56d761&

// EXTERNAL MODULE: ./node_modules/vue-emoji-picker/dist-module/main.js
var main = __webpack_require__("669f");
var main_default = /*#__PURE__*/__webpack_require__.n(main);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/EmojiPicker.vue?vue&type=script&lang=js&


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
// EXTERNAL MODULE: ./src/components/EmojiPicker.vue?vue&type=style&index=0&id=0e56d761&prod&lang=scss&
var EmojiPickervue_type_style_index_0_id_0e56d761_prod_lang_scss_ = __webpack_require__("e868");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomHeader.vue?vue&type=template&id=0afde938&
var RoomHeadervue_type_template_id_0afde938_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-room-header vac-app-border-b"
  }, [_vm._t("room-header", function () {
    return [_c('div', {
      staticClass: "vac-room-wrapper"
    }, [!_vm.singleRoom ? _c('div', {
      staticClass: "vac-svg-button vac-toggle-button",
      "class": {
        'vac-rotate-icon': !_vm.showRoomsList && !_vm.isMobile
      },
      on: {
        "click": function click($event) {
          return _vm.$emit('toggle-rooms-list');
        }
      }
    }, [_vm._t("toggle-icon", function () {
      return [_c('svg-icon', {
        attrs: {
          "name": "toggle"
        }
      })];
    })], 2) : _vm._e(), _c('div', {
      staticClass: "vac-info-wrapper",
      "class": {
        'vac-item-clickable': _vm.roomInfo
      },
      on: {
        "click": function click($event) {
          return _vm.$emit('room-info');
        }
      }
    }, [_vm._t("room-header-avatar", function () {
      return [_vm.room.avatar ? _c('div', {
        staticClass: "vac-avatar",
        style: {
          'background-image': "url('".concat(_vm.room.avatar, "')")
        }
      }) : _vm._e()];
    }, null, {
      room: _vm.room
    }), _vm._t("room-header-info", function () {
      return [_c('div', {
        staticClass: "vac-text-ellipsis"
      }, [_c('div', {
        staticClass: "vac-room-name vac-text-ellipsis"
      }, [_vm._v(" " + _vm._s(_vm.room.roomName) + " ")]), _vm.typingUsers ? _c('div', {
        staticClass: "vac-room-info vac-text-ellipsis"
      }, [_vm._v(" " + _vm._s(_vm.typingUsers) + " ")]) : _c('div', {
        staticClass: "vac-room-info vac-text-ellipsis"
      }, [_vm._v(" " + _vm._s(_vm.userStatus) + " ")])])];
    }, null, {
      room: _vm.room,
      typingUsers: _vm.typingUsers,
      userStatus: _vm.userStatus
    })], 2), _vm.room.roomId ? _vm._t("room-options", function () {
      return [_vm.menuActions.length ? _c('div', {
        staticClass: "vac-svg-button vac-room-options",
        on: {
          "click": function click($event) {
            _vm.menuOpened = !_vm.menuOpened;
          }
        }
      }, [_vm._t("menu-icon", function () {
        return [_c('svg-icon', {
          attrs: {
            "name": "menu"
          }
        })];
      })], 2) : _vm._e(), _vm.menuActions.length ? _c('transition', {
        attrs: {
          "name": "vac-slide-left"
        }
      }, [_vm.menuOpened ? _c('div', {
        directives: [{
          name: "click-outside",
          rawName: "v-click-outside",
          value: _vm.closeMenu,
          expression: "closeMenu"
        }],
        staticClass: "vac-menu-options"
      }, [_c('div', {
        staticClass: "vac-menu-list"
      }, _vm._l(_vm.menuActions, function (action) {
        return _c('div', {
          key: action.name
        }, [_c('div', {
          staticClass: "vac-menu-item",
          on: {
            "click": function click($event) {
              return _vm.menuActionHandler(action);
            }
          }
        }, [_vm._v(" " + _vm._s(action.title) + " ")])]);
      }), 0)]) : _vm._e()]) : _vm._e()];
    }) : _vm._e()], 2)];
  }, null, {
    room: _vm.room,
    typingUsers: _vm.typingUsers,
    userStatus: _vm.userStatus
  })], 2);
};

var RoomHeadervue_type_template_id_0afde938_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomHeader.vue?vue&type=template&id=0afde938&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomHeader.vue?vue&type=script&lang=js&



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
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomHeader.vue?vue&type=style&index=0&id=0afde938&prod&lang=scss&
var RoomHeadervue_type_style_index_0_id_0afde938_prod_lang_scss_ = __webpack_require__("39f6");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=template&id=4582354b&
var RoomMessageReplyvue_type_template_id_4582354b_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('transition', {
    attrs: {
      "name": "vac-slide-up"
    }
  }, [_vm.messageReply ? _c('div', {
    staticClass: "vac-reply-container",
    style: {
      bottom: "".concat(_vm.$parent.$refs.roomFooter.clientHeight, "px")
    }
  }, [_c('div', {
    staticClass: "vac-reply-box"
  }, [_vm.isImageFile ? _c('img', {
    staticClass: "vac-image-reply",
    attrs: {
      "src": _vm.messageReply.file.url
    }
  }) : _vm._e(), _c('div', [_c('div', {
    staticClass: "vac-non-preview-icon"
  }, [_c('svg-icon', {
    attrs: {
      "name": "file"
    }
  })], 1), _c('div', {
    staticClass: "vac-non-preview-content"
  }, [_c('div', [_c('center', [_vm._v(_vm._s(_vm.messageReply.file.name))])], 1), _c('div', [_c('center', [_vm._v(_vm._s(_vm.messageReply.file.extension))])], 1)])]), _c('div', {
    staticClass: "vac-reply-info"
  }, [_c('div', {
    staticClass: "vac-reply-username"
  }, [_vm._v(" " + _vm._s(_vm.messageReply.username) + " ")]), _c('div', {
    staticClass: "vac-reply-content"
  }, [_c('format-message', {
    attrs: {
      "content": _vm.messageReply.content,
      "users": _vm.room.users,
      "text-formatting": _vm.textFormatting,
      "link-options": _vm.linkOptions,
      "reply": true
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  })], 1)])]), _c('div', {
    staticClass: "vac-icon-reply"
  }, [_c('div', {
    staticClass: "vac-svg-button",
    on: {
      "click": function click($event) {
        return _vm.$emit('reset-message');
      }
    }
  }, [_vm._t("reply-close-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "close-outline"
      }
    })];
  })], 2)])]) : _vm._e()]);
};

var RoomMessageReplyvue_type_template_id_4582354b_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=template&id=4582354b&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=script&lang=js&



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
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue?vue&type=style&index=0&id=4582354b&prod&lang=scss&
var RoomMessageReplyvue_type_style_index_0_id_4582354b_prod_lang_scss_ = __webpack_require__("b527");

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomMessageReply.vue






/* normalize component */

var RoomMessageReply_component = normalizeComponent(
  Room_RoomMessageReplyvue_type_script_lang_js_,
  RoomMessageReplyvue_type_template_id_4582354b_render,
  RoomMessageReplyvue_type_template_id_4582354b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var RoomMessageReply = (RoomMessageReply_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=template&id=adecc494&
var RoomUsersTagvue_type_template_id_adecc494_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('transition', {
    attrs: {
      "name": "vac-slide-up"
    }
  }, [_vm.filteredUsersTag.length ? _c('div', {
    staticClass: "vac-tags-container vac-app-box-shadow",
    style: {
      bottom: "".concat(_vm.$parent.$refs.roomFooter.clientHeight, "px")
    }
  }, _vm._l(_vm.filteredUsersTag, function (user) {
    return _c('div', {
      key: user._id,
      staticClass: "vac-tags-box",
      on: {
        "click": function click($event) {
          return _vm.$emit('select-user-tag', user);
        }
      }
    }, [_c('div', {
      staticClass: "vac-tags-info"
    }, [user.avatar ? _c('div', {
      staticClass: "vac-avatar vac-tags-avatar",
      style: {
        'background-image': "url('".concat(user.avatar, "')")
      }
    }) : _vm._e(), _c('div', {
      staticClass: "vac-tags-username"
    }, [_vm._v(" " + _vm._s(user.username) + " ")])])]);
  }), 0) : _vm._e()]);
};

var RoomUsersTagvue_type_template_id_adecc494_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=template&id=adecc494&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=script&lang=js&
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
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomUsersTag.vue?vue&type=style&index=0&id=adecc494&prod&lang=scss&
var RoomUsersTagvue_type_style_index_0_id_adecc494_prod_lang_scss_ = __webpack_require__("f48d");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomEmojis.vue?vue&type=template&id=04b99276&
var RoomEmojisvue_type_template_id_04b99276_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('transition', {
    attrs: {
      "name": "vac-slide-up"
    }
  }, [_vm.filteredEmojis.length ? _c('div', {
    staticClass: "vac-emojis-container vac-app-box-shadow",
    style: {
      bottom: "".concat(_vm.$parent.$refs.roomFooter.clientHeight, "px")
    }
  }, _vm._l(_vm.filteredEmojis, function (emoji) {
    return _c('div', {
      key: emoji,
      staticClass: "vac-emoji-element",
      on: {
        "click": function click($event) {
          return _vm.$emit('select-emoji', emoji);
        }
      }
    }, [_vm._v(" " + _vm._s(emoji) + " ")]);
  }), 0) : _vm._e()]);
};

var RoomEmojisvue_type_template_id_04b99276_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Room/RoomEmojis.vue?vue&type=template&id=04b99276&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/RoomEmojis.vue?vue&type=script&lang=js&
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
// EXTERNAL MODULE: ./src/ChatWindow/Room/RoomEmojis.vue?vue&type=style&index=0&id=04b99276&prod&lang=scss&
var RoomEmojisvue_type_style_index_0_id_04b99276_prod_lang_scss_ = __webpack_require__("1229");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/Message.vue?vue&type=template&id=a4b15182&
var Messagevue_type_template_id_a4b15182_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    ref: _vm.message._id,
    staticClass: "vac-message-wrapper",
    attrs: {
      "id": _vm.message._id
    }
  }, [_vm.showDate ? _c('div', {
    staticClass: "vac-card-info vac-card-date"
  }, [_vm._v(" " + _vm._s(_vm.message.date) + " ")]) : _vm._e(), _vm.newMessage._id === _vm.message._id ? _c('div', {
    staticClass: "vac-line-new"
  }, [_vm._v(" " + _vm._s(_vm.textMessages.NEW_MESSAGES) + " ")]) : _vm._e(), _vm.message.system ? _c('div', {
    staticClass: "vac-card-info vac-card-system"
  }, [_vm._v(" " + _vm._s(_vm.message.content) + " ")]) : _c('div', {
    staticClass: "vac-message-box",
    "class": {
      'vac-offset-current': _vm.message.senderId === _vm.currentUserId
    }
  }, [_vm._t("message", function () {
    return [_vm.message.avatar && _vm.message.senderId !== _vm.currentUserId ? _c('div', {
      staticClass: "vac-avatar",
      style: {
        'background-image': "url('".concat(_vm.message.avatar, "')")
      }
    }) : _vm._e(), _c('div', {
      staticClass: "vac-message-container",
      "class": {
        'vac-message-container-offset': _vm.messageOffset
      }
    }, [_c('div', {
      staticClass: "vac-message-card",
      "class": {
        'vac-message-highlight': _vm.isMessageHover,
        'vac-message-current': _vm.message.senderId === _vm.currentUserId,
        'vac-message-deleted': _vm.message.deleted
      },
      on: {
        "mouseover": _vm.onHoverMessage,
        "mouseleave": _vm.onLeaveMessage
      }
    }, [_vm.isUploading ? _c('div', {
      staticClass: "vac-file-message"
    }, [_c('progress-circle', {
      attrs: {
        "completed-steps": _vm.message.uploadingScore,
        "total-steps": 100,
        "diameter": 50,
        "circle-color": "#f3f3f3",
        "start-color": "green",
        "stop-color": "green",
        "circle-width": 5,
        "inner-display": "slot"
      }
    }, [_c('div', [_vm._v(_vm._s(_vm.message.uploadingScore + "%"))])]), _c('span', [_vm._v(_vm._s(_vm.message.fileId))])], 1) : _vm._e(), _vm.roomUsers.length > 2 && _vm.message.senderId !== _vm.currentUserId ? _c('div', {
      staticClass: "vac-text-username",
      "class": {
        'vac-username-reply': !_vm.message.deleted && _vm.message.replyMessage
      }
    }, [_c('span', [_vm._v(_vm._s(_vm.message.username))])]) : _vm._e(), !_vm.message.deleted && _vm.message.replyMessage ? _c('message-reply', {
      attrs: {
        "message": _vm.message,
        "room-users": _vm.roomUsers,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    }) : _vm._e(), _vm.message.deleted ? _c('div', [_vm._t("deleted-icon", function () {
      return [_c('svg-icon', {
        staticClass: "vac-icon-deleted",
        attrs: {
          "name": "deleted"
        }
      })];
    }), _c('span', [_vm._v(_vm._s(_vm.textMessages.MESSAGE_DELETED))])], 2) : !_vm.message.file ? _c('format-message', {
      attrs: {
        "content": _vm.message.content,
        "users": _vm.roomUsers,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions
      },
      on: {
        "open-user-tag": _vm.openUserTag
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    }) : _vm.isImage ? _c('message-image', {
      attrs: {
        "current-user-id": _vm.currentUserId,
        "message": _vm.message,
        "room-users": _vm.roomUsers,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions,
        "image-hover": _vm.imageHover
      },
      on: {
        "open-file": _vm.openFile
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    }) : _vm.isVideo ? _c('div', {
      staticClass: "vac-video-container"
    }, [_c('video', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "controls": ""
      }
    }, [_c('source', {
      attrs: {
        "src": _vm.message.file.url
      }
    })]), _c('format-message', {
      attrs: {
        "content": _vm.message.content,
        "users": _vm.roomUsers,
        "text-formatting": _vm.textFormatting,
        "link-options": _vm.linkOptions
      },
      on: {
        "open-user-tag": _vm.openUserTag
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    })], 1) : _vm.isAudio ? _c('audio-player', {
      attrs: {
        "src": _vm.message.file.url
      },
      on: {
        "update-progress-time": function updateProgressTime($event) {
          _vm.progressTime = $event;
        },
        "hover-audio-progress": function hoverAudioProgress($event) {
          _vm.hoverAudioProgress = $event;
        }
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    }) : _c('div', [_c('div', {
      staticClass: "vac-non-preview-container"
    }, [_c('div', {
      staticClass: "vac-svg-button",
      on: {
        "click": function click($event) {
          $event.stopPropagation();
          return _vm.openFile('download');
        }
      }
    }, [_vm._t("document-icon", function () {
      return [_c('svg-icon', {
        attrs: {
          "name": "document"
        }
      })];
    })], 2), _c('div', {
      staticClass: "doc-svg-icon"
    }, [_c('svg-icon', {
      staticClass: "doc-svg-button",
      attrs: {
        "name": "file"
      }
    })], 1), _c('div', {
      staticClass: "text-container"
    }, [_c('div', {
      staticClass: "vac-text-ellipsis"
    }, [_c('center', [_vm._v(_vm._s(_vm.message.file.name))])], 1), _c('div', {
      staticClass: "vac-text-extension"
    }, [_c('center', [_vm._v(_vm._s(_vm.message.file.extension))])], 1)]), _vm.message.content ? _c('hr') : _vm._e()]), _c('div', {
      staticClass: "vac-file-message"
    }, [_c('span', [_vm._v(_vm._s(_vm.message.content))])])]), _vm.isAudio && !_vm.message.deleted ? _c('div', {
      staticClass: "vac-progress-time"
    }, [_vm._v(" " + _vm._s(_vm.progressTime) + " ")]) : _vm._e(), _c('div', {
      staticClass: "vac-text-timestamp"
    }, [_vm.message.edited && !_vm.message.deleted ? _c('div', {
      staticClass: "vac-icon-edited"
    }, [_vm._t("pencil-icon", function () {
      return [_c('svg-icon', {
        attrs: {
          "name": "pencil"
        }
      })];
    })], 2) : _vm._e(), _c('span', [_vm._v(_vm._s(_vm.message.timestamp))]), _vm.isCheckmarkVisible ? _c('span', [_vm._t("checkmark-icon", function () {
      return [_c('svg-icon', {
        staticClass: "vac-icon-check",
        attrs: {
          "name": _vm.message.distributed ? 'double-checkmark' : 'checkmark',
          "param": _vm.message.seen ? 'seen' : ''
        }
      })];
    }, null, {
      message: _vm.message
    })], 2) : _vm._e()]), !_vm.isUploading ? _c('message-actions', {
      attrs: {
        "current-user-id": _vm.currentUserId,
        "message": _vm.message,
        "message-actions": _vm.messageActions,
        "room-footer-ref": _vm.roomFooterRef,
        "show-reaction-emojis": _vm.showReactionEmojis,
        "hide-options": _vm.hideOptions,
        "message-hover": _vm.messageHover,
        "hover-message-id": _vm.hoverMessageId,
        "hover-audio-progress": _vm.hoverAudioProgress
      },
      on: {
        "hide-options": function hideOptions($event) {
          return _vm.$emit('hide-options', false);
        },
        "update-message-hover": function updateMessageHover($event) {
          _vm.messageHover = $event;
        },
        "update-options-opened": function updateOptionsOpened($event) {
          _vm.optionsOpened = $event;
        },
        "update-emoji-opened": function updateEmojiOpened($event) {
          _vm.emojiOpened = $event;
        },
        "message-action-handler": _vm.messageActionHandler,
        "send-message-reaction": function sendMessageReaction($event) {
          return _vm.sendMessageReaction($event);
        }
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
        return {
          key: name,
          fn: function fn(data) {
            return [_vm._t(name, null, null, data)];
          }
        };
      })], null, true)
    }) : _vm._e()], 1), _c('message-reactions', {
      attrs: {
        "current-user-id": _vm.currentUserId,
        "message": _vm.message,
        "emojis-list": _vm.emojisList
      },
      on: {
        "send-message-reaction": function sendMessageReaction($event) {
          return _vm.sendMessageReaction($event);
        }
      }
    })], 1)];
  }, null, {
    message: _vm.message
  })], 2)]);
};

var Messagevue_type_template_id_a4b15182_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/Message.vue?vue&type=template&id=a4b15182&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.reduce.js
var es_array_reduce = __webpack_require__("13d5");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReply.vue?vue&type=template&id=366ebf45&
var MessageReplyvue_type_template_id_366ebf45_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-reply-message"
  }, [_c('div', {
    staticClass: "vac-reply-username"
  }, [_vm._v(" " + _vm._s(_vm.replyUsername) + " ")]), _vm.isImage ? _c('div', {
    staticClass: "vac-image-reply-container"
  }, [_c('div', {
    staticClass: "vac-message-image vac-message-image-reply",
    style: {
      'background-image': "url('".concat(_vm.message.replyMessage.file.url, "')")
    }
  })]) : _vm.isVideo ? _c('div', {
    staticClass: "vac-video-reply-container"
  }, [_c('video', {
    attrs: {
      "width": "100%",
      "height": "100%",
      "controls": ""
    }
  }, [_c('source', {
    attrs: {
      "src": _vm.message.replyMessage.file.url
    }
  })])]) : _vm.isAudio ? _c('audio-player', {
    attrs: {
      "src": _vm.message.replyMessage.file.url
    },
    on: {
      "update-progress-time": function updateProgressTime($event) {
        _vm.progressTime = $event;
      },
      "hover-audio-progress": function hoverAudioProgress($event) {
        _vm.hoverAudioProgress = $event;
      }
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  }) : _vm.message.replyMessage.file ? _c('div', {
    staticClass: "vac-image-reply-container"
  }, [_c('div', {
    staticClass: "vac-reply-content"
  }, [_c('div', [_c('div', {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c('svg-icon', {
    attrs: {
      "name": "file"
    }
  })], 1), _c('div', {
    staticStyle: {
      "white-space": "nowrap",
      "overflow": "hidden"
    }
  }, [_c('center', [_vm._v(_vm._s(_vm.message.replyMessage.file.name))])], 1), _c('div', [_c('center', [_vm._v(_vm._s(_vm.message.replyMessage.file.extension))])], 1), _vm.message.replyMessage.content ? _c('hr') : _vm._e()])])]) : _vm._e(), _c('div', {
    staticClass: "vac-reply-content"
  }, [_c('format-message', {
    attrs: {
      "content": _vm.message.replyMessage.content,
      "users": _vm.roomUsers,
      "text-formatting": _vm.textFormatting,
      "link-options": _vm.linkOptions,
      "reply": true
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  })], 1)], 1);
};

var MessageReplyvue_type_template_id_366ebf45_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReply.vue?vue&type=template&id=366ebf45&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioPlayer.vue?vue&type=template&id=122955c2&
var AudioPlayervue_type_template_id_122955c2_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', [_c('div', {
    staticClass: "vac-audio-player"
  }, [_c('div', {
    staticClass: "vac-svg-button",
    on: {
      "click": _vm.playback
    }
  }, [_vm.isPlaying ? _vm._t("audio-pause-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "audio-pause"
      }
    })];
  }) : _vm._t("audio-play-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "audio-play"
      }
    })];
  })], 2), _c('audio-control', {
    attrs: {
      "percentage": _vm.progress
    },
    on: {
      "change-linehead": _vm.onUpdateProgress,
      "hover-audio-progress": function hoverAudioProgress($event) {
        return _vm.$emit('hover-audio-progress', $event);
      }
    }
  }), _c('audio', {
    attrs: {
      "id": _vm.playerUniqId,
      "src": _vm.audioSource
    }
  })], 1)]);
};

var AudioPlayervue_type_template_id_122955c2_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioPlayer.vue?vue&type=template&id=122955c2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioControl.vue?vue&type=template&id=57945bd0&
var AudioControlvue_type_template_id_57945bd0_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    ref: "progress",
    staticClass: "vac-player-bar",
    on: {
      "mousedown": _vm.onMouseDown,
      "mouseover": function mouseover($event) {
        return _vm.$emit('hover-audio-progress', true);
      },
      "mouseout": function mouseout($event) {
        return _vm.$emit('hover-audio-progress', false);
      }
    }
  }, [_c('div', {
    staticClass: "vac-player-progress"
  }, [_c('div', {
    staticClass: "vac-line-container"
  }, [_c('div', {
    staticClass: "vac-line-progress",
    style: {
      width: "".concat(_vm.percentage, "%")
    }
  }), _c('div', {
    staticClass: "vac-line-dot",
    "class": {
      'vac-line-dot__active': _vm.isMouseDown
    },
    style: {
      left: "".concat(_vm.percentage, "%")
    }
  })])])]);
};

var AudioControlvue_type_template_id_57945bd0_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/AudioControl.vue?vue&type=template&id=57945bd0&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioControl.vue?vue&type=script&lang=js&
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
// EXTERNAL MODULE: ./src/ChatWindow/Message/AudioControl.vue?vue&type=style&index=0&id=57945bd0&prod&lang=scss&
var AudioControlvue_type_style_index_0_id_57945bd0_prod_lang_scss_ = __webpack_require__("63ca");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/AudioPlayer.vue?vue&type=script&lang=js&


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
// EXTERNAL MODULE: ./src/ChatWindow/Message/AudioPlayer.vue?vue&type=style&index=0&id=122955c2&prod&lang=scss&
var AudioPlayervue_type_style_index_0_id_122955c2_prod_lang_scss_ = __webpack_require__("a9cb");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReply.vue?vue&type=script&lang=js&




var MessageReplyvue_type_script_lang_js_require = __webpack_require__("bd43"),
    MessageReplyvue_type_script_lang_js_isAudioFile = MessageReplyvue_type_script_lang_js_require.isAudioFile,
    isImageFile = MessageReplyvue_type_script_lang_js_require.isImageFile,
    isVideoFile = MessageReplyvue_type_script_lang_js_require.isVideoFile;

/* harmony default export */ var MessageReplyvue_type_script_lang_js_ = ({
  name: 'MessageReply',
  components: {
    SvgIcon: SvgIcon,
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
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageReply.vue?vue&type=style&index=0&id=366ebf45&prod&lang=scss&
var MessageReplyvue_type_style_index_0_id_366ebf45_prod_lang_scss_ = __webpack_require__("b1a4");

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReply.vue






/* normalize component */

var MessageReply_component = normalizeComponent(
  Message_MessageReplyvue_type_script_lang_js_,
  MessageReplyvue_type_template_id_366ebf45_render,
  MessageReplyvue_type_template_id_366ebf45_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var MessageReply = (MessageReply_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageImage.vue?vue&type=template&id=db8562da&
var MessageImagevue_type_template_id_db8562da_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    ref: "imageRef",
    staticClass: "vac-image-container"
  }, [_c('loader', {
    style: {
      top: "".concat(_vm.imageResponsive.loaderTop, "px")
    },
    attrs: {
      "show": _vm.isImageLoading
    }
  }), _c('div', {
    staticClass: "vac-message-image",
    "class": {
      'vac-image-loading': _vm.isImageLoading && _vm.message.senderId === _vm.currentUserId
    },
    style: {
      'background-image': "url('".concat(_vm.imageBackground, "')"),
      'max-height': "".concat(_vm.imageResponsive.maxHeight, "px")
    }
  }, [_c('transition', {
    attrs: {
      "name": "vac-fade-image"
    }
  }, [_vm.imageHover && !_vm.isImageLoading ? _c('div', {
    staticClass: "vac-image-buttons"
  }, [_c('div', {
    staticClass: "vac-svg-button vac-button-view",
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.$emit('open-file', 'preview');
      }
    }
  }, [_vm._t("eye-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "eye"
      }
    })];
  })], 2), _c('div', {
    staticClass: "vac-svg-button vac-button-download",
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.$emit('open-file', 'download');
      }
    }
  }, [_vm._t("document-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "document"
      }
    })];
  })], 2)]) : _vm._e()])], 1), _c('format-message', {
    attrs: {
      "content": _vm.message.content,
      "users": _vm.roomUsers,
      "text-formatting": _vm.textFormatting,
      "link-options": _vm.linkOptions
    },
    on: {
      "open-user-tag": function openUserTag($event) {
        return _vm.$emit('open-user-tag');
      }
    },
    scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (i, name) {
      return {
        key: name,
        fn: function fn(data) {
          return [_vm._t(name, null, null, data)];
        }
      };
    })], null, true)
  })], 1);
};

var MessageImagevue_type_template_id_db8562da_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageImage.vue?vue&type=template&id=db8562da&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageImage.vue?vue&type=script&lang=js&




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
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageImage.vue?vue&type=style&index=0&id=db8562da&prod&lang=scss&
var MessageImagevue_type_style_index_0_id_db8562da_prod_lang_scss_ = __webpack_require__("b9c6");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageActions.vue?vue&type=template&id=e5cea174&
var MessageActionsvue_type_template_id_e5cea174_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "vac-message-actions-wrapper"
  }, [_c('div', {
    staticClass: "vac-options-container",
    "class": {
      'vac-options-image': _vm.isImage && !_vm.message.replyMessage
    },
    style: {
      display: _vm.hoverAudioProgress ? 'none' : 'initial',
      width: _vm.filteredMessageActions.length && _vm.showReactionEmojis ? '70px' : '45px'
    }
  }, [_c('transition-group', {
    attrs: {
      "name": "vac-slide-left"
    }
  }, [_vm.isMessageActions || _vm.isMessageReactions ? _c('div', {
    key: "1",
    staticClass: "vac-blur-container",
    "class": {
      'vac-options-me': _vm.message.senderId === _vm.currentUserId
    }
  }) : _vm._e(), _vm.isMessageActions ? _c('div', {
    key: "2",
    ref: "actionIcon",
    staticClass: "vac-svg-button vac-message-options",
    on: {
      "click": _vm.openOptions
    }
  }, [_vm._t("dropdown-icon", function () {
    return [_c('svg-icon', {
      attrs: {
        "name": "dropdown",
        "param": "message"
      }
    })];
  })], 2) : _vm._e(), _vm.isMessageReactions ? _c('emoji-picker', {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.closeEmoji,
      expression: "closeEmoji"
    }],
    key: "3",
    staticClass: "vac-message-emojis",
    style: {
      right: _vm.isMessageActions ? '30px' : '5px'
    },
    attrs: {
      "emoji-opened": _vm.emojiOpened,
      "emoji-reaction": true,
      "room-footer-ref": _vm.roomFooterRef,
      "position-right": _vm.message.senderId === _vm.currentUserId
    },
    on: {
      "add-emoji": _vm.sendMessageReaction,
      "open-emoji": _vm.openEmoji
    },
    scopedSlots: _vm._u([{
      key: "emoji-picker-icon",
      fn: function fn() {
        return [_vm._t("emoji-picker-reaction-icon")];
      },
      proxy: true
    }], null, true)
  }) : _vm._e()], 1)], 1), _vm.filteredMessageActions.length ? _c('transition', {
    attrs: {
      "name": _vm.message.senderId === _vm.currentUserId ? 'vac-slide-left' : 'vac-slide-right'
    }
  }, [_vm.optionsOpened ? _c('div', {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.closeOptions,
      expression: "closeOptions"
    }],
    ref: "menuOptions",
    staticClass: "vac-menu-options",
    "class": {
      'vac-menu-left': _vm.message.senderId !== _vm.currentUserId
    },
    style: {
      top: "".concat(_vm.menuOptionsTop, "px")
    }
  }, [_c('div', {
    staticClass: "vac-menu-list"
  }, _vm._l(_vm.filteredMessageActions, function (action) {
    return _c('div', {
      key: action.name
    }, [_c('div', {
      staticClass: "vac-menu-item",
      on: {
        "click": function click($event) {
          return _vm.messageActionHandler(action);
        }
      }
    }, [_vm._v(" " + _vm._s(action.title) + " ")])]);
  }), 0)]) : _vm._e()]) : _vm._e()], 1);
};

var MessageActionsvue_type_template_id_e5cea174_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageActions.vue?vue&type=template&id=e5cea174&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageActions.vue?vue&type=script&lang=js&




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
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageActions.vue?vue&type=style&index=0&id=e5cea174&prod&lang=scss&
var MessageActionsvue_type_style_index_0_id_e5cea174_prod_lang_scss_ = __webpack_require__("271f");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReactions.vue?vue&type=template&id=87a49e5e&
var MessageReactionsvue_type_template_id_87a49e5e_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return !_vm.message.deleted ? _c('transition-group', {
    attrs: {
      "name": "vac-slide-left"
    }
  }, _vm._l(_vm.message.reactions, function (reaction, key) {
    return _c('button', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: reaction.length,
        expression: "reaction.length"
      }],
      key: key + 0,
      staticClass: "vac-button-reaction",
      "class": {
        'vac-reaction-me': reaction.indexOf(_vm.currentUserId) !== -1
      },
      style: {
        "float": _vm.message.senderId === _vm.currentUserId ? 'right' : 'left'
      },
      on: {
        "click": function click($event) {
          return _vm.sendMessageReaction({
            name: key
          }, reaction);
        }
      }
    }, [_vm._v(" " + _vm._s(_vm.getEmojiByName(key))), _c('span', [_vm._v(_vm._s(reaction.length))])]);
  }), 0) : _vm._e();
};

var MessageReactionsvue_type_template_id_87a49e5e_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Message/MessageReactions.vue?vue&type=template&id=87a49e5e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/MessageReactions.vue?vue&type=script&lang=js&
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
// EXTERNAL MODULE: ./src/ChatWindow/Message/MessageReactions.vue?vue&type=style&index=0&id=87a49e5e&prod&lang=scss&
var MessageReactionsvue_type_style_index_0_id_87a49e5e_prod_lang_scss_ = __webpack_require__("576b");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue-progress-circle/src/components/ProgressCircle.vue?vue&type=template&id=74af930e&
var ProgressCirclevue_type_template_id_74af930e_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "circle-progress-container",
    style: _vm.containerStyle
  }, [_c('div', {
    staticClass: "circle-progress-inner",
    style: _vm.innerCircleStyle
  }, [_vm.innerDisplay === 'percent' ? _c('span', {
    style: _vm.percentStyle
  }, [_vm._v(_vm._s(_vm.finishedPercentageRounded))]) : _vm._e(), _vm.innerDisplay === 'slot' || _vm.innerDisplay === '' ? _vm._t("default") : _vm._e()], 2), _c('svg', {
    staticClass: "circle-progress-bar",
    attrs: {
      "width": _vm.diameter,
      "height": _vm.diameter,
      "version": "1.1",
      "xmlns": "http://www.w3.org/2000/svg"
    }
  }, [_c('defs', [_c('radialGradient', {
    attrs: {
      "id": 'radial-gradient' + _vm._uid,
      "fx": _vm.gradient.fx,
      "fy": _vm.gradient.fy,
      "cx": _vm.gradient.cx,
      "cy": _vm.gradient.cy,
      "r": _vm.gradient.r
    }
  }, [_c('stop', {
    attrs: {
      "offset": "50%",
      "stop-color": _vm.startColor
    }
  }), _c('stop', {
    attrs: {
      "offset": "100%",
      "stop-color": _vm.stopColor
    }
  })], 1)], 1), _c('circle', {
    style: _vm.strokeStyle,
    attrs: {
      "r": _vm.innerCircleRadius,
      "cx": _vm.radius,
      "cy": _vm.radius,
      "fill": _vm.innerColor,
      "stroke": _vm.circleColor,
      "stroke-dasharray": _vm.circumference,
      "stroke-dashoffset": "0",
      "stroke-linecap": "round"
    }
  }), _c('circle', {
    style: _vm.progressStyle,
    attrs: {
      "transform": 'rotate(270, ' + _vm.radius + ',' + _vm.radius + ')',
      "r": _vm.innerCircleRadius,
      "cx": _vm.radius,
      "cy": _vm.radius,
      "fill": _vm.innerColor,
      "stroke": 'url(#radial-gradient' + _vm._uid + ')',
      "stroke-dasharray": _vm.circumference,
      "stroke-dashoffset": _vm.circumference,
      "stroke-linecap": "round"
    }
  })])]);
};

var ProgressCirclevue_type_template_id_74af930e_staticRenderFns = [];

// CONCATENATED MODULE: ./node_modules/vue-progress-circle/src/components/ProgressCircle.vue?vue&type=template&id=74af930e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue-progress-circle/src/components/ProgressCircle.vue?vue&type=script&lang=js&
/* harmony default export */ var ProgressCirclevue_type_script_lang_js_ = ({
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 100
    },
    totalSteps: {
      type: Number,
      required: true,
      default: 10
    },
    completedSteps: {
      type: Number,
      required: true,
      default: 0
    },
    startColor: {
      type: String,
      required: false,
      default: '#FF0000'
    },
    stopColor: {
      type: String,
      required: false,
      default: '#0000FF'
    },
    circleWidth: {
      type: Number,
      required: false,
      default: 10
    },
    animationDuration: {
      type: Number,
      required: false,
      default: 1000
    },
    circleColor: {
      type: String,
      required: false,
      default: '#000000'
    },
    innerDisplay: {
      type: String,
      required: false,
      default: 'slot'
    },
    percentColor: {
      type: String,
      required: false,
      default: 'inherit'
    },
    innerColor: {
      type: String,
      required: false,
      default: 'transparent'
    }
  },

  data() {
    return {
      gradient: {
        fx: 1,
        fy: 0.5,
        cx: 0.5,
        cy: 0.5,
        r: 0.65
      },
      gradientAnimation: null,
      currentAngle: 0,
      strokeDashoffset: 0
    };
  },

  computed: {
    radius() {
      return this.diameter / 2;
    },

    circumference() {
      return Math.PI * this.innerCircleDiameter;
    },

    stepSize() {
      if (this.totalSteps === 0) {
        return 0;
      }

      return 100 / this.totalSteps;
    },

    finishedPercentage() {
      return this.stepSize * this.completedSteps;
    },

    finishedPercentageRounded() {
      return Math.round(this.finishedPercentage);
    },

    circleSlice() {
      return 2 * Math.PI / this.totalSteps;
    },

    animateSlice() {
      return this.circleSlice / this.totalPoints;
    },

    innerCircleDiameter() {
      return this.diameter - this.circleWidth * 2;
    },

    innerCircleRadius() {
      return this.innerCircleDiameter / 2;
    },

    totalPoints() {
      return this.animationDuration / this.animationIncrements;
    },

    animationIncrements() {
      return 1000 / 60;
    },

    hasGradient() {
      return this.startColor !== this.stopColor;
    },

    containerStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`
      };
    },

    progressStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.circleWidth}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: `stroke-dashoffset ${this.animationDuration}ms linear`
      };
    },

    strokeStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.circleWidth}px`
      };
    },

    percentStyle() {
      return {
        fontSize: `${this.diameter / 2}px`,
        color: `${this.percentColor}`,
        display: 'block'
      };
    },

    innerCircleStyle() {
      return {
        width: `${this.innerCircleDiameter}px`
      };
    }

  },
  methods: {
    getStopPointsOfCircle(steps) {
      const points = [];

      for (let i = 0; i < steps; i++) {
        const angle = this.circleSlice * i;
        points.push(this.getPointOfCircle(angle));
      }

      return points;
    },

    getPointOfCircle(angle) {
      const radius = 0.5;
      const x = radius + radius * Math.cos(angle);
      const y = radius + radius * Math.sin(angle);
      return {
        x,
        y
      };
    },

    gotoPoint() {
      const point = this.getPointOfCircle(this.currentAngle);
      this.gradient.fx = point.x;
      this.gradient.fy = point.y;
    },

    changeProgress({
      isAnimate = true
    }) {
      this.strokeDashoffset = (100 - this.finishedPercentage) / 100 * this.circumference;

      if (this.gradientAnimation) {
        clearInterval(this.gradientAnimation);
      }

      if (!isAnimate) {
        this.gotoNextStep();
        return;
      }

      const angleOffset = (this.completedSteps - 1) * this.circleSlice;
      let i = (this.currentAngle - angleOffset) / this.animateSlice;
      const incrementer = Math.abs(i - this.totalPoints) / this.totalPoints;
      const isMoveForward = i < this.totalPoints;
      this.gradientAnimation = setInterval(() => {
        if (isMoveForward && i >= this.totalPoints || !isMoveForward && i < this.totalPoints) {
          clearInterval(this.gradientAnimation);
          return;
        }

        this.currentAngle = angleOffset + this.animateSlice * i;
        this.gotoPoint();
        i += isMoveForward ? incrementer : -incrementer;
      }, this.animationIncrements);
    },

    gotoNextStep() {
      this.currentAngle = this.completedSteps * this.circleSlice;
      this.gotoPoint();
    }

  },
  watch: {
    totalSteps() {
      this.changeProgress({
        isAnimate: true
      });
    },

    completedSteps() {
      this.changeProgress({
        isAnimate: true
      });
    },

    diameter() {
      this.changeProgress({
        isAnimate: true
      });
    },

    circleWidth() {
      this.changeProgress({
        isAnimate: true
      });
    }

  },

  created() {
    this.changeProgress({
      isAnimate: false
    });
  }

});
// CONCATENATED MODULE: ./node_modules/vue-progress-circle/src/components/ProgressCircle.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_ProgressCirclevue_type_script_lang_js_ = (ProgressCirclevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-progress-circle/src/components/ProgressCircle.vue?vue&type=style&index=0&id=74af930e&prod&lang=css&
var ProgressCirclevue_type_style_index_0_id_74af930e_prod_lang_css_ = __webpack_require__("1bbc");

// CONCATENATED MODULE: ./node_modules/vue-progress-circle/src/components/ProgressCircle.vue






/* normalize component */

var ProgressCircle_component = normalizeComponent(
  components_ProgressCirclevue_type_script_lang_js_,
  ProgressCirclevue_type_template_id_74af930e_render,
  ProgressCirclevue_type_template_id_74af930e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ProgressCircle = (ProgressCircle_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-progress-circle/src/main.js




// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Message/Message.vue?vue&type=script&lang=js&










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
    MessageReactions: MessageReactions,
    ProgressCircle: ProgressCircle
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
    isUploading: function isUploading() {
      return this.message.uploading;
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
// EXTERNAL MODULE: ./src/ChatWindow/Message/Message.vue?vue&type=style&index=0&id=a4b15182&prod&lang=scss&
var Messagevue_type_style_index_0_id_a4b15182_prod_lang_scss_ = __webpack_require__("c772");

// CONCATENATED MODULE: ./src/ChatWindow/Message/Message.vue






/* normalize component */

var Message_component = normalizeComponent(
  Message_Messagevue_type_script_lang_js_,
  Messagevue_type_template_id_a4b15182_render,
  Messagevue_type_template_id_a4b15182_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Message = (Message_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5f400ab6-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Files/FileUpload.vue?vue&type=template&id=82580d9a&
var FileUploadvue_type_template_id_82580d9a_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "file-list"
  }, [_c('div', {
    staticClass: "vac-file-image",
    style: _vm.style
  }, [_c('div', {
    staticClass: "vac-svg-button close-button vac-icon-remove",
    on: {
      "click": _vm.closeFile
    }
  }, [_c('svg-icon', {
    staticStyle: {
      "width": "20px"
    },
    attrs: {
      "name": "close",
      "param": "image"
    }
  })], 1), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.file.isNotDoc,
      expression: "!file.isNotDoc"
    }],
    staticClass: "doc-svg"
  }, [_c('svg-icon', {
    staticClass: "doc-svg-button",
    attrs: {
      "name": "file"
    }
  })], 1), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.file.isNotDoc,
      expression: "!file.isNotDoc"
    }],
    staticClass: "text-container"
  }, [_c('div', {
    staticClass: "vac-text-ellipsis"
  }, [_c('center', [_vm._v(_vm._s(_vm.file.name))])], 1), _c('div', {
    staticClass: "vac-text-extension"
  }, [_c('center', [_vm._v(_vm._s(_vm.file.extension))])], 1)])])]);
};

var FileUploadvue_type_template_id_82580d9a_staticRenderFns = [];

// CONCATENATED MODULE: ./src/ChatWindow/Files/FileUpload.vue?vue&type=template&id=82580d9a&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Files/FileUpload.vue?vue&type=script&lang=js&

/* harmony default export */ var FileUploadvue_type_script_lang_js_ = ({
  name: 'FileUpload',
  components: {
    SvgIcon: SvgIcon
  },
  props: {
    index: {
      type: Number,
      "default": null
    },
    file: {
      type: Object,
      "default": null
    }
  },
  computed: {
    style: function style() {
      return this.file.isNotDoc ? "background-image: url(\"".concat(this.file.localUrl, "\");") : null;
    }
  },
  methods: {
    closeFile: function closeFile() {
      this.$emit('close-single-file', this.index);
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Files/FileUpload.vue?vue&type=script&lang=js&
 /* harmony default export */ var Files_FileUploadvue_type_script_lang_js_ = (FileUploadvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Files/FileUpload.vue?vue&type=style&index=0&id=82580d9a&prod&lang=css&
var FileUploadvue_type_style_index_0_id_82580d9a_prod_lang_css_ = __webpack_require__("6fc0");

// CONCATENATED MODULE: ./src/ChatWindow/Files/FileUpload.vue






/* normalize component */

var FileUpload_component = normalizeComponent(
  Files_FileUploadvue_type_script_lang_js_,
  FileUploadvue_type_template_id_82580d9a_render,
  FileUploadvue_type_template_id_82580d9a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var FileUpload = (FileUpload_component.exports);
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
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.at.js
var es_typed_array_at = __webpack_require__("907a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__("3c5d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.find-last.js
var esnext_typed_array_find_last = __webpack_require__("fa9e");

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.find-last-index.js
var esnext_typed_array_find_last_index = __webpack_require__("77d9");

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


// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/Room/Room.vue?vue&type=script&lang=js&



















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
    Message: Message,
    FileUpload: FileUpload
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
    maxFileSize: {
      type: Number,
      required: true
    },
    maxFilesSumSize: {
      type: Number,
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
      files: [],
      file: null,
      selectedFilesSize: 0,
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
      return !this.files.length && !this.message.trim();
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
      if (e.key === 'Enter' && !e.ctrlKey && !_this3.fileDialog) {
        _this3.message = _this3.message + '\n';
        setTimeout(function () {
          return _this3.onChangeInput();
        });
      } else if (e.key === 'Enter' && e.ctrlKey && !_this3.fileDialog) {
        _this3.sendMessage();
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
      if (!this.files.length && !message) return;
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
        if (this.files.length) {
          for (var i = 0; i < this.files.length; i++) {
            this.$emit('send-message', {
              content: i === 0 ? message : '',
              file: this.files[i],
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
      }

      this.files = [];
      this.selectedFilesSize = 0;
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

      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var i, file, totalSize, fileURL, blobFile, typeIndex, isNotDoc;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this13.fileDialog = true;
                i = 0;

              case 2:
                if (!(i < files.length)) {
                  _context.next = 22;
                  break;
                }

                file = files[i];
                totalSize = _this13.selectedFilesSize + file.size;

                if (!(_this13.maxFilesSumSize && _this13.maxFileSize && (totalSize > _this13.maxFilesSumSize || file.size > _this13.maxFileSize))) {
                  _context.next = 9;
                  break;
                }

                _this13.$emit('limit-size-exceeded');

                _this13.closeUploadedFiles();

                return _context.abrupt("return");

              case 9:
                fileURL = URL.createObjectURL(file);
                _context.next = 12;
                return fetch(fileURL).then(function (res) {
                  return res.blob();
                });

              case 12:
                blobFile = _context.sent;
                typeIndex = file.name.lastIndexOf('.');
                isNotDoc = Roomvue_type_script_lang_js_isImageFile(file) || Roomvue_type_script_lang_js_isVideoFile(file);
                _this13.file = {
                  blob: blobFile,
                  name: file.name.substring(0, typeIndex),
                  size: file.size,
                  type: file.type,
                  extension: file.name.substring(typeIndex + 1),
                  localUrl: fileURL,
                  isNotDoc: isNotDoc
                };

                _this13.files.push(_this13.file);

                _this13.selectedFilesSize = totalSize;
                _this13.file = null;

              case 19:
                i++;
                _context.next = 2;
                break;

              case 22:
                setTimeout(function () {
                  return _this13.fileDialog = false;
                }, 500);

              case 23:
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
    },
    removeSingleFile: function removeSingleFile(index) {
      var removed = this.files.splice(index, 1);
      this.selectedFilesSize -= removed[0].size;
    },
    closeUploadedFiles: function closeUploadedFiles() {
      this.files = [];
      this.selectedFilesSize = 0;
    }
  }
});
// CONCATENATED MODULE: ./src/ChatWindow/Room/Room.vue?vue&type=script&lang=js&
 /* harmony default export */ var Room_Roomvue_type_script_lang_js_ = (Roomvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/ChatWindow/Room/Room.vue?vue&type=style&index=0&id=05b0c3b4&prod&lang=scss&
var Roomvue_type_style_index_0_id_05b0c3b4_prod_lang_scss_ = __webpack_require__("e0a5");

// CONCATENATED MODULE: ./src/ChatWindow/Room/Room.vue






/* normalize component */

var Room_component = normalizeComponent(
  Room_Roomvue_type_script_lang_js_,
  Roomvue_type_template_id_05b0c3b4_render,
  Roomvue_type_template_id_05b0c3b4_staticRenderFns,
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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ChatWindow/ChatWindow.vue?vue&type=script&lang=js&shadow






var ChatWindowvue_type_script_lang_js_shadow_require = __webpack_require__("4c1d"),
    roomsValidation = ChatWindowvue_type_script_lang_js_shadow_require.roomsValidation,
    partcipantsValidation = ChatWindowvue_type_script_lang_js_shadow_require.partcipantsValidation;

/* harmony default export */ var ChatWindowvue_type_script_lang_js_shadow = ({
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
    },
    maxFileSize: {
      type: Number,
      "default": null
    },
    maxFilesSumSize: {
      type: Number,
      "default": null
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
    limitSizeExceeded: function limitSizeExceeded() {
      this.$emit('limit-size-exceeded');
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
// CONCATENATED MODULE: ./src/ChatWindow/ChatWindow.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var ChatWindow_ChatWindowvue_type_script_lang_js_shadow = (ChatWindowvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/ChatWindow/ChatWindow.vue?shadow



function injectStyles (context) {
  
  var style0 = __webpack_require__("bc21")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var ChatWindowshadow_component = normalizeComponent(
  ChatWindow_ChatWindowvue_type_script_lang_js_shadow,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  null
  ,true
)

/* harmony default export */ var ChatWindowshadow = (ChatWindowshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-wc.js




// runtime shared by every component chunk





window.customElements.define('vue-advanced-chat', vue_wc_wrapper(external_Vue_default.a, ChatWindowshadow))

/***/ }),

/***/ "5c6c":
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

/***/ "5e77":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var hasOwn = __webpack_require__("1a2d");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "605d":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("c6b6");
var global = __webpack_require__("da84");

module.exports = classof(global.process) == 'process';


/***/ }),

/***/ "6374":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "63ca":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioControl_vue_vue_type_style_index_0_id_57945bd0_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fdb9");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioControl_vue_vue_type_style_index_0_id_57945bd0_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioControl_vue_vue_type_style_index_0_id_57945bd0_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "669f":
/***/ (function(module, exports, __webpack_require__) {

!function(e,o){ true?module.exports=o():undefined}(this,function(){return function(e){function o(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,o),n.l=!0,n.exports}var t={};return o.m=e,o.c=t,o.i=function(e){return e},o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:a})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},o.p="/dist-module/",o(o.s=3)}([function(e,o,t){var a=t(4)(t(1),t(5),null,null,null);e.exports=a.exports},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var a=t(2),n=function(e){return e&&e.__esModule?e:{default:e}}(a),i=function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")};o.default={props:{search:{type:String,required:!1,default:""},emojiTable:{type:Object,required:!1,default:function(){return n.default}}},data:function(){return{display:{x:0,y:0,visible:!1}}},computed:{emojis:function(){if(this.search){var e={};for(var o in this.emojiTable){e[o]={};for(var t in this.emojiTable[o])new RegExp(".*"+i(this.search)+".*").test(t)&&(e[o][t]=this.emojiTable[o][t]);0===Object.keys(e[o]).length&&delete e[o]}return e}return this.emojiTable}},methods:{insert:function(e){this.$emit("emoji",e)},toggle:function(e){this.display.visible=!this.display.visible,this.display.x=e.clientX,this.display.y=e.clientY},hide:function(){this.display.visible=!1},escape:function(e){!0===this.display.visible&&27===e.keyCode&&(this.display.visible=!1)}},directives:{"click-outside":{bind:function(e,o,t){if("function"==typeof o.value){var a=o.modifiers.bubble,n=function(t){(a||!e.contains(t.target)&&e!==t.target)&&o.value(t)};e.__vueClickOutside__=n,document.addEventListener("click",n)}},unbind:function(e,o){document.removeEventListener("click",e.__vueClickOutside__),e.__vueClickOutside__=null}}},mounted:function(){document.addEventListener("keyup",this.escape)},destroyed:function(){document.removeEventListener("keyup",this.escape)}}},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.default={"Frequently used":{thumbs_up:"👍","-1":"👎",sob:"😭",confused:"😕",neutral_face:"😐",blush:"😊",heart_eyes:"😍"},People:{smile:"😄",smiley:"😃",grinning:"😀",blush:"😊",wink:"😉",heart_eyes:"😍",kissing_heart:"😘",kissing_closed_eyes:"😚",kissing:"😗",kissing_smiling_eyes:"😙",stuck_out_tongue_winking_eye:"😜",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",flushed:"😳",grin:"😁",pensive:"😔",relieved:"😌",unamused:"😒",disappointed:"😞",persevere:"😣",cry:"😢",joy:"😂",sob:"😭",sleepy:"😪",disappointed_relieved:"😥",cold_sweat:"😰",sweat_smile:"😅",sweat:"😓",weary:"😩",tired_face:"😫",fearful:"😨",scream:"😱",angry:"😠",rage:"😡",triumph:"😤",confounded:"😖",laughing:"😆",yum:"😋",mask:"😷",sunglasses:"😎",sleeping:"😴",dizzy_face:"😵",astonished:"😲",worried:"😟",frowning:"😦",anguished:"😧",imp:"👿",open_mouth:"😮",grimacing:"😬",neutral_face:"😐",confused:"😕",hushed:"😯",smirk:"😏",expressionless:"😑",man_with_gua_pi_mao:"👲",man_with_turban:"👳",cop:"👮",construction_worker:"👷",guardsman:"💂",baby:"👶",boy:"👦",girl:"👧",man:"👨",woman:"👩",older_man:"👴",older_woman:"👵",person_with_blond_hair:"👱",angel:"👼",princess:"👸",smiley_cat:"😺",smile_cat:"😸",heart_eyes_cat:"😻",kissing_cat:"😽",smirk_cat:"😼",scream_cat:"🙀",crying_cat_face:"😿",joy_cat:"😹",pouting_cat:"😾",japanese_ogre:"👹",japanese_goblin:"👺",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",skull:"💀",alien:"👽",hankey:"💩",fire:"🔥",sparkles:"✨",star2:"🌟",dizzy:"💫",boom:"💥",anger:"💢",sweat_drops:"💦",droplet:"💧",zzz:"💤",dash:"💨",ear:"👂",eyes:"👀",nose:"👃",tongue:"👅",lips:"👄",thumbs_up:"👍","-1":"👎",ok_hand:"👌",facepunch:"👊",fist:"✊",wave:"👋",hand:"✋",open_hands:"👐",point_up_2:"👆",point_down:"👇",point_right:"👉",point_left:"👈",raised_hands:"🙌",pray:"🙏",clap:"👏",muscle:"💪",walking:"🚶",runner:"🏃",dancer:"💃",couple:"👫",family:"👪",couplekiss:"💏",couple_with_heart:"💑",dancers:"👯",ok_woman:"🙆",no_good:"🙅",information_desk_person:"💁",raising_hand:"🙋",massage:"💆",haircut:"💇",nail_care:"💅",bride_with_veil:"👰",person_with_pouting_face:"🙎",person_frowning:"🙍",bow:"🙇",tophat:"🎩",crown:"👑",womans_hat:"👒",athletic_shoe:"👟",mans_shoe:"👞",sandal:"👡",high_heel:"👠",boot:"👢",shirt:"👕",necktie:"👔",womans_clothes:"👚",dress:"👗",running_shirt_with_sash:"🎽",jeans:"👖",kimono:"👘",bikini:"👙",briefcase:"💼",handbag:"👜",pouch:"👝",purse:"👛",eyeglasses:"👓",ribbon:"🎀",closed_umbrella:"🌂",lipstick:"💄",yellow_heart:"💛",blue_heart:"💙",purple_heart:"💜",green_heart:"💚",broken_heart:"💔",heartpulse:"💗",heartbeat:"💓",two_hearts:"💕",sparkling_heart:"💖",revolving_hearts:"💞",cupid:"💘",love_letter:"💌",kiss:"💋",ring:"💍",gem:"💎",bust_in_silhouette:"👤",speech_balloon:"💬",footprints:"👣"},Nature:{dog:"🐶",wolf:"🐺",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",frog:"🐸",tiger:"🐯",koala:"🐨",bear:"🐻",pig:"🐷",pig_nose:"🐽",cow:"🐮",boar:"🐗",monkey_face:"🐵",monkey:"🐒",horse:"🐴",sheep:"🐑",elephant:"🐘",panda_face:"🐼",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatched_chick:"🐥",hatching_chick:"🐣",chicken:"🐔",snake:"🐍",turtle:"🐢",bug:"🐛",bee:"🐝",ant:"🐜",beetle:"🐞",snail:"🐌",octopus:"🐙",shell:"🐚",tropical_fish:"🐠",fish:"🐟",dolphin:"🐬",whale:"🐳",racehorse:"🐎",dragon_face:"🐲",blowfish:"🐡",camel:"🐫",poodle:"🐩",feet:"🐾",bouquet:"💐",cherry_blossom:"🌸",tulip:"🌷",four_leaf_clover:"🍀",rose:"🌹",sunflower:"🌻",hibiscus:"🌺",maple_leaf:"🍁",leaves:"🍃",fallen_leaf:"🍂",herb:"🌿",ear_of_rice:"🌾",mushroom:"🍄",cactus:"🌵",palm_tree:"🌴",chestnut:"🌰",seedling:"🌱",blossom:"🌼",new_moon:"🌑",first_quarter_moon:"🌓",moon:"🌔",full_moon:"🌕",first_quarter_moon_with_face:"🌛",crescent_moon:"🌙",earth_asia:"🌏",volcano:"🌋",milky_way:"🌌",stars:"🌠",partly_sunny:"⛅",snowman:"⛄",cyclone:"🌀",foggy:"🌁",rainbow:"🌈",ocean:"🌊"},Objects:{bamboo:"🎍",gift_heart:"💝",dolls:"🎎",school_satchel:"🎒",mortar_board:"🎓",flags:"🎏",fireworks:"🎆",sparkler:"🎇",wind_chime:"🎐",rice_scene:"🎑",jack_o_lantern:"🎃",ghost:"👻",santa:"🎅",christmas_tree:"🎄",gift:"🎁",tanabata_tree:"🎋",tada:"🎉",confetti_ball:"🎊",balloon:"🎈",crossed_flags:"🎌",crystal_ball:"🔮",movie_camera:"🎥",camera:"📷",video_camera:"📹",vhs:"📼",cd:"💿",dvd:"📀",minidisc:"💽",floppy_disk:"💾",computer:"💻",iphone:"📱",telephone_receiver:"📞",pager:"📟",fax:"📠",satellite:"📡",tv:"📺",radio:"📻",loud_sound:"🔊",bell:"🔔",loudspeaker:"📢",mega:"📣",hourglass_flowing_sand:"⏳",hourglass:"⌛",alarm_clock:"⏰",watch:"⌚",unlock:"🔓",lock:"🔒",lock_with_ink_pen:"🔏",closed_lock_with_key:"🔐",key:"🔑",mag_right:"🔎",bulb:"💡",flashlight:"🔦",electric_plug:"🔌",battery:"🔋",mag:"🔍",bath:"🛀",toilet:"🚽",wrench:"🔧",nut_and_bolt:"🔩",hammer:"🔨",door:"🚪",smoking:"🚬",bomb:"💣",gun:"🔫",hocho:"🔪",pill:"💊",syringe:"💉",moneybag:"💰",yen:"💴",dollar:"💵",credit_card:"💳",money_with_wings:"💸",calling:"📲","e-mail":"📧",inbox_tray:"📥",outbox_tray:"📤",envelope_with_arrow:"📩",incoming_envelope:"📨",mailbox:"📫",mailbox_closed:"📪",postbox:"📮",package:"📦",memo:"📝",page_facing_up:"📄",page_with_curl:"📃",bookmark_tabs:"📑",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",scroll:"📜",clipboard:"📋",date:"📅",calendar:"📆",card_index:"📇",file_folder:"📁",open_file_folder:"📂",pushpin:"📌",paperclip:"📎",straight_ruler:"📏",triangular_ruler:"📐",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook:"📓",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",book:"📖",bookmark:"🔖",name_badge:"📛",newspaper:"📰",art:"🎨",clapper:"🎬",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_note:"🎵",notes:"🎶",musical_keyboard:"🎹",violin:"🎻",trumpet:"🎺",saxophone:"🎷",guitar:"🎸",space_invader:"👾",video_game:"🎮",black_joker:"🃏",flower_playing_cards:"🎴",mahjong:"🀄",game_die:"🎲",dart:"🎯",football:"🏈",basketball:"🏀",soccer:"⚽",baseball:"⚾",tennis:"🎾","8ball":"🎱",bowling:"🎳",golf:"⛳",checkered_flag:"🏁",trophy:"🏆",ski:"🎿",snowboarder:"🏂",swimmer:"🏊",surfer:"🏄",fishing_pole_and_fish:"🎣",tea:"🍵",sake:"🍶",beer:"🍺",beers:"🍻",cocktail:"🍸",tropical_drink:"🍹",wine_glass:"🍷",fork_and_knife:"🍴",pizza:"🍕",hamburger:"🍔",fries:"🍟",poultry_leg:"🍗",meat_on_bone:"🍖",spaghetti:"🍝",curry:"🍛",fried_shrimp:"🍤",bento:"🍱",sushi:"🍣",fish_cake:"🍥",rice_ball:"🍙",rice_cracker:"🍘",rice:"🍚",ramen:"🍜",stew:"🍲",oden:"🍢",dango:"🍡",egg:"🍳",bread:"🍞",doughnut:"🍩",custard:"🍮",icecream:"🍦",ice_cream:"🍨",shaved_ice:"🍧",birthday:"🎂",cake:"🍰",cookie:"🍪",chocolate_bar:"🍫",candy:"🍬",lollipop:"🍭",honey_pot:"🍯",apple:"🍎",green_apple:"🍏",tangerine:"🍊",cherries:"🍒",grapes:"🍇",watermelon:"🍉",strawberry:"🍓",peach:"🍑",melon:"🍈",banana:"🍌",pineapple:"🍍",sweet_potato:"🍠",eggplant:"🍆",tomato:"🍅",corn:"🌽"},Places:{house:"🏠",house_with_garden:"🏡",school:"🏫",office:"🏢",post_office:"🏣",hospital:"🏥",bank:"🏦",convenience_store:"🏪",love_hotel:"🏩",hotel:"🏨",wedding:"💒",church:"⛪",department_store:"🏬",city_sunrise:"🌇",city_sunset:"🌆",japanese_castle:"🏯",european_castle:"🏰",tent:"⛺",factory:"🏭",tokyo_tower:"🗼",japan:"🗾",mount_fuji:"🗻",sunrise_over_mountains:"🌄",sunrise:"🌅",night_with_stars:"🌃",statue_of_liberty:"🗽",bridge_at_night:"🌉",carousel_horse:"🎠",ferris_wheel:"🎡",fountain:"⛲",roller_coaster:"🎢",ship:"🚢",boat:"⛵",speedboat:"🚤",rocket:"🚀",seat:"💺",station:"🚉",bullettrain_side:"🚄",bullettrain_front:"🚅",metro:"🚇",railway_car:"🚃",bus:"🚌",blue_car:"🚙",car:"🚗",taxi:"🚕",truck:"🚚",rotating_light:"🚨",police_car:"🚓",fire_engine:"🚒",ambulance:"🚑",bike:"🚲",barber:"💈",busstop:"🚏",ticket:"🎫",traffic_light:"🚥",construction:"🚧",beginner:"🔰",fuelpump:"⛽",izakaya_lantern:"🏮",slot_machine:"🎰",moyai:"🗿",circus_tent:"🎪",performing_arts:"🎭",round_pushpin:"📍",triangular_flag_on_post:"🚩"},Symbols:{keycap_ten:"🔟",1234:"🔢",symbols:"🔣",capital_abcd:"🔠",abcd:"🔡",abc:"🔤",arrow_up_small:"🔼",arrow_down_small:"🔽",rewind:"⏪",fast_forward:"⏩",arrow_double_up:"⏫",arrow_double_down:"⏬",ok:"🆗",new:"🆕",up:"🆙",cool:"🆒",free:"🆓",ng:"🆖",signal_strength:"📶",cinema:"🎦",koko:"🈁",u6307:"🈯",u7a7a:"🈳",u6e80:"🈵",u5408:"🈴",u7981:"🈲",ideograph_advantage:"🉐",u5272:"🈹",u55b6:"🈺",u6709:"🈶",u7121:"🈚",restroom:"🚻",mens:"🚹",womens:"🚺",baby_symbol:"🚼",wc:"🚾",no_smoking:"🚭",u7533:"🈸",accept:"🉑",cl:"🆑",sos:"🆘",id:"🆔",no_entry_sign:"🚫",underage:"🔞",no_entry:"⛔",negative_squared_cross_mark:"❎",white_check_mark:"✅",heart_decoration:"💟",vs:"🆚",vibration_mode:"📳",mobile_phone_off:"📴",ab:"🆎",diamond_shape_with_a_dot_inside:"💠",ophiuchus:"⛎",six_pointed_star:"🔯",atm:"🏧",chart:"💹",heavy_dollar_sign:"💲",currency_exchange:"💱",x:"❌",exclamation:"❗",question:"❓",grey_exclamation:"❕",grey_question:"❔",o:"⭕",top:"🔝",end:"🔚",back:"🔙",on:"🔛",soon:"🔜",arrows_clockwise:"🔃",clock12:"🕛",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",white_flower:"💮",100:"💯",radio_button:"🔘",link:"🔗",curly_loop:"➰",trident:"🔱",small_red_triangle:"🔺",black_square_button:"🔲",white_square_button:"🔳",red_circle:"🔴",large_blue_circle:"🔵",small_red_triangle_down:"🔻",white_large_square:"⬜",black_large_square:"⬛",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_orange_diamond:"🔸",small_blue_diamond:"🔹"}}},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.EmojiPickerPlugin=o.EmojiPicker=void 0;var a=t(0),n=function(e){return e&&e.__esModule?e:{default:e}}(a),i={install:function(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.component("emoji-picker",n.default)}};"undefined"!=typeof window&&(window.EmojiPicker=i),o.EmojiPicker=n.default,o.EmojiPickerPlugin=i,o.default=n.default},function(e,o){e.exports=function(e,o,t,a,n){var i,r=e=e||{},s=typeof e.default;"object"!==s&&"function"!==s||(i=e,r=e.default);var l="function"==typeof r?r.options:r;o&&(l.render=o.render,l.staticRenderFns=o.staticRenderFns),a&&(l._scopeId=a);var _;if(n?(_=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(n)},l._ssrRegister=_):t&&(_=t),_){var c=l.functional,u=c?l.render:l.beforeCreate;c?l.render=function(e,o){return _.call(o),u(e,o)}:l.beforeCreate=u?[].concat(u,_):[_]}return{esModule:i,exports:r,options:l}}},function(e,o){e.exports={render:function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",[e._t("emoji-invoker",null,{events:{click:function(o){return e.toggle(o)}}}),e._v(" "),e.display.visible?t("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:e.hide,expression:"hide"}]},[e._t("emoji-picker",null,{emojis:e.emojis,insert:e.insert,display:e.display})],2):e._e()],2)},staticRenderFns:[]}}])});
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "66e6":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("b4cd");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("6ced0dc2", content, shadowRoot)
};

/***/ }),

/***/ "67e0":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-audio-player{display:flex;margin:8px 0 5px}.vac-audio-player .vac-svg-button{max-width:18px;margin-left:7px}@media only screen and (max-width:768px){.vac-audio-player{margin:4px 0 0}.vac-audio-player .vac-svg-button{max-width:16px;margin-left:5px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "6919":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsList_vue_vue_type_style_index_0_id_3c4495e5_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("35fe");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsList_vue_vue_type_style_index_0_id_3c4495e5_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomsList_vue_vue_type_style_index_0_id_3c4495e5_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "69f3":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__("7f9a");
var global = __webpack_require__("da84");
var uncurryThis = __webpack_require__("e330");
var isObject = __webpack_require__("861d");
var createNonEnumerableProperty = __webpack_require__("9112");
var hasOwn = __webpack_require__("1a2d");
var shared = __webpack_require__("c6cd");
var sharedKey = __webpack_require__("f772");
var hiddenKeys = __webpack_require__("d012");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "6a96":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".circle-progress-container{position:relative}.circle-progress-inner{position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "6fc0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileUpload_vue_vue_type_style_index_0_id_82580d9a_prod_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7d3e");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileUpload_vue_vue_type_style_index_0_id_82580d9a_prod_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileUpload_vue_vue_type_style_index_0_id_82580d9a_prod_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "7156":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var isObject = __webpack_require__("861d");
var setPrototypeOf = __webpack_require__("d2bb");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "7208":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-box-search{position:-webkit-sticky;position:sticky;display:flex;align-items:center;height:64px;padding:0 15px}.vac-box-search .vac-icon-search{display:flex;position:absolute;left:30px}.vac-box-search .vac-icon-search svg{width:18px;height:18px}.vac-box-search .vac-input{height:38px;width:100%;background:var(--chat-bg-color-input);color:var(--chat-color);border-radius:4px;font-size:15px;outline:0;caret-color:var(--chat-color-caret);padding:10px 10px 10px 40px;border:1px solid var(--chat-sidemenu-border-color-search);border-radius:20px}.vac-box-search .vac-input::-moz-placeholder{color:var(--chat-color-placeholder)}.vac-box-search .vac-input::placeholder{color:var(--chat-color-placeholder)}.vac-box-search .vac-add-icon{margin-left:auto;padding-left:10px}@media only screen and (max-width:768px){.vac-box-search{height:58px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "7418":
/***/ (function(module, exports) {

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "74fe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("2d78");


/***/ }),

/***/ "75cc":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-reply-message{background:var(--chat-message-bg-color-reply);border-radius:4px;margin:-1px -5px 8px;padding:8px 10px}.vac-reply-message .vac-reply-username{color:var(--chat-message-color-reply-username);font-size:12px;line-height:15px;margin-bottom:2px}.vac-reply-message .vac-image-reply-container{width:70px}.vac-reply-message .vac-image-reply-container .vac-message-image-reply{height:70px;width:70px;margin:4px auto 3px}.vac-reply-message .vac-video-reply-container{width:200px;max-width:100%}.vac-reply-message .vac-video-reply-container video{border-radius:4px}.vac-reply-message .vac-reply-content{font-size:12px;color:var(--chat-message-color-reply-content)}", ""]);
// Exports
module.exports = exports;


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

/***/ "77d9":
/***/ (function(module, exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__("1d02");


/***/ }),

/***/ "7839":
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "7b0b":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "7cc4":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("518e");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("f45bb4c4", content, shadowRoot)
};

/***/ }),

/***/ "7d3e":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("8b25");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("56eb3e64", content, shadowRoot)
};

/***/ }),

/***/ "7da1":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("67e0");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("0ce91548", content, shadowRoot)
};

/***/ }),

/***/ "7ef0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SvgIcon_vue_vue_type_style_index_0_id_4b04b8f8_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7cc4");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SvgIcon_vue_vue_type_style_index_0_id_4b04b8f8_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SvgIcon_vue_vue_type_style_index_0_id_4b04b8f8_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "7f9a":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isCallable = __webpack_require__("1626");
var inspectSource = __webpack_require__("8925");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ "825a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "83ab":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "861d":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
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

/***/ "8925":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var isCallable = __webpack_require__("1626");
var store = __webpack_require__("c6cd");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "8b25":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".doc-svg{width:32px;height:32px;margin:auto auto 15px!important;padding-top:15px}.doc-svg-button{width:30px;height:30px;margin:auto}.close-button{max-height:30px;display:flex;cursor:pointer;transition:all .2s}.vac-icon-remove{position:absolute;top:6px;left:6px;z-index:10}.file-list{display:flex;position:relative;margin:0 4px}.vac-file-image{position:relative;background-color:#ddd!important;background-size:cover!important;background-position:50%!important;background-repeat:no-repeat!important;height:100px;width:100px;border:1px solid #e1e4e8;border-radius:4px}.vac-text-ellipsis{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-text-extension{font-size:12px;color:#757e85}.text-container{width:80%;margin:auto}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),

/***/ "9013":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("f58d");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("7eec75e0", content, shadowRoot)
};

/***/ }),

/***/ "907a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var lengthOfArrayLike = __webpack_require__("07fa");
var toIntegerOrInfinity = __webpack_require__("5926");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod('at', function at(index) {
  var O = aTypedArray(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});


/***/ }),

/***/ "90e3":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "9112":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var definePropertyModule = __webpack_require__("9bf2");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "94ca":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var isCallable = __webpack_require__("1626");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "986a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var $findLast = __webpack_require__("a258").findLast;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "997b":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-loader-wrapper.vac-container-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9}.vac-loader-wrapper.vac-container-top{padding:21px}.vac-loader-wrapper.vac-container-top #vac-circle{height:20px;width:20px}.vac-loader-wrapper #vac-circle{margin:auto;height:28px;width:28px;border:3px solid rgba(0,0,0,.25);border-top:3px var(--chat-color-spinner) solid;border-right:3px var(--chat-color-spinner) solid;border-bottom:3px var(--chat-color-spinner) solid;border-radius:50%;-webkit-animation:vac-spin 1s linear infinite;animation:vac-spin 1s linear infinite}@media only screen and (max-width:768px){.vac-loader-wrapper #vac-circle{height:24px;width:24px}.vac-loader-wrapper.vac-container-top{padding:18px}.vac-loader-wrapper.vac-container-top #vac-circle{height:16px;width:16px}}@-webkit-keyframes vac-spin{0%{transform:rotate(0deg)}to{transform:rotate(359deg)}}@keyframes vac-spin{0%{transform:rotate(0deg)}to{transform:rotate(359deg)}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "9af0":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("6a96");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("04327db6", content, shadowRoot)
};

/***/ }),

/***/ "9bf2":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__("aed9");
var anObject = __webpack_require__("825a");
var toPropertyKey = __webpack_require__("a04b");

var $TypeError = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "9ca8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomContent_vue_vue_type_style_index_0_id_2d7743ae_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9cd5");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomContent_vue_vue_type_style_index_0_id_2d7743ae_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomContent_vue_vue_type_style_index_0_id_2d7743ae_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "9cd5":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("dec2");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("5abd831b", content, shadowRoot)
};

/***/ }),

/***/ "a04b":
/***/ (function(module, exports, __webpack_require__) {

var toPrimitive = __webpack_require__("c04e");
var isSymbol = __webpack_require__("d9b5");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "a136":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_id_115a59fa_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("299d");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_id_115a59fa_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_id_115a59fa_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "a258":
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__("0366");
var IndexedObject = __webpack_require__("44ad");
var toObject = __webpack_require__("7b0b");
var lengthOfArrayLike = __webpack_require__("07fa");

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_FIND_LAST_INDEX = TYPE == 1;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var index = lengthOfArrayLike(self);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0: return value; // findLast
        case 1: return index; // findLastIndex
      }
    }
    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};

module.exports = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod(1)
};


/***/ }),

/***/ "a640":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("d039");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "a6b8":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-player-bar{display:flex;align-items:center;max-width:calc(100% - 18px);margin-right:7px;margin-left:20px}.vac-player-bar .vac-player-progress{width:190px}.vac-player-bar .vac-player-progress .vac-line-container{position:relative;height:4px;border-radius:5px;background-color:var(--chat-message-bg-color-audio-line)}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-progress{position:absolute;height:inherit;background-color:var(--chat-message-bg-color-audio-progress);border-radius:inherit}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot{position:absolute;top:-5px;margin-left:-7px;height:14px;width:14px;border-radius:50%;background-color:var(--chat-message-bg-color-audio-progress-selector);transition:transform .25s}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot__active{transform:scale(1.2)}@media only screen and (max-width:768px){.vac-player-bar{margin-right:5px}.vac-player-bar .vac-player-progress .vac-line-container{height:3px}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot{height:12px;width:12px;top:-5px;margin-left:-5px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "a981":
/***/ (function(module, exports) {

// eslint-disable-next-line es-x/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ "a9cb":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioPlayer_vue_vue_type_style_index_0_id_122955c2_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7da1");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioPlayer_vue_vue_type_style_index_0_id_122955c2_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AudioPlayer_vue_vue_type_style_index_0_id_122955c2_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "ab36":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var createNonEnumerableProperty = __webpack_require__("9112");

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ "ac31":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("7208");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("142ffd21", content, shadowRoot)
};

/***/ }),

/***/ "ad18":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-rooms-container{display:flex;flex-flow:column;flex:0 0 25%;min-width:260px;max-width:500px;position:relative;background:var(--chat-sidemenu-bg-color);height:100%;border-top-left-radius:var(--chat-container-border-radius);border-bottom-left-radius:var(--chat-container-border-radius)}.vac-rooms-container.vac-rooms-container-full{flex:0 0 100%;max-width:100%}.vac-rooms-container .vac-rooms-empty{font-size:14px;color:#9ca6af;font-style:italic;text-align:center;margin:40px 0;line-height:20px;white-space:pre-line}.vac-rooms-container .vac-room-list{flex:1;position:relative;max-width:100%;cursor:pointer;padding:0 10px 5px;overflow-y:auto}.vac-rooms-container .vac-room-item{border-radius:8px;align-items:center;display:flex;flex:1 1 100%;margin-bottom:5px;padding:0 14px;position:relative;min-height:71px}.vac-rooms-container .vac-room-item:hover{background:var(--chat-sidemenu-bg-color-hover)}.vac-rooms-container .vac-room-item:hover,.vac-rooms-container .vac-room-item:not(:hover){transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-rooms-container .vac-room-selected{color:var(--chat-sidemenu-color-active)!important}.vac-rooms-container .vac-room-selected,.vac-rooms-container .vac-room-selected:hover{background:var(--chat-sidemenu-bg-color-active)!important}@media only screen and (max-width:768px){.vac-rooms-container .vac-room-list{padding:0 7px 5px}.vac-rooms-container .vac-room-item{min-height:60px;padding:0 8px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "aeb0":
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__("9bf2").f;

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


/***/ }),

/***/ "aed9":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "b1a4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReply_vue_vue_type_style_index_0_id_366ebf45_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5496");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReply_vue_vue_type_style_index_0_id_366ebf45_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageReply_vue_vue_type_style_index_0_id_366ebf45_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "b29f":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("4731");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("20518412", content, shadowRoot)
};

/***/ }),

/***/ "b42e":
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "b4cd":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-wrapper{position:relative;display:flex}.vac-wrapper .vac-emoji-picker{position:absolute;z-index:9999;bottom:32px;right:10px;width:240px;overflow:scroll;padding:16px;box-sizing:border-box;border-radius:.5rem;background:var(--chat-emoji-bg-color);box-shadow:0 1px 2px -2px rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1),0 1px 2px 1px rgba(0,0,0,.1)}.vac-wrapper .vac-picker-reaction{position:fixed;top:auto;right:auto}.vac-wrapper .vac-emoji-picker__search{display:flex}.vac-wrapper .vac-emoji-picker__search>input{flex:1;border-radius:10rem;border:var(--chat-border-style);padding:5px 10px;outline:none;background:var(--chat-bg-color-input);color:var(--chat-color)}.vac-wrapper .vac-emoji-picker h5{margin:15px 0 8px;color:#b1b1b1;text-transform:uppercase;font-size:.8rem;cursor:default}.vac-wrapper .vac-emoji-picker .vac-emojis{display:flex;flex-wrap:wrap;justify-content:space-between}.vac-wrapper .vac-emoji-picker .vac-emojis:after{content:\"\";flex:auto}.vac-wrapper .vac-emoji-picker .vac-emojis span{padding:.2rem;cursor:pointer;border-radius:5px}.vac-wrapper .vac-emoji-picker .vac-emojis span:hover{background:var(--chat-sidemenu-bg-color-hover);cursor:pointer}.vac-wrapper .vac-emoji-reaction svg{height:19px;width:19px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "b517":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-format-message-wrapper .vac-icon-deleted{height:14px;width:14px;vertical-align:middle;margin:-3px 1px 0 0;fill:var(--chat-room-color-message)}.vac-format-message-wrapper .vac-image-link-container{background-color:var(--chat-message-bg-color-media);padding:8px;margin:2px auto;border-radius:4px}.vac-format-message-wrapper .vac-image-link{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:contain;background-position:50%!important;background-repeat:no-repeat!important;height:150px;width:150px;max-width:100%;border-radius:4px;margin:0 auto}.vac-format-message-wrapper .vac-image-link-message{max-width:166px;font-size:12px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "b527":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomMessageReply_vue_vue_type_style_index_0_id_4582354b_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3f09");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomMessageReply_vue_vue_type_style_index_0_id_4582354b_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomMessageReply_vue_vue_type_style_index_0_id_4582354b_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "b622":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var shared = __webpack_require__("5692");
var hasOwn = __webpack_require__("1a2d");
var uid = __webpack_require__("90e3");
var NATIVE_SYMBOL = __webpack_require__("4930");
var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


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

/***/ "b980":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es-x/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ "b9c6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageImage_vue_vue_type_style_index_0_id_db8562da_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("19ce");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageImage_vue_vue_type_style_index_0_id_db8562da_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageImage_vue_vue_type_style_index_0_id_db8562da_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "bc21":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_id_2b335c5a_prod_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d802");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_id_2b335c5a_prod_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_id_2b335c5a_prod_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_id_2b335c5a_prod_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ChatWindow_vue_vue_type_style_index_0_id_2b335c5a_prod_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "bd43":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isImageFile", function() { return isImageFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVideoFile", function() { return isVideoFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAudioFile", function() { return isAudioFile; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c9d9");


function checkMediaType(types, file) {
  if (!file || !file.type) return;
  return types.some(function (t) {
    return file.type.toLowerCase().includes(t);
  });
}

function isImageFile(file) {
  return checkMediaType(_constants__WEBPACK_IMPORTED_MODULE_0__[/* IMAGE_TYPES */ "b"], file);
}
function isVideoFile(file) {
  return checkMediaType(_constants__WEBPACK_IMPORTED_MODULE_0__[/* VIDEO_TYPES */ "c"], file);
}
function isAudioFile(file) {
  return checkMediaType(_constants__WEBPACK_IMPORTED_MODULE_0__[/* AUDIO_TYPES */ "a"], file);
}

/***/ }),

/***/ "be46":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-fade-spinner-enter{opacity:0}.vac-fade-spinner-enter-active{transition:opacity .8s}.vac-fade-spinner-leave-active{transition:opacity .2s;opacity:0}.vac-fade-image-enter{opacity:0}.vac-fade-image-enter-active{transition:opacity 1s}.vac-fade-image-leave-active{transition:opacity .5s;opacity:0}.vac-fade-message-enter{opacity:0}.vac-fade-message-enter-active{transition:opacity .5s}.vac-fade-message-leave-active{transition:opacity .2s;opacity:0}.vac-slide-left-enter-active,.vac-slide-right-enter-active{transition:all .3s ease;transition-property:transform,opacity}.vac-slide-left-leave-active,.vac-slide-right-leave-active{transition:all .2s cubic-bezier(1,.5,.8,1);transition-property:transform,opacity}.vac-slide-left-enter,.vac-slide-left-leave-to{transform:translateX(10px);opacity:0}.vac-slide-right-enter,.vac-slide-right-leave-to{transform:translateX(-10px);opacity:0}.vac-slide-up-enter-active{transition:all .3s ease}.vac-slide-up-leave-active{transition:all .2s cubic-bezier(1,.5,.8,1)}.vac-slide-up-enter,.vac-slide-up-leave-to{transform:translateY(10px);opacity:0}.vac-bounce-enter-active{-webkit-animation:vac-bounce-in .5s;animation:vac-bounce-in .5s}.vac-bounce-leave-active{animation:vac-bounce-in .3s reverse}@-webkit-keyframes vac-bounce-in{0%{transform:scale(0)}50%{transform:scale(1.05)}to{transform:scale(1)}}@keyframes vac-bounce-in{0%{transform:scale(0)}50%{transform:scale(1.05)}to{transform:scale(1)}}.vac-menu-list{border-radius:4px;display:block;cursor:pointer;background:var(--chat-dropdown-bg-color);padding:6px 0}.vac-menu-list :hover{background:var(--chat-dropdown-bg-color-hover)}.vac-menu-list :hover,.vac-menu-list :not(:hover){transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-menu-item{align-items:center;display:flex;flex:1 1 100%;min-height:30px;padding:5px 16px;position:relative;white-space:nowrap;line-height:30px}.vac-menu-options{position:absolute;right:10px;top:20px;z-index:9999;min-width:150px;display:inline-block;border-radius:4px;font-size:14px;color:var(--chat-color);overflow-y:auto;overflow-x:hidden;contain:content;box-shadow:0 2px 2px -4px rgba(0,0,0,.1),0 2px 2px 1px rgba(0,0,0,.12),0 1px 8px 1px rgba(0,0,0,.12)}.vac-app-border{border:var(--chat-border-style)}.vac-app-border-t{border-top:var(--chat-border-style)}.vac-app-border-r{border-right:var(--chat-border-style)}.vac-app-border-b{border-bottom:var(--chat-border-style)}.vac-app-box-shadow{box-shadow:0 2px 2px -4px rgba(0,0,0,.1),0 2px 2px 1px rgba(0,0,0,.12),0 1px 8px 1px rgba(0,0,0,.12)}.vac-item-clickable{cursor:pointer}.vac-vertical-center{display:flex;align-items:center;height:100%}.vac-vertical-center .vac-vertical-container{width:100%;text-align:center}.vac-svg-button{max-height:30px;display:flex;cursor:pointer;transition:all .2s}.vac-svg-button:hover{transform:scale(1.1);opacity:.7}.vac-avatar{background-size:cover;background-position:50%;background-repeat:no-repeat;background-color:#ddd;height:42px;width:42px;min-height:42px;min-width:42px;margin-right:15px;border-radius:50%}.vac-badge-counter{height:13px;width:auto;min-width:13px;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:3px;font-size:11px;font-weight:500}.vac-text-ellipsis{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-text-bold{font-weight:700}.vac-text-italic{font-style:italic}.vac-text-strike{text-decoration:line-through}.vac-text-underline{text-decoration:underline}.vac-text-inline-code{display:inline-block;color:var(--chat-markdown-color);margin:2px 0;padding:2px 3px}.vac-text-inline-code,.vac-text-multiline-code{font-size:12px;background:var(--chat-markdown-bg);border:1px solid var(--chat-markdown-border);border-radius:3px}.vac-text-multiline-code{display:block;color:var(--chat-markdown-color-multi);margin:4px 0;padding:7px}.vac-text-tag{color:var(--chat-message-color-tag);cursor:pointer}.vac-card-window{width:100%;display:block;max-width:100%;background:var(--chat-content-bg-color);color:var(--chat-color);overflow-wrap:break-word;position:relative;white-space:normal;border:var(--chat-container-border);border-radius:var(--chat-container-border-radius);box-shadow:var(--chat-container-box-shadow);-webkit-tap-highlight-color:transparent}.vac-card-window *{font-family:inherit}.vac-card-window a{color:#0d579c;font-weight:500}.vac-card-window .vac-chat-container{height:100%;display:flex}.vac-card-window .vac-chat-container input{min-width:10px}.vac-card-window .vac-chat-container input[type=search],.vac-card-window .vac-chat-container input[type=text],.vac-card-window .vac-chat-container textarea{-webkit-appearance:none}", ""]);
// Exports
module.exports = exports;


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

/***/ "c04e":
/***/ (function(module, exports, __webpack_require__) {

var call = __webpack_require__("c65b");
var isObject = __webpack_require__("861d");
var isSymbol = __webpack_require__("d9b5");
var getMethod = __webpack_require__("dc4a");
var ordinaryToPrimitive = __webpack_require__("485a");
var wellKnownSymbol = __webpack_require__("b622");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "c22c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormatMessage_vue_vue_type_style_index_0_id_0ef5045f_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("52bc");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormatMessage_vue_vue_type_style_index_0_id_0ef5045f_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormatMessage_vue_vue_type_style_index_0_id_0ef5045f_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "c28b":
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){ true?module.exports=n():undefined}(this,function(){var e="__v-click-outside",n="undefined"!=typeof window,t="undefined"!=typeof navigator,r=n&&("ontouchstart"in window||t&&navigator.msMaxTouchPoints>0)?["touchstart"]:["click"];function i(e){var n=e.event,t=e.handler;(0,e.middleware)(n)&&t(n)}function a(n,t){var a=function(e){var n="function"==typeof e;if(!n&&"object"!=typeof e)throw new Error("v-click-outside: Binding value must be a function or an object");return{handler:n?e:e.handler,middleware:e.middleware||function(e){return e},events:e.events||r,isActive:!(!1===e.isActive),detectIframe:!(!1===e.detectIframe),capture:!!e.capture}}(t.value),d=a.handler,o=a.middleware,c=a.detectIframe,u=a.capture;if(a.isActive){if(n[e]=a.events.map(function(e){return{event:e,srcTarget:document.documentElement,handler:function(e){return function(e){var n=e.el,t=e.event,r=e.handler,a=e.middleware,d=t.composedPath&&t.composedPath()||t.path;(d?d.indexOf(n)<0:!n.contains(t.target))&&i({event:t,handler:r,middleware:a})}({el:n,event:e,handler:d,middleware:o})},capture:u}}),c){var l={event:"blur",srcTarget:window,handler:function(e){return function(e){var n=e.el,t=e.event,r=e.handler,a=e.middleware;setTimeout(function(){var e=document.activeElement;e&&"IFRAME"===e.tagName&&!n.contains(e)&&i({event:t,handler:r,middleware:a})},0)}({el:n,event:e,handler:d,middleware:o})},capture:u};n[e]=[].concat(n[e],[l])}n[e].forEach(function(t){var r=t.event,i=t.srcTarget,a=t.handler;return setTimeout(function(){n[e]&&i.addEventListener(r,a,u)},0)})}}function d(n){(n[e]||[]).forEach(function(e){return e.srcTarget.removeEventListener(e.event,e.handler,e.capture)}),delete n[e]}var o=n?{bind:a,update:function(e,n){var t=n.value,r=n.oldValue;JSON.stringify(t)!==JSON.stringify(r)&&(d(e),a(e,{value:t}))},unbind:d}:{};return{install:function(e){e.directive("click-outside",o)},directive:o}});
//# sourceMappingURL=v-click-outside.umd.js.map


/***/ }),

/***/ "c430":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "c65b":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__("40d5");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "c6b6":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "c6cd":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var defineGlobalProperty = __webpack_require__("6374");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "c770":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ "c772":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Message_vue_vue_type_style_index_0_id_a4b15182_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3881");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Message_vue_vue_type_style_index_0_id_a4b15182_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Message_vue_vue_type_style_index_0_id_a4b15182_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


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

/***/ "ca84":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var hasOwn = __webpack_require__("1a2d");
var toIndexedObject = __webpack_require__("fc6a");
var indexOf = __webpack_require__("4d64").indexOf;
var hiddenKeys = __webpack_require__("d012");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "cb2d":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var definePropertyModule = __webpack_require__("9bf2");
var makeBuiltIn = __webpack_require__("13d2");
var defineGlobalProperty = __webpack_require__("6374");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "cc12":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "d012":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "d039":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "d066":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isCallable = __webpack_require__("1626");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "d1e7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "d2b2":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-image-container{width:250px;max-width:100%}.vac-image-container .vac-image-loading{filter:blur(3px)}.vac-image-container .vac-image-buttons{position:absolute;width:100%;height:100%;border-radius:4px;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.02) 60%,rgba(0,0,0,.05) 65%,rgba(0,0,0,.1) 70%,rgba(0,0,0,.2) 75%,rgba(0,0,0,.3) 80%,rgba(0,0,0,.5) 85%,rgba(0,0,0,.6) 90%,rgba(0,0,0,.7) 95%,rgba(0,0,0,.8))}.vac-image-container .vac-image-buttons svg{height:26px;width:26px}.vac-image-container .vac-image-buttons .vac-button-download,.vac-image-container .vac-image-buttons .vac-button-view{position:absolute;bottom:6px;left:7px}.vac-image-container .vac-image-buttons :first-child{left:40px}.vac-image-container .vac-image-buttons .vac-button-view{max-width:18px;bottom:8px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "d2bb":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__("e330");
var anObject = __webpack_require__("825a");
var aPossiblePrototype = __webpack_require__("3bbe");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "d422":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-message-actions-wrapper .vac-options-container{position:absolute;top:2px;right:10px;height:40px;width:70px;overflow:hidden;border-top-right-radius:8px}.vac-message-actions-wrapper .vac-options-image .vac-blur-container{border-bottom-left-radius:15px}.vac-message-actions-wrapper .vac-blur-container{position:absolute;height:100%;width:100%;left:8px;bottom:10px;background:var(--chat-message-bg-color);filter:blur(3px);border-bottom-left-radius:8px}.vac-message-actions-wrapper .vac-options-me{background:var(--chat-message-bg-color-me)}.vac-message-actions-wrapper .vac-message-options{background:var(--chat-icon-bg-dropdown-message);border-radius:50%;position:absolute;top:7px;right:7px}.vac-message-actions-wrapper .vac-message-options svg{height:17px;width:17px;padding:5px;margin:-5px}.vac-message-actions-wrapper .vac-message-emojis{position:absolute;top:6px;right:30px}.vac-message-actions-wrapper .vac-menu-options{right:15px}.vac-message-actions-wrapper .vac-menu-left{right:-118px}@media only screen and (max-width:768px){.vac-message-actions-wrapper .vac-options-container{right:3px}.vac-message-actions-wrapper .vac-menu-left{right:-50px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "d58f":
/***/ (function(module, exports, __webpack_require__) {

var aCallable = __webpack_require__("59ed");
var toObject = __webpack_require__("7b0b");
var IndexedObject = __webpack_require__("44ad");
var lengthOfArrayLike = __webpack_require__("07fa");

var $TypeError = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw $TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ "d802":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("be46");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("0d22952e", content, shadowRoot)
};

/***/ }),

/***/ "d9b5":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");
var isCallable = __webpack_require__("1626");
var isPrototypeOf = __webpack_require__("3a9b");
var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "d9ba":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".doc-svg-icon{width:32px;margin:auto}.doc-svg-button{width:30px;height:30px;margin:auto}.vac-text-ellipsis{width:100%;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-text-extension{font-size:12px;color:#757e85}.text-container{width:80%;margin:auto}.vac-message-wrapper .vac-card-info{border-radius:4px;text-align:center;margin:10px auto;font-size:12px;padding:4px;display:block;overflow-wrap:break-word;position:relative;white-space:normal;box-shadow:0 1px 1px -1px rgba(0,0,0,.1),0 1px 1px -1px rgba(0,0,0,.11),0 1px 2px -1px rgba(0,0,0,.11)}.vac-message-wrapper .vac-card-date{max-width:150px;font-weight:500;text-transform:uppercase;color:var(--chat-message-color-date);background:var(--chat-message-bg-color-date)}.vac-message-wrapper .vac-card-system{max-width:250px;padding:8px 4px;color:var(--chat-message-color-system);background:var(--chat-message-bg-color-system)}.vac-message-wrapper .vac-line-new{color:var(--chat-message-color-new-messages);position:relative;text-align:center;font-size:13px;padding:10px 0}.vac-message-wrapper .vac-line-new:after,.vac-message-wrapper .vac-line-new:before{border-top:1px solid var(--chat-message-color-new-messages);content:\"\";left:0;position:absolute;top:50%;width:calc(50% - 60px)}.vac-message-wrapper .vac-line-new:before{left:auto;right:0}.vac-message-wrapper .vac-message-box{display:flex;flex:0 0 50%;max-width:50%;justify-content:flex-start;line-height:1.4}.vac-message-wrapper .vac-avatar{height:28px;width:28px;min-height:28px;min-width:28px;margin:0 0 2px 0;align-self:flex-end}.vac-message-wrapper .vac-message-container{position:relative;padding:2px 10px;align-items:end;min-width:100px;box-sizing:content-box}.vac-message-wrapper .vac-message-container-offset{margin-top:10px}.vac-message-wrapper .vac-offset-current{margin-left:50%;justify-content:flex-end}.vac-message-wrapper .vac-message-card{background:var(--chat-message-bg-color);color:var(--chat-message-color);border-radius:8px;font-size:14px;padding:6px 9px 3px;white-space:pre-line;max-width:100%;transition-property:box-shadow,opacity;transition:box-shadow .28s cubic-bezier(.4,0,.2,1);will-change:box-shadow;box-shadow:0 1px 1px -1px rgba(0,0,0,.1),0 1px 1px -1px rgba(0,0,0,.11),0 1px 2px -1px rgba(0,0,0,.11)}.vac-message-wrapper .vac-message-highlight{box-shadow:0 1px 2px -1px rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.11),0 1px 5px -1px rgba(0,0,0,.11)}.vac-message-wrapper .vac-message-current{background:var(--chat-message-bg-color-me)!important}.vac-message-wrapper .vac-message-deleted{color:var(--chat-message-color-deleted)!important;font-size:13px!important;font-style:italic!important;background:var(--chat-message-bg-color-deleted)!important}.vac-message-wrapper .vac-icon-deleted{height:14px;width:14px;vertical-align:middle;margin:-2px 2px 0 0;fill:var(--chat-message-color-deleted)}.vac-message-wrapper .vac-video-container{width:350px;max-width:100%;margin:4px auto 5px}.vac-message-wrapper .vac-video-container video{border-radius:4px}.vac-message-wrapper .vac-non-preview-container{width:90px;font-size:12px}.vac-message-wrapper .vac-message-image{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:cover!important;background-position:50%!important;background-repeat:no-repeat!important;height:250px;width:250px;max-width:100%;border-radius:4px;margin:4px auto 5px;transition:filter .4s linear}.vac-message-wrapper .vac-text-username{font-size:13px;color:var(--chat-message-color-username);margin-bottom:2px}.vac-message-wrapper .vac-username-reply{margin-bottom:5px}.vac-message-wrapper .vac-text-timestamp{font-size:10px;color:var(--chat-message-color-timestamp);text-align:right}.vac-message-wrapper .vac-progress-time{float:left;margin:-2px 0 0 40px;color:var(--chat-color);font-size:12px}.vac-message-wrapper .vac-file-message{display:flex;flex-wrap:wrap;align-items:center;margin-top:3px}.vac-message-wrapper .vac-file-message span{max-width:100%}.vac-message-wrapper .vac-file-message .vac-icon-file svg{margin-right:5px}.vac-message-wrapper .vac-icon-edited{align-items:center;display:inline-flex;justify-content:center;letter-spacing:normal;line-height:1;text-indent:0;vertical-align:middle;margin:0 4px 2px}.vac-message-wrapper .vac-icon-edited svg{height:12px;width:12px}.vac-message-wrapper .vac-icon-check{height:14px;width:14px;vertical-align:middle;margin:-3px -3px 0 3px}@media only screen and (max-width:768px){.vac-message-wrapper .vac-message-container{padding:2px 3px 1px}.vac-message-wrapper .vac-message-container-offset{margin-top:10px}.vac-message-wrapper .vac-message-box{flex:0 0 80%;max-width:80%}.vac-message-wrapper .vac-avatar{height:25px;width:25px;min-height:25px;min-width:25px;margin:0 6px 1px 0}.vac-message-wrapper .vac-offset-current{margin-left:20%}.vac-message-wrapper .vac-progress-time{margin-left:37px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "d9e2":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__("23e7");
var global = __webpack_require__("da84");
var apply = __webpack_require__("2ba4");
var wrapErrorConstructorWithCause = __webpack_require__("e5cb");

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = global[WEB_ASSEMBLY];

var FORCED = Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  }
};

// https://github.com/tc39/proposal-error-cause
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


/***/ }),

/***/ "da84":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "db18":
/***/ (function(module, exports) {

if(typeof lamejs === 'undefined') {var e = new Error("Cannot find module 'lamejs'"); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = lamejs;

/***/ }),

/***/ "dc4a":
/***/ (function(module, exports, __webpack_require__) {

var aCallable = __webpack_require__("59ed");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),

/***/ "dec2":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-room-container{display:flex;flex:1;align-items:center;width:100%}.vac-room-container .vac-name-container{flex:1}.vac-room-container .vac-title-container{display:flex;align-items:center;line-height:25px}.vac-room-container .vac-state-circle{width:9px;height:9px;border-radius:50%;background-color:var(--chat-room-color-offline);margin-right:6px;transition:.3s}.vac-room-container .vac-state-online{background-color:var(--chat-room-color-online)}.vac-room-container .vac-room-name{flex:1;color:var(--chat-room-color-username);font-weight:500}.vac-room-container .vac-text-date{margin-left:5px;font-size:11px;color:var(--chat-room-color-timestamp)}.vac-room-container .vac-text-last{display:flex;align-items:center;font-size:12px;line-height:19px;color:var(--chat-room-color-message)}.vac-room-container .vac-message-new{color:var(--chat-room-color-username);font-weight:500}.vac-room-container .vac-icon-check{display:flex;vertical-align:middle;height:14px;width:14px;margin-top:-2px;margin-right:2px}.vac-room-container .vac-icon-microphone{height:15px;width:15px;vertical-align:middle;margin:-3px 1px 0 -2px;fill:var(--chat-room-color-message)}.vac-room-container .vac-room-options-container{display:flex;margin-left:auto}.vac-room-container .vac-room-badge{background-color:var(--chat-room-bg-color-badge);color:var(--chat-room-color-badge);margin-left:5px}.vac-room-container .vac-list-room-options{height:19px;width:19px;align-items:center;margin-left:5px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "e0a5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Room_vue_vue_type_style_index_0_id_05b0c3b4_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5970");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Room_vue_vue_type_style_index_0_id_05b0c3b4_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Room_vue_vue_type_style_index_0_id_05b0c3b4_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "e163":
/***/ (function(module, exports, __webpack_require__) {

var hasOwn = __webpack_require__("1a2d");
var isCallable = __webpack_require__("1626");
var toObject = __webpack_require__("7b0b");
var sharedKey = __webpack_require__("f772");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es-x/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


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

/***/ "e177":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "e330":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__("40d5");

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "e391":
/***/ (function(module, exports, __webpack_require__) {

var toString = __webpack_require__("577e");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "e5cb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("d066");
var hasOwn = __webpack_require__("1a2d");
var createNonEnumerableProperty = __webpack_require__("9112");
var isPrototypeOf = __webpack_require__("3a9b");
var setPrototypeOf = __webpack_require__("d2bb");
var copyConstructorProperties = __webpack_require__("e893");
var proxyAccessor = __webpack_require__("aeb0");
var inheritIfRequired = __webpack_require__("7156");
var normalizeStringArgument = __webpack_require__("e391");
var installErrorCause = __webpack_require__("ab36");
var clearErrorStack = __webpack_require__("c770");
var ERROR_STACK_INSTALLABLE = __webpack_require__("b980");
var DESCRIPTORS = __webpack_require__("83ab");
var IS_PURE = __webpack_require__("c430");

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    if (ERROR_STACK_INSTALLABLE) createNonEnumerableProperty(result, 'stack', clearErrorStack(result.stack, 2));
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


/***/ }),

/***/ "e868":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EmojiPicker_vue_vue_type_style_index_0_id_0e56d761_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("66e6");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EmojiPicker_vue_vue_type_style_index_0_id_0e56d761_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EmojiPicker_vue_vue_type_style_index_0_id_0e56d761_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "e893":
/***/ (function(module, exports, __webpack_require__) {

var hasOwn = __webpack_require__("1a2d");
var ownKeys = __webpack_require__("56ef");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var definePropertyModule = __webpack_require__("9bf2");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "ebb5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__("a981");
var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var isCallable = __webpack_require__("1626");
var isObject = __webpack_require__("861d");
var hasOwn = __webpack_require__("1a2d");
var classof = __webpack_require__("f5df");
var tryToString = __webpack_require__("0d51");
var createNonEnumerableProperty = __webpack_require__("9112");
var defineBuiltIn = __webpack_require__("cb2d");
var defineProperty = __webpack_require__("9bf2").f;
var isPrototypeOf = __webpack_require__("3a9b");
var getPrototypeOf = __webpack_require__("e163");
var setPrototypeOf = __webpack_require__("d2bb");
var wellKnownSymbol = __webpack_require__("b622");
var uid = __webpack_require__("90e3");
var InternalStateModule = __webpack_require__("69f3");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ "f48d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomUsersTag_vue_vue_type_style_index_0_id_adecc494_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("45f4");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomUsersTag_vue_vue_type_style_index_0_id_adecc494_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomUsersTag_vue_vue_type_style_index_0_id_adecc494_prod_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "f58d":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".vac-emojis-container{position:absolute;width:calc(100% - 16px);padding:10px 8px;background:var(--chat-footer-bg-color);display:flex;align-items:center;overflow:auto}.vac-emojis-container .vac-emoji-element{padding:0 8px;font-size:30px;border-radius:4px;cursor:pointer}.vac-emojis-container .vac-emoji-element:hover{background:var(--chat-footer-bg-color-tag-active)}.vac-emojis-container .vac-emoji-element:hover,.vac-emojis-container .vac-emoji-element:not(:hover){transition:background-color .3s cubic-bezier(.25,.8,.5,1)}@media only screen and (max-width:768px){.vac-emojis-container{width:calc(100% - 10px);padding:7px 5px}.vac-emojis-container .vac-emoji-element{padding:0 7px;font-size:26px}}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "f5df":
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
var isCallable = __webpack_require__("1626");
var classofRaw = __webpack_require__("c6b6");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "f772":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5692");
var uid = __webpack_require__("90e3");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "f8cd":
/***/ (function(module, exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__("5926");

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ "fa9e":
/***/ (function(module, exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__("986a");


/***/ }),

/***/ "fc6a":
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__("44ad");
var requireObjectCoercible = __webpack_require__("1d80");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "fdb9":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("a6b8");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("fb5ab182", content, shadowRoot)
};

/***/ }),

/***/ "fdbf":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__("4930");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ })

/******/ });
//# sourceMappingURL=vue-advanced-chat.js.map