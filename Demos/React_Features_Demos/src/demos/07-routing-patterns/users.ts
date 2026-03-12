export type User = {
  id: string
  name: string
}

export const USERS: User[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
}))

