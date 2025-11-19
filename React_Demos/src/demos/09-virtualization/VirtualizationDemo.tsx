import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import { useMemo, useState } from 'react'

const bigData = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  text: `Row #${i + 1}`,
}))

function Row({ index, style }: ListChildComponentProps) {
  const item = bigData[index]
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: '1px solid #eee',
        background: index % 2 === 0 ? '#fff' : '#fafafa',
      }}
    >
      <strong style={{ width: 60 }}>#{item.id}</strong>
      <span>{item.text}</span>
    </div>
  )
}

export default function VirtualizationDemo() {
  const [mode, setMode] = useState<'virtualized' | 'plain'>('virtualized')
  const [plainCount, setPlainCount] = useState(1000)
  const height = 360
  const itemSize = 40
  const approxVisible = Math.ceil(height / itemSize)
  const plainItems = useMemo(() => bigData.slice(0, plainCount), [plainCount])
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="radio"
            name="mode"
            checked={mode === 'virtualized'}
            onChange={() => setMode('virtualized')}
          />
          Virtualized (react-window)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="radio" name="mode" checked={mode === 'plain'} onChange={() => setMode('plain')} />
          Plain list (no virtualization)
        </label>
        {mode === 'plain' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Items to render:
            <select value={plainCount} onChange={(e) => setPlainCount(Number(e.target.value))}>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
              <option value={3000}>3000</option>
              <option value={10000}>10000 (may be slow)</option>
            </select>
          </label>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#475569' }}>
        Total dataset: {bigData.length.toLocaleString()} rows.{' '}
        {mode === 'virtualized' ? (
          <>Approx rendered at once: ~{approxVisible} (recycled as you scroll).</>
        ) : (
          <>Rendered DOM nodes: {plainItems.length.toLocaleString()} (all at once).</>
        )}
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: 6, background: '#fff' }}>
        {mode === 'virtualized' ? (
          <List height={height} itemCount={bigData.length} itemSize={itemSize} width={520}>
            {Row}
          </List>
        ) : (
          <div style={{ height, overflow: 'auto' }}>
            {plainItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  height: itemSize,
                  borderBottom: '1px solid #eee',
                  background: idx % 2 === 0 ? '#fff' : '#fafafa',
                }}
              >
                <strong style={{ width: 60 }}>#{item.id}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#475569' }}>
        Toggle between modes to feel the difference. Virtualization keeps the DOM small and smooth by reusing a
        handful of rows; the plain list mounts every item at once.
      </div>
    </section>
  )
}


