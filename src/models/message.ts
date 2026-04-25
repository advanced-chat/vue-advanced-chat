import type { Id } from './id.ts'
import type { User } from './user.ts'

/**
 * Delivery / failure state of a message. Replaces the four overlapping
 * booleans (`saved`/`delivered`/`read`/`failure`) used in earlier
 * alphas. Components render checkmarks based on this single value.
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface Message {
  id: Id
  sender: User
  content?: string
  files?: MessageFile[]
  reactions?: Record<string, Id[]>
  /** True if this message is part of the unread batch that triggers the divider line. */
  unread?: boolean
  /** Delivery state. See `MessageStatus`. */
  status?: MessageStatus
  deleted?: boolean
  edited?: boolean
  system?: boolean
  disableActions?: boolean
  disableReactions?: boolean
  createdAt: string
  reply?: Message
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
  size?: number
  /** Duration in seconds for audio/video files. */
  duration?: number
  /** Upload progress (0-100) while a pending file is being sent. */
  progress?: number
  /** In-memory blob for pending uploads (not for received files). */
  blob?: Blob
}
