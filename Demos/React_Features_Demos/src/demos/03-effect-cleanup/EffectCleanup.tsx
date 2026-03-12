import { useEffect, useRef, useState } from 'react'

export default function EffectCleanup() {
  const [isRunning, setIsRunning] = useState(false)
  const [ticks, setTicks] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = window.setInterval(() => {
      setTicks((t) => t + 1)
    }, 1000)
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  return (
    <section>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={() => setIsRunning((v) => !v)}>{isRunning ? 'Stop' : 'Start'}</button>
        <button onClick={() => setTicks(0)}>Reset</button>
        <span>Ticks: {ticks}</span>
      </div>
    </section>
  )
}


