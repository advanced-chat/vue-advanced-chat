function makeMap$2(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const NOOP$1 = () => {
};
const extend$2 = Object.assign;
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn$1 = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$2 = Array.isArray;
const isMap$1 = (val) => toTypeString$1(val) === "[object Map]";
const isFunction$2 = (val) => typeof val === "function";
const isString$2 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const objectToString$1 = Object.prototype.toString;
const toTypeString$1 = (value) => objectToString$1.call(value);
const toRawType = (value) => {
  return toTypeString$1(value).slice(8, -1);
};
const isIntegerKey = (key) => isString$2(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const hasChanged$1 = (value, oldValue) => !Object.is(value, oldValue);
const def$1 = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
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
  } else if (key === "length" && isArray$2(target)) {
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
        if (!isArray$2(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap$1(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$2(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap$1(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap$1(target)) {
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
  const effects = isArray$2(dep) ? dep : [...dep];
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
const isNonTrackableKeys = /* @__PURE__ */ makeMap$2(`__proto__,__v_isRef,__isVue`);
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
    const targetIsArray = isArray$2(target);
    if (!isReadonly2 && targetIsArray && hasOwn$1(arrayInstrumentations, key)) {
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
    if (isObject$2(res)) {
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
      if (!isArray$2(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$2(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn$1(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged$1(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn$1(target, key);
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
  track(target, "iterate", isArray$2(target) ? "length" : ITERATE_KEY);
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
const shallowReactiveHandlers = /* @__PURE__ */ extend$2({}, mutableHandlers, {
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
  } else if (hasChanged$1(value, oldValue)) {
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
    const targetIsMap = isMap$1(rawTarget);
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
    return Reflect.get(hasOwn$1(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
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
  if (!isObject$2(target)) {
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
  def$1(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
function trackRefValue(ref) {
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref);
    {
      trackEffects(ref.dep || (ref.dep = createDep()));
    }
  }
}
function triggerRefValue(ref, newVal) {
  ref = toRaw(ref);
  if (ref.dep) {
    {
      triggerEffects(ref.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
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
  const onlyGetter = isFunction$2(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP$1;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function makeMap$1(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value)) {
    return value;
  } else if (isObject$1(value)) {
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
  if (isString$1(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
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
  if (klass && !isString$1(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
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
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE$1 = /^on[^a-z]/;
const isOn$1 = (key) => onRE$1.test(key);
const isModelListener$1 = (key) => key.startsWith("onUpdate:");
const extend$1 = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isReservedProp = /* @__PURE__ */ makeMap$1(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction$1 = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE$1 = /-(\w)/g;
const camelize$1 = cacheStringFunction$1((str) => {
  return str.replace(camelizeRE$1, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE$1 = /\B([A-Z])/g;
const hyphenate$1 = cacheStringFunction$1((str) => str.replace(hyphenateRE$1, "-$1").toLowerCase());
const capitalize$1 = cacheStringFunction$1((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction$1((str) => str ? `on${capitalize$1(str)}` : ``);
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
const toNumber$1 = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
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
  if (isFunction$1(fn)) {
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
  if (!isArray$1(cb)) {
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
      args = rawArgs.map(toNumber$1);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize$1(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate$1(event))];
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
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend$1(normalized, normalizedFromExtend);
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
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend$1(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options2, key) {
  if (!options2 || !isOn$1(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options2, key[0].toLowerCase() + key.slice(1)) || hasOwn(options2, hyphenate$1(key)) || hasOwn(options2, key);
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
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render: render2, renderCache, data, setupState, ctx, inheritAttrs } = instance2;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance2);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render2.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
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
        if (propsOptions && keys.some(isModelListener$1)) {
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
    if (key === "class" || key === "style" || isOn$1(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener$1(key) || !(key.slice(9) in props)) {
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
    if (isArray$1(fn)) {
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
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance2.proxy) : defaultValue;
    } else
      ;
  }
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
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance2, 2);
      } else
        ;
    });
  } else if (isFunction$1(source)) {
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
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
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
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray$1(value)) {
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
    if (isArray$1(hook)) {
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
  return isFunction$1(options2) ? { setup: options2, name: options2.name } : options2;
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
    if (isFunction$1(dir)) {
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
  if (isString$1(component)) {
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
      if (selfName && (selfName === name || selfName === camelize$1(name) || selfName === capitalize$1(camelize$1(name)))) {
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
  return registry && (registry[name] || registry[camelize$1(name)] || registry[capitalize$1(camelize$1(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray$1(source) || isString$1(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject$1(source)) {
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
    if (isArray$1(slot)) {
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
const publicPropertiesMap = /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
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
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance2;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
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
    const { data, setupState, ctx } = instance2;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
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
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
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
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance2.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get3 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
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
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance2, "c");
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray$1(hook)) {
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
  if (isArray$1(expose)) {
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
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
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
  callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h2) => h2.bind(instance2.proxy)) : hook.bind(instance2.proxy), instance2, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
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
    return extend$1(isFunction$1(to) ? to.call(this, this) : to, isFunction$1(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
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
  return to ? extend$1(extend$1(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend$1(/* @__PURE__ */ Object.create(null), to);
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
            const camelizedKey = camelize$1(key);
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
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate$1(key)) === key || !hasOwn(rawProps, kebabKey))) {
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
      if (options2 && hasOwn(options2, camelKey = camelize$1(key))) {
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
      if (opt.type !== Function && isFunction$1(defaultValue)) {
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
      } else if (opt[1] && (value === "" || value === hyphenate$1(key))) {
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
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend$1(normalized, props);
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
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize$1(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize$1(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : opt;
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
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
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
    if (isFunction$1(value)) {
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
        extend$1(slots, children);
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
    if (!isFunction$1(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
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
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options2);
        } else if (isFunction$1(plugin)) {
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
  if (isArray$1(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref) {
    if (isString$1(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref)) {
    callWithErrorHandling(ref, owner, 12, [value, refs]);
  } else {
    const _isString = isString$1(ref);
    const _isRef = isRef(ref);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref] : ref.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref] = [refValue];
                if (hasOwn(setupState, ref)) {
                  setupState[ref] = refs[ref];
                }
              } else {
                ref.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref] = value;
          if (hasOwn(setupState, ref)) {
            setupState[ref] = value;
          }
        } else if (_isRef) {
          ref.value = value;
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
    const { type, ref, shapeFlag } = n2;
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
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
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
    const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode, true);
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
  if (isArray$1(ch1) && isArray$1(ch2)) {
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
const normalizeRef = ({ ref, ref_key, ref_for }) => {
  return ref != null ? isString$1(ref) || isRef(ref) || isFunction$1(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
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
    vnode.shapeFlag |= isString$1(children) ? 8 : 16;
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
    if (klass && !isString$1(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend$1({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$1(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend$1({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray$1(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
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
  } else if (isArray$1(child)) {
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
  } else if (isArray$1(children)) {
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
  } else if (isFunction$1(children)) {
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
      } else if (isOn$1(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
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
  if (isFunction$1(setupResult)) {
    if (instance2.type.__ssrInlineRender) {
      instance2.ssrRender = setupResult;
    } else {
      instance2.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
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
        const finalCompilerOptions = extend$1(extend$1({
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
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
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
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
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
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
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
  let name = camelize$1(rawName);
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
        render(null, this.shadowRoot);
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
    render(this._createVNode(), this.shadowRoot);
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
const render = (...args) => {
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
const _hoisted_2$n = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_3$j = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_4$h = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_5$b = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
const _hoisted_6$7 = /* @__PURE__ */ createBaseVNode("div", { id: "vac-circle" }, null, -1);
function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
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
          _hoisted_2$n
        ]) : createCommentVNode("", true),
        $props.type === "message-file" ? renderSlot(_ctx.$slots, "spinner-icon-message-file_" + $props.messageId, { key: 2 }, () => [
          _hoisted_3$j
        ]) : createCommentVNode("", true),
        $props.type === "room-file" ? renderSlot(_ctx.$slots, "spinner-icon-room-file", { key: 3 }, () => [
          _hoisted_4$h
        ]) : createCommentVNode("", true),
        $props.type === "messages" ? renderSlot(_ctx.$slots, "spinner-icon-messages", { key: 4 }, () => [
          _hoisted_5$b
        ]) : createCommentVNode("", true),
        $props.type === "infinite-messages" ? renderSlot(_ctx.$slots, "spinner-icon-infinite-messages", { key: 5 }, () => [
          _hoisted_6$7
        ]) : createCommentVNode("", true)
      ], 2)) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
var Loader = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q]]);
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
const _hoisted_2$m = ["id", "d"];
const _hoisted_3$i = ["id", "d"];
function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
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
    }, null, 8, _hoisted_2$m),
    $data.svgItem[$props.name].path2 ? (openBlock(), createElementBlock("path", {
      key: 0,
      id: $options.svgId,
      d: $data.svgItem[$props.name].path2
    }, null, 8, _hoisted_3$i)) : createCommentVNode("", true)
  ], 8, _hoisted_1$p);
}
var SvgIcon = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p]]);
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
const _hoisted_2$l = ["placeholder"];
function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
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
      }, null, 40, _hoisted_2$l)) : createCommentVNode("", true)
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
var RoomsSearch = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o]]);
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
const _hoisted_2$k = { class: "vac-image-link-message" };
const _hoisted_3$h = ["innerHTML"];
const _hoisted_4$g = ["innerHTML"];
function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
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
                createBaseVNode("div", _hoisted_2$k, [
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
var FormatMessage = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n]]);
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
  return checkMediaType(VIDEO_TYPES, file);
}
function isImageVideoFile(file) {
  return checkMediaType(IMAGE_TYPES, file) || checkMediaType(VIDEO_TYPES, file);
}
function isAudioFile(file) {
  return checkMediaType(AUDIO_TYPES, file);
}
const _sfc_main$m = {
  name: "RoomsContent",
  components: {
    SvgIcon,
    FormatMessage
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
      roomMenuOpened: null
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
const _hoisted_2$j = { class: "vac-name-container vac-text-ellipsis" };
const _hoisted_3$g = { class: "vac-title-container" };
const _hoisted_4$f = { class: "vac-room-name vac-text-ellipsis" };
const _hoisted_5$a = {
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
const _hoisted_12$3 = { class: "vac-menu-list" };
const _hoisted_13$1 = ["onClick"];
function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
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
      createBaseVNode("div", _hoisted_2$j, [
        createBaseVNode("div", _hoisted_3$g, [
          $options.userStatus ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["vac-state-circle", { "vac-state-online": $options.userStatus === "online" }])
          }, null, 2)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_4$f, toDisplayString($props.room.roomName), 1),
          $props.room.lastMessage ? (openBlock(), createElementBlock("div", _hoisted_5$a, toDisplayString($props.room.lastMessage.timestamp), 1)) : createCommentVNode("", true)
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
                fn: withCtx((data) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                    createBaseVNode("div", _hoisted_12$3, [
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
var RoomContent = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m]]);
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
      const loader = this.$el.querySelector("#infinite-loader-rooms");
      if (loader) {
        const options2 = {
          root: this.$el.querySelector("#rooms-list"),
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
const _hoisted_2$i = {
  key: 1,
  id: "rooms-list",
  class: "vac-room-list"
};
const _hoisted_3$f = ["id", "onClick"];
const _hoisted_4$e = {
  key: 0,
  id: "infinite-loader-rooms"
};
function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
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
            fn: withCtx((data) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
          ])
        };
      })
    ]), 1032, ["show"]),
    !$props.loadingRooms && !$props.rooms.length ? (openBlock(), createElementBlock("div", _hoisted_1$l, [
      renderSlot(_ctx.$slots, "rooms-empty", {}, () => [
        createTextVNode(toDisplayString($props.textMessages.ROOMS_EMPTY), 1)
      ])
    ])) : createCommentVNode("", true),
    !$props.loadingRooms ? (openBlock(), createElementBlock("div", _hoisted_2$i, [
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
                fn: withCtx((data) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                  fn: withCtx((data) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
var RoomsList = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l]]);
const _sfc_main$k = {
  name: "RoomHeader",
  components: {
    SvgIcon
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
      messageSelectionAnimationEnded: true
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
      if (!(user == null ? void 0 : user.status))
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
const _hoisted_2$h = { class: "vac-room-wrapper" };
const _hoisted_3$e = {
  key: 0,
  class: "vac-room-selection"
};
const _hoisted_4$d = ["id"];
const _hoisted_5$9 = ["onClick"];
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
const _hoisted_12$2 = { class: "vac-menu-list" };
const _hoisted_13 = ["onClick"];
function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createElementBlock("div", _hoisted_1$k, [
    renderSlot(_ctx.$slots, "room-header", {}, () => [
      createBaseVNode("div", _hoisted_2$h, [
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
                  ], 8, _hoisted_5$9)
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
                createBaseVNode("div", _hoisted_8$3, toDisplayString($props.room.roomName), 1),
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
                  createBaseVNode("div", _hoisted_12$2, [
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
var RoomHeader = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k]]);
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
        for (const data of transformedData) {
          emojiStore.put(data);
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
function text(data) {
  return document.createTextNode(data);
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
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
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
function findParentBySelector(node, selector) {
  while (node && !node.querySelector(selector)) {
    node = node.parentNode;
    const element2 = node.querySelector(selector);
    if (element2)
      return element2;
  }
  return null;
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
    messageId: { type: String, default: "" },
    emojiDataSource: { type: String, default: void 0 }
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
      const roomFooterRef = findParentBySelector(this.$el, "#room-footer");
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
function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_emoji_picker = resolveComponent("emoji-picker");
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
          $props.emojiOpened ? (openBlock(), createBlock(_component_emoji_picker, {
            key: 0,
            ref: "emojiPicker",
            "data-source": $props.emojiDataSource
          }, null, 8, ["data-source"])) : createCommentVNode("", true)
        ], 6)
      ]),
      _: 1
    })) : createCommentVNode("", true)
  ]);
}
var EmojiPickerContainer = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j]]);
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
const _hoisted_2$g = ["src"];
const _hoisted_3$d = { class: "vac-text-ellipsis" };
const _hoisted_4$c = {
  key: 0,
  class: "vac-text-ellipsis vac-text-extension"
};
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
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
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
      }, null, 8, _hoisted_2$g)
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
var RoomFile = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i]]);
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
  computed: {}
};
const _hoisted_1$h = {
  key: 0,
  class: "vac-room-files-container"
};
const _hoisted_2$f = { class: "vac-files-box" };
const _hoisted_3$c = { class: "vac-icon-close" };
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_room_file = resolveComponent("room-file");
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.files.length ? (openBlock(), createElementBlock("div", _hoisted_1$h, [
        createBaseVNode("div", _hoisted_2$f, [
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
                    fn: withCtx((data) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
                    ])
                  };
                })
              ]), 1032, ["file", "index"])
            ]);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_3$c, [
          createBaseVNode("div", {
            class: "vac-svg-button",
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("reset-message"))
          }, [
            renderSlot(_ctx.$slots, "files-close-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "close-outline" })
            ])
          ])
        ])
      ])) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
var RoomFiles = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h]]);
const _sfc_main$g = {
  props: {
    percentage: { type: Number, default: 0 },
    messageSelectionEnabled: { type: Boolean, required: true }
  },
  emits: ["hover-audio-progress", "change-linehead"],
  data() {
    return {
      isMouseDown: false
    };
  },
  methods: {
    onMouseDown(ev) {
      if (this.messageSelectionEnabled)
        return;
      this.isMouseDown = true;
      const seekPos = this.calculateLineHeadPosition(ev, this.$refs.progress);
      this.$emit("change-linehead", seekPos);
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    },
    onMouseUp(ev) {
      if (this.messageSelectionEnabled)
        return;
      this.isMouseDown = false;
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("mousemove", this.onMouseMove);
      const seekPos = this.calculateLineHeadPosition(ev, this.$refs.progress);
      this.$emit("change-linehead", seekPos);
    },
    onMouseMove(ev) {
      if (this.messageSelectionEnabled)
        return;
      const seekPos = this.calculateLineHeadPosition(ev, this.$refs.progress);
      this.$emit("change-linehead", seekPos);
    },
    calculateLineHeadPosition(ev, element2) {
      const progressWidth = element2.getBoundingClientRect().width;
      const leftPosition = element2.getBoundingClientRect().left;
      let pos = (ev.clientX - leftPosition) / progressWidth;
      pos = pos < 0 ? 0 : pos;
      pos = pos > 1 ? 1 : pos;
      return pos;
    }
  }
};
const _hoisted_1$g = { class: "vac-player-progress" };
const _hoisted_2$e = { class: "vac-line-container" };
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "progress",
    class: "vac-player-bar",
    onMousedown: _cache[0] || (_cache[0] = (...args) => $options.onMouseDown && $options.onMouseDown(...args)),
    onMouseover: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("hover-audio-progress", true)),
    onMouseout: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("hover-audio-progress", false))
  }, [
    createBaseVNode("div", _hoisted_1$g, [
      createBaseVNode("div", _hoisted_2$e, [
        createBaseVNode("div", {
          class: "vac-line-progress",
          style: normalizeStyle({ width: `${$props.percentage}%` })
        }, null, 4),
        createBaseVNode("div", {
          class: normalizeClass(["vac-line-dot", { "vac-line-dot__active": $data.isMouseDown }]),
          style: normalizeStyle({ left: `${$props.percentage}%` })
        }, null, 6)
      ])
    ])
  ], 544);
}
var AudioControl = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g]]);
const _sfc_main$f = {
  name: "AudioPlayer",
  components: {
    SvgIcon,
    AudioControl
  },
  props: {
    messageId: { type: [String, Number], default: null },
    src: { type: String, default: null },
    messageSelectionEnabled: { type: Boolean, required: true }
  },
  emits: ["hover-audio-progress", "update-progress-time"],
  data() {
    return {
      isPlaying: false,
      duration: this.convertTimeMMSS(0),
      playedTime: this.convertTimeMMSS(0),
      progress: 0
    };
  },
  computed: {
    playerUniqId() {
      return `audio-player${this.messageId}`;
    },
    audioSource() {
      if (this.src)
        return this.src;
      this.resetProgress();
      return null;
    }
  },
  mounted() {
    this.player = this.$el.querySelector("#" + this.playerUniqId);
    this.player.addEventListener("ended", () => {
      this.isPlaying = false;
    });
    this.player.addEventListener("loadeddata", () => {
      this.resetProgress();
      this.duration = this.convertTimeMMSS(this.player.duration);
      this.updateProgressTime();
    });
    this.player.addEventListener("timeupdate", this.onTimeUpdate);
  },
  methods: {
    convertTimeMMSS(seconds) {
      return new Date(seconds * 1e3).toISOString().substr(14, 5);
    },
    playback() {
      if (this.messageSelectionEnabled || !this.audioSource)
        return;
      if (this.isPlaying)
        this.player.pause();
      else
        setTimeout(() => this.player.play());
      this.isPlaying = !this.isPlaying;
    },
    resetProgress() {
      if (this.isPlaying)
        this.player.pause();
      this.duration = this.convertTimeMMSS(0);
      this.playedTime = this.convertTimeMMSS(0);
      this.progress = 0;
      this.isPlaying = false;
      this.updateProgressTime();
    },
    onTimeUpdate() {
      this.playedTime = this.convertTimeMMSS(this.player.currentTime);
      this.progress = this.player.currentTime / this.player.duration * 100;
      this.updateProgressTime();
    },
    onUpdateProgress(pos) {
      if (pos)
        this.player.currentTime = pos * this.player.duration;
    },
    updateProgressTime() {
      this.$emit(
        "update-progress-time",
        this.progress > 1 ? this.playedTime : this.duration
      );
    }
  }
};
const _hoisted_1$f = { class: "vac-audio-player" };
const _hoisted_2$d = ["id", "src"];
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  const _component_audio_control = resolveComponent("audio-control");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$f, [
      createBaseVNode("div", {
        class: "vac-svg-button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.playback && $options.playback(...args))
      }, [
        $data.isPlaying ? renderSlot(_ctx.$slots, "audio-pause-icon_" + $props.messageId, { key: 0 }, () => [
          createVNode(_component_svg_icon, { name: "audio-pause" })
        ]) : renderSlot(_ctx.$slots, "audio-play-icon_" + $props.messageId, { key: 1 }, () => [
          createVNode(_component_svg_icon, { name: "audio-play" })
        ])
      ]),
      createVNode(_component_audio_control, {
        percentage: $data.progress,
        "message-selection-enabled": $props.messageSelectionEnabled,
        onChangeLinehead: $options.onUpdateProgress,
        onHoverAudioProgress: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("hover-audio-progress", $event))
      }, null, 8, ["percentage", "message-selection-enabled", "onChangeLinehead"]),
      createBaseVNode("audio", {
        id: $options.playerUniqId,
        src: $options.audioSource
      }, null, 8, _hoisted_2$d)
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
const _hoisted_1$e = {
  key: 0,
  class: "vac-reply-container"
};
const _hoisted_2$c = { class: "vac-reply-box" };
const _hoisted_3$b = { class: "vac-reply-info" };
const _hoisted_4$b = { class: "vac-reply-username" };
const _hoisted_5$8 = { class: "vac-reply-content" };
const _hoisted_6$4 = ["src"];
const _hoisted_7$4 = {
  key: 1,
  controls: "",
  class: "vac-image-reply"
};
const _hoisted_8$2 = ["src"];
const _hoisted_9$2 = {
  key: 3,
  class: "vac-image-reply vac-file-container"
};
const _hoisted_10$2 = { class: "vac-text-ellipsis" };
const _hoisted_11$1 = {
  key: 0,
  class: "vac-text-ellipsis vac-text-extension"
};
const _hoisted_12$1 = { class: "vac-icon-reply" };
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_format_message = resolveComponent("format-message");
  const _component_audio_player = resolveComponent("audio-player");
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.messageReply ? (openBlock(), createElementBlock("div", _hoisted_1$e, [
        createBaseVNode("div", _hoisted_2$c, [
          createBaseVNode("div", _hoisted_3$b, [
            createBaseVNode("div", _hoisted_4$b, toDisplayString($props.messageReply.username), 1),
            createBaseVNode("div", _hoisted_5$8, [
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
          }, null, 8, _hoisted_6$4)) : $options.isVideo ? (openBlock(), createElementBlock("video", _hoisted_7$4, [
            createBaseVNode("source", {
              src: $options.firstFile.url
            }, null, 8, _hoisted_8$2)
          ])) : $options.isAudio ? (openBlock(), createBlock(_component_audio_player, {
            key: 2,
            src: $options.firstFile.url,
            "message-selection-enabled": false,
            class: "vac-audio-reply"
          }, createSlots({ _: 2 }, [
            renderList(_ctx.$slots, (idx, name) => {
              return {
                name,
                fn: withCtx((data) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
                ])
              };
            })
          ]), 1032, ["src"])) : $options.isOtherFile ? (openBlock(), createElementBlock("div", _hoisted_9$2, [
            createBaseVNode("div", null, [
              renderSlot(_ctx.$slots, "file-icon", {}, () => [
                createVNode(_component_svg_icon, { name: "file" })
              ])
            ]),
            createBaseVNode("div", _hoisted_10$2, toDisplayString($options.firstFile.name), 1),
            $options.firstFile.extension ? (openBlock(), createElementBlock("div", _hoisted_11$1, toDisplayString($options.firstFile.extension), 1)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_12$1, [
          createBaseVNode("div", {
            class: "vac-svg-button",
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("reset-message"))
          }, [
            renderSlot(_ctx.$slots, "reply-close-icon", {}, () => [
              createVNode(_component_svg_icon, { name: "close-outline" })
            ])
          ])
        ])
      ])) : createCommentVNode("", true)
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
const _hoisted_1$d = {
  key: 0,
  class: "vac-tags-container"
};
const _hoisted_2$b = ["onMouseover", "onClick"];
const _hoisted_3$a = { class: "vac-tags-info" };
const _hoisted_4$a = { class: "vac-tags-username" };
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.filteredUsersTag.length ? (openBlock(), createElementBlock("div", _hoisted_1$d, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.filteredUsersTag, (user, index) => {
          return openBlock(), createElementBlock("div", {
            key: user._id,
            class: normalizeClass(["vac-tags-box", { "vac-tags-box-active": index === $data.activeItem }]),
            onMouseover: ($event) => $data.activeItem = index,
            onClick: ($event) => _ctx.$emit("select-user-tag", user)
          }, [
            createBaseVNode("div", _hoisted_3$a, [
              user.avatar ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "vac-avatar vac-tags-avatar",
                style: normalizeStyle({ "background-image": `url('${user.avatar}')` })
              }, null, 4)) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_4$a, toDisplayString(user.username), 1)
            ])
          ], 42, _hoisted_2$b);
        }), 128))
      ])) : createCommentVNode("", true)
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
const _hoisted_1$c = {
  key: 0,
  class: "vac-emojis-container"
};
const _hoisted_2$a = ["onMouseover", "onClick"];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.filteredEmojis.length ? (openBlock(), createElementBlock("div", _hoisted_1$c, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.filteredEmojis, (emoji, index) => {
          return openBlock(), createElementBlock("div", {
            key: emoji,
            class: normalizeClass(["vac-emoji-element", { "vac-emoji-element-active": index === $data.activeItem }]),
            onMouseover: ($event) => $data.activeItem = index,
            onClick: ($event) => _ctx.$emit("select-emoji", emoji)
          }, toDisplayString(emoji), 43, _hoisted_2$a);
        }), 128))
      ])) : createCommentVNode("", true)
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
const _hoisted_1$b = {
  key: 0,
  class: "vac-template-container vac-app-box-shadow"
};
const _hoisted_2$9 = ["onMouseover", "onClick"];
const _hoisted_3$9 = { class: "vac-template-info" };
const _hoisted_4$9 = { class: "vac-template-tag" };
const _hoisted_5$7 = { class: "vac-template-text" };
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "vac-slide-up" }, {
    default: withCtx(() => [
      $props.filteredTemplatesText.length ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.filteredTemplatesText, (template, index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            class: normalizeClass(["vac-template-box", { "vac-template-active": index === $data.activeItem }]),
            onMouseover: ($event) => $data.activeItem = index,
            onClick: ($event) => _ctx.$emit("select-template-text", template)
          }, [
            createBaseVNode("div", _hoisted_3$9, [
              createBaseVNode("div", _hoisted_4$9, " /" + toDisplayString(template.tag), 1),
              createBaseVNode("div", _hoisted_5$7, toDisplayString(template.text), 1)
            ])
          ], 42, _hoisted_2$9);
        }), 128))
      ])) : createCommentVNode("", true)
    ]),
    _: 1
  });
}
var RoomTemplatesText = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
function new_byte$4(count) {
  return new Int8Array(count);
}
function new_short(count) {
  return new Int16Array(count);
}
function new_int$d(count) {
  return new Int32Array(count);
}
function new_float$f(count) {
  return new Float32Array(count);
}
function new_double$1(count) {
  return new Float64Array(count);
}
function new_float_n$6(args) {
  if (args.length == 1) {
    return new_float$f(args[0]);
  }
  var sz = args[0];
  args = args.slice(1);
  var A = [];
  for (var i = 0; i < sz; i++) {
    A.push(new_float_n$6(args));
  }
  return A;
}
function new_int_n$2(args) {
  if (args.length == 1) {
    return new_int$d(args[0]);
  }
  var sz = args[0];
  args = args.slice(1);
  var A = [];
  for (var i = 0; i < sz; i++) {
    A.push(new_int_n$2(args));
  }
  return A;
}
function new_short_n$1(args) {
  if (args.length == 1) {
    return new_short(args[0]);
  }
  var sz = args[0];
  args = args.slice(1);
  var A = [];
  for (var i = 0; i < sz; i++) {
    A.push(new_short_n$1(args));
  }
  return A;
}
function new_array_n$1(args) {
  if (args.length == 1) {
    return new Array(args[0]);
  }
  var sz = args[0];
  args = args.slice(1);
  var A = [];
  for (var i = 0; i < sz; i++) {
    A.push(new_array_n$1(args));
  }
  return A;
}
var Arrays$7 = {};
Arrays$7.fill = function(a, fromIndex, toIndex, val) {
  if (arguments.length == 2) {
    for (var i = 0; i < a.length; i++) {
      a[i] = arguments[1];
    }
  } else {
    for (var i = fromIndex; i < toIndex; i++) {
      a[i] = val;
    }
  }
};
var System$a = {};
System$a.arraycopy = function(src, srcPos, dest, destPos, length) {
  var srcEnd = srcPos + length;
  while (srcPos < srcEnd)
    dest[destPos++] = src[srcPos++];
};
System$a.out = {};
System$a.out.println = function(message) {
  console.log(message);
};
System$a.out.printf = function() {
  console.log.apply(console, arguments);
};
var Util$5 = {};
Util$5.SQRT2 = 1.4142135623730951;
Util$5.FAST_LOG10 = function(x) {
  return Math.log10(x);
};
Util$5.FAST_LOG10_X = function(x, y) {
  return Math.log10(x) * y;
};
function ShortBlock$3(ordinal) {
  this.ordinal = ordinal;
}
ShortBlock$3.short_block_allowed = new ShortBlock$3(0);
ShortBlock$3.short_block_coupled = new ShortBlock$3(1);
ShortBlock$3.short_block_dispensed = new ShortBlock$3(2);
ShortBlock$3.short_block_forced = new ShortBlock$3(3);
var Float$2 = {};
Float$2.MAX_VALUE = 34028235e31;
function VbrMode$7(ordinal) {
  this.ordinal = ordinal;
}
VbrMode$7.vbr_off = new VbrMode$7(0);
VbrMode$7.vbr_mt = new VbrMode$7(1);
VbrMode$7.vbr_rh = new VbrMode$7(2);
VbrMode$7.vbr_abr = new VbrMode$7(3);
VbrMode$7.vbr_mtrh = new VbrMode$7(4);
VbrMode$7.vbr_default = VbrMode$7.vbr_mtrh;
var assert$b = function(x) {
};
var common = {
  System: System$a,
  VbrMode: VbrMode$7,
  Float: Float$2,
  ShortBlock: ShortBlock$3,
  Util: Util$5,
  Arrays: Arrays$7,
  new_array_n: new_array_n$1,
  new_byte: new_byte$4,
  new_double: new_double$1,
  new_float: new_float$f,
  new_float_n: new_float_n$6,
  new_int: new_int$d,
  new_int_n: new_int_n$2,
  new_short,
  new_short_n: new_short_n$1,
  assert: assert$b
};
var System$9 = common.System;
var Util$4 = common.Util;
var Arrays$6 = common.Arrays;
var new_float$e = common.new_float;
function NewMDCT() {
  var enwindow = [
    -477e-9 * 0.740951125354959 / 2384e-9,
    103951e-9 * 0.740951125354959 / 2384e-9,
    953674e-9 * 0.740951125354959 / 2384e-9,
    2841473e-9 * 0.740951125354959 / 2384e-9,
    0.035758972 * 0.740951125354959 / 2384e-9,
    3401756e-9 * 0.740951125354959 / 2384e-9,
    983715e-9 * 0.740951125354959 / 2384e-9,
    99182e-9 * 0.740951125354959 / 2384e-9,
    12398e-9 * 0.740951125354959 / 2384e-9,
    191212e-9 * 0.740951125354959 / 2384e-9,
    2283096e-9 * 0.740951125354959 / 2384e-9,
    0.016994476 * 0.740951125354959 / 2384e-9,
    -0.018756866 * 0.740951125354959 / 2384e-9,
    -2630711e-9 * 0.740951125354959 / 2384e-9,
    -247478e-9 * 0.740951125354959 / 2384e-9,
    -14782e-9 * 0.740951125354959 / 2384e-9,
    0.9063471690191471,
    0.1960342806591213,
    -477e-9 * 0.773010453362737 / 2384e-9,
    105858e-9 * 0.773010453362737 / 2384e-9,
    930786e-9 * 0.773010453362737 / 2384e-9,
    2521515e-9 * 0.773010453362737 / 2384e-9,
    0.035694122 * 0.773010453362737 / 2384e-9,
    3643036e-9 * 0.773010453362737 / 2384e-9,
    991821e-9 * 0.773010453362737 / 2384e-9,
    96321e-9 * 0.773010453362737 / 2384e-9,
    11444e-9 * 0.773010453362737 / 2384e-9,
    165462e-9 * 0.773010453362737 / 2384e-9,
    2110004e-9 * 0.773010453362737 / 2384e-9,
    0.016112804 * 0.773010453362737 / 2384e-9,
    -0.019634247 * 0.773010453362737 / 2384e-9,
    -2803326e-9 * 0.773010453362737 / 2384e-9,
    -277042e-9 * 0.773010453362737 / 2384e-9,
    -16689e-9 * 0.773010453362737 / 2384e-9,
    0.8206787908286602,
    0.3901806440322567,
    -477e-9 * 0.803207531480645 / 2384e-9,
    107288e-9 * 0.803207531480645 / 2384e-9,
    902653e-9 * 0.803207531480645 / 2384e-9,
    2174854e-9 * 0.803207531480645 / 2384e-9,
    0.035586357 * 0.803207531480645 / 2384e-9,
    3858566e-9 * 0.803207531480645 / 2384e-9,
    995159e-9 * 0.803207531480645 / 2384e-9,
    9346e-8 * 0.803207531480645 / 2384e-9,
    10014e-9 * 0.803207531480645 / 2384e-9,
    14019e-8 * 0.803207531480645 / 2384e-9,
    1937389e-9 * 0.803207531480645 / 2384e-9,
    0.015233517 * 0.803207531480645 / 2384e-9,
    -0.020506859 * 0.803207531480645 / 2384e-9,
    -2974033e-9 * 0.803207531480645 / 2384e-9,
    -30756e-8 * 0.803207531480645 / 2384e-9,
    -1812e-8 * 0.803207531480645 / 2384e-9,
    0.7416505462720353,
    0.5805693545089249,
    -477e-9 * 0.831469612302545 / 2384e-9,
    108242e-9 * 0.831469612302545 / 2384e-9,
    868797e-9 * 0.831469612302545 / 2384e-9,
    1800537e-9 * 0.831469612302545 / 2384e-9,
    0.0354352 * 0.831469612302545 / 2384e-9,
    4049301e-9 * 0.831469612302545 / 2384e-9,
    994205e-9 * 0.831469612302545 / 2384e-9,
    90599e-9 * 0.831469612302545 / 2384e-9,
    906e-8 * 0.831469612302545 / 2384e-9,
    116348e-9 * 0.831469612302545 / 2384e-9,
    1766682e-9 * 0.831469612302545 / 2384e-9,
    0.014358521 * 0.831469612302545 / 2384e-9,
    -0.021372318 * 0.831469612302545 / 2384e-9,
    -314188e-8 * 0.831469612302545 / 2384e-9,
    -339031e-9 * 0.831469612302545 / 2384e-9,
    -1955e-8 * 0.831469612302545 / 2384e-9,
    0.6681786379192989,
    0.7653668647301797,
    -477e-9 * 0.857728610000272 / 2384e-9,
    108719e-9 * 0.857728610000272 / 2384e-9,
    82922e-8 * 0.857728610000272 / 2384e-9,
    1399517e-9 * 0.857728610000272 / 2384e-9,
    0.035242081 * 0.857728610000272 / 2384e-9,
    421524e-8 * 0.857728610000272 / 2384e-9,
    989437e-9 * 0.857728610000272 / 2384e-9,
    87261e-9 * 0.857728610000272 / 2384e-9,
    8106e-9 * 0.857728610000272 / 2384e-9,
    93937e-9 * 0.857728610000272 / 2384e-9,
    1597881e-9 * 0.857728610000272 / 2384e-9,
    0.013489246 * 0.857728610000272 / 2384e-9,
    -0.022228718 * 0.857728610000272 / 2384e-9,
    -3306866e-9 * 0.857728610000272 / 2384e-9,
    -371456e-9 * 0.857728610000272 / 2384e-9,
    -21458e-9 * 0.857728610000272 / 2384e-9,
    0.5993769336819237,
    0.9427934736519954,
    -477e-9 * 0.881921264348355 / 2384e-9,
    108719e-9 * 0.881921264348355 / 2384e-9,
    78392e-8 * 0.881921264348355 / 2384e-9,
    971317e-9 * 0.881921264348355 / 2384e-9,
    0.035007 * 0.881921264348355 / 2384e-9,
    4357815e-9 * 0.881921264348355 / 2384e-9,
    980854e-9 * 0.881921264348355 / 2384e-9,
    83923e-9 * 0.881921264348355 / 2384e-9,
    7629e-9 * 0.881921264348355 / 2384e-9,
    72956e-9 * 0.881921264348355 / 2384e-9,
    1432419e-9 * 0.881921264348355 / 2384e-9,
    0.012627602 * 0.881921264348355 / 2384e-9,
    -0.02307415 * 0.881921264348355 / 2384e-9,
    -3467083e-9 * 0.881921264348355 / 2384e-9,
    -404358e-9 * 0.881921264348355 / 2384e-9,
    -23365e-9 * 0.881921264348355 / 2384e-9,
    0.5345111359507916,
    1.111140466039205,
    -954e-9 * 0.903989293123443 / 2384e-9,
    108242e-9 * 0.903989293123443 / 2384e-9,
    731945e-9 * 0.903989293123443 / 2384e-9,
    515938e-9 * 0.903989293123443 / 2384e-9,
    0.034730434 * 0.903989293123443 / 2384e-9,
    4477024e-9 * 0.903989293123443 / 2384e-9,
    968933e-9 * 0.903989293123443 / 2384e-9,
    80585e-9 * 0.903989293123443 / 2384e-9,
    6676e-9 * 0.903989293123443 / 2384e-9,
    52929e-9 * 0.903989293123443 / 2384e-9,
    1269817e-9 * 0.903989293123443 / 2384e-9,
    0.011775017 * 0.903989293123443 / 2384e-9,
    -0.023907185 * 0.903989293123443 / 2384e-9,
    -3622532e-9 * 0.903989293123443 / 2384e-9,
    -438213e-9 * 0.903989293123443 / 2384e-9,
    -25272e-9 * 0.903989293123443 / 2384e-9,
    0.4729647758913199,
    1.268786568327291,
    -954e-9 * 0.9238795325112867 / 2384e-9,
    106812e-9 * 0.9238795325112867 / 2384e-9,
    674248e-9 * 0.9238795325112867 / 2384e-9,
    33379e-9 * 0.9238795325112867 / 2384e-9,
    0.034412861 * 0.9238795325112867 / 2384e-9,
    4573822e-9 * 0.9238795325112867 / 2384e-9,
    954151e-9 * 0.9238795325112867 / 2384e-9,
    76771e-9 * 0.9238795325112867 / 2384e-9,
    6199e-9 * 0.9238795325112867 / 2384e-9,
    34332e-9 * 0.9238795325112867 / 2384e-9,
    1111031e-9 * 0.9238795325112867 / 2384e-9,
    0.010933399 * 0.9238795325112867 / 2384e-9,
    -0.024725437 * 0.9238795325112867 / 2384e-9,
    -3771782e-9 * 0.9238795325112867 / 2384e-9,
    -472546e-9 * 0.9238795325112867 / 2384e-9,
    -27657e-9 * 0.9238795325112867 / 2384e-9,
    0.41421356237309503,
    1.414213562373095,
    -954e-9 * 0.941544065183021 / 2384e-9,
    105381e-9 * 0.941544065183021 / 2384e-9,
    610352e-9 * 0.941544065183021 / 2384e-9,
    -475883e-9 * 0.941544065183021 / 2384e-9,
    0.03405571 * 0.941544065183021 / 2384e-9,
    4649162e-9 * 0.941544065183021 / 2384e-9,
    935555e-9 * 0.941544065183021 / 2384e-9,
    73433e-9 * 0.941544065183021 / 2384e-9,
    5245e-9 * 0.941544065183021 / 2384e-9,
    17166e-9 * 0.941544065183021 / 2384e-9,
    956535e-9 * 0.941544065183021 / 2384e-9,
    0.010103703 * 0.941544065183021 / 2384e-9,
    -0.025527 * 0.941544065183021 / 2384e-9,
    -3914356e-9 * 0.941544065183021 / 2384e-9,
    -507355e-9 * 0.941544065183021 / 2384e-9,
    -30041e-9 * 0.941544065183021 / 2384e-9,
    0.3578057213145241,
    1.546020906725474,
    -954e-9 * 0.956940335732209 / 2384e-9,
    10252e-8 * 0.956940335732209 / 2384e-9,
    539303e-9 * 0.956940335732209 / 2384e-9,
    -1011848e-9 * 0.956940335732209 / 2384e-9,
    0.033659935 * 0.956940335732209 / 2384e-9,
    4703045e-9 * 0.956940335732209 / 2384e-9,
    915051e-9 * 0.956940335732209 / 2384e-9,
    70095e-9 * 0.956940335732209 / 2384e-9,
    4768e-9 * 0.956940335732209 / 2384e-9,
    954e-9 * 0.956940335732209 / 2384e-9,
    806808e-9 * 0.956940335732209 / 2384e-9,
    9287834e-9 * 0.956940335732209 / 2384e-9,
    -0.026310921 * 0.956940335732209 / 2384e-9,
    -4048824e-9 * 0.956940335732209 / 2384e-9,
    -542164e-9 * 0.956940335732209 / 2384e-9,
    -32425e-9 * 0.956940335732209 / 2384e-9,
    0.3033466836073424,
    1.66293922460509,
    -1431e-9 * 0.970031253194544 / 2384e-9,
    99182e-9 * 0.970031253194544 / 2384e-9,
    462532e-9 * 0.970031253194544 / 2384e-9,
    -1573563e-9 * 0.970031253194544 / 2384e-9,
    0.033225536 * 0.970031253194544 / 2384e-9,
    4737377e-9 * 0.970031253194544 / 2384e-9,
    891685e-9 * 0.970031253194544 / 2384e-9,
    6628e-8 * 0.970031253194544 / 2384e-9,
    4292e-9 * 0.970031253194544 / 2384e-9,
    -13828e-9 * 0.970031253194544 / 2384e-9,
    66185e-8 * 0.970031253194544 / 2384e-9,
    8487225e-9 * 0.970031253194544 / 2384e-9,
    -0.02707386 * 0.970031253194544 / 2384e-9,
    -4174709e-9 * 0.970031253194544 / 2384e-9,
    -576973e-9 * 0.970031253194544 / 2384e-9,
    -34809e-9 * 0.970031253194544 / 2384e-9,
    0.2504869601913055,
    1.76384252869671,
    -1431e-9 * 0.98078528040323 / 2384e-9,
    95367e-9 * 0.98078528040323 / 2384e-9,
    378609e-9 * 0.98078528040323 / 2384e-9,
    -2161503e-9 * 0.98078528040323 / 2384e-9,
    0.032754898 * 0.98078528040323 / 2384e-9,
    4752159e-9 * 0.98078528040323 / 2384e-9,
    866413e-9 * 0.98078528040323 / 2384e-9,
    62943e-9 * 0.98078528040323 / 2384e-9,
    3815e-9 * 0.98078528040323 / 2384e-9,
    -2718e-8 * 0.98078528040323 / 2384e-9,
    522137e-9 * 0.98078528040323 / 2384e-9,
    7703304e-9 * 0.98078528040323 / 2384e-9,
    -0.027815342 * 0.98078528040323 / 2384e-9,
    -4290581e-9 * 0.98078528040323 / 2384e-9,
    -611782e-9 * 0.98078528040323 / 2384e-9,
    -3767e-8 * 0.98078528040323 / 2384e-9,
    0.198912367379658,
    1.847759065022573,
    -1907e-9 * 0.989176509964781 / 2384e-9,
    90122e-9 * 0.989176509964781 / 2384e-9,
    288486e-9 * 0.989176509964781 / 2384e-9,
    -2774239e-9 * 0.989176509964781 / 2384e-9,
    0.03224802 * 0.989176509964781 / 2384e-9,
    4748821e-9 * 0.989176509964781 / 2384e-9,
    838757e-9 * 0.989176509964781 / 2384e-9,
    59605e-9 * 0.989176509964781 / 2384e-9,
    3338e-9 * 0.989176509964781 / 2384e-9,
    -39577e-9 * 0.989176509964781 / 2384e-9,
    388145e-9 * 0.989176509964781 / 2384e-9,
    6937027e-9 * 0.989176509964781 / 2384e-9,
    -0.028532982 * 0.989176509964781 / 2384e-9,
    -4395962e-9 * 0.989176509964781 / 2384e-9,
    -646591e-9 * 0.989176509964781 / 2384e-9,
    -40531e-9 * 0.989176509964781 / 2384e-9,
    0.1483359875383474,
    1.913880671464418,
    -1907e-9 * 0.995184726672197 / 2384e-9,
    844e-7 * 0.995184726672197 / 2384e-9,
    191689e-9 * 0.995184726672197 / 2384e-9,
    -3411293e-9 * 0.995184726672197 / 2384e-9,
    0.03170681 * 0.995184726672197 / 2384e-9,
    4728317e-9 * 0.995184726672197 / 2384e-9,
    809669e-9 * 0.995184726672197 / 2384e-9,
    5579e-8 * 0.995184726672197 / 2384e-9,
    3338e-9 * 0.995184726672197 / 2384e-9,
    -50545e-9 * 0.995184726672197 / 2384e-9,
    259876e-9 * 0.995184726672197 / 2384e-9,
    6189346e-9 * 0.995184726672197 / 2384e-9,
    -0.029224873 * 0.995184726672197 / 2384e-9,
    -4489899e-9 * 0.995184726672197 / 2384e-9,
    -680923e-9 * 0.995184726672197 / 2384e-9,
    -43392e-9 * 0.995184726672197 / 2384e-9,
    0.09849140335716425,
    1.961570560806461,
    -2384e-9 * 0.998795456205172 / 2384e-9,
    77724e-9 * 0.998795456205172 / 2384e-9,
    88215e-9 * 0.998795456205172 / 2384e-9,
    -4072189e-9 * 0.998795456205172 / 2384e-9,
    0.031132698 * 0.998795456205172 / 2384e-9,
    4691124e-9 * 0.998795456205172 / 2384e-9,
    779152e-9 * 0.998795456205172 / 2384e-9,
    52929e-9 * 0.998795456205172 / 2384e-9,
    2861e-9 * 0.998795456205172 / 2384e-9,
    -60558e-9 * 0.998795456205172 / 2384e-9,
    137329e-9 * 0.998795456205172 / 2384e-9,
    546217e-8 * 0.998795456205172 / 2384e-9,
    -0.02989006 * 0.998795456205172 / 2384e-9,
    -4570484e-9 * 0.998795456205172 / 2384e-9,
    -714302e-9 * 0.998795456205172 / 2384e-9,
    -46253e-9 * 0.998795456205172 / 2384e-9,
    0.04912684976946725,
    1.990369453344394,
    0.035780907 * Util$4.SQRT2 * 0.5 / 2384e-9,
    0.017876148 * Util$4.SQRT2 * 0.5 / 2384e-9,
    3134727e-9 * Util$4.SQRT2 * 0.5 / 2384e-9,
    2457142e-9 * Util$4.SQRT2 * 0.5 / 2384e-9,
    971317e-9 * Util$4.SQRT2 * 0.5 / 2384e-9,
    218868e-9 * Util$4.SQRT2 * 0.5 / 2384e-9,
    101566e-9 * Util$4.SQRT2 * 0.5 / 2384e-9,
    13828e-9 * Util$4.SQRT2 * 0.5 / 2384e-9,
    0.030526638 / 2384e-9,
    4638195e-9 / 2384e-9,
    747204e-9 / 2384e-9,
    49591e-9 / 2384e-9,
    4756451e-9 / 2384e-9,
    21458e-9 / 2384e-9,
    -69618e-9 / 2384e-9
  ];
  var NS = 12;
  var NL2 = 36;
  var win = [
    [
      2382191739347913e-28,
      6423305872147834e-28,
      9400849094049688e-28,
      1122435026096556e-27,
      1183840321267481e-27,
      1122435026096556e-27,
      940084909404969e-27,
      6423305872147839e-28,
      2382191739347918e-28,
      5456116108943412e-27,
      4878985199565852e-27,
      4240448995017367e-27,
      3559909094758252e-27,
      2858043359288075e-27,
      2156177623817898e-27,
      1475637723558783e-27,
      8371015190102974e-28,
      2599706096327376e-28,
      -5456116108943412e-27,
      -4878985199565852e-27,
      -4240448995017367e-27,
      -3559909094758252e-27,
      -2858043359288076e-27,
      -2156177623817898e-27,
      -1475637723558783e-27,
      -8371015190102975e-28,
      -2599706096327376e-28,
      -2382191739347923e-28,
      -6423305872147843e-28,
      -9400849094049696e-28,
      -1122435026096556e-27,
      -1183840321267481e-27,
      -1122435026096556e-27,
      -9400849094049694e-28,
      -642330587214784e-27,
      -2382191739347918e-28
    ],
    [
      2382191739347913e-28,
      6423305872147834e-28,
      9400849094049688e-28,
      1122435026096556e-27,
      1183840321267481e-27,
      1122435026096556e-27,
      9400849094049688e-28,
      6423305872147841e-28,
      2382191739347918e-28,
      5456116108943413e-27,
      4878985199565852e-27,
      4240448995017367e-27,
      3559909094758253e-27,
      2858043359288075e-27,
      2156177623817898e-27,
      1475637723558782e-27,
      8371015190102975e-28,
      2599706096327376e-28,
      -5461314069809755e-27,
      -4921085770524055e-27,
      -4343405037091838e-27,
      -3732668368707687e-27,
      -3093523840190885e-27,
      -2430835727329465e-27,
      -1734679010007751e-27,
      -974825365660928e-27,
      -2797435120168326e-28,
      0,
      0,
      0,
      0,
      0,
      0,
      -2283748241799531e-28,
      -4037858874020686e-28,
      -2146547464825323e-28
    ],
    [
      0.1316524975873958,
      0.414213562373095,
      0.7673269879789602,
      1.091308501069271,
      1.303225372841206,
      1.56968557711749,
      1.920982126971166,
      2.414213562373094,
      3.171594802363212,
      4.510708503662055,
      7.595754112725146,
      22.90376554843115,
      0.984807753012208,
      0.6427876096865394,
      0.3420201433256688,
      0.9396926207859084,
      -0.1736481776669303,
      -0.7660444431189779,
      0.8660254037844387,
      0.5,
      -0.5144957554275265,
      -0.4717319685649723,
      -0.3133774542039019,
      -0.1819131996109812,
      -0.09457419252642064,
      -0.04096558288530405,
      -0.01419856857247115,
      -0.003699974673760037,
      0.8574929257125442,
      0.8817419973177052,
      0.9496286491027329,
      0.9833145924917901,
      0.9955178160675857,
      0.9991605581781475,
      0.999899195244447,
      0.9999931550702802
    ],
    [
      0,
      0,
      0,
      0,
      0,
      0,
      2283748241799531e-28,
      4037858874020686e-28,
      2146547464825323e-28,
      5461314069809755e-27,
      4921085770524055e-27,
      4343405037091838e-27,
      3732668368707687e-27,
      3093523840190885e-27,
      2430835727329466e-27,
      1734679010007751e-27,
      974825365660928e-27,
      2797435120168326e-28,
      -5456116108943413e-27,
      -4878985199565852e-27,
      -4240448995017367e-27,
      -3559909094758253e-27,
      -2858043359288075e-27,
      -2156177623817898e-27,
      -1475637723558782e-27,
      -8371015190102975e-28,
      -2599706096327376e-28,
      -2382191739347913e-28,
      -6423305872147834e-28,
      -9400849094049688e-28,
      -1122435026096556e-27,
      -1183840321267481e-27,
      -1122435026096556e-27,
      -9400849094049688e-28,
      -6423305872147841e-28,
      -2382191739347918e-28
    ]
  ];
  var tantab_l = win[Encoder.SHORT_TYPE];
  var cx = win[Encoder.SHORT_TYPE];
  var ca = win[Encoder.SHORT_TYPE];
  var cs = win[Encoder.SHORT_TYPE];
  var order = [
    0,
    1,
    16,
    17,
    8,
    9,
    24,
    25,
    4,
    5,
    20,
    21,
    12,
    13,
    28,
    29,
    2,
    3,
    18,
    19,
    10,
    11,
    26,
    27,
    6,
    7,
    22,
    23,
    14,
    15,
    30,
    31
  ];
  function window_subband(x1, x1Pos, a) {
    var wp = 10;
    var x2 = x1Pos + 238 - 14 - 286;
    for (var i = -15; i < 0; i++) {
      var w, s, t;
      w = enwindow[wp + -10];
      s = x1[x2 + -224] * w;
      t = x1[x1Pos + 224] * w;
      w = enwindow[wp + -9];
      s += x1[x2 + -160] * w;
      t += x1[x1Pos + 160] * w;
      w = enwindow[wp + -8];
      s += x1[x2 + -96] * w;
      t += x1[x1Pos + 96] * w;
      w = enwindow[wp + -7];
      s += x1[x2 + -32] * w;
      t += x1[x1Pos + 32] * w;
      w = enwindow[wp + -6];
      s += x1[x2 + 32] * w;
      t += x1[x1Pos + -32] * w;
      w = enwindow[wp + -5];
      s += x1[x2 + 96] * w;
      t += x1[x1Pos + -96] * w;
      w = enwindow[wp + -4];
      s += x1[x2 + 160] * w;
      t += x1[x1Pos + -160] * w;
      w = enwindow[wp + -3];
      s += x1[x2 + 224] * w;
      t += x1[x1Pos + -224] * w;
      w = enwindow[wp + -2];
      s += x1[x1Pos + -256] * w;
      t -= x1[x2 + 256] * w;
      w = enwindow[wp + -1];
      s += x1[x1Pos + -192] * w;
      t -= x1[x2 + 192] * w;
      w = enwindow[wp + 0];
      s += x1[x1Pos + -128] * w;
      t -= x1[x2 + 128] * w;
      w = enwindow[wp + 1];
      s += x1[x1Pos + -64] * w;
      t -= x1[x2 + 64] * w;
      w = enwindow[wp + 2];
      s += x1[x1Pos + 0] * w;
      t -= x1[x2 + 0] * w;
      w = enwindow[wp + 3];
      s += x1[x1Pos + 64] * w;
      t -= x1[x2 + -64] * w;
      w = enwindow[wp + 4];
      s += x1[x1Pos + 128] * w;
      t -= x1[x2 + -128] * w;
      w = enwindow[wp + 5];
      s += x1[x1Pos + 192] * w;
      t -= x1[x2 + -192] * w;
      s *= enwindow[wp + 6];
      w = t - s;
      a[30 + i * 2] = t + s;
      a[31 + i * 2] = enwindow[wp + 7] * w;
      wp += 18;
      x1Pos--;
      x2++;
    }
    {
      var s, t, u, v;
      t = x1[x1Pos + -16] * enwindow[wp + -10];
      s = x1[x1Pos + -32] * enwindow[wp + -2];
      t += (x1[x1Pos + -48] - x1[x1Pos + 16]) * enwindow[wp + -9];
      s += x1[x1Pos + -96] * enwindow[wp + -1];
      t += (x1[x1Pos + -80] + x1[x1Pos + 48]) * enwindow[wp + -8];
      s += x1[x1Pos + -160] * enwindow[wp + 0];
      t += (x1[x1Pos + -112] - x1[x1Pos + 80]) * enwindow[wp + -7];
      s += x1[x1Pos + -224] * enwindow[wp + 1];
      t += (x1[x1Pos + -144] + x1[x1Pos + 112]) * enwindow[wp + -6];
      s -= x1[x1Pos + 32] * enwindow[wp + 2];
      t += (x1[x1Pos + -176] - x1[x1Pos + 144]) * enwindow[wp + -5];
      s -= x1[x1Pos + 96] * enwindow[wp + 3];
      t += (x1[x1Pos + -208] + x1[x1Pos + 176]) * enwindow[wp + -4];
      s -= x1[x1Pos + 160] * enwindow[wp + 4];
      t += (x1[x1Pos + -240] - x1[x1Pos + 208]) * enwindow[wp + -3];
      s -= x1[x1Pos + 224];
      u = s - t;
      v = s + t;
      t = a[14];
      s = a[15] - t;
      a[31] = v + t;
      a[30] = u + s;
      a[15] = u - s;
      a[14] = v - t;
    }
    {
      var xr;
      xr = a[28] - a[0];
      a[0] += a[28];
      a[28] = xr * enwindow[wp + -2 * 18 + 7];
      xr = a[29] - a[1];
      a[1] += a[29];
      a[29] = xr * enwindow[wp + -2 * 18 + 7];
      xr = a[26] - a[2];
      a[2] += a[26];
      a[26] = xr * enwindow[wp + -4 * 18 + 7];
      xr = a[27] - a[3];
      a[3] += a[27];
      a[27] = xr * enwindow[wp + -4 * 18 + 7];
      xr = a[24] - a[4];
      a[4] += a[24];
      a[24] = xr * enwindow[wp + -6 * 18 + 7];
      xr = a[25] - a[5];
      a[5] += a[25];
      a[25] = xr * enwindow[wp + -6 * 18 + 7];
      xr = a[22] - a[6];
      a[6] += a[22];
      a[22] = xr * Util$4.SQRT2;
      xr = a[23] - a[7];
      a[7] += a[23];
      a[23] = xr * Util$4.SQRT2 - a[7];
      a[7] -= a[6];
      a[22] -= a[7];
      a[23] -= a[22];
      xr = a[6];
      a[6] = a[31] - xr;
      a[31] = a[31] + xr;
      xr = a[7];
      a[7] = a[30] - xr;
      a[30] = a[30] + xr;
      xr = a[22];
      a[22] = a[15] - xr;
      a[15] = a[15] + xr;
      xr = a[23];
      a[23] = a[14] - xr;
      a[14] = a[14] + xr;
      xr = a[20] - a[8];
      a[8] += a[20];
      a[20] = xr * enwindow[wp + -10 * 18 + 7];
      xr = a[21] - a[9];
      a[9] += a[21];
      a[21] = xr * enwindow[wp + -10 * 18 + 7];
      xr = a[18] - a[10];
      a[10] += a[18];
      a[18] = xr * enwindow[wp + -12 * 18 + 7];
      xr = a[19] - a[11];
      a[11] += a[19];
      a[19] = xr * enwindow[wp + -12 * 18 + 7];
      xr = a[16] - a[12];
      a[12] += a[16];
      a[16] = xr * enwindow[wp + -14 * 18 + 7];
      xr = a[17] - a[13];
      a[13] += a[17];
      a[17] = xr * enwindow[wp + -14 * 18 + 7];
      xr = -a[20] + a[24];
      a[20] += a[24];
      a[24] = xr * enwindow[wp + -12 * 18 + 7];
      xr = -a[21] + a[25];
      a[21] += a[25];
      a[25] = xr * enwindow[wp + -12 * 18 + 7];
      xr = a[4] - a[8];
      a[4] += a[8];
      a[8] = xr * enwindow[wp + -12 * 18 + 7];
      xr = a[5] - a[9];
      a[5] += a[9];
      a[9] = xr * enwindow[wp + -12 * 18 + 7];
      xr = a[0] - a[12];
      a[0] += a[12];
      a[12] = xr * enwindow[wp + -4 * 18 + 7];
      xr = a[1] - a[13];
      a[1] += a[13];
      a[13] = xr * enwindow[wp + -4 * 18 + 7];
      xr = a[16] - a[28];
      a[16] += a[28];
      a[28] = xr * enwindow[wp + -4 * 18 + 7];
      xr = -a[17] + a[29];
      a[17] += a[29];
      a[29] = xr * enwindow[wp + -4 * 18 + 7];
      xr = Util$4.SQRT2 * (a[2] - a[10]);
      a[2] += a[10];
      a[10] = xr;
      xr = Util$4.SQRT2 * (a[3] - a[11]);
      a[3] += a[11];
      a[11] = xr;
      xr = Util$4.SQRT2 * (-a[18] + a[26]);
      a[18] += a[26];
      a[26] = xr - a[18];
      xr = Util$4.SQRT2 * (-a[19] + a[27]);
      a[19] += a[27];
      a[27] = xr - a[19];
      xr = a[2];
      a[19] -= a[3];
      a[3] -= xr;
      a[2] = a[31] - xr;
      a[31] += xr;
      xr = a[3];
      a[11] -= a[19];
      a[18] -= xr;
      a[3] = a[30] - xr;
      a[30] += xr;
      xr = a[18];
      a[27] -= a[11];
      a[19] -= xr;
      a[18] = a[15] - xr;
      a[15] += xr;
      xr = a[19];
      a[10] -= xr;
      a[19] = a[14] - xr;
      a[14] += xr;
      xr = a[10];
      a[11] -= xr;
      a[10] = a[23] - xr;
      a[23] += xr;
      xr = a[11];
      a[26] -= xr;
      a[11] = a[22] - xr;
      a[22] += xr;
      xr = a[26];
      a[27] -= xr;
      a[26] = a[7] - xr;
      a[7] += xr;
      xr = a[27];
      a[27] = a[6] - xr;
      a[6] += xr;
      xr = Util$4.SQRT2 * (a[0] - a[4]);
      a[0] += a[4];
      a[4] = xr;
      xr = Util$4.SQRT2 * (a[1] - a[5]);
      a[1] += a[5];
      a[5] = xr;
      xr = Util$4.SQRT2 * (a[16] - a[20]);
      a[16] += a[20];
      a[20] = xr;
      xr = Util$4.SQRT2 * (a[17] - a[21]);
      a[17] += a[21];
      a[21] = xr;
      xr = -Util$4.SQRT2 * (a[8] - a[12]);
      a[8] += a[12];
      a[12] = xr - a[8];
      xr = -Util$4.SQRT2 * (a[9] - a[13]);
      a[9] += a[13];
      a[13] = xr - a[9];
      xr = -Util$4.SQRT2 * (a[25] - a[29]);
      a[25] += a[29];
      a[29] = xr - a[25];
      xr = -Util$4.SQRT2 * (a[24] + a[28]);
      a[24] -= a[28];
      a[28] = xr - a[24];
      xr = a[24] - a[16];
      a[24] = xr;
      xr = a[20] - xr;
      a[20] = xr;
      xr = a[28] - xr;
      a[28] = xr;
      xr = a[25] - a[17];
      a[25] = xr;
      xr = a[21] - xr;
      a[21] = xr;
      xr = a[29] - xr;
      a[29] = xr;
      xr = a[17] - a[1];
      a[17] = xr;
      xr = a[9] - xr;
      a[9] = xr;
      xr = a[25] - xr;
      a[25] = xr;
      xr = a[5] - xr;
      a[5] = xr;
      xr = a[21] - xr;
      a[21] = xr;
      xr = a[13] - xr;
      a[13] = xr;
      xr = a[29] - xr;
      a[29] = xr;
      xr = a[1] - a[0];
      a[1] = xr;
      xr = a[16] - xr;
      a[16] = xr;
      xr = a[17] - xr;
      a[17] = xr;
      xr = a[8] - xr;
      a[8] = xr;
      xr = a[9] - xr;
      a[9] = xr;
      xr = a[24] - xr;
      a[24] = xr;
      xr = a[25] - xr;
      a[25] = xr;
      xr = a[4] - xr;
      a[4] = xr;
      xr = a[5] - xr;
      a[5] = xr;
      xr = a[20] - xr;
      a[20] = xr;
      xr = a[21] - xr;
      a[21] = xr;
      xr = a[12] - xr;
      a[12] = xr;
      xr = a[13] - xr;
      a[13] = xr;
      xr = a[28] - xr;
      a[28] = xr;
      xr = a[29] - xr;
      a[29] = xr;
      xr = a[0];
      a[0] += a[31];
      a[31] -= xr;
      xr = a[1];
      a[1] += a[30];
      a[30] -= xr;
      xr = a[16];
      a[16] += a[15];
      a[15] -= xr;
      xr = a[17];
      a[17] += a[14];
      a[14] -= xr;
      xr = a[8];
      a[8] += a[23];
      a[23] -= xr;
      xr = a[9];
      a[9] += a[22];
      a[22] -= xr;
      xr = a[24];
      a[24] += a[7];
      a[7] -= xr;
      xr = a[25];
      a[25] += a[6];
      a[6] -= xr;
      xr = a[4];
      a[4] += a[27];
      a[27] -= xr;
      xr = a[5];
      a[5] += a[26];
      a[26] -= xr;
      xr = a[20];
      a[20] += a[11];
      a[11] -= xr;
      xr = a[21];
      a[21] += a[10];
      a[10] -= xr;
      xr = a[12];
      a[12] += a[19];
      a[19] -= xr;
      xr = a[13];
      a[13] += a[18];
      a[18] -= xr;
      xr = a[28];
      a[28] += a[3];
      a[3] -= xr;
      xr = a[29];
      a[29] += a[2];
      a[2] -= xr;
    }
  }
  function mdct_short(inout, inoutPos) {
    for (var l = 0; l < 3; l++) {
      var tc0, tc1, tc2, ts0, ts1, ts2;
      ts0 = inout[inoutPos + 2 * 3] * win[Encoder.SHORT_TYPE][0] - inout[inoutPos + 5 * 3];
      tc0 = inout[inoutPos + 0 * 3] * win[Encoder.SHORT_TYPE][2] - inout[inoutPos + 3 * 3];
      tc1 = ts0 + tc0;
      tc2 = ts0 - tc0;
      ts0 = inout[inoutPos + 5 * 3] * win[Encoder.SHORT_TYPE][0] + inout[inoutPos + 2 * 3];
      tc0 = inout[inoutPos + 3 * 3] * win[Encoder.SHORT_TYPE][2] + inout[inoutPos + 0 * 3];
      ts1 = ts0 + tc0;
      ts2 = -ts0 + tc0;
      tc0 = (inout[inoutPos + 1 * 3] * win[Encoder.SHORT_TYPE][1] - inout[inoutPos + 4 * 3]) * 2069978111953089e-26;
      ts0 = (inout[inoutPos + 4 * 3] * win[Encoder.SHORT_TYPE][1] + inout[inoutPos + 1 * 3]) * 2069978111953089e-26;
      inout[inoutPos + 3 * 0] = tc1 * 190752519173728e-25 + tc0;
      inout[inoutPos + 3 * 5] = -ts1 * 190752519173728e-25 + ts0;
      tc2 = tc2 * 0.8660254037844387 * 1907525191737281e-26;
      ts1 = ts1 * 0.5 * 1907525191737281e-26 + ts0;
      inout[inoutPos + 3 * 1] = tc2 - ts1;
      inout[inoutPos + 3 * 2] = tc2 + ts1;
      tc1 = tc1 * 0.5 * 1907525191737281e-26 - tc0;
      ts2 = ts2 * 0.8660254037844387 * 1907525191737281e-26;
      inout[inoutPos + 3 * 3] = tc1 + ts2;
      inout[inoutPos + 3 * 4] = tc1 - ts2;
      inoutPos++;
    }
  }
  function mdct_long(out, outPos, _in) {
    var ct, st;
    {
      var tc1, tc2, tc3, tc4, ts5, ts6, ts7, ts8;
      tc1 = _in[17] - _in[9];
      tc3 = _in[15] - _in[11];
      tc4 = _in[14] - _in[12];
      ts5 = _in[0] + _in[8];
      ts6 = _in[1] + _in[7];
      ts7 = _in[2] + _in[6];
      ts8 = _in[3] + _in[5];
      out[outPos + 17] = ts5 + ts7 - ts8 - (ts6 - _in[4]);
      st = (ts5 + ts7 - ts8) * cx[12 + 7] + (ts6 - _in[4]);
      ct = (tc1 - tc3 - tc4) * cx[12 + 6];
      out[outPos + 5] = ct + st;
      out[outPos + 6] = ct - st;
      tc2 = (_in[16] - _in[10]) * cx[12 + 6];
      ts6 = ts6 * cx[12 + 7] + _in[4];
      ct = tc1 * cx[12 + 0] + tc2 + tc3 * cx[12 + 1] + tc4 * cx[12 + 2];
      st = -ts5 * cx[12 + 4] + ts6 - ts7 * cx[12 + 5] + ts8 * cx[12 + 3];
      out[outPos + 1] = ct + st;
      out[outPos + 2] = ct - st;
      ct = tc1 * cx[12 + 1] - tc2 - tc3 * cx[12 + 2] + tc4 * cx[12 + 0];
      st = -ts5 * cx[12 + 5] + ts6 - ts7 * cx[12 + 3] + ts8 * cx[12 + 4];
      out[outPos + 9] = ct + st;
      out[outPos + 10] = ct - st;
      ct = tc1 * cx[12 + 2] - tc2 + tc3 * cx[12 + 0] - tc4 * cx[12 + 1];
      st = ts5 * cx[12 + 3] - ts6 + ts7 * cx[12 + 4] - ts8 * cx[12 + 5];
      out[outPos + 13] = ct + st;
      out[outPos + 14] = ct - st;
    }
    {
      var ts1, ts2, ts3, ts4, tc5, tc6, tc7, tc8;
      ts1 = _in[8] - _in[0];
      ts3 = _in[6] - _in[2];
      ts4 = _in[5] - _in[3];
      tc5 = _in[17] + _in[9];
      tc6 = _in[16] + _in[10];
      tc7 = _in[15] + _in[11];
      tc8 = _in[14] + _in[12];
      out[outPos + 0] = tc5 + tc7 + tc8 + (tc6 + _in[13]);
      ct = (tc5 + tc7 + tc8) * cx[12 + 7] - (tc6 + _in[13]);
      st = (ts1 - ts3 + ts4) * cx[12 + 6];
      out[outPos + 11] = ct + st;
      out[outPos + 12] = ct - st;
      ts2 = (_in[7] - _in[1]) * cx[12 + 6];
      tc6 = _in[13] - tc6 * cx[12 + 7];
      ct = tc5 * cx[12 + 3] - tc6 + tc7 * cx[12 + 4] + tc8 * cx[12 + 5];
      st = ts1 * cx[12 + 2] + ts2 + ts3 * cx[12 + 0] + ts4 * cx[12 + 1];
      out[outPos + 3] = ct + st;
      out[outPos + 4] = ct - st;
      ct = -tc5 * cx[12 + 5] + tc6 - tc7 * cx[12 + 3] - tc8 * cx[12 + 4];
      st = ts1 * cx[12 + 1] + ts2 - ts3 * cx[12 + 2] - ts4 * cx[12 + 0];
      out[outPos + 7] = ct + st;
      out[outPos + 8] = ct - st;
      ct = -tc5 * cx[12 + 4] + tc6 - tc7 * cx[12 + 5] - tc8 * cx[12 + 3];
      st = ts1 * cx[12 + 0] - ts2 + ts3 * cx[12 + 1] - ts4 * cx[12 + 2];
      out[outPos + 15] = ct + st;
      out[outPos + 16] = ct - st;
    }
  }
  this.mdct_sub48 = function(gfc, w0, w1) {
    var wk = w0;
    var wkPos = 286;
    for (var ch = 0; ch < gfc.channels_out; ch++) {
      for (var gr = 0; gr < gfc.mode_gr; gr++) {
        var band;
        var gi = gfc.l3_side.tt[gr][ch];
        var mdct_enc = gi.xr;
        var mdct_encPos = 0;
        var samp = gfc.sb_sample[ch][1 - gr];
        var sampPos = 0;
        for (var k = 0; k < 18 / 2; k++) {
          window_subband(wk, wkPos, samp[sampPos]);
          window_subband(wk, wkPos + 32, samp[sampPos + 1]);
          sampPos += 2;
          wkPos += 64;
          for (band = 1; band < 32; band += 2) {
            samp[sampPos - 1][band] *= -1;
          }
        }
        for (band = 0; band < 32; band++, mdct_encPos += 18) {
          var type = gi.block_type;
          var band0 = gfc.sb_sample[ch][gr];
          var band1 = gfc.sb_sample[ch][1 - gr];
          if (gi.mixed_block_flag != 0 && band < 2)
            type = 0;
          if (gfc.amp_filter[band] < 1e-12) {
            Arrays$6.fill(mdct_enc, mdct_encPos + 0, mdct_encPos + 18, 0);
          } else {
            if (gfc.amp_filter[band] < 1) {
              for (var k = 0; k < 18; k++) {
                band1[k][order[band]] *= gfc.amp_filter[band];
              }
            }
            if (type == Encoder.SHORT_TYPE) {
              for (var k = -NS / 4; k < 0; k++) {
                var w = win[Encoder.SHORT_TYPE][k + 3];
                mdct_enc[mdct_encPos + k * 3 + 9] = band0[9 + k][order[band]] * w - band0[8 - k][order[band]];
                mdct_enc[mdct_encPos + k * 3 + 18] = band0[14 - k][order[band]] * w + band0[15 + k][order[band]];
                mdct_enc[mdct_encPos + k * 3 + 10] = band0[15 + k][order[band]] * w - band0[14 - k][order[band]];
                mdct_enc[mdct_encPos + k * 3 + 19] = band1[2 - k][order[band]] * w + band1[3 + k][order[band]];
                mdct_enc[mdct_encPos + k * 3 + 11] = band1[3 + k][order[band]] * w - band1[2 - k][order[band]];
                mdct_enc[mdct_encPos + k * 3 + 20] = band1[8 - k][order[band]] * w + band1[9 + k][order[band]];
              }
              mdct_short(mdct_enc, mdct_encPos);
            } else {
              var work = new_float$e(18);
              for (var k = -NL2 / 4; k < 0; k++) {
                var a, b;
                a = win[type][k + 27] * band1[k + 9][order[band]] + win[type][k + 36] * band1[8 - k][order[band]];
                b = win[type][k + 9] * band0[k + 9][order[band]] - win[type][k + 18] * band0[8 - k][order[band]];
                work[k + 9] = a - b * tantab_l[3 + k + 9];
                work[k + 18] = a * tantab_l[3 + k + 9] + b;
              }
              mdct_long(mdct_enc, mdct_encPos, work);
            }
          }
          if (type != Encoder.SHORT_TYPE && band != 0) {
            for (var k = 7; k >= 0; --k) {
              var bu, bd;
              bu = mdct_enc[mdct_encPos + k] * ca[20 + k] + mdct_enc[mdct_encPos + -1 - k] * cs[28 + k];
              bd = mdct_enc[mdct_encPos + k] * cs[28 + k] - mdct_enc[mdct_encPos + -1 - k] * ca[20 + k];
              mdct_enc[mdct_encPos + -1 - k] = bu;
              mdct_enc[mdct_encPos + k] = bd;
            }
          }
        }
      }
      wk = w1;
      wkPos = 286;
      if (gfc.mode_gr == 1) {
        for (var i = 0; i < 18; i++) {
          System$9.arraycopy(
            gfc.sb_sample[ch][1][i],
            0,
            gfc.sb_sample[ch][0][i],
            0,
            32
          );
        }
      }
    }
  };
}
var System$8 = common.System;
var new_float$d = common.new_float;
var new_float_n$5 = common.new_float_n;
function III_psy_xmin() {
  this.l = new_float$d(Encoder.SBMAX_l);
  this.s = new_float_n$5([Encoder.SBMAX_s, 3]);
  var self2 = this;
  this.assign = function(iii_psy_xmin) {
    System$8.arraycopy(iii_psy_xmin.l, 0, self2.l, 0, Encoder.SBMAX_l);
    for (var i = 0; i < Encoder.SBMAX_s; i++) {
      for (var j = 0; j < 3; j++) {
        self2.s[i][j] = iii_psy_xmin.s[i][j];
      }
    }
  };
}
function III_psy_ratio() {
  this.thm = new III_psy_xmin();
  this.en = new III_psy_xmin();
}
function MPEGMode(ordinal) {
  var _ordinal = ordinal;
  this.ordinal = function() {
    return _ordinal;
  };
}
MPEGMode.STEREO = new MPEGMode(0);
MPEGMode.JOINT_STEREO = new MPEGMode(1);
MPEGMode.DUAL_CHANNEL = new MPEGMode(2);
MPEGMode.MONO = new MPEGMode(3);
MPEGMode.NOT_SET = new MPEGMode(4);
var System$7 = common.System;
var VbrMode$6 = common.VbrMode;
var new_array_n = common.new_array_n;
var new_float$c = common.new_float;
var new_float_n$4 = common.new_float_n;
var new_int$c = common.new_int;
var assert$a = common.assert;
Encoder.ENCDELAY = 576;
Encoder.POSTDELAY = 1152;
Encoder.MDCTDELAY = 48;
Encoder.FFTOFFSET = 224 + Encoder.MDCTDELAY;
Encoder.DECDELAY = 528;
Encoder.SBLIMIT = 32;
Encoder.CBANDS = 64;
Encoder.SBPSY_l = 21;
Encoder.SBPSY_s = 12;
Encoder.SBMAX_l = 22;
Encoder.SBMAX_s = 13;
Encoder.PSFB21 = 6;
Encoder.PSFB12 = 6;
Encoder.BLKSIZE = 1024;
Encoder.HBLKSIZE = Encoder.BLKSIZE / 2 + 1;
Encoder.BLKSIZE_s = 256;
Encoder.HBLKSIZE_s = Encoder.BLKSIZE_s / 2 + 1;
Encoder.NORM_TYPE = 0;
Encoder.START_TYPE = 1;
Encoder.SHORT_TYPE = 2;
Encoder.STOP_TYPE = 3;
Encoder.MPG_MD_LR_LR = 0;
Encoder.MPG_MD_LR_I = 1;
Encoder.MPG_MD_MS_LR = 2;
Encoder.MPG_MD_MS_I = 3;
Encoder.fircoef = [
  -0.0207887 * 5,
  -0.0378413 * 5,
  -0.0432472 * 5,
  -0.031183 * 5,
  779609e-23 * 5,
  0.0467745 * 5,
  0.10091 * 5,
  0.151365 * 5,
  0.187098 * 5
];
function Encoder() {
  var FFTOFFSET = Encoder.FFTOFFSET;
  var MPG_MD_MS_LR = Encoder.MPG_MD_MS_LR;
  var bs = null;
  this.psy = null;
  var psy = null;
  var vbr = null;
  var qupvt = null;
  this.setModules = function(_bs, _psy, _qupvt, _vbr) {
    bs = _bs;
    this.psy = _psy;
    psy = _psy;
    vbr = _vbr;
    qupvt = _qupvt;
  };
  var newMDCT = new NewMDCT();
  function adjust_ATH(gfc) {
    var gr2_max, max_pow;
    if (gfc.ATH.useAdjust == 0) {
      gfc.ATH.adjust = 1;
      return;
    }
    max_pow = gfc.loudness_sq[0][0];
    gr2_max = gfc.loudness_sq[1][0];
    if (gfc.channels_out == 2) {
      max_pow += gfc.loudness_sq[0][1];
      gr2_max += gfc.loudness_sq[1][1];
    } else {
      max_pow += max_pow;
      gr2_max += gr2_max;
    }
    if (gfc.mode_gr == 2) {
      max_pow = Math.max(max_pow, gr2_max);
    }
    max_pow *= 0.5;
    max_pow *= gfc.ATH.aaSensitivityP;
    if (max_pow > 0.03125) {
      if (gfc.ATH.adjust >= 1) {
        gfc.ATH.adjust = 1;
      } else {
        if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
          gfc.ATH.adjust = gfc.ATH.adjustLimit;
        }
      }
      gfc.ATH.adjustLimit = 1;
    } else {
      var adj_lim_new = 31.98 * max_pow + 625e-6;
      if (gfc.ATH.adjust >= adj_lim_new) {
        gfc.ATH.adjust *= adj_lim_new * 0.075 + 0.925;
        if (gfc.ATH.adjust < adj_lim_new) {
          gfc.ATH.adjust = adj_lim_new;
        }
      } else {
        if (gfc.ATH.adjustLimit >= adj_lim_new) {
          gfc.ATH.adjust = adj_lim_new;
        } else {
          if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
            gfc.ATH.adjust = gfc.ATH.adjustLimit;
          }
        }
      }
      gfc.ATH.adjustLimit = adj_lim_new;
    }
  }
  function updateStats(gfc) {
    var gr, ch;
    assert$a(gfc.bitrate_index >= 0 && gfc.bitrate_index < 16);
    assert$a(gfc.mode_ext >= 0 && gfc.mode_ext < 4);
    gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][4]++;
    gfc.bitrate_stereoMode_Hist[15][4]++;
    if (gfc.channels_out == 2) {
      gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][gfc.mode_ext]++;
      gfc.bitrate_stereoMode_Hist[15][gfc.mode_ext]++;
    }
    for (gr = 0; gr < gfc.mode_gr; ++gr) {
      for (ch = 0; ch < gfc.channels_out; ++ch) {
        var bt = gfc.l3_side.tt[gr][ch].block_type | 0;
        if (gfc.l3_side.tt[gr][ch].mixed_block_flag != 0)
          bt = 4;
        gfc.bitrate_blockType_Hist[gfc.bitrate_index][bt]++;
        gfc.bitrate_blockType_Hist[gfc.bitrate_index][5]++;
        gfc.bitrate_blockType_Hist[15][bt]++;
        gfc.bitrate_blockType_Hist[15][5]++;
      }
    }
  }
  function lame_encode_frame_init(gfp, inbuf) {
    var gfc = gfp.internal_flags;
    var ch, gr;
    if (gfc.lame_encode_frame_init == 0) {
      var i, j;
      var primebuff0 = new_float$c(286 + 1152 + 576);
      var primebuff1 = new_float$c(286 + 1152 + 576);
      gfc.lame_encode_frame_init = 1;
      for (i = 0, j = 0; i < 286 + 576 * (1 + gfc.mode_gr); ++i) {
        if (i < 576 * gfc.mode_gr) {
          primebuff0[i] = 0;
          if (gfc.channels_out == 2)
            primebuff1[i] = 0;
        } else {
          primebuff0[i] = inbuf[0][j];
          if (gfc.channels_out == 2)
            primebuff1[i] = inbuf[1][j];
          ++j;
        }
      }
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          gfc.l3_side.tt[gr][ch].block_type = Encoder.SHORT_TYPE;
        }
      }
      newMDCT.mdct_sub48(gfc, primebuff0, primebuff1);
      assert$a(gfc.mf_size >= Encoder.BLKSIZE + gfp.framesize - Encoder.FFTOFFSET);
      assert$a(gfc.mf_size >= 512 + gfp.framesize - 32);
    }
  }
  this.lame_encode_mp3_frame = function(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
    var mp3count;
    var masking_LR = new_array_n([2, 2]);
    masking_LR[0][0] = new III_psy_ratio();
    masking_LR[0][1] = new III_psy_ratio();
    masking_LR[1][0] = new III_psy_ratio();
    masking_LR[1][1] = new III_psy_ratio();
    var masking_MS = new_array_n([2, 2]);
    masking_MS[0][0] = new III_psy_ratio();
    masking_MS[0][1] = new III_psy_ratio();
    masking_MS[1][0] = new III_psy_ratio();
    masking_MS[1][1] = new III_psy_ratio();
    var masking;
    var inbuf = [null, null];
    var gfc = gfp.internal_flags;
    var tot_ener = new_float_n$4([2, 4]);
    var ms_ener_ratio = [0.5, 0.5];
    var pe = [
      [0, 0],
      [0, 0]
    ];
    var pe_MS = [
      [0, 0],
      [0, 0]
    ];
    var pe_use;
    var ch, gr;
    inbuf[0] = inbuf_l;
    inbuf[1] = inbuf_r;
    if (gfc.lame_encode_frame_init == 0) {
      lame_encode_frame_init(gfp, inbuf);
    }
    gfc.padding = 0;
    if ((gfc.slot_lag -= gfc.frac_SpF) < 0) {
      gfc.slot_lag += gfp.out_samplerate;
      gfc.padding = 1;
    }
    if (gfc.psymodel != 0) {
      var ret;
      var bufp = [null, null];
      var bufpPos = 0;
      var blocktype = new_int$c(2);
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          bufp[ch] = inbuf[ch];
          bufpPos = 576 + gr * 576 - Encoder.FFTOFFSET;
        }
        if (gfp.VBR == VbrMode$6.vbr_mtrh || gfp.VBR == VbrMode$6.vbr_mt) {
          ret = psy.L3psycho_anal_vbr(
            gfp,
            bufp,
            bufpPos,
            gr,
            masking_LR,
            masking_MS,
            pe[gr],
            pe_MS[gr],
            tot_ener[gr],
            blocktype
          );
        } else {
          ret = psy.L3psycho_anal_ns(
            gfp,
            bufp,
            bufpPos,
            gr,
            masking_LR,
            masking_MS,
            pe[gr],
            pe_MS[gr],
            tot_ener[gr],
            blocktype
          );
        }
        if (ret != 0)
          return -4;
        if (gfp.mode == MPEGMode.JOINT_STEREO) {
          ms_ener_ratio[gr] = tot_ener[gr][2] + tot_ener[gr][3];
          if (ms_ener_ratio[gr] > 0) {
            ms_ener_ratio[gr] = tot_ener[gr][3] / ms_ener_ratio[gr];
          }
        }
        for (ch = 0; ch < gfc.channels_out; ch++) {
          var cod_info = gfc.l3_side.tt[gr][ch];
          cod_info.block_type = blocktype[ch];
          cod_info.mixed_block_flag = 0;
        }
      }
    } else {
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          gfc.l3_side.tt[gr][ch].block_type = Encoder.NORM_TYPE;
          gfc.l3_side.tt[gr][ch].mixed_block_flag = 0;
          pe_MS[gr][ch] = pe[gr][ch] = 700;
        }
      }
    }
    adjust_ATH(gfc);
    newMDCT.mdct_sub48(gfc, inbuf[0], inbuf[1]);
    gfc.mode_ext = Encoder.MPG_MD_LR_LR;
    if (gfp.force_ms) {
      gfc.mode_ext = Encoder.MPG_MD_MS_LR;
    } else if (gfp.mode == MPEGMode.JOINT_STEREO) {
      var sum_pe_MS = 0;
      var sum_pe_LR = 0;
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          sum_pe_MS += pe_MS[gr][ch];
          sum_pe_LR += pe[gr][ch];
        }
      }
      if (sum_pe_MS <= 1 * sum_pe_LR) {
        var gi0 = gfc.l3_side.tt[0];
        var gi1 = gfc.l3_side.tt[gfc.mode_gr - 1];
        if (gi0[0].block_type == gi0[1].block_type && gi1[0].block_type == gi1[1].block_type) {
          gfc.mode_ext = Encoder.MPG_MD_MS_LR;
        }
      }
    }
    if (gfc.mode_ext == MPG_MD_MS_LR) {
      masking = masking_MS;
      pe_use = pe_MS;
    } else {
      masking = masking_LR;
      pe_use = pe;
    }
    if (gfp.analysis && gfc.pinfo != null) {
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          gfc.pinfo.ms_ratio[gr] = gfc.ms_ratio[gr];
          gfc.pinfo.ms_ener_ratio[gr] = ms_ener_ratio[gr];
          gfc.pinfo.blocktype[gr][ch] = gfc.l3_side.tt[gr][ch].block_type;
          gfc.pinfo.pe[gr][ch] = pe_use[gr][ch];
          System$7.arraycopy(
            gfc.l3_side.tt[gr][ch].xr,
            0,
            gfc.pinfo.xr[gr][ch],
            0,
            576
          );
          if (gfc.mode_ext == MPG_MD_MS_LR) {
            gfc.pinfo.ers[gr][ch] = gfc.pinfo.ers[gr][ch + 2];
            System$7.arraycopy(
              gfc.pinfo.energy[gr][ch + 2],
              0,
              gfc.pinfo.energy[gr][ch],
              0,
              gfc.pinfo.energy[gr][ch].length
            );
          }
        }
      }
    }
    if (gfp.VBR == VbrMode$6.vbr_off || gfp.VBR == VbrMode$6.vbr_abr) {
      var i;
      var f;
      for (i = 0; i < 18; i++)
        gfc.nsPsy.pefirbuf[i] = gfc.nsPsy.pefirbuf[i + 1];
      f = 0;
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++)
          f += pe_use[gr][ch];
      }
      gfc.nsPsy.pefirbuf[18] = f;
      f = gfc.nsPsy.pefirbuf[9];
      for (i = 0; i < 9; i++) {
        f += (gfc.nsPsy.pefirbuf[i] + gfc.nsPsy.pefirbuf[18 - i]) * Encoder.fircoef[i];
      }
      f = 670 * 5 * gfc.mode_gr * gfc.channels_out / f;
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          pe_use[gr][ch] *= f;
        }
      }
    }
    gfc.iteration_loop.iteration_loop(gfp, pe_use, ms_ener_ratio, masking);
    bs.format_bitstream(gfp);
    mp3count = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 1);
    if (gfp.bWriteVbrTag)
      vbr.addVbrFrame(gfp);
    if (gfp.analysis && gfc.pinfo != null) {
      for (ch = 0; ch < gfc.channels_out; ch++) {
        var j;
        for (j = 0; j < FFTOFFSET; j++) {
          gfc.pinfo.pcmdata[ch][j] = gfc.pinfo.pcmdata[ch][j + gfp.framesize];
        }
        for (j = FFTOFFSET; j < 1600; j++) {
          gfc.pinfo.pcmdata[ch][j] = inbuf[ch][j - FFTOFFSET];
        }
      }
      qupvt.set_frame_pinfo(gfp, masking);
    }
    updateStats(gfc);
    return mp3count;
  };
}
var Util$3 = common.Util;
var new_float$b = common.new_float;
function FFT() {
  var window2 = new_float$b(Encoder.BLKSIZE);
  var window_s = new_float$b(Encoder.BLKSIZE_s / 2);
  var costab = [
    0.9238795325112867,
    0.3826834323650898,
    0.9951847266721969,
    0.0980171403295606,
    0.9996988186962042,
    0.02454122852291229,
    0.9999811752826011,
    0.006135884649154475
  ];
  function fht(fz, fzPos, n) {
    var tri = 0;
    var k4;
    var fi;
    var gi;
    n <<= 1;
    var fn = fzPos + n;
    k4 = 4;
    do {
      var s1, c1;
      var i, k1, k2, k3, kx;
      kx = k4 >> 1;
      k1 = k4;
      k2 = k4 << 1;
      k3 = k2 + k1;
      k4 = k2 << 1;
      fi = fzPos;
      gi = fi + kx;
      do {
        var f0, f1, f2, f3;
        f1 = fz[fi + 0] - fz[fi + k1];
        f0 = fz[fi + 0] + fz[fi + k1];
        f3 = fz[fi + k2] - fz[fi + k3];
        f2 = fz[fi + k2] + fz[fi + k3];
        fz[fi + k2] = f0 - f2;
        fz[fi + 0] = f0 + f2;
        fz[fi + k3] = f1 - f3;
        fz[fi + k1] = f1 + f3;
        f1 = fz[gi + 0] - fz[gi + k1];
        f0 = fz[gi + 0] + fz[gi + k1];
        f3 = Util$3.SQRT2 * fz[gi + k3];
        f2 = Util$3.SQRT2 * fz[gi + k2];
        fz[gi + k2] = f0 - f2;
        fz[gi + 0] = f0 + f2;
        fz[gi + k3] = f1 - f3;
        fz[gi + k1] = f1 + f3;
        gi += k4;
        fi += k4;
      } while (fi < fn);
      c1 = costab[tri + 0];
      s1 = costab[tri + 1];
      for (i = 1; i < kx; i++) {
        var c2, s2;
        c2 = 1 - 2 * s1 * s1;
        s2 = 2 * s1 * c1;
        fi = fzPos + i;
        gi = fzPos + k1 - i;
        do {
          var a, b, g0, f0, f1, g1, f2, g2, f3, g3;
          b = s2 * fz[fi + k1] - c2 * fz[gi + k1];
          a = c2 * fz[fi + k1] + s2 * fz[gi + k1];
          f1 = fz[fi + 0] - a;
          f0 = fz[fi + 0] + a;
          g1 = fz[gi + 0] - b;
          g0 = fz[gi + 0] + b;
          b = s2 * fz[fi + k3] - c2 * fz[gi + k3];
          a = c2 * fz[fi + k3] + s2 * fz[gi + k3];
          f3 = fz[fi + k2] - a;
          f2 = fz[fi + k2] + a;
          g3 = fz[gi + k2] - b;
          g2 = fz[gi + k2] + b;
          b = s1 * f2 - c1 * g3;
          a = c1 * f2 + s1 * g3;
          fz[fi + k2] = f0 - a;
          fz[fi + 0] = f0 + a;
          fz[gi + k3] = g1 - b;
          fz[gi + k1] = g1 + b;
          b = c1 * g2 - s1 * f3;
          a = s1 * g2 + c1 * f3;
          fz[gi + k2] = g0 - a;
          fz[gi + 0] = g0 + a;
          fz[fi + k3] = f1 - b;
          fz[fi + k1] = f1 + b;
          gi += k4;
          fi += k4;
        } while (fi < fn);
        c2 = c1;
        c1 = c2 * costab[tri + 0] - s1 * costab[tri + 1];
        s1 = c2 * costab[tri + 1] + s1 * costab[tri + 0];
      }
      tri += 2;
    } while (k4 < n);
  }
  var rv_tbl = [
    0,
    128,
    64,
    192,
    32,
    160,
    96,
    224,
    16,
    144,
    80,
    208,
    48,
    176,
    112,
    240,
    8,
    136,
    72,
    200,
    40,
    168,
    104,
    232,
    24,
    152,
    88,
    216,
    56,
    184,
    120,
    248,
    4,
    132,
    68,
    196,
    36,
    164,
    100,
    228,
    20,
    148,
    84,
    212,
    52,
    180,
    116,
    244,
    12,
    140,
    76,
    204,
    44,
    172,
    108,
    236,
    28,
    156,
    92,
    220,
    60,
    188,
    124,
    252,
    2,
    130,
    66,
    194,
    34,
    162,
    98,
    226,
    18,
    146,
    82,
    210,
    50,
    178,
    114,
    242,
    10,
    138,
    74,
    202,
    42,
    170,
    106,
    234,
    26,
    154,
    90,
    218,
    58,
    186,
    122,
    250,
    6,
    134,
    70,
    198,
    38,
    166,
    102,
    230,
    22,
    150,
    86,
    214,
    54,
    182,
    118,
    246,
    14,
    142,
    78,
    206,
    46,
    174,
    110,
    238,
    30,
    158,
    94,
    222,
    62,
    190,
    126,
    254
  ];
  this.fft_short = function(gfc, x_real, chn, buffer, bufPos) {
    for (var b = 0; b < 3; b++) {
      var x = Encoder.BLKSIZE_s / 2;
      var k = 65535 & 576 / 3 * (b + 1);
      var j = Encoder.BLKSIZE_s / 8 - 1;
      do {
        var f0, f1, f2, f3, w;
        var i = rv_tbl[j << 2] & 255;
        f0 = window_s[i] * buffer[chn][bufPos + i + k];
        w = window_s[127 - i] * buffer[chn][bufPos + i + k + 128];
        f1 = f0 - w;
        f0 = f0 + w;
        f2 = window_s[i + 64] * buffer[chn][bufPos + i + k + 64];
        w = window_s[63 - i] * buffer[chn][bufPos + i + k + 192];
        f3 = f2 - w;
        f2 = f2 + w;
        x -= 4;
        x_real[b][x + 0] = f0 + f2;
        x_real[b][x + 2] = f0 - f2;
        x_real[b][x + 1] = f1 + f3;
        x_real[b][x + 3] = f1 - f3;
        f0 = window_s[i + 1] * buffer[chn][bufPos + i + k + 1];
        w = window_s[126 - i] * buffer[chn][bufPos + i + k + 129];
        f1 = f0 - w;
        f0 = f0 + w;
        f2 = window_s[i + 65] * buffer[chn][bufPos + i + k + 65];
        w = window_s[62 - i] * buffer[chn][bufPos + i + k + 193];
        f3 = f2 - w;
        f2 = f2 + w;
        x_real[b][x + Encoder.BLKSIZE_s / 2 + 0] = f0 + f2;
        x_real[b][x + Encoder.BLKSIZE_s / 2 + 2] = f0 - f2;
        x_real[b][x + Encoder.BLKSIZE_s / 2 + 1] = f1 + f3;
        x_real[b][x + Encoder.BLKSIZE_s / 2 + 3] = f1 - f3;
      } while (--j >= 0);
      fht(x_real[b], x, Encoder.BLKSIZE_s / 2);
    }
  };
  this.fft_long = function(gfc, y, chn, buffer, bufPos) {
    var jj = Encoder.BLKSIZE / 8 - 1;
    var x = Encoder.BLKSIZE / 2;
    do {
      var f0, f1, f2, f3, w;
      var i = rv_tbl[jj] & 255;
      f0 = window2[i] * buffer[chn][bufPos + i];
      w = window2[i + 512] * buffer[chn][bufPos + i + 512];
      f1 = f0 - w;
      f0 = f0 + w;
      f2 = window2[i + 256] * buffer[chn][bufPos + i + 256];
      w = window2[i + 768] * buffer[chn][bufPos + i + 768];
      f3 = f2 - w;
      f2 = f2 + w;
      x -= 4;
      y[x + 0] = f0 + f2;
      y[x + 2] = f0 - f2;
      y[x + 1] = f1 + f3;
      y[x + 3] = f1 - f3;
      f0 = window2[i + 1] * buffer[chn][bufPos + i + 1];
      w = window2[i + 513] * buffer[chn][bufPos + i + 513];
      f1 = f0 - w;
      f0 = f0 + w;
      f2 = window2[i + 257] * buffer[chn][bufPos + i + 257];
      w = window2[i + 769] * buffer[chn][bufPos + i + 769];
      f3 = f2 - w;
      f2 = f2 + w;
      y[x + Encoder.BLKSIZE / 2 + 0] = f0 + f2;
      y[x + Encoder.BLKSIZE / 2 + 2] = f0 - f2;
      y[x + Encoder.BLKSIZE / 2 + 1] = f1 + f3;
      y[x + Encoder.BLKSIZE / 2 + 3] = f1 - f3;
    } while (--jj >= 0);
    fht(y, x, Encoder.BLKSIZE / 2);
  };
  this.init_fft = function(gfc) {
    for (var i = 0; i < Encoder.BLKSIZE; i++) {
      window2[i] = 0.42 - 0.5 * Math.cos(2 * Math.PI * (i + 0.5) / Encoder.BLKSIZE) + 0.08 * Math.cos(4 * Math.PI * (i + 0.5) / Encoder.BLKSIZE);
    }
    for (var i = 0; i < Encoder.BLKSIZE_s / 2; i++) {
      window_s[i] = 0.5 * (1 - Math.cos(2 * Math.PI * (i + 0.5) / Encoder.BLKSIZE_s));
    }
  };
}
var VbrMode$5 = common.VbrMode;
var Float$1 = common.Float;
var ShortBlock$2 = common.ShortBlock;
var Util$2 = common.Util;
var Arrays$5 = common.Arrays;
var new_float$a = common.new_float;
var new_float_n$3 = common.new_float_n;
var new_int$b = common.new_int;
var assert$9 = common.assert;
function PsyModel() {
  var fft = new FFT();
  var LOG10 = 2.302585092994046;
  var rpelev = 2;
  var rpelev2 = 16;
  var rpelev_s = 2;
  var rpelev2_s = 16;
  var DELBARK = 0.34;
  var VO_SCALE = 1 / (14752 * 14752) / (Encoder.BLKSIZE / 2);
  var temporalmask_sustain_sec = 0.01;
  var NS_PREECHO_ATT0 = 0.8;
  var NS_PREECHO_ATT1 = 0.6;
  var NS_PREECHO_ATT2 = 0.3;
  var NS_MSFIX = 3.5;
  var NSFIRLEN = 21;
  var LN_TO_LOG10 = 0.2302585093;
  function NON_LINEAR_SCALE_ENERGY(x) {
    return x;
  }
  function psycho_loudness_approx(energy, gfc) {
    var loudness_power = 0;
    for (var i = 0; i < Encoder.BLKSIZE / 2; ++i) {
      loudness_power += energy[i] * gfc.ATH.eql_w[i];
    }
    loudness_power *= VO_SCALE;
    return loudness_power;
  }
  function compute_ffts(gfp, fftenergy, fftenergy_s, wsamp_l, wsamp_lPos, wsamp_s, wsamp_sPos, gr_out, chn, buffer, bufPos) {
    var gfc = gfp.internal_flags;
    if (chn < 2) {
      fft.fft_long(gfc, wsamp_l[wsamp_lPos], chn, buffer, bufPos);
      fft.fft_short(gfc, wsamp_s[wsamp_sPos], chn, buffer, bufPos);
    } else if (chn == 2) {
      for (var j = Encoder.BLKSIZE - 1; j >= 0; --j) {
        var l = wsamp_l[wsamp_lPos + 0][j];
        var r = wsamp_l[wsamp_lPos + 1][j];
        wsamp_l[wsamp_lPos + 0][j] = (l + r) * Util$2.SQRT2 * 0.5;
        wsamp_l[wsamp_lPos + 1][j] = (l - r) * Util$2.SQRT2 * 0.5;
      }
      for (var b = 2; b >= 0; --b) {
        for (var j = Encoder.BLKSIZE_s - 1; j >= 0; --j) {
          var l = wsamp_s[wsamp_sPos + 0][b][j];
          var r = wsamp_s[wsamp_sPos + 1][b][j];
          wsamp_s[wsamp_sPos + 0][b][j] = (l + r) * Util$2.SQRT2 * 0.5;
          wsamp_s[wsamp_sPos + 1][b][j] = (l - r) * Util$2.SQRT2 * 0.5;
        }
      }
    }
    fftenergy[0] = NON_LINEAR_SCALE_ENERGY(wsamp_l[wsamp_lPos + 0][0]);
    fftenergy[0] *= fftenergy[0];
    for (var j = Encoder.BLKSIZE / 2 - 1; j >= 0; --j) {
      var re = wsamp_l[wsamp_lPos + 0][Encoder.BLKSIZE / 2 - j];
      var im = wsamp_l[wsamp_lPos + 0][Encoder.BLKSIZE / 2 + j];
      fftenergy[Encoder.BLKSIZE / 2 - j] = NON_LINEAR_SCALE_ENERGY(
        (re * re + im * im) * 0.5
      );
    }
    for (var b = 2; b >= 0; --b) {
      fftenergy_s[b][0] = wsamp_s[wsamp_sPos + 0][b][0];
      fftenergy_s[b][0] *= fftenergy_s[b][0];
      for (var j = Encoder.BLKSIZE_s / 2 - 1; j >= 0; --j) {
        var re = wsamp_s[wsamp_sPos + 0][b][Encoder.BLKSIZE_s / 2 - j];
        var im = wsamp_s[wsamp_sPos + 0][b][Encoder.BLKSIZE_s / 2 + j];
        fftenergy_s[b][Encoder.BLKSIZE_s / 2 - j] = NON_LINEAR_SCALE_ENERGY(
          (re * re + im * im) * 0.5
        );
      }
    }
    {
      var totalenergy = 0;
      for (var j = 11; j < Encoder.HBLKSIZE; j++)
        totalenergy += fftenergy[j];
      gfc.tot_ener[chn] = totalenergy;
    }
    if (gfp.analysis) {
      for (var j = 0; j < Encoder.HBLKSIZE; j++) {
        gfc.pinfo.energy[gr_out][chn][j] = gfc.pinfo.energy_save[chn][j];
        gfc.pinfo.energy_save[chn][j] = fftenergy[j];
      }
      gfc.pinfo.pe[gr_out][chn] = gfc.pe[chn];
    }
    if (gfp.athaa_loudapprox == 2 && chn < 2) {
      gfc.loudness_sq[gr_out][chn] = gfc.loudness_sq_save[chn];
      gfc.loudness_sq_save[chn] = psycho_loudness_approx(fftenergy, gfc);
    }
  }
  var I1LIMIT = 8;
  var I2LIMIT = 23;
  var MLIMIT = 15;
  var ma_max_i1;
  var ma_max_i2;
  var ma_max_m;
  var tab = [
    1,
    0.79433,
    0.63096,
    0.63096,
    0.63096,
    0.63096,
    0.63096,
    0.25119,
    0.11749
  ];
  function init_mask_add_max_values() {
    ma_max_i1 = Math.pow(10, (I1LIMIT + 1) / 16);
    ma_max_i2 = Math.pow(10, (I2LIMIT + 1) / 16);
    ma_max_m = Math.pow(10, MLIMIT / 10);
  }
  var table1 = [
    3.3246 * 3.3246,
    3.23837 * 3.23837,
    3.15437 * 3.15437,
    3.00412 * 3.00412,
    2.86103 * 2.86103,
    2.65407 * 2.65407,
    2.46209 * 2.46209,
    2.284 * 2.284,
    2.11879 * 2.11879,
    1.96552 * 1.96552,
    1.82335 * 1.82335,
    1.69146 * 1.69146,
    1.56911 * 1.56911,
    1.46658 * 1.46658,
    1.37074 * 1.37074,
    1.31036 * 1.31036,
    1.25264 * 1.25264,
    1.20648 * 1.20648,
    1.16203 * 1.16203,
    1.12765 * 1.12765,
    1.09428 * 1.09428,
    1.0659 * 1.0659,
    1.03826 * 1.03826,
    1.01895 * 1.01895,
    1
  ];
  var table2 = [
    1.33352 * 1.33352,
    1.35879 * 1.35879,
    1.38454 * 1.38454,
    1.39497 * 1.39497,
    1.40548 * 1.40548,
    1.3537 * 1.3537,
    1.30382 * 1.30382,
    1.22321 * 1.22321,
    1.14758 * 1.14758,
    1
  ];
  var table3 = [
    2.35364 * 2.35364,
    2.29259 * 2.29259,
    2.23313 * 2.23313,
    2.12675 * 2.12675,
    2.02545 * 2.02545,
    1.87894 * 1.87894,
    1.74303 * 1.74303,
    1.61695 * 1.61695,
    1.49999 * 1.49999,
    1.39148 * 1.39148,
    1.29083 * 1.29083,
    1.19746 * 1.19746,
    1.11084 * 1.11084,
    1.03826 * 1.03826
  ];
  function mask_add(m1, m2, kk, b, gfc, shortblock) {
    var ratio;
    if (m2 > m1) {
      if (m2 < m1 * ma_max_i2)
        ratio = m2 / m1;
      else
        return m1 + m2;
    } else {
      if (m1 >= m2 * ma_max_i2)
        return m1 + m2;
      ratio = m1 / m2;
    }
    m1 += m2;
    if (b + 3 <= 3 + 3) {
      if (ratio >= ma_max_i1) {
        return m1;
      }
      var i = 0 | Util$2.FAST_LOG10_X(ratio, 16);
      return m1 * table2[i];
    }
    var i = 0 | Util$2.FAST_LOG10_X(ratio, 16);
    if (shortblock != 0) {
      m2 = gfc.ATH.cb_s[kk] * gfc.ATH.adjust;
    } else {
      m2 = gfc.ATH.cb_l[kk] * gfc.ATH.adjust;
    }
    if (m1 < ma_max_m * m2) {
      if (m1 > m2) {
        var f, r;
        f = 1;
        if (i <= 13)
          f = table3[i];
        r = Util$2.FAST_LOG10_X(m1 / m2, 10 / 15);
        return m1 * ((table1[i] - f) * r + f);
      }
      if (i > 13)
        return m1;
      return m1 * table3[i];
    }
    return m1 * table1[i];
  }
  var table2_ = [
    1.33352 * 1.33352,
    1.35879 * 1.35879,
    1.38454 * 1.38454,
    1.39497 * 1.39497,
    1.40548 * 1.40548,
    1.3537 * 1.3537,
    1.30382 * 1.30382,
    1.22321 * 1.22321,
    1.14758 * 1.14758,
    1
  ];
  function vbrpsy_mask_add(m1, m2, b) {
    var ratio;
    if (m1 < 0) {
      m1 = 0;
    }
    if (m2 < 0) {
      m2 = 0;
    }
    if (m1 <= 0) {
      return m2;
    }
    if (m2 <= 0) {
      return m1;
    }
    if (m2 > m1) {
      ratio = m2 / m1;
    } else {
      ratio = m1 / m2;
    }
    if (b >= -2 && b <= 2) {
      if (ratio >= ma_max_i1) {
        return m1 + m2;
      } else {
        var i = 0 | Util$2.FAST_LOG10_X(ratio, 16);
        return (m1 + m2) * table2_[i];
      }
    }
    if (ratio < ma_max_i2) {
      return m1 + m2;
    }
    if (m1 < m2) {
      m1 = m2;
    }
    return m1;
  }
  function calc_interchannel_masking(gfp, ratio) {
    var gfc = gfp.internal_flags;
    if (gfc.channels_out > 1) {
      for (var sb = 0; sb < Encoder.SBMAX_l; sb++) {
        var l = gfc.thm[0].l[sb];
        var r = gfc.thm[1].l[sb];
        gfc.thm[0].l[sb] += r * ratio;
        gfc.thm[1].l[sb] += l * ratio;
      }
      for (var sb = 0; sb < Encoder.SBMAX_s; sb++) {
        for (var sblock = 0; sblock < 3; sblock++) {
          var l = gfc.thm[0].s[sb][sblock];
          var r = gfc.thm[1].s[sb][sblock];
          gfc.thm[0].s[sb][sblock] += r * ratio;
          gfc.thm[1].s[sb][sblock] += l * ratio;
        }
      }
    }
  }
  function msfix1(gfc) {
    for (var sb = 0; sb < Encoder.SBMAX_l; sb++) {
      if (gfc.thm[0].l[sb] > 1.58 * gfc.thm[1].l[sb] || gfc.thm[1].l[sb] > 1.58 * gfc.thm[0].l[sb]) {
        continue;
      }
      var mld = gfc.mld_l[sb] * gfc.en[3].l[sb];
      var rmid = Math.max(gfc.thm[2].l[sb], Math.min(gfc.thm[3].l[sb], mld));
      mld = gfc.mld_l[sb] * gfc.en[2].l[sb];
      var rside = Math.max(gfc.thm[3].l[sb], Math.min(gfc.thm[2].l[sb], mld));
      gfc.thm[2].l[sb] = rmid;
      gfc.thm[3].l[sb] = rside;
    }
    for (var sb = 0; sb < Encoder.SBMAX_s; sb++) {
      for (var sblock = 0; sblock < 3; sblock++) {
        if (gfc.thm[0].s[sb][sblock] > 1.58 * gfc.thm[1].s[sb][sblock] || gfc.thm[1].s[sb][sblock] > 1.58 * gfc.thm[0].s[sb][sblock]) {
          continue;
        }
        var mld = gfc.mld_s[sb] * gfc.en[3].s[sb][sblock];
        var rmid = Math.max(
          gfc.thm[2].s[sb][sblock],
          Math.min(gfc.thm[3].s[sb][sblock], mld)
        );
        mld = gfc.mld_s[sb] * gfc.en[2].s[sb][sblock];
        var rside = Math.max(
          gfc.thm[3].s[sb][sblock],
          Math.min(gfc.thm[2].s[sb][sblock], mld)
        );
        gfc.thm[2].s[sb][sblock] = rmid;
        gfc.thm[3].s[sb][sblock] = rside;
      }
    }
  }
  function ns_msfix(gfc, msfix, athadjust) {
    var msfix2 = msfix;
    var athlower = Math.pow(10, athadjust);
    msfix *= 2;
    msfix2 *= 2;
    for (var sb = 0; sb < Encoder.SBMAX_l; sb++) {
      var thmLR, thmM, thmS, ath;
      ath = gfc.ATH.cb_l[gfc.bm_l[sb]] * athlower;
      thmLR = Math.min(
        Math.max(gfc.thm[0].l[sb], ath),
        Math.max(gfc.thm[1].l[sb], ath)
      );
      thmM = Math.max(gfc.thm[2].l[sb], ath);
      thmS = Math.max(gfc.thm[3].l[sb], ath);
      if (thmLR * msfix < thmM + thmS) {
        var f = thmLR * msfix2 / (thmM + thmS);
        thmM *= f;
        thmS *= f;
      }
      gfc.thm[2].l[sb] = Math.min(thmM, gfc.thm[2].l[sb]);
      gfc.thm[3].l[sb] = Math.min(thmS, gfc.thm[3].l[sb]);
    }
    athlower *= Encoder.BLKSIZE_s / Encoder.BLKSIZE;
    for (var sb = 0; sb < Encoder.SBMAX_s; sb++) {
      for (var sblock = 0; sblock < 3; sblock++) {
        var thmLR, thmM, thmS, ath;
        ath = gfc.ATH.cb_s[gfc.bm_s[sb]] * athlower;
        thmLR = Math.min(
          Math.max(gfc.thm[0].s[sb][sblock], ath),
          Math.max(gfc.thm[1].s[sb][sblock], ath)
        );
        thmM = Math.max(gfc.thm[2].s[sb][sblock], ath);
        thmS = Math.max(gfc.thm[3].s[sb][sblock], ath);
        if (thmLR * msfix < thmM + thmS) {
          var f = thmLR * msfix / (thmM + thmS);
          thmM *= f;
          thmS *= f;
        }
        gfc.thm[2].s[sb][sblock] = Math.min(gfc.thm[2].s[sb][sblock], thmM);
        gfc.thm[3].s[sb][sblock] = Math.min(gfc.thm[3].s[sb][sblock], thmS);
      }
    }
  }
  function convert_partition2scalefac_s(gfc, eb, thr, chn, sblock) {
    var sb, b;
    var enn = 0;
    var thmm = 0;
    for (sb = b = 0; sb < Encoder.SBMAX_s; ++b, ++sb) {
      var bo_s_sb = gfc.bo_s[sb];
      var npart_s = gfc.npart_s;
      var b_lim = bo_s_sb < npart_s ? bo_s_sb : npart_s;
      while (b < b_lim) {
        assert$9(eb[b] >= 0);
        assert$9(thr[b] >= 0);
        enn += eb[b];
        thmm += thr[b];
        b++;
      }
      gfc.en[chn].s[sb][sblock] = enn;
      gfc.thm[chn].s[sb][sblock] = thmm;
      if (b >= npart_s) {
        ++sb;
        break;
      }
      assert$9(eb[b] >= 0);
      assert$9(thr[b] >= 0);
      {
        var w_curr = gfc.PSY.bo_s_weight[sb];
        var w_next = 1 - w_curr;
        enn = w_curr * eb[b];
        thmm = w_curr * thr[b];
        gfc.en[chn].s[sb][sblock] += enn;
        gfc.thm[chn].s[sb][sblock] += thmm;
        enn = w_next * eb[b];
        thmm = w_next * thr[b];
      }
    }
    for (; sb < Encoder.SBMAX_s; ++sb) {
      gfc.en[chn].s[sb][sblock] = 0;
      gfc.thm[chn].s[sb][sblock] = 0;
    }
  }
  function convert_partition2scalefac_l(gfc, eb, thr, chn) {
    var sb, b;
    var enn = 0;
    var thmm = 0;
    for (sb = b = 0; sb < Encoder.SBMAX_l; ++b, ++sb) {
      var bo_l_sb = gfc.bo_l[sb];
      var npart_l = gfc.npart_l;
      var b_lim = bo_l_sb < npart_l ? bo_l_sb : npart_l;
      while (b < b_lim) {
        assert$9(eb[b] >= 0);
        assert$9(thr[b] >= 0);
        enn += eb[b];
        thmm += thr[b];
        b++;
      }
      gfc.en[chn].l[sb] = enn;
      gfc.thm[chn].l[sb] = thmm;
      if (b >= npart_l) {
        ++sb;
        break;
      }
      assert$9(eb[b] >= 0);
      assert$9(thr[b] >= 0);
      {
        var w_curr = gfc.PSY.bo_l_weight[sb];
        var w_next = 1 - w_curr;
        enn = w_curr * eb[b];
        thmm = w_curr * thr[b];
        gfc.en[chn].l[sb] += enn;
        gfc.thm[chn].l[sb] += thmm;
        enn = w_next * eb[b];
        thmm = w_next * thr[b];
      }
    }
    for (; sb < Encoder.SBMAX_l; ++sb) {
      gfc.en[chn].l[sb] = 0;
      gfc.thm[chn].l[sb] = 0;
    }
  }
  function compute_masking_s(gfp, fftenergy_s, eb, thr, chn, sblock) {
    var gfc = gfp.internal_flags;
    var j, b;
    for (b = j = 0; b < gfc.npart_s; ++b) {
      var ebb = 0;
      var n = gfc.numlines_s[b];
      for (var i = 0; i < n; ++i, ++j) {
        var el = fftenergy_s[sblock][j];
        ebb += el;
      }
      eb[b] = ebb;
    }
    assert$9(b == gfc.npart_s);
    for (j = b = 0; b < gfc.npart_s; b++) {
      var kk = gfc.s3ind_s[b][0];
      var ecb = gfc.s3_ss[j++] * eb[kk];
      ++kk;
      while (kk <= gfc.s3ind_s[b][1]) {
        ecb += gfc.s3_ss[j] * eb[kk];
        ++j;
        ++kk;
      }
      {
        var x = rpelev_s * gfc.nb_s1[chn][b];
        thr[b] = Math.min(ecb, x);
      }
      if (gfc.blocktype_old[chn & 1] == Encoder.SHORT_TYPE) {
        var x = rpelev2_s * gfc.nb_s2[chn][b];
        var y = thr[b];
        thr[b] = Math.min(x, y);
      }
      gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
      gfc.nb_s1[chn][b] = ecb;
      assert$9(thr[b] >= 0);
    }
    for (; b <= Encoder.CBANDS; ++b) {
      eb[b] = 0;
      thr[b] = 0;
    }
  }
  function block_type_set(gfp, uselongblock, blocktype_d, blocktype) {
    var gfc = gfp.internal_flags;
    if (gfp.short_blocks == ShortBlock$2.short_block_coupled && !(uselongblock[0] != 0 && uselongblock[1] != 0)) {
      uselongblock[0] = uselongblock[1] = 0;
    }
    for (var chn = 0; chn < gfc.channels_out; chn++) {
      blocktype[chn] = Encoder.NORM_TYPE;
      if (gfp.short_blocks == ShortBlock$2.short_block_dispensed) {
        uselongblock[chn] = 1;
      }
      if (gfp.short_blocks == ShortBlock$2.short_block_forced) {
        uselongblock[chn] = 0;
      }
      if (uselongblock[chn] != 0) {
        assert$9(gfc.blocktype_old[chn] != Encoder.START_TYPE);
        if (gfc.blocktype_old[chn] == Encoder.SHORT_TYPE) {
          blocktype[chn] = Encoder.STOP_TYPE;
        }
      } else {
        blocktype[chn] = Encoder.SHORT_TYPE;
        if (gfc.blocktype_old[chn] == Encoder.NORM_TYPE) {
          gfc.blocktype_old[chn] = Encoder.START_TYPE;
        }
        if (gfc.blocktype_old[chn] == Encoder.STOP_TYPE) {
          gfc.blocktype_old[chn] = Encoder.SHORT_TYPE;
        }
      }
      blocktype_d[chn] = gfc.blocktype_old[chn];
      gfc.blocktype_old[chn] = blocktype[chn];
    }
  }
  function NS_INTERP(x, y, r) {
    if (r >= 1) {
      return x;
    }
    if (r <= 0)
      return y;
    if (y > 0) {
      return Math.pow(x / y, r) * y;
    }
    return 0;
  }
  var regcoef_s = [
    11.8,
    13.6,
    17.2,
    32,
    46.5,
    51.3,
    57.5,
    67.1,
    71.5,
    84.6,
    97.6,
    130
  ];
  function pecalc_s(mr, masking_lower) {
    var pe_s = 1236.28 / 4;
    for (var sb = 0; sb < Encoder.SBMAX_s - 1; sb++) {
      for (var sblock = 0; sblock < 3; sblock++) {
        var thm = mr.thm.s[sb][sblock];
        if (thm > 0) {
          var x = thm * masking_lower;
          var en = mr.en.s[sb][sblock];
          if (en > x) {
            if (en > x * 1e10) {
              pe_s += regcoef_s[sb] * (10 * LOG10);
            } else {
              pe_s += regcoef_s[sb] * Util$2.FAST_LOG10(en / x);
            }
          }
        }
      }
    }
    return pe_s;
  }
  var regcoef_l = [
    6.8,
    5.8,
    5.8,
    6.4,
    6.5,
    9.9,
    12.1,
    14.4,
    15,
    18.9,
    21.6,
    26.9,
    34.2,
    40.2,
    46.8,
    56.5,
    60.7,
    73.9,
    85.7,
    93.4,
    126.1
  ];
  function pecalc_l(mr, masking_lower) {
    var pe_l = 1124.23 / 4;
    for (var sb = 0; sb < Encoder.SBMAX_l - 1; sb++) {
      var thm = mr.thm.l[sb];
      if (thm > 0) {
        var x = thm * masking_lower;
        var en = mr.en.l[sb];
        if (en > x) {
          if (en > x * 1e10) {
            pe_l += regcoef_l[sb] * (10 * LOG10);
          } else {
            pe_l += regcoef_l[sb] * Util$2.FAST_LOG10(en / x);
          }
        }
      }
    }
    return pe_l;
  }
  function calc_energy(gfc, fftenergy, eb, max, avg) {
    var b, j;
    for (b = j = 0; b < gfc.npart_l; ++b) {
      var ebb = 0;
      var m = 0;
      var i;
      for (i = 0; i < gfc.numlines_l[b]; ++i, ++j) {
        var el = fftenergy[j];
        ebb += el;
        if (m < el)
          m = el;
      }
      eb[b] = ebb;
      max[b] = m;
      avg[b] = ebb * gfc.rnumlines_l[b];
      assert$9(gfc.rnumlines_l[b] >= 0);
      assert$9(eb[b] >= 0);
      assert$9(max[b] >= 0);
      assert$9(avg[b] >= 0);
    }
  }
  function calc_mask_index_l(gfc, max, avg, mask_idx) {
    var last_tab_entry = tab.length - 1;
    var b = 0;
    var a = avg[b] + avg[b + 1];
    if (a > 0) {
      var m = max[b];
      if (m < max[b + 1])
        m = max[b + 1];
      assert$9(gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1 > 0);
      a = 20 * (m * 2 - a) / (a * (gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
      var k = 0 | a;
      if (k > last_tab_entry)
        k = last_tab_entry;
      mask_idx[b] = k;
    } else {
      mask_idx[b] = 0;
    }
    for (b = 1; b < gfc.npart_l - 1; b++) {
      a = avg[b - 1] + avg[b] + avg[b + 1];
      if (a > 0) {
        var m = max[b - 1];
        if (m < max[b])
          m = max[b];
        if (m < max[b + 1])
          m = max[b + 1];
        assert$9(
          gfc.numlines_l[b - 1] + gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1 > 0
        );
        a = 20 * (m * 3 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
        var k = 0 | a;
        if (k > last_tab_entry)
          k = last_tab_entry;
        mask_idx[b] = k;
      } else {
        mask_idx[b] = 0;
      }
    }
    assert$9(b == gfc.npart_l - 1);
    a = avg[b - 1] + avg[b];
    if (a > 0) {
      var m = max[b - 1];
      if (m < max[b])
        m = max[b];
      assert$9(gfc.numlines_l[b - 1] + gfc.numlines_l[b] - 1 > 0);
      a = 20 * (m * 2 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] - 1));
      var k = 0 | a;
      if (k > last_tab_entry)
        k = last_tab_entry;
      mask_idx[b] = k;
    } else {
      mask_idx[b] = 0;
    }
    assert$9(b == gfc.npart_l - 1);
  }
  var fircoef = [
    -865163e-23 * 2,
    -851586e-8 * 2,
    -674764e-23 * 2,
    0.0209036 * 2,
    -336639e-22 * 2,
    -0.0438162 * 2,
    -154175e-22 * 2,
    0.0931738 * 2,
    -552212e-22 * 2,
    -0.313819 * 2
  ];
  this.L3psycho_anal_ns = function(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, percep_entropy, percep_MS_entropy, energy, blocktype_d) {
    var gfc = gfp.internal_flags;
    var wsamp_L = new_float_n$3([2, Encoder.BLKSIZE]);
    var wsamp_S = new_float_n$3([2, 3, Encoder.BLKSIZE_s]);
    var eb_l = new_float$a(Encoder.CBANDS + 1);
    var eb_s = new_float$a(Encoder.CBANDS + 1);
    var thr = new_float$a(Encoder.CBANDS + 2);
    var blocktype = new_int$b(2);
    var uselongblock = new_int$b(2);
    var numchn, chn;
    var b, i, j, k;
    var sb, sblock;
    var ns_hpfsmpl = new_float_n$3([2, 576]);
    var pcfact;
    var mask_idx_l = new_int$b(Encoder.CBANDS + 2);
    var mask_idx_s = new_int$b(Encoder.CBANDS + 2);
    Arrays$5.fill(mask_idx_s, 0);
    numchn = gfc.channels_out;
    if (gfp.mode == MPEGMode.JOINT_STEREO)
      numchn = 4;
    if (gfp.VBR == VbrMode$5.vbr_off) {
      pcfact = gfc.ResvMax == 0 ? 0 : gfc.ResvSize / gfc.ResvMax * 0.5;
    } else if (gfp.VBR == VbrMode$5.vbr_rh || gfp.VBR == VbrMode$5.vbr_mtrh || gfp.VBR == VbrMode$5.vbr_mt) {
      pcfact = 0.6;
    } else
      pcfact = 1;
    for (chn = 0; chn < gfc.channels_out; chn++) {
      var firbuf2 = buffer[chn];
      var firbufPos = bufPos + 576 - 350 - NSFIRLEN + 192;
      for (i = 0; i < 576; i++) {
        var sum1, sum2;
        sum1 = firbuf2[firbufPos + i + 10];
        sum2 = 0;
        for (j = 0; j < (NSFIRLEN - 1) / 2 - 1; j += 2) {
          sum1 += fircoef[j] * (firbuf2[firbufPos + i + j] + firbuf2[firbufPos + i + NSFIRLEN - j]);
          sum2 += fircoef[j + 1] * (firbuf2[firbufPos + i + j + 1] + firbuf2[firbufPos + i + NSFIRLEN - j - 1]);
        }
        ns_hpfsmpl[chn][i] = sum1 + sum2;
      }
      masking_ratio[gr_out][chn].en.assign(gfc.en[chn]);
      masking_ratio[gr_out][chn].thm.assign(gfc.thm[chn]);
      if (numchn > 2) {
        masking_MS_ratio[gr_out][chn].en.assign(gfc.en[chn + 2]);
        masking_MS_ratio[gr_out][chn].thm.assign(gfc.thm[chn + 2]);
      }
    }
    for (chn = 0; chn < numchn; chn++) {
      var wsamp_l;
      var wsamp_s;
      var en_subshort = new_float$a(12);
      var en_short = [0, 0, 0, 0];
      var attack_intensity = new_float$a(12);
      var ns_uselongblock = 1;
      var attackThreshold;
      var max = new_float$a(Encoder.CBANDS);
      var avg = new_float$a(Encoder.CBANDS);
      var ns_attacks = [0, 0, 0, 0];
      var fftenergy = new_float$a(Encoder.HBLKSIZE);
      var fftenergy_s = new_float_n$3([3, Encoder.HBLKSIZE_s]);
      assert$9(gfc.npart_s <= Encoder.CBANDS);
      assert$9(gfc.npart_l <= Encoder.CBANDS);
      for (i = 0; i < 3; i++) {
        en_subshort[i] = gfc.nsPsy.last_en_subshort[chn][i + 6];
        assert$9(gfc.nsPsy.last_en_subshort[chn][i + 4] > 0);
        attack_intensity[i] = en_subshort[i] / gfc.nsPsy.last_en_subshort[chn][i + 4];
        en_short[0] += en_subshort[i];
      }
      if (chn == 2) {
        for (i = 0; i < 576; i++) {
          var l, r;
          l = ns_hpfsmpl[0][i];
          r = ns_hpfsmpl[1][i];
          ns_hpfsmpl[0][i] = l + r;
          ns_hpfsmpl[1][i] = l - r;
        }
      }
      {
        var pf = ns_hpfsmpl[chn & 1];
        var pfPos = 0;
        for (i = 0; i < 9; i++) {
          var pfe = pfPos + 576 / 9;
          var p2 = 1;
          for (; pfPos < pfe; pfPos++) {
            if (p2 < Math.abs(pf[pfPos]))
              p2 = Math.abs(pf[pfPos]);
          }
          gfc.nsPsy.last_en_subshort[chn][i] = en_subshort[i + 3] = p2;
          en_short[1 + i / 3] += p2;
          if (p2 > en_subshort[i + 3 - 2]) {
            assert$9(en_subshort[i + 3 - 2] > 0);
            p2 = p2 / en_subshort[i + 3 - 2];
          } else if (en_subshort[i + 3 - 2] > p2 * 10) {
            p2 = en_subshort[i + 3 - 2] / (p2 * 10);
          } else
            p2 = 0;
          attack_intensity[i + 3] = p2;
        }
      }
      if (gfp.analysis) {
        var x = attack_intensity[0];
        for (i = 1; i < 12; i++) {
          if (x < attack_intensity[i])
            x = attack_intensity[i];
        }
        gfc.pinfo.ers[gr_out][chn] = gfc.pinfo.ers_save[chn];
        gfc.pinfo.ers_save[chn] = x;
      }
      attackThreshold = chn == 3 ? gfc.nsPsy.attackthre_s : gfc.nsPsy.attackthre;
      for (i = 0; i < 12; i++) {
        if (ns_attacks[i / 3] == 0 && attack_intensity[i] > attackThreshold) {
          ns_attacks[i / 3] = i % 3 + 1;
        }
      }
      for (i = 1; i < 4; i++) {
        var ratio;
        if (en_short[i - 1] > en_short[i]) {
          assert$9(en_short[i] > 0);
          ratio = en_short[i - 1] / en_short[i];
        } else {
          assert$9(en_short[i - 1] > 0);
          ratio = en_short[i] / en_short[i - 1];
        }
        if (ratio < 1.7) {
          ns_attacks[i] = 0;
          if (i == 1)
            ns_attacks[0] = 0;
        }
      }
      if (ns_attacks[0] != 0 && gfc.nsPsy.lastAttacks[chn] != 0) {
        ns_attacks[0] = 0;
      }
      if (gfc.nsPsy.lastAttacks[chn] == 3 || ns_attacks[0] + ns_attacks[1] + ns_attacks[2] + ns_attacks[3] != 0) {
        ns_uselongblock = 0;
        if (ns_attacks[1] != 0 && ns_attacks[0] != 0)
          ns_attacks[1] = 0;
        if (ns_attacks[2] != 0 && ns_attacks[1] != 0)
          ns_attacks[2] = 0;
        if (ns_attacks[3] != 0 && ns_attacks[2] != 0)
          ns_attacks[3] = 0;
      }
      if (chn < 2) {
        uselongblock[chn] = ns_uselongblock;
      } else {
        if (ns_uselongblock == 0) {
          uselongblock[0] = uselongblock[1] = 0;
        }
      }
      energy[chn] = gfc.tot_ener[chn];
      wsamp_s = wsamp_S;
      wsamp_l = wsamp_L;
      compute_ffts(
        gfp,
        fftenergy,
        fftenergy_s,
        wsamp_l,
        chn & 1,
        wsamp_s,
        chn & 1,
        gr_out,
        chn,
        buffer,
        bufPos
      );
      calc_energy(gfc, fftenergy, eb_l, max, avg);
      calc_mask_index_l(gfc, max, avg, mask_idx_l);
      for (sblock = 0; sblock < 3; sblock++) {
        var enn, thmm;
        compute_masking_s(gfp, fftenergy_s, eb_s, thr, chn, sblock);
        convert_partition2scalefac_s(gfc, eb_s, thr, chn, sblock);
        for (sb = 0; sb < Encoder.SBMAX_s; sb++) {
          thmm = gfc.thm[chn].s[sb][sblock];
          thmm *= NS_PREECHO_ATT0;
          if (ns_attacks[sblock] >= 2 || ns_attacks[sblock + 1] == 1) {
            var idx = sblock != 0 ? sblock - 1 : 2;
            var p2 = NS_INTERP(
              gfc.thm[chn].s[sb][idx],
              thmm,
              NS_PREECHO_ATT1 * pcfact
            );
            thmm = Math.min(thmm, p2);
          }
          if (ns_attacks[sblock] == 1) {
            var idx = sblock != 0 ? sblock - 1 : 2;
            var p2 = NS_INTERP(
              gfc.thm[chn].s[sb][idx],
              thmm,
              NS_PREECHO_ATT2 * pcfact
            );
            thmm = Math.min(thmm, p2);
          } else if (sblock != 0 && ns_attacks[sblock - 1] == 3 || sblock == 0 && gfc.nsPsy.lastAttacks[chn] == 3) {
            var idx = sblock != 2 ? sblock + 1 : 0;
            var p2 = NS_INTERP(
              gfc.thm[chn].s[sb][idx],
              thmm,
              NS_PREECHO_ATT2 * pcfact
            );
            thmm = Math.min(thmm, p2);
          }
          enn = en_subshort[sblock * 3 + 3] + en_subshort[sblock * 3 + 4] + en_subshort[sblock * 3 + 5];
          if (en_subshort[sblock * 3 + 5] * 6 < enn) {
            thmm *= 0.5;
            if (en_subshort[sblock * 3 + 4] * 6 < enn)
              thmm *= 0.5;
          }
          gfc.thm[chn].s[sb][sblock] = thmm;
        }
      }
      gfc.nsPsy.lastAttacks[chn] = ns_attacks[2];
      k = 0;
      {
        for (b = 0; b < gfc.npart_l; b++) {
          var kk = gfc.s3ind[b][0];
          var eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
          var ecb = gfc.s3_ll[k++] * eb2;
          while (++kk <= gfc.s3ind[b][1]) {
            eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
            ecb = mask_add(ecb, gfc.s3_ll[k++] * eb2, kk, kk - b, gfc, 0);
          }
          ecb *= 0.158489319246111;
          if (gfc.blocktype_old[chn & 1] == Encoder.SHORT_TYPE)
            thr[b] = ecb;
          else {
            thr[b] = NS_INTERP(
              Math.min(
                ecb,
                Math.min(rpelev * gfc.nb_1[chn][b], rpelev2 * gfc.nb_2[chn][b])
              ),
              ecb,
              pcfact
            );
          }
          gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
          gfc.nb_1[chn][b] = ecb;
        }
      }
      for (; b <= Encoder.CBANDS; ++b) {
        eb_l[b] = 0;
        thr[b] = 0;
      }
      convert_partition2scalefac_l(gfc, eb_l, thr, chn);
    }
    if (gfp.mode == MPEGMode.STEREO || gfp.mode == MPEGMode.JOINT_STEREO) {
      if (gfp.interChRatio > 0) {
        calc_interchannel_masking(gfp, gfp.interChRatio);
      }
    }
    if (gfp.mode == MPEGMode.JOINT_STEREO) {
      var msfix;
      msfix1(gfc);
      msfix = gfp.msfix;
      if (Math.abs(msfix) > 0) {
        ns_msfix(gfc, msfix, gfp.ATHlower * gfc.ATH.adjust);
      }
    }
    block_type_set(gfp, uselongblock, blocktype_d, blocktype);
    for (chn = 0; chn < numchn; chn++) {
      var ppe;
      var ppePos = 0;
      var type;
      var mr;
      if (chn > 1) {
        ppe = percep_MS_entropy;
        ppePos = -2;
        type = Encoder.NORM_TYPE;
        if (blocktype_d[0] == Encoder.SHORT_TYPE || blocktype_d[1] == Encoder.SHORT_TYPE) {
          type = Encoder.SHORT_TYPE;
        }
        mr = masking_MS_ratio[gr_out][chn - 2];
      } else {
        ppe = percep_entropy;
        ppePos = 0;
        type = blocktype_d[chn];
        mr = masking_ratio[gr_out][chn];
      }
      if (type == Encoder.SHORT_TYPE) {
        ppe[ppePos + chn] = pecalc_s(mr, gfc.masking_lower);
      } else
        ppe[ppePos + chn] = pecalc_l(mr, gfc.masking_lower);
      if (gfp.analysis)
        gfc.pinfo.pe[gr_out][chn] = ppe[ppePos + chn];
    }
    return 0;
  };
  function vbrpsy_compute_fft_l(gfp, buffer, bufPos, chn, gr_out, fftenergy, wsamp_l, wsamp_lPos) {
    var gfc = gfp.internal_flags;
    if (chn < 2) {
      fft.fft_long(gfc, wsamp_l[wsamp_lPos], chn, buffer, bufPos);
    } else if (chn == 2) {
      for (var j = Encoder.BLKSIZE - 1; j >= 0; --j) {
        var l = wsamp_l[wsamp_lPos + 0][j];
        var r = wsamp_l[wsamp_lPos + 1][j];
        wsamp_l[wsamp_lPos + 0][j] = (l + r) * Util$2.SQRT2 * 0.5;
        wsamp_l[wsamp_lPos + 1][j] = (l - r) * Util$2.SQRT2 * 0.5;
      }
    }
    fftenergy[0] = NON_LINEAR_SCALE_ENERGY(wsamp_l[wsamp_lPos + 0][0]);
    fftenergy[0] *= fftenergy[0];
    for (var j = Encoder.BLKSIZE / 2 - 1; j >= 0; --j) {
      var re = wsamp_l[wsamp_lPos + 0][Encoder.BLKSIZE / 2 - j];
      var im = wsamp_l[wsamp_lPos + 0][Encoder.BLKSIZE / 2 + j];
      fftenergy[Encoder.BLKSIZE / 2 - j] = NON_LINEAR_SCALE_ENERGY(
        (re * re + im * im) * 0.5
      );
    }
    {
      var totalenergy = 0;
      for (var j = 11; j < Encoder.HBLKSIZE; j++)
        totalenergy += fftenergy[j];
      gfc.tot_ener[chn] = totalenergy;
    }
    if (gfp.analysis) {
      for (var j = 0; j < Encoder.HBLKSIZE; j++) {
        gfc.pinfo.energy[gr_out][chn][j] = gfc.pinfo.energy_save[chn][j];
        gfc.pinfo.energy_save[chn][j] = fftenergy[j];
      }
      gfc.pinfo.pe[gr_out][chn] = gfc.pe[chn];
    }
  }
  function vbrpsy_compute_fft_s(gfp, buffer, bufPos, chn, sblock, fftenergy_s, wsamp_s, wsamp_sPos) {
    var gfc = gfp.internal_flags;
    if (sblock == 0 && chn < 2) {
      fft.fft_short(gfc, wsamp_s[wsamp_sPos], chn, buffer, bufPos);
    }
    if (chn == 2) {
      for (var j = Encoder.BLKSIZE_s - 1; j >= 0; --j) {
        var l = wsamp_s[wsamp_sPos + 0][sblock][j];
        var r = wsamp_s[wsamp_sPos + 1][sblock][j];
        wsamp_s[wsamp_sPos + 0][sblock][j] = (l + r) * Util$2.SQRT2 * 0.5;
        wsamp_s[wsamp_sPos + 1][sblock][j] = (l - r) * Util$2.SQRT2 * 0.5;
      }
    }
    fftenergy_s[sblock][0] = wsamp_s[wsamp_sPos + 0][sblock][0];
    fftenergy_s[sblock][0] *= fftenergy_s[sblock][0];
    for (var j = Encoder.BLKSIZE_s / 2 - 1; j >= 0; --j) {
      var re = wsamp_s[wsamp_sPos + 0][sblock][Encoder.BLKSIZE_s / 2 - j];
      var im = wsamp_s[wsamp_sPos + 0][sblock][Encoder.BLKSIZE_s / 2 + j];
      fftenergy_s[sblock][Encoder.BLKSIZE_s / 2 - j] = NON_LINEAR_SCALE_ENERGY(
        (re * re + im * im) * 0.5
      );
    }
  }
  function vbrpsy_compute_loudness_approximation_l(gfp, gr_out, chn, fftenergy) {
    var gfc = gfp.internal_flags;
    if (gfp.athaa_loudapprox == 2 && chn < 2) {
      gfc.loudness_sq[gr_out][chn] = gfc.loudness_sq_save[chn];
      gfc.loudness_sq_save[chn] = psycho_loudness_approx(fftenergy, gfc);
    }
  }
  var fircoef_ = [
    -865163e-23 * 2,
    -851586e-8 * 2,
    -674764e-23 * 2,
    0.0209036 * 2,
    -336639e-22 * 2,
    -0.0438162 * 2,
    -154175e-22 * 2,
    0.0931738 * 2,
    -552212e-22 * 2,
    -0.313819 * 2
  ];
  function vbrpsy_attack_detection(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, energy, sub_short_factor, ns_attacks, uselongblock) {
    var ns_hpfsmpl = new_float_n$3([2, 576]);
    var gfc = gfp.internal_flags;
    var n_chn_out = gfc.channels_out;
    var n_chn_psy = gfp.mode == MPEGMode.JOINT_STEREO ? 4 : n_chn_out;
    for (var chn = 0; chn < n_chn_out; chn++) {
      firbuf = buffer[chn];
      var firbufPos = bufPos + 576 - 350 - NSFIRLEN + 192;
      for (var i = 0; i < 576; i++) {
        var sum1, sum2;
        sum1 = firbuf[firbufPos + i + 10];
        sum2 = 0;
        for (var j = 0; j < (NSFIRLEN - 1) / 2 - 1; j += 2) {
          sum1 += fircoef_[j] * (firbuf[firbufPos + i + j] + firbuf[firbufPos + i + NSFIRLEN - j]);
          sum2 += fircoef_[j + 1] * (firbuf[firbufPos + i + j + 1] + firbuf[firbufPos + i + NSFIRLEN - j - 1]);
        }
        ns_hpfsmpl[chn][i] = sum1 + sum2;
      }
      masking_ratio[gr_out][chn].en.assign(gfc.en[chn]);
      masking_ratio[gr_out][chn].thm.assign(gfc.thm[chn]);
      if (n_chn_psy > 2) {
        masking_MS_ratio[gr_out][chn].en.assign(gfc.en[chn + 2]);
        masking_MS_ratio[gr_out][chn].thm.assign(gfc.thm[chn + 2]);
      }
    }
    for (var chn = 0; chn < n_chn_psy; chn++) {
      var attack_intensity = new_float$a(12);
      var en_subshort = new_float$a(12);
      var en_short = [0, 0, 0, 0];
      var pf = ns_hpfsmpl[chn & 1];
      var pfPos = 0;
      var attackThreshold = chn == 3 ? gfc.nsPsy.attackthre_s : gfc.nsPsy.attackthre;
      var ns_uselongblock = 1;
      if (chn == 2) {
        for (var i = 0, j = 576; j > 0; ++i, --j) {
          var l = ns_hpfsmpl[0][i];
          var r = ns_hpfsmpl[1][i];
          ns_hpfsmpl[0][i] = l + r;
          ns_hpfsmpl[1][i] = l - r;
        }
      }
      for (var i = 0; i < 3; i++) {
        en_subshort[i] = gfc.nsPsy.last_en_subshort[chn][i + 6];
        assert$9(gfc.nsPsy.last_en_subshort[chn][i + 4] > 0);
        attack_intensity[i] = en_subshort[i] / gfc.nsPsy.last_en_subshort[chn][i + 4];
        en_short[0] += en_subshort[i];
      }
      for (var i = 0; i < 9; i++) {
        var pfe = pfPos + 576 / 9;
        var p2 = 1;
        for (; pfPos < pfe; pfPos++) {
          if (p2 < Math.abs(pf[pfPos]))
            p2 = Math.abs(pf[pfPos]);
        }
        gfc.nsPsy.last_en_subshort[chn][i] = en_subshort[i + 3] = p2;
        en_short[1 + i / 3] += p2;
        if (p2 > en_subshort[i + 3 - 2]) {
          assert$9(en_subshort[i + 3 - 2] > 0);
          p2 = p2 / en_subshort[i + 3 - 2];
        } else if (en_subshort[i + 3 - 2] > p2 * 10) {
          p2 = en_subshort[i + 3 - 2] / (p2 * 10);
        } else {
          p2 = 0;
        }
        attack_intensity[i + 3] = p2;
      }
      for (var i = 0; i < 3; ++i) {
        var enn = en_subshort[i * 3 + 3] + en_subshort[i * 3 + 4] + en_subshort[i * 3 + 5];
        var factor = 1;
        if (en_subshort[i * 3 + 5] * 6 < enn) {
          factor *= 0.5;
          if (en_subshort[i * 3 + 4] * 6 < enn) {
            factor *= 0.5;
          }
        }
        sub_short_factor[chn][i] = factor;
      }
      if (gfp.analysis) {
        var x = attack_intensity[0];
        for (var i = 1; i < 12; i++) {
          if (x < attack_intensity[i]) {
            x = attack_intensity[i];
          }
        }
        gfc.pinfo.ers[gr_out][chn] = gfc.pinfo.ers_save[chn];
        gfc.pinfo.ers_save[chn] = x;
      }
      for (var i = 0; i < 12; i++) {
        if (ns_attacks[chn][i / 3] == 0 && attack_intensity[i] > attackThreshold) {
          ns_attacks[chn][i / 3] = i % 3 + 1;
        }
      }
      for (var i = 1; i < 4; i++) {
        var u = en_short[i - 1];
        var v = en_short[i];
        var m = Math.max(u, v);
        if (m < 4e4) {
          if (u < 1.7 * v && v < 1.7 * u) {
            if (i == 1 && ns_attacks[chn][0] <= ns_attacks[chn][i]) {
              ns_attacks[chn][0] = 0;
            }
            ns_attacks[chn][i] = 0;
          }
        }
      }
      if (ns_attacks[chn][0] <= gfc.nsPsy.lastAttacks[chn]) {
        ns_attacks[chn][0] = 0;
      }
      if (gfc.nsPsy.lastAttacks[chn] == 3 || ns_attacks[chn][0] + ns_attacks[chn][1] + ns_attacks[chn][2] + ns_attacks[chn][3] != 0) {
        ns_uselongblock = 0;
        if (ns_attacks[chn][1] != 0 && ns_attacks[chn][0] != 0) {
          ns_attacks[chn][1] = 0;
        }
        if (ns_attacks[chn][2] != 0 && ns_attacks[chn][1] != 0) {
          ns_attacks[chn][2] = 0;
        }
        if (ns_attacks[chn][3] != 0 && ns_attacks[chn][2] != 0) {
          ns_attacks[chn][3] = 0;
        }
      }
      if (chn < 2) {
        uselongblock[chn] = ns_uselongblock;
      } else {
        if (ns_uselongblock == 0) {
          uselongblock[0] = uselongblock[1] = 0;
        }
      }
      energy[chn] = gfc.tot_ener[chn];
    }
  }
  function vbrpsy_skip_masking_s(gfc, chn, sblock) {
    if (sblock == 0) {
      for (var b = 0; b < gfc.npart_s; b++) {
        gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
        gfc.nb_s1[chn][b] = 0;
      }
    }
  }
  function vbrpsy_skip_masking_l(gfc, chn) {
    for (var b = 0; b < gfc.npart_l; b++) {
      gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
      gfc.nb_1[chn][b] = 0;
    }
  }
  function psyvbr_calc_mask_index_s(gfc, max, avg, mask_idx) {
    var last_tab_entry = tab.length - 1;
    var b = 0;
    var a = avg[b] + avg[b + 1];
    if (a > 0) {
      var m = max[b];
      if (m < max[b + 1])
        m = max[b + 1];
      assert$9(gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1 > 0);
      a = 20 * (m * 2 - a) / (a * (gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1));
      var k = 0 | a;
      if (k > last_tab_entry)
        k = last_tab_entry;
      mask_idx[b] = k;
    } else {
      mask_idx[b] = 0;
    }
    for (b = 1; b < gfc.npart_s - 1; b++) {
      a = avg[b - 1] + avg[b] + avg[b + 1];
      assert$9(b + 1 < gfc.npart_s);
      if (a > 0) {
        var m = max[b - 1];
        if (m < max[b])
          m = max[b];
        if (m < max[b + 1])
          m = max[b + 1];
        assert$9(
          gfc.numlines_s[b - 1] + gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1 > 0
        );
        a = 20 * (m * 3 - a) / (a * (gfc.numlines_s[b - 1] + gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1));
        var k = 0 | a;
        if (k > last_tab_entry)
          k = last_tab_entry;
        mask_idx[b] = k;
      } else {
        mask_idx[b] = 0;
      }
    }
    assert$9(b == gfc.npart_s - 1);
    a = avg[b - 1] + avg[b];
    if (a > 0) {
      var m = max[b - 1];
      if (m < max[b])
        m = max[b];
      assert$9(gfc.numlines_s[b - 1] + gfc.numlines_s[b] - 1 > 0);
      a = 20 * (m * 2 - a) / (a * (gfc.numlines_s[b - 1] + gfc.numlines_s[b] - 1));
      var k = 0 | a;
      if (k > last_tab_entry)
        k = last_tab_entry;
      mask_idx[b] = k;
    } else {
      mask_idx[b] = 0;
    }
    assert$9(b == gfc.npart_s - 1);
  }
  function vbrpsy_compute_masking_s(gfp, fftenergy_s, eb, thr, chn, sblock) {
    var gfc = gfp.internal_flags;
    var max = new float[Encoder.CBANDS]();
    var avg = new_float$a(Encoder.CBANDS);
    var i, j, b;
    var mask_idx_s = new int[Encoder.CBANDS]();
    for (b = j = 0; b < gfc.npart_s; ++b) {
      var ebb = 0;
      var m = 0;
      var n = gfc.numlines_s[b];
      for (i = 0; i < n; ++i, ++j) {
        var el = fftenergy_s[sblock][j];
        ebb += el;
        if (m < el)
          m = el;
      }
      eb[b] = ebb;
      max[b] = m;
      avg[b] = ebb / n;
      assert$9(avg[b] >= 0);
    }
    assert$9(b == gfc.npart_s);
    for (; b < Encoder.CBANDS; ++b) {
      max[b] = 0;
      avg[b] = 0;
    }
    psyvbr_calc_mask_index_s(gfc, max, avg, mask_idx_s);
    for (j = b = 0; b < gfc.npart_s; b++) {
      var kk = gfc.s3ind_s[b][0];
      var last = gfc.s3ind_s[b][1];
      var dd, dd_n;
      var x, ecb, avg_mask;
      dd = mask_idx_s[kk];
      dd_n = 1;
      ecb = gfc.s3_ss[j] * eb[kk] * tab[mask_idx_s[kk]];
      ++j;
      ++kk;
      while (kk <= last) {
        dd += mask_idx_s[kk];
        dd_n += 1;
        x = gfc.s3_ss[j] * eb[kk] * tab[mask_idx_s[kk]];
        ecb = vbrpsy_mask_add(ecb, x, kk - b);
        ++j;
        ++kk;
      }
      dd = (1 + 2 * dd) / (2 * dd_n);
      avg_mask = tab[dd] * 0.5;
      ecb *= avg_mask;
      thr[b] = ecb;
      gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
      gfc.nb_s1[chn][b] = ecb;
      {
        x = max[b];
        x *= gfc.minval_s[b];
        x *= avg_mask;
        if (thr[b] > x) {
          thr[b] = x;
        }
      }
      if (gfc.masking_lower > 1) {
        thr[b] *= gfc.masking_lower;
      }
      if (thr[b] > eb[b]) {
        thr[b] = eb[b];
      }
      if (gfc.masking_lower < 1) {
        thr[b] *= gfc.masking_lower;
      }
      assert$9(thr[b] >= 0);
    }
    for (; b < Encoder.CBANDS; ++b) {
      eb[b] = 0;
      thr[b] = 0;
    }
  }
  function vbrpsy_compute_masking_l(gfc, fftenergy, eb_l, thr, chn) {
    var max = new_float$a(Encoder.CBANDS);
    var avg = new_float$a(Encoder.CBANDS);
    var mask_idx_l = new_int$b(Encoder.CBANDS + 2);
    var b;
    calc_energy(gfc, fftenergy, eb_l, max, avg);
    calc_mask_index_l(gfc, max, avg, mask_idx_l);
    var k = 0;
    for (b = 0; b < gfc.npart_l; b++) {
      var x, ecb, avg_mask, t;
      var kk = gfc.s3ind[b][0];
      var last = gfc.s3ind[b][1];
      var dd = 0;
      var dd_n = 0;
      dd = mask_idx_l[kk];
      dd_n += 1;
      ecb = gfc.s3_ll[k] * eb_l[kk] * tab[mask_idx_l[kk]];
      ++k;
      ++kk;
      while (kk <= last) {
        dd += mask_idx_l[kk];
        dd_n += 1;
        x = gfc.s3_ll[k] * eb_l[kk] * tab[mask_idx_l[kk]];
        t = vbrpsy_mask_add(ecb, x, kk - b);
        ecb = t;
        ++k;
        ++kk;
      }
      dd = (1 + 2 * dd) / (2 * dd_n);
      avg_mask = tab[dd] * 0.5;
      ecb *= avg_mask;
      if (gfc.blocktype_old[chn & 1] == Encoder.SHORT_TYPE) {
        var ecb_limit = rpelev * gfc.nb_1[chn][b];
        if (ecb_limit > 0) {
          thr[b] = Math.min(ecb, ecb_limit);
        } else {
          thr[b] = Math.min(ecb, eb_l[b] * NS_PREECHO_ATT2);
        }
      } else {
        var ecb_limit_2 = rpelev2 * gfc.nb_2[chn][b];
        var ecb_limit_1 = rpelev * gfc.nb_1[chn][b];
        var ecb_limit;
        if (ecb_limit_2 <= 0) {
          ecb_limit_2 = ecb;
        }
        if (ecb_limit_1 <= 0) {
          ecb_limit_1 = ecb;
        }
        if (gfc.blocktype_old[chn & 1] == Encoder.NORM_TYPE) {
          ecb_limit = Math.min(ecb_limit_1, ecb_limit_2);
        } else {
          ecb_limit = ecb_limit_1;
        }
        thr[b] = Math.min(ecb, ecb_limit);
      }
      gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
      gfc.nb_1[chn][b] = ecb;
      {
        x = max[b];
        x *= gfc.minval_l[b];
        x *= avg_mask;
        if (thr[b] > x) {
          thr[b] = x;
        }
      }
      if (gfc.masking_lower > 1) {
        thr[b] *= gfc.masking_lower;
      }
      if (thr[b] > eb_l[b]) {
        thr[b] = eb_l[b];
      }
      if (gfc.masking_lower < 1) {
        thr[b] *= gfc.masking_lower;
      }
      assert$9(thr[b] >= 0);
    }
    for (; b < Encoder.CBANDS; ++b) {
      eb_l[b] = 0;
      thr[b] = 0;
    }
  }
  function vbrpsy_compute_block_type(gfp, uselongblock) {
    var gfc = gfp.internal_flags;
    if (gfp.short_blocks == ShortBlock$2.short_block_coupled && !(uselongblock[0] != 0 && uselongblock[1] != 0)) {
      uselongblock[0] = uselongblock[1] = 0;
    }
    for (var chn = 0; chn < gfc.channels_out; chn++) {
      if (gfp.short_blocks == ShortBlock$2.short_block_dispensed) {
        uselongblock[chn] = 1;
      }
      if (gfp.short_blocks == ShortBlock$2.short_block_forced) {
        uselongblock[chn] = 0;
      }
    }
  }
  function vbrpsy_apply_block_type(gfp, uselongblock, blocktype_d) {
    var gfc = gfp.internal_flags;
    for (var chn = 0; chn < gfc.channels_out; chn++) {
      var blocktype = Encoder.NORM_TYPE;
      if (uselongblock[chn] != 0) {
        assert$9(gfc.blocktype_old[chn] != Encoder.START_TYPE);
        if (gfc.blocktype_old[chn] == Encoder.SHORT_TYPE) {
          blocktype = Encoder.STOP_TYPE;
        }
      } else {
        blocktype = Encoder.SHORT_TYPE;
        if (gfc.blocktype_old[chn] == Encoder.NORM_TYPE) {
          gfc.blocktype_old[chn] = Encoder.START_TYPE;
        }
        if (gfc.blocktype_old[chn] == Encoder.STOP_TYPE) {
          gfc.blocktype_old[chn] = Encoder.SHORT_TYPE;
        }
      }
      blocktype_d[chn] = gfc.blocktype_old[chn];
      gfc.blocktype_old[chn] = blocktype;
    }
  }
  function vbrpsy_compute_MS_thresholds(eb, thr, cb_mld, ath_cb, athadjust, msfix, n) {
    var msfix2 = msfix * 2;
    var athlower = msfix > 0 ? Math.pow(10, athadjust) : 1;
    var rside, rmid;
    for (var b = 0; b < n; ++b) {
      var ebM = eb[2][b];
      var ebS = eb[3][b];
      var thmL = thr[0][b];
      var thmR = thr[1][b];
      var thmM = thr[2][b];
      var thmS = thr[3][b];
      if (thmL <= 1.58 * thmR && thmR <= 1.58 * thmL) {
        var mld_m = cb_mld[b] * ebS;
        var mld_s = cb_mld[b] * ebM;
        rmid = Math.max(thmM, Math.min(thmS, mld_m));
        rside = Math.max(thmS, Math.min(thmM, mld_s));
      } else {
        rmid = thmM;
        rside = thmS;
      }
      if (msfix > 0) {
        var thmLR, thmMS;
        var ath = ath_cb[b] * athlower;
        thmLR = Math.min(Math.max(thmL, ath), Math.max(thmR, ath));
        thmM = Math.max(rmid, ath);
        thmS = Math.max(rside, ath);
        thmMS = thmM + thmS;
        if (thmMS > 0 && thmLR * msfix2 < thmMS) {
          var f = thmLR * msfix2 / thmMS;
          thmM *= f;
          thmS *= f;
        }
        rmid = Math.min(thmM, rmid);
        rside = Math.min(thmS, rside);
      }
      if (rmid > ebM) {
        rmid = ebM;
      }
      if (rside > ebS) {
        rside = ebS;
      }
      thr[2][b] = rmid;
      thr[3][b] = rside;
    }
  }
  this.L3psycho_anal_vbr = function(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, percep_entropy, percep_MS_entropy, energy, blocktype_d) {
    var gfc = gfp.internal_flags;
    var wsamp_l;
    var wsamp_s;
    var fftenergy = new_float$a(Encoder.HBLKSIZE);
    var fftenergy_s = new_float_n$3([3, Encoder.HBLKSIZE_s]);
    var wsamp_L = new_float_n$3([2, Encoder.BLKSIZE]);
    var wsamp_S = new_float_n$3([2, 3, Encoder.BLKSIZE_s]);
    var eb = new_float_n$3([4, Encoder.CBANDS]);
    var thr = new_float_n$3([4, Encoder.CBANDS]);
    var sub_short_factor = new_float_n$3([4, 3]);
    var pcfact = 0.6;
    var ns_attacks = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    var uselongblock = new_int$b(2);
    var n_chn_psy = gfp.mode == MPEGMode.JOINT_STEREO ? 4 : gfc.channels_out;
    vbrpsy_attack_detection(
      gfp,
      buffer,
      bufPos,
      gr_out,
      masking_ratio,
      masking_MS_ratio,
      energy,
      sub_short_factor,
      ns_attacks,
      uselongblock
    );
    vbrpsy_compute_block_type(gfp, uselongblock);
    {
      for (var chn = 0; chn < n_chn_psy; chn++) {
        var ch01 = chn & 1;
        wsamp_l = wsamp_L;
        vbrpsy_compute_fft_l(
          gfp,
          buffer,
          bufPos,
          chn,
          gr_out,
          fftenergy,
          wsamp_l,
          ch01
        );
        vbrpsy_compute_loudness_approximation_l(gfp, gr_out, chn, fftenergy);
        if (uselongblock[ch01] != 0) {
          vbrpsy_compute_masking_l(gfc, fftenergy, eb[chn], thr[chn], chn);
        } else {
          vbrpsy_skip_masking_l(gfc, chn);
        }
      }
      if (uselongblock[0] + uselongblock[1] == 2) {
        if (gfp.mode == MPEGMode.JOINT_STEREO) {
          vbrpsy_compute_MS_thresholds(
            eb,
            thr,
            gfc.mld_cb_l,
            gfc.ATH.cb_l,
            gfp.ATHlower * gfc.ATH.adjust,
            gfp.msfix,
            gfc.npart_l
          );
        }
      }
      for (var chn = 0; chn < n_chn_psy; chn++) {
        var ch01 = chn & 1;
        if (uselongblock[ch01] != 0) {
          convert_partition2scalefac_l(gfc, eb[chn], thr[chn], chn);
        }
      }
    }
    {
      for (var sblock = 0; sblock < 3; sblock++) {
        for (var chn = 0; chn < n_chn_psy; ++chn) {
          var ch01 = chn & 1;
          if (uselongblock[ch01] != 0) {
            vbrpsy_skip_masking_s(gfc, chn, sblock);
          } else {
            wsamp_s = wsamp_S;
            vbrpsy_compute_fft_s(
              gfp,
              buffer,
              bufPos,
              chn,
              sblock,
              fftenergy_s,
              wsamp_s,
              ch01
            );
            vbrpsy_compute_masking_s(
              gfp,
              fftenergy_s,
              eb[chn],
              thr[chn],
              chn,
              sblock
            );
          }
        }
        if (uselongblock[0] + uselongblock[1] == 0) {
          if (gfp.mode == MPEGMode.JOINT_STEREO) {
            vbrpsy_compute_MS_thresholds(
              eb,
              thr,
              gfc.mld_cb_s,
              gfc.ATH.cb_s,
              gfp.ATHlower * gfc.ATH.adjust,
              gfp.msfix,
              gfc.npart_s
            );
          }
        }
        for (var chn = 0; chn < n_chn_psy; ++chn) {
          var ch01 = chn & 1;
          if (uselongblock[ch01] == 0) {
            convert_partition2scalefac_s(gfc, eb[chn], thr[chn], chn, sblock);
          }
        }
      }
      for (var chn = 0; chn < n_chn_psy; chn++) {
        var ch01 = chn & 1;
        if (uselongblock[ch01] != 0) {
          continue;
        }
        for (var sb = 0; sb < Encoder.SBMAX_s; sb++) {
          var new_thmm = new_float$a(3);
          for (var sblock = 0; sblock < 3; sblock++) {
            var thmm = gfc.thm[chn].s[sb][sblock];
            thmm *= NS_PREECHO_ATT0;
            if (ns_attacks[chn][sblock] >= 2 || ns_attacks[chn][sblock + 1] == 1) {
              var idx = sblock != 0 ? sblock - 1 : 2;
              var p2 = NS_INTERP(
                gfc.thm[chn].s[sb][idx],
                thmm,
                NS_PREECHO_ATT1 * pcfact
              );
              thmm = Math.min(thmm, p2);
            } else if (ns_attacks[chn][sblock] == 1) {
              var idx = sblock != 0 ? sblock - 1 : 2;
              var p2 = NS_INTERP(
                gfc.thm[chn].s[sb][idx],
                thmm,
                NS_PREECHO_ATT2 * pcfact
              );
              thmm = Math.min(thmm, p2);
            } else if (sblock != 0 && ns_attacks[chn][sblock - 1] == 3 || sblock == 0 && gfc.nsPsy.lastAttacks[chn] == 3) {
              var idx = sblock != 2 ? sblock + 1 : 0;
              var p2 = NS_INTERP(
                gfc.thm[chn].s[sb][idx],
                thmm,
                NS_PREECHO_ATT2 * pcfact
              );
              thmm = Math.min(thmm, p2);
            }
            thmm *= sub_short_factor[chn][sblock];
            new_thmm[sblock] = thmm;
          }
          for (var sblock = 0; sblock < 3; sblock++) {
            gfc.thm[chn].s[sb][sblock] = new_thmm[sblock];
          }
        }
      }
    }
    for (var chn = 0; chn < n_chn_psy; chn++) {
      gfc.nsPsy.lastAttacks[chn] = ns_attacks[chn][2];
    }
    vbrpsy_apply_block_type(gfp, uselongblock, blocktype_d);
    for (var chn = 0; chn < n_chn_psy; chn++) {
      var ppe;
      var ppePos;
      var type;
      var mr;
      if (chn > 1) {
        ppe = percep_MS_entropy;
        ppePos = -2;
        type = Encoder.NORM_TYPE;
        if (blocktype_d[0] == Encoder.SHORT_TYPE || blocktype_d[1] == Encoder.SHORT_TYPE) {
          type = Encoder.SHORT_TYPE;
        }
        mr = masking_MS_ratio[gr_out][chn - 2];
      } else {
        ppe = percep_entropy;
        ppePos = 0;
        type = blocktype_d[chn];
        mr = masking_ratio[gr_out][chn];
      }
      if (type == Encoder.SHORT_TYPE) {
        ppe[ppePos + chn] = pecalc_s(mr, gfc.masking_lower);
      } else {
        ppe[ppePos + chn] = pecalc_l(mr, gfc.masking_lower);
      }
      if (gfp.analysis) {
        gfc.pinfo.pe[gr_out][chn] = ppe[ppePos + chn];
      }
    }
    return 0;
  };
  function s3_func_x(bark, hf_slope) {
    var tempx = bark;
    var tempy;
    if (tempx >= 0) {
      tempy = -tempx * 27;
    } else {
      tempy = tempx * hf_slope;
    }
    if (tempy <= -72) {
      return 0;
    }
    return Math.exp(tempy * LN_TO_LOG10);
  }
  function norm_s3_func_x(hf_slope) {
    var lim_a = 0;
    var lim_b = 0;
    {
      var x = 0;
      var l;
      var h2;
      for (x = 0; s3_func_x(x, hf_slope) > 1e-20; x -= 1)
        ;
      l = x;
      h2 = 0;
      while (Math.abs(h2 - l) > 1e-12) {
        x = (h2 + l) / 2;
        if (s3_func_x(x, hf_slope) > 0) {
          h2 = x;
        } else {
          l = x;
        }
      }
      lim_a = l;
    }
    {
      var x = 0;
      var l;
      var h2;
      for (x = 0; s3_func_x(x, hf_slope) > 1e-20; x += 1)
        ;
      l = 0;
      h2 = x;
      while (Math.abs(h2 - l) > 1e-12) {
        x = (h2 + l) / 2;
        if (s3_func_x(x, hf_slope) > 0) {
          l = x;
        } else {
          h2 = x;
        }
      }
      lim_b = h2;
    }
    {
      var sum = 0;
      var m = 1e3;
      var i;
      for (i = 0; i <= m; ++i) {
        var x = lim_a + i * (lim_b - lim_a) / m;
        var y = s3_func_x(x, hf_slope);
        sum += y;
      }
      {
        var norm = (m + 1) / (sum * (lim_b - lim_a));
        return norm;
      }
    }
  }
  function s3_func(bark) {
    var tempx, x, tempy, temp;
    tempx = bark;
    if (tempx >= 0)
      tempx *= 3;
    else
      tempx *= 1.5;
    if (tempx >= 0.5 && tempx <= 2.5) {
      temp = tempx - 0.5;
      x = 8 * (temp * temp - 2 * temp);
    } else
      x = 0;
    tempx += 0.474;
    tempy = 15.811389 + 7.5 * tempx - 17.5 * Math.sqrt(1 + tempx * tempx);
    if (tempy <= -60)
      return 0;
    tempx = Math.exp((x + tempy) * LN_TO_LOG10);
    tempx /= 0.6609193;
    return tempx;
  }
  function freq2bark(freq) {
    if (freq < 0)
      freq = 0;
    freq = freq * 1e-3;
    return 13 * Math.atan(0.76 * freq) + 3.5 * Math.atan(freq * freq / (7.5 * 7.5));
  }
  function init_numline(numlines, bo, bm, bval, bval_width, mld, bo_w, sfreq, blksize, scalepos, deltafreq, sbmax) {
    var b_frq = new_float$a(Encoder.CBANDS + 1);
    var sample_freq_frac = sfreq / (sbmax > 15 ? 2 * 576 : 2 * 192);
    var partition = new_int$b(Encoder.HBLKSIZE);
    var i;
    sfreq /= blksize;
    var j = 0;
    var ni = 0;
    for (i = 0; i < Encoder.CBANDS; i++) {
      var bark1;
      var j2;
      bark1 = freq2bark(sfreq * j);
      b_frq[i] = sfreq * j;
      for (j2 = j; freq2bark(sfreq * j2) - bark1 < DELBARK && j2 <= blksize / 2; j2++)
        ;
      numlines[i] = j2 - j;
      ni = i + 1;
      while (j < j2) {
        partition[j++] = i;
      }
      if (j > blksize / 2) {
        j = blksize / 2;
        ++i;
        break;
      }
    }
    b_frq[i] = sfreq * j;
    for (var sfb = 0; sfb < sbmax; sfb++) {
      var i1, i2, start2, end;
      var arg;
      start2 = scalepos[sfb];
      end = scalepos[sfb + 1];
      i1 = 0 | Math.floor(0.5 + deltafreq * (start2 - 0.5));
      if (i1 < 0)
        i1 = 0;
      i2 = 0 | Math.floor(0.5 + deltafreq * (end - 0.5));
      if (i2 > blksize / 2)
        i2 = blksize / 2;
      bm[sfb] = (partition[i1] + partition[i2]) / 2;
      bo[sfb] = partition[i2];
      var f_tmp = sample_freq_frac * end;
      bo_w[sfb] = (f_tmp - b_frq[bo[sfb]]) / (b_frq[bo[sfb] + 1] - b_frq[bo[sfb]]);
      if (bo_w[sfb] < 0) {
        bo_w[sfb] = 0;
      } else {
        if (bo_w[sfb] > 1) {
          bo_w[sfb] = 1;
        }
      }
      arg = freq2bark(sfreq * scalepos[sfb] * deltafreq);
      arg = Math.min(arg, 15.5) / 15.5;
      mld[sfb] = Math.pow(10, 1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5);
    }
    j = 0;
    for (var k = 0; k < ni; k++) {
      var w = numlines[k];
      var bark1, bark2;
      bark1 = freq2bark(sfreq * j);
      bark2 = freq2bark(sfreq * (j + w - 1));
      bval[k] = 0.5 * (bark1 + bark2);
      bark1 = freq2bark(sfreq * (j - 0.5));
      bark2 = freq2bark(sfreq * (j + w - 0.5));
      bval_width[k] = bark2 - bark1;
      j += w;
    }
    return ni;
  }
  function init_s3_values(s3ind, npart, bval, bval_width, norm, use_old_s3) {
    var s3 = new_float_n$3([Encoder.CBANDS, Encoder.CBANDS]);
    var j;
    var numberOfNoneZero = 0;
    if (use_old_s3) {
      for (var i = 0; i < npart; i++) {
        for (j = 0; j < npart; j++) {
          var v = s3_func(bval[i] - bval[j]) * bval_width[j];
          s3[i][j] = v * norm[i];
        }
      }
    } else {
      for (j = 0; j < npart; j++) {
        var hf_slope = 15 + Math.min(21 / bval[j], 12);
        var s3_x_norm = norm_s3_func_x(hf_slope);
        for (var i = 0; i < npart; i++) {
          var v = s3_x_norm * s3_func_x(bval[i] - bval[j], hf_slope) * bval_width[j];
          s3[i][j] = v * norm[i];
        }
      }
    }
    for (var i = 0; i < npart; i++) {
      for (j = 0; j < npart; j++) {
        if (s3[i][j] > 0)
          break;
      }
      s3ind[i][0] = j;
      for (j = npart - 1; j > 0; j--) {
        if (s3[i][j] > 0)
          break;
      }
      s3ind[i][1] = j;
      numberOfNoneZero += s3ind[i][1] - s3ind[i][0] + 1;
    }
    var p2 = new_float$a(numberOfNoneZero);
    var k = 0;
    for (var i = 0; i < npart; i++) {
      for (j = s3ind[i][0]; j <= s3ind[i][1]; j++)
        p2[k++] = s3[i][j];
    }
    return p2;
  }
  function stereo_demask(f) {
    var arg = freq2bark(f);
    arg = Math.min(arg, 15.5) / 15.5;
    return Math.pow(10, 1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5);
  }
  this.psymodel_init = function(gfp) {
    var gfc = gfp.internal_flags;
    var i;
    var useOldS3 = true;
    var bvl_a = 13;
    var bvl_b = 24;
    var snr_l_a = 0;
    var snr_l_b = 0;
    var snr_s_a = -8.25;
    var snr_s_b = -4.5;
    var bval = new_float$a(Encoder.CBANDS);
    var bval_width = new_float$a(Encoder.CBANDS);
    var norm = new_float$a(Encoder.CBANDS);
    var sfreq = gfp.out_samplerate;
    switch (gfp.experimentalZ) {
      default:
      case 0:
        useOldS3 = true;
        break;
      case 1:
        useOldS3 = !(gfp.VBR == VbrMode$5.vbr_mtrh || gfp.VBR == VbrMode$5.vbr_mt);
        break;
      case 2:
        useOldS3 = false;
        break;
      case 3:
        bvl_a = 8;
        snr_l_a = -1.75;
        snr_l_b = -0.0125;
        snr_s_a = -8.25;
        snr_s_b = -2.25;
        break;
    }
    gfc.ms_ener_ratio_old = 0.25;
    gfc.blocktype_old[0] = gfc.blocktype_old[1] = Encoder.NORM_TYPE;
    for (i = 0; i < 4; ++i) {
      for (var j = 0; j < Encoder.CBANDS; ++j) {
        gfc.nb_1[i][j] = 1e20;
        gfc.nb_2[i][j] = 1e20;
        gfc.nb_s1[i][j] = gfc.nb_s2[i][j] = 1;
      }
      for (var sb = 0; sb < Encoder.SBMAX_l; sb++) {
        gfc.en[i].l[sb] = 1e20;
        gfc.thm[i].l[sb] = 1e20;
      }
      for (var j = 0; j < 3; ++j) {
        for (var sb = 0; sb < Encoder.SBMAX_s; sb++) {
          gfc.en[i].s[sb][j] = 1e20;
          gfc.thm[i].s[sb][j] = 1e20;
        }
        gfc.nsPsy.lastAttacks[i] = 0;
      }
      for (var j = 0; j < 9; j++)
        gfc.nsPsy.last_en_subshort[i][j] = 10;
    }
    gfc.loudness_sq_save[0] = gfc.loudness_sq_save[1] = 0;
    gfc.npart_l = init_numline(
      gfc.numlines_l,
      gfc.bo_l,
      gfc.bm_l,
      bval,
      bval_width,
      gfc.mld_l,
      gfc.PSY.bo_l_weight,
      sfreq,
      Encoder.BLKSIZE,
      gfc.scalefac_band.l,
      Encoder.BLKSIZE / (2 * 576),
      Encoder.SBMAX_l
    );
    assert$9(gfc.npart_l < Encoder.CBANDS);
    for (i = 0; i < gfc.npart_l; i++) {
      var snr = snr_l_a;
      if (bval[i] >= bvl_a) {
        snr = snr_l_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_l_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
      }
      norm[i] = Math.pow(10, snr / 10);
      if (gfc.numlines_l[i] > 0) {
        gfc.rnumlines_l[i] = 1 / gfc.numlines_l[i];
      } else {
        gfc.rnumlines_l[i] = 0;
      }
    }
    gfc.s3_ll = init_s3_values(
      gfc.s3ind,
      gfc.npart_l,
      bval,
      bval_width,
      norm,
      useOldS3
    );
    var j = 0;
    for (i = 0; i < gfc.npart_l; i++) {
      var x;
      x = Float$1.MAX_VALUE;
      for (var k = 0; k < gfc.numlines_l[i]; k++, j++) {
        var freq = sfreq * j / (1e3 * Encoder.BLKSIZE);
        var level;
        level = this.ATHformula(freq * 1e3, gfp) - 20;
        level = Math.pow(10, 0.1 * level);
        level *= gfc.numlines_l[i];
        if (x > level)
          x = level;
      }
      gfc.ATH.cb_l[i] = x;
      x = -20 + bval[i] * 20 / 10;
      if (x > 6) {
        x = 100;
      }
      if (x < -15) {
        x = -15;
      }
      x -= 8;
      gfc.minval_l[i] = Math.pow(10, x / 10) * gfc.numlines_l[i];
    }
    gfc.npart_s = init_numline(
      gfc.numlines_s,
      gfc.bo_s,
      gfc.bm_s,
      bval,
      bval_width,
      gfc.mld_s,
      gfc.PSY.bo_s_weight,
      sfreq,
      Encoder.BLKSIZE_s,
      gfc.scalefac_band.s,
      Encoder.BLKSIZE_s / (2 * 192),
      Encoder.SBMAX_s
    );
    assert$9(gfc.npart_s < Encoder.CBANDS);
    j = 0;
    for (i = 0; i < gfc.npart_s; i++) {
      var x;
      var snr = snr_s_a;
      if (bval[i] >= bvl_a) {
        snr = snr_s_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_s_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
      }
      norm[i] = Math.pow(10, snr / 10);
      x = Float$1.MAX_VALUE;
      for (var k = 0; k < gfc.numlines_s[i]; k++, j++) {
        var freq = sfreq * j / (1e3 * Encoder.BLKSIZE_s);
        var level;
        level = this.ATHformula(freq * 1e3, gfp) - 20;
        level = Math.pow(10, 0.1 * level);
        level *= gfc.numlines_s[i];
        if (x > level)
          x = level;
      }
      gfc.ATH.cb_s[i] = x;
      x = -7 + bval[i] * 7 / 12;
      if (bval[i] > 12) {
        x *= 1 + Math.log(1 + x) * 3.1;
      }
      if (bval[i] < 12) {
        x *= 1 + Math.log(1 - x) * 2.3;
      }
      if (x < -15) {
        x = -15;
      }
      x -= 8;
      gfc.minval_s[i] = Math.pow(10, x / 10) * gfc.numlines_s[i];
    }
    gfc.s3_ss = init_s3_values(
      gfc.s3ind_s,
      gfc.npart_s,
      bval,
      bval_width,
      norm,
      useOldS3
    );
    init_mask_add_max_values();
    fft.init_fft(gfc);
    gfc.decay = Math.exp(
      -1 * LOG10 / (temporalmask_sustain_sec * sfreq / 192)
    );
    {
      var msfix;
      msfix = NS_MSFIX;
      if ((gfp.exp_nspsytune & 2) != 0)
        msfix = 1;
      if (Math.abs(gfp.msfix) > 0)
        msfix = gfp.msfix;
      gfp.msfix = msfix;
      for (var b = 0; b < gfc.npart_l; b++) {
        if (gfc.s3ind[b][1] > gfc.npart_l - 1)
          gfc.s3ind[b][1] = gfc.npart_l - 1;
      }
    }
    var frame_duration = 576 * gfc.mode_gr / sfreq;
    gfc.ATH.decay = Math.pow(10, -12 / 10 * frame_duration);
    gfc.ATH.adjust = 0.01;
    gfc.ATH.adjustLimit = 1;
    assert$9(gfc.bo_l[Encoder.SBMAX_l - 1] <= gfc.npart_l);
    assert$9(gfc.bo_s[Encoder.SBMAX_s - 1] <= gfc.npart_s);
    if (gfp.ATHtype != -1) {
      var freq;
      var freq_inc = gfp.out_samplerate / Encoder.BLKSIZE;
      var eql_balance = 0;
      freq = 0;
      for (i = 0; i < Encoder.BLKSIZE / 2; ++i) {
        freq += freq_inc;
        gfc.ATH.eql_w[i] = 1 / Math.pow(10, this.ATHformula(freq, gfp) / 10);
        eql_balance += gfc.ATH.eql_w[i];
      }
      eql_balance = 1 / eql_balance;
      for (i = Encoder.BLKSIZE / 2; --i >= 0; ) {
        gfc.ATH.eql_w[i] *= eql_balance;
      }
    }
    {
      for (var b = j = 0; b < gfc.npart_s; ++b) {
        for (i = 0; i < gfc.numlines_s[b]; ++i) {
          ++j;
        }
      }
      for (var b = j = 0; b < gfc.npart_l; ++b) {
        for (i = 0; i < gfc.numlines_l[b]; ++i) {
          ++j;
        }
      }
    }
    j = 0;
    for (i = 0; i < gfc.npart_l; i++) {
      var freq = sfreq * (j + gfc.numlines_l[i] / 2) / (1 * Encoder.BLKSIZE);
      gfc.mld_cb_l[i] = stereo_demask(freq);
      j += gfc.numlines_l[i];
    }
    for (; i < Encoder.CBANDS; ++i) {
      gfc.mld_cb_l[i] = 1;
    }
    j = 0;
    for (i = 0; i < gfc.npart_s; i++) {
      var freq = sfreq * (j + gfc.numlines_s[i] / 2) / (1 * Encoder.BLKSIZE_s);
      gfc.mld_cb_s[i] = stereo_demask(freq);
      j += gfc.numlines_s[i];
    }
    for (; i < Encoder.CBANDS; ++i) {
      gfc.mld_cb_s[i] = 1;
    }
    return 0;
  };
  function ATHformula_GB(f, value) {
    if (f < -0.3)
      f = 3410;
    f /= 1e3;
    f = Math.max(0.1, f);
    var ath = 3.64 * Math.pow(f, -0.8) - 6.8 * Math.exp(-0.6 * Math.pow(f - 3.4, 2)) + 6 * Math.exp(-0.15 * Math.pow(f - 8.7, 2)) + (0.6 + 0.04 * value) * 1e-3 * Math.pow(f, 4);
    return ath;
  }
  this.ATHformula = function(f, gfp) {
    var ath;
    switch (gfp.ATHtype) {
      case 0:
        ath = ATHformula_GB(f, 9);
        break;
      case 1:
        ath = ATHformula_GB(f, -1);
        break;
      case 2:
        ath = ATHformula_GB(f, 0);
        break;
      case 3:
        ath = ATHformula_GB(f, 1) + 6;
        break;
      case 4:
        ath = ATHformula_GB(f, gfp.ATHcurve);
        break;
      default:
        ath = ATHformula_GB(f, 0);
        break;
    }
    return ath;
  };
}
function LameGlobalFlags() {
  this.class_id = 0;
  this.num_samples = 0;
  this.num_channels = 0;
  this.in_samplerate = 0;
  this.out_samplerate = 0;
  this.scale = 0;
  this.scale_left = 0;
  this.scale_right = 0;
  this.analysis = false;
  this.bWriteVbrTag = false;
  this.decode_only = false;
  this.quality = 0;
  this.mode = MPEGMode.STEREO;
  this.force_ms = false;
  this.free_format = false;
  this.findReplayGain = false;
  this.decode_on_the_fly = false;
  this.write_id3tag_automatic = false;
  this.brate = 0;
  this.compression_ratio = 0;
  this.copyright = 0;
  this.original = 0;
  this.extension = 0;
  this.emphasis = 0;
  this.error_protection = 0;
  this.strict_ISO = false;
  this.disable_reservoir = false;
  this.quant_comp = 0;
  this.quant_comp_short = 0;
  this.experimentalY = false;
  this.experimentalZ = 0;
  this.exp_nspsytune = 0;
  this.preset = 0;
  this.VBR = null;
  this.VBR_q_frac = 0;
  this.VBR_q = 0;
  this.VBR_mean_bitrate_kbps = 0;
  this.VBR_min_bitrate_kbps = 0;
  this.VBR_max_bitrate_kbps = 0;
  this.VBR_hard_min = 0;
  this.lowpassfreq = 0;
  this.highpassfreq = 0;
  this.lowpasswidth = 0;
  this.highpasswidth = 0;
  this.maskingadjust = 0;
  this.maskingadjust_short = 0;
  this.ATHonly = false;
  this.ATHshort = false;
  this.noATH = false;
  this.ATHtype = 0;
  this.ATHcurve = 0;
  this.ATHlower = 0;
  this.athaa_type = 0;
  this.athaa_loudapprox = 0;
  this.athaa_sensitivity = 0;
  this.short_blocks = null;
  this.useTemporal = false;
  this.interChRatio = 0;
  this.msfix = 0;
  this.tune = false;
  this.tune_value_a = 0;
  this.version = 0;
  this.encoder_delay = 0;
  this.encoder_padding = 0;
  this.framesize = 0;
  this.frameNum = 0;
  this.lame_allocated_gfp = 0;
  this.internal_flags = null;
}
var L3Side$1 = {};
L3Side$1.SFBMAX = Encoder.SBMAX_s * 3;
var new_float$9 = common.new_float;
var new_int$a = common.new_int;
function GrInfo() {
  this.xr = new_float$9(576);
  this.l3_enc = new_int$a(576);
  this.scalefac = new_int$a(L3Side$1.SFBMAX);
  this.xrpow_max = 0;
  this.part2_3_length = 0;
  this.big_values = 0;
  this.count1 = 0;
  this.global_gain = 0;
  this.scalefac_compress = 0;
  this.block_type = 0;
  this.mixed_block_flag = 0;
  this.table_select = new_int$a(3);
  this.subblock_gain = new_int$a(3 + 1);
  this.region0_count = 0;
  this.region1_count = 0;
  this.preflag = 0;
  this.scalefac_scale = 0;
  this.count1table_select = 0;
  this.part2_length = 0;
  this.sfb_lmax = 0;
  this.sfb_smin = 0;
  this.psy_lmax = 0;
  this.sfbmax = 0;
  this.psymax = 0;
  this.sfbdivide = 0;
  this.width = new_int$a(L3Side$1.SFBMAX);
  this.window = new_int$a(L3Side$1.SFBMAX);
  this.count1bits = 0;
  this.sfb_partition_table = null;
  this.slen = new_int$a(4);
  this.max_nonzero_coeff = 0;
  var self2 = this;
  function clone_int(array) {
    return new Int32Array(array);
  }
  function clone_float(array) {
    return new Float32Array(array);
  }
  this.assign = function(other) {
    self2.xr = clone_float(other.xr);
    self2.l3_enc = clone_int(other.l3_enc);
    self2.scalefac = clone_int(other.scalefac);
    self2.xrpow_max = other.xrpow_max;
    self2.part2_3_length = other.part2_3_length;
    self2.big_values = other.big_values;
    self2.count1 = other.count1;
    self2.global_gain = other.global_gain;
    self2.scalefac_compress = other.scalefac_compress;
    self2.block_type = other.block_type;
    self2.mixed_block_flag = other.mixed_block_flag;
    self2.table_select = clone_int(other.table_select);
    self2.subblock_gain = clone_int(other.subblock_gain);
    self2.region0_count = other.region0_count;
    self2.region1_count = other.region1_count;
    self2.preflag = other.preflag;
    self2.scalefac_scale = other.scalefac_scale;
    self2.count1table_select = other.count1table_select;
    self2.part2_length = other.part2_length;
    self2.sfb_lmax = other.sfb_lmax;
    self2.sfb_smin = other.sfb_smin;
    self2.psy_lmax = other.psy_lmax;
    self2.sfbmax = other.sfbmax;
    self2.psymax = other.psymax;
    self2.sfbdivide = other.sfbdivide;
    self2.width = clone_int(other.width);
    self2.window = clone_int(other.window);
    self2.count1bits = other.count1bits;
    self2.sfb_partition_table = other.sfb_partition_table.slice(0);
    self2.slen = clone_int(other.slen);
    self2.max_nonzero_coeff = other.max_nonzero_coeff;
  };
}
var new_int$9 = common.new_int;
function IIISideInfo() {
  this.tt = [
    [null, null],
    [null, null]
  ];
  this.main_data_begin = 0;
  this.private_bits = 0;
  this.resvDrain_pre = 0;
  this.resvDrain_post = 0;
  this.scfsi = [new_int$9(4), new_int$9(4)];
  for (var gr = 0; gr < 2; gr++) {
    for (var ch = 0; ch < 2; ch++) {
      this.tt[gr][ch] = new GrInfo();
    }
  }
}
var System$6 = common.System;
var new_int$8 = common.new_int;
function ScaleFac(arrL, arrS, arr21, arr12) {
  this.l = new_int$8(1 + Encoder.SBMAX_l);
  this.s = new_int$8(1 + Encoder.SBMAX_s);
  this.psfb21 = new_int$8(1 + Encoder.PSFB21);
  this.psfb12 = new_int$8(1 + Encoder.PSFB12);
  var l = this.l;
  var s = this.s;
  if (arguments.length == 4) {
    this.arrL = arguments[0];
    this.arrS = arguments[1];
    this.arr21 = arguments[2];
    this.arr12 = arguments[3];
    System$6.arraycopy(
      this.arrL,
      0,
      l,
      0,
      Math.min(this.arrL.length, this.l.length)
    );
    System$6.arraycopy(
      this.arrS,
      0,
      s,
      0,
      Math.min(this.arrS.length, this.s.length)
    );
    System$6.arraycopy(
      this.arr21,
      0,
      this.psfb21,
      0,
      Math.min(this.arr21.length, this.psfb21.length)
    );
    System$6.arraycopy(
      this.arr12,
      0,
      this.psfb12,
      0,
      Math.min(this.arr12.length, this.psfb12.length)
    );
  }
}
var new_float$8 = common.new_float;
var new_float_n$2 = common.new_float_n;
var new_int$7 = common.new_int;
function NsPsy() {
  this.last_en_subshort = new_float_n$2([4, 9]);
  this.lastAttacks = new_int$7(4);
  this.pefirbuf = new_float$8(19);
  this.longfact = new_float$8(Encoder.SBMAX_l);
  this.shortfact = new_float$8(Encoder.SBMAX_s);
  this.attackthre = 0;
  this.attackthre_s = 0;
}
function VBRSeekInfo() {
  this.sum = 0;
  this.seen = 0;
  this.want = 0;
  this.pos = 0;
  this.size = 0;
  this.bag = null;
  this.nVbrNumFrames = 0;
  this.nBytesWritten = 0;
  this.TotalFrameSize = 0;
}
var new_byte$3 = common.new_byte;
var new_double = common.new_double;
var new_float$7 = common.new_float;
var new_float_n$1 = common.new_float_n;
var new_int$6 = common.new_int;
var new_int_n$1 = common.new_int_n;
LameInternalFlags$1.MFSIZE = 3 * 1152 + Encoder.ENCDELAY - Encoder.MDCTDELAY;
LameInternalFlags$1.MAX_HEADER_BUF = 256;
LameInternalFlags$1.MAX_BITS_PER_CHANNEL = 4095;
LameInternalFlags$1.MAX_BITS_PER_GRANULE = 7680;
LameInternalFlags$1.BPC = 320;
function LameInternalFlags$1() {
  var MAX_HEADER_LEN = 40;
  this.Class_ID = 0;
  this.lame_encode_frame_init = 0;
  this.iteration_init_init = 0;
  this.fill_buffer_resample_init = 0;
  this.mfbuf = new_float_n$1([2, LameInternalFlags$1.MFSIZE]);
  this.mode_gr = 0;
  this.channels_in = 0;
  this.channels_out = 0;
  this.resample_ratio = 0;
  this.mf_samples_to_encode = 0;
  this.mf_size = 0;
  this.VBR_min_bitrate = 0;
  this.VBR_max_bitrate = 0;
  this.bitrate_index = 0;
  this.samplerate_index = 0;
  this.mode_ext = 0;
  this.lowpass1 = 0;
  this.lowpass2 = 0;
  this.highpass1 = 0;
  this.highpass2 = 0;
  this.noise_shaping = 0;
  this.noise_shaping_amp = 0;
  this.substep_shaping = 0;
  this.psymodel = 0;
  this.noise_shaping_stop = 0;
  this.subblock_gain = 0;
  this.use_best_huffman = 0;
  this.full_outer_loop = 0;
  this.l3_side = new IIISideInfo();
  this.ms_ratio = new_float$7(2);
  this.padding = 0;
  this.frac_SpF = 0;
  this.slot_lag = 0;
  this.tag_spec = null;
  this.nMusicCRC = 0;
  this.OldValue = new_int$6(2);
  this.CurrentStep = new_int$6(2);
  this.masking_lower = 0;
  this.bv_scf = new_int$6(576);
  this.pseudohalf = new_int$6(L3Side$1.SFBMAX);
  this.sfb21_extra = false;
  this.inbuf_old = new Array(2);
  this.blackfilt = new Array(2 * LameInternalFlags$1.BPC + 1);
  this.itime = new_double(2);
  this.sideinfo_len = 0;
  this.sb_sample = new_float_n$1([2, 2, 18, Encoder.SBLIMIT]);
  this.amp_filter = new_float$7(32);
  function Header() {
    this.write_timing = 0;
    this.ptr = 0;
    this.buf = new_byte$3(MAX_HEADER_LEN);
  }
  this.header = new Array(LameInternalFlags$1.MAX_HEADER_BUF);
  this.h_ptr = 0;
  this.w_ptr = 0;
  this.ancillary_flag = 0;
  this.ResvSize = 0;
  this.ResvMax = 0;
  this.scalefac_band = new ScaleFac();
  this.minval_l = new_float$7(Encoder.CBANDS);
  this.minval_s = new_float$7(Encoder.CBANDS);
  this.nb_1 = new_float_n$1([4, Encoder.CBANDS]);
  this.nb_2 = new_float_n$1([4, Encoder.CBANDS]);
  this.nb_s1 = new_float_n$1([4, Encoder.CBANDS]);
  this.nb_s2 = new_float_n$1([4, Encoder.CBANDS]);
  this.s3_ss = null;
  this.s3_ll = null;
  this.decay = 0;
  this.thm = new Array(4);
  this.en = new Array(4);
  this.tot_ener = new_float$7(4);
  this.loudness_sq = new_float_n$1([2, 2]);
  this.loudness_sq_save = new_float$7(2);
  this.mld_l = new_float$7(Encoder.SBMAX_l);
  this.mld_s = new_float$7(Encoder.SBMAX_s);
  this.bm_l = new_int$6(Encoder.SBMAX_l);
  this.bo_l = new_int$6(Encoder.SBMAX_l);
  this.bm_s = new_int$6(Encoder.SBMAX_s);
  this.bo_s = new_int$6(Encoder.SBMAX_s);
  this.npart_l = 0;
  this.npart_s = 0;
  this.s3ind = new_int_n$1([Encoder.CBANDS, 2]);
  this.s3ind_s = new_int_n$1([Encoder.CBANDS, 2]);
  this.numlines_s = new_int$6(Encoder.CBANDS);
  this.numlines_l = new_int$6(Encoder.CBANDS);
  this.rnumlines_l = new_float$7(Encoder.CBANDS);
  this.mld_cb_l = new_float$7(Encoder.CBANDS);
  this.mld_cb_s = new_float$7(Encoder.CBANDS);
  this.numlines_s_num1 = 0;
  this.numlines_l_num1 = 0;
  this.pe = new_float$7(4);
  this.ms_ratio_s_old = 0;
  this.ms_ratio_l_old = 0;
  this.ms_ener_ratio_old = 0;
  this.blocktype_old = new_int$6(2);
  this.nsPsy = new NsPsy();
  this.VBR_seek_table = new VBRSeekInfo();
  this.ATH = null;
  this.PSY = null;
  this.nogap_total = 0;
  this.nogap_current = 0;
  this.decode_on_the_fly = true;
  this.findReplayGain = true;
  this.findPeakSample = true;
  this.PeakSample = 0;
  this.RadioGain = 0;
  this.AudiophileGain = 0;
  this.rgdata = null;
  this.noclipGainChange = 0;
  this.noclipScale = 0;
  this.bitrate_stereoMode_Hist = new_int_n$1([16, 4 + 1]);
  this.bitrate_blockType_Hist = new_int_n$1([16, 4 + 1 + 1]);
  this.pinfo = null;
  this.hip = null;
  this.in_buffer_nsamples = 0;
  this.in_buffer_0 = null;
  this.in_buffer_1 = null;
  this.iteration_loop = null;
  for (var i = 0; i < this.en.length; i++) {
    this.en[i] = new III_psy_xmin();
  }
  for (var i = 0; i < this.thm.length; i++) {
    this.thm[i] = new III_psy_xmin();
  }
  for (var i = 0; i < this.header.length; i++) {
    this.header[i] = new Header();
  }
}
var new_float$6 = common.new_float;
function ATH() {
  this.useAdjust = 0;
  this.aaSensitivityP = 0;
  this.adjust = 0;
  this.adjustLimit = 0;
  this.decay = 0;
  this.floor = 0;
  this.l = new_float$6(Encoder.SBMAX_l);
  this.s = new_float$6(Encoder.SBMAX_s);
  this.psfb21 = new_float$6(Encoder.PSFB21);
  this.psfb12 = new_float$6(Encoder.PSFB12);
  this.cb_l = new_float$6(Encoder.CBANDS);
  this.cb_s = new_float$6(Encoder.CBANDS);
  this.eql_w = new_float$6(Encoder.BLKSIZE / 2);
}
var System$5 = common.System;
var Arrays$4 = common.Arrays;
GainAnalysis$1.STEPS_per_dB = 100;
GainAnalysis$1.MAX_dB = 120;
GainAnalysis$1.GAIN_NOT_ENOUGH_SAMPLES = -24601;
GainAnalysis$1.GAIN_ANALYSIS_ERROR = 0;
GainAnalysis$1.GAIN_ANALYSIS_OK = 1;
GainAnalysis$1.INIT_GAIN_ANALYSIS_ERROR = 0;
GainAnalysis$1.INIT_GAIN_ANALYSIS_OK = 1;
GainAnalysis$1.YULE_ORDER = 10;
GainAnalysis$1.MAX_ORDER = GainAnalysis$1.YULE_ORDER;
GainAnalysis$1.MAX_SAMP_FREQ = 48e3;
GainAnalysis$1.RMS_WINDOW_TIME_NUMERATOR = 1;
GainAnalysis$1.RMS_WINDOW_TIME_DENOMINATOR = 20;
GainAnalysis$1.MAX_SAMPLES_PER_WINDOW = GainAnalysis$1.MAX_SAMP_FREQ * GainAnalysis$1.RMS_WINDOW_TIME_NUMERATOR / GainAnalysis$1.RMS_WINDOW_TIME_DENOMINATOR + 1;
function GainAnalysis$1() {
  var PINK_REF = 64.82;
  var RMS_PERCENTILE = 0.95;
  var RMS_WINDOW_TIME_NUMERATOR = GainAnalysis$1.RMS_WINDOW_TIME_NUMERATOR;
  var RMS_WINDOW_TIME_DENOMINATOR = GainAnalysis$1.RMS_WINDOW_TIME_DENOMINATOR;
  var ABYule = [
    [
      0.038575994352,
      -3.84664617118067,
      -0.02160367184185,
      7.81501653005538,
      -0.00123395316851,
      -11.34170355132042,
      -9291677959e-14,
      13.05504219327545,
      -0.01655260341619,
      -12.28759895145294,
      0.02161526843274,
      9.4829380631979,
      -0.02074045215285,
      -5.87257861775999,
      0.00594298065125,
      2.75465861874613,
      0.00306428023191,
      -0.86984376593551,
      12025322027e-14,
      0.13919314567432,
      0.00288463683916
    ],
    [
      0.0541865640643,
      -3.47845948550071,
      -0.02911007808948,
      6.36317777566148,
      -0.00848709379851,
      -8.54751527471874,
      -0.00851165645469,
      9.4769360780128,
      -0.00834990904936,
      -8.81498681370155,
      0.02245293253339,
      6.85401540936998,
      -0.02596338512915,
      -4.39470996079559,
      0.01624864962975,
      2.19611684890774,
      -0.00240879051584,
      -0.75104302451432,
      0.00674613682247,
      0.13149317958808,
      -0.00187763777362
    ],
    [
      0.15457299681924,
      -2.37898834973084,
      -0.09331049056315,
      2.84868151156327,
      -0.06247880153653,
      -2.64577170229825,
      0.02163541888798,
      2.23697657451713,
      -0.05588393329856,
      -1.67148153367602,
      0.04781476674921,
      1.00595954808547,
      0.00222312597743,
      -0.45953458054983,
      0.03174092540049,
      0.16378164858596,
      -0.01390589421898,
      -0.05032077717131,
      0.00651420667831,
      0.0234789740702,
      -0.00881362733839
    ],
    [
      0.30296907319327,
      -1.61273165137247,
      -0.22613988682123,
      1.0797749225997,
      -0.08587323730772,
      -0.2565625775407,
      0.03282930172664,
      -0.1627671912044,
      -0.00915702933434,
      -0.22638893773906,
      -0.02364141202522,
      0.39120800788284,
      -0.00584456039913,
      -0.22138138954925,
      0.06276101321749,
      0.04500235387352,
      -828086748e-14,
      0.02005851806501,
      0.00205861885564,
      0.00302439095741,
      -0.02950134983287
    ],
    [
      0.33642304856132,
      -1.49858979367799,
      -0.2557224142557,
      0.87350271418188,
      -0.11828570177555,
      0.12205022308084,
      0.11921148675203,
      -0.80774944671438,
      -0.07834489609479,
      0.47854794562326,
      -0.0046997791438,
      -0.12453458140019,
      -0.0058950022444,
      -0.04067510197014,
      0.05724228140351,
      0.08333755284107,
      0.00832043980773,
      -0.04237348025746,
      -0.0163538138454,
      0.02977207319925,
      -0.0176017656815
    ],
    [
      0.4491525660845,
      -0.62820619233671,
      -0.14351757464547,
      0.29661783706366,
      -0.22784394429749,
      -0.372563729424,
      -0.01419140100551,
      0.00213767857124,
      0.04078262797139,
      -0.42029820170918,
      -0.12398163381748,
      0.22199650564824,
      0.04097565135648,
      0.00613424350682,
      0.10478503600251,
      0.06747620744683,
      -0.01863887810927,
      0.05784820375801,
      -0.03193428438915,
      0.03222754072173,
      0.00541907748707
    ],
    [
      0.56619470757641,
      -1.04800335126349,
      -0.75464456939302,
      0.29156311971249,
      0.1624213774223,
      -0.26806001042947,
      0.16744243493672,
      0.00819999645858,
      -0.18901604199609,
      0.45054734505008,
      0.3093178284183,
      -0.33032403314006,
      -0.27562961986224,
      0.0673936833311,
      0.00647310677246,
      -0.04784254229033,
      0.08647503780351,
      0.01639907836189,
      -0.0378898455484,
      0.01807364323573,
      -0.00588215443421
    ],
    [
      0.58100494960553,
      -0.51035327095184,
      -0.53174909058578,
      -0.31863563325245,
      -0.14289799034253,
      -0.20256413484477,
      0.17520704835522,
      0.1472815413433,
      0.02377945217615,
      0.38952639978999,
      0.15558449135573,
      -0.23313271880868,
      -0.25344790059353,
      -0.05246019024463,
      0.01628462406333,
      -0.02505961724053,
      0.06920467763959,
      0.02442357316099,
      -0.03721611395801,
      0.01818801111503,
      -0.00749618797172
    ],
    [
      0.53648789255105,
      -0.2504987195602,
      -0.42163034350696,
      -0.43193942311114,
      -0.00275953611929,
      -0.03424681017675,
      0.04267842219415,
      -0.04678328784242,
      -0.10214864179676,
      0.26408300200955,
      0.14590772289388,
      0.15113130533216,
      -0.02459864859345,
      -0.17556493366449,
      -0.11202315195388,
      -0.18823009262115,
      -0.04060034127,
      0.05477720428674,
      0.0478866554818,
      0.0470440968812,
      -0.02217936801134
    ]
  ];
  var ABButter = [
    [
      0.98621192462708,
      -1.97223372919527,
      -1.97242384925416,
      0.97261396931306,
      0.98621192462708
    ],
    [
      0.98500175787242,
      -1.96977855582618,
      -1.97000351574484,
      0.9702284756635,
      0.98500175787242
    ],
    [
      0.97938932735214,
      -1.95835380975398,
      -1.95877865470428,
      0.95920349965459,
      0.97938932735214
    ],
    [
      0.97531843204928,
      -1.95002759149878,
      -1.95063686409857,
      0.95124613669835,
      0.97531843204928
    ],
    [
      0.97316523498161,
      -1.94561023566527,
      -1.94633046996323,
      0.94705070426118,
      0.97316523498161
    ],
    [
      0.96454515552826,
      -1.92783286977036,
      -1.92909031105652,
      0.93034775234268,
      0.96454515552826
    ],
    [
      0.96009142950541,
      -1.91858953033784,
      -1.92018285901082,
      0.92177618768381,
      0.96009142950541
    ],
    [
      0.95856916599601,
      -1.9154210807478,
      -1.91713833199203,
      0.91885558323625,
      0.95856916599601
    ],
    [
      0.94597685600279,
      -1.88903307939452,
      -1.89195371200558,
      0.89487434461664,
      0.94597685600279
    ]
  ];
  function filterYule(input, inputPos, output, outputPos, nSamples, kernel) {
    while (nSamples-- != 0) {
      output[outputPos] = 1e-10 + input[inputPos + 0] * kernel[0] - output[outputPos - 1] * kernel[1] + input[inputPos - 1] * kernel[2] - output[outputPos - 2] * kernel[3] + input[inputPos - 2] * kernel[4] - output[outputPos - 3] * kernel[5] + input[inputPos - 3] * kernel[6] - output[outputPos - 4] * kernel[7] + input[inputPos - 4] * kernel[8] - output[outputPos - 5] * kernel[9] + input[inputPos - 5] * kernel[10] - output[outputPos - 6] * kernel[11] + input[inputPos - 6] * kernel[12] - output[outputPos - 7] * kernel[13] + input[inputPos - 7] * kernel[14] - output[outputPos - 8] * kernel[15] + input[inputPos - 8] * kernel[16] - output[outputPos - 9] * kernel[17] + input[inputPos - 9] * kernel[18] - output[outputPos - 10] * kernel[19] + input[inputPos - 10] * kernel[20];
      ++outputPos;
      ++inputPos;
    }
  }
  function filterButter(input, inputPos, output, outputPos, nSamples, kernel) {
    while (nSamples-- != 0) {
      output[outputPos] = input[inputPos + 0] * kernel[0] - output[outputPos - 1] * kernel[1] + input[inputPos - 1] * kernel[2] - output[outputPos - 2] * kernel[3] + input[inputPos - 2] * kernel[4];
      ++outputPos;
      ++inputPos;
    }
  }
  function ResetSampleFrequency(rgData, samplefreq) {
    for (var i = 0; i < MAX_ORDER; i++) {
      rgData.linprebuf[i] = rgData.lstepbuf[i] = rgData.loutbuf[i] = rgData.rinprebuf[i] = rgData.rstepbuf[i] = rgData.routbuf[i] = 0;
    }
    switch (0 | samplefreq) {
      case 48e3:
        rgData.reqindex = 0;
        break;
      case 44100:
        rgData.reqindex = 1;
        break;
      case 32e3:
        rgData.reqindex = 2;
        break;
      case 24e3:
        rgData.reqindex = 3;
        break;
      case 22050:
        rgData.reqindex = 4;
        break;
      case 16e3:
        rgData.reqindex = 5;
        break;
      case 12e3:
        rgData.reqindex = 6;
        break;
      case 11025:
        rgData.reqindex = 7;
        break;
      case 8e3:
        rgData.reqindex = 8;
        break;
      default:
        return INIT_GAIN_ANALYSIS_ERROR;
    }
    rgData.sampleWindow = 0 | (samplefreq * RMS_WINDOW_TIME_NUMERATOR + RMS_WINDOW_TIME_DENOMINATOR - 1) / RMS_WINDOW_TIME_DENOMINATOR;
    rgData.lsum = 0;
    rgData.rsum = 0;
    rgData.totsamp = 0;
    Arrays$4.ill(rgData.A, 0);
    return INIT_GAIN_ANALYSIS_OK;
  }
  this.InitGainAnalysis = function(rgData, samplefreq) {
    if (ResetSampleFrequency(rgData, samplefreq) != INIT_GAIN_ANALYSIS_OK) {
      return INIT_GAIN_ANALYSIS_ERROR;
    }
    rgData.linpre = MAX_ORDER;
    rgData.rinpre = MAX_ORDER;
    rgData.lstep = MAX_ORDER;
    rgData.rstep = MAX_ORDER;
    rgData.lout = MAX_ORDER;
    rgData.rout = MAX_ORDER;
    Arrays$4.fill(rgData.B, 0);
    return INIT_GAIN_ANALYSIS_OK;
  };
  function fsqr(d) {
    return d * d;
  }
  this.AnalyzeSamples = function(rgData, left_samples, left_samplesPos, right_samples, right_samplesPos, num_samples, num_channels) {
    var curleft;
    var curleftBase;
    var curright;
    var currightBase;
    var batchsamples;
    var cursamples;
    var cursamplepos;
    if (num_samples == 0)
      return GAIN_ANALYSIS_OK;
    cursamplepos = 0;
    batchsamples = num_samples;
    switch (num_channels) {
      case 1:
        right_samples = left_samples;
        right_samplesPos = left_samplesPos;
        break;
      case 2:
        break;
      default:
        return GAIN_ANALYSIS_ERROR;
    }
    if (num_samples < MAX_ORDER) {
      System$5.arraycopy(
        left_samples,
        left_samplesPos,
        rgData.linprebuf,
        MAX_ORDER,
        num_samples
      );
      System$5.arraycopy(
        right_samples,
        right_samplesPos,
        rgData.rinprebuf,
        MAX_ORDER,
        num_samples
      );
    } else {
      System$5.arraycopy(
        left_samples,
        left_samplesPos,
        rgData.linprebuf,
        MAX_ORDER,
        MAX_ORDER
      );
      System$5.arraycopy(
        right_samples,
        right_samplesPos,
        rgData.rinprebuf,
        MAX_ORDER,
        MAX_ORDER
      );
    }
    while (batchsamples > 0) {
      cursamples = batchsamples > rgData.sampleWindow - rgData.totsamp ? rgData.sampleWindow - rgData.totsamp : batchsamples;
      if (cursamplepos < MAX_ORDER) {
        curleft = rgData.linpre + cursamplepos;
        curleftBase = rgData.linprebuf;
        curright = rgData.rinpre + cursamplepos;
        currightBase = rgData.rinprebuf;
        if (cursamples > MAX_ORDER - cursamplepos) {
          cursamples = MAX_ORDER - cursamplepos;
        }
      } else {
        curleft = left_samplesPos + cursamplepos;
        curleftBase = left_samples;
        curright = right_samplesPos + cursamplepos;
        currightBase = right_samples;
      }
      filterYule(
        curleftBase,
        curleft,
        rgData.lstepbuf,
        rgData.lstep + rgData.totsamp,
        cursamples,
        ABYule[rgData.reqindex]
      );
      filterYule(
        currightBase,
        curright,
        rgData.rstepbuf,
        rgData.rstep + rgData.totsamp,
        cursamples,
        ABYule[rgData.reqindex]
      );
      filterButter(
        rgData.lstepbuf,
        rgData.lstep + rgData.totsamp,
        rgData.loutbuf,
        rgData.lout + rgData.totsamp,
        cursamples,
        ABButter[rgData.reqindex]
      );
      filterButter(
        rgData.rstepbuf,
        rgData.rstep + rgData.totsamp,
        rgData.routbuf,
        rgData.rout + rgData.totsamp,
        cursamples,
        ABButter[rgData.reqindex]
      );
      curleft = rgData.lout + rgData.totsamp;
      curleftBase = rgData.loutbuf;
      curright = rgData.rout + rgData.totsamp;
      currightBase = rgData.routbuf;
      var i = cursamples % 8;
      while (i-- != 0) {
        rgData.lsum += fsqr(curleftBase[curleft++]);
        rgData.rsum += fsqr(currightBase[curright++]);
      }
      i = cursamples / 8;
      while (i-- != 0) {
        rgData.lsum += fsqr(curleftBase[curleft + 0]) + fsqr(curleftBase[curleft + 1]) + fsqr(curleftBase[curleft + 2]) + fsqr(curleftBase[curleft + 3]) + fsqr(curleftBase[curleft + 4]) + fsqr(curleftBase[curleft + 5]) + fsqr(curleftBase[curleft + 6]) + fsqr(curleftBase[curleft + 7]);
        curleft += 8;
        rgData.rsum += fsqr(currightBase[curright + 0]) + fsqr(currightBase[curright + 1]) + fsqr(currightBase[curright + 2]) + fsqr(currightBase[curright + 3]) + fsqr(currightBase[curright + 4]) + fsqr(currightBase[curright + 5]) + fsqr(currightBase[curright + 6]) + fsqr(currightBase[curright + 7]);
        curright += 8;
      }
      batchsamples -= cursamples;
      cursamplepos += cursamples;
      rgData.totsamp += cursamples;
      if (rgData.totsamp == rgData.sampleWindow) {
        var val = GainAnalysis$1.STEPS_per_dB * 10 * Math.log10(
          (rgData.lsum + rgData.rsum) / rgData.totsamp * 0.5 + 1e-37
        );
        var ival = val <= 0 ? 0 : 0 | val;
        if (ival >= rgData.A.length)
          ival = rgData.A.length - 1;
        rgData.A[ival]++;
        rgData.lsum = rgData.rsum = 0;
        System$5.arraycopy(
          rgData.loutbuf,
          rgData.totsamp,
          rgData.loutbuf,
          0,
          MAX_ORDER
        );
        System$5.arraycopy(
          rgData.routbuf,
          rgData.totsamp,
          rgData.routbuf,
          0,
          MAX_ORDER
        );
        System$5.arraycopy(
          rgData.lstepbuf,
          rgData.totsamp,
          rgData.lstepbuf,
          0,
          MAX_ORDER
        );
        System$5.arraycopy(
          rgData.rstepbuf,
          rgData.totsamp,
          rgData.rstepbuf,
          0,
          MAX_ORDER
        );
        rgData.totsamp = 0;
      }
      if (rgData.totsamp > rgData.sampleWindow) {
        return GAIN_ANALYSIS_ERROR;
      }
    }
    if (num_samples < MAX_ORDER) {
      System$5.arraycopy(
        rgData.linprebuf,
        num_samples,
        rgData.linprebuf,
        0,
        MAX_ORDER - num_samples
      );
      System$5.arraycopy(
        rgData.rinprebuf,
        num_samples,
        rgData.rinprebuf,
        0,
        MAX_ORDER - num_samples
      );
      System$5.arraycopy(
        left_samples,
        left_samplesPos,
        rgData.linprebuf,
        MAX_ORDER - num_samples,
        num_samples
      );
      System$5.arraycopy(
        right_samples,
        right_samplesPos,
        rgData.rinprebuf,
        MAX_ORDER - num_samples,
        num_samples
      );
    } else {
      System$5.arraycopy(
        left_samples,
        left_samplesPos + num_samples - MAX_ORDER,
        rgData.linprebuf,
        0,
        MAX_ORDER
      );
      System$5.arraycopy(
        right_samples,
        right_samplesPos + num_samples - MAX_ORDER,
        rgData.rinprebuf,
        0,
        MAX_ORDER
      );
    }
    return GAIN_ANALYSIS_OK;
  };
  function analyzeResult(Array2, len) {
    var i;
    var elems = 0;
    for (i = 0; i < len; i++)
      elems += Array2[i];
    if (elems == 0)
      return GAIN_NOT_ENOUGH_SAMPLES;
    var upper = 0 | Math.ceil(elems * (1 - RMS_PERCENTILE));
    for (i = len; i-- > 0; ) {
      if ((upper -= Array2[i]) <= 0)
        break;
    }
    return PINK_REF - i / GainAnalysis$1.STEPS_per_dB;
  }
  this.GetTitleGain = function(rgData) {
    var retval = analyzeResult(rgData.A, rgData.A.length);
    for (var i = 0; i < rgData.A.length; i++) {
      rgData.B[i] += rgData.A[i];
      rgData.A[i] = 0;
    }
    for (var i = 0; i < MAX_ORDER; i++) {
      rgData.linprebuf[i] = rgData.lstepbuf[i] = rgData.loutbuf[i] = rgData.rinprebuf[i] = rgData.rstepbuf[i] = rgData.routbuf[i] = 0;
    }
    rgData.totsamp = 0;
    rgData.lsum = rgData.rsum = 0;
    return retval;
  };
}
var new_float$5 = common.new_float;
var new_int$5 = common.new_int;
function ReplayGain() {
  this.linprebuf = new_float$5(void 0 * 2);
  this.linpre = 0;
  this.lstepbuf = new_float$5(
    void 0 + void 0
  );
  this.lstep = 0;
  this.loutbuf = new_float$5(
    void 0 + void 0
  );
  this.lout = 0;
  this.rinprebuf = new_float$5(void 0 * 2);
  this.rinpre = 0;
  this.rstepbuf = new_float$5(
    void 0 + void 0
  );
  this.rstep = 0;
  this.routbuf = new_float$5(
    void 0 + void 0
  );
  this.rout = 0;
  this.sampleWindow = 0;
  this.totsamp = 0;
  this.lsum = 0;
  this.rsum = 0;
  this.freqindex = 0;
  this.first = 0;
  this.A = new_int$5(0 | void 0 * void 0);
  this.B = new_int$5(0 | void 0 * void 0);
}
function MeanBits$1(meanBits) {
  this.bits = meanBits;
}
var new_float$4 = common.new_float;
var new_int$4 = common.new_int;
var assert$8 = common.assert;
function CBRNewIterationLoop(_quantize) {
  var quantize = _quantize;
  this.quantize = quantize;
  this.iteration_loop = function(gfp, pe, ms_ener_ratio, ratio) {
    var gfc = gfp.internal_flags;
    var l3_xmin = new_float$4(L3Side$1.SFBMAX);
    var xrpow = new_float$4(576);
    var targ_bits = new_int$4(2);
    var mean_bits = 0;
    var max_bits;
    var l3_side = gfc.l3_side;
    var mb = new MeanBits$1(mean_bits);
    this.quantize.rv.ResvFrameBegin(gfp, mb);
    mean_bits = mb.bits;
    for (var gr = 0; gr < gfc.mode_gr; gr++) {
      max_bits = this.quantize.qupvt.on_pe(
        gfp,
        pe,
        targ_bits,
        mean_bits,
        gr,
        gr
      );
      if (gfc.mode_ext == Encoder.MPG_MD_MS_LR) {
        this.quantize.ms_convert(gfc.l3_side, gr);
        this.quantize.qupvt.reduce_side(
          targ_bits,
          ms_ener_ratio[gr],
          mean_bits,
          max_bits
        );
      }
      for (var ch = 0; ch < gfc.channels_out; ch++) {
        var adjust, masking_lower_db;
        var cod_info = l3_side.tt[gr][ch];
        if (cod_info.block_type != Encoder.SHORT_TYPE) {
          adjust = 0;
          masking_lower_db = gfc.PSY.mask_adjust - adjust;
        } else {
          adjust = 0;
          masking_lower_db = gfc.PSY.mask_adjust_short - adjust;
        }
        gfc.masking_lower = Math.pow(10, masking_lower_db * 0.1);
        this.quantize.init_outer_loop(gfc, cod_info);
        if (this.quantize.init_xrpow(gfc, cod_info, xrpow)) {
          this.quantize.qupvt.calc_xmin(gfp, ratio[gr][ch], cod_info, l3_xmin);
          this.quantize.outer_loop(
            gfp,
            cod_info,
            l3_xmin,
            xrpow,
            ch,
            targ_bits[ch]
          );
        }
        this.quantize.iteration_finish_one(gfc, gr, ch);
        assert$8(
          cod_info.part2_3_length <= LameInternalFlags$1.MAX_BITS_PER_CHANNEL
        );
        assert$8(cod_info.part2_3_length <= targ_bits[ch]);
      }
    }
    this.quantize.rv.ResvFrameEnd(gfc, mean_bits);
  };
}
function HuffCodeTab(len, max, tab, hl) {
  this.xlen = len;
  this.linmax = max;
  this.table = tab;
  this.hlen = hl;
}
var Tables$1 = {};
Tables$1.t1HB = [1, 1, 1, 0];
Tables$1.t2HB = [1, 2, 1, 3, 1, 1, 3, 2, 0];
Tables$1.t3HB = [3, 2, 1, 1, 1, 1, 3, 2, 0];
Tables$1.t5HB = [1, 2, 6, 5, 3, 1, 4, 4, 7, 5, 7, 1, 6, 1, 1, 0];
Tables$1.t6HB = [7, 3, 5, 1, 6, 2, 3, 2, 5, 4, 4, 1, 3, 3, 2, 0];
Tables$1.t7HB = [
  1,
  2,
  10,
  19,
  16,
  10,
  3,
  3,
  7,
  10,
  5,
  3,
  11,
  4,
  13,
  17,
  8,
  4,
  12,
  11,
  18,
  15,
  11,
  2,
  7,
  6,
  9,
  14,
  3,
  1,
  6,
  4,
  5,
  3,
  2,
  0
];
Tables$1.t8HB = [
  3,
  4,
  6,
  18,
  12,
  5,
  5,
  1,
  2,
  16,
  9,
  3,
  7,
  3,
  5,
  14,
  7,
  3,
  19,
  17,
  15,
  13,
  10,
  4,
  13,
  5,
  8,
  11,
  5,
  1,
  12,
  4,
  4,
  1,
  1,
  0
];
Tables$1.t9HB = [
  7,
  5,
  9,
  14,
  15,
  7,
  6,
  4,
  5,
  5,
  6,
  7,
  7,
  6,
  8,
  8,
  8,
  5,
  15,
  6,
  9,
  10,
  5,
  1,
  11,
  7,
  9,
  6,
  4,
  1,
  14,
  4,
  6,
  2,
  6,
  0
];
Tables$1.t10HB = [
  1,
  2,
  10,
  23,
  35,
  30,
  12,
  17,
  3,
  3,
  8,
  12,
  18,
  21,
  12,
  7,
  11,
  9,
  15,
  21,
  32,
  40,
  19,
  6,
  14,
  13,
  22,
  34,
  46,
  23,
  18,
  7,
  20,
  19,
  33,
  47,
  27,
  22,
  9,
  3,
  31,
  22,
  41,
  26,
  21,
  20,
  5,
  3,
  14,
  13,
  10,
  11,
  16,
  6,
  5,
  1,
  9,
  8,
  7,
  8,
  4,
  4,
  2,
  0
];
Tables$1.t11HB = [
  3,
  4,
  10,
  24,
  34,
  33,
  21,
  15,
  5,
  3,
  4,
  10,
  32,
  17,
  11,
  10,
  11,
  7,
  13,
  18,
  30,
  31,
  20,
  5,
  25,
  11,
  19,
  59,
  27,
  18,
  12,
  5,
  35,
  33,
  31,
  58,
  30,
  16,
  7,
  5,
  28,
  26,
  32,
  19,
  17,
  15,
  8,
  14,
  14,
  12,
  9,
  13,
  14,
  9,
  4,
  1,
  11,
  4,
  6,
  6,
  6,
  3,
  2,
  0
];
Tables$1.t12HB = [
  9,
  6,
  16,
  33,
  41,
  39,
  38,
  26,
  7,
  5,
  6,
  9,
  23,
  16,
  26,
  11,
  17,
  7,
  11,
  14,
  21,
  30,
  10,
  7,
  17,
  10,
  15,
  12,
  18,
  28,
  14,
  5,
  32,
  13,
  22,
  19,
  18,
  16,
  9,
  5,
  40,
  17,
  31,
  29,
  17,
  13,
  4,
  2,
  27,
  12,
  11,
  15,
  10,
  7,
  4,
  1,
  27,
  12,
  8,
  12,
  6,
  3,
  1,
  0
];
Tables$1.t13HB = [
  1,
  5,
  14,
  21,
  34,
  51,
  46,
  71,
  42,
  52,
  68,
  52,
  67,
  44,
  43,
  19,
  3,
  4,
  12,
  19,
  31,
  26,
  44,
  33,
  31,
  24,
  32,
  24,
  31,
  35,
  22,
  14,
  15,
  13,
  23,
  36,
  59,
  49,
  77,
  65,
  29,
  40,
  30,
  40,
  27,
  33,
  42,
  16,
  22,
  20,
  37,
  61,
  56,
  79,
  73,
  64,
  43,
  76,
  56,
  37,
  26,
  31,
  25,
  14,
  35,
  16,
  60,
  57,
  97,
  75,
  114,
  91,
  54,
  73,
  55,
  41,
  48,
  53,
  23,
  24,
  58,
  27,
  50,
  96,
  76,
  70,
  93,
  84,
  77,
  58,
  79,
  29,
  74,
  49,
  41,
  17,
  47,
  45,
  78,
  74,
  115,
  94,
  90,
  79,
  69,
  83,
  71,
  50,
  59,
  38,
  36,
  15,
  72,
  34,
  56,
  95,
  92,
  85,
  91,
  90,
  86,
  73,
  77,
  65,
  51,
  44,
  43,
  42,
  43,
  20,
  30,
  44,
  55,
  78,
  72,
  87,
  78,
  61,
  46,
  54,
  37,
  30,
  20,
  16,
  53,
  25,
  41,
  37,
  44,
  59,
  54,
  81,
  66,
  76,
  57,
  54,
  37,
  18,
  39,
  11,
  35,
  33,
  31,
  57,
  42,
  82,
  72,
  80,
  47,
  58,
  55,
  21,
  22,
  26,
  38,
  22,
  53,
  25,
  23,
  38,
  70,
  60,
  51,
  36,
  55,
  26,
  34,
  23,
  27,
  14,
  9,
  7,
  34,
  32,
  28,
  39,
  49,
  75,
  30,
  52,
  48,
  40,
  52,
  28,
  18,
  17,
  9,
  5,
  45,
  21,
  34,
  64,
  56,
  50,
  49,
  45,
  31,
  19,
  12,
  15,
  10,
  7,
  6,
  3,
  48,
  23,
  20,
  39,
  36,
  35,
  53,
  21,
  16,
  23,
  13,
  10,
  6,
  1,
  4,
  2,
  16,
  15,
  17,
  27,
  25,
  20,
  29,
  11,
  17,
  12,
  16,
  8,
  1,
  1,
  0,
  1
];
Tables$1.t15HB = [
  7,
  12,
  18,
  53,
  47,
  76,
  124,
  108,
  89,
  123,
  108,
  119,
  107,
  81,
  122,
  63,
  13,
  5,
  16,
  27,
  46,
  36,
  61,
  51,
  42,
  70,
  52,
  83,
  65,
  41,
  59,
  36,
  19,
  17,
  15,
  24,
  41,
  34,
  59,
  48,
  40,
  64,
  50,
  78,
  62,
  80,
  56,
  33,
  29,
  28,
  25,
  43,
  39,
  63,
  55,
  93,
  76,
  59,
  93,
  72,
  54,
  75,
  50,
  29,
  52,
  22,
  42,
  40,
  67,
  57,
  95,
  79,
  72,
  57,
  89,
  69,
  49,
  66,
  46,
  27,
  77,
  37,
  35,
  66,
  58,
  52,
  91,
  74,
  62,
  48,
  79,
  63,
  90,
  62,
  40,
  38,
  125,
  32,
  60,
  56,
  50,
  92,
  78,
  65,
  55,
  87,
  71,
  51,
  73,
  51,
  70,
  30,
  109,
  53,
  49,
  94,
  88,
  75,
  66,
  122,
  91,
  73,
  56,
  42,
  64,
  44,
  21,
  25,
  90,
  43,
  41,
  77,
  73,
  63,
  56,
  92,
  77,
  66,
  47,
  67,
  48,
  53,
  36,
  20,
  71,
  34,
  67,
  60,
  58,
  49,
  88,
  76,
  67,
  106,
  71,
  54,
  38,
  39,
  23,
  15,
  109,
  53,
  51,
  47,
  90,
  82,
  58,
  57,
  48,
  72,
  57,
  41,
  23,
  27,
  62,
  9,
  86,
  42,
  40,
  37,
  70,
  64,
  52,
  43,
  70,
  55,
  42,
  25,
  29,
  18,
  11,
  11,
  118,
  68,
  30,
  55,
  50,
  46,
  74,
  65,
  49,
  39,
  24,
  16,
  22,
  13,
  14,
  7,
  91,
  44,
  39,
  38,
  34,
  63,
  52,
  45,
  31,
  52,
  28,
  19,
  14,
  8,
  9,
  3,
  123,
  60,
  58,
  53,
  47,
  43,
  32,
  22,
  37,
  24,
  17,
  12,
  15,
  10,
  2,
  1,
  71,
  37,
  34,
  30,
  28,
  20,
  17,
  26,
  21,
  16,
  10,
  6,
  8,
  6,
  2,
  0
];
Tables$1.t16HB = [
  1,
  5,
  14,
  44,
  74,
  63,
  110,
  93,
  172,
  149,
  138,
  242,
  225,
  195,
  376,
  17,
  3,
  4,
  12,
  20,
  35,
  62,
  53,
  47,
  83,
  75,
  68,
  119,
  201,
  107,
  207,
  9,
  15,
  13,
  23,
  38,
  67,
  58,
  103,
  90,
  161,
  72,
  127,
  117,
  110,
  209,
  206,
  16,
  45,
  21,
  39,
  69,
  64,
  114,
  99,
  87,
  158,
  140,
  252,
  212,
  199,
  387,
  365,
  26,
  75,
  36,
  68,
  65,
  115,
  101,
  179,
  164,
  155,
  264,
  246,
  226,
  395,
  382,
  362,
  9,
  66,
  30,
  59,
  56,
  102,
  185,
  173,
  265,
  142,
  253,
  232,
  400,
  388,
  378,
  445,
  16,
  111,
  54,
  52,
  100,
  184,
  178,
  160,
  133,
  257,
  244,
  228,
  217,
  385,
  366,
  715,
  10,
  98,
  48,
  91,
  88,
  165,
  157,
  148,
  261,
  248,
  407,
  397,
  372,
  380,
  889,
  884,
  8,
  85,
  84,
  81,
  159,
  156,
  143,
  260,
  249,
  427,
  401,
  392,
  383,
  727,
  713,
  708,
  7,
  154,
  76,
  73,
  141,
  131,
  256,
  245,
  426,
  406,
  394,
  384,
  735,
  359,
  710,
  352,
  11,
  139,
  129,
  67,
  125,
  247,
  233,
  229,
  219,
  393,
  743,
  737,
  720,
  885,
  882,
  439,
  4,
  243,
  120,
  118,
  115,
  227,
  223,
  396,
  746,
  742,
  736,
  721,
  712,
  706,
  223,
  436,
  6,
  202,
  224,
  222,
  218,
  216,
  389,
  386,
  381,
  364,
  888,
  443,
  707,
  440,
  437,
  1728,
  4,
  747,
  211,
  210,
  208,
  370,
  379,
  734,
  723,
  714,
  1735,
  883,
  877,
  876,
  3459,
  865,
  2,
  377,
  369,
  102,
  187,
  726,
  722,
  358,
  711,
  709,
  866,
  1734,
  871,
  3458,
  870,
  434,
  0,
  12,
  10,
  7,
  11,
  10,
  17,
  11,
  9,
  13,
  12,
  10,
  7,
  5,
  3,
  1,
  3
];
Tables$1.t24HB = [
  15,
  13,
  46,
  80,
  146,
  262,
  248,
  434,
  426,
  669,
  653,
  649,
  621,
  517,
  1032,
  88,
  14,
  12,
  21,
  38,
  71,
  130,
  122,
  216,
  209,
  198,
  327,
  345,
  319,
  297,
  279,
  42,
  47,
  22,
  41,
  74,
  68,
  128,
  120,
  221,
  207,
  194,
  182,
  340,
  315,
  295,
  541,
  18,
  81,
  39,
  75,
  70,
  134,
  125,
  116,
  220,
  204,
  190,
  178,
  325,
  311,
  293,
  271,
  16,
  147,
  72,
  69,
  135,
  127,
  118,
  112,
  210,
  200,
  188,
  352,
  323,
  306,
  285,
  540,
  14,
  263,
  66,
  129,
  126,
  119,
  114,
  214,
  202,
  192,
  180,
  341,
  317,
  301,
  281,
  262,
  12,
  249,
  123,
  121,
  117,
  113,
  215,
  206,
  195,
  185,
  347,
  330,
  308,
  291,
  272,
  520,
  10,
  435,
  115,
  111,
  109,
  211,
  203,
  196,
  187,
  353,
  332,
  313,
  298,
  283,
  531,
  381,
  17,
  427,
  212,
  208,
  205,
  201,
  193,
  186,
  177,
  169,
  320,
  303,
  286,
  268,
  514,
  377,
  16,
  335,
  199,
  197,
  191,
  189,
  181,
  174,
  333,
  321,
  305,
  289,
  275,
  521,
  379,
  371,
  11,
  668,
  184,
  183,
  179,
  175,
  344,
  331,
  314,
  304,
  290,
  277,
  530,
  383,
  373,
  366,
  10,
  652,
  346,
  171,
  168,
  164,
  318,
  309,
  299,
  287,
  276,
  263,
  513,
  375,
  368,
  362,
  6,
  648,
  322,
  316,
  312,
  307,
  302,
  292,
  284,
  269,
  261,
  512,
  376,
  370,
  364,
  359,
  4,
  620,
  300,
  296,
  294,
  288,
  282,
  273,
  266,
  515,
  380,
  374,
  369,
  365,
  361,
  357,
  2,
  1033,
  280,
  278,
  274,
  267,
  264,
  259,
  382,
  378,
  372,
  367,
  363,
  360,
  358,
  356,
  0,
  43,
  20,
  19,
  17,
  15,
  13,
  11,
  9,
  7,
  6,
  4,
  7,
  5,
  3,
  1,
  3
];
Tables$1.t32HB = [
  1 << 0,
  5 << 1,
  4 << 1,
  5 << 2,
  6 << 1,
  5 << 2,
  4 << 2,
  4 << 3,
  7 << 1,
  3 << 2,
  6 << 2,
  0 << 3,
  7 << 2,
  2 << 3,
  3 << 3,
  1 << 4
];
Tables$1.t33HB = [
  15 << 0,
  14 << 1,
  13 << 1,
  12 << 2,
  11 << 1,
  10 << 2,
  9 << 2,
  8 << 3,
  7 << 1,
  6 << 2,
  5 << 2,
  4 << 3,
  3 << 2,
  2 << 3,
  1 << 3,
  0 << 4
];
Tables$1.t1l = [1, 4, 3, 5];
Tables$1.t2l = [1, 4, 7, 4, 5, 7, 6, 7, 8];
Tables$1.t3l = [2, 3, 7, 4, 4, 7, 6, 7, 8];
Tables$1.t5l = [1, 4, 7, 8, 4, 5, 8, 9, 7, 8, 9, 10, 8, 8, 9, 10];
Tables$1.t6l = [3, 4, 6, 8, 4, 4, 6, 7, 5, 6, 7, 8, 7, 7, 8, 9];
Tables$1.t7l = [
  1,
  4,
  7,
  9,
  9,
  10,
  4,
  6,
  8,
  9,
  9,
  10,
  7,
  7,
  9,
  10,
  10,
  11,
  8,
  9,
  10,
  11,
  11,
  11,
  8,
  9,
  10,
  11,
  11,
  12,
  9,
  10,
  11,
  12,
  12,
  12
];
Tables$1.t8l = [
  2,
  4,
  7,
  9,
  9,
  10,
  4,
  4,
  6,
  10,
  10,
  10,
  7,
  6,
  8,
  10,
  10,
  11,
  9,
  10,
  10,
  11,
  11,
  12,
  9,
  9,
  10,
  11,
  12,
  12,
  10,
  10,
  11,
  11,
  13,
  13
];
Tables$1.t9l = [
  3,
  4,
  6,
  7,
  9,
  10,
  4,
  5,
  6,
  7,
  8,
  10,
  5,
  6,
  7,
  8,
  9,
  10,
  7,
  7,
  8,
  9,
  9,
  10,
  8,
  8,
  9,
  9,
  10,
  11,
  9,
  9,
  10,
  10,
  11,
  11
];
Tables$1.t10l = [
  1,
  4,
  7,
  9,
  10,
  10,
  10,
  11,
  4,
  6,
  8,
  9,
  10,
  11,
  10,
  10,
  7,
  8,
  9,
  10,
  11,
  12,
  11,
  11,
  8,
  9,
  10,
  11,
  12,
  12,
  11,
  12,
  9,
  10,
  11,
  12,
  12,
  12,
  12,
  12,
  10,
  11,
  12,
  12,
  13,
  13,
  12,
  13,
  9,
  10,
  11,
  12,
  12,
  12,
  13,
  13,
  10,
  10,
  11,
  12,
  12,
  13,
  13,
  13
];
Tables$1.t11l = [
  2,
  4,
  6,
  8,
  9,
  10,
  9,
  10,
  4,
  5,
  6,
  8,
  10,
  10,
  9,
  10,
  6,
  7,
  8,
  9,
  10,
  11,
  10,
  10,
  8,
  8,
  9,
  11,
  10,
  12,
  10,
  11,
  9,
  10,
  10,
  11,
  11,
  12,
  11,
  12,
  9,
  10,
  11,
  12,
  12,
  13,
  12,
  13,
  9,
  9,
  9,
  10,
  11,
  12,
  12,
  12,
  9,
  9,
  10,
  11,
  12,
  12,
  12,
  12
];
Tables$1.t12l = [
  4,
  4,
  6,
  8,
  9,
  10,
  10,
  10,
  4,
  5,
  6,
  7,
  9,
  9,
  10,
  10,
  6,
  6,
  7,
  8,
  9,
  10,
  9,
  10,
  7,
  7,
  8,
  8,
  9,
  10,
  10,
  10,
  8,
  8,
  9,
  9,
  10,
  10,
  10,
  11,
  9,
  9,
  10,
  10,
  10,
  11,
  10,
  11,
  9,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12
];
Tables$1.t13l = [
  1,
  5,
  7,
  8,
  9,
  10,
  10,
  11,
  10,
  11,
  12,
  12,
  13,
  13,
  14,
  14,
  4,
  6,
  8,
  9,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  13,
  14,
  14,
  14,
  7,
  8,
  9,
  10,
  11,
  11,
  12,
  12,
  11,
  12,
  12,
  13,
  13,
  14,
  15,
  15,
  8,
  9,
  10,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  15,
  15,
  9,
  9,
  11,
  11,
  12,
  12,
  13,
  13,
  12,
  13,
  13,
  14,
  14,
  15,
  15,
  16,
  10,
  10,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  13,
  15,
  15,
  16,
  16,
  10,
  11,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  15,
  15,
  16,
  16,
  11,
  11,
  12,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  16,
  18,
  18,
  10,
  10,
  11,
  12,
  12,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  16,
  17,
  17,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  15,
  14,
  15,
  15,
  16,
  16,
  16,
  18,
  17,
  11,
  12,
  12,
  13,
  13,
  14,
  14,
  15,
  14,
  15,
  16,
  15,
  16,
  17,
  18,
  19,
  12,
  12,
  12,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  16,
  17,
  17,
  17,
  18,
  12,
  13,
  13,
  14,
  14,
  15,
  14,
  15,
  16,
  16,
  17,
  17,
  17,
  18,
  18,
  18,
  13,
  13,
  14,
  15,
  15,
  15,
  16,
  16,
  16,
  16,
  16,
  17,
  18,
  17,
  18,
  18,
  14,
  14,
  14,
  15,
  15,
  15,
  17,
  16,
  16,
  19,
  17,
  17,
  17,
  19,
  18,
  18,
  13,
  14,
  15,
  16,
  16,
  16,
  17,
  16,
  17,
  17,
  18,
  18,
  21,
  20,
  21,
  18
];
Tables$1.t15l = [
  3,
  5,
  6,
  8,
  8,
  9,
  10,
  10,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  14,
  5,
  5,
  7,
  8,
  9,
  9,
  10,
  10,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  6,
  7,
  7,
  8,
  9,
  9,
  10,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  9,
  9,
  9,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  10,
  9,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  14,
  14,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  14,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  13,
  14,
  14,
  14,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  15,
  14,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  15,
  12,
  12,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  13,
  14,
  14,
  15,
  15,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  14,
  15,
  15,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  14,
  15,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  15
];
Tables$1.t16_5l = [
  1,
  5,
  7,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  14,
  11,
  4,
  6,
  8,
  9,
  10,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  14,
  13,
  14,
  11,
  7,
  8,
  9,
  10,
  11,
  11,
  12,
  12,
  13,
  12,
  13,
  13,
  13,
  14,
  14,
  12,
  9,
  9,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  14,
  14,
  14,
  15,
  15,
  13,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  14,
  15,
  15,
  15,
  12,
  10,
  10,
  11,
  11,
  12,
  13,
  13,
  14,
  13,
  14,
  14,
  15,
  15,
  15,
  16,
  13,
  11,
  11,
  11,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  16,
  13,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  17,
  17,
  13,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  16,
  16,
  13,
  12,
  12,
  12,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  15,
  16,
  15,
  14,
  12,
  13,
  12,
  13,
  14,
  14,
  14,
  14,
  15,
  16,
  16,
  16,
  17,
  17,
  16,
  13,
  13,
  13,
  13,
  13,
  14,
  14,
  15,
  16,
  16,
  16,
  16,
  16,
  16,
  15,
  16,
  14,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  15,
  17,
  16,
  16,
  16,
  16,
  18,
  14,
  15,
  14,
  14,
  14,
  15,
  15,
  16,
  16,
  16,
  18,
  17,
  17,
  17,
  19,
  17,
  14,
  14,
  15,
  13,
  14,
  16,
  16,
  15,
  16,
  16,
  17,
  18,
  17,
  19,
  17,
  16,
  14,
  11,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  14,
  14,
  14,
  12
];
Tables$1.t16l = [
  1,
  5,
  7,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  14,
  10,
  4,
  6,
  8,
  9,
  10,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  14,
  13,
  14,
  10,
  7,
  8,
  9,
  10,
  11,
  11,
  12,
  12,
  13,
  12,
  13,
  13,
  13,
  14,
  14,
  11,
  9,
  9,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  14,
  14,
  14,
  15,
  15,
  12,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  14,
  15,
  15,
  15,
  11,
  10,
  10,
  11,
  11,
  12,
  13,
  13,
  14,
  13,
  14,
  14,
  15,
  15,
  15,
  16,
  12,
  11,
  11,
  11,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  16,
  12,
  11,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  17,
  17,
  12,
  11,
  12,
  12,
  13,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  16,
  16,
  12,
  12,
  12,
  12,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  15,
  16,
  15,
  13,
  12,
  13,
  12,
  13,
  14,
  14,
  14,
  14,
  15,
  16,
  16,
  16,
  17,
  17,
  16,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  15,
  16,
  16,
  16,
  16,
  16,
  16,
  15,
  16,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  15,
  17,
  16,
  16,
  16,
  16,
  18,
  13,
  15,
  14,
  14,
  14,
  15,
  15,
  16,
  16,
  16,
  18,
  17,
  17,
  17,
  19,
  17,
  13,
  14,
  15,
  13,
  14,
  16,
  16,
  15,
  16,
  16,
  17,
  18,
  17,
  19,
  17,
  16,
  13,
  10,
  10,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  10
];
Tables$1.t24l = [
  4,
  5,
  7,
  8,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  13,
  10,
  5,
  6,
  7,
  8,
  9,
  10,
  10,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  10,
  7,
  7,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  13,
  9,
  8,
  8,
  9,
  9,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  9,
  9,
  9,
  9,
  10,
  10,
  10,
  10,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  9,
  10,
  9,
  10,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  9,
  10,
  10,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  13,
  9,
  11,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  10,
  11,
  11,
  11,
  11,
  11,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  13,
  10,
  11,
  11,
  11,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  10,
  12,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  10,
  12,
  12,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  10,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  10,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  10,
  13,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  10,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  10,
  10,
  10,
  10,
  6
];
Tables$1.t32l = [
  1 + 0,
  4 + 1,
  4 + 1,
  5 + 2,
  4 + 1,
  6 + 2,
  5 + 2,
  6 + 3,
  4 + 1,
  5 + 2,
  5 + 2,
  6 + 3,
  5 + 2,
  6 + 3,
  6 + 3,
  6 + 4
];
Tables$1.t33l = [
  4 + 0,
  4 + 1,
  4 + 1,
  4 + 2,
  4 + 1,
  4 + 2,
  4 + 2,
  4 + 3,
  4 + 1,
  4 + 2,
  4 + 2,
  4 + 3,
  4 + 2,
  4 + 3,
  4 + 3,
  4 + 4
];
Tables$1.ht = [
  new HuffCodeTab(0, 0, null, null),
  new HuffCodeTab(2, 0, Tables$1.t1HB, Tables$1.t1l),
  new HuffCodeTab(3, 0, Tables$1.t2HB, Tables$1.t2l),
  new HuffCodeTab(3, 0, Tables$1.t3HB, Tables$1.t3l),
  new HuffCodeTab(0, 0, null, null),
  new HuffCodeTab(4, 0, Tables$1.t5HB, Tables$1.t5l),
  new HuffCodeTab(4, 0, Tables$1.t6HB, Tables$1.t6l),
  new HuffCodeTab(6, 0, Tables$1.t7HB, Tables$1.t7l),
  new HuffCodeTab(6, 0, Tables$1.t8HB, Tables$1.t8l),
  new HuffCodeTab(6, 0, Tables$1.t9HB, Tables$1.t9l),
  new HuffCodeTab(8, 0, Tables$1.t10HB, Tables$1.t10l),
  new HuffCodeTab(8, 0, Tables$1.t11HB, Tables$1.t11l),
  new HuffCodeTab(8, 0, Tables$1.t12HB, Tables$1.t12l),
  new HuffCodeTab(16, 0, Tables$1.t13HB, Tables$1.t13l),
  new HuffCodeTab(0, 0, null, Tables$1.t16_5l),
  new HuffCodeTab(16, 0, Tables$1.t15HB, Tables$1.t15l),
  new HuffCodeTab(1, 1, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(2, 3, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(3, 7, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(4, 15, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(6, 63, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(8, 255, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(10, 1023, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(13, 8191, Tables$1.t16HB, Tables$1.t16l),
  new HuffCodeTab(4, 15, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(5, 31, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(6, 63, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(7, 127, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(8, 255, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(9, 511, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(11, 2047, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(13, 8191, Tables$1.t24HB, Tables$1.t24l),
  new HuffCodeTab(0, 0, Tables$1.t32HB, Tables$1.t32l),
  new HuffCodeTab(0, 0, Tables$1.t33HB, Tables$1.t33l)
];
Tables$1.largetbl = [
  65540,
  327685,
  458759,
  589832,
  655369,
  655370,
  720906,
  720907,
  786443,
  786444,
  786444,
  851980,
  851980,
  851980,
  917517,
  655370,
  262149,
  393222,
  524295,
  589832,
  655369,
  720906,
  720906,
  720907,
  786443,
  786443,
  786444,
  851980,
  917516,
  851980,
  917516,
  655370,
  458759,
  524295,
  589832,
  655369,
  720905,
  720906,
  786442,
  786443,
  851979,
  786443,
  851979,
  851980,
  851980,
  917516,
  917517,
  720905,
  589832,
  589832,
  655369,
  720905,
  720906,
  786442,
  786442,
  786443,
  851979,
  851979,
  917515,
  917516,
  917516,
  983052,
  983052,
  786441,
  655369,
  655369,
  720905,
  720906,
  786442,
  786442,
  851978,
  851979,
  851979,
  917515,
  917516,
  917516,
  983052,
  983052,
  983053,
  720905,
  655370,
  655369,
  720906,
  720906,
  786442,
  851978,
  851979,
  917515,
  851979,
  917515,
  917516,
  983052,
  983052,
  983052,
  1048588,
  786441,
  720906,
  720906,
  720906,
  786442,
  851978,
  851979,
  851979,
  851979,
  917515,
  917516,
  917516,
  917516,
  983052,
  983052,
  1048589,
  786441,
  720907,
  720906,
  786442,
  786442,
  851979,
  851979,
  851979,
  917515,
  917516,
  983052,
  983052,
  983052,
  983052,
  1114125,
  1114125,
  786442,
  720907,
  786443,
  786443,
  851979,
  851979,
  851979,
  917515,
  917515,
  983051,
  983052,
  983052,
  983052,
  1048588,
  1048589,
  1048589,
  786442,
  786443,
  786443,
  786443,
  851979,
  851979,
  917515,
  917515,
  983052,
  983052,
  983052,
  983052,
  1048588,
  983053,
  1048589,
  983053,
  851978,
  786444,
  851979,
  786443,
  851979,
  917515,
  917516,
  917516,
  917516,
  983052,
  1048588,
  1048588,
  1048589,
  1114125,
  1114125,
  1048589,
  786442,
  851980,
  851980,
  851979,
  851979,
  917515,
  917516,
  983052,
  1048588,
  1048588,
  1048588,
  1048588,
  1048589,
  1048589,
  983053,
  1048589,
  851978,
  851980,
  917516,
  917516,
  917516,
  917516,
  983052,
  983052,
  983052,
  983052,
  1114124,
  1048589,
  1048589,
  1048589,
  1048589,
  1179661,
  851978,
  983052,
  917516,
  917516,
  917516,
  983052,
  983052,
  1048588,
  1048588,
  1048589,
  1179661,
  1114125,
  1114125,
  1114125,
  1245197,
  1114125,
  851978,
  917517,
  983052,
  851980,
  917516,
  1048588,
  1048588,
  983052,
  1048589,
  1048589,
  1114125,
  1179661,
  1114125,
  1245197,
  1114125,
  1048589,
  851978,
  655369,
  655369,
  655369,
  720905,
  720905,
  786441,
  786441,
  786441,
  851977,
  851977,
  851977,
  851978,
  851978,
  851978,
  851978,
  655366
];
Tables$1.table23 = [
  65538,
  262147,
  458759,
  262148,
  327684,
  458759,
  393222,
  458759,
  524296
];
Tables$1.table56 = [
  65539,
  262148,
  458758,
  524296,
  262148,
  327684,
  524294,
  589831,
  458757,
  524294,
  589831,
  655368,
  524295,
  524295,
  589832,
  655369
];
Tables$1.bitrate_table = [
  [
    0,
    8,
    16,
    24,
    32,
    40,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    144,
    160,
    -1
  ],
  [
    0,
    32,
    40,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    160,
    192,
    224,
    256,
    320,
    -1
  ],
  [0, 8, 16, 24, 32, 40, 48, 56, 64, -1, -1, -1, -1, -1, -1, -1]
];
Tables$1.samplerate_table = [
  [22050, 24e3, 16e3, -1],
  [44100, 48e3, 32e3, -1],
  [11025, 12e3, 8e3, -1]
];
Tables$1.scfsi_band = [0, 6, 11, 16, 21];
var VbrMode$4 = common.VbrMode;
var Float = common.Float;
var Util$1 = common.Util;
var new_float$3 = common.new_float;
var new_int$3 = common.new_int;
var assert$7 = common.assert;
QuantizePVT.Q_MAX = 256 + 1;
QuantizePVT.Q_MAX2 = 116;
QuantizePVT.LARGE_BITS = 1e5;
QuantizePVT.IXMAX_VAL = 8206;
function QuantizePVT() {
  var tak = null;
  var rv = null;
  var psy = null;
  this.setModules = function(_tk, _rv, _psy) {
    tak = _tk;
    rv = _rv;
    psy = _psy;
  };
  function POW20(x) {
    return pow20[x + QuantizePVT.Q_MAX2];
  }
  this.IPOW20 = function(x) {
    return ipow20[x];
  };
  var DBL_EPSILON = 2220446049250313e-31;
  var IXMAX_VAL = QuantizePVT.IXMAX_VAL;
  var PRECALC_SIZE = IXMAX_VAL + 2;
  var Q_MAX = QuantizePVT.Q_MAX;
  var Q_MAX2 = QuantizePVT.Q_MAX2;
  var NSATHSCALE = 100;
  this.nr_of_sfb_block = [
    [
      [6, 5, 5, 5],
      [9, 9, 9, 9],
      [6, 9, 9, 9]
    ],
    [
      [6, 5, 7, 3],
      [9, 9, 12, 6],
      [6, 9, 12, 6]
    ],
    [
      [11, 10, 0, 0],
      [18, 18, 0, 0],
      [15, 18, 0, 0]
    ],
    [
      [7, 7, 7, 0],
      [12, 12, 12, 0],
      [6, 15, 12, 0]
    ],
    [
      [6, 6, 6, 3],
      [12, 9, 9, 6],
      [6, 12, 9, 6]
    ],
    [
      [8, 8, 5, 0],
      [15, 12, 9, 0],
      [6, 18, 9, 0]
    ]
  ];
  var pretab = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    3,
    3,
    3,
    2,
    0
  ];
  this.pretab = pretab;
  this.sfBandIndex = [
    new ScaleFac(
      [
        0,
        6,
        12,
        18,
        24,
        30,
        36,
        44,
        54,
        66,
        80,
        96,
        116,
        140,
        168,
        200,
        238,
        284,
        336,
        396,
        464,
        522,
        576
      ],
      [0, 4, 8, 12, 18, 24, 32, 42, 56, 74, 100, 132, 174, 192],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        6,
        12,
        18,
        24,
        30,
        36,
        44,
        54,
        66,
        80,
        96,
        114,
        136,
        162,
        194,
        232,
        278,
        332,
        394,
        464,
        540,
        576
      ],
      [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 136, 180, 192],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        6,
        12,
        18,
        24,
        30,
        36,
        44,
        54,
        66,
        80,
        96,
        116,
        140,
        168,
        200,
        238,
        284,
        336,
        396,
        464,
        522,
        576
      ],
      [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        4,
        8,
        12,
        16,
        20,
        24,
        30,
        36,
        44,
        52,
        62,
        74,
        90,
        110,
        134,
        162,
        196,
        238,
        288,
        342,
        418,
        576
      ],
      [0, 4, 8, 12, 16, 22, 30, 40, 52, 66, 84, 106, 136, 192],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        4,
        8,
        12,
        16,
        20,
        24,
        30,
        36,
        42,
        50,
        60,
        72,
        88,
        106,
        128,
        156,
        190,
        230,
        276,
        330,
        384,
        576
      ],
      [0, 4, 8, 12, 16, 22, 28, 38, 50, 64, 80, 100, 126, 192],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        4,
        8,
        12,
        16,
        20,
        24,
        30,
        36,
        44,
        54,
        66,
        82,
        102,
        126,
        156,
        194,
        240,
        296,
        364,
        448,
        550,
        576
      ],
      [0, 4, 8, 12, 16, 22, 30, 42, 58, 78, 104, 138, 180, 192],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        6,
        12,
        18,
        24,
        30,
        36,
        44,
        54,
        66,
        80,
        96,
        116,
        140,
        168,
        200,
        238,
        284,
        336,
        396,
        464,
        522,
        576
      ],
      [
        0 / 3,
        12 / 3,
        24 / 3,
        36 / 3,
        54 / 3,
        78 / 3,
        108 / 3,
        144 / 3,
        186 / 3,
        240 / 3,
        312 / 3,
        402 / 3,
        522 / 3,
        576 / 3
      ],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        6,
        12,
        18,
        24,
        30,
        36,
        44,
        54,
        66,
        80,
        96,
        116,
        140,
        168,
        200,
        238,
        284,
        336,
        396,
        464,
        522,
        576
      ],
      [
        0 / 3,
        12 / 3,
        24 / 3,
        36 / 3,
        54 / 3,
        78 / 3,
        108 / 3,
        144 / 3,
        186 / 3,
        240 / 3,
        312 / 3,
        402 / 3,
        522 / 3,
        576 / 3
      ],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ),
    new ScaleFac(
      [
        0,
        12,
        24,
        36,
        48,
        60,
        72,
        88,
        108,
        132,
        160,
        192,
        232,
        280,
        336,
        400,
        476,
        566,
        568,
        570,
        572,
        574,
        576
      ],
      [
        0 / 3,
        24 / 3,
        48 / 3,
        72 / 3,
        108 / 3,
        156 / 3,
        216 / 3,
        288 / 3,
        372 / 3,
        480 / 3,
        486 / 3,
        492 / 3,
        498 / 3,
        576 / 3
      ],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    )
  ];
  var pow20 = new_float$3(Q_MAX + Q_MAX2 + 1);
  var ipow20 = new_float$3(Q_MAX);
  var pow43 = new_float$3(PRECALC_SIZE);
  var adj43 = new_float$3(PRECALC_SIZE);
  this.adj43 = adj43;
  function ATHmdct(gfp, f) {
    var ath = psy.ATHformula(f, gfp);
    ath -= NSATHSCALE;
    ath = Math.pow(10, ath / 10 + gfp.ATHlower);
    return ath;
  }
  function compute_ath(gfp) {
    var ATH_l = gfp.internal_flags.ATH.l;
    var ATH_psfb21 = gfp.internal_flags.ATH.psfb21;
    var ATH_s = gfp.internal_flags.ATH.s;
    var ATH_psfb12 = gfp.internal_flags.ATH.psfb12;
    var gfc = gfp.internal_flags;
    var samp_freq = gfp.out_samplerate;
    for (var sfb = 0; sfb < Encoder.SBMAX_l; sfb++) {
      var start2 = gfc.scalefac_band.l[sfb];
      var end = gfc.scalefac_band.l[sfb + 1];
      ATH_l[sfb] = Float.MAX_VALUE;
      for (var i = start2; i < end; i++) {
        var freq = i * samp_freq / (2 * 576);
        var ATH_f = ATHmdct(gfp, freq);
        ATH_l[sfb] = Math.min(ATH_l[sfb], ATH_f);
      }
    }
    for (var sfb = 0; sfb < Encoder.PSFB21; sfb++) {
      var start2 = gfc.scalefac_band.psfb21[sfb];
      var end = gfc.scalefac_band.psfb21[sfb + 1];
      ATH_psfb21[sfb] = Float.MAX_VALUE;
      for (var i = start2; i < end; i++) {
        var freq = i * samp_freq / (2 * 576);
        var ATH_f = ATHmdct(gfp, freq);
        ATH_psfb21[sfb] = Math.min(ATH_psfb21[sfb], ATH_f);
      }
    }
    for (var sfb = 0; sfb < Encoder.SBMAX_s; sfb++) {
      var start2 = gfc.scalefac_band.s[sfb];
      var end = gfc.scalefac_band.s[sfb + 1];
      ATH_s[sfb] = Float.MAX_VALUE;
      for (var i = start2; i < end; i++) {
        var freq = i * samp_freq / (2 * 192);
        var ATH_f = ATHmdct(gfp, freq);
        ATH_s[sfb] = Math.min(ATH_s[sfb], ATH_f);
      }
      ATH_s[sfb] *= gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
    }
    for (var sfb = 0; sfb < Encoder.PSFB12; sfb++) {
      var start2 = gfc.scalefac_band.psfb12[sfb];
      var end = gfc.scalefac_band.psfb12[sfb + 1];
      ATH_psfb12[sfb] = Float.MAX_VALUE;
      for (var i = start2; i < end; i++) {
        var freq = i * samp_freq / (2 * 192);
        var ATH_f = ATHmdct(gfp, freq);
        ATH_psfb12[sfb] = Math.min(ATH_psfb12[sfb], ATH_f);
      }
      ATH_psfb12[sfb] *= gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12];
    }
    if (gfp.noATH) {
      for (var sfb = 0; sfb < Encoder.SBMAX_l; sfb++) {
        ATH_l[sfb] = 1e-20;
      }
      for (var sfb = 0; sfb < Encoder.PSFB21; sfb++) {
        ATH_psfb21[sfb] = 1e-20;
      }
      for (var sfb = 0; sfb < Encoder.SBMAX_s; sfb++) {
        ATH_s[sfb] = 1e-20;
      }
      for (var sfb = 0; sfb < Encoder.PSFB12; sfb++) {
        ATH_psfb12[sfb] = 1e-20;
      }
    }
    gfc.ATH.floor = 10 * Math.log10(ATHmdct(gfp, -1));
  }
  this.iteration_init = function(gfp) {
    var gfc = gfp.internal_flags;
    var l3_side = gfc.l3_side;
    var i;
    if (gfc.iteration_init_init == 0) {
      gfc.iteration_init_init = 1;
      l3_side.main_data_begin = 0;
      compute_ath(gfp);
      pow43[0] = 0;
      for (i = 1; i < PRECALC_SIZE; i++)
        pow43[i] = Math.pow(i, 4 / 3);
      for (i = 0; i < PRECALC_SIZE - 1; i++) {
        adj43[i] = i + 1 - Math.pow(0.5 * (pow43[i] + pow43[i + 1]), 0.75);
      }
      adj43[i] = 0.5;
      for (i = 0; i < Q_MAX; i++)
        ipow20[i] = Math.pow(2, (i - 210) * -0.1875);
      for (i = 0; i <= Q_MAX + Q_MAX2; i++) {
        pow20[i] = Math.pow(2, (i - 210 - Q_MAX2) * 0.25);
      }
      tak.huffman_init(gfc);
      {
        var bass, alto, treble, sfb21;
        i = gfp.exp_nspsytune >> 2 & 63;
        if (i >= 32)
          i -= 64;
        bass = Math.pow(10, i / 4 / 10);
        i = gfp.exp_nspsytune >> 8 & 63;
        if (i >= 32)
          i -= 64;
        alto = Math.pow(10, i / 4 / 10);
        i = gfp.exp_nspsytune >> 14 & 63;
        if (i >= 32)
          i -= 64;
        treble = Math.pow(10, i / 4 / 10);
        i = gfp.exp_nspsytune >> 20 & 63;
        if (i >= 32)
          i -= 64;
        sfb21 = treble * Math.pow(10, i / 4 / 10);
        for (i = 0; i < Encoder.SBMAX_l; i++) {
          var f;
          if (i <= 6)
            f = bass;
          else if (i <= 13)
            f = alto;
          else if (i <= 20)
            f = treble;
          else
            f = sfb21;
          gfc.nsPsy.longfact[i] = f;
        }
        for (i = 0; i < Encoder.SBMAX_s; i++) {
          var f;
          if (i <= 5)
            f = bass;
          else if (i <= 10)
            f = alto;
          else if (i <= 11)
            f = treble;
          else
            f = sfb21;
          gfc.nsPsy.shortfact[i] = f;
        }
      }
    }
  };
  this.on_pe = function(gfp, pe, targ_bits, mean_bits, gr, cbr) {
    var gfc = gfp.internal_flags;
    var tbits = 0;
    var bits;
    var add_bits = new_int$3(2);
    var ch;
    var mb = new MeanBits$1(tbits);
    var extra_bits = rv.ResvMaxBits(gfp, mean_bits, mb, cbr);
    tbits = mb.bits;
    var max_bits = tbits + extra_bits;
    if (max_bits > LameInternalFlags$1.MAX_BITS_PER_GRANULE) {
      max_bits = LameInternalFlags$1.MAX_BITS_PER_GRANULE;
    }
    for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
      targ_bits[ch] = Math.min(
        LameInternalFlags$1.MAX_BITS_PER_CHANNEL,
        tbits / gfc.channels_out
      );
      add_bits[ch] = 0 | targ_bits[ch] * pe[gr][ch] / 700 - targ_bits[ch];
      if (add_bits[ch] > mean_bits * 3 / 4)
        add_bits[ch] = mean_bits * 3 / 4;
      if (add_bits[ch] < 0)
        add_bits[ch] = 0;
      if (add_bits[ch] + targ_bits[ch] > LameInternalFlags$1.MAX_BITS_PER_CHANNEL) {
        add_bits[ch] = Math.max(
          0,
          LameInternalFlags$1.MAX_BITS_PER_CHANNEL - targ_bits[ch]
        );
      }
      bits += add_bits[ch];
    }
    if (bits > extra_bits) {
      for (ch = 0; ch < gfc.channels_out; ++ch) {
        add_bits[ch] = extra_bits * add_bits[ch] / bits;
      }
    }
    for (ch = 0; ch < gfc.channels_out; ++ch) {
      targ_bits[ch] += add_bits[ch];
      extra_bits -= add_bits[ch];
    }
    for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
      bits += targ_bits[ch];
    }
    if (bits > LameInternalFlags$1.MAX_BITS_PER_GRANULE) {
      var sum = 0;
      for (ch = 0; ch < gfc.channels_out; ++ch) {
        targ_bits[ch] *= LameInternalFlags$1.MAX_BITS_PER_GRANULE;
        targ_bits[ch] /= bits;
        sum += targ_bits[ch];
      }
    }
    return max_bits;
  };
  this.reduce_side = function(targ_bits, ms_ener_ratio, mean_bits, max_bits) {
    assert$7(
      targ_bits[0] + targ_bits[1] <= LameInternalFlags$1.MAX_BITS_PER_GRANULE
    );
    var fac = 0.33 * (0.5 - ms_ener_ratio) / 0.5;
    if (fac < 0)
      fac = 0;
    if (fac > 0.5)
      fac = 0.5;
    var move_bits = 0 | fac * 0.5 * (targ_bits[0] + targ_bits[1]);
    if (move_bits > LameInternalFlags$1.MAX_BITS_PER_CHANNEL - targ_bits[0]) {
      move_bits = LameInternalFlags$1.MAX_BITS_PER_CHANNEL - targ_bits[0];
    }
    if (move_bits < 0)
      move_bits = 0;
    if (targ_bits[1] >= 125) {
      if (targ_bits[1] - move_bits > 125) {
        if (targ_bits[0] < mean_bits)
          targ_bits[0] += move_bits;
        targ_bits[1] -= move_bits;
      } else {
        targ_bits[0] += targ_bits[1] - 125;
        targ_bits[1] = 125;
      }
    }
    move_bits = targ_bits[0] + targ_bits[1];
    if (move_bits > max_bits) {
      targ_bits[0] = max_bits * targ_bits[0] / move_bits;
      targ_bits[1] = max_bits * targ_bits[1] / move_bits;
    }
    assert$7(targ_bits[0] <= LameInternalFlags$1.MAX_BITS_PER_CHANNEL);
    assert$7(targ_bits[1] <= LameInternalFlags$1.MAX_BITS_PER_CHANNEL);
    assert$7(
      targ_bits[0] + targ_bits[1] <= LameInternalFlags$1.MAX_BITS_PER_GRANULE
    );
  };
  this.athAdjust = function(a, x, athFloor) {
    var o = 90.30873362;
    var p2 = 94.82444863;
    var u = Util$1.FAST_LOG10_X(x, 10);
    var v = a * a;
    var w = 0;
    u -= athFloor;
    if (v > 1e-20)
      w = 1 + Util$1.FAST_LOG10_X(v, 10 / o);
    if (w < 0)
      w = 0;
    u *= w;
    u += athFloor + o - p2;
    return Math.pow(10, 0.1 * u);
  };
  this.calc_xmin = function(gfp, ratio, cod_info, pxmin) {
    var pxminPos = 0;
    var gfc = gfp.internal_flags;
    var gsfb;
    var j = 0;
    var ath_over = 0;
    var ATH2 = gfc.ATH;
    var xr = cod_info.xr;
    var enable_athaa_fix = gfp.VBR == VbrMode$4.vbr_mtrh ? 1 : 0;
    var masking_lower = gfc.masking_lower;
    if (gfp.VBR == VbrMode$4.vbr_mtrh || gfp.VBR == VbrMode$4.vbr_mt) {
      masking_lower = 1;
    }
    for (gsfb = 0; gsfb < cod_info.psy_lmax; gsfb++) {
      var en0, xmin;
      var rh1, rh2;
      var width, l;
      if (gfp.VBR == VbrMode$4.vbr_rh || gfp.VBR == VbrMode$4.vbr_mtrh) {
        xmin = athAdjust(ATH2.adjust, ATH2.l[gsfb], ATH2.floor);
      } else
        xmin = ATH2.adjust * ATH2.l[gsfb];
      width = cod_info.width[gsfb];
      rh1 = xmin / width;
      rh2 = DBL_EPSILON;
      l = width >> 1;
      en0 = 0;
      do {
        var xa, xb;
        xa = xr[j] * xr[j];
        en0 += xa;
        rh2 += xa < rh1 ? xa : rh1;
        j++;
        xb = xr[j] * xr[j];
        en0 += xb;
        rh2 += xb < rh1 ? xb : rh1;
        j++;
      } while (--l > 0);
      if (en0 > xmin)
        ath_over++;
      if (gsfb == Encoder.SBPSY_l) {
        var x = xmin * gfc.nsPsy.longfact[gsfb];
        if (rh2 < x) {
          rh2 = x;
        }
      }
      if (enable_athaa_fix != 0) {
        xmin = rh2;
      }
      if (!gfp.ATHonly) {
        var e = ratio.en.l[gsfb];
        if (e > 0) {
          var x;
          x = en0 * ratio.thm.l[gsfb] * masking_lower / e;
          if (enable_athaa_fix != 0)
            x *= gfc.nsPsy.longfact[gsfb];
          if (xmin < x)
            xmin = x;
        }
      }
      if (enable_athaa_fix != 0)
        pxmin[pxminPos++] = xmin;
      else
        pxmin[pxminPos++] = xmin * gfc.nsPsy.longfact[gsfb];
    }
    var max_nonzero = 575;
    if (cod_info.block_type != Encoder.SHORT_TYPE) {
      var k = 576;
      while (k-- != 0 && BitStream$1.EQ(xr[k], 0)) {
        max_nonzero = k;
      }
    }
    cod_info.max_nonzero_coeff = max_nonzero;
    for (var sfb = cod_info.sfb_smin; gsfb < cod_info.psymax; sfb++, gsfb += 3) {
      var width, b;
      var tmpATH;
      if (gfp.VBR == VbrMode$4.vbr_rh || gfp.VBR == VbrMode$4.vbr_mtrh) {
        tmpATH = athAdjust(ATH2.adjust, ATH2.s[sfb], ATH2.floor);
      } else
        tmpATH = ATH2.adjust * ATH2.s[sfb];
      width = cod_info.width[gsfb];
      for (b = 0; b < 3; b++) {
        var en0 = 0;
        var xmin;
        var rh1, rh2;
        var l = width >> 1;
        rh1 = tmpATH / width;
        rh2 = DBL_EPSILON;
        do {
          var xa, xb;
          xa = xr[j] * xr[j];
          en0 += xa;
          rh2 += xa < rh1 ? xa : rh1;
          j++;
          xb = xr[j] * xr[j];
          en0 += xb;
          rh2 += xb < rh1 ? xb : rh1;
          j++;
        } while (--l > 0);
        if (en0 > tmpATH)
          ath_over++;
        if (sfb == Encoder.SBPSY_s) {
          var x = tmpATH * gfc.nsPsy.shortfact[sfb];
          if (rh2 < x) {
            rh2 = x;
          }
        }
        if (enable_athaa_fix != 0)
          xmin = rh2;
        else
          xmin = tmpATH;
        if (!gfp.ATHonly && !gfp.ATHshort) {
          var e = ratio.en.s[sfb][b];
          if (e > 0) {
            var x;
            x = en0 * ratio.thm.s[sfb][b] * masking_lower / e;
            if (enable_athaa_fix != 0)
              x *= gfc.nsPsy.shortfact[sfb];
            if (xmin < x)
              xmin = x;
          }
        }
        if (enable_athaa_fix != 0)
          pxmin[pxminPos++] = xmin;
        else
          pxmin[pxminPos++] = xmin * gfc.nsPsy.shortfact[sfb];
      }
      if (gfp.useTemporal) {
        if (pxmin[pxminPos - 3] > pxmin[pxminPos - 3 + 1]) {
          pxmin[pxminPos - 3 + 1] += (pxmin[pxminPos - 3] - pxmin[pxminPos - 3 + 1]) * gfc.decay;
        }
        if (pxmin[pxminPos - 3 + 1] > pxmin[pxminPos - 3 + 2]) {
          pxmin[pxminPos - 3 + 2] += (pxmin[pxminPos - 3 + 1] - pxmin[pxminPos - 3 + 2]) * gfc.decay;
        }
      }
    }
    return ath_over;
  };
  function StartLine(j) {
    this.s = j;
  }
  this.calc_noise_core = function(cod_info, startline, l, step) {
    var noise = 0;
    var j = startline.s;
    var ix = cod_info.l3_enc;
    if (j > cod_info.count1) {
      while (l-- != 0) {
        var temp;
        temp = cod_info.xr[j];
        j++;
        noise += temp * temp;
        temp = cod_info.xr[j];
        j++;
        noise += temp * temp;
      }
    } else if (j > cod_info.big_values) {
      var ix01 = new_float$3(2);
      ix01[0] = 0;
      ix01[1] = step;
      while (l-- != 0) {
        var temp;
        temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
        j++;
        noise += temp * temp;
        temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
        j++;
        noise += temp * temp;
      }
    } else {
      while (l-- != 0) {
        var temp;
        temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
        j++;
        noise += temp * temp;
        temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
        j++;
        noise += temp * temp;
      }
    }
    startline.s = j;
    return noise;
  };
  this.calc_noise = function(cod_info, l3_xmin, distort, res, prev_noise) {
    var distortPos = 0;
    var l3_xminPos = 0;
    var sfb;
    var l;
    var over = 0;
    var over_noise_db = 0;
    var tot_noise_db = 0;
    var max_noise = -20;
    var j = 0;
    var scalefac = cod_info.scalefac;
    var scalefacPos = 0;
    res.over_SSD = 0;
    for (sfb = 0; sfb < cod_info.psymax; sfb++) {
      var s = cod_info.global_gain - (scalefac[scalefacPos++] + (cod_info.preflag != 0 ? pretab[sfb] : 0) << cod_info.scalefac_scale + 1) - cod_info.subblock_gain[cod_info.window[sfb]] * 8;
      var noise = 0;
      if (prev_noise != null && prev_noise.step[sfb] == s) {
        noise = prev_noise.noise[sfb];
        j += cod_info.width[sfb];
        distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
        noise = prev_noise.noise_log[sfb];
      } else {
        var step = POW20(s);
        l = cod_info.width[sfb] >> 1;
        if (j + cod_info.width[sfb] > cod_info.max_nonzero_coeff) {
          var usefullsize;
          usefullsize = cod_info.max_nonzero_coeff - j + 1;
          if (usefullsize > 0)
            l = usefullsize >> 1;
          else
            l = 0;
        }
        var sl = new StartLine(j);
        noise = this.calc_noise_core(cod_info, sl, l, step);
        j = sl.s;
        if (prev_noise != null) {
          prev_noise.step[sfb] = s;
          prev_noise.noise[sfb] = noise;
        }
        noise = distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
        noise = Util$1.FAST_LOG10(Math.max(noise, 1e-20));
        if (prev_noise != null) {
          prev_noise.noise_log[sfb] = noise;
        }
      }
      if (prev_noise != null) {
        prev_noise.global_gain = cod_info.global_gain;
      }
      tot_noise_db += noise;
      if (noise > 0) {
        var tmp;
        tmp = Math.max(0 | noise * 10 + 0.5, 1);
        res.over_SSD += tmp * tmp;
        over++;
        over_noise_db += noise;
      }
      max_noise = Math.max(max_noise, noise);
    }
    res.over_count = over;
    res.tot_noise = tot_noise_db;
    res.over_noise = over_noise_db;
    res.max_noise = max_noise;
    return over;
  };
  this.set_pinfo = function(gfp, cod_info, ratio, gr, ch) {
    var gfc = gfp.internal_flags;
    var sfb, sfb2;
    var l;
    var en0, en1;
    var ifqstep = cod_info.scalefac_scale == 0 ? 0.5 : 1;
    var scalefac = cod_info.scalefac;
    var l3_xmin = new_float$3(L3Side.SFBMAX);
    var xfsf = new_float$3(L3Side.SFBMAX);
    var noise = new CalcNoiseResult();
    calc_xmin(gfp, ratio, cod_info, l3_xmin);
    calc_noise(cod_info, l3_xmin, xfsf, noise, null);
    var j = 0;
    sfb2 = cod_info.sfb_lmax;
    if (cod_info.block_type != Encoder.SHORT_TYPE && cod_info.mixed_block_flag == 0) {
      sfb2 = 22;
    }
    for (sfb = 0; sfb < sfb2; sfb++) {
      var start2 = gfc.scalefac_band.l[sfb];
      var end = gfc.scalefac_band.l[sfb + 1];
      var bw = end - start2;
      for (en0 = 0; j < end; j++)
        en0 += cod_info.xr[j] * cod_info.xr[j];
      en0 /= bw;
      en1 = 1e15;
      gfc.pinfo.en[gr][ch][sfb] = en1 * en0;
      gfc.pinfo.xfsf[gr][ch][sfb] = en1 * l3_xmin[sfb] * xfsf[sfb] / bw;
      if (ratio.en.l[sfb] > 0 && !gfp.ATHonly)
        en0 = en0 / ratio.en.l[sfb];
      else
        en0 = 0;
      gfc.pinfo.thr[gr][ch][sfb] = en1 * Math.max(en0 * ratio.thm.l[sfb], gfc.ATH.l[sfb]);
      gfc.pinfo.LAMEsfb[gr][ch][sfb] = 0;
      if (cod_info.preflag != 0 && sfb >= 11) {
        gfc.pinfo.LAMEsfb[gr][ch][sfb] = -ifqstep * pretab[sfb];
      }
      if (sfb < Encoder.SBPSY_l) {
        assert$7(scalefac[sfb] >= 0);
        gfc.pinfo.LAMEsfb[gr][ch][sfb] -= ifqstep * scalefac[sfb];
      }
    }
    if (cod_info.block_type == Encoder.SHORT_TYPE) {
      sfb2 = sfb;
      for (sfb = cod_info.sfb_smin; sfb < Encoder.SBMAX_s; sfb++) {
        var start2 = gfc.scalefac_band.s[sfb];
        var end = gfc.scalefac_band.s[sfb + 1];
        var bw = end - start2;
        for (var i = 0; i < 3; i++) {
          for (en0 = 0, l = start2; l < end; l++) {
            en0 += cod_info.xr[j] * cod_info.xr[j];
            j++;
          }
          en0 = Math.max(en0 / bw, 1e-20);
          en1 = 1e15;
          gfc.pinfo.en_s[gr][ch][3 * sfb + i] = en1 * en0;
          gfc.pinfo.xfsf_s[gr][ch][3 * sfb + i] = en1 * l3_xmin[sfb2] * xfsf[sfb2] / bw;
          if (ratio.en.s[sfb][i] > 0)
            en0 = en0 / ratio.en.s[sfb][i];
          else
            en0 = 0;
          if (gfp.ATHonly || gfp.ATHshort)
            en0 = 0;
          gfc.pinfo.thr_s[gr][ch][3 * sfb + i] = en1 * Math.max(en0 * ratio.thm.s[sfb][i], gfc.ATH.s[sfb]);
          gfc.pinfo.LAMEsfb_s[gr][ch][3 * sfb + i] = -2 * cod_info.subblock_gain[i];
          if (sfb < Encoder.SBPSY_s) {
            gfc.pinfo.LAMEsfb_s[gr][ch][3 * sfb + i] -= ifqstep * scalefac[sfb2];
          }
          sfb2++;
        }
      }
    }
    gfc.pinfo.LAMEqss[gr][ch] = cod_info.global_gain;
    gfc.pinfo.LAMEmainbits[gr][ch] = cod_info.part2_3_length + cod_info.part2_length;
    gfc.pinfo.LAMEsfbits[gr][ch] = cod_info.part2_length;
    gfc.pinfo.over[gr][ch] = noise.over_count;
    gfc.pinfo.max_noise[gr][ch] = noise.max_noise * 10;
    gfc.pinfo.over_noise[gr][ch] = noise.over_noise * 10;
    gfc.pinfo.tot_noise[gr][ch] = noise.tot_noise * 10;
    gfc.pinfo.over_SSD[gr][ch] = noise.over_SSD;
  };
}
var System$4 = common.System;
var Arrays$3 = common.Arrays;
var new_int$2 = common.new_int;
var assert$6 = common.assert;
function Takehiro() {
  var qupvt = null;
  this.qupvt = null;
  this.setModules = function(_qupvt) {
    this.qupvt = _qupvt;
    qupvt = _qupvt;
  };
  function Bits(b) {
    this.bits = 0 | b;
  }
  var subdv_table = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
    [2, 3],
    [3, 4],
    [3, 4],
    [3, 4],
    [4, 5],
    [4, 5],
    [4, 6],
    [5, 6],
    [5, 6],
    [5, 7],
    [6, 7],
    [6, 7]
  ];
  function quantize_lines_xrpow_01(l, istep, xr, xrPos, ix, ixPos) {
    var compareval0 = (1 - 0.4054) / istep;
    l = l >> 1;
    while (l-- != 0) {
      ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
      ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
    }
  }
  function quantize_lines_xrpow(l, istep, xr, xrPos, ix, ixPos) {
    l = l >> 1;
    var remaining = l % 2;
    l = l >> 1;
    while (l-- != 0) {
      var x0, x1, x2, x3;
      var rx0, rx1, rx2, rx3;
      x0 = xr[xrPos++] * istep;
      x1 = xr[xrPos++] * istep;
      rx0 = 0 | x0;
      x2 = xr[xrPos++] * istep;
      rx1 = 0 | x1;
      x3 = xr[xrPos++] * istep;
      rx2 = 0 | x2;
      x0 += qupvt.adj43[rx0];
      rx3 = 0 | x3;
      x1 += qupvt.adj43[rx1];
      ix[ixPos++] = 0 | x0;
      x2 += qupvt.adj43[rx2];
      ix[ixPos++] = 0 | x1;
      x3 += qupvt.adj43[rx3];
      ix[ixPos++] = 0 | x2;
      ix[ixPos++] = 0 | x3;
    }
    if (remaining != 0) {
      var x0, x1;
      var rx0, rx1;
      x0 = xr[xrPos++] * istep;
      x1 = xr[xrPos++] * istep;
      rx0 = 0 | x0;
      rx1 = 0 | x1;
      x0 += qupvt.adj43[rx0];
      x1 += qupvt.adj43[rx1];
      ix[ixPos++] = 0 | x0;
      ix[ixPos++] = 0 | x1;
    }
  }
  function quantize_xrpow(xp, pi, istep, codInfo, prevNoise) {
    var sfb;
    var sfbmax;
    var j = 0;
    var prev_data_use;
    var accumulate = 0;
    var accumulate01 = 0;
    var xpPos = 0;
    var iData = pi;
    var iDataPos = 0;
    var acc_iData = iData;
    var acc_iDataPos = 0;
    var acc_xp = xp;
    var acc_xpPos = 0;
    prev_data_use = prevNoise != null && codInfo.global_gain == prevNoise.global_gain;
    if (codInfo.block_type == Encoder.SHORT_TYPE)
      sfbmax = 38;
    else
      sfbmax = 21;
    for (sfb = 0; sfb <= sfbmax; sfb++) {
      var step = -1;
      if (prev_data_use || codInfo.block_type == Encoder.NORM_TYPE) {
        step = codInfo.global_gain - (codInfo.scalefac[sfb] + (codInfo.preflag != 0 ? qupvt.pretab[sfb] : 0) << codInfo.scalefac_scale + 1) - codInfo.subblock_gain[codInfo.window[sfb]] * 8;
      }
      assert$6(codInfo.width[sfb] >= 0);
      if (prev_data_use && prevNoise.step[sfb] == step) {
        if (accumulate != 0) {
          quantize_lines_xrpow(
            accumulate,
            istep,
            acc_xp,
            acc_xpPos,
            acc_iData,
            acc_iDataPos
          );
          accumulate = 0;
        }
        if (accumulate01 != 0) {
          quantize_lines_xrpow_01(
            accumulate01,
            istep,
            acc_xp,
            acc_xpPos,
            acc_iData,
            acc_iDataPos
          );
          accumulate01 = 0;
        }
      } else {
        var l = codInfo.width[sfb];
        if (j + codInfo.width[sfb] > codInfo.max_nonzero_coeff) {
          var usefullsize;
          usefullsize = codInfo.max_nonzero_coeff - j + 1;
          Arrays$3.fill(pi, codInfo.max_nonzero_coeff, 576, 0);
          l = usefullsize;
          if (l < 0) {
            l = 0;
          }
          sfb = sfbmax + 1;
        }
        if (accumulate == 0 && accumulate01 == 0) {
          acc_iData = iData;
          acc_iDataPos = iDataPos;
          acc_xp = xp;
          acc_xpPos = xpPos;
        }
        if (prevNoise != null && prevNoise.sfb_count1 > 0 && sfb >= prevNoise.sfb_count1 && prevNoise.step[sfb] > 0 && step >= prevNoise.step[sfb]) {
          if (accumulate != 0) {
            quantize_lines_xrpow(
              accumulate,
              istep,
              acc_xp,
              acc_xpPos,
              acc_iData,
              acc_iDataPos
            );
            accumulate = 0;
            acc_iData = iData;
            acc_iDataPos = iDataPos;
            acc_xp = xp;
            acc_xpPos = xpPos;
          }
          accumulate01 += l;
        } else {
          if (accumulate01 != 0) {
            quantize_lines_xrpow_01(
              accumulate01,
              istep,
              acc_xp,
              acc_xpPos,
              acc_iData,
              acc_iDataPos
            );
            accumulate01 = 0;
            acc_iData = iData;
            acc_iDataPos = iDataPos;
            acc_xp = xp;
            acc_xpPos = xpPos;
          }
          accumulate += l;
        }
        if (l <= 0) {
          if (accumulate01 != 0) {
            quantize_lines_xrpow_01(
              accumulate01,
              istep,
              acc_xp,
              acc_xpPos,
              acc_iData,
              acc_iDataPos
            );
            accumulate01 = 0;
          }
          if (accumulate != 0) {
            quantize_lines_xrpow(
              accumulate,
              istep,
              acc_xp,
              acc_xpPos,
              acc_iData,
              acc_iDataPos
            );
            accumulate = 0;
          }
          break;
        }
      }
      if (sfb <= sfbmax) {
        iDataPos += codInfo.width[sfb];
        xpPos += codInfo.width[sfb];
        j += codInfo.width[sfb];
      }
    }
    if (accumulate != 0) {
      quantize_lines_xrpow(
        accumulate,
        istep,
        acc_xp,
        acc_xpPos,
        acc_iData,
        acc_iDataPos
      );
      accumulate = 0;
    }
    if (accumulate01 != 0) {
      quantize_lines_xrpow_01(
        accumulate01,
        istep,
        acc_xp,
        acc_xpPos,
        acc_iData,
        acc_iDataPos
      );
      accumulate01 = 0;
    }
  }
  function ix_max(ix, ixPos, endPos) {
    var max1 = 0;
    var max2 = 0;
    do {
      var x1 = ix[ixPos++];
      var x2 = ix[ixPos++];
      if (max1 < x1)
        max1 = x1;
      if (max2 < x2)
        max2 = x2;
    } while (ixPos < endPos);
    if (max1 < max2)
      max1 = max2;
    return max1;
  }
  function count_bit_ESC(ix, ixPos, end, t1, t2, s) {
    var linbits = Tables$1.ht[t1].xlen * 65536 + Tables$1.ht[t2].xlen;
    var sum = 0;
    var sum2;
    do {
      var x = ix[ixPos++];
      var y = ix[ixPos++];
      if (x != 0) {
        if (x > 14) {
          x = 15;
          sum += linbits;
        }
        x *= 16;
      }
      if (y != 0) {
        if (y > 14) {
          y = 15;
          sum += linbits;
        }
        x += y;
      }
      sum += Tables$1.largetbl[x];
    } while (ixPos < end);
    sum2 = sum & 65535;
    sum >>= 16;
    if (sum > sum2) {
      sum = sum2;
      t1 = t2;
    }
    s.bits += sum;
    return t1;
  }
  function count_bit_noESC(ix, ixPos, end, s) {
    var sum1 = 0;
    var hlen1 = Tables$1.ht[1].hlen;
    do {
      var x = ix[ixPos + 0] * 2 + ix[ixPos + 1];
      ixPos += 2;
      sum1 += hlen1[x];
    } while (ixPos < end);
    s.bits += sum1;
    return 1;
  }
  function count_bit_noESC_from2(ix, ixPos, end, t1, s) {
    var sum = 0;
    var sum2;
    var xlen = Tables$1.ht[t1].xlen;
    var hlen;
    if (t1 == 2)
      hlen = Tables$1.table23;
    else
      hlen = Tables$1.table56;
    do {
      var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
      ixPos += 2;
      sum += hlen[x];
    } while (ixPos < end);
    sum2 = sum & 65535;
    sum >>= 16;
    if (sum > sum2) {
      sum = sum2;
      t1++;
    }
    s.bits += sum;
    return t1;
  }
  function count_bit_noESC_from3(ix, ixPos, end, t1, s) {
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;
    var xlen = Tables$1.ht[t1].xlen;
    var hlen1 = Tables$1.ht[t1].hlen;
    var hlen2 = Tables$1.ht[t1 + 1].hlen;
    var hlen3 = Tables$1.ht[t1 + 2].hlen;
    do {
      var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
      ixPos += 2;
      sum1 += hlen1[x];
      sum2 += hlen2[x];
      sum3 += hlen3[x];
    } while (ixPos < end);
    var t = t1;
    if (sum1 > sum2) {
      sum1 = sum2;
      t++;
    }
    if (sum1 > sum3) {
      sum1 = sum3;
      t = t1 + 2;
    }
    s.bits += sum1;
    return t;
  }
  var huf_tbl_noESC = [1, 2, 5, 7, 7, 10, 10, 13, 13, 13, 13, 13, 13, 13, 13];
  function choose_table(ix, ixPos, endPos, s) {
    var max = ix_max(ix, ixPos, endPos);
    switch (max) {
      case 0:
        return max;
      case 1:
        return count_bit_noESC(ix, ixPos, endPos, s);
      case 2:
      case 3:
        return count_bit_noESC_from2(
          ix,
          ixPos,
          endPos,
          huf_tbl_noESC[max - 1],
          s
        );
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return count_bit_noESC_from3(
          ix,
          ixPos,
          endPos,
          huf_tbl_noESC[max - 1],
          s
        );
      default:
        if (max > QuantizePVT.IXMAX_VAL) {
          s.bits = QuantizePVT.LARGE_BITS;
          return -1;
        }
        max -= 15;
        var choice2;
        for (choice2 = 24; choice2 < 32; choice2++) {
          if (Tables$1.ht[choice2].linmax >= max) {
            break;
          }
        }
        var choice;
        for (choice = choice2 - 8; choice < 24; choice++) {
          if (Tables$1.ht[choice].linmax >= max) {
            break;
          }
        }
        return count_bit_ESC(ix, ixPos, endPos, choice, choice2, s);
    }
  }
  this.noquant_count_bits = function(gfc, gi, prev_noise) {
    var ix = gi.l3_enc;
    var i = Math.min(576, gi.max_nonzero_coeff + 2 >> 1 << 1);
    if (prev_noise != null)
      prev_noise.sfb_count1 = 0;
    for (; i > 1; i -= 2)
      if ((ix[i - 1] | ix[i - 2]) != 0)
        break;
    gi.count1 = i;
    var a1 = 0;
    var a2 = 0;
    for (; i > 3; i -= 4) {
      var p2;
      if (((ix[i - 1] | ix[i - 2] | ix[i - 3] | ix[i - 4]) & 2147483647) > 1) {
        break;
      }
      p2 = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
      a1 += Tables$1.t32l[p2];
      a2 += Tables$1.t33l[p2];
    }
    var bits = a1;
    gi.count1table_select = 0;
    if (a1 > a2) {
      bits = a2;
      gi.count1table_select = 1;
    }
    gi.count1bits = bits;
    gi.big_values = i;
    if (i == 0)
      return bits;
    if (gi.block_type == Encoder.SHORT_TYPE) {
      a1 = 3 * gfc.scalefac_band.s[3];
      if (a1 > gi.big_values)
        a1 = gi.big_values;
      a2 = gi.big_values;
    } else if (gi.block_type == Encoder.NORM_TYPE) {
      a1 = gi.region0_count = gfc.bv_scf[i - 2];
      a2 = gi.region1_count = gfc.bv_scf[i - 1];
      a2 = gfc.scalefac_band.l[a1 + a2 + 2];
      a1 = gfc.scalefac_band.l[a1 + 1];
      if (a2 < i) {
        var bi = new Bits(bits);
        gi.table_select[2] = choose_table(ix, a2, i, bi);
        bits = bi.bits;
      }
    } else {
      gi.region0_count = 7;
      gi.region1_count = Encoder.SBMAX_l - 1 - 7 - 1;
      a1 = gfc.scalefac_band.l[7 + 1];
      a2 = i;
      if (a1 > a2) {
        a1 = a2;
      }
    }
    a1 = Math.min(a1, i);
    a2 = Math.min(a2, i);
    if (a1 > 0) {
      var bi = new Bits(bits);
      gi.table_select[0] = choose_table(ix, 0, a1, bi);
      bits = bi.bits;
    }
    if (a1 < a2) {
      var bi = new Bits(bits);
      gi.table_select[1] = choose_table(ix, a1, a2, bi);
      bits = bi.bits;
    }
    if (gfc.use_best_huffman == 2) {
      gi.part2_3_length = bits;
      best_huffman_divide(gfc, gi);
      bits = gi.part2_3_length;
    }
    if (prev_noise != null) {
      if (gi.block_type == Encoder.NORM_TYPE) {
        var sfb = 0;
        while (gfc.scalefac_band.l[sfb] < gi.big_values) {
          sfb++;
        }
        prev_noise.sfb_count1 = sfb;
      }
    }
    return bits;
  };
  this.count_bits = function(gfc, xr, gi, prev_noise) {
    var ix = gi.l3_enc;
    var w = QuantizePVT.IXMAX_VAL / qupvt.IPOW20(gi.global_gain);
    if (gi.xrpow_max > w)
      return QuantizePVT.LARGE_BITS;
    quantize_xrpow(xr, ix, qupvt.IPOW20(gi.global_gain), gi, prev_noise);
    if ((gfc.substep_shaping & 2) != 0) {
      var j = 0;
      var gain = gi.global_gain + gi.scalefac_scale;
      var roundfac = 0.634521682242439 / qupvt.IPOW20(gain);
      for (var sfb = 0; sfb < gi.sfbmax; sfb++) {
        var width = gi.width[sfb];
        if (gfc.pseudohalf[sfb] == 0) {
          j += width;
        } else {
          var k;
          for (k = j, j += width; k < j; ++k) {
            ix[k] = xr[k] >= roundfac ? ix[k] : 0;
          }
        }
      }
    }
    return this.noquant_count_bits(gfc, gi, prev_noise);
  };
  function recalc_divide_init(gfc, cod_info, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
    var bigv = cod_info.big_values;
    for (var r0 = 0; r0 <= 7 + 15; r0++) {
      r01_bits[r0] = QuantizePVT.LARGE_BITS;
    }
    for (var r0 = 0; r0 < 16; r0++) {
      var a1 = gfc.scalefac_band.l[r0 + 1];
      if (a1 >= bigv)
        break;
      var r0bits = 0;
      var bi = new Bits(r0bits);
      var r0t = choose_table(ix, 0, a1, bi);
      r0bits = bi.bits;
      for (var r1 = 0; r1 < 8; r1++) {
        var a2 = gfc.scalefac_band.l[r0 + r1 + 2];
        if (a2 >= bigv)
          break;
        var bits = r0bits;
        bi = new Bits(bits);
        var r1t = choose_table(ix, a1, a2, bi);
        bits = bi.bits;
        if (r01_bits[r0 + r1] > bits) {
          r01_bits[r0 + r1] = bits;
          r01_div[r0 + r1] = r0;
          r0_tbl[r0 + r1] = r0t;
          r1_tbl[r0 + r1] = r1t;
        }
      }
    }
  }
  function recalc_divide_sub(gfc, cod_info2, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
    var bigv = cod_info2.big_values;
    for (var r2 = 2; r2 < Encoder.SBMAX_l + 1; r2++) {
      var a2 = gfc.scalefac_band.l[r2];
      if (a2 >= bigv)
        break;
      var bits = r01_bits[r2 - 2] + cod_info2.count1bits;
      if (gi.part2_3_length <= bits)
        break;
      var bi = new Bits(bits);
      var r2t = choose_table(ix, a2, bigv, bi);
      bits = bi.bits;
      if (gi.part2_3_length <= bits)
        continue;
      gi.assign(cod_info2);
      gi.part2_3_length = bits;
      gi.region0_count = r01_div[r2 - 2];
      gi.region1_count = r2 - 2 - r01_div[r2 - 2];
      gi.table_select[0] = r0_tbl[r2 - 2];
      gi.table_select[1] = r1_tbl[r2 - 2];
      gi.table_select[2] = r2t;
    }
  }
  this.best_huffman_divide = function(gfc, gi) {
    var cod_info2 = new GrInfo();
    var ix = gi.l3_enc;
    var r01_bits = new_int$2(7 + 15 + 1);
    var r01_div = new_int$2(7 + 15 + 1);
    var r0_tbl = new_int$2(7 + 15 + 1);
    var r1_tbl = new_int$2(7 + 15 + 1);
    if (gi.block_type == Encoder.SHORT_TYPE && gfc.mode_gr == 1)
      return;
    cod_info2.assign(gi);
    if (gi.block_type == Encoder.NORM_TYPE) {
      recalc_divide_init(gfc, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl);
      recalc_divide_sub(
        gfc,
        cod_info2,
        gi,
        ix,
        r01_bits,
        r01_div,
        r0_tbl,
        r1_tbl
      );
    }
    var i = cod_info2.big_values;
    if (i == 0 || (ix[i - 2] | ix[i - 1]) > 1)
      return;
    i = gi.count1 + 2;
    if (i > 576)
      return;
    cod_info2.assign(gi);
    cod_info2.count1 = i;
    var a1 = 0;
    var a2 = 0;
    for (; i > cod_info2.big_values; i -= 4) {
      var p2 = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
      a1 += Tables$1.t32l[p2];
      a2 += Tables$1.t33l[p2];
    }
    cod_info2.big_values = i;
    cod_info2.count1table_select = 0;
    if (a1 > a2) {
      a1 = a2;
      cod_info2.count1table_select = 1;
    }
    cod_info2.count1bits = a1;
    if (cod_info2.block_type == Encoder.NORM_TYPE) {
      recalc_divide_sub(
        gfc,
        cod_info2,
        gi,
        ix,
        r01_bits,
        r01_div,
        r0_tbl,
        r1_tbl
      );
    } else {
      cod_info2.part2_3_length = a1;
      a1 = gfc.scalefac_band.l[7 + 1];
      if (a1 > i) {
        a1 = i;
      }
      if (a1 > 0) {
        var bi = new Bits(cod_info2.part2_3_length);
        cod_info2.table_select[0] = choose_table(ix, 0, a1, bi);
        cod_info2.part2_3_length = bi.bits;
      }
      if (i > a1) {
        var bi = new Bits(cod_info2.part2_3_length);
        cod_info2.table_select[1] = choose_table(ix, a1, i, bi);
        cod_info2.part2_3_length = bi.bits;
      }
      if (gi.part2_3_length > cod_info2.part2_3_length)
        gi.assign(cod_info2);
    }
  };
  var slen1_n = [1, 1, 1, 1, 8, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16];
  var slen2_n = [1, 2, 4, 8, 1, 2, 4, 8, 2, 4, 8, 2, 4, 8, 4, 8];
  var slen1_tab = [0, 0, 0, 0, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
  var slen2_tab = [0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 2, 3];
  Takehiro.slen1_tab = slen1_tab;
  Takehiro.slen2_tab = slen2_tab;
  function scfsi_calc(ch, l3_side) {
    var sfb;
    var gi = l3_side.tt[1][ch];
    var g0 = l3_side.tt[0][ch];
    for (var i = 0; i < Tables$1.scfsi_band.length - 1; i++) {
      for (sfb = Tables$1.scfsi_band[i]; sfb < Tables$1.scfsi_band[i + 1]; sfb++) {
        if (g0.scalefac[sfb] != gi.scalefac[sfb] && gi.scalefac[sfb] >= 0)
          break;
      }
      if (sfb == Tables$1.scfsi_band[i + 1]) {
        for (sfb = Tables$1.scfsi_band[i]; sfb < Tables$1.scfsi_band[i + 1]; sfb++) {
          gi.scalefac[sfb] = -1;
        }
        l3_side.scfsi[ch][i] = 1;
      }
    }
    var s1 = 0;
    var c1 = 0;
    for (sfb = 0; sfb < 11; sfb++) {
      if (gi.scalefac[sfb] == -1)
        continue;
      c1++;
      if (s1 < gi.scalefac[sfb])
        s1 = gi.scalefac[sfb];
    }
    var s2 = 0;
    var c2 = 0;
    for (; sfb < Encoder.SBPSY_l; sfb++) {
      if (gi.scalefac[sfb] == -1)
        continue;
      c2++;
      if (s2 < gi.scalefac[sfb])
        s2 = gi.scalefac[sfb];
    }
    for (var i = 0; i < 16; i++) {
      if (s1 < slen1_n[i] && s2 < slen2_n[i]) {
        var c = slen1_tab[i] * c1 + slen2_tab[i] * c2;
        if (gi.part2_length > c) {
          gi.part2_length = c;
          gi.scalefac_compress = i;
        }
      }
    }
  }
  this.best_scalefac_store = function(gfc, gr, ch, l3_side) {
    var gi = l3_side.tt[gr][ch];
    var sfb, i, j, l;
    var recalc = 0;
    j = 0;
    for (sfb = 0; sfb < gi.sfbmax; sfb++) {
      var width = gi.width[sfb];
      j += width;
      for (l = -width; l < 0; l++) {
        if (gi.l3_enc[l + j] != 0)
          break;
      }
      if (l == 0)
        gi.scalefac[sfb] = recalc = -2;
    }
    if (gi.scalefac_scale == 0 && gi.preflag == 0) {
      var s = 0;
      for (sfb = 0; sfb < gi.sfbmax; sfb++) {
        if (gi.scalefac[sfb] > 0)
          s |= gi.scalefac[sfb];
      }
      if ((s & 1) == 0 && s != 0) {
        for (sfb = 0; sfb < gi.sfbmax; sfb++) {
          if (gi.scalefac[sfb] > 0)
            gi.scalefac[sfb] >>= 1;
        }
        gi.scalefac_scale = recalc = 1;
      }
    }
    if (gi.preflag == 0 && gi.block_type != Encoder.SHORT_TYPE && gfc.mode_gr == 2) {
      for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++) {
        if (gi.scalefac[sfb] < qupvt.pretab[sfb] && gi.scalefac[sfb] != -2) {
          break;
        }
      }
      if (sfb == Encoder.SBPSY_l) {
        for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++) {
          if (gi.scalefac[sfb] > 0)
            gi.scalefac[sfb] -= qupvt.pretab[sfb];
        }
        gi.preflag = recalc = 1;
      }
    }
    for (i = 0; i < 4; i++)
      l3_side.scfsi[ch][i] = 0;
    if (gfc.mode_gr == 2 && gr == 1 && l3_side.tt[0][ch].block_type != Encoder.SHORT_TYPE && l3_side.tt[1][ch].block_type != Encoder.SHORT_TYPE) {
      scfsi_calc(ch, l3_side);
      recalc = 0;
    }
    for (sfb = 0; sfb < gi.sfbmax; sfb++) {
      if (gi.scalefac[sfb] == -2) {
        gi.scalefac[sfb] = 0;
      }
    }
    if (recalc != 0) {
      if (gfc.mode_gr == 2) {
        this.scale_bitcount(gi);
      } else {
        this.scale_bitcount_lsf(gfc, gi);
      }
    }
  };
  function all_scalefactors_not_negative(scalefac, n) {
    for (var i = 0; i < n; ++i) {
      if (scalefac[i] < 0)
        return false;
    }
    return true;
  }
  var scale_short = [
    0,
    18,
    36,
    54,
    54,
    36,
    54,
    72,
    54,
    72,
    90,
    72,
    90,
    108,
    108,
    126
  ];
  var scale_mixed = [
    0,
    18,
    36,
    54,
    51,
    35,
    53,
    71,
    52,
    70,
    88,
    69,
    87,
    105,
    104,
    122
  ];
  var scale_long = [
    0,
    10,
    20,
    30,
    33,
    21,
    31,
    41,
    32,
    42,
    52,
    43,
    53,
    63,
    64,
    74
  ];
  this.scale_bitcount = function(cod_info) {
    var k;
    var sfb;
    var max_slen1 = 0;
    var max_slen2 = 0;
    var tab;
    var scalefac = cod_info.scalefac;
    assert$6(all_scalefactors_not_negative(scalefac, cod_info.sfbmax));
    if (cod_info.block_type == Encoder.SHORT_TYPE) {
      tab = scale_short;
      if (cod_info.mixed_block_flag != 0)
        tab = scale_mixed;
    } else {
      tab = scale_long;
      if (cod_info.preflag == 0) {
        for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++) {
          if (scalefac[sfb] < qupvt.pretab[sfb])
            break;
        }
        if (sfb == Encoder.SBPSY_l) {
          cod_info.preflag = 1;
          for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++) {
            scalefac[sfb] -= qupvt.pretab[sfb];
          }
        }
      }
    }
    for (sfb = 0; sfb < cod_info.sfbdivide; sfb++) {
      if (max_slen1 < scalefac[sfb])
        max_slen1 = scalefac[sfb];
    }
    for (; sfb < cod_info.sfbmax; sfb++) {
      if (max_slen2 < scalefac[sfb])
        max_slen2 = scalefac[sfb];
    }
    cod_info.part2_length = QuantizePVT.LARGE_BITS;
    for (k = 0; k < 16; k++) {
      if (max_slen1 < slen1_n[k] && max_slen2 < slen2_n[k] && cod_info.part2_length > tab[k]) {
        cod_info.part2_length = tab[k];
        cod_info.scalefac_compress = k;
      }
    }
    return cod_info.part2_length == QuantizePVT.LARGE_BITS;
  };
  var max_range_sfac_tab = [
    [15, 15, 7, 7],
    [15, 15, 7, 0],
    [7, 3, 0, 0],
    [15, 31, 31, 0],
    [7, 7, 7, 0],
    [3, 3, 0, 0]
  ];
  this.scale_bitcount_lsf = function(gfc, cod_info) {
    var table_number, row_in_table, partition, nr_sfb, window2;
    var over;
    var i, sfb;
    var max_sfac = new_int$2(4);
    var scalefac = cod_info.scalefac;
    if (cod_info.preflag != 0)
      table_number = 2;
    else
      table_number = 0;
    for (i = 0; i < 4; i++)
      max_sfac[i] = 0;
    if (cod_info.block_type == Encoder.SHORT_TYPE) {
      row_in_table = 1;
      var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
      for (sfb = 0, partition = 0; partition < 4; partition++) {
        nr_sfb = partition_table[partition] / 3;
        for (i = 0; i < nr_sfb; i++, sfb++) {
          for (window2 = 0; window2 < 3; window2++) {
            if (scalefac[sfb * 3 + window2] > max_sfac[partition]) {
              max_sfac[partition] = scalefac[sfb * 3 + window2];
            }
          }
        }
      }
    } else {
      row_in_table = 0;
      var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
      for (sfb = 0, partition = 0; partition < 4; partition++) {
        nr_sfb = partition_table[partition];
        for (i = 0; i < nr_sfb; i++, sfb++) {
          if (scalefac[sfb] > max_sfac[partition]) {
            max_sfac[partition] = scalefac[sfb];
          }
        }
      }
    }
    for (over = false, partition = 0; partition < 4; partition++) {
      if (max_sfac[partition] > max_range_sfac_tab[table_number][partition]) {
        over = true;
      }
    }
    if (!over) {
      var slen1, slen2, slen3, slen4;
      cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
      for (partition = 0; partition < 4; partition++) {
        cod_info.slen[partition] = log2tab[max_sfac[partition]];
      }
      slen1 = cod_info.slen[0];
      slen2 = cod_info.slen[1];
      slen3 = cod_info.slen[2];
      slen4 = cod_info.slen[3];
      switch (table_number) {
        case 0:
          cod_info.scalefac_compress = (slen1 * 5 + slen2 << 4) + (slen3 << 2) + slen4;
          break;
        case 1:
          cod_info.scalefac_compress = 400 + (slen1 * 5 + slen2 << 2) + slen3;
          break;
        case 2:
          cod_info.scalefac_compress = 500 + slen1 * 3 + slen2;
          break;
        default:
          System$4.err.printf("intensity stereo not implemented yet\n");
          break;
      }
    }
    if (!over) {
      assert$6(cod_info.sfb_partition_table != null);
      cod_info.part2_length = 0;
      for (partition = 0; partition < 4; partition++) {
        cod_info.part2_length += cod_info.slen[partition] * cod_info.sfb_partition_table[partition];
      }
    }
    return over;
  };
  var log2tab = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4];
  this.huffman_init = function(gfc) {
    for (var i = 2; i <= 576; i += 2) {
      var scfb_anz = 0;
      var bv_index;
      while (gfc.scalefac_band.l[++scfb_anz] < i)
        ;
      bv_index = subdv_table[scfb_anz][0];
      while (gfc.scalefac_band.l[bv_index + 1] > i)
        bv_index--;
      if (bv_index < 0) {
        bv_index = subdv_table[scfb_anz][0];
      }
      gfc.bv_scf[i - 2] = bv_index;
      bv_index = subdv_table[scfb_anz][1];
      while (gfc.scalefac_band.l[bv_index + gfc.bv_scf[i - 2] + 2] > i) {
        bv_index--;
      }
      if (bv_index < 0) {
        bv_index = subdv_table[scfb_anz][1];
      }
      gfc.bv_scf[i - 1] = bv_index;
    }
  };
}
var System$3 = common.System;
var Arrays$2 = common.Arrays;
var new_byte$2 = common.new_byte;
var new_float_n = common.new_float_n;
var new_int$1 = common.new_int;
var assert$5 = common.assert;
BitStream$1.EQ = function(a, b) {
  return Math.abs(a) > Math.abs(b) ? Math.abs(a - b) <= Math.abs(a) * 1e-6 : Math.abs(a - b) <= Math.abs(b) * 1e-6;
};
BitStream$1.NEQ = function(a, b) {
  return !BitStream$1.EQ(a, b);
};
function BitStream$1() {
  var self2 = this;
  var CRC16_POLYNOMIAL = 32773;
  var ga = null;
  var mpg = null;
  var ver = null;
  var vbr = null;
  this.setModules = function(_ga, _mpg, _ver, _vbr) {
    ga = _ga;
    mpg = _mpg;
    ver = _ver;
    vbr = _vbr;
  };
  var buf = null;
  var totbit = 0;
  var bufByteIdx = 0;
  var bufBitIdx = 0;
  this.getframebits = function(gfp) {
    var gfc = gfp.internal_flags;
    var bit_rate;
    if (gfc.bitrate_index != 0) {
      bit_rate = Tables$1.bitrate_table[gfp.version][gfc.bitrate_index];
    } else
      bit_rate = gfp.brate;
    var bytes = 0 | (gfp.version + 1) * 72e3 * bit_rate / gfp.out_samplerate + gfc.padding;
    return 8 * bytes;
  };
  function putheader_bits(gfc) {
    System$3.arraycopy(
      gfc.header[gfc.w_ptr].buf,
      0,
      buf,
      bufByteIdx,
      gfc.sideinfo_len
    );
    bufByteIdx += gfc.sideinfo_len;
    totbit += gfc.sideinfo_len * 8;
    gfc.w_ptr = gfc.w_ptr + 1 & LameInternalFlags$1.MAX_HEADER_BUF - 1;
  }
  function putbits2(gfc, val, j) {
    while (j > 0) {
      var k;
      if (bufBitIdx == 0) {
        bufBitIdx = 8;
        bufByteIdx++;
        assert$5(gfc.header[gfc.w_ptr].write_timing >= totbit);
        if (gfc.header[gfc.w_ptr].write_timing == totbit) {
          putheader_bits(gfc);
        }
        buf[bufByteIdx] = 0;
      }
      k = Math.min(j, bufBitIdx);
      j -= k;
      bufBitIdx -= k;
      buf[bufByteIdx] |= val >> j << bufBitIdx;
      totbit += k;
    }
  }
  function putbits_noheaders(gfc, val, j) {
    while (j > 0) {
      var k;
      if (bufBitIdx == 0) {
        bufBitIdx = 8;
        bufByteIdx++;
        buf[bufByteIdx] = 0;
      }
      k = Math.min(j, bufBitIdx);
      j -= k;
      bufBitIdx -= k;
      buf[bufByteIdx] |= val >> j << bufBitIdx;
      totbit += k;
    }
  }
  function drain_into_ancillary(gfp, remainingBits) {
    var gfc = gfp.internal_flags;
    var i;
    if (remainingBits >= 8) {
      putbits2(gfc, 76, 8);
      remainingBits -= 8;
    }
    if (remainingBits >= 8) {
      putbits2(gfc, 65, 8);
      remainingBits -= 8;
    }
    if (remainingBits >= 8) {
      putbits2(gfc, 77, 8);
      remainingBits -= 8;
    }
    if (remainingBits >= 8) {
      putbits2(gfc, 69, 8);
      remainingBits -= 8;
    }
    if (remainingBits >= 32) {
      var version2 = ver.getLameShortVersion();
      if (remainingBits >= 32) {
        for (i = 0; i < version2.length && remainingBits >= 8; ++i) {
          remainingBits -= 8;
          putbits2(gfc, version2.charAt(i), 8);
        }
      }
    }
    for (; remainingBits >= 1; remainingBits -= 1) {
      putbits2(gfc, gfc.ancillary_flag, 1);
      gfc.ancillary_flag ^= !gfp.disable_reservoir ? 1 : 0;
    }
  }
  function writeheader(gfc, val, j) {
    var ptr = gfc.header[gfc.h_ptr].ptr;
    while (j > 0) {
      var k = Math.min(j, 8 - (ptr & 7));
      j -= k;
      gfc.header[gfc.h_ptr].buf[ptr >> 3] |= val >> j << 8 - (ptr & 7) - k;
      ptr += k;
    }
    gfc.header[gfc.h_ptr].ptr = ptr;
  }
  function CRC_update(value, crc) {
    value <<= 8;
    for (var i = 0; i < 8; i++) {
      value <<= 1;
      crc <<= 1;
      if (((crc ^ value) & 65536) != 0)
        crc ^= CRC16_POLYNOMIAL;
    }
    return crc;
  }
  this.CRC_writeheader = function(gfc, header) {
    var crc = 65535;
    crc = CRC_update(header[2] & 255, crc);
    crc = CRC_update(header[3] & 255, crc);
    for (var i = 6; i < gfc.sideinfo_len; i++) {
      crc = CRC_update(header[i] & 255, crc);
    }
    header[4] = byte(crc >> 8);
    header[5] = byte(crc & 255);
  };
  function encodeSideInfo2(gfp, bitsPerFrame) {
    var gfc = gfp.internal_flags;
    var l3_side;
    var gr, ch;
    l3_side = gfc.l3_side;
    gfc.header[gfc.h_ptr].ptr = 0;
    Arrays$2.fill(gfc.header[gfc.h_ptr].buf, 0, gfc.sideinfo_len, 0);
    if (gfp.out_samplerate < 16e3)
      writeheader(gfc, 4094, 12);
    else
      writeheader(gfc, 4095, 12);
    writeheader(gfc, gfp.version, 1);
    writeheader(gfc, 4 - 3, 2);
    writeheader(gfc, !gfp.error_protection ? 1 : 0, 1);
    writeheader(gfc, gfc.bitrate_index, 4);
    writeheader(gfc, gfc.samplerate_index, 2);
    writeheader(gfc, gfc.padding, 1);
    writeheader(gfc, gfp.extension, 1);
    writeheader(gfc, gfp.mode.ordinal(), 2);
    writeheader(gfc, gfc.mode_ext, 2);
    writeheader(gfc, gfp.copyright, 1);
    writeheader(gfc, gfp.original, 1);
    writeheader(gfc, gfp.emphasis, 2);
    if (gfp.error_protection) {
      writeheader(gfc, 0, 16);
    }
    if (gfp.version == 1) {
      assert$5(l3_side.main_data_begin >= 0);
      writeheader(gfc, l3_side.main_data_begin, 9);
      if (gfc.channels_out == 2)
        writeheader(gfc, l3_side.private_bits, 3);
      else
        writeheader(gfc, l3_side.private_bits, 5);
      for (ch = 0; ch < gfc.channels_out; ch++) {
        var band;
        for (band = 0; band < 4; band++) {
          writeheader(gfc, l3_side.scfsi[ch][band], 1);
        }
      }
      for (gr = 0; gr < 2; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          var gi = l3_side.tt[gr][ch];
          writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
          writeheader(gfc, gi.big_values / 2, 9);
          writeheader(gfc, gi.global_gain, 8);
          writeheader(gfc, gi.scalefac_compress, 4);
          if (gi.block_type != Encoder.NORM_TYPE) {
            writeheader(gfc, 1, 1);
            writeheader(gfc, gi.block_type, 2);
            writeheader(gfc, gi.mixed_block_flag, 1);
            if (gi.table_select[0] == 14)
              gi.table_select[0] = 16;
            writeheader(gfc, gi.table_select[0], 5);
            if (gi.table_select[1] == 14)
              gi.table_select[1] = 16;
            writeheader(gfc, gi.table_select[1], 5);
            writeheader(gfc, gi.subblock_gain[0], 3);
            writeheader(gfc, gi.subblock_gain[1], 3);
            writeheader(gfc, gi.subblock_gain[2], 3);
          } else {
            writeheader(gfc, 0, 1);
            if (gi.table_select[0] == 14)
              gi.table_select[0] = 16;
            writeheader(gfc, gi.table_select[0], 5);
            if (gi.table_select[1] == 14)
              gi.table_select[1] = 16;
            writeheader(gfc, gi.table_select[1], 5);
            if (gi.table_select[2] == 14)
              gi.table_select[2] = 16;
            writeheader(gfc, gi.table_select[2], 5);
            assert$5(gi.region0_count >= 0 && gi.region0_count < 16);
            assert$5(gi.region1_count >= 0 && gi.region1_count < 8);
            writeheader(gfc, gi.region0_count, 4);
            writeheader(gfc, gi.region1_count, 3);
          }
          writeheader(gfc, gi.preflag, 1);
          writeheader(gfc, gi.scalefac_scale, 1);
          writeheader(gfc, gi.count1table_select, 1);
        }
      }
    } else {
      assert$5(l3_side.main_data_begin >= 0);
      writeheader(gfc, l3_side.main_data_begin, 8);
      writeheader(gfc, l3_side.private_bits, gfc.channels_out);
      gr = 0;
      for (ch = 0; ch < gfc.channels_out; ch++) {
        var gi = l3_side.tt[gr][ch];
        writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
        writeheader(gfc, gi.big_values / 2, 9);
        writeheader(gfc, gi.global_gain, 8);
        writeheader(gfc, gi.scalefac_compress, 9);
        if (gi.block_type != Encoder.NORM_TYPE) {
          writeheader(gfc, 1, 1);
          writeheader(gfc, gi.block_type, 2);
          writeheader(gfc, gi.mixed_block_flag, 1);
          if (gi.table_select[0] == 14)
            gi.table_select[0] = 16;
          writeheader(gfc, gi.table_select[0], 5);
          if (gi.table_select[1] == 14)
            gi.table_select[1] = 16;
          writeheader(gfc, gi.table_select[1], 5);
          writeheader(gfc, gi.subblock_gain[0], 3);
          writeheader(gfc, gi.subblock_gain[1], 3);
          writeheader(gfc, gi.subblock_gain[2], 3);
        } else {
          writeheader(gfc, 0, 1);
          if (gi.table_select[0] == 14)
            gi.table_select[0] = 16;
          writeheader(gfc, gi.table_select[0], 5);
          if (gi.table_select[1] == 14)
            gi.table_select[1] = 16;
          writeheader(gfc, gi.table_select[1], 5);
          if (gi.table_select[2] == 14)
            gi.table_select[2] = 16;
          writeheader(gfc, gi.table_select[2], 5);
          assert$5(gi.region0_count >= 0 && gi.region0_count < 16);
          assert$5(gi.region1_count >= 0 && gi.region1_count < 8);
          writeheader(gfc, gi.region0_count, 4);
          writeheader(gfc, gi.region1_count, 3);
        }
        writeheader(gfc, gi.scalefac_scale, 1);
        writeheader(gfc, gi.count1table_select, 1);
      }
    }
    if (gfp.error_protection) {
      CRC_writeheader(gfc, gfc.header[gfc.h_ptr].buf);
    }
    {
      var old = gfc.h_ptr;
      assert$5(gfc.header[old].ptr == gfc.sideinfo_len * 8);
      gfc.h_ptr = old + 1 & LameInternalFlags$1.MAX_HEADER_BUF - 1;
      gfc.header[gfc.h_ptr].write_timing = gfc.header[old].write_timing + bitsPerFrame;
      if (gfc.h_ptr == gfc.w_ptr) {
        System$3.err.println("Error: MAX_HEADER_BUF too small in bitstream.c \n");
      }
    }
  }
  function huffman_coder_count1(gfc, gi) {
    var h2 = Tables$1.ht[gi.count1table_select + 32];
    var i;
    var bits = 0;
    var ix = gi.big_values;
    var xr = gi.big_values;
    assert$5(gi.count1table_select < 2);
    for (i = (gi.count1 - gi.big_values) / 4; i > 0; --i) {
      var huffbits = 0;
      var p2 = 0;
      var v;
      v = gi.l3_enc[ix + 0];
      if (v != 0) {
        p2 += 8;
        if (gi.xr[xr + 0] < 0)
          huffbits++;
      }
      v = gi.l3_enc[ix + 1];
      if (v != 0) {
        p2 += 4;
        huffbits *= 2;
        if (gi.xr[xr + 1] < 0)
          huffbits++;
      }
      v = gi.l3_enc[ix + 2];
      if (v != 0) {
        p2 += 2;
        huffbits *= 2;
        if (gi.xr[xr + 2] < 0)
          huffbits++;
      }
      v = gi.l3_enc[ix + 3];
      if (v != 0) {
        p2++;
        huffbits *= 2;
        if (gi.xr[xr + 3] < 0)
          huffbits++;
      }
      ix += 4;
      xr += 4;
      putbits2(gfc, huffbits + h2.table[p2], h2.hlen[p2]);
      bits += h2.hlen[p2];
    }
    return bits;
  }
  function Huffmancode(gfc, tableindex, start2, end, gi) {
    var h2 = Tables$1.ht[tableindex];
    var bits = 0;
    if (tableindex == 0)
      return bits;
    for (var i = start2; i < end; i += 2) {
      var cbits = 0;
      var xbits = 0;
      var linbits = h2.xlen;
      var xlen = h2.xlen;
      var ext = 0;
      var x1 = gi.l3_enc[i];
      var x2 = gi.l3_enc[i + 1];
      if (x1 != 0) {
        if (gi.xr[i] < 0)
          ext++;
        cbits--;
      }
      if (tableindex > 15) {
        if (x1 > 14) {
          var linbits_x1 = x1 - 15;
          assert$5(linbits_x1 <= h2.linmax);
          ext |= linbits_x1 << 1;
          xbits = linbits;
          x1 = 15;
        }
        if (x2 > 14) {
          var linbits_x2 = x2 - 15;
          assert$5(linbits_x2 <= h2.linmax);
          ext <<= linbits;
          ext |= linbits_x2;
          xbits += linbits;
          x2 = 15;
        }
        xlen = 16;
      }
      if (x2 != 0) {
        ext <<= 1;
        if (gi.xr[i + 1] < 0)
          ext++;
        cbits--;
      }
      x1 = x1 * xlen + x2;
      xbits -= cbits;
      cbits += h2.hlen[x1];
      putbits2(gfc, h2.table[x1], cbits);
      putbits2(gfc, ext, xbits);
      bits += cbits + xbits;
    }
    return bits;
  }
  function ShortHuffmancodebits(gfc, gi) {
    var region1Start = 3 * gfc.scalefac_band.s[3];
    if (region1Start > gi.big_values)
      region1Start = gi.big_values;
    var bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
    bits += Huffmancode(
      gfc,
      gi.table_select[1],
      region1Start,
      gi.big_values,
      gi
    );
    return bits;
  }
  function LongHuffmancodebits(gfc, gi) {
    var bigvalues, bits;
    var region1Start, region2Start;
    bigvalues = gi.big_values;
    var i = gi.region0_count + 1;
    assert$5(i < gfc.scalefac_band.l.length);
    region1Start = gfc.scalefac_band.l[i];
    i += gi.region1_count + 1;
    assert$5(i < gfc.scalefac_band.l.length);
    region2Start = gfc.scalefac_band.l[i];
    if (region1Start > bigvalues)
      region1Start = bigvalues;
    if (region2Start > bigvalues)
      region2Start = bigvalues;
    bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
    bits += Huffmancode(gfc, gi.table_select[1], region1Start, region2Start, gi);
    bits += Huffmancode(gfc, gi.table_select[2], region2Start, bigvalues, gi);
    return bits;
  }
  function writeMainData(gfp) {
    var gr;
    var ch;
    var sfb;
    var data_bits;
    var tot_bits = 0;
    var gfc = gfp.internal_flags;
    var l3_side = gfc.l3_side;
    if (gfp.version == 1) {
      for (gr = 0; gr < 2; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          var gi = l3_side.tt[gr][ch];
          var slen1 = Takehiro.slen1_tab[gi.scalefac_compress];
          var slen2 = Takehiro.slen2_tab[gi.scalefac_compress];
          data_bits = 0;
          for (sfb = 0; sfb < gi.sfbdivide; sfb++) {
            if (gi.scalefac[sfb] == -1)
              continue;
            putbits2(gfc, gi.scalefac[sfb], slen1);
            data_bits += slen1;
          }
          for (; sfb < gi.sfbmax; sfb++) {
            if (gi.scalefac[sfb] == -1)
              continue;
            putbits2(gfc, gi.scalefac[sfb], slen2);
            data_bits += slen2;
          }
          assert$5(data_bits == gi.part2_length);
          if (gi.block_type == Encoder.SHORT_TYPE) {
            data_bits += ShortHuffmancodebits(gfc, gi);
          } else {
            data_bits += LongHuffmancodebits(gfc, gi);
          }
          data_bits += huffman_coder_count1(gfc, gi);
          assert$5(data_bits == gi.part2_3_length + gi.part2_length);
          tot_bits += data_bits;
        }
      }
    } else {
      gr = 0;
      for (ch = 0; ch < gfc.channels_out; ch++) {
        var gi = l3_side.tt[gr][ch];
        var i;
        var sfb_partition;
        var scale_bits = 0;
        assert$5(gi.sfb_partition_table != null);
        data_bits = 0;
        sfb = 0;
        sfb_partition = 0;
        if (gi.block_type == Encoder.SHORT_TYPE) {
          for (; sfb_partition < 4; sfb_partition++) {
            var sfbs = gi.sfb_partition_table[sfb_partition] / 3;
            var slen = gi.slen[sfb_partition];
            for (i = 0; i < sfbs; i++, sfb++) {
              putbits2(gfc, Math.max(gi.scalefac[sfb * 3 + 0], 0), slen);
              putbits2(gfc, Math.max(gi.scalefac[sfb * 3 + 1], 0), slen);
              putbits2(gfc, Math.max(gi.scalefac[sfb * 3 + 2], 0), slen);
              scale_bits += 3 * slen;
            }
          }
          data_bits += ShortHuffmancodebits(gfc, gi);
        } else {
          for (; sfb_partition < 4; sfb_partition++) {
            var sfbs = gi.sfb_partition_table[sfb_partition];
            var slen = gi.slen[sfb_partition];
            for (i = 0; i < sfbs; i++, sfb++) {
              putbits2(gfc, Math.max(gi.scalefac[sfb], 0), slen);
              scale_bits += slen;
            }
          }
          data_bits += LongHuffmancodebits(gfc, gi);
        }
        data_bits += huffman_coder_count1(gfc, gi);
        assert$5(data_bits == gi.part2_3_length);
        assert$5(scale_bits == gi.part2_length);
        tot_bits += scale_bits + data_bits;
      }
    }
    return tot_bits;
  }
  function TotalBytes() {
    this.total = 0;
  }
  function compute_flushbits(gfp, total_bytes_output) {
    var gfc = gfp.internal_flags;
    var flushbits, remaining_headers;
    var bitsPerFrame;
    var last_ptr, first_ptr;
    first_ptr = gfc.w_ptr;
    last_ptr = gfc.h_ptr - 1;
    if (last_ptr == -1)
      last_ptr = LameInternalFlags$1.MAX_HEADER_BUF - 1;
    flushbits = gfc.header[last_ptr].write_timing - totbit;
    total_bytes_output.total = flushbits;
    if (flushbits >= 0) {
      remaining_headers = 1 + last_ptr - first_ptr;
      if (last_ptr < first_ptr) {
        remaining_headers = 1 + last_ptr - first_ptr + LameInternalFlags$1.MAX_HEADER_BUF;
      }
      flushbits -= remaining_headers * 8 * gfc.sideinfo_len;
    }
    bitsPerFrame = self2.getframebits(gfp);
    flushbits += bitsPerFrame;
    total_bytes_output.total += bitsPerFrame;
    if (total_bytes_output.total % 8 != 0) {
      total_bytes_output.total = 1 + total_bytes_output.total / 8;
    } else
      total_bytes_output.total = total_bytes_output.total / 8;
    total_bytes_output.total += bufByteIdx + 1;
    if (flushbits < 0) {
      System$3.err.println("strange error flushing buffer ... \n");
    }
    return flushbits;
  }
  this.flush_bitstream = function(gfp) {
    var gfc = gfp.internal_flags;
    var l3_side;
    var flushbits;
    var last_ptr = gfc.h_ptr - 1;
    if (last_ptr == -1)
      last_ptr = LameInternalFlags$1.MAX_HEADER_BUF - 1;
    l3_side = gfc.l3_side;
    if ((flushbits = compute_flushbits(gfp, new TotalBytes())) < 0)
      return;
    drain_into_ancillary(gfp, flushbits);
    assert$5(gfc.header[last_ptr].write_timing + this.getframebits(gfp) == totbit);
    gfc.ResvSize = 0;
    l3_side.main_data_begin = 0;
    if (gfc.findReplayGain) {
      var RadioGain = ga.GetTitleGain(gfc.rgdata);
      assert$5(NEQ(RadioGain, GainAnalysis.GAIN_NOT_ENOUGH_SAMPLES));
      gfc.RadioGain = Math.floor(RadioGain * 10 + 0.5) | 0;
    }
    if (gfc.findPeakSample) {
      gfc.noclipGainChange = Math.ceil(Math.log10(gfc.PeakSample / 32767) * 20 * 10) | 0;
      if (gfc.noclipGainChange > 0) {
        if (EQ(gfp.scale, 1) || EQ(gfp.scale, 0)) {
          gfc.noclipScale = Math.floor(32767 / gfc.PeakSample * 100) / 100;
        } else {
          gfc.noclipScale = -1;
        }
      } else {
        gfc.noclipScale = -1;
      }
    }
  };
  this.add_dummy_byte = function(gfp, val, n) {
    var gfc = gfp.internal_flags;
    var i;
    while (n-- > 0) {
      putbits_noheaders(gfc, val, 8);
      for (i = 0; i < LameInternalFlags$1.MAX_HEADER_BUF; ++i) {
        gfc.header[i].write_timing += 8;
      }
    }
  };
  this.format_bitstream = function(gfp) {
    var gfc = gfp.internal_flags;
    var l3_side;
    l3_side = gfc.l3_side;
    var bitsPerFrame = this.getframebits(gfp);
    drain_into_ancillary(gfp, l3_side.resvDrain_pre);
    encodeSideInfo2(gfp, bitsPerFrame);
    var bits = 8 * gfc.sideinfo_len;
    bits += writeMainData(gfp);
    drain_into_ancillary(gfp, l3_side.resvDrain_post);
    bits += l3_side.resvDrain_post;
    l3_side.main_data_begin += (bitsPerFrame - bits) / 8;
    if (compute_flushbits(gfp, new TotalBytes()) != gfc.ResvSize) {
      System$3.err.println("Internal buffer inconsistency. flushbits <> ResvSize");
    }
    if (l3_side.main_data_begin * 8 != gfc.ResvSize) {
      System$3.err.printf(
        "bit reservoir error: \nl3_side.main_data_begin: %d \nResvoir size:             %d \nresv drain (post)         %d \nresv drain (pre)          %d \nheader and sideinfo:      %d \ndata bits:                %d \ntotal bits:               %d (remainder: %d) \nbitsperframe:             %d \n",
        8 * l3_side.main_data_begin,
        gfc.ResvSize,
        l3_side.resvDrain_post,
        l3_side.resvDrain_pre,
        8 * gfc.sideinfo_len,
        bits - l3_side.resvDrain_post - 8 * gfc.sideinfo_len,
        bits,
        bits % 8,
        bitsPerFrame
      );
      System$3.err.println(
        "This is a fatal error.  It has several possible causes:"
      );
      System$3.err.println(
        "90%%  LAME compiled with buggy version of gcc using advanced optimizations"
      );
      System$3.err.println(" 9%%  Your system is overclocked");
      System$3.err.println(" 1%%  bug in LAME encoding library");
      gfc.ResvSize = l3_side.main_data_begin * 8;
    }
    if (totbit > 1e9) {
      var i;
      for (i = 0; i < LameInternalFlags$1.MAX_HEADER_BUF; ++i) {
        gfc.header[i].write_timing -= totbit;
      }
      totbit = 0;
    }
    return 0;
  };
  this.copy_buffer = function(gfc, buffer, bufferPos, size2, mp3data) {
    var minimum = bufByteIdx + 1;
    if (minimum <= 0)
      return 0;
    if (size2 != 0 && minimum > size2) {
      return -1;
    }
    System$3.arraycopy(buf, 0, buffer, bufferPos, minimum);
    bufByteIdx = -1;
    bufBitIdx = 0;
    if (mp3data != 0) {
      var crc = new_int$1(1);
      crc[0] = gfc.nMusicCRC;
      vbr.updateMusicCRC(crc, buffer, bufferPos, minimum);
      gfc.nMusicCRC = crc[0];
      if (minimum > 0) {
        gfc.VBR_seek_table.nBytesWritten += minimum;
      }
      if (gfc.decode_on_the_fly) {
        var pcm_buf = new_float_n([2, 1152]);
        var mp3_in = minimum;
        var samples_out = -1;
        var i;
        while (samples_out != 0) {
          samples_out = mpg.hip_decode1_unclipped(
            gfc.hip,
            buffer,
            bufferPos,
            mp3_in,
            pcm_buf[0],
            pcm_buf[1]
          );
          mp3_in = 0;
          if (samples_out == -1) {
            samples_out = 0;
          }
          if (samples_out > 0) {
            if (gfc.findPeakSample) {
              for (i = 0; i < samples_out; i++) {
                if (pcm_buf[0][i] > gfc.PeakSample) {
                  gfc.PeakSample = pcm_buf[0][i];
                } else if (-pcm_buf[0][i] > gfc.PeakSample) {
                  gfc.PeakSample = -pcm_buf[0][i];
                }
              }
              if (gfc.channels_out > 1) {
                for (i = 0; i < samples_out; i++) {
                  if (pcm_buf[1][i] > gfc.PeakSample) {
                    gfc.PeakSample = pcm_buf[1][i];
                  } else if (-pcm_buf[1][i] > gfc.PeakSample) {
                    gfc.PeakSample = -pcm_buf[1][i];
                  }
                }
              }
            }
            if (gfc.findReplayGain) {
              if (ga.AnalyzeSamples(
                gfc.rgdata,
                pcm_buf[0],
                0,
                pcm_buf[1],
                0,
                samples_out,
                gfc.channels_out
              ) == GainAnalysis.GAIN_ANALYSIS_ERROR) {
                return -6;
              }
            }
          }
        }
      }
    }
    return minimum;
  };
  this.init_bit_stream_w = function(gfc) {
    buf = new_byte$2(Lame$1.LAME_MAXMP3BUFFER);
    gfc.h_ptr = gfc.w_ptr = 0;
    gfc.header[gfc.h_ptr].write_timing = 0;
    bufByteIdx = -1;
    bufBitIdx = 0;
    totbit = 0;
  };
}
var System$2 = common.System;
var VbrMode$3 = common.VbrMode;
var ShortBlock$1 = common.ShortBlock;
var new_float$2 = common.new_float;
var new_int_n = common.new_int_n;
var new_short_n = common.new_short_n;
var assert$4 = common.assert;
function Lame$1() {
  var self2 = this;
  var LAME_MAXALBUMART = 128 * 1024;
  Lame$1.V9 = 410;
  Lame$1.V8 = 420;
  Lame$1.V7 = 430;
  Lame$1.V6 = 440;
  Lame$1.V5 = 450;
  Lame$1.V4 = 460;
  Lame$1.V3 = 470;
  Lame$1.V2 = 480;
  Lame$1.V1 = 490;
  Lame$1.V0 = 500;
  Lame$1.R3MIX = 1e3;
  Lame$1.STANDARD = 1001;
  Lame$1.EXTREME = 1002;
  Lame$1.INSANE = 1003;
  Lame$1.STANDARD_FAST = 1004;
  Lame$1.EXTREME_FAST = 1005;
  Lame$1.MEDIUM = 1006;
  Lame$1.MEDIUM_FAST = 1007;
  var LAME_MAXMP3BUFFER = 16384 + LAME_MAXALBUMART;
  Lame$1.LAME_MAXMP3BUFFER = LAME_MAXMP3BUFFER;
  var ga;
  var bs;
  var p2;
  var qupvt;
  var qu;
  var psy = new PsyModel();
  var vbr;
  var id3;
  var mpglib;
  this.enc = new Encoder();
  this.setModules = function(_ga, _bs, _p, _qupvt, _qu, _vbr, _ver, _id3, _mpglib) {
    ga = _ga;
    bs = _bs;
    p2 = _p;
    qupvt = _qupvt;
    qu = _qu;
    vbr = _vbr;
    id3 = _id3;
    mpglib = _mpglib;
    this.enc.setModules(bs, psy, qupvt, vbr);
  };
  function PSY() {
    this.mask_adjust = 0;
    this.mask_adjust_short = 0;
    this.bo_l_weight = new_float$2(Encoder.SBMAX_l);
    this.bo_s_weight = new_float$2(Encoder.SBMAX_s);
  }
  function LowPassHighPass() {
    this.lowerlimit = 0;
  }
  function BandPass(bitrate, lPass) {
    this.lowpass = lPass;
  }
  var LAME_ID = 4294479419;
  function lame_init_old(gfp) {
    var gfc;
    gfp.class_id = LAME_ID;
    gfc = gfp.internal_flags = new LameInternalFlags$1();
    gfp.mode = MPEGMode.NOT_SET;
    gfp.original = 1;
    gfp.in_samplerate = 44100;
    gfp.num_channels = 2;
    gfp.num_samples = -1;
    gfp.bWriteVbrTag = true;
    gfp.quality = -1;
    gfp.short_blocks = null;
    gfc.subblock_gain = -1;
    gfp.lowpassfreq = 0;
    gfp.highpassfreq = 0;
    gfp.lowpasswidth = -1;
    gfp.highpasswidth = -1;
    gfp.VBR = VbrMode$3.vbr_off;
    gfp.VBR_q = 4;
    gfp.ATHcurve = -1;
    gfp.VBR_mean_bitrate_kbps = 128;
    gfp.VBR_min_bitrate_kbps = 0;
    gfp.VBR_max_bitrate_kbps = 0;
    gfp.VBR_hard_min = 0;
    gfc.VBR_min_bitrate = 1;
    gfc.VBR_max_bitrate = 13;
    gfp.quant_comp = -1;
    gfp.quant_comp_short = -1;
    gfp.msfix = -1;
    gfc.resample_ratio = 1;
    gfc.OldValue[0] = 180;
    gfc.OldValue[1] = 180;
    gfc.CurrentStep[0] = 4;
    gfc.CurrentStep[1] = 4;
    gfc.masking_lower = 1;
    gfc.nsPsy.attackthre = -1;
    gfc.nsPsy.attackthre_s = -1;
    gfp.scale = -1;
    gfp.athaa_type = -1;
    gfp.ATHtype = -1;
    gfp.athaa_loudapprox = -1;
    gfp.athaa_sensitivity = 0;
    gfp.useTemporal = null;
    gfp.interChRatio = -1;
    gfc.mf_samples_to_encode = Encoder.ENCDELAY + Encoder.POSTDELAY;
    gfp.encoder_padding = 0;
    gfc.mf_size = Encoder.ENCDELAY - Encoder.MDCTDELAY;
    gfp.findReplayGain = false;
    gfp.decode_on_the_fly = false;
    gfc.decode_on_the_fly = false;
    gfc.findReplayGain = false;
    gfc.findPeakSample = false;
    gfc.RadioGain = 0;
    gfc.AudiophileGain = 0;
    gfc.noclipGainChange = 0;
    gfc.noclipScale = -1;
    gfp.preset = 0;
    gfp.write_id3tag_automatic = true;
    return 0;
  }
  this.lame_init = function() {
    var gfp = new LameGlobalFlags();
    lame_init_old(gfp);
    gfp.lame_allocated_gfp = 1;
    return gfp;
  };
  function filter_coef(x) {
    if (x > 1)
      return 0;
    if (x <= 0)
      return 1;
    return Math.cos(Math.PI / 2 * x);
  }
  this.nearestBitrateFullIndex = function(bitrate) {
    var full_bitrate_table = [
      8,
      16,
      24,
      32,
      40,
      48,
      56,
      64,
      80,
      96,
      112,
      128,
      160,
      192,
      224,
      256,
      320
    ];
    var lower_range = 0;
    var lower_range_kbps = 0;
    var upper_range = 0;
    var upper_range_kbps = 0;
    upper_range_kbps = full_bitrate_table[16];
    upper_range = 16;
    lower_range_kbps = full_bitrate_table[16];
    lower_range = 16;
    for (var b = 0; b < 16; b++) {
      if (Math.max(bitrate, full_bitrate_table[b + 1]) != bitrate) {
        upper_range_kbps = full_bitrate_table[b + 1];
        upper_range = b + 1;
        lower_range_kbps = full_bitrate_table[b];
        lower_range = b;
        break;
      }
    }
    if (upper_range_kbps - bitrate > bitrate - lower_range_kbps) {
      return lower_range;
    }
    return upper_range;
  };
  function optimum_samplefreq(lowpassfreq, input_samplefreq) {
    var suggested_samplefreq = 44100;
    if (input_samplefreq >= 48e3)
      suggested_samplefreq = 48e3;
    else if (input_samplefreq >= 44100)
      suggested_samplefreq = 44100;
    else if (input_samplefreq >= 32e3)
      suggested_samplefreq = 32e3;
    else if (input_samplefreq >= 24e3)
      suggested_samplefreq = 24e3;
    else if (input_samplefreq >= 22050)
      suggested_samplefreq = 22050;
    else if (input_samplefreq >= 16e3)
      suggested_samplefreq = 16e3;
    else if (input_samplefreq >= 12e3)
      suggested_samplefreq = 12e3;
    else if (input_samplefreq >= 11025)
      suggested_samplefreq = 11025;
    else if (input_samplefreq >= 8e3)
      suggested_samplefreq = 8e3;
    if (lowpassfreq == -1)
      return suggested_samplefreq;
    if (lowpassfreq <= 15960)
      suggested_samplefreq = 44100;
    if (lowpassfreq <= 15250)
      suggested_samplefreq = 32e3;
    if (lowpassfreq <= 11220)
      suggested_samplefreq = 24e3;
    if (lowpassfreq <= 9970)
      suggested_samplefreq = 22050;
    if (lowpassfreq <= 7230)
      suggested_samplefreq = 16e3;
    if (lowpassfreq <= 5420)
      suggested_samplefreq = 12e3;
    if (lowpassfreq <= 4510)
      suggested_samplefreq = 11025;
    if (lowpassfreq <= 3970)
      suggested_samplefreq = 8e3;
    if (input_samplefreq < suggested_samplefreq) {
      if (input_samplefreq > 44100) {
        return 48e3;
      }
      if (input_samplefreq > 32e3) {
        return 44100;
      }
      if (input_samplefreq > 24e3) {
        return 32e3;
      }
      if (input_samplefreq > 22050) {
        return 24e3;
      }
      if (input_samplefreq > 16e3) {
        return 22050;
      }
      if (input_samplefreq > 12e3) {
        return 16e3;
      }
      if (input_samplefreq > 11025) {
        return 12e3;
      }
      if (input_samplefreq > 8e3) {
        return 11025;
      }
      return 8e3;
    }
    return suggested_samplefreq;
  }
  function SmpFrqIndex(sample_freq, gpf) {
    switch (sample_freq) {
      case 44100:
        gpf.version = 1;
        return 0;
      case 48e3:
        gpf.version = 1;
        return 1;
      case 32e3:
        gpf.version = 1;
        return 2;
      case 22050:
        gpf.version = 0;
        return 0;
      case 24e3:
        gpf.version = 0;
        return 1;
      case 16e3:
        gpf.version = 0;
        return 2;
      case 11025:
        gpf.version = 0;
        return 0;
      case 12e3:
        gpf.version = 0;
        return 1;
      case 8e3:
        gpf.version = 0;
        return 2;
      default:
        gpf.version = 0;
        return -1;
    }
  }
  function FindNearestBitrate(bRate, version2, samplerate) {
    if (samplerate < 16e3)
      version2 = 2;
    var bitrate = Tables$1.bitrate_table[version2][1];
    for (var i = 2; i <= 14; i++) {
      if (Tables$1.bitrate_table[version2][i] > 0) {
        if (Math.abs(Tables$1.bitrate_table[version2][i] - bRate) < Math.abs(bitrate - bRate)) {
          bitrate = Tables$1.bitrate_table[version2][i];
        }
      }
    }
    return bitrate;
  }
  function BitrateIndex(bRate, version2, samplerate) {
    if (samplerate < 16e3)
      version2 = 2;
    for (var i = 0; i <= 14; i++) {
      if (Tables$1.bitrate_table[version2][i] > 0) {
        if (Tables$1.bitrate_table[version2][i] == bRate) {
          return i;
        }
      }
    }
    return -1;
  }
  function optimum_bandwidth(lh, bitrate) {
    var freq_map = [
      new BandPass(8, 2e3),
      new BandPass(16, 3700),
      new BandPass(24, 3900),
      new BandPass(32, 5500),
      new BandPass(40, 7e3),
      new BandPass(48, 7500),
      new BandPass(56, 1e4),
      new BandPass(64, 11e3),
      new BandPass(80, 13500),
      new BandPass(96, 15100),
      new BandPass(112, 15600),
      new BandPass(128, 17e3),
      new BandPass(160, 17500),
      new BandPass(192, 18600),
      new BandPass(224, 19400),
      new BandPass(256, 19700),
      new BandPass(320, 20500)
    ];
    var table_index = self2.nearestBitrateFullIndex(bitrate);
    lh.lowerlimit = freq_map[table_index].lowpass;
  }
  function lame_init_params_ppflt(gfp) {
    var gfc = gfp.internal_flags;
    var lowpass_band = 32;
    var highpass_band = -1;
    if (gfc.lowpass1 > 0) {
      var minband = 999;
      for (var band = 0; band <= 31; band++) {
        var freq = band / 31;
        if (freq >= gfc.lowpass2) {
          lowpass_band = Math.min(lowpass_band, band);
        }
        if (gfc.lowpass1 < freq && freq < gfc.lowpass2) {
          minband = Math.min(minband, band);
        }
      }
      if (minband == 999) {
        gfc.lowpass1 = (lowpass_band - 0.75) / 31;
      } else {
        gfc.lowpass1 = (minband - 0.75) / 31;
      }
      gfc.lowpass2 = lowpass_band / 31;
    }
    if (gfc.highpass2 > 0) {
      if (gfc.highpass2 < 0.9 * (0.75 / 31)) {
        gfc.highpass1 = 0;
        gfc.highpass2 = 0;
        System$2.err.println(
          "Warning: highpass filter disabled.  highpass frequency too small\n"
        );
      }
    }
    if (gfc.highpass2 > 0) {
      var maxband = -1;
      for (var band = 0; band <= 31; band++) {
        var freq = band / 31;
        if (freq <= gfc.highpass1) {
          highpass_band = Math.max(highpass_band, band);
        }
        if (gfc.highpass1 < freq && freq < gfc.highpass2) {
          maxband = Math.max(maxband, band);
        }
      }
      gfc.highpass1 = highpass_band / 31;
      if (maxband == -1) {
        gfc.highpass2 = (highpass_band + 0.75) / 31;
      } else {
        gfc.highpass2 = (maxband + 0.75) / 31;
      }
    }
    for (var band = 0; band < 32; band++) {
      var fc1, fc2;
      var freq = band / 31;
      if (gfc.highpass2 > gfc.highpass1) {
        fc1 = filter_coef(
          (gfc.highpass2 - freq) / (gfc.highpass2 - gfc.highpass1 + 1e-20)
        );
      } else {
        fc1 = 1;
      }
      if (gfc.lowpass2 > gfc.lowpass1) {
        fc2 = filter_coef(
          (freq - gfc.lowpass1) / (gfc.lowpass2 - gfc.lowpass1 + 1e-20)
        );
      } else {
        fc2 = 1;
      }
      gfc.amp_filter[band] = fc1 * fc2;
    }
  }
  function lame_init_qval(gfp) {
    var gfc = gfp.internal_flags;
    switch (gfp.quality) {
      default:
      case 9:
        gfc.psymodel = 0;
        gfc.noise_shaping = 0;
        gfc.noise_shaping_amp = 0;
        gfc.noise_shaping_stop = 0;
        gfc.use_best_huffman = 0;
        gfc.full_outer_loop = 0;
        break;
      case 8:
        gfp.quality = 7;
      case 7:
        gfc.psymodel = 1;
        gfc.noise_shaping = 0;
        gfc.noise_shaping_amp = 0;
        gfc.noise_shaping_stop = 0;
        gfc.use_best_huffman = 0;
        gfc.full_outer_loop = 0;
        break;
      case 6:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        gfc.noise_shaping_amp = 0;
        gfc.noise_shaping_stop = 0;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 0;
        gfc.full_outer_loop = 0;
        break;
      case 5:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        gfc.noise_shaping_amp = 0;
        gfc.noise_shaping_stop = 0;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 0;
        gfc.full_outer_loop = 0;
        break;
      case 4:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        gfc.noise_shaping_amp = 0;
        gfc.noise_shaping_stop = 0;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 1;
        gfc.full_outer_loop = 0;
        break;
      case 3:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        gfc.noise_shaping_amp = 1;
        gfc.noise_shaping_stop = 1;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 1;
        gfc.full_outer_loop = 0;
        break;
      case 2:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        if (gfc.substep_shaping == 0)
          gfc.substep_shaping = 2;
        gfc.noise_shaping_amp = 1;
        gfc.noise_shaping_stop = 1;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 1;
        gfc.full_outer_loop = 0;
        break;
      case 1:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        if (gfc.substep_shaping == 0)
          gfc.substep_shaping = 2;
        gfc.noise_shaping_amp = 2;
        gfc.noise_shaping_stop = 1;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 1;
        gfc.full_outer_loop = 0;
        break;
      case 0:
        gfc.psymodel = 1;
        if (gfc.noise_shaping == 0)
          gfc.noise_shaping = 1;
        if (gfc.substep_shaping == 0)
          gfc.substep_shaping = 2;
        gfc.noise_shaping_amp = 2;
        gfc.noise_shaping_stop = 1;
        if (gfc.subblock_gain == -1)
          gfc.subblock_gain = 1;
        gfc.use_best_huffman = 1;
        gfc.full_outer_loop = 0;
        break;
    }
  }
  function lame_init_bitstream(gfp) {
    var gfc = gfp.internal_flags;
    gfp.frameNum = 0;
    if (gfp.write_id3tag_automatic) {
      id3.id3tag_write_v2(gfp);
    }
    gfc.bitrate_stereoMode_Hist = new_int_n([16, 4 + 1]);
    gfc.bitrate_blockType_Hist = new_int_n([16, 4 + 1 + 1]);
    gfc.PeakSample = 0;
    if (gfp.bWriteVbrTag)
      vbr.InitVbrTag(gfp);
  }
  this.lame_init_params = function(gfp) {
    var gfc = gfp.internal_flags;
    gfc.Class_ID = 0;
    if (gfc.ATH == null)
      gfc.ATH = new ATH();
    if (gfc.PSY == null)
      gfc.PSY = new PSY();
    if (gfc.rgdata == null)
      gfc.rgdata = new ReplayGain();
    gfc.channels_in = gfp.num_channels;
    if (gfc.channels_in == 1)
      gfp.mode = MPEGMode.MONO;
    gfc.channels_out = gfp.mode == MPEGMode.MONO ? 1 : 2;
    gfc.mode_ext = Encoder.MPG_MD_MS_LR;
    if (gfp.mode == MPEGMode.MONO)
      gfp.force_ms = false;
    if (gfp.VBR == VbrMode$3.vbr_off && gfp.VBR_mean_bitrate_kbps != 128 && gfp.brate == 0) {
      gfp.brate = gfp.VBR_mean_bitrate_kbps;
    }
    if (gfp.VBR == VbrMode$3.vbr_off || gfp.VBR == VbrMode$3.vbr_mtrh || gfp.VBR == VbrMode$3.vbr_mt)
      ;
    else {
      gfp.free_format = false;
    }
    if (gfp.VBR == VbrMode$3.vbr_off && gfp.brate == 0) {
      if (BitStream$1.EQ(gfp.compression_ratio, 0))
        gfp.compression_ratio = 11.025;
    }
    if (gfp.VBR == VbrMode$3.vbr_off && gfp.compression_ratio > 0) {
      if (gfp.out_samplerate == 0) {
        gfp.out_samplerate = map2MP3Frequency(int(0.97 * gfp.in_samplerate));
      }
      gfp.brate = 0 | gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.compression_ratio);
      gfc.samplerate_index = SmpFrqIndex(gfp.out_samplerate, gfp);
      if (!gfp.free_format) {
        gfp.brate = FindNearestBitrate(
          gfp.brate,
          gfp.version,
          gfp.out_samplerate
        );
      }
    }
    if (gfp.out_samplerate != 0) {
      if (gfp.out_samplerate < 16e3) {
        gfp.VBR_mean_bitrate_kbps = Math.max(gfp.VBR_mean_bitrate_kbps, 8);
        gfp.VBR_mean_bitrate_kbps = Math.min(gfp.VBR_mean_bitrate_kbps, 64);
      } else if (gfp.out_samplerate < 32e3) {
        gfp.VBR_mean_bitrate_kbps = Math.max(gfp.VBR_mean_bitrate_kbps, 8);
        gfp.VBR_mean_bitrate_kbps = Math.min(gfp.VBR_mean_bitrate_kbps, 160);
      } else {
        gfp.VBR_mean_bitrate_kbps = Math.max(gfp.VBR_mean_bitrate_kbps, 32);
        gfp.VBR_mean_bitrate_kbps = Math.min(gfp.VBR_mean_bitrate_kbps, 320);
      }
    }
    if (gfp.lowpassfreq == 0) {
      var lowpass = 16e3;
      switch (gfp.VBR) {
        case VbrMode$3.vbr_off: {
          var lh = new LowPassHighPass();
          optimum_bandwidth(lh, gfp.brate);
          lowpass = lh.lowerlimit;
          break;
        }
        case VbrMode$3.vbr_abr: {
          var lh = new LowPassHighPass();
          optimum_bandwidth(lh, gfp.VBR_mean_bitrate_kbps);
          lowpass = lh.lowerlimit;
          break;
        }
        case VbrMode$3.vbr_rh: {
          var x = [
            19500,
            19e3,
            18600,
            18e3,
            17500,
            16e3,
            15600,
            14900,
            12500,
            1e4,
            3950
          ];
          if (gfp.VBR_q >= 0 && gfp.VBR_q <= 9) {
            var a = x[gfp.VBR_q];
            var b = x[gfp.VBR_q + 1];
            var m = gfp.VBR_q_frac;
            lowpass = linear_int(a, b, m);
          } else {
            lowpass = 19500;
          }
          break;
        }
        default: {
          var x = [
            19500,
            19e3,
            18500,
            18e3,
            17500,
            16500,
            15500,
            14500,
            12500,
            9500,
            3950
          ];
          if (gfp.VBR_q >= 0 && gfp.VBR_q <= 9) {
            var a = x[gfp.VBR_q];
            var b = x[gfp.VBR_q + 1];
            var m = gfp.VBR_q_frac;
            lowpass = linear_int(a, b, m);
          } else {
            lowpass = 19500;
          }
        }
      }
      if (gfp.mode == MPEGMode.MONO && (gfp.VBR == VbrMode$3.vbr_off || gfp.VBR == VbrMode$3.vbr_abr)) {
        lowpass *= 1.5;
      }
      gfp.lowpassfreq = lowpass | 0;
    }
    if (gfp.out_samplerate == 0) {
      if (2 * gfp.lowpassfreq > gfp.in_samplerate) {
        gfp.lowpassfreq = gfp.in_samplerate / 2;
      }
      gfp.out_samplerate = optimum_samplefreq(
        gfp.lowpassfreq | 0,
        gfp.in_samplerate
      );
    }
    gfp.lowpassfreq = Math.min(20500, gfp.lowpassfreq);
    gfp.lowpassfreq = Math.min(gfp.out_samplerate / 2, gfp.lowpassfreq);
    if (gfp.VBR == VbrMode$3.vbr_off) {
      gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
    }
    if (gfp.VBR == VbrMode$3.vbr_abr) {
      gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.VBR_mean_bitrate_kbps);
    }
    if (!gfp.bWriteVbrTag) {
      gfp.findReplayGain = false;
      gfp.decode_on_the_fly = false;
      gfc.findPeakSample = false;
    }
    gfc.findReplayGain = gfp.findReplayGain;
    gfc.decode_on_the_fly = gfp.decode_on_the_fly;
    if (gfc.decode_on_the_fly)
      gfc.findPeakSample = true;
    if (gfc.findReplayGain) {
      if (ga.InitGainAnalysis(gfc.rgdata, gfp.out_samplerate) == GainAnalysis.INIT_GAIN_ANALYSIS_ERROR) {
        gfp.internal_flags = null;
        return -6;
      }
    }
    if (gfc.decode_on_the_fly && !gfp.decode_only) {
      if (gfc.hip != null) {
        mpglib.hip_decode_exit(gfc.hip);
      }
      gfc.hip = mpglib.hip_decode_init();
    }
    gfc.mode_gr = gfp.out_samplerate <= 24e3 ? 1 : 2;
    gfp.framesize = 576 * gfc.mode_gr;
    gfp.encoder_delay = Encoder.ENCDELAY;
    gfc.resample_ratio = gfp.in_samplerate / gfp.out_samplerate;
    switch (gfp.VBR) {
      case VbrMode$3.vbr_mt:
      case VbrMode$3.vbr_rh:
      case VbrMode$3.vbr_mtrh:
        {
          var cmp = [5.7, 6.5, 7.3, 8.2, 10, 11.9, 13, 14, 15, 16.5];
          gfp.compression_ratio = cmp[gfp.VBR_q];
        }
        break;
      case VbrMode$3.vbr_abr:
        gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.VBR_mean_bitrate_kbps);
        break;
      default:
        gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
        break;
    }
    if (gfp.mode == MPEGMode.NOT_SET) {
      gfp.mode = MPEGMode.JOINT_STEREO;
    }
    if (gfp.highpassfreq > 0) {
      gfc.highpass1 = 2 * gfp.highpassfreq;
      if (gfp.highpasswidth >= 0) {
        gfc.highpass2 = 2 * (gfp.highpassfreq + gfp.highpasswidth);
      } else {
        gfc.highpass2 = (1 + 0) * 2 * gfp.highpassfreq;
      }
      gfc.highpass1 /= gfp.out_samplerate;
      gfc.highpass2 /= gfp.out_samplerate;
    } else {
      gfc.highpass1 = 0;
      gfc.highpass2 = 0;
    }
    if (gfp.lowpassfreq > 0) {
      gfc.lowpass2 = 2 * gfp.lowpassfreq;
      if (gfp.lowpasswidth >= 0) {
        gfc.lowpass1 = 2 * (gfp.lowpassfreq - gfp.lowpasswidth);
        if (gfc.lowpass1 < 0)
          gfc.lowpass1 = 0;
      } else {
        gfc.lowpass1 = (1 - 0) * 2 * gfp.lowpassfreq;
      }
      gfc.lowpass1 /= gfp.out_samplerate;
      gfc.lowpass2 /= gfp.out_samplerate;
    } else {
      gfc.lowpass1 = 0;
      gfc.lowpass2 = 0;
    }
    lame_init_params_ppflt(gfp);
    gfc.samplerate_index = SmpFrqIndex(gfp.out_samplerate, gfp);
    if (gfc.samplerate_index < 0) {
      gfp.internal_flags = null;
      return -1;
    }
    if (gfp.VBR == VbrMode$3.vbr_off) {
      if (gfp.free_format) {
        gfc.bitrate_index = 0;
      } else {
        gfp.brate = FindNearestBitrate(
          gfp.brate,
          gfp.version,
          gfp.out_samplerate
        );
        gfc.bitrate_index = BitrateIndex(
          gfp.brate,
          gfp.version,
          gfp.out_samplerate
        );
        if (gfc.bitrate_index <= 0) {
          gfp.internal_flags = null;
          return -1;
        }
      }
    } else {
      gfc.bitrate_index = 1;
    }
    if (gfp.analysis)
      gfp.bWriteVbrTag = false;
    if (gfc.pinfo != null)
      gfp.bWriteVbrTag = false;
    bs.init_bit_stream_w(gfc);
    var j = gfc.samplerate_index + 3 * gfp.version + 6 * (gfp.out_samplerate < 16e3 ? 1 : 0);
    for (var i = 0; i < Encoder.SBMAX_l + 1; i++) {
      gfc.scalefac_band.l[i] = qupvt.sfBandIndex[j].l[i];
    }
    for (var i = 0; i < Encoder.PSFB21 + 1; i++) {
      var size2 = (gfc.scalefac_band.l[22] - gfc.scalefac_band.l[21]) / Encoder.PSFB21;
      var start2 = gfc.scalefac_band.l[21] + i * size2;
      gfc.scalefac_band.psfb21[i] = start2;
    }
    gfc.scalefac_band.psfb21[Encoder.PSFB21] = 576;
    for (var i = 0; i < Encoder.SBMAX_s + 1; i++) {
      gfc.scalefac_band.s[i] = qupvt.sfBandIndex[j].s[i];
    }
    for (var i = 0; i < Encoder.PSFB12 + 1; i++) {
      var size2 = (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) / Encoder.PSFB12;
      var start2 = gfc.scalefac_band.s[12] + i * size2;
      gfc.scalefac_band.psfb12[i] = start2;
    }
    gfc.scalefac_band.psfb12[Encoder.PSFB12] = 192;
    if (gfp.version == 1) {
      gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 17 : 4 + 32;
    } else
      gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 9 : 4 + 17;
    if (gfp.error_protection)
      gfc.sideinfo_len += 2;
    lame_init_bitstream(gfp);
    gfc.Class_ID = LAME_ID;
    {
      var k;
      for (k = 0; k < 19; k++) {
        gfc.nsPsy.pefirbuf[k] = 700 * gfc.mode_gr * gfc.channels_out;
      }
      if (gfp.ATHtype == -1)
        gfp.ATHtype = 4;
    }
    assert$4(gfp.VBR_q <= 9);
    assert$4(gfp.VBR_q >= 0);
    switch (gfp.VBR) {
      case VbrMode$3.vbr_mt:
        gfp.VBR = VbrMode$3.vbr_mtrh;
      case VbrMode$3.vbr_mtrh: {
        if (gfp.useTemporal == null) {
          gfp.useTemporal = false;
        }
        p2.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
        if (gfp.quality < 0)
          gfp.quality = LAME_DEFAULT_QUALITY;
        if (gfp.quality < 5)
          gfp.quality = 0;
        if (gfp.quality > 5)
          gfp.quality = 5;
        gfc.PSY.mask_adjust = gfp.maskingadjust;
        gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
        if (gfp.experimentalY)
          gfc.sfb21_extra = false;
        else
          gfc.sfb21_extra = gfp.out_samplerate > 44e3;
        gfc.iteration_loop = new VBRNewIterationLoop(qu);
        break;
      }
      case VbrMode$3.vbr_rh: {
        p2.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
        gfc.PSY.mask_adjust = gfp.maskingadjust;
        gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
        if (gfp.experimentalY)
          gfc.sfb21_extra = false;
        else
          gfc.sfb21_extra = gfp.out_samplerate > 44e3;
        if (gfp.quality > 6)
          gfp.quality = 6;
        if (gfp.quality < 0)
          gfp.quality = LAME_DEFAULT_QUALITY;
        gfc.iteration_loop = new VBROldIterationLoop(qu);
        break;
      }
      default: {
        var vbrmode;
        gfc.sfb21_extra = false;
        if (gfp.quality < 0)
          gfp.quality = LAME_DEFAULT_QUALITY;
        vbrmode = gfp.VBR;
        if (vbrmode == VbrMode$3.vbr_off)
          gfp.VBR_mean_bitrate_kbps = gfp.brate;
        p2.apply_preset(gfp, gfp.VBR_mean_bitrate_kbps, 0);
        gfp.VBR = vbrmode;
        gfc.PSY.mask_adjust = gfp.maskingadjust;
        gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
        if (vbrmode == VbrMode$3.vbr_off) {
          gfc.iteration_loop = new CBRNewIterationLoop(qu);
        } else {
          gfc.iteration_loop = new ABRIterationLoop(qu);
        }
        break;
      }
    }
    assert$4(gfp.scale >= 0);
    if (gfp.VBR != VbrMode$3.vbr_off) {
      gfc.VBR_min_bitrate = 1;
      gfc.VBR_max_bitrate = 14;
      if (gfp.out_samplerate < 16e3)
        gfc.VBR_max_bitrate = 8;
      if (gfp.VBR_min_bitrate_kbps != 0) {
        gfp.VBR_min_bitrate_kbps = FindNearestBitrate(
          gfp.VBR_min_bitrate_kbps,
          gfp.version,
          gfp.out_samplerate
        );
        gfc.VBR_min_bitrate = BitrateIndex(
          gfp.VBR_min_bitrate_kbps,
          gfp.version,
          gfp.out_samplerate
        );
        if (gfc.VBR_min_bitrate < 0)
          return -1;
      }
      if (gfp.VBR_max_bitrate_kbps != 0) {
        gfp.VBR_max_bitrate_kbps = FindNearestBitrate(
          gfp.VBR_max_bitrate_kbps,
          gfp.version,
          gfp.out_samplerate
        );
        gfc.VBR_max_bitrate = BitrateIndex(
          gfp.VBR_max_bitrate_kbps,
          gfp.version,
          gfp.out_samplerate
        );
        if (gfc.VBR_max_bitrate < 0)
          return -1;
      }
      gfp.VBR_min_bitrate_kbps = Tables$1.bitrate_table[gfp.version][gfc.VBR_min_bitrate];
      gfp.VBR_max_bitrate_kbps = Tables$1.bitrate_table[gfp.version][gfc.VBR_max_bitrate];
      gfp.VBR_mean_bitrate_kbps = Math.min(
        Tables$1.bitrate_table[gfp.version][gfc.VBR_max_bitrate],
        gfp.VBR_mean_bitrate_kbps
      );
      gfp.VBR_mean_bitrate_kbps = Math.max(
        Tables$1.bitrate_table[gfp.version][gfc.VBR_min_bitrate],
        gfp.VBR_mean_bitrate_kbps
      );
    }
    if (gfp.tune) {
      gfc.PSY.mask_adjust += gfp.tune_value_a;
      gfc.PSY.mask_adjust_short += gfp.tune_value_a;
    }
    lame_init_qval(gfp);
    assert$4(gfp.scale >= 0);
    if (gfp.athaa_type < 0)
      gfc.ATH.useAdjust = 3;
    else
      gfc.ATH.useAdjust = gfp.athaa_type;
    gfc.ATH.aaSensitivityP = Math.pow(10, gfp.athaa_sensitivity / -10);
    if (gfp.short_blocks == null) {
      gfp.short_blocks = ShortBlock$1.short_block_allowed;
    }
    if (gfp.short_blocks == ShortBlock$1.short_block_allowed && (gfp.mode == MPEGMode.JOINT_STEREO || gfp.mode == MPEGMode.STEREO)) {
      gfp.short_blocks = ShortBlock$1.short_block_coupled;
    }
    if (gfp.quant_comp < 0)
      gfp.quant_comp = 1;
    if (gfp.quant_comp_short < 0)
      gfp.quant_comp_short = 0;
    if (gfp.msfix < 0)
      gfp.msfix = 0;
    gfp.exp_nspsytune = gfp.exp_nspsytune | 1;
    if (gfp.internal_flags.nsPsy.attackthre < 0) {
      gfp.internal_flags.nsPsy.attackthre = PsyModel.NSATTACKTHRE;
    }
    if (gfp.internal_flags.nsPsy.attackthre_s < 0) {
      gfp.internal_flags.nsPsy.attackthre_s = PsyModel.NSATTACKTHRE_S;
    }
    assert$4(gfp.scale >= 0);
    if (gfp.scale < 0)
      gfp.scale = 1;
    if (gfp.ATHtype < 0)
      gfp.ATHtype = 4;
    if (gfp.ATHcurve < 0)
      gfp.ATHcurve = 4;
    if (gfp.athaa_loudapprox < 0)
      gfp.athaa_loudapprox = 2;
    if (gfp.interChRatio < 0)
      gfp.interChRatio = 0;
    if (gfp.useTemporal == null)
      gfp.useTemporal = true;
    gfc.slot_lag = gfc.frac_SpF = 0;
    if (gfp.VBR == VbrMode$3.vbr_off) {
      gfc.slot_lag = gfc.frac_SpF = (gfp.version + 1) * 72e3 * gfp.brate % gfp.out_samplerate | 0;
    }
    qupvt.iteration_init(gfp);
    psy.psymodel_init(gfp);
    assert$4(gfp.scale >= 0);
    return 0;
  };
  function update_inbuffer_size(gfc, nsamples) {
    if (gfc.in_buffer_0 == null || gfc.in_buffer_nsamples < nsamples) {
      gfc.in_buffer_0 = new_float$2(nsamples);
      gfc.in_buffer_1 = new_float$2(nsamples);
      gfc.in_buffer_nsamples = nsamples;
    }
  }
  this.lame_encode_flush = function(gfp, mp3buffer, mp3bufferPos, mp3buffer_size) {
    var gfc = gfp.internal_flags;
    var buffer = new_short_n([2, 1152]);
    var imp3 = 0;
    var mp3count;
    var mp3buffer_size_remaining;
    var end_padding;
    var frames_left;
    var samples_to_encode = gfc.mf_samples_to_encode - Encoder.POSTDELAY;
    var mf_needed = calcNeeded(gfp);
    if (gfc.mf_samples_to_encode < 1) {
      return 0;
    }
    mp3count = 0;
    if (gfp.in_samplerate != gfp.out_samplerate) {
      samples_to_encode += 16 * gfp.out_samplerate / gfp.in_samplerate;
    }
    end_padding = gfp.framesize - samples_to_encode % gfp.framesize;
    if (end_padding < 576)
      end_padding += gfp.framesize;
    gfp.encoder_padding = end_padding;
    frames_left = (samples_to_encode + end_padding) / gfp.framesize;
    while (frames_left > 0 && imp3 >= 0) {
      var bunch = mf_needed - gfc.mf_size;
      var frame_num = gfp.frameNum;
      bunch *= gfp.in_samplerate;
      bunch /= gfp.out_samplerate;
      if (bunch > 1152)
        bunch = 1152;
      if (bunch < 1)
        bunch = 1;
      mp3buffer_size_remaining = mp3buffer_size - mp3count;
      if (mp3buffer_size == 0)
        mp3buffer_size_remaining = 0;
      imp3 = this.lame_encode_buffer(
        gfp,
        buffer[0],
        buffer[1],
        bunch,
        mp3buffer,
        mp3bufferPos,
        mp3buffer_size_remaining
      );
      mp3bufferPos += imp3;
      mp3count += imp3;
      frames_left -= frame_num != gfp.frameNum ? 1 : 0;
    }
    gfc.mf_samples_to_encode = 0;
    if (imp3 < 0) {
      return imp3;
    }
    mp3buffer_size_remaining = mp3buffer_size - mp3count;
    if (mp3buffer_size == 0)
      mp3buffer_size_remaining = 0;
    bs.flush_bitstream(gfp);
    imp3 = bs.copy_buffer(
      gfc,
      mp3buffer,
      mp3bufferPos,
      mp3buffer_size_remaining,
      1
    );
    if (imp3 < 0) {
      return imp3;
    }
    mp3bufferPos += imp3;
    mp3count += imp3;
    mp3buffer_size_remaining = mp3buffer_size - mp3count;
    if (mp3buffer_size == 0)
      mp3buffer_size_remaining = 0;
    if (gfp.write_id3tag_automatic) {
      id3.id3tag_write_v1(gfp);
      imp3 = bs.copy_buffer(
        gfc,
        mp3buffer,
        mp3bufferPos,
        mp3buffer_size_remaining,
        0
      );
      if (imp3 < 0) {
        return imp3;
      }
      mp3count += imp3;
    }
    return mp3count;
  };
  this.lame_encode_buffer = function(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
    var gfc = gfp.internal_flags;
    var in_buffer = [null, null];
    if (gfc.Class_ID != LAME_ID)
      return -3;
    if (nsamples == 0)
      return 0;
    update_inbuffer_size(gfc, nsamples);
    in_buffer[0] = gfc.in_buffer_0;
    in_buffer[1] = gfc.in_buffer_1;
    for (var i = 0; i < nsamples; i++) {
      in_buffer[0][i] = buffer_l[i];
      if (gfc.channels_in > 1)
        in_buffer[1][i] = buffer_r[i];
    }
    return lame_encode_buffer_sample(
      gfp,
      in_buffer[0],
      in_buffer[1],
      nsamples,
      mp3buf,
      mp3bufPos,
      mp3buf_size
    );
  };
  function calcNeeded(gfp) {
    var mf_needed = Encoder.BLKSIZE + gfp.framesize - Encoder.FFTOFFSET;
    mf_needed = Math.max(mf_needed, 512 + gfp.framesize - 32);
    return mf_needed;
  }
  function lame_encode_buffer_sample(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
    var gfc = gfp.internal_flags;
    var mp3size = 0;
    var ret;
    var i;
    var ch;
    var mf_needed;
    var mp3out;
    var mfbuf = [null, null];
    var in_buffer = [null, null];
    if (gfc.Class_ID != LAME_ID)
      return -3;
    if (nsamples == 0)
      return 0;
    mp3out = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 0);
    if (mp3out < 0)
      return mp3out;
    mp3bufPos += mp3out;
    mp3size += mp3out;
    in_buffer[0] = buffer_l;
    in_buffer[1] = buffer_r;
    if (BitStream$1.NEQ(gfp.scale, 0) && BitStream$1.NEQ(gfp.scale, 1)) {
      for (i = 0; i < nsamples; ++i) {
        in_buffer[0][i] *= gfp.scale;
        if (gfc.channels_out == 2)
          in_buffer[1][i] *= gfp.scale;
      }
    }
    if (BitStream$1.NEQ(gfp.scale_left, 0) && BitStream$1.NEQ(gfp.scale_left, 1)) {
      for (i = 0; i < nsamples; ++i) {
        in_buffer[0][i] *= gfp.scale_left;
      }
    }
    if (BitStream$1.NEQ(gfp.scale_right, 0) && BitStream$1.NEQ(gfp.scale_right, 1)) {
      for (i = 0; i < nsamples; ++i) {
        in_buffer[1][i] *= gfp.scale_right;
      }
    }
    if (gfp.num_channels == 2 && gfc.channels_out == 1) {
      for (i = 0; i < nsamples; ++i) {
        in_buffer[0][i] = 0.5 * (in_buffer[0][i] + in_buffer[1][i]);
        in_buffer[1][i] = 0;
      }
    }
    mf_needed = calcNeeded(gfp);
    mfbuf[0] = gfc.mfbuf[0];
    mfbuf[1] = gfc.mfbuf[1];
    var in_bufferPos = 0;
    while (nsamples > 0) {
      var in_buffer_ptr = [null, null];
      var n_in = 0;
      var n_out = 0;
      in_buffer_ptr[0] = in_buffer[0];
      in_buffer_ptr[1] = in_buffer[1];
      var inOut = new InOut();
      fill_buffer(gfp, mfbuf, in_buffer_ptr, in_bufferPos, nsamples, inOut);
      n_in = inOut.n_in;
      n_out = inOut.n_out;
      if (gfc.findReplayGain && !gfc.decode_on_the_fly) {
        if (ga.AnalyzeSamples(
          gfc.rgdata,
          mfbuf[0],
          gfc.mf_size,
          mfbuf[1],
          gfc.mf_size,
          n_out,
          gfc.channels_out
        ) == GainAnalysis.GAIN_ANALYSIS_ERROR) {
          return -6;
        }
      }
      nsamples -= n_in;
      in_bufferPos += n_in;
      if (gfc.channels_out == 2)
        ;
      gfc.mf_size += n_out;
      assert$4(gfc.mf_size <= LameInternalFlags$1.MFSIZE);
      if (gfc.mf_samples_to_encode < 1) {
        gfc.mf_samples_to_encode = Encoder.ENCDELAY + Encoder.POSTDELAY;
      }
      gfc.mf_samples_to_encode += n_out;
      if (gfc.mf_size >= mf_needed) {
        var buf_size = mp3buf_size - mp3size;
        if (mp3buf_size == 0)
          buf_size = 0;
        ret = lame_encode_frame(
          gfp,
          mfbuf[0],
          mfbuf[1],
          mp3buf,
          mp3bufPos,
          buf_size
        );
        if (ret < 0)
          return ret;
        mp3bufPos += ret;
        mp3size += ret;
        gfc.mf_size -= gfp.framesize;
        gfc.mf_samples_to_encode -= gfp.framesize;
        for (ch = 0; ch < gfc.channels_out; ch++) {
          for (i = 0; i < gfc.mf_size; i++) {
            mfbuf[ch][i] = mfbuf[ch][i + gfp.framesize];
          }
        }
      }
    }
    return mp3size;
  }
  function lame_encode_frame(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
    var ret = self2.enc.lame_encode_mp3_frame(
      gfp,
      inbuf_l,
      inbuf_r,
      mp3buf,
      mp3bufPos,
      mp3buf_size
    );
    gfp.frameNum++;
    return ret;
  }
  function InOut() {
    this.n_in = 0;
    this.n_out = 0;
  }
  function NumUsed() {
    this.num_used = 0;
  }
  function gcd(i, j) {
    return j != 0 ? gcd(j, i % j) : i;
  }
  function blackman(x, fcn, l) {
    var wcn = Math.PI * fcn;
    x /= l;
    if (x < 0)
      x = 0;
    if (x > 1)
      x = 1;
    var x2 = x - 0.5;
    var bkwn = 0.42 - 0.5 * Math.cos(2 * x * Math.PI) + 0.08 * Math.cos(4 * x * Math.PI);
    if (Math.abs(x2) < 1e-9)
      return wcn / Math.PI;
    else
      return bkwn * Math.sin(l * wcn * x2) / (Math.PI * l * x2);
  }
  function fill_buffer_resample(gfp, outbuf, outbufPos, desired_len, inbuf, in_bufferPos, len, num_used, ch) {
    var gfc = gfp.internal_flags;
    var i;
    var j = 0;
    var k;
    var bpc = gfp.out_samplerate / gcd(gfp.out_samplerate, gfp.in_samplerate);
    if (bpc > LameInternalFlags$1.BPC)
      bpc = LameInternalFlags$1.BPC;
    var intratio = Math.abs(gfc.resample_ratio - Math.floor(0.5 + gfc.resample_ratio)) < 1e-4 ? 1 : 0;
    var fcn = 1 / gfc.resample_ratio;
    if (fcn > 1)
      fcn = 1;
    var filter_l = 31;
    if (filter_l % 2 == 0)
      --filter_l;
    filter_l += intratio;
    var BLACKSIZE = filter_l + 1;
    if (gfc.fill_buffer_resample_init == 0) {
      gfc.inbuf_old[0] = new_float$2(BLACKSIZE);
      gfc.inbuf_old[1] = new_float$2(BLACKSIZE);
      for (i = 0; i <= 2 * bpc; ++i)
        gfc.blackfilt[i] = new_float$2(BLACKSIZE);
      gfc.itime[0] = 0;
      gfc.itime[1] = 0;
      for (j = 0; j <= 2 * bpc; j++) {
        var sum = 0;
        var offset = (j - bpc) / (2 * bpc);
        for (i = 0; i <= filter_l; i++) {
          sum += gfc.blackfilt[j][i] = blackman(i - offset, fcn, filter_l);
        }
        for (i = 0; i <= filter_l; i++)
          gfc.blackfilt[j][i] /= sum;
      }
      gfc.fill_buffer_resample_init = 1;
    }
    var inbuf_old = gfc.inbuf_old[ch];
    for (k = 0; k < desired_len; k++) {
      var time0;
      var joff;
      time0 = k * gfc.resample_ratio;
      j = 0 | Math.floor(time0 - gfc.itime[ch]);
      if (filter_l + j - filter_l / 2 >= len)
        break;
      var offset = time0 - gfc.itime[ch] - (j + 0.5 * (filter_l % 2));
      joff = 0 | Math.floor(offset * 2 * bpc + bpc + 0.5);
      var xvalue = 0;
      for (i = 0; i <= filter_l; ++i) {
        var j2 = 0 | i + j - filter_l / 2;
        var y;
        y = j2 < 0 ? inbuf_old[BLACKSIZE + j2] : inbuf[in_bufferPos + j2];
        xvalue += y * gfc.blackfilt[joff][i];
      }
      outbuf[outbufPos + k] = xvalue;
    }
    num_used.num_used = Math.min(len, filter_l + j - filter_l / 2);
    gfc.itime[ch] += num_used.num_used - k * gfc.resample_ratio;
    if (num_used.num_used >= BLACKSIZE) {
      for (i = 0; i < BLACKSIZE; i++) {
        inbuf_old[i] = inbuf[in_bufferPos + num_used.num_used + i - BLACKSIZE];
      }
    } else {
      var n_shift = BLACKSIZE - num_used.num_used;
      for (i = 0; i < n_shift; ++i) {
        inbuf_old[i] = inbuf_old[i + num_used.num_used];
      }
      for (j = 0; i < BLACKSIZE; ++i, ++j) {
        inbuf_old[i] = inbuf[in_bufferPos + j];
      }
      assert$4(j == num_used.num_used);
    }
    return k;
  }
  function fill_buffer(gfp, mfbuf, in_buffer, in_bufferPos, nsamples, io) {
    var gfc = gfp.internal_flags;
    if (gfc.resample_ratio < 0.9999 || gfc.resample_ratio > 1.0001) {
      for (var ch = 0; ch < gfc.channels_out; ch++) {
        var numUsed = new NumUsed();
        io.n_out = fill_buffer_resample(
          gfp,
          mfbuf[ch],
          gfc.mf_size,
          gfp.framesize,
          in_buffer[ch],
          in_bufferPos,
          nsamples,
          numUsed,
          ch
        );
        io.n_in = numUsed.num_used;
      }
    } else {
      io.n_out = Math.min(gfp.framesize, nsamples);
      io.n_in = io.n_out;
      for (var i = 0; i < io.n_out; ++i) {
        mfbuf[0][gfc.mf_size + i] = in_buffer[0][in_bufferPos + i];
        if (gfc.channels_out == 2) {
          mfbuf[1][gfc.mf_size + i] = in_buffer[1][in_bufferPos + i];
        }
      }
    }
  }
}
var VbrMode$2 = common.VbrMode;
function Presets() {
  function VBRPresets(qual, comp, compS, y, shThreshold, shThresholdS, adj, adjShort, lower, curve, sens, inter, joint, mod, fix) {
    this.vbr_q = qual;
    this.quant_comp = comp;
    this.quant_comp_s = compS;
    this.expY = y;
    this.st_lrm = shThreshold;
    this.st_s = shThresholdS;
    this.masking_adj = adj;
    this.masking_adj_short = adjShort;
    this.ath_lower = lower;
    this.ath_curve = curve;
    this.ath_sensitivity = sens;
    this.interch = inter;
    this.safejoint = joint;
    this.sfb21mod = mod;
    this.msfix = fix;
  }
  function ABRPresets(kbps, comp, compS, joint, fix, shThreshold, shThresholdS, bass, sc, mask, lower, curve, interCh, sfScale) {
    this.quant_comp = comp;
    this.quant_comp_s = compS;
    this.safejoint = joint;
    this.nsmsfix = fix;
    this.st_lrm = shThreshold;
    this.st_s = shThresholdS;
    this.nsbass = bass;
    this.scale = sc;
    this.masking_adj = mask;
    this.ath_lower = lower;
    this.ath_curve = curve;
    this.interch = interCh;
    this.sfscale = sfScale;
  }
  var lame;
  this.setModules = function(_lame) {
    lame = _lame;
  };
  var vbr_old_switch_map = [
    new VBRPresets(
      0,
      9,
      9,
      0,
      5.2,
      125,
      -4.2,
      -6.3,
      4.8,
      1,
      0,
      0,
      2,
      21,
      0.97
    ),
    new VBRPresets(
      1,
      9,
      9,
      0,
      5.3,
      125,
      -3.6,
      -5.6,
      4.5,
      1.5,
      0,
      0,
      2,
      21,
      1.35
    ),
    new VBRPresets(
      2,
      9,
      9,
      0,
      5.6,
      125,
      -2.2,
      -3.5,
      2.8,
      2,
      0,
      0,
      2,
      21,
      1.49
    ),
    new VBRPresets(
      3,
      9,
      9,
      1,
      5.8,
      130,
      -1.8,
      -2.8,
      2.6,
      3,
      -4,
      0,
      2,
      20,
      1.64
    ),
    new VBRPresets(
      4,
      9,
      9,
      1,
      6,
      135,
      -0.7,
      -1.1,
      1.1,
      3.5,
      -8,
      0,
      2,
      0,
      1.79
    ),
    new VBRPresets(
      5,
      9,
      9,
      1,
      6.4,
      140,
      0.5,
      0.4,
      -7.5,
      4,
      -12,
      2e-4,
      0,
      0,
      1.95
    ),
    new VBRPresets(
      6,
      9,
      9,
      1,
      6.6,
      145,
      0.67,
      0.65,
      -14.7,
      6.5,
      -19,
      4e-4,
      0,
      0,
      2.3
    ),
    new VBRPresets(
      7,
      9,
      9,
      1,
      6.6,
      145,
      0.8,
      0.75,
      -19.7,
      8,
      -22,
      6e-4,
      0,
      0,
      2.7
    ),
    new VBRPresets(
      8,
      9,
      9,
      1,
      6.6,
      145,
      1.2,
      1.15,
      -27.5,
      10,
      -23,
      7e-4,
      0,
      0,
      0
    ),
    new VBRPresets(
      9,
      9,
      9,
      1,
      6.6,
      145,
      1.6,
      1.6,
      -36,
      11,
      -25,
      8e-4,
      0,
      0,
      0
    ),
    new VBRPresets(
      10,
      9,
      9,
      1,
      6.6,
      145,
      2,
      2,
      -36,
      12,
      -25,
      8e-4,
      0,
      0,
      0
    )
  ];
  var vbr_psy_switch_map = [
    new VBRPresets(
      0,
      9,
      9,
      0,
      4.2,
      25,
      -7,
      -4,
      7.5,
      1,
      0,
      0,
      2,
      26,
      0.97
    ),
    new VBRPresets(
      1,
      9,
      9,
      0,
      4.2,
      25,
      -5.6,
      -3.6,
      4.5,
      1.5,
      0,
      0,
      2,
      21,
      1.35
    ),
    new VBRPresets(2, 9, 9, 0, 4.2, 25, -4.4, -1.8, 2, 2, 0, 0, 2, 18, 1.49),
    new VBRPresets(
      3,
      9,
      9,
      1,
      4.2,
      25,
      -3.4,
      -1.25,
      1.1,
      3,
      -4,
      0,
      2,
      15,
      1.64
    ),
    new VBRPresets(4, 9, 9, 1, 4.2, 25, -2.2, 0.1, 0, 3.5, -8, 0, 2, 0, 1.79),
    new VBRPresets(
      5,
      9,
      9,
      1,
      4.2,
      25,
      -1,
      1.65,
      -7.7,
      4,
      -12,
      2e-4,
      0,
      0,
      1.95
    ),
    new VBRPresets(
      6,
      9,
      9,
      1,
      4.2,
      25,
      -0,
      2.47,
      -7.7,
      6.5,
      -19,
      4e-4,
      0,
      0,
      2
    ),
    new VBRPresets(
      7,
      9,
      9,
      1,
      4.2,
      25,
      0.5,
      2,
      -14.5,
      8,
      -22,
      6e-4,
      0,
      0,
      2
    ),
    new VBRPresets(
      8,
      9,
      9,
      1,
      4.2,
      25,
      1,
      2.4,
      -22,
      10,
      -23,
      7e-4,
      0,
      0,
      2
    ),
    new VBRPresets(
      9,
      9,
      9,
      1,
      4.2,
      25,
      1.5,
      2.95,
      -30,
      11,
      -25,
      8e-4,
      0,
      0,
      2
    ),
    new VBRPresets(
      10,
      9,
      9,
      1,
      4.2,
      25,
      2,
      2.95,
      -36,
      12,
      -30,
      8e-4,
      0,
      0,
      2
    )
  ];
  function apply_vbr_preset(gfp, a, enforce) {
    var vbr_preset = gfp.VBR == VbrMode$2.vbr_rh ? vbr_old_switch_map : vbr_psy_switch_map;
    var x = gfp.VBR_q_frac;
    var p2 = vbr_preset[a];
    var q = vbr_preset[a + 1];
    var set2 = p2;
    p2.st_lrm = p2.st_lrm + x * (q.st_lrm - p2.st_lrm);
    p2.st_s = p2.st_s + x * (q.st_s - p2.st_s);
    p2.masking_adj = p2.masking_adj + x * (q.masking_adj - p2.masking_adj);
    p2.masking_adj_short = p2.masking_adj_short + x * (q.masking_adj_short - p2.masking_adj_short);
    p2.ath_lower = p2.ath_lower + x * (q.ath_lower - p2.ath_lower);
    p2.ath_curve = p2.ath_curve + x * (q.ath_curve - p2.ath_curve);
    p2.ath_sensitivity = p2.ath_sensitivity + x * (q.ath_sensitivity - p2.ath_sensitivity);
    p2.interch = p2.interch + x * (q.interch - p2.interch);
    p2.msfix = p2.msfix + x * (q.msfix - p2.msfix);
    lame_set_VBR_q(gfp, set2.vbr_q);
    if (enforce != 0)
      gfp.quant_comp = set2.quant_comp;
    else if (!(Math.abs(gfp.quant_comp - -1) > 0)) {
      gfp.quant_comp = set2.quant_comp;
    }
    if (enforce != 0)
      gfp.quant_comp_short = set2.quant_comp_s;
    else if (!(Math.abs(gfp.quant_comp_short - -1) > 0)) {
      gfp.quant_comp_short = set2.quant_comp_s;
    }
    if (set2.expY != 0) {
      gfp.experimentalY = set2.expY != 0;
    }
    if (enforce != 0)
      gfp.internal_flags.nsPsy.attackthre = set2.st_lrm;
    else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre - -1) > 0)) {
      gfp.internal_flags.nsPsy.attackthre = set2.st_lrm;
    }
    if (enforce != 0)
      gfp.internal_flags.nsPsy.attackthre_s = set2.st_s;
    else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre_s - -1) > 0)) {
      gfp.internal_flags.nsPsy.attackthre_s = set2.st_s;
    }
    if (enforce != 0)
      gfp.maskingadjust = set2.masking_adj;
    else if (!(Math.abs(gfp.maskingadjust - 0) > 0)) {
      gfp.maskingadjust = set2.masking_adj;
    }
    if (enforce != 0)
      gfp.maskingadjust_short = set2.masking_adj_short;
    else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0)) {
      gfp.maskingadjust_short = set2.masking_adj_short;
    }
    if (enforce != 0)
      gfp.ATHlower = -set2.ath_lower / 10;
    else if (!(Math.abs(-gfp.ATHlower * 10 - 0) > 0)) {
      gfp.ATHlower = -set2.ath_lower / 10;
    }
    if (enforce != 0)
      gfp.ATHcurve = set2.ath_curve;
    else if (!(Math.abs(gfp.ATHcurve - -1) > 0))
      gfp.ATHcurve = set2.ath_curve;
    if (enforce != 0)
      gfp.athaa_sensitivity = set2.ath_sensitivity;
    else if (!(Math.abs(gfp.athaa_sensitivity - -1) > 0)) {
      gfp.athaa_sensitivity = set2.ath_sensitivity;
    }
    if (set2.interch > 0) {
      if (enforce != 0)
        gfp.interChRatio = set2.interch;
      else if (!(Math.abs(gfp.interChRatio - -1) > 0)) {
        gfp.interChRatio = set2.interch;
      }
    }
    if (set2.safejoint > 0) {
      gfp.exp_nspsytune = gfp.exp_nspsytune | set2.safejoint;
    }
    if (set2.sfb21mod > 0) {
      gfp.exp_nspsytune = gfp.exp_nspsytune | set2.sfb21mod << 20;
    }
    if (enforce != 0)
      gfp.msfix = set2.msfix;
    else if (!(Math.abs(gfp.msfix - -1) > 0))
      gfp.msfix = set2.msfix;
    if (enforce == 0) {
      gfp.VBR_q = a;
      gfp.VBR_q_frac = x;
    }
  }
  var abr_switch_map = [
    new ABRPresets(
      8,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -30,
      11,
      12e-4,
      1
    ),
    new ABRPresets(
      16,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -25,
      11,
      1e-3,
      1
    ),
    new ABRPresets(
      24,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -20,
      11,
      1e-3,
      1
    ),
    new ABRPresets(
      32,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -15,
      11,
      1e-3,
      1
    ),
    new ABRPresets(
      40,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -10,
      11,
      9e-4,
      1
    ),
    new ABRPresets(
      48,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -10,
      11,
      9e-4,
      1
    ),
    new ABRPresets(
      56,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -6,
      11,
      8e-4,
      1
    ),
    new ABRPresets(
      64,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      -2,
      11,
      8e-4,
      1
    ),
    new ABRPresets(
      80,
      9,
      9,
      0,
      0,
      6.6,
      145,
      0,
      0.95,
      0,
      0,
      8,
      7e-4,
      1
    ),
    new ABRPresets(
      96,
      9,
      9,
      0,
      2.5,
      6.6,
      145,
      0,
      0.95,
      0,
      1,
      5.5,
      6e-4,
      1
    ),
    new ABRPresets(
      112,
      9,
      9,
      0,
      2.25,
      6.6,
      145,
      0,
      0.95,
      0,
      2,
      4.5,
      5e-4,
      1
    ),
    new ABRPresets(
      128,
      9,
      9,
      0,
      1.95,
      6.4,
      140,
      0,
      0.95,
      0,
      3,
      4,
      2e-4,
      1
    ),
    new ABRPresets(
      160,
      9,
      9,
      1,
      1.79,
      6,
      135,
      0,
      0.95,
      -2,
      5,
      3.5,
      0,
      1
    ),
    new ABRPresets(
      192,
      9,
      9,
      1,
      1.49,
      5.6,
      125,
      0,
      0.97,
      -4,
      7,
      3,
      0,
      0
    ),
    new ABRPresets(
      224,
      9,
      9,
      1,
      1.25,
      5.2,
      125,
      0,
      0.98,
      -6,
      9,
      2,
      0,
      0
    ),
    new ABRPresets(
      256,
      9,
      9,
      1,
      0.97,
      5.2,
      125,
      0,
      1,
      -8,
      10,
      1,
      0,
      0
    ),
    new ABRPresets(
      320,
      9,
      9,
      1,
      0.9,
      5.2,
      125,
      0,
      1,
      -10,
      12,
      0,
      0,
      0
    )
  ];
  function apply_abr_preset(gfp, preset, enforce) {
    var actual_bitrate = preset;
    var r = lame.nearestBitrateFullIndex(preset);
    gfp.VBR = VbrMode$2.vbr_abr;
    gfp.VBR_mean_bitrate_kbps = actual_bitrate;
    gfp.VBR_mean_bitrate_kbps = Math.min(gfp.VBR_mean_bitrate_kbps, 320);
    gfp.VBR_mean_bitrate_kbps = Math.max(gfp.VBR_mean_bitrate_kbps, 8);
    gfp.brate = gfp.VBR_mean_bitrate_kbps;
    if (gfp.VBR_mean_bitrate_kbps > 320) {
      gfp.disable_reservoir = true;
    }
    if (abr_switch_map[r].safejoint > 0) {
      gfp.exp_nspsytune = gfp.exp_nspsytune | 2;
    }
    if (abr_switch_map[r].sfscale > 0) {
      gfp.internal_flags.noise_shaping = 2;
    }
    if (Math.abs(abr_switch_map[r].nsbass) > 0) {
      var k = int(abr_switch_map[r].nsbass * 4);
      if (k < 0)
        k += 64;
      gfp.exp_nspsytune = gfp.exp_nspsytune | k << 2;
    }
    if (enforce != 0)
      gfp.quant_comp = abr_switch_map[r].quant_comp;
    else if (!(Math.abs(gfp.quant_comp - -1) > 0)) {
      gfp.quant_comp = abr_switch_map[r].quant_comp;
    }
    if (enforce != 0)
      gfp.quant_comp_short = abr_switch_map[r].quant_comp_s;
    else if (!(Math.abs(gfp.quant_comp_short - -1) > 0)) {
      gfp.quant_comp_short = abr_switch_map[r].quant_comp_s;
    }
    if (enforce != 0)
      gfp.msfix = abr_switch_map[r].nsmsfix;
    else if (!(Math.abs(gfp.msfix - -1) > 0)) {
      gfp.msfix = abr_switch_map[r].nsmsfix;
    }
    if (enforce != 0) {
      gfp.internal_flags.nsPsy.attackthre = abr_switch_map[r].st_lrm;
    } else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre - -1) > 0)) {
      gfp.internal_flags.nsPsy.attackthre = abr_switch_map[r].st_lrm;
    }
    if (enforce != 0) {
      gfp.internal_flags.nsPsy.attackthre_s = abr_switch_map[r].st_s;
    } else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre_s - -1) > 0)) {
      gfp.internal_flags.nsPsy.attackthre_s = abr_switch_map[r].st_s;
    }
    if (enforce != 0)
      gfp.scale = abr_switch_map[r].scale;
    else if (!(Math.abs(gfp.scale - -1) > 0)) {
      gfp.scale = abr_switch_map[r].scale;
    }
    if (enforce != 0)
      gfp.maskingadjust = abr_switch_map[r].masking_adj;
    else if (!(Math.abs(gfp.maskingadjust - 0) > 0)) {
      gfp.maskingadjust = abr_switch_map[r].masking_adj;
    }
    if (abr_switch_map[r].masking_adj > 0) {
      if (enforce != 0) {
        gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 0.9;
      } else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0)) {
        gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 0.9;
      }
    } else {
      if (enforce != 0) {
        gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 1.1;
      } else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0)) {
        gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 1.1;
      }
    }
    if (enforce != 0)
      gfp.ATHlower = -abr_switch_map[r].ath_lower / 10;
    else if (!(Math.abs(-gfp.ATHlower * 10 - 0) > 0)) {
      gfp.ATHlower = -abr_switch_map[r].ath_lower / 10;
    }
    if (enforce != 0)
      gfp.ATHcurve = abr_switch_map[r].ath_curve;
    else if (!(Math.abs(gfp.ATHcurve - -1) > 0)) {
      gfp.ATHcurve = abr_switch_map[r].ath_curve;
    }
    if (enforce != 0)
      gfp.interChRatio = abr_switch_map[r].interch;
    else if (!(Math.abs(gfp.interChRatio - -1) > 0)) {
      gfp.interChRatio = abr_switch_map[r].interch;
    }
    return preset;
  }
  this.apply_preset = function(gfp, preset, enforce) {
    switch (preset) {
      case Lame$1.R3MIX: {
        preset = Lame$1.V3;
        gfp.VBR = VbrMode$2.vbr_mtrh;
        break;
      }
      case Lame$1.MEDIUM: {
        preset = Lame$1.V4;
        gfp.VBR = VbrMode$2.vbr_rh;
        break;
      }
      case Lame$1.MEDIUM_FAST: {
        preset = Lame$1.V4;
        gfp.VBR = VbrMode$2.vbr_mtrh;
        break;
      }
      case Lame$1.STANDARD: {
        preset = Lame$1.V2;
        gfp.VBR = VbrMode$2.vbr_rh;
        break;
      }
      case Lame$1.STANDARD_FAST: {
        preset = Lame$1.V2;
        gfp.VBR = VbrMode$2.vbr_mtrh;
        break;
      }
      case Lame$1.EXTREME: {
        preset = Lame$1.V0;
        gfp.VBR = VbrMode$2.vbr_rh;
        break;
      }
      case Lame$1.EXTREME_FAST: {
        preset = Lame$1.V0;
        gfp.VBR = VbrMode$2.vbr_mtrh;
        break;
      }
      case Lame$1.INSANE: {
        preset = 320;
        gfp.preset = preset;
        apply_abr_preset(gfp, preset, enforce);
        gfp.VBR = VbrMode$2.vbr_off;
        return preset;
      }
    }
    gfp.preset = preset;
    {
      switch (preset) {
        case Lame$1.V9:
          apply_vbr_preset(gfp, 9, enforce);
          return preset;
        case Lame$1.V8:
          apply_vbr_preset(gfp, 8, enforce);
          return preset;
        case Lame$1.V7:
          apply_vbr_preset(gfp, 7, enforce);
          return preset;
        case Lame$1.V6:
          apply_vbr_preset(gfp, 6, enforce);
          return preset;
        case Lame$1.V5:
          apply_vbr_preset(gfp, 5, enforce);
          return preset;
        case Lame$1.V4:
          apply_vbr_preset(gfp, 4, enforce);
          return preset;
        case Lame$1.V3:
          apply_vbr_preset(gfp, 3, enforce);
          return preset;
        case Lame$1.V2:
          apply_vbr_preset(gfp, 2, enforce);
          return preset;
        case Lame$1.V1:
          apply_vbr_preset(gfp, 1, enforce);
          return preset;
        case Lame$1.V0:
          apply_vbr_preset(gfp, 0, enforce);
          return preset;
      }
    }
    if (preset >= 8 && preset <= 320) {
      return apply_abr_preset(gfp, preset, enforce);
    }
    gfp.preset = 0;
    return preset;
  };
  function lame_set_VBR_q(gfp, VBR_q) {
    var ret = 0;
    if (VBR_q < 0) {
      ret = -1;
      VBR_q = 0;
    }
    if (VBR_q > 9) {
      ret = -1;
      VBR_q = 9;
    }
    gfp.VBR_q = VBR_q;
    gfp.VBR_q_frac = 0;
    return ret;
  }
}
function VBRQuantize() {
  this.setModules = function(_qupvt, _tk) {
  };
}
function CalcNoiseResult$1() {
  this.over_noise = 0;
  this.tot_noise = 0;
  this.max_noise = 0;
  this.over_count = 0;
  this.over_SSD = 0;
  this.bits = 0;
}
var new_float$1 = common.new_float;
var new_int = common.new_int;
function CalcNoiseData() {
  this.global_gain = 0;
  this.sfb_count1 = 0;
  this.step = new_int(39);
  this.noise = new_float$1(39);
  this.noise_log = new_float$1(39);
}
var System$1 = common.System;
var VbrMode$1 = common.VbrMode;
var Util = common.Util;
var Arrays$1 = common.Arrays;
var new_float = common.new_float;
var assert$3 = common.assert;
function Quantize() {
  var bs;
  this.rv = null;
  var rv;
  this.qupvt = null;
  var qupvt;
  var vbr = new VBRQuantize();
  var tk;
  this.setModules = function(_bs, _rv, _qupvt, _tk) {
    bs = _bs;
    rv = _rv;
    this.rv = _rv;
    qupvt = _qupvt;
    this.qupvt = _qupvt;
    tk = _tk;
    vbr.setModules(qupvt, tk);
  };
  this.ms_convert = function(l3_side, gr) {
    for (var i = 0; i < 576; ++i) {
      var l = l3_side.tt[gr][0].xr[i];
      var r = l3_side.tt[gr][1].xr[i];
      l3_side.tt[gr][0].xr[i] = (l + r) * (Util.SQRT2 * 0.5);
      l3_side.tt[gr][1].xr[i] = (l - r) * (Util.SQRT2 * 0.5);
    }
  };
  function init_xrpow_core(cod_info, xrpow, upper, sum) {
    sum = 0;
    for (var i = 0; i <= upper; ++i) {
      var tmp = Math.abs(cod_info.xr[i]);
      sum += tmp;
      xrpow[i] = Math.sqrt(tmp * Math.sqrt(tmp));
      if (xrpow[i] > cod_info.xrpow_max)
        cod_info.xrpow_max = xrpow[i];
    }
    return sum;
  }
  this.init_xrpow = function(gfc, cod_info, xrpow) {
    var sum = 0;
    var upper = 0 | cod_info.max_nonzero_coeff;
    cod_info.xrpow_max = 0;
    Arrays$1.fill(xrpow, upper, 576, 0);
    sum = init_xrpow_core(cod_info, xrpow, upper, sum);
    if (sum > 1e-20) {
      var j = 0;
      if ((gfc.substep_shaping & 2) != 0)
        j = 1;
      for (var i = 0; i < cod_info.psymax; i++)
        gfc.pseudohalf[i] = j;
      return true;
    }
    Arrays$1.fill(cod_info.l3_enc, 0, 576, 0);
    return false;
  };
  function psfb21_analogsilence(gfc, cod_info) {
    var ath = gfc.ATH;
    var xr = cod_info.xr;
    if (cod_info.block_type != Encoder.SHORT_TYPE) {
      var stop = false;
      for (var gsfb = Encoder.PSFB21 - 1; gsfb >= 0 && !stop; gsfb--) {
        var start2 = gfc.scalefac_band.psfb21[gsfb];
        var end = gfc.scalefac_band.psfb21[gsfb + 1];
        var ath21 = qupvt.athAdjust(ath.adjust, ath.psfb21[gsfb], ath.floor);
        if (gfc.nsPsy.longfact[21] > 1e-12)
          ath21 *= gfc.nsPsy.longfact[21];
        for (var j = end - 1; j >= start2; j--) {
          if (Math.abs(xr[j]) < ath21)
            xr[j] = 0;
          else {
            stop = true;
            break;
          }
        }
      }
    } else {
      for (var block = 0; block < 3; block++) {
        var stop = false;
        for (var gsfb = Encoder.PSFB12 - 1; gsfb >= 0 && !stop; gsfb--) {
          var start2 = gfc.scalefac_band.s[12] * 3 + (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) * block + (gfc.scalefac_band.psfb12[gsfb] - gfc.scalefac_band.psfb12[0]);
          var end = start2 + (gfc.scalefac_band.psfb12[gsfb + 1] - gfc.scalefac_band.psfb12[gsfb]);
          var ath12 = qupvt.athAdjust(ath.adjust, ath.psfb12[gsfb], ath.floor);
          if (gfc.nsPsy.shortfact[12] > 1e-12)
            ath12 *= gfc.nsPsy.shortfact[12];
          for (var j = end - 1; j >= start2; j--) {
            if (Math.abs(xr[j]) < ath12)
              xr[j] = 0;
            else {
              stop = true;
              break;
            }
          }
        }
      }
    }
  }
  this.init_outer_loop = function(gfc, cod_info) {
    cod_info.part2_3_length = 0;
    cod_info.big_values = 0;
    cod_info.count1 = 0;
    cod_info.global_gain = 210;
    cod_info.scalefac_compress = 0;
    cod_info.table_select[0] = 0;
    cod_info.table_select[1] = 0;
    cod_info.table_select[2] = 0;
    cod_info.subblock_gain[0] = 0;
    cod_info.subblock_gain[1] = 0;
    cod_info.subblock_gain[2] = 0;
    cod_info.subblock_gain[3] = 0;
    cod_info.region0_count = 0;
    cod_info.region1_count = 0;
    cod_info.preflag = 0;
    cod_info.scalefac_scale = 0;
    cod_info.count1table_select = 0;
    cod_info.part2_length = 0;
    cod_info.sfb_lmax = Encoder.SBPSY_l;
    cod_info.sfb_smin = Encoder.SBPSY_s;
    cod_info.psy_lmax = gfc.sfb21_extra ? Encoder.SBMAX_l : Encoder.SBPSY_l;
    cod_info.psymax = cod_info.psy_lmax;
    cod_info.sfbmax = cod_info.sfb_lmax;
    cod_info.sfbdivide = 11;
    for (var sfb = 0; sfb < Encoder.SBMAX_l; sfb++) {
      cod_info.width[sfb] = gfc.scalefac_band.l[sfb + 1] - gfc.scalefac_band.l[sfb];
      cod_info.window[sfb] = 3;
    }
    if (cod_info.block_type == Encoder.SHORT_TYPE) {
      var ixwork = new_float(576);
      cod_info.sfb_smin = 0;
      cod_info.sfb_lmax = 0;
      if (cod_info.mixed_block_flag != 0) {
        cod_info.sfb_smin = 3;
        cod_info.sfb_lmax = gfc.mode_gr * 2 + 4;
      }
      cod_info.psymax = cod_info.sfb_lmax + 3 * ((gfc.sfb21_extra ? Encoder.SBMAX_s : Encoder.SBPSY_s) - cod_info.sfb_smin);
      cod_info.sfbmax = cod_info.sfb_lmax + 3 * (Encoder.SBPSY_s - cod_info.sfb_smin);
      cod_info.sfbdivide = cod_info.sfbmax - 18;
      cod_info.psy_lmax = cod_info.sfb_lmax;
      var ix = gfc.scalefac_band.l[cod_info.sfb_lmax];
      System$1.arraycopy(cod_info.xr, 0, ixwork, 0, 576);
      for (var sfb = cod_info.sfb_smin; sfb < Encoder.SBMAX_s; sfb++) {
        var start2 = gfc.scalefac_band.s[sfb];
        var end = gfc.scalefac_band.s[sfb + 1];
        for (var window2 = 0; window2 < 3; window2++) {
          for (var l = start2; l < end; l++) {
            cod_info.xr[ix++] = ixwork[3 * l + window2];
          }
        }
      }
      var j = cod_info.sfb_lmax;
      for (var sfb = cod_info.sfb_smin; sfb < Encoder.SBMAX_s; sfb++) {
        cod_info.width[j] = cod_info.width[j + 1] = cod_info.width[j + 2] = gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
        cod_info.window[j] = 0;
        cod_info.window[j + 1] = 1;
        cod_info.window[j + 2] = 2;
        j += 3;
      }
    }
    cod_info.count1bits = 0;
    cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[0][0];
    cod_info.slen[0] = 0;
    cod_info.slen[1] = 0;
    cod_info.slen[2] = 0;
    cod_info.slen[3] = 0;
    cod_info.max_nonzero_coeff = 575;
    Arrays$1.fill(cod_info.scalefac, 0);
    psfb21_analogsilence(gfc, cod_info);
  };
  function BinSearchDirection(ordinal) {
    this.ordinal = ordinal;
  }
  BinSearchDirection.BINSEARCH_NONE = new BinSearchDirection(0);
  BinSearchDirection.BINSEARCH_UP = new BinSearchDirection(1);
  BinSearchDirection.BINSEARCH_DOWN = new BinSearchDirection(2);
  function bin_search_StepSize(gfc, cod_info, desired_rate, ch, xrpow) {
    var nBits;
    var CurrentStep = gfc.CurrentStep[ch];
    var flagGoneOver = false;
    var start2 = gfc.OldValue[ch];
    var Direction = BinSearchDirection.BINSEARCH_NONE;
    cod_info.global_gain = start2;
    desired_rate -= cod_info.part2_length;
    for (; ; ) {
      var step;
      nBits = tk.count_bits(gfc, xrpow, cod_info, null);
      if (CurrentStep == 1 || nBits == desired_rate)
        break;
      if (nBits > desired_rate) {
        if (Direction == BinSearchDirection.BINSEARCH_DOWN)
          flagGoneOver = true;
        if (flagGoneOver)
          CurrentStep /= 2;
        Direction = BinSearchDirection.BINSEARCH_UP;
        step = CurrentStep;
      } else {
        if (Direction == BinSearchDirection.BINSEARCH_UP)
          flagGoneOver = true;
        if (flagGoneOver)
          CurrentStep /= 2;
        Direction = BinSearchDirection.BINSEARCH_DOWN;
        step = -CurrentStep;
      }
      cod_info.global_gain += step;
      if (cod_info.global_gain < 0) {
        cod_info.global_gain = 0;
        flagGoneOver = true;
      }
      if (cod_info.global_gain > 255) {
        cod_info.global_gain = 255;
        flagGoneOver = true;
      }
    }
    assert$3(cod_info.global_gain >= 0);
    assert$3(cod_info.global_gain < 256);
    while (nBits > desired_rate && cod_info.global_gain < 255) {
      cod_info.global_gain++;
      nBits = tk.count_bits(gfc, xrpow, cod_info, null);
    }
    gfc.CurrentStep[ch] = start2 - cod_info.global_gain >= 4 ? 4 : 2;
    gfc.OldValue[ch] = cod_info.global_gain;
    cod_info.part2_3_length = nBits;
    return nBits;
  }
  this.trancate_smallspectrums = function(gfc, gi, l3_xmin, work) {
    var distort = new_float(L3Side$1.SFBMAX);
    if ((gfc.substep_shaping & 4) == 0 && gi.block_type == Encoder.SHORT_TYPE || (gfc.substep_shaping & 128) != 0) {
      return;
    }
    qupvt.calc_noise(gi, l3_xmin, distort, new CalcNoiseResult$1(), null);
    for (var j = 0; j < 576; j++) {
      var xr = 0;
      if (gi.l3_enc[j] != 0)
        xr = Math.abs(gi.xr[j]);
      work[j] = xr;
    }
    var j = 0;
    var sfb = 8;
    if (gi.block_type == Encoder.SHORT_TYPE)
      sfb = 6;
    do {
      var allowedNoise, trancateThreshold;
      var nsame, start2;
      var width = gi.width[sfb];
      j += width;
      if (distort[sfb] >= 1)
        continue;
      Arrays$1.sort(work, j - width, width);
      if (BitStream.EQ(work[j - 1], 0))
        continue;
      allowedNoise = (1 - distort[sfb]) * l3_xmin[sfb];
      trancateThreshold = 0;
      start2 = 0;
      do {
        var noise;
        for (nsame = 1; start2 + nsame < width; nsame++) {
          if (BitStream.NEQ(
            work[start2 + j - width],
            work[start2 + j + nsame - width]
          )) {
            break;
          }
        }
        noise = work[start2 + j - width] * work[start2 + j - width] * nsame;
        if (allowedNoise < noise) {
          if (start2 != 0)
            trancateThreshold = work[start2 + j - width - 1];
          break;
        }
        allowedNoise -= noise;
        start2 += nsame;
      } while (start2 < width);
      if (BitStream.EQ(trancateThreshold, 0))
        continue;
      do {
        if (Math.abs(gi.xr[j - width]) <= trancateThreshold) {
          gi.l3_enc[j - width] = 0;
        }
      } while (--width > 0);
    } while (++sfb < gi.psymax);
    gi.part2_3_length = tk.noquant_count_bits(gfc, gi, null);
  };
  function loop_break(cod_info) {
    for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
      if (cod_info.scalefac[sfb] + cod_info.subblock_gain[cod_info.window[sfb]] == 0) {
        return false;
      }
    }
    return true;
  }
  function penalties(noise) {
    return Util.FAST_LOG10(0.368 + 0.632 * noise * noise * noise);
  }
  function get_klemm_noise(distort, gi) {
    var klemm_noise = 1e-37;
    for (var sfb = 0; sfb < gi.psymax; sfb++) {
      klemm_noise += penalties(distort[sfb]);
    }
    return Math.max(1e-20, klemm_noise);
  }
  function quant_compare(quant_comp, best, calc, gi, distort) {
    var better;
    switch (quant_comp) {
      default:
      case 9: {
        if (best.over_count > 0) {
          better = calc.over_SSD <= best.over_SSD;
          if (calc.over_SSD == best.over_SSD)
            better = calc.bits < best.bits;
        } else {
          better = calc.max_noise < 0 && calc.max_noise * 10 + calc.bits <= best.max_noise * 10 + best.bits;
        }
        break;
      }
      case 0:
        better = calc.over_count < best.over_count || calc.over_count == best.over_count && calc.over_noise < best.over_noise || calc.over_count == best.over_count && BitStream.EQ(calc.over_noise, best.over_noise) && calc.tot_noise < best.tot_noise;
        break;
      case 8:
        calc.max_noise = get_klemm_noise(distort, gi);
      case 1:
        better = calc.max_noise < best.max_noise;
        break;
      case 2:
        better = calc.tot_noise < best.tot_noise;
        break;
      case 3:
        better = calc.tot_noise < best.tot_noise && calc.max_noise < best.max_noise;
        break;
      case 4:
        better = calc.max_noise <= 0 && best.max_noise > 0.2 || calc.max_noise <= 0 && best.max_noise < 0 && best.max_noise > calc.max_noise - 0.2 && calc.tot_noise < best.tot_noise || calc.max_noise <= 0 && best.max_noise > 0 && best.max_noise > calc.max_noise - 0.2 && calc.tot_noise < best.tot_noise + best.over_noise || calc.max_noise > 0 && best.max_noise > -0.05 && best.max_noise > calc.max_noise - 0.1 && calc.tot_noise + calc.over_noise < best.tot_noise + best.over_noise || calc.max_noise > 0 && best.max_noise > -0.1 && best.max_noise > calc.max_noise - 0.15 && calc.tot_noise + calc.over_noise + calc.over_noise < best.tot_noise + best.over_noise + best.over_noise;
        break;
      case 5:
        better = calc.over_noise < best.over_noise || BitStream.EQ(calc.over_noise, best.over_noise) && calc.tot_noise < best.tot_noise;
        break;
      case 6:
        better = calc.over_noise < best.over_noise || BitStream.EQ(calc.over_noise, best.over_noise) && (calc.max_noise < best.max_noise || BitStream.EQ(calc.max_noise, best.max_noise) && calc.tot_noise <= best.tot_noise);
        break;
      case 7:
        better = calc.over_count < best.over_count || calc.over_noise < best.over_noise;
        break;
    }
    if (best.over_count == 0) {
      better = better && calc.bits < best.bits;
    }
    return better;
  }
  function amp_scalefac_bands(gfp, cod_info, distort, xrpow, bRefine) {
    var gfc = gfp.internal_flags;
    var ifqstep34;
    if (cod_info.scalefac_scale == 0) {
      ifqstep34 = 1.2968395546510096;
    } else {
      ifqstep34 = 1.6817928305074292;
    }
    var trigger2 = 0;
    for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
      if (trigger2 < distort[sfb])
        trigger2 = distort[sfb];
    }
    var noise_shaping_amp = gfc.noise_shaping_amp;
    if (noise_shaping_amp == 3) {
      if (bRefine)
        noise_shaping_amp = 2;
      else
        noise_shaping_amp = 1;
    }
    switch (noise_shaping_amp) {
      case 2:
        break;
      case 1:
        if (trigger2 > 1)
          trigger2 = Math.pow(trigger2, 0.5);
        else
          trigger2 *= 0.95;
        break;
      case 0:
      default:
        if (trigger2 > 1)
          trigger2 = 1;
        else
          trigger2 *= 0.95;
        break;
    }
    var j = 0;
    for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
      var width = cod_info.width[sfb];
      var l;
      j += width;
      if (distort[sfb] < trigger2)
        continue;
      if ((gfc.substep_shaping & 2) != 0) {
        gfc.pseudohalf[sfb] = gfc.pseudohalf[sfb] == 0 ? 1 : 0;
        if (gfc.pseudohalf[sfb] == 0 && gfc.noise_shaping_amp == 2)
          return;
      }
      cod_info.scalefac[sfb]++;
      for (l = -width; l < 0; l++) {
        xrpow[j + l] *= ifqstep34;
        if (xrpow[j + l] > cod_info.xrpow_max)
          cod_info.xrpow_max = xrpow[j + l];
      }
      if (gfc.noise_shaping_amp == 2)
        return;
    }
  }
  function inc_scalefac_scale(cod_info, xrpow) {
    var ifqstep34 = 1.2968395546510096;
    var j = 0;
    for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
      var width = cod_info.width[sfb];
      var s = cod_info.scalefac[sfb];
      if (cod_info.preflag != 0)
        s += qupvt.pretab[sfb];
      j += width;
      if ((s & 1) != 0) {
        s++;
        for (var l = -width; l < 0; l++) {
          xrpow[j + l] *= ifqstep34;
          if (xrpow[j + l] > cod_info.xrpow_max) {
            cod_info.xrpow_max = xrpow[j + l];
          }
        }
      }
      cod_info.scalefac[sfb] = s >> 1;
    }
    cod_info.preflag = 0;
    cod_info.scalefac_scale = 1;
  }
  function inc_subblock_gain(gfc, cod_info, xrpow) {
    var sfb;
    var scalefac = cod_info.scalefac;
    for (sfb = 0; sfb < cod_info.sfb_lmax; sfb++) {
      if (scalefac[sfb] >= 16)
        return true;
    }
    for (var window2 = 0; window2 < 3; window2++) {
      var s1 = 0;
      var s2 = 0;
      for (sfb = cod_info.sfb_lmax + window2; sfb < cod_info.sfbdivide; sfb += 3) {
        if (s1 < scalefac[sfb])
          s1 = scalefac[sfb];
      }
      for (; sfb < cod_info.sfbmax; sfb += 3) {
        if (s2 < scalefac[sfb])
          s2 = scalefac[sfb];
      }
      if (s1 < 16 && s2 < 8)
        continue;
      if (cod_info.subblock_gain[window2] >= 7)
        return true;
      cod_info.subblock_gain[window2]++;
      var j = gfc.scalefac_band.l[cod_info.sfb_lmax];
      for (sfb = cod_info.sfb_lmax + window2; sfb < cod_info.sfbmax; sfb += 3) {
        var amp;
        var width = cod_info.width[sfb];
        var s = scalefac[sfb];
        s = s - (4 >> cod_info.scalefac_scale);
        if (s >= 0) {
          scalefac[sfb] = s;
          j += width * 3;
          continue;
        }
        scalefac[sfb] = 0;
        {
          var gain = 210 + (s << cod_info.scalefac_scale + 1);
          amp = qupvt.IPOW20(gain);
        }
        j += width * (window2 + 1);
        for (var l = -width; l < 0; l++) {
          xrpow[j + l] *= amp;
          if (xrpow[j + l] > cod_info.xrpow_max) {
            cod_info.xrpow_max = xrpow[j + l];
          }
        }
        j += width * (3 - window2 - 1);
      }
      {
        var amp = qupvt.IPOW20(202);
        j += cod_info.width[sfb] * (window2 + 1);
        for (var l = -cod_info.width[sfb]; l < 0; l++) {
          xrpow[j + l] *= amp;
          if (xrpow[j + l] > cod_info.xrpow_max) {
            cod_info.xrpow_max = xrpow[j + l];
          }
        }
      }
    }
    return false;
  }
  function balance_noise(gfp, cod_info, distort, xrpow, bRefine) {
    var gfc = gfp.internal_flags;
    amp_scalefac_bands(gfp, cod_info, distort, xrpow, bRefine);
    var status = loop_break(cod_info);
    if (status)
      return false;
    if (gfc.mode_gr == 2)
      status = tk.scale_bitcount(cod_info);
    else
      status = tk.scale_bitcount_lsf(gfc, cod_info);
    if (!status)
      return true;
    if (gfc.noise_shaping > 1) {
      Arrays$1.fill(gfc.pseudohalf, 0);
      if (cod_info.scalefac_scale == 0) {
        inc_scalefac_scale(cod_info, xrpow);
        status = false;
      } else {
        if (cod_info.block_type == Encoder.SHORT_TYPE && gfc.subblock_gain > 0) {
          status = inc_subblock_gain(gfc, cod_info, xrpow) || loop_break(cod_info);
        }
      }
    }
    if (!status) {
      if (gfc.mode_gr == 2)
        status = tk.scale_bitcount(cod_info);
      else
        status = tk.scale_bitcount_lsf(gfc, cod_info);
    }
    return !status;
  }
  this.outer_loop = function(gfp, cod_info, l3_xmin, xrpow, ch, targ_bits) {
    var gfc = gfp.internal_flags;
    var cod_info_w = new GrInfo();
    var save_xrpow = new_float(576);
    var distort = new_float(L3Side$1.SFBMAX);
    var best_noise_info = new CalcNoiseResult$1();
    var better;
    var prev_noise = new CalcNoiseData();
    var best_part2_3_length = 9999999;
    var bEndOfSearch = false;
    var bRefine = false;
    var best_ggain_pass1 = 0;
    bin_search_StepSize(gfc, cod_info, targ_bits, ch, xrpow);
    if (gfc.noise_shaping == 0) {
      return 100;
    }
    qupvt.calc_noise(cod_info, l3_xmin, distort, best_noise_info, prev_noise);
    best_noise_info.bits = cod_info.part2_3_length;
    cod_info_w.assign(cod_info);
    var age = 0;
    System$1.arraycopy(xrpow, 0, save_xrpow, 0, 576);
    while (!bEndOfSearch) {
      do {
        var noise_info = new CalcNoiseResult$1();
        var search_limit;
        var maxggain = 255;
        if ((gfc.substep_shaping & 2) != 0) {
          search_limit = 20;
        } else {
          search_limit = 3;
        }
        if (gfc.sfb21_extra) {
          if (distort[cod_info_w.sfbmax] > 1)
            break;
          if (cod_info_w.block_type == Encoder.SHORT_TYPE && (distort[cod_info_w.sfbmax + 1] > 1 || distort[cod_info_w.sfbmax + 2] > 1)) {
            break;
          }
        }
        if (!balance_noise(gfp, cod_info_w, distort, xrpow, bRefine))
          break;
        if (cod_info_w.scalefac_scale != 0)
          maxggain = 254;
        var huff_bits = targ_bits - cod_info_w.part2_length;
        if (huff_bits <= 0)
          break;
        while ((cod_info_w.part2_3_length = tk.count_bits(
          gfc,
          xrpow,
          cod_info_w,
          prev_noise
        )) > huff_bits && cod_info_w.global_gain <= maxggain) {
          cod_info_w.global_gain++;
        }
        if (cod_info_w.global_gain > maxggain)
          break;
        if (best_noise_info.over_count == 0) {
          while ((cod_info_w.part2_3_length = tk.count_bits(
            gfc,
            xrpow,
            cod_info_w,
            prev_noise
          )) > best_part2_3_length && cod_info_w.global_gain <= maxggain) {
            cod_info_w.global_gain++;
          }
          if (cod_info_w.global_gain > maxggain)
            break;
        }
        qupvt.calc_noise(cod_info_w, l3_xmin, distort, noise_info, prev_noise);
        noise_info.bits = cod_info_w.part2_3_length;
        if (cod_info.block_type != Encoder.SHORT_TYPE) {
          better = gfp.quant_comp;
        } else
          better = gfp.quant_comp_short;
        better = quant_compare(
          better,
          best_noise_info,
          noise_info,
          cod_info_w,
          distort
        ) ? 1 : 0;
        if (better != 0) {
          best_part2_3_length = cod_info.part2_3_length;
          best_noise_info = noise_info;
          cod_info.assign(cod_info_w);
          age = 0;
          System$1.arraycopy(xrpow, 0, save_xrpow, 0, 576);
        } else {
          if (gfc.full_outer_loop == 0) {
            if (++age > search_limit && best_noise_info.over_count == 0)
              break;
            if (gfc.noise_shaping_amp == 3 && bRefine && age > 30)
              break;
            if (gfc.noise_shaping_amp == 3 && bRefine && cod_info_w.global_gain - best_ggain_pass1 > 15) {
              break;
            }
          }
        }
      } while (cod_info_w.global_gain + cod_info_w.scalefac_scale < 255);
      if (gfc.noise_shaping_amp == 3) {
        if (!bRefine) {
          cod_info_w.assign(cod_info);
          System$1.arraycopy(save_xrpow, 0, xrpow, 0, 576);
          age = 0;
          best_ggain_pass1 = cod_info_w.global_gain;
          bRefine = true;
        } else {
          bEndOfSearch = true;
        }
      } else {
        bEndOfSearch = true;
      }
    }
    assert$3(cod_info.global_gain + cod_info.scalefac_scale <= 255);
    if (gfp.VBR == VbrMode$1.vbr_rh || gfp.VBR == VbrMode$1.vbr_mtrh) {
      System$1.arraycopy(save_xrpow, 0, xrpow, 0, 576);
    } else if ((gfc.substep_shaping & 1) != 0) {
      trancate_smallspectrums(gfc, cod_info, l3_xmin, xrpow);
    }
    return best_noise_info.over_count;
  };
  this.iteration_finish_one = function(gfc, gr, ch) {
    var l3_side = gfc.l3_side;
    var cod_info = l3_side.tt[gr][ch];
    tk.best_scalefac_store(gfc, gr, ch, l3_side);
    if (gfc.use_best_huffman == 1)
      tk.best_huffman_divide(gfc, cod_info);
    rv.ResvAdjust(gfc, cod_info);
  };
  this.VBR_encode_granule = function(gfp, cod_info, l3_xmin, xrpow, ch, min_bits, max_bits) {
    var gfc = gfp.internal_flags;
    var bst_cod_info = new GrInfo();
    var bst_xrpow = new_float(576);
    var Max_bits = max_bits;
    var real_bits = max_bits + 1;
    var this_bits = (max_bits + min_bits) / 2;
    var dbits;
    var over;
    var found = 0;
    var sfb21_extra = gfc.sfb21_extra;
    assert$3(Max_bits <= LameInternalFlags.MAX_BITS_PER_CHANNEL);
    Arrays$1.fill(bst_cod_info.l3_enc, 0);
    do {
      if (this_bits > Max_bits - 42)
        gfc.sfb21_extra = false;
      else
        gfc.sfb21_extra = sfb21_extra;
      over = outer_loop(gfp, cod_info, l3_xmin, xrpow, ch, this_bits);
      if (over <= 0) {
        found = 1;
        real_bits = cod_info.part2_3_length;
        bst_cod_info.assign(cod_info);
        System$1.arraycopy(xrpow, 0, bst_xrpow, 0, 576);
        max_bits = real_bits - 32;
        dbits = max_bits - min_bits;
        this_bits = (max_bits + min_bits) / 2;
      } else {
        min_bits = this_bits + 32;
        dbits = max_bits - min_bits;
        this_bits = (max_bits + min_bits) / 2;
        if (found != 0) {
          found = 2;
          cod_info.assign(bst_cod_info);
          System$1.arraycopy(bst_xrpow, 0, xrpow, 0, 576);
        }
      }
    } while (dbits > 12);
    gfc.sfb21_extra = sfb21_extra;
    if (found == 2) {
      System$1.arraycopy(bst_cod_info.l3_enc, 0, cod_info.l3_enc, 0, 576);
    }
    assert$3(cod_info.part2_3_length <= Max_bits);
  };
  this.get_framebits = function(gfp, frameBits) {
    var gfc = gfp.internal_flags;
    gfc.bitrate_index = gfc.VBR_min_bitrate;
    var bitsPerFrame = bs.getframebits(gfp);
    gfc.bitrate_index = 1;
    bitsPerFrame = bs.getframebits(gfp);
    for (var i = 1; i <= gfc.VBR_max_bitrate; i++) {
      gfc.bitrate_index = i;
      var mb = new MeanBits(bitsPerFrame);
      frameBits[i] = rv.ResvFrameBegin(gfp, mb);
      bitsPerFrame = mb.bits;
    }
  };
  this.VBR_old_prepare = function(gfp, pe, ms_ener_ratio, ratio, l3_xmin, frameBits, min_bits, max_bits, bands) {
    var gfc = gfp.internal_flags;
    var masking_lower_db;
    var adjust = 0;
    var analog_silence = 1;
    var bits = 0;
    gfc.bitrate_index = gfc.VBR_max_bitrate;
    var avg = rv.ResvFrameBegin(gfp, new MeanBits(0)) / gfc.mode_gr;
    get_framebits(gfp, frameBits);
    for (var gr = 0; gr < gfc.mode_gr; gr++) {
      var mxb = qupvt.on_pe(gfp, pe, max_bits[gr], avg, gr, 0);
      if (gfc.mode_ext == Encoder.MPG_MD_MS_LR) {
        ms_convert(gfc.l3_side, gr);
        qupvt.reduce_side(max_bits[gr], ms_ener_ratio[gr], avg, mxb);
      }
      for (var ch = 0; ch < gfc.channels_out; ++ch) {
        var cod_info = gfc.l3_side.tt[gr][ch];
        if (cod_info.block_type != Encoder.SHORT_TYPE) {
          adjust = 1.28 / (1 + Math.exp(3.5 - pe[gr][ch] / 300)) - 0.05;
          masking_lower_db = gfc.PSY.mask_adjust - adjust;
        } else {
          adjust = 2.56 / (1 + Math.exp(3.5 - pe[gr][ch] / 300)) - 0.14;
          masking_lower_db = gfc.PSY.mask_adjust_short - adjust;
        }
        gfc.masking_lower = Math.pow(10, masking_lower_db * 0.1);
        init_outer_loop(gfc, cod_info);
        bands[gr][ch] = qupvt.calc_xmin(
          gfp,
          ratio[gr][ch],
          cod_info,
          l3_xmin[gr][ch]
        );
        if (bands[gr][ch] != 0)
          analog_silence = 0;
        min_bits[gr][ch] = 126;
        bits += max_bits[gr][ch];
      }
    }
    for (var gr = 0; gr < gfc.mode_gr; gr++) {
      for (var ch = 0; ch < gfc.channels_out; ch++) {
        if (bits > frameBits[gfc.VBR_max_bitrate]) {
          max_bits[gr][ch] *= frameBits[gfc.VBR_max_bitrate];
          max_bits[gr][ch] /= bits;
        }
        if (min_bits[gr][ch] > max_bits[gr][ch]) {
          min_bits[gr][ch] = max_bits[gr][ch];
        }
      }
    }
    return analog_silence;
  };
  this.bitpressure_strategy = function(gfc, l3_xmin, min_bits, max_bits) {
    for (var gr = 0; gr < gfc.mode_gr; gr++) {
      for (var ch = 0; ch < gfc.channels_out; ch++) {
        var gi = gfc.l3_side.tt[gr][ch];
        var pxmin = l3_xmin[gr][ch];
        var pxminPos = 0;
        for (var sfb = 0; sfb < gi.psy_lmax; sfb++) {
          pxmin[pxminPos++] *= 1 + 0.029 * sfb * sfb / Encoder.SBMAX_l / Encoder.SBMAX_l;
        }
        if (gi.block_type == Encoder.SHORT_TYPE) {
          for (var sfb = gi.sfb_smin; sfb < Encoder.SBMAX_s; sfb++) {
            pxmin[pxminPos++] *= 1 + 0.029 * sfb * sfb / Encoder.SBMAX_s / Encoder.SBMAX_s;
            pxmin[pxminPos++] *= 1 + 0.029 * sfb * sfb / Encoder.SBMAX_s / Encoder.SBMAX_s;
            pxmin[pxminPos++] *= 1 + 0.029 * sfb * sfb / Encoder.SBMAX_s / Encoder.SBMAX_s;
          }
        }
        max_bits[gr][ch] = 0 | Math.max(min_bits[gr][ch], 0.9 * max_bits[gr][ch]);
      }
    }
  };
  this.VBR_new_prepare = function(gfp, pe, ratio, l3_xmin, frameBits, max_bits) {
    var gfc = gfp.internal_flags;
    var analog_silence = 1;
    var avg = 0;
    var bits = 0;
    var maximum_framebits;
    if (!gfp.free_format) {
      gfc.bitrate_index = gfc.VBR_max_bitrate;
      var mb = new MeanBits(avg);
      rv.ResvFrameBegin(gfp, mb);
      avg = mb.bits;
      get_framebits(gfp, frameBits);
      maximum_framebits = frameBits[gfc.VBR_max_bitrate];
    } else {
      gfc.bitrate_index = 0;
      var mb = new MeanBits(avg);
      maximum_framebits = rv.ResvFrameBegin(gfp, mb);
      avg = mb.bits;
      frameBits[0] = maximum_framebits;
    }
    for (var gr = 0; gr < gfc.mode_gr; gr++) {
      qupvt.on_pe(gfp, pe, max_bits[gr], avg, gr, 0);
      if (gfc.mode_ext == Encoder.MPG_MD_MS_LR) {
        ms_convert(gfc.l3_side, gr);
      }
      for (var ch = 0; ch < gfc.channels_out; ++ch) {
        var cod_info = gfc.l3_side.tt[gr][ch];
        gfc.masking_lower = Math.pow(10, gfc.PSY.mask_adjust * 0.1);
        init_outer_loop(gfc, cod_info);
        if (qupvt.calc_xmin(gfp, ratio[gr][ch], cod_info, l3_xmin[gr][ch]) != 0) {
          analog_silence = 0;
        }
        bits += max_bits[gr][ch];
      }
    }
    for (var gr = 0; gr < gfc.mode_gr; gr++) {
      for (var ch = 0; ch < gfc.channels_out; ch++) {
        if (bits > maximum_framebits) {
          max_bits[gr][ch] *= maximum_framebits;
          max_bits[gr][ch] /= bits;
        }
      }
    }
    return analog_silence;
  };
  this.calc_target_bits = function(gfp, pe, ms_ener_ratio, targ_bits, analog_silence_bits, max_frame_bits) {
    var gfc = gfp.internal_flags;
    var l3_side = gfc.l3_side;
    var res_factor;
    var gr;
    var ch;
    var totbits;
    var mean_bits = 0;
    gfc.bitrate_index = gfc.VBR_max_bitrate;
    var mb = new MeanBits(mean_bits);
    max_frame_bits[0] = rv.ResvFrameBegin(gfp, mb);
    mean_bits = mb.bits;
    gfc.bitrate_index = 1;
    mean_bits = bs.getframebits(gfp) - gfc.sideinfo_len * 8;
    analog_silence_bits[0] = mean_bits / (gfc.mode_gr * gfc.channels_out);
    mean_bits = gfp.VBR_mean_bitrate_kbps * gfp.framesize * 1e3;
    if ((gfc.substep_shaping & 1) != 0)
      mean_bits *= 1.09;
    mean_bits /= gfp.out_samplerate;
    mean_bits -= gfc.sideinfo_len * 8;
    mean_bits /= gfc.mode_gr * gfc.channels_out;
    res_factor = 0.93 + 0.07 * (11 - gfp.compression_ratio) / (11 - 5.5);
    if (res_factor < 0.9)
      res_factor = 0.9;
    if (res_factor > 1)
      res_factor = 1;
    for (gr = 0; gr < gfc.mode_gr; gr++) {
      var sum = 0;
      for (ch = 0; ch < gfc.channels_out; ch++) {
        targ_bits[gr][ch] = int(res_factor * mean_bits);
        if (pe[gr][ch] > 700) {
          var add_bits = int((pe[gr][ch] - 700) / 1.4);
          var cod_info = l3_side.tt[gr][ch];
          targ_bits[gr][ch] = int(res_factor * mean_bits);
          if (cod_info.block_type == Encoder.SHORT_TYPE) {
            if (add_bits < mean_bits / 2)
              add_bits = mean_bits / 2;
          }
          if (add_bits > mean_bits * 3 / 2)
            add_bits = mean_bits * 3 / 2;
          else if (add_bits < 0)
            add_bits = 0;
          targ_bits[gr][ch] += add_bits;
        }
        if (targ_bits[gr][ch] > LameInternalFlags.MAX_BITS_PER_CHANNEL) {
          targ_bits[gr][ch] = LameInternalFlags.MAX_BITS_PER_CHANNEL;
        }
        sum += targ_bits[gr][ch];
      }
      if (sum > LameInternalFlags.MAX_BITS_PER_GRANULE) {
        for (ch = 0; ch < gfc.channels_out; ++ch) {
          targ_bits[gr][ch] *= LameInternalFlags.MAX_BITS_PER_GRANULE;
          targ_bits[gr][ch] /= sum;
        }
      }
    }
    if (gfc.mode_ext == Encoder.MPG_MD_MS_LR) {
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        qupvt.reduce_side(
          targ_bits[gr],
          ms_ener_ratio[gr],
          mean_bits * gfc.channels_out,
          LameInternalFlags.MAX_BITS_PER_GRANULE
        );
      }
    }
    totbits = 0;
    for (gr = 0; gr < gfc.mode_gr; gr++) {
      for (ch = 0; ch < gfc.channels_out; ch++) {
        if (targ_bits[gr][ch] > LameInternalFlags.MAX_BITS_PER_CHANNEL) {
          targ_bits[gr][ch] = LameInternalFlags.MAX_BITS_PER_CHANNEL;
        }
        totbits += targ_bits[gr][ch];
      }
    }
    if (totbits > max_frame_bits[0]) {
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          targ_bits[gr][ch] *= max_frame_bits[0];
          targ_bits[gr][ch] /= totbits;
        }
      }
    }
  };
}
var assert$2 = common.assert;
function Reservoir() {
  var bs;
  this.setModules = function(_bs) {
    bs = _bs;
  };
  this.ResvFrameBegin = function(gfp, mean_bits) {
    var gfc = gfp.internal_flags;
    var maxmp3buf;
    var l3_side = gfc.l3_side;
    var frameLength = bs.getframebits(gfp);
    mean_bits.bits = (frameLength - gfc.sideinfo_len * 8) / gfc.mode_gr;
    var resvLimit = 8 * 256 * gfc.mode_gr - 8;
    if (gfp.brate > 320) {
      maxmp3buf = 8 * int(gfp.brate * 1e3 / (gfp.out_samplerate / 1152) / 8 + 0.5);
    } else {
      maxmp3buf = 8 * 1440;
      if (gfp.strict_ISO) {
        maxmp3buf = 8 * int(32e4 / (gfp.out_samplerate / 1152) / 8 + 0.5);
      }
    }
    gfc.ResvMax = maxmp3buf - frameLength;
    if (gfc.ResvMax > resvLimit)
      gfc.ResvMax = resvLimit;
    if (gfc.ResvMax < 0 || gfp.disable_reservoir)
      gfc.ResvMax = 0;
    var fullFrameBits = mean_bits.bits * gfc.mode_gr + Math.min(gfc.ResvSize, gfc.ResvMax);
    if (fullFrameBits > maxmp3buf)
      fullFrameBits = maxmp3buf;
    assert$2(gfc.ResvMax % 8 == 0);
    assert$2(gfc.ResvMax >= 0);
    l3_side.resvDrain_pre = 0;
    if (gfc.pinfo != null) {
      gfc.pinfo.mean_bits = mean_bits.bits / 2;
      gfc.pinfo.resvsize = gfc.ResvSize;
    }
    return fullFrameBits;
  };
  this.ResvMaxBits = function(gfp, mean_bits, targ_bits, cbr) {
    var gfc = gfp.internal_flags;
    var add_bits;
    var ResvSize = gfc.ResvSize;
    var ResvMax = gfc.ResvMax;
    if (cbr != 0)
      ResvSize += mean_bits;
    if ((gfc.substep_shaping & 1) != 0)
      ResvMax *= 0.9;
    targ_bits.bits = mean_bits;
    if (ResvSize * 10 > ResvMax * 9) {
      add_bits = ResvSize - ResvMax * 9 / 10;
      targ_bits.bits += add_bits;
      gfc.substep_shaping |= 128;
    } else {
      add_bits = 0;
      gfc.substep_shaping &= 127;
      if (!gfp.disable_reservoir && (gfc.substep_shaping & 1) == 0) {
        targ_bits.bits -= 0.1 * mean_bits;
      }
    }
    var extra_bits = ResvSize < gfc.ResvMax * 6 / 10 ? ResvSize : gfc.ResvMax * 6 / 10;
    extra_bits -= add_bits;
    if (extra_bits < 0)
      extra_bits = 0;
    return extra_bits;
  };
  this.ResvAdjust = function(gfc, gi) {
    gfc.ResvSize -= gi.part2_3_length + gi.part2_length;
  };
  this.ResvFrameEnd = function(gfc, mean_bits) {
    var over_bits;
    var l3_side = gfc.l3_side;
    gfc.ResvSize += mean_bits * gfc.mode_gr;
    var stuffingBits = 0;
    l3_side.resvDrain_post = 0;
    l3_side.resvDrain_pre = 0;
    if ((over_bits = gfc.ResvSize % 8) != 0)
      stuffingBits += over_bits;
    over_bits = gfc.ResvSize - stuffingBits - gfc.ResvMax;
    if (over_bits > 0) {
      stuffingBits += over_bits;
    }
    {
      var mdb_bytes = Math.min(l3_side.main_data_begin * 8, stuffingBits) / 8;
      l3_side.resvDrain_pre += 8 * mdb_bytes;
      stuffingBits -= 8 * mdb_bytes;
      gfc.ResvSize -= 8 * mdb_bytes;
      l3_side.main_data_begin -= mdb_bytes;
    }
    l3_side.resvDrain_post += stuffingBits;
    gfc.ResvSize -= stuffingBits;
  };
}
function Version() {
  var LAME_URL = "http://www.mp3dev.org/";
  var LAME_MAJOR_VERSION = 3;
  var LAME_MINOR_VERSION = 98;
  var LAME_PATCH_VERSION = 4;
  var PSY_MAJOR_VERSION = 0;
  var PSY_MINOR_VERSION = 93;
  this.getLameVersion = function() {
    return LAME_MAJOR_VERSION + "." + LAME_MINOR_VERSION + "." + LAME_PATCH_VERSION;
  };
  this.getLameShortVersion = function() {
    return LAME_MAJOR_VERSION + "." + LAME_MINOR_VERSION + "." + LAME_PATCH_VERSION;
  };
  this.getLameVeryShortVersion = function() {
    return "LAME" + LAME_MAJOR_VERSION + "." + LAME_MINOR_VERSION + "r";
  };
  this.getPsyVersion = function() {
    return PSY_MAJOR_VERSION + "." + PSY_MINOR_VERSION;
  };
  this.getLameUrl = function() {
    return LAME_URL;
  };
  this.getLameOsBitness = function() {
    return "32bits";
  };
}
var System = common.System;
var VbrMode = common.VbrMode;
var ShortBlock = common.ShortBlock;
var Arrays = common.Arrays;
var new_byte$1 = common.new_byte;
var assert$1 = common.assert;
VBRTag.NUMTOCENTRIES = 100;
VBRTag.MAXFRAMESIZE = 2880;
function VBRTag() {
  var lame;
  var bs;
  var v;
  this.setModules = function(_lame, _bs, _v) {
    lame = _lame;
    bs = _bs;
    v = _v;
  };
  var FRAMES_FLAG = 1;
  var BYTES_FLAG = 2;
  var TOC_FLAG = 4;
  var VBR_SCALE_FLAG = 8;
  var NUMTOCENTRIES = VBRTag.NUMTOCENTRIES;
  var MAXFRAMESIZE = VBRTag.MAXFRAMESIZE;
  var VBRHEADERSIZE = NUMTOCENTRIES + 4 + 4 + 4 + 4 + 4;
  var LAMEHEADERSIZE = VBRHEADERSIZE + 9 + 1 + 1 + 8 + 1 + 1 + 3 + 1 + 1 + 2 + 4 + 2 + 2;
  var XING_BITRATE1 = 128;
  var XING_BITRATE2 = 64;
  var XING_BITRATE25 = 32;
  var ISO_8859_1 = null;
  var VBRTag0 = "Xing";
  var VBRTag1 = "Info";
  var crc16Lookup = [
    0,
    49345,
    49537,
    320,
    49921,
    960,
    640,
    49729,
    50689,
    1728,
    1920,
    51009,
    1280,
    50625,
    50305,
    1088,
    52225,
    3264,
    3456,
    52545,
    3840,
    53185,
    52865,
    3648,
    2560,
    51905,
    52097,
    2880,
    51457,
    2496,
    2176,
    51265,
    55297,
    6336,
    6528,
    55617,
    6912,
    56257,
    55937,
    6720,
    7680,
    57025,
    57217,
    8e3,
    56577,
    7616,
    7296,
    56385,
    5120,
    54465,
    54657,
    5440,
    55041,
    6080,
    5760,
    54849,
    53761,
    4800,
    4992,
    54081,
    4352,
    53697,
    53377,
    4160,
    61441,
    12480,
    12672,
    61761,
    13056,
    62401,
    62081,
    12864,
    13824,
    63169,
    63361,
    14144,
    62721,
    13760,
    13440,
    62529,
    15360,
    64705,
    64897,
    15680,
    65281,
    16320,
    16e3,
    65089,
    64001,
    15040,
    15232,
    64321,
    14592,
    63937,
    63617,
    14400,
    10240,
    59585,
    59777,
    10560,
    60161,
    11200,
    10880,
    59969,
    60929,
    11968,
    12160,
    61249,
    11520,
    60865,
    60545,
    11328,
    58369,
    9408,
    9600,
    58689,
    9984,
    59329,
    59009,
    9792,
    8704,
    58049,
    58241,
    9024,
    57601,
    8640,
    8320,
    57409,
    40961,
    24768,
    24960,
    41281,
    25344,
    41921,
    41601,
    25152,
    26112,
    42689,
    42881,
    26432,
    42241,
    26048,
    25728,
    42049,
    27648,
    44225,
    44417,
    27968,
    44801,
    28608,
    28288,
    44609,
    43521,
    27328,
    27520,
    43841,
    26880,
    43457,
    43137,
    26688,
    30720,
    47297,
    47489,
    31040,
    47873,
    31680,
    31360,
    47681,
    48641,
    32448,
    32640,
    48961,
    32e3,
    48577,
    48257,
    31808,
    46081,
    29888,
    30080,
    46401,
    30464,
    47041,
    46721,
    30272,
    29184,
    45761,
    45953,
    29504,
    45313,
    29120,
    28800,
    45121,
    20480,
    37057,
    37249,
    20800,
    37633,
    21440,
    21120,
    37441,
    38401,
    22208,
    22400,
    38721,
    21760,
    38337,
    38017,
    21568,
    39937,
    23744,
    23936,
    40257,
    24320,
    40897,
    40577,
    24128,
    23040,
    39617,
    39809,
    23360,
    39169,
    22976,
    22656,
    38977,
    34817,
    18624,
    18816,
    35137,
    19200,
    35777,
    35457,
    19008,
    19968,
    36545,
    36737,
    20288,
    36097,
    19904,
    19584,
    35905,
    17408,
    33985,
    34177,
    17728,
    34561,
    18368,
    18048,
    34369,
    33281,
    17088,
    17280,
    33601,
    16640,
    33217,
    32897,
    16448
  ];
  function addVbr(v2, bitrate) {
    v2.nVbrNumFrames++;
    v2.sum += bitrate;
    v2.seen++;
    if (v2.seen < v2.want) {
      return;
    }
    if (v2.pos < v2.size) {
      v2.bag[v2.pos] = v2.sum;
      v2.pos++;
      v2.seen = 0;
    }
    if (v2.pos == v2.size) {
      for (var i = 1; i < v2.size; i += 2) {
        v2.bag[i / 2] = v2.bag[i];
      }
      v2.want *= 2;
      v2.pos /= 2;
    }
  }
  function xingSeekTable(v2, t) {
    if (v2.pos <= 0)
      return;
    for (var i = 1; i < NUMTOCENTRIES; ++i) {
      var j = i / NUMTOCENTRIES;
      var act;
      var sum;
      var indx = 0 | Math.floor(j * v2.pos);
      if (indx > v2.pos - 1)
        indx = v2.pos - 1;
      act = v2.bag[indx];
      sum = v2.sum;
      var seek_point = 0 | 256 * act / sum;
      if (seek_point > 255)
        seek_point = 255;
      t[i] = 255 & seek_point;
    }
  }
  this.addVbrFrame = function(gfp) {
    var gfc = gfp.internal_flags;
    var kbps = Tables.bitrate_table[gfp.version][gfc.bitrate_index];
    assert$1(gfc.VBR_seek_table.bag != null);
    addVbr(gfc.VBR_seek_table, kbps);
  };
  function extractInteger(buf, bufPos) {
    var x = buf[bufPos + 0] & 255;
    x <<= 8;
    x |= buf[bufPos + 1] & 255;
    x <<= 8;
    x |= buf[bufPos + 2] & 255;
    x <<= 8;
    x |= buf[bufPos + 3] & 255;
    return x;
  }
  function createInteger(buf, bufPos, value) {
    buf[bufPos + 0] = 255 & (value >> 24 & 255);
    buf[bufPos + 1] = 255 & (value >> 16 & 255);
    buf[bufPos + 2] = 255 & (value >> 8 & 255);
    buf[bufPos + 3] = 255 & (value & 255);
  }
  function createShort(buf, bufPos, value) {
    buf[bufPos + 0] = 255 & (value >> 8 & 255);
    buf[bufPos + 1] = 255 & (value & 255);
  }
  function isVbrTag(buf, bufPos) {
    return new String(buf, bufPos, VBRTag0.length(), ISO_8859_1).equals(VBRTag0) || new String(buf, bufPos, VBRTag1.length(), ISO_8859_1).equals(VBRTag1);
  }
  function shiftInBitsValue(x, n, v2) {
    return 255 & (x << n | v2 & ~(-1 << n));
  }
  function setLameTagFrameHeader(gfp, buffer) {
    var gfc = gfp.internal_flags;
    buffer[0] = shiftInBitsValue(buffer[0], 8, 255);
    buffer[1] = shiftInBitsValue(buffer[1], 3, 7);
    buffer[1] = shiftInBitsValue(
      buffer[1],
      1,
      gfp.out_samplerate < 16e3 ? 0 : 1
    );
    buffer[1] = shiftInBitsValue(buffer[1], 1, gfp.version);
    buffer[1] = shiftInBitsValue(buffer[1], 2, 4 - 3);
    buffer[1] = shiftInBitsValue(buffer[1], 1, !gfp.error_protection ? 1 : 0);
    buffer[2] = shiftInBitsValue(buffer[2], 4, gfc.bitrate_index);
    buffer[2] = shiftInBitsValue(buffer[2], 2, gfc.samplerate_index);
    buffer[2] = shiftInBitsValue(buffer[2], 1, 0);
    buffer[2] = shiftInBitsValue(buffer[2], 1, gfp.extension);
    buffer[3] = shiftInBitsValue(buffer[3], 2, gfp.mode.ordinal());
    buffer[3] = shiftInBitsValue(buffer[3], 2, gfc.mode_ext);
    buffer[3] = shiftInBitsValue(buffer[3], 1, gfp.copyright);
    buffer[3] = shiftInBitsValue(buffer[3], 1, gfp.original);
    buffer[3] = shiftInBitsValue(buffer[3], 2, gfp.emphasis);
    buffer[0] = 255;
    var abyte = 255 & (buffer[1] & 241);
    var bitrate;
    if (gfp.version == 1) {
      bitrate = XING_BITRATE1;
    } else {
      if (gfp.out_samplerate < 16e3)
        bitrate = XING_BITRATE25;
      else
        bitrate = XING_BITRATE2;
    }
    if (gfp.VBR == VbrMode.vbr_off)
      bitrate = gfp.brate;
    var bbyte;
    if (gfp.free_format)
      bbyte = 0;
    else {
      bbyte = 255 & 16 * lame.BitrateIndex(bitrate, gfp.version, gfp.out_samplerate);
    }
    if (gfp.version == 1) {
      buffer[1] = 255 & (abyte | 10);
      abyte = 255 & (buffer[2] & 13);
      buffer[2] = 255 & (bbyte | abyte);
    } else {
      buffer[1] = 255 & (abyte | 2);
      abyte = 255 & (buffer[2] & 13);
      buffer[2] = 255 & (bbyte | abyte);
    }
  }
  this.getVbrTag = function(buf) {
    var pTagData = new VBRTagData();
    var bufPos = 0;
    pTagData.flags = 0;
    var hId = buf[bufPos + 1] >> 3 & 1;
    var hSrIndex = buf[bufPos + 2] >> 2 & 3;
    var hMode = buf[bufPos + 3] >> 6 & 3;
    var hBitrate = buf[bufPos + 2] >> 4 & 15;
    hBitrate = Tables.bitrate_table[hId][hBitrate];
    if (buf[bufPos + 1] >> 4 == 14) {
      pTagData.samprate = Tables.samplerate_table[2][hSrIndex];
    } else
      pTagData.samprate = Tables.samplerate_table[hId][hSrIndex];
    if (hId != 0) {
      if (hMode != 3)
        bufPos += 32 + 4;
      else
        bufPos += 17 + 4;
    } else {
      if (hMode != 3)
        bufPos += 17 + 4;
      else
        bufPos += 9 + 4;
    }
    if (!isVbrTag(buf, bufPos))
      return null;
    bufPos += 4;
    pTagData.hId = hId;
    var head_flags = pTagData.flags = extractInteger(buf, bufPos);
    bufPos += 4;
    if ((head_flags & FRAMES_FLAG) != 0) {
      pTagData.frames = extractInteger(buf, bufPos);
      bufPos += 4;
    }
    if ((head_flags & BYTES_FLAG) != 0) {
      pTagData.bytes = extractInteger(buf, bufPos);
      bufPos += 4;
    }
    if ((head_flags & TOC_FLAG) != 0) {
      if (pTagData.toc != null) {
        for (var i = 0; i < NUMTOCENTRIES; i++) {
          pTagData.toc[i] = buf[bufPos + i];
        }
      }
      bufPos += NUMTOCENTRIES;
    }
    pTagData.vbrScale = -1;
    if ((head_flags & VBR_SCALE_FLAG) != 0) {
      pTagData.vbrScale = extractInteger(buf, bufPos);
      bufPos += 4;
    }
    pTagData.headersize = (hId + 1) * 72e3 * hBitrate / pTagData.samprate;
    bufPos += 21;
    var encDelay = buf[bufPos + 0] << 4;
    encDelay += buf[bufPos + 1] >> 4;
    var encPadding = (buf[bufPos + 1] & 15) << 8;
    encPadding += buf[bufPos + 2] & 255;
    if (encDelay < 0 || encDelay > 3e3)
      encDelay = -1;
    if (encPadding < 0 || encPadding > 3e3)
      encPadding = -1;
    pTagData.encDelay = encDelay;
    pTagData.encPadding = encPadding;
    return pTagData;
  };
  this.InitVbrTag = function(gfp) {
    var gfc = gfp.internal_flags;
    var kbps_header;
    if (gfp.version == 1) {
      kbps_header = XING_BITRATE1;
    } else {
      if (gfp.out_samplerate < 16e3)
        kbps_header = XING_BITRATE25;
      else
        kbps_header = XING_BITRATE2;
    }
    if (gfp.VBR == VbrMode.vbr_off)
      kbps_header = gfp.brate;
    var totalFrameSize = (gfp.version + 1) * 72e3 * kbps_header / gfp.out_samplerate;
    var headerSize = gfc.sideinfo_len + LAMEHEADERSIZE;
    gfc.VBR_seek_table.TotalFrameSize = totalFrameSize;
    if (totalFrameSize < headerSize || totalFrameSize > MAXFRAMESIZE) {
      gfp.bWriteVbrTag = false;
      return;
    }
    gfc.VBR_seek_table.nVbrNumFrames = 0;
    gfc.VBR_seek_table.nBytesWritten = 0;
    gfc.VBR_seek_table.sum = 0;
    gfc.VBR_seek_table.seen = 0;
    gfc.VBR_seek_table.want = 1;
    gfc.VBR_seek_table.pos = 0;
    if (gfc.VBR_seek_table.bag == null) {
      gfc.VBR_seek_table.bag = new int[400]();
      gfc.VBR_seek_table.size = 400;
    }
    var buffer = new_byte$1(MAXFRAMESIZE);
    setLameTagFrameHeader(gfp, buffer);
    var n = gfc.VBR_seek_table.TotalFrameSize;
    for (var i = 0; i < n; ++i) {
      bs.add_dummy_byte(gfp, buffer[i] & 255, 1);
    }
  };
  function crcUpdateLookup(value, crc) {
    var tmp = crc ^ value;
    crc = crc >> 8 ^ crc16Lookup[tmp & 255];
    return crc;
  }
  this.updateMusicCRC = function(crc, buffer, bufferPos, size2) {
    for (var i = 0; i < size2; ++i) {
      crc[0] = crcUpdateLookup(buffer[bufferPos + i], crc[0]);
    }
  };
  function putLameVBR(gfp, musicLength, streamBuffer, streamBufferPos, crc) {
    var gfc = gfp.internal_flags;
    var bytesWritten = 0;
    var encDelay = gfp.encoder_delay;
    var encPadding = gfp.encoder_padding;
    var quality = 100 - 10 * gfp.VBR_q - gfp.quality;
    var version2 = v.getLameVeryShortVersion();
    var vbr;
    var revision = 0;
    var revMethod;
    var vbrTypeTranslator = [1, 5, 3, 2, 4, 0, 3];
    var lowpass = 0 | (gfp.lowpassfreq / 100 + 0.5 > 255 ? 255 : gfp.lowpassfreq / 100 + 0.5);
    var peakSignalAmplitude = 0;
    var radioReplayGain = 0;
    var audiophileReplayGain = 0;
    var noiseShaping = gfp.internal_flags.noise_shaping;
    var stereoMode = 0;
    var nonOptimal = 0;
    var sourceFreq = 0;
    var misc = 0;
    var musicCRC = 0;
    var expNPsyTune = (gfp.exp_nspsytune & 1) != 0;
    var safeJoint = (gfp.exp_nspsytune & 2) != 0;
    var noGapMore = false;
    var noGapPrevious = false;
    var noGapCount = gfp.internal_flags.nogap_total;
    var noGapCurr = gfp.internal_flags.nogap_current;
    var athType = gfp.ATHtype;
    var flags = 0;
    var abrBitrate;
    switch (gfp.VBR) {
      case vbr_abr:
        abrBitrate = gfp.VBR_mean_bitrate_kbps;
        break;
      case vbr_off:
        abrBitrate = gfp.brate;
        break;
      default:
        abrBitrate = gfp.VBR_min_bitrate_kbps;
    }
    if (gfp.VBR.ordinal() < vbrTypeTranslator.length) {
      vbr = vbrTypeTranslator[gfp.VBR.ordinal()];
    } else
      vbr = 0;
    revMethod = 16 * revision + vbr;
    if (gfc.findReplayGain) {
      if (gfc.RadioGain > 510)
        gfc.RadioGain = 510;
      if (gfc.RadioGain < -510)
        gfc.RadioGain = -510;
      radioReplayGain = 8192;
      radioReplayGain |= 3072;
      if (gfc.RadioGain >= 0) {
        radioReplayGain |= gfc.RadioGain;
      } else {
        radioReplayGain |= 512;
        radioReplayGain |= -gfc.RadioGain;
      }
    }
    if (gfc.findPeakSample) {
      peakSignalAmplitude = Math.abs(
        0 | gfc.PeakSample / 32767 * Math.pow(2, 23) + 0.5
      );
    }
    if (noGapCount != -1) {
      if (noGapCurr > 0)
        noGapPrevious = true;
      if (noGapCurr < noGapCount - 1)
        noGapMore = true;
    }
    flags = athType + ((expNPsyTune ? 1 : 0) << 4) + ((safeJoint ? 1 : 0) << 5) + ((noGapMore ? 1 : 0) << 6) + ((noGapPrevious ? 1 : 0) << 7);
    if (quality < 0)
      quality = 0;
    switch (gfp.mode) {
      case MONO:
        stereoMode = 0;
        break;
      case STEREO:
        stereoMode = 1;
        break;
      case DUAL_CHANNEL:
        stereoMode = 2;
        break;
      case JOINT_STEREO:
        if (gfp.force_ms)
          stereoMode = 4;
        else
          stereoMode = 3;
        break;
      case NOT_SET:
      default:
        stereoMode = 7;
        break;
    }
    if (gfp.in_samplerate <= 32e3)
      sourceFreq = 0;
    else if (gfp.in_samplerate == 48e3)
      sourceFreq = 2;
    else if (gfp.in_samplerate > 48e3)
      sourceFreq = 3;
    else {
      sourceFreq = 1;
    }
    if (gfp.short_blocks == ShortBlock.short_block_forced || gfp.short_blocks == ShortBlock.short_block_dispensed || gfp.lowpassfreq == -1 && gfp.highpassfreq == -1 || gfp.scale_left < gfp.scale_right || gfp.scale_left > gfp.scale_right || gfp.disable_reservoir && gfp.brate < 320 || gfp.noATH || gfp.ATHonly || athType == 0 || gfp.in_samplerate <= 32e3) {
      nonOptimal = 1;
    }
    misc = noiseShaping + (stereoMode << 2) + (nonOptimal << 5) + (sourceFreq << 6);
    musicCRC = gfc.nMusicCRC;
    createInteger(streamBuffer, streamBufferPos + bytesWritten, quality);
    bytesWritten += 4;
    for (var j = 0; j < 9; j++) {
      streamBuffer[streamBufferPos + bytesWritten + j] = 255 & version2.charAt(j);
    }
    bytesWritten += 9;
    streamBuffer[streamBufferPos + bytesWritten] = 255 & revMethod;
    bytesWritten++;
    streamBuffer[streamBufferPos + bytesWritten] = 255 & lowpass;
    bytesWritten++;
    createInteger(
      streamBuffer,
      streamBufferPos + bytesWritten,
      peakSignalAmplitude
    );
    bytesWritten += 4;
    createShort(streamBuffer, streamBufferPos + bytesWritten, radioReplayGain);
    bytesWritten += 2;
    createShort(
      streamBuffer,
      streamBufferPos + bytesWritten,
      audiophileReplayGain
    );
    bytesWritten += 2;
    streamBuffer[streamBufferPos + bytesWritten] = 255 & flags;
    bytesWritten++;
    if (abrBitrate >= 255)
      streamBuffer[streamBufferPos + bytesWritten] = 255;
    else
      streamBuffer[streamBufferPos + bytesWritten] = 255 & abrBitrate;
    bytesWritten++;
    streamBuffer[streamBufferPos + bytesWritten] = 255 & encDelay >> 4;
    streamBuffer[streamBufferPos + bytesWritten + 1] = 255 & (encDelay << 4) + (encPadding >> 8);
    streamBuffer[streamBufferPos + bytesWritten + 2] = 255 & encPadding;
    bytesWritten += 3;
    streamBuffer[streamBufferPos + bytesWritten] = 255 & misc;
    bytesWritten++;
    streamBuffer[streamBufferPos + bytesWritten++] = 0;
    createShort(streamBuffer, streamBufferPos + bytesWritten, gfp.preset);
    bytesWritten += 2;
    createInteger(streamBuffer, streamBufferPos + bytesWritten, musicLength);
    bytesWritten += 4;
    createShort(streamBuffer, streamBufferPos + bytesWritten, musicCRC);
    bytesWritten += 2;
    for (var i = 0; i < bytesWritten; i++) {
      crc = crcUpdateLookup(streamBuffer[streamBufferPos + i], crc);
    }
    createShort(streamBuffer, streamBufferPos + bytesWritten, crc);
    bytesWritten += 2;
    return bytesWritten;
  }
  function skipId3v2(fpStream) {
    fpStream.seek(0);
    var id3v2Header = new_byte$1(10);
    fpStream.readFully(id3v2Header);
    var id3v2TagSize;
    if (!new String(id3v2Header, "ISO-8859-1").startsWith("ID3")) {
      id3v2TagSize = ((id3v2Header[6] & 127) << 21 | (id3v2Header[7] & 127) << 14 | (id3v2Header[8] & 127) << 7 | id3v2Header[9] & 127) + id3v2Header.length;
    } else {
      id3v2TagSize = 0;
    }
    return id3v2TagSize;
  }
  this.getLameTagFrame = function(gfp, buffer) {
    var gfc = gfp.internal_flags;
    if (!gfp.bWriteVbrTag) {
      return 0;
    }
    if (gfc.Class_ID != Lame.LAME_ID) {
      return 0;
    }
    if (gfc.VBR_seek_table.pos <= 0) {
      return 0;
    }
    if (buffer.length < gfc.VBR_seek_table.TotalFrameSize) {
      return gfc.VBR_seek_table.TotalFrameSize;
    }
    Arrays.fill(buffer, 0, gfc.VBR_seek_table.TotalFrameSize, 0);
    setLameTagFrameHeader(gfp, buffer);
    var toc = new_byte$1(NUMTOCENTRIES);
    if (gfp.free_format) {
      for (var i = 1; i < NUMTOCENTRIES; ++i)
        toc[i] = 255 & 255 * i / 100;
    } else {
      xingSeekTable(gfc.VBR_seek_table, toc);
    }
    var streamIndex = gfc.sideinfo_len;
    if (gfp.error_protection)
      streamIndex -= 2;
    if (gfp.VBR == VbrMode.vbr_off) {
      buffer[streamIndex++] = 255 & VBRTag1.charAt(0);
      buffer[streamIndex++] = 255 & VBRTag1.charAt(1);
      buffer[streamIndex++] = 255 & VBRTag1.charAt(2);
      buffer[streamIndex++] = 255 & VBRTag1.charAt(3);
    } else {
      buffer[streamIndex++] = 255 & VBRTag0.charAt(0);
      buffer[streamIndex++] = 255 & VBRTag0.charAt(1);
      buffer[streamIndex++] = 255 & VBRTag0.charAt(2);
      buffer[streamIndex++] = 255 & VBRTag0.charAt(3);
    }
    createInteger(
      buffer,
      streamIndex,
      FRAMES_FLAG + BYTES_FLAG + TOC_FLAG + VBR_SCALE_FLAG
    );
    streamIndex += 4;
    createInteger(buffer, streamIndex, gfc.VBR_seek_table.nVbrNumFrames);
    streamIndex += 4;
    var streamSize = gfc.VBR_seek_table.nBytesWritten + gfc.VBR_seek_table.TotalFrameSize;
    createInteger(buffer, streamIndex, 0 | streamSize);
    streamIndex += 4;
    System.arraycopy(toc, 0, buffer, streamIndex, toc.length);
    streamIndex += toc.length;
    if (gfp.error_protection) {
      bs.CRC_writeheader(gfc, buffer);
    }
    var crc = 0;
    for (var i = 0; i < streamIndex; i++)
      crc = crcUpdateLookup(buffer[i], crc);
    streamIndex += putLameVBR(gfp, streamSize, buffer, streamIndex, crc);
    return gfc.VBR_seek_table.TotalFrameSize;
  };
  this.putVbrTag = function(gfp, stream) {
    var gfc = gfp.internal_flags;
    if (gfc.VBR_seek_table.pos <= 0)
      return -1;
    stream.seek(stream.length());
    if (stream.length() == 0)
      return -1;
    var id3v2TagSize = skipId3v2(stream);
    stream.seek(id3v2TagSize);
    var buffer = new_byte$1(MAXFRAMESIZE);
    var bytes = getLameTagFrame(gfp, buffer);
    if (bytes > buffer.length) {
      return -1;
    }
    if (bytes < 1) {
      return 0;
    }
    stream.write(buffer, 0, bytes);
    return 0;
  };
}
var new_byte = common.new_byte;
var assert = common.assert;
function GetAudio() {
  this.setModules = function(parse2, mpg2) {
  };
}
function Parse() {
  this.setModules = function(ver2, id32, pre2) {
  };
}
function MPGLib() {
}
function ID3Tag() {
  this.setModules = function(_bits, _ver) {
  };
}
function Mp3Encoder$1(channels, samplerate, kbps) {
  if (arguments.length != 3) {
    console.error("WARN: Mp3Encoder(channels, samplerate, kbps) not specified");
    channels = 1;
    samplerate = 44100;
    kbps = 128;
  }
  var lame = new Lame$1();
  var gaud = new GetAudio();
  var ga = new GainAnalysis$1();
  var bs = new BitStream$1();
  var p2 = new Presets();
  var qupvt = new QuantizePVT();
  var qu = new Quantize();
  var vbr = new VBRTag();
  var ver = new Version();
  var id3 = new ID3Tag();
  var rv = new Reservoir();
  var tak = new Takehiro();
  var parse = new Parse();
  var mpg = new MPGLib();
  lame.setModules(ga, bs, p2, qupvt, qu, vbr, ver, id3, mpg);
  bs.setModules(ga, mpg, ver, vbr);
  id3.setModules(bs, ver);
  p2.setModules(lame);
  qu.setModules(bs, rv, qupvt, tak);
  qupvt.setModules(tak, rv, lame.enc.psy);
  rv.setModules(bs);
  tak.setModules(qupvt);
  vbr.setModules(lame, bs, ver);
  gaud.setModules(parse, mpg);
  parse.setModules(ver, id3, p2);
  var gfp = lame.lame_init();
  gfp.num_channels = channels;
  gfp.in_samplerate = samplerate;
  gfp.brate = kbps;
  gfp.mode = MPEGMode.STEREO;
  gfp.quality = 3;
  gfp.bWriteVbrTag = false;
  gfp.disable_reservoir = true;
  gfp.write_id3tag_automatic = false;
  lame.lame_init_params(gfp);
  var maxSamples = 1152;
  var mp3buf_size = 0 | 1.25 * maxSamples + 7200;
  var mp3buf = new_byte(mp3buf_size);
  this.encodeBuffer = function(left, right) {
    if (channels == 1) {
      right = left;
    }
    assert(left.length == right.length);
    if (left.length > maxSamples) {
      maxSamples = left.length;
      mp3buf_size = 0 | 1.25 * maxSamples + 7200;
      mp3buf = new_byte(mp3buf_size);
    }
    var _sz = lame.lame_encode_buffer(
      gfp,
      left,
      right,
      left.length,
      mp3buf,
      0,
      mp3buf_size
    );
    return new Int8Array(mp3buf.subarray(0, _sz));
  };
  this.flush = function() {
    var _sz = lame.lame_encode_flush(gfp, mp3buf, 0, mp3buf_size);
    return new Int8Array(mp3buf.subarray(0, _sz));
  };
}
function fourccToInt(fourcc) {
  return fourcc.charCodeAt(0) << 24 | fourcc.charCodeAt(1) << 16 | fourcc.charCodeAt(2) << 8 | fourcc.charCodeAt(3);
}
fourccToInt("RIFF");
fourccToInt("WAVE");
fourccToInt("fmt ");
fourccToInt("data");
class Mp3Encoder {
  constructor(config) {
    this.bitRate = config.bitRate;
    this.sampleRate = config.sampleRate;
    this.dataBuffer = [];
    this.encoder = new Mp3Encoder$1(1, this.sampleRate, this.bitRate);
  }
  encode(arrayBuffer) {
    const maxSamples = 1152;
    const samples = this._convertBuffer(arrayBuffer);
    let remaining = samples.length;
    for (let i = 0; remaining >= 0; i += maxSamples) {
      const left = samples.subarray(i, i + maxSamples);
      const buffer = this.encoder.encodeBuffer(left);
      this.dataBuffer.push(new Int8Array(buffer));
      remaining -= maxSamples;
    }
  }
  finish() {
    this.dataBuffer.push(this.encoder.flush());
    const blob = new Blob(this.dataBuffer, { type: "audio/mp3" });
    this.dataBuffer = [];
    return {
      id: Date.now(),
      blob,
      url: URL.createObjectURL(blob)
    };
  }
  _floatTo16BitPCM(input, output) {
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 32768 : s * 32767;
    }
  }
  _convertBuffer(arrayBuffer) {
    const data = new Float32Array(arrayBuffer);
    const out = new Int16Array(arrayBuffer.length);
    this._floatTo16BitPCM(data, out);
    return out;
  }
}
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
  }
  start() {
    const constraints = {
      video: false,
      audio: {
        channelCount: 1,
        echoCancellation: false
      }
    };
    this.beforeRecording && this.beforeRecording("start recording");
    navigator.mediaDevices.getUserMedia(constraints).then(this._micCaptured.bind(this)).catch(this._micError.bind(this));
    this.isPause = false;
    this.isRecording = true;
    if (!this.lameEncoder) {
      this.lameEncoder = new Mp3Encoder(this.encoderOptions);
    }
  }
  stop() {
    this.stream.getTracks().forEach((track2) => track2.stop());
    this.input.disconnect();
    this.processor.disconnect();
    this.context.close();
    let record = null;
    record = this.lameEncoder.finish();
    record.duration = this.duration;
    this.records.push(record);
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
    this._duration = this.duration;
    this.isPause = true;
    this.pauseRecording && this.pauseRecording("pause recording");
  }
  _micCaptured(stream) {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.duration = this._duration;
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
var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");
function detectChrome() {
  if (isIOSChrome) {
    return true;
  } else if (isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && isOpera === false && isIEedge === false) {
    return true;
  } else {
    return false;
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
    droppedFiles: { type: Array, default: null },
    emojiDataSource: { type: String, default: void 0 }
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
      format: "mp3",
      activeUpOrDownEmojis: null,
      activeUpOrDownUsersTag: null,
      activeUpOrDownTemplatesText: null,
      emojisDB: new Database({ dataSource: this.emojiDataSource }),
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
          const offset = detectChrome() ? 0 : 1;
          this.getTextareaRef().setSelectionRange(
            this.cursorRangePosition + offset,
            this.cursorRangePosition + offset
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
      if (this.filteredEmojis.length)
        this.filteredEmojis = [];
      else if (this.filteredUsersTag.length)
        this.filteredUsersTag = [];
      else if (this.filteredTemplatesText.length) {
        this.filteredTemplatesText = [];
      } else
        this.resetMessage();
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
    updateActiveUpOrDown(event, direction) {
      if (this.filteredEmojis.length) {
        this.activeUpOrDownEmojis = direction;
        event.preventDefault();
      } else if (this.filteredUsersTag.length) {
        this.activeUpOrDownUsersTag = direction;
        event.preventDefault();
      } else if (this.filteredTemplatesText.length) {
        this.activeUpOrDownTemplatesText = direction;
        event.preventDefault();
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
    toggleRecorder(recording) {
      this.isRecording = recording;
      if (!this.recorder.isRecording) {
        setTimeout(() => this.recorder.start(), 200);
      } else {
        try {
          this.recorder.stop();
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
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
          _cache[15] || (_cache[15] = withKeys(($event) => $options.updateActiveUpOrDown($event, -1), ["up"])),
          _cache[16] || (_cache[16] = withKeys(($event) => $options.updateActiveUpOrDown($event, 1), ["down"]))
        ],
        onPaste: _cache[12] || (_cache[12] = (...args) => $options.onPasteImage && $options.onPasteImage(...args))
      }, null, 42, _hoisted_4$8),
      createBaseVNode("div", _hoisted_5$6, [
        $data.editedMessage._id ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "vac-svg-button",
          onClick: _cache[17] || (_cache[17] = (...args) => $options.resetMessage && $options.resetMessage(...args))
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
              "emoji-data-source": $props.emojiDataSource,
              onAddEmoji: $options.addEmoji,
              onOpenEmoji: _cache[18] || (_cache[18] = ($event) => $data.emojiOpened = $event)
            }, {
              "emoji-picker-icon": withCtx(() => [
                renderSlot(_ctx.$slots, "emoji-picker-icon")
              ]),
              _: 3
            }, 8, ["emoji-opened", "emoji-data-source", "onAddEmoji"])
          ])
        ])), [
          [_directive_click_outside, () => $data.emojiOpened = false]
        ]) : createCommentVNode("", true),
        $props.showFiles ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: "vac-svg-button",
          onClick: _cache[19] || (_cache[19] = (...args) => $options.launchFilePicker && $options.launchFilePicker(...args))
        }, [
          renderSlot(_ctx.$slots, "paperclip-icon", {}, () => [
            createVNode(_component_svg_icon, { name: "paperclip" })
          ])
        ])) : createCommentVNode("", true),
        $props.textareaActionEnabled ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: "vac-svg-button",
          onClick: _cache[20] || (_cache[20] = (...args) => $options.textareaActionHandler && $options.textareaActionHandler(...args))
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
          onChange: _cache[21] || (_cache[21] = ($event) => $options.onFileChange($event.target.files))
        }, null, 40, _hoisted_7$3)) : createCommentVNode("", true),
        $props.showSendIcon ? (openBlock(), createElementBlock("div", {
          key: 5,
          class: normalizeClass(["vac-svg-button", { "vac-send-disabled": $options.isMessageEmpty }]),
          onClick: _cache[22] || (_cache[22] = (...args) => $options.sendMessage && $options.sendMessage(...args))
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
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
    const ref = this.$refs["imageRef" + this.index];
    if (ref) {
      this.imageResponsive = {
        maxHeight: ref.clientWidth - 18,
        loaderTop: ref.clientHeight / 2 - 9
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
            fn: withCtx((data) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
              fn: withCtx((data) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
    hoverAudioProgress: { type: Boolean, required: true },
    emojiDataSource: { type: String, default: void 0 }
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
        const roomFooterRef = findParentBySelector(this.$el, "#room-footer");
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
                "emoji-data-source": $props.emojiDataSource,
                onAddEmoji: $options.sendMessageReaction,
                onOpenEmoji: $options.openEmoji
              }, createSlots({ _: 2 }, [
                renderList(_ctx.$slots, (idx, name) => {
                  return {
                    name,
                    fn: withCtx((data) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
                    ])
                  };
                })
              ]), 1032, ["style", "emoji-opened", "position-right", "message-id", "emoji-data-source", "onAddEmoji", "onOpenEmoji"])
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
      "Rooms object is not valid! Must contain at least roomId[String, Number], roomName[String] and users[Array]"
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
      "Participants object is not valid! Must contain at least _id[String, Number] and username[String]"
    );
  }
}
function messagesValidation(obj) {
  const messagesValidate = [
    { key: "_id", type: ["string", "number"] },
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
      "Messages object is not valid! Must contain at least _id[String, Number] and senderId[String, Number]"
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
    selectedMessages: { type: Array, default: () => [] },
    emojiDataSource: { type: String, default: void 0 }
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
              fn: withCtx((data) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
        $props.message.senderId !== $props.currentUserId ? renderSlot(_ctx.$slots, "message-avatar_" + $props.message._id, { key: 0 }, () => [
          $props.message.avatar ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "vac-avatar",
            style: normalizeStyle({ "background-image": `url('${$props.message.avatar}')` })
          }, null, 4)) : createCommentVNode("", true)
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
                  fn: withCtx((data) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                  fn: withCtx((data) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                  fn: withCtx((data) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                    fn: withCtx((data) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
              "emoji-data-source": $props.emojiDataSource,
              onUpdateMessageHover: _cache[2] || (_cache[2] = ($event) => $data.messageHover = $event),
              onUpdateOptionsOpened: _cache[3] || (_cache[3] = ($event) => $data.optionsOpened = $event),
              onUpdateEmojiOpened: _cache[4] || (_cache[4] = ($event) => $data.emojiOpened = $event),
              onMessageActionHandler: $options.messageActionHandler,
              onSendMessageReaction: $options.sendMessageReaction
            }, createSlots({ _: 2 }, [
              renderList(_ctx.$slots, (i, name) => {
                return {
                  name,
                  fn: withCtx((data) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
                  ])
                };
              })
            ]), 1032, ["current-user-id", "message", "message-actions", "show-reaction-emojis", "message-hover", "hover-message-id", "hover-audio-progress", "emoji-data-source", "onMessageActionHandler", "onSendMessageReaction"])
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
        $props.message.senderId === $props.currentUserId ? renderSlot(_ctx.$slots, "message-avatar_" + $props.message._id, { key: 2 }, () => [
          $props.message.avatar ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "vac-avatar vac-avatar-current",
            style: normalizeStyle({ "background-image": `url('${$props.message.avatar}')` })
          }, null, 4)) : createCommentVNode("", true)
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
    usernameOptions: { type: Object, required: true },
    emojiDataSource: { type: String, default: void 0 }
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
      const loader = this.$el.querySelector("#infinite-loader-messages");
      if (loader) {
        const options2 = {
          root: this.$el.querySelector("#messages-list"),
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
    onMessageAdded({ message, index, ref }) {
      if (index !== this.messages.length - 1)
        return;
      const autoScrollOffset = ref.offsetHeight + 60;
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
      if (this.showFiles) {
        this.droppedFiles = event.dataTransfer.files;
      }
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
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
            fn: withCtx((data) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                  fn: withCtx((data) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
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
                    "emoji-data-source": $props.emojiDataSource,
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
                        fn: withCtx((data) => [
                          renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
                        ])
                      };
                    })
                  ]), 1032, ["current-user-id", "message", "index", "messages", "edited-message-id", "message-actions", "room-users", "text-messages", "new-messages", "show-reaction-emojis", "show-new-messages-divider", "text-formatting", "link-options", "username-options", "message-selection-enabled", "selected-messages", "emoji-data-source", "onMessageAdded", "onMessageActionHandler", "onOpenFile", "onOpenUserTag", "onSendMessageReaction", "onSelectMessage", "onUnselectMessage"])
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
      "emoji-data-source": $props.emojiDataSource,
      onUpdateEditedMessageId: _cache[7] || (_cache[7] = ($event) => $data.editedMessageId = $event),
      onEditMessage: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("edit-message", $event)),
      onSendMessage: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("send-message", $event)),
      onTypingMessage: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("typing-message", $event)),
      onTextareaActionHandler: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("textarea-action-handler", $event))
    }, createSlots({ _: 2 }, [
      renderList(_ctx.$slots, (idx, name) => {
        return {
          name,
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
          ])
        };
      })
    ]), 1032, ["room", "room-id", "room-message", "text-messages", "show-send-icon", "show-files", "show-audio", "show-emojis", "show-footer", "accepted-files", "textarea-action-enabled", "textarea-auto-focus", "user-tags-enabled", "emojis-suggestion-enabled", "templates-text", "text-formatting", "link-options", "audio-bit-rate", "audio-sample-rate", "init-reply-message", "init-edit-message", "dropped-files", "emoji-data-source"])
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
      colorStarted: "#9ca6af",
      backgroundDeleted: "#dadfe2",
      backgroundSelected: "#c2dcf2",
      colorDeleted: "#757e85",
      colorUsername: "#9ca6af",
      colorTimestamp: "#828c94",
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
    "--chat-message-bg-color-date": message.backgroundDate,
    "--chat-message-color-date": message.colorDate,
    "--chat-message-bg-color-system": message.backgroundSystem,
    "--chat-message-color-system": message.colorSystem,
    "--chat-message-color": message.color,
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
var _style_0 = '.vac-fade-spinner-enter-from{opacity:0}.vac-fade-spinner-enter-active{transition:opacity .8s}.vac-fade-spinner-leave-active{transition:opacity .2s;opacity:0}.vac-fade-image-enter-from{opacity:0}.vac-fade-image-enter-active{transition:opacity 1s}.vac-fade-image-leave-active{transition:opacity .5s;opacity:0}.vac-fade-message-enter-from{opacity:0}.vac-fade-message-enter-active{transition:opacity .5s}.vac-fade-message-leave-active{transition:opacity .2s;opacity:0}.vac-slide-left-enter-active,.vac-slide-right-enter-active{transition:all .3s ease;transition-property:transform,opacity}.vac-slide-left-leave-active,.vac-slide-right-leave-active{transition:all .2s cubic-bezier(1,.5,.8,1)!important;transition-property:transform,opacity}.vac-slide-left-enter-from,.vac-slide-left-leave-to{transform:translate(10px);opacity:0}.vac-slide-right-enter-from,.vac-slide-right-leave-to{transform:translate(-10px);opacity:0}.vac-slide-up-enter-active{transition:all .3s ease}.vac-slide-up-leave-active{transition:all .2s cubic-bezier(1,.5,.8,1)}.vac-slide-up-enter-from,.vac-slide-up-leave-to{transform:translateY(10px);opacity:0}.vac-bounce-enter-active{animation:vac-bounce-in .5s}.vac-bounce-leave-active{animation:vac-bounce-in .3s reverse}@keyframes vac-bounce-in{0%{transform:scale(0)}50%{transform:scale(1.05)}to{transform:scale(1)}}.vac-fade-preview-enter{opacity:0}.vac-fade-preview-enter-active{transition:opacity .1s}.vac-fade-preview-leave-active{transition:opacity .2s;opacity:0}.vac-bounce-preview-enter-active{animation:vac-bounce-image-in .4s}.vac-bounce-preview-leave-active{animation:vac-bounce-image-in .3s reverse}@keyframes vac-bounce-image-in{0%{transform:scale(.6)}to{transform:scale(1)}}.vac-menu-list{border-radius:4px;display:block;cursor:pointer;background:var(--chat-dropdown-bg-color);padding:6px 0}.vac-menu-list :hover{background:var(--chat-dropdown-bg-color-hover);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-menu-list :not(:hover){transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-menu-item{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 1 100%;flex:1 1 100%;min-height:30px;padding:5px 16px;position:relative;white-space:nowrap;line-height:30px}.vac-menu-options{position:absolute;right:10px;top:20px;z-index:9999;min-width:150px;display:inline-block;border-radius:4px;font-size:14px;color:var(--chat-color);overflow-y:auto;overflow-x:hidden;contain:content;box-shadow:0 2px 2px -4px #0000001a,0 2px 2px 1px #0000001f,0 1px 8px 1px #0000001f}.vac-app-border{border:var(--chat-border-style)}.vac-app-border-t{border-top:var(--chat-border-style)}.vac-app-border-r{border-right:var(--chat-border-style)}.vac-app-border-b{border-bottom:var(--chat-border-style)}.vac-app-box-shadow{transition:all .5s;box-shadow:0 2px 2px -4px #0000001a,0 2px 2px 1px #0000001f,0 1px 8px 1px #0000001f}.vac-item-clickable{cursor:pointer}.vac-vertical-center{display:flex;align-items:center;height:100%}.vac-vertical-center .vac-vertical-container{width:100%;text-align:center}.vac-svg-button{max-height:30px;display:flex;cursor:pointer;transition:all .2s}.vac-svg-button:hover{transform:scale(1.1);opacity:.7}.vac-avatar{background-size:cover;background-position:center center;background-repeat:no-repeat;background-color:#ddd;height:42px;width:42px;min-height:42px;min-width:42px;margin-right:15px;border-radius:50%}.vac-blur-loading{filter:blur(3px)}.vac-badge-counter{height:13px;width:auto;min-width:13px;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:3px;font-size:11px;font-weight:500}.vac-text-ellipsis{width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-text-bold{font-weight:700}.vac-text-italic{font-style:italic}.vac-text-strike{text-decoration:line-through}.vac-text-underline{text-decoration:underline}.vac-text-inline-code{display:inline-block;font-size:12px;color:var(--chat-markdown-color);background:var(--chat-markdown-bg);border:1px solid var(--chat-markdown-border);border-radius:3px;margin:2px 0;padding:2px 3px}.vac-text-multiline-code{display:block;font-size:12px;color:var(--chat-markdown-color-multi);background:var(--chat-markdown-bg);border:1px solid var(--chat-markdown-border);border-radius:3px;margin:4px 0;padding:7px}.vac-text-tag{color:var(--chat-message-color-tag);cursor:pointer}.vac-file-container{display:flex;align-content:center;justify-content:center;flex-wrap:wrap;text-align:center;background:var(--chat-bg-color-input);border:var(--chat-border-style-input);border-radius:4px;padding:10px}.vac-file-container svg{height:28px;width:28px}.vac-file-container .vac-text-extension{font-size:12px;color:var(--chat-message-color-file-extension);margin-top:-2px}.vac-card-window{width:100%;display:block;max-width:100%;background:var(--chat-content-bg-color);color:var(--chat-color);overflow-wrap:break-word;white-space:normal;border:var(--chat-container-border);border-radius:var(--chat-container-border-radius);box-shadow:var(--chat-container-box-shadow);-webkit-tap-highlight-color:transparent}.vac-card-window *{font-family:inherit}.vac-card-window a{color:#0d579c;font-weight:500}.vac-card-window .vac-chat-container{height:100%;display:flex}.vac-card-window .vac-chat-container input{min-width:10px}.vac-card-window .vac-chat-container textarea,.vac-card-window .vac-chat-container input[type=text],.vac-card-window .vac-chat-container input[type=search]{-webkit-appearance:none}.vac-media-preview{position:fixed;top:0;left:0;z-index:99;width:100vw;height:100vh;display:flex;align-items:center;background-color:#000c;outline:none}.vac-media-preview .vac-media-preview-container{height:calc(100% - 140px);width:calc(100% - 80px);padding:70px 40px;margin:0 auto}.vac-media-preview .vac-image-preview{width:100%;height:100%;background-size:contain;background-repeat:no-repeat;background-position:center}.vac-media-preview video{width:100%;height:100%}.vac-media-preview .vac-svg-button{position:absolute;top:30px;right:30px;transform:scale(1.4)}@media only screen and (max-width: 768px){.vac-media-preview .vac-svg-button{top:20px;right:20px;transform:scale(1.2)}.vac-media-preview .vac-media-preview-container{width:calc(100% - 40px);padding:70px 20px}}.vac-col-messages{position:relative;height:100%;flex:1;overflow:hidden;display:flex;flex-flow:column}.vac-col-messages .vac-container-center{height:100%;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.vac-col-messages .vac-room-empty{font-size:14px;color:#9ca6af;font-style:italic;line-height:20px;white-space:pre-line}.vac-col-messages .vac-room-empty div{padding:0 10%}.vac-col-messages .vac-container-scroll{background:var(--chat-content-bg-color);flex:1;overflow-y:auto;margin-right:1px;margin-top:65px;-webkit-overflow-scrolling:touch}.vac-col-messages .vac-container-scroll.vac-scroll-smooth{scroll-behavior:smooth}.vac-col-messages .vac-messages-container{padding:0 5px 5px}.vac-col-messages .vac-text-started{font-size:14px;color:var(--chat-message-color-started);font-style:italic;text-align:center;margin-top:25px;margin-bottom:20px}.vac-col-messages .vac-icon-scroll{position:absolute;bottom:80px;right:20px;padding:8px;background:var(--chat-bg-scroll-icon);border-radius:50%;box-shadow:0 1px 1px -1px #0003,0 1px 1px #00000024,0 1px 2px #0000001f;display:flex;cursor:pointer;z-index:10}.vac-col-messages .vac-icon-scroll svg{height:25px;width:25px}.vac-col-messages .vac-messages-count{position:absolute;top:-8px;left:11px;background-color:var(--chat-message-bg-color-scroll-counter);color:var(--chat-message-color-scroll-counter)}.vac-col-messages .vac-messages-hidden{opacity:0}@media only screen and (max-width: 768px){.vac-col-messages .vac-container-scroll{margin-top:50px}.vac-col-messages .vac-text-started{margin-top:20px}.vac-col-messages .vac-icon-scroll{bottom:70px}}.vac-room-header{position:absolute;display:flex;align-items:center;height:64px;width:100%;z-index:10;margin-right:1px;background:var(--chat-header-bg-color);border-top-right-radius:var(--chat-container-border-radius)}.vac-room-header .vac-room-wrapper{display:flex;align-items:center;min-width:0;height:100%;width:100%;padding:0 16px}.vac-room-header .vac-toggle-button{margin-right:15px}.vac-room-header .vac-toggle-button svg{height:26px;width:26px}.vac-room-header .vac-rotate-icon{transform:rotate(180deg)!important}.vac-room-header .vac-rotate-icon-init{transform:rotate(360deg)}.vac-room-header .vac-info-wrapper,.vac-room-header .vac-room-selection{display:flex;align-items:center;min-width:0;width:100%;height:100%}.vac-room-header .vac-room-selection .vac-selection-button{padding:8px 16px;color:var(--chat-color-button);background-color:var(--chat-bg-color-button);border-radius:4px;margin-right:10px;cursor:pointer;transition:all .2s}.vac-room-header .vac-room-selection .vac-selection-button:hover{opacity:.7}.vac-room-header .vac-room-selection .vac-selection-button:active{opacity:.9}.vac-room-header .vac-room-selection .vac-selection-button .vac-selection-button-count{margin-left:6px;opacity:.9}.vac-room-header .vac-room-selection .vac-selection-cancel{display:flex;align-items:center;margin-left:auto;white-space:nowrap;color:var(--chat-color-button-clear);transition:all .2s}.vac-room-header .vac-room-selection .vac-selection-cancel:hover{opacity:.7}.vac-room-header .vac-room-name{font-size:17px;font-weight:500;line-height:22px;color:var(--chat-header-color-name)}.vac-room-header .vac-room-info{font-size:13px;line-height:18px;color:var(--chat-header-color-info)}.vac-room-header .vac-room-options{margin-left:auto}@media only screen and (max-width: 768px){.vac-room-header{height:50px}.vac-room-header .vac-room-wrapper{padding:0 10px}.vac-room-header .vac-room-name{font-size:16px;line-height:22px}.vac-room-header .vac-room-info{font-size:12px;line-height:16px}.vac-room-header .vac-avatar{height:37px;width:37px;min-height:37px;min-width:37px}}.vac-room-footer{width:100%;border-bottom-right-radius:4px;z-index:10}.vac-box-footer{display:flex;position:relative;background:var(--chat-footer-bg-color);padding:10px 8px}.vac-textarea{max-height:300px;overflow-y:auto;height:20px;width:100%;line-height:20px;outline:0;resize:none;border-radius:20px;padding:12px 16px;box-sizing:content-box;font-size:16px;background:var(--chat-bg-color-input);color:var(--chat-color);caret-color:var(--chat-color-caret);border:var(--chat-border-style-input)}.vac-textarea::placeholder{color:var(--chat-color-placeholder);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vac-textarea-outline{border:1px solid var(--chat-border-color-input-selected);box-shadow:inset 0 0 0 1px var(--chat-border-color-input-selected)}.vac-icon-textarea,.vac-icon-textarea-left{display:flex;align-items:center}.vac-icon-textarea svg,.vac-icon-textarea .vac-wrapper,.vac-icon-textarea-left svg,.vac-icon-textarea-left .vac-wrapper{margin:0 7px}.vac-icon-textarea{margin-left:5px}.vac-icon-textarea-left{display:flex;align-items:center;margin-right:5px}.vac-icon-textarea-left svg,.vac-icon-textarea-left .vac-wrapper{margin:0 7px}.vac-icon-textarea-left .vac-icon-microphone{fill:var(--chat-icon-color-microphone);margin:0 7px}.vac-icon-textarea-left .vac-dot-audio-record{height:15px;width:15px;border-radius:50%;background-color:var(--chat-message-bg-color-audio-record);animation:vac-scaling .8s ease-in-out infinite alternate}@keyframes vac-scaling{0%{transform:scale(1);opacity:.4}to{transform:scale(1.1);opacity:1}}.vac-icon-textarea-left .vac-dot-audio-record-time{font-size:16px;color:var(--chat-color);margin-left:8px;width:45px}.vac-icon-textarea-left .vac-icon-audio-stop,.vac-icon-textarea-left .vac-icon-audio-confirm{min-height:28px;min-width:28px}.vac-icon-textarea-left .vac-icon-audio-stop svg,.vac-icon-textarea-left .vac-icon-audio-confirm svg{min-height:28px;min-width:28px}.vac-icon-textarea-left .vac-icon-audio-stop{margin-right:20px}.vac-icon-textarea-left .vac-icon-audio-stop #vac-icon-close-outline{fill:var(--chat-icon-color-audio-cancel)}.vac-icon-textarea-left .vac-icon-audio-confirm{margin-right:3px;margin-left:12px}.vac-icon-textarea-left .vac-icon-audio-confirm #vac-icon-checkmark{fill:var(--chat-icon-color-audio-confirm)}.vac-send-disabled,.vac-send-disabled svg{cursor:none!important;pointer-events:none!important;transform:none!important}@media only screen and (max-width: 768px){.vac-room-footer{width:100%}.vac-box-footer{padding:7px 2px 7px 7px}.vac-box-footer.vac-box-footer-border{border-top:var(--chat-border-style-input)}.vac-textarea{padding:7px;line-height:18px}.vac-textarea::placeholder{color:transparent}.vac-icon-textarea svg,.vac-icon-textarea .vac-wrapper,.vac-icon-textarea-left svg,.vac-icon-textarea-left .vac-wrapper{margin:0 5px!important}}@media only screen and (max-height: 768px){.vac-textarea{max-height:120px}}.vac-emojis-container{width:calc(100% - 16px);padding:10px 8px;background:var(--chat-footer-bg-color);display:flex;align-items:center;overflow:auto}.vac-emojis-container .vac-emoji-element{padding:0 8px;font-size:30px;border-radius:4px;cursor:pointer;background:var(--chat-footer-bg-color-tag);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-emojis-container .vac-emoji-element-active{background:var(--chat-footer-bg-color-tag-active)}@media only screen and (max-width: 768px){.vac-emojis-container{width:calc(100% - 10px);padding:7px 5px}.vac-emojis-container .vac-emoji-element{padding:0 7px;font-size:26px}}.vac-reply-container{display:flex;padding:10px 10px 0;background:var(--chat-footer-bg-color);align-items:center;width:calc(100% - 20px)}.vac-reply-container .vac-reply-box{width:100%;overflow:hidden;background:var(--chat-footer-bg-color-reply);border-radius:4px;padding:8px 10px}.vac-reply-container .vac-reply-info{overflow:hidden}.vac-reply-container .vac-reply-username{color:var(--chat-message-color-reply-username);font-size:12px;line-height:15px;margin-bottom:2px}.vac-reply-container .vac-reply-content{font-size:12px;color:var(--chat-message-color-reply-content);white-space:pre-line}.vac-reply-container .vac-icon-reply{margin-left:10px}.vac-reply-container .vac-icon-reply svg{height:20px;width:20px}.vac-reply-container .vac-image-reply{max-height:100px;max-width:200px;margin:4px 10px 0 0;border-radius:4px}.vac-reply-container .vac-audio-reply{margin-right:10px}.vac-reply-container .vac-file-container{max-width:80px}@media only screen and (max-width: 768px){.vac-reply-container{padding:5px 8px;width:calc(100% - 16px)}}.vac-room-files-container{display:flex;align-items:center;padding:10px 6px 0;background:var(--chat-footer-bg-color)}.vac-room-files-container .vac-files-box{display:flex;overflow:auto;width:calc(100% - 30px)}.vac-room-files-container video{height:100px;border:var(--chat-border-style-input);border-radius:4px}.vac-room-files-container .vac-icon-close{margin-left:auto}.vac-room-files-container .vac-icon-close svg{height:20px;width:20px}@media only screen and (max-width: 768px){.vac-files-container{padding:6px 4px 4px 2px}}.vac-room-file-container{display:flex;position:relative;margin:0 4px}.vac-room-file-container .vac-message-image{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;height:100px;width:100px;border:var(--chat-border-style-input);border-radius:4px}.vac-room-file-container .vac-file-container{height:80px;width:80px}.vac-room-file-container .vac-icon-remove{position:absolute;top:6px;left:6px;z-index:10}.vac-room-file-container .vac-icon-remove svg{height:20px;width:20px;border-radius:50%}.vac-room-file-container .vac-icon-remove:before{content:" ";position:absolute;width:100%;height:100%;background:rgba(0,0,0,.5);border-radius:50%;z-index:-1}.vac-tags-container{display:flex;flex-direction:column;align-items:center;width:100%}.vac-tags-container .vac-tags-box{display:flex;width:100%;height:54px;overflow:hidden;cursor:pointer;background:var(--chat-footer-bg-color-tag);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-tags-container .vac-tags-box-active{background:var(--chat-footer-bg-color-tag-active)}.vac-tags-container .vac-tags-info{display:flex;overflow:hidden;padding:0 20px;align-items:center}.vac-tags-container .vac-tags-avatar{height:34px;width:34px;min-height:34px;min-width:34px}.vac-tags-container .vac-tags-username{font-size:14px}@media only screen and (max-width: 768px){.vac-tags-container .vac-tags-box{height:50px}.vac-tags-container .vac-tags-info{padding:0 12px}}.vac-template-container{display:flex;flex-direction:column;align-items:center;width:100%}.vac-template-container .vac-template-box{display:flex;width:100%;height:54px;overflow:hidden;cursor:pointer;background:var(--chat-footer-bg-color-tag);transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-template-container .vac-template-active{background:var(--chat-footer-bg-color-tag-active)}.vac-template-container .vac-template-info{display:flex;overflow:hidden;padding:0 20px;align-items:center}.vac-template-container .vac-template-tag{font-size:14px;font-weight:700;margin-right:10px}.vac-template-container .vac-template-text{font-size:14px}@media only screen and (max-width: 768px){.vac-template-container .vac-template-box{height:50px}.vac-template-container .vac-template-info{padding:0 12px}}.vac-rooms-container{display:flex;flex-flow:column;flex:0 0 25%;min-width:260px;max-width:500px;position:relative;background:var(--chat-sidemenu-bg-color);height:100%;border-top-left-radius:var(--chat-container-border-radius);border-bottom-left-radius:var(--chat-container-border-radius)}.vac-rooms-container.vac-rooms-container-full{flex:0 0 100%;max-width:100%}.vac-rooms-container .vac-rooms-empty{font-size:14px;color:#9ca6af;font-style:italic;text-align:center;margin:40px 0;line-height:20px;white-space:pre-line}.vac-rooms-container .vac-room-list{flex:1;position:relative;max-width:100%;cursor:pointer;padding:0 10px 5px;overflow-y:auto}.vac-rooms-container .vac-room-item{border-radius:8px;align-items:center;display:flex;flex:1 1 100%;margin-bottom:5px;padding:0 14px;position:relative;min-height:71px;transition:background-color .3s cubic-bezier(.25,.8,.5,1)}.vac-rooms-container .vac-room-item:hover{background:var(--chat-sidemenu-bg-color-hover)}.vac-rooms-container .vac-room-selected{color:var(--chat-sidemenu-color-active)!important;background:var(--chat-sidemenu-bg-color-active)!important}.vac-rooms-container .vac-room-selected:hover{background:var(--chat-sidemenu-bg-color-active)!important}@media only screen and (max-width: 768px){.vac-rooms-container .vac-room-list{padding:0 7px 5px}.vac-rooms-container .vac-room-item{min-height:60px;padding:0 8px}}.vac-room-container{display:flex;flex:1;align-items:center;width:100%}.vac-room-container .vac-name-container{flex:1}.vac-room-container .vac-title-container{display:flex;align-items:center;line-height:25px}.vac-room-container .vac-state-circle{width:9px;height:9px;border-radius:50%;background-color:var(--chat-room-color-offline);margin-right:6px;transition:.3s}.vac-room-container .vac-state-online{background-color:var(--chat-room-color-online)}.vac-room-container .vac-room-name{flex:1;color:var(--chat-room-color-username);font-weight:500}.vac-room-container .vac-text-date{margin-left:5px;font-size:11px;color:var(--chat-room-color-timestamp)}.vac-room-container .vac-text-last{display:flex;align-items:center;font-size:12px;line-height:19px;color:var(--chat-room-color-message)}.vac-room-container .vac-message-new{color:var(--chat-room-color-username);font-weight:500}.vac-room-container .vac-icon-check{display:flex;vertical-align:middle;height:14px;width:14px;margin-top:-2px;margin-right:2px}.vac-room-container .vac-icon-microphone{height:15px;width:15px;vertical-align:middle;margin:-3px 1px 0 -2px;fill:var(--chat-room-color-message)}.vac-room-container .vac-room-options-container{display:flex;margin-left:auto}.vac-room-container .vac-room-badge{background-color:var(--chat-room-bg-color-badge);color:var(--chat-room-color-badge);margin-left:5px}.vac-room-container .vac-list-room-options{height:19px;width:19px;align-items:center;margin-left:5px}.vac-box-empty{margin-top:10px}@media only screen and (max-width: 768px){.vac-box-empty{margin-top:7px}}.vac-box-search{position:sticky;display:flex;align-items:center;height:64px;padding:0 15px}.vac-box-search .vac-icon-search{display:flex;position:absolute;left:30px}.vac-box-search .vac-icon-search svg{width:18px;height:18px}.vac-box-search .vac-input{height:38px;width:100%;background:var(--chat-bg-color-input);color:var(--chat-color);font-size:15px;outline:0;caret-color:var(--chat-color-caret);padding:10px 10px 10px 40px;border:1px solid var(--chat-sidemenu-border-color-search);border-radius:20px}.vac-box-search .vac-input::placeholder{color:var(--chat-color-placeholder)}.vac-box-search .vac-add-icon{margin-left:auto;padding-left:10px}@media only screen and (max-width: 768px){.vac-box-search{height:58px}}.vac-message-wrapper .vac-card-info{border-radius:4px;text-align:center;margin:10px auto;font-size:12px;padding:4px;display:block;overflow-wrap:break-word;position:relative;white-space:normal;box-shadow:0 1px 1px -1px #0000001a,0 1px 1px -1px #0000001c,0 1px 2px -1px #0000001c}.vac-message-wrapper .vac-card-date{max-width:150px;font-weight:500;text-transform:uppercase;color:var(--chat-message-color-date);background-color:var(--chat-message-bg-color-date)}.vac-message-wrapper .vac-card-system{max-width:250px;padding:8px 4px;color:var(--chat-message-color-system);background-color:var(--chat-message-bg-color-system)}.vac-message-wrapper .vac-line-new{color:var(--chat-message-color-new-messages);position:relative;text-align:center;font-size:13px;padding:10px 0}.vac-message-wrapper .vac-line-new:after,.vac-message-wrapper .vac-line-new:before{border-top:1px solid var(--chat-message-color-new-messages);content:"";left:0;position:absolute;top:50%;width:calc(50% - 60px)}.vac-message-wrapper .vac-line-new:before{left:auto;right:0}.vac-message-wrapper .vac-message-box{display:flex;flex:0 0 50%;max-width:50%;justify-content:flex-start;line-height:1.4}.vac-message-wrapper .vac-avatar{height:28px;width:28px;min-height:28px;min-width:28px;margin:0 0 2px;align-self:flex-end}.vac-message-wrapper .vac-avatar-current-offset{margin-right:28px}.vac-message-wrapper .vac-avatar-offset{margin-left:28px}.vac-message-wrapper .vac-failure-container{position:relative;align-self:flex-end;height:20px;width:20px;margin:0 0 2px -4px;border-radius:50%;background-color:#f44336}.vac-message-wrapper .vac-failure-container.vac-failure-container-avatar{margin-right:6px}.vac-message-wrapper .vac-failure-container .vac-failure-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:15px;font-weight:700}.vac-message-wrapper .vac-message-container{position:relative;padding:2px 10px;align-items:end;min-width:100px;box-sizing:content-box}.vac-message-wrapper .vac-message-container-offset{margin-top:10px}.vac-message-wrapper .vac-offset-current{margin-left:50%;justify-content:flex-end}.vac-message-wrapper .vac-message-card{background-color:var(--chat-message-bg-color);color:var(--chat-message-color);border-radius:8px;font-size:14px;padding:6px 9px 3px;white-space:pre-line;max-width:100%;-webkit-transition-property:box-shadow,opacity;transition-property:box-shadow,opacity;transition:box-shadow .28s cubic-bezier(.4,0,.2,1);will-change:box-shadow;box-shadow:0 1px 1px -1px #0000001a,0 1px 1px -1px #0000001c,0 1px 2px -1px #0000001c}.vac-message-wrapper .vac-message-highlight{box-shadow:0 1px 2px -1px #0000001a,0 1px 2px -1px #0000001c,0 1px 5px -1px #0000001c}.vac-message-wrapper .vac-message-current{background-color:var(--chat-message-bg-color-me)!important}.vac-message-wrapper .vac-message-deleted{color:var(--chat-message-color-deleted)!important;font-size:13px!important;font-style:italic!important;background-color:var(--chat-message-bg-color-deleted)!important}.vac-message-wrapper .vac-message-selected{background-color:var(--chat-message-bg-color-selected)!important;transition:background-color .2s}.vac-message-wrapper .vac-message-image{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;height:250px;width:250px;max-width:100%;border-radius:4px;margin:4px auto 5px;transition:.4s filter linear}.vac-message-wrapper .vac-text-username{font-size:13px;color:var(--chat-message-color-username);margin-bottom:2px}.vac-message-wrapper .vac-username-reply{margin-bottom:5px}.vac-message-wrapper .vac-text-timestamp{font-size:10px;color:var(--chat-message-color-timestamp);text-align:right}.vac-message-wrapper .vac-progress-time{float:left;margin:-2px 0 0 40px;color:var(--chat-color);font-size:12px}.vac-message-wrapper .vac-icon-edited{-webkit-box-align:center;align-items:center;display:-webkit-inline-box;display:inline-flex;justify-content:center;letter-spacing:normal;line-height:1;text-indent:0;vertical-align:middle;margin:0 4px 2px}.vac-message-wrapper .vac-icon-edited svg{height:12px;width:12px}.vac-message-wrapper .vac-icon-check{height:14px;width:14px;vertical-align:middle;margin:-3px -3px 0 3px}@media only screen and (max-width: 768px){.vac-message-wrapper .vac-message-container{padding:2px 3px 1px}.vac-message-wrapper .vac-message-container-offset{margin-top:10px}.vac-message-wrapper .vac-message-box{flex:0 0 80%;max-width:80%}.vac-message-wrapper .vac-avatar{height:25px;width:25px;min-height:25px;min-width:25px;margin:0 6px 1px 0}.vac-message-wrapper .vac-avatar.vac-avatar-current{margin:0 0 1px 6px}.vac-message-wrapper .vac-avatar-current-offset{margin-right:31px}.vac-message-wrapper .vac-avatar-offset{margin-left:31px}.vac-message-wrapper .vac-failure-container{margin-left:2px}.vac-message-wrapper .vac-failure-container.vac-failure-container-avatar{margin-right:0}.vac-message-wrapper .vac-offset-current{margin-left:20%}.vac-message-wrapper .vac-progress-time{margin-left:37px}}.vac-audio-player{display:flex;margin:8px 0 5px}.vac-audio-player .vac-svg-button{max-width:18px;margin-left:7px}@media only screen and (max-width: 768px){.vac-audio-player{margin:4px 0 0}.vac-audio-player .vac-svg-button{max-width:16px;margin-left:5px}}.vac-player-bar{display:flex;align-items:center;max-width:calc(100% - 18px);margin-right:7px;margin-left:20px}.vac-player-bar .vac-player-progress{width:190px}.vac-player-bar .vac-player-progress .vac-line-container{position:relative;height:4px;border-radius:5px;background-color:var(--chat-message-bg-color-audio-line)}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-progress{position:absolute;height:inherit;background-color:var(--chat-message-bg-color-audio-progress);border-radius:inherit}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot{position:absolute;top:-5px;margin-left:-7px;height:14px;width:14px;border-radius:50%;background-color:var(--chat-message-bg-color-audio-progress-selector);transition:transform .25s}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot__active{transform:scale(1.2)}@media only screen and (max-width: 768px){.vac-player-bar{margin-right:5px}.vac-player-bar .vac-player-progress .vac-line-container{height:3px}.vac-player-bar .vac-player-progress .vac-line-container .vac-line-dot{height:12px;width:12px;top:-5px;margin-left:-5px}}.vac-message-actions-wrapper .vac-options-container{position:absolute;top:2px;right:10px;height:40px;width:70px;overflow:hidden;border-top-right-radius:8px}.vac-message-actions-wrapper .vac-blur-container{position:absolute;height:100%;width:100%;left:8px;bottom:10px;background:var(--chat-message-bg-color);filter:blur(3px);border-bottom-left-radius:8px}.vac-message-actions-wrapper .vac-options-me{background:var(--chat-message-bg-color-me)}.vac-message-actions-wrapper .vac-message-options{background:var(--chat-icon-bg-dropdown-message);border-radius:50%;position:absolute;top:7px;right:7px}.vac-message-actions-wrapper .vac-message-options svg{height:17px;width:17px;padding:5px;margin:-5px}.vac-message-actions-wrapper .vac-message-emojis{position:absolute;top:6px;right:30px}.vac-message-actions-wrapper .vac-menu-options{right:15px}.vac-message-actions-wrapper .vac-menu-left{right:-118px}@media only screen and (max-width: 768px){.vac-message-actions-wrapper .vac-options-container{right:3px}.vac-message-actions-wrapper .vac-menu-left{right:-50px}}.vac-message-files-container .vac-file-wrapper{position:relative;width:fit-content}.vac-message-files-container .vac-file-wrapper .vac-file-container{height:60px;width:60px;margin:3px 0 5px;cursor:pointer;transition:all .6s}.vac-message-files-container .vac-file-wrapper .vac-file-container:hover{opacity:.85}.vac-message-files-container .vac-file-wrapper .vac-file-container svg{height:30px;width:30px}.vac-message-files-container .vac-file-wrapper .vac-file-container.vac-file-container-progress{background-color:#0000004d}.vac-message-file-container{position:relative;z-index:0}.vac-message-file-container .vac-message-image-container{cursor:pointer}.vac-message-file-container .vac-image-buttons{position:absolute;width:100%;height:100%;border-radius:4px;background:linear-gradient(to bottom,rgba(0,0,0,0) 55%,rgba(0,0,0,.02) 60%,rgba(0,0,0,.05) 65%,rgba(0,0,0,.1) 70%,rgba(0,0,0,.2) 75%,rgba(0,0,0,.3) 80%,rgba(0,0,0,.5) 85%,rgba(0,0,0,.6) 90%,rgba(0,0,0,.7) 95%,rgba(0,0,0,.8) 100%)}.vac-message-file-container .vac-image-buttons svg{height:26px;width:26px}.vac-message-file-container .vac-image-buttons .vac-button-view,.vac-message-file-container .vac-image-buttons .vac-button-download{position:absolute;bottom:6px;left:7px}.vac-message-file-container .vac-image-buttons :first-child{left:40px}.vac-message-file-container .vac-image-buttons .vac-button-view{max-width:18px;bottom:8px}.vac-message-file-container .vac-video-container{width:350px;max-width:100%;margin:4px auto 5px;cursor:pointer}.vac-message-file-container .vac-video-container video{width:100%;height:100%;border-radius:4px}.vac-button-reaction{display:inline-flex;align-items:center;border:var(--chat-message-border-style-reaction);outline:none;background:var(--chat-message-bg-color-reaction);border-radius:4px;margin:4px 2px 0;transition:.3s;padding:0 5px;font-size:18px;line-height:23px}.vac-button-reaction span{font-size:11px;font-weight:500;min-width:7px;color:var(--chat-message-color-reaction-counter)}.vac-button-reaction:hover{border:var(--chat-message-border-style-reaction-hover);background:var(--chat-message-bg-color-reaction-hover);cursor:pointer}.vac-button-reaction.vac-reaction-me{border:var(--chat-message-border-style-reaction-me);background:var(--chat-message-bg-color-reaction-me)}.vac-button-reaction.vac-reaction-me span{color:var(--chat-message-color-reaction-counter-me)}.vac-button-reaction.vac-reaction-me:hover{border:var(--chat-message-border-style-reaction-hover-me);background:var(--chat-message-bg-color-reaction-hover-me)}.vac-reply-message{background:var(--chat-message-bg-color-reply);border-radius:4px;margin:-1px -5px 8px;padding:8px 10px}.vac-reply-message .vac-reply-username{color:var(--chat-message-color-reply-username);font-size:12px;line-height:15px;margin-bottom:2px}.vac-reply-message .vac-image-reply-container{width:70px}.vac-reply-message .vac-image-reply-container .vac-message-image-reply{height:70px;width:70px;margin:4px auto 3px}.vac-reply-message .vac-video-reply-container{width:200px;max-width:100%}.vac-reply-message .vac-video-reply-container video{width:100%;height:100%;border-radius:4px}.vac-reply-message .vac-reply-content{font-size:12px;color:var(--chat-message-color-reply-content)}.vac-reply-message .vac-file-container{height:60px;width:60px}.vac-emoji-wrapper{position:relative;display:flex}.vac-emoji-wrapper .vac-emoji-reaction svg{height:19px;width:19px}.vac-emoji-wrapper .vac-emoji-picker{position:absolute;z-index:9999;bottom:32px;right:10px;width:300px;padding-top:4px;overflow:scroll;box-sizing:border-box;border-radius:.5rem;background:var(--chat-emoji-bg-color);box-shadow:0 1px 2px -2px #0000001a,0 1px 2px -1px #0000001a,0 1px 2px 1px #0000001a;scrollbar-width:none}.vac-emoji-wrapper .vac-emoji-picker::-webkit-scrollbar{display:none}.vac-emoji-wrapper .vac-emoji-picker.vac-picker-reaction{position:fixed;top:initial;right:initial}.vac-emoji-wrapper .vac-emoji-picker emoji-picker{height:100%;width:100%;--emoji-size: 1.2rem;--background: var(--chat-emoji-bg-color);--emoji-padding: .4rem;--border-color: var(--chat-sidemenu-border-color-search);--button-hover-background: var(--chat-sidemenu-bg-color-hover);--button-active-background: var(--chat-sidemenu-bg-color-hover)}.vac-format-message-wrapper .vac-format-container{display:inline}.vac-format-message-wrapper .vac-icon-deleted{height:14px;width:14px;vertical-align:middle;margin:-2px 2px 0 0;fill:var(--chat-message-color-deleted)}.vac-format-message-wrapper .vac-icon-deleted.vac-icon-deleted-room{margin:-3px 1px 0 0;fill:var(--chat-room-color-message)}.vac-format-message-wrapper .vac-image-link-container{background-color:var(--chat-message-bg-color-media);padding:8px;margin:2px auto;border-radius:4px}.vac-format-message-wrapper .vac-image-link{position:relative;background-color:var(--chat-message-bg-color-image)!important;background-size:contain;background-position:center center!important;background-repeat:no-repeat!important;height:150px;width:150px;max-width:100%;border-radius:4px;margin:0 auto}.vac-format-message-wrapper .vac-image-link-message{max-width:166px;font-size:12px}.vac-loader-wrapper.vac-container-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9}.vac-loader-wrapper.vac-container-top{padding:21px}.vac-loader-wrapper.vac-container-top #vac-circle{height:20px;width:20px}.vac-loader-wrapper #vac-circle{margin:auto;height:28px;width:28px;border:3px rgba(0,0,0,.25) solid;border-top:3px var(--chat-color-spinner) solid;border-right:3px var(--chat-color-spinner) solid;border-bottom:3px var(--chat-color-spinner) solid;border-radius:50%;-webkit-animation:vac-spin 1s infinite linear;animation:vac-spin 1s infinite linear}@media only screen and (max-width: 768px){.vac-loader-wrapper #vac-circle{height:24px;width:24px}.vac-loader-wrapper.vac-container-top{padding:18px}.vac-loader-wrapper.vac-container-top #vac-circle{height:16px;width:16px}}@-webkit-keyframes vac-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes vac-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}#vac-icon-search{fill:var(--chat-icon-color-search)}#vac-icon-add{fill:var(--chat-icon-color-add)}#vac-icon-toggle{fill:var(--chat-icon-color-toggle)}#vac-icon-menu{fill:var(--chat-icon-color-menu)}#vac-icon-close{fill:var(--chat-icon-color-close)}#vac-icon-close-image{fill:var(--chat-icon-color-close-image)}#vac-icon-file{fill:var(--chat-icon-color-file)}#vac-icon-paperclip{fill:var(--chat-icon-color-paperclip)}#vac-icon-close-outline{fill:var(--chat-icon-color-close-outline)}#vac-icon-close-outline-preview{fill:var(--chat-icon-color-close-preview)}#vac-icon-send{fill:var(--chat-icon-color-send)}#vac-icon-send-disabled{fill:var(--chat-icon-color-send-disabled)}#vac-icon-emoji{fill:var(--chat-icon-color-emoji)}#vac-icon-emoji-reaction{fill:var(--chat-icon-color-emoji-reaction)}#vac-icon-document{fill:var(--chat-icon-color-document)}#vac-icon-pencil{fill:var(--chat-icon-color-pencil)}#vac-icon-checkmark,#vac-icon-double-checkmark{fill:var(--chat-icon-color-checkmark)}#vac-icon-checkmark-seen,#vac-icon-double-checkmark-seen{fill:var(--chat-icon-color-checkmark-seen)}#vac-icon-eye{fill:var(--chat-icon-color-eye)}#vac-icon-dropdown-message{fill:var(--chat-icon-color-dropdown-message)}#vac-icon-dropdown-room{fill:var(--chat-icon-color-dropdown-room)}#vac-icon-dropdown-scroll{fill:var(--chat-icon-color-dropdown-scroll)}#vac-icon-audio-play{fill:var(--chat-icon-color-audio-play)}#vac-icon-audio-pause{fill:var(--chat-icon-color-audio-pause)}.vac-progress-wrapper{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9}.vac-progress-wrapper circle{transition:stroke-dashoffset .35s;transform:rotate(-90deg);transform-origin:50% 50%}.vac-progress-wrapper .vac-progress-content{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:-1;margin-top:-2px;background-color:#000000b3;border-radius:50%}.vac-progress-wrapper .vac-progress-content .vac-progress-text{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-weight:700;color:#fff}.vac-progress-wrapper .vac-progress-content .vac-progress-text .vac-progress-pourcent{font-size:9px;font-weight:400}\n';
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
    },
    emojiDataSource: { type: String, default: void 0 }
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
            fn: withCtx((data) => [
              renderSlot(_ctx.$slots, el.slot, normalizeProps(guardReactiveProps(data)))
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
        "emoji-data-source": $props.emojiDataSource,
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
            fn: withCtx((data) => [
              renderSlot(_ctx.$slots, el.slot, normalizeProps(guardReactiveProps(data)))
            ])
          };
        })
      ]), 1032, ["current-user-id", "rooms", "room-id", "load-first-room", "messages", "room-message", "messages-loaded", "menu-actions", "message-actions", "message-selection-actions", "auto-scroll", "show-send-icon", "show-files", "show-audio", "audio-bit-rate", "audio-sample-rate", "show-emojis", "show-reaction-emojis", "show-new-messages-divider", "show-footer", "text-messages", "single-room", "show-rooms-list", "text-formatting", "link-options", "is-mobile", "loading-rooms", "room-info-enabled", "textarea-action-enabled", "textarea-auto-focus", "user-tags-enabled", "emojis-suggestion-enabled", "scroll-distance", "accepted-files", "templates-text", "username-options", "emoji-data-source", "onToggleRoomsList", "onRoomInfo", "onFetchMessages", "onSendMessage", "onEditMessage", "onDeleteMessage", "onOpenFile", "onOpenUserTag", "onOpenFailedMessage", "onMenuActionHandler", "onMessageActionHandler", "onMessageSelectionActionHandler", "onSendMessageReaction", "onTypingMessage", "onTextareaActionHandler"])
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
              fn: withCtx((data) => [
                renderSlot(_ctx.$slots, el.slot, normalizeProps(guardReactiveProps(data)))
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
export { VueAdvancedChat, register };
