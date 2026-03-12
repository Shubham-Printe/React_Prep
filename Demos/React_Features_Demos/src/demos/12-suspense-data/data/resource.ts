export type Resource<T> = { read: () => T }

export function createResource<T>(promise: Promise<T>): Resource<T> {
  // Track the promise state so read() can decide what to throw/return.
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T | undefined
  let error: unknown

  // Attach handlers once; we don't await here because Suspense expects us to throw.
  const suspender = promise.then(
    (value) => {
      status = 'success'
      result = value as T
    },
    (err) => {
      status = 'error'
      error = err
    },
  )

  return {
    read() {
      // If pending, throw the promise so <Suspense> can show its fallback.
      if (status === 'pending') throw suspender
      // If failed, throw the error so an Error Boundary can render its fallback.
      if (status === 'error') throw error
      // Otherwise, data is ready and we can return it synchronously.
      return result as T
    },
  }
}

// Simple in-memory cache so we reuse the same resource between renders
// (avoids re-creating promises on every render).
const cache = new Map<string, Resource<unknown>>()

export function getResource<T>(key: string, loader: () => Promise<T>): Resource<T> {
  // Reuse existing resource if present.
  const existing = cache.get(key)
  if (existing) return existing as Resource<T>
  // Otherwise create, store, and return a new resource.
  const created = createResource(loader())
  cache.set(key, created)
  return created
}

export function preloadResource<T>(key: string, loader: () => Promise<T>) {
  // Start the request early so Suspense has less to wait for later.
  if (!cache.has(key)) cache.set(key, createResource(loader()))
}
