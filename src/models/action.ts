/**
 * A user-triggerable action surfaced through one of the dropdown menus
 * (header, message, chat row, or message-selection toolbar). Identified
 * by `id` for routing in the consumer's `*-action-handler`; rendered
 * with `label`.
 */
export interface Action {
  id: string
  label: string
  /**
   * Optional leading icon. Resolves to a built-in `SvgIcon` name when
   * the value matches one (e.g. `'pencil'`, `'deleted'`, `'send'`);
   * otherwise consumers can override the icon slot.
   */
  icon?: string
  /**
   * When true, the action only appears on messages sent by the current
   * user (typical for `edit`/`delete`).
   */
  ownMessageOnly?: boolean
}
