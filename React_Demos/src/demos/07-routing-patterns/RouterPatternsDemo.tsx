import { Link, Outlet, Route, Routes, useParams } from 'react-router-dom'

function UsersLayout() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <nav style={{ display: 'flex', gap: 8 }}>
        <Link to="1">User 1</Link>
        <Link to="2">User 2</Link>
        <Link to="3">User 3</Link>
      </nav>
      <Outlet />
    </div>
  )
}

function UserDetail() {
  const { id } = useParams()
  return <div>Showing nested route for user with id: {id}</div>
}

export default function RouterPatternsDemo() {
  return (
    <section>
      <Routes>
        <Route path="/" element={<UsersLayout />}>
          <Route index element={<div>Select a user.</div>} />
          <Route path=":id" element={<UserDetail />} />
        </Route>
      </Routes>
    </section>
  )
}


