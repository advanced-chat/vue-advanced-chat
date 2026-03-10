/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * Modified for Vue 3 from https://github.com/ndelvalle/v-click-outside
 * Cf. https://github.com/ndelvalle/v-click-outside/issues/238
 */
import type { ObjectDirective, DirectiveBinding } from 'vue'

const HANDLERS_PROPERTY = '__v-click-outside' as const
const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'

const IS_TOUCH =
  HAS_WINDOWS &&
  ('ontouchstart' in window || (HAS_NAVIGATOR && (navigator as any).msMaxTouchPoints > 0))

const EVENTS = IS_TOUCH ? ['touchstart'] : ['click']

type ClickOutsideHandler = (event: Event) => void
type ClickOutsideMiddleware = (event: Event) => boolean | Event

interface ClickOutsideBindingObject {
  handler: ClickOutsideHandler
  middleware?: ClickOutsideMiddleware
  events?: string[]
  isActive?: boolean
  detectIframe?: boolean
  capture?: boolean
}

type ClickOutsideBinding = ClickOutsideHandler | ClickOutsideBindingObject

interface NormalizedBinding {
  handler: ClickOutsideHandler
  middleware: ClickOutsideMiddleware
  events: string[]
  isActive: boolean
  detectIframe: boolean
  capture: boolean
}

interface ClickOutsideHandlerRecord {
  event: string
  srcTarget: EventTarget
  handler: (event: Event) => void
  capture: boolean
}

interface ClickOutsideElement extends HTMLElement {
  [HANDLERS_PROPERTY]?: ClickOutsideHandlerRecord[]
}

const processDirectiveArguments = (bindingValue: ClickOutsideBinding): NormalizedBinding => {
  const isFunction = typeof bindingValue === 'function'

  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error('v-click-outside: Binding value must be a function or an object')
  }

  const valueObject = (
    isFunction ? { handler: bindingValue } : bindingValue
  ) as ClickOutsideBindingObject

  return {
    handler: valueObject.handler,
    middleware: valueObject.middleware || ((item) => item),
    events: valueObject.events || EVENTS,
    isActive: !(valueObject.isActive === false),
    detectIframe: !(valueObject.detectIframe === false),
    capture: Boolean(valueObject.capture),
  }
}

const execHandler = ({
  event,
  handler,
  middleware,
}: {
  event: Event
  handler: ClickOutsideHandler
  middleware: ClickOutsideMiddleware
}) => {
  if (middleware(event)) {
    handler(event)
  }
}

const onFauxIframeClick = ({
  el,
  event,
  handler,
  middleware,
}: {
  el: ClickOutsideElement
  event: Event
  handler: ClickOutsideHandler
  middleware: ClickOutsideMiddleware
}) => {
  // Note: on firefox clicking on iframe triggers blur, but only on
  //       next event loop it becomes document.activeElement
  // https://stackoverflow.com/q/2381336#comment61192398_23231136
  setTimeout(() => {
    const { activeElement } = document
    if (activeElement && activeElement.tagName === 'IFRAME' && !el.contains(activeElement)) {
      execHandler({ event, handler, middleware })
    }
  }, 0)
}

const onEvent = ({
  el,
  event,
  handler,
  middleware,
}: {
  el: ClickOutsideElement
  event: Event
  handler: ClickOutsideHandler
  middleware: ClickOutsideMiddleware
}) => {
  // Note: composedPath is not supported on IE and Edge, more information here:
  //       https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
  //       In the meanwhile, we are using el.contains for those browsers, not
  //       the ideal solution, but using IE or EDGE is not ideal either.
  const eventAny = event as any
  const path: EventTarget[] | undefined =
    eventAny.path || (event.composedPath && event.composedPath())

  const isClickOutside = path ? path.indexOf(el) < 0 : !el.contains(event.target as Node | null)

  if (!isClickOutside) {
    return
  }

  execHandler({ event, handler, middleware })
}

const beforeMount = (el: ClickOutsideElement, { value }: DirectiveBinding<ClickOutsideBinding>) => {
  const { events, handler, middleware, isActive, detectIframe, capture } =
    processDirectiveArguments(value)

  if (!isActive) {
    return
  }

  el[HANDLERS_PROPERTY] = events.map((eventName) => ({
    event: eventName,
    srcTarget: document.documentElement,
    handler: (event: Event) => onEvent({ el, event, handler, middleware }),
    capture,
  }))

  if (detectIframe) {
    const detectIframeEvent: ClickOutsideHandlerRecord = {
      event: 'blur',
      srcTarget: window,
      handler: (event: Event) => onFauxIframeClick({ el, event, handler, middleware }),
      capture,
    }
    el[HANDLERS_PROPERTY] = [...el[HANDLERS_PROPERTY]!, detectIframeEvent]
  }

  el[HANDLERS_PROPERTY]!.forEach(
    ({ event, srcTarget, handler: thisHandler, capture: thisCapture }) =>
      setTimeout(() => {
        // Note: More info about this implementation can be found here:
        //       https://github.com/ndelvalle/v-click-outside/issues/137
        if (!el[HANDLERS_PROPERTY]) {
          return
        }
        srcTarget.addEventListener(event, thisHandler as EventListener, thisCapture)
      }, 0),
  )
}

const unmounted = (el: ClickOutsideElement) => {
  const handlers = el[HANDLERS_PROPERTY] || []
  handlers.forEach(({ event, srcTarget, handler, capture }) =>
    srcTarget.removeEventListener(event, handler as EventListener, capture),
  )
  delete el[HANDLERS_PROPERTY]
}

const updated = (
  el: ClickOutsideElement,
  { value, oldValue }: DirectiveBinding<ClickOutsideBinding>,
) => {
  if (JSON.stringify(value) === JSON.stringify(oldValue)) {
    return
  }
  unmounted(el)
  beforeMount(el, { value } as DirectiveBinding<ClickOutsideBinding>)
}

const directive: ObjectDirective<ClickOutsideElement, ClickOutsideBinding> = {
  beforeMount,
  updated,
  unmounted,
}

export default HAS_WINDOWS
  ? directive
  : ({} as ObjectDirective<ClickOutsideElement, ClickOutsideBinding>)
