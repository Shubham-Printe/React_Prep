import type { ReactNode } from 'react'

export function ProtectedRoute({ isAuthed, children }: { isAuthed: boolean; children: ReactNode }) {
  if (!isAuthed) {
    return <div style={{ color: '#b91c1c' }}>Access denied. Toggle “Logged in” to view settings.</div>
  }
  return <>{children}</>
}

