export interface User {
  id: string | number
  displayName: string
}

export interface UserReference {
  id: string | number
}

export const findUserById = (users: User[], id: string | number): User | undefined => {
  const userId = id.toString()

  return users.find((user) => user.id.toString() === userId)
}
