// Minimal worker that runs a CPU-heavy task without blocking the UI
// Web Worker module (runs in a separate thread from the main UI thread).
// Key ideas:
// - A Web Worker executes JS off the main thread, so CPU-heavy work here won't block typing, scrolling, or animations.
// - Communication is done via postMessage/onmessage, passing serializable data (structured clone).
// - For big binary payloads, prefer Transferables (e.g., ArrayBuffer) to avoid copying.
// - This worker implements a simple "protocol" with typed messages (MsgIn/MsgOut) and cooperative cancellation.
//
// What this specific worker does:
// - Counts prime numbers up to N using a CPU-heavy loop.
// - "passes": repeats the whole task multiple times (inflate total work).
// - "repeat": repeats the primality check per number (inflate per-iteration work).
// - Supports cancellation: the main thread can ask the worker to stop by jobId.
//
// How the demo uses it:
// - The app posts a { kind: 'countPrimes', n, passes, repeat, jobId } message.
// - The worker runs the job off the main thread and posts back a { kind: 'result', ... } with duration.
// - If the user hits Cancel, the app posts { kind: 'cancel', jobId } and the worker stops ASAP.
export {}

type MsgIn =
  | { kind: 'countPrimes'; n: number; jobId: number; passes?: number; repeat?: number }
  | { kind: 'cancel'; jobId: number }

type MsgOut =
  | { kind: 'result'; jobId: number; count: number; durationMs: number }
  | { kind: 'error'; jobId: number; message: string }

// Cooperative cancellation flags by jobId
const cancelled: Record<number, boolean> = {}

// Deterministic, CPU-bound check that scales reasonably with input size
function isPrime(x: number): boolean {
  if (x < 2) return false
  if (x % 2 === 0) return x === 2
  const limit = Math.floor(Math.sqrt(x))
  for (let d = 3; d <= limit; d += 2) {
    if (x % d === 0) return false
  }
  return true
}

// Core counting loop:
// - Checks each integer up to n
// - Repeats primality check "repeat" times per number to inflate CPU work
// - Honors cancellation for responsiveness
function countPrimesUpTo(n: number, jobId: number, repeat: number): number {
  let count = 0
  for (let i = 2; i <= n; i++) {
    if (cancelled[jobId]) break
    // Repeat primality checks to inflate CPU work while keeping semantics
    let prime = false
    for (let r = 0; r < repeat; r++) {
      // Short-circuit not used intentionally to preserve work
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = isPrime(i)
      if (res) prime = true
    }
    if (prime) count++
  }
  return count
}

// Worker global scope
const ctx: any = self as any
ctx.onmessage = (e: MessageEvent<MsgIn>) => {
  const msg = e.data
  if (msg.kind === 'cancel') {
    cancelled[msg.jobId] = true
    return
  }
  if (msg.kind === 'countPrimes') {
    const { n, jobId } = msg
    const passes = msg.passes ?? 1
    const repeat = Math.max(1, msg.repeat ?? 1)
    cancelled[jobId] = false
    try {
      // Measure only the worker-side CPU work (roughly)
      const t0 = performance.now()
      let count = 0
      for (let p = 0; p < passes; p++) {
        if (cancelled[jobId]) break
        count = countPrimesUpTo(n, jobId, repeat)
      }
      const t1 = performance.now()
      const out: MsgOut = { kind: 'result', jobId, count, durationMs: t1 - t0 }
      ctx.postMessage(out)
    } catch (err: any) {
      const out: MsgOut = { kind: 'error', jobId, message: err?.message ?? String(err) }
      ctx.postMessage(out)
    }
  }
}


