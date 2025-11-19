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

function fetchUser(delay = 1200): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => setTimeout(() => resolve({ id: 1, name: 'Suspense User' }), delay))
}

function User({ resource }: { resource: Resource<{ id: number; name: string }> }) {
  const user = resource.read()
  return <div><strong>Loaded:</strong> {user.name} (id: {user.id})</div>
}

export default function SuspenseDataDemo() {
  const [key, setKey] = useState(0)
  const resource = useMemo(() => createResource(fetchUser()), [key])
  return (
    <section>
      <button onClick={() => setKey((k) => k + 1)}>Refetch</button>
      <div style={{ marginTop: 12 }}>
        <Suspense fallback={<div>Loading user…</div>}>
          <User resource={resource} />
        </Suspense>
      </div>
    </section>
  )
}


