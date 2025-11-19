import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'

const USERS = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
}))

function UsersLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const navigate = useNavigate()
  const filtered = useMemo(
    () => USERS.filter((u) => u.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  )
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder="Filter users (search param q)"
          value={q}
          onChange={(e) => setSearchParams({ q: e.target.value })}
          style={{ flex: '0 0 260px' }}
        />
        <button onClick={() => navigate('1')}>Go to first user</button>
        <button onClick={() => navigate('..')}>Back to Users home</button>
      </div>
      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {filtered.map((u) => (
          <NavLink
            key={u.id}
            to={u.id}
            style={({ isActive }) => ({
              padding: '4px 8px',
              borderRadius: 6,
              textDecoration: 'none',
              background: isActive ? '#e2e8f0' : '#f8fafc',
              color: '#0f172a',
              border: '1px solid #e5e7eb',
            })}
          >
            {u.name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}

function UserDetail() {
  const { id } = useParams()
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ fontWeight: 600 }}>User page: id {id}</div>
      <nav style={{ display: 'flex', gap: 8 }}>
        <NavLink to="" end style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
          Overview
        </NavLink>
        <NavLink to="profile" style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
          Profile
        </NavLink>
        <NavLink to="settings" style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
          Settings (guarded)
        </NavLink>
      </nav>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12 }}>
        <Outlet />
      </div>
    </div>
  )
}

function Overview() {
  const { id } = useParams()
  return <div>Overview for user {id}</div>
}

function Profile() {
  const { id } = useParams()
  return <div>Profile for user {id} (public)</div>
}

function ProtectedRoute({ isAuthed, children }: { isAuthed: boolean; children: React.ReactNode }) {
  if (!isAuthed) {
    return <div style={{ color: '#b91c1c' }}>Access denied. Toggle “Logged in” to view settings.</div>
  }
  return <>{children}</>
}

function Settings() {
  const { id } = useParams()
  return <div>Settings for user {id} (protected)</div>
}

export default function RouterPatternsDemo() {
  const [loggedIn, setLoggedIn] = useState(false)
  const location = useLocation()
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <Routes>
        <Route
          path=""
          element={
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <strong>Routing patterns demo</strong>
                <nav style={{ display: 'flex', gap: 10 }}>
                  <NavLink to="" end style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
                    Home
                  </NavLink>
                  <NavLink to="users" style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
                    Users
                  </NavLink>
                  <NavLink to="about" style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
                    About
                  </NavLink>
                </nav>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                  <input type="checkbox" checked={loggedIn} onChange={(e) => setLoggedIn(e.target.checked)} />
                  Logged in (for protected route)
                </label>
              </div>
              <div style={{ border: '1px dashed #cbd5e1', padding: 10, borderRadius: 6, background: '#f8fafc' }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>How to use this demo</div>
                <ol style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Click “Users”. Filter with the search box and click any user.</li>
                  <li>On a user page, switch tabs: Overview, Profile, Settings.</li>
                  <li>Settings is protected. If access is denied, toggle “Logged in” above, then click Settings again.</li>
                </ol>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>
                  Current route: <code>{location.pathname}{location.search}</code>
                </div>
              </div>
              <Outlet />
            </div>
          }
        >
          <Route index element={<div>Welcome. Open Users to explore nested routes.</div>} />
          <Route path="users" element={<UsersLayout />}>
            <Route index element={<div>Select a user or use the search box.</div>} />
            <Route path=":id" element={<UserDetail />}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="settings"
                element={
                  <ProtectedRoute isAuthed={loggedIn}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<div>Section not found</div>} />
            </Route>
          </Route>
          <Route path="about" element={<div>About section</div>} />
        </Route>
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </section>
  )
}


