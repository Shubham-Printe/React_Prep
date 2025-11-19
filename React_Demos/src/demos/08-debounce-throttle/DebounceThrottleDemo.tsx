import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [text, setText] = useState('')
  const [debouncedCount, setDebouncedCount] = useState(0)
  const [throttledCount, setThrottledCount] = useState(0)
  const [scrollEvents, setScrollEvents] = useState({ raw: 0, throttled: 0 })

  const handleDebouncedChange = useDebouncedCallback((value: string) => {
    setDebouncedCount((c) => c + 1)
  }, 500)
  const handleThrottledChange = useThrottledCallback((value: string) => {
    setThrottledCount((c) => c + 1)
  }, 500)

  useEffect(() => {
    function onScrollRaw() { setScrollEvents((e) => ({ ...e, raw: e.raw + 1 })) }
    const onScrollThrottled = useThrottledCallback(() => {
      setScrollEvents((e) => ({ ...e, throttled: e.throttled + 1 }))
    }, 200)
    window.addEventListener('scroll', onScrollRaw)
    window.addEventListener('scroll', onScrollThrottled)
    return () => {
      window.removeEventListener('scroll', onScrollRaw)
      window.removeEventListener('scroll', onScrollThrottled)
    }
  }, [])

  return (
    <section>
      <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <label>
          Input (simulates rapid events)
          <input
            value={text}
            onChange={(e) => {
              const value = e.target.value
              setText(value)
              handleDebouncedChange(value)
              handleThrottledChange(value)
            }}
            placeholder="Type fast..."
          />
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <div>Debounced handler calls: {debouncedCount}</div>
          <div>Throttled handler calls: {throttledCount}</div>
        </div>
        <div style={{ height: 200, overflow: 'auto', border: '1px solid #ddd', padding: 8 }}>
          <div style={{ height: 1000 }}>
            Scroll this box to see event throttling:
            <div style={{ marginTop: 8 }}>
              Raw scroll events: {scrollEvents.raw} | Throttled scroll events: {scrollEvents.throttled}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


