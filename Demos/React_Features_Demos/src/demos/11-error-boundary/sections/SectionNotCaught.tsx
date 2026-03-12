import { useEffect, useState } from 'react'
import Crashable from '../components/Crashable'
import ErrorBoundary from '../components/ErrorBoundary'
import FallbackCard from '../components/FallbackCard'
import useGlobalErrorLog from '../hooks/useGlobalErrorLog'

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
  }, [onTrip])
  return <FallbackCard error={error} onTryAgain={onTryAgain} />
}

export default function SectionNotCaught() {
  const [eventError, setEventError] = useState<string | null>(null)
  const [asyncError, setAsyncError] = useState<string | null>(null)
  const [handledRejection, setHandledRejection] = useState<string | null>(null)
  const [breakRender, setBreakRender] = useState(false)
  const [boundaryTrips, setBoundaryTrips] = useState(0)
  const { globalErrors, clearGlobalErrors } = useGlobalErrorLog()

  function triggerEventError() {
    try {
      throw new Error('Event handler error (not caught by ErrorBoundary)')
    } catch (e: any) {
      setEventError(e.message ?? String(e))
    }
  }

  function triggerAsyncError() {
    setTimeout(() => {
      try {
        throw new Error('setTimeout error (not caught by ErrorBoundary)')
      } catch (e: any) {
        setAsyncError(e.message ?? String(e))
      }
    }, 0)
  }

  function triggerUnhandledPromiseRejection() {
    void Promise.reject(new Error('Unhandled promise rejection (not caught by ErrorBoundary)'))
  }

  function triggerHandledPromiseRejection() {
    Promise.reject(new Error('Handled promise rejection via .catch()')).catch((e: any) => {
      setHandledRejection(e.message ?? String(e))
    })
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0 }}>B) What error boundaries do NOT catch</h3>
      <ErrorBoundary
        fallbackRender={({ error, reset }) => (
          <BoundaryFallbackWithTrip
            error={error}
            onTryAgain={() => {
              setBreakRender(false)
              reset()
            }}
            onTrip={() => setBoundaryTrips((c) => c + 1)}
          />
        )}
      >
        <div style={{ display: 'grid', gap: 8, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Boundary trips (should stay 0 unless render crashes): <strong>{boundaryTrips}</strong>
          </div>
          <button onClick={() => setBreakRender(true)}>Crash render in this region</button>
          <Crashable active={breakRender} label="Render crash (caught by boundary)" />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={triggerEventError}>Throw in event handler</button>
            <button onClick={triggerAsyncError}>Throw in setTimeout (handled)</button>
            <button onClick={triggerUnhandledPromiseRejection}>Unhandled promise rejection</button>
            <button onClick={triggerHandledPromiseRejection}>.catch() promise rejection</button>
            <button
              onClick={() => {
                setEventError(null)
                setAsyncError(null)
                setHandledRejection(null)
                clearGlobalErrors()
                setBoundaryTrips(0)
                setBreakRender(false)
              }}
            >
              Reset logs and counter
            </button>
          </div>

          <div style={{ display: 'grid', gap: 6, fontSize: 12, color: '#475569' }}>
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
        Error boundaries catch render and lifecycle/effect errors in their subtree. They do not catch errors in event
        handlers or async callbacks. Handle those with try/catch, Promise.catch, or global listeners.
      </div>
    </div>
  )
}
