export interface Message {
  id: string | number
  content?: string
  nestedLevel?: number
  deleted?: boolean
}

export interface MessageReference {
  id: string | number
}
