import { memo, useCallback, useRef, useState } from 'react'

function useRenderCount() {
  const renders = useRef(0)
  renders.current += 1
  return renders.current
}

// Part A: single memoized child receiving a handler
const ClickChild = memo(function ClickChild({ onClick }: { onClick: () => void }) {
  const renders = useRenderCount()
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
      <div><strong>ClickChild (React.memo)</strong> renders: {renders}</div>
      <button onClick={onClick}>Child button</button>
    </div>
  )
})

// Part B: memoized list rows; each row gets stable onToggle(id) reference and local selected prop
const Row = memo(function Row({
  id,
  selected,
  onToggle,
}: {
  id: number
  selected: boolean
  onToggle: (id: number) => void
}) {
  const renders = useRenderCount()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid #e5e5e5',
        borderRadius: 6,
        padding: 8,
      }}
    >
      <span>Row {id}</span>
      <button onClick={() => onToggle(id)}>{selected ? 'Unselect' : 'Select'}</button>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>renders: {renders}</span>
    </div>
  )
})

export default function UseCallbackDemo() {
  // Part A controls
  const [parentTick, setParentTick] = useState(0)
  const [useCbForChild, setUseCbForChild] = useState(true)
  const [childClicks, setChildClicks] = useState(0)
  const onChildClickStable = useCallback(() => setChildClicks((c) => c + 1), [])
  const onChildClick = useCbForChild ? onChildClickStable : (() => setChildClicks((c) => c + 1))

  // Part B controls
  const [useCbForRows, setUseCbForRows] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const onToggleStable = useCallback((id: number) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }, [])
  const onToggle = useCbForRows
    ? onToggleStable
    : ((id: number) =>
        setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])))

  const rows = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      {/* Part A */}
      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>A) Stable handler keeps memoized child from re-rendering</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setParentTick((t) => t + 1)}>Re-render parent</button>
          <label>
            <input
              type="checkbox"
              checked={useCbForChild}
              onChange={(e) => setUseCbForChild(e.target.checked)}
            />{' '}
            Use useCallback for child handler
          </label>
          <span>Parent tick: {parentTick}</span>
          <span>Child clicks: {childClicks}</span>
        </div>
        <ClickChild onClick={onChildClick} />
        <div style={{ fontSize: 12, color: '#475569' }}>
          With useCallback ON, the onClick function identity stays the same across parent re-renders,
          so React.memo skips child re-renders unless something else changes.
        </div>
      </div>

      {/* Part B */}
      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>B) Stable shared handler prevents list-wide re-renders</h3>
        <label>
          <input
            type="checkbox"
            checked={useCbForRows}
            onChange={(e) => setUseCbForRows(e.target.checked)}
          />{' '}
          Use useCallback for list row handler
        </label>
        <div style={{ display: 'grid', gap: 8 }}>
          {rows.map((id) => (
            <Row key={id} id={id} selected={selectedIds.includes(id)} onToggle={onToggle} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          With useCallback ON, each Row receives the same onToggle reference, so re-rendering the
          parent doesn’t force all rows to re-render. Only the toggled row re-renders when its
          selected state changes.
        </div>
      </div>
    </section>
  )
}



