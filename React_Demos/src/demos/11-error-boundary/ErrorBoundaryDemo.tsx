import { Component, ReactNode, useEffect, useState } from 'react'

type FallbackRenderArgs = { error: unknown; reset: () => void }
type ErrorBoundaryProps = {
  fallback?: ReactNode
  fallbackRender?: (args: FallbackRenderArgs) => ReactNode
  resetKeys?: unknown[]
  children?: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean; error?: unknown }> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }
  componentDidCatch(error: unknown) {
    console.error('Caught by ErrorBoundary:', error)
  }
  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    const { resetKeys } = this.props
    if (!this.state.hasError) return
    if (!resetKeys || !prevProps.resetKeys) return
    const changed =
      resetKeys.length !== prevProps.resetKeys.length ||
      resetKeys.some((v, i) => v !== prevProps.resetKeys![i])
    if (changed) {
      this.setState({ hasError: false, error: undefined })
    }
  }
  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({ error: this.state.error, reset: this.reset })
      }
      if (this.props.fallback) return this.props.fallback
      return (
        <div style={{ color: 'crimson' }}>
          Something went wrong. <button onClick={this.reset}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}

function BoundaryFallback({ error, onTryAgain }: { error: unknown; onTryAgain: () => void }) {
  return (
    <div style={{ border: '2px solid #64748b', padding: 12, borderRadius: 10, color: '#0f172a', background: '#f1f5f9' }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Something went wrong</div>
      <div style={{ marginBottom: 8 }}>{String((error as any)?.message ?? 'An unexpected error occurred')}</div>
      <button
        onClick={onTryAgain}
        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #64748b', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        Try again
      </button>
    </div>
  )
}

function BoundaryFallbackWithTrip({
  error,
  onTryAgain,
  onTrip,
}: {
  error: unknown
  onTryAgain: () => void
  onTrip: () => void
}) {
  useEffect(() => {
    onTrip()
    // run once per fallback mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <BoundaryFallback error={error} onTryAgain={onTryAgain} />
}

function CrashableC({ active }: { active: boolean }) {
  if (active) throw new Error('Local render crash (caught by boundary)')
  return null
}

// Deep subtree example removed as redundant with nested boundaries

export default function ErrorBoundaryDemo() {
  const [eventError, setEventError] = useState<string | null>(null)
  const [asyncError, setAsyncError] = useState<string | null>(null)
  const [handledRejection, setHandledRejection] = useState<string | null>(null)
  const [globalErrors, setGlobalErrors] = useState<string[]>([])
  const [ebNotCatchTrips, setEbNotCatchTrips] = useState(0)
  const [breakRenderC, setBreakRenderC] = useState(false)
  const [nestedResetTick, setNestedResetTick] = useState(0)
  // D) Nested boundaries demo
  const [boom2, setBoom2] = useState(false)
  const [boom3, setBoom3] = useState(false)
  const [boom4, setBoom4] = useState(false)

  function triggerEventError() {
    try {
      // Error boundaries do NOT catch errors in event handlers; you must handle them yourself.
      throw new Error('This error is in an event handler (not caught by ErrorBoundary)')
    } catch (e: any) {
      setEventError(e.message ?? String(e))
    }
  }
  function triggerAsyncError() {
    setTimeout(() => {
      try {
        throw new Error('Async (setTimeout) error — not caught by ErrorBoundary')
      } catch (e: any) {
        setAsyncError(e.message ?? String(e))
      }
    }, 0)
  }
  function triggerUnhandledPromiseRejection() {
    // Unhandled promise rejection - not caught by ErrorBoundary. Captured by global 'unhandledrejection' listener below.
    void Promise.reject(new Error('Unhandled promise rejection (not caught by ErrorBoundary)'))
  }
  function triggerHandledPromiseRejection() {
    Promise.reject(new Error('Handled promise rejection via .catch()')).catch((e: any) => {
      setHandledRejection(e.message ?? String(e))
    })
  }

  useEffect(() => {
    function onWindowError(_msg: any, _src: any, _line: any, _col: any, err: any) {
      setGlobalErrors((g) => [...g, String(err?.message ?? _msg)])
      return false
    }
    function onUnhandled(ev: PromiseRejectionEvent) {
      setGlobalErrors((g) => [...g, String(ev.reason?.message ?? ev.reason)])
    }
    window.addEventListener('error', onWindowError as any)
    window.addEventListener('unhandledrejection', onUnhandled)
    return () => {
      window.removeEventListener('error', onWindowError as any)
      window.removeEventListener('unhandledrejection', onUnhandled)
    }
  }, [])

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      {/* A) Removed redundant basic example; covered in sections below */}

      {/* Deep subtree section removed */}

      {/* Placeholder removed: Not-caught section moved below after nested boundaries */}

    {/* A) Nested boundaries: who catches what? */}
    <div style={{ display: 'grid', gap: 20 }}>
      <h3 style={{ margin: 0 }}>A) Nested boundaries: who catches what?</h3>
      <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>
        - Errors in <strong>Outer Component</strong> and <strong>Unguarded Component</strong> are caught by <strong>ErrorBoundary 1</strong> (outer).<br />
        - Errors in <strong>Guarded Component</strong> are caught by <strong>ErrorBoundary 2</strong> (inner).
      </p>
      <div style={{ border: '2px dashed #94a3b8', borderRadius: 12, padding: 12, background: '#f8fafc' }}>
        <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', whiteSpace: 'nowrap' }}>
          <span style={{ background: '#e2e8f0', border: '1px solid #94a3b8', borderRadius: 999, padding: '2px 8px', fontSize: 12 }}>
            ErrorBoundary 1
          </span>
          Outer boundary (catches Outer Component and Unguarded Component)
        </div>
        <div style={{ marginBottom: 8 }}>
          <button
            onClick={() => {
              setBoom2(false)
              setBoom3(false)
              setBoom4(false)
              setNestedResetTick((t) => t + 1)
            }}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Reset nested section
          </button>
        </div>
        <ErrorBoundary
          // ErrorBoundary 1 (outer)
          resetKeys={[nestedResetTick]}
          fallbackRender={({ error, reset }) => (
            <BoundaryFallback
              error={error}
              onTryAgain={() => {
                setBoom2(false)
                setBoom4(false)
                reset()
              }}
            />
          )}
        >
          <div style={{ display: 'grid', gap: 12 }} key={nestedResetTick}>
            <OuterComponent boom={boom2} onBoom={() => setBoom2(true)} />
            <div style={{ border: '2px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#ffffff' }}>
              <div style={{ fontWeight: 700, marginBottom: 10, whiteSpace: 'nowrap', color: '#0f172a' }}>
                Shared Container (same parent)
              </div>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ border: '2px dashed #94a3b8', borderRadius: 12, padding: 10, background: '#f8fafc' }}>
              <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', whiteSpace: 'nowrap' }}>
                  <span style={{ background: '#e2e8f0', border: '1px solid #94a3b8', borderRadius: 999, padding: '2px 8px', fontSize: 12 }}>
                    ErrorBoundary 2
                  </span>
                  Inner boundary (catches Guarded Component)
                </div>
                <ErrorBoundary
                    fallbackRender={({ error, reset }) => (
                      <BoundaryFallback
                        error={error}
                        onTryAgain={() => {
                          setBoom3(false)
                          reset()
                        }}
                      />
                    )}
                  >
                  <GuardedComponent boom={boom3} onBoom={() => setBoom3(true)} />
                </ErrorBoundary>
              </div>
              <UnguardedComponent boom={boom4} onBoom={() => setBoom4(true)} />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
    {/* B) What error boundaries do NOT catch */}
    <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
      <h3 style={{ margin: 0 }}>B) What error boundaries do NOT catch</h3>
      <ErrorBoundary
        fallbackRender={({ error, reset }) => (
          <BoundaryFallbackWithTrip
            error={error}
            onTryAgain={() => {
              setBreakRenderC(false)
              reset()
            }}
            onTrip={() => setEbNotCatchTrips((c) => c + 1)}
          />
        )}
      >
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: '#475569', whiteSpace: 'nowrap' }}>
                Boundary trips (should stay 0 unless you crash render): <strong>{ebNotCatchTrips}</strong>
              </div>
              <button
                onClick={() => setBreakRenderC(true)}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #64748b', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Crash render in this region
              </button>
            </div>
            <button
              onClick={() => {
                setEventError(null)
                setAsyncError(null)
                setHandledRejection(null)
                setGlobalErrors([])
                setEbNotCatchTrips(0)
                setBreakRenderC(false)
              }}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Reset logs and counter
            </button>
          </div>
          <CrashableC active={breakRenderC} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', whiteSpace: 'nowrap', marginTop: 8 }}>
            <button onClick={triggerEventError} style={{ whiteSpace: 'nowrap' }}>Throw in event handler</button>
            <button onClick={triggerAsyncError} style={{ whiteSpace: 'nowrap' }}>Throw in setTimeout (handled locally)</button>
            <button onClick={triggerUnhandledPromiseRejection} style={{ whiteSpace: 'nowrap' }}>Unhandled promise rejection</button>
            <button onClick={triggerHandledPromiseRejection} style={{ whiteSpace: 'nowrap' }}>.catch() promise rejection</button>
          </div>
          <div style={{ display: 'grid', gap: 6, fontSize: 12, color: '#475569', marginTop: 8 }}>
            {(eventError || asyncError || handledRejection) && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Locally handled (not by ErrorBoundary):</div>
                {eventError && <div>- Event handler: {eventError}</div>}
                {asyncError && <div>- setTimeout: {asyncError}</div>}
                {handledRejection && <div>- Promise .catch(): {handledRejection}</div>}
              </div>
            )}
            {globalErrors.length > 0 && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Global listeners captured:</div>
                {globalErrors.map((m, i) => (
                  <div key={i}>- {m}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
      <div style={{ fontSize: 12, color: '#475569' }}>
        Error boundaries catch errors during render and lifecycle/effects in their subtree. They do not catch errors
        in event handlers, async callbacks (timers, promises), or server-side rendering. Handle these with try/catch,
        Promise.catch, or global handlers (window.onerror / unhandledrejection) as shown above.
      </div>
    </div>
    </section>
  )
}

// --- Section D helpers: simple components for nested boundary demo ---
function OuterComponent({ boom, onBoom }: { boom: boolean; onBoom: () => void }) {
  if (boom) throw new Error('Outer Component crashed')
  return (
    <div style={{ border: '2px solid #0ea5e9', borderRadius: 12, padding: 12, background: '#f0f9ff' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Outer Component (inside outer boundary)</div>
      <div style={{ padding: 10, border: '1px solid #0284c7', borderRadius: 8, background: '#e0f2fe', display: 'inline-block' }}>
        <button onClick={onBoom} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #0284c7', background: '#bae6fd', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Crash Outer Component
        </button>
      </div>
    </div>
  )
}

function GuardedComponent({ boom, onBoom }: { boom: boolean; onBoom: () => void }) {
  if (boom) {
    throw new Error('Guarded Component crashed')
  }
  return (
    <div style={{ border: '2px solid #a78bfa', borderRadius: 12, padding: 12, background: '#f5f3ff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, whiteSpace: 'nowrap' }}>
        <div style={{ fontWeight: 600 }}>Guarded Component (wrapped by inner boundary)</div>
      </div>
      <button
        onClick={onBoom}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid #8b5cf6',
          background: '#ede9fe',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        Crash Guarded Component
      </button>
    </div>
  )
}

function UnguardedComponent({ boom, onBoom }: { boom: boolean; onBoom: () => void }) {
  if (boom) {
    throw new Error('Unguarded Component crashed')
  }
  return (
    <div style={{ border: '2px solid #34d399', borderRadius: 12, padding: 12, background: '#ecfdf5' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
        <div style={{ fontWeight: 600 }}>Unguarded Component (no inner boundary)</div>
        <button onClick={onBoom} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #34d399', background: '#d1fae5', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Crash Unguarded Component
        </button>
      </div>
    </div>
  )
}


