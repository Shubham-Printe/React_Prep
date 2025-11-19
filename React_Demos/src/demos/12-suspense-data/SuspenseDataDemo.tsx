import { Suspense, useMemo, useState } from 'react'

type Resource<T> = { read: () => T }

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T | undefined
  let error: unknown
  const suspender = promise
    .then((r) => { status = 'success'; result = r as T })
    .catch((e) => { status = 'error'; error = e })
  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'error') throw error
      return result as T
    },
  }
}

// Simple in-memory resource cache
const cache = new Map<string, Resource<any>>()

function getResource<T>(key: string, loader: () => Promise<T>): Resource<T> {
  if (cache.has(key)) return cache.get(key) as Resource<T>
  const resource = createResource(loader())
  cache.set(key, resource)
  return resource
}

function preloadResource<T>(key: string, loader: () => Promise<T>) {
  if (!cache.has(key)) {
    cache.set(key, createResource(loader()))
  }
}

function fetchUser(userId: number, delay = 1200, shouldFail = false): Promise<{ id: number; name: string }> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Failed to load user ${userId}`))
      else resolve({ id: userId, name: `User ${userId}` })
    }, delay),
  )
}

function fetchPosts(userId: number, delay = 1200, shouldFail = false): Promise<Array<{ id: number; title: string }>> {
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

function User({ resource }: { resource: Resource<{ id: number; name: string }> }) {
  const user = resource.read()
  return <div><strong>Loaded:</strong> {user.name} (id: {user.id})</div>
}

function Posts({ resource }: { resource: Resource<Array<{ id: number; title: string }>> }) {
  const posts = resource.read()
  return (
    <ul style={{ margin: '8px 0 0 16px' }}>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}

// Minimal error boundary for this demo
import { Component, ReactNode } from 'react'
class EB extends Component<{ children?: ReactNode; fallback?: (retry: () => void, error: unknown) => ReactNode }, { error: unknown | null }> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: unknown) {
    return { error }
  }
  render() {
    if (this.state.error) {
      const retry = () => this.setState({ error: null })
      return this.props.fallback ? this.props.fallback(retry, this.state.error) : <div style={{ color: 'crimson' }}>Error</div>
    }
    return this.props.children as any
  }
}

export default function SuspenseDataDemo() {
  const [version, setVersion] = useState(0)
  const [userId, setUserId] = useState(1)
  const [delay, setDelay] = useState(1200)
  const [failUser, setFailUser] = useState(false)
  const [failPosts, setFailPosts] = useState(false)

  const userKey = `user:${userId}:${delay}:${failUser}:${version}`
  const postsKey = `posts:${userId}:${delay}:${failPosts}:${version}`

  const userResource = useMemo(
    () => getResource(userKey, () => fetchUser(userId, delay, failUser)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userKey],
  )
  const postsResource = useMemo(
    () => getResource(postsKey, () => fetchPosts(userId, delay, failPosts)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postsKey],
  )

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#f8fafc', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          User:
          <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Delay:
          <select value={delay} onChange={(e) => setDelay(Number(e.target.value))}>
            <option value={500}>500ms</option>
            <option value={1200}>1200ms</option>
            <option value={2500}>2500ms</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={failUser} onChange={(e) => setFailUser(e.target.checked)} />
          Fail user
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={failPosts} onChange={(e) => setFailPosts(e.target.checked)} />
          Fail posts
        </label>
        <button
          onClick={() => {
            preloadResource(userKey, () => fetchUser(userId, delay, failUser))
            preloadResource(postsKey, () => fetchPosts(userId, delay, failPosts))
          }}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Preload
        </button>
        <button onClick={() => setVersion((v) => v + 1)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Refetch
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ background: '#e2e8f0', border: '1px solid #94a3b8', borderRadius: 999, padding: '2px 8px', fontSize: 12, color: '#0f172a' }}>User</span>
            <div style={{ fontWeight: 600 }}>Details</div>
          </div>
          <EB
            fallback={(retry, error) => (
              <div style={{ border: '1px solid #fecaca', background: '#fff1f2', color: '#991b1b', borderRadius: 8, padding: 10 }}>
                <div style={{ marginBottom: 6 }}>{String((error as any)?.message ?? 'Error')}</div>
                <div style={{ display: 'flex' }}>
                  <button
                    onClick={() => {
                      setVersion((v) => v + 1)
                      retry()
                    }}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ef4444', background: '#ffe4e6', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          >
            <Suspense fallback={<div style={{ fontSize: 12, color: '#64748b' }}>Loading user…</div>}>
              <User resource={userResource} />
            </Suspense>
          </EB>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ background: '#e2e8f0', border: '1px solid #94a3b8', borderRadius: 999, padding: '2px 8px', fontSize: 12, color: '#0f172a' }}>Posts</span>
            <div style={{ fontWeight: 600 }}>Recent</div>
          </div>
          <EB
            fallback={(retry, error) => (
              <div style={{ border: '1px solid #fecaca', background: '#fff1f2', color: '#991b1b', borderRadius: 8, padding: 10 }}>
                <div style={{ marginBottom: 6 }}>{String((error as any)?.message ?? 'Error')}</div>
                <div style={{ display: 'flex' }}>
                  <button
                    onClick={() => {
                      setVersion((v) => v + 1)
                      retry()
                    }}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ef4444', background: '#ffe4e6', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          >
            <Suspense fallback={<div style={{ fontSize: 12, color: '#64748b' }}>Loading posts…</div>}>
              <Posts resource={postsResource} />
            </Suspense>
          </EB>
        </div>
      </div>
    </section>
  )
}


