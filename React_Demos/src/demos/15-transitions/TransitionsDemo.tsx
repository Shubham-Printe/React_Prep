import { useMemo, useState, useTransition } from 'react'

const DATA = Array.from({ length: 4000 }, (_, i) => `Item ${i + 1} - ${Math.random().toString(36).slice(2)}`)

export default function TransitionsDemo() {
  const [query, setQuery] = useState('')
  const [displayQuery, setDisplayQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = displayQuery.toLowerCase()
    if (!q) return DATA.slice(0, 200)
    return DATA.filter((x) => x.toLowerCase().includes(q)).slice(0, 500)
  }, [displayQuery])

  return (
    <section>
      <input
        value={query}
        onChange={(e) => {
          const v = e.target.value
          setQuery(v)
          startTransition(() => setDisplayQuery(v))
        }}
        placeholder="Filter items…"
      />
      {isPending && <div>Updating list…</div>}
      <ul style={{ maxHeight: 320, overflow: 'auto' }}>
        {filtered.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </section>
  )
}


