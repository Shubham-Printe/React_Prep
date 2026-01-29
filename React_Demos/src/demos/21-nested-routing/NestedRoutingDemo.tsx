import { Link, Outlet, Route, Routes, useParams } from 'react-router-dom'

type User = { id: string; name: string; role: string }

const USERS: User[] = [
  { id: '123', name: 'Alex', role: 'Operator' },
  { id: '456', name: 'Sam', role: 'Manager' },
  { id: '789', name: 'Taylor', role: 'Technician' },
]

function UsersLayout() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
      <aside style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Users</h3>
        <p style={{ marginTop: 0, color: '#475569', fontSize: 14 }}>
          Left side (layout) stays the same. Right side changes based on the URL.
        </p>
        <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
          {USERS.map((u) => (
            <li key={u.id}>
              <Link to={u.id}>
                {u.name} ({u.id})
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: '#64748b' }}>
          This box is the <code>{'<Outlet />'}</code> area (child route renders here)
        </div>
        <Outlet />
      </section>
    </div>
  )
}

function UsersIndex() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Select a user</h3>
      <p style={{ margin: 0, color: '#475569' }}>
        You are on <code>/users</code>. Click a user to go to <code>/users/:id</code>.
      </p>
    </div>
  )
}

function UserDetails() {
  const { id } = useParams()
  const user = USERS.find((u) => u.id === id)

  if (!user) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>User not found</h3>
        <p style={{ margin: 0, color: '#475569' }}>
          No user exists for id: <code>{id}</code>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>User Details</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        <div>
          <strong>ID:</strong> {user.id}
        </div>
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
      </div>
      <p style={{ marginTop: 12, color: '#475569', fontSize: 14 }}>
        Notice the left layout didn’t re-mount. Only this right panel changed.
      </p>
      <p style={{ marginBottom: 0 }}>
        <Link to="..">← Back to users list</Link>
      </p>
    </div>
  )
}

export default function NestedRoutingDemo() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <p style={{ margin: 0, color: '#334155' }}>
        Nested routes let you keep a shared layout (like a sidebar) and swap only the “content area”. The{' '}
        <code>{'<Outlet />'}</code> is where the matched child route renders.
      </p>

      <Routes>
        <Route path="/" element={<UsersLayout />}>
          <Route index element={<UsersIndex />} />
          <Route path=":id" element={<UserDetails />} />
        </Route>
      </Routes>
    </div>
  )
}

