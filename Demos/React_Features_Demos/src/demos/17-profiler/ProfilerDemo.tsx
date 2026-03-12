import React, { useCallback, useMemo, useState } from 'react'

type Item = { id: number; label: string }

function busyWait(ms: number) {
  const start = performance.now()
  while (performance.now() - start < ms) {
    // spin
  }
}

function BaselineExpensiveBadge({ value, workMs }: { value: number; workMs: number }) {
  // Heavy work happens on every render of every row
  busyWait(workMs)
  return <span style={{ marginLeft: 8, color: '#475569' }}>Score: {value}</span>
}

function BaselineItemRow({
  item,
  onSelect,
  rowStyle,
  workMs,
}: {
  item: Item
  onSelect: (id: number) => void
  rowStyle: React.CSSProperties
  workMs: number
}) {
  // Inline handler + fresh style object every render → unstable props
  return (
    <div style={rowStyle} onClick={() => onSelect(item.id)}>
      {item.label} <BaselineExpensiveBadge value={item.id % 10} workMs={workMs} />
    </div>
  )
}

const OptimizedExpensiveBadge = React.memo(function OptimizedExpensiveBadge({
  value,
  workMs,
}: {
  value: number
  workMs: number
}) {
  // Heavy work is memoized; recomputes only when value changes
  const text = useMemo(() => {
    busyWait(workMs)
    return `Score: ${value}`
  }, [value, workMs])
  return <span style={{ marginLeft: 8, color: '#475569' }}>{text}</span>
})

const OptimizedItemRow = React.memo(function OptimizedItemRow({
  item,
  onSelect,
  rowStyle,
  workMs,
}: {
  item: Item
  onSelect: (id: number) => void
  rowStyle: React.CSSProperties
  workMs: number
}) {
  return (
    <div style={rowStyle} onClick={() => onSelect(item.id)}>
      {item.label} <OptimizedExpensiveBadge value={item.id % 10} workMs={workMs} />
    </div>
  )
})

function BaselineList({ workMs }: { workMs: number }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const items = useMemo(
    () => Array.from({ length: 500 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` })),
    []
  )

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder="Filter…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <span style={{ color: '#334155' }}>Selected: {selectedId ?? 'none'}</span>
      </div>
      <div style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
        Baseline: typing re-renders many rows; heavy work runs in each row render.
      </div>
      <div style={{ marginTop: 8, maxHeight: 360, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
        {filtered.map((item) => (
          <BaselineItemRow
            key={item.id}
            item={item}
            onSelect={setSelectedId}
            // fresh object every render → unstable
            rowStyle={{ padding: 8, border: '1px solid #e2e8f0', marginTop: 6, borderRadius: 6, cursor: 'pointer' }}
            workMs={workMs}
          />
        ))}
      </div>
    </div>
  )
}

function OptimizedList({ workMs }: { workMs: number }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const items = useMemo(
    () => Array.from({ length: 500 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` })),
    []
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return items.filter((i) => i.label.toLowerCase().includes(q))
  }, [items, query])

  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      padding: 8,
      border: '1px solid #e2e8f0',
      marginTop: 6,
      borderRadius: 6,
      cursor: 'pointer',
    }),
    []
  )

  const handleSelect = useCallback((id: number) => setSelectedId(id), [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder="Filter…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <span style={{ color: '#334155' }}>Selected: {selectedId ?? 'none'}</span>
      </div>
      <div style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
        Optimized: rows are memoized and receive stable props; heavy work is memoized.
      </div>
      <div style={{ marginTop: 8, maxHeight: 360, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
        {filtered.map((item) => (
          <OptimizedItemRow key={item.id} item={item} onSelect={handleSelect} rowStyle={rowStyle} workMs={workMs} />
        ))}
      </div>
    </div>
  )
}

export default function ProfilerDemo() {
  const [mode, setMode] = useState<'baseline' | 'optimized'>('baseline')
  const [workMs, setWorkMs] = useState(6)

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      

      <div
        style={{
          border: '1px solid #e5e7eb',
          background: '#f8fafc',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>General: Reading Timeline, Flamegraph, Ranked</div>
        <ul style={{ margin: '6px 0 8px 18px', color: '#334155', fontSize: 14, listStyle: 'disc' }}>
          <li><strong>Timeline</strong>: long Commit bars = slow render passes. Start with the longest commit.</li>
          <li><strong>Flamegraph</strong>: color = render cost; gray = skipped; width ≈ total time incl. children. Wide/hot = bottleneck.</li>
          <li><strong>Ranked</strong>: sorted by render time; top entries are the worst offenders in the commit.</li>
          <li><strong>Component panel</strong>: check Self vs Total time and “Why did this render?” to choose fixes (memoize, stabilize props, move work).</li>
        </ul>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Profile this demo (Baseline → Optimized)</div>
        <ol style={{ margin: 0, paddingLeft: 18, color: '#334155', fontSize: 14 }}>
          <li>Set Mode = Baseline. Optionally increase “Work per row (ms)” to 6–10.</li>
          <li>Open React DevTools → Profiler, click “Start profiling”.</li>
          <li>Type in the Filter box and scroll the list for a few seconds.</li>
          <li>Stop profiling. Timeline: long Commit = slow. Flamegraph: wide/colored <code>ItemRow</code>/<code>ExpensiveBadge</code>. Ranked: they appear near the top.</li>
          <li>Set Mode = Optimized. Start profiling again, repeat typing + scrolling.</li>
          <li>Stop profiling and compare: shorter Commit, many rows gray (skipped), lower cost for rows/badge in Ranked.</li>
        </ol>
        <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#334155' }}>Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'baseline' | 'optimized')}
              style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            >
              <option value="baseline">Baseline (slow)</option>
              <option value="optimized">Optimized (fast)</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#334155' }}>Work per row (ms)</span>
            <input
              type="number"
              min={0}
              max={20}
              value={workMs}
              onChange={(e) => setWorkMs(Number(e.target.value))}
              style={{ width: 72, padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </label>
        </div>
        <div style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
          Legend: hotter color = slower; gray = skipped this commit; width ≈ total time incl. children. See right panel for Self vs Total.
        </div>
      </div>

      

      {mode === 'baseline' ? <BaselineList workMs={workMs} /> : <OptimizedList workMs={workMs} />}
    </div>
  )
}


