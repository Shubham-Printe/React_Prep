export default function OuterComponent({ boom, onBoom }: { boom: boolean; onBoom: () => void }) {
  if (boom) throw new Error('Outer Component crashed')
  return (
    <div style={{ border: '1px solid #0ea5e9', borderRadius: 10, padding: 12, background: '#f0f9ff' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Outer Component (inside outer boundary)</div>
      <button onClick={onBoom}>Crash Outer Component</button>
    </div>
  )
}
