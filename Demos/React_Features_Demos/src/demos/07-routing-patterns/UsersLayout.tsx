import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { USERS } from './users'

export function UsersLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const navigate = useNavigate()

  const filtered = useMemo(() => USERS.filter((u) => u.name.toLowerCase().includes(q.toLowerCase())), [q])

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

