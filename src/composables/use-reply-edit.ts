import { ref, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { toValue } from 'vue'

import type { Action, Message } from '../models'
import { EDIT_ACTION, REPLY_ACTION } from '../components/actions'

export interface UseReplyEditOptions {
  /** Resets reply/edit state whenever this value changes (e.g. the active chat id). */
  resetKey?: MaybeRefOrGetter<unknown>
}

export interface UseReplyEditReturn {
  /** Message currently being replied to, or `null`. */
  replyMessage: Ref<Message | null>
  /** Message currently being edited, or `null`. */
  editMessage: Ref<Message | null>
  /**
   * Dispatches a `message-action-handler` payload. Sets `replyMessage` /
   * `editMessage` for the built-in reply/edit actions and is otherwise a
   * no-op so hosts can still chain custom actions through it.
   */
  dispatch: (payload: { action: Action; message: Message }) => void
  /** Clears `replyMessage`. Match this to `ChatFooter`'s `reset-reply-message`. */
  resetReply: () => void
  /** Clears `editMessage`. Match this to `ChatFooter`'s `reset-edit-message`. */
  resetEdit: () => void
}

/**
 * Owns the reply/edit message state in the composer. Reading the action's
 * `id` (rather than identity) keeps host-defined actions interchangeable
 * with the library's `REPLY_ACTION` / `EDIT_ACTION` constants.
 */
export const useReplyEdit = (options: UseReplyEditOptions = {}): UseReplyEditReturn => {
  const replyMessage = ref<Message | null>(null)
  const editMessage = ref<Message | null>(null)

  if (options.resetKey !== undefined) {
    watch(
      () => toValue(options.resetKey),
      () => {
        replyMessage.value = null
        editMessage.value = null
      },
    )
  }

  const dispatch = (payload: { action: Action; message: Message }) => {
    if (payload.action.id === REPLY_ACTION) {
      editMessage.value = null
      replyMessage.value = payload.message
    } else if (payload.action.id === EDIT_ACTION) {
      replyMessage.value = null
      editMessage.value = payload.message
    }
  }

  return {
    replyMessage,
    editMessage,
    dispatch,
    resetReply: () => {
      replyMessage.value = null
    },
    resetEdit: () => {
      editMessage.value = null
    },
  }
}
