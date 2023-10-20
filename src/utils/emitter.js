/* eslint-disable camelcase */
// bus.ts

import mitt from 'mitt'

export const emitter = mitt()

export const provide_emitter = () => ({ emitter })
