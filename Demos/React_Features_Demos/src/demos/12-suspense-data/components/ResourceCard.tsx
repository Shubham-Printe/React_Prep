import { Suspense } from 'react'
import LoadingFallback from './LoadingFallback'
import SuspenseErrorBoundary from './SuspenseErrorBoundary'
import SuspenseErrorFallback from './SuspenseErrorFallback'

export default function ResourceCard({
  badge,
  title,
  onRetry,
  children,
}: {
  badge: string
  title: string
  onRetry: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            background: '#e2e8f0',
            border: '1px solid #94a3b8',
            borderRadius: 999,
            padding: '2px 8px',
            fontSize: 12,
            color: '#0f172a',
          }}
        >
          {badge}
        </span>
        <div style={{ fontWeight: 600 }}>{title}</div>
      </div>

      <SuspenseErrorBoundary
        fallback={(retry, error) => <SuspenseErrorFallback error={error} onRetry={() => { onRetry(); retry() }} />}
      >
        <Suspense fallback={<LoadingFallback label={badge.toLowerCase()} />}>{children}</Suspense>
      </SuspenseErrorBoundary>
    </div>
  )
}
