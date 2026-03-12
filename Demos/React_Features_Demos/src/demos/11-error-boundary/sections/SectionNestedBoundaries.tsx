import { useState } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import FallbackCard from '../components/FallbackCard'
import GuardedComponent from '../components/GuardedComponent'
import OuterComponent from '../components/OuterComponent'
import UnguardedComponent from '../components/UnguardedComponent'

function BoundaryFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '2px dashed #94a3b8', borderRadius: 12, padding: 12, background: '#f8fafc' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}

function ContainerFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#ffffff' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}

export default function SectionNestedBoundaries() {
  const [outerCrash, setOuterCrash] = useState(false)
  const [guardedCrash, setGuardedCrash] = useState(false)
  const [unguardedCrash, setUnguardedCrash] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0 }}>A) Nested boundaries: who catches what?</h3>
      <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>
        Outer boundary catches <strong>Outer</strong> + <strong>Unguarded</strong>. Inner boundary catches <strong>Guarded</strong>.
      </p>
      <button
        onClick={() => {
          setOuterCrash(false)
          setGuardedCrash(false)
          setUnguardedCrash(false)
          setResetKey((k) => k + 1)
        }}
      >
        Reset section
      </button>

      <BoundaryFrame label="Outer ErrorBoundary">
        
        {/* This is the outer ErrorBoundary that will catch the error thrown by the outer component and the unguarded component */}
        <ErrorBoundary
          resetKeys={[resetKey]}

          fallbackRender={({ error, reset }) => {

            // error and reset come from the ErrorBoundary component
            // error is the error that was thrown by the guarded component
            // reset is a function that will reset the error state of the ErrorBoundary when the user clicks the "Try again" button

            // This is the fallback UI that will be shown when the error is thrown by the outer component or the unguarded component
            return (
              <FallbackCard
                error={error}
                onTryAgain={() => {
                  setOuterCrash(false)
                  setUnguardedCrash(false)
                  reset()
                }}
              />
            )
          }}
        >
          <div style={{ display: 'grid', gap: 12 }} key={resetKey}>
            <ContainerFrame label="Component inside outer boundary">
              
              {/* This is the outer component that will crash the outer boundary */}
              <OuterComponent boom={outerCrash} onBoom={() => setOuterCrash(true)} />
            
            </ContainerFrame>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <BoundaryFrame label="Inner ErrorBoundary">
                
                {/* This is the inner ErrorBoundary that will catch the error thrown by the guarded component */}
                <ErrorBoundary
                  fallbackRender={({ error, reset }) => {

                    // error and reset come from the ErrorBoundary component
                    // error is the error that was thrown by the guarded component
                    // reset is a function that will reset the error state of the ErrorBoundary when the user clicks the "Try again" button

                    // This is the fallback UI that will be shown when the error is thrown by the guarded component
                    return(
                      <FallbackCard
                        error={error}
                        onTryAgain={() => {
                          setGuardedCrash(false)
                          reset() // This will reset the error state of the inner ErrorBoundary
                        }}
                      />
                    )
                  }}
                >
                  {/* This is the guarded component that will crash the inner boundary */}
                  <GuardedComponent boom={guardedCrash} onBoom={() => setGuardedCrash(true)} />
                </ErrorBoundary>
              </BoundaryFrame>
              
              <ContainerFrame label="No boundary here">
                {/* This is the unguarded component that will crash the outer boundary */}
                <UnguardedComponent boom={unguardedCrash} onBoom={() => setUnguardedCrash(true)} />
              </ContainerFrame>

            </div>
          </div>
        </ErrorBoundary>
      </BoundaryFrame>
    </div>
  )
}
