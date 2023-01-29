function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function callWithErrorHandling(fn, instance2, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance2, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance2, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance2, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance2, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance2, type, args));
  }
  return values;
}
function handleError(err, instance2, type, throwInDev = true) {
  const contextVNode = instance2 ? instance2.vnode : null;
  if (instance2) {
    let cur = instance2.parent;
    const exposedInstance = instance2.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance2.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start2 = flushIndex + 1;
  let end = queue.length;
  while (start2 < end) {
    const middle = start2 + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start2 = middle + 1 : end = middle;
  }
  return start2;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  flushPreFlushCbs();
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen);
  queue.sort((a, b) => getId(a) - getId(b));
  const check2 = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function emit$1(instance2, event, ...rawArgs) {
  if (instance2.isUnmounted)
    return;
  const props = instance2.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => a.trim());
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance2, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance2.emitted) {
      instance2.emitted = {};
    } else if (instance2.emitted[handlerName]) {
      return;
    }
    instance2.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance2, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options2, key) {
  if (!options2 || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options2, key[0].toLowerCase() + key.slice(1)) || hasOwn(options2, hyphenate(key)) || hasOwn(options2, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance2) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance2;
  currentScopeId = instance2 && instance2.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance2) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render: render2, renderCache, data: data2, setupState, ctx, inheritAttrs } = instance2;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance2);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render2.call(proxyToUse, proxyToUse, renderCache, props, setupState, data2, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render3 = Component;
      if (false)
        ;
      result = normalizeVNode(render3.length > 1 ? render3(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit: emit2
      } : { attrs, slots, emit: emit2 }) : render3(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance2, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance2 = currentInstance || currentRenderingInstance;
  if (instance2) {
    const provides = instance2.parent == null ? instance2.vnode.appContext && instance2.vnode.appContext.provides : instance2.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance2.proxy) : defaultValue;
    } else
      ;
  }
}
function watchPostEffect(effect, options2) {
  return doWatch(effect, null, { flush: "post" });
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options2) {
  return doWatch(source, cb, options2);
}
function doWatch(source, cb, { immediate, deep, flush: flush2, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance2 = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance2, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance2, 2);
    } else {
      getter = () => {
        if (instance2 && instance2.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance2, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance2, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance2, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance2, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush2 === "sync") {
    scheduler = job;
  } else if (flush2 === "post") {
    scheduler = () => queuePostRenderEffect(job, instance2 && instance2.suspense);
  } else {
    scheduler = () => queuePreFlushCb(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush2 === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance2 && instance2.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance2 && instance2.scope) {
      remove(instance2.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options2) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options2 = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options2);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state2 = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state2.isMounted = true;
  });
  onBeforeUnmount(() => {
    state2.isUnmounting = true;
  });
  return state2;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance2 = getCurrentInstance();
    const state2 = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state2.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state2, instance2);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance2.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state2, instance2);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state2.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state2.isLeaving = false;
            instance2.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state2, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state2, vnode) {
  const { leavingVNodes } = state2;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state2, instance2) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state2, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance2, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state2.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state2.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state2.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state2, instance2);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options2) {
  return isFunction(options2) ? { setup: options2, name: options2.name } : options2;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance2 = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance: instance2,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance2, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance2, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance2 = currentRenderingInstance || currentInstance;
  if (instance2) {
    const Component = instance2.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component, false);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance2[type] || Component[type], name) || resolve(instance2.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.fn;
    }
  }
  return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    return createVNode("slot", name === "default" ? null : { name }, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, { key: props.key || `_${name}` }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance2 }, key) {
    const { ctx, setupState, data: data2, props, accessCache, type, appContext } = instance2;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data2[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data2 !== EMPTY_OBJ && hasOwn(data2, key)) {
        accessCache[key] = 2;
        return data2[key];
      } else if ((normalizedProps = instance2.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance2, "get", key);
      }
      return publicGetter(instance2);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance2 }, key, value) {
    const { data: data2, setupState, ctx } = instance2;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data2 !== EMPTY_OBJ && hasOwn(data2, key)) {
      data2[key] = value;
      return true;
    } else if (hasOwn(instance2.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance2) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data: data2, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data2 !== EMPTY_OBJ && hasOwn(data2, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance2) {
  const options2 = resolveMergedOptions(instance2);
  const publicThis = instance2.proxy;
  const ctx = instance2.ctx;
  shouldCacheAccess = false;
  if (options2.beforeCreate) {
    callHook$1(options2.beforeCreate, instance2, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount: beforeMount2,
    mounted,
    beforeUpdate,
    updated: updated2,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted: unmounted2,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options2;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance2.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data2 = dataOptions.call(publicThis, publicThis);
    if (!isObject(data2))
      ;
    else {
      instance2.data = reactive(data2);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get3 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get3,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance2, "c");
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register2(_hook.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount2);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated2);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted2);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance2.exposed || (instance2.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance2.exposed) {
      instance2.exposed = {};
    }
  }
  if (render2 && instance2.render === NOOP) {
    instance2.render = render2;
  }
  if (inheritAttrs != null) {
    instance2.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance2.components = components;
  if (directives)
    instance2.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance2, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance2.proxy)) : hook.bind(instance2.proxy), instance2, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance2) {
  const base = instance2.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance2.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance2, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance2.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance2, rawProps, props, attrs);
  for (const key in instance2.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance2.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance2.type.props) {
      instance2.props = attrs;
    } else {
      instance2.props = props;
    }
  }
  instance2.attrs = attrs;
}
function updateProps(instance2, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance2;
  const rawCurrentProps = toRaw(props);
  const [options2] = instance2.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance2.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance2.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options2) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options2, rawCurrentProps, camelizedKey, value, instance2, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance2, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options2) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options2, rawCurrentProps, key, void 0, instance2, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance2, "set", "$attrs");
  }
}
function setFullProps(instance2, rawProps, props, attrs) {
  const [options2, needCastKeys] = instance2.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options2 && hasOwn(options2, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance2.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options2, rawCurrentProps, key, castValues[key], instance2, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options2, props, key, value, instance2, isAbsent) {
  const opt = options2[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance2;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance2);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance2) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance2, children) => {
  const normalized = normalizeSlotValue(children);
  instance2.slots.default = () => normalized;
};
const initSlots = (instance2, children) => {
  if (instance2.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance2.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance2.slots = {});
    }
  } else {
    instance2.slots = {};
    if (children) {
      normalizeVNodeSlots(instance2, children);
    }
  }
  def(instance2.slots, InternalObjectKey, 1);
};
const updateSlots = (instance2, children, optimized) => {
  const { vnode, slots } = instance2;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance2, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render2, hydrate) {
  return function createApp(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options2) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options2);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options2);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive2) {
        if (!directive2) {
          return context.directives[name];
        }
        context.directives[name] = directive2;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options2) {
  return baseCreateRenderer(options2);
}
function baseCreateRenderer(options2, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options2;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next2;
    while (el && el !== anchor) {
      next2 = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next2;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next2;
    while (el && el !== anchor) {
      next2 = hostNextSibling(el);
      hostRemove(el);
      el = next2;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next2 = newProps[key];
            if (next2 !== prev || key === "value") {
              hostPatchProp(el, key, prev, next2, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next2 = newProps[key];
        const prev = oldProps[key];
        if (next2 !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next2, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance2 = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance2.ctx.renderer = internals;
    }
    {
      setupComponent(instance2);
    }
    if (instance2.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance2, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance2.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance2, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance2 = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance2.asyncDep && !instance2.asyncResolved) {
        updateComponentPreRender(instance2, n2, optimized);
        return;
      } else {
        instance2.next = n2;
        invalidateJob(instance2.update);
        instance2.update();
      }
    } else {
      n2.el = n1.el;
      instance2.vnode = n2;
    }
  };
  const setupRenderEffect = (instance2, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance2.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance2;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance2, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance2, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance2.subTree = renderComponentRoot(instance2);
            hydrateNode(el, instance2.subTree, instance2, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              () => !instance2.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance2.subTree = renderComponentRoot(instance2);
          patch(null, subTree, container, anchor, instance2, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance2.a && queuePostRenderEffect(instance2.a, parentSuspense);
        }
        instance2.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next: next2, bu, u, parent, vnode } = instance2;
        let originNext = next2;
        let vnodeHook;
        toggleRecurse(instance2, false);
        if (next2) {
          next2.el = vnode.el;
          updateComponentPreRender(instance2, next2, optimized);
        } else {
          next2 = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next2.props && next2.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next2, vnode);
        }
        toggleRecurse(instance2, true);
        const nextTree = renderComponentRoot(instance2);
        const prevTree = instance2.subTree;
        instance2.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          hostParentNode(prevTree.el),
          getNextHostNode(prevTree),
          instance2,
          parentSuspense,
          isSVG
        );
        next2.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance2, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next2.props && next2.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next2, vnode), parentSuspense);
        }
      }
    };
    const effect = instance2.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update2),
      instance2.scope
    );
    const update2 = instance2.update = () => effect.run();
    update2.id = instance2.uid;
    toggleRecurse(instance2, true);
    update2();
  };
  const updateComponentPreRender = (instance2, nextVNode, optimized) => {
    nextVNode.component = instance2;
    const prevProps = instance2.vnode.props;
    instance2.vnode = nextVNode;
    instance2.next = null;
    updateProps(instance2, nextVNode.props, prevProps, optimized);
    updateSlots(instance2, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance2.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next2;
    while (cur !== end) {
      next2 = hostNextSibling(cur);
      hostRemove(cur);
      cur = next2;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance2, parentSuspense, doRemove) => {
    const { bum, scope, update: update2, subTree, um } = instance2;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update2) {
      update2.active = false;
      unmount(subTree, instance2, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance2.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance2.asyncDep && !instance2.asyncResolved && instance2.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options2
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2, hydrate)
  };
}
function toggleRecurse({ effect, update: update2 }, allowed) {
  effect.allowRecurse = update2.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text, null, text2, flag);
}
function createCommentVNode(text2 = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text2)) : createVNode(Comment, null, text2);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance2, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance2, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance2 = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance2.ctx = { _: instance2 };
  }
  instance2.root = parent ? parent.root : instance2;
  instance2.emit = emit$1.bind(null, instance2);
  if (vnode.ce) {
    vnode.ce(instance2);
  }
  return instance2;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance2) => {
  currentInstance = instance2;
  instance2.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance2) {
  return instance2.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance2, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance2.vnode;
  const isStateful = isStatefulComponent(instance2);
  initProps(instance2, props, isStateful, isSSR);
  initSlots(instance2, children);
  const setupResult = isStateful ? setupStatefulComponent(instance2, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance2, isSSR) {
  const Component = instance2.type;
  instance2.accessCache = /* @__PURE__ */ Object.create(null);
  instance2.proxy = markRaw(new Proxy(instance2.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance2.setupContext = setup.length > 1 ? createSetupContext(instance2) : null;
    setCurrentInstance(instance2);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance2, 0, [instance2.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance2, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance2, 0);
        });
      } else {
        instance2.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance2, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance2, isSSR);
  }
}
function handleSetupResult(instance2, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance2.type.__ssrInlineRender) {
      instance2.ssrRender = setupResult;
    } else {
      instance2.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance2.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance2, isSSR);
}
let compile;
function finishComponentSetup(instance2, isSSR, skipOptions) {
  const Component = instance2.type;
  if (!instance2.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance2.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance2.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance2);
    pauseTracking();
    applyOptions(instance2);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance2) {
  return new Proxy(instance2.attrs, {
    get(target, key) {
      track(instance2, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance2) {
  const expose = (exposed) => {
    instance2.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance2));
      },
      slots: instance2.slots,
      emit: instance2.emit,
      expose
    };
  }
}
function getExposeProxy(instance2) {
  if (instance2.exposed) {
    return instance2.exposeProxy || (instance2.exposeProxy = new Proxy(proxyRefs(markRaw(instance2.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance2);
        }
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.2.37";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node, text2) => {
    node.nodeValue = text2;
  },
  setElementText: (el, text2) => {
    el.textContent = text2;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start2, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start2 && (start2 === end || start2.nextSibling)) {
      while (true) {
        parent.insertBefore(start2.cloneNode(true), anchor);
        if (start2 === end || !(start2 = start2.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next2) {
  const style = el.style;
  const isCssString = isString(next2);
  if (next2 && !isCssString) {
    for (const key in next2) {
      setStyle(style, key, next2[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next2[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next2) {
        style.cssText = next2;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance2) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = performance.now.bind(performance);
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener$1(el, event, handler, options2) {
  el.addEventListener(event, handler, options2);
}
function removeEventListener(el, event, handler, options2) {
  el.removeEventListener(event, handler, options2);
}
function patchEvent(el, rawName, prevValue, nextValue, instance2 = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options2] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance2);
      addEventListener$1(el, name, invoker, options2);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options2);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options2;
  if (optionsModifierRE.test(name)) {
    options2 = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options2[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options2];
}
function createInvoker(initialValue, instance2) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance2, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
function defineCustomElement(options2, hydrate) {
  const Comp = defineComponent(options2);
  class VueCustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, hydrate);
    }
  }
  VueCustomElement.def = Comp;
  return VueCustomElement;
}
const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
};
class VueElement extends BaseClass {
  constructor(_def, _props = {}, hydrate) {
    super();
    this._def = _def;
    this._props = _props;
    this._instance = null;
    this._connected = false;
    this._resolved = false;
    this._numberProps = null;
    if (this.shadowRoot && hydrate) {
      hydrate(this._createVNode(), this.shadowRoot);
    } else {
      this.attachShadow({ mode: "open" });
    }
  }
  connectedCallback() {
    this._connected = true;
    if (!this._instance) {
      this._resolveDef();
    }
  }
  disconnectedCallback() {
    this._connected = false;
    nextTick(() => {
      if (!this._connected) {
        render$1(null, this.shadowRoot);
        this._instance = null;
      }
    });
  }
  _resolveDef() {
    if (this._resolved) {
      return;
    }
    this._resolved = true;
    for (let i = 0; i < this.attributes.length; i++) {
      this._setAttr(this.attributes[i].name);
    }
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }).observe(this, { attributes: true });
    const resolve3 = (def2) => {
      const { props, styles } = def2;
      const hasOptions = !isArray(props);
      const rawKeys = props ? hasOptions ? Object.keys(props) : props : [];
      let numberProps;
      if (hasOptions) {
        for (const key in this._props) {
          const opt = props[key];
          if (opt === Number || opt && opt.type === Number) {
            this._props[key] = toNumber(this._props[key]);
            (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[key] = true;
          }
        }
      }
      this._numberProps = numberProps;
      for (const key of Object.keys(this)) {
        if (key[0] !== "_") {
          this._setProp(key, this[key], true, false);
        }
      }
      for (const key of rawKeys.map(camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },
          set(val) {
            this._setProp(key, val);
          }
        });
      }
      this._applyStyles(styles);
      this._update();
    };
    const asyncDef = this._def.__asyncLoader;
    if (asyncDef) {
      asyncDef().then(resolve3);
    } else {
      resolve3(this._def);
    }
  }
  _setAttr(key) {
    let value = this.getAttribute(key);
    if (this._numberProps && this._numberProps[key]) {
      value = toNumber(value);
    }
    this._setProp(camelize(key), value, false);
  }
  _getProp(key) {
    return this._props[key];
  }
  _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
    if (val !== this._props[key]) {
      this._props[key] = val;
      if (shouldUpdate && this._instance) {
        this._update();
      }
      if (shouldReflect) {
        if (val === true) {
          this.setAttribute(hyphenate(key), "");
        } else if (typeof val === "string" || typeof val === "number") {
          this.setAttribute(hyphenate(key), val + "");
        } else if (!val) {
          this.removeAttribute(hyphenate(key));
        }
      }
    }
  }
  _update() {
    render$1(this._createVNode(), this.shadowRoot);
  }
  _createVNode() {
    const vnode = createVNode(this._def, extend({}, this._props));
    if (!this._instance) {
      vnode.ce = (instance2) => {
        this._instance = instance2;
        instance2.isCE = true;
        instance2.emit = (event, ...args) => {
          this.dispatchEvent(new CustomEvent(event, {
            detail: args
          }));
        };
        let parent = this;
        while (parent = parent && (parent.parentNode || parent.host)) {
          if (parent instanceof VueElement) {
            instance2.parent = parent._instance;
            break;
          }
        }
      };
    }
    return vnode;
  }
  _applyStyles(styles) {
    if (styles) {
      styles.forEach((css) => {
        const s = document.createElement("style");
        s.textContent = css;
        this.shadowRoot.appendChild(s);
      });
    }
  }
}
function useCssVars(getter) {
  const instance2 = getCurrentInstance();
  if (!instance2) {
    return;
  }
  const setVars = () => setVarsOnVNode(instance2.subTree, getter(instance2.proxy));
  watchPostEffect(setVars);
  onMounted(() => {
    const ob = new MutationObserver(setVars);
    ob.observe(instance2.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === Static) {
    let { el, anchor } = vnode;
    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor)
        break;
      el = el.nextSibling;
    }
  }
}
function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style = el.style;
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
    }
  }
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve3 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve3]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve3);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve3 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve3);
        }
      });
      callHook(onLeave, [el, resolve3]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve3) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve3();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve3();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance2 = getCurrentInstance();
    const state2 = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(prevChildren[0].el, instance2.vnode.el, moveClass)) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el = c.el;
        const style = el.style;
        addTransitionClass(el, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el._moveCb = (e) => {
          if (e && e.target !== el) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener("transitionend", cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        };
        el.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || Fragment;
      prevChildren = children;
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state2, instance2));
        }
      }
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state2, instance2));
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el = c.el;
  if (el._moveCb) {
    el._moveCb();
  }
  if (el._enterCb) {
    el._enterCb();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el, root, moveClass) {
  const clone = el.cloneNode();
  if (el._vtc) {
    el._vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const { hasTransform } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  };
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  return (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event);
    }
  };
};
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el._vod : "none";
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const render$1 = (...args) => {
  ensureRenderer().render(...args);
};
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$q = {
  name: "AppLoader",
  props: {
    show: { type: Boolean, default: false },
    infinite: { type: Boolean, default: false },
    type: { type: String, required: true },
    messageId: { type: String, default: "" }
  }
};
const _hoisted_1$q = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_2$m = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_3$j = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_4$h = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_5$a = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_6$7 = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    name: "vac-fade-spinner",
    appear: ""
  }, {
    default: withCtx(() => [
      $props.show ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["vac-loader-wrapper", {
          "vac-container-center": !$props.infinite,
          "vac-container-top": $props.infinite
        }])
      }, [
        $props.type === "rooms" ? renderSlot(_ctx.$slots, "spinner-icon-rooms", { key: 0 }, () => [
          _hoisted_1$q
        ]) : createCommentVNode("", true),
        $props.type === "infinite-rooms" ? renderSlot(_ctx.$slots, "spinner-icon-infinite-rooms", { key: 1 }, () => [
          _hoisted_2$m
        ]) : createCommentVNode("", true),
        $props.type === "message-file" ? renderSlot(_ctx.$slots, "spinner-icon-message-file_" + $props.messageId, { key: 2 }, () => [
          _hoisted_3$j
        ]) : createCommentVNode("", true),
        $props.type === "room-file" ? renderSlot(_ctx.$slots, "spinner-icon-room-file", { key: 3 }, () => [
          _hoisted_4$h
        ]) : createCommentVNode("", true),
        $props.type === "messages" ? renderSlot(_ctx.$slots, "spinner-icon-messages", { key: 4 }, () => [
          _hoisted_5$a
        ]) : createCommentVNode("", true),
        $props.type === "infinite-messages" ? renderSlot(_ctx.$slots, "spinner-icon-infinite-messages", { key: 5 }, () => [
          _hoisted_6$7
        ]) : createCommentVNode("", true)
      ], 2)) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
var Loader = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p]]);
const _sfc_main$p = {
  name: "SvgIcon",
  props: {
    name: { type: String, default: null },
    param: { type: String, default: null }
  },
  data() {
    return {
      svgItem: {
        search: {
          path: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
        },
        add: {
          path: "M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
        },
        toggle: {
          path: "M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z"
        },
        menu: {
          path: "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
        },
        close: {
          path: "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
        },
        file: {
          path: "M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
        },
        paperclip: {
          path: "M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z"
        },
        "close-outline": {
          path: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        },
        send: {
          path: "M2,21L23,12L2,3V10L17,12L2,14V21Z"
        },
        emoji: {
          path: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
        },
        document: {
          path: "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
        },
        pencil: {
          path: "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
        },
        checkmark: {
          path: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
        },
        "double-checkmark": {
          path: "M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"
        },
        eye: {
          path: "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
        },
        dropdown: {
          path: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        },
        deleted: {
          path: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z"
        },
        microphone: {
          size: "large",
          path: "M432.8,216.4v39.2c0,45.2-15.3,84.3-45.2,118.4c-29.8,33.2-67.3,52.8-111.6,57.9v40.9h78.4c5.1,0,10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6c0,5.1-1.7,10.2-6,13.6c-4.3,4.3-8.5,6-13.6,6H157.6c-5.1,0-10.2-1.7-13.6-6c-4.3-4.3-6-8.5-6-13.6c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6H236v-40.9c-44.3-5.1-81.8-23.9-111.6-57.9s-45.2-73.3-45.2-118.4v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6s10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6v39.2c0,37.5,13.6,70.7,40,97.1s59.6,40,97.1,40s70.7-13.6,97.1-40c26.4-26.4,40-59.6,40-97.1v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6c5.1,0,10.2,1.7,13.6,6C430.2,206.2,432.8,211.3,432.8,216.4z M353.5,98v157.6c0,27.3-9.4,50.3-29,69c-19.6,19.6-42.6,29-69,29s-50.3-9.4-69-29c-19.6-19.6-29-42.6-29-69V98c0-27.3,9.4-50.3,29-69c19.6-19.6,42.6-29,69-29s50.3,9.4,69,29C344.2,47.7,353.5,71.6,353.5,98z"
        },
        "audio-play": {
          size: "medium",
          path: "M43.331,21.237L7.233,0.397c-0.917-0.529-2.044-0.529-2.96,0c-0.916,0.528-1.48,1.505-1.48,2.563v41.684   c0,1.058,0.564,2.035,1.48,2.563c0.458,0.268,0.969,0.397,1.48,0.397c0.511,0,1.022-0.133,1.48-0.397l36.098-20.84   c0.918-0.529,1.479-1.506,1.479-2.564S44.247,21.767,43.331,21.237z"
        },
        "audio-pause": {
          size: "medium",
          path: "M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z",
          path2: "M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"
        }
      }
    };
  },
  computed: {
    svgId() {
      const param = this.param ? "-" + this.param : "";
      return `vac-icon-${this.name}${param}`;
    },
    size() {
      const item = this.svgItem[this.name];
      if (item.size === "large")
        return 512;
      else if (item.size === "medium")
        return 48;
      else
        return 24;
    }
  }
};
const _hoisted_1$p = ["viewBox"];
const _hoisted_2$l = ["id", "d"];
const _hoisted_3$i = ["id", "d"];
function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    version: "1.1",
    width: "24",
    height: "24",
    viewBox: `0 0 ${$options.size} ${$options.size}`
  }, [
    createBaseVNode("path", {
      id: $options.svgId,
      d: $data.svgItem[$props.name].path
    }, null, 8, _hoisted_2$l),
    $data.svgItem[$props.name].path2 ? (openBlock(), createElementBlock("path", {
      key: 0,
      id: $options.svgId,
      d: $data.svgItem[$props.name].path2
    }, null, 8, _hoisted_3$i)) : createCommentVNode("", true)
  ], 8, _hoisted_1$p);
}
var SvgIcon = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o]]);
const _sfc_main$o = {
  name: "RoomsSearch",
  components: { SvgIcon },
  props: {
    textMessages: { type: Object, required: true },
    showSearch: { type: Boolean, required: true },
    showAddRoom: { type: Boolean, required: true },
    rooms: { type: Array, required: true },
    loadingRooms: { type: Boolean, required: true }
  },
  emits: ["search-room", "add-room"],
  computed: {
    showSearchBar() {
      return this.showSearch || this.showAddRoom;
    }
  }
};
const _hoisted_1$o = {
  key: 0,
  class: "vac-icon-search"
};
const _hoisted_2$k = ["placeholder"];
function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass({
      "vac-box-search": $options.showSearchBar,
      "vac-box-empty": !$options.showSearchBar
    })
  }, [
    $props.showSearch ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      !$props.loadingRooms && $props.rooms.length ? (openBlock(), createElementBlock("div", _hoisted_1$o, [
        renderSlot(_ctx.$slots, "search-icon", {}, () => [
          createVNode(_component_svg_icon, { name: "search" })
        ])
      ])) : createCommentVNode("", true),
      !$props.loadingRooms && $props.rooms.length ? (openBlock(), createElementBlock("input", {
        key: 1,
        type: "search",
        placeholder: $props.textMessages.SEARCH,
        autocomplete: "off",
        class: "vac-input",
        onInput: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("search-room", $event))
      }, null, 40, _hoisted_2$k)) : createCommentVNode("", true)
    ], 64)) : createCommentVNode("", true),
    $props.showAddRoom ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: "vac-svg-button vac-add-icon",
      onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("add-room"))
    }, [
      renderSlot(_ctx.$slots, "add-icon", {}, () => [
        createVNode(_component_svg_icon, { name: "add" })
      ])
    ])) : createCommentVNode("", true)
  ], 2);
}
var RoomsSearch = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n]]);
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var linkify = {};
var _class$4 = {};
_class$4.__esModule = true;
_class$4.inherits = inherits;
function inherits(parent, child) {
  var props = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var extended = Object.create(parent.prototype);
  for (var p2 in props) {
    extended[p2] = props[p2];
  }
  extended.constructor = child;
  child.prototype = extended;
  return child;
}
var options$1 = {};
options$1.__esModule = true;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var defaults = {
  defaultProtocol: "http",
  events: null,
  format: noop$1,
  formatHref: noop$1,
  nl2br: false,
  tagName: "a",
  target: typeToTarget,
  validate: true,
  ignoreTags: [],
  attributes: null,
  className: "linkified"
};
options$1.defaults = defaults;
options$1.Options = Options;
options$1.contains = contains;
function Options(opts) {
  opts = opts || {};
  this.defaultProtocol = opts.hasOwnProperty("defaultProtocol") ? opts.defaultProtocol : defaults.defaultProtocol;
  this.events = opts.hasOwnProperty("events") ? opts.events : defaults.events;
  this.format = opts.hasOwnProperty("format") ? opts.format : defaults.format;
  this.formatHref = opts.hasOwnProperty("formatHref") ? opts.formatHref : defaults.formatHref;
  this.nl2br = opts.hasOwnProperty("nl2br") ? opts.nl2br : defaults.nl2br;
  this.tagName = opts.hasOwnProperty("tagName") ? opts.tagName : defaults.tagName;
  this.target = opts.hasOwnProperty("target") ? opts.target : defaults.target;
  this.validate = opts.hasOwnProperty("validate") ? opts.validate : defaults.validate;
  this.ignoreTags = [];
  this.attributes = opts.attributes || opts.linkAttributes || defaults.attributes;
  this.className = opts.hasOwnProperty("className") ? opts.className : opts.linkClass || defaults.className;
  var ignoredTags = opts.hasOwnProperty("ignoreTags") ? opts.ignoreTags : defaults.ignoreTags;
  for (var i = 0; i < ignoredTags.length; i++) {
    this.ignoreTags.push(ignoredTags[i].toUpperCase());
  }
}
Options.prototype = {
  resolve: function resolve2(token) {
    var href = token.toHref(this.defaultProtocol);
    return {
      formatted: this.get("format", token.toString(), token),
      formattedHref: this.get("formatHref", href, token),
      tagName: this.get("tagName", href, token),
      className: this.get("className", href, token),
      target: this.get("target", href, token),
      events: this.getObject("events", href, token),
      attributes: this.getObject("attributes", href, token)
    };
  },
  check: function check(token) {
    return this.get("validate", token.toString(), token);
  },
  get: function get(key, operator, token) {
    var optionValue = void 0, option = this[key];
    if (!option) {
      return option;
    }
    switch (typeof option === "undefined" ? "undefined" : _typeof(option)) {
      case "function":
        return option(operator, token.type);
      case "object":
        optionValue = option.hasOwnProperty(token.type) ? option[token.type] : defaults[key];
        return typeof optionValue === "function" ? optionValue(operator, token.type) : optionValue;
    }
    return option;
  },
  getObject: function getObject(key, operator, token) {
    var option = this[key];
    return typeof option === "function" ? option(operator, token.type) : option;
  }
};
function contains(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return true;
    }
  }
  return false;
}
function noop$1(val) {
  return val;
}
function typeToTarget(href, type) {
  return type === "url" ? "_blank" : null;
}
var scanner$1 = {};
var state = {};
state.__esModule = true;
state.stateify = state.TokenState = state.CharacterState = void 0;
var _class$3 = _class$4;
function createStateClass() {
  return function(tClass) {
    this.j = [];
    this.T = tClass || null;
  };
}
var BaseState = createStateClass();
BaseState.prototype = {
  defaultTransition: false,
  on: function on(symbol, state2) {
    if (symbol instanceof Array) {
      for (var i = 0; i < symbol.length; i++) {
        this.j.push([symbol[i], state2]);
      }
      return this;
    }
    this.j.push([symbol, state2]);
    return this;
  },
  next: function next(item) {
    for (var i = 0; i < this.j.length; i++) {
      var jump2 = this.j[i];
      var symbol = jump2[0];
      var state2 = jump2[1];
      if (this.test(item, symbol)) {
        return state2;
      }
    }
    return this.defaultTransition;
  },
  accepts: function accepts() {
    return !!this.T;
  },
  test: function test(item, symbol) {
    return item === symbol;
  },
  emit: function emit() {
    return this.T;
  }
};
var CharacterState = (0, _class$3.inherits)(BaseState, createStateClass(), {
  test: function test2(character, charOrRegExp) {
    return character === charOrRegExp || charOrRegExp instanceof RegExp && charOrRegExp.test(character);
  }
});
var TokenState = (0, _class$3.inherits)(BaseState, createStateClass(), {
  jump: function jump(token) {
    var tClass = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    var state2 = this.next(new token(""));
    if (state2 === this.defaultTransition) {
      state2 = new this.constructor(tClass);
      this.on(token, state2);
    } else if (tClass) {
      state2.T = tClass;
    }
    return state2;
  },
  test: function test3(token, tokenClass) {
    return token instanceof tokenClass;
  }
});
function stateify(str, start2, endToken, defaultToken) {
  var i = 0, len = str.length, state2 = start2, newStates = [], nextState = void 0;
  while (i < len && (nextState = state2.next(str[i]))) {
    state2 = nextState;
    i++;
  }
  if (i >= len) {
    return [];
  }
  while (i < len - 1) {
    nextState = new CharacterState(defaultToken);
    newStates.push(nextState);
    state2.on(str[i], nextState);
    state2 = nextState;
    i++;
  }
  nextState = new CharacterState(endToken);
  newStates.push(nextState);
  state2.on(str[len - 1], nextState);
  return newStates;
}
state.CharacterState = CharacterState;
state.TokenState = TokenState;
state.stateify = stateify;
var text$1 = {};
var createTokenClass$1 = {};
createTokenClass$1.__esModule = true;
function createTokenClass() {
  return function(value) {
    if (value) {
      this.v = value;
    }
  };
}
createTokenClass$1.createTokenClass = createTokenClass;
text$1.__esModule = true;
text$1.AMPERSAND = text$1.CLOSEPAREN = text$1.CLOSEANGLEBRACKET = text$1.CLOSEBRACKET = text$1.CLOSEBRACE = text$1.OPENPAREN = text$1.OPENANGLEBRACKET = text$1.OPENBRACKET = text$1.OPENBRACE = text$1.WS = text$1.TLD = text$1.SYM = text$1.UNDERSCORE = text$1.SLASH = text$1.MAILTO = text$1.PROTOCOL = text$1.QUERY = text$1.POUND = text$1.PLUS = text$1.NUM = text$1.NL = text$1.LOCALHOST = text$1.PUNCTUATION = text$1.DOT = text$1.COLON = text$1.AT = text$1.DOMAIN = text$1.Base = void 0;
var _createTokenClass$1 = createTokenClass$1;
var _class$2 = _class$4;
var TextToken = (0, _createTokenClass$1.createTokenClass)();
TextToken.prototype = {
  toString: function toString() {
    return this.v + "";
  }
};
function inheritsToken(value) {
  var props = value ? { v: value } : {};
  return (0, _class$2.inherits)(TextToken, (0, _createTokenClass$1.createTokenClass)(), props);
}
var DOMAIN = inheritsToken();
var AT = inheritsToken("@");
var COLON = inheritsToken(":");
var DOT = inheritsToken(".");
var PUNCTUATION = inheritsToken();
var LOCALHOST = inheritsToken();
var NL$1 = inheritsToken("\n");
var NUM = inheritsToken();
var PLUS = inheritsToken("+");
var POUND = inheritsToken("#");
var PROTOCOL = inheritsToken();
var MAILTO = inheritsToken("mailto:");
var QUERY = inheritsToken("?");
var SLASH = inheritsToken("/");
var UNDERSCORE = inheritsToken("_");
var SYM = inheritsToken();
var TLD = inheritsToken();
var WS = inheritsToken();
var OPENBRACE = inheritsToken("{");
var OPENBRACKET = inheritsToken("[");
var OPENANGLEBRACKET = inheritsToken("<");
var OPENPAREN = inheritsToken("(");
var CLOSEBRACE = inheritsToken("}");
var CLOSEBRACKET = inheritsToken("]");
var CLOSEANGLEBRACKET = inheritsToken(">");
var CLOSEPAREN = inheritsToken(")");
var AMPERSAND = inheritsToken("&");
text$1.Base = TextToken;
text$1.DOMAIN = DOMAIN;
text$1.AT = AT;
text$1.COLON = COLON;
text$1.DOT = DOT;
text$1.PUNCTUATION = PUNCTUATION;
text$1.LOCALHOST = LOCALHOST;
text$1.NL = NL$1;
text$1.NUM = NUM;
text$1.PLUS = PLUS;
text$1.POUND = POUND;
text$1.QUERY = QUERY;
text$1.PROTOCOL = PROTOCOL;
text$1.MAILTO = MAILTO;
text$1.SLASH = SLASH;
text$1.UNDERSCORE = UNDERSCORE;
text$1.SYM = SYM;
text$1.TLD = TLD;
text$1.WS = WS;
text$1.OPENBRACE = OPENBRACE;
text$1.OPENBRACKET = OPENBRACKET;
text$1.OPENANGLEBRACKET = OPENANGLEBRACKET;
text$1.OPENPAREN = OPENPAREN;
text$1.CLOSEBRACE = CLOSEBRACE;
text$1.CLOSEBRACKET = CLOSEBRACKET;
text$1.CLOSEANGLEBRACKET = CLOSEANGLEBRACKET;
text$1.CLOSEPAREN = CLOSEPAREN;
text$1.AMPERSAND = AMPERSAND;
scanner$1.__esModule = true;
scanner$1.start = scanner$1.run = scanner$1.TOKENS = scanner$1.State = void 0;
var _state$1 = state;
var _text$2 = text$1;
var TOKENS = _interopRequireWildcard$2(_text$2);
function _interopRequireWildcard$2(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}
var tlds = "aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|ac|academy|accenture|accountant|accountants|aco|active|actor|ad|adac|ads|adult|ae|aeg|aero|aetna|af|afamilycompany|afl|africa|ag|agakhan|agency|ai|aig|aigo|airbus|airforce|airtel|akdn|al|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|am|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|ao|aol|apartments|app|apple|aq|aquarelle|ar|arab|aramco|archi|army|arpa|art|arte|as|asda|asia|associates|at|athleta|attorney|au|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aw|aws|ax|axa|az|azure|ba|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bb|bbc|bbt|bbva|bcg|bcn|bd|be|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|blanco|blockbuster|blog|bloomberg|blue|bm|bms|bmw|bn|bnl|bnpparibas|bo|boats|boehringer|bofa|bom|bond|boo|book|booking|boots|bosch|bostik|boston|bot|boutique|box|br|bradesco|bridgestone|broadway|broker|brother|brussels|bs|bt|budapest|bugatti|build|builders|business|buy|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|call|calvinklein|cam|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|cartier|casa|case|caseih|cash|casino|cat|catering|catholic|cba|cbn|cbre|cbs|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|chase|chat|cheap|chintai|chloe|christmas|chrome|chrysler|church|ci|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|ck|cl|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|cr|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|data|date|dating|datsun|day|dclk|dds|de|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dj|dk|dm|dnp|do|docs|doctor|dodge|dog|doha|domains|dot|download|drive|dtv|dubai|duck|dunlop|duns|dupont|durban|dvag|dvr|dz|earth|eat|ec|eco|edeka|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epost|epson|equipment|er|ericsson|erni|es|esq|estate|esurance|et|etisalat|eu|eurovision|eus|events|everbank|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fi|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|fj|fk|flickr|flights|flir|florist|flowers|fly|fm|fo|foo|food|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|fr|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fujixerox|fun|fund|furniture|futbol|fyi|ga|gal|gallery|gallo|gallup|game|games|gap|garden|gb|gbiz|gd|gdn|ge|gea|gent|genting|george|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glade|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn|godaddy|gold|goldpoint|golf|goo|goodhands|goodyear|goog|google|gop|got|gov|gp|gq|gr|grainger|graphics|gratis|green|gripe|grocery|group|gs|gt|gu|guardian|gucci|guge|guide|guitars|guru|gw|gy|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hk|hkt|hm|hn|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|honeywell|horse|hospital|host|hosting|hot|hoteles|hotels|hotmail|house|how|hr|hsbc|ht|htc|hu|hughes|hyatt|hyundai|ibm|icbc|ice|icu|id|ie|ieee|ifm|ikano|il|im|imamat|imdb|immo|immobilien|in|industries|infiniti|info|ing|ink|institute|insurance|insure|int|intel|international|intuit|investments|io|ipiranga|iq|ir|irish|is|iselect|ismaili|ist|istanbul|it|itau|itv|iveco|iwc|jaguar|java|jcb|jcp|je|jeep|jetzt|jewelry|jio|jlc|jll|jm|jmp|jnj|jo|jobs|joburg|jot|joy|jp|jpmorgan|jprs|juegos|juniper|kaufen|kddi|ke|kerryhotels|kerrylogistics|kerryproperties|kfh|kg|kh|ki|kia|kim|kinder|kindle|kitchen|kiwi|km|kn|koeln|komatsu|kosher|kp|kpmg|kpn|kr|krd|kred|kuokgroup|kw|ky|kyoto|kz|la|lacaixa|ladbrokes|lamborghini|lamer|lancaster|lancia|lancome|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|li|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lixil|lk|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|lr|ls|lt|ltd|ltda|lu|lundbeck|lupin|luxe|luxury|lv|ly|ma|macys|madrid|maif|maison|makeup|man|management|mango|map|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mc|mckinsey|md|me|med|media|meet|melbourne|meme|memorial|men|menu|meo|merckmsd|metlife|mg|mh|miami|microsoft|mil|mini|mint|mit|mitsubishi|mk|ml|mlb|mls|mm|mma|mn|mo|mobi|mobile|mobily|moda|moe|moi|mom|monash|money|monster|mopar|mormon|mortgage|moscow|moto|motorcycles|mov|movie|movistar|mp|mq|mr|ms|msd|mt|mtn|mtr|mu|museum|mutual|mv|mw|mx|my|mz|na|nab|nadex|nagoya|name|nationwide|natura|navy|nba|nc|ne|nec|net|netbank|netflix|network|neustar|new|newholland|news|next|nextdirect|nexus|nf|nfl|ng|ngo|nhk|ni|nico|nike|nikon|ninja|nissan|nissay|nl|no|nokia|northwesternmutual|norton|now|nowruz|nowtv|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|observer|off|office|okinawa|olayan|olayangroup|oldnavy|ollo|om|omega|one|ong|onl|online|onyourside|ooo|open|oracle|orange|org|organic|origins|osaka|otsuka|ott|ovh|pa|page|panasonic|panerai|paris|pars|partners|parts|party|passagens|pay|pccw|pe|pet|pf|pfizer|pg|ph|pharmacy|phd|philips|phone|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|pk|pl|place|play|playstation|plumbing|plus|pm|pn|pnc|pohl|poker|politie|porn|post|pr|pramerica|praxi|press|prime|pro|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|ps|pt|pub|pw|pwc|py|qa|qpon|quebec|quest|qvc|racing|radio|raid|re|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|rightathome|ril|rio|rip|rmit|ro|rocher|rocks|rodeo|rogers|room|rs|rsvp|ru|rugby|ruhr|run|rw|rwe|ryukyu|sa|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|save|saxo|sb|sbi|sbs|sc|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scjohnson|scor|scot|sd|se|search|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|sg|sh|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|showtime|shriram|si|silk|sina|singles|site|sj|sk|ski|skin|sky|skype|sl|sling|sm|smart|smile|sn|sncf|so|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|spiegel|spot|spreadbetting|sr|srl|srt|st|stada|staples|star|starhub|statebank|statefarm|statoil|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiftcover|swiss|sx|sy|sydney|symantec|systems|sz|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|tdk|team|tech|technology|tel|telecity|telefonica|temasek|tennis|teva|tf|tg|th|thd|theater|theatre|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tj|tjmaxx|tjx|tk|tkmaxx|tl|tm|tmall|tn|to|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tr|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|trust|trv|tt|tube|tui|tunes|tushu|tv|tvs|tw|tz|ua|ubank|ubs|uconnect|ug|uk|unicom|university|uno|uol|ups|us|uy|uz|va|vacations|vana|vanguard|vc|ve|vegas|ventures|verisign|versicherung|vet|vg|vi|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|vista|vistaprint|viva|vivo|vlaanderen|vn|vodka|volkswagen|volvo|vote|voting|voto|voyage|vu|vuelos|wales|walmart|walter|wang|wanggou|warman|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weibo|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|ws|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--30rr7y|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--3hcrj9c|xn--3oq18vl8pn36a|xn--3pxu8k|xn--42c2d9a|xn--45br5cyl|xn--45brj9c|xn--45q11c|xn--4gbrim|xn--54b7fta0cc|xn--55qw42g|xn--55qx5d|xn--5su34j936bgsg|xn--5tzm5g|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80aqecdr1a|xn--80asehdb|xn--80aswg|xn--8y0a063a|xn--90a3ac|xn--90ae|xn--90ais|xn--9dbq2a|xn--9et52u|xn--9krt00a|xn--b4w605ferd|xn--bck1b9a5dre4c|xn--c1avg|xn--c2br7g|xn--cck2b3b|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czrs0t|xn--czru2d|xn--d1acj3b|xn--d1alf|xn--e1a4c|xn--eckvdtc9d|xn--efvy88h|xn--estv75g|xn--fct429k|xn--fhbei|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fjq720a|xn--flw351e|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--fzys8d69uvgm|xn--g2xx48c|xn--gckr3f0f|xn--gecrj9c|xn--gk3at1e|xn--h2breg3eve|xn--h2brj9c|xn--h2brj9c8c|xn--hxt814e|xn--i1b6b1a6a2e|xn--imr513n|xn--io0a7i|xn--j1aef|xn--j1amh|xn--j6w193g|xn--jlq61u9w7b|xn--jvr189m|xn--kcrx77d1x4a|xn--kprw13d|xn--kpry57d|xn--kpu716f|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a3ejt|xn--mgba3a4f16a|xn--mgba7c0bbn0a|xn--mgbaakc7dvf|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbai9azgqp6j|xn--mgbayh7gpa|xn--mgbb9fbpob|xn--mgbbh1a|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgbca7dzdo|xn--mgberp4a5d4ar|xn--mgbgu82a|xn--mgbi4ecexp|xn--mgbpl2fh|xn--mgbt3dhd|xn--mgbtx2b|xn--mgbx4cd0ab|xn--mix891f|xn--mk1bu44c|xn--mxtq1m|xn--ngbc5azd|xn--ngbe9e0a|xn--ngbrx|xn--node|xn--nqv7f|xn--nqv7fs00ema|xn--nyqy26a|xn--o3cw4h|xn--ogbpf8fl|xn--p1acf|xn--p1ai|xn--pbt977c|xn--pgbs0dh|xn--pssy2u|xn--q9jyb4c|xn--qcka1pmc|xn--qxam|xn--rhqv96g|xn--rovu88b|xn--rvc1e0am3e|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--tckwe|xn--tiq49xqyj|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--vuq861b|xn--w4r85el8fhu5dnra|xn--w4rs40l|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--y9a3aq|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xperia|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye|yodobashi|yoga|yokohama|you|youtube|yt|yun|za|zappos|zara|zero|zip|zippo|zm|zone|zuerich|zw".split("|");
var NUMBERS = "0123456789".split("");
var ALPHANUM = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
var WHITESPACE = [" ", "\f", "\r", "	", "\v", "\xA0", "\u1680", "\u180E"];
var domainStates = [];
var makeState$1 = function makeState(tokenClass) {
  return new _state$1.CharacterState(tokenClass);
};
var S_START$1 = makeState$1();
var S_NUM = makeState$1(_text$2.NUM);
var S_DOMAIN$1 = makeState$1(_text$2.DOMAIN);
var S_DOMAIN_HYPHEN = makeState$1();
var S_WS = makeState$1(_text$2.WS);
S_START$1.on("@", makeState$1(_text$2.AT)).on(".", makeState$1(_text$2.DOT)).on("+", makeState$1(_text$2.PLUS)).on("#", makeState$1(_text$2.POUND)).on("?", makeState$1(_text$2.QUERY)).on("/", makeState$1(_text$2.SLASH)).on("_", makeState$1(_text$2.UNDERSCORE)).on(":", makeState$1(_text$2.COLON)).on("{", makeState$1(_text$2.OPENBRACE)).on("[", makeState$1(_text$2.OPENBRACKET)).on("<", makeState$1(_text$2.OPENANGLEBRACKET)).on("(", makeState$1(_text$2.OPENPAREN)).on("}", makeState$1(_text$2.CLOSEBRACE)).on("]", makeState$1(_text$2.CLOSEBRACKET)).on(">", makeState$1(_text$2.CLOSEANGLEBRACKET)).on(")", makeState$1(_text$2.CLOSEPAREN)).on("&", makeState$1(_text$2.AMPERSAND)).on([",", ";", "!", '"', "'"], makeState$1(_text$2.PUNCTUATION));
S_START$1.on("\n", makeState$1(_text$2.NL)).on(WHITESPACE, S_WS);
S_WS.on(WHITESPACE, S_WS);
for (var i = 0; i < tlds.length; i++) {
  var newStates = (0, _state$1.stateify)(tlds[i], S_START$1, _text$2.TLD, _text$2.DOMAIN);
  domainStates.push.apply(domainStates, newStates);
}
var partialProtocolFileStates = (0, _state$1.stateify)("file", S_START$1, _text$2.DOMAIN, _text$2.DOMAIN);
var partialProtocolFtpStates = (0, _state$1.stateify)("ftp", S_START$1, _text$2.DOMAIN, _text$2.DOMAIN);
var partialProtocolHttpStates = (0, _state$1.stateify)("http", S_START$1, _text$2.DOMAIN, _text$2.DOMAIN);
var partialProtocolMailtoStates = (0, _state$1.stateify)("mailto", S_START$1, _text$2.DOMAIN, _text$2.DOMAIN);
domainStates.push.apply(domainStates, partialProtocolFileStates);
domainStates.push.apply(domainStates, partialProtocolFtpStates);
domainStates.push.apply(domainStates, partialProtocolHttpStates);
domainStates.push.apply(domainStates, partialProtocolMailtoStates);
var S_PROTOCOL_FILE = partialProtocolFileStates.pop();
var S_PROTOCOL_FTP = partialProtocolFtpStates.pop();
var S_PROTOCOL_HTTP = partialProtocolHttpStates.pop();
var S_MAILTO$1 = partialProtocolMailtoStates.pop();
var S_PROTOCOL_SECURE = makeState$1(_text$2.DOMAIN);
var S_FULL_PROTOCOL = makeState$1(_text$2.PROTOCOL);
var S_FULL_MAILTO = makeState$1(_text$2.MAILTO);
S_PROTOCOL_FTP.on("s", S_PROTOCOL_SECURE).on(":", S_FULL_PROTOCOL);
S_PROTOCOL_HTTP.on("s", S_PROTOCOL_SECURE).on(":", S_FULL_PROTOCOL);
domainStates.push(S_PROTOCOL_SECURE);
S_PROTOCOL_FILE.on(":", S_FULL_PROTOCOL);
S_PROTOCOL_SECURE.on(":", S_FULL_PROTOCOL);
S_MAILTO$1.on(":", S_FULL_MAILTO);
var partialLocalhostStates = (0, _state$1.stateify)("localhost", S_START$1, _text$2.LOCALHOST, _text$2.DOMAIN);
domainStates.push.apply(domainStates, partialLocalhostStates);
S_START$1.on(NUMBERS, S_NUM);
S_NUM.on("-", S_DOMAIN_HYPHEN).on(NUMBERS, S_NUM).on(ALPHANUM, S_DOMAIN$1);
S_DOMAIN$1.on("-", S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN$1);
for (var _i = 0; _i < domainStates.length; _i++) {
  domainStates[_i].on("-", S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN$1);
}
S_DOMAIN_HYPHEN.on("-", S_DOMAIN_HYPHEN).on(NUMBERS, S_DOMAIN$1).on(ALPHANUM, S_DOMAIN$1);
S_START$1.defaultTransition = makeState$1(_text$2.SYM);
var run$2 = function run(str) {
  var lowerStr = str.replace(/[A-Z]/g, function(c) {
    return c.toLowerCase();
  });
  var len = str.length;
  var tokens = [];
  var cursor = 0;
  while (cursor < len) {
    var state2 = S_START$1;
    var nextState = null;
    var tokenLength = 0;
    var latestAccepting = null;
    var sinceAccepts = -1;
    while (cursor < len && (nextState = state2.next(lowerStr[cursor]))) {
      state2 = nextState;
      if (state2.accepts()) {
        sinceAccepts = 0;
        latestAccepting = state2;
      } else if (sinceAccepts >= 0) {
        sinceAccepts++;
      }
      tokenLength++;
      cursor++;
    }
    if (sinceAccepts < 0) {
      continue;
    }
    cursor -= sinceAccepts;
    tokenLength -= sinceAccepts;
    var TOKEN = latestAccepting.emit();
    tokens.push(new TOKEN(str.substr(cursor - tokenLength, tokenLength)));
  }
  return tokens;
};
var start = S_START$1;
scanner$1.State = _state$1.CharacterState;
scanner$1.TOKENS = TOKENS;
scanner$1.run = run$2;
scanner$1.start = start;
var parser$1 = {};
var multi = {};
multi.__esModule = true;
multi.URL = multi.TEXT = multi.NL = multi.EMAIL = multi.MAILTOEMAIL = multi.Base = void 0;
var _createTokenClass = createTokenClass$1;
var _class$1 = _class$4;
var _text$1 = text$1;
function isDomainToken(token) {
  return token instanceof _text$1.DOMAIN || token instanceof _text$1.TLD;
}
var MultiToken = (0, _createTokenClass.createTokenClass)();
MultiToken.prototype = {
  type: "token",
  isLink: false,
  toString: function toString2() {
    var result = [];
    for (var i = 0; i < this.v.length; i++) {
      result.push(this.v[i].toString());
    }
    return result.join("");
  },
  toHref: function toHref() {
    return this.toString();
  },
  toObject: function toObject() {
    var protocol = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "http";
    return {
      type: this.type,
      value: this.toString(),
      href: this.toHref(protocol)
    };
  }
};
var MAILTOEMAIL = (0, _class$1.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
  type: "email",
  isLink: true
});
var EMAIL = (0, _class$1.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
  type: "email",
  isLink: true,
  toHref: function toHref2() {
    return "mailto:" + this.toString();
  }
});
var TEXT = (0, _class$1.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), { type: "text" });
var NL = (0, _class$1.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), { type: "nl" });
var URL$1 = (0, _class$1.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
  type: "url",
  isLink: true,
  toHref: function toHref3() {
    var protocol = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "http";
    var hasProtocol2 = false;
    var hasSlashSlash = false;
    var tokens = this.v;
    var result = [];
    var i = 0;
    while (tokens[i] instanceof _text$1.PROTOCOL) {
      hasProtocol2 = true;
      result.push(tokens[i].toString().toLowerCase());
      i++;
    }
    while (tokens[i] instanceof _text$1.SLASH) {
      hasSlashSlash = true;
      result.push(tokens[i].toString());
      i++;
    }
    while (isDomainToken(tokens[i])) {
      result.push(tokens[i].toString().toLowerCase());
      i++;
    }
    for (; i < tokens.length; i++) {
      result.push(tokens[i].toString());
    }
    result = result.join("");
    if (!(hasProtocol2 || hasSlashSlash)) {
      result = protocol + "://" + result;
    }
    return result;
  },
  hasProtocol: function hasProtocol() {
    return this.v[0] instanceof _text$1.PROTOCOL;
  }
});
multi.Base = MultiToken;
multi.MAILTOEMAIL = MAILTOEMAIL;
multi.EMAIL = EMAIL;
multi.NL = NL;
multi.TEXT = TEXT;
multi.URL = URL$1;
parser$1.__esModule = true;
parser$1.start = parser$1.run = parser$1.TOKENS = parser$1.State = void 0;
var _state = state;
var _multi = multi;
var MULTI_TOKENS = _interopRequireWildcard$1(_multi);
var _text = text$1;
function _interopRequireWildcard$1(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}
var makeState2 = function makeState3(tokenClass) {
  return new _state.TokenState(tokenClass);
};
var S_START = makeState2();
var S_PROTOCOL = makeState2();
var S_MAILTO = makeState2();
var S_PROTOCOL_SLASH = makeState2();
var S_PROTOCOL_SLASH_SLASH = makeState2();
var S_DOMAIN = makeState2();
var S_DOMAIN_DOT = makeState2();
var S_TLD = makeState2(_multi.URL);
var S_TLD_COLON = makeState2();
var S_TLD_PORT = makeState2(_multi.URL);
var S_URL = makeState2(_multi.URL);
var S_URL_NON_ACCEPTING = makeState2();
var S_URL_OPENBRACE = makeState2();
var S_URL_OPENBRACKET = makeState2();
var S_URL_OPENANGLEBRACKET = makeState2();
var S_URL_OPENPAREN = makeState2();
var S_URL_OPENBRACE_Q = makeState2(_multi.URL);
var S_URL_OPENBRACKET_Q = makeState2(_multi.URL);
var S_URL_OPENANGLEBRACKET_Q = makeState2(_multi.URL);
var S_URL_OPENPAREN_Q = makeState2(_multi.URL);
var S_URL_OPENBRACE_SYMS = makeState2();
var S_URL_OPENBRACKET_SYMS = makeState2();
var S_URL_OPENANGLEBRACKET_SYMS = makeState2();
var S_URL_OPENPAREN_SYMS = makeState2();
var S_EMAIL_DOMAIN = makeState2();
var S_EMAIL_DOMAIN_DOT = makeState2();
var S_EMAIL = makeState2(_multi.EMAIL);
var S_EMAIL_COLON = makeState2();
var S_EMAIL_PORT = makeState2(_multi.EMAIL);
var S_MAILTO_EMAIL = makeState2(_multi.MAILTOEMAIL);
var S_MAILTO_EMAIL_NON_ACCEPTING = makeState2();
var S_LOCALPART = makeState2();
var S_LOCALPART_AT = makeState2();
var S_LOCALPART_DOT = makeState2();
var S_NL = makeState2(_multi.NL);
S_START.on(_text.NL, S_NL).on(_text.PROTOCOL, S_PROTOCOL).on(_text.MAILTO, S_MAILTO).on(_text.SLASH, S_PROTOCOL_SLASH);
S_PROTOCOL.on(_text.SLASH, S_PROTOCOL_SLASH);
S_PROTOCOL_SLASH.on(_text.SLASH, S_PROTOCOL_SLASH_SLASH);
S_START.on(_text.TLD, S_DOMAIN).on(_text.DOMAIN, S_DOMAIN).on(_text.LOCALHOST, S_TLD).on(_text.NUM, S_DOMAIN);
S_PROTOCOL_SLASH_SLASH.on(_text.TLD, S_URL).on(_text.DOMAIN, S_URL).on(_text.NUM, S_URL).on(_text.LOCALHOST, S_URL);
S_DOMAIN.on(_text.DOT, S_DOMAIN_DOT);
S_EMAIL_DOMAIN.on(_text.DOT, S_EMAIL_DOMAIN_DOT);
S_DOMAIN_DOT.on(_text.TLD, S_TLD).on(_text.DOMAIN, S_DOMAIN).on(_text.NUM, S_DOMAIN).on(_text.LOCALHOST, S_DOMAIN);
S_EMAIL_DOMAIN_DOT.on(_text.TLD, S_EMAIL).on(_text.DOMAIN, S_EMAIL_DOMAIN).on(_text.NUM, S_EMAIL_DOMAIN).on(_text.LOCALHOST, S_EMAIL_DOMAIN);
S_TLD.on(_text.DOT, S_DOMAIN_DOT);
S_EMAIL.on(_text.DOT, S_EMAIL_DOMAIN_DOT);
S_TLD.on(_text.COLON, S_TLD_COLON).on(_text.SLASH, S_URL);
S_TLD_COLON.on(_text.NUM, S_TLD_PORT);
S_TLD_PORT.on(_text.SLASH, S_URL);
S_EMAIL.on(_text.COLON, S_EMAIL_COLON);
S_EMAIL_COLON.on(_text.NUM, S_EMAIL_PORT);
var qsAccepting = [_text.DOMAIN, _text.AT, _text.LOCALHOST, _text.NUM, _text.PLUS, _text.POUND, _text.PROTOCOL, _text.SLASH, _text.TLD, _text.UNDERSCORE, _text.SYM, _text.AMPERSAND];
var qsNonAccepting = [_text.COLON, _text.DOT, _text.QUERY, _text.PUNCTUATION, _text.CLOSEBRACE, _text.CLOSEBRACKET, _text.CLOSEANGLEBRACKET, _text.CLOSEPAREN, _text.OPENBRACE, _text.OPENBRACKET, _text.OPENANGLEBRACKET, _text.OPENPAREN];
S_URL.on(_text.OPENBRACE, S_URL_OPENBRACE).on(_text.OPENBRACKET, S_URL_OPENBRACKET).on(_text.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(_text.OPENPAREN, S_URL_OPENPAREN);
S_URL_NON_ACCEPTING.on(_text.OPENBRACE, S_URL_OPENBRACE).on(_text.OPENBRACKET, S_URL_OPENBRACKET).on(_text.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(_text.OPENPAREN, S_URL_OPENPAREN);
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
S_URL_OPENBRACE.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);
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
S_URL.on(qsAccepting, S_URL);
S_URL_NON_ACCEPTING.on(qsAccepting, S_URL);
S_URL.on(qsNonAccepting, S_URL_NON_ACCEPTING);
S_URL_NON_ACCEPTING.on(qsNonAccepting, S_URL_NON_ACCEPTING);
S_MAILTO.on(_text.TLD, S_MAILTO_EMAIL).on(_text.DOMAIN, S_MAILTO_EMAIL).on(_text.NUM, S_MAILTO_EMAIL).on(_text.LOCALHOST, S_MAILTO_EMAIL);
S_MAILTO_EMAIL.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);
S_MAILTO_EMAIL_NON_ACCEPTING.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);
var localpartAccepting = [_text.DOMAIN, _text.NUM, _text.PLUS, _text.POUND, _text.QUERY, _text.UNDERSCORE, _text.SYM, _text.AMPERSAND, _text.TLD];
S_DOMAIN.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT);
S_TLD.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT);
S_DOMAIN_DOT.on(localpartAccepting, S_LOCALPART);
S_LOCALPART.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT).on(_text.DOT, S_LOCALPART_DOT);
S_LOCALPART_DOT.on(localpartAccepting, S_LOCALPART);
S_LOCALPART_AT.on(_text.TLD, S_EMAIL_DOMAIN).on(_text.DOMAIN, S_EMAIL_DOMAIN).on(_text.LOCALHOST, S_EMAIL);
var run$1 = function run2(tokens) {
  var len = tokens.length;
  var cursor = 0;
  var multis = [];
  var textTokens = [];
  while (cursor < len) {
    var state2 = S_START;
    var secondState = null;
    var nextState = null;
    var multiLength = 0;
    var latestAccepting = null;
    var sinceAccepts = -1;
    while (cursor < len && !(secondState = state2.next(tokens[cursor]))) {
      textTokens.push(tokens[cursor++]);
    }
    while (cursor < len && (nextState = secondState || state2.next(tokens[cursor]))) {
      secondState = null;
      state2 = nextState;
      if (state2.accepts()) {
        sinceAccepts = 0;
        latestAccepting = state2;
      } else if (sinceAccepts >= 0) {
        sinceAccepts++;
      }
      cursor++;
      multiLength++;
    }
    if (sinceAccepts < 0) {
      for (var i = cursor - multiLength; i < cursor; i++) {
        textTokens.push(tokens[i]);
      }
    } else {
      if (textTokens.length > 0) {
        multis.push(new _multi.TEXT(textTokens));
        textTokens = [];
      }
      cursor -= sinceAccepts;
      multiLength -= sinceAccepts;
      var MULTI = latestAccepting.emit();
      multis.push(new MULTI(tokens.slice(cursor - multiLength, cursor)));
    }
  }
  if (textTokens.length > 0) {
    multis.push(new _multi.TEXT(textTokens));
  }
  return multis;
};
parser$1.State = _state.TokenState;
parser$1.TOKENS = MULTI_TOKENS;
parser$1.run = run$1;
parser$1.start = S_START;
linkify.__esModule = true;
linkify.tokenize = linkify.test = linkify.scanner = linkify.parser = linkify.options = linkify.inherits = linkify.find = void 0;
var _class = _class$4;
var _options = options$1;
var options = _interopRequireWildcard(_options);
var _scanner = scanner$1;
var scanner = _interopRequireWildcard(_scanner);
var _parser = parser$1;
var parser = _interopRequireWildcard(_parser);
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
var tokenize = function tokenize2(str) {
  return parser.run(scanner.run(str));
};
var find = function find2(str) {
  var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
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
var test4 = function test5(str) {
  var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  var tokens = tokenize(str);
  return tokens.length === 1 && tokens[0].isLink && (!type || tokens[0].type === type);
};
linkify.find = find;
linkify.inherits = _class.inherits;
linkify.options = options;
linkify.parser = parser;
linkify.scanner = scanner;
linkify.test = test4;
linkify.tokenize = tokenize;
var linkifyjs = linkify;
var formatString$1 = (text2, doLinkify, textFormatting) => {
  const typeMarkdown = {
    bold: textFormatting.bold,
    italic: textFormatting.italic,
    strike: textFormatting.strike,
    underline: textFormatting.underline,
    multilineCode: textFormatting.multilineCode,
    inlineCode: textFormatting.inlineCode
  };
  const pseudoMarkdown = {
    [typeMarkdown.bold]: {
      end: "\\" + typeMarkdown.bold,
      allowed_chars: ".",
      type: "bold"
    },
    [typeMarkdown.italic]: {
      end: typeMarkdown.italic,
      allowed_chars: ".",
      type: "italic"
    },
    [typeMarkdown.strike]: {
      end: typeMarkdown.strike,
      allowed_chars: ".",
      type: "strike"
    },
    [typeMarkdown.underline]: {
      end: typeMarkdown.underline,
      allowed_chars: ".",
      type: "underline"
    },
    [typeMarkdown.multilineCode]: {
      end: typeMarkdown.multilineCode,
      allowed_chars: "(.|\n)",
      type: "multiline-code"
    },
    [typeMarkdown.inlineCode]: {
      end: typeMarkdown.inlineCode,
      allowed_chars: ".",
      type: "inline-code"
    },
    "<usertag>": {
      allowed_chars: ".",
      end: "</usertag>",
      type: "tag"
    }
  };
  const json = compileToJSON(text2, pseudoMarkdown);
  const html = compileToHTML(json, pseudoMarkdown);
  const result = [].concat.apply([], html);
  if (doLinkify)
    linkifyResult(result);
  return result;
};
function compileToJSON(str, pseudoMarkdown) {
  let result = [];
  let minIndexOf = -1;
  let minIndexOfKey = null;
  let links = linkifyjs.find(str);
  let minIndexFromLink = false;
  if (links.length > 0) {
    minIndexOf = str.indexOf(links[0].value);
    minIndexFromLink = true;
  }
  Object.keys(pseudoMarkdown).forEach((startingValue) => {
    const io = str.indexOf(startingValue);
    if (io >= 0 && (minIndexOf < 0 || io < minIndexOf)) {
      minIndexOf = io;
      minIndexOfKey = startingValue;
      minIndexFromLink = false;
    }
  });
  if (minIndexFromLink && minIndexOfKey !== -1) {
    let strLeft = str.substr(0, minIndexOf);
    let strLink = str.substr(minIndexOf, links[0].value.length);
    let strRight = str.substr(minIndexOf + links[0].value.length);
    result.push(strLeft);
    result.push(strLink);
    result = result.concat(compileToJSON(strRight, pseudoMarkdown));
    return result;
  }
  if (minIndexOfKey) {
    let strLeft = str.substr(0, minIndexOf);
    const char = minIndexOfKey;
    let strRight = str.substr(minIndexOf + char.length);
    if (str.replace(/\s/g, "").length === char.length * 2) {
      return [str];
    }
    const match = strRight.match(
      new RegExp(
        "^(" + (pseudoMarkdown[char].allowed_chars || ".") + "*" + (pseudoMarkdown[char].end ? "?" : "") + ")" + (pseudoMarkdown[char].end ? "(" + pseudoMarkdown[char].end + ")" : ""),
        "m"
      )
    );
    if (!match || !match[1]) {
      strLeft = strLeft + char;
      result.push(strLeft);
    } else {
      if (strLeft) {
        result.push(strLeft);
      }
      const object = {
        start: char,
        content: compileToJSON(match[1], pseudoMarkdown),
        end: match[2],
        type: pseudoMarkdown[char].type
      };
      result.push(object);
      strRight = strRight.substr(match[0].length);
    }
    result = result.concat(compileToJSON(strRight, pseudoMarkdown));
    return result;
  } else {
    if (str) {
      return [str];
    } else {
      return [];
    }
  }
}
function compileToHTML(json, pseudoMarkdown) {
  const result = [];
  json.forEach((item) => {
    if (typeof item === "string") {
      result.push({ types: [], value: item });
    } else {
      if (pseudoMarkdown[item.start]) {
        result.push(parseContent(item));
      }
    }
  });
  return result;
}
function parseContent(item) {
  const result = [];
  iterateContent(item, result, []);
  return result;
}
function iterateContent(item, result, types) {
  item.content.forEach((it) => {
    if (typeof it === "string") {
      result.push({
        types: removeDuplicates(types.concat([item.type])),
        value: it
      });
    } else {
      iterateContent(
        it,
        result,
        removeDuplicates([it.type].concat([item.type]).concat(types))
      );
    }
  });
}
function removeDuplicates(items) {
  return [...new Set(items)];
}
function linkifyResult(array) {
  const result = [];
  array.forEach((arr) => {
    const links = linkifyjs.find(arr.value);
    if (links.length) {
      const spaces = arr.value.replace(links[0].value, "");
      result.push({ types: arr.types, value: spaces });
      arr.types = ["url"].concat(arr.types);
      arr.href = links[0].href;
      arr.value = links[0].value;
    }
    result.push(arr);
  });
  return result;
}
const IMAGE_TYPES = ["png", "jpg", "jpeg", "webp", "svg", "gif"];
const VIDEO_TYPES = ["mp4", "video/ogg", "webm", "quicktime"];
const AUDIO_TYPES = ["mp3", "audio/ogg", "wav", "mpeg"];
const _sfc_main$n = {
  name: "FormatMessage",
  components: { SvgIcon },
  props: {
    messageId: { type: String, default: "" },
    roomId: { type: String, default: "" },
    roomList: { type: Boolean, default: false },
    content: { type: [String, Number], required: true },
    deleted: { type: Boolean, default: false },
    users: { type: Array, default: () => [] },
    linkify: { type: Boolean, default: true },
    singleLine: { type: Boolean, default: false },
    reply: { type: Boolean, default: false },
    textFormatting: { type: Object, required: true },
    textMessages: { type: Object, default: () => {
    } },
    linkOptions: { type: Object, required: true }
  },
  emits: ["open-user-tag"],
  computed: {
    linkifiedMessage() {
      if (this.deleted) {
        return [{ value: this.textMessages.MESSAGE_DELETED }];
      }
      const message = formatString$1(
        this.formatTags(this.content),
        this.linkify && !this.linkOptions.disabled,
        this.textFormatting
      );
      message.forEach((m) => {
        m.url = this.checkType(m, "url");
        m.bold = this.checkType(m, "bold");
        m.italic = this.checkType(m, "italic");
        m.strike = this.checkType(m, "strike");
        m.underline = this.checkType(m, "underline");
        m.inline = this.checkType(m, "inline-code");
        m.multiline = this.checkType(m, "multiline-code");
        m.tag = this.checkType(m, "tag");
        m.image = this.checkImageType(m);
        m.value = this.replaceEmojiByElement(m.value);
      });
      return message;
    },
    formattedContent() {
      if (this.deleted) {
        return this.textMessages.MESSAGE_DELETED;
      } else {
        return this.formatTags(this.content);
      }
    }
  },
  methods: {
    checkType(message, type) {
      return message.types && message.types.indexOf(type) !== -1;
    },
    checkImageType(message) {
      let index = message.value.lastIndexOf(".");
      const slashIndex = message.value.lastIndexOf("/");
      if (slashIndex > index)
        index = -1;
      const type = message.value.substring(index + 1, message.value.length);
      const isMedia = index > 0 && IMAGE_TYPES.some((t) => type.toLowerCase().includes(t));
      if (isMedia)
        this.setImageSize(message);
      return isMedia;
    },
    setImageSize(message) {
      const image = new Image();
      image.src = message.value;
      image.addEventListener("load", onLoad);
      function onLoad(img) {
        const ratio = img.path[0].width / 150;
        message.height = Math.round(img.path[0].height / ratio) + "px";
        image.removeEventListener("load", onLoad);
      }
    },
    formatTags(content) {
      const firstTag = "<usertag>";
      const secondTag = "</usertag>";
      const usertags = [...content.matchAll(new RegExp(firstTag, "gi"))].map(
        (a) => a.index
      );
      const initialContent = content;
      usertags.forEach((index) => {
        const userId = initialContent.substring(
          index + firstTag.length,
          initialContent.indexOf(secondTag, index)
        );
        const user = this.users.find((user2) => user2._id === userId);
        content = content.replaceAll(userId, `@${(user == null ? void 0 : user.username) || "unknown"}`);
      });
      return content;
    },
    openTag(message) {
      if (!this.singleLine && this.checkType(message, "tag")) {
        const user = this.users.find(
          (u) => message.value.indexOf(u.username) !== -1
        );
        this.$emit("open-user-tag", user);
      }
    },
    replaceEmojiByElement(value) {
      let emojiSize;
      if (this.singleLine) {
        emojiSize = 16;
      } else {
        const onlyEmojis = this.containsOnlyEmojis();
        emojiSize = onlyEmojis ? 28 : 20;
      }
      return value.replaceAll(
        /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu,
        (v) => {
          return `<span style="font-size: ${emojiSize}px">${v}</span>`;
        }
      );
    },
    containsOnlyEmojis() {
      const onlyEmojis = this.content.replace(
        new RegExp("[\0-\u1EEFf]", "g"),
        ""
      );
      const visibleChars = this.content.replace(
        new RegExp("[\n\rs]+|( )+", "g"),
        ""
      );
      return onlyEmojis.length === visibleChars.length;
    }
  }
};
const _hoisted_1$n = { class: "vac-image-link-container" };
const _hoisted_2$j = { class: "vac-image-link-message" };
const _hoisted_3$h = ["innerHTML"];
const _hoisted_4$g = ["innerHTML"];
function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vac-format-message-wrapper", { "vac-text-ellipsis": $props.singleLine }])
  }, [
    !$props.textFormatting.disabled ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass({ "vac-text-ellipsis": $props.singleLine })
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.linkifiedMessage, (message, i) => {
        return openBlock(), createElementBlock("div", {
          key: i,
          class: "vac-format-container"
        }, [
          (openBlock(), createBlock(resolveDynamicComponent(message.url ? "a" : "span"), {
            class: normalizeClass({
              "vac-text-ellipsis": $props.singleLine,
              "vac-text-bold": message.bold,
              "vac-text-italic": $props.deleted || message.italic,
              "vac-text-strike": message.strike,
              "vac-text-underline": message.underline,
              "vac-text-inline-code": !$props.singleLine && message.inline,
              "vac-text-multiline-code": !$props.singleLine && message.multiline,
              "vac-text-tag": !$props.singleLine && !$props.reply && message.tag
            }),
            href: message.href,
            target: message.href ? $props.linkOptions.target : null,
            rel: message.href ? $props.linkOptions.rel : null,
            onClick: ($event) => $options.openTag(message)
          }, {
            default: withCtx(() => [
              $props.deleted ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                renderSlot(
                  _ctx.$slots,
                  $props.roomList ? "deleted-icon-room_" + $props.roomId : "deleted-icon_" + $props.messageId,
                  {},
                  () => [
                    createVNode(_component_svg_icon, {
                      name: "deleted",
                      class: normalizeClass(["vac-icon-deleted", { "vac-icon-deleted-room": $props.roomList }])
                    }, null, 8, ["class"])
                  ]
                ),
                createTextVNode(" " + toDisplayString($props.textMessages.MESSAGE_DELETED), 1)
              ], 64)) : message.url && message.image ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createBaseVNode("div", _hoisted_1$n, [
                  createBaseVNode("div", {
                    class: "vac-image-link",
                    style: normalizeStyle({
                      "background-image": `url('${message.value}')`,
                      height: message.height
                    })
                  }, null, 4)
                ]),
                createBaseVNode("div", _hoisted_2$j, [
                  createBaseVNode("span", null, toDisplayString(message.value), 1)
                ])
              ], 64)) : (openBlock(), createElementBlock("span", {
                key: 2,
                innerHTML: message.value
              }, null, 8, _hoisted_3$h))
            ]),
            _: 2
          }, 1032, ["class", "href", "target", "rel", "onClick"]))
        ]);
      }), 128))
    ], 2)) : (openBlock(), createElementBlock("div", {
      key: 1,
      innerHTML: $options.formattedContent
    }, null, 8, _hoisted_4$g))
  ], 2);
}
var FormatMessage = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m]]);
const HANDLERS_PROPERTY = "__v-click-outside";
const HAS_WINDOWS = typeof window !== "undefined";
const HAS_NAVIGATOR = typeof navigator !== "undefined";
const IS_TOUCH = HAS_WINDOWS && ("ontouchstart" in window || HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0);
const EVENTS = IS_TOUCH ? ["touchstart"] : ["click"];
const processDirectiveArguments = (bindingValue) => {
  const isFunction2 = typeof bindingValue === "function";
  if (!isFunction2 && typeof bindingValue !== "object") {
    throw new Error(
      "v-click-outside: Binding value must be a function or an object"
    );
  }
  return {
    handler: isFunction2 ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || ((item) => item),
    events: bindingValue.events || EVENTS,
    isActive: !(bindingValue.isActive === false),
    detectIframe: !(bindingValue.detectIframe === false),
    capture: Boolean(bindingValue.capture)
  };
};
const execHandler = ({ event, handler, middleware }) => {
  if (middleware(event)) {
    handler(event);
  }
};
const onFauxIframeClick = ({ el, event, handler, middleware }) => {
  setTimeout(() => {
    const { activeElement } = document;
    if (activeElement && activeElement.tagName === "IFRAME" && !el.contains(activeElement)) {
      execHandler({ event, handler, middleware });
    }
  }, 0);
};
const onEvent = ({ el, event, handler, middleware }) => {
  const path = event.path || event.composedPath && event.composedPath();
  const isClickOutside = path ? path.indexOf(el) < 0 : !el.contains(event.target);
  if (!isClickOutside) {
    return;
  }
  execHandler({ event, handler, middleware });
};
const beforeMount = (el, { value }) => {
  const {
    events,
    handler,
    middleware,
    isActive,
    detectIframe,
    capture
  } = processDirectiveArguments(value);
  if (!isActive) {
    return;
  }
  el[HANDLERS_PROPERTY] = events.map((eventName) => ({
    event: eventName,
    srcTarget: document.documentElement,
    handler: (event) => onEvent({ el, event, handler, middleware }),
    capture
  }));
  if (detectIframe) {
    const detectIframeEvent = {
      event: "blur",
      srcTarget: window,
      handler: (event) => onFauxIframeClick({ el, event, handler, middleware }),
      capture
    };
    el[HANDLERS_PROPERTY] = [...el[HANDLERS_PROPERTY], detectIframeEvent];
  }
  el[HANDLERS_PROPERTY].forEach(
    ({ event, srcTarget, handler: thisHandler }) => setTimeout(() => {
      if (!el[HANDLERS_PROPERTY]) {
        return;
      }
      srcTarget.addEventListener(event, thisHandler, capture);
    }, 0)
  );
};
const unmounted = (el) => {
  const handlers = el[HANDLERS_PROPERTY] || [];
  handlers.forEach(
    ({ event, srcTarget, handler, capture }) => srcTarget.removeEventListener(event, handler, capture)
  );
  delete el[HANDLERS_PROPERTY];
};
const updated = (el, { value, oldValue }) => {
  if (JSON.stringify(value) === JSON.stringify(oldValue)) {
    return;
  }
  unmounted(el);
  beforeMount(el, { value });
};
const directive = {
  beforeMount,
  updated,
  unmounted
};
var vClickOutside = HAS_WINDOWS ? directive : {};
var typingText = (room, currentUserId, textMessages) => {
  if (room.typingUsers && room.typingUsers.length) {
    const typingUsers = room.users.filter((user) => {
      if (user._id === currentUserId)
        return;
      if (room.typingUsers.indexOf(user._id) === -1)
        return;
      if (user.status && user.status.state === "offline")
        return;
      return true;
    });
    if (!typingUsers.length)
      return;
    if (room.users.length === 2) {
      return textMessages.IS_TYPING;
    } else {
      return typingUsers.map((user) => user.username).join(", ") + " " + textMessages.IS_TYPING;
    }
  }
};
function checkMediaType(types, file) {
  if (!file || !file.type)
    return;
  return types.some((t) => file.type.toLowerCase().includes(t));
}
function isImageFile(file) {
  return checkMediaType(IMAGE_TYPES, file);
}
function isVideoFile(file) {
  var _a;
  return !((_a = file.type) == null ? void 0 : _a.toLowerCase().startsWith("audio/")) && checkMediaType(VIDEO_TYPES, file);
}
function isImageVideoFile(file) {
  return checkMediaType(IMAGE_TYPES, file) || checkMediaType(VIDEO_TYPES, file);
}
function isAudioFile(file) {
  var _a;
  return ((_a = file == null ? void 0 : file.type) == null ? void 0 : _a.toLowerCase().startsWith("audio/")) || checkMediaType(AUDIO_TYPES, file);
}
const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return validate && !validateIconName(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIconName(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate && !validateIconName(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIconName = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
};
const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
const defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data2, names) {
  const icons = data2.icons;
  const aliases = data2.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve3(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve3(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve3);
  return resolved;
}
function internalGetIconData(data2, name, tree) {
  const icons = data2.icons;
  const aliases = data2.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse(name);
  tree.forEach(parse);
  return mergeIconData(data2, currentProps);
}
function parseIconSet(data2, callback) {
  const names = [];
  if (typeof data2 !== "object" || typeof data2.icons !== "object") {
    return names;
  }
  if (data2.not_found instanceof Array) {
    data2.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const tree = getIconsTree(data2);
  for (const name in tree) {
    const item = tree[name];
    if (item) {
      callback(name, internalGetIconData(data2, name, item));
      names.push(name);
    }
  }
  return names;
}
const optionalPropertyDefaults = {
  provider: "",
  aliases: {},
  not_found: {},
  ...defaultIconDimensions
};
function checkOptionalProps(item, defaults2) {
  for (const prop in defaults2) {
    if (prop in item && typeof item[prop] !== typeof defaults2[prop]) {
      return false;
    }
  }
  return true;
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data2 = obj;
  if (typeof data2.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
    return null;
  }
  const icons = data2.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  const aliases = data2.aliases || /* @__PURE__ */ Object.create(null);
  for (const name in aliases) {
    const icon = aliases[name];
    const parent = icon.parent;
    if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  return data2;
}
const dataStorage = /* @__PURE__ */ Object.create(null);
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider, prefix) {
  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
function addIconSet(storage2, data2) {
  if (!quicklyValidateIconSet(data2)) {
    return [];
  }
  return parseIconSet(data2, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing.add(name);
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = { ...icon };
      return true;
    }
  } catch (err) {
  }
  return false;
}
let simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  if (icon) {
    const storage2 = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
  }
}
function addIcon(name, data2) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data2);
}
function addCollection(data2, provider) {
  if (typeof data2 !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = data2.provider || "";
  }
  if (simpleNames && !provider && !data2.prefix) {
    let added = false;
    if (quicklyValidateIconSet(data2)) {
      data2.prefix = "";
      parseIconSet(data2, (name, icon) => {
        if (icon && addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  const prefix = data2.prefix;
  if (!validateIconName({
    provider,
    prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, prefix);
  return !!addIconSet(storage2, data2);
}
const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  ...defaultIconSizeCustomisations,
  ...defaultIconTransformations
});
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size2, ratio, precision) {
  if (ratio === 1) {
    return size2;
  }
  precision = precision || 100;
  if (typeof size2 === "number") {
    return Math.ceil(size2 * ratio * precision) / precision;
  }
  if (typeof size2 !== "string") {
    return size2;
  }
  const oldParts = size2.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size2;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  attributes.viewBox = box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString();
  return {
    attributes,
    body
  };
}
const regex = /\sid="(\S+)"/g;
const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
let counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(
      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
      "$1" + newID + suffix + "$3"
    );
  });
  body = body.replace(new RegExp(suffix, "g"), "");
  return body;
}
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    resources,
    path: source.path || "/",
    maxURL: source.maxURL || 500,
    rotate: source.rotate || 750,
    timeout: source.timeout || 5e3,
    random: source.random === true,
    index: source.index || 0,
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
const configStorage = /* @__PURE__ */ Object.create(null);
const fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
const fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider] = config;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
const detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
};
let fetchModule = detectFetch();
function calculateMaxLength(provider, prefix) {
  const config = getAPIConfig(provider);
  if (!config) {
    return 0;
  }
  let result;
  if (!config.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = prefix + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider, prefix, icons) => {
  const results = [];
  const maxLength = calculateMaxLength(provider, prefix);
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index) => {
    length += name.length + 1;
    if (length >= maxLength && index > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    const config = getAPIConfig(provider);
    if (config) {
      return config.path;
    }
  }
  return "/";
}
const send = (host, params, callback) => {
  if (!fetchModule) {
    callback("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      const urlParams = new URLSearchParams({
        icons: iconsList
      });
      path += prefix + ".json?" + urlParams.toString();
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data2) => {
    if (typeof data2 !== "object" || data2 === null) {
      setTimeout(() => {
        if (data2 === 404) {
          callback("abort", data2);
        } else {
          callback("next", defaultError);
        }
      });
      return;
    }
    setTimeout(() => {
      callback("success", data2);
    });
  }).catch(() => {
    callback("next", defaultError);
  });
};
const fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    if (a.prefix !== b.prefix) {
      return a.prefix.localeCompare(b.prefix);
    }
    return a.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
    const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
    let list;
    if (name in localStorage.icons) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing.has(name)) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix,
      name
    };
    list.push(item);
  });
  return result;
}
function removeCallback(storages, id) {
  storages.forEach((storage2) => {
    const items = storage2.loaderCallbacks;
    if (items) {
      storage2.loaderCallbacks = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(storage2) {
  if (!storage2.pendingCallbacksFlag) {
    storage2.pendingCallbacksFlag = true;
    setTimeout(() => {
      storage2.pendingCallbacksFlag = false;
      const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
      if (!items.length) {
        return;
      }
      let hasPending = false;
      const provider = storage2.provider;
      const prefix = storage2.prefix;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name]) {
            icons.loaded.push({
              provider,
              prefix,
              name
            });
          } else if (storage2.missing.has(name)) {
            icons.missing.push({
              provider,
              prefix,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([storage2], item.id);
          }
          item.callback(
            icons.loaded.slice(0),
            icons.missing.slice(0),
            icons.pending.slice(0),
            item.abort
          );
        }
      });
    });
  }
}
let idCounter = 0;
function storeCallback(callback, icons, pendingSources) {
  const id = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((storage2) => {
    (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
    if (icon) {
      result.push(icon);
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config, payload, query, done) {
  const resourcesCount = config.resources.length;
  const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
  let resources;
  if (config.random) {
    let list = config.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue2 = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue2.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue2 = [];
  }
  function subscribe(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue2.length,
      subscribe,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue2.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue2 = [];
  }
  function moduleResponse(item, response, data2) {
    const isError = response !== "success";
    queue2 = queue2.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data2;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data2;
      if (!queue2.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config.random) {
      const index = config.resources.indexOf(item.resource);
      if (index !== -1 && index !== config.index) {
        config.index = index;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data2);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue2.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data2) => {
        moduleResponse(item, status2, data2);
      }
    };
    queue2.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function initRedundancy(cfg) {
  const config = {
    ...defaultConfig,
    ...cfg
  };
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(
      config,
      payload,
      queryCallback,
      (data2, error) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data2, error);
        }
      }
    );
    queries.push(query2);
    return query2;
  }
  function find3(callback) {
    return queries.find((value) => {
      return callback(value);
    }) || null;
  }
  const instance2 = {
    query,
    find: find3,
    setIndex: (index) => {
      config.index = index;
    },
    getIndex: () => config.index,
    cleanup
  };
  return instance2;
}
function emptyCallback$1() {
}
const redundancyCache = /* @__PURE__ */ Object.create(null);
function getRedundancyCache(provider) {
  if (!redundancyCache[provider]) {
    const config = getAPIConfig(provider);
    if (!config) {
      return;
    }
    const redundancy = initRedundancy(config);
    const cachedReundancy = {
      config,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config = createAPIConfig(target);
    if (config) {
      redundancy = initRedundancy(config);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
const browserCacheVersion = "iconify2";
const browserCachePrefix = "iconify";
const browserCacheCountKey = browserCachePrefix + "-count";
const browserCacheVersionKey = browserCachePrefix + "-version";
const browserStorageHour = 36e5;
const browserStorageCacheExpiration = 168;
function getStoredItem(func, key) {
  try {
    return func.getItem(key);
  } catch (err) {
  }
}
function setStoredItem(func, key, value) {
  try {
    func.setItem(key, value);
    return true;
  } catch (err) {
  }
}
function removeStoredItem(func, key) {
  try {
    func.removeItem(key);
  } catch (err) {
  }
}
function setBrowserStorageItemsCount(storage2, value) {
  return setStoredItem(storage2, browserCacheCountKey, value.toString());
}
function getBrowserStorageItemsCount(storage2) {
  return parseInt(getStoredItem(storage2, browserCacheCountKey)) || 0;
}
const browserStorageConfig = {
  local: true,
  session: true
};
const browserStorageEmptyItems = {
  local: /* @__PURE__ */ new Set(),
  session: /* @__PURE__ */ new Set()
};
let browserStorageStatus = false;
function setBrowserStorageStatus(status) {
  browserStorageStatus = status;
}
let _window = typeof window === "undefined" ? {} : window;
function getBrowserStorage(key) {
  const attr2 = key + "Storage";
  try {
    if (_window && _window[attr2] && typeof _window[attr2].length === "number") {
      return _window[attr2];
    }
  } catch (err) {
  }
  browserStorageConfig[key] = false;
}
function iterateBrowserStorage(key, callback) {
  const func = getBrowserStorage(key);
  if (!func) {
    return;
  }
  const version2 = getStoredItem(func, browserCacheVersionKey);
  if (version2 !== browserCacheVersion) {
    if (version2) {
      const total2 = getBrowserStorageItemsCount(func);
      for (let i = 0; i < total2; i++) {
        removeStoredItem(func, browserCachePrefix + i.toString());
      }
    }
    setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
    setBrowserStorageItemsCount(func, 0);
    return;
  }
  const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
  const parseItem = (index) => {
    const name = browserCachePrefix + index.toString();
    const item = getStoredItem(func, name);
    if (typeof item !== "string") {
      return;
    }
    try {
      const data2 = JSON.parse(item);
      if (typeof data2 === "object" && typeof data2.cached === "number" && data2.cached > minTime && typeof data2.provider === "string" && typeof data2.data === "object" && typeof data2.data.prefix === "string" && callback(data2, index)) {
        return true;
      }
    } catch (err) {
    }
    removeStoredItem(func, name);
  };
  let total = getBrowserStorageItemsCount(func);
  for (let i = total - 1; i >= 0; i--) {
    if (!parseItem(i)) {
      if (i === total - 1) {
        total--;
        setBrowserStorageItemsCount(func, total);
      } else {
        browserStorageEmptyItems[key].add(i);
      }
    }
  }
}
function initBrowserStorage() {
  if (browserStorageStatus) {
    return;
  }
  setBrowserStorageStatus(true);
  for (const key in browserStorageConfig) {
    iterateBrowserStorage(key, (item) => {
      const iconSet = item.data;
      const provider = item.provider;
      const prefix = iconSet.prefix;
      const storage2 = getStorage(
        provider,
        prefix
      );
      if (!addIconSet(storage2, iconSet).length) {
        return false;
      }
      const lastModified = iconSet.lastModified || -1;
      storage2.lastModifiedCached = storage2.lastModifiedCached ? Math.min(storage2.lastModifiedCached, lastModified) : lastModified;
      return true;
    });
  }
}
function updateLastModified(storage2, lastModified) {
  const lastValue = storage2.lastModifiedCached;
  if (lastValue && lastValue >= lastModified) {
    return lastValue === lastModified;
  }
  storage2.lastModifiedCached = lastModified;
  if (lastValue) {
    for (const key in browserStorageConfig) {
      iterateBrowserStorage(key, (item) => {
        const iconSet = item.data;
        return item.provider !== storage2.provider || iconSet.prefix !== storage2.prefix || iconSet.lastModified === lastModified;
      });
    }
  }
  return true;
}
function storeInBrowserStorage(storage2, data2) {
  if (!browserStorageStatus) {
    initBrowserStorage();
  }
  function store(key) {
    let func;
    if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
      return;
    }
    const set2 = browserStorageEmptyItems[key];
    let index;
    if (set2.size) {
      set2.delete(index = Array.from(set2).shift());
    } else {
      index = getBrowserStorageItemsCount(func);
      if (!setBrowserStorageItemsCount(func, index + 1)) {
        return;
      }
    }
    const item = {
      cached: Math.floor(Date.now() / browserStorageHour),
      provider: storage2.provider,
      data: data2
    };
    return setStoredItem(
      func,
      browserCachePrefix + index.toString(),
      JSON.stringify(item)
    );
  }
  if (data2.lastModified && !updateLastModified(storage2, data2.lastModified)) {
    return;
  }
  if (!Object.keys(data2.icons).length) {
    return;
  }
  if (data2.not_found) {
    data2 = Object.assign({}, data2);
    delete data2.not_found;
  }
  if (!store("local")) {
    store("session");
  }
}
function emptyCallback() {
}
function loadedNewIcons(storage2) {
  if (!storage2.iconsLoaderFlag) {
    storage2.iconsLoaderFlag = true;
    setTimeout(() => {
      storage2.iconsLoaderFlag = false;
      updateCallbacks(storage2);
    });
  }
}
function loadNewIcons(storage2, icons) {
  if (!storage2.iconsToLoad) {
    storage2.iconsToLoad = icons;
  } else {
    storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
  }
  if (!storage2.iconsQueueFlag) {
    storage2.iconsQueueFlag = true;
    setTimeout(() => {
      storage2.iconsQueueFlag = false;
      const { provider, prefix } = storage2;
      const icons2 = storage2.iconsToLoad;
      delete storage2.iconsToLoad;
      let api;
      if (!icons2 || !(api = getAPIModule(provider))) {
        return;
      }
      const params = api.prepare(provider, prefix, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data2) => {
          if (typeof data2 !== "object") {
            item.icons.forEach((name) => {
              storage2.missing.add(name);
            });
          } else {
            try {
              const parsed = addIconSet(
                storage2,
                data2
              );
              if (!parsed.length) {
                return;
              }
              const pending = storage2.pendingIcons;
              if (pending) {
                parsed.forEach((name) => {
                  pending.delete(name);
                });
              }
              storeInBrowserStorage(storage2, data2);
            } catch (err) {
              console.error(err);
            }
          }
          loadedNewIcons(storage2);
        });
      });
    });
  }
}
const loadIcons = (icons, callback) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback) {
      setTimeout(() => {
        if (callCallback) {
          callback(
            sortedIcons.loaded,
            sortedIcons.missing,
            sortedIcons.pending,
            emptyCallback
          );
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = /* @__PURE__ */ Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix } = icon;
    if (prefix === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix;
    sources.push(getStorage(provider, prefix));
    const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
    if (!providerNewIcons[prefix]) {
      providerNewIcons[prefix] = [];
    }
  });
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix, name } = icon;
    const storage2 = getStorage(provider, prefix);
    const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
    if (!pendingQueue.has(name)) {
      pendingQueue.add(name);
      newIcons[provider][prefix].push(name);
    }
  });
  sources.forEach((storage2) => {
    const { provider, prefix } = storage2;
    if (newIcons[provider][prefix].length) {
      loadNewIcons(storage2, newIcons[provider][prefix]);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
function mergeCustomisations(defaults2, item) {
  const result = {
    ...defaults2
  };
  for (const key in item) {
    const value = item[key];
    const valueType = typeof value;
    if (key in defaultIconSizeCustomisations) {
      if (value === null || value && (valueType === "string" || valueType === "number")) {
        result[key] = value;
      }
    } else if (valueType === typeof result[key]) {
      result[key] = key === "rotate" ? value % 4 : value;
    }
  }
  return result;
}
const separator = /[\s,]+/;
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
function iconToHTML(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr2 in attributes) {
    renderAttribsHTML += " " + attr2 + '="' + attributes[attr2] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}
function encodeSVGforURL(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function svgToURL(svg) {
  return 'url("data:image/svg+xml,' + encodeSVGforURL(svg) + '")';
}
const defaultExtendedIconCustomisations = {
  ...defaultIconCustomisations,
  inline: false
};
const svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
const commonProps = {
  display: "inline-block"
};
const monotoneProps = {
  backgroundColor: "currentColor"
};
const coloredProps = {
  backgroundColor: "transparent"
};
const propsToAdd = {
  Image: "var(--svg)",
  Repeat: "no-repeat",
  Size: "100% 100%"
};
const propsToAddTo = {
  webkitMask: monotoneProps,
  mask: monotoneProps,
  background: coloredProps
};
for (const prefix in propsToAddTo) {
  const list = propsToAddTo[prefix];
  for (const prop in propsToAdd) {
    list[prefix + prop] = propsToAdd[prop];
  }
}
const customisationAliases = {};
["horizontal", "vertical"].forEach((prefix) => {
  const attr2 = prefix.slice(0, 1) + "Flip";
  customisationAliases[prefix + "-flip"] = attr2;
  customisationAliases[prefix.slice(0, 1) + "-flip"] = attr2;
  customisationAliases[prefix + "Flip"] = attr2;
});
function fixSize(value) {
  return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
const render = (icon, props) => {
  const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
  const componentProps = { ...svgDefaults };
  const mode = props.mode || "svg";
  const style = {};
  const propsStyle = props.style;
  const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
  for (let key in props) {
    const value = props[key];
    if (value === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
      case "mode":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "color":
        style.color = value;
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default: {
        const alias = customisationAliases[key];
        if (alias) {
          if (value === true || value === "true" || value === 1) {
            customisations[alias] = true;
          }
        } else if (defaultExtendedIconCustomisations[key] === void 0) {
          componentProps[key] = value;
        }
      }
    }
  }
  const item = iconToSVG(icon, customisations);
  const renderAttribs = item.attributes;
  if (customisations.inline) {
    style.verticalAlign = "-0.125em";
  }
  if (mode === "svg") {
    componentProps.style = {
      ...style,
      ...customStyle
    };
    Object.assign(componentProps, renderAttribs);
    let localCounter = 0;
    let id = props.id;
    if (typeof id === "string") {
      id = id.replace(/-/g, "_");
    }
    componentProps["innerHTML"] = replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifyVue");
    return h("svg", componentProps);
  }
  const { body, width, height } = icon;
  const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
  const html = iconToHTML(body, {
    ...renderAttribs,
    width: width + "",
    height: height + ""
  });
  componentProps.style = {
    ...style,
    "--svg": svgToURL(html),
    "width": fixSize(renderAttribs.width),
    "height": fixSize(renderAttribs.height),
    ...commonProps,
    ...useMask ? monotoneProps : coloredProps,
    ...customStyle
  };
  return h("span", componentProps);
};
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  initBrowserStorage();
  const _window2 = window;
  if (_window2.IconifyPreload !== void 0) {
    const preload = _window2.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (typeof item !== "object" || item === null || item instanceof Array || typeof item.icons !== "object" || typeof item.prefix !== "string" || !addCollection(item)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      });
    }
  }
  if (_window2.IconifyProviders !== void 0) {
    const providers = _window2.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      }
    }
  }
}
const emptyIcon = {
  ...defaultIconProps,
  body: ""
};
const Icon = defineComponent({
  inheritAttrs: false,
  data() {
    return {
      iconMounted: false,
      counter: 0
    };
  },
  mounted() {
    this._name = "";
    this._loadingIcon = null;
    this.iconMounted = true;
  },
  unmounted() {
    this.abortLoading();
  },
  methods: {
    abortLoading() {
      if (this._loadingIcon) {
        this._loadingIcon.abort();
        this._loadingIcon = null;
      }
    },
    getIcon(icon, onload) {
      if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
        this._name = "";
        this.abortLoading();
        return {
          data: icon
        };
      }
      let iconName;
      if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
        this.abortLoading();
        return null;
      }
      const data2 = getIconData(iconName);
      if (!data2) {
        if (!this._loadingIcon || this._loadingIcon.name !== icon) {
          this.abortLoading();
          this._name = "";
          if (data2 !== null) {
            this._loadingIcon = {
              name: icon,
              abort: loadIcons([iconName], () => {
                this.counter++;
              })
            };
          }
        }
        return null;
      }
      this.abortLoading();
      if (this._name !== icon) {
        this._name = icon;
        if (onload) {
          onload(icon);
        }
      }
      const classes = ["iconify"];
      if (iconName.prefix !== "") {
        classes.push("iconify--" + iconName.prefix);
      }
      if (iconName.provider !== "") {
        classes.push("iconify--" + iconName.provider);
      }
      return { data: data2, classes };
    }
  },
  render() {
    this.counter;
    const props = this.$attrs;
    const icon = this.iconMounted ? this.getIcon(props.icon, props.onLoad) : null;
    if (!icon) {
      return render(emptyIcon, props);
    }
    let newProps = props;
    if (icon.classes) {
      newProps = {
        ...props,
        class: (typeof props["class"] === "string" ? props["class"] + " " : "") + icon.classes.join(" ")
      };
    }
    return render({
      ...defaultIconProps,
      ...icon.data
    }, newProps);
  }
});
const data$2 = {
  "width": 24,
  "height": 24,
  "body": '<path fill="currentColor" d="m8.6 22.5l-1.9-3.2l-3.6-.8l.35-3.7L1 12l2.45-2.8l-.35-3.7l3.6-.8l1.9-3.2L12 2.95l3.4-1.45l1.9 3.2l3.6.8l-.35 3.7L23 12l-2.45 2.8l.35 3.7l-3.6.8l-1.9 3.2l-3.4-1.45Zm2.35-6.95L16.6 9.9l-1.4-1.45l-4.25 4.25l-2.15-2.1L7.4 12Z"/>'
};
const _sfc_main$m = {
  name: "RoomsContent",
  components: {
    SvgIcon,
    FormatMessage,
    Icon
  },
  directives: {
    clickOutside: vClickOutside
  },
  props: {
    currentUserId: { type: [String, Number], required: true },
    room: { type: Object, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    textMessages: { type: Object, required: true },
    roomActions: { type: Array, required: true }
  },
  emits: ["room-action-handler"],
  data() {
    return {
      roomMenuOpened: null,
      icons: {
        verifiedIcon: data$2
      }
    };
  },
  computed: {
    getLastMessage() {
      const isTyping = this.typingUsers;
      if (isTyping)
        return isTyping;
      const content = this.room.lastMessage.content;
      if (this.room.users.length <= 2) {
        return content;
      }
      const user = this.room.users.find(
        (user2) => user2._id === this.room.lastMessage.senderId
      );
      if (this.room.lastMessage.username) {
        return `${this.room.lastMessage.username} - ${content}`;
      } else if (!user || user._id === this.currentUserId) {
        return content;
      }
      return `${user.username} - ${content}`;
    },
    userStatus() {
      if (!this.room.users || this.room.users.length !== 2)
        return;
      const user = this.room.users.find((u) => u._id !== this.currentUserId);
      if (user && user.status)
        return user.status.state;
      return null;
    },
    typingUsers() {
      return typingText(this.room, this.currentUserId, this.textMessages);
    },
    isMessageCheckmarkVisible() {
      return !this.typingUsers && this.room.lastMessage && !this.room.lastMessage.deleted && this.room.lastMessage.senderId === this.currentUserId && (this.room.lastMessage.saved || this.room.lastMessage.distributed || this.room.lastMessage.seen);
    },
    formattedDuration() {
      var _a, _b;
      const file = (_b = (_a = this.room.lastMessage) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
      if (file) {
        if (!file.duration) {
          return `${file.name}.${file.extension}`;
        }
        let s = Math.floor(file.duration);
        return (s - (s %= 60)) / 60 + (s > 9 ? ":" : ":0") + s;
      }
      return "";
    },
    isAudio() {
      return this.room.lastMessage.files ? isAudioFile(this.room.lastMessage.files[0]) : false;
    }
  },
  methods: {
    roomActionHandler(action) {
      this.closeRoomMenu();
      this.$emit("room-action-handler", { action, roomId: this.room.roomId });
    },
    closeRoomMenu() {
      this.roomMenuOpened = null;
    }
  }
};
const _hoisted_1$m = { class: "vac-room-container" };
const _hoisted_2$i = { class: "vac-name-container vac-text-ellipsis" };
const _hoisted_3$g = { class: "vac-title-container" };
const _hoisted_4$f = { class: "vac-room-name vac-text-ellipsis" };
const _hoisted_5$9 = {
  key: 1,
  class: "vac-text-date"
};
const _hoisted_6$6 = { key: 0 };
const _hoisted_7$6 = {
  key: 1,
  class: "vac-text-ellipsis"
};
const _hoisted_8$4 = {
  key: 3,
  class: "vac-text-ellipsis"
};
const _hoisted_9$4 = { class: "vac-room-options-container" };
const _hoisted_10$4 = {
  key: 0,
  class: "vac-badge-counter vac-room-badge"
};
const _hoisted_11$3 = {
  key: 0,
  class: "vac-menu-options"
};
const _hoisted_12$2 = { class: "vac-menu-list" };
const _hoisted_13$1 = ["onClick"];
function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_format_message = resolveComponent("format-message");
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", _hoisted_1$m, [
    renderSlot(_ctx.$slots, "room-list-item_" + $props.room.roomId, {}, () => [
      renderSlot(_ctx.$slots, "room-list-avatar_" + $props.room.roomId, {}, () => [
        $props.room.avatar ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "vac-avatar",
          style: normalizeStyle({ "background-image": `url('${$props.room.avatar}')` })
        }, null, 4)) : createCommentVNode("", true)
      ]),
      createBaseVNode("div", _hoisted_2$i, [
        createBaseVNode("div", _hoisted_3$g, [
          $options.userStatus ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["vac-state-circle", { "vac-state-online": $options.userStatus === "online" }])
          }, null, 2)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_4$f, [
            createTextVNode(toDisplayString($props.room.roomName) + " ", 1),
            $props.room.verified || $props.room.official ? (openBlock(), createBlock(_component_Icon, {
              key: 0,
              inline: true,
              style: normalizeStyle({ color: `${$props.room.official ? "gold" : "#2689d6"}` }),
              width: "14",
              icon: $data.icons.verifiedIcon
            }, null, 8, ["style", "icon"])) : createCommentVNode("", true)
          ]),
          $props.room.lastMessage ? (openBlock(), createElementBlock("div", _hoisted_5$9, toDisplayString($props.room.lastMessage.timestamp), 1)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", {
          class: normalizeClass(["vac-text-last", {
            "vac-message-new": $props.room.lastMessage && $props.room.lastMessage.new && !$options.typingUsers
          }])
        }, [
          $options.isMessageCheckmarkVisible ? (openBlock(), createElementBlock("span", _hoisted_6$6, [
            renderSlot(_ctx.$slots, "checkmark-icon_" + $props.room.roomId, {}, () => [
              createVNode(_component_svg_icon, {
                name: $props.room.lastMessage.distributed ? "double-checkmark" : "checkmark",
                param: $props.room.lastMessage.seen ? "seen" : "",
                class: "vac-icon-check"
              }, null, 8, ["name", "param"])
            ])
          ])) : createCommentVNode("", true),
          $props.room.lastMessage && !$props.room.lastMessage.deleted && $options.isAudio ? (openBlock(), createElementBlock("div", _hoisted_7$6, [
            renderSlot(_ctx.$slots, "microphone-icon_" + $props.room.roomId, {}, () => [
              createVNode(_component_svg_icon, {
                name: "microphone",
                class: "vac-icon-microphone"
              })
            ]),
            createTextVNode(" " + toDisplayString($options.formattedDuration), 1)
          ])) : $props.room.lastMessage ? (openBlock(), createBlock(_component_format_message, {
            key: 2,
            "message-id": $props.room.lastMessage._id,
            "room-id": $props.room.roomId,
            "room-list": true,
            content: $options.getLastMessage,
            deleted: !!$props.room.lastMessage.deleted && !$options.typingUsers,
            users: $props.room.users,
            "text-messages": $props.textMessages,
            linkify: false,
            "text-formatting": $props.textFormatting,
            "link-options": $props.linkOptions,
            "single-line": true
          }, createSlots({ _: 2 }, [
            renderList(_ctx.$slots, (idx, name) => {
              return {
                name,
                fn: withCtx((data2) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                ])
              };
            })
          ]), 1032, ["message-id", "room-id", "content", "deleted", "users", "text-messages", "text-formatting", "link-options"])) : createCommentVNode("", true),
          !$props.room.lastMessage && $options.typingUsers ? (openBlock(), createElementBlock("div", _hoisted_8$4, toDisplayString($options.typingUsers), 1)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_9$4, [
            $props.room.unreadCount ? (openBlock(), createElementBlock("div", _hoisted_10$4, toDisplayString($props.room.unreadCount), 1)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "room-list-options_" + $props.room.roomId, {}, () => [
              $props.roomActions.length ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "vac-svg-button vac-list-room-options",
                onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $data.roomMenuOpened = $props.room.roomId, ["stop"]))
              }, [
                renderSlot(_ctx.$slots, "room-list-options-icon_" + $props.room.roomId, {}, () => [
                  createVNode(_component_svg_icon, {
                    name: "dropdown",
                    param: "room"
                  })
                ])
              ])) : createCommentVNode("", true),
              $props.roomActions.length ? (openBlock(), createBlock(Transition, {
                key: 1,
                name: "vac-slide-left"
              }, {
                default: withCtx(() => [
                  $data.roomMenuOpened === $props.room.roomId ? withDirectives((openBlock(), createElementBlock("div", _hoisted_11$3, [
                    createBaseVNode("div", _hoisted_12$2, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList($props.roomActions, (action) => {
                        return openBlock(), createElementBlock("div", {
                          key: action.name
                        }, [
                          createBaseVNode("div", {
                            class: "vac-menu-item",
                            onClick: withModifiers(($event) => $options.roomActionHandler(action), ["stop"])
                          }, toDisplayString(action.title), 9, _hoisted_13$1)
                        ]);
                      }), 128))
                    ])
                  ])), [
                    [_directive_click_outside, $options.closeRoomMenu]
                  ]) : createCommentVNode("", true)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ])
          ])
        ], 2)
      ])
    ])
  ]);
}
var RoomContent = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l]]);
var filteredItems = (items, prop, val, startsWith = false) => {
  if (!val || val === "")
    return items;
  return items.filter((v) => {
    if (startsWith)
      return formatString(v[prop]).startsWith(formatString(val));
    return formatString(v[prop]).includes(formatString(val));
  });
};
function formatString(string) {
  return string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const _sfc_main$l = {
  name: "RoomsList",
  components: {
    Loader,
    RoomsSearch,
    RoomContent
  },
  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    showRoomsList: { type: Boolean, required: true },
    showSearch: { type: Boolean, required: true },
    showAddRoom: { type: Boolean, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    isMobile: { type: Boolean, required: true },
    rooms: { type: Array, required: true },
    loadingRooms: { type: Boolean, required: true },
    roomsLoaded: { type: Boolean, required: true },
    room: { type: Object, required: true },
    customSearchRoomEnabled: { type: [Boolean, String], default: false },
    roomActions: { type: Array, required: true },
    scrollDistance: { type: Number, required: true }
  },
  emits: [
    "add-room",
    "search-room",
    "room-action-handler",
    "loading-more-rooms",
    "fetch-room",
    "fetch-more-rooms"
  ],
  data() {
    return {
      filteredRooms: this.rooms || [],
      observer: null,
      showLoader: true,
      loadingMoreRooms: false,
      selectedRoomId: ""
    };
  },
  watch: {
    rooms: {
      deep: true,
      handler(newVal, oldVal) {
        this.filteredRooms = newVal;
        if (newVal.length !== oldVal.length || this.roomsLoaded) {
          this.loadingMoreRooms = false;
        }
      }
    },
    loadingRooms(val) {
      if (!val) {
        setTimeout(() => this.initIntersectionObserver());
      }
    },
    loadingMoreRooms(val) {
      this.$emit("loading-more-rooms", val);
    },
    roomsLoaded: {
      immediate: true,
      handler(val) {
        if (val) {
          this.loadingMoreRooms = false;
          if (!this.loadingRooms) {
            this.showLoader = false;
          }
        }
      }
    },
    room: {
      immediate: true,
      handler(val) {
        if (val && !this.isMobile)
          this.selectedRoomId = val.roomId;
      }
    }
  },
  methods: {
    initIntersectionObserver() {
      if (this.observer) {
        this.showLoader = true;
        this.observer.disconnect();
      }
      const loader = document.querySelector("vue-advanced-chat").shadowRoot.getElementById("infinite-loader-rooms");
      if (loader) {
        const options2 = {
          root: document.querySelector("vue-advanced-chat").shadowRoot.getElementById("rooms-list"),
          rootMargin: `${this.scrollDistance}px`,
          threshold: 0
        };
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.loadMoreRooms();
          }
        }, options2);
        this.observer.observe(loader);
      }
    },
    searchRoom(ev) {
      if (this.customSearchRoomEnabled) {
        this.$emit("search-room", ev.target.value);
      } else {
        this.filteredRooms = filteredItems(
          this.rooms,
          "roomName",
          ev.target.value
        );
      }
    },
    openRoom(room) {
      if (room.roomId === this.room.roomId && !this.isMobile)
        return;
      if (!this.isMobile)
        this.selectedRoomId = room.roomId;
      this.$emit("fetch-room", { room });
    },
    loadMoreRooms() {
      if (this.loadingMoreRooms)
        return;
      if (this.roomsLoaded) {
        this.loadingMoreRooms = false;
        this.showLoader = false;
        return;
      }
      this.$emit("fetch-more-rooms");
      this.loadingMoreRooms = true;
    }
  }
};
const _hoisted_1$l = {
  key: 0,
  class: "vac-rooms-empty"
};
const _hoisted_2$h = {
  key: 1,
  id: "rooms-list",
  class: "vac-room-list"
};
const _hoisted_3$f = ["id", "onClick"];
const _hoisted_4$e = {
  key: 0,
  id: "infinite-loader-rooms"
};
function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_rooms_search = resolveComponent("rooms-search");
  const _component_loader = resolveComponent("loader");
  const _component_room_content = resolveComponent("room-content");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass(["vac-rooms-container", {
      "vac-rooms-container-full": $props.isMobile,
      "vac-app-border-r": !$props.isMobile
    }])
  }, [
    renderSlot(_ctx.$slots, "rooms-header"),
    renderSlot(_ctx.$slots, "rooms-list-search", {}, () => [
      createVNode(_component_rooms_search, {
        rooms: $props.rooms,
        "loading-rooms": $props.loadingRooms,
        "text-messages": $props.textMessages,
        "show-search": $props.showSearch,
        "show-add-room": $props.showAddRoom,
        onSearchRoom: $options.searchRoom,
        onAddRoom: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("add-room"))
      }, createSlots({ _: 2 }, [
        renderList(_ctx.$slots, (idx, name) => {
          return {
            name,
            fn: withCtx((data2) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
            ])
          };
        })
      ]), 1032, ["rooms", "loading-rooms", "text-messages", "show-search", "show-add-room", "onSearchRoom"])
    ]),
    createVNode(_component_loader, {
      show: $props.loadingRooms,
      type: "rooms"
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (idx, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["show"]),
    !$props.loadingRooms && !$props.rooms.length ? (openBlock(), createElementBlock("div", _hoisted_1$l, [
      renderSlot(_ctx.$slots, "rooms-empty", {}, () => [
        createTextVNode(toDisplayString($props.textMessages.ROOMS_EMPTY), 1)
      ])
    ])) : createCommentVNode("", true),
    !$props.loadingRooms ? (openBlock(), createElementBlock("div", _hoisted_2$h, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.filteredRooms, (fRoom) => {
        return openBlock(), createElementBlock("div", {
          id: fRoom.roomId,
          key: fRoom.roomId,
          class: normalizeClass(["vac-room-item", { "vac-room-selected": $data.selectedRoomId === fRoom.roomId }]),
          onClick: ($event) => $options.openRoom(fRoom)
        }, [
          createVNode(_component_room_content, {
            "current-user-id": $props.currentUserId,
            room: fRoom,
            "text-formatting": $props.textFormatting,
            "link-options": $props.linkOptions,
            "text-messages": $props.textMessages,
            "room-actions": $props.roomActions,
            onRoomActionHandler: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("room-action-handler", $event))
          }, createSlots({ _: 2 }, [
            renderList(_ctx.$slots, (idx, name) => {
              return {
                name,
                fn: withCtx((data2) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                ])
              };
            })
          ]), 1032, ["current-user-id", "room", "text-formatting", "link-options", "text-messages", "room-actions"])
        ], 10, _hoisted_3$f);
      }), 128)),
      createVNode(Transition, { name: "vac-fade-message" }, {
        default: withCtx(() => [
          $props.rooms.length && !$props.loadingRooms ? (openBlock(), createElementBlock("div", _hoisted_4$e, [
            createVNode(_component_loader, {
              show: $data.showLoader,
              infinite: true,
              type: "infinite-rooms"
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (idx, name) => {
                return {
                  name,
                  fn: withCtx((data2) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                  ])
                };
              })
            ]), 1032, ["show"])
          ])) : createCommentVNode("", true)
        ]),
        _: 3
      })
    ])) : createCommentVNode("", true)
  ], 2)), [
    [vShow, $props.showRoomsList]
  ]);
}
var RoomsList = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k]]);
const _sfc_main$k = {
  name: "RoomHeader",
  components: {
    SvgIcon,
    Icon
  },
  directives: {
    clickOutside: vClickOutside
  },
  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    singleRoom: { type: Boolean, required: true },
    showRoomsList: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    roomInfoEnabled: { type: Boolean, required: true },
    menuActions: { type: Array, required: true },
    room: { type: Object, required: true },
    messageSelectionEnabled: { type: Boolean, required: true },
    messageSelectionActions: { type: Array, required: true },
    selectedMessagesTotal: { type: Number, required: true }
  },
  emits: [
    "toggle-rooms-list",
    "room-info",
    "menu-action-handler",
    "cancel-message-selection",
    "message-selection-action-handler"
  ],
  data() {
    return {
      menuOpened: false,
      messageSelectionAnimationEnded: true,
      icons: {
        verifiedIcon: data$2
      }
    };
  },
  computed: {
    typingUsers() {
      return typingText(this.room, this.currentUserId, this.textMessages);
    },
    userStatus() {
      if (!this.room.users || this.room.users.length !== 2)
        return;
      const user = this.room.users.find((u) => u._id !== this.currentUserId);
      if (!user.status)
        return;
      let text2 = "";
      if (user.status.state === "online") {
        text2 = this.textMessages.IS_ONLINE;
      } else if (user.status.lastChanged) {
        text2 = this.textMessages.LAST_SEEN + user.status.lastChanged;
      }
      return text2;
    }
  },
  watch: {
    messageSelectionEnabled(val) {
      if (val) {
        this.messageSelectionAnimationEnded = false;
      } else {
        setTimeout(() => {
          this.messageSelectionAnimationEnded = true;
        }, 300);
      }
    }
  },
  methods: {
    menuActionHandler(action) {
      this.closeMenu();
      this.$emit("menu-action-handler", action);
    },
    closeMenu() {
      this.menuOpened = false;
    },
    messageSelectionActionHandler(action) {
      this.$emit("message-selection-action-handler", action);
    }
  }
};
const _hoisted_1$k = { class: "vac-room-header vac-app-border-b" };
const _hoisted_2$g = { class: "vac-room-wrapper" };
const _hoisted_3$e = {
  key: 0,
  class: "vac-room-selection"
};
const _hoisted_4$d = ["id"];
const _hoisted_5$8 = ["onClick"];
const _hoisted_6$5 = { class: "vac-selection-button-count" };
const _hoisted_7$5 = { class: "vac-text-ellipsis" };
const _hoisted_8$3 = { class: "vac-room-name vac-text-ellipsis" };
const _hoisted_9$3 = {
  key: 0,
  class: "vac-room-info vac-text-ellipsis"
};
const _hoisted_10$3 = {
  key: 1,
  class: "vac-room-info vac-text-ellipsis"
};
const _hoisted_11$2 = {
  key: 0,
  class: "vac-menu-options"
};
const _hoisted_12$1 = { class: "vac-menu-list" };
const _hoisted_13 = ["onClick"];
function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_Icon = resolveComponent("Icon");
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", _hoisted_1$k, [
    renderSlot(_ctx.$slots, "room-header", {}, () => [
      createBaseVNode("div", _hoisted_2$g, [
        createVNode(Transition, { name: "vac-slide-up" }, {
          default: withCtx(() => [
            $props.messageSelectionEnabled ? (openBlock(), createElementBlock("div", _hoisted_3$e, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($props.messageSelectionActions, (action) => {
                return openBlock(), createElementBlock("div", {
                  id: action.name,
                  key: action.name
                }, [
                  createBaseVNode("div", {
                    class: "vac-selection-button",
                    onClick: ($event) => $options.messageSelectionActionHandler(action)
                  }, [
                    createTextVNode(toDisplayString(action.title) + " ", 1),
                    createBaseVNode("span", _hoisted_6$5, toDisplayString($props.selectedMessagesTotal), 1)
                  ], 8, _hoisted_5$8)
                ], 8, _hoisted_4$d);
              }), 128)),
              createBaseVNode("div", {
                class: "vac-selection-cancel vac-item-clickable",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("cancel-message-selection"))
              }, toDisplayString($props.textMessages.CANCEL_SELECT_MESSAGE), 1)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        !$props.messageSelectionEnabled && $data.messageSelectionAnimationEnded ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          !$props.singleRoom ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["vac-svg-button vac-toggle-button", {
              "vac-rotate-icon-init": !$props.isMobile,
              "vac-rotate-icon": !$props.showRoomsList && !$props.isMobile
            }]),
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("toggle-rooms-list"))
          }, [
            renderSlot(_ctx.$slots, "toggle-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "toggle" })
            ])
          ], 2)) : createCommentVNode("", true),
          createBaseVNode("div", {
            class: normalizeClass(["vac-info-wrapper", { "vac-item-clickable": $props.roomInfoEnabled }]),
            onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("room-info"))
          }, [
            renderSlot(_ctx.$slots, "room-header-avatar", {}, () => [
              $props.room.avatar ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "vac-avatar",
                style: normalizeStyle({ "background-image": `url('${$props.room.avatar}')` })
              }, null, 4)) : createCommentVNode("", true)
            ]),
            renderSlot(_ctx.$slots, "room-header-info", {}, () => [
              createBaseVNode("div", _hoisted_7$5, [
                createBaseVNode("div", _hoisted_8$3, [
                  createTextVNode(toDisplayString($props.room.roomName) + " ", 1),
                  $props.room.verified || $props.room.official ? (openBlock(), createBlock(_component_Icon, {
                    key: 0,
                    inline: true,
                    style: normalizeStyle({ color: `${$props.room.official ? "gold" : "#2689d6"}` }),
                    width: "14",
                    icon: $data.icons.verifiedIcon
                  }, null, 8, ["style", "icon"])) : createCommentVNode("", true)
                ]),
                $options.typingUsers ? (openBlock(), createElementBlock("div", _hoisted_9$3, toDisplayString($options.typingUsers), 1)) : (openBlock(), createElementBlock("div", _hoisted_10$3, toDisplayString($options.userStatus), 1))
              ])
            ])
          ], 2),
          $props.room.roomId ? renderSlot(_ctx.$slots, "room-options", { key: 1 }, () => [
            $props.menuActions.length ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "vac-svg-button vac-room-options",
              onClick: _cache[3] || (_cache[3] = ($event) => $data.menuOpened = !$data.menuOpened)
            }, [
              renderSlot(_ctx.$slots, "menu-icon", {}, () => [
                createVNode(_component_svg_icon, { name: "menu" })
              ])
            ])) : createCommentVNode("", true),
            $props.menuActions.length ? (openBlock(), createBlock(Transition, {
              key: 1,
              name: "vac-slide-left"
            }, {
              default: withCtx(() => [
                $data.menuOpened ? withDirectives((openBlock(), createElementBlock("div", _hoisted_11$2, [
                  createBaseVNode("div", _hoisted_12$1, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList($props.menuActions, (action) => {
                      return openBlock(), createElementBlock("div", {
                        key: action.name
                      }, [
                        createBaseVNode("div", {
                          class: "vac-menu-item",
                          onClick: ($event) => $options.menuActionHandler(action)
                        }, toDisplayString(action.title), 9, _hoisted_13)
                      ]);
                    }), 128))
                  ])
                ])), [
                  [_directive_click_outside, $options.closeMenu]
                ]) : createCommentVNode("", true)
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ]) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ])
    ])
  ]);
}
var RoomHeader = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j]]);
function assertNonEmptyString(str) {
  if (typeof str !== "string" || !str) {
    throw new Error("expected a non-empty string, got: " + str);
  }
}
function assertNumber(number) {
  if (typeof number !== "number") {
    throw new Error("expected a number, got: " + number);
  }
}
const DB_VERSION_CURRENT = 1;
const DB_VERSION_INITIAL = 1;
const STORE_EMOJI = "emoji";
const STORE_KEYVALUE = "keyvalue";
const STORE_FAVORITES = "favorites";
const FIELD_TOKENS = "tokens";
const INDEX_TOKENS = "tokens";
const FIELD_UNICODE = "unicode";
const INDEX_COUNT = "count";
const FIELD_GROUP = "group";
const FIELD_ORDER = "order";
const INDEX_GROUP_AND_ORDER = "group-order";
const KEY_ETAG = "eTag";
const KEY_URL = "url";
const KEY_PREFERRED_SKINTONE = "skinTone";
const MODE_READONLY = "readonly";
const MODE_READWRITE = "readwrite";
const INDEX_SKIN_UNICODE = "skinUnicodes";
const FIELD_SKIN_UNICODE = "skinUnicodes";
const DEFAULT_DATA_SOURCE$1 = "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json";
const DEFAULT_LOCALE$1 = "en";
function uniqBy$1(arr, func) {
  const set2 = /* @__PURE__ */ new Set();
  const res = [];
  for (const item of arr) {
    const key = func(item);
    if (!set2.has(key)) {
      set2.add(key);
      res.push(item);
    }
  }
  return res;
}
function uniqEmoji(emojis) {
  return uniqBy$1(emojis, (_) => _.unicode);
}
function initialMigration(db) {
  function createObjectStore(name, keyPath, indexes) {
    const store = keyPath ? db.createObjectStore(name, { keyPath }) : db.createObjectStore(name);
    if (indexes) {
      for (const [indexName, [keyPath2, multiEntry]] of Object.entries(indexes)) {
        store.createIndex(indexName, keyPath2, { multiEntry });
      }
    }
    return store;
  }
  createObjectStore(STORE_KEYVALUE);
  createObjectStore(STORE_EMOJI, FIELD_UNICODE, {
    [INDEX_TOKENS]: [FIELD_TOKENS, true],
    [INDEX_GROUP_AND_ORDER]: [[FIELD_GROUP, FIELD_ORDER]],
    [INDEX_SKIN_UNICODE]: [FIELD_SKIN_UNICODE, true]
  });
  createObjectStore(STORE_FAVORITES, void 0, {
    [INDEX_COUNT]: [""]
  });
}
const openReqs = {};
const databaseCache = {};
const onCloseListeners = {};
function handleOpenOrDeleteReq(resolve3, reject, req) {
  req.onerror = () => reject(req.error);
  req.onblocked = () => reject(new Error("IDB blocked"));
  req.onsuccess = () => resolve3(req.result);
}
async function createDatabase(dbName) {
  const db = await new Promise((resolve3, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION_CURRENT);
    openReqs[dbName] = req;
    req.onupgradeneeded = (e) => {
      if (e.oldVersion < DB_VERSION_INITIAL) {
        initialMigration(req.result);
      }
    };
    handleOpenOrDeleteReq(resolve3, reject, req);
  });
  db.onclose = () => closeDatabase(dbName);
  return db;
}
function openDatabase(dbName) {
  if (!databaseCache[dbName]) {
    databaseCache[dbName] = createDatabase(dbName);
  }
  return databaseCache[dbName];
}
function dbPromise(db, storeName, readOnlyOrReadWrite, cb) {
  return new Promise((resolve3, reject) => {
    const txn = db.transaction(storeName, readOnlyOrReadWrite, { durability: "relaxed" });
    const store = typeof storeName === "string" ? txn.objectStore(storeName) : storeName.map((name) => txn.objectStore(name));
    let res;
    cb(store, txn, (result) => {
      res = result;
    });
    txn.oncomplete = () => resolve3(res);
    txn.onerror = () => reject(txn.error);
  });
}
function closeDatabase(dbName) {
  const req = openReqs[dbName];
  const db = req && req.result;
  if (db) {
    db.close();
    const listeners = onCloseListeners[dbName];
    if (listeners) {
      for (const listener of listeners) {
        listener();
      }
    }
  }
  delete openReqs[dbName];
  delete databaseCache[dbName];
  delete onCloseListeners[dbName];
}
function deleteDatabase(dbName) {
  return new Promise((resolve3, reject) => {
    closeDatabase(dbName);
    const req = indexedDB.deleteDatabase(dbName);
    handleOpenOrDeleteReq(resolve3, reject, req);
  });
}
function addOnCloseListener(dbName, listener) {
  let listeners = onCloseListeners[dbName];
  if (!listeners) {
    listeners = onCloseListeners[dbName] = [];
  }
  listeners.push(listener);
}
const irregularEmoticons = /* @__PURE__ */ new Set([
  ":D",
  "XD",
  ":'D",
  "O:)",
  ":X",
  ":P",
  ";P",
  "XP",
  ":L",
  ":Z",
  ":j",
  "8D",
  "XO",
  "8)",
  ":B",
  ":O",
  ":S",
  ":'o",
  "Dx",
  "X(",
  "D:",
  ":C",
  ">0)",
  ":3",
  "</3",
  "<3",
  "\\M/",
  ":E",
  "8#"
]);
function extractTokens(str) {
  return str.split(/[\s_]+/).map((word) => {
    if (!word.match(/\w/) || irregularEmoticons.has(word)) {
      return word.toLowerCase();
    }
    return word.replace(/[)(:,]/g, "").replace(/’/g, "'").toLowerCase();
  }).filter(Boolean);
}
const MIN_SEARCH_TEXT_LENGTH$1 = 2;
function normalizeTokens(str) {
  return str.filter(Boolean).map((_) => _.toLowerCase()).filter((_) => _.length >= MIN_SEARCH_TEXT_LENGTH$1);
}
function transformEmojiData(emojiData) {
  const res = emojiData.map(({ annotation, emoticon, group, order, shortcodes, skins, tags, emoji, version: version2 }) => {
    const tokens = [...new Set(
      normalizeTokens([
        ...(shortcodes || []).map(extractTokens).flat(),
        ...tags.map(extractTokens).flat(),
        ...extractTokens(annotation),
        emoticon
      ])
    )].sort();
    const res2 = {
      annotation,
      group,
      order,
      tags,
      tokens,
      unicode: emoji,
      version: version2
    };
    if (emoticon) {
      res2.emoticon = emoticon;
    }
    if (shortcodes) {
      res2.shortcodes = shortcodes;
    }
    if (skins) {
      res2.skinTones = [];
      res2.skinUnicodes = [];
      res2.skinVersions = [];
      for (const { tone, emoji: emoji2, version: version3 } of skins) {
        res2.skinTones.push(tone);
        res2.skinUnicodes.push(emoji2);
        res2.skinVersions.push(version3);
      }
    }
    return res2;
  });
  return res;
}
function callStore(store, method, key, cb) {
  store[method](key).onsuccess = (e) => cb && cb(e.target.result);
}
function getIDB(store, key, cb) {
  callStore(store, "get", key, cb);
}
function getAllIDB(store, key, cb) {
  callStore(store, "getAll", key, cb);
}
function commit(txn) {
  if (txn.commit) {
    txn.commit();
  }
}
function minBy(array, func) {
  let minItem = array[0];
  for (let i = 1; i < array.length; i++) {
    const item = array[i];
    if (func(minItem) > func(item)) {
      minItem = item;
    }
  }
  return minItem;
}
function findCommonMembers(arrays, uniqByFunc) {
  const shortestArray = minBy(arrays, (_) => _.length);
  const results = [];
  for (const item of shortestArray) {
    if (!arrays.some((array) => array.findIndex((_) => uniqByFunc(_) === uniqByFunc(item)) === -1)) {
      results.push(item);
    }
  }
  return results;
}
async function isEmpty(db) {
  return !await get2(db, STORE_KEYVALUE, KEY_URL);
}
async function hasData(db, url, eTag) {
  const [oldETag, oldUrl] = await Promise.all([KEY_ETAG, KEY_URL].map((key) => get2(db, STORE_KEYVALUE, key)));
  return oldETag === eTag && oldUrl === url;
}
async function doFullDatabaseScanForSingleResult(db, predicate) {
  const BATCH_SIZE = 50;
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    let lastKey;
    const processNextBatch = () => {
      emojiStore.getAll(lastKey && IDBKeyRange.lowerBound(lastKey, true), BATCH_SIZE).onsuccess = (e) => {
        const results = e.target.result;
        for (const result of results) {
          lastKey = result.unicode;
          if (predicate(result)) {
            return cb(result);
          }
        }
        if (results.length < BATCH_SIZE) {
          return cb();
        }
        processNextBatch();
      };
    };
    processNextBatch();
  });
}
async function loadData(db, emojiData, url, eTag) {
  try {
    const transformedData = transformEmojiData(emojiData);
    await dbPromise(db, [STORE_EMOJI, STORE_KEYVALUE], MODE_READWRITE, ([emojiStore, metaStore], txn) => {
      let oldETag;
      let oldUrl;
      let todo = 0;
      function checkFetched() {
        if (++todo === 2) {
          onFetched();
        }
      }
      function onFetched() {
        if (oldETag === eTag && oldUrl === url) {
          return;
        }
        emojiStore.clear();
        for (const data2 of transformedData) {
          emojiStore.put(data2);
        }
        metaStore.put(eTag, KEY_ETAG);
        metaStore.put(url, KEY_URL);
        commit(txn);
      }
      getIDB(metaStore, KEY_ETAG, (result) => {
        oldETag = result;
        checkFetched();
      });
      getIDB(metaStore, KEY_URL, (result) => {
        oldUrl = result;
        checkFetched();
      });
    });
  } finally {
  }
}
async function getEmojiByGroup(db, group) {
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    const range = IDBKeyRange.bound([group, 0], [group + 1, 0], false, true);
    getAllIDB(emojiStore.index(INDEX_GROUP_AND_ORDER), range, cb);
  });
}
async function getEmojiBySearchQuery(db, query) {
  const tokens = normalizeTokens(extractTokens(query));
  if (!tokens.length) {
    return [];
  }
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    const intermediateResults = [];
    const checkDone = () => {
      if (intermediateResults.length === tokens.length) {
        onDone();
      }
    };
    const onDone = () => {
      const results = findCommonMembers(intermediateResults, (_) => _.unicode);
      cb(results.sort((a, b) => a.order < b.order ? -1 : 1));
    };
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const range = i === tokens.length - 1 ? IDBKeyRange.bound(token, token + "\uFFFF", false, true) : IDBKeyRange.only(token);
      getAllIDB(emojiStore.index(INDEX_TOKENS), range, (result) => {
        intermediateResults.push(result);
        checkDone();
      });
    }
  });
}
async function getEmojiByShortcode(db, shortcode) {
  const emojis = await getEmojiBySearchQuery(db, shortcode);
  if (!emojis.length) {
    const predicate = (_) => (_.shortcodes || []).includes(shortcode.toLowerCase());
    return await doFullDatabaseScanForSingleResult(db, predicate) || null;
  }
  return emojis.filter((_) => {
    const lowerShortcodes = (_.shortcodes || []).map((_2) => _2.toLowerCase());
    return lowerShortcodes.includes(shortcode.toLowerCase());
  })[0] || null;
}
async function getEmojiByUnicode(db, unicode) {
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => getIDB(emojiStore, unicode, (result) => {
    if (result) {
      return cb(result);
    }
    getIDB(emojiStore.index(INDEX_SKIN_UNICODE), unicode, (result2) => cb(result2 || null));
  }));
}
function get2(db, storeName, key) {
  return dbPromise(db, storeName, MODE_READONLY, (store, txn, cb) => getIDB(store, key, cb));
}
function set(db, storeName, key, value) {
  return dbPromise(db, storeName, MODE_READWRITE, (store, txn) => {
    store.put(value, key);
    commit(txn);
  });
}
function incrementFavoriteEmojiCount(db, unicode) {
  return dbPromise(db, STORE_FAVORITES, MODE_READWRITE, (store, txn) => getIDB(store, unicode, (result) => {
    store.put((result || 0) + 1, unicode);
    commit(txn);
  }));
}
function getTopFavoriteEmoji(db, customEmojiIndex2, limit) {
  if (limit === 0) {
    return [];
  }
  return dbPromise(db, [STORE_FAVORITES, STORE_EMOJI], MODE_READONLY, ([favoritesStore, emojiStore], txn, cb) => {
    const results = [];
    favoritesStore.index(INDEX_COUNT).openCursor(void 0, "prev").onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor) {
        return cb(results);
      }
      function addResult(result) {
        results.push(result);
        if (results.length === limit) {
          return cb(results);
        }
        cursor.continue();
      }
      const unicodeOrName = cursor.primaryKey;
      const custom = customEmojiIndex2.byName(unicodeOrName);
      if (custom) {
        return addResult(custom);
      }
      getIDB(emojiStore, unicodeOrName, (emoji) => {
        if (emoji) {
          return addResult(emoji);
        }
        cursor.continue();
      });
    };
  });
}
const CODA_MARKER = "";
function trie(arr, itemToTokens) {
  const map = /* @__PURE__ */ new Map();
  for (const item of arr) {
    const tokens = itemToTokens(item);
    for (const token of tokens) {
      let currentMap = map;
      for (let i = 0; i < token.length; i++) {
        const char = token.charAt(i);
        let nextMap = currentMap.get(char);
        if (!nextMap) {
          nextMap = /* @__PURE__ */ new Map();
          currentMap.set(char, nextMap);
        }
        currentMap = nextMap;
      }
      let valuesAtCoda = currentMap.get(CODA_MARKER);
      if (!valuesAtCoda) {
        valuesAtCoda = [];
        currentMap.set(CODA_MARKER, valuesAtCoda);
      }
      valuesAtCoda.push(item);
    }
  }
  const search = (query, exact) => {
    let currentMap = map;
    for (let i = 0; i < query.length; i++) {
      const char = query.charAt(i);
      const nextMap = currentMap.get(char);
      if (nextMap) {
        currentMap = nextMap;
      } else {
        return [];
      }
    }
    if (exact) {
      const results2 = currentMap.get(CODA_MARKER);
      return results2 || [];
    }
    const results = [];
    const queue2 = [currentMap];
    while (queue2.length) {
      const currentMap2 = queue2.shift();
      const entriesSortedByKey = [...currentMap2.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1);
      for (const [key, value] of entriesSortedByKey) {
        if (key === CODA_MARKER) {
          results.push(...value);
        } else {
          queue2.push(value);
        }
      }
    }
    return results;
  };
  return search;
}
const requiredKeys$1 = [
  "name",
  "url"
];
function assertCustomEmojis(customEmojis) {
  const isArray2 = customEmojis && Array.isArray(customEmojis);
  const firstItemIsFaulty = isArray2 && customEmojis.length && (!customEmojis[0] || requiredKeys$1.some((key) => !(key in customEmojis[0])));
  if (!isArray2 || firstItemIsFaulty) {
    throw new Error("Custom emojis are in the wrong format");
  }
}
function customEmojiIndex(customEmojis) {
  assertCustomEmojis(customEmojis);
  const sortByName = (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
  const all = customEmojis.sort(sortByName);
  const emojiToTokens = (emoji) => [...new Set((emoji.shortcodes || []).map((shortcode) => extractTokens(shortcode)).flat())];
  const searchTrie = trie(customEmojis, emojiToTokens);
  const searchByExactMatch = (_) => searchTrie(_, true);
  const searchByPrefix = (_) => searchTrie(_, false);
  const search = (query) => {
    const tokens = extractTokens(query);
    const intermediateResults = tokens.map((token, i) => (i < tokens.length - 1 ? searchByExactMatch : searchByPrefix)(token));
    return findCommonMembers(intermediateResults, (_) => _.name).sort(sortByName);
  };
  const shortcodeToEmoji = /* @__PURE__ */ new Map();
  const nameToEmoji = /* @__PURE__ */ new Map();
  for (const customEmoji of customEmojis) {
    nameToEmoji.set(customEmoji.name.toLowerCase(), customEmoji);
    for (const shortcode of customEmoji.shortcodes || []) {
      shortcodeToEmoji.set(shortcode.toLowerCase(), customEmoji);
    }
  }
  const byShortcode = (shortcode) => shortcodeToEmoji.get(shortcode.toLowerCase());
  const byName = (name) => nameToEmoji.get(name.toLowerCase());
  return {
    all,
    search,
    byShortcode,
    byName
  };
}
function cleanEmoji(emoji) {
  if (!emoji) {
    return emoji;
  }
  delete emoji.tokens;
  if (emoji.skinTones) {
    const len = emoji.skinTones.length;
    emoji.skins = Array(len);
    for (let i = 0; i < len; i++) {
      emoji.skins[i] = {
        tone: emoji.skinTones[i],
        unicode: emoji.skinUnicodes[i],
        version: emoji.skinVersions[i]
      };
    }
    delete emoji.skinTones;
    delete emoji.skinUnicodes;
    delete emoji.skinVersions;
  }
  return emoji;
}
function warnETag(eTag) {
  if (!eTag) {
    console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.");
  }
}
const requiredKeys = [
  "annotation",
  "emoji",
  "group",
  "order",
  "tags",
  "version"
];
function assertEmojiData(emojiData) {
  if (!emojiData || !Array.isArray(emojiData) || !emojiData[0] || typeof emojiData[0] !== "object" || requiredKeys.some((key) => !(key in emojiData[0]))) {
    throw new Error("Emoji data is in the wrong format");
  }
}
function assertStatus(response, dataSource) {
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error("Failed to fetch: " + dataSource + ":  " + response.status);
  }
}
async function getETag(dataSource) {
  const response = await fetch(dataSource, { method: "HEAD" });
  assertStatus(response, dataSource);
  const eTag = response.headers.get("etag");
  warnETag(eTag);
  return eTag;
}
async function getETagAndData(dataSource) {
  const response = await fetch(dataSource);
  assertStatus(response, dataSource);
  const eTag = response.headers.get("etag");
  warnETag(eTag);
  const emojiData = await response.json();
  assertEmojiData(emojiData);
  return [eTag, emojiData];
}
function arrayBufferToBinaryString(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  var i = -1;
  while (++i < length) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}
function binaryStringToArrayBuffer(binary) {
  var length = binary.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  var i = -1;
  while (++i < length) {
    arr[i] = binary.charCodeAt(i);
  }
  return buf;
}
async function jsonChecksum(object) {
  const inString = JSON.stringify(object);
  const inBuffer = binaryStringToArrayBuffer(inString);
  const outBuffer = await crypto.subtle.digest("SHA-1", inBuffer);
  const outBinString = arrayBufferToBinaryString(outBuffer);
  const res = btoa(outBinString);
  return res;
}
async function checkForUpdates(db, dataSource) {
  let emojiData;
  let eTag = await getETag(dataSource);
  if (!eTag) {
    const eTagAndData = await getETagAndData(dataSource);
    eTag = eTagAndData[0];
    emojiData = eTagAndData[1];
    if (!eTag) {
      eTag = await jsonChecksum(emojiData);
    }
  }
  if (await hasData(db, dataSource, eTag))
    ;
  else {
    if (!emojiData) {
      const eTagAndData = await getETagAndData(dataSource);
      emojiData = eTagAndData[1];
    }
    await loadData(db, emojiData, dataSource, eTag);
  }
}
async function loadDataForFirstTime(db, dataSource) {
  let [eTag, emojiData] = await getETagAndData(dataSource);
  if (!eTag) {
    eTag = await jsonChecksum(emojiData);
  }
  await loadData(db, emojiData, dataSource, eTag);
}
class Database {
  constructor({ dataSource = DEFAULT_DATA_SOURCE$1, locale = DEFAULT_LOCALE$1, customEmoji = [] } = {}) {
    this.dataSource = dataSource;
    this.locale = locale;
    this._dbName = `emoji-picker-element-${this.locale}`;
    this._db = void 0;
    this._lazyUpdate = void 0;
    this._custom = customEmojiIndex(customEmoji);
    this._clear = this._clear.bind(this);
    this._ready = this._init();
  }
  async _init() {
    const db = this._db = await openDatabase(this._dbName);
    addOnCloseListener(this._dbName, this._clear);
    const dataSource = this.dataSource;
    const empty = await isEmpty(db);
    if (empty) {
      await loadDataForFirstTime(db, dataSource);
    } else {
      this._lazyUpdate = checkForUpdates(db, dataSource);
    }
  }
  async ready() {
    const checkReady = async () => {
      if (!this._ready) {
        this._ready = this._init();
      }
      return this._ready;
    };
    await checkReady();
    if (!this._db) {
      await checkReady();
    }
  }
  async getEmojiByGroup(group) {
    assertNumber(group);
    await this.ready();
    return uniqEmoji(await getEmojiByGroup(this._db, group)).map(cleanEmoji);
  }
  async getEmojiBySearchQuery(query) {
    assertNonEmptyString(query);
    await this.ready();
    const customs = this._custom.search(query);
    const natives = uniqEmoji(await getEmojiBySearchQuery(this._db, query)).map(cleanEmoji);
    return [
      ...customs,
      ...natives
    ];
  }
  async getEmojiByShortcode(shortcode) {
    assertNonEmptyString(shortcode);
    await this.ready();
    const custom = this._custom.byShortcode(shortcode);
    if (custom) {
      return custom;
    }
    return cleanEmoji(await getEmojiByShortcode(this._db, shortcode));
  }
  async getEmojiByUnicodeOrName(unicodeOrName) {
    assertNonEmptyString(unicodeOrName);
    await this.ready();
    const custom = this._custom.byName(unicodeOrName);
    if (custom) {
      return custom;
    }
    return cleanEmoji(await getEmojiByUnicode(this._db, unicodeOrName));
  }
  async getPreferredSkinTone() {
    await this.ready();
    return await get2(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE) || 0;
  }
  async setPreferredSkinTone(skinTone) {
    assertNumber(skinTone);
    await this.ready();
    return set(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE, skinTone);
  }
  async incrementFavoriteEmojiCount(unicodeOrName) {
    assertNonEmptyString(unicodeOrName);
    await this.ready();
    return incrementFavoriteEmojiCount(this._db, unicodeOrName);
  }
  async getTopFavoriteEmoji(limit) {
    assertNumber(limit);
    await this.ready();
    return (await getTopFavoriteEmoji(this._db, this._custom, limit)).map(cleanEmoji);
  }
  set customEmoji(customEmojis) {
    this._custom = customEmojiIndex(customEmojis);
  }
  get customEmoji() {
    return this._custom.all;
  }
  async _shutdown() {
    await this.ready();
    try {
      await this._lazyUpdate;
    } catch (err) {
    }
  }
  _clear() {
    this._db = this._ready = this._lazyUpdate = void 0;
  }
  async close() {
    await this._shutdown();
    await closeDatabase(this._dbName);
  }
  async delete() {
    await this._shutdown();
    await deleteDatabase(this._dbName);
  }
}
function noop() {
}
function run3(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run3);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data2) {
  return document.createTextNode(data2);
}
function listen(node, event, handler, options2) {
  node.addEventListener(event, handler, options2);
  return () => node.removeEventListener(event, handler, options2);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_data(text2, data2) {
  data2 = "" + data2;
  if (text2.wholeText !== data2)
    text2.data = data2;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = /* @__PURE__ */ new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next2, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next2);
    lookup.set(block.key, block);
    next2 = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next2 = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  return new_blocks;
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run3).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options2, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options2.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options2.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options2.target) {
    {
      $$.fragment && $$.fragment.c();
    }
    mount_component(component, options2.target, void 0, void 0);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const allGroups = [
  [-1, "\u2728", "custom"],
  [0, "\u{1F600}", "smileys-emotion"],
  [1, "\u{1F44B}", "people-body"],
  [3, "\u{1F431}", "animals-nature"],
  [4, "\u{1F34E}", "food-drink"],
  [5, "\u{1F3E0}\uFE0F", "travel-places"],
  [6, "\u26BD", "activities"],
  [7, "\u{1F4DD}", "objects"],
  [8, "\u26D4\uFE0F", "symbols"],
  [9, "\u{1F3C1}", "flags"]
].map(([id, emoji, name]) => ({ id, emoji, name }));
const groups = allGroups.slice(1);
const customGroup = allGroups[0];
const MIN_SEARCH_TEXT_LENGTH = 2;
const NUM_SKIN_TONES = 6;
const rIC = typeof requestIdleCallback === "function" ? requestIdleCallback : setTimeout;
function hasZwj(emoji) {
  return emoji.unicode.includes("\u200D");
}
const versionsAndTestEmoji = {
  "\u{1FAE0}": 14,
  "\u{1F972}": 13.1,
  "\u{1F97B}": 12.1,
  "\u{1F970}": 11,
  "\u{1F929}": 5,
  "\u{1F471}\u200D\u2640\uFE0F": 4,
  "\u{1F923}": 3,
  "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F": 2,
  "\u{1F600}": 1,
  "\u{1F610}\uFE0F": 0.7,
  "\u{1F603}": 0.6
};
const TIMEOUT_BEFORE_LOADING_MESSAGE = 1e3;
const DEFAULT_SKIN_TONE_EMOJI = "\u{1F590}\uFE0F";
const DEFAULT_NUM_COLUMNS = 8;
const MOST_COMMONLY_USED_EMOJI = [
  "\u{1F60A}",
  "\u{1F612}",
  "\u2665\uFE0F",
  "\u{1F44D}\uFE0F",
  "\u{1F60D}",
  "\u{1F602}",
  "\u{1F62D}",
  "\u263A\uFE0F",
  "\u{1F614}",
  "\u{1F629}",
  "\u{1F60F}",
  "\u{1F495}",
  "\u{1F64C}",
  "\u{1F618}"
];
const FONT_FAMILY = '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';
const DEFAULT_CATEGORY_SORTING = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const getTextFeature = (text2, color) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = `100px ${FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.scale(0.01, 0.01);
  ctx.fillText(text2, 0, 0);
  return ctx.getImageData(0, 0, 1, 1).data;
};
const compareFeatures = (feature1, feature2) => {
  const feature1Str = [...feature1].join(",");
  const feature2Str = [...feature2].join(",");
  return feature1Str === feature2Str && !feature1Str.startsWith("0,0,0,");
};
function testColorEmojiSupported(text2) {
  const feature1 = getTextFeature(text2, "#000");
  const feature2 = getTextFeature(text2, "#fff");
  return feature1 && feature2 && compareFeatures(feature1, feature2);
}
function determineEmojiSupportLevel() {
  const entries = Object.entries(versionsAndTestEmoji);
  try {
    for (const [emoji, version2] of entries) {
      if (testColorEmojiSupported(emoji)) {
        return version2;
      }
    }
  } catch (e) {
  } finally {
  }
  return entries[0][1];
}
const emojiSupportLevelPromise = new Promise((resolve3) => rIC(() => resolve3(determineEmojiSupportLevel())));
const supportedZwjEmojis = /* @__PURE__ */ new Map();
const VARIATION_SELECTOR = "\uFE0F";
const SKINTONE_MODIFIER = "\uD83C";
const ZWJ = "\u200D";
const LIGHT_SKIN_TONE = 127995;
const LIGHT_SKIN_TONE_MODIFIER = 57339;
function applySkinTone(str, skinTone) {
  if (skinTone === 0) {
    return str;
  }
  const zwjIndex = str.indexOf(ZWJ);
  if (zwjIndex !== -1) {
    return str.substring(0, zwjIndex) + String.fromCodePoint(LIGHT_SKIN_TONE + skinTone - 1) + str.substring(zwjIndex);
  }
  if (str.endsWith(VARIATION_SELECTOR)) {
    str = str.substring(0, str.length - 1);
  }
  return str + SKINTONE_MODIFIER + String.fromCodePoint(LIGHT_SKIN_TONE_MODIFIER + skinTone - 1);
}
function halt(event) {
  event.preventDefault();
  event.stopPropagation();
}
function incrementOrDecrement(decrement, val, arr) {
  val += decrement ? -1 : 1;
  if (val < 0) {
    val = arr.length - 1;
  } else if (val >= arr.length) {
    val = 0;
  }
  return val;
}
function uniqBy(arr, func) {
  const set2 = /* @__PURE__ */ new Set();
  const res = [];
  for (const item of arr) {
    const key = func(item);
    if (!set2.has(key)) {
      set2.add(key);
      res.push(item);
    }
  }
  return res;
}
function summarizeEmojisForUI(emojis, emojiSupportLevel) {
  const toSimpleSkinsMap = (skins) => {
    const res = {};
    for (const skin of skins) {
      if (typeof skin.tone === "number" && skin.version <= emojiSupportLevel) {
        res[skin.tone] = skin.unicode;
      }
    }
    return res;
  };
  return emojis.map(({ unicode, skins, shortcodes, url, name, category }) => ({
    unicode,
    name,
    shortcodes,
    url,
    category,
    id: unicode || name,
    skins: skins && toSimpleSkinsMap(skins),
    title: (shortcodes || []).join(", ")
  }));
}
const rAF = requestAnimationFrame;
let resizeObserverSupported = typeof ResizeObserver === "function";
function calculateWidth(node, onUpdate) {
  let resizeObserver;
  if (resizeObserverSupported) {
    resizeObserver = new ResizeObserver((entries) => onUpdate(entries[0].contentRect.width));
    resizeObserver.observe(node);
  } else {
    rAF(() => onUpdate(node.getBoundingClientRect().width));
  }
  return {
    destroy() {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    }
  };
}
function calculateTextWidth(node) {
  {
    const range = document.createRange();
    range.selectNode(node.firstChild);
    return range.getBoundingClientRect().width;
  }
}
let baselineEmojiWidth;
function checkZwjSupport(zwjEmojisToCheck, baselineEmoji, emojiToDomNode) {
  for (const emoji of zwjEmojisToCheck) {
    const domNode = emojiToDomNode(emoji);
    const emojiWidth = calculateTextWidth(domNode);
    if (typeof baselineEmojiWidth === "undefined") {
      baselineEmojiWidth = calculateTextWidth(baselineEmoji);
    }
    const supported = emojiWidth / 1.8 < baselineEmojiWidth;
    supportedZwjEmojis.set(emoji.unicode, supported);
  }
}
function uniq(arr) {
  return uniqBy(arr, (_) => _);
}
const { Map: Map_1 } = globals;
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[63] = list[i];
  child_ctx[65] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[66] = list[i];
  child_ctx[65] = i;
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[63] = list[i];
  child_ctx[65] = i;
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[69] = list[i];
  return child_ctx;
}
function get_each_context_4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[72] = list[i];
  child_ctx[65] = i;
  return child_ctx;
}
function create_each_block_4(key_1, ctx) {
  let div;
  let t_value = ctx[72] + "";
  let t;
  let div_id_value;
  let div_class_value;
  let div_aria_selected_value;
  let div_title_value;
  let div_aria_label_value;
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "id", div_id_value = "skintone-" + ctx[65]);
      attr(div, "class", div_class_value = "emoji hide-focus " + (ctx[65] === ctx[20] ? "active" : ""));
      attr(div, "aria-selected", div_aria_selected_value = ctx[65] === ctx[20]);
      attr(div, "role", "option");
      attr(div, "title", div_title_value = ctx[0].skinTones[ctx[65]]);
      attr(div, "tabindex", "-1");
      attr(div, "aria-label", div_aria_label_value = ctx[0].skinTones[ctx[65]]);
      this.first = div;
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 512 && t_value !== (t_value = ctx[72] + ""))
        set_data(t, t_value);
      if (dirty[0] & 512 && div_id_value !== (div_id_value = "skintone-" + ctx[65])) {
        attr(div, "id", div_id_value);
      }
      if (dirty[0] & 1049088 && div_class_value !== (div_class_value = "emoji hide-focus " + (ctx[65] === ctx[20] ? "active" : ""))) {
        attr(div, "class", div_class_value);
      }
      if (dirty[0] & 1049088 && div_aria_selected_value !== (div_aria_selected_value = ctx[65] === ctx[20])) {
        attr(div, "aria-selected", div_aria_selected_value);
      }
      if (dirty[0] & 513 && div_title_value !== (div_title_value = ctx[0].skinTones[ctx[65]])) {
        attr(div, "title", div_title_value);
      }
      if (dirty[0] & 513 && div_aria_label_value !== (div_aria_label_value = ctx[0].skinTones[ctx[65]])) {
        attr(div, "aria-label", div_aria_label_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block_3(key_1, ctx) {
  let button;
  let div;
  let t_value = ctx[69].emoji + "";
  let t;
  let button_aria_controls_value;
  let button_aria_label_value;
  let button_aria_selected_value;
  let button_title_value;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[49](ctx[69]);
  }
  return {
    key: key_1,
    first: null,
    c() {
      button = element("button");
      div = element("div");
      t = text(t_value);
      attr(div, "class", "nav-emoji emoji");
      attr(button, "role", "tab");
      attr(button, "class", "nav-button");
      attr(button, "aria-controls", button_aria_controls_value = "tab-" + ctx[69].id);
      attr(button, "aria-label", button_aria_label_value = ctx[0].categories[ctx[69].name]);
      attr(button, "aria-selected", button_aria_selected_value = !ctx[4] && ctx[13].id === ctx[69].id);
      attr(button, "title", button_title_value = ctx[0].categories[ctx[69].name]);
      this.first = button;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, div);
      append(div, t);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 4096 && t_value !== (t_value = ctx[69].emoji + ""))
        set_data(t, t_value);
      if (dirty[0] & 4096 && button_aria_controls_value !== (button_aria_controls_value = "tab-" + ctx[69].id)) {
        attr(button, "aria-controls", button_aria_controls_value);
      }
      if (dirty[0] & 4097 && button_aria_label_value !== (button_aria_label_value = ctx[0].categories[ctx[69].name])) {
        attr(button, "aria-label", button_aria_label_value);
      }
      if (dirty[0] & 12304 && button_aria_selected_value !== (button_aria_selected_value = !ctx[4] && ctx[13].id === ctx[69].id)) {
        attr(button, "aria-selected", button_aria_selected_value);
      }
      if (dirty[0] & 4097 && button_title_value !== (button_title_value = ctx[0].categories[ctx[69].name])) {
        attr(button, "title", button_title_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_else_block_1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      attr(img, "class", "custom-emoji");
      if (!src_url_equal(img.src, img_src_value = ctx[63].url))
        attr(img, "src", img_src_value);
      attr(img, "alt", "");
      attr(img, "loading", "lazy");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 32768 && !src_url_equal(img.src, img_src_value = ctx2[63].url)) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(img);
    }
  };
}
function create_if_block_1(ctx) {
  let t_value = ctx[27](ctx[63], ctx[8]) + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 33024 && t_value !== (t_value = ctx2[27](ctx2[63], ctx2[8]) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_each_block_2(key_1, ctx) {
  let button;
  let button_role_value;
  let button_aria_selected_value;
  let button_aria_label_value;
  let button_title_value;
  let button_class_value;
  let button_id_value;
  function select_block_type(ctx2, dirty) {
    if (ctx2[63].unicode)
      return create_if_block_1;
    return create_else_block_1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    key: key_1,
    first: null,
    c() {
      button = element("button");
      if_block.c();
      attr(button, "role", button_role_value = ctx[4] ? "option" : "menuitem");
      attr(button, "aria-selected", button_aria_selected_value = ctx[4] ? ctx[65] == ctx[5] : "");
      attr(button, "aria-label", button_aria_label_value = ctx[28](ctx[63], ctx[8]));
      attr(button, "title", button_title_value = ctx[63].title);
      attr(button, "class", button_class_value = "emoji " + (ctx[4] && ctx[65] === ctx[5] ? "active" : ""));
      attr(button, "id", button_id_value = "emo-" + ctx[63].id);
      this.first = button;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if_block.m(button, null);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);
        if (if_block) {
          if_block.c();
          if_block.m(button, null);
        }
      }
      if (dirty[0] & 16 && button_role_value !== (button_role_value = ctx[4] ? "option" : "menuitem")) {
        attr(button, "role", button_role_value);
      }
      if (dirty[0] & 32816 && button_aria_selected_value !== (button_aria_selected_value = ctx[4] ? ctx[65] == ctx[5] : "")) {
        attr(button, "aria-selected", button_aria_selected_value);
      }
      if (dirty[0] & 33024 && button_aria_label_value !== (button_aria_label_value = ctx[28](ctx[63], ctx[8]))) {
        attr(button, "aria-label", button_aria_label_value);
      }
      if (dirty[0] & 32768 && button_title_value !== (button_title_value = ctx[63].title)) {
        attr(button, "title", button_title_value);
      }
      if (dirty[0] & 32816 && button_class_value !== (button_class_value = "emoji " + (ctx[4] && ctx[65] === ctx[5] ? "active" : ""))) {
        attr(button, "class", button_class_value);
      }
      if (dirty[0] & 32768 && button_id_value !== (button_id_value = "emo-" + ctx[63].id)) {
        attr(button, "id", button_id_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if_block.d();
    }
  };
}
function create_each_block_1(key_1, ctx) {
  let div0;
  let t_value = (ctx[4] ? ctx[0].searchResultsLabel : ctx[66].category ? ctx[66].category : ctx[15].length > 1 ? ctx[0].categories.custom : ctx[0].categories[ctx[13].name]) + "";
  let t;
  let div0_id_value;
  let div0_class_value;
  let div1;
  let each_blocks = [];
  let each_1_lookup = new Map_1();
  let div1_role_value;
  let div1_aria_labelledby_value;
  let div1_id_value;
  let each_value_2 = ctx[66].emojis;
  const get_key = (ctx2) => ctx2[63].id;
  for (let i = 0; i < each_value_2.length; i += 1) {
    let child_ctx = get_each_context_2(ctx, each_value_2, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
  }
  return {
    key: key_1,
    first: null,
    c() {
      div0 = element("div");
      t = text(t_value);
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "id", div0_id_value = "menu-label-" + ctx[65]);
      attr(div0, "class", div0_class_value = "category " + (ctx[15].length === 1 && ctx[15][0].category === "" ? "gone" : ""));
      attr(div0, "aria-hidden", "true");
      attr(div1, "class", "emoji-menu");
      attr(div1, "role", div1_role_value = ctx[4] ? "listbox" : "menu");
      attr(div1, "aria-labelledby", div1_aria_labelledby_value = "menu-label-" + ctx[65]);
      attr(div1, "id", div1_id_value = ctx[4] ? "search-results" : "");
      this.first = div0;
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      append(div0, t);
      insert(target, div1, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div1, null);
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 40977 && t_value !== (t_value = (ctx[4] ? ctx[0].searchResultsLabel : ctx[66].category ? ctx[66].category : ctx[15].length > 1 ? ctx[0].categories.custom : ctx[0].categories[ctx[13].name]) + ""))
        set_data(t, t_value);
      if (dirty[0] & 32768 && div0_id_value !== (div0_id_value = "menu-label-" + ctx[65])) {
        attr(div0, "id", div0_id_value);
      }
      if (dirty[0] & 32768 && div0_class_value !== (div0_class_value = "category " + (ctx[15].length === 1 && ctx[15][0].category === "" ? "gone" : ""))) {
        attr(div0, "class", div0_class_value);
      }
      if (dirty[0] & 402686256) {
        each_value_2 = ctx[66].emojis;
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div1, destroy_block, create_each_block_2, null, get_each_context_2);
      }
      if (dirty[0] & 16 && div1_role_value !== (div1_role_value = ctx[4] ? "listbox" : "menu")) {
        attr(div1, "role", div1_role_value);
      }
      if (dirty[0] & 32768 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = "menu-label-" + ctx[65])) {
        attr(div1, "aria-labelledby", div1_aria_labelledby_value);
      }
      if (dirty[0] & 16 && div1_id_value !== (div1_id_value = ctx[4] ? "search-results" : "")) {
        attr(div1, "id", div1_id_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div0);
      if (detaching)
        detach(div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_else_block(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      attr(img, "class", "custom-emoji");
      if (!src_url_equal(img.src, img_src_value = ctx[63].url))
        attr(img, "src", img_src_value);
      attr(img, "alt", "");
      attr(img, "loading", "lazy");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 1024 && !src_url_equal(img.src, img_src_value = ctx2[63].url)) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(img);
    }
  };
}
function create_if_block(ctx) {
  let t_value = ctx[27](ctx[63], ctx[8]) + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 1280 && t_value !== (t_value = ctx2[27](ctx2[63], ctx2[8]) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_each_block(key_1, ctx) {
  let button;
  let button_aria_label_value;
  let button_title_value;
  let button_id_value;
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[63].unicode)
      return create_if_block;
    return create_else_block;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    key: key_1,
    first: null,
    c() {
      button = element("button");
      if_block.c();
      attr(button, "role", "menuitem");
      attr(button, "aria-label", button_aria_label_value = ctx[28](ctx[63], ctx[8]));
      attr(button, "title", button_title_value = ctx[63].title);
      attr(button, "class", "emoji");
      attr(button, "id", button_id_value = "fav-" + ctx[63].id);
      this.first = button;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if_block.m(button, null);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);
        if (if_block) {
          if_block.c();
          if_block.m(button, null);
        }
      }
      if (dirty[0] & 1280 && button_aria_label_value !== (button_aria_label_value = ctx[28](ctx[63], ctx[8]))) {
        attr(button, "aria-label", button_aria_label_value);
      }
      if (dirty[0] & 1024 && button_title_value !== (button_title_value = ctx[63].title)) {
        attr(button, "title", button_title_value);
      }
      if (dirty[0] & 1024 && button_id_value !== (button_id_value = "fav-" + ctx[63].id)) {
        attr(button, "id", button_id_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if_block.d();
    }
  };
}
function create_fragment(ctx) {
  let section;
  let div0;
  let div4;
  let div1;
  let input;
  let input_placeholder_value;
  let input_aria_expanded_value;
  let input_aria_activedescendant_value;
  let label;
  let t0_value = ctx[0].searchLabel + "";
  let t0;
  let span0;
  let t1_value = ctx[0].searchDescription + "";
  let t1;
  let div2;
  let button0;
  let t2;
  let button0_class_value;
  let div2_class_value;
  let span1;
  let t3_value = ctx[0].skinToneDescription + "";
  let t3;
  let div3;
  let each_blocks_3 = [];
  let each0_lookup = new Map_1();
  let div3_class_value;
  let div3_aria_label_value;
  let div3_aria_activedescendant_value;
  let div3_aria_hidden_value;
  let div5;
  let each_blocks_2 = [];
  let each1_lookup = new Map_1();
  let div5_aria_label_value;
  let div7;
  let div6;
  let div8;
  let t4;
  let div8_class_value;
  let div10;
  let div9;
  let each_blocks_1 = [];
  let each2_lookup = new Map_1();
  let div10_class_value;
  let div10_role_value;
  let div10_aria_label_value;
  let div10_id_value;
  let div11;
  let each_blocks = [];
  let each3_lookup = new Map_1();
  let div11_class_value;
  let div11_aria_label_value;
  let button1;
  let section_aria_label_value;
  let mounted;
  let dispose;
  let each_value_4 = ctx[9];
  const get_key = (ctx2) => ctx2[72];
  for (let i = 0; i < each_value_4.length; i += 1) {
    let child_ctx = get_each_context_4(ctx, each_value_4, i);
    let key = get_key(child_ctx);
    each0_lookup.set(key, each_blocks_3[i] = create_each_block_4(key, child_ctx));
  }
  let each_value_3 = ctx[12];
  const get_key_1 = (ctx2) => ctx2[69].id;
  for (let i = 0; i < each_value_3.length; i += 1) {
    let child_ctx = get_each_context_3(ctx, each_value_3, i);
    let key = get_key_1(child_ctx);
    each1_lookup.set(key, each_blocks_2[i] = create_each_block_3(key, child_ctx));
  }
  let each_value_1 = ctx[15];
  const get_key_2 = (ctx2) => ctx2[66].category;
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1(ctx, each_value_1, i);
    let key = get_key_2(child_ctx);
    each2_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
  }
  let each_value = ctx[10];
  const get_key_3 = (ctx2) => ctx2[63].id;
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key_3(child_ctx);
    each3_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  return {
    c() {
      section = element("section");
      div0 = element("div");
      div4 = element("div");
      div1 = element("div");
      input = element("input");
      label = element("label");
      t0 = text(t0_value);
      span0 = element("span");
      t1 = text(t1_value);
      div2 = element("div");
      button0 = element("button");
      t2 = text(ctx[21]);
      span1 = element("span");
      t3 = text(t3_value);
      div3 = element("div");
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      div5 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      div7 = element("div");
      div6 = element("div");
      div8 = element("div");
      t4 = text(ctx[18]);
      div10 = element("div");
      div9 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      div11 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      button1 = element("button");
      button1.textContent = "\u{1F600}";
      attr(div0, "class", "pad-top");
      attr(input, "id", "search");
      attr(input, "class", "search");
      attr(input, "type", "search");
      attr(input, "role", "combobox");
      attr(input, "enterkeyhint", "search");
      attr(input, "placeholder", input_placeholder_value = ctx[0].searchLabel);
      attr(input, "autocapitalize", "none");
      attr(input, "autocomplete", "off");
      attr(input, "spellcheck", "true");
      attr(input, "aria-expanded", input_aria_expanded_value = !!(ctx[4] && ctx[1].length));
      attr(input, "aria-controls", "search-results");
      attr(input, "aria-describedby", "search-description");
      attr(input, "aria-autocomplete", "list");
      attr(input, "aria-activedescendant", input_aria_activedescendant_value = ctx[26] ? `emo-${ctx[26]}` : "");
      attr(label, "class", "sr-only");
      attr(label, "for", "search");
      attr(span0, "id", "search-description");
      attr(span0, "class", "sr-only");
      attr(div1, "class", "search-wrapper");
      attr(button0, "id", "skintone-button");
      attr(button0, "class", button0_class_value = "emoji " + (ctx[6] ? "hide-focus" : ""));
      attr(button0, "aria-label", ctx[23]);
      attr(button0, "title", ctx[23]);
      attr(button0, "aria-describedby", "skintone-description");
      attr(button0, "aria-haspopup", "listbox");
      attr(button0, "aria-expanded", ctx[6]);
      attr(button0, "aria-controls", "skintone-list");
      attr(div2, "class", div2_class_value = "skintone-button-wrapper " + (ctx[19] ? "expanded" : ""));
      attr(span1, "id", "skintone-description");
      attr(span1, "class", "sr-only");
      attr(div3, "id", "skintone-list");
      attr(div3, "class", div3_class_value = "skintone-list " + (ctx[6] ? "" : "hidden no-animate"));
      set_style(div3, "transform", "translateY(" + (ctx[6] ? 0 : "calc(-1 * var(--num-skintones) * var(--total-emoji-size))") + ")");
      attr(div3, "role", "listbox");
      attr(div3, "aria-label", div3_aria_label_value = ctx[0].skinTonesLabel);
      attr(div3, "aria-activedescendant", div3_aria_activedescendant_value = "skintone-" + ctx[20]);
      attr(div3, "aria-hidden", div3_aria_hidden_value = !ctx[6]);
      attr(div4, "class", "search-row");
      attr(div5, "class", "nav");
      attr(div5, "role", "tablist");
      set_style(div5, "grid-template-columns", "repeat(" + ctx[12].length + ", 1fr)");
      attr(div5, "aria-label", div5_aria_label_value = ctx[0].categoriesLabel);
      attr(div6, "class", "indicator");
      set_style(div6, "transform", "translateX(" + (ctx[24] ? -1 : 1) * ctx[11] * 100 + "%)");
      attr(div7, "class", "indicator-wrapper");
      attr(div8, "class", div8_class_value = "message " + (ctx[18] ? "" : "gone"));
      attr(div8, "role", "alert");
      attr(div8, "aria-live", "polite");
      attr(div10, "class", div10_class_value = "tabpanel " + (!ctx[14] || ctx[18] ? "gone" : ""));
      attr(div10, "role", div10_role_value = ctx[4] ? "region" : "tabpanel");
      attr(div10, "aria-label", div10_aria_label_value = ctx[4] ? ctx[0].searchResultsLabel : ctx[0].categories[ctx[13].name]);
      attr(div10, "id", div10_id_value = ctx[4] ? "" : `tab-${ctx[13].id}`);
      attr(div10, "tabindex", "0");
      attr(div11, "class", div11_class_value = "favorites emoji-menu " + (ctx[18] ? "gone" : ""));
      attr(div11, "role", "menu");
      attr(div11, "aria-label", div11_aria_label_value = ctx[0].favoritesLabel);
      set_style(div11, "padding-inline-end", ctx[25] + "px");
      attr(button1, "aria-hidden", "true");
      attr(button1, "tabindex", "-1");
      attr(button1, "class", "abs-pos hidden emoji");
      attr(section, "class", "picker");
      attr(section, "aria-label", section_aria_label_value = ctx[0].regionLabel);
      attr(section, "style", ctx[22]);
    },
    m(target, anchor) {
      insert(target, section, anchor);
      append(section, div0);
      append(section, div4);
      append(div4, div1);
      append(div1, input);
      set_input_value(input, ctx[2]);
      append(div1, label);
      append(label, t0);
      append(div1, span0);
      append(span0, t1);
      append(div4, div2);
      append(div2, button0);
      append(button0, t2);
      append(div4, span1);
      append(span1, t3);
      append(div4, div3);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].m(div3, null);
      }
      ctx[48](div3);
      append(section, div5);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].m(div5, null);
      }
      append(section, div7);
      append(div7, div6);
      append(section, div8);
      append(div8, t4);
      append(section, div10);
      append(div10, div9);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].m(div9, null);
      }
      ctx[50](div10);
      append(section, div11);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div11, null);
      }
      append(section, button1);
      ctx[51](button1);
      ctx[52](section);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[47]),
          listen(input, "keydown", ctx[30]),
          listen(button0, "click", ctx[35]),
          listen(div3, "focusout", ctx[38]),
          listen(div3, "click", ctx[34]),
          listen(div3, "keydown", ctx[36]),
          listen(div3, "keyup", ctx[37]),
          listen(div5, "keydown", ctx[32]),
          action_destroyer(ctx[29].call(null, div9)),
          listen(div10, "click", ctx[33]),
          listen(div11, "click", ctx[33])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 1 && input_placeholder_value !== (input_placeholder_value = ctx2[0].searchLabel)) {
        attr(input, "placeholder", input_placeholder_value);
      }
      if (dirty[0] & 18 && input_aria_expanded_value !== (input_aria_expanded_value = !!(ctx2[4] && ctx2[1].length))) {
        attr(input, "aria-expanded", input_aria_expanded_value);
      }
      if (dirty[0] & 67108864 && input_aria_activedescendant_value !== (input_aria_activedescendant_value = ctx2[26] ? `emo-${ctx2[26]}` : "")) {
        attr(input, "aria-activedescendant", input_aria_activedescendant_value);
      }
      if (dirty[0] & 4) {
        set_input_value(input, ctx2[2]);
      }
      if (dirty[0] & 1 && t0_value !== (t0_value = ctx2[0].searchLabel + ""))
        set_data(t0, t0_value);
      if (dirty[0] & 1 && t1_value !== (t1_value = ctx2[0].searchDescription + ""))
        set_data(t1, t1_value);
      if (dirty[0] & 2097152)
        set_data(t2, ctx2[21]);
      if (dirty[0] & 64 && button0_class_value !== (button0_class_value = "emoji " + (ctx2[6] ? "hide-focus" : ""))) {
        attr(button0, "class", button0_class_value);
      }
      if (dirty[0] & 8388608) {
        attr(button0, "aria-label", ctx2[23]);
      }
      if (dirty[0] & 8388608) {
        attr(button0, "title", ctx2[23]);
      }
      if (dirty[0] & 64) {
        attr(button0, "aria-expanded", ctx2[6]);
      }
      if (dirty[0] & 524288 && div2_class_value !== (div2_class_value = "skintone-button-wrapper " + (ctx2[19] ? "expanded" : ""))) {
        attr(div2, "class", div2_class_value);
      }
      if (dirty[0] & 1 && t3_value !== (t3_value = ctx2[0].skinToneDescription + ""))
        set_data(t3, t3_value);
      if (dirty[0] & 1049089) {
        each_value_4 = ctx2[9];
        each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx2, each_value_4, each0_lookup, div3, destroy_block, create_each_block_4, null, get_each_context_4);
      }
      if (dirty[0] & 64 && div3_class_value !== (div3_class_value = "skintone-list " + (ctx2[6] ? "" : "hidden no-animate"))) {
        attr(div3, "class", div3_class_value);
      }
      if (dirty[0] & 64) {
        set_style(div3, "transform", "translateY(" + (ctx2[6] ? 0 : "calc(-1 * var(--num-skintones) * var(--total-emoji-size))") + ")");
      }
      if (dirty[0] & 1 && div3_aria_label_value !== (div3_aria_label_value = ctx2[0].skinTonesLabel)) {
        attr(div3, "aria-label", div3_aria_label_value);
      }
      if (dirty[0] & 1048576 && div3_aria_activedescendant_value !== (div3_aria_activedescendant_value = "skintone-" + ctx2[20])) {
        attr(div3, "aria-activedescendant", div3_aria_activedescendant_value);
      }
      if (dirty[0] & 64 && div3_aria_hidden_value !== (div3_aria_hidden_value = !ctx2[6])) {
        attr(div3, "aria-hidden", div3_aria_hidden_value);
      }
      if (dirty[0] & 12305 | dirty[1] & 1) {
        each_value_3 = ctx2[12];
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx2, each_value_3, each1_lookup, div5, destroy_block, create_each_block_3, null, get_each_context_3);
      }
      if (dirty[0] & 4096) {
        set_style(div5, "grid-template-columns", "repeat(" + ctx2[12].length + ", 1fr)");
      }
      if (dirty[0] & 1 && div5_aria_label_value !== (div5_aria_label_value = ctx2[0].categoriesLabel)) {
        attr(div5, "aria-label", div5_aria_label_value);
      }
      if (dirty[0] & 16779264) {
        set_style(div6, "transform", "translateX(" + (ctx2[24] ? -1 : 1) * ctx2[11] * 100 + "%)");
      }
      if (dirty[0] & 262144)
        set_data(t4, ctx2[18]);
      if (dirty[0] & 262144 && div8_class_value !== (div8_class_value = "message " + (ctx2[18] ? "" : "gone"))) {
        attr(div8, "class", div8_class_value);
      }
      if (dirty[0] & 402694449) {
        each_value_1 = ctx2[15];
        each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_2, 1, ctx2, each_value_1, each2_lookup, div9, destroy_block, create_each_block_1, null, get_each_context_1);
      }
      if (dirty[0] & 278528 && div10_class_value !== (div10_class_value = "tabpanel " + (!ctx2[14] || ctx2[18] ? "gone" : ""))) {
        attr(div10, "class", div10_class_value);
      }
      if (dirty[0] & 16 && div10_role_value !== (div10_role_value = ctx2[4] ? "region" : "tabpanel")) {
        attr(div10, "role", div10_role_value);
      }
      if (dirty[0] & 8209 && div10_aria_label_value !== (div10_aria_label_value = ctx2[4] ? ctx2[0].searchResultsLabel : ctx2[0].categories[ctx2[13].name])) {
        attr(div10, "aria-label", div10_aria_label_value);
      }
      if (dirty[0] & 8208 && div10_id_value !== (div10_id_value = ctx2[4] ? "" : `tab-${ctx2[13].id}`)) {
        attr(div10, "id", div10_id_value);
      }
      if (dirty[0] & 402654464) {
        each_value = ctx2[10];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx2, each_value, each3_lookup, div11, destroy_block, create_each_block, null, get_each_context);
      }
      if (dirty[0] & 262144 && div11_class_value !== (div11_class_value = "favorites emoji-menu " + (ctx2[18] ? "gone" : ""))) {
        attr(div11, "class", div11_class_value);
      }
      if (dirty[0] & 1 && div11_aria_label_value !== (div11_aria_label_value = ctx2[0].favoritesLabel)) {
        attr(div11, "aria-label", div11_aria_label_value);
      }
      if (dirty[0] & 33554432) {
        set_style(div11, "padding-inline-end", ctx2[25] + "px");
      }
      if (dirty[0] & 1 && section_aria_label_value !== (section_aria_label_value = ctx2[0].regionLabel)) {
        attr(section, "aria-label", section_aria_label_value);
      }
      if (dirty[0] & 4194304) {
        attr(section, "style", ctx2[22]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(section);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].d();
      }
      ctx[48](null);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].d();
      }
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].d();
      }
      ctx[50](null);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      ctx[51](null);
      ctx[52](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { skinToneEmoji } = $$props;
  let { i18n } = $$props;
  let { database } = $$props;
  let { customEmoji } = $$props;
  let { customCategorySorting } = $$props;
  let initialLoad = true;
  let currentEmojis = [];
  let currentEmojisWithCategories = [];
  let rawSearchText = "";
  let searchText = "";
  let rootElement;
  let baselineEmoji;
  let tabpanelElement;
  let searchMode = false;
  let activeSearchItem = -1;
  let message;
  let skinTonePickerExpanded = false;
  let skinTonePickerExpandedAfterAnimation = false;
  let skinToneDropdown;
  let currentSkinTone = 0;
  let activeSkinTone = 0;
  let skinToneButtonText;
  let pickerStyle;
  let skinToneButtonLabel = "";
  let skinTones = [];
  let currentFavorites = [];
  let defaultFavoriteEmojis;
  let numColumns = DEFAULT_NUM_COLUMNS;
  let isRtl = false;
  let scrollbarWidth = 0;
  let currentGroupIndex = 0;
  let groups$1 = groups;
  let currentGroup;
  let databaseLoaded = false;
  let activeSearchItemId;
  const focus = (id) => {
    rootElement.getRootNode().getElementById(id).focus();
  };
  const fireEvent = (name, detail) => {
    rootElement.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  };
  const unicodeWithSkin = (emoji, currentSkinTone2) => currentSkinTone2 && emoji.skins && emoji.skins[currentSkinTone2] || emoji.unicode;
  const labelWithSkin = (emoji, currentSkinTone2) => uniq([
    emoji.name || unicodeWithSkin(emoji, currentSkinTone2),
    ...emoji.shortcodes || []
  ]).join(", ");
  const isSkinToneOption = (element2) => /^skintone-/.test(element2.id);
  emojiSupportLevelPromise.then((level) => {
    if (!level) {
      $$invalidate(18, message = i18n.emojiUnsupportedMessage);
    }
  });
  function calculateEmojiGridStyle(node) {
    return calculateWidth(node, (width) => {
      {
        const style = getComputedStyle(rootElement);
        const newNumColumns = parseInt(style.getPropertyValue("--num-columns"), 10);
        const newIsRtl = style.getPropertyValue("direction") === "rtl";
        const parentWidth = node.parentElement.getBoundingClientRect().width;
        const newScrollbarWidth = parentWidth - width;
        $$invalidate(46, numColumns = newNumColumns);
        $$invalidate(25, scrollbarWidth = newScrollbarWidth);
        $$invalidate(24, isRtl = newIsRtl);
      }
    });
  }
  function checkZwjSupportAndUpdate(zwjEmojisToCheck) {
    const rootNode = rootElement.getRootNode();
    const emojiToDomNode = (emoji) => rootNode.getElementById(`emo-${emoji.id}`);
    checkZwjSupport(zwjEmojisToCheck, baselineEmoji, emojiToDomNode);
    $$invalidate(1, currentEmojis = currentEmojis);
  }
  function isZwjSupported(emoji) {
    return !emoji.unicode || !hasZwj(emoji) || supportedZwjEmojis.get(emoji.unicode);
  }
  async function filterEmojisByVersion(emojis) {
    const emojiSupportLevel = await emojiSupportLevelPromise;
    return emojis.filter(({ version: version2 }) => !version2 || version2 <= emojiSupportLevel);
  }
  async function summarizeEmojis(emojis) {
    return summarizeEmojisForUI(emojis, await emojiSupportLevelPromise);
  }
  async function getEmojisByGroup(group) {
    if (typeof group === "undefined") {
      return [];
    }
    const emoji = group === -1 ? customEmoji : await database.getEmojiByGroup(group);
    return summarizeEmojis(await filterEmojisByVersion(emoji));
  }
  async function getEmojisBySearchQuery(query) {
    return summarizeEmojis(await filterEmojisByVersion(await database.getEmojiBySearchQuery(query)));
  }
  function onSearchKeydown(event) {
    if (!searchMode || !currentEmojis.length) {
      return;
    }
    const goToNextOrPrevious = (previous) => {
      halt(event);
      $$invalidate(5, activeSearchItem = incrementOrDecrement(previous, activeSearchItem, currentEmojis));
    };
    switch (event.key) {
      case "ArrowDown":
        return goToNextOrPrevious(false);
      case "ArrowUp":
        return goToNextOrPrevious(true);
      case "Enter":
        if (activeSearchItem !== -1) {
          halt(event);
          return clickEmoji(currentEmojis[activeSearchItem].id);
        } else if (currentEmojis.length) {
          $$invalidate(5, activeSearchItem = 0);
        }
    }
  }
  function onNavClick(group) {
    $$invalidate(2, rawSearchText = "");
    $$invalidate(44, searchText = "");
    $$invalidate(5, activeSearchItem = -1);
    $$invalidate(11, currentGroupIndex = groups$1.findIndex((_) => _.id === group.id));
  }
  function onNavKeydown(event) {
    const { target, key } = event;
    const doFocus = (el) => {
      if (el) {
        halt(event);
        el.focus();
      }
    };
    switch (key) {
      case "ArrowLeft":
        return doFocus(target.previousSibling);
      case "ArrowRight":
        return doFocus(target.nextSibling);
      case "Home":
        return doFocus(target.parentElement.firstChild);
      case "End":
        return doFocus(target.parentElement.lastChild);
    }
  }
  async function clickEmoji(unicodeOrName) {
    const emoji = await database.getEmojiByUnicodeOrName(unicodeOrName);
    const emojiSummary = [...currentEmojis, ...currentFavorites].find((_) => _.id === unicodeOrName);
    const skinTonedUnicode = emojiSummary.unicode && unicodeWithSkin(emojiSummary, currentSkinTone);
    await database.incrementFavoriteEmojiCount(unicodeOrName);
    fireEvent("emoji-click", {
      emoji,
      skinTone: currentSkinTone,
      ...skinTonedUnicode && { unicode: skinTonedUnicode },
      ...emojiSummary.name && { name: emojiSummary.name }
    });
  }
  async function onEmojiClick(event) {
    const { target } = event;
    if (!target.classList.contains("emoji")) {
      return;
    }
    halt(event);
    const id = target.id.substring(4);
    clickEmoji(id);
  }
  async function onSkinToneOptionsClick(event) {
    const { target } = event;
    if (!isSkinToneOption(target)) {
      return;
    }
    halt(event);
    const skinTone = parseInt(target.id.slice(9), 10);
    $$invalidate(8, currentSkinTone = skinTone);
    $$invalidate(6, skinTonePickerExpanded = false);
    focus("skintone-button");
    fireEvent("skin-tone-change", { skinTone });
    database.setPreferredSkinTone(skinTone);
  }
  async function onClickSkinToneButton(event) {
    $$invalidate(6, skinTonePickerExpanded = !skinTonePickerExpanded);
    $$invalidate(20, activeSkinTone = currentSkinTone);
    if (skinTonePickerExpanded) {
      halt(event);
      rAF(() => focus(`skintone-${activeSkinTone}`));
    }
  }
  function onSkinToneOptionsKeydown(event) {
    if (!skinTonePickerExpanded) {
      return;
    }
    const changeActiveSkinTone = async (nextSkinTone) => {
      halt(event);
      $$invalidate(20, activeSkinTone = nextSkinTone);
      await tick();
      focus(`skintone-${activeSkinTone}`);
    };
    switch (event.key) {
      case "ArrowUp":
        return changeActiveSkinTone(incrementOrDecrement(true, activeSkinTone, skinTones));
      case "ArrowDown":
        return changeActiveSkinTone(incrementOrDecrement(false, activeSkinTone, skinTones));
      case "Home":
        return changeActiveSkinTone(0);
      case "End":
        return changeActiveSkinTone(skinTones.length - 1);
      case "Enter":
        return onSkinToneOptionsClick(event);
      case "Escape":
        halt(event);
        $$invalidate(6, skinTonePickerExpanded = false);
        return focus("skintone-button");
    }
  }
  function onSkinToneOptionsKeyup(event) {
    if (!skinTonePickerExpanded) {
      return;
    }
    switch (event.key) {
      case " ":
        return onSkinToneOptionsClick(event);
    }
  }
  async function onSkinToneOptionsFocusOut(event) {
    const { relatedTarget } = event;
    if (!relatedTarget || !isSkinToneOption(relatedTarget)) {
      $$invalidate(6, skinTonePickerExpanded = false);
    }
  }
  function input_input_handler() {
    rawSearchText = this.value;
    $$invalidate(2, rawSearchText);
  }
  function div3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      skinToneDropdown = $$value;
      $$invalidate(7, skinToneDropdown);
    });
  }
  const click_handler = (group) => onNavClick(group);
  function div10_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      tabpanelElement = $$value;
      $$invalidate(3, tabpanelElement);
    });
  }
  function button1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      baselineEmoji = $$value;
      $$invalidate(17, baselineEmoji);
    });
  }
  function section_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      rootElement = $$value;
      $$invalidate(16, rootElement);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("skinToneEmoji" in $$props2)
      $$invalidate(40, skinToneEmoji = $$props2.skinToneEmoji);
    if ("i18n" in $$props2)
      $$invalidate(0, i18n = $$props2.i18n);
    if ("database" in $$props2)
      $$invalidate(39, database = $$props2.database);
    if ("customEmoji" in $$props2)
      $$invalidate(41, customEmoji = $$props2.customEmoji);
    if ("customCategorySorting" in $$props2)
      $$invalidate(42, customCategorySorting = $$props2.customCategorySorting);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[1] & 1280) {
      {
        if (customEmoji && database) {
          $$invalidate(39, database.customEmoji = customEmoji, database);
        }
      }
    }
    if ($$self.$$.dirty[0] & 1 | $$self.$$.dirty[1] & 256) {
      {
        async function handleDatabaseLoading() {
          let showingLoadingMessage = false;
          const timeoutHandle = setTimeout(
            () => {
              showingLoadingMessage = true;
              $$invalidate(18, message = i18n.loadingMessage);
            },
            TIMEOUT_BEFORE_LOADING_MESSAGE
          );
          try {
            await database.ready();
            $$invalidate(14, databaseLoaded = true);
          } catch (err) {
            console.error(err);
            $$invalidate(18, message = i18n.networkErrorMessage);
          } finally {
            clearTimeout(timeoutHandle);
            if (showingLoadingMessage) {
              showingLoadingMessage = false;
              $$invalidate(18, message = "");
            }
          }
        }
        if (database) {
          handleDatabaseLoading();
        }
      }
    }
    if ($$self.$$.dirty[0] & 6144 | $$self.$$.dirty[1] & 1024) {
      {
        if (customEmoji && customEmoji.length) {
          $$invalidate(12, groups$1 = [customGroup, ...groups]);
        } else if (groups$1 !== groups) {
          if (currentGroupIndex) {
            $$invalidate(11, currentGroupIndex--, currentGroupIndex);
          }
          $$invalidate(12, groups$1 = groups);
        }
      }
    }
    if ($$self.$$.dirty[0] & 4) {
      {
        rIC(() => {
          $$invalidate(44, searchText = (rawSearchText || "").trim());
          $$invalidate(5, activeSearchItem = -1);
        });
      }
    }
    if ($$self.$$.dirty[0] & 6144) {
      $$invalidate(13, currentGroup = groups$1[currentGroupIndex]);
    }
    if ($$self.$$.dirty[0] & 24576 | $$self.$$.dirty[1] & 8192) {
      {
        async function updateEmojis() {
          if (!databaseLoaded) {
            $$invalidate(1, currentEmojis = []);
            $$invalidate(4, searchMode = false);
          } else if (searchText.length >= MIN_SEARCH_TEXT_LENGTH) {
            const currentSearchText = searchText;
            const newEmojis = await getEmojisBySearchQuery(currentSearchText);
            if (currentSearchText === searchText) {
              $$invalidate(1, currentEmojis = newEmojis);
              $$invalidate(4, searchMode = true);
            }
          } else if (currentGroup) {
            const currentGroupId = currentGroup.id;
            const newEmojis = await getEmojisByGroup(currentGroupId);
            if (currentGroupId === currentGroup.id) {
              $$invalidate(1, currentEmojis = newEmojis);
              $$invalidate(4, searchMode = false);
            }
          }
        }
        updateEmojis();
      }
    }
    if ($$self.$$.dirty[0] & 4112) {
      $$invalidate(22, pickerStyle = `
  --font-family: ${FONT_FAMILY};
  --num-groups: ${groups$1.length}; 
  --indicator-opacity: ${searchMode ? 0 : 1}; 
  --num-skintones: ${NUM_SKIN_TONES};`);
    }
    if ($$self.$$.dirty[0] & 16384 | $$self.$$.dirty[1] & 256) {
      {
        async function updatePreferredSkinTone() {
          if (databaseLoaded) {
            $$invalidate(8, currentSkinTone = await database.getPreferredSkinTone());
          }
        }
        updatePreferredSkinTone();
      }
    }
    if ($$self.$$.dirty[1] & 512) {
      $$invalidate(9, skinTones = Array(NUM_SKIN_TONES).fill().map((_, i) => applySkinTone(skinToneEmoji, i)));
    }
    if ($$self.$$.dirty[0] & 768) {
      $$invalidate(21, skinToneButtonText = skinTones[currentSkinTone]);
    }
    if ($$self.$$.dirty[0] & 257) {
      $$invalidate(23, skinToneButtonLabel = i18n.skinToneLabel.replace("{skinTone}", i18n.skinTones[currentSkinTone]));
    }
    if ($$self.$$.dirty[0] & 16384 | $$self.$$.dirty[1] & 256) {
      {
        async function updateDefaultFavoriteEmojis() {
          $$invalidate(45, defaultFavoriteEmojis = (await Promise.all(MOST_COMMONLY_USED_EMOJI.map((unicode) => database.getEmojiByUnicodeOrName(unicode)))).filter(Boolean));
        }
        if (databaseLoaded) {
          updateDefaultFavoriteEmojis();
        }
      }
    }
    if ($$self.$$.dirty[0] & 16384 | $$self.$$.dirty[1] & 49408) {
      {
        async function updateFavorites() {
          const dbFavorites = await database.getTopFavoriteEmoji(numColumns);
          const favorites = await summarizeEmojis(uniqBy([...dbFavorites, ...defaultFavoriteEmojis], (_) => _.unicode || _.name).slice(0, numColumns));
          $$invalidate(10, currentFavorites = favorites);
        }
        if (databaseLoaded && defaultFavoriteEmojis) {
          updateFavorites();
        }
      }
    }
    if ($$self.$$.dirty[0] & 10) {
      {
        const zwjEmojisToCheck = currentEmojis.filter((emoji) => emoji.unicode).filter((emoji) => hasZwj(emoji) && !supportedZwjEmojis.has(emoji.unicode));
        if (zwjEmojisToCheck.length) {
          rAF(() => checkZwjSupportAndUpdate(zwjEmojisToCheck));
        } else {
          $$invalidate(1, currentEmojis = currentEmojis.filter(isZwjSupported));
          rAF(() => {
            (tabpanelElement || {}).scrollTop = 0;
          });
        }
      }
    }
    if ($$self.$$.dirty[0] & 1026 | $$self.$$.dirty[1] & 4096)
      ;
    if ($$self.$$.dirty[0] & 18 | $$self.$$.dirty[1] & 2048) {
      {
        let calculateCurrentEmojisWithCategories = function() {
          if (searchMode) {
            return [{ category: "", emojis: currentEmojis }];
          }
          const categoriesToEmoji = /* @__PURE__ */ new Map();
          for (const emoji of currentEmojis) {
            const category = emoji.category || "";
            let emojis = categoriesToEmoji.get(category);
            if (!emojis) {
              emojis = [];
              categoriesToEmoji.set(category, emojis);
            }
            emojis.push(emoji);
          }
          return [...categoriesToEmoji.entries()].map(([category, emojis]) => ({ category, emojis })).sort((a, b) => customCategorySorting(a.category, b.category));
        };
        $$invalidate(15, currentEmojisWithCategories = calculateCurrentEmojisWithCategories());
      }
    }
    if ($$self.$$.dirty[0] & 34) {
      $$invalidate(26, activeSearchItemId = activeSearchItem !== -1 && currentEmojis[activeSearchItem].id);
    }
    if ($$self.$$.dirty[0] & 192) {
      {
        if (skinTonePickerExpanded) {
          skinToneDropdown.addEventListener(
            "transitionend",
            () => {
              $$invalidate(19, skinTonePickerExpandedAfterAnimation = true);
            },
            { once: true }
          );
        } else {
          $$invalidate(19, skinTonePickerExpandedAfterAnimation = false);
        }
      }
    }
  };
  return [
    i18n,
    currentEmojis,
    rawSearchText,
    tabpanelElement,
    searchMode,
    activeSearchItem,
    skinTonePickerExpanded,
    skinToneDropdown,
    currentSkinTone,
    skinTones,
    currentFavorites,
    currentGroupIndex,
    groups$1,
    currentGroup,
    databaseLoaded,
    currentEmojisWithCategories,
    rootElement,
    baselineEmoji,
    message,
    skinTonePickerExpandedAfterAnimation,
    activeSkinTone,
    skinToneButtonText,
    pickerStyle,
    skinToneButtonLabel,
    isRtl,
    scrollbarWidth,
    activeSearchItemId,
    unicodeWithSkin,
    labelWithSkin,
    calculateEmojiGridStyle,
    onSearchKeydown,
    onNavClick,
    onNavKeydown,
    onEmojiClick,
    onSkinToneOptionsClick,
    onClickSkinToneButton,
    onSkinToneOptionsKeydown,
    onSkinToneOptionsKeyup,
    onSkinToneOptionsFocusOut,
    database,
    skinToneEmoji,
    customEmoji,
    customCategorySorting,
    initialLoad,
    searchText,
    defaultFavoriteEmojis,
    numColumns,
    input_input_handler,
    div3_binding,
    click_handler,
    div10_binding,
    button1_binding,
    section_binding
  ];
}
class Picker extends SvelteComponent {
  constructor(options2) {
    super();
    init(
      this,
      options2,
      instance,
      create_fragment,
      safe_not_equal,
      {
        skinToneEmoji: 40,
        i18n: 0,
        database: 39,
        customEmoji: 41,
        customCategorySorting: 42
      },
      null,
      [-1, -1, -1]
    );
  }
}
const DEFAULT_DATA_SOURCE = "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json";
const DEFAULT_LOCALE = "en";
var enI18n = {
  categoriesLabel: "Categories",
  emojiUnsupportedMessage: "Your browser does not support color emoji.",
  favoritesLabel: "Favorites",
  loadingMessage: "Loading\u2026",
  networkErrorMessage: "Could not load emoji.",
  regionLabel: "Emoji picker",
  searchDescription: "When search results are available, press up or down to select and enter to choose.",
  searchLabel: "Search",
  searchResultsLabel: "Search results",
  skinToneDescription: "When expanded, press up or down to select and enter to choose.",
  skinToneLabel: "Choose a skin tone (currently {skinTone})",
  skinTonesLabel: "Skin tones",
  skinTones: [
    "Default",
    "Light",
    "Medium-Light",
    "Medium",
    "Medium-Dark",
    "Dark"
  ],
  categories: {
    custom: "Custom",
    "smileys-emotion": "Smileys and emoticons",
    "people-body": "People and body",
    "animals-nature": "Animals and nature",
    "food-drink": "Food and drink",
    "travel-places": "Travel and places",
    activities: "Activities",
    objects: "Objects",
    symbols: "Symbols",
    flags: "Flags"
  }
};
const PROPS = [
  "customEmoji",
  "customCategorySorting",
  "database",
  "dataSource",
  "i18n",
  "locale",
  "skinToneEmoji"
];
class PickerElement extends HTMLElement {
  constructor(props) {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = ":host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.custom-emoji,.emoji,button.emoji{height:var(--total-emoji-size);width:var(--total-emoji-size)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;line-height:1;overflow:hidden;font-family:var(--font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.custom-emoji{padding:var(--emoji-padding);object-fit:contain;pointer-events:none;background-repeat:no-repeat;background-position:center center;background-size:var(--emoji-size) var(--emoji-size)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}";
    this.shadowRoot.appendChild(style);
    this._ctx = {
      locale: DEFAULT_LOCALE,
      dataSource: DEFAULT_DATA_SOURCE,
      skinToneEmoji: DEFAULT_SKIN_TONE_EMOJI,
      customCategorySorting: DEFAULT_CATEGORY_SORTING,
      customEmoji: null,
      i18n: enI18n,
      ...props
    };
    for (const prop of PROPS) {
      if (prop !== "database" && Object.prototype.hasOwnProperty.call(this, prop)) {
        this._ctx[prop] = this[prop];
        delete this[prop];
      }
    }
    this._dbFlush();
  }
  connectedCallback() {
    this._cmp = new Picker({
      target: this.shadowRoot,
      props: this._ctx
    });
  }
  disconnectedCallback() {
    this._cmp.$destroy();
    this._cmp = void 0;
    const { database } = this._ctx;
    if (database) {
      database.close().catch((err) => console.error(err));
    }
  }
  static get observedAttributes() {
    return ["locale", "data-source", "skin-tone-emoji"];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    this._set(
      attrName.replace(/-([a-z])/g, (_, up) => up.toUpperCase()),
      newValue
    );
  }
  _set(prop, newValue) {
    this._ctx[prop] = newValue;
    if (this._cmp) {
      this._cmp.$set({ [prop]: newValue });
    }
    if (["locale", "dataSource"].includes(prop)) {
      this._dbFlush();
    }
  }
  _dbCreate() {
    const { locale, dataSource, database } = this._ctx;
    if (!database || database.locale !== locale || database.dataSource !== dataSource) {
      this._set("database", new Database({ locale, dataSource }));
    }
  }
  _dbFlush() {
    Promise.resolve().then(() => this._dbCreate());
  }
}
const definitions = {};
for (const prop of PROPS) {
  definitions[prop] = {
    get() {
      if (prop === "database") {
        this._dbCreate();
      }
      return this._ctx[prop];
    },
    set(val) {
      if (prop === "database") {
        throw new Error("database is read-only");
      }
      this._set(prop, val);
    }
  };
}
Object.defineProperties(PickerElement.prototype, definitions);
if (!customElements.get("emoji-picker")) {
  customElements.define("emoji-picker", PickerElement);
}
const _sfc_main$j = {
  name: "EmojiPickerContainer",
  components: {
    SvgIcon
  },
  props: {
    emojiOpened: { type: Boolean, default: false },
    emojiReaction: { type: Boolean, default: false },
    positionTop: { type: Boolean, default: false },
    positionRight: { type: Boolean, default: false },
    messageId: { type: String, default: "" }
  },
  emits: ["add-emoji", "open-emoji"],
  data() {
    return {
      emojiPickerHeight: 320,
      emojiPickerTop: 0,
      emojiPickerRight: ""
    };
  },
  watch: {
    emojiOpened(val) {
      if (val) {
        setTimeout(() => {
          this.addCustomStyling();
          this.$refs.emojiPicker.shadowRoot.addEventListener(
            "emoji-click",
            ({ detail }) => {
              this.$emit("add-emoji", {
                unicode: detail.unicode
              });
            }
          );
        }, 0);
      }
    }
  },
  methods: {
    addCustomStyling() {
      const picker = `.picker {
				border: none;
			}`;
      const nav = `.nav {
				overflow-x: auto;
			}`;
      const searchBox = `.search-wrapper {
				padding-right: 2px;
				padding-left: 2px;
			}`;
      const search = `input.search {
				height: 32px;
				font-size: 14px;
				border-radius: 10rem;
				border: var(--chat-border-style);
				padding: 5px 10px;
				outline: none;
				background: var(--chat-bg-color-input);
				color: var(--chat-color);
			}`;
      const style = document.createElement("style");
      style.textContent = picker + nav + searchBox + search;
      this.$refs.emojiPicker.shadowRoot.appendChild(style);
    },
    openEmoji(ev) {
      this.$emit("open-emoji", !this.emojiOpened);
      this.setEmojiPickerPosition(
        ev.clientY,
        ev.view.innerWidth,
        ev.view.innerHeight
      );
    },
    setEmojiPickerPosition(clientY, innerWidth, innerHeight) {
      const mobileSize = innerWidth < 500 || innerHeight < 700;
      const roomFooterRef = document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer");
      if (!roomFooterRef) {
        if (mobileSize)
          this.emojiPickerRight = "-50px";
        return;
      }
      if (mobileSize) {
        this.emojiPickerRight = innerWidth / 2 - (this.positionTop ? 200 : 150) + "px";
        this.emojiPickerTop = 100;
        this.emojiPickerHeight = innerHeight - 200;
      } else {
        const roomFooterTop = roomFooterRef.getBoundingClientRect().top;
        const pickerTopPosition = roomFooterTop - clientY > this.emojiPickerHeight - 50;
        if (pickerTopPosition)
          this.emojiPickerTop = clientY + 10;
        else
          this.emojiPickerTop = clientY - this.emojiPickerHeight - 10;
        this.emojiPickerRight = this.positionTop ? "0px" : this.positionRight ? "60px" : "";
      }
    }
  }
};
const _hoisted_1$j = { class: "vac-emoji-wrapper" };
const _hoisted_2$f = {
  ref: "emojiPicker",
  "v-if": "emojiOpened"
};
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", _hoisted_1$j, [
    createBaseVNode("div", {
      class: normalizeClass(["vac-svg-button", { "vac-emoji-reaction": $props.emojiReaction }]),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.openEmoji && $options.openEmoji(...args))
    }, [
      renderSlot(
        _ctx.$slots,
        $props.messageId ? "emoji-picker-reaction-icon_" + $props.messageId : "emoji-picker-icon",
        {},
        () => [
          createVNode(_component_svg_icon, {
            name: "emoji",
            param: $props.emojiReaction ? "reaction" : ""
          }, null, 8, ["param"])
        ]
      )
    ], 2),
    $props.emojiOpened ? (openBlock(), createBlock(Transition, {
      key: 0,
      name: "vac-slide-up",
      appear: ""
    }, {
      default: withCtx(() => [
        createBaseVNode("div", {
          class: normalizeClass(["vac-emoji-picker", { "vac-picker-reaction": $props.emojiReaction }]),
          style: normalizeStyle({
            height: `${$data.emojiPickerHeight}px`,
            top: $props.positionTop ? $data.emojiPickerHeight : `${$data.emojiPickerTop}px`,
            right: $data.emojiPickerRight,
            display: $data.emojiPickerTop || !$props.emojiReaction ? "initial" : "none"
          })
        }, [
          createBaseVNode("emoji-picker", _hoisted_2$f, null, 512)
        ], 6)
      ]),
      _: 1
    })) : createCommentVNode("", true)
  ]);
}
var EmojiPickerContainer = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i]]);
const _sfc_main$i = {
  name: "RoomFiles",
  components: {
    Loader,
    SvgIcon
  },
  props: {
    file: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  emits: ["remove-file"],
  computed: {
    isImage() {
      return isImageFile(this.file);
    },
    isVideo() {
      return isVideoFile(this.file);
    }
  }
};
const _hoisted_1$i = { class: "vac-room-file-container" };
const _hoisted_2$e = ["src"];
const _hoisted_3$d = { class: "vac-text-ellipsis" };
const _hoisted_4$c = {
  key: 0,
  class: "vac-text-ellipsis vac-text-extension"
};
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_loader = resolveComponent("loader");
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", _hoisted_1$i, [
    createVNode(_component_loader, {
      show: $props.file.loading,
      type: "room-file"
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (idx, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["show"]),
    createBaseVNode("div", {
      class: "vac-svg-button vac-icon-remove",
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("remove-file", $props.index))
    }, [
      renderSlot(_ctx.$slots, "image-close-icon", {}, () => [
        createVNode(_component_svg_icon, {
          name: "close",
          param: "image"
        })
      ])
    ]),
    $options.isImage ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(["vac-message-image", { "vac-blur-loading": $props.file.loading }]),
      style: normalizeStyle({
        "background-image": `url('${$props.file.localUrl || $props.file.url}')`
      })
    }, null, 6)) : $options.isVideo ? (openBlock(), createElementBlock("video", {
      key: 1,
      controls: "",
      class: normalizeClass({ "vac-blur-loading": $props.file.loading })
    }, [
      createBaseVNode("source", {
        src: $props.file.localUrl || $props.file.url
      }, null, 8, _hoisted_2$e)
    ], 2)) : (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(["vac-file-container", { "vac-blur-loading": $props.file.loading }])
    }, [
      createBaseVNode("div", null, [
        renderSlot(_ctx.$slots, "file-icon", {}, () => [
          createVNode(_component_svg_icon, { name: "file" })
        ])
      ]),
      createBaseVNode("div", _hoisted_3$d, toDisplayString($props.file.name), 1),
      $props.file.extension ? (openBlock(), createElementBlock("div", _hoisted_4$c, toDisplayString($props.file.extension), 1)) : createCommentVNode("", true)
    ], 2))
  ]);
}
var RoomFile = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h]]);
const _sfc_main$h = {
  name: "RoomFiles",
  components: {
    SvgIcon,
    RoomFile
  },
  props: {
    files: { type: Array, required: true }
  },
  emits: ["remove-file", "reset-message"],
  computed: {
    footerHeight() {
      return document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer").clientHeight;
    }
  }
};
const _hoisted_1$h = { class: "vac-files-box" };
const _hoisted_2$d = { class: "vac-icon-close" };
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_room_file = resolveComponent("room-file");
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.files.length ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "vac-room-files-container",
        style: normalizeStyle({ bottom: `${$options.footerHeight}px` })
      }, [
        createBaseVNode("div", _hoisted_1$h, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.files, (file, i) => {
            return openBlock(), createElementBlock("div", { key: i }, [
              createVNode(_component_room_file, {
                file,
                index: i,
                onRemoveFile: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("remove-file", $event))
              }, createSlots({ _: 2 }, [
                renderList(_ctx.$slots, (idx, name) => {
                  return {
                    name,
                    fn: withCtx((data2) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                    ])
                  };
                })
              ]), 1032, ["file", "index"])
            ]);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_2$d, [
          createBaseVNode("div", {
            class: "vac-svg-button",
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("reset-message"))
          }, [
            renderSlot(_ctx.$slots, "files-close-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "close-outline" })
            ])
          ])
        ])
      ], 4)) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
var RoomFiles = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g]]);
const data$1 = {
  "width": 24,
  "height": 24,
  "body": '<path fill="currentColor" d="M9.525 18.025q-.5.325-1.013.037Q8 17.775 8 17.175V6.825q0-.6.512-.888q.513-.287 1.013.038l8.15 5.175q.45.3.45.85t-.45.85Z"/>'
};
const data = {
  "width": 24,
  "height": 24,
  "body": '<path fill="currentColor" d="M15 19q-.825 0-1.412-.587Q13 17.825 13 17V7q0-.825.588-1.412Q14.175 5 15 5h2q.825 0 1.413.588Q19 6.175 19 7v10q0 .825-.587 1.413Q17.825 19 17 19Zm-8 0q-.825 0-1.412-.587Q5 17.825 5 17V7q0-.825.588-1.412Q6.175 5 7 5h2q.825 0 1.413.588Q11 6.175 11 7v10q0 .825-.587 1.413Q9.825 19 9 19Z"/>'
};
var wavesurfer = { exports: {} };
/*!
 * wavesurfer.js 6.4.0 (2022-11-05)
 * https://wavesurfer-js.org
 * @license BSD-3-Clause
 */
(function(module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory();
  })(self, () => {
    return (() => {
      var __webpack_modules__ = {
        "./src/drawer.canvasentry.js": (module2, exports2, __webpack_require__2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var _style = _interopRequireDefault2(__webpack_require__2("./src/util/style.js"));
          var _getId = _interopRequireDefault2(__webpack_require__2("./src/util/get-id.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          var CanvasEntry = /* @__PURE__ */ function() {
            function CanvasEntry2() {
              _classCallCheck(this, CanvasEntry2);
              this.wave = null;
              this.waveCtx = null;
              this.progress = null;
              this.progressCtx = null;
              this.start = 0;
              this.end = 1;
              this.id = (0, _getId.default)(typeof this.constructor.name !== "undefined" ? this.constructor.name.toLowerCase() + "_" : "canvasentry_");
              this.canvasContextAttributes = {};
            }
            _createClass(CanvasEntry2, [{
              key: "initWave",
              value: function initWave(element2) {
                this.wave = element2;
                this.waveCtx = this.wave.getContext("2d", this.canvasContextAttributes);
              }
            }, {
              key: "initProgress",
              value: function initProgress(element2) {
                this.progress = element2;
                this.progressCtx = this.progress.getContext("2d", this.canvasContextAttributes);
              }
            }, {
              key: "updateDimensions",
              value: function updateDimensions(elementWidth, totalWidth, width, height) {
                this.start = this.wave.offsetLeft / totalWidth || 0;
                this.end = this.start + elementWidth / totalWidth;
                this.wave.width = width;
                this.wave.height = height;
                var elementSize = {
                  width: elementWidth + "px"
                };
                (0, _style.default)(this.wave, elementSize);
                if (this.hasProgressCanvas) {
                  this.progress.width = width;
                  this.progress.height = height;
                  (0, _style.default)(this.progress, elementSize);
                }
              }
            }, {
              key: "clearWave",
              value: function clearWave() {
                this.waveCtx.clearRect(0, 0, this.waveCtx.canvas.width, this.waveCtx.canvas.height);
                if (this.hasProgressCanvas) {
                  this.progressCtx.clearRect(0, 0, this.progressCtx.canvas.width, this.progressCtx.canvas.height);
                }
              }
            }, {
              key: "setFillStyles",
              value: function setFillStyles(waveColor, progressColor) {
                this.waveCtx.fillStyle = this.getFillStyle(this.waveCtx, waveColor);
                if (this.hasProgressCanvas) {
                  this.progressCtx.fillStyle = this.getFillStyle(this.progressCtx, progressColor);
                }
              }
            }, {
              key: "getFillStyle",
              value: function getFillStyle(ctx, color) {
                if (typeof color == "string" || color instanceof CanvasGradient) {
                  return color;
                }
                var waveGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                color.forEach(function(value, index) {
                  return waveGradient.addColorStop(index / color.length, value);
                });
                return waveGradient;
              }
            }, {
              key: "applyCanvasTransforms",
              value: function applyCanvasTransforms(vertical) {
                if (vertical) {
                  this.waveCtx.setTransform(0, 1, 1, 0, 0, 0);
                  if (this.hasProgressCanvas) {
                    this.progressCtx.setTransform(0, 1, 1, 0, 0, 0);
                  }
                }
              }
            }, {
              key: "fillRects",
              value: function fillRects(x, y, width, height, radius) {
                this.fillRectToContext(this.waveCtx, x, y, width, height, radius);
                if (this.hasProgressCanvas) {
                  this.fillRectToContext(this.progressCtx, x, y, width, height, radius);
                }
              }
            }, {
              key: "fillRectToContext",
              value: function fillRectToContext(ctx, x, y, width, height, radius) {
                if (!ctx) {
                  return;
                }
                if (radius) {
                  this.drawRoundedRect(ctx, x, y, width, height, radius);
                } else {
                  ctx.fillRect(x, y, width, height);
                }
              }
            }, {
              key: "drawRoundedRect",
              value: function drawRoundedRect(ctx, x, y, width, height, radius) {
                if (height === 0) {
                  return;
                }
                if (height < 0) {
                  height *= -1;
                  y -= height;
                }
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();
              }
            }, {
              key: "drawLines",
              value: function drawLines(peaks, absmax, halfH, offsetY, start2, end) {
                this.drawLineToContext(this.waveCtx, peaks, absmax, halfH, offsetY, start2, end);
                if (this.hasProgressCanvas) {
                  this.drawLineToContext(this.progressCtx, peaks, absmax, halfH, offsetY, start2, end);
                }
              }
            }, {
              key: "drawLineToContext",
              value: function drawLineToContext(ctx, peaks, absmax, halfH, offsetY, start2, end) {
                if (!ctx) {
                  return;
                }
                var length = peaks.length / 2;
                var first = Math.round(length * this.start);
                var last = Math.round(length * this.end) + 1;
                var canvasStart = first;
                var canvasEnd = last;
                var scale = this.wave.width / (canvasEnd - canvasStart - 1);
                var halfOffset = halfH + offsetY;
                var absmaxHalf = absmax / halfH;
                ctx.beginPath();
                ctx.moveTo((canvasStart - first) * scale, halfOffset);
                ctx.lineTo((canvasStart - first) * scale, halfOffset - Math.round((peaks[2 * canvasStart] || 0) / absmaxHalf));
                var i, peak, h2;
                for (i = canvasStart; i < canvasEnd; i++) {
                  peak = peaks[2 * i] || 0;
                  h2 = Math.round(peak / absmaxHalf);
                  ctx.lineTo((i - first) * scale + this.halfPixel, halfOffset - h2);
                }
                var j = canvasEnd - 1;
                for (j; j >= canvasStart; j--) {
                  peak = peaks[2 * j + 1] || 0;
                  h2 = Math.round(peak / absmaxHalf);
                  ctx.lineTo((j - first) * scale + this.halfPixel, halfOffset - h2);
                }
                ctx.lineTo((canvasStart - first) * scale, halfOffset - Math.round((peaks[2 * canvasStart + 1] || 0) / absmaxHalf));
                ctx.closePath();
                ctx.fill();
              }
            }, {
              key: "destroy",
              value: function destroy() {
                this.waveCtx = null;
                this.wave = null;
                this.progressCtx = null;
                this.progress = null;
              }
            }, {
              key: "getImage",
              value: function getImage(format, quality, type) {
                var _this = this;
                if (type === "blob") {
                  return new Promise(function(resolve3) {
                    _this.wave.toBlob(resolve3, format, quality);
                  });
                } else if (type === "dataURL") {
                  return this.wave.toDataURL(format, quality);
                }
              }
            }]);
            return CanvasEntry2;
          }();
          exports2["default"] = CanvasEntry;
          module2.exports = exports2.default;
        },
        "./src/drawer.js": (module2, exports2, __webpack_require__2) => {
          function _typeof2(obj) {
            "@babel/helpers - typeof";
            return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
              return typeof obj2;
            } : function(obj2) {
              return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, _typeof2(obj);
          }
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var util = _interopRequireWildcard2(__webpack_require__2("./src/util/index.js"));
          function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function")
              return null;
            var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
            var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
            return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
              return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
            })(nodeInterop);
          }
          function _interopRequireWildcard2(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) {
              return obj;
            }
            if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
              return { default: obj };
            }
            var cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) {
              return cache.get(obj);
            }
            var newObj = {};
            var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var key in obj) {
              if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                if (desc && (desc.get || desc.set)) {
                  Object.defineProperty(newObj, key, desc);
                } else {
                  newObj[key] = obj[key];
                }
              }
            }
            newObj.default = obj;
            if (cache) {
              cache.set(obj, newObj);
            }
            return newObj;
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            Object.defineProperty(subClass, "prototype", { writable: false });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p2) {
            _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
              o2.__proto__ = p3;
              return o2;
            };
            return _setPrototypeOf(o, p2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof2(call) === "object" || typeof call === "function")) {
              return call;
            } else if (call !== void 0) {
              throw new TypeError("Derived constructors may only return object or undefined");
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          var Drawer = /* @__PURE__ */ function(_util$Observer) {
            _inherits(Drawer2, _util$Observer);
            var _super = _createSuper(Drawer2);
            function Drawer2(container, params) {
              var _this;
              _classCallCheck(this, Drawer2);
              _this = _super.call(this);
              _this.container = util.withOrientation(container, params.vertical);
              _this.params = params;
              _this.width = 0;
              _this.height = params.height * _this.params.pixelRatio;
              _this.lastPos = 0;
              _this.wrapper = null;
              return _this;
            }
            _createClass(Drawer2, [{
              key: "style",
              value: function style(el, styles) {
                return util.style(el, styles);
              }
            }, {
              key: "createWrapper",
              value: function createWrapper() {
                this.wrapper = util.withOrientation(this.container.appendChild(document.createElement("wave")), this.params.vertical);
                this.style(this.wrapper, {
                  display: "block",
                  position: "relative",
                  userSelect: "none",
                  webkitUserSelect: "none",
                  height: this.params.height + "px"
                });
                if (this.params.fillParent || this.params.scrollParent) {
                  this.style(this.wrapper, {
                    width: "100%",
                    cursor: this.params.hideCursor ? "none" : "auto",
                    overflowX: this.params.hideScrollbar ? "hidden" : "auto",
                    overflowY: "hidden"
                  });
                }
                this.setupWrapperEvents();
              }
            }, {
              key: "handleEvent",
              value: function handleEvent(e, noPrevent) {
                !noPrevent && e.preventDefault();
                var clientX = util.withOrientation(e.targetTouches ? e.targetTouches[0] : e, this.params.vertical).clientX;
                var bbox = this.wrapper.getBoundingClientRect();
                var nominalWidth = this.width;
                var parentWidth = this.getWidth();
                var progressPixels = this.getProgressPixels(bbox, clientX);
                var progress;
                if (!this.params.fillParent && nominalWidth < parentWidth) {
                  progress = progressPixels * (this.params.pixelRatio / nominalWidth) || 0;
                } else {
                  progress = (progressPixels + this.wrapper.scrollLeft) / this.wrapper.scrollWidth || 0;
                }
                return util.clamp(progress, 0, 1);
              }
            }, {
              key: "getProgressPixels",
              value: function getProgressPixels(wrapperBbox, clientX) {
                if (this.params.rtl) {
                  return wrapperBbox.right - clientX;
                } else {
                  return clientX - wrapperBbox.left;
                }
              }
            }, {
              key: "setupWrapperEvents",
              value: function setupWrapperEvents() {
                var _this2 = this;
                this.wrapper.addEventListener("click", function(e) {
                  var orientedEvent = util.withOrientation(e, _this2.params.vertical);
                  var scrollbarHeight = _this2.wrapper.offsetHeight - _this2.wrapper.clientHeight;
                  if (scrollbarHeight !== 0) {
                    var bbox = _this2.wrapper.getBoundingClientRect();
                    if (orientedEvent.clientY >= bbox.bottom - scrollbarHeight) {
                      return;
                    }
                  }
                  if (_this2.params.interact) {
                    _this2.fireEvent("click", e, _this2.handleEvent(e));
                  }
                });
                this.wrapper.addEventListener("dblclick", function(e) {
                  if (_this2.params.interact) {
                    _this2.fireEvent("dblclick", e, _this2.handleEvent(e));
                  }
                });
                this.wrapper.addEventListener("scroll", function(e) {
                  return _this2.fireEvent("scroll", e);
                });
              }
            }, {
              key: "drawPeaks",
              value: function drawPeaks(peaks, length, start2, end) {
                if (!this.setWidth(length)) {
                  this.clearWave();
                }
                this.params.barWidth ? this.drawBars(peaks, 0, start2, end) : this.drawWave(peaks, 0, start2, end);
              }
            }, {
              key: "resetScroll",
              value: function resetScroll() {
                if (this.wrapper !== null) {
                  this.wrapper.scrollLeft = 0;
                }
              }
            }, {
              key: "recenter",
              value: function recenter(percent) {
                var position = this.wrapper.scrollWidth * percent;
                this.recenterOnPosition(position, true);
              }
            }, {
              key: "recenterOnPosition",
              value: function recenterOnPosition(position, immediate) {
                var scrollLeft = this.wrapper.scrollLeft;
                var half = ~~(this.wrapper.clientWidth / 2);
                var maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;
                var target = position - half;
                var offset = target - scrollLeft;
                if (maxScroll == 0) {
                  return;
                }
                if (!immediate && -half <= offset && offset < half) {
                  var rate = this.params.autoCenterRate;
                  rate /= half;
                  rate *= maxScroll;
                  offset = Math.max(-rate, Math.min(rate, offset));
                  target = scrollLeft + offset;
                }
                target = Math.max(0, Math.min(maxScroll, target));
                if (target != scrollLeft) {
                  this.wrapper.scrollLeft = target;
                }
              }
            }, {
              key: "getScrollX",
              value: function getScrollX() {
                var x = 0;
                if (this.wrapper) {
                  var pixelRatio = this.params.pixelRatio;
                  x = Math.round(this.wrapper.scrollLeft * pixelRatio);
                  if (this.params.scrollParent) {
                    var maxScroll = ~~(this.wrapper.scrollWidth * pixelRatio - this.getWidth());
                    x = Math.min(maxScroll, Math.max(0, x));
                  }
                }
                return x;
              }
            }, {
              key: "getWidth",
              value: function getWidth() {
                return Math.round(this.container.clientWidth * this.params.pixelRatio);
              }
            }, {
              key: "setWidth",
              value: function setWidth(width) {
                if (this.width == width) {
                  return false;
                }
                this.width = width;
                if (this.params.fillParent || this.params.scrollParent) {
                  this.style(this.wrapper, {
                    width: ""
                  });
                } else {
                  var newWidth = ~~(this.width / this.params.pixelRatio) + "px";
                  this.style(this.wrapper, {
                    width: newWidth
                  });
                }
                this.updateSize();
                return true;
              }
            }, {
              key: "setHeight",
              value: function setHeight(height) {
                if (height == this.height) {
                  return false;
                }
                this.height = height;
                this.style(this.wrapper, {
                  height: ~~(this.height / this.params.pixelRatio) + "px"
                });
                this.updateSize();
                return true;
              }
            }, {
              key: "progress",
              value: function progress(_progress) {
                var minPxDelta = 1 / this.params.pixelRatio;
                var pos = Math.round(_progress * this.width) * minPxDelta;
                if (pos < this.lastPos || pos - this.lastPos >= minPxDelta) {
                  this.lastPos = pos;
                  if (this.params.scrollParent && this.params.autoCenter) {
                    var newPos = ~~(this.wrapper.scrollWidth * _progress);
                    this.recenterOnPosition(newPos, this.params.autoCenterImmediately);
                  }
                  this.updateProgress(pos);
                }
              }
            }, {
              key: "destroy",
              value: function destroy() {
                this.unAll();
                if (this.wrapper) {
                  if (this.wrapper.parentNode == this.container.domElement) {
                    this.container.removeChild(this.wrapper.domElement);
                  }
                  this.wrapper = null;
                }
              }
            }, {
              key: "updateCursor",
              value: function updateCursor() {
              }
            }, {
              key: "updateSize",
              value: function updateSize() {
              }
            }, {
              key: "drawBars",
              value: function drawBars(peaks, channelIndex, start2, end) {
              }
            }, {
              key: "drawWave",
              value: function drawWave(peaks, channelIndex, start2, end) {
              }
            }, {
              key: "clearWave",
              value: function clearWave() {
              }
            }, {
              key: "updateProgress",
              value: function updateProgress(position) {
              }
            }]);
            return Drawer2;
          }(util.Observer);
          exports2["default"] = Drawer;
          module2.exports = exports2.default;
        },
        "./src/drawer.multicanvas.js": (module2, exports2, __webpack_require__2) => {
          function _typeof2(obj) {
            "@babel/helpers - typeof";
            return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
              return typeof obj2;
            } : function(obj2) {
              return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, _typeof2(obj);
          }
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var _drawer = _interopRequireDefault2(__webpack_require__2("./src/drawer.js"));
          var util = _interopRequireWildcard2(__webpack_require__2("./src/util/index.js"));
          var _drawer2 = _interopRequireDefault2(__webpack_require__2("./src/drawer.canvasentry.js"));
          function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function")
              return null;
            var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
            var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
            return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
              return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
            })(nodeInterop);
          }
          function _interopRequireWildcard2(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) {
              return obj;
            }
            if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
              return { default: obj };
            }
            var cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) {
              return cache.get(obj);
            }
            var newObj = {};
            var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var key in obj) {
              if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                if (desc && (desc.get || desc.set)) {
                  Object.defineProperty(newObj, key, desc);
                } else {
                  newObj[key] = obj[key];
                }
              }
            }
            newObj.default = obj;
            if (cache) {
              cache.set(obj, newObj);
            }
            return newObj;
          }
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            Object.defineProperty(subClass, "prototype", { writable: false });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p2) {
            _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
              o2.__proto__ = p3;
              return o2;
            };
            return _setPrototypeOf(o, p2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof2(call) === "object" || typeof call === "function")) {
              return call;
            } else if (call !== void 0) {
              throw new TypeError("Derived constructors may only return object or undefined");
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          var MultiCanvas = /* @__PURE__ */ function(_Drawer) {
            _inherits(MultiCanvas2, _Drawer);
            var _super = _createSuper(MultiCanvas2);
            function MultiCanvas2(container, params) {
              var _this;
              _classCallCheck(this, MultiCanvas2);
              _this = _super.call(this, container, params);
              _this.maxCanvasWidth = params.maxCanvasWidth;
              _this.maxCanvasElementWidth = Math.round(params.maxCanvasWidth / params.pixelRatio);
              _this.hasProgressCanvas = params.waveColor != params.progressColor;
              _this.halfPixel = 0.5 / params.pixelRatio;
              _this.canvases = [];
              _this.progressWave = null;
              _this.EntryClass = _drawer2.default;
              _this.canvasContextAttributes = params.drawingContextAttributes;
              _this.overlap = 2 * Math.ceil(params.pixelRatio / 2);
              _this.barRadius = params.barRadius || 0;
              _this.vertical = params.vertical;
              return _this;
            }
            _createClass(MultiCanvas2, [{
              key: "init",
              value: function init2() {
                this.createWrapper();
                this.createElements();
              }
            }, {
              key: "createElements",
              value: function createElements() {
                this.progressWave = util.withOrientation(this.wrapper.appendChild(document.createElement("wave")), this.params.vertical);
                this.style(this.progressWave, {
                  position: "absolute",
                  zIndex: 3,
                  left: 0,
                  top: 0,
                  bottom: 0,
                  overflow: "hidden",
                  width: "0",
                  display: "none",
                  boxSizing: "border-box",
                  borderRightStyle: "solid",
                  pointerEvents: "none"
                });
                this.addCanvas();
                this.updateCursor();
              }
            }, {
              key: "updateCursor",
              value: function updateCursor() {
                this.style(this.progressWave, {
                  borderRightWidth: this.params.cursorWidth + "px",
                  borderRightColor: this.params.cursorColor
                });
              }
            }, {
              key: "updateSize",
              value: function updateSize() {
                var _this2 = this;
                var totalWidth = Math.round(this.width / this.params.pixelRatio);
                var requiredCanvases = Math.ceil(totalWidth / (this.maxCanvasElementWidth + this.overlap));
                while (this.canvases.length < requiredCanvases) {
                  this.addCanvas();
                }
                while (this.canvases.length > requiredCanvases) {
                  this.removeCanvas();
                }
                var canvasWidth = this.maxCanvasWidth + this.overlap;
                var lastCanvas = this.canvases.length - 1;
                this.canvases.forEach(function(entry, i) {
                  if (i == lastCanvas) {
                    canvasWidth = _this2.width - _this2.maxCanvasWidth * lastCanvas;
                  }
                  _this2.updateDimensions(entry, canvasWidth, _this2.height);
                  entry.clearWave();
                });
              }
            }, {
              key: "addCanvas",
              value: function addCanvas() {
                var entry = new this.EntryClass();
                entry.canvasContextAttributes = this.canvasContextAttributes;
                entry.hasProgressCanvas = this.hasProgressCanvas;
                entry.halfPixel = this.halfPixel;
                var leftOffset = this.maxCanvasElementWidth * this.canvases.length;
                var wave = util.withOrientation(this.wrapper.appendChild(document.createElement("canvas")), this.params.vertical);
                this.style(wave, {
                  position: "absolute",
                  zIndex: 2,
                  left: leftOffset + "px",
                  top: 0,
                  bottom: 0,
                  height: "100%",
                  pointerEvents: "none"
                });
                entry.initWave(wave);
                if (this.hasProgressCanvas) {
                  var progress = util.withOrientation(this.progressWave.appendChild(document.createElement("canvas")), this.params.vertical);
                  this.style(progress, {
                    position: "absolute",
                    left: leftOffset + "px",
                    top: 0,
                    bottom: 0,
                    height: "100%"
                  });
                  entry.initProgress(progress);
                }
                this.canvases.push(entry);
              }
            }, {
              key: "removeCanvas",
              value: function removeCanvas() {
                var lastEntry = this.canvases[this.canvases.length - 1];
                lastEntry.wave.parentElement.removeChild(lastEntry.wave.domElement);
                if (this.hasProgressCanvas) {
                  lastEntry.progress.parentElement.removeChild(lastEntry.progress.domElement);
                }
                if (lastEntry) {
                  lastEntry.destroy();
                  lastEntry = null;
                }
                this.canvases.pop();
              }
            }, {
              key: "updateDimensions",
              value: function updateDimensions(entry, width, height) {
                var elementWidth = Math.round(width / this.params.pixelRatio);
                var totalWidth = Math.round(this.width / this.params.pixelRatio);
                entry.updateDimensions(elementWidth, totalWidth, width, height);
                this.style(this.progressWave, {
                  display: "block"
                });
              }
            }, {
              key: "clearWave",
              value: function clearWave() {
                var _this3 = this;
                util.frame(function() {
                  _this3.canvases.forEach(function(entry) {
                    return entry.clearWave();
                  });
                })();
              }
            }, {
              key: "drawBars",
              value: function drawBars(peaks, channelIndex, start2, end) {
                var _this4 = this;
                return this.prepareDraw(peaks, channelIndex, start2, end, function(_ref) {
                  var absmax = _ref.absmax, hasMinVals = _ref.hasMinVals;
                  _ref.height;
                  var offsetY = _ref.offsetY, halfH = _ref.halfH, peaks2 = _ref.peaks, ch = _ref.channelIndex;
                  if (start2 === void 0) {
                    return;
                  }
                  var peakIndexScale = hasMinVals ? 2 : 1;
                  var length = peaks2.length / peakIndexScale;
                  var bar = _this4.params.barWidth * _this4.params.pixelRatio;
                  var gap = _this4.params.barGap === null ? Math.max(_this4.params.pixelRatio, ~~(bar / 2)) : Math.max(_this4.params.pixelRatio, _this4.params.barGap * _this4.params.pixelRatio);
                  var step = bar + gap;
                  var scale = length / _this4.width;
                  var first = start2;
                  var last = end;
                  var peakIndex = first;
                  for (peakIndex; peakIndex < last; peakIndex += step) {
                    var peak = 0;
                    var peakIndexRange = Math.floor(peakIndex * scale) * peakIndexScale;
                    var peakIndexEnd = Math.floor((peakIndex + step) * scale) * peakIndexScale;
                    do {
                      var newPeak = Math.abs(peaks2[peakIndexRange]);
                      if (newPeak > peak) {
                        peak = newPeak;
                      }
                      peakIndexRange += peakIndexScale;
                    } while (peakIndexRange < peakIndexEnd);
                    var h2 = Math.round(peak / absmax * halfH);
                    if (_this4.params.barMinHeight) {
                      h2 = Math.max(h2, _this4.params.barMinHeight);
                    }
                    _this4.fillRect(peakIndex + _this4.halfPixel, halfH - h2 + offsetY, bar + _this4.halfPixel, h2 * 2, _this4.barRadius, ch);
                  }
                });
              }
            }, {
              key: "drawWave",
              value: function drawWave(peaks, channelIndex, start2, end) {
                var _this5 = this;
                return this.prepareDraw(peaks, channelIndex, start2, end, function(_ref2) {
                  var absmax = _ref2.absmax, hasMinVals = _ref2.hasMinVals;
                  _ref2.height;
                  var offsetY = _ref2.offsetY, halfH = _ref2.halfH, peaks2 = _ref2.peaks, channelIndex2 = _ref2.channelIndex;
                  if (!hasMinVals) {
                    var reflectedPeaks = [];
                    var len = peaks2.length;
                    var i = 0;
                    for (i; i < len; i++) {
                      reflectedPeaks[2 * i] = peaks2[i];
                      reflectedPeaks[2 * i + 1] = -peaks2[i];
                    }
                    peaks2 = reflectedPeaks;
                  }
                  if (start2 !== void 0) {
                    _this5.drawLine(peaks2, absmax, halfH, offsetY, start2, end, channelIndex2);
                  }
                  _this5.fillRect(0, halfH + offsetY - _this5.halfPixel, _this5.width, _this5.halfPixel, _this5.barRadius, channelIndex2);
                });
              }
            }, {
              key: "drawLine",
              value: function drawLine(peaks, absmax, halfH, offsetY, start2, end, channelIndex) {
                var _this6 = this;
                var _ref3 = this.params.splitChannelsOptions.channelColors[channelIndex] || {}, waveColor = _ref3.waveColor, progressColor = _ref3.progressColor;
                this.canvases.forEach(function(entry, i) {
                  _this6.setFillStyles(entry, waveColor, progressColor);
                  _this6.applyCanvasTransforms(entry, _this6.params.vertical);
                  entry.drawLines(peaks, absmax, halfH, offsetY, start2, end);
                });
              }
            }, {
              key: "fillRect",
              value: function fillRect(x, y, width, height, radius, channelIndex) {
                var startCanvas = Math.floor(x / this.maxCanvasWidth);
                var endCanvas = Math.min(Math.ceil((x + width) / this.maxCanvasWidth) + 1, this.canvases.length);
                var i = startCanvas;
                for (i; i < endCanvas; i++) {
                  var entry = this.canvases[i];
                  var leftOffset = i * this.maxCanvasWidth;
                  var intersection = {
                    x1: Math.max(x, i * this.maxCanvasWidth),
                    y1: y,
                    x2: Math.min(x + width, i * this.maxCanvasWidth + entry.wave.width),
                    y2: y + height
                  };
                  if (intersection.x1 < intersection.x2) {
                    var _ref4 = this.params.splitChannelsOptions.channelColors[channelIndex] || {}, waveColor = _ref4.waveColor, progressColor = _ref4.progressColor;
                    this.setFillStyles(entry, waveColor, progressColor);
                    this.applyCanvasTransforms(entry, this.params.vertical);
                    entry.fillRects(intersection.x1 - leftOffset, intersection.y1, intersection.x2 - intersection.x1, intersection.y2 - intersection.y1, radius);
                  }
                }
              }
            }, {
              key: "hideChannel",
              value: function hideChannel(channelIndex) {
                return this.params.splitChannels && this.params.splitChannelsOptions.filterChannels.includes(channelIndex);
              }
            }, {
              key: "prepareDraw",
              value: function prepareDraw(peaks, channelIndex, start2, end, fn, drawIndex, normalizedMax) {
                var _this7 = this;
                return util.frame(function() {
                  if (peaks[0] instanceof Array) {
                    var channels = peaks;
                    if (_this7.params.splitChannels) {
                      var filteredChannels = channels.filter(function(c, i) {
                        return !_this7.hideChannel(i);
                      });
                      if (!_this7.params.splitChannelsOptions.overlay) {
                        _this7.setHeight(Math.max(filteredChannels.length, 1) * _this7.params.height * _this7.params.pixelRatio);
                      }
                      var overallAbsMax;
                      if (_this7.params.splitChannelsOptions && _this7.params.splitChannelsOptions.relativeNormalization) {
                        overallAbsMax = util.max(channels.map(function(channelPeaks) {
                          return util.absMax(channelPeaks);
                        }));
                      }
                      return channels.forEach(function(channelPeaks, i) {
                        return _this7.prepareDraw(channelPeaks, i, start2, end, fn, filteredChannels.indexOf(channelPeaks), overallAbsMax);
                      });
                    }
                    peaks = channels[0];
                  }
                  if (_this7.hideChannel(channelIndex)) {
                    return;
                  }
                  var absmax = 1 / _this7.params.barHeight;
                  if (_this7.params.normalize) {
                    absmax = normalizedMax === void 0 ? util.absMax(peaks) : normalizedMax;
                  }
                  var hasMinVals = [].some.call(peaks, function(val) {
                    return val < 0;
                  });
                  var height = _this7.params.height * _this7.params.pixelRatio;
                  var halfH = height / 2;
                  var offsetY = height * drawIndex || 0;
                  if (_this7.params.splitChannelsOptions && _this7.params.splitChannelsOptions.overlay) {
                    offsetY = 0;
                  }
                  return fn({
                    absmax,
                    hasMinVals,
                    height,
                    offsetY,
                    halfH,
                    peaks,
                    channelIndex
                  });
                })();
              }
            }, {
              key: "setFillStyles",
              value: function setFillStyles(entry) {
                var waveColor = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.params.waveColor;
                var progressColor = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.params.progressColor;
                entry.setFillStyles(waveColor, progressColor);
              }
            }, {
              key: "applyCanvasTransforms",
              value: function applyCanvasTransforms(entry) {
                var vertical = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                entry.applyCanvasTransforms(vertical);
              }
            }, {
              key: "getImage",
              value: function getImage(format, quality, type) {
                if (type === "blob") {
                  return Promise.all(this.canvases.map(function(entry) {
                    return entry.getImage(format, quality, type);
                  }));
                } else if (type === "dataURL") {
                  var images = this.canvases.map(function(entry) {
                    return entry.getImage(format, quality, type);
                  });
                  return images.length > 1 ? images : images[0];
                }
              }
            }, {
              key: "updateProgress",
              value: function updateProgress(position) {
                this.style(this.progressWave, {
                  width: position + "px"
                });
              }
            }]);
            return MultiCanvas2;
          }(_drawer.default);
          exports2["default"] = MultiCanvas;
          module2.exports = exports2.default;
        },
        "./src/mediaelement-webaudio.js": (module2, exports2, __webpack_require__2) => {
          function _typeof2(obj) {
            "@babel/helpers - typeof";
            return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
              return typeof obj2;
            } : function(obj2) {
              return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, _typeof2(obj);
          }
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var _mediaelement = _interopRequireDefault2(__webpack_require__2("./src/mediaelement.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          function _get() {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              _get = Reflect.get.bind();
            } else {
              _get = function _get2(target, property, receiver) {
                var base = _superPropBase(target, property);
                if (!base)
                  return;
                var desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.get) {
                  return desc.get.call(arguments.length < 3 ? target : receiver);
                }
                return desc.value;
              };
            }
            return _get.apply(this, arguments);
          }
          function _superPropBase(object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
              object = _getPrototypeOf(object);
              if (object === null)
                break;
            }
            return object;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            Object.defineProperty(subClass, "prototype", { writable: false });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p2) {
            _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
              o2.__proto__ = p3;
              return o2;
            };
            return _setPrototypeOf(o, p2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof2(call) === "object" || typeof call === "function")) {
              return call;
            } else if (call !== void 0) {
              throw new TypeError("Derived constructors may only return object or undefined");
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          var MediaElementWebAudio = /* @__PURE__ */ function(_MediaElement) {
            _inherits(MediaElementWebAudio2, _MediaElement);
            var _super = _createSuper(MediaElementWebAudio2);
            function MediaElementWebAudio2(params) {
              var _this;
              _classCallCheck(this, MediaElementWebAudio2);
              _this = _super.call(this, params);
              _this.params = params;
              _this.sourceMediaElement = null;
              return _this;
            }
            _createClass(MediaElementWebAudio2, [{
              key: "init",
              value: function init2() {
                this.setPlaybackRate(this.params.audioRate);
                this.createTimer();
                this.createVolumeNode();
                this.createScriptNode();
                this.createAnalyserNode();
              }
            }, {
              key: "_load",
              value: function _load(media, peaks, preload) {
                _get(_getPrototypeOf(MediaElementWebAudio2.prototype), "_load", this).call(this, media, peaks, preload);
                this.createMediaElementSource(media);
              }
            }, {
              key: "createMediaElementSource",
              value: function createMediaElementSource(mediaElement) {
                this.sourceMediaElement = this.ac.createMediaElementSource(mediaElement);
                this.sourceMediaElement.connect(this.analyser);
              }
            }, {
              key: "play",
              value: function play(start2, end) {
                this.resumeAudioContext();
                return _get(_getPrototypeOf(MediaElementWebAudio2.prototype), "play", this).call(this, start2, end);
              }
            }, {
              key: "destroy",
              value: function destroy() {
                _get(_getPrototypeOf(MediaElementWebAudio2.prototype), "destroy", this).call(this);
                this.destroyWebAudio();
              }
            }]);
            return MediaElementWebAudio2;
          }(_mediaelement.default);
          exports2["default"] = MediaElementWebAudio;
          module2.exports = exports2.default;
        },
        "./src/mediaelement.js": (module2, exports2, __webpack_require__2) => {
          function _typeof2(obj) {
            "@babel/helpers - typeof";
            return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
              return typeof obj2;
            } : function(obj2) {
              return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, _typeof2(obj);
          }
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var _webaudio = _interopRequireDefault2(__webpack_require__2("./src/webaudio.js"));
          var util = _interopRequireWildcard2(__webpack_require__2("./src/util/index.js"));
          function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function")
              return null;
            var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
            var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
            return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
              return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
            })(nodeInterop);
          }
          function _interopRequireWildcard2(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) {
              return obj;
            }
            if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
              return { default: obj };
            }
            var cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) {
              return cache.get(obj);
            }
            var newObj = {};
            var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var key in obj) {
              if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                if (desc && (desc.get || desc.set)) {
                  Object.defineProperty(newObj, key, desc);
                } else {
                  newObj[key] = obj[key];
                }
              }
            }
            newObj.default = obj;
            if (cache) {
              cache.set(obj, newObj);
            }
            return newObj;
          }
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          function _get() {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              _get = Reflect.get.bind();
            } else {
              _get = function _get2(target, property, receiver) {
                var base = _superPropBase(target, property);
                if (!base)
                  return;
                var desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.get) {
                  return desc.get.call(arguments.length < 3 ? target : receiver);
                }
                return desc.value;
              };
            }
            return _get.apply(this, arguments);
          }
          function _superPropBase(object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
              object = _getPrototypeOf(object);
              if (object === null)
                break;
            }
            return object;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            Object.defineProperty(subClass, "prototype", { writable: false });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p2) {
            _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
              o2.__proto__ = p3;
              return o2;
            };
            return _setPrototypeOf(o, p2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof2(call) === "object" || typeof call === "function")) {
              return call;
            } else if (call !== void 0) {
              throw new TypeError("Derived constructors may only return object or undefined");
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          var MediaElement = /* @__PURE__ */ function(_WebAudio) {
            _inherits(MediaElement2, _WebAudio);
            var _super = _createSuper(MediaElement2);
            function MediaElement2(params) {
              var _this;
              _classCallCheck(this, MediaElement2);
              _this = _super.call(this, params);
              _this.params = params;
              _this.media = {
                currentTime: 0,
                duration: 0,
                paused: true,
                playbackRate: 1,
                play: function play() {
                },
                pause: function pause() {
                },
                volume: 0
              };
              _this.mediaType = params.mediaType.toLowerCase();
              _this.elementPosition = params.elementPosition;
              _this.peaks = null;
              _this.playbackRate = 1;
              _this.volume = 1;
              _this.isMuted = false;
              _this.buffer = null;
              _this.onPlayEnd = null;
              _this.mediaListeners = {};
              return _this;
            }
            _createClass(MediaElement2, [{
              key: "init",
              value: function init2() {
                this.setPlaybackRate(this.params.audioRate);
                this.createTimer();
              }
            }, {
              key: "_setupMediaListeners",
              value: function _setupMediaListeners() {
                var _this2 = this;
                this.mediaListeners.error = function() {
                  _this2.fireEvent("error", "Error loading media element");
                };
                this.mediaListeners.canplay = function() {
                  _this2.fireEvent("canplay");
                };
                this.mediaListeners.ended = function() {
                  _this2.fireEvent("finish");
                };
                this.mediaListeners.play = function() {
                  _this2.fireEvent("play");
                };
                this.mediaListeners.pause = function() {
                  _this2.fireEvent("pause");
                };
                this.mediaListeners.seeked = function(event) {
                  _this2.fireEvent("seek");
                };
                this.mediaListeners.volumechange = function(event) {
                  _this2.isMuted = _this2.media.muted;
                  if (_this2.isMuted) {
                    _this2.volume = 0;
                  } else {
                    _this2.volume = _this2.media.volume;
                  }
                  _this2.fireEvent("volume");
                };
                Object.keys(this.mediaListeners).forEach(function(id) {
                  _this2.media.removeEventListener(id, _this2.mediaListeners[id]);
                  _this2.media.addEventListener(id, _this2.mediaListeners[id]);
                });
              }
            }, {
              key: "createTimer",
              value: function createTimer() {
                var _this3 = this;
                var onAudioProcess = function onAudioProcess2() {
                  if (_this3.isPaused()) {
                    return;
                  }
                  _this3.fireEvent("audioprocess", _this3.getCurrentTime());
                  util.frame(onAudioProcess2)();
                };
                this.on("play", onAudioProcess);
                this.on("pause", function() {
                  _this3.fireEvent("audioprocess", _this3.getCurrentTime());
                });
              }
            }, {
              key: "load",
              value: function load(url, container, peaks, preload) {
                var media = document.createElement(this.mediaType);
                media.controls = this.params.mediaControls;
                media.autoplay = this.params.autoplay || false;
                media.preload = preload == null ? "auto" : preload;
                media.src = url;
                media.style.width = "100%";
                var prevMedia = container.querySelector(this.mediaType);
                if (prevMedia) {
                  container.removeChild(prevMedia);
                }
                container.appendChild(media);
                this._load(media, peaks, preload);
              }
            }, {
              key: "loadElt",
              value: function loadElt(elt, peaks) {
                elt.controls = this.params.mediaControls;
                elt.autoplay = this.params.autoplay || false;
                this._load(elt, peaks, elt.preload);
              }
            }, {
              key: "_load",
              value: function _load(media, peaks, preload) {
                if (!(media instanceof HTMLMediaElement) || typeof media.addEventListener === "undefined") {
                  throw new Error("media parameter is not a valid media element");
                }
                if (typeof media.load == "function" && !(peaks && preload == "none")) {
                  media.load();
                }
                this.media = media;
                this._setupMediaListeners();
                this.peaks = peaks;
                this.onPlayEnd = null;
                this.buffer = null;
                this.isMuted = media.muted;
                this.setPlaybackRate(this.playbackRate);
                this.setVolume(this.volume);
              }
            }, {
              key: "isPaused",
              value: function isPaused() {
                return !this.media || this.media.paused;
              }
            }, {
              key: "getDuration",
              value: function getDuration() {
                if (this.explicitDuration) {
                  return this.explicitDuration;
                }
                var duration = (this.buffer || this.media).duration;
                if (duration >= Infinity) {
                  duration = this.media.seekable.end(0);
                }
                return duration;
              }
            }, {
              key: "getCurrentTime",
              value: function getCurrentTime() {
                return this.media && this.media.currentTime;
              }
            }, {
              key: "getPlayedPercents",
              value: function getPlayedPercents() {
                return this.getCurrentTime() / this.getDuration() || 0;
              }
            }, {
              key: "getPlaybackRate",
              value: function getPlaybackRate() {
                return this.playbackRate || this.media.playbackRate;
              }
            }, {
              key: "setPlaybackRate",
              value: function setPlaybackRate(value) {
                this.playbackRate = value || 1;
                this.media.playbackRate = this.playbackRate;
              }
            }, {
              key: "seekTo",
              value: function seekTo(start2) {
                if (start2 != null && !isNaN(start2)) {
                  this.media.currentTime = start2;
                }
                this.clearPlayEnd();
              }
            }, {
              key: "play",
              value: function play(start2, end) {
                this.seekTo(start2);
                var promise = this.media.play();
                end && this.setPlayEnd(end);
                return promise;
              }
            }, {
              key: "pause",
              value: function pause() {
                var promise;
                if (this.media) {
                  promise = this.media.pause();
                }
                this.clearPlayEnd();
                return promise;
              }
            }, {
              key: "setPlayEnd",
              value: function setPlayEnd(end) {
                var _this4 = this;
                this.clearPlayEnd();
                this._onPlayEnd = function(time) {
                  if (time >= end) {
                    _this4.pause();
                    _this4.seekTo(end);
                  }
                };
                this.on("audioprocess", this._onPlayEnd);
              }
            }, {
              key: "clearPlayEnd",
              value: function clearPlayEnd() {
                if (this._onPlayEnd) {
                  this.un("audioprocess", this._onPlayEnd);
                  this._onPlayEnd = null;
                }
              }
            }, {
              key: "getPeaks",
              value: function getPeaks(length, first, last) {
                if (this.buffer) {
                  return _get(_getPrototypeOf(MediaElement2.prototype), "getPeaks", this).call(this, length, first, last);
                }
                return this.peaks || [];
              }
            }, {
              key: "setSinkId",
              value: function setSinkId(deviceId) {
                if (deviceId) {
                  if (!this.media.setSinkId) {
                    return Promise.reject(new Error("setSinkId is not supported in your browser"));
                  }
                  return this.media.setSinkId(deviceId);
                }
                return Promise.reject(new Error("Invalid deviceId: " + deviceId));
              }
            }, {
              key: "getVolume",
              value: function getVolume() {
                return this.volume;
              }
            }, {
              key: "setVolume",
              value: function setVolume(value) {
                this.volume = value;
                if (this.media.volume !== this.volume) {
                  this.media.volume = this.volume;
                }
              }
            }, {
              key: "setMute",
              value: function setMute(muted) {
                this.isMuted = this.media.muted = muted;
              }
            }, {
              key: "destroy",
              value: function destroy() {
                var _this5 = this;
                this.pause();
                this.unAll();
                this.destroyed = true;
                Object.keys(this.mediaListeners).forEach(function(id) {
                  if (_this5.media) {
                    _this5.media.removeEventListener(id, _this5.mediaListeners[id]);
                  }
                });
                if (this.params.removeMediaElementOnDestroy && this.media && this.media.parentNode) {
                  this.media.parentNode.removeChild(this.media);
                }
                this.media = null;
              }
            }]);
            return MediaElement2;
          }(_webaudio.default);
          exports2["default"] = MediaElement;
          module2.exports = exports2.default;
        },
        "./src/peakcache.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          var PeakCache = /* @__PURE__ */ function() {
            function PeakCache2() {
              _classCallCheck(this, PeakCache2);
              this.clearPeakCache();
            }
            _createClass(PeakCache2, [{
              key: "clearPeakCache",
              value: function clearPeakCache() {
                this.peakCacheRanges = [];
                this.peakCacheLength = -1;
              }
            }, {
              key: "addRangeToPeakCache",
              value: function addRangeToPeakCache(length, start2, end) {
                if (length != this.peakCacheLength) {
                  this.clearPeakCache();
                  this.peakCacheLength = length;
                }
                var uncachedRanges = [];
                var i = 0;
                while (i < this.peakCacheRanges.length && this.peakCacheRanges[i] < start2) {
                  i++;
                }
                if (i % 2 == 0) {
                  uncachedRanges.push(start2);
                }
                while (i < this.peakCacheRanges.length && this.peakCacheRanges[i] <= end) {
                  uncachedRanges.push(this.peakCacheRanges[i]);
                  i++;
                }
                if (i % 2 == 0) {
                  uncachedRanges.push(end);
                }
                uncachedRanges = uncachedRanges.filter(function(item, pos, arr) {
                  if (pos == 0) {
                    return item != arr[pos + 1];
                  } else if (pos == arr.length - 1) {
                    return item != arr[pos - 1];
                  }
                  return item != arr[pos - 1] && item != arr[pos + 1];
                });
                this.peakCacheRanges = this.peakCacheRanges.concat(uncachedRanges);
                this.peakCacheRanges = this.peakCacheRanges.sort(function(a, b) {
                  return a - b;
                }).filter(function(item, pos, arr) {
                  if (pos == 0) {
                    return item != arr[pos + 1];
                  } else if (pos == arr.length - 1) {
                    return item != arr[pos - 1];
                  }
                  return item != arr[pos - 1] && item != arr[pos + 1];
                });
                var uncachedRangePairs = [];
                for (i = 0; i < uncachedRanges.length; i += 2) {
                  uncachedRangePairs.push([uncachedRanges[i], uncachedRanges[i + 1]]);
                }
                return uncachedRangePairs;
              }
            }, {
              key: "getCacheRanges",
              value: function getCacheRanges() {
                var peakCacheRangePairs = [];
                var i;
                for (i = 0; i < this.peakCacheRanges.length; i += 2) {
                  peakCacheRangePairs.push([this.peakCacheRanges[i], this.peakCacheRanges[i + 1]]);
                }
                return peakCacheRangePairs;
              }
            }]);
            return PeakCache2;
          }();
          exports2["default"] = PeakCache;
          module2.exports = exports2.default;
        },
        "./src/util/absMax.js": (module2, exports2, __webpack_require__2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = absMax;
          var _max = _interopRequireDefault2(__webpack_require__2("./src/util/max.js"));
          var _min = _interopRequireDefault2(__webpack_require__2("./src/util/min.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function absMax(values) {
            var max = (0, _max.default)(values);
            var min = (0, _min.default)(values);
            return -min > max ? -min : max;
          }
          module2.exports = exports2.default;
        },
        "./src/util/clamp.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = clamp;
          function clamp(val, min, max) {
            return Math.min(Math.max(min, val), max);
          }
          module2.exports = exports2.default;
        },
        "./src/util/fetch.js": (module2, exports2, __webpack_require__2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = fetchFile;
          var _observer = _interopRequireDefault2(__webpack_require__2("./src/util/observer.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          var ProgressHandler = /* @__PURE__ */ function() {
            function ProgressHandler2(instance2, contentLength, response) {
              _classCallCheck(this, ProgressHandler2);
              this.instance = instance2;
              this.instance._reader = response.body.getReader();
              this.total = parseInt(contentLength, 10);
              this.loaded = 0;
            }
            _createClass(ProgressHandler2, [{
              key: "start",
              value: function start2(controller) {
                var _this = this;
                var read = function read2() {
                  _this.instance._reader.read().then(function(_ref) {
                    var done = _ref.done, value = _ref.value;
                    if (done) {
                      if (_this.total === 0) {
                        _this.instance.onProgress.call(_this.instance, {
                          loaded: _this.loaded,
                          total: _this.total,
                          lengthComputable: false
                        });
                      }
                      controller.close();
                      return;
                    }
                    _this.loaded += value.byteLength;
                    _this.instance.onProgress.call(_this.instance, {
                      loaded: _this.loaded,
                      total: _this.total,
                      lengthComputable: !(_this.total === 0)
                    });
                    controller.enqueue(value);
                    read2();
                  }).catch(function(error) {
                    controller.error(error);
                  });
                };
                read();
              }
            }]);
            return ProgressHandler2;
          }();
          function fetchFile(options2) {
            if (!options2) {
              throw new Error("fetch options missing");
            } else if (!options2.url) {
              throw new Error("fetch url missing");
            }
            var instance2 = new _observer.default();
            var fetchHeaders = new Headers();
            var fetchRequest = new Request(options2.url);
            instance2.controller = new AbortController();
            if (options2 && options2.requestHeaders) {
              options2.requestHeaders.forEach(function(header) {
                fetchHeaders.append(header.key, header.value);
              });
            }
            var responseType = options2.responseType || "json";
            var fetchOptions = {
              method: options2.method || "GET",
              headers: fetchHeaders,
              mode: options2.mode || "cors",
              credentials: options2.credentials || "same-origin",
              cache: options2.cache || "default",
              redirect: options2.redirect || "follow",
              referrer: options2.referrer || "client",
              signal: instance2.controller.signal
            };
            fetch(fetchRequest, fetchOptions).then(function(response) {
              instance2.response = response;
              var progressAvailable = true;
              if (!response.body) {
                progressAvailable = false;
              }
              var contentLength = response.headers.get("content-length");
              if (contentLength === null) {
                progressAvailable = false;
              }
              if (!progressAvailable) {
                return response;
              }
              instance2.onProgress = function(e) {
                instance2.fireEvent("progress", e);
              };
              return new Response(new ReadableStream(new ProgressHandler(instance2, contentLength, response)), fetchOptions);
            }).then(function(response) {
              var errMsg;
              if (response.ok) {
                switch (responseType) {
                  case "arraybuffer":
                    return response.arrayBuffer();
                  case "json":
                    return response.json();
                  case "blob":
                    return response.blob();
                  case "text":
                    return response.text();
                  default:
                    errMsg = "Unknown responseType: " + responseType;
                    break;
                }
              }
              if (!errMsg) {
                errMsg = "HTTP error status: " + response.status;
              }
              throw new Error(errMsg);
            }).then(function(response) {
              instance2.fireEvent("success", response);
            }).catch(function(error) {
              instance2.fireEvent("error", error);
            });
            instance2.fetchRequest = fetchRequest;
            return instance2;
          }
          module2.exports = exports2.default;
        },
        "./src/util/frame.js": (module2, exports2, __webpack_require__2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = frame;
          var _requestAnimationFrame = _interopRequireDefault2(__webpack_require__2("./src/util/request-animation-frame.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function frame(func) {
            return function() {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              return (0, _requestAnimationFrame.default)(function() {
                return func.apply(void 0, args);
              });
            };
          }
          module2.exports = exports2.default;
        },
        "./src/util/get-id.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = getId2;
          function getId2(prefix) {
            if (prefix === void 0) {
              prefix = "wavesurfer_";
            }
            return prefix + Math.random().toString(32).substring(2);
          }
          module2.exports = exports2.default;
        },
        "./src/util/index.js": (__unused_webpack_module, exports2, __webpack_require__2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          Object.defineProperty(exports2, "Observer", {
            enumerable: true,
            get: function get3() {
              return _observer.default;
            }
          });
          Object.defineProperty(exports2, "absMax", {
            enumerable: true,
            get: function get3() {
              return _absMax.default;
            }
          });
          Object.defineProperty(exports2, "clamp", {
            enumerable: true,
            get: function get3() {
              return _clamp.default;
            }
          });
          Object.defineProperty(exports2, "debounce", {
            enumerable: true,
            get: function get3() {
              return _debounce.default;
            }
          });
          Object.defineProperty(exports2, "fetchFile", {
            enumerable: true,
            get: function get3() {
              return _fetch.default;
            }
          });
          Object.defineProperty(exports2, "frame", {
            enumerable: true,
            get: function get3() {
              return _frame.default;
            }
          });
          Object.defineProperty(exports2, "getId", {
            enumerable: true,
            get: function get3() {
              return _getId.default;
            }
          });
          Object.defineProperty(exports2, "ignoreSilenceMode", {
            enumerable: true,
            get: function get3() {
              return _silenceMode.default;
            }
          });
          Object.defineProperty(exports2, "max", {
            enumerable: true,
            get: function get3() {
              return _max.default;
            }
          });
          Object.defineProperty(exports2, "min", {
            enumerable: true,
            get: function get3() {
              return _min.default;
            }
          });
          Object.defineProperty(exports2, "preventClick", {
            enumerable: true,
            get: function get3() {
              return _preventClick.default;
            }
          });
          Object.defineProperty(exports2, "requestAnimationFrame", {
            enumerable: true,
            get: function get3() {
              return _requestAnimationFrame.default;
            }
          });
          Object.defineProperty(exports2, "style", {
            enumerable: true,
            get: function get3() {
              return _style.default;
            }
          });
          Object.defineProperty(exports2, "withOrientation", {
            enumerable: true,
            get: function get3() {
              return _orientation.default;
            }
          });
          var _getId = _interopRequireDefault2(__webpack_require__2("./src/util/get-id.js"));
          var _max = _interopRequireDefault2(__webpack_require__2("./src/util/max.js"));
          var _min = _interopRequireDefault2(__webpack_require__2("./src/util/min.js"));
          var _absMax = _interopRequireDefault2(__webpack_require__2("./src/util/absMax.js"));
          var _observer = _interopRequireDefault2(__webpack_require__2("./src/util/observer.js"));
          var _style = _interopRequireDefault2(__webpack_require__2("./src/util/style.js"));
          var _requestAnimationFrame = _interopRequireDefault2(__webpack_require__2("./src/util/request-animation-frame.js"));
          var _frame = _interopRequireDefault2(__webpack_require__2("./src/util/frame.js"));
          var _debounce = _interopRequireDefault2(__webpack_require__2("./node_modules/debounce/index.js"));
          var _preventClick = _interopRequireDefault2(__webpack_require__2("./src/util/prevent-click.js"));
          var _fetch = _interopRequireDefault2(__webpack_require__2("./src/util/fetch.js"));
          var _clamp = _interopRequireDefault2(__webpack_require__2("./src/util/clamp.js"));
          var _orientation = _interopRequireDefault2(__webpack_require__2("./src/util/orientation.js"));
          var _silenceMode = _interopRequireDefault2(__webpack_require__2("./src/util/silence-mode.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
        },
        "./src/util/max.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = max;
          function max(values) {
            var largest = -Infinity;
            Object.keys(values).forEach(function(i) {
              if (values[i] > largest) {
                largest = values[i];
              }
            });
            return largest;
          }
          module2.exports = exports2.default;
        },
        "./src/util/min.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = min;
          function min(values) {
            var smallest = Number(Infinity);
            Object.keys(values).forEach(function(i) {
              if (values[i] < smallest) {
                smallest = values[i];
              }
            });
            return smallest;
          }
          module2.exports = exports2.default;
        },
        "./src/util/observer.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          var Observer = /* @__PURE__ */ function() {
            function Observer2() {
              _classCallCheck(this, Observer2);
              this._disabledEventEmissions = [];
              this.handlers = null;
            }
            _createClass(Observer2, [{
              key: "on",
              value: function on2(event, fn) {
                var _this = this;
                if (!this.handlers) {
                  this.handlers = {};
                }
                var handlers = this.handlers[event];
                if (!handlers) {
                  handlers = this.handlers[event] = [];
                }
                handlers.push(fn);
                return {
                  name: event,
                  callback: fn,
                  un: function un(e, fn2) {
                    return _this.un(e, fn2);
                  }
                };
              }
            }, {
              key: "un",
              value: function un(event, fn) {
                if (!this.handlers) {
                  return;
                }
                var handlers = this.handlers[event];
                var i;
                if (handlers) {
                  if (fn) {
                    for (i = handlers.length - 1; i >= 0; i--) {
                      if (handlers[i] == fn) {
                        handlers.splice(i, 1);
                      }
                    }
                  } else {
                    handlers.length = 0;
                  }
                }
              }
            }, {
              key: "unAll",
              value: function unAll() {
                this.handlers = null;
              }
            }, {
              key: "once",
              value: function once(event, handler) {
                var _this2 = this;
                var fn = function fn2() {
                  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }
                  handler.apply(_this2, args);
                  setTimeout(function() {
                    _this2.un(event, fn2);
                  }, 0);
                };
                return this.on(event, fn);
              }
            }, {
              key: "setDisabledEventEmissions",
              value: function setDisabledEventEmissions(eventNames) {
                this._disabledEventEmissions = eventNames;
              }
            }, {
              key: "_isDisabledEventEmission",
              value: function _isDisabledEventEmission(event) {
                return this._disabledEventEmissions && this._disabledEventEmissions.includes(event);
              }
            }, {
              key: "fireEvent",
              value: function fireEvent(event) {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }
                if (!this.handlers || this._isDisabledEventEmission(event)) {
                  return;
                }
                var handlers = this.handlers[event];
                handlers && handlers.forEach(function(fn) {
                  fn.apply(void 0, args);
                });
              }
            }]);
            return Observer2;
          }();
          exports2["default"] = Observer;
          module2.exports = exports2.default;
        },
        "./src/util/orientation.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = withOrientation;
          var verticalPropMap = {
            width: "height",
            height: "width",
            overflowX: "overflowY",
            overflowY: "overflowX",
            clientWidth: "clientHeight",
            clientHeight: "clientWidth",
            clientX: "clientY",
            clientY: "clientX",
            scrollWidth: "scrollHeight",
            scrollLeft: "scrollTop",
            offsetLeft: "offsetTop",
            offsetTop: "offsetLeft",
            offsetHeight: "offsetWidth",
            offsetWidth: "offsetHeight",
            left: "top",
            right: "bottom",
            top: "left",
            bottom: "right",
            borderRightStyle: "borderBottomStyle",
            borderRightWidth: "borderBottomWidth",
            borderRightColor: "borderBottomColor"
          };
          function mapProp(prop, vertical) {
            if (Object.prototype.hasOwnProperty.call(verticalPropMap, prop)) {
              return vertical ? verticalPropMap[prop] : prop;
            } else {
              return prop;
            }
          }
          var isProxy2 = Symbol("isProxy");
          function withOrientation(target, vertical) {
            if (target[isProxy2]) {
              return target;
            } else {
              return new Proxy(target, {
                get: function get3(obj, prop, receiver) {
                  if (prop === isProxy2) {
                    return true;
                  } else if (prop === "domElement") {
                    return obj;
                  } else if (prop === "style") {
                    return withOrientation(obj.style, vertical);
                  } else if (prop === "canvas") {
                    return withOrientation(obj.canvas, vertical);
                  } else if (prop === "getBoundingClientRect") {
                    return function() {
                      return withOrientation(obj.getBoundingClientRect.apply(obj, arguments), vertical);
                    };
                  } else if (prop === "getContext") {
                    return function() {
                      return withOrientation(obj.getContext.apply(obj, arguments), vertical);
                    };
                  } else {
                    var value = obj[mapProp(prop, vertical)];
                    return typeof value == "function" ? value.bind(obj) : value;
                  }
                },
                set: function set2(obj, prop, value) {
                  obj[mapProp(prop, vertical)] = value;
                  return true;
                }
              });
            }
          }
          module2.exports = exports2.default;
        },
        "./src/util/prevent-click.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = preventClick;
          function preventClickHandler(event) {
            event.stopPropagation();
            document.body.removeEventListener("click", preventClickHandler, true);
          }
          function preventClick(values) {
            document.body.addEventListener("click", preventClickHandler, true);
          }
          module2.exports = exports2.default;
        },
        "./src/util/request-animation-frame.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var _default = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element2) {
            return setTimeout(callback, 1e3 / 60);
          }).bind(window);
          exports2["default"] = _default;
          module2.exports = exports2.default;
        },
        "./src/util/silence-mode.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = ignoreSilenceMode;
          function ignoreSilenceMode() {
            var audioData = "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADgnABGiAAQBCqgCRMAAgEAH///////////////7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq//////////////////9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
            var tmp = document.createElement("div");
            tmp.innerHTML = '<audio x-webkit-airplay="deny"></audio>';
            var audioSilentMode = tmp.children.item(0);
            audioSilentMode.src = audioData;
            audioSilentMode.preload = "auto";
            audioSilentMode.type = "audio/mpeg";
            audioSilentMode.disableRemotePlayback = true;
            audioSilentMode.play();
            audioSilentMode.remove();
            tmp.remove();
          }
          module2.exports = exports2.default;
        },
        "./src/util/style.js": (module2, exports2) => {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = style;
          function style(el, styles) {
            Object.keys(styles).forEach(function(prop) {
              if (el.style[prop] !== styles[prop]) {
                el.style[prop] = styles[prop];
              }
            });
            return el;
          }
          module2.exports = exports2.default;
        },
        "./src/wavesurfer.js": (module2, exports2, __webpack_require__2) => {
          function _typeof2(obj) {
            "@babel/helpers - typeof";
            return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
              return typeof obj2;
            } : function(obj2) {
              return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, _typeof2(obj);
          }
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var util = _interopRequireWildcard2(__webpack_require__2("./src/util/index.js"));
          var _drawer = _interopRequireDefault2(__webpack_require__2("./src/drawer.multicanvas.js"));
          var _webaudio = _interopRequireDefault2(__webpack_require__2("./src/webaudio.js"));
          var _mediaelement = _interopRequireDefault2(__webpack_require__2("./src/mediaelement.js"));
          var _peakcache = _interopRequireDefault2(__webpack_require__2("./src/peakcache.js"));
          var _mediaelementWebaudio = _interopRequireDefault2(__webpack_require__2("./src/mediaelement-webaudio.js"));
          function _interopRequireDefault2(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function")
              return null;
            var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
            var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
            return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
              return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
            })(nodeInterop);
          }
          function _interopRequireWildcard2(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) {
              return obj;
            }
            if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
              return { default: obj };
            }
            var cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) {
              return cache.get(obj);
            }
            var newObj = {};
            var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var key in obj) {
              if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                if (desc && (desc.get || desc.set)) {
                  Object.defineProperty(newObj, key, desc);
                } else {
                  newObj[key] = obj[key];
                }
              }
            }
            newObj.default = obj;
            if (cache) {
              cache.set(obj, newObj);
            }
            return newObj;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            Object.defineProperty(subClass, "prototype", { writable: false });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p2) {
            _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
              o2.__proto__ = p3;
              return o2;
            };
            return _setPrototypeOf(o, p2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof2(call) === "object" || typeof call === "function")) {
              return call;
            } else if (call !== void 0) {
              throw new TypeError("Derived constructors may only return object or undefined");
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          var WaveSurfer2 = /* @__PURE__ */ function(_util$Observer) {
            _inherits(WaveSurfer3, _util$Observer);
            var _super = _createSuper(WaveSurfer3);
            function WaveSurfer3(params) {
              var _this;
              _classCallCheck(this, WaveSurfer3);
              _this = _super.call(this);
              _defineProperty(_assertThisInitialized(_this), "defaultParams", {
                audioContext: null,
                audioScriptProcessor: null,
                audioRate: 1,
                autoCenter: true,
                autoCenterRate: 5,
                autoCenterImmediately: false,
                backend: "WebAudio",
                backgroundColor: null,
                barHeight: 1,
                barRadius: 0,
                barGap: null,
                barMinHeight: null,
                container: null,
                cursorColor: "#333",
                cursorWidth: 1,
                dragSelection: true,
                drawingContextAttributes: {
                  desynchronized: false
                },
                duration: null,
                fillParent: true,
                forceDecode: false,
                height: 128,
                hideScrollbar: false,
                hideCursor: false,
                ignoreSilenceMode: false,
                interact: true,
                loopSelection: true,
                maxCanvasWidth: 4e3,
                mediaContainer: null,
                mediaControls: false,
                mediaType: "audio",
                minPxPerSec: 20,
                normalize: false,
                partialRender: false,
                pixelRatio: window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI,
                plugins: [],
                progressColor: "#555",
                removeMediaElementOnDestroy: true,
                renderer: _drawer.default,
                responsive: false,
                rtl: false,
                scrollParent: false,
                skipLength: 2,
                splitChannels: false,
                splitChannelsOptions: {
                  overlay: false,
                  channelColors: {},
                  filterChannels: [],
                  relativeNormalization: false,
                  splitDragSelection: false
                },
                vertical: false,
                waveColor: "#999",
                xhr: {}
              });
              _defineProperty(_assertThisInitialized(_this), "backends", {
                MediaElement: _mediaelement.default,
                WebAudio: _webaudio.default,
                MediaElementWebAudio: _mediaelementWebaudio.default
              });
              _defineProperty(_assertThisInitialized(_this), "util", util);
              _this.params = Object.assign({}, _this.defaultParams, params);
              _this.params.splitChannelsOptions = Object.assign({}, _this.defaultParams.splitChannelsOptions, params.splitChannelsOptions);
              _this.container = "string" == typeof params.container ? document.querySelector(_this.params.container) : _this.params.container;
              if (!_this.container) {
                throw new Error("Container element not found");
              }
              if (_this.params.mediaContainer == null) {
                _this.mediaContainer = _this.container;
              } else if (typeof _this.params.mediaContainer == "string") {
                _this.mediaContainer = document.querySelector(_this.params.mediaContainer);
              } else {
                _this.mediaContainer = _this.params.mediaContainer;
              }
              if (!_this.mediaContainer) {
                throw new Error("Media Container element not found");
              }
              if (_this.params.maxCanvasWidth <= 1) {
                throw new Error("maxCanvasWidth must be greater than 1");
              } else if (_this.params.maxCanvasWidth % 2 == 1) {
                throw new Error("maxCanvasWidth must be an even number");
              }
              if (_this.params.rtl === true) {
                if (_this.params.vertical === true) {
                  util.style(_this.container, {
                    transform: "rotateX(180deg)"
                  });
                } else {
                  util.style(_this.container, {
                    transform: "rotateY(180deg)"
                  });
                }
              }
              if (_this.params.backgroundColor) {
                _this.setBackgroundColor(_this.params.backgroundColor);
              }
              _this.savedVolume = 0;
              _this.isMuted = false;
              _this.tmpEvents = [];
              _this.currentRequest = null;
              _this.arraybuffer = null;
              _this.drawer = null;
              _this.backend = null;
              _this.peakCache = null;
              if (typeof _this.params.renderer !== "function") {
                throw new Error("Renderer parameter is invalid");
              }
              _this.Drawer = _this.params.renderer;
              if (_this.params.backend == "AudioElement") {
                _this.params.backend = "MediaElement";
              }
              if ((_this.params.backend == "WebAudio" || _this.params.backend === "MediaElementWebAudio") && !_webaudio.default.prototype.supportsWebAudio.call(null)) {
                _this.params.backend = "MediaElement";
              }
              _this.Backend = _this.backends[_this.params.backend];
              _this.initialisedPluginList = {};
              _this.isDestroyed = false;
              _this.isReady = false;
              var prevWidth = 0;
              _this._onResize = util.debounce(function() {
                if (_this.drawer.wrapper && prevWidth != _this.drawer.wrapper.clientWidth && !_this.params.scrollParent) {
                  prevWidth = _this.drawer.wrapper.clientWidth;
                  if (prevWidth) {
                    _this.drawer.fireEvent("redraw");
                  }
                }
              }, typeof _this.params.responsive === "number" ? _this.params.responsive : 100);
              return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
            }
            _createClass(WaveSurfer3, [{
              key: "init",
              value: function init2() {
                this.registerPlugins(this.params.plugins);
                this.createDrawer();
                this.createBackend();
                this.createPeakCache();
                return this;
              }
            }, {
              key: "registerPlugins",
              value: function registerPlugins(plugins) {
                var _this2 = this;
                plugins.forEach(function(plugin) {
                  return _this2.addPlugin(plugin);
                });
                plugins.forEach(function(plugin) {
                  if (!plugin.deferInit) {
                    _this2.initPlugin(plugin.name);
                  }
                });
                this.fireEvent("plugins-registered", plugins);
                return this;
              }
            }, {
              key: "getActivePlugins",
              value: function getActivePlugins() {
                return this.initialisedPluginList;
              }
            }, {
              key: "addPlugin",
              value: function addPlugin(plugin) {
                var _this3 = this;
                if (!plugin.name) {
                  throw new Error("Plugin does not have a name!");
                }
                if (!plugin.instance) {
                  throw new Error("Plugin ".concat(plugin.name, " does not have an instance property!"));
                }
                if (plugin.staticProps) {
                  Object.keys(plugin.staticProps).forEach(function(pluginStaticProp) {
                    _this3[pluginStaticProp] = plugin.staticProps[pluginStaticProp];
                  });
                }
                var Instance = plugin.instance;
                var observerPrototypeKeys = Object.getOwnPropertyNames(util.Observer.prototype);
                observerPrototypeKeys.forEach(function(key) {
                  Instance.prototype[key] = util.Observer.prototype[key];
                });
                this[plugin.name] = new Instance(plugin.params || {}, this);
                this.fireEvent("plugin-added", plugin.name);
                return this;
              }
            }, {
              key: "initPlugin",
              value: function initPlugin(name) {
                if (!this[name]) {
                  throw new Error("Plugin ".concat(name, " has not been added yet!"));
                }
                if (this.initialisedPluginList[name]) {
                  this.destroyPlugin(name);
                }
                this[name].init();
                this.initialisedPluginList[name] = true;
                this.fireEvent("plugin-initialised", name);
                return this;
              }
            }, {
              key: "destroyPlugin",
              value: function destroyPlugin(name) {
                if (!this[name]) {
                  throw new Error("Plugin ".concat(name, " has not been added yet and cannot be destroyed!"));
                }
                if (!this.initialisedPluginList[name]) {
                  throw new Error("Plugin ".concat(name, " is not active and cannot be destroyed!"));
                }
                if (typeof this[name].destroy !== "function") {
                  throw new Error("Plugin ".concat(name, " does not have a destroy function!"));
                }
                this[name].destroy();
                delete this.initialisedPluginList[name];
                this.fireEvent("plugin-destroyed", name);
                return this;
              }
            }, {
              key: "destroyAllPlugins",
              value: function destroyAllPlugins() {
                var _this4 = this;
                Object.keys(this.initialisedPluginList).forEach(function(name) {
                  return _this4.destroyPlugin(name);
                });
              }
            }, {
              key: "createDrawer",
              value: function createDrawer() {
                var _this5 = this;
                this.drawer = new this.Drawer(this.container, this.params);
                this.drawer.init();
                this.fireEvent("drawer-created", this.drawer);
                if (this.params.responsive !== false) {
                  window.addEventListener("resize", this._onResize, true);
                  window.addEventListener("orientationchange", this._onResize, true);
                }
                this.drawer.on("redraw", function() {
                  _this5.drawBuffer();
                  _this5.drawer.progress(_this5.backend.getPlayedPercents());
                });
                this.drawer.on("click", function(e, progress) {
                  setTimeout(function() {
                    return _this5.seekTo(progress);
                  }, 0);
                });
                this.drawer.on("scroll", function(e) {
                  if (_this5.params.partialRender) {
                    _this5.drawBuffer();
                  }
                  _this5.fireEvent("scroll", e);
                });
              }
            }, {
              key: "createBackend",
              value: function createBackend() {
                var _this6 = this;
                if (this.backend) {
                  this.backend.destroy();
                }
                this.backend = new this.Backend(this.params);
                this.backend.init();
                this.fireEvent("backend-created", this.backend);
                this.backend.on("finish", function() {
                  _this6.drawer.progress(_this6.backend.getPlayedPercents());
                  _this6.fireEvent("finish");
                });
                this.backend.on("play", function() {
                  return _this6.fireEvent("play");
                });
                this.backend.on("pause", function() {
                  return _this6.fireEvent("pause");
                });
                this.backend.on("audioprocess", function(time) {
                  _this6.drawer.progress(_this6.backend.getPlayedPercents());
                  _this6.fireEvent("audioprocess", time);
                });
                if (this.params.backend === "MediaElement" || this.params.backend === "MediaElementWebAudio") {
                  this.backend.on("seek", function() {
                    _this6.drawer.progress(_this6.backend.getPlayedPercents());
                  });
                  this.backend.on("volume", function() {
                    var newVolume = _this6.getVolume();
                    _this6.fireEvent("volume", newVolume);
                    if (_this6.backend.isMuted !== _this6.isMuted) {
                      _this6.isMuted = _this6.backend.isMuted;
                      _this6.fireEvent("mute", _this6.isMuted);
                    }
                  });
                }
              }
            }, {
              key: "createPeakCache",
              value: function createPeakCache() {
                if (this.params.partialRender) {
                  this.peakCache = new _peakcache.default();
                }
              }
            }, {
              key: "getDuration",
              value: function getDuration() {
                return this.backend.getDuration();
              }
            }, {
              key: "getCurrentTime",
              value: function getCurrentTime() {
                return this.backend.getCurrentTime();
              }
            }, {
              key: "setCurrentTime",
              value: function setCurrentTime(seconds) {
                if (seconds >= this.getDuration()) {
                  this.seekTo(1);
                } else {
                  this.seekTo(seconds / this.getDuration());
                }
              }
            }, {
              key: "play",
              value: function play(start2, end) {
                var _this7 = this;
                if (this.params.ignoreSilenceMode) {
                  util.ignoreSilenceMode();
                }
                this.fireEvent("interaction", function() {
                  return _this7.play(start2, end);
                });
                return this.backend.play(start2, end);
              }
            }, {
              key: "setPlayEnd",
              value: function setPlayEnd(position) {
                this.backend.setPlayEnd(position);
              }
            }, {
              key: "pause",
              value: function pause() {
                if (!this.backend.isPaused()) {
                  return this.backend.pause();
                }
              }
            }, {
              key: "playPause",
              value: function playPause() {
                return this.backend.isPaused() ? this.play() : this.pause();
              }
            }, {
              key: "isPlaying",
              value: function isPlaying() {
                return !this.backend.isPaused();
              }
            }, {
              key: "skipBackward",
              value: function skipBackward(seconds) {
                this.skip(-seconds || -this.params.skipLength);
              }
            }, {
              key: "skipForward",
              value: function skipForward(seconds) {
                this.skip(seconds || this.params.skipLength);
              }
            }, {
              key: "skip",
              value: function skip(offset) {
                var duration = this.getDuration() || 1;
                var position = this.getCurrentTime() || 0;
                position = Math.max(0, Math.min(duration, position + (offset || 0)));
                this.seekAndCenter(position / duration);
              }
            }, {
              key: "seekAndCenter",
              value: function seekAndCenter(progress) {
                this.seekTo(progress);
                this.drawer.recenter(progress);
              }
            }, {
              key: "seekTo",
              value: function seekTo(progress) {
                var _this8 = this;
                if (typeof progress !== "number" || !isFinite(progress) || progress < 0 || progress > 1) {
                  throw new Error("Error calling wavesurfer.seekTo, parameter must be a number between 0 and 1!");
                }
                this.fireEvent("interaction", function() {
                  return _this8.seekTo(progress);
                });
                var isWebAudioBackend = this.params.backend === "WebAudio";
                var paused = this.backend.isPaused();
                if (isWebAudioBackend && !paused) {
                  this.backend.pause();
                }
                var oldScrollParent = this.params.scrollParent;
                this.params.scrollParent = false;
                this.backend.seekTo(progress * this.getDuration());
                this.drawer.progress(progress);
                if (isWebAudioBackend && !paused) {
                  this.backend.play();
                }
                this.params.scrollParent = oldScrollParent;
                this.fireEvent("seek", progress);
              }
            }, {
              key: "stop",
              value: function stop() {
                this.pause();
                this.seekTo(0);
                this.drawer.progress(0);
              }
            }, {
              key: "setSinkId",
              value: function setSinkId(deviceId) {
                return this.backend.setSinkId(deviceId);
              }
            }, {
              key: "setVolume",
              value: function setVolume(newVolume) {
                this.backend.setVolume(newVolume);
                this.fireEvent("volume", newVolume);
              }
            }, {
              key: "getVolume",
              value: function getVolume() {
                return this.backend.getVolume();
              }
            }, {
              key: "setPlaybackRate",
              value: function setPlaybackRate(rate) {
                this.backend.setPlaybackRate(rate);
              }
            }, {
              key: "getPlaybackRate",
              value: function getPlaybackRate() {
                return this.backend.getPlaybackRate();
              }
            }, {
              key: "toggleMute",
              value: function toggleMute() {
                this.setMute(!this.isMuted);
              }
            }, {
              key: "setMute",
              value: function setMute(mute) {
                if (mute === this.isMuted) {
                  this.fireEvent("mute", this.isMuted);
                  return;
                }
                if (this.backend.setMute) {
                  this.backend.setMute(mute);
                  this.isMuted = mute;
                } else {
                  if (mute) {
                    this.savedVolume = this.backend.getVolume();
                    this.backend.setVolume(0);
                    this.isMuted = true;
                    this.fireEvent("volume", 0);
                  } else {
                    this.backend.setVolume(this.savedVolume);
                    this.isMuted = false;
                    this.fireEvent("volume", this.savedVolume);
                  }
                }
                this.fireEvent("mute", this.isMuted);
              }
            }, {
              key: "getMute",
              value: function getMute() {
                return this.isMuted;
              }
            }, {
              key: "getFilters",
              value: function getFilters() {
                return this.backend.filters || [];
              }
            }, {
              key: "toggleScroll",
              value: function toggleScroll() {
                this.params.scrollParent = !this.params.scrollParent;
                this.drawBuffer();
              }
            }, {
              key: "toggleInteraction",
              value: function toggleInteraction() {
                this.params.interact = !this.params.interact;
              }
            }, {
              key: "getWaveColor",
              value: function getWaveColor() {
                var channelIdx = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
                if (this.params.splitChannelsOptions.channelColors[channelIdx]) {
                  return this.params.splitChannelsOptions.channelColors[channelIdx].waveColor;
                }
                return this.params.waveColor;
              }
            }, {
              key: "setWaveColor",
              value: function setWaveColor(color) {
                var channelIdx = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                if (this.params.splitChannelsOptions.channelColors[channelIdx]) {
                  this.params.splitChannelsOptions.channelColors[channelIdx].waveColor = color;
                } else {
                  this.params.waveColor = color;
                }
                this.drawBuffer();
              }
            }, {
              key: "getProgressColor",
              value: function getProgressColor() {
                var channelIdx = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
                if (this.params.splitChannelsOptions.channelColors[channelIdx]) {
                  return this.params.splitChannelsOptions.channelColors[channelIdx].progressColor;
                }
                return this.params.progressColor;
              }
            }, {
              key: "setProgressColor",
              value: function setProgressColor(color, channelIdx) {
                if (this.params.splitChannelsOptions.channelColors[channelIdx]) {
                  this.params.splitChannelsOptions.channelColors[channelIdx].progressColor = color;
                } else {
                  this.params.progressColor = color;
                }
                this.drawBuffer();
              }
            }, {
              key: "getBackgroundColor",
              value: function getBackgroundColor() {
                return this.params.backgroundColor;
              }
            }, {
              key: "setBackgroundColor",
              value: function setBackgroundColor(color) {
                this.params.backgroundColor = color;
                util.style(this.container, {
                  background: this.params.backgroundColor
                });
              }
            }, {
              key: "getCursorColor",
              value: function getCursorColor() {
                return this.params.cursorColor;
              }
            }, {
              key: "setCursorColor",
              value: function setCursorColor(color) {
                this.params.cursorColor = color;
                this.drawer.updateCursor();
              }
            }, {
              key: "getHeight",
              value: function getHeight() {
                return this.params.height;
              }
            }, {
              key: "setHeight",
              value: function setHeight(height) {
                this.params.height = height;
                this.drawer.setHeight(height * this.params.pixelRatio);
                this.drawBuffer();
              }
            }, {
              key: "setFilteredChannels",
              value: function setFilteredChannels(channelIndices) {
                this.params.splitChannelsOptions.filterChannels = channelIndices;
                this.drawBuffer();
              }
            }, {
              key: "drawBuffer",
              value: function drawBuffer() {
                var nominalWidth = Math.round(this.getDuration() * this.params.minPxPerSec * this.params.pixelRatio);
                var parentWidth = this.drawer.getWidth();
                var width = nominalWidth;
                var start2 = 0;
                var end = Math.max(start2 + parentWidth, width);
                if (this.params.fillParent && (!this.params.scrollParent || nominalWidth < parentWidth)) {
                  width = parentWidth;
                  start2 = 0;
                  end = width;
                }
                var peaks;
                if (this.params.partialRender) {
                  var newRanges = this.peakCache.addRangeToPeakCache(width, start2, end);
                  var i;
                  for (i = 0; i < newRanges.length; i++) {
                    peaks = this.backend.getPeaks(width, newRanges[i][0], newRanges[i][1]);
                    this.drawer.drawPeaks(peaks, width, newRanges[i][0], newRanges[i][1]);
                  }
                } else {
                  peaks = this.backend.getPeaks(width, start2, end);
                  this.drawer.drawPeaks(peaks, width, start2, end);
                }
                this.fireEvent("redraw", peaks, width);
              }
            }, {
              key: "zoom",
              value: function zoom(pxPerSec) {
                if (!pxPerSec) {
                  this.params.minPxPerSec = this.defaultParams.minPxPerSec;
                  this.params.scrollParent = false;
                } else {
                  this.params.minPxPerSec = pxPerSec;
                  this.params.scrollParent = true;
                }
                this.drawBuffer();
                this.drawer.progress(this.backend.getPlayedPercents());
                this.drawer.recenter(this.getCurrentTime() / this.getDuration());
                this.fireEvent("zoom", pxPerSec);
              }
            }, {
              key: "loadArrayBuffer",
              value: function loadArrayBuffer(arraybuffer) {
                var _this9 = this;
                this.decodeArrayBuffer(arraybuffer, function(data2) {
                  if (!_this9.isDestroyed) {
                    _this9.loadDecodedBuffer(data2);
                  }
                });
              }
            }, {
              key: "loadDecodedBuffer",
              value: function loadDecodedBuffer(buffer) {
                this.backend.load(buffer);
                this.drawBuffer();
                this.isReady = true;
                this.fireEvent("ready");
              }
            }, {
              key: "loadBlob",
              value: function loadBlob(blob) {
                var _this10 = this;
                var reader = new FileReader();
                reader.addEventListener("progress", function(e) {
                  return _this10.onProgress(e);
                });
                reader.addEventListener("load", function(e) {
                  return _this10.loadArrayBuffer(e.target.result);
                });
                reader.addEventListener("error", function() {
                  return _this10.fireEvent("error", "Error reading file");
                });
                reader.readAsArrayBuffer(blob);
                this.empty();
              }
            }, {
              key: "load",
              value: function load(url, peaks, preload, duration) {
                if (!url) {
                  throw new Error("url parameter cannot be empty");
                }
                this.empty();
                if (preload) {
                  var preloadIgnoreReasons = {
                    "Preload is not 'auto', 'none' or 'metadata'": ["auto", "metadata", "none"].indexOf(preload) === -1,
                    "Peaks are not provided": !peaks,
                    "Backend is not of type 'MediaElement' or 'MediaElementWebAudio'": ["MediaElement", "MediaElementWebAudio"].indexOf(this.params.backend) === -1,
                    "Url is not of type string": typeof url !== "string"
                  };
                  var activeReasons = Object.keys(preloadIgnoreReasons).filter(function(reason) {
                    return preloadIgnoreReasons[reason];
                  });
                  if (activeReasons.length) {
                    console.warn("Preload parameter of wavesurfer.load will be ignored because:\n	- " + activeReasons.join("\n	- "));
                    preload = null;
                  }
                }
                if (this.params.backend === "WebAudio" && url instanceof HTMLMediaElement) {
                  url = url.src;
                }
                switch (this.params.backend) {
                  case "WebAudio":
                    return this.loadBuffer(url, peaks, duration);
                  case "MediaElement":
                  case "MediaElementWebAudio":
                    return this.loadMediaElement(url, peaks, preload, duration);
                }
              }
            }, {
              key: "loadBuffer",
              value: function loadBuffer(url, peaks, duration) {
                var _this11 = this;
                var load = function load2(action) {
                  if (action) {
                    _this11.tmpEvents.push(_this11.once("ready", action));
                  }
                  return _this11.getArrayBuffer(url, function(data2) {
                    return _this11.loadArrayBuffer(data2);
                  });
                };
                if (peaks) {
                  this.backend.setPeaks(peaks, duration);
                  this.drawBuffer();
                  this.fireEvent("waveform-ready");
                  this.tmpEvents.push(this.once("interaction", load));
                } else {
                  return load();
                }
              }
            }, {
              key: "loadMediaElement",
              value: function loadMediaElement(urlOrElt, peaks, preload, duration) {
                var _this12 = this;
                var url = urlOrElt;
                if (typeof urlOrElt === "string") {
                  this.backend.load(url, this.mediaContainer, peaks, preload);
                } else {
                  var elt = urlOrElt;
                  this.backend.loadElt(elt, peaks);
                  url = elt.src;
                }
                this.tmpEvents.push(this.backend.once("canplay", function() {
                  if (!_this12.backend.destroyed) {
                    _this12.drawBuffer();
                    _this12.isReady = true;
                    _this12.fireEvent("ready");
                  }
                }), this.backend.once("error", function(err) {
                  return _this12.fireEvent("error", err);
                }));
                if (peaks) {
                  this.backend.setPeaks(peaks, duration);
                  this.drawBuffer();
                  this.fireEvent("waveform-ready");
                }
                if ((!peaks || this.params.forceDecode) && this.backend.supportsWebAudio()) {
                  this.getArrayBuffer(url, function(arraybuffer) {
                    _this12.decodeArrayBuffer(arraybuffer, function(buffer) {
                      _this12.backend.buffer = buffer;
                      _this12.backend.setPeaks(null);
                      _this12.drawBuffer();
                      _this12.fireEvent("waveform-ready");
                    });
                  });
                }
              }
            }, {
              key: "decodeArrayBuffer",
              value: function decodeArrayBuffer(arraybuffer, callback) {
                var _this13 = this;
                if (!this.isDestroyed) {
                  this.arraybuffer = arraybuffer;
                  this.backend.decodeArrayBuffer(arraybuffer, function(data2) {
                    if (!_this13.isDestroyed && _this13.arraybuffer == arraybuffer) {
                      callback(data2);
                      _this13.arraybuffer = null;
                    }
                  }, function() {
                    return _this13.fireEvent("error", "Error decoding audiobuffer");
                  });
                }
              }
            }, {
              key: "getArrayBuffer",
              value: function getArrayBuffer(url, callback) {
                var _this14 = this;
                var options2 = Object.assign({
                  url,
                  responseType: "arraybuffer"
                }, this.params.xhr);
                var request = util.fetchFile(options2);
                this.currentRequest = request;
                this.tmpEvents.push(request.on("progress", function(e) {
                  _this14.onProgress(e);
                }), request.on("success", function(data2) {
                  callback(data2);
                  _this14.currentRequest = null;
                }), request.on("error", function(e) {
                  _this14.fireEvent("error", e);
                  _this14.currentRequest = null;
                }));
                return request;
              }
            }, {
              key: "onProgress",
              value: function onProgress(e) {
                var percentComplete;
                if (e.lengthComputable) {
                  percentComplete = e.loaded / e.total;
                } else {
                  percentComplete = e.loaded / (e.loaded + 1e6);
                }
                this.fireEvent("loading", Math.round(percentComplete * 100), e.target);
              }
            }, {
              key: "exportPCM",
              value: function exportPCM(length, accuracy, noWindow, start2, end) {
                length = length || 1024;
                start2 = start2 || 0;
                accuracy = accuracy || 1e4;
                noWindow = noWindow || false;
                var peaks = this.backend.getPeaks(length, start2, end);
                var arr = [].map.call(peaks, function(val) {
                  return Math.round(val * accuracy) / accuracy;
                });
                return new Promise(function(resolve3, reject) {
                  if (!noWindow) {
                    var blobJSON = new Blob([JSON.stringify(arr)], {
                      type: "application/json;charset=utf-8"
                    });
                    var objURL = URL.createObjectURL(blobJSON);
                    window.open(objURL);
                    URL.revokeObjectURL(objURL);
                  }
                  resolve3(arr);
                });
              }
            }, {
              key: "exportImage",
              value: function exportImage(format, quality, type) {
                if (!format) {
                  format = "image/png";
                }
                if (!quality) {
                  quality = 1;
                }
                if (!type) {
                  type = "dataURL";
                }
                return this.drawer.getImage(format, quality, type);
              }
            }, {
              key: "cancelAjax",
              value: function cancelAjax() {
                if (this.currentRequest && this.currentRequest.controller) {
                  if (this.currentRequest._reader) {
                    this.currentRequest._reader.cancel().catch(function(err) {
                    });
                  }
                  this.currentRequest.controller.abort();
                  this.currentRequest = null;
                }
              }
            }, {
              key: "clearTmpEvents",
              value: function clearTmpEvents() {
                this.tmpEvents.forEach(function(e) {
                  return e.un();
                });
              }
            }, {
              key: "empty",
              value: function empty() {
                if (!this.backend.isPaused()) {
                  this.stop();
                  this.backend.disconnectSource();
                }
                this.isReady = false;
                this.cancelAjax();
                this.clearTmpEvents();
                this.drawer.progress(0);
                this.drawer.setWidth(0);
                this.drawer.drawPeaks({
                  length: this.drawer.getWidth()
                }, 0);
              }
            }, {
              key: "destroy",
              value: function destroy() {
                this.destroyAllPlugins();
                this.fireEvent("destroy");
                this.cancelAjax();
                this.clearTmpEvents();
                this.unAll();
                if (this.params.responsive !== false) {
                  window.removeEventListener("resize", this._onResize, true);
                  window.removeEventListener("orientationchange", this._onResize, true);
                }
                if (this.backend) {
                  this.backend.destroy();
                  this.backend = null;
                }
                if (this.drawer) {
                  this.drawer.destroy();
                }
                this.isDestroyed = true;
                this.isReady = false;
                this.arraybuffer = null;
              }
            }], [{
              key: "create",
              value: function create(params) {
                var wavesurfer2 = new WaveSurfer3(params);
                return wavesurfer2.init();
              }
            }]);
            return WaveSurfer3;
          }(util.Observer);
          exports2["default"] = WaveSurfer2;
          _defineProperty(WaveSurfer2, "VERSION", "6.4.0");
          _defineProperty(WaveSurfer2, "util", util);
          module2.exports = exports2.default;
        },
        "./src/webaudio.js": (module2, exports2, __webpack_require__2) => {
          function _typeof2(obj) {
            "@babel/helpers - typeof";
            return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
              return typeof obj2;
            } : function(obj2) {
              return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, _typeof2(obj);
          }
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2["default"] = void 0;
          var util = _interopRequireWildcard2(__webpack_require__2("./src/util/index.js"));
          function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function")
              return null;
            var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
            var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
            return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
              return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
            })(nodeInterop);
          }
          function _interopRequireWildcard2(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) {
              return obj;
            }
            if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
              return { default: obj };
            }
            var cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) {
              return cache.get(obj);
            }
            var newObj = {};
            var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var key in obj) {
              if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                if (desc && (desc.get || desc.set)) {
                  Object.defineProperty(newObj, key, desc);
                } else {
                  newObj[key] = obj[key];
                }
              }
            }
            newObj.default = obj;
            if (cache) {
              cache.set(obj, newObj);
            }
            return newObj;
          }
          function _classCallCheck(instance2, Constructor) {
            if (!(instance2 instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", { writable: false });
            return Constructor;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            Object.defineProperty(subClass, "prototype", { writable: false });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o, p2) {
            _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
              o2.__proto__ = p3;
              return o2;
            };
            return _setPrototypeOf(o, p2);
          }
          function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
              var Super = _getPrototypeOf(Derived), result;
              if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
              } else {
                result = Super.apply(this, arguments);
              }
              return _possibleConstructorReturn(this, result);
            };
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof2(call) === "object" || typeof call === "function")) {
              return call;
            } else if (call !== void 0) {
              throw new TypeError("Derived constructors may only return object or undefined");
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy === "function")
              return true;
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
              return true;
            } catch (e) {
              return false;
            }
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          var PLAYING = "playing";
          var PAUSED = "paused";
          var FINISHED = "finished";
          var WebAudio = /* @__PURE__ */ function(_util$Observer) {
            _inherits(WebAudio2, _util$Observer);
            var _super = _createSuper(WebAudio2);
            function WebAudio2(params) {
              var _defineProperty2, _this$states;
              var _this;
              _classCallCheck(this, WebAudio2);
              _this = _super.call(this);
              _defineProperty(_assertThisInitialized(_this), "audioContext", null);
              _defineProperty(_assertThisInitialized(_this), "offlineAudioContext", null);
              _defineProperty(_assertThisInitialized(_this), "stateBehaviors", (_defineProperty2 = {}, _defineProperty(_defineProperty2, PLAYING, {
                init: function init2() {
                  this.addOnAudioProcess();
                },
                getPlayedPercents: function getPlayedPercents() {
                  var duration = this.getDuration();
                  return this.getCurrentTime() / duration || 0;
                },
                getCurrentTime: function getCurrentTime() {
                  return this.startPosition + this.getPlayedTime();
                }
              }), _defineProperty(_defineProperty2, PAUSED, {
                init: function init2() {
                  this.removeOnAudioProcess();
                },
                getPlayedPercents: function getPlayedPercents() {
                  var duration = this.getDuration();
                  return this.getCurrentTime() / duration || 0;
                },
                getCurrentTime: function getCurrentTime() {
                  return this.startPosition;
                }
              }), _defineProperty(_defineProperty2, FINISHED, {
                init: function init2() {
                  this.removeOnAudioProcess();
                  this.fireEvent("finish");
                },
                getPlayedPercents: function getPlayedPercents() {
                  return 1;
                },
                getCurrentTime: function getCurrentTime() {
                  return this.getDuration();
                }
              }), _defineProperty2));
              _this.params = params;
              _this.ac = params.audioContext || (_this.supportsWebAudio() ? _this.getAudioContext() : {});
              _this.lastPlay = _this.ac.currentTime;
              _this.startPosition = 0;
              _this.scheduledPause = null;
              _this.states = (_this$states = {}, _defineProperty(_this$states, PLAYING, Object.create(_this.stateBehaviors[PLAYING])), _defineProperty(_this$states, PAUSED, Object.create(_this.stateBehaviors[PAUSED])), _defineProperty(_this$states, FINISHED, Object.create(_this.stateBehaviors[FINISHED])), _this$states);
              _this.buffer = null;
              _this.filters = [];
              _this.gainNode = null;
              _this.mergedPeaks = null;
              _this.offlineAc = null;
              _this.peaks = null;
              _this.playbackRate = 1;
              _this.analyser = null;
              _this.scriptNode = null;
              _this.source = null;
              _this.splitPeaks = [];
              _this.state = null;
              _this.explicitDuration = params.duration;
              _this.sinkStreamDestination = null;
              _this.sinkAudioElement = null;
              _this.destroyed = false;
              return _this;
            }
            _createClass(WebAudio2, [{
              key: "supportsWebAudio",
              value: function supportsWebAudio() {
                return !!(window.AudioContext || window.webkitAudioContext);
              }
            }, {
              key: "getAudioContext",
              value: function getAudioContext() {
                if (!window.WaveSurferAudioContext) {
                  window.WaveSurferAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                return window.WaveSurferAudioContext;
              }
            }, {
              key: "getOfflineAudioContext",
              value: function getOfflineAudioContext(sampleRate) {
                if (!window.WaveSurferOfflineAudioContext) {
                  window.WaveSurferOfflineAudioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 2, sampleRate);
                }
                return window.WaveSurferOfflineAudioContext;
              }
            }, {
              key: "init",
              value: function init2() {
                this.createVolumeNode();
                this.createScriptNode();
                this.createAnalyserNode();
                this.setState(PAUSED);
                this.setPlaybackRate(this.params.audioRate);
                this.setLength(0);
              }
            }, {
              key: "disconnectFilters",
              value: function disconnectFilters() {
                if (this.filters) {
                  this.filters.forEach(function(filter) {
                    filter && filter.disconnect();
                  });
                  this.filters = null;
                  this.analyser.connect(this.gainNode);
                }
              }
            }, {
              key: "setState",
              value: function setState(state2) {
                if (this.state !== this.states[state2]) {
                  this.state = this.states[state2];
                  this.state.init.call(this);
                }
              }
            }, {
              key: "setFilter",
              value: function setFilter() {
                for (var _len = arguments.length, filters = new Array(_len), _key = 0; _key < _len; _key++) {
                  filters[_key] = arguments[_key];
                }
                this.setFilters(filters);
              }
            }, {
              key: "setFilters",
              value: function setFilters(filters) {
                this.disconnectFilters();
                if (filters && filters.length) {
                  this.filters = filters;
                  this.analyser.disconnect();
                  filters.reduce(function(prev, curr) {
                    prev.connect(curr);
                    return curr;
                  }, this.analyser).connect(this.gainNode);
                }
              }
            }, {
              key: "createScriptNode",
              value: function createScriptNode() {
                if (this.params.audioScriptProcessor) {
                  this.scriptNode = this.params.audioScriptProcessor;
                } else {
                  if (this.ac.createScriptProcessor) {
                    this.scriptNode = this.ac.createScriptProcessor(WebAudio2.scriptBufferSize);
                  } else {
                    this.scriptNode = this.ac.createJavaScriptNode(WebAudio2.scriptBufferSize);
                  }
                }
                this.scriptNode.connect(this.ac.destination);
              }
            }, {
              key: "addOnAudioProcess",
              value: function addOnAudioProcess() {
                var _this2 = this;
                this.scriptNode.onaudioprocess = function() {
                  var time = _this2.getCurrentTime();
                  if (time >= _this2.getDuration()) {
                    _this2.setState(FINISHED);
                    _this2.fireEvent("pause");
                  } else if (time >= _this2.scheduledPause) {
                    _this2.pause();
                  } else if (_this2.state === _this2.states[PLAYING]) {
                    _this2.fireEvent("audioprocess", time);
                  }
                };
              }
            }, {
              key: "removeOnAudioProcess",
              value: function removeOnAudioProcess() {
                this.scriptNode.onaudioprocess = null;
              }
            }, {
              key: "createAnalyserNode",
              value: function createAnalyserNode() {
                this.analyser = this.ac.createAnalyser();
                this.analyser.connect(this.gainNode);
              }
            }, {
              key: "createVolumeNode",
              value: function createVolumeNode() {
                if (this.ac.createGain) {
                  this.gainNode = this.ac.createGain();
                } else {
                  this.gainNode = this.ac.createGainNode();
                }
                this.gainNode.connect(this.ac.destination);
              }
            }, {
              key: "setSinkId",
              value: function setSinkId(deviceId) {
                if (deviceId) {
                  if (!this.sinkAudioElement) {
                    this.sinkAudioElement = new window.Audio();
                    this.sinkAudioElement.autoplay = true;
                  }
                  if (!this.sinkAudioElement.setSinkId) {
                    return Promise.reject(new Error("setSinkId is not supported in your browser"));
                  }
                  if (!this.sinkStreamDestination) {
                    this.sinkStreamDestination = this.ac.createMediaStreamDestination();
                  }
                  this.gainNode.disconnect();
                  this.gainNode.connect(this.sinkStreamDestination);
                  this.sinkAudioElement.srcObject = this.sinkStreamDestination.stream;
                  return this.sinkAudioElement.setSinkId(deviceId);
                } else {
                  return Promise.reject(new Error("Invalid deviceId: " + deviceId));
                }
              }
            }, {
              key: "setVolume",
              value: function setVolume(value) {
                this.gainNode.gain.setValueAtTime(value, this.ac.currentTime);
              }
            }, {
              key: "getVolume",
              value: function getVolume() {
                return this.gainNode.gain.value;
              }
            }, {
              key: "decodeArrayBuffer",
              value: function decodeArrayBuffer(arraybuffer, callback, errback) {
                if (!this.offlineAc) {
                  this.offlineAc = this.getOfflineAudioContext(this.ac && this.ac.sampleRate ? this.ac.sampleRate : 44100);
                }
                if ("webkitAudioContext" in window) {
                  this.offlineAc.decodeAudioData(arraybuffer, function(data2) {
                    return callback(data2);
                  }, errback);
                } else {
                  this.offlineAc.decodeAudioData(arraybuffer).then(function(data2) {
                    return callback(data2);
                  }).catch(function(err) {
                    return errback(err);
                  });
                }
              }
            }, {
              key: "setPeaks",
              value: function setPeaks(peaks, duration) {
                if (duration != null) {
                  this.explicitDuration = duration;
                }
                this.peaks = peaks;
              }
            }, {
              key: "setLength",
              value: function setLength(length) {
                if (this.mergedPeaks && length == 2 * this.mergedPeaks.length - 1 + 2) {
                  return;
                }
                this.splitPeaks = [];
                this.mergedPeaks = [];
                var channels = this.buffer ? this.buffer.numberOfChannels : 1;
                var c;
                for (c = 0; c < channels; c++) {
                  this.splitPeaks[c] = [];
                  this.splitPeaks[c][2 * (length - 1)] = 0;
                  this.splitPeaks[c][2 * (length - 1) + 1] = 0;
                }
                this.mergedPeaks[2 * (length - 1)] = 0;
                this.mergedPeaks[2 * (length - 1) + 1] = 0;
              }
            }, {
              key: "getPeaks",
              value: function getPeaks(length, first, last) {
                if (this.peaks) {
                  return this.peaks;
                }
                if (!this.buffer) {
                  return [];
                }
                first = first || 0;
                last = last || length - 1;
                this.setLength(length);
                if (!this.buffer) {
                  return this.params.splitChannels ? this.splitPeaks : this.mergedPeaks;
                }
                if (!this.buffer.length) {
                  var newBuffer = this.createBuffer(1, 4096, this.sampleRate);
                  this.buffer = newBuffer.buffer;
                }
                var sampleSize = this.buffer.length / length;
                var sampleStep = ~~(sampleSize / 10) || 1;
                var channels = this.buffer.numberOfChannels;
                var c;
                for (c = 0; c < channels; c++) {
                  var peaks = this.splitPeaks[c];
                  var chan = this.buffer.getChannelData(c);
                  var i = void 0;
                  for (i = first; i <= last; i++) {
                    var start2 = ~~(i * sampleSize);
                    var end = ~~(start2 + sampleSize);
                    var min = chan[start2];
                    var max = min;
                    var j = void 0;
                    for (j = start2; j < end; j += sampleStep) {
                      var value = chan[j];
                      if (value > max) {
                        max = value;
                      }
                      if (value < min) {
                        min = value;
                      }
                    }
                    peaks[2 * i] = max;
                    peaks[2 * i + 1] = min;
                    if (c == 0 || max > this.mergedPeaks[2 * i]) {
                      this.mergedPeaks[2 * i] = max;
                    }
                    if (c == 0 || min < this.mergedPeaks[2 * i + 1]) {
                      this.mergedPeaks[2 * i + 1] = min;
                    }
                  }
                }
                return this.params.splitChannels ? this.splitPeaks : this.mergedPeaks;
              }
            }, {
              key: "getPlayedPercents",
              value: function getPlayedPercents() {
                return this.state.getPlayedPercents.call(this);
              }
            }, {
              key: "disconnectSource",
              value: function disconnectSource() {
                if (this.source) {
                  this.source.disconnect();
                }
              }
            }, {
              key: "destroyWebAudio",
              value: function destroyWebAudio() {
                this.disconnectFilters();
                this.disconnectSource();
                this.gainNode.disconnect();
                this.scriptNode.disconnect();
                this.analyser.disconnect();
                if (this.params.closeAudioContext) {
                  if (typeof this.ac.close === "function" && this.ac.state != "closed") {
                    this.ac.close();
                  }
                  this.ac = null;
                  if (!this.params.audioContext) {
                    window.WaveSurferAudioContext = null;
                  } else {
                    this.params.audioContext = null;
                  }
                  window.WaveSurferOfflineAudioContext = null;
                }
                if (this.sinkStreamDestination) {
                  this.sinkAudioElement.pause();
                  this.sinkAudioElement.srcObject = null;
                  this.sinkStreamDestination.disconnect();
                  this.sinkStreamDestination = null;
                }
              }
            }, {
              key: "destroy",
              value: function destroy() {
                if (!this.isPaused()) {
                  this.pause();
                }
                this.unAll();
                this.buffer = null;
                this.destroyed = true;
                this.destroyWebAudio();
              }
            }, {
              key: "load",
              value: function load(buffer) {
                this.startPosition = 0;
                this.lastPlay = this.ac.currentTime;
                this.buffer = buffer;
                this.createSource();
              }
            }, {
              key: "createSource",
              value: function createSource() {
                this.disconnectSource();
                this.source = this.ac.createBufferSource();
                this.source.start = this.source.start || this.source.noteGrainOn;
                this.source.stop = this.source.stop || this.source.noteOff;
                this.setPlaybackRate(this.playbackRate);
                this.source.buffer = this.buffer;
                this.source.connect(this.analyser);
              }
            }, {
              key: "resumeAudioContext",
              value: function resumeAudioContext() {
                if (this.ac.state == "suspended") {
                  this.ac.resume && this.ac.resume();
                }
              }
            }, {
              key: "isPaused",
              value: function isPaused() {
                return this.state !== this.states[PLAYING];
              }
            }, {
              key: "getDuration",
              value: function getDuration() {
                if (this.explicitDuration) {
                  return this.explicitDuration;
                }
                if (!this.buffer) {
                  return 0;
                }
                return this.buffer.duration;
              }
            }, {
              key: "seekTo",
              value: function seekTo(start2, end) {
                if (!this.buffer) {
                  return;
                }
                this.scheduledPause = null;
                if (start2 == null) {
                  start2 = this.getCurrentTime();
                  if (start2 >= this.getDuration()) {
                    start2 = 0;
                  }
                }
                if (end == null) {
                  end = this.getDuration();
                }
                this.startPosition = start2;
                this.lastPlay = this.ac.currentTime;
                if (this.state === this.states[FINISHED]) {
                  this.setState(PAUSED);
                }
                return {
                  start: start2,
                  end
                };
              }
            }, {
              key: "getPlayedTime",
              value: function getPlayedTime() {
                return (this.ac.currentTime - this.lastPlay) * this.playbackRate;
              }
            }, {
              key: "play",
              value: function play(start2, end) {
                if (!this.buffer) {
                  return;
                }
                this.createSource();
                var adjustedTime = this.seekTo(start2, end);
                start2 = adjustedTime.start;
                end = adjustedTime.end;
                this.scheduledPause = end;
                this.source.start(0, start2);
                this.resumeAudioContext();
                this.setState(PLAYING);
                this.fireEvent("play");
              }
            }, {
              key: "pause",
              value: function pause() {
                this.scheduledPause = null;
                this.startPosition += this.getPlayedTime();
                try {
                  this.source && this.source.stop(0);
                } catch (err) {
                }
                this.setState(PAUSED);
                this.fireEvent("pause");
              }
            }, {
              key: "getCurrentTime",
              value: function getCurrentTime() {
                return this.state.getCurrentTime.call(this);
              }
            }, {
              key: "getPlaybackRate",
              value: function getPlaybackRate() {
                return this.playbackRate;
              }
            }, {
              key: "setPlaybackRate",
              value: function setPlaybackRate(value) {
                this.playbackRate = value || 1;
                this.source && this.source.playbackRate.setValueAtTime(this.playbackRate, this.ac.currentTime);
              }
            }, {
              key: "setPlayEnd",
              value: function setPlayEnd(end) {
                this.scheduledPause = end;
              }
            }]);
            return WebAudio2;
          }(util.Observer);
          exports2["default"] = WebAudio;
          _defineProperty(WebAudio, "scriptBufferSize", 256);
          module2.exports = exports2.default;
        },
        "./node_modules/debounce/index.js": (module2) => {
          function debounce(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            if (null == wait)
              wait = 100;
            function later() {
              var last = Date.now() - timestamp;
              if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
              } else {
                timeout = null;
                if (!immediate) {
                  result = func.apply(context, args);
                  context = args = null;
                }
              }
            }
            var debounced = function() {
              context = this;
              args = arguments;
              timestamp = Date.now();
              var callNow = immediate && !timeout;
              if (!timeout)
                timeout = setTimeout(later, wait);
              if (callNow) {
                result = func.apply(context, args);
                context = args = null;
              }
              return result;
            };
            debounced.clear = function() {
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
            };
            debounced.flush = function() {
              if (timeout) {
                result = func.apply(context, args);
                context = args = null;
                clearTimeout(timeout);
                timeout = null;
              }
            };
            return debounced;
          }
          debounce.debounce = debounce;
          module2.exports = debounce;
        }
      };
      var __webpack_module_cache__ = {};
      function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== void 0) {
          return cachedModule.exports;
        }
        var module2 = __webpack_module_cache__[moduleId] = {
          exports: {}
        };
        __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
        return module2.exports;
      }
      var __webpack_exports__ = __webpack_require__("./src/wavesurfer.js");
      return __webpack_exports__;
    })();
  });
})(wavesurfer);
var WaveSurfer = /* @__PURE__ */ getDefaultExportFromCjs(wavesurfer.exports);
var _style_0$1 = ".animate[data-v-eda23100]{animation-name:expand-eda23100;animation-duration:.75s;animation-fill-mode:forwards;transform-origin:50% 50%}.btn[data-v-eda23100]{background-color:var(--08ab5a8d);margin:5px;height:var(--4bafedcb);border-top-left-radius:20%;border-bottom-left-radius:20%;color:red}.progress[data-v-eda23100]{width:50px;height:var(--4bafedcb);display:flex;position:relative;align-items:center;margin-left:10px;min-width:50px;background-color:var(--08ab5a8d);border-top-right-radius:5px;border-bottom-right-radius:5px}.play-pause-btn[data-v-eda23100]{animation-name:expand-eda23100;animation-duration:.5s;animation-fill-mode:forwards;transform-origin:100% 0%}.play-pause-btn .icon[data-v-eda23100]{animation-name:rotate-eda23100;animation-duration:.5s;animation-fill-mode:forwards;transform-origin:center}@keyframes rotate-eda23100{0%{transform:rotate(0);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes expand-eda23100{0%{transform:scaleX(0%)}33%{transform:scaleX(1.1)}66%{transform:scaleX(.9)}to{transform:scaleX(1)}}\n";
const _hoisted_1$g = { style: { "width": "40px", "height": "50px", "text-align": "center" } };
const _hoisted_2$c = { style: { "width": "200px" } };
const _hoisted_3$c = {
  class: "progress",
  style: { "display": "none" }
};
const _hoisted_4$b = { style: { "justify-content": "center", "display": "flex" } };
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "WavePlayer",
  props: {
    "url": { type: String, required: true },
    "duration": { type: Number, required: false, default: 0 },
    "backgroundColor": { type: String, default: "#3f87f7" },
    "waveColor": { type: String, default: "#a2c4ff" },
    "progressColor": { type: String, default: "white" },
    "height": { type: Number, required: false, default: 25 },
    "animate": { type: Boolean, required: false, default: false },
    "autoLoad": { type: Boolean, default: true, required: false }
  },
  emits: ["hover-audio-progress", "update-progress-time"],
  setup(__props, { emit: emits }) {
    const props = __props;
    useCssVars((_ctx) => ({
      "08ab5a8d": unref(bg_color),
      "4bafedcb": __props.height
    }));
    const bg_color = props.backgroundColor;
    let vue_waveplayer_container = ref();
    let is_playing = ref(false);
    let finished = ref(false);
    ref(false);
    let duration = ref(props.duration);
    let pos = ref(0);
    let wavesurfer2 = null;
    ref(`width: ${document.documentElement.clientWidth - 100 - 20}px`);
    const progress = computed(() => {
      const totalSeconds = Math.floor(pos.value);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      const ret = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      emits("update-progress-time", ret);
      return ret;
    });
    async function play() {
      if (!props.autoLoad)
        wavesurfer2 == null ? void 0 : wavesurfer2.load(props.url);
      await until(() => wavesurfer2 != null && wavesurfer2.isReady);
      if (!wavesurfer2)
        return;
      is_playing.value = true;
      wavesurfer2.play();
    }
    async function pause() {
      if (!wavesurfer2 && is_playing.value)
        return;
      is_playing.value = false;
      wavesurfer2.pause();
    }
    function on_seek(progress2) {
      if (!is_playing.value) {
        play();
      }
    }
    function on_finish() {
      is_playing.value = false;
      finished.value = true;
    }
    async function until(predicate, interval = 100) {
      const poll = (done) => predicate() ? done() : setTimeout(() => poll(done), interval);
      return new Promise(poll);
    }
    onMounted(async () => {
      wavesurfer2 = WaveSurfer.create({
        container: vue_waveplayer_container.value,
        barRadius: 10,
        barWidth: 4,
        mediaControls: false,
        normalize: false,
        barHeight: 7,
        responsive: true,
        cursorColor: "transparent",
        fillParent: true,
        hideScrollbar: true,
        minPxPerSec: 10,
        height: props.height,
        waveColor: props.waveColor,
        progressColor: props.progressColor,
        backgroundColor: bg_color
      });
      wavesurfer2.on("seek", on_seek);
      wavesurfer2.on("finish", on_finish);
      wavesurfer2.on("audioprocess", (time) => pos.value = time);
      if (props.autoLoad)
        wavesurfer2.load(props.url);
      wavesurfer2.on("ready", () => {
        duration.value = wavesurfer2.getDuration();
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        style: { "display": "flex", "width": "250px", "background-color": "v-bind(bg_color)" },
        class: normalizeClass({ animate: __props.animate })
      }, [
        createBaseVNode("div", _hoisted_1$g, [
          !is_playing.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "btn play-pause-btn",
            onClick: play
          }, [
            createVNode(unref(Icon), {
              class: "icon",
              width: "26",
              icon: unref(data$1),
              inline: true
            }, null, 8, ["icon"])
          ])) : (openBlock(), createElementBlock("div", {
            key: 1,
            class: "btn play-pause-btn",
            onClick: pause
          }, [
            createVNode(unref(Icon), {
              class: "icon",
              width: "22",
              icon: unref(data),
              inline: true
            }, null, 8, ["icon"])
          ]))
        ]),
        createBaseVNode("div", _hoisted_2$c, [
          createBaseVNode("div", {
            id: "vue_waveplayer_container",
            ref_key: "vue_waveplayer_container",
            ref: vue_waveplayer_container
          }, null, 512)
        ]),
        createBaseVNode("div", _hoisted_3$c, [
          createBaseVNode("div", _hoisted_4$b, toDisplayString(unref(progress)), 1)
        ])
      ], 2);
    };
  }
});
var WavePlayer = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["styles", [_style_0$1]], ["__scopeId", "data-v-eda23100"]]);
const _sfc_main$f = {
  name: "AudioPlayer",
  components: {
    WavePlayer
  },
  props: {
    messageId: { type: [String, Number], default: null },
    src: { type: String, default: null },
    messageSelectionEnabled: { type: Boolean, required: true }
  },
  emits: ["hover-audio-progress", "update-progress-time"],
  data() {
  },
  computed: {
    playerUniqId() {
      return `audio-player${this.messageId}`;
    },
    audioSource() {
      if (this.src)
        return this.src;
      return null;
    }
  },
  mounted() {
  },
  methods: {}
};
const _hoisted_1$f = { class: "vac-audio-player" };
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wave_player = resolveComponent("wave-player");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$f, [
      createVNode(_component_wave_player, {
        id: $options.playerUniqId,
        duration: _ctx.duration,
        "onUpdate:duration": _cache[0] || (_cache[0] = ($event) => _ctx.duration = $event),
        "played-time": _ctx.playedTime,
        "onUpdate:played-time": _cache[1] || (_cache[1] = ($event) => _ctx.playedTime = $event),
        style: { "padding-right": "25px", "margin-bottom": "-20px" },
        onUpdateProgressTime: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update-progress-time", $event)),
        "background-color": "transparent",
        "wave-color": "skyblue",
        "progress-color": "white",
        height: 25,
        animate: false,
        url: $options.audioSource
      }, null, 8, ["id", "duration", "played-time", "url"])
    ])
  ]);
}
var AudioPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f]]);
const _sfc_main$e = {
  name: "RoomMessageReply",
  components: {
    SvgIcon,
    FormatMessage,
    AudioPlayer
  },
  props: {
    room: { type: Object, required: true },
    messageReply: { type: Object, default: null },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true }
  },
  emits: ["reset-message"],
  computed: {
    footerHeight() {
      return document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer").clientHeight;
    },
    firstFile() {
      var _a, _b;
      return ((_b = (_a = this.messageReply) == null ? void 0 : _a.files) == null ? void 0 : _b.length) ? this.messageReply.files[0] : {};
    },
    isImage() {
      return isImageFile(this.firstFile);
    },
    isVideo() {
      return isVideoFile(this.firstFile);
    },
    isAudio() {
      return isAudioFile(this.firstFile);
    },
    isOtherFile() {
      var _a, _b;
      return ((_b = (_a = this.messageReply) == null ? void 0 : _a.files) == null ? void 0 : _b.length) && !this.isAudio && !this.isVideo && !this.isImage;
    }
  }
};
const _hoisted_1$e = { class: "vac-reply-box" };
const _hoisted_2$b = { class: "vac-reply-info" };
const _hoisted_3$b = { class: "vac-reply-username" };
const _hoisted_4$a = { class: "vac-reply-content" };
const _hoisted_5$7 = ["src"];
const _hoisted_6$4 = {
  key: 1,
  controls: "",
  class: "vac-image-reply"
};
const _hoisted_7$4 = ["src"];
const _hoisted_8$2 = {
  key: 3,
  class: "vac-image-reply vac-file-container"
};
const _hoisted_9$2 = { class: "vac-text-ellipsis" };
const _hoisted_10$2 = {
  key: 0,
  class: "vac-text-ellipsis vac-text-extension"
};
const _hoisted_11$1 = { class: "vac-icon-reply" };
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_format_message = resolveComponent("format-message");
  const _component_audio_player = resolveComponent("audio-player");
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.messageReply ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "vac-reply-container",
        style: normalizeStyle({ bottom: `${$options.footerHeight}px` })
      }, [
        createBaseVNode("div", _hoisted_1$e, [
          createBaseVNode("div", _hoisted_2$b, [
            createBaseVNode("div", _hoisted_3$b, toDisplayString($props.messageReply.username), 1),
            createBaseVNode("div", _hoisted_4$a, [
              createVNode(_component_format_message, {
                "message-id": $props.messageReply._id,
                content: $props.messageReply.content,
                users: $props.room.users,
                "text-formatting": $props.textFormatting,
                "link-options": $props.linkOptions,
                reply: true
              }, null, 8, ["message-id", "content", "users", "text-formatting", "link-options"])
            ])
          ]),
          $options.isImage ? (openBlock(), createElementBlock("img", {
            key: 0,
            src: $options.firstFile.url,
            class: "vac-image-reply"
          }, null, 8, _hoisted_5$7)) : $options.isVideo ? (openBlock(), createElementBlock("video", _hoisted_6$4, [
            createBaseVNode("source", {
              src: $options.firstFile.url
            }, null, 8, _hoisted_7$4)
          ])) : $options.isAudio ? (openBlock(), createBlock(_component_audio_player, {
            key: 2,
            src: $options.firstFile.url,
            "message-selection-enabled": false,
            class: "vac-audio-reply"
          }, createSlots({ _: 2 }, [
            renderList(_ctx.$slots, (idx, name) => {
              return {
                name,
                fn: withCtx((data2) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                ])
              };
            })
          ]), 1032, ["src"])) : $options.isOtherFile ? (openBlock(), createElementBlock("div", _hoisted_8$2, [
            createBaseVNode("div", null, [
              renderSlot(_ctx.$slots, "file-icon", {}, () => [
                createVNode(_component_svg_icon, { name: "file" })
              ])
            ]),
            createBaseVNode("div", _hoisted_9$2, toDisplayString($options.firstFile.name), 1),
            $options.firstFile.extension ? (openBlock(), createElementBlock("div", _hoisted_10$2, toDisplayString($options.firstFile.extension), 1)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_11$1, [
          createBaseVNode("div", {
            class: "vac-svg-button",
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("reset-message"))
          }, [
            renderSlot(_ctx.$slots, "reply-close-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "close-outline" })
            ])
          ])
        ])
      ], 4)) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
var RoomMessageReply = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e]]);
const _sfc_main$d = {
  name: "RoomUsersTag",
  props: {
    filteredUsersTag: { type: Array, required: true },
    selectItem: { type: Boolean, default: null },
    activeUpOrDown: { type: Number, default: null }
  },
  emits: ["select-user-tag", "activate-item"],
  data() {
    return {
      activeItem: null
    };
  },
  computed: {
    footerHeight() {
      return document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer").clientHeight;
    }
  },
  watch: {
    filteredUsersTag(val, oldVal) {
      if (!oldVal.length || val.length !== oldVal.length) {
        this.activeItem = 0;
      }
    },
    selectItem(val) {
      if (val) {
        this.$emit("select-user-tag", this.filteredUsersTag[this.activeItem]);
      }
    },
    activeUpOrDown() {
      if (this.activeUpOrDown > 0 && this.activeItem < this.filteredUsersTag.length - 1) {
        this.activeItem++;
      } else if (this.activeUpOrDown < 0 && this.activeItem > 0) {
        this.activeItem--;
      }
      this.$emit("activate-item");
    }
  }
};
const _hoisted_1$d = ["onMouseover", "onClick"];
const _hoisted_2$a = { class: "vac-tags-info" };
const _hoisted_3$a = { class: "vac-tags-username" };
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.filteredUsersTag.length ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "vac-tags-container",
        style: normalizeStyle({ bottom: `${$options.footerHeight}px` })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.filteredUsersTag, (user, index) => {
          return openBlock(), createElementBlock("div", {
            key: user._id,
            class: normalizeClass(["vac-tags-box", { "vac-tags-box-active": index === $data.activeItem }]),
            onMouseover: ($event) => $data.activeItem = index,
            onClick: ($event) => _ctx.$emit("select-user-tag", user)
          }, [
            createBaseVNode("div", _hoisted_2$a, [
              user.avatar ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "vac-avatar vac-tags-avatar",
                style: normalizeStyle({ "background-image": `url('${user.avatar}')` })
              }, null, 4)) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_3$a, toDisplayString(user.username), 1)
            ])
          ], 42, _hoisted_1$d);
        }), 128))
      ], 4)) : createCommentVNode("", true)
    ]),
    _: 1
  });
}
var RoomUsersTag = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
const _sfc_main$c = {
  name: "RoomEmojis",
  props: {
    filteredEmojis: { type: Array, required: true },
    selectItem: { type: Boolean, default: null },
    activeUpOrDown: { type: Number, default: null }
  },
  emits: ["select-emoji", "activate-item"],
  data() {
    return {
      activeItem: null
    };
  },
  computed: {
    footerHeight() {
      return document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer").clientHeight;
    }
  },
  watch: {
    filteredEmojis(val, oldVal) {
      if (!oldVal.length || val.length !== oldVal.length) {
        this.activeItem = 0;
      }
    },
    selectItem(val) {
      if (val) {
        this.$emit("select-emoji", this.filteredEmojis[this.activeItem]);
      }
    },
    activeUpOrDown() {
      if (this.activeUpOrDown > 0 && this.activeItem < this.filteredEmojis.length - 1) {
        this.activeItem++;
      } else if (this.activeUpOrDown < 0 && this.activeItem > 0) {
        this.activeItem--;
      }
      this.$emit("activate-item");
    }
  }
};
const _hoisted_1$c = ["onMouseover", "onClick"];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.filteredEmojis.length ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "vac-emojis-container",
        style: normalizeStyle({ bottom: `${$options.footerHeight}px` })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.filteredEmojis, (emoji, index) => {
          return openBlock(), createElementBlock("div", {
            key: emoji,
            class: normalizeClass(["vac-emoji-element", { "vac-emoji-element-active": index === $data.activeItem }]),
            onMouseover: ($event) => $data.activeItem = index,
            onClick: ($event) => _ctx.$emit("select-emoji", emoji)
          }, toDisplayString(emoji), 43, _hoisted_1$c);
        }), 128))
      ], 4)) : createCommentVNode("", true)
    ]),
    _: 1
  });
}
var RoomEmojis = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
const _sfc_main$b = {
  name: "RoomTemplatesText",
  props: {
    filteredTemplatesText: { type: Array, required: true },
    selectItem: { type: Boolean, default: null },
    activeUpOrDown: { type: Number, default: null }
  },
  emits: ["select-template-text", "activate-item"],
  data() {
    return {
      activeItem: null
    };
  },
  computed: {
    footerHeight() {
      return document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer").clientHeight;
    }
  },
  watch: {
    filteredTemplatesText(val, oldVal) {
      if (!oldVal.length || val.length !== oldVal.length) {
        this.activeItem = 0;
      }
    },
    selectItem(val) {
      if (val) {
        this.$emit(
          "select-template-text",
          this.filteredTemplatesText[this.activeItem]
        );
      }
    },
    activeUpOrDown() {
      if (this.activeUpOrDown > 0 && this.activeItem < this.filteredTemplatesText.length - 1) {
        this.activeItem++;
      } else if (this.activeUpOrDown < 0 && this.activeItem > 0) {
        this.activeItem--;
      }
      this.$emit("activate-item");
    }
  }
};
const _hoisted_1$b = ["onMouseover", "onClick"];
const _hoisted_2$9 = { class: "vac-template-info" };
const _hoisted_3$9 = { class: "vac-template-tag" };
const _hoisted_4$9 = { class: "vac-template-text" };
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.filteredTemplatesText.length ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "vac-template-container vac-app-box-shadow",
        style: normalizeStyle({ bottom: `${$options.footerHeight}px` })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.filteredTemplatesText, (template, index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            class: normalizeClass(["vac-template-box", { "vac-template-active": index === $data.activeItem }]),
            onMouseover: ($event) => $data.activeItem = index,
            onClick: ($event) => _ctx.$emit("select-template-text", template)
          }, [
            createBaseVNode("div", _hoisted_2$9, [
              createBaseVNode("div", _hoisted_3$9, " /" + toDisplayString(template.tag), 1),
              createBaseVNode("div", _hoisted_4$9, toDisplayString(template.text), 1)
            ])
          ], 42, _hoisted_1$b);
        }), 128))
      ], 4)) : createCommentVNode("", true)
    ]),
    _: 1
  });
}
var RoomTemplatesText = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win) => {
  const defaultPlatformMap = /* @__PURE__ */ new Map();
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
const CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
CapacitorPlatforms.addPlatform;
CapacitorPlatforms.setPlatform;
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data2) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data2;
  }
}
const getPlatformId = (win) => {
  var _a, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return "android";
  } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win) => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a2;
    return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h2) => h2.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError2 = (err) => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = /* @__PURE__ */ new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a2, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options2) => cap.nativePromise(pluginName, prop.toString(), options2);
          } else {
            return (options2, callback) => cap.nativeCallback(pluginName, prop.toString(), options2, callback);
          }
        } else if (impl) {
          return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove2;
      const wrapper = (...args) => {
        const p2 = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p3 = fn(...args);
            remove2 = p3 === null || p3 === void 0 ? void 0 : p3.remove;
            return p3;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p2.remove = async () => remove2();
        }
        return p2;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove2 = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p2 = new Promise((resolve3) => call.then(() => resolve3({ remove: remove2 })));
      p2.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove2();
      };
      return p2;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform] : []
      ])
    });
    return proxy;
  };
  const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError2;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
const Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor.registerPlugin;
Capacitor.Plugins;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    const remove2 = async () => this.removeListener(eventName, listenerFunc);
    const p2 = Promise.resolve({ remove: remove2 });
    Object.defineProperty(p2, "remove", {
      value: async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove2();
      }
    });
    return p2;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data2) {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(data2));
    }
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async setCookie(options2) {
    try {
      const encodedKey = encode(options2.key);
      const encodedValue = encode(options2.value);
      const expires = `; expires=${(options2.expires || "").replace("expires=", "")}`;
      const path = (options2.path || "/").replace("path=", "");
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options2) {
    try {
      document.cookie = `${options2.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve3, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve3(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options2, extra = {}) => {
  const output = Object.assign({ method: options2.method || "GET", headers: options2.headers }, extra);
  const headers = normalizeHttpHeaders(options2.headers);
  const type = headers["content-type"] || "";
  if (typeof options2.data === "string") {
    output.body = options2.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options2.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data")) {
    const form = new FormData();
    if (options2.data instanceof FormData) {
      options2.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options2.data)) {
        form.append(key, options2.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options2.data === "object") {
    output.body = JSON.stringify(options2.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  async request(options2) {
    const requestInit = buildRequestInit(options2, options2.webFetchExtra);
    const urlParams = buildUrlParams(options2.params, options2.shouldEncodeUrlParams);
    const url = urlParams ? `${options2.url}?${urlParams}` : options2.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options2 : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data2;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data2 = await readBlobAsBase64(blob);
        break;
      case "json":
        data2 = await response.json();
        break;
      case "document":
      case "text":
      default:
        data2 = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data: data2,
      headers,
      status: response.status,
      url: response.url
    };
  }
  async get(options2) {
    return this.request(Object.assign(Object.assign({}, options2), { method: "GET" }));
  }
  async post(options2) {
    return this.request(Object.assign(Object.assign({}, options2), { method: "POST" }));
  }
  async put(options2) {
    return this.request(Object.assign(Object.assign({}, options2), { method: "PUT" }));
  }
  async patch(options2) {
    return this.request(Object.assign(Object.assign({}, options2), { method: "PATCH" }));
  }
  async delete(options2) {
    return this.request(Object.assign(Object.assign({}, options2), { method: "DELETE" }));
  }
}
registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
const VoiceRecorder = registerPlugin("VoiceRecorder", {
  web: () => Promise.resolve().then(function() {
    return web;
  }).then((m) => new m.VoiceRecorderWeb())
});
class Recorder {
  constructor(options2 = {}) {
    this.beforeRecording = options2.beforeRecording;
    this.pauseRecording = options2.pauseRecording;
    this.afterRecording = options2.afterRecording;
    this.micFailed = options2.micFailed;
    this.encoderOptions = {
      bitRate: options2.bitRate,
      sampleRate: options2.sampleRate
    };
    this.bufferSize = 4096;
    this.records = [];
    this.isPause = false;
    this.isRecording = false;
    this.duration = 0;
    this.volume = 0;
    this._duration = 0;
    this.timerInterval = -1;
  }
  startTimer() {
    this.timerInterval = setInterval(() => this.duration++, 1e3);
  }
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  async start() {
    let res = await VoiceRecorder.canDeviceVoiceRecord();
    if (!res.value) {
      return this._micError("No recording device available!");
    }
    const audioRequest = await VoiceRecorder.requestAudioRecordingPermission();
    if (!audioRequest.value) {
      return this._micError("Recording permission not granted!");
    }
    res = await VoiceRecorder.startRecording();
    this.startTimer();
    this.beforeRecording && this.beforeRecording("start recording");
    this.isPause = false;
    this.isRecording = true;
  }
  b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  async stop() {
    this.stopTimer();
    const res = await VoiceRecorder.stopRecording();
    const base64Sound = res.value.recordDataBase64;
    const mimeType = res.value.mimeType;
    const record = {
      blob: this.b64toBlob(base64Sound, mimeType),
      duration: res.value.msDuration
    };
    this.records.push(record);
    console.log("added to recording");
    this._duration = 0;
    this.duration = 0;
    this.isPause = false;
    this.isRecording = false;
    this.afterRecording && this.afterRecording(record);
  }
  pause() {
    this.stream.getTracks().forEach((track2) => track2.stop());
    this.input.disconnect();
    this.processor.disconnect();
    this._duration = this.duration * 1e3;
    this.isPause = true;
    this.pauseRecording && this.pauseRecording("pause recording");
  }
  _micCaptured(stream) {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.duration = this._duration * 1e3;
    this.input = this.context.createMediaStreamSource(stream);
    this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1);
    this.stream = stream;
    this.processor.onaudioprocess = (ev) => {
      const sample = ev.inputBuffer.getChannelData(0);
      let sum = 0;
      if (this.lameEncoder) {
        this.lameEncoder.encode(sample);
      }
      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i];
      }
      this.duration = parseFloat(this._duration) + parseFloat(this.context.currentTime.toFixed(2));
      this.volume = Math.sqrt(sum / sample.length).toFixed(2);
    };
    this.input.connect(this.processor);
    this.processor.connect(this.context.destination);
  }
  _micError(error) {
    this.micFailed && this.micFailed(error);
  }
}
function detectMobile() {
  var userAgent = getUserAgent();
  var userAgentPart = userAgent.substr(0, 4);
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
    userAgent
  ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
    userAgentPart
  );
}
function getUserAgent() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera || null;
  if (!userAgent)
    throw new Error("Failed to look for user agent information.");
  return userAgent;
}
const _sfc_main$a = {
  name: "RoomFooter",
  components: {
    SvgIcon,
    EmojiPickerContainer,
    RoomFiles,
    RoomMessageReply,
    RoomUsersTag,
    RoomEmojis,
    RoomTemplatesText
  },
  directives: {
    clickOutside: vClickOutside
  },
  props: {
    room: { type: Object, required: true },
    roomId: { type: [String, Number], required: true },
    roomMessage: { type: String, default: null },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    textMessages: { type: Object, required: true },
    showSendIcon: { type: Boolean, required: true },
    showFiles: { type: Boolean, required: true },
    showAudio: { type: Boolean, required: true },
    showEmojis: { type: Boolean, required: true },
    showFooter: { type: Boolean, required: true },
    acceptedFiles: { type: String, required: true },
    textareaActionEnabled: { type: Boolean, required: true },
    textareaAutoFocus: { type: Boolean, required: true },
    userTagsEnabled: { type: Boolean, required: true },
    emojisSuggestionEnabled: { type: Boolean, required: true },
    templatesText: { type: Array, default: null },
    audioBitRate: { type: Number, required: true },
    audioSampleRate: { type: Number, required: true },
    initReplyMessage: { type: Object, default: null },
    initEditMessage: { type: Object, default: null },
    droppedFiles: { type: Array, default: null }
  },
  emits: [
    "edit-message",
    "send-message",
    "update-edited-message-id",
    "textarea-action-handler",
    "typing-message"
  ],
  data() {
    return {
      message: "",
      editedMessage: {},
      messageReply: null,
      cursorRangePosition: null,
      files: [],
      fileDialog: false,
      selectUsersTagItem: null,
      selectEmojiItem: null,
      selectTemplatesTextItem: null,
      format: "wav",
      activeUpOrDownEmojis: null,
      activeUpOrDownUsersTag: null,
      activeUpOrDownTemplatesText: null,
      emojisDB: new Database(),
      emojiOpened: false,
      keepKeyboardOpen: false,
      filteredEmojis: [],
      filteredUsersTag: [],
      selectedUsersTag: [],
      filteredTemplatesText: [],
      recorder: this.initRecorder(),
      isRecording: false
    };
  },
  computed: {
    isMessageEmpty() {
      return !this.files.length && !this.message.trim();
    },
    isFileLoading() {
      return this.files.some((e) => e.loading);
    },
    recordedTime() {
      return new Date(this.recorder.duration * 1e3).toISOString().substr(14, 5);
    },
    shadowFooter() {
      return !!this.filteredEmojis.length || !!this.filteredUsersTag.length || !!this.filteredTemplatesText.length || !!this.files.length || !!this.messageReply;
    }
  },
  watch: {
    roomId() {
      this.resetMessage(true, true);
      if (this.roomMessage) {
        this.message = this.roomMessage;
        setTimeout(() => this.onChangeInput());
      }
    },
    message(val) {
      this.getTextareaRef().value = val;
    },
    roomMessage: {
      immediate: true,
      handler(val) {
        if (val)
          this.message = this.roomMessage;
      }
    },
    editedMessage(val) {
      this.$emit("update-edited-message-id", val._id);
    },
    initReplyMessage(val) {
      if (val) {
        this.replyMessage(val);
      }
    },
    initEditMessage(val) {
      if (val) {
        this.editMessage(val);
      }
    },
    droppedFiles(val) {
      if (val) {
        this.onFileChange(val);
      }
    }
  },
  mounted() {
    const isMobile = detectMobile();
    let isComposed = true;
    this.getTextareaRef().addEventListener("keyup", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !this.fileDialog) {
        if (isMobile) {
          this.message = this.message + "\n";
          setTimeout(() => this.onChangeInput());
        } else if (isComposed && !this.filteredEmojis.length && !this.filteredUsersTag.length && !this.filteredTemplatesText.length) {
          this.sendMessage();
        }
      }
      isComposed = !e.isComposing;
      setTimeout(() => {
        this.updateFooterLists();
      }, 60);
    });
    this.getTextareaRef().addEventListener("click", () => {
      if (isMobile)
        this.keepKeyboardOpen = true;
      this.updateFooterLists();
    });
    this.getTextareaRef().addEventListener("blur", () => {
      setTimeout(() => {
        this.resetFooterList();
      }, 100);
      if (isMobile)
        setTimeout(() => this.keepKeyboardOpen = false);
    });
  },
  beforeUnmount() {
    this.stopRecorder();
  },
  methods: {
    getTextareaRef() {
      return this.$refs.roomTextarea;
    },
    focusTextarea(disableMobileFocus) {
      if (detectMobile() && disableMobileFocus)
        return;
      if (!this.getTextareaRef())
        return;
      this.getTextareaRef().focus();
      if (this.cursorRangePosition) {
        setTimeout(() => {
          this.getTextareaRef().setSelectionRange(
            this.cursorRangePosition,
            this.cursorRangePosition
          );
          this.cursorRangePosition = null;
        });
      }
    },
    onChangeInput() {
      var _a, _b, _c;
      if (((_a = this.getTextareaRef()) == null ? void 0 : _a.value) || ((_b = this.getTextareaRef()) == null ? void 0 : _b.value) === "") {
        this.message = (_c = this.getTextareaRef()) == null ? void 0 : _c.value;
      }
      this.keepKeyboardOpen = true;
      this.resizeTextarea();
      this.$emit("typing-message", this.message);
    },
    resizeTextarea() {
      const el = this.getTextareaRef();
      if (!el)
        return;
      const padding = window.getComputedStyle(el, null).getPropertyValue("padding-top").replace("px", "");
      el.style.height = 0;
      el.style.height = el.scrollHeight - padding * 2 + "px";
    },
    escapeTextarea() {
      if (this.filteredEmojis.length) {
        this.filteredEmojis = [];
      } else if (this.filteredUsersTag.length) {
        this.filteredUsersTag = [];
      } else if (this.filteredTemplatesText.length) {
        this.filteredTemplatesText = [];
      } else {
        this.resetMessage();
      }
    },
    onPasteImage(pasteEvent) {
      var _a;
      const items = (_a = pasteEvent.clipboardData) == null ? void 0 : _a.items;
      if (items) {
        Array.from(items).forEach((item) => {
          if (item.type.includes("image")) {
            const blob = item.getAsFile();
            this.onFileChange([blob]);
          }
        });
      }
    },
    updateActiveUpOrDown(direction) {
      if (this.filteredEmojis.length) {
        this.activeUpOrDownEmojis = direction;
      } else if (this.filteredUsersTag.length) {
        this.activeUpOrDownUsersTag = direction;
      } else if (this.filteredTemplatesText.length) {
        this.activeUpOrDownTemplatesText = direction;
      }
    },
    selectItem() {
      if (this.filteredEmojis.length) {
        this.selectEmojiItem = true;
      } else if (this.filteredUsersTag.length) {
        this.selectUsersTagItem = true;
      } else if (this.filteredTemplatesText.length) {
        this.selectTemplatesTextItem = true;
      }
    },
    selectEmoji(emoji) {
      this.selectEmojiItem = false;
      if (!emoji)
        return;
      const { position, endPosition } = this.getCharPosition(":");
      this.message = this.message.substr(0, position - 1) + emoji + this.message.substr(endPosition, this.message.length - 1);
      this.cursorRangePosition = position;
      this.focusTextarea();
    },
    selectTemplateText(template) {
      this.selectTemplatesTextItem = false;
      if (!template)
        return;
      const { position, endPosition } = this.getCharPosition("/");
      const space = this.message.substr(endPosition, endPosition).length ? "" : " ";
      this.message = this.message.substr(0, position - 1) + template.text + space + this.message.substr(endPosition, this.message.length - 1);
      this.cursorRangePosition = position + template.text.length + space.length + 1;
      this.focusTextarea();
    },
    addEmoji(emoji) {
      this.message += emoji.unicode;
      this.focusTextarea(true);
    },
    launchFilePicker() {
      this.$refs.file.value = "";
      this.$refs.file.click();
    },
    async onFileChange(files) {
      this.fileDialog = true;
      this.focusTextarea();
      Array.from(files).forEach(async (file) => {
        const fileURL = URL.createObjectURL(file);
        const typeIndex = file.name.lastIndexOf(".");
        this.files.push({
          loading: true,
          name: file.name.substring(0, typeIndex),
          size: file.size,
          type: file.type,
          extension: file.name.substring(typeIndex + 1),
          localUrl: fileURL
        });
        const blobFile = await fetch(fileURL).then((res) => res.blob());
        let loadedFile = this.files.find((file2) => file2.localUrl === fileURL);
        if (loadedFile) {
          loadedFile.blob = blobFile;
          loadedFile.loading = false;
          delete loadedFile.loading;
        }
      });
      setTimeout(() => this.fileDialog = false, 500);
    },
    removeFile(index) {
      this.files.splice(index, 1);
      this.focusTextarea();
    },
    async toggleRecorder(recording) {
      this.isRecording = recording;
      if (!this.recorder.isRecording) {
        setTimeout(() => this.recorder.start(), 10);
      } else {
        try {
          await this.recorder.stop();
          const record = this.recorder.records[0];
          this.files.push({
            blob: record.blob,
            name: `audio.${this.format}`,
            size: record.blob.size,
            duration: record.duration,
            type: record.blob.type,
            audio: true,
            localUrl: URL.createObjectURL(record.blob)
          });
          this.recorder = this.initRecorder();
          this.sendMessage();
        } catch {
          setTimeout(() => this.stopRecorder(), 100);
        }
      }
    },
    stopRecorder() {
      if (this.recorder.isRecording) {
        try {
          this.recorder.stop();
          this.recorder = this.initRecorder();
        } catch {
          setTimeout(() => this.stopRecorder(), 100);
        }
      }
    },
    textareaActionHandler() {
      this.$emit("textarea-action-handler", this.message);
    },
    sendMessage() {
      var _a;
      let message = this.message.trim();
      if (!this.files.length && !message)
        return;
      if (this.isFileLoading)
        return;
      this.selectedUsersTag.forEach((user) => {
        message = message.replace(
          `@${user.username}`,
          `<usertag>${user._id}</usertag>`
        );
      });
      const files = this.files.length ? this.files : null;
      if (this.editedMessage._id) {
        if (this.editedMessage.content !== message || ((_a = this.editedMessage.files) == null ? void 0 : _a.length) || this.files.length) {
          this.$emit("edit-message", {
            messageId: this.editedMessage._id,
            newContent: message,
            files,
            replyMessage: this.messageReply,
            usersTag: this.selectedUsersTag
          });
        }
      } else {
        this.$emit("send-message", {
          content: message,
          files,
          replyMessage: this.messageReply,
          usersTag: this.selectedUsersTag
        });
      }
      this.resetMessage(true);
    },
    editMessage(message) {
      this.resetMessage();
      this.editedMessage = { ...message };
      let messageContent = message.content;
      const initialContent = messageContent;
      const firstTag = "<usertag>";
      const secondTag = "</usertag>";
      const usertags = [
        ...messageContent.matchAll(new RegExp(firstTag, "gi"))
      ].map((a) => a.index);
      usertags.forEach((index) => {
        const userId = initialContent.substring(
          index + firstTag.length,
          initialContent.indexOf(secondTag, index)
        );
        const user = this.room.users.find((user2) => user2._id === userId);
        messageContent = messageContent.replace(
          `${firstTag}${userId}${secondTag}`,
          `@${(user == null ? void 0 : user.username) || "unknown"}`
        );
        this.selectUserTag(user, true);
      });
      this.message = messageContent;
      if (message.files) {
        this.files = [...message.files];
      }
      setTimeout(() => this.resizeTextarea());
    },
    replyMessage(message) {
      this.editedMessage = {};
      this.messageReply = message;
      this.focusTextarea();
    },
    updateFooterLists() {
      this.updateFooterList("@");
      this.updateFooterList(":");
      this.updateFooterList("/");
    },
    updateFooterList(tagChar) {
      if (!this.getTextareaRef())
        return;
      if (tagChar === ":" && !this.emojisSuggestionEnabled) {
        return;
      }
      if (tagChar === "@" && (!this.userTagsEnabled || !this.room.users)) {
        return;
      }
      if (tagChar === "/" && !this.templatesText) {
        return;
      }
      const textareaCursorPosition = this.getTextareaRef().selectionStart;
      let position = textareaCursorPosition;
      while (position > 0 && this.message.charAt(position - 1) !== tagChar && (this.message.charAt(position - 1) !== " " || tagChar !== ":")) {
        position--;
      }
      const beforeTag = this.message.charAt(position - 2);
      const notLetterNumber = !beforeTag.match(/^[0-9a-zA-Z]+$/);
      if (this.message.charAt(position - 1) === tagChar && (!beforeTag || beforeTag === " " || notLetterNumber)) {
        const query = this.message.substring(position, textareaCursorPosition);
        if (tagChar === ":") {
          this.updateEmojis(query);
        } else if (tagChar === "@") {
          this.updateShowUsersTag(query);
        } else if (tagChar === "/") {
          this.updateShowTemplatesText(query);
        }
      } else {
        this.resetFooterList(tagChar);
      }
    },
    updateShowUsersTag(query) {
      this.filteredUsersTag = filteredItems(
        this.room.users,
        "username",
        query,
        true
      ).filter((user) => user._id !== this.currentUserId);
    },
    selectUserTag(user, editMode = false) {
      this.selectUsersTagItem = false;
      if (!user)
        return;
      const { position, endPosition } = this.getCharPosition("@");
      const space = this.message.substr(endPosition, endPosition).length ? "" : " ";
      this.message = this.message.substr(0, position) + user.username + space + this.message.substr(endPosition, this.message.length - 1);
      this.selectedUsersTag = [...this.selectedUsersTag, { ...user }];
      if (!editMode) {
        this.cursorRangePosition = position + user.username.length + space.length + 1;
      }
      this.focusTextarea();
    },
    updateShowTemplatesText(query) {
      this.filteredTemplatesText = filteredItems(
        this.templatesText,
        "tag",
        query,
        true
      );
    },
    getCharPosition(tagChar) {
      const cursorPosition = this.getTextareaRef().selectionStart;
      let position = cursorPosition;
      while (position > 0 && this.message.charAt(position - 1) !== tagChar) {
        position--;
      }
      const endPosition = this.getTextareaRef().selectionEnd;
      return { position, endPosition };
    },
    async updateEmojis(query) {
      if (!query)
        return;
      const emojis = await this.emojisDB.getEmojiBySearchQuery(query);
      this.filteredEmojis = emojis.map((emoji) => emoji.unicode);
    },
    resetFooterList(tagChar = null) {
      if (tagChar === ":") {
        this.filteredEmojis = [];
      } else if (tagChar === "@") {
        this.filteredUsersTag = [];
      } else if (tagChar === "/") {
        this.filteredTemplatesText = [];
      } else {
        this.filteredEmojis = [];
        this.filteredUsersTag = [];
        this.filteredTemplatesText = [];
      }
    },
    resetMessage(disableMobileFocus = false, initRoom = false) {
      if (!initRoom) {
        this.$emit("typing-message", null);
      }
      this.selectedUsersTag = [];
      this.resetFooterList();
      this.resetTextareaSize();
      this.message = "";
      this.editedMessage = {};
      this.messageReply = null;
      this.files = [];
      this.emojiOpened = false;
      this.preventKeyboardFromClosing();
      if (this.textareaAutoFocus || !initRoom) {
        setTimeout(() => this.focusTextarea(disableMobileFocus));
      }
    },
    resetTextareaSize() {
      if (this.getTextareaRef()) {
        this.getTextareaRef().style.height = "20px";
      }
    },
    preventKeyboardFromClosing() {
      if (this.keepKeyboardOpen)
        this.getTextareaRef().focus();
    },
    initRecorder() {
      this.isRecording = false;
      return new Recorder({
        bitRate: Number(this.audioBitRate),
        sampleRate: Number(this.audioSampleRate),
        beforeRecording: null,
        afterRecording: null,
        pauseRecording: null,
        micFailed: this.micFailed
      });
    },
    micFailed() {
      this.isRecording = false;
      this.recorder = this.initRecorder();
    }
  }
};
const _hoisted_1$a = {
  key: 0,
  class: "vac-icon-textarea-left"
};
const _hoisted_2$8 = /* @__PURE__ */ createBaseVNode("div", { class: "vac-dot-audio-record" }, null, -1);
const _hoisted_3$8 = { class: "vac-dot-audio-record-time" };
const _hoisted_4$8 = ["placeholder"];
const _hoisted_5$6 = { class: "vac-icon-textarea" };
const _hoisted_6$3 = { key: 1 };
const _hoisted_7$3 = ["accept"];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_room_emojis = resolveComponent("room-emojis");
  const _component_room_users_tag = resolveComponent("room-users-tag");
  const _component_room_templates_text = resolveComponent("room-templates-text");
  const _component_room_message_reply = resolveComponent("room-message-reply");
  const _component_room_files = resolveComponent("room-files");
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_emoji_picker_container = resolveComponent("emoji-picker-container");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    id: "room-footer",
    class: normalizeClass(["vac-room-footer", {
      "vac-app-box-shadow": $options.shadowFooter
    }])
  }, [
    createVNode(_component_room_emojis, {
      "filtered-emojis": $data.filteredEmojis,
      "select-item": $data.selectEmojiItem,
      "active-up-or-down": $data.activeUpOrDownEmojis,
      onSelectEmoji: _cache[0] || (_cache[0] = ($event) => $options.selectEmoji($event)),
      onActivateItem: _cache[1] || (_cache[1] = ($event) => $data.activeUpOrDownEmojis = 0)
    }, null, 8, ["filtered-emojis", "select-item", "active-up-or-down"]),
    createVNode(_component_room_users_tag, {
      "filtered-users-tag": $data.filteredUsersTag,
      "select-item": $data.selectUsersTagItem,
      "active-up-or-down": $data.activeUpOrDownUsersTag,
      onSelectUserTag: _cache[2] || (_cache[2] = ($event) => $options.selectUserTag($event)),
      onActivateItem: _cache[3] || (_cache[3] = ($event) => $data.activeUpOrDownUsersTag = 0)
    }, null, 8, ["filtered-users-tag", "select-item", "active-up-or-down"]),
    createVNode(_component_room_templates_text, {
      "filtered-templates-text": $data.filteredTemplatesText,
      "select-item": $data.selectTemplatesTextItem,
      "active-up-or-down": $data.activeUpOrDownTemplatesText,
      onSelectTemplateText: _cache[4] || (_cache[4] = ($event) => $options.selectTemplateText($event)),
      onActivateItem: _cache[5] || (_cache[5] = ($event) => $data.activeUpOrDownTemplatesText = 0)
    }, null, 8, ["filtered-templates-text", "select-item", "active-up-or-down"]),
    createVNode(_component_room_message_reply, {
      room: $props.room,
      "message-reply": $data.messageReply,
      "text-formatting": $props.textFormatting,
      "link-options": $props.linkOptions,
      onResetMessage: $options.resetMessage
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (i, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["room", "message-reply", "text-formatting", "link-options", "onResetMessage"]),
    createVNode(_component_room_files, {
      files: $data.files,
      onRemoveFile: $options.removeFile,
      onResetMessage: $options.resetMessage
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (i, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["files", "onRemoveFile", "onResetMessage"]),
    createBaseVNode("div", {
      class: normalizeClass(["vac-box-footer", { "vac-box-footer-border": !$data.files.length }])
    }, [
      $props.showAudio && !$data.files.length ? (openBlock(), createElementBlock("div", _hoisted_1$a, [
        $data.isRecording ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createBaseVNode("div", {
            class: "vac-svg-button vac-icon-audio-stop",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.stopRecorder && $options.stopRecorder(...args))
          }, [
            renderSlot(_ctx.$slots, "audio-stop-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "close-outline" })
            ])
          ]),
          _hoisted_2$8,
          createBaseVNode("div", _hoisted_3$8, toDisplayString($options.recordedTime), 1),
          createBaseVNode("div", {
            class: "vac-svg-button vac-icon-audio-confirm",
            onClick: _cache[7] || (_cache[7] = ($event) => $options.toggleRecorder(false))
          }, [
            renderSlot(_ctx.$slots, "audio-check-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "checkmark" })
            ])
          ])
        ], 64)) : (openBlock(), createElementBlock("div", {
          key: 1,
          class: "vac-svg-button",
          onClick: _cache[8] || (_cache[8] = ($event) => $options.toggleRecorder(true))
        }, [
          renderSlot(_ctx.$slots, "microphone-icon", {}, () => [
            createVNode(_component_svg_icon, {
              name: "microphone",
              class: "vac-icon-microphone"
            })
          ])
        ]))
      ])) : createCommentVNode("", true),
      createBaseVNode("textarea", {
        id: "roomTextarea",
        ref: "roomTextarea",
        placeholder: $props.textMessages.TYPE_MESSAGE,
        class: normalizeClass(["vac-textarea", {
          "vac-textarea-outline": $data.editedMessage._id
        }]),
        style: {
          "min-height": `20px`,
          "padding-left": `12px`
        },
        onInput: _cache[9] || (_cache[9] = (...args) => $options.onChangeInput && $options.onChangeInput(...args)),
        onKeydown: [
          _cache[10] || (_cache[10] = withKeys((...args) => $options.escapeTextarea && $options.escapeTextarea(...args), ["esc"])),
          _cache[11] || (_cache[11] = withKeys(withModifiers((...args) => $options.selectItem && $options.selectItem(...args), ["exact", "prevent"]), ["enter"])),
          _cache[13] || (_cache[13] = withKeys(withModifiers(() => {
          }, ["exact", "prevent"]), ["tab"])),
          _cache[14] || (_cache[14] = withKeys((...args) => $options.selectItem && $options.selectItem(...args), ["tab"])),
          _cache[15] || (_cache[15] = withKeys(withModifiers(() => {
          }, ["exact", "prevent"]), ["up"])),
          _cache[16] || (_cache[16] = withKeys(($event) => $options.updateActiveUpOrDown(-1), ["up"])),
          _cache[17] || (_cache[17] = withKeys(withModifiers(() => {
          }, ["exact", "prevent"]), ["down"])),
          _cache[18] || (_cache[18] = withKeys(($event) => $options.updateActiveUpOrDown(1), ["down"]))
        ],
        onPaste: _cache[12] || (_cache[12] = (...args) => $options.onPasteImage && $options.onPasteImage(...args))
      }, null, 42, _hoisted_4$8),
      createBaseVNode("div", _hoisted_5$6, [
        $data.editedMessage._id ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "vac-svg-button",
          onClick: _cache[19] || (_cache[19] = (...args) => $options.resetMessage && $options.resetMessage(...args))
        }, [
          renderSlot(_ctx.$slots, "edit-close-icon", {}, () => [
            createVNode(_component_svg_icon, { name: "close-outline" })
          ])
        ])) : createCommentVNode("", true),
        $props.showEmojis ? withDirectives((openBlock(), createElementBlock("div", _hoisted_6$3, [
          renderSlot(_ctx.$slots, "emoji-picker", mergeProps({ emojiOpened: $data.emojiOpened }, { addEmoji: $options.addEmoji }), () => [
            createVNode(_component_emoji_picker_container, {
              "emoji-opened": $data.emojiOpened,
              "position-top": true,
              onAddEmoji: $options.addEmoji,
              onOpenEmoji: _cache[20] || (_cache[20] = ($event) => $data.emojiOpened = $event)
            }, {
              "emoji-picker-icon": withCtx(() => [
                renderSlot(_ctx.$slots, "emoji-picker-icon")
              ]),
              _: 3
            }, 8, ["emoji-opened", "onAddEmoji"])
          ])
        ])), [
          [_directive_click_outside, () => $data.emojiOpened = false]
        ]) : createCommentVNode("", true),
        $props.showFiles ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: "vac-svg-button",
          onClick: _cache[21] || (_cache[21] = (...args) => $options.launchFilePicker && $options.launchFilePicker(...args))
        }, [
          renderSlot(_ctx.$slots, "paperclip-icon", {}, () => [
            createVNode(_component_svg_icon, { name: "paperclip" })
          ])
        ])) : createCommentVNode("", true),
        $props.textareaActionEnabled ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: "vac-svg-button",
          onClick: _cache[22] || (_cache[22] = (...args) => $options.textareaActionHandler && $options.textareaActionHandler(...args))
        }, [
          renderSlot(_ctx.$slots, "custom-action-icon", {}, () => [
            createVNode(_component_svg_icon, { name: "deleted" })
          ])
        ])) : createCommentVNode("", true),
        $props.showFiles ? (openBlock(), createElementBlock("input", {
          key: 4,
          ref: "file",
          type: "file",
          multiple: "",
          accept: $props.acceptedFiles,
          style: { "display": "none" },
          onChange: _cache[23] || (_cache[23] = ($event) => $options.onFileChange($event.target.files))
        }, null, 40, _hoisted_7$3)) : createCommentVNode("", true),
        $props.showSendIcon ? (openBlock(), createElementBlock("div", {
          key: 5,
          class: normalizeClass(["vac-svg-button", { "vac-send-disabled": $options.isMessageEmpty }]),
          onClick: _cache[24] || (_cache[24] = (...args) => $options.sendMessage && $options.sendMessage(...args))
        }, [
          renderSlot(_ctx.$slots, "send-icon", {}, () => [
            createVNode(_component_svg_icon, {
              name: "send",
              param: $options.isMessageEmpty || $options.isFileLoading ? "disabled" : ""
            }, null, 8, ["param"])
          ])
        ], 2)) : createCommentVNode("", true)
      ])
    ], 2)
  ], 2)), [
    [vShow, Object.keys($props.room).length && $props.showFooter]
  ]);
}
var RoomFooter = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
const _sfc_main$9 = {
  name: "MessageReply",
  components: { AudioPlayer, SvgIcon, FormatMessage },
  props: {
    message: { type: Object, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    roomUsers: { type: Array, required: true }
  },
  computed: {
    replyUsername() {
      const { senderId } = this.message.replyMessage;
      const replyUser = this.roomUsers.find((user) => user._id === senderId);
      return replyUser ? replyUser.username : "";
    },
    firstFile() {
      var _a, _b;
      return ((_b = (_a = this.message.replyMessage) == null ? void 0 : _a.files) == null ? void 0 : _b.length) ? this.message.replyMessage.files[0] : {};
    },
    isAudio() {
      return isAudioFile(this.firstFile);
    },
    isImage() {
      return isImageFile(this.firstFile);
    },
    isVideo() {
      return isVideoFile(this.firstFile);
    },
    isOtherFile() {
      var _a;
      return ((_a = this.message.replyMessage.files) == null ? void 0 : _a.length) && !this.isAudio && !this.isVideo && !this.isImage;
    }
  }
};
const _hoisted_1$9 = { class: "vac-reply-message" };
const _hoisted_2$7 = { class: "vac-reply-username" };
const _hoisted_3$7 = {
  key: 0,
  class: "vac-image-reply-container"
};
const _hoisted_4$7 = {
  key: 1,
  class: "vac-video-reply-container"
};
const _hoisted_5$5 = { controls: "" };
const _hoisted_6$2 = ["src"];
const _hoisted_7$2 = {
  key: 3,
  class: "vac-file-container"
};
const _hoisted_8$1 = { class: "vac-text-ellipsis" };
const _hoisted_9$1 = {
  key: 0,
  class: "vac-text-ellipsis vac-text-extension"
};
const _hoisted_10$1 = { class: "vac-reply-content" };
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_audio_player = resolveComponent("audio-player");
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_format_message = resolveComponent("format-message");
  return openBlock(), createElementBlock("div", _hoisted_1$9, [
    createBaseVNode("div", _hoisted_2$7, toDisplayString($options.replyUsername), 1),
    $options.isImage ? (openBlock(), createElementBlock("div", _hoisted_3$7, [
      createBaseVNode("div", {
        class: "vac-message-image vac-message-image-reply",
        style: normalizeStyle({
          "background-image": `url('${$options.firstFile.url}')`
        })
      }, null, 4)
    ])) : $options.isVideo ? (openBlock(), createElementBlock("div", _hoisted_4$7, [
      createBaseVNode("video", _hoisted_5$5, [
        createBaseVNode("source", {
          src: $options.firstFile.url
        }, null, 8, _hoisted_6$2)
      ])
    ])) : $options.isAudio ? (openBlock(), createBlock(_component_audio_player, {
      key: 2,
      src: $options.firstFile.url,
      "message-selection-enabled": false,
      onUpdateProgressTime: _cache[0] || (_cache[0] = ($event) => _ctx.progressTime = $event),
      onHoverAudioProgress: _cache[1] || (_cache[1] = ($event) => _ctx.hoverAudioProgress = $event)
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (idx, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["src"])) : $options.isOtherFile ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
      createBaseVNode("div", null, [
        renderSlot(_ctx.$slots, "file-icon", {}, () => [
          createVNode(_component_svg_icon, { name: "file" })
        ])
      ]),
      createBaseVNode("div", _hoisted_8$1, toDisplayString($options.firstFile.name), 1),
      $options.firstFile.extension ? (openBlock(), createElementBlock("div", _hoisted_9$1, toDisplayString($options.firstFile.extension), 1)) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_10$1, [
      createVNode(_component_format_message, {
        "message-id": $props.message.replyMessage._id,
        content: $props.message.replyMessage.content,
        users: $props.roomUsers,
        "text-formatting": $props.textFormatting,
        "link-options": $props.linkOptions,
        reply: true
      }, null, 8, ["message-id", "content", "users", "text-formatting", "link-options"])
    ])
  ]);
}
var MessageReply = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
const _sfc_main$8 = {
  name: "ProgressBar",
  props: {
    progress: { type: Number, default: 0 }
  },
  data() {
    const radius = 35;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    return {
      radius,
      stroke,
      normalizedRadius,
      circumference
    };
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - this.progress / 100 * this.circumference;
    }
  }
};
const _hoisted_1$8 = {
  ref: "progress",
  class: "vac-progress-wrapper"
};
const _hoisted_2$6 = ["height", "width"];
const _hoisted_3$6 = ["stroke-dasharray", "stroke-width", "r", "cx", "cy"];
const _hoisted_4$6 = { class: "vac-progress-text" };
const _hoisted_5$4 = /* @__PURE__ */ createBaseVNode("span", { class: "vac-progress-pourcent" }, "%", -1);
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    name: "vac-fade-spinner",
    appear: ""
  }, {
    default: withCtx(() => [
      createBaseVNode("div", _hoisted_1$8, [
        (openBlock(), createElementBlock("svg", {
          height: $data.radius * 2,
          width: $data.radius * 2
        }, [
          createBaseVNode("circle", {
            stroke: "rgba(255, 255, 255, 0.7)",
            "stroke-dasharray": $data.circumference + " " + $data.circumference,
            style: normalizeStyle({
              strokeDashoffset: $options.strokeDashoffset,
              strokeLinecap: "round"
            }),
            "stroke-width": $data.stroke,
            fill: "transparent",
            r: $data.normalizedRadius,
            cx: $data.radius,
            cy: $data.radius
          }, null, 12, _hoisted_3$6)
        ], 8, _hoisted_2$6)),
        createBaseVNode("div", {
          class: "vac-progress-content",
          style: normalizeStyle({
            height: $data.radius * 2 - 19 + "px",
            width: $data.radius * 2 - 19 + "px"
          })
        }, [
          createBaseVNode("div", _hoisted_4$6, [
            createTextVNode(toDisplayString($props.progress), 1),
            _hoisted_5$4
          ])
        ], 4)
      ], 512)
    ]),
    _: 1
  });
}
var ProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const _sfc_main$7 = {
  name: "MessageFile",
  components: { SvgIcon, Loader, ProgressBar },
  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    file: { type: Object, required: true },
    index: { type: Number, required: true },
    messageSelectionEnabled: { type: Boolean, required: true }
  },
  emits: ["open-file"],
  data() {
    return {
      imageResponsive: "",
      imageLoading: false,
      imageHover: false
    };
  },
  computed: {
    isImageLoading() {
      return this.file.url.indexOf("blob:http") !== -1 || this.imageLoading;
    },
    isImage() {
      return isImageFile(this.file);
    },
    isVideo() {
      return isVideoFile(this.file);
    }
  },
  watch: {
    file: {
      immediate: true,
      handler() {
        this.checkImgLoad();
      }
    }
  },
  mounted() {
    const ref2 = this.$refs["imageRef" + this.index];
    if (ref2) {
      this.imageResponsive = {
        maxHeight: ref2.clientWidth - 18,
        loaderTop: ref2.clientHeight / 2 - 9
      };
    }
  },
  methods: {
    checkImgLoad() {
      if (!isImageFile(this.file))
        return;
      this.imageLoading = true;
      const image = new Image();
      image.src = this.file.url;
      image.addEventListener("load", () => this.imageLoading = false);
    },
    openFile(event, action) {
      if (!this.messageSelectionEnabled) {
        event.stopPropagation();
        this.$emit("open-file", { file: this.file, action });
      }
    }
  }
};
const _hoisted_1$7 = { class: "vac-message-file-container" };
const _hoisted_2$5 = {
  key: 0,
  class: "vac-image-buttons"
};
const _hoisted_3$5 = { controls: "" };
const _hoisted_4$5 = ["src"];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_progress_bar = resolveComponent("progress-bar");
  const _component_loader = resolveComponent("loader");
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", _hoisted_1$7, [
    $options.isImage ? (openBlock(), createElementBlock("div", {
      key: 0,
      ref: "imageRef" + $props.index,
      class: "vac-message-image-container",
      onMouseover: _cache[2] || (_cache[2] = ($event) => $data.imageHover = true),
      onMouseleave: _cache[3] || (_cache[3] = ($event) => $data.imageHover = false),
      onClick: _cache[4] || (_cache[4] = ($event) => $options.openFile($event, "preview"))
    }, [
      $props.file.progress >= 0 ? (openBlock(), createBlock(_component_progress_bar, {
        key: 0,
        progress: $props.file.progress,
        style: normalizeStyle({ top: `${$data.imageResponsive.loaderTop}px` })
      }, null, 8, ["progress", "style"])) : (openBlock(), createBlock(_component_loader, {
        key: 1,
        show: $options.isImageLoading,
        type: "message-file",
        "message-id": $props.message._id,
        style: normalizeStyle({ top: `${$data.imageResponsive.loaderTop}px` })
      }, createSlots({ _: 2 }, [
        renderList(_ctx.$slots, (idx, name) => {
          return {
            name,
            fn: withCtx((data2) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
            ])
          };
        })
      ]), 1032, ["show", "message-id", "style"])),
      createBaseVNode("div", {
        class: normalizeClass(["vac-message-image", {
          "vac-blur-loading": $options.isImageLoading && $props.message.senderId === $props.currentUserId
        }]),
        style: normalizeStyle({
          "background-image": `url('${$options.isImageLoading ? $props.file.preview || $props.file.url : $props.file.url}')`,
          "max-height": `${$data.imageResponsive.maxHeight}px`
        })
      }, [
        createVNode(Transition, { name: "vac-fade-image" }, {
          default: withCtx(() => [
            !$props.messageSelectionEnabled && $data.imageHover && !$options.isImageLoading ? (openBlock(), createElementBlock("div", _hoisted_2$5, [
              createBaseVNode("div", {
                class: "vac-svg-button vac-button-view",
                onClick: _cache[0] || (_cache[0] = ($event) => $options.openFile($event, "preview"))
              }, [
                renderSlot(_ctx.$slots, "eye-icon_" + $props.message._id, {}, () => [
                  createVNode(_component_svg_icon, { name: "eye" })
                ])
              ]),
              createBaseVNode("div", {
                class: "vac-svg-button vac-button-download",
                onClick: _cache[1] || (_cache[1] = ($event) => $options.openFile($event, "download"))
              }, [
                renderSlot(_ctx.$slots, "document-icon_" + $props.message._id, {}, () => [
                  createVNode(_component_svg_icon, { name: "document" })
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 3
        })
      ], 6)
    ], 544)) : $options.isVideo ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: "vac-video-container",
      onClick: _cache[5] || (_cache[5] = withModifiers(($event) => $options.openFile($event, "preview"), ["prevent"]))
    }, [
      $props.file.progress >= 0 ? (openBlock(), createBlock(_component_progress_bar, {
        key: 0,
        progress: $props.file.progress
      }, null, 8, ["progress"])) : createCommentVNode("", true),
      createBaseVNode("video", _hoisted_3$5, [
        createBaseVNode("source", {
          src: $props.file.url
        }, null, 8, _hoisted_4$5)
      ])
    ])) : createCommentVNode("", true)
  ]);
}
var MessageFile = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = {
  name: "MessageFiles",
  components: { SvgIcon, FormatMessage, ProgressBar, MessageFile },
  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    roomUsers: { type: Array, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    messageSelectionEnabled: { type: Boolean, required: true }
  },
  emits: ["open-file", "open-user-tag"],
  computed: {
    imageVideoFiles() {
      return this.message.files.filter((file) => isImageVideoFile(file));
    },
    otherFiles() {
      return this.message.files.filter((file) => !isImageVideoFile(file));
    }
  },
  methods: {
    openFile(event, file, action) {
      if (!this.messageSelectionEnabled) {
        event.stopPropagation();
        this.$emit("open-file", { file, action });
      }
    }
  }
};
const _hoisted_1$6 = { class: "vac-message-files-container" };
const _hoisted_2$4 = ["onClick"];
const _hoisted_3$4 = { class: "vac-svg-button" };
const _hoisted_4$4 = { class: "vac-text-ellipsis" };
const _hoisted_5$3 = {
  key: 0,
  class: "vac-text-ellipsis vac-text-extension"
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_message_file = resolveComponent("message-file");
  const _component_progress_bar = resolveComponent("progress-bar");
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_format_message = resolveComponent("format-message");
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.imageVideoFiles, (file, i) => {
      return openBlock(), createElementBlock("div", {
        key: i + "iv"
      }, [
        createVNode(_component_message_file, {
          file,
          "current-user-id": $props.currentUserId,
          message: $props.message,
          index: i,
          "message-selection-enabled": $props.messageSelectionEnabled,
          onOpenFile: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("open-file", $event))
        }, createSlots({ _: 2 }, [
          renderList(_ctx.$slots, (idx, name) => {
            return {
              name,
              fn: withCtx((data2) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
              ])
            };
          })
        ]), 1032, ["file", "current-user-id", "message", "index", "message-selection-enabled"])
      ]);
    }), 128)),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.otherFiles, (file, i) => {
      return openBlock(), createElementBlock("div", {
        key: i + "a",
        class: "vac-file-wrapper"
      }, [
        file.progress >= 0 ? (openBlock(), createBlock(_component_progress_bar, {
          key: 0,
          progress: file.progress,
          style: { top: "44px" }
        }, null, 8, ["progress"])) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass(["vac-file-container", { "vac-file-container-progress": file.progress >= 0 }]),
          onClick: ($event) => $options.openFile($event, file, "download")
        }, [
          createBaseVNode("div", _hoisted_3$4, [
            renderSlot(_ctx.$slots, "document-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "document" })
            ])
          ]),
          createBaseVNode("div", _hoisted_4$4, toDisplayString(file.name), 1),
          file.extension ? (openBlock(), createElementBlock("div", _hoisted_5$3, toDisplayString(file.extension), 1)) : createCommentVNode("", true)
        ], 10, _hoisted_2$4)
      ]);
    }), 128)),
    createVNode(_component_format_message, {
      "message-id": $props.message._id,
      content: $props.message.content,
      users: $props.roomUsers,
      "text-formatting": $props.textFormatting,
      "link-options": $props.linkOptions,
      onOpenUserTag: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("open-user-tag", $event))
    }, null, 8, ["message-id", "content", "users", "text-formatting", "link-options"])
  ]);
}
var MessageFiles = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = {
  name: "MessageActions",
  components: { SvgIcon, EmojiPickerContainer },
  directives: {
    clickOutside: vClickOutside
  },
  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true },
    messageActions: { type: Array, required: true },
    showReactionEmojis: { type: Boolean, required: true },
    messageHover: { type: Boolean, required: true },
    hoverMessageId: { type: [String, Number], default: null },
    hoverAudioProgress: { type: Boolean, required: true }
  },
  emits: [
    "update-emoji-opened",
    "update-options-opened",
    "update-message-hover",
    "message-action-handler",
    "send-message-reaction"
  ],
  data() {
    return {
      menuOptionsTop: 0,
      optionsOpened: false,
      optionsClosing: false,
      emojiOpened: false
    };
  },
  computed: {
    isMessageActions() {
      return this.filteredMessageActions.length && this.messageHover && !this.message.deleted && !this.message.disableActions && !this.hoverAudioProgress;
    },
    isMessageReactions() {
      return this.showReactionEmojis && this.messageHover && !this.message.deleted && !this.message.disableReactions && !this.hoverAudioProgress;
    },
    filteredMessageActions() {
      return this.message.senderId === this.currentUserId ? this.messageActions : this.messageActions.filter((message) => !message.onlyMe);
    }
  },
  watch: {
    emojiOpened(val) {
      this.$emit("update-emoji-opened", val);
      if (val)
        this.optionsOpened = false;
    },
    optionsOpened(val) {
      this.$emit("update-options-opened", val);
    }
  },
  methods: {
    openOptions() {
      if (this.optionsClosing)
        return;
      this.optionsOpened = !this.optionsOpened;
      if (!this.optionsOpened)
        return;
      setTimeout(() => {
        const roomFooterRef = document.querySelector("vue-advanced-chat").shadowRoot.getElementById("room-footer");
        if (!roomFooterRef || !this.$refs.menuOptions || !this.$refs.actionIcon) {
          return;
        }
        const menuOptionsTop = this.$refs.menuOptions.getBoundingClientRect().height;
        const actionIconTop = this.$refs.actionIcon.getBoundingClientRect().top;
        const roomFooterTop = roomFooterRef.getBoundingClientRect().top;
        const optionsTopPosition = roomFooterTop - actionIconTop > menuOptionsTop + 50;
        if (optionsTopPosition)
          this.menuOptionsTop = 30;
        else
          this.menuOptionsTop = -menuOptionsTop;
      });
    },
    closeOptions() {
      this.optionsOpened = false;
      this.optionsClosing = true;
      this.updateMessageHover();
      setTimeout(() => this.optionsClosing = false, 100);
    },
    openEmoji() {
      this.emojiOpened = !this.emojiOpened;
    },
    closeEmoji() {
      this.emojiOpened = false;
      this.updateMessageHover();
    },
    updateMessageHover() {
      if (this.hoverMessageId !== this.message._id) {
        this.$emit("update-message-hover", false);
      }
    },
    messageActionHandler(action) {
      this.closeOptions();
      this.$emit("message-action-handler", action);
    },
    sendMessageReaction(emoji, reaction) {
      this.$emit("send-message-reaction", { emoji, reaction });
      this.closeEmoji();
    }
  }
};
const _hoisted_1$5 = { class: "vac-message-actions-wrapper" };
const _hoisted_2$3 = { key: "3" };
const _hoisted_3$3 = { class: "vac-menu-list" };
const _hoisted_4$3 = ["onClick"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_emoji_picker_container = resolveComponent("emoji-picker-container");
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createBaseVNode("div", {
      class: "vac-options-container",
      style: normalizeStyle({
        display: $props.hoverAudioProgress ? "none" : "initial",
        width: $options.filteredMessageActions.length && $props.showReactionEmojis ? "70px" : "45px"
      })
    }, [
      createVNode(TransitionGroup, {
        name: "vac-slide-left",
        tag: "span"
      }, {
        default: withCtx(() => [
          $options.isMessageActions || $options.isMessageReactions ? (openBlock(), createElementBlock("div", {
            key: "1",
            class: normalizeClass(["vac-blur-container", {
              "vac-options-me": $props.message.senderId === $props.currentUserId
            }])
          }, null, 2)) : createCommentVNode("", true),
          $options.isMessageActions ? (openBlock(), createElementBlock("div", {
            ref: "actionIcon",
            key: "2",
            class: "vac-svg-button vac-message-options",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.openOptions && $options.openOptions(...args))
          }, [
            renderSlot(_ctx.$slots, "dropdown-icon_" + $props.message._id, {}, () => [
              createVNode(_component_svg_icon, {
                name: "dropdown",
                param: "message"
              })
            ])
          ], 512)) : createCommentVNode("", true),
          $options.isMessageReactions ? withDirectives((openBlock(), createElementBlock("div", _hoisted_2$3, [
            renderSlot(_ctx.$slots, "emoji-picker", mergeProps({ emojiOpened: $data.emojiOpened }, { addEmoji: $options.sendMessageReaction }), () => [
              createVNode(_component_emoji_picker_container, {
                class: "vac-message-emojis",
                style: normalizeStyle({ right: $options.isMessageActions ? "30px" : "5px" }),
                "emoji-opened": $data.emojiOpened,
                "emoji-reaction": true,
                "position-right": $props.message.senderId === $props.currentUserId,
                "message-id": $props.message._id,
                onAddEmoji: $options.sendMessageReaction,
                onOpenEmoji: $options.openEmoji
              }, createSlots({ _: 2 }, [
                renderList(_ctx.$slots, (idx, name) => {
                  return {
                    name,
                    fn: withCtx((data2) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                    ])
                  };
                })
              ]), 1032, ["style", "emoji-opened", "position-right", "message-id", "onAddEmoji", "onOpenEmoji"])
            ])
          ])), [
            [_directive_click_outside, $options.closeEmoji]
          ]) : createCommentVNode("", true)
        ]),
        _: 3
      })
    ], 4),
    $options.filteredMessageActions.length ? (openBlock(), createBlock(Transition, {
      key: 0,
      name: $props.message.senderId === $props.currentUserId ? "vac-slide-left" : "vac-slide-right"
    }, {
      default: withCtx(() => [
        $data.optionsOpened ? withDirectives((openBlock(), createElementBlock("div", {
          key: 0,
          ref: "menuOptions",
          class: normalizeClass(["vac-menu-options", {
            "vac-menu-left": $props.message.senderId !== $props.currentUserId
          }]),
          style: normalizeStyle({ top: `${$data.menuOptionsTop}px` })
        }, [
          createBaseVNode("div", _hoisted_3$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($options.filteredMessageActions, (action) => {
              return openBlock(), createElementBlock("div", {
                key: action.name
              }, [
                createBaseVNode("div", {
                  class: "vac-menu-item",
                  onClick: ($event) => $options.messageActionHandler(action)
                }, toDisplayString(action.title), 9, _hoisted_4$3)
              ]);
            }), 128))
          ])
        ], 6)), [
          [_directive_click_outside, $options.closeOptions]
        ]) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["name"])) : createCommentVNode("", true)
  ]);
}
var MessageActions = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const _sfc_main$4 = {
  name: "MessageReactions",
  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true }
  },
  emits: ["send-message-reaction"],
  methods: {
    sendMessageReaction(emoji, reaction) {
      this.$emit("send-message-reaction", { emoji, reaction });
    }
  }
};
const _hoisted_1$4 = ["onClick"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.message.deleted ? (openBlock(), createBlock(TransitionGroup, {
    key: 0,
    name: "vac-slide-left",
    tag: "span"
  }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.message.reactions, (reaction, key) => {
        return withDirectives((openBlock(), createElementBlock("button", {
          key: key + 0,
          class: normalizeClass(["vac-button-reaction", {
            "vac-reaction-me": reaction.indexOf($props.currentUserId) !== -1
          }]),
          style: normalizeStyle({
            float: $props.message.senderId === $props.currentUserId ? "right" : "left"
          }),
          onClick: ($event) => $options.sendMessageReaction({ unicode: key }, reaction)
        }, [
          createTextVNode(toDisplayString(key), 1),
          createBaseVNode("span", null, toDisplayString(reaction.length), 1)
        ], 14, _hoisted_1$4)), [
          [vShow, reaction.length]
        ]);
      }), 128))
    ]),
    _: 1
  })) : createCommentVNode("", true);
}
var MessageReactions = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
function roomsValidation(obj) {
  const roomsValidate = [
    { key: "roomId", type: ["string", "number"] },
    { key: "roomName", type: ["string"] },
    { key: "users", type: ["array"] }
  ];
  const validate = (obj2, props) => {
    return props.every((prop) => {
      let validType = false;
      if (prop.type[0] === "array" && Array.isArray(obj2[prop.key])) {
        validType = true;
      } else if (prop.type.find((t) => t === typeof obj2[prop.key])) {
        validType = true;
      }
      return validType && checkObjectValid(obj2, prop.key);
    });
  };
  if (!validate(obj, roomsValidate)) {
    throw new Error(
      "Rooms object is not valid! Must contain roomId[String, Number], roomName[String] and users[Array]"
    );
  }
}
function partcipantsValidation(obj) {
  const participantsValidate = [
    { key: "_id", type: ["string", "number"] },
    { key: "username", type: ["string"] }
  ];
  const validate = (obj2, props) => {
    return props.every((prop) => {
      const validType = prop.type.find((t) => t === typeof obj2[prop.key]);
      return validType && checkObjectValid(obj2, prop.key);
    });
  };
  if (!validate(obj, participantsValidate)) {
    throw new Error(
      "Participants object is not valid! Must contain _id[String, Number] and username[String]"
    );
  }
}
function messagesValidation(obj) {
  const messagesValidate = [
    { key: "_id", type: ["string", "number"] },
    { key: "content", type: ["string", "number"] },
    { key: "senderId", type: ["string", "number"] }
  ];
  const validate = (obj2, props) => {
    return props.every((prop) => {
      const validType = prop.type.find((t) => t === typeof obj2[prop.key]);
      return validType && checkObjectValid(obj2, prop.key);
    });
  };
  if (!validate(obj, messagesValidate)) {
    throw new Error(
      "Messages object is not valid! Must contain _id[String, Number], content[String, Number] and senderId[String, Number]"
    );
  }
}
function checkObjectValid(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== void 0;
}
const _sfc_main$3 = {
  name: "RoomMessage",
  components: {
    SvgIcon,
    FormatMessage,
    AudioPlayer,
    MessageReply,
    MessageFiles,
    MessageActions,
    MessageReactions
  },
  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    index: { type: Number, required: true },
    message: { type: Object, required: true },
    messages: { type: Array, required: true },
    editedMessageId: { type: [String, Number], default: null },
    roomUsers: { type: Array, default: () => [] },
    messageActions: { type: Array, required: true },
    newMessages: { type: Array, default: () => [] },
    showReactionEmojis: { type: Boolean, required: true },
    showNewMessagesDivider: { type: Boolean, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    usernameOptions: { type: Object, required: true },
    messageSelectionEnabled: { type: Boolean, required: true },
    selectedMessages: { type: Array, default: () => [] }
  },
  emits: [
    "message-added",
    "open-file",
    "open-user-tag",
    "open-failed-message",
    "message-action-handler",
    "send-message-reaction",
    "select-message",
    "unselect-message"
  ],
  data() {
    return {
      hoverMessageId: null,
      messageHover: false,
      optionsOpened: false,
      emojiOpened: false,
      newMessage: {},
      progressTime: "- : -",
      hoverAudioProgress: false
    };
  },
  computed: {
    showUsername() {
      if (!this.usernameOptions.currentUser && this.message.senderId === this.currentUserId) {
        return false;
      } else {
        return this.roomUsers.length >= this.usernameOptions.minUsers;
      }
    },
    showDate() {
      return this.index > 0 && this.message.date !== this.messages[this.index - 1].date;
    },
    messageOffset() {
      return this.index > 0 && this.message.senderId !== this.messages[this.index - 1].senderId;
    },
    isMessageHover() {
      return this.editedMessageId === this.message._id || this.hoverMessageId === this.message._id;
    },
    isAudio() {
      var _a;
      return (_a = this.message.files) == null ? void 0 : _a.some((file) => isAudioFile(file));
    },
    isCheckmarkVisible() {
      return this.message.senderId === this.currentUserId && !this.message.deleted && (this.message.saved || this.message.distributed || this.message.seen);
    },
    hasCurrentUserAvatar() {
      return this.messages.some(
        (message) => message.senderId === this.currentUserId && message.avatar
      );
    },
    hasSenderUserAvatar() {
      return this.messages.some(
        (message) => message.senderId !== this.currentUserId && message.avatar
      );
    },
    isMessageSelected() {
      return this.messageSelectionEnabled && !!this.selectedMessages.find(
        (message) => message._id === this.message._id
      );
    }
  },
  watch: {
    newMessages: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val.length || !this.showNewMessagesDivider) {
          this.newMessage = {};
          return;
        }
        this.newMessage = val.reduce(
          (res, obj) => obj.index < res.index ? obj : res
        );
      }
    },
    messageSelectionEnabled() {
      this.resetMessageHover();
    }
  },
  mounted() {
    messagesValidation(this.message);
    this.$emit("message-added", {
      message: this.message,
      index: this.index,
      ref: this.$refs.message
    });
  },
  methods: {
    onHoverMessage() {
      if (!this.messageSelectionEnabled) {
        this.messageHover = true;
        if (this.canEditMessage())
          this.hoverMessageId = this.message._id;
      }
    },
    canEditMessage() {
      return !this.message.deleted;
    },
    onLeaveMessage() {
      if (!this.messageSelectionEnabled) {
        if (!this.optionsOpened && !this.emojiOpened)
          this.messageHover = false;
        this.hoverMessageId = null;
      }
    },
    resetMessageHover() {
      this.messageHover = false;
      this.hoverMessageId = null;
    },
    openFile(file) {
      this.$emit("open-file", { message: this.message, file });
    },
    openUserTag(user) {
      this.$emit("open-user-tag", { user });
    },
    messageActionHandler(action) {
      this.resetMessageHover();
      setTimeout(() => {
        this.$emit("message-action-handler", { action, message: this.message });
      }, 300);
    },
    sendMessageReaction({ emoji, reaction }) {
      this.$emit("send-message-reaction", {
        messageId: this.message._id,
        reaction: emoji,
        remove: reaction && reaction.indexOf(this.currentUserId) !== -1
      });
      this.messageHover = false;
    },
    selectMessage() {
      if (this.messageSelectionEnabled) {
        if (this.isMessageSelected) {
          this.$emit("unselect-message", this.message._id);
        } else {
          this.$emit("select-message", this.message);
        }
      }
    }
  }
};
const _hoisted_1$3 = ["id"];
const _hoisted_2$2 = {
  key: 0,
  class: "vac-card-info vac-card-date"
};
const _hoisted_3$2 = {
  key: 1,
  class: "vac-line-new"
};
const _hoisted_4$2 = {
  key: 2,
  class: "vac-card-info vac-card-system"
};
const _hoisted_5$2 = {
  key: 1,
  class: "vac-avatar-offset"
};
const _hoisted_6$1 = {
  key: 0,
  class: "vac-progress-time"
};
const _hoisted_7$1 = { class: "vac-text-timestamp" };
const _hoisted_8 = {
  key: 0,
  class: "vac-icon-edited"
};
const _hoisted_9 = { key: 1 };
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("div", { class: "vac-failure-text" }, "!", -1);
const _hoisted_11 = [
  _hoisted_10
];
const _hoisted_12 = {
  key: 3,
  class: "vac-avatar-current-offset"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_format_message = resolveComponent("format-message");
  const _component_message_reply = resolveComponent("message-reply");
  const _component_message_files = resolveComponent("message-files");
  const _component_audio_player = resolveComponent("audio-player");
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_message_actions = resolveComponent("message-actions");
  const _component_message_reactions = resolveComponent("message-reactions");
  return openBlock(), createElementBlock("div", {
    id: $props.message._id,
    ref: "message",
    class: "vac-message-wrapper"
  }, [
    $options.showDate ? (openBlock(), createElementBlock("div", _hoisted_2$2, toDisplayString($props.message.date), 1)) : createCommentVNode("", true),
    $data.newMessage._id === $props.message._id ? (openBlock(), createElementBlock("div", _hoisted_3$2, toDisplayString($props.textMessages.NEW_MESSAGES), 1)) : createCommentVNode("", true),
    $props.message.system ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
      renderSlot(_ctx.$slots, "message_" + $props.message._id, {}, () => [
        createVNode(_component_format_message, {
          "message-id": $props.message._id,
          content: $props.message.content,
          deleted: !!$props.message.deleted,
          users: $props.roomUsers,
          "text-messages": $props.textMessages,
          "text-formatting": $props.textFormatting,
          "link-options": $props.linkOptions,
          onOpenUserTag: $options.openUserTag
        }, createSlots({ _: 2 }, [
          renderList(_ctx.$slots, (idx, name) => {
            return {
              name,
              fn: withCtx((data2) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
              ])
            };
          })
        ]), 1032, ["message-id", "content", "deleted", "users", "text-messages", "text-formatting", "link-options", "onOpenUserTag"])
      ])
    ])) : (openBlock(), createElementBlock("div", {
      key: 3,
      class: normalizeClass(["vac-message-box", { "vac-offset-current": $props.message.senderId === $props.currentUserId }]),
      onClick: _cache[8] || (_cache[8] = (...args) => $options.selectMessage && $options.selectMessage(...args))
    }, [
      renderSlot(_ctx.$slots, "message_" + $props.message._id, {}, () => [
        $props.message.avatar && $props.message.senderId !== $props.currentUserId ? renderSlot(_ctx.$slots, "message-avatar_" + $props.message._id, { key: 0 }, () => [
          createBaseVNode("div", {
            class: "vac-avatar",
            style: normalizeStyle({ "background-image": `url('${$props.message.avatar}')` })
          }, null, 4)
        ]) : createCommentVNode("", true),
        $options.hasSenderUserAvatar && !$props.message.avatar ? (openBlock(), createElementBlock("div", _hoisted_5$2)) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass(["vac-message-container", {
            "vac-message-container-offset": $options.messageOffset
          }])
        }, [
          createBaseVNode("div", {
            class: normalizeClass(["vac-message-card", {
              "vac-message-highlight": $options.isMessageHover,
              "vac-message-current": $props.message.senderId === $props.currentUserId,
              "vac-message-deleted": $props.message.deleted,
              "vac-item-clickable": $props.messageSelectionEnabled,
              "vac-message-selected": $options.isMessageSelected
            }]),
            onMouseover: _cache[5] || (_cache[5] = (...args) => $options.onHoverMessage && $options.onHoverMessage(...args)),
            onMouseleave: _cache[6] || (_cache[6] = (...args) => $options.onLeaveMessage && $options.onLeaveMessage(...args))
          }, [
            $options.showUsername ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["vac-text-username", {
                "vac-username-reply": !$props.message.deleted && $props.message.replyMessage
              }])
            }, [
              createBaseVNode("span", null, toDisplayString($props.message.username), 1)
            ], 2)) : createCommentVNode("", true),
            !$props.message.deleted && $props.message.replyMessage ? (openBlock(), createBlock(_component_message_reply, {
              key: 1,
              message: $props.message,
              "room-users": $props.roomUsers,
              "text-formatting": $props.textFormatting,
              "link-options": $props.linkOptions
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (i, name) => {
                return {
                  name,
                  fn: withCtx((data2) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                  ])
                };
              })
            ]), 1032, ["message", "room-users", "text-formatting", "link-options"])) : createCommentVNode("", true),
            !!$props.message.deleted || !$props.message.files || !$props.message.files.length ? (openBlock(), createBlock(_component_format_message, {
              key: 2,
              "message-id": $props.message._id,
              content: $props.message.content,
              deleted: !!$props.message.deleted,
              users: $props.roomUsers,
              "text-formatting": $props.textFormatting,
              "text-messages": $props.textMessages,
              "link-options": $props.linkOptions,
              onOpenUserTag: $options.openUserTag
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (idx, name) => {
                return {
                  name,
                  fn: withCtx((data2) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                  ])
                };
              })
            ]), 1032, ["message-id", "content", "deleted", "users", "text-formatting", "text-messages", "link-options", "onOpenUserTag"])) : !$options.isAudio || $props.message.files.length > 1 ? (openBlock(), createBlock(_component_message_files, {
              key: 3,
              "current-user-id": $props.currentUserId,
              message: $props.message,
              "room-users": $props.roomUsers,
              "text-formatting": $props.textFormatting,
              "link-options": $props.linkOptions,
              "message-selection-enabled": $props.messageSelectionEnabled,
              onOpenFile: $options.openFile,
              onOpenUserTag: $options.openUserTag
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (i, name) => {
                return {
                  name,
                  fn: withCtx((data2) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                  ])
                };
              })
            ]), 1032, ["current-user-id", "message", "room-users", "text-formatting", "link-options", "message-selection-enabled", "onOpenFile", "onOpenUserTag"])) : (openBlock(), createElementBlock(Fragment, { key: 4 }, [
              createVNode(_component_audio_player, {
                "message-id": $props.message._id,
                src: $props.message.files[0].url,
                "message-selection-enabled": $props.messageSelectionEnabled,
                onUpdateProgressTime: _cache[0] || (_cache[0] = ($event) => $data.progressTime = $event),
                onHoverAudioProgress: _cache[1] || (_cache[1] = ($event) => $data.hoverAudioProgress = $event)
              }, createSlots({ _: 2 }, [
                renderList(_ctx.$slots, (i, name) => {
                  return {
                    name,
                    fn: withCtx((data2) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                    ])
                  };
                })
              ]), 1032, ["message-id", "src", "message-selection-enabled"]),
              !$props.message.deleted ? (openBlock(), createElementBlock("div", _hoisted_6$1, toDisplayString($data.progressTime), 1)) : createCommentVNode("", true)
            ], 64)),
            createBaseVNode("div", _hoisted_7$1, [
              $props.message.edited && !$props.message.deleted ? (openBlock(), createElementBlock("div", _hoisted_8, [
                renderSlot(_ctx.$slots, "pencil-icon_" + $props.message._id, {}, () => [
                  createVNode(_component_svg_icon, { name: "pencil" })
                ])
              ])) : createCommentVNode("", true),
              createBaseVNode("span", null, toDisplayString($props.message.timestamp), 1),
              $options.isCheckmarkVisible ? (openBlock(), createElementBlock("span", _hoisted_9, [
                renderSlot(_ctx.$slots, "checkmark-icon_" + $props.message._id, {}, () => [
                  createVNode(_component_svg_icon, {
                    name: $props.message.distributed ? "double-checkmark" : "checkmark",
                    param: $props.message.seen ? "seen" : "",
                    class: "vac-icon-check"
                  }, null, 8, ["name", "param"])
                ])
              ])) : createCommentVNode("", true)
            ]),
            createVNode(_component_message_actions, {
              "current-user-id": $props.currentUserId,
              message: $props.message,
              "message-actions": $props.messageActions,
              "show-reaction-emojis": $props.showReactionEmojis,
              "message-hover": $data.messageHover,
              "hover-message-id": $data.hoverMessageId,
              "hover-audio-progress": $data.hoverAudioProgress,
              onUpdateMessageHover: _cache[2] || (_cache[2] = ($event) => $data.messageHover = $event),
              onUpdateOptionsOpened: _cache[3] || (_cache[3] = ($event) => $data.optionsOpened = $event),
              onUpdateEmojiOpened: _cache[4] || (_cache[4] = ($event) => $data.emojiOpened = $event),
              onMessageActionHandler: $options.messageActionHandler,
              onSendMessageReaction: $options.sendMessageReaction
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (i, name) => {
                return {
                  name,
                  fn: withCtx((data2) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                  ])
                };
              })
            ]), 1032, ["current-user-id", "message", "message-actions", "show-reaction-emojis", "message-hover", "hover-message-id", "hover-audio-progress", "onMessageActionHandler", "onSendMessageReaction"])
          ], 34),
          createVNode(_component_message_reactions, {
            "current-user-id": $props.currentUserId,
            message: $props.message,
            onSendMessageReaction: $options.sendMessageReaction
          }, null, 8, ["current-user-id", "message", "onSendMessageReaction"])
        ], 2),
        renderSlot(_ctx.$slots, "message-failure_" + $props.message._id, {}, () => [
          $props.message.failure && $props.message.senderId === $props.currentUserId ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["vac-failure-container vac-svg-button", {
              "vac-failure-container-avatar": $props.message.avatar && $props.message.senderId === $props.currentUserId
            }]),
            onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("open-failed-message", { message: $props.message }))
          }, _hoisted_11, 2)) : createCommentVNode("", true)
        ]),
        $props.message.avatar && $props.message.senderId === $props.currentUserId ? renderSlot(_ctx.$slots, "message-avatar_" + $props.message._id, { key: 2 }, () => [
          createBaseVNode("div", {
            class: "vac-avatar vac-avatar-current",
            style: normalizeStyle({ "background-image": `url('${$props.message.avatar}')` })
          }, null, 4)
        ]) : createCommentVNode("", true),
        $options.hasCurrentUserAvatar && !$props.message.avatar ? (openBlock(), createElementBlock("div", _hoisted_12)) : createCommentVNode("", true)
      ])
    ], 2))
  ], 8, _hoisted_1$3);
}
var RoomMessage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  name: "ChatRoom",
  components: {
    Loader,
    SvgIcon,
    RoomHeader,
    RoomFooter,
    RoomMessage
  },
  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    singleRoom: { type: Boolean, required: true },
    showRoomsList: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    rooms: { type: Array, required: true },
    roomId: { type: [String, Number], required: true },
    loadFirstRoom: { type: Boolean, required: true },
    messages: { type: Array, required: true },
    roomMessage: { type: String, default: null },
    messagesLoaded: { type: Boolean, required: true },
    menuActions: { type: Array, required: true },
    messageActions: { type: Array, required: true },
    messageSelectionActions: { type: Array, required: true },
    autoScroll: { type: Object, required: true },
    showSendIcon: { type: Boolean, required: true },
    showFiles: { type: Boolean, required: true },
    showAudio: { type: Boolean, required: true },
    audioBitRate: { type: Number, required: true },
    audioSampleRate: { type: Number, required: true },
    showEmojis: { type: Boolean, required: true },
    showReactionEmojis: { type: Boolean, required: true },
    showNewMessagesDivider: { type: Boolean, required: true },
    showFooter: { type: Boolean, required: true },
    acceptedFiles: { type: String, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    loadingRooms: { type: Boolean, required: true },
    roomInfoEnabled: { type: Boolean, required: true },
    textareaActionEnabled: { type: Boolean, required: true },
    textareaAutoFocus: { type: Boolean, required: true },
    userTagsEnabled: { type: Boolean, required: true },
    emojisSuggestionEnabled: { type: Boolean, required: true },
    scrollDistance: { type: Number, required: true },
    templatesText: { type: Array, default: null },
    usernameOptions: { type: Object, required: true }
  },
  emits: [
    "toggle-rooms-list",
    "room-info",
    "menu-action-handler",
    "message-selection-action-handler",
    "edit-message",
    "send-message",
    "delete-message",
    "message-action-handler",
    "fetch-messages",
    "send-message-reaction",
    "typing-message",
    "open-file",
    "open-user-tag",
    "open-failed-message",
    "textarea-action-handler"
  ],
  data() {
    return {
      editedMessageId: null,
      initReplyMessage: null,
      initEditMessage: null,
      loadingMessages: false,
      observer: null,
      showLoader: true,
      loadingMoreMessages: false,
      scrollIcon: false,
      scrollMessagesCount: 0,
      newMessages: [],
      messageSelectionEnabled: false,
      selectedMessages: [],
      droppedFiles: []
    };
  },
  computed: {
    room() {
      return this.rooms.find((room) => room.roomId === this.roomId) || {};
    },
    showNoMessages() {
      return this.roomId && !this.messages.length && !this.loadingMessages && !this.loadingRooms;
    },
    showNoRoom() {
      const noRoomSelected = !this.rooms.length && !this.loadingRooms || !this.roomId && !this.loadFirstRoom;
      if (noRoomSelected) {
        this.updateLoadingMessages(false);
      }
      return noRoomSelected;
    },
    showMessagesStarted() {
      return this.messages.length && this.messagesLoaded;
    }
  },
  watch: {
    roomId: {
      immediate: true,
      handler() {
        this.onRoomChanged();
      }
    },
    messages: {
      deep: true,
      handler(newVal, oldVal) {
        newVal.forEach((message, i) => {
          if (this.showNewMessagesDivider && !message.seen && message.senderId !== this.currentUserId) {
            this.newMessages.push({
              _id: message._id,
              index: i
            });
          }
        });
        if ((oldVal == null ? void 0 : oldVal.length) === (newVal == null ? void 0 : newVal.length) - 1) {
          this.newMessages = [];
        }
        setTimeout(() => this.loadingMoreMessages = false);
      }
    },
    messagesLoaded(val) {
      if (val)
        this.updateLoadingMessages(false);
    }
  },
  mounted() {
    this.newMessages = [];
  },
  methods: {
    updateLoadingMessages(val) {
      this.loadingMessages = val;
      if (!val) {
        setTimeout(() => this.initIntersectionObserver());
      }
    },
    initIntersectionObserver() {
      if (this.observer) {
        this.showLoader = true;
        this.observer.disconnect();
      }
      const loader = document.querySelector("vue-advanced-chat").shadowRoot.getElementById("infinite-loader-messages");
      if (loader) {
        const options2 = {
          root: document.querySelector("vue-advanced-chat").shadowRoot.getElementById("messages-list"),
          rootMargin: `${this.scrollDistance}px`,
          threshold: 0
        };
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.loadMoreMessages();
          }
        }, options2);
        this.observer.observe(loader);
      }
    },
    preventTopScroll() {
      const container = this.$refs.scrollContainer;
      const prevScrollHeight = container.scrollHeight;
      const observer = new ResizeObserver((_) => {
        if (container.scrollHeight !== prevScrollHeight) {
          if (this.$refs.scrollContainer) {
            this.$refs.scrollContainer.scrollTo({
              top: container.scrollHeight - prevScrollHeight
            });
            observer.disconnect();
          }
        }
      });
      for (var i = 0; i < container.children.length; i++) {
        observer.observe(container.children[i]);
      }
    },
    touchStart(touchEvent) {
      if (this.singleRoom)
        return;
      if (touchEvent.changedTouches.length === 1) {
        const posXStart = touchEvent.changedTouches[0].clientX;
        const posYStart = touchEvent.changedTouches[0].clientY;
        addEventListener(
          "touchend",
          (touchEvent2) => this.touchEnd(touchEvent2, posXStart, posYStart),
          { once: true }
        );
      }
    },
    touchEnd(touchEvent, posXStart, posYStart) {
      if (touchEvent.changedTouches.length === 1) {
        const posXEnd = touchEvent.changedTouches[0].clientX;
        const posYEnd = touchEvent.changedTouches[0].clientY;
        const swippedRight = posXEnd - posXStart > 100;
        const swippedVertically = Math.abs(posYEnd - posYStart) > 50;
        if (swippedRight && !swippedVertically) {
          this.$emit("toggle-rooms-list");
        }
      }
    },
    onRoomChanged() {
      this.updateLoadingMessages(true);
      this.scrollIcon = false;
      this.scrollMessagesCount = 0;
      this.resetMessageSelection();
      const unwatch = this.$watch(
        () => this.messages,
        (val) => {
          if (!val || !val.length)
            return;
          const element2 = this.$refs.scrollContainer;
          if (!element2)
            return;
          unwatch();
          setTimeout(() => {
            element2.scrollTo({ top: element2.scrollHeight });
            this.updateLoadingMessages(false);
          });
        }
      );
    },
    resetMessageSelection() {
      this.messageSelectionEnabled = false;
      this.selectedMessages = [];
    },
    selectMessage(message) {
      this.selectedMessages.push(message);
    },
    unselectMessage(messageId) {
      this.selectedMessages = this.selectedMessages.filter(
        (message) => message._id !== messageId
      );
    },
    onMessageAdded({ message, index, ref: ref2 }) {
      if (index !== this.messages.length - 1)
        return;
      const autoScrollOffset = ref2.offsetHeight + 60;
      setTimeout(() => {
        const scrolledUp = this.getBottomScroll(this.$refs.scrollContainer) > autoScrollOffset;
        if (message.senderId === this.currentUserId) {
          if (scrolledUp) {
            if (this.autoScroll.send.newAfterScrollUp) {
              this.scrollToBottom();
            }
          } else {
            if (this.autoScroll.send.new) {
              this.scrollToBottom();
            }
          }
        } else {
          if (scrolledUp) {
            if (this.autoScroll.receive.newAfterScrollUp) {
              this.scrollToBottom();
            } else {
              this.scrollIcon = true;
              this.scrollMessagesCount++;
            }
          } else {
            if (this.autoScroll.receive.new) {
              this.scrollToBottom();
            } else {
              this.scrollIcon = true;
              this.scrollMessagesCount++;
            }
          }
        }
      });
    },
    onContainerScroll(e) {
      if (!e.target)
        return;
      const bottomScroll = this.getBottomScroll(e.target);
      if (bottomScroll < 60)
        this.scrollMessagesCount = 0;
      this.scrollIcon = bottomScroll > 500 || this.scrollMessagesCount;
    },
    loadMoreMessages() {
      if (this.loadingMessages)
        return;
      setTimeout(
        () => {
          if (this.loadingMoreMessages)
            return;
          if (this.messagesLoaded || !this.roomId) {
            this.loadingMoreMessages = false;
            this.showLoader = false;
            return;
          }
          this.preventTopScroll();
          this.$emit("fetch-messages");
          this.loadingMoreMessages = true;
        },
        500
      );
    },
    messageActionHandler({ action, message }) {
      switch (action.name) {
        case "replyMessage":
          this.initReplyMessage = message;
          setTimeout(() => {
            this.initReplyMessage = null;
          });
          return;
        case "editMessage":
          this.initEditMessage = message;
          setTimeout(() => {
            this.initEditMessage = null;
          });
          return;
        case "deleteMessage":
          return this.$emit("delete-message", message);
        case "selectMessages":
          this.selectedMessages = [message];
          this.messageSelectionEnabled = true;
          return;
        default:
          return this.$emit("message-action-handler", { action, message });
      }
    },
    messageSelectionActionHandler(action) {
      this.$emit("message-selection-action-handler", {
        action,
        messages: this.selectedMessages
      });
      this.resetMessageSelection();
    },
    sendMessageReaction(messageReaction) {
      this.$emit("send-message-reaction", messageReaction);
    },
    getBottomScroll(element2) {
      const { scrollHeight, clientHeight, scrollTop } = element2;
      return scrollHeight - clientHeight - scrollTop;
    },
    scrollToBottom() {
      setTimeout(() => {
        const element2 = this.$refs.scrollContainer;
        element2.classList.add("vac-scroll-smooth");
        element2.scrollTo({ top: element2.scrollHeight, behavior: "smooth" });
        setTimeout(() => element2.classList.remove("vac-scroll-smooth"));
      }, 50);
    },
    openFile({ message, file }) {
      this.$emit("open-file", { message, file });
    },
    openUserTag(user) {
      this.$emit("open-user-tag", user);
    },
    onDropFiles(event) {
      this.droppedFiles = event.dataTransfer.files;
    }
  }
};
const _hoisted_1$2 = { class: "vac-container-center vac-room-empty" };
const _hoisted_2$1 = { class: "vac-messages-container" };
const _hoisted_3$1 = {
  key: 0,
  class: "vac-text-started"
};
const _hoisted_4$1 = {
  key: 1,
  class: "vac-text-started"
};
const _hoisted_5$1 = {
  key: 0,
  id: "infinite-loader-messages"
};
const _hoisted_6 = { key: 2 };
const _hoisted_7 = {
  key: 0,
  class: "vac-badge-counter vac-messages-count"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_room_header = resolveComponent("room-header");
  const _component_loader = resolveComponent("loader");
  const _component_room_message = resolveComponent("room-message");
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_room_footer = resolveComponent("room-footer");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: "vac-col-messages",
    onDrop: _cache[12] || (_cache[12] = withModifiers((...args) => $options.onDropFiles && $options.onDropFiles(...args), ["prevent"])),
    onDragenter: _cache[13] || (_cache[13] = withModifiers(() => {
    }, ["prevent"])),
    onDragover: _cache[14] || (_cache[14] = withModifiers(() => {
    }, ["prevent"])),
    onDragleave: _cache[15] || (_cache[15] = withModifiers(() => {
    }, ["prevent"])),
    onTouchstart: _cache[16] || (_cache[16] = (...args) => $options.touchStart && $options.touchStart(...args))
  }, [
    $options.showNoRoom ? renderSlot(_ctx.$slots, "no-room-selected", { key: 0 }, () => [
      createBaseVNode("div", _hoisted_1$2, [
        createBaseVNode("div", null, toDisplayString($props.textMessages.ROOM_EMPTY), 1)
      ])
    ]) : (openBlock(), createBlock(_component_room_header, {
      key: 1,
      "current-user-id": $props.currentUserId,
      "text-messages": $props.textMessages,
      "single-room": $props.singleRoom,
      "show-rooms-list": $props.showRoomsList,
      "is-mobile": $props.isMobile,
      "room-info-enabled": $props.roomInfoEnabled,
      "menu-actions": $props.menuActions,
      room: $options.room,
      "message-selection-enabled": $data.messageSelectionEnabled,
      "message-selection-actions": $props.messageSelectionActions,
      "selected-messages-total": $data.selectedMessages.length,
      onToggleRoomsList: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("toggle-rooms-list")),
      onRoomInfo: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("room-info")),
      onMenuActionHandler: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("menu-action-handler", $event)),
      onMessageSelectionActionHandler: $options.messageSelectionActionHandler,
      onCancelMessageSelection: _cache[3] || (_cache[3] = ($event) => $data.messageSelectionEnabled = false)
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (i, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["current-user-id", "text-messages", "single-room", "show-rooms-list", "is-mobile", "room-info-enabled", "menu-actions", "room", "message-selection-enabled", "message-selection-actions", "selected-messages-total", "onMessageSelectionActionHandler"])),
    createBaseVNode("div", {
      id: "messages-list",
      ref: "scrollContainer",
      class: "vac-container-scroll",
      onScroll: _cache[5] || (_cache[5] = (...args) => $options.onContainerScroll && $options.onContainerScroll(...args))
    }, [
      createVNode(_component_loader, {
        show: $data.loadingMessages,
        type: "messages"
      }, createSlots({ _: 2 }, [
        renderList(_ctx.$slots, (idx, name) => {
          return {
            name,
            fn: withCtx((data2) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
            ])
          };
        })
      ]), 1032, ["show"]),
      createBaseVNode("div", _hoisted_2$1, [
        createBaseVNode("div", {
          class: normalizeClass({ "vac-messages-hidden": $data.loadingMessages })
        }, [
          createVNode(Transition, { name: "vac-fade-message" }, {
            default: withCtx(() => [
              createBaseVNode("div", null, [
                $options.showNoMessages ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
                  renderSlot(_ctx.$slots, "messages-empty", {}, () => [
                    createTextVNode(toDisplayString($props.textMessages.MESSAGES_EMPTY), 1)
                  ])
                ])) : createCommentVNode("", true),
                $options.showMessagesStarted ? (openBlock(), createElementBlock("div", _hoisted_4$1, toDisplayString($props.textMessages.CONVERSATION_STARTED) + " " + toDisplayString($props.messages[0].date), 1)) : createCommentVNode("", true)
              ])
            ]),
            _: 3
          }),
          $props.messages.length && !$props.messagesLoaded ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
            createVNode(_component_loader, {
              show: true,
              infinite: true,
              type: "infinite-messages"
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (idx, name) => {
                return {
                  name,
                  fn: withCtx((data2) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                  ])
                };
              })
            ]), 1024)
          ])) : createCommentVNode("", true),
          (openBlock(), createBlock(TransitionGroup, {
            key: $props.roomId,
            name: "vac-fade-message",
            tag: "span"
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList($props.messages, (m, i) => {
                return openBlock(), createElementBlock("div", {
                  key: m.indexId || m._id
                }, [
                  createVNode(_component_room_message, {
                    "current-user-id": $props.currentUserId,
                    message: m,
                    index: i,
                    messages: $props.messages,
                    "edited-message-id": $data.editedMessageId,
                    "message-actions": $props.messageActions,
                    "room-users": $options.room.users,
                    "text-messages": $props.textMessages,
                    "new-messages": $data.newMessages,
                    "show-reaction-emojis": $props.showReactionEmojis,
                    "show-new-messages-divider": $props.showNewMessagesDivider,
                    "text-formatting": $props.textFormatting,
                    "link-options": $props.linkOptions,
                    "username-options": $props.usernameOptions,
                    "message-selection-enabled": $data.messageSelectionEnabled,
                    "selected-messages": $data.selectedMessages,
                    onMessageAdded: $options.onMessageAdded,
                    onMessageActionHandler: $options.messageActionHandler,
                    onOpenFile: $options.openFile,
                    onOpenUserTag: $options.openUserTag,
                    onOpenFailedMessage: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("open-failed-message", $event)),
                    onSendMessageReaction: $options.sendMessageReaction,
                    onSelectMessage: $options.selectMessage,
                    onUnselectMessage: $options.unselectMessage
                  }, createSlots({ _: 2 }, [
                    renderList(_ctx.$slots, (idx, name) => {
                      return {
                        name,
                        fn: withCtx((data2) => [
                          renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
                        ])
                      };
                    })
                  ]), 1032, ["current-user-id", "message", "index", "messages", "edited-message-id", "message-actions", "room-users", "text-messages", "new-messages", "show-reaction-emojis", "show-new-messages-divider", "text-formatting", "link-options", "username-options", "message-selection-enabled", "selected-messages", "onMessageAdded", "onMessageActionHandler", "onOpenFile", "onOpenUserTag", "onSendMessageReaction", "onSelectMessage", "onUnselectMessage"])
                ]);
              }), 128))
            ]),
            _: 3
          }))
        ], 2)
      ])
    ], 544),
    !$data.loadingMessages ? (openBlock(), createElementBlock("div", _hoisted_6, [
      createVNode(Transition, { name: "vac-bounce" }, {
        default: withCtx(() => [
          $data.scrollIcon ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "vac-icon-scroll",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.scrollToBottom && $options.scrollToBottom(...args))
          }, [
            createVNode(Transition, { name: "vac-bounce" }, {
              default: withCtx(() => [
                $data.scrollMessagesCount ? (openBlock(), createElementBlock("div", _hoisted_7, toDisplayString($data.scrollMessagesCount), 1)) : createCommentVNode("", true)
              ]),
              _: 1
            }),
            renderSlot(_ctx.$slots, "scroll-icon", {}, () => [
              createVNode(_component_svg_icon, {
                name: "dropdown",
                param: "scroll"
              })
            ])
          ])) : createCommentVNode("", true)
        ]),
        _: 3
      })
    ])) : createCommentVNode("", true),
    createVNode(_component_room_footer, {
      room: $options.room,
      "room-id": $props.roomId,
      "room-message": $props.roomMessage,
      "text-messages": $props.textMessages,
      "show-send-icon": $props.showSendIcon,
      "show-files": $props.showFiles,
      "show-audio": $props.showAudio,
      "show-emojis": $props.showEmojis,
      "show-footer": $props.showFooter,
      "accepted-files": $props.acceptedFiles,
      "textarea-action-enabled": $props.textareaActionEnabled,
      "textarea-auto-focus": $props.textareaAutoFocus,
      "user-tags-enabled": $props.userTagsEnabled,
      "emojis-suggestion-enabled": $props.emojisSuggestionEnabled,
      "templates-text": $props.templatesText,
      "text-formatting": $props.textFormatting,
      "link-options": $props.linkOptions,
      "audio-bit-rate": $props.audioBitRate,
      "audio-sample-rate": $props.audioSampleRate,
      "init-reply-message": $data.initReplyMessage,
      "init-edit-message": $data.initEditMessage,
      "dropped-files": $data.droppedFiles,
      onUpdateEditedMessageId: _cache[7] || (_cache[7] = ($event) => $data.editedMessageId = $event),
      onEditMessage: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("edit-message", $event)),
      onSendMessage: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("send-message", $event)),
      onTypingMessage: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("typing-message", $event)),
      onTextareaActionHandler: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("textarea-action-handler", $event))
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (idx, name) => {
        return {
          name,
          fn: withCtx((data2) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data2)))
          ])
        };
      })
    ]), 1032, ["room", "room-id", "room-message", "text-messages", "show-send-icon", "show-files", "show-audio", "show-emojis", "show-footer", "accepted-files", "textarea-action-enabled", "textarea-auto-focus", "user-tags-enabled", "emojis-suggestion-enabled", "templates-text", "text-formatting", "link-options", "audio-bit-rate", "audio-sample-rate", "init-reply-message", "init-edit-message", "dropped-files"])
  ], 544)), [
    [vShow, $props.isMobile && !$props.showRoomsList || !$props.isMobile || $props.singleRoom]
  ]);
}
var Room = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  name: "MediaPreview",
  components: {
    SvgIcon
  },
  props: {
    file: { type: Object, required: true }
  },
  emits: ["close-media-preview"],
  computed: {
    isImage() {
      return isImageFile(this.file);
    },
    isVideo() {
      return isVideoFile(this.file);
    }
  },
  mounted() {
    this.$refs.modal.focus();
  },
  methods: {
    closeModal() {
      this.$emit("close-media-preview");
    }
  }
};
const _hoisted_1$1 = {
  key: 0,
  class: "vac-media-preview-container"
};
const _hoisted_2 = {
  key: 1,
  class: "vac-media-preview-container"
};
const _hoisted_3 = {
  controls: "",
  autoplay: ""
};
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "vac-svg-button" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", {
    ref: "modal",
    tabindex: "0",
    class: "vac-media-preview",
    onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.closeModal && $options.closeModal(...args), ["stop"])),
    onKeydown: _cache[1] || (_cache[1] = withKeys((...args) => $options.closeModal && $options.closeModal(...args), ["esc"]))
  }, [
    createVNode(Transition, {
      name: "vac-bounce-preview",
      appear: ""
    }, {
      default: withCtx(() => [
        $options.isImage ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
          createBaseVNode("div", {
            class: "vac-image-preview",
            style: normalizeStyle({
              "background-image": `url('${$props.file.url}')`
            })
          }, null, 4)
        ])) : $options.isVideo ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createBaseVNode("video", _hoisted_3, [
            createBaseVNode("source", {
              src: $props.file.url
            }, null, 8, _hoisted_4)
          ])
        ])) : createCommentVNode("", true)
      ]),
      _: 1
    }),
    createBaseVNode("div", _hoisted_5, [
      renderSlot(_ctx.$slots, "preview-close-icon", {}, () => [
        createVNode(_component_svg_icon, {
          name: "close-outline",
          param: "preview"
        })
      ])
    ])
  ], 544);
}
var MediaPreview = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
var locales = {
  ROOMS_EMPTY: "No rooms",
  ROOM_EMPTY: "No room selected",
  NEW_MESSAGES: "New Messages",
  MESSAGE_DELETED: "This message was deleted",
  MESSAGES_EMPTY: "No messages",
  CONVERSATION_STARTED: "Conversation started on:",
  TYPE_MESSAGE: "Type message",
  SEARCH: "Search",
  IS_ONLINE: "is online",
  LAST_SEEN: "last seen ",
  IS_TYPING: "is writing...",
  CANCEL_SELECT_MESSAGE: "Cancel"
};
const defaultThemeStyles = {
  light: {
    general: {
      color: "#0a0a0a",
      colorButtonClear: "#1976d2",
      colorButton: "#fff",
      backgroundColorButton: "#1976d2",
      backgroundInput: "#fff",
      colorPlaceholder: "#9ca6af",
      colorCaret: "#1976d2",
      colorSpinner: "#333",
      borderStyle: "1px solid #e1e4e8",
      backgroundScrollIcon: "#fff"
    },
    container: {
      border: "none",
      borderRadius: "4px",
      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)"
    },
    header: {
      background: "#fff",
      colorRoomName: "#0a0a0a",
      colorRoomInfo: "#9ca6af"
    },
    footer: {
      background: "#f8f9fa",
      borderStyleInput: "1px solid #e1e4e8",
      borderInputSelected: "#1976d2",
      backgroundReply: "#e5e5e6",
      backgroundTagActive: "#e5e5e6",
      backgroundTag: "#f8f9fa"
    },
    content: {
      background: "#f8f9fa"
    },
    sidemenu: {
      background: "#fff",
      backgroundHover: "#f6f6f6",
      backgroundActive: "#e5effa",
      colorActive: "#1976d2",
      borderColorSearch: "#e1e5e8"
    },
    dropdown: {
      background: "#fff",
      backgroundHover: "#f6f6f6"
    },
    message: {
      background: "#fff",
      backgroundMe: "#ccf2cf",
      color: "#0a0a0a",
      colorMe: "#0a0a0a",
      colorStarted: "#9ca6af",
      backgroundDeleted: "#dadfe2",
      backgroundSelected: "#c2dcf2",
      colorDeleted: "#757e85",
      colorUsername: "#9ca6af",
      colorTimestamp: "#828c94",
      colorTimestampMe: "#828c94",
      backgroundDate: "#e5effa",
      colorDate: "#505a62",
      backgroundSystem: "#e5effa",
      colorSystem: "#505a62",
      backgroundMedia: "rgba(0, 0, 0, 0.15)",
      backgroundReply: "rgba(0, 0, 0, 0.08)",
      colorReplyUsername: "#0a0a0a",
      colorReply: "#6e6e6e",
      colorTag: "#0d579c",
      backgroundImage: "#ddd",
      colorNewMessages: "#1976d2",
      backgroundScrollCounter: "#0696c7",
      colorScrollCounter: "#fff",
      backgroundReaction: "#eee",
      borderStyleReaction: "1px solid #eee",
      backgroundReactionHover: "#fff",
      borderStyleReactionHover: "1px solid #ddd",
      colorReactionCounter: "#0a0a0a",
      backgroundReactionMe: "#cfecf5",
      borderStyleReactionMe: "1px solid #3b98b8",
      backgroundReactionHoverMe: "#cfecf5",
      borderStyleReactionHoverMe: "1px solid #3b98b8",
      colorReactionCounterMe: "#0b59b3",
      backgroundAudioRecord: "#eb4034",
      backgroundAudioLine: "rgba(0, 0, 0, 0.15)",
      backgroundAudioProgress: "#455247",
      backgroundAudioProgressSelector: "#455247",
      colorFileExtension: "#757e85"
    },
    markdown: {
      background: "rgba(239, 239, 239, 0.7)",
      border: "rgba(212, 212, 212, 0.9)",
      color: "#e01e5a",
      colorMulti: "#0a0a0a"
    },
    room: {
      colorUsername: "#0a0a0a",
      colorMessage: "#67717a",
      colorTimestamp: "#a2aeb8",
      colorStateOnline: "#4caf50",
      colorStateOffline: "#9ca6af",
      backgroundCounterBadge: "#0696c7",
      colorCounterBadge: "#fff"
    },
    emoji: {
      background: "#fff"
    },
    icons: {
      search: "#9ca6af",
      add: "#1976d2",
      toggle: "#0a0a0a",
      menu: "#0a0a0a",
      close: "#9ca6af",
      closeImage: "#fff",
      file: "#1976d2",
      paperclip: "#1976d2",
      closeOutline: "#000",
      closePreview: "#fff",
      send: "#1976d2",
      sendDisabled: "#9ca6af",
      emoji: "#1976d2",
      emojiReaction: "rgba(0, 0, 0, 0.3)",
      document: "#1976d2",
      pencil: "#9e9e9e",
      checkmark: "#9e9e9e",
      checkmarkSeen: "#0696c7",
      eye: "#fff",
      dropdownMessage: "#fff",
      dropdownMessageBackground: "rgba(0, 0, 0, 0.25)",
      dropdownRoom: "#9e9e9e",
      dropdownScroll: "#0a0a0a",
      microphone: "#1976d2",
      audioPlay: "#455247",
      audioPause: "#455247",
      audioCancel: "#eb4034",
      audioConfirm: "#1ba65b"
    }
  },
  dark: {
    general: {
      color: "#fff",
      colorButtonClear: "#fff",
      colorButton: "#fff",
      backgroundColorButton: "#1976d2",
      backgroundInput: "#202223",
      colorPlaceholder: "#596269",
      colorCaret: "#fff",
      colorSpinner: "#fff",
      borderStyle: "none",
      backgroundScrollIcon: "#fff"
    },
    container: {
      border: "none",
      borderRadius: "4px",
      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)"
    },
    header: {
      background: "#181a1b",
      colorRoomName: "#fff",
      colorRoomInfo: "#9ca6af"
    },
    footer: {
      background: "#131415",
      borderStyleInput: "none",
      borderInputSelected: "#1976d2",
      backgroundReply: "#1b1c1c",
      backgroundTagActive: "#1b1c1c",
      backgroundTag: "#131415"
    },
    content: {
      background: "#131415"
    },
    sidemenu: {
      background: "#181a1b",
      backgroundHover: "#202224",
      backgroundActive: "#151617",
      colorActive: "#fff",
      borderColorSearch: "#181a1b"
    },
    dropdown: {
      background: "#2a2c33",
      backgroundHover: "#26282e"
    },
    message: {
      background: "#22242a",
      backgroundMe: "#1f7e80",
      color: "#fff",
      colorStarted: "#9ca6af",
      backgroundDeleted: "#1b1c21",
      backgroundSelected: "#c2dcf2",
      colorDeleted: "#a2a5a8",
      colorUsername: "#b3bac9",
      colorTimestamp: "#ebedf2",
      backgroundDate: "rgba(0, 0, 0, 0.3)",
      colorDate: "#bec5cc",
      backgroundSystem: "rgba(0, 0, 0, 0.3)",
      colorSystem: "#bec5cc",
      backgroundMedia: "rgba(0, 0, 0, 0.18)",
      backgroundReply: "rgba(0, 0, 0, 0.18)",
      colorReplyUsername: "#fff",
      colorReply: "#d6d6d6",
      colorTag: "#f0c60a",
      backgroundImage: "#ddd",
      colorNewMessages: "#fff",
      backgroundScrollCounter: "#1976d2",
      colorScrollCounter: "#fff",
      backgroundReaction: "none",
      borderStyleReaction: "none",
      backgroundReactionHover: "#202223",
      borderStyleReactionHover: "none",
      colorReactionCounter: "#fff",
      backgroundReactionMe: "#4e9ad1",
      borderStyleReactionMe: "none",
      backgroundReactionHoverMe: "#4e9ad1",
      borderStyleReactionHoverMe: "none",
      colorReactionCounterMe: "#fff",
      backgroundAudioRecord: "#eb4034",
      backgroundAudioLine: "rgba(255, 255, 255, 0.15)",
      backgroundAudioProgress: "#b7d4d3",
      backgroundAudioProgressSelector: "#b7d4d3",
      colorFileExtension: "#a2a5a8"
    },
    markdown: {
      background: "rgba(239, 239, 239, 0.7)",
      border: "rgba(212, 212, 212, 0.9)",
      color: "#e01e5a",
      colorMulti: "#0a0a0a"
    },
    room: {
      colorUsername: "#fff",
      colorMessage: "#6c7278",
      colorTimestamp: "#6c7278",
      colorStateOnline: "#4caf50",
      colorStateOffline: "#596269",
      backgroundCounterBadge: "#1976d2",
      colorCounterBadge: "#fff"
    },
    emoji: {
      background: "#343740"
    },
    icons: {
      search: "#596269",
      add: "#fff",
      toggle: "#fff",
      menu: "#fff",
      close: "#9ca6af",
      closeImage: "#fff",
      file: "#1976d2",
      paperclip: "#fff",
      closeOutline: "#fff",
      closePreview: "#fff",
      send: "#fff",
      sendDisabled: "#646a70",
      emoji: "#fff",
      emojiReaction: "#fff",
      document: "#1976d2",
      pencil: "#ebedf2",
      checkmark: "#ebedf2",
      checkmarkSeen: "#f0d90a",
      eye: "#fff",
      dropdownMessage: "#fff",
      dropdownMessageBackground: "rgba(0, 0, 0, 0.25)",
      dropdownRoom: "#fff",
      dropdownScroll: "#0a0a0a",
      microphone: "#fff",
      audioPlay: "#b7d4d3",
      audioPause: "#b7d4d3",
      audioCancel: "#eb4034",
      audioConfirm: "#1ba65b"
    }
  }
};
const cssThemeVars = ({
  general,
  container,
  header,
  footer,
  sidemenu,
  content,
  dropdown,
  message,
  markdown,
  room,
  emoji,
  icons
}) => {
  return {
    "--chat-color": general.color,
    "--chat-color-button-clear": general.colorButtonClear,
    "--chat-color-button": general.colorButton,
    "--chat-bg-color-button": general.backgroundColorButton,
    "--chat-bg-color-input": general.backgroundInput,
    "--chat-color-spinner": general.colorSpinner,
    "--chat-color-placeholder": general.colorPlaceholder,
    "--chat-color-caret": general.colorCaret,
    "--chat-border-style": general.borderStyle,
    "--chat-bg-scroll-icon": general.backgroundScrollIcon,
    "--chat-container-border": container.border,
    "--chat-container-border-radius": container.borderRadius,
    "--chat-container-box-shadow": container.boxShadow,
    "--chat-header-bg-color": header.background,
    "--chat-header-color-name": header.colorRoomName,
    "--chat-header-color-info": header.colorRoomInfo,
    "--chat-footer-bg-color": footer.background,
    "--chat-border-style-input": footer.borderStyleInput,
    "--chat-border-color-input-selected": footer.borderInputSelected,
    "--chat-footer-bg-color-reply": footer.backgroundReply,
    "--chat-footer-bg-color-tag-active": footer.backgroundTagActive,
    "--chat-footer-bg-color-tag": footer.backgroundTag,
    "--chat-content-bg-color": content.background,
    "--chat-sidemenu-bg-color": sidemenu.background,
    "--chat-sidemenu-bg-color-hover": sidemenu.backgroundHover,
    "--chat-sidemenu-bg-color-active": sidemenu.backgroundActive,
    "--chat-sidemenu-color-active": sidemenu.colorActive,
    "--chat-sidemenu-border-color-search": sidemenu.borderColorSearch,
    "--chat-dropdown-bg-color": dropdown.background,
    "--chat-dropdown-bg-color-hover": dropdown.backgroundHover,
    "--chat-message-bg-color": message.background,
    "--chat-message-bg-color-me": message.backgroundMe,
    "--chat-message-color-started": message.colorStarted,
    "--chat-message-bg-color-deleted": message.backgroundDeleted,
    "--chat-message-bg-color-selected": message.backgroundSelected,
    "--chat-message-color-deleted": message.colorDeleted,
    "--chat-message-color-username": message.colorUsername,
    "--chat-message-color-timestamp": message.colorTimestamp,
    "--chat-message-color-timestamp-me": message.colorTimestampMe,
    "--chat-message-bg-color-date": message.backgroundDate,
    "--chat-message-color-date": message.colorDate,
    "--chat-message-bg-color-system": message.backgroundSystem,
    "--chat-message-color-system": message.colorSystem,
    "--chat-message-color": message.color,
    "--chat-message-color-me": message.colorMe,
    "--chat-message-bg-color-media": message.backgroundMedia,
    "--chat-message-bg-color-reply": message.backgroundReply,
    "--chat-message-color-reply-username": message.colorReplyUsername,
    "--chat-message-color-reply-content": message.colorReply,
    "--chat-message-color-tag": message.colorTag,
    "--chat-message-bg-color-image": message.backgroundImage,
    "--chat-message-color-new-messages": message.colorNewMessages,
    "--chat-message-bg-color-scroll-counter": message.backgroundScrollCounter,
    "--chat-message-color-scroll-counter": message.colorScrollCounter,
    "--chat-message-bg-color-reaction": message.backgroundReaction,
    "--chat-message-border-style-reaction": message.borderStyleReaction,
    "--chat-message-bg-color-reaction-hover": message.backgroundReactionHover,
    "--chat-message-border-style-reaction-hover": message.borderStyleReactionHover,
    "--chat-message-color-reaction-counter": message.colorReactionCounter,
    "--chat-message-bg-color-reaction-me": message.backgroundReactionMe,
    "--chat-message-border-style-reaction-me": message.borderStyleReactionMe,
    "--chat-message-bg-color-reaction-hover-me": message.backgroundReactionHoverMe,
    "--chat-message-border-style-reaction-hover-me": message.borderStyleReactionHoverMe,
    "--chat-message-color-reaction-counter-me": message.colorReactionCounterMe,
    "--chat-message-bg-color-audio-record": message.backgroundAudioRecord,
    "--chat-message-bg-color-audio-line": message.backgroundAudioLine,
    "--chat-message-bg-color-audio-progress": message.backgroundAudioProgress,
    "--chat-message-bg-color-audio-progress-selector": message.backgroundAudioProgressSelector,
    "--chat-message-color-file-extension": message.colorFileExtension,
    "--chat-markdown-bg": markdown.background,
    "--chat-markdown-border": markdown.border,
    "--chat-markdown-color": markdown.color,
    "--chat-markdown-color-multi": markdown.colorMulti,
    "--chat-room-color-username": room.colorUsername,
    "--chat-room-color-message": room.colorMessage,
    "--chat-room-color-timestamp": room.colorTimestamp,
    "--chat-room-color-online": room.colorStateOnline,
    "--chat-room-color-offline": room.colorStateOffline,
    "--chat-room-bg-color-badge": room.backgroundCounterBadge,
    "--chat-room-color-badge": room.colorCounterBadge,
    "--chat-emoji-bg-color": emoji.background,
    "--chat-icon-color-search": icons.search,
    "--chat-icon-color-add": icons.add,
    "--chat-icon-color-toggle": icons.toggle,
    "--chat-icon-color-menu": icons.menu,
    "--chat-icon-color-close": icons.close,
    "--chat-icon-color-close-image": icons.closeImage,
    "--chat-icon-color-file": icons.file,
    "--chat-icon-color-paperclip": icons.paperclip,
    "--chat-icon-color-close-outline": icons.closeOutline,
    "--chat-icon-color-close-preview": icons.closePreview,
    "--chat-icon-color-send": icons.send,
    "--chat-icon-color-send-disabled": icons.sendDisabled,
    "--chat-icon-color-emoji": icons.emoji,
    "--chat-icon-color-emoji-reaction": icons.emojiReaction,
    "--chat-icon-color-document": icons.document,
    "--chat-icon-color-pencil": icons.pencil,
    "--chat-icon-color-checkmark": icons.checkmark,
    "--chat-icon-color-checkmark-seen": icons.checkmarkSeen,
    "--chat-icon-color-eye": icons.eye,
    "--chat-icon-color-dropdown-message": icons.dropdownMessage,
    "--chat-icon-bg-dropdown-message": icons.dropdownMessageBackground,
    "--chat-icon-color-dropdown-room": icons.dropdownRoom,
    "--chat-icon-color-dropdown-scroll": icons.dropdownScroll,
    "--chat-icon-color-microphone": icons.microphone,
    "--chat-icon-color-audio-play": icons.audioPlay,
    "--chat-icon-color-audio-pause": icons.audioPause,
    "--chat-icon-color-audio-cancel": icons.audioCancel,
    "--chat-icon-color-audio-confirm": icons.audioConfirm
  };
};
var _style_0 = '.vac-fade-spinner-enter-from{opacity:0}.vac-fade-spinner-enter-active{transition:opacity .8s}.vac-fade-spinner-leave-active{transition:opacity .2s;opacity:0}.vac-fade-image-enter-from{opacity:0}.vac-fade-image-enter-active{transition:opacity 1s}.vac-fade-image-leave-active{transition:opacity .5s;opacity:0}.vac-fade-message-enter-from{opacity:0}.vac-fade-message-enter-active{transition:opacity .5s}.vac-fade-message-leave-active{transition:opacity .2s;opacity:0}.vac-slide-left-enter-active,.vac-slide-right-enter-active{transition:all .3s ease;transition-property:transform,opacity}.vac-slide-left-leave-active,.vac-slide-right-leave-active{transition:all .2s cubic-bezier(1,.5,.8,1)!important;transition-property:transform,opacity}.vac-slide-left-enter-from,.vac-slide-left-leave-to{transform:translate(10px);opacity:0}.vac-slide-right-enter-from,.vac-slide-right-leave-to{transform:translate(-10px);opacity:0}.vac-slide-up-enter-active{transition:all .3s ease}.vac-slide-up-leave-active{transition:all .2s cubic-bezier(1,.5,.8,1)}.vac-slide-up-enter-from,.vac-slide-up-leave-to{transform:translateY(10px);opacity:0}.vac-bounce-enter-active{animation:vac-bounce-in .5s}.vac-bounce-leave-active{animation:vac-bounce-in .3s reverse}@keyframes vac-bounce-in{0%{transform:scale(0)}50%{transform:scale(1.05)}to{transform:scale(1)}}.vac-fade-preview-enter{opacity:0}.vac-fade-preview-enter-active{transition:opacity .1s}.vac-fade-preview-leave-active{transition:opacity .2s;opacity:0}.vac-bounce-preview-enter-active{animation:vac-bounce-image-in .4s}.vac-bounce-preview-leave-active{animation:vac-bounce-image-in .3s reverse}@keyframes vac-bounce-image-in{0%{transform:scale(.6)}to{transform:scale(1)}}.vac-menu-list{border-radius:4px;display:block;cursor:pointer;background:var(--chat-dropdown-bg-color);padding:6px 0}.vac-menu-list :hover{background:var(--chat-dropdown-bg-color-hover);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-menu-list :not(:hover){transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-menu-item{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 1 100%;flex:1 1 100%;min-height:30px;padding:5px 16px;position:relative;white-space:nowrap;line-height:30px}.vac-menu-options{position:absolute;right:10px;top:20px;z-index:9999;min-width:150px;display:inline-block;border-radius:4px;font-size:14px;color:var(--chat-color);overflow-y:auto;overflow-x:hidden;contain:content;box-shadow:0 2px 2px -4px #0000001a,0 2px 2px 1px #0000001f,0 1px 8px 1px #0000001f}.vac-app-border{border:var(--chat-border-style)}.vac-app-border-t{border-top:var(--chat-border-style)}.vac-app-border-r{border-right:var(--chat-border-style)}.vac-app-border-b{border-bottom:var(--chat-border-style)}.vac-app-box-shadow{transition:all .5s;box-shadow:0 2px 2px -4px #0000001a,0 2px 2px 1px #0000001f,0 1px 8px 1px #0000001f}.vac-item-clickable{cursor:pointer}.vac-vertical-center{display:flex;align-items:center;height:100%}.vac-vertical-center .vac-vertical-container{width:100%;text-align:center}.vac-svg-button{max-height:30px;display:flex;cursor:pointer;transition:all .2s}.vac-svg-button:hover{transform:scale(1.1);opacity:.7}.vac-avatar{background-size:cover;background-position:center center;background-repeat:no-repeat;background-color:#ddd;height:42px;width:42px;min-height:42px;min-width:42px;margin-right:15px;border-radius:50%}.vac-blur-loading{filter:blur(3px)}.vac-badge-counter{height:13px;width:auto;min-width:13px;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:3px;font-size:11px;font-weight:500}.vac-text-ellipsis{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-text-bold{font-weight:700}.vac-text-italic{font-style:italic}.vac-text-strike{text-decoration:line-through}.vac-text-underline{text-decoration:underline}.vac-text-inline-code{display:inline-block;font-size:12px;color:var(--chat-markdown-color);background:var(--chat-markdown-bg);border:1px solid var(--chat-markdown-border);border-radius:3px;margin:2px 0;padding:2px 3px}.vac-text-multiline-code{display:block;font-size:12px;color:var(--chat-markdown-color-multi);background:var(--chat-markdown-bg);border:1px solid var(--chat-markdown-border);border-radius:3px;margin:4px 0;padding:7px}.vac-text-tag{color:var(--chat-message-color-tag);cursor:pointer}.vac-file-container{display:flex;align-content:center;justify-content:center;flex-wrap:wrap;text-align:center;background:var(--chat-bg-color-input);border:var(--chat-border-style-input);border-radius:4px;padding:10px}.vac-file-container svg{height:28px;width:28px}.vac-file-container .vac-text-extension{font-size:12px;color:var(--chat-message-color-file-extension);margin-top:-2px}.vac-card-window{width:100%;display:block;max-width:100%;background:var(--chat-content-bg-color);color:var(--chat-color);overflow-wrap:break-word;white-space:normal;border:var(--chat-container-border);border-radius:var(--chat-container-border-radius);box-shadow:var(--chat-container-box-shadow);-webkit-tap-highlight-color:transparent}.vac-card-window *{font-family:inherit}.vac-card-window a{color:#0d579c;font-weight:500}.vac-card-window .vac-chat-container{height:100%;display:flex}.vac-card-window .vac-chat-container input{min-width:10px}.vac-card-window .vac-chat-container textarea,.vac-card-window .vac-chat-container input[type=text],.vac-card-window .vac-chat-container input[type=search]{-webkit-appearance:none}.vac-media-preview{position:fixed;top:0;left:0;z-index:99;width:100vw;height:100vh;display:flex;align-items:center;background-color:#000c;outline:none}.vac-media-preview .vac-media-preview-container{height:calc(100% - 140px);width:calc(100% - 80px);padding:70px 40px;margin:0 auto}.vac-media-preview .vac-image-preview{width:100%;height:100%;background-size:contain;background-repeat:no-repeat;background-position:center}.vac-media-preview video{width:100%;height:100%}.vac-media-preview .vac-svg-button{position:absolute;top:30px;right:30px;transform:scale(1.4)}@media only screen and (max-width: 768px){.vac-media-preview .vac-svg-button{top:20px;right:20px;transform:scale(1.2)}.vac-media-preview .vac-media-preview-container{width:calc(100% - 40px);padding:70px 20px}}.vac-col-messages{position:relative;height:100%;flex:1;overflow:hidden;display:flex;flex-flow:column}.vac-col-messages .vac-container-center{height:100%;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.vac-col-messages .vac-room-empty{font-size:14px;color:#9ca6af;font-style:italic;line-height:20px;white-space:pre-line}.vac-col-messages .vac-room-empty div{padding:0 10%}.vac-col-messages .vac-container-scroll{background:var(--chat-content-bg-color);flex:1;overflow-y:auto;margin-right:1px;margin-top:65px;-webkit-overflow-scrolling:touch}.vac-col-messages .vac-container-scroll.vac-scroll-smooth{scroll-behavior:smooth}.vac-col-messages .vac-messages-container{padding:0 5px 5px}.vac-col-messages .vac-text-started{font-size:14px;color:var(--chat-message-color-started);font-style:italic;text-align:center;margin-top:25px;margin-bottom:20px}.vac-col-messages .vac-icon-scroll{position:absolute;bottom:80px;right:20px;padding:8px;background:var(--chat-bg-scroll-icon);border-radius:50%;box-shadow:0 1px 1px -1px #0003,0 1px 1px #00000024,0 1px 2px #0000001f;display:flex;cursor:pointer;z-index:10}.vac-col-messages .vac-icon-scroll svg{height:25px;width:25px}.vac-col-messages .vac-messages-count{position:absolute;top:-8px;left:11px;background-color:var(--chat-message-bg-color-scroll-counter);color:var(--chat-message-color-scroll-counter)}.vac-col-messages .vac-messages-hidden{opacity:0}@media only screen and (max-width: 768px){.vac-col-messages .vac-container-scroll{margin-top:50px}.vac-col-messages .vac-text-started{margin-top:20px}.vac-col-messages .vac-icon-scroll{bottom:70px}}.vac-room-header{position:absolute;display:flex;align-items:center;height:64px;width:100%;z-index:10;margin-right:1px;background:var(--chat-header-bg-color);border-top-right-radius:var(--chat-container-border-radius)}.vac-room-header .vac-room-wrapper{display:flex;align-items:center;min-width:0;height:100%;width:100%;padding:0 16px}.vac-room-header .vac-toggle-button{margin-right:15px}.vac-room-header .vac-toggle-button svg{height:26px;width:26px}.vac-room-header .vac-rotate-icon{transform:rotate(180deg)!important}.vac-room-header .vac-rotate-icon-init{transform:rotate(360deg)}.vac-room-header .vac-info-wrapper,.vac-room-header .vac-room-selection{display:flex;align-items:center;min-width:0;width:100%;height:100%}.vac-room-header .vac-room-selection .vac-selection-button{padding:8px 16px;color:var(--chat-color-button);background-color:var(--chat-bg-color-button);border-radius:4px;margin-right:10px;cursor:pointer;transition:all .2s}.vac-room-header .vac-room-selection .vac-selection-button:hover{opacity:.7}.vac-room-header .vac-room-selection .vac-selection-button:active{opacity:.9}.vac-room-header .vac-room-selection .vac-selection-button .vac-selection-button-count{margin-left:6px;opacity:.9}.vac-room-header .vac-room-selection .vac-selection-cancel{display:flex;align-items:center;margin-left:auto;white-space:nowrap;color:var(--chat-color-button-clear);transition:all .2s}.vac-room-header .vac-room-selection .vac-selection-cancel:hover{opacity:.7}.vac-room-header .vac-room-name{font-size:17px;font-weight:500;line-height:22px;color:var(--chat-header-color-name)}.vac-room-header .vac-room-info{font-size:13px;line-height:18px;color:var(--chat-header-color-info)}.vac-room-header .vac-room-options{margin-left:auto}@media only screen and (max-width: 768px){.vac-room-header{height:50px}.vac-room-header .vac-room-wrapper{padding:0 10px}.vac-room-header .vac-room-name{font-size:16px;line-height:22px}.vac-room-header .vac-room-info{font-size:12px;line-height:16px}.vac-room-header .vac-avatar{height:37px;width:37px;min-height:37px;min-width:37px}}.vac-room-footer{width:100%;border-bottom-right-radius:4px;z-index:10}.vac-box-footer{display:flex;position:relative;background:var(--chat-footer-bg-color);padding:10px 8px}.vac-textarea{height:20px;width:100%;line-height:20px;overflow:hidden;outline:0;resize:none;border-radius:20px;padding:12px 16px;box-sizing:content-box;font-size:16px;background:var(--chat-bg-color-input);color:var(--chat-color);caret-color:var(--chat-color-caret);border:var(--chat-border-style-input)}.vac-textarea::placeholder{color:var(--chat-color-placeholder);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-textarea-outline{border:1px solid var(--chat-border-color-input-selected);box-shadow:inset 0 0 0 1px var(--chat-border-color-input-selected)}.vac-icon-textarea,.vac-icon-textarea-left{display:flex;align-items:center}.vac-icon-textarea svg,.vac-icon-textarea .vac-wrapper,.vac-icon-textarea-left svg,.vac-icon-textarea-left .vac-wrapper{margin:0 7px}.vac-icon-textarea{margin-left:5px}.vac-icon-textarea-left{display:flex;align-items:center;margin-right:5px}.vac-icon-textarea-left svg,.vac-icon-textarea-left .vac-wrapper{margin:0 7px}.vac-icon-textarea-left .vac-icon-microphone{fill:var(--chat-icon-color-microphone);margin:0 7px}.vac-icon-textarea-left .vac-dot-audio-record{height:15px;width:15px;border-radius:50%;background-color:var(--chat-message-bg-color-audio-record);animation:vac-scaling .8s ease-in-out infinite alternate}@keyframes vac-scaling{0%{transform:scale(1);opacity:.4}to{transform:scale(1.1);opacity:1}}.vac-icon-textarea-left .vac-dot-audio-record-time{font-size:16px;color:var(--chat-color);margin-left:8px;width:45px}.vac-icon-textarea-left .vac-icon-audio-stop,.vac-icon-textarea-left .vac-icon-audio-confirm{min-height:28px;min-width:28px}.vac-icon-textarea-left .vac-icon-audio-stop svg,.vac-icon-textarea-left .vac-icon-audio-confirm svg{min-height:28px;min-width:28px}.vac-icon-textarea-left .vac-icon-audio-stop{margin-right:20px}.vac-icon-textarea-left .vac-icon-audio-stop #vac-icon-close-outline{fill:var(--chat-icon-color-audio-cancel)}.vac-icon-textarea-left .vac-icon-audio-confirm{margin-right:3px;margin-left:12px}.vac-icon-textarea-left .vac-icon-audio-confirm #vac-icon-checkmark{fill:var(--chat-icon-color-audio-confirm)}.vac-send-disabled,.vac-send-disabled svg{cursor:none!important;pointer-events:none!important;transform:none!important}@media only screen and (max-width: 768px){.vac-room-footer{width:100%}.vac-box-footer{padding:7px 2px 7px 7px}.vac-box-footer.vac-box-footer-border{border-top:var(--chat-border-style-input)}.vac-textarea{padding:7px;line-height:18px}.vac-textarea::placeholder{color:transparent}.vac-icon-textarea svg,.vac-icon-textarea .vac-wrapper,.vac-icon-textarea-left svg,.vac-icon-textarea-left .vac-wrapper{margin:0 5px!important}}.vac-emojis-container{width:calc(100% - 16px);padding:10px 8px;background:var(--chat-footer-bg-color);display:flex;align-items:center;overflow:auto}.vac-emojis-container .vac-emoji-element{padding:0 8px;font-size:30px;border-radius:4px;cursor:pointer;background:var(--chat-footer-bg-color-tag);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-emojis-container .vac-emoji-element-active{background:var(--chat-footer-bg-color-tag-active)}@media only screen and (max-width: 768px){.vac-emojis-container{width:calc(100% - 10px);padding:7px 5px}.vac-emojis-container .vac-emoji-element{padding:0 7px;font-size:26px}}.vac-reply-container{display:flex;padding:10px 10px 0;background:var(--chat-footer-bg-color);align-items:center;width:calc(100% - 20px)}.vac-reply-container .vac-reply-box{width:100%;overflow:hidden;background:var(--chat-footer-bg-color-reply);border-radius:4px;padding:8px 10px}.vac-reply-container .vac-reply-info{overflow:hidden}.vac-reply-container .vac-reply-username{color:var(--chat-message-color-reply-username);font-size:12px;line-height:15px;margin-bottom:2px}.vac-reply-container .vac-reply-content{font-size:12px;color:var(--chat-message-color-reply-content);white-space:pre-line}.vac-reply-container .vac-icon-reply{margin-left:10px}.vac-reply-container .vac-icon-reply svg{height:20px;width:20px}.vac-reply-container .vac-image-reply{max-height:100px;max-width:200px;margin:4px 10px 0 0;border-radius:4px}.vac-reply-container .vac-audio-reply{margin-right:10px}.vac-reply-container .vac-file-container{max-width:80px}@media only screen and (max-width: 768px){.vac-reply-container{padding:5px 8px;width:calc(100% - 16px)}}.vac-room-files-container{display:flex;align-items:center;padding:10px 6px 0;background:var(--chat-footer-bg-color)}.vac-room-files-container .vac-files-box{display:flex;overflow:auto;width:calc(100% - 30px)}.vac-room-files-container video{height:100px;border:var(--chat-border-style-input);border-radius:4px}.vac-room-files-container .vac-icon-close{margin-left:auto}.vac-room-files-container .vac-icon-close svg{height:20px;width:20px}@media only screen and (max-width: 768px){.vac-files-container{padding:6px 4px 4px 2px}}.vac-room-file-container{display:flex;position:relative;margin:0 4px}.vac-room-file-container .vac-message-image{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;height:100px;width:100px;border:var(--chat-border-style-input);border-radius:4px}.vac-room-file-container .vac-file-container{height:80px;width:80px}.vac-room-file-container .vac-icon-remove{position:absolute;top:6px;left:6px;z-index:10}.vac-room-file-container .vac-icon-remove svg{height:20px;width:20px;border-radius:50%}.vac-room-file-container .vac-icon-remove:before{content:" ";position:absolute;width:100%;height:100%;background:rgba(0,0,0,.5);border-radius:50%;z-index:-1}.vac-tags-container{display:flex;flex-direction:column;align-items:center;width:100%}.vac-tags-container .vac-tags-box{display:flex;width:100%;height:54px;overflow:hidden;cursor:pointer;background:var(--chat-footer-bg-color-tag);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-tags-container .vac-tags-box-active{background:var(--chat-footer-bg-color-tag-active)}.vac-tags-container .vac-tags-info{display:flex;overflow:hidden;padding:0 20px;align-items:center}.vac-tags-container .vac-tags-avatar{height:34px;width:34px;min-height:34px;min-width:34px}.vac-tags-container .vac-tags-username{font-size:14px}@media only screen and (max-width: 768px){.vac-tags-container .vac-tags-box{height:50px}.vac-tags-container .vac-tags-info{padding:0 12px}}.vac-template-container{display:flex;flex-direction:column;align-items:center;width:100%}.vac-template-container .vac-template-box{display:flex;width:100%;height:54px;overflow:hidden;cursor:pointer;background:var(--chat-footer-bg-color-tag);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-template-container .vac-template-active{background:var(--chat-footer-bg-color-tag-active)}.vac-template-container .vac-template-info{display:flex;overflow:hidden;padding:0 20px;align-items:center}.vac-template-container .vac-template-tag{font-size:14px;font-weight:700;margin-right:10px}.vac-template-container .vac-template-text{font-size:14px}@media only screen and (max-width: 768px){.vac-template-container .vac-template-box{height:50px}.vac-template-container .vac-template-info{padding:0 12px}}.vac-rooms-container{display:flex;flex-flow:column;flex:0 0 25%;min-width:260px;max-width:500px;position:relative;background:var(--chat-sidemenu-bg-color);height:100%;border-top-left-radius:var(--chat-container-border-radius);border-bottom-left-radius:var(--chat-container-border-radius)}.vac-rooms-container.vac-rooms-container-full{flex:0 0 100%;max-width:100%}.vac-rooms-container .vac-rooms-empty{font-size:14px;color:#9ca6af;font-style:italic;text-align:center;margin:40px 0;line-height:20px;white-space:pre-line}.vac-rooms-container .vac-room-list{flex:1;position:relative;max-width:100%;cursor:pointer;padding:0 10px 5px;overflow-y:auto}.vac-rooms-container .vac-room-item{border-radius:8px;align-items:center;display:flex;flex:1 1 100%;margin-bottom:5px;padding:0 14px;position:relative;min-height:71px;transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-rooms-container .vac-room-item:hover{background:var(--chat-sidemenu-bg-color-hover)}.vac-rooms-container .vac-room-selected{color:var(--chat-sidemenu-color-active)!important;background:var(--chat-sidemenu-bg-color-active)!important}.vac-rooms-container .vac-room-selected:hover{background:var(--chat-sidemenu-bg-color-active)!important}@media only screen and (max-width: 768px){.vac-rooms-container .vac-room-list{padding:0 7px 5px}.vac-rooms-container .vac-room-item{min-height:60px;padding:0 8px}}.vac-room-container{display:flex;flex:1;align-items:center;width:100%}.vac-room-container .vac-name-container{flex:1}.vac-room-container .vac-title-container{display:flex;align-items:center;line-height:25px}.vac-room-container .vac-state-circle{width:9px;height:9px;border-radius:50%;background-color:var(--chat-room-color-offline);margin-right:6px;transition:.3s}.vac-room-container .vac-state-online{background-color:var(--chat-room-color-online)}.vac-room-container .vac-room-name{flex:1;color:var(--chat-room-color-username);font-weight:500}.vac-room-container .vac-text-date{margin-left:5px;font-size:11px;color:var(--chat-room-color-timestamp)}.vac-room-container .vac-text-last{display:flex;align-items:center;font-size:12px;line-height:19px;color:var(--chat-room-color-message)}.vac-room-container .vac-message-new{color:var(--chat-room-color-username);font-weight:500}.vac-room-container .vac-icon-check{display:flex;vertical-align:middle;height:14px;width:14px;margin-top:-2px;margin-right:2px}.vac-room-container .vac-icon-microphone{height:15px;width:15px;vertical-align:middle;margin:-3px 1px 0 -2px;fill:var(--chat-room-color-message)}.vac-room-container .vac-room-options-container{display:flex;margin-left:auto}.vac-room-container .vac-room-badge{background-color:var(--chat-room-bg-color-badge);color:var(--chat-room-color-badge);margin-left:5px}.vac-room-container .vac-list-room-options{height:19px;width:19px;align-items:center;margin-left:5px}.vac-box-empty{margin-top:10px}@media only screen and (max-width: 768px){.vac-box-empty{margin-top:7px}}.vac-box-search{position:sticky;display:flex;align-items:center;height:64px;padding:0 15px}.vac-box-search .vac-icon-search{display:flex;position:absolute;left:30px}.vac-box-search .vac-icon-search svg{width:18px;height:18px}.vac-box-search .vac-input{height:38px;width:100%;background:var(--chat-bg-color-input);color:var(--chat-color);font-size:15px;outline:0;caret-color:var(--chat-color-caret);padding:10px 10px 10px 40px;border:1px solid var(--chat-sidemenu-border-color-search);border-radius:20px}.vac-box-search .vac-input::placeholder{color:var(--chat-color-placeholder)}.vac-box-search .vac-add-icon{margin-left:auto;padding-left:10px}@media only screen and (max-width: 768px){.vac-box-search{height:58px}}.vac-message-wrapper .vac-card-info{border-radius:4px;text-align:center;margin:10px auto;font-size:12px;padding:4px;display:block;overflow-wrap:break-word;position:relative;white-space:normal;box-shadow:0 1px 1px -1px #0000001a,0 1px 1px -1px #0000001c,0 1px 2px -1px #0000001c}.vac-message-wrapper .vac-card-date{max-width:150px;font-weight:500;text-transform:uppercase;color:var(--chat-message-color-date);background-color:var(--chat-message-bg-color-date)}.vac-message-wrapper .vac-card-system{max-width:250px;padding:8px 4px;color:var(--chat-message-color-system);background-color:var(--chat-message-bg-color-system)}.vac-message-wrapper .vac-line-new{color:var(--chat-message-color-new-messages);position:relative;text-align:center;font-size:13px;padding:10px 0}.vac-message-wrapper .vac-line-new:after,.vac-message-wrapper .vac-line-new:before{border-top:1px solid var(--chat-message-color-new-messages);content:"";left:0;position:absolute;top:50%;width:calc(50% - 60px)}.vac-message-wrapper .vac-line-new:before{left:auto;right:0}.vac-message-wrapper .vac-message-box{display:flex;flex:0 0 50%;max-width:50%;justify-content:flex-start;line-height:1.4}.vac-message-wrapper .vac-avatar{height:28px;width:28px;min-height:28px;min-width:28px;margin:0 0 2px;align-self:flex-end}.vac-message-wrapper .vac-avatar-current-offset{margin-right:28px}.vac-message-wrapper .vac-avatar-offset{margin-left:28px}.vac-message-wrapper .vac-failure-container{position:relative;align-self:flex-end;height:20px;width:20px;margin:0 0 2px -4px;border-radius:50%;background-color:#f44336}.vac-message-wrapper .vac-failure-container.vac-failure-container-avatar{margin-right:6px}.vac-message-wrapper .vac-failure-container .vac-failure-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:15px;font-weight:700}.vac-message-wrapper .vac-message-container{position:relative;padding:2px 10px;align-items:end;min-width:100px;box-sizing:content-box}.vac-message-wrapper .vac-message-container-offset{margin-top:10px}.vac-message-wrapper .vac-offset-current{margin-left:50%;justify-content:flex-end}.vac-message-wrapper .vac-message-card{background-color:var(--chat-message-bg-color);color:var(--chat-message-color);border-radius:8px;font-size:14px;padding:6px 9px 3px;white-space:pre-line;max-width:100%;-webkit-transition-property:box-shadow,opacity;transition-property:box-shadow,opacity;transition:box-shadow .28s cubic-bezier(.4,0,.2,1);will-change:box-shadow;box-shadow:0 1px 1px -1px #0000001a,0 1px 1px -1px #0000001c,0 1px 2px -1px #0000001c}.vac-message-wrapper .vac-message-highlight{box-shadow:0 1px 2px -1px #0000001a,0 1px 2px -1px #0000001c,0 1px 5px -1px #0000001c}.vac-message-wrapper .vac-message-deleted{color:var(--chat-message-color-deleted)!important;font-size:13px!important;font-style:italic!important;background-color:var(--chat-message-bg-color-deleted)!important}.vac-message-wrapper .vac-message-selected{background-color:var(--chat-message-bg-color-selected)!important;transition:background-color .2s}.vac-message-wrapper .vac-message-image{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;height:250px;width:250px;max-width:100%;border-radius:4px;margin:4px auto 5px;transition:.4s filter linear}.vac-message-wrapper .vac-text-username{font-size:13px;color:var(--chat-message-color-username);margin-bottom:2px}.vac-message-wrapper .vac-username-reply{margin-bottom:5px}.vac-message-wrapper .vac-text-timestamp{font-size:10px;color:var(--chat-message-color-timestamp);text-align:right}.vac-message-wrapper .vac-message-current{color:var(--chat-message-color-me)!important;background-color:var(--chat-message-bg-color-me)!important}.vac-message-wrapper .vac-message-current .vac-text-timestamp{color:var(--chat-message-color-timestamp-me)!important}.vac-message-wrapper .vac-progress-time{float:left;margin:-2px 0 0 40px;color:var(--chat-color);font-size:12px}.vac-message-wrapper .vac-icon-edited{-webkit-box-align:center;align-items:center;display:-webkit-inline-box;display:inline-flex;justify-content:center;letter-spacing:normal;line-height:1;text-indent:0;vertical-align:middle;margin:0 4px 2px}.vac-message-wrapper .vac-icon-edited svg{height:12px;width:12px}.vac-message-wrapper .vac-icon-check{height:14px;width:14px;vertical-align:middle;margin:-3px -3px 0 3px}@media only screen and (max-width: 768px){.vac-message-wrapper .vac-message-container{padding:2px 3px 1px}.vac-message-wrapper .vac-message-container-offset{margin-top:10px}.vac-message-wrapper .vac-message-box{flex:0 0 80%;max-width:80%}.vac-message-wrapper .vac-avatar{height:25px;width:25px;min-height:25px;min-width:25px;margin:0 6px 1px 0}.vac-message-wrapper .vac-avatar.vac-avatar-current{margin:0 0 1px 6px}.vac-message-wrapper .vac-avatar-current-offset{margin-right:31px}.vac-message-wrapper .vac-avatar-offset{margin-left:31px}.vac-message-wrapper .vac-failure-container{margin-left:2px}.vac-message-wrapper .vac-failure-container.vac-failure-container-avatar{margin-right:0}.vac-message-wrapper .vac-offset-current{margin-left:20%}.vac-message-wrapper .vac-progress-time{margin-left:37px}}.vac-audio-player{display:flex;margin:8px 0 5px}.vac-audio-player .vac-svg-button{max-width:18px;margin-left:7px}@media only screen and (max-width: 768px){.vac-audio-player{margin:4px 0 0}.vac-audio-player .vac-svg-button{max-width:16px;margin-left:5px}}.vac-player-bar{display:flex;align-items:center;max-width:calc(100% - 18px);margin-right:7px;margin-left:20px}.vac-player-bar .vac-player-progress{width:190px}.vac-player-bar .vac-player-progress .vac-line-container{position:relative;height:4px;border-radius:5px;background-color:var(--chat-message-bg-color-audio-line)}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-progress{position:absolute;height:inherit;background-color:var(--chat-message-bg-color-audio-progress);border-radius:inherit}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot{position:absolute;top:-5px;margin-left:-7px;height:14px;width:14px;border-radius:50%;background-color:var(--chat-message-bg-color-audio-progress-selector);transition:transform .25s}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot__active{transform:scale(1.2)}@media only screen and (max-width: 768px){.vac-player-bar{margin-right:5px}.vac-player-bar .vac-player-progress .vac-line-container{height:3px}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot{height:12px;width:12px;top:-5px;margin-left:-5px}}.vac-message-actions-wrapper .vac-options-container{position:absolute;top:2px;right:10px;height:40px;width:70px;overflow:hidden;border-top-right-radius:8px}.vac-message-actions-wrapper .vac-blur-container{position:absolute;height:100%;width:100%;left:8px;bottom:10px;background:var(--chat-message-bg-color);filter:blur(3px);border-bottom-left-radius:8px}.vac-message-actions-wrapper .vac-options-me{color:var(--chat-message-color-me);background:var(--chat-message-bg-color-me)}.vac-message-actions-wrapper .vac-message-options{background:var(--chat-icon-bg-dropdown-message);border-radius:50%;position:absolute;top:7px;right:7px}.vac-message-actions-wrapper .vac-message-options svg{height:17px;width:17px;padding:5px;margin:-5px}.vac-message-actions-wrapper .vac-message-emojis{position:absolute;top:6px;right:30px}.vac-message-actions-wrapper .vac-menu-options{right:15px}.vac-message-actions-wrapper .vac-menu-left{right:-118px}@media only screen and (max-width: 768px){.vac-message-actions-wrapper .vac-options-container{right:3px}.vac-message-actions-wrapper .vac-menu-left{right:-50px}}.vac-message-files-container .vac-file-wrapper{position:relative;width:fit-content}.vac-message-files-container .vac-file-wrapper .vac-file-container{height:60px;width:60px;margin:3px 0 5px;cursor:pointer;transition:all .6s}.vac-message-files-container .vac-file-wrapper .vac-file-container:hover{opacity:.85}.vac-message-files-container .vac-file-wrapper .vac-file-container svg{height:30px;width:30px}.vac-message-files-container .vac-file-wrapper .vac-file-container.vac-file-container-progress{background-color:#0000004d}.vac-message-file-container{position:relative;z-index:0}.vac-message-file-container .vac-message-image-container{cursor:pointer}.vac-message-file-container .vac-image-buttons{position:absolute;width:100%;height:100%;border-radius:4px;background:linear-gradient(to bottom,rgba(0,0,0,0) 55%,rgba(0,0,0,.02) 60%,rgba(0,0,0,.05) 65%,rgba(0,0,0,.1) 70%,rgba(0,0,0,.2) 75%,rgba(0,0,0,.3) 80%,rgba(0,0,0,.5) 85%,rgba(0,0,0,.6) 90%,rgba(0,0,0,.7) 95%,rgba(0,0,0,.8) 100%)}.vac-message-file-container .vac-image-buttons svg{height:26px;width:26px}.vac-message-file-container .vac-image-buttons .vac-button-view,.vac-message-file-container .vac-image-buttons .vac-button-download{position:absolute;bottom:6px;left:7px}.vac-message-file-container .vac-image-buttons :first-child{left:40px}.vac-message-file-container .vac-image-buttons .vac-button-view{max-width:18px;bottom:8px}.vac-message-file-container .vac-video-container{width:350px;max-width:100%;margin:4px auto 5px;cursor:pointer}.vac-message-file-container .vac-video-container video{width:100%;height:100%;border-radius:4px}.vac-button-reaction{display:inline-flex;align-items:center;border:var(--chat-message-border-style-reaction);outline:none;background:var(--chat-message-bg-color-reaction);border-radius:4px;margin:4px 2px 0;transition:.3s;padding:0 5px;font-size:18px;line-height:23px}.vac-button-reaction span{font-size:11px;font-weight:500;min-width:7px;color:var(--chat-message-color-reaction-counter)}.vac-button-reaction:hover{border:var(--chat-message-border-style-reaction-hover);background:var(--chat-message-bg-color-reaction-hover);cursor:pointer}.vac-button-reaction.vac-reaction-me{border:var(--chat-message-border-style-reaction-me);background:var(--chat-message-bg-color-reaction-me)}.vac-button-reaction.vac-reaction-me span{color:var(--chat-message-color-reaction-counter-me)}.vac-button-reaction.vac-reaction-me:hover{border:var(--chat-message-border-style-reaction-hover-me);background:var(--chat-message-bg-color-reaction-hover-me)}.vac-reply-message{background:var(--chat-message-bg-color-reply);border-radius:4px;margin:-1px -5px 8px;padding:8px 10px}.vac-reply-message .vac-reply-username{color:var(--chat-message-color-reply-username);font-size:12px;line-height:15px;margin-bottom:2px}.vac-reply-message .vac-image-reply-container{width:70px}.vac-reply-message .vac-image-reply-container .vac-message-image-reply{height:70px;width:70px;margin:4px auto 3px}.vac-reply-message .vac-video-reply-container{width:200px;max-width:100%}.vac-reply-message .vac-video-reply-container video{width:100%;height:100%;border-radius:4px}.vac-reply-message .vac-reply-content{font-size:12px;color:var(--chat-message-color-reply-content)}.vac-reply-message .vac-file-container{height:60px;width:60px}.vac-emoji-wrapper{position:relative;display:flex}.vac-emoji-wrapper .vac-emoji-reaction svg{height:19px;width:19px}.vac-emoji-wrapper .vac-emoji-picker{position:absolute;z-index:9999;bottom:32px;right:10px;width:300px;padding-top:4px;overflow:scroll;box-sizing:border-box;border-radius:.5rem;background:var(--chat-emoji-bg-color);box-shadow:0 1px 2px -2px #0000001a,0 1px 2px -1px #0000001a,0 1px 2px 1px #0000001a;scrollbar-width:none}.vac-emoji-wrapper .vac-emoji-picker::-webkit-scrollbar{display:none}.vac-emoji-wrapper .vac-emoji-picker.vac-picker-reaction{position:fixed;top:initial;right:initial}.vac-emoji-wrapper .vac-emoji-picker emoji-picker{height:100%;width:100%;--emoji-size: 1.2rem;--background: var(--chat-emoji-bg-color);--emoji-padding: .4rem;--border-color: var(--chat-sidemenu-border-color-search);--button-hover-background: var(--chat-sidemenu-bg-color-hover);--button-active-background: var(--chat-sidemenu-bg-color-hover)}.vac-format-message-wrapper .vac-format-container{display:inline}.vac-format-message-wrapper .vac-icon-deleted{height:14px;width:14px;vertical-align:middle;margin:-2px 2px 0 0;fill:var(--chat-message-color-deleted)}.vac-format-message-wrapper .vac-icon-deleted.vac-icon-deleted-room{margin:-3px 1px 0 0;fill:var(--chat-room-color-message)}.vac-format-message-wrapper .vac-image-link-container{background-color:var(--chat-message-bg-color-media);padding:8px;margin:2px auto;border-radius:4px}.vac-format-message-wrapper .vac-image-link{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:contain;background-position:center center!important;background-repeat:no-repeat!important;height:150px;width:150px;max-width:100%;border-radius:4px;margin:0 auto}.vac-format-message-wrapper .vac-image-link-message{max-width:166px;font-size:12px}.vac-loader-wrapper.vac-container-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9}.vac-loader-wrapper.vac-container-top{padding:21px}.vac-loader-wrapper.vac-container-top #vac-circle{height:20px;width:20px}.vac-loader-wrapper #vac-circle{margin:auto;height:28px;width:28px;border:3px rgba(0,0,0,.25) solid;border-top:3px var(--chat-color-spinner) solid;border-right:3px var(--chat-color-spinner) solid;border-bottom:3px var(--chat-color-spinner) solid;border-radius:50%;-webkit-animation:vac-spin 1s infinite linear;animation:vac-spin 1s infinite linear}@media only screen and (max-width: 768px){.vac-loader-wrapper #vac-circle{height:24px;width:24px}.vac-loader-wrapper.vac-container-top{padding:18px}.vac-loader-wrapper.vac-container-top #vac-circle{height:16px;width:16px}}@-webkit-keyframes vac-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes vac-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}#vac-icon-search{fill:var(--chat-icon-color-search)}#vac-icon-add{fill:var(--chat-icon-color-add)}#vac-icon-toggle{fill:var(--chat-icon-color-toggle)}#vac-icon-menu{fill:var(--chat-icon-color-menu)}#vac-icon-close{fill:var(--chat-icon-color-close)}#vac-icon-close-image{fill:var(--chat-icon-color-close-image)}#vac-icon-file{fill:var(--chat-icon-color-file)}#vac-icon-paperclip{fill:var(--chat-icon-color-paperclip)}#vac-icon-close-outline{fill:var(--chat-icon-color-close-outline)}#vac-icon-close-outline-preview{fill:var(--chat-icon-color-close-preview)}#vac-icon-send{fill:var(--chat-icon-color-send)}#vac-icon-send-disabled{fill:var(--chat-icon-color-send-disabled)}#vac-icon-emoji{fill:var(--chat-icon-color-emoji)}#vac-icon-emoji-reaction{fill:var(--chat-icon-color-emoji-reaction)}#vac-icon-document{fill:var(--chat-icon-color-document)}#vac-icon-pencil{fill:var(--chat-icon-color-pencil)}#vac-icon-checkmark,#vac-icon-double-checkmark{fill:var(--chat-icon-color-checkmark)}#vac-icon-checkmark-seen,#vac-icon-double-checkmark-seen{fill:var(--chat-icon-color-checkmark-seen)}#vac-icon-eye{fill:var(--chat-icon-color-eye)}#vac-icon-dropdown-message{fill:var(--chat-icon-color-dropdown-message)}#vac-icon-dropdown-room{fill:var(--chat-icon-color-dropdown-room)}#vac-icon-dropdown-scroll{fill:var(--chat-icon-color-dropdown-scroll)}#vac-icon-audio-play{fill:var(--chat-icon-color-audio-play)}#vac-icon-audio-pause{fill:var(--chat-icon-color-audio-pause)}.vac-progress-wrapper{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9}.vac-progress-wrapper circle{transition:stroke-dashoffset .35s;transform:rotate(-90deg);transform-origin:50% 50%}.vac-progress-wrapper .vac-progress-content{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:-1;margin-top:-2px;background-color:#000000b3;border-radius:50%}.vac-progress-wrapper .vac-progress-content .vac-progress-text{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-weight:700;color:#fff}.vac-progress-wrapper .vac-progress-content .vac-progress-text .vac-progress-pourcent{font-size:9px;font-weight:400}\n';
const _sfc_main = {
  name: "ChatContainer",
  components: {
    RoomsList,
    Room,
    MediaPreview
  },
  props: {
    height: { type: String, default: "600px" },
    theme: { type: String, default: "light" },
    styles: { type: [Object, String], default: () => ({}) },
    responsiveBreakpoint: { type: Number, default: 900 },
    singleRoom: { type: [Boolean, String], default: false },
    roomsListOpened: { type: [Boolean, String], default: true },
    textMessages: { type: [Object, String], default: () => ({}) },
    currentUserId: { type: String, default: "" },
    rooms: { type: [Array, String], default: () => [] },
    roomsOrder: { type: String, default: "desc" },
    loadingRooms: { type: [Boolean, String], default: false },
    roomsLoaded: { type: [Boolean, String], default: false },
    roomId: { type: String, default: null },
    loadFirstRoom: { type: [Boolean, String], default: true },
    messages: { type: [Array, String], default: () => [] },
    messagesLoaded: { type: [Boolean, String], default: false },
    roomActions: { type: [Array, String], default: () => [] },
    menuActions: { type: [Array, String], default: () => [] },
    messageActions: {
      type: [Array, String],
      default: () => [
        { name: "replyMessage", title: "Reply" },
        { name: "editMessage", title: "Edit Message", onlyMe: true },
        { name: "deleteMessage", title: "Delete Message", onlyMe: true },
        { name: "selectMessages", title: "Select" }
      ]
    },
    messageSelectionActions: { type: [Array, String], default: () => [] },
    autoScroll: {
      type: [Object, String],
      default: () => {
        return {
          send: {
            new: true,
            newAfterScrollUp: true
          },
          receive: {
            new: true,
            newAfterScrollUp: false
          }
        };
      }
    },
    customSearchRoomEnabled: { type: [Boolean, String], default: false },
    showSearch: { type: [Boolean, String], default: true },
    showAddRoom: { type: [Boolean, String], default: true },
    showSendIcon: { type: [Boolean, String], default: true },
    showFiles: { type: [Boolean, String], default: true },
    showAudio: { type: [Boolean, String], default: true },
    audioBitRate: { type: Number, default: 128 },
    audioSampleRate: { type: Number, default: 44100 },
    showEmojis: { type: [Boolean, String], default: true },
    showReactionEmojis: { type: [Boolean, String], default: true },
    showNewMessagesDivider: { type: [Boolean, String], default: true },
    showFooter: { type: [Boolean, String], default: true },
    textFormatting: {
      type: [Object, String],
      default: () => ({
        disabled: false,
        italic: "_",
        bold: "*",
        strike: "~",
        underline: "\xB0",
        multilineCode: "```",
        inlineCode: "`"
      })
    },
    linkOptions: {
      type: [Object, String],
      default: () => ({ disabled: false, target: "_blank", rel: null })
    },
    roomInfoEnabled: { type: [Boolean, String], default: false },
    textareaActionEnabled: { type: [Boolean, String], default: false },
    textareaAutoFocus: { type: [Boolean, String], default: true },
    userTagsEnabled: { type: [Boolean, String], default: true },
    emojisSuggestionEnabled: { type: [Boolean, String], default: true },
    roomMessage: { type: String, default: "" },
    scrollDistance: { type: Number, default: 60 },
    acceptedFiles: { type: String, default: "*" },
    templatesText: { type: [Array, String], default: () => [] },
    mediaPreviewEnabled: { type: [Boolean, String], default: true },
    usernameOptions: {
      type: [Object, String],
      default: () => ({ minUsers: 3, currentUser: false })
    }
  },
  emits: [
    "toggle-rooms-list",
    "room-info",
    "fetch-messages",
    "send-message",
    "edit-message",
    "delete-message",
    "open-file",
    "open-user-tag",
    "open-failed-message",
    "menu-action-handler",
    "message-action-handler",
    "send-message-reaction",
    "typing-message",
    "textarea-action-handler",
    "fetch-more-rooms",
    "add-room",
    "search-room",
    "room-action-handler",
    "message-selection-action-handler"
  ],
  data() {
    return {
      slots: [],
      room: {},
      loadingMoreRooms: false,
      showRoomsList: true,
      isMobile: false,
      showMediaPreview: false,
      previewFile: {}
    };
  },
  computed: {
    t() {
      return {
        ...locales,
        ...this.textMessagesCasted
      };
    },
    cssVars() {
      const defaultStyles = defaultThemeStyles[this.theme];
      const customStyles = {};
      Object.keys(defaultStyles).map((key) => {
        customStyles[key] = {
          ...defaultStyles[key],
          ...this.stylesCasted[key] || {}
        };
      });
      return cssThemeVars(customStyles);
    },
    orderedRooms() {
      return this.roomsCasted.slice().sort((a, b) => {
        const aVal = a.index || 0;
        const bVal = b.index || 0;
        if (this.roomsOrder === "asc") {
          return aVal < bVal ? -1 : bVal < aVal ? 1 : 0;
        }
        return aVal > bVal ? -1 : bVal > aVal ? 1 : 0;
      });
    },
    singleRoomCasted() {
      return this.castBoolean(this.singleRoom);
    },
    roomsListOpenedCasted() {
      return this.castBoolean(this.roomsListOpened);
    },
    loadingRoomsCasted() {
      return this.castBoolean(this.loadingRooms);
    },
    roomsLoadedCasted() {
      return this.castBoolean(this.roomsLoaded);
    },
    loadFirstRoomCasted() {
      return this.castBoolean(this.loadFirstRoom);
    },
    messagesLoadedCasted() {
      return this.castBoolean(this.messagesLoaded);
    },
    showSearchCasted() {
      return this.castBoolean(this.showSearch);
    },
    showAddRoomCasted() {
      return this.castBoolean(this.showAddRoom);
    },
    showSendIconCasted() {
      return this.castBoolean(this.showSendIcon);
    },
    showFilesCasted() {
      return this.castBoolean(this.showFiles);
    },
    showAudioCasted() {
      return this.castBoolean(this.showAudio);
    },
    showEmojisCasted() {
      return this.castBoolean(this.showEmojis);
    },
    showReactionEmojisCasted() {
      return this.castBoolean(this.showReactionEmojis);
    },
    showNewMessagesDividerCasted() {
      return this.castBoolean(this.showNewMessagesDivider);
    },
    showFooterCasted() {
      return this.castBoolean(this.showFooter);
    },
    roomInfoEnabledCasted() {
      return this.castBoolean(this.roomInfoEnabled);
    },
    textareaActionEnabledCasted() {
      return this.castBoolean(this.textareaActionEnabled);
    },
    textareaAutoFocusCasted() {
      return this.castBoolean(this.textareaAutoFocus);
    },
    userTagsEnabledCasted() {
      return this.castBoolean(this.userTagsEnabled);
    },
    emojisSuggestionEnabledCasted() {
      return this.castBoolean(this.emojisSuggestionEnabled);
    },
    mediaPreviewEnabledCasted() {
      return this.castBoolean(this.mediaPreviewEnabled);
    },
    roomsCasted() {
      return this.castArray(this.rooms);
    },
    messagesCasted() {
      return this.castArray(this.messages);
    },
    roomActionsCasted() {
      return this.castArray(this.roomActions);
    },
    menuActionsCasted() {
      return this.castArray(this.menuActions);
    },
    messageActionsCasted() {
      return this.castArray(this.messageActions);
    },
    messageSelectionActionsCasted() {
      return this.castArray(this.messageSelectionActions);
    },
    templatesTextCasted() {
      return this.castArray(this.templatesText);
    },
    stylesCasted() {
      return this.castObject(this.styles);
    },
    textMessagesCasted() {
      return this.castObject(this.textMessages);
    },
    autoScrollCasted() {
      return this.castObject(this.autoScroll);
    },
    textFormattingCasted() {
      return this.castObject(this.textFormatting);
    },
    linkOptionsCasted() {
      return this.castObject(this.linkOptions);
    },
    usernameOptionsCasted() {
      return this.castObject(this.usernameOptions);
    }
  },
  watch: {
    roomsCasted: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (!newVal[0] || !newVal.find((room) => room.roomId === this.room.roomId)) {
          this.showRoomsList = true;
        }
        if (!this.loadingMoreRooms && this.loadFirstRoomCasted && newVal[0] && (!oldVal || newVal.length !== oldVal.length)) {
          if (this.roomId) {
            const room = newVal.find((r) => r.roomId === this.roomId) || {};
            this.fetchRoom({ room });
          } else if (!this.isMobile || this.singleRoomCasted) {
            this.fetchRoom({ room: this.orderedRooms[0] });
          } else {
            this.showRoomsList = true;
          }
        }
      }
    },
    loadingRoomsCasted(val) {
      if (val)
        this.room = {};
    },
    roomId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && !this.loadingRoomsCasted && this.roomsCasted.length) {
          const room = this.roomsCasted.find((r) => r.roomId === newVal);
          this.fetchRoom({ room });
        } else if (oldVal && !newVal) {
          this.room = {};
        }
      }
    },
    room(val) {
      if (!val || Object.entries(val).length === 0)
        return;
      roomsValidation(val);
      val.users.forEach((user) => {
        partcipantsValidation(user);
      });
    },
    roomsListOpenedCasted: {
      immediate: true,
      handler(val) {
        this.showRoomsList = val;
      }
    }
  },
  created() {
    this.updateResponsive();
    window.addEventListener("resize", (ev) => {
      if (ev.isTrusted)
        this.updateResponsive();
    });
  },
  updated() {
    const slots = document.querySelectorAll("[slot]");
    if (this.slots.length !== slots.length) {
      this.slots = slots;
    }
  },
  methods: {
    castBoolean(val) {
      return val === "true" || val === true;
    },
    castArray(val) {
      return !val ? [] : Array.isArray(val) ? val : JSON.parse(val);
    },
    castObject(val) {
      return !val ? {} : typeof val === "object" ? val : JSON.parse(val);
    },
    updateResponsive() {
      this.isMobile = window.innerWidth < Number(this.responsiveBreakpoint);
    },
    toggleRoomsList() {
      this.showRoomsList = !this.showRoomsList;
      if (this.isMobile)
        this.room = {};
      this.$emit("toggle-rooms-list", { opened: this.showRoomsList });
    },
    fetchRoom({ room }) {
      this.room = room;
      this.fetchMessages({ reset: true });
      if (this.isMobile)
        this.showRoomsList = false;
    },
    fetchMoreRooms() {
      this.$emit("fetch-more-rooms");
    },
    roomInfo() {
      this.$emit("room-info", this.room);
    },
    addRoom() {
      this.$emit("add-room");
    },
    searchRoom(val) {
      this.$emit("search-room", { value: val, roomId: this.room.roomId });
    },
    fetchMessages(options2) {
      this.$emit("fetch-messages", { room: this.room, options: options2 });
    },
    sendMessage(message) {
      this.$emit("send-message", { ...message, roomId: this.room.roomId });
    },
    editMessage(message) {
      this.$emit("edit-message", { ...message, roomId: this.room.roomId });
    },
    deleteMessage(message) {
      this.$emit("delete-message", { message, roomId: this.room.roomId });
    },
    openFile({ message, file }) {
      if (this.mediaPreviewEnabledCasted && file.action === "preview") {
        this.previewFile = file.file;
        this.showMediaPreview = true;
      } else {
        this.$emit("open-file", { message, file });
      }
    },
    openUserTag({ user }) {
      this.$emit("open-user-tag", { user });
    },
    openFailedMessage({ message }) {
      this.$emit("open-failed-message", {
        message,
        roomId: this.room.roomId
      });
    },
    menuActionHandler(ev) {
      this.$emit("menu-action-handler", {
        action: ev,
        roomId: this.room.roomId
      });
    },
    roomActionHandler({ action, roomId }) {
      this.$emit("room-action-handler", {
        action,
        roomId
      });
    },
    messageActionHandler(ev) {
      this.$emit("message-action-handler", {
        ...ev,
        roomId: this.room.roomId
      });
    },
    messageSelectionActionHandler(ev) {
      this.$emit("message-selection-action-handler", {
        ...ev,
        roomId: this.room.roomId
      });
    },
    sendMessageReaction(messageReaction) {
      this.$emit("send-message-reaction", {
        ...messageReaction,
        roomId: this.room.roomId
      });
    },
    typingMessage(message) {
      this.$emit("typing-message", {
        message,
        roomId: this.room.roomId
      });
    },
    textareaActionHandler(message) {
      this.$emit("textarea-action-handler", {
        message,
        roomId: this.room.roomId
      });
    }
  }
};
const _hoisted_1 = { class: "vac-chat-container" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_rooms_list = resolveComponent("rooms-list");
  const _component_room = resolveComponent("room");
  const _component_media_preview = resolveComponent("media-preview");
  return openBlock(), createElementBlock("div", {
    class: "vac-card-window",
    style: normalizeStyle([{ height: $props.height }, $options.cssVars])
  }, [
    createBaseVNode("div", _hoisted_1, [
      !$options.singleRoomCasted ? (openBlock(), createBlock(_component_rooms_list, {
        key: 0,
        "current-user-id": $props.currentUserId,
        rooms: $options.orderedRooms,
        "loading-rooms": $options.loadingRoomsCasted,
        "rooms-loaded": $options.roomsLoadedCasted,
        room: $data.room,
        "room-actions": $options.roomActionsCasted,
        "custom-search-room-enabled": $props.customSearchRoomEnabled,
        "text-messages": $options.t,
        "show-search": $options.showSearchCasted,
        "show-add-room": $options.showAddRoomCasted,
        "show-rooms-list": $data.showRoomsList && $options.roomsListOpenedCasted,
        "text-formatting": $options.textFormattingCasted,
        "link-options": $options.linkOptionsCasted,
        "is-mobile": $data.isMobile,
        "scroll-distance": $props.scrollDistance,
        onFetchRoom: $options.fetchRoom,
        onFetchMoreRooms: $options.fetchMoreRooms,
        onLoadingMoreRooms: _cache[0] || (_cache[0] = ($event) => $data.loadingMoreRooms = $event),
        onAddRoom: $options.addRoom,
        onSearchRoom: $options.searchRoom,
        onRoomActionHandler: $options.roomActionHandler
      }, createSlots({ _: 2 }, [
        renderList($data.slots, (el) => {
          return {
            name: el.slot,
            fn: withCtx((data2) => [
              renderSlot(_ctx.$slots, el.slot, normalizeProps(guardReactiveProps(data2)))
            ])
          };
        })
      ]), 1032, ["current-user-id", "rooms", "loading-rooms", "rooms-loaded", "room", "room-actions", "custom-search-room-enabled", "text-messages", "show-search", "show-add-room", "show-rooms-list", "text-formatting", "link-options", "is-mobile", "scroll-distance", "onFetchRoom", "onFetchMoreRooms", "onAddRoom", "onSearchRoom", "onRoomActionHandler"])) : createCommentVNode("", true),
      createVNode(_component_room, {
        "current-user-id": $props.currentUserId,
        rooms: $options.roomsCasted,
        "room-id": $data.room.roomId || "",
        "load-first-room": $options.loadFirstRoomCasted,
        messages: $options.messagesCasted,
        "room-message": $props.roomMessage,
        "messages-loaded": $options.messagesLoadedCasted,
        "menu-actions": $options.menuActionsCasted,
        "message-actions": $options.messageActionsCasted,
        "message-selection-actions": $options.messageSelectionActionsCasted,
        "auto-scroll": $options.autoScrollCasted,
        "show-send-icon": $options.showSendIconCasted,
        "show-files": $options.showFilesCasted,
        "show-audio": $options.showAudioCasted,
        "audio-bit-rate": $props.audioBitRate,
        "audio-sample-rate": $props.audioSampleRate,
        "show-emojis": $options.showEmojisCasted,
        "show-reaction-emojis": $options.showReactionEmojisCasted,
        "show-new-messages-divider": $options.showNewMessagesDividerCasted,
        "show-footer": $options.showFooterCasted,
        "text-messages": $options.t,
        "single-room": $options.singleRoomCasted,
        "show-rooms-list": $data.showRoomsList && $options.roomsListOpenedCasted,
        "text-formatting": $options.textFormattingCasted,
        "link-options": $options.linkOptionsCasted,
        "is-mobile": $data.isMobile,
        "loading-rooms": $options.loadingRoomsCasted,
        "room-info-enabled": $options.roomInfoEnabledCasted,
        "textarea-action-enabled": $options.textareaActionEnabledCasted,
        "textarea-auto-focus": $options.textareaAutoFocusCasted,
        "user-tags-enabled": $options.userTagsEnabledCasted,
        "emojis-suggestion-enabled": $options.emojisSuggestionEnabledCasted,
        "scroll-distance": $props.scrollDistance,
        "accepted-files": $props.acceptedFiles,
        "templates-text": $options.templatesTextCasted,
        "username-options": $options.usernameOptionsCasted,
        onToggleRoomsList: $options.toggleRoomsList,
        onRoomInfo: $options.roomInfo,
        onFetchMessages: $options.fetchMessages,
        onSendMessage: $options.sendMessage,
        onEditMessage: $options.editMessage,
        onDeleteMessage: $options.deleteMessage,
        onOpenFile: $options.openFile,
        onOpenUserTag: $options.openUserTag,
        onOpenFailedMessage: $options.openFailedMessage,
        onMenuActionHandler: $options.menuActionHandler,
        onMessageActionHandler: $options.messageActionHandler,
        onMessageSelectionActionHandler: $options.messageSelectionActionHandler,
        onSendMessageReaction: $options.sendMessageReaction,
        onTypingMessage: $options.typingMessage,
        onTextareaActionHandler: $options.textareaActionHandler
      }, createSlots({ _: 2 }, [
        renderList($data.slots, (el) => {
          return {
            name: el.slot,
            fn: withCtx((data2) => [
              renderSlot(_ctx.$slots, el.slot, normalizeProps(guardReactiveProps(data2)))
            ])
          };
        })
      ]), 1032, ["current-user-id", "rooms", "room-id", "load-first-room", "messages", "room-message", "messages-loaded", "menu-actions", "message-actions", "message-selection-actions", "auto-scroll", "show-send-icon", "show-files", "show-audio", "audio-bit-rate", "audio-sample-rate", "show-emojis", "show-reaction-emojis", "show-new-messages-divider", "show-footer", "text-messages", "single-room", "show-rooms-list", "text-formatting", "link-options", "is-mobile", "loading-rooms", "room-info-enabled", "textarea-action-enabled", "textarea-auto-focus", "user-tags-enabled", "emojis-suggestion-enabled", "scroll-distance", "accepted-files", "templates-text", "username-options", "onToggleRoomsList", "onRoomInfo", "onFetchMessages", "onSendMessage", "onEditMessage", "onDeleteMessage", "onOpenFile", "onOpenUserTag", "onOpenFailedMessage", "onMenuActionHandler", "onMessageActionHandler", "onMessageSelectionActionHandler", "onSendMessageReaction", "onTypingMessage", "onTextareaActionHandler"])
    ]),
    createVNode(Transition, {
      name: "vac-fade-preview",
      appear: ""
    }, {
      default: withCtx(() => [
        $data.showMediaPreview ? (openBlock(), createBlock(_component_media_preview, {
          key: 0,
          file: $data.previewFile,
          onCloseMediaPreview: _cache[1] || (_cache[1] = ($event) => $data.showMediaPreview = false)
        }, createSlots({ _: 2 }, [
          renderList($data.slots, (el) => {
            return {
              name: el.slot,
              fn: withCtx((data2) => [
                renderSlot(_ctx.$slots, el.slot, normalizeProps(guardReactiveProps(data2)))
              ])
            };
          })
        ]), 1032, ["file"])) : createCommentVNode("", true)
      ]),
      _: 3
    })
  ], 4);
}
var ChatWindow = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
const VueAdvancedChat = defineCustomElement(ChatWindow);
const PACKAGE_NAME = "vue-advanced-chat";
function register() {
  if (!customElements.get(PACKAGE_NAME)) {
    customElements.define(PACKAGE_NAME, VueAdvancedChat);
  }
}
var getBlobDuration$1 = {};
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var interopRequireDefault = _interopRequireDefault;
var runtime = { exports: {} };
(function(module) {
  var runtime2 = function(exports) {
    var Op = Object.prototype;
    var hasOwn2 = Op.hasOwnProperty;
    var defineProperty = Object.defineProperty || function(obj, key, desc) {
      obj[key] = desc.value;
    };
    var undefined$1;
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self2, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);
      defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self2, context) });
      return generator;
    }
    exports.wrap = wrap;
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
    var ContinueSentinel = {};
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function() {
      return this;
    });
    var getProto2 = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto2 && getProto2(getProto2(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn2.call(NativeIteratorPrototype, iteratorSymbol)) {
      IteratorPrototype = NativeIteratorPrototype;
    }
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
    defineProperty(
      GeneratorFunctionPrototype,
      "constructor",
      { value: GeneratorFunction, configurable: true }
    );
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }
    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
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
    exports.awrap = function(arg) {
      return { __await: arg };
    };
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve3, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && typeof value === "object" && hasOwn2.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value2) {
              invoke("next", value2, resolve3, reject);
            }, function(err) {
              invoke("throw", err, resolve3, reject);
            });
          }
          return PromiseImpl.resolve(value).then(function(unwrapped) {
            result.value = unwrapped;
            resolve3(result);
          }, function(error) {
            return invoke("throw", error, resolve3, reject);
          });
        }
      }
      var previousPromise;
      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve3, reject) {
            invoke(method, arg, resolve3, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
      }
      defineProperty(this, "_invoke", { value: enqueue });
    }
    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;
    exports.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0)
        PromiseImpl = Promise;
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self2, tryLocsList),
        PromiseImpl
      );
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
        return result.done ? result.value : iter.next();
      });
    };
    function makeInvokeMethod(innerFn, self2, context) {
      var state2 = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state2 === GenStateExecuting) {
          throw new Error("Generator is already running");
        }
        if (state2 === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }
          return doneResult();
        }
        context.method = method;
        context.arg = arg;
        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel)
                continue;
              return delegateResult;
            }
          }
          if (context.method === "next") {
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state2 === GenStateSuspendedStart) {
              state2 = GenStateCompleted;
              throw context.arg;
            }
            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }
          state2 = GenStateExecuting;
          var record = tryCatch(innerFn, self2, context);
          if (record.type === "normal") {
            state2 = context.done ? GenStateCompleted : GenStateSuspendedYield;
            if (record.arg === ContinueSentinel) {
              continue;
            }
            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state2 = GenStateCompleted;
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        context.delegate = null;
        if (context.method === "throw") {
          if (delegate.iterator["return"]) {
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);
            if (context.method === "throw") {
              return ContinueSentinel;
            }
          }
          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method"
          );
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
      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }
      if (info.done) {
        context[delegate.resultName] = info.value;
        context.next = delegate.nextLoc;
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        return info;
      }
      context.delegate = null;
      return ContinueSentinel;
    }
    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator");
    define(Gp, iteratorSymbol, function() {
      return this;
    });
    define(Gp, "toString", function() {
      return "[object Generator]";
    });
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
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }
    exports.keys = function(val) {
      var object = Object(val);
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();
      return function next2() {
        while (keys.length) {
          var key2 = keys.pop();
          if (key2 in object) {
            next2.value = key2;
            next2.done = false;
            return next2;
          }
        }
        next2.done = true;
        return next2;
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
          var i = -1, next2 = function next3() {
            while (++i < iterable.length) {
              if (hasOwn2.call(iterable, i)) {
                next3.value = iterable[i];
                next3.done = false;
                return next3;
              }
            }
            next3.value = undefined$1;
            next3.done = true;
            return next3;
          };
          return next2.next = next2;
        }
      }
      return { next: doneResult };
    }
    exports.values = values;
    function doneResult() {
      return { value: undefined$1, done: true };
    }
    Context.prototype = {
      constructor: Context,
      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);
        if (!skipTempReset) {
          for (var name in this) {
            if (name.charAt(0) === "t" && hasOwn2.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
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
            context.method = "next";
            context.arg = undefined$1;
          }
          return !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;
          if (entry.tryLoc === "root") {
            return handle("end");
          }
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn2.call(entry, "catchLoc");
            var hasFinally = hasOwn2.call(entry, "finallyLoc");
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
          if (entry.tryLoc <= this.prev && hasOwn2.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
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
        if (record.type === "break" || record.type === "continue") {
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
        throw new Error("illegal catch attempt");
      },
      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName,
          nextLoc
        };
        if (this.method === "next") {
          this.arg = undefined$1;
        }
        return ContinueSentinel;
      }
    };
    return exports;
  }(
    module.exports
  );
  try {
    regeneratorRuntime = runtime2;
  } catch (accidentalStrictMode) {
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime2;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime2);
    }
  }
})(runtime);
var regenerator = runtime.exports;
function asyncGeneratorStep(gen, resolve3, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve3(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function() {
    var self2 = this, args = arguments;
    return new Promise(function(resolve3, reject) {
      var gen = fn.apply(self2, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve3, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve3, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
var asyncToGenerator = _asyncToGenerator;
(function(exports) {
  var _interopRequireDefault2 = interopRequireDefault;
  Object.defineProperty(exports, "__esModule", { value: true }), exports.default = getBlobDuration2;
  var _regenerator = _interopRequireDefault2(regenerator), _asyncToGenerator2 = _interopRequireDefault2(asyncToGenerator);
  function getBlobDuration2(e) {
    return _getBlobDuration.apply(this, arguments);
  }
  function _getBlobDuration() {
    return (_getBlobDuration = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function e(r) {
      var t, n;
      return _regenerator.default.wrap(function(e2) {
        for (; ; )
          switch (e2.prev = e2.next) {
            case 0:
              return t = document.createElement("video"), n = new Promise(function(e3, r2) {
                t.addEventListener("loadedmetadata", function() {
                  t.duration === 1 / 0 ? (t.currentTime = Number.MAX_SAFE_INTEGER, t.ontimeupdate = function() {
                    t.ontimeupdate = null, e3(t.duration), t.currentTime = 0;
                  }) : e3(t.duration);
                }), t.onerror = function(e4) {
                  return r2(e4.target.error);
                };
              }), t.src = "string" == typeof r || r instanceof String ? r : window.URL.createObjectURL(r), e2.abrupt("return", n);
            case 4:
            case "end":
              return e2.stop();
          }
      }, e);
    }))).apply(this, arguments);
  }
})(getBlobDuration$1);
var getBlobDuration = /* @__PURE__ */ getDefaultExportFromCjs(getBlobDuration$1);
const successResponse = () => ({ value: true });
const failureResponse = () => ({ value: false });
const missingPermissionError = () => new Error("MISSING_PERMISSION");
const alreadyRecordingError = () => new Error("ALREADY_RECORDING");
const deviceCannotVoiceRecordError = () => new Error("DEVICE_CANNOT_VOICE_RECORD");
const failedToRecordError = () => new Error("FAILED_TO_RECORD");
const recordingHasNotStartedError = () => new Error("RECORDING_HAS_NOT_STARTED");
const failedToFetchRecordingError = () => new Error("FAILED_TO_FETCH_RECORDING");
const couldNotQueryPermissionStatusError = () => new Error("COULD_NOT_QUERY_PERMISSION_STATUS");
const possibleMimeTypes = ["audio/aac", "audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg;codecs=opus"];
const neverResolvingPromise = () => new Promise(() => void 0);
class VoiceRecorderImpl {
  constructor() {
    this.mediaRecorder = null;
    this.chunks = [];
    this.pendingResult = neverResolvingPromise();
  }
  static async canDeviceVoiceRecord() {
    var _a;
    if (((_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia) == null || VoiceRecorderImpl.getSupportedMimeType() == null) {
      return failureResponse();
    } else {
      return successResponse();
    }
  }
  async startRecording() {
    if (this.mediaRecorder != null) {
      throw alreadyRecordingError();
    }
    const deviceCanRecord = await VoiceRecorderImpl.canDeviceVoiceRecord();
    if (!deviceCanRecord.value) {
      throw deviceCannotVoiceRecordError();
    }
    const havingPermission = await VoiceRecorderImpl.hasAudioRecordingPermission().catch(() => successResponse());
    if (!havingPermission.value) {
      throw missingPermissionError();
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(this.onSuccessfullyStartedRecording.bind(this)).catch(this.onFailedToStartRecording.bind(this));
    return successResponse();
  }
  async stopRecording() {
    if (this.mediaRecorder == null) {
      throw recordingHasNotStartedError();
    }
    try {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track2) => track2.stop());
      return this.pendingResult;
    } catch (ignore) {
      throw failedToFetchRecordingError();
    } finally {
      this.prepareInstanceForNextOperation();
    }
  }
  static async hasAudioRecordingPermission() {
    return navigator.permissions.query({ name: "microphone" }).then((result) => ({ value: result.state === "granted" })).catch(() => {
      throw couldNotQueryPermissionStatusError();
    });
  }
  static async requestAudioRecordingPermission() {
    const havingPermission = await VoiceRecorderImpl.hasAudioRecordingPermission().catch(() => failureResponse());
    if (havingPermission.value) {
      return successResponse();
    }
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(() => successResponse()).catch(() => failureResponse());
  }
  pauseRecording() {
    if (this.mediaRecorder == null) {
      throw recordingHasNotStartedError();
    } else if (this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
      return Promise.resolve(successResponse());
    } else {
      return Promise.resolve(failureResponse());
    }
  }
  resumeRecording() {
    if (this.mediaRecorder == null) {
      throw recordingHasNotStartedError();
    } else if (this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
      return Promise.resolve(successResponse());
    } else {
      return Promise.resolve(failureResponse());
    }
  }
  getCurrentStatus() {
    if (this.mediaRecorder == null) {
      return Promise.resolve({ status: "NONE" });
    } else if (this.mediaRecorder.state === "recording") {
      return Promise.resolve({ status: "RECORDING" });
    } else if (this.mediaRecorder.state === "paused") {
      return Promise.resolve({ status: "PAUSED" });
    } else {
      return Promise.resolve({ status: "NONE" });
    }
  }
  static getSupportedMimeType() {
    if ((MediaRecorder === null || MediaRecorder === void 0 ? void 0 : MediaRecorder.isTypeSupported) == null)
      return null;
    const foundSupportedType = possibleMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
    return foundSupportedType !== null && foundSupportedType !== void 0 ? foundSupportedType : null;
  }
  onSuccessfullyStartedRecording(stream) {
    this.pendingResult = new Promise((resolve3, reject) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onerror = () => {
        reject(failedToRecordError());
        this.prepareInstanceForNextOperation();
      };
      this.mediaRecorder.onstop = async () => {
        const mimeType = VoiceRecorderImpl.getSupportedMimeType();
        if (mimeType == null) {
          reject(failedToFetchRecordingError());
        } else {
          const blobVoiceRecording = new Blob(this.chunks, { "type": mimeType });
          const recordDataBase64 = await VoiceRecorderImpl.blobToBase64(blobVoiceRecording);
          const recordingDuration = await getBlobDuration(blobVoiceRecording);
          this.prepareInstanceForNextOperation();
          resolve3({ value: { recordDataBase64, mimeType, msDuration: recordingDuration * 1e3 } });
        }
      };
      this.mediaRecorder.ondataavailable = (event) => this.chunks.push(event.data);
      this.mediaRecorder.start();
    });
  }
  onFailedToStartRecording() {
    this.prepareInstanceForNextOperation();
    throw failedToRecordError();
  }
  static blobToBase64(blob) {
    return new Promise((resolve3) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const recordingResult = String(reader.result);
        const splitResult = recordingResult.split("base64,");
        const toResolve = splitResult.length > 1 ? splitResult[1] : recordingResult;
        resolve3(toResolve.trim());
      };
      reader.readAsDataURL(blob);
    });
  }
  prepareInstanceForNextOperation() {
    if (this.mediaRecorder != null && this.mediaRecorder.state === "recording") {
      try {
        this.mediaRecorder.stop();
      } catch (ignore) {
      }
    }
    this.pendingResult = neverResolvingPromise();
    this.mediaRecorder = null;
    this.chunks = [];
  }
}
class VoiceRecorderWeb extends WebPlugin {
  constructor() {
    super(...arguments);
    this.voiceRecorderInstance = new VoiceRecorderImpl();
  }
  canDeviceVoiceRecord() {
    return VoiceRecorderImpl.canDeviceVoiceRecord();
  }
  hasAudioRecordingPermission() {
    return VoiceRecorderImpl.hasAudioRecordingPermission();
  }
  requestAudioRecordingPermission() {
    return VoiceRecorderImpl.requestAudioRecordingPermission();
  }
  startRecording() {
    return this.voiceRecorderInstance.startRecording();
  }
  stopRecording() {
    return this.voiceRecorderInstance.stopRecording();
  }
  pauseRecording() {
    return this.voiceRecorderInstance.pauseRecording();
  }
  resumeRecording() {
    return this.voiceRecorderInstance.resumeRecording();
  }
  getCurrentStatus() {
    return this.voiceRecorderInstance.getCurrentStatus();
  }
}
var web = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VoiceRecorderWeb
}, Symbol.toStringTag, { value: "Module" }));
export { VueAdvancedChat, register };
