export type User = { id: number; name: string }
export type Post = { id: number; title: string }

export function fetchUser(userId: number, delay = 1200, shouldFail = false): Promise<User> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Failed to load user ${userId}`))
      else resolve({ id: userId, name: `User ${userId}` })
    }, delay),
  )
}

export function fetchPosts(userId: number, delay = 1200, shouldFail = false): Promise<Post[]> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Failed to load posts for user ${userId}`))
      else resolve(
        Array.from({ length: 3 }, (_, i) => ({
          id: userId * 10 + i + 1,
          title: `Post ${i + 1} of user ${userId}`,
        })),
      )
    }, delay),
  )
}
