/**
 * Identifier for chats, messages, and users. Pinned to `string` so
 * downstream lookups can use direct equality without coercion. Map
 * numeric backend ids with `String(id)` at the API boundary.
 */
export type Id = string
