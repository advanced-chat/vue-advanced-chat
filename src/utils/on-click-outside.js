/**
 * Modified for Vue 3 from https://github.com/ndelvalle/v-click-outside
 * Cf. https://github.com/ndelvalle/v-click-outside/issues/238
 */
const HANDLERS_PROPERTY = '__v-click-outside'
const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_TOUCH =
	HAS_WINDOWS &&
	('ontouchstart' in window ||
		(HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0))
const EVENTS = IS_TOUCH ? ['touchstart'] : ['click']
const processDirectiveArguments = bindingValue => {
	const isFunction = typeof bindingValue === 'function'
	if (!isFunction && typeof bindingValue !== 'object') {
		throw new Error(
			'v-click-outside: Binding value must be a function or an object'
		)
	}
	return {
		handler: isFunction ? bindingValue : bindingValue.handler,
		middleware: bindingValue.middleware || (item => item),
		events: bindingValue.events || EVENTS,
		isActive: !(bindingValue.isActive === false),
		detectIframe: !(bindingValue.detectIframe === false),
		capture: Boolean(bindingValue.capture)
	}
}
const execHandler = ({ event, handler, middleware }) => {
	if (middleware(event)) {
		handler(event)
	}
}
const onFauxIframeClick = ({ el, event, handler, middleware }) => {
	// Note: on firefox clicking on iframe triggers blur, but only on
	//       next event loop it becomes document.activeElement
	// https://stackoverflow.com/q/2381336#comment61192398_23231136
	setTimeout(() => {
		const { activeElement } = document
		if (
			activeElement &&
			activeElement.tagName === 'IFRAME' &&
			!el.contains(activeElement)
		) {
			execHandler({ event, handler, middleware })
		}
	}, 0)
}
const onEvent = ({ el, event, handler, middleware }) => {
	// Note: composedPath is not supported on IE and Edge, more information here:
	//       https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
	//       In the meanwhile, we are using el.contains for those browsers, not
	//       the ideal solution, but using IE or EDGE is not ideal either.
	const path = event.path || (event.composedPath && event.composedPath())
	const isClickOutside = path
		? path.indexOf(el) < 0
		: !el.contains(event.target)
	if (!isClickOutside) {
		return
	}
	execHandler({ event, handler, middleware })
}
const beforeMount = (el, { value }) => {
	const {
		events,
		handler,
		middleware,
		isActive,
		detectIframe,
		capture
	} = processDirectiveArguments(value)
	if (!isActive) {
		return
	}
	el[HANDLERS_PROPERTY] = events.map(eventName => ({
		event: eventName,
		srcTarget: document.documentElement,
		handler: event => onEvent({ el, event, handler, middleware }),
		capture
	}))
	if (detectIframe) {
		const detectIframeEvent = {
			event: 'blur',
			srcTarget: window,
			handler: event => onFauxIframeClick({ el, event, handler, middleware }),
			capture
		}
		el[HANDLERS_PROPERTY] = [...el[HANDLERS_PROPERTY], detectIframeEvent]
	}
	el[HANDLERS_PROPERTY].forEach(({ event, srcTarget, handler: thisHandler }) =>
		setTimeout(() => {
			// Note: More info about this implementation can be found here:
			//       https://github.com/ndelvalle/v-click-outside/issues/137
			if (!el[HANDLERS_PROPERTY]) {
				return
			}
			srcTarget.addEventListener(event, thisHandler, capture)
		}, 0)
	)
}
const unmounted = el => {
	const handlers = el[HANDLERS_PROPERTY] || []
	handlers.forEach(({ event, srcTarget, handler, capture }) =>
		srcTarget.removeEventListener(event, handler, capture)
	)
	delete el[HANDLERS_PROPERTY]
}
const updated = (el, { value, oldValue }) => {
	if (JSON.stringify(value) === JSON.stringify(oldValue)) {
		return
	}
	unmounted(el)
	beforeMount(el, { value })
}
const directive = {
	beforeMount,
	updated,
	unmounted
}
export default HAS_WINDOWS ? directive : {}
