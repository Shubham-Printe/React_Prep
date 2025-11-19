import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <section>
      <h3>Counter</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setCount((c) => c - 1)}>-1</button>
        <strong>{count}</strong>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </section>
  )
}


