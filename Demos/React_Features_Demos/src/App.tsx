import { Suspense } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { demos } from './demos/_registry'
import { DemoList } from './components/DemoList'

function useDemoMeta() {
  const { pathname } = useLocation()
  const [, first] = pathname.split('/')
  const slug = first ?? ''
  return demos.find((d) => d.slug === slug)
}

export default function App() {
  const active = useDemoMeta()
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>React Demos</h1>
        <nav style={{ marginLeft: 'auto' }}>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main style={{ marginTop: 24 }}>
        {active && (
          <section
            style={{
              border: '1px solid #e5e7eb',
              background: '#f8fafc',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{active.title}</h2>
            <p style={{ margin: '0 0 8px' }}>{active.description}</p>
            <div style={{ fontSize: 14, color: '#334155' }}>
              <strong>How this demo illustrates the concept:</strong>
              <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{active.explanation}</div>
            </div>
          </section>
        )}
        <Routes>
          <Route path="/" element={<DemoList />} />
          {demos.map((demo) => (
            <Route
              key={demo.slug}
              path={`/${demo.slug}/*`}
              element={
                <Suspense fallback={<div>Loading {demo.title}…</div>}>
                  <demo.Component />
                </Suspense>
              }
            />
          ))}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}


