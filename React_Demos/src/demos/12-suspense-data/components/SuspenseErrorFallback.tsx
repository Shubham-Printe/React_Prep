export default function SuspenseErrorFallback({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fff1f2', color: '#991b1b', borderRadius: 8, padding: 10 }}>
      <div style={{ marginBottom: 6 }}>{String((error as any)?.message ?? 'Error')}</div>
      <div style={{ display: 'flex' }}>
        <button
          onClick={onRetry}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ef4444', background: '#ffe4e6', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
