// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, type App } from 'vue'
import { useInfiniteScroll, type UseInfiniteScrollReturn } from './use-infinite-scroll'

interface FakeObserver {
  callback: IntersectionObserverCallback
  observed: Element[]
  disconnect: ReturnType<typeof vi.fn>
}

let observers: FakeObserver[] = []

class StubIntersectionObserver implements FakeObserver {
  callback: IntersectionObserverCallback
  observed: Element[] = []
  disconnect = vi.fn(() => {})

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    observers.push(this)
  }

  observe(target: Element) {
    this.observed.push(target)
  }

  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

const fire = (observer: FakeObserver, isIntersecting: boolean) => {
  observer.callback(
    [{ isIntersecting } as IntersectionObserverEntry],
    observer as unknown as IntersectionObserver,
  )
}

const mountComposable = <T>(setup: () => T): { result: T; app: App } => {
  let result!: T
  const Comp = defineComponent({
    setup() {
      result = setup()
      return () => h('div')
    },
  })
  const app = createApp(Comp)
  app.mount(document.createElement('div'))
  return { result, app }
}

beforeEach(() => {
  observers = []
  ;(globalThis as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    StubIntersectionObserver as unknown as typeof IntersectionObserver
})

afterEach(() => {
  delete (globalThis as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver
})

describe('useInfiniteScroll', () => {
  it('does not attach an observer until both target and scrollRoot are present', async () => {
    const target = ref<HTMLElement | null>(null)
    const scrollRoot = ref<HTMLElement | null>(null)
    const onLoadMore = vi.fn()
    const exhausted = ref(false)
    const { app } = mountComposable(() =>
      useInfiniteScroll({ target, scrollRoot, exhausted, onLoadMore }),
    )

    await nextTick()
    expect(observers).toHaveLength(0)

    target.value = document.createElement('div')
    await nextTick()
    expect(observers).toHaveLength(0)

    scrollRoot.value = document.createElement('div')
    await nextTick()
    expect(observers).toHaveLength(1)

    app.unmount()
  })

  it('fires onLoadMore once per intersection until setLoading(false)', async () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const scrollRoot = ref<HTMLElement | null>(document.createElement('div'))
    const onLoadMore = vi.fn()
    const exhausted = ref(false)
    let api: UseInfiniteScrollReturn | undefined
    const { app } = mountComposable(() => {
      api = useInfiniteScroll({ target, scrollRoot, exhausted, onLoadMore })
      return api
    })

    await nextTick()
    const obs = observers[0]!

    fire(obs, true)
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    fire(obs, true)
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    api!.setLoading(false)
    fire(obs, true)
    expect(onLoadMore).toHaveBeenCalledTimes(2)

    app.unmount()
  })

  it('skips onLoadMore when exhausted is true', async () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const scrollRoot = ref<HTMLElement | null>(document.createElement('div'))
    const onLoadMore = vi.fn()
    const exhausted = ref(true)
    const { app } = mountComposable(() =>
      useInfiniteScroll({ target, scrollRoot, exhausted, onLoadMore }),
    )

    await nextTick()
    fire(observers[0]!, true)

    expect(onLoadMore).not.toHaveBeenCalled()
    app.unmount()
  })

  it('accepts a getter for the exhausted predicate', async () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const scrollRoot = ref<HTMLElement | null>(document.createElement('div'))
    const onLoadMore = vi.fn()
    let exhausted = false
    const { app } = mountComposable(() =>
      useInfiniteScroll({ target, scrollRoot, exhausted: () => exhausted, onLoadMore }),
    )

    await nextTick()
    exhausted = true
    fire(observers[0]!, true)
    expect(onLoadMore).not.toHaveBeenCalled()

    app.unmount()
  })

  it('disconnects the observer on component unmount', async () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const scrollRoot = ref<HTMLElement | null>(document.createElement('div'))
    const exhausted = ref(false)
    const { app } = mountComposable(() =>
      useInfiniteScroll({ target, scrollRoot, exhausted, onLoadMore: vi.fn() }),
    )

    await nextTick()
    const obs = observers[0]!

    app.unmount()
    expect(obs.disconnect).toHaveBeenCalled()
  })

  it('reattaches the observer when the target ref changes', async () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const scrollRoot = ref<HTMLElement | null>(document.createElement('div'))
    const onLoadMore = vi.fn()
    const exhausted = ref(false)
    const { app } = mountComposable(() =>
      useInfiniteScroll({ target, scrollRoot, exhausted, onLoadMore }),
    )

    await nextTick()
    expect(observers).toHaveLength(1)
    const first = observers[0]!

    target.value = document.createElement('div')
    await nextTick()

    expect(first.disconnect).toHaveBeenCalled()
    expect(observers).toHaveLength(2)

    app.unmount()
  })

  it('honors the rootMargin option', async () => {
    const observerSpy = vi.fn()
    class CapturingObserver extends StubIntersectionObserver {
      constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(cb)
        observerSpy(options)
      }
    }
    ;(globalThis as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      CapturingObserver as unknown as typeof IntersectionObserver

    const target = ref<HTMLElement | null>(document.createElement('div'))
    const scrollRoot = ref<HTMLElement | null>(document.createElement('div'))
    const exhausted = ref(false)
    const { app } = mountComposable(() =>
      useInfiniteScroll({
        target,
        scrollRoot,
        exhausted,
        rootMargin: '250px',
        onLoadMore: vi.fn(),
      }),
    )

    await nextTick()
    expect(observerSpy).toHaveBeenCalledWith(expect.objectContaining({ rootMargin: '250px' }))

    app.unmount()
  })
})
