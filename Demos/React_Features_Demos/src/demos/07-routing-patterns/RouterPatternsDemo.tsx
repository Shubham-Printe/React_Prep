import {
  NavLink,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createMemoryRouter,
  redirect,
  useLocation,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from 'react-router-dom'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { UsersLayout } from './UsersLayout'
import { UserDetail } from './UserDetail'
import { Overview, Profile, Settings } from './UserSections'
import { ProtectedRoute } from './ProtectedRoute'

let dataRouterIsAuthed = false
function setDataRouterIsAuthed(next: boolean) {
  dataRouterIsAuthed = next
}
function getDataRouterIsAuthed() {
  return dataRouterIsAuthed
}

type RouterMode = 'ui' | 'data'

const DataRouterAuthContext = createContext<{ loggedIn: boolean; setLoggedIn: (v: boolean) => void } | null>(null)
function useDataRouterAuth() {
  const ctx = useContext(DataRouterAuthContext)
  if (!ctx) throw new Error('useDataRouterAuth must be used within DataRouterAuthContext')
  return ctx
}

export default function RouterPatternsDemo() {
  const [mode, setMode] = useState<RouterMode>('ui')

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <strong>Router mode:</strong>
        <button
          onClick={() => setMode('ui')}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: mode === 'ui' ? '#e2e8f0' : '#fff',
            color: '#0f172a',
            cursor: 'pointer',
          }}
        >
          UI Router (BrowserRouter + Routes)
        </button>
        <button
          onClick={() => setMode('data')}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: mode === 'data' ? '#e2e8f0' : '#fff',
            color: '#0f172a',
            cursor: 'pointer',
          }}
        >
          Data Router (RouterProvider + loaders)
        </button>
      </div>

      {mode === 'ui' ? <UiRouterPatterns /> : <DataRouterPatterns />}
    </section>
  )
}

function UiRouterPatterns() {
  /**
   * This demo is intentionally structured like a small app:
   * - `RouterPatternsDemo` composes the route tree (like a "feature router").
   * - Layout routes render a shared shell and an `<Outlet />` for nested pages.
   * - Leaf routes render the actual screens.
   */
  const [loggedIn, setLoggedIn] = useState(false)
  const location = useLocation()

  return (
    <Routes>
      {/* Root "layout route" for this demo feature. It renders the header + `<Outlet />`. */}
      <Route
        path=""
        element={
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <strong>Routing patterns demo (UI Router)</strong>
              <nav style={{ display: 'flex', gap: 10 }}>
                {/* `to=""` is a relative link: it navigates to this route's index child. */}
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
                {/* Helpful for learning: see how pathname + search params update while navigating. */}
                Current route: <code>{location.pathname}{location.search}</code>
              </div>
            </div>
            {/* Nested routes render here (Home / Users / About). */}
            <Outlet />
          </div>
        }
      >
        {/* Index route: renders when the parent path matches exactly. */}
        <Route index element={<div>Welcome. Open Users to explore nested routes.</div>} />

        {/* `/users` becomes a second layout route: it shows list + renders the selected user in an Outlet. */}
        <Route path="users" element={<UsersLayout />}>
          <Route index element={<div>Select a user or use the search box.</div>} />

          {/* Dynamic segment (URL params): `/users/:id` */}
          <Route path=":id" element={<UserDetail />}>
            <Route index element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="settings"
              element={
                /**
                 * "Protected route" pattern:
                 * keep the URL stable, but gate the element behind an auth check.
                 * In a real app this is often a redirect to `/login` + `state.from`.
                 */
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

      {/* Catch-all for unknown routes under this demo feature. */}
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

function DataRouterPatterns() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setDataRouterIsAuthed(loggedIn)
  }, [loggedIn])

  const router = useMemo(() => {
    const settingsLoader = ({ request }: { request: Request }) => {
      if (getDataRouterIsAuthed()) return null
      const url = new URL(request.url)
      throw redirect(`/login?from=${encodeURIComponent(url.pathname + url.search)}`)
    }

    return createMemoryRouter(
      [
        {
          path: '/',
          element: <DataRouterRootLayout />,
          children: [
            { index: true, element: <div>Welcome. Open Users to explore nested routes.</div> },
            {
              path: 'users',
              element: <UsersLayout />,
              children: [
                { index: true, element: <div>Select a user or use the search box.</div> },
                {
                  path: ':id',
                  element: <UserDetail />,
                  children: [
                    { index: true, element: <Overview /> },
                    { path: 'profile', element: <Profile /> },
                    {
                      path: 'settings',
                      loader: settingsLoader,
                      element: <Settings />,
                    },
                    { path: '*', element: <div>Section not found</div> },
                  ],
                },
              ],
            },
            { path: 'about', element: <div>About section</div> },
            { path: 'login', element: <DataRouterLogin /> },
            { path: '*', element: <div>Not found</div> },
          ],
        },
      ],
      { initialEntries: ['/'] }
    )
  }, [])

  return (
    <DataRouterAuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <RouterProvider router={router} />
    </DataRouterAuthContext.Provider>
  )
}

function DataRouterRootLayout() {
  const location = useLocation()
  const { loggedIn, setLoggedIn } = useDataRouterAuth()
  const revalidator = useRevalidator()

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <strong>Routing patterns demo (Data Router)</strong>
        <nav style={{ display: 'flex', gap: 10 }}>
          <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
            Home
          </NavLink>
          <NavLink to="/users" style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
            Users
          </NavLink>
          <NavLink to="/about" style={({ isActive }) => ({ color: isActive ? '#1e293b' : '#64748b' })}>
            About
          </NavLink>
        </nav>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <input
            type="checkbox"
            checked={loggedIn}
            onChange={(e) => {
              setLoggedIn(e.target.checked)
              revalidator.revalidate()
            }}
          />
          Logged in (for loader-based guard)
        </label>
      </div>
      <div style={{ border: '1px dashed #cbd5e1', padding: 10, borderRadius: 6, background: '#f8fafc' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>How this mode differs</div>
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          <li>Routes are defined as objects and rendered via <code>{'<RouterProvider />'}</code>.</li>
          <li>
            Settings is guarded via a <code>loader()</code> that redirects to <code>/login</code> (no “flash” of protected UI).
          </li>
          <li>
            This demo uses a <code>createMemoryRouter()</code>, so the address bar won’t change (but navigation state will).
          </li>
        </ol>
        <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>
          Current route: <code>{location.pathname}{location.search}</code>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

function DataRouterLogin() {
  const { loggedIn } = useDataRouterAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const from = searchParams.get('from') ?? '/'

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Login (demo page)</div>
      <div style={{ color: '#475569' }}>
        Toggle “Logged in” in the header to simulate auth. Then continue to the originally requested route.
      </div>
      <button disabled={!loggedIn} onClick={() => navigate(from)}>
        Continue
      </button>
      {!loggedIn ? <div style={{ color: '#b91c1c' }}>Not logged in yet.</div> : null}
    </div>
  )
}


