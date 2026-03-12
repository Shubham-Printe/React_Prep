export default function UnguardedComponent({ boom, onBoom }: { boom: boolean; onBoom: () => void }) {
  if (boom) throw new Error('Unguarded Component crashed')
  return (
    <div style={{ border: '1px solid #34d399', borderRadius: 10, padding: 12, background: '#ecfdf5' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Unguarded Component (no inner boundary)</div>
      <button onClick={onBoom}>Crash Unguarded Component</button>
    </div>
  )
}
