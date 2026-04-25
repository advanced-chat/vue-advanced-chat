/**
 * Built-in `Action.name` values that `Chat` recognizes and handles
 * internally on top of emitting `message-action-handler`. Consumers can use
 * these constants to avoid relying on magic strings.
 */
export const REPLY_ACTION = 'reply'
export const EDIT_ACTION = 'edit'

/**
 * Union of recognized built-in action names.
 */
export type BuiltInActionName = typeof REPLY_ACTION | typeof EDIT_ACTION
