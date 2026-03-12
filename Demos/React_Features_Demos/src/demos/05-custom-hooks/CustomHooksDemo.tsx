import { useEffect, useRef, useState } from 'react'

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => { ref.current = value }, [value])
  return ref.current
}

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch { return initialValue }
  })
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])
  return [state, setState] as const
}

export default function CustomHooksDemo() {
  // A) usePrevious: capture the previous value across renders
  const [temp, setTemp] = useState('')
  const prevTemp = usePrevious(temp)

  // B) useLocalStorageState: persist state to localStorage
  const [persistedName, setPersistedName] = useLocalStorageState('demo-name', '')
  return (
    <section style={{ display: 'grid', gap: 20 }}>
      {/* Part A: usePrevious */}
      <div style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>A) usePrevious keeps last render’s value</h3>
        <label>
          Value:{' '}
          <input
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            placeholder="Type and watch previous update"
          />
        </label>
        <div>Current: <code>{temp || '(empty)'}</code></div>
        <div>Previous: <code>{prevTemp ?? '(none yet)'}</code></div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Previous updates after commit: type to change Current; on the next render, Previous shows the last value.
        </div>
      </div>

      {/* Part B: useLocalStorageState */}
      <div style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>B) useLocalStorageState persists between reloads</h3>
        <label>
          Name (persisted):{' '}
          <input
            value={persistedName}
            onChange={(e) => setPersistedName(e.target.value)}
            placeholder="Stored in localStorage"
          />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              try { window.localStorage.removeItem('demo-name') } catch {}
              setPersistedName('')
            }}
          >
            Clear storage key
          </button>
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Tip: Open DevTools → Application → Local Storage to see key <code>demo-name</code>.
        </div>
      </div>
    </section>
  )
}


