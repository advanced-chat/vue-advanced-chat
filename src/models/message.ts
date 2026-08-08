import type { Id } from './id.ts'
import type { User } from './user.ts'

/**
 * Delivery / failure state of a message. Replaces the four overlapping
 * booleans (`saved`/`delivered`/`read`/`failure`) used in earlier
 * alphas. Components render checkmarks based on this single value.
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

/**
 * The projection of a message that downstream surfaces actually need:
 * the chat-list last-message preview row and the reply-quote bubble.
 *
 * Consumers can pass any `Message` value here — every additional field
 * on `Message` is optional or unused by these surfaces. Use this type
 * for `Chat.lastMessage` and `Message.reply` so the recursive case
 * (a reply to a reply to a reply…) doesn't fall out of the model.
 */
export interface MessageSummary {
  id: Id
  sender: User
  content?: string
  createdAt: string
  status?: MessageStatus
  deleted?: boolean
  edited?: boolean
  files?: MessageFile[]
}

export interface Message extends MessageSummary {
  reactions?: Record<string, Id[]>
  /** True if this message is part of the unread batch that triggers the divider line. */
  unread?: boolean
  system?: boolean
  disableActions?: boolean
  disableReactions?: boolean
  /**
   * The message being quoted by this one. Tightened to `MessageSummary`
   * so a reply preview never recurses into yet another reply chain.
   */
  reply?: MessageSummary
}

export interface MessageReference {
  id: Id
}

export interface MessageFile {
  name: string
  type: string
  extension: string
  url: string
  previewUrl?: string
  /** Set to `false` to force image/video files through the host-controlled download flow. */
  previewable?: boolean
  size?: number
  /** Duration in seconds for audio/video files. */
  duration?: number
  /** Upload progress (0-100) while a pending file is being sent. */
  progress?: number
  /** In-memory blob for pending uploads (not for received files). */
  blob?: Blob
}
