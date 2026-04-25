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
   * When true, the action only appears on the current user's own
   * messages (used by message dropdowns for actions like edit/delete).
   */
  onlyMe?: boolean
}
