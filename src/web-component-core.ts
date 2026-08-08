import './assets/style.css'

import { defineCustomElement, type App } from 'vue'

import AdvancedChat, { type AdvancedChatProps } from './components/AdvancedChat.vue'
import AdvancedChatPlugin, { type AdvancedChatOptions } from './plugin'

export const DEFAULT_CUSTOM_ELEMENT_TAG = 'advanced-chat-components'

type AdvancedChatComponentProps = InstanceType<typeof AdvancedChat>['$props']
type EventName<ListenerName extends string> = ListenerName extends `on${infer Name}`
  ? Uncapitalize<Name>
  : never
type EventDetail<Listener> =
  NonNullable<Listener> extends (...args: infer Arguments) => unknown
    ? Arguments extends []
      ? null
      : Arguments extends [infer Detail]
        ? Detail
        : Arguments
    : never

type AdvancedChatEventListeners = {
  [Key in keyof AdvancedChatComponentProps as Key extends `onVnode${string}`
    ? never
    : Key extends `on${string}`
      ? Key
      : never]-?: AdvancedChatComponentProps[Key]
}

export type AdvancedChatEventMap = {
  [Key in keyof AdvancedChatEventListeners as EventName<Key & string>]-?: CustomEvent<
    EventDetail<AdvancedChatEventListeners[Key]>
  >
}

export interface AdvancedChatHTMLElement extends HTMLElement, AdvancedChatProps {
  addEventListener<Key extends keyof AdvancedChatEventMap>(
    type: Key,
    listener: (this: AdvancedChatHTMLElement, event: AdvancedChatEventMap[Key]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void
  removeEventListener<Key extends keyof AdvancedChatEventMap>(
    type: Key,
    listener: (this: AdvancedChatHTMLElement, event: AdvancedChatEventMap[Key]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void
}

export interface AdvancedChatElementConstructor extends CustomElementConstructor {
  new (): AdvancedChatHTMLElement
}

declare global {
  interface HTMLElementTagNameMap {
    'advanced-chat-components': AdvancedChatHTMLElement
  }
}

export interface RegisterAdvancedChatOptions extends AdvancedChatOptions {
  tagName?: string
}

const runtimeEmits = (
  AdvancedChat as typeof AdvancedChat & { emits?: string[] | Record<string, unknown> }
).emits
const publicEvents = new Set(
  Array.isArray(runtimeEmits) ? runtimeEmits : Object.keys(runtimeEmits || {}),
)
const eventsWithoutDetail = new Set([
  'add-chat',
  'cancel-message-selection',
  'fetch-more-chats',
  'fetch-messages',
  'retry',
])

export const createAdvancedChatElement = (
  options: AdvancedChatOptions = {},
): AdvancedChatElementConstructor => {
  const VueElement = defineCustomElement(AdvancedChat, {
    shadowRoot: false,
    configureApp(app: App) {
      app.use(AdvancedChatPlugin(options))
    },
  })

  return class AdvancedChatElement extends VueElement {
    override dispatchEvent(event: Event): boolean {
      if (publicEvents.has(event.type) && event instanceof CustomEvent) {
        const detail = eventsWithoutDetail.has(event.type)
          ? null
          : Array.isArray(event.detail) && event.detail.length <= 1
            ? event.detail[0]
            : event.detail

        return super.dispatchEvent(
          new CustomEvent(event.type, {
            detail,
            bubbles: true,
            cancelable: event.cancelable,
            composed: true,
          }),
        )
      }

      return super.dispatchEvent(event)
    }
  } as AdvancedChatElementConstructor
}

interface ManagedRegistration {
  element: AdvancedChatElementConstructor
  pluginOptions: AdvancedChatOptions
}

const managedRegistrations = new Map<string, ManagedRegistration>()

export const registerAdvancedChat = ({
  tagName = DEFAULT_CUSTOM_ELEMENT_TAG,
  ...pluginOptions
}: RegisterAdvancedChatOptions = {}): AdvancedChatElementConstructor => {
  if (typeof customElements === 'undefined') {
    throw new Error(
      '[advanced-chat-components] Custom elements are not available in this environment.',
    )
  }

  const managed = managedRegistrations.get(tagName)
  if (managed) {
    // Each custom-element instance creates its own app, so late options apply to future mounts only.
    Object.assign(managed.pluginOptions, pluginOptions)
    return managed.element
  }

  const existing = customElements.get(tagName)
  if (existing) {
    if (Object.keys(pluginOptions).length) {
      throw new Error(
        `[advanced-chat-components] Cannot apply options because "${tagName}" is already registered by another constructor.`,
      )
    }
    return existing as AdvancedChatElementConstructor
  }

  const mutablePluginOptions = { ...pluginOptions }
  const element = createAdvancedChatElement(mutablePluginOptions)
  customElements.define(tagName, element)
  managedRegistrations.set(tagName, { element, pluginOptions: mutablePluginOptions })
  return element
}
