/**
 * Module augmentation for the custom micromark token types and HTML
 * extension handles introduced by `underline.ts`, `user-tag.ts`, and the
 * autolink helper. Without these declarations the strict-typed
 * `keyof TokenTypeMap` indices reject our custom names.
 */

import 'micromark-util-types'

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    underline: 'underline'
    underlineMarker: 'underlineMarker'
    underlineContent: 'underlineContent'

    userTag: 'userTag'
    userTagMarker: 'userTagMarker'
    userTagContent: 'userTagContent'

    literalAutolinkEmail: 'literalAutolinkEmail'
    literalAutolinkHttp: 'literalAutolinkHttp'
    literalAutolinkWww: 'literalAutolinkWww'
  }
}
