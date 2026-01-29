import { useState } from 'react'

export default function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial)

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <div>
        <button type="button" onClick={() => setCount((value) => value - 1)}>
          Decrease
        </button>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Increase
        </button>
      </div>
    </div>
  )
}
