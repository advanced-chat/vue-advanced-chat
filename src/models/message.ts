import type { Id } from './id.ts'
import type { User } from './user.ts'

export interface Message {
  id: Id
  sender: User
  content?: string
  files?: MessageFile[]
  new?: boolean
  saved?: boolean
  delivered?: boolean
  read?: boolean
  deleted?: boolean
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
  audio?: boolean
  duration?: number
  progress?: number
  blob?: Blob
}
