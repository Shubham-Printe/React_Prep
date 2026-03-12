import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  const timeoutRef = useRef<number | null>(null)
  return useMemo(() => {
    return (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => { fn(...args) }, delayMs)
    }
  }, [fn, delayMs])
}

function useThrottledCallback<T extends (...args: any[]) => void>(fn: T, intervalMs: number) {
  const lastRef = useRef(0)
  return useMemo(() => {
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastRef.current >= intervalMs) {
        lastRef.current = now
        fn(...args)
      }
    }
  }, [fn, intervalMs])
}

export default function DebounceThrottleDemo() {
  // A) Debounce (input)
  const [debounceRaw, setDebounceRaw] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')
  const [debouncedCount, setDebouncedCount] = useState(0)

  // B) Throttle (input)
  const [throttleRaw, setThrottleRaw] = useState('')
  const [throttledValue, setThrottledValue] = useState('')
  const [throttledInputCount, setThrottledInputCount] = useState(0)

  // C) Throttle (scroll)
  const [scrollEvents, setScrollEvents] = useState({ raw: 0, throttled: 0 })
  const scrollBoxRef = useRef<HTMLDivElement | null>(null)

  const handleDebouncedChange = useDebouncedCallback((value: string) => {
    setDebouncedValue(value)
    setDebouncedCount((c) => c + 1)
  }, 500)
  const handleThrottledChange = useThrottledCallback((value: string) => {
    setThrottledValue(value)
    setThrottledInputCount((c) => c + 1)
  }, 500)

  const onScrollRaw = useCallback(() => {
    setScrollEvents((e) => ({ ...e, raw: e.raw + 1 }))
  }, [])
  const onScrollThrottled = useThrottledCallback(() => {
    setScrollEvents((e) => ({ ...e, throttled: e.throttled + 1 }))
  }, 200)

  useEffect(() => {
    const el = scrollBoxRef.current
    if (!el) return
    el.addEventListener('scroll', onScrollRaw)
    el.addEventListener('scroll', onScrollThrottled)
    return () => {
      el.removeEventListener('scroll', onScrollRaw)
      el.removeEventListener('scroll', onScrollThrottled)
    }
  }, [onScrollRaw, onScrollThrottled])

  return (
    <section>
      <div style={{ display: 'grid', gap: 20, maxWidth: 640 }}>
        {/* A) Debounce */}
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={{ margin: 0 }}>A) Debounce (wait for a pause)</h3>
          <label>
            Type quickly (debounce 500ms)
            <input
              value={debounceRaw}
              onChange={(e) => {
                const value = e.target.value
                setDebounceRaw(value)
                handleDebouncedChange(value)
              }}
              placeholder="Debounced input"
            />
          </label>
          <div>Debounced value: <code>{debouncedValue}</code></div>
          <div>Debounced handler calls: {debouncedCount}</div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            The handler runs once after you stop typing for 500ms.
          </div>
        </div>

        {/* B) Throttle */}
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={{ margin: 0 }}>B) Throttle (at most once per interval)</h3>
          <label>
            Type quickly (throttle 500ms)
            <input
              value={throttleRaw}
              onChange={(e) => {
                const value = e.target.value
                setThrottleRaw(value)
                handleThrottledChange(value)
              }}
              placeholder="Throttled input"
            />
          </label>
          <div>Throttled value: <code>{throttledValue}</code></div>
          <div>Throttled handler calls: {throttledInputCount}</div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            The handler runs at most once every 500ms while you continue typing.
          </div>
        </div>

        {/* C) Throttle (scroll) */}
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={{ margin: 0 }}>C) Throttle (scroll events)</h3>
          {/* Keep the counters outside the scrollable region for clear visibility */}
          <div>
            Raw scroll events: <strong>{scrollEvents.raw}</strong> | Throttled scroll events:{' '}
            <strong>{scrollEvents.throttled}</strong>
          </div>
          <div ref={scrollBoxRef} style={{ height: 200, overflow: 'auto', border: '1px solid #ddd', padding: 8, background: '#fff' }}>
            <div style={{ height: 1000 }}>
              Scroll this box to see event throttling. The counters above remain fixed while you scroll.
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Raw counts every scroll event; throttled counts at most once every 200ms.
          </div>
        </div>
      </div>
    </section>
  )
}


