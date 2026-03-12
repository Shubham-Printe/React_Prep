import { NavLink, Outlet, useParams } from 'react-router-dom'

export function UserDetail() {
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

