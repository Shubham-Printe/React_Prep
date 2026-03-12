export default function FallbackCard({ error, onTryAgain }: { error: unknown; onTryAgain: () => void }) {
  return (
    <div style={{ border: '1px solid #94a3b8', padding: 12, borderRadius: 8, color: '#0f172a', background: '#f8fafc' }}>
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
