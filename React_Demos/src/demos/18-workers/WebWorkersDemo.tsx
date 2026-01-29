// Web Workers Demo (UI side)
// What this demo shows:
// - The same CPU-heavy task (counting primes) executed in two ways:
//   1) On the main thread: blocks typing/animation if the workload is large enough.
//   2) In a Web Worker: runs off the main thread, keeping the UI responsive.
// - Controls to scale work: N (range size), Passes (repeat whole task), Work factor (repeat per number).
// - A simple spinner and typing input to visually detect jank vs smoothness.
//
// How it works:
// - We create a worker via Vite's pattern: new Worker(new URL('./heavyWorker.ts', import.meta.url), { type: 'module' }).
// - We send a "countPrimes" message with parameters; worker posts back the result and a measured duration.
// - Cancellation is cooperative: the UI sends a "cancel" message; the worker checks a flag and stops ASAP.
// - For a fair comparison, the main-thread path and the worker path perform equivalent work.
//
// Notes:
// - This is a synthetic workload for demonstration. Real CPU tasks could be image processing, parsing, compression, etc.
// - For very large inputs, browsers may throttle/tab-suspend; use with caution.
import React, { useEffect, useMemo, useRef, useState } from 'react'

type WorkerResult =
  | { kind: 'result'; jobId: number; count: number; durationMs: number }
  | { kind: 'error'; jobId: number; message: string }

export default function WebWorkersDemo() {
  const [n, setN] = useState(2_000_000)
  const [passes, setPasses] = useState(1)
  const [repeat, setRepeat] = useState(1)
  const [jobId, setJobId] = useState(0)
  const [mainResult, setMainResult] = useState<{ count: number; durationMs: number } | null>(null)
  const [workerResult, setWorkerResult] = useState<{ count: number; durationMs: number } | null>(null)
  const [workerBusy, setWorkerBusy] = useState(false)
  const [mainBusy, setMainBusy] = useState(false)
  const [typingEcho, setTypingEcho] = useState('')
  const spinnerTick = useSpinner()
  const workerRef = useRef<Worker | null>(null)

  // Create worker once
  useEffect(() => {
    // Vite-friendly worker creation: resolves to a proper URL for the module worker
    const w = new Worker(new URL('./heavyWorker.ts', import.meta.url), { type: 'module' })
    workerRef.current = w
    // Handle responses from the worker (success/error)
    w.onmessage = (e: MessageEvent<WorkerResult>) => {
      const data = e.data
      if (data.kind === 'result') {
        setWorkerBusy(false)
        setWorkerResult({ count: data.count, durationMs: data.durationMs })
      } else if (data.kind === 'error') {
        setWorkerBusy(false)
        setWorkerResult(null)
      }
    }
    w.onerror = () => {
      setWorkerBusy(false)
      setWorkerResult(null)
    }
    // Tear down on unmount
    return () => {
      w.terminate()
      workerRef.current = null
    }
  }, [])

  const handleRunMain = () => {
    // Run the same algorithm on the main thread (UI will jank if heavy)
    setMainResult(null)
    setMainBusy(true)
    const t0 = performance.now()
    let count = 0
    for (let p = 0; p < passes; p++) {
      count = countPrimesUpTo(n, repeat)
    }
    const t1 = performance.now()
    setMainResult({ count, durationMs: t1 - t0 })
    setMainBusy(false)
  }

  const handleRunWorker = () => {
    // Offload the work to the worker; UI remains responsive while it computes
    setWorkerResult(null)
    setWorkerBusy(true)
    const id = jobId + 1
    setJobId(id)
    workerRef.current?.postMessage({ kind: 'countPrimes', n, jobId: id, passes, repeat })
  }

  const handleCancelWorker = () => {
    if (!workerBusy) return
    // Ask the worker to stop the current job (cooperative flag, checked in its loop)
    workerRef.current?.postMessage({ kind: 'cancel', jobId })
    setWorkerBusy(false)
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Web Workers: keep the UI responsive</div>
      <p style={{ margin: 0, color: '#334155' }}>
        Compare running a CPU-heavy calculation on the main thread vs inside a Web Worker. While it runs, try typing in the
        input or watch the spinner; the worker path keeps the UI responsive.
      </p>

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
        <label style={{ color: '#0f172a' }}>Upper bound (N) for prime counting</label>
        <input
          type="number"
          min={100_000}
          step={100_000}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        <div />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Quick workload presets */}
          <Preset onClick={() => setN(200_000)} label="200k" />
          <Preset onClick={() => setN(1_000_000)} label="1M" />
          <Preset onClick={() => setN(2_000_000)} label="2M" />
          <Preset onClick={() => setN(4_000_000)} label="4M" />
          <Preset onClick={() => setN(8_000_000)} label="8M" />
          <Preset onClick={() => setN(16_000_000)} label="16M" />
        </div>
        <label style={{ color: '#0f172a' }}>Passes (repeat task)</label>
        <input
          type="number"
          min={1}
          max={10}
          step={1}
          value={passes}
          onChange={(e) => setPasses(Math.max(1, Math.min(10, Number(e.target.value))))}
          style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        <label style={{ color: '#0f172a' }}>Work factor (repeat per number)</label>
        <input
          type="number"
          min={1}
          max={32}
          step={1}
          value={repeat}
          onChange={(e) => setRepeat(Math.max(1, Math.min(32, Number(e.target.value))))}
          style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        <label style={{ color: '#0f172a' }}>Typing echo (try while running)</label>
        <input
          placeholder="Type here while tasks run…"
          value={typingEcho}
          onChange={(e) => setTypingEcho(e.target.value)}
          style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        {/* Spinner ticks on an interval; if the main thread is blocked, this stalls */}
        <div style={{ whiteSpace: 'nowrap', color: '#334155' }}>Spinner: {spinnerTick}</div>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#ffffff' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Main thread</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={handleRunMain}
              disabled={mainBusy}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #94a3b8',
                background: mainBusy ? '#e5e7eb' : '#e2e8f0',
                cursor: mainBusy ? 'not-allowed' : 'pointer',
              }}
            >
              {mainBusy ? 'Running… (blocks UI)' : 'Run on main thread'}
            </button>
          </div>
          <div style={{ marginTop: 8, color: '#334155' }}>
            {mainResult ? (
              <span>
                Count: {mainResult.count.toLocaleString()} • Duration: {mainResult.durationMs.toFixed(0)} ms
              </span>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#ffffff' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Web Worker</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={handleRunWorker}
              disabled={workerBusy}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #94a3b8',
                background: workerBusy ? '#e5e7eb' : '#e2e8f0',
                cursor: workerBusy ? 'not-allowed' : 'pointer',
              }}
            >
              {workerBusy ? 'Running in worker…' : 'Run in worker'}
            </button>
            <button
              onClick={handleCancelWorker}
              disabled={!workerBusy}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #ef4444',
                background: !workerBusy ? '#f8fafc' : '#fee2e2',
                color: '#991b1b',
                cursor: !workerBusy ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
          <div style={{ marginTop: 8, color: '#334155' }}>
            {workerResult ? (
              <span>
                Count: {workerResult.count.toLocaleString()} • Duration: {workerResult.durationMs.toFixed(0)} ms
              </span>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ border: '1px dashed #94a3b8', borderRadius: 12, padding: 12, background: '#f8fafc' }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>How this works</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#334155' }}>
          <li>Main thread: runs a prime counter, blocking input/animation while it executes.</li>
          <li>Worker: runs the same algorithm off the main thread and posts the result back.</li>
          <li>Includes simple cancellation (cooperative flag) and per-run timing.</li>
          <li>If you don’t see blocking on main-thread, increase N, Passes, or Work factor (e.g., 8M–16M, 4–8 passes, work 8–16).</li>
        </ul>
      </div>
    </div>
  )
}

function useSpinner() {
  // A tiny animated spinner; helps visualize if the main thread is blocked
  const frames = useMemo(() => ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'], [])
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % frames.length), 80)
    return () => clearInterval(id)
  }, [frames.length])
  return frames[i]
}

function Preset({ label, onClick }: { label: string; onClick: () => void }) {
  // Small button for quick workload presets
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid #94a3b8',
        background: '#e2e8f0',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function isPrime(x: number): boolean {
  // Duplicated here to keep main-thread and worker paths comparable
  if (x < 2) return false
  if (x % 2 === 0) return x === 2
  const limit = Math.floor(Math.sqrt(x))
  for (let d = 3; d <= limit; d += 2) {
    if (x % d === 0) return false
  }
  return true
}

function countPrimesUpTo(n: number, repeat: number): number {
  // Same algorithm as in the worker, but executed on the main thread
  // "repeat" increases CPU work per number to amplify blocking
  let count = 0
  for (let i = 2; i <= n; i++) {
    let prime = false
    for (let r = 0; r < repeat; r++) {
      const res = isPrime(i)
      if (res) prime = true
    }
    if (prime) count++
  }
  return count
}


