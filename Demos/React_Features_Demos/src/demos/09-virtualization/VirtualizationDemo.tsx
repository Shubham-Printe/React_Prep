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
  const [plainCount, setPlainCount] = useState(1000)
  const height = 360
  const itemSize = 40
  const approxVisible = Math.ceil(height / itemSize)
  const plainItems = useMemo(() => bigData.slice(0, plainCount), [plainCount])
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 600 }}>Compare side by side</div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Total dataset: {bigData.length.toLocaleString()} rows
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          Plain list items:
          <select value={plainCount} onChange={(e) => setPlainCount(Number(e.target.value))}>
            <option value={100}>100</option>
            <option value={1000}>1000</option>
            <option value={3000}>3000</option>
            <option value={10000}>10000 (may be slow)</option>
          </select>
        </label>
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 6, background: '#fff' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 600 }}>
            Virtualized (react-window)
          </div>
          <div style={{ padding: '8px 8px 0', fontSize: 12, color: '#475569' }}>
            Approx rendered at once: ~{approxVisible} rows (recycled as you scroll)
          </div>
          <List height={height} itemCount={bigData.length} itemSize={itemSize} width={520}>
            {Row}
          </List>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 6, background: '#fff' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 600 }}>
            Plain list (no virtualization)
          </div>
          <div style={{ padding: '8px 8px 0', fontSize: 12, color: '#475569' }}>
            Rendered DOM nodes: {plainItems.length.toLocaleString()}
          </div>
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
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#475569' }}>
        Virtualization keeps the DOM tiny and scrolling smooth. The plain list mounts every item and gets heavy as the
        count increases.
      </div>
    </section>
  )
}


