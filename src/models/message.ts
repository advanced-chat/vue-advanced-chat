import type { UserReference } from './user.ts'

export interface Message {
  id: string | number
  sender: UserReference
  content?: string
  files?: MessageFile[]
  new?: boolean
  saved?: boolean
  delivered?: boolean
  read?: boolean
  deleted?: boolean
  createdAt: string
}

export interface MessageReference {
  id: string | number
}

export interface MessageFile {
  name: string
  type: string
  extension: string
  url: string
  size?: number
  audio?: boolean
  duration?: number
  progress?: number
  blob?: Blob
}
