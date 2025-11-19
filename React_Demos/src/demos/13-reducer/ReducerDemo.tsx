import { useReducer, useState } from 'react'

type Todo = { id: number; text: string; done: boolean }
type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }]
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
    case 'remove':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

export default function ReducerDemo() {
  const [todos, dispatch] = useReducer(reducer, [])
  const [text, setText] = useState('')
  const canAdd = text.trim().length > 0
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#f8fafc', display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <button
          onClick={() => { if (canAdd) { dispatch({ type: 'add', text }); setText('') } }}
          disabled={!canAdd}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #94a3b8',
            background: canAdd ? '#e2e8f0' : '#f1f5f9',
            color: '#0f172a',
            cursor: canAdd ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap'
          }}
        >
          Add
        </button>
      </div>
      <ul style={{ padding: 0, listStyle: 'none', margin: 0, display: 'grid', gap: 8 }}>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 10,
              background: t.done ? '#f1f5f9' : '#ffffff'
            }}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => dispatch({ type: 'toggle', id: t.id })}
            />
            <span
              style={{
                textDecoration: t.done ? 'line-through' : 'none',
                color: t.done ? '#64748b' : '#0f172a'
              }}
            >
              {t.text}
            </span>
            <button
              style={{
                marginLeft: 'auto',
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #ef4444',
                background: '#fee2e2',
                color: '#991b1b',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onClick={() => dispatch({ type: 'remove', id: t.id })}
            >
              Remove
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 12,
              color: '#64748b',
              background: '#ffffff'
            }}
          >
            No todos yet. Add your first task above.
          </li>
        )}
      </ul>
    </section>
  )
}


