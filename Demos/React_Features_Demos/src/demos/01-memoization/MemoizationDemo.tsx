import { memo, useCallback, useMemo, useRef, useState } from 'react'

function useRenderCount() {
  const renders = useRef(0)
  renders.current += 1
  return renders.current
}

const MemoConfigChild = memo(function MemoConfigChild({
  config,
}: {
  config: { theme: 'light' | 'dark'; pageSize: number }
}) {
  const renders = useRenderCount()
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
      <div><strong>MemoConfigChild (React.memo)</strong> renders: {renders}</div>
      <div>config: {JSON.stringify(config)}</div>
    </div>
  )
})

function sumNumbers(numbers: number[], onCompute?: () => void) {
  onCompute?.()
  let s = 0
  for (let i = 0; i < numbers.length; i++) s += numbers[i]
  return s
}

// Define memoized child OUTSIDE the parent so its component type is stable between renders.
const ClickChild = memo(function ClickChildLocal({ onClick }: { onClick: () => void }) {
  const renders = useRenderCount()
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
      <div><strong>ClickChild (React.memo)</strong> renders: {renders}</div>
      <button onClick={onClick}>Child button</button>
    </div>
  )
})

export default function MemoizationDemo() {
  // Demo A: useMemo to stabilize object identity for a memoized child
  const [parentTick, setParentTick] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [pageSize, setPageSize] = useState(10)
  const [useMemoForConfig, setUseMemoForConfig] = useState(true)

  // Demo B: useMemo
  const [useMemoOn, setUseMemoOn] = useState(true)
  const [numbers, setNumbers] = useState<number[]>(() => Array.from({ length: 10 }, (_, i) => i + 1))
  const computeCountRef = useRef(0)
  const incCompute = () => { computeCountRef.current += 1 }
  const memoSum = useMemo(() => (useMemoOn ? sumNumbers(numbers, incCompute) : null), [numbers, useMemoOn])
  const derivedSum = useMemoOn ? (memoSum as number) : sumNumbers(numbers, incCompute)

  // Always call useMemo for the stable variant, and pick which one to pass.
  const stableConfig = useMemo(() => ({ theme, pageSize }), [theme, pageSize])
  // When not stabilizing, create a fresh object each render so identity changes.
  const config = useMemoForConfig ? stableConfig : { theme, pageSize }

  // Demo C: useCallback to stabilize handler identity for memoized child
  const [parentTickCb, setParentTickCb] = useState(0)
  const [useCbOn, setUseCbOn] = useState(true)
  const [childClicks, setChildClicks] = useState(0)
  const stableOnClick = useCallback(() => setChildClicks((c) => c + 1), [])
  const onClick = useCbOn ? stableOnClick : (() => setChildClicks((c) => c + 1))

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      {/* Demo A: useMemo stabilizes object references for memoized children */}
      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>A) useMemo stabilizes an object prop for a memoized child</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setParentTick((t) => t + 1)}>Re-render parent</button>
          <button onClick={() => setTheme((th) => (th === 'light' ? 'dark' : 'light'))}>Toggle theme</button>
          <button onClick={() => setPageSize((s) => (s === 10 ? 20 : 10))}>Toggle pageSize</button>
          <label>
            <input
              type="checkbox"
              checked={useMemoForConfig}
              onChange={(e) => setUseMemoForConfig(e.target.checked)}
            />{' '}
            Use useMemo for config
          </label>
          <span>Parent tick: {parentTick}</span>
        </div>
        <MemoConfigChild config={config} />
      </div>

      {/* Demo B: useMemo */}
      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>B) useMemo caches an expensive derived value</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            <input
              type="checkbox"
              checked={useMemoOn}
              onChange={(e) => {
                computeCountRef.current = 0
                setUseMemoOn(e.target.checked)
              }}
            />{' '}
            Use useMemo
          </label>
          <button
            onClick={() => {
              computeCountRef.current = 0
              setNumbers((arr) => [...arr, arr.length + 1])
            }}
          >
            Add number
          </button>
          <button
            onClick={() => {
              computeCountRef.current = 0
              setNumbers((arr) => (arr.length > 1 ? arr.slice(0, -1) : arr))
            }}
          >
            Remove number
          </button>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
          <div>Numbers: [{numbers.join(', ')}]</div>
          <div>Derived sum: {derivedSum}</div>
          <div>Sum compute calls this render: {computeCountRef.current}</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>
            With useMemo ON, recomputation happens only when numbers change. With it OFF, any re-render recomputes.
          </div>
        </div>
      </div>

      {/* Demo C: useCallback stabilizes function props for memoized children */}
      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>C) useCallback stabilizes a function prop for a memoized child</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setParentTickCb((t) => t + 1)}>Re-render parent</button>
          <label>
            <input
              type="checkbox"
              checked={useCbOn}
              onChange={(e) => setUseCbOn(e.target.checked)}
            />{' '}
            Use useCallback
          </label>
          <span>Parent tick: {parentTickCb}</span>
          <span>Child clicks: {childClicks}</span>
        </div>
        <ClickChild onClick={onClick} />
        <div style={{ fontSize: 12, color: '#475569' }}>
          With useCallback ON, the onClick prop keeps the same identity across parent re-renders,
          so React.memo skips child re-renders unless something else changes.
        </div>
      </div>
    </section>
  )
}


