export default function GuardedComponent({ boom, onBoom }: { boom: boolean; onBoom: () => void }) {
  if (boom) throw new Error('Guarded Component crashed')
  return (
    <div style={{ border: '1px solid #a78bfa', borderRadius: 10, padding: 12, background: '#f5f3ff' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Guarded Component (wrapped by inner boundary)</div>
      <button onClick={onBoom}>Crash Guarded Component</button>
    </div>
  )
}
