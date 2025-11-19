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
    <section>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button onClick={() => { if (canAdd) { dispatch({ type: 'add', text }); setText('') } }} disabled={!canAdd}>
          Add
        </button>
      </div>
      <ul style={{ padding: 0, listStyle: 'none', marginTop: 12, display: 'grid', gap: 8 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e5e5', borderRadius: 6, padding: 8 }}>
            <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggle', id: t.id })} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            <button style={{ marginLeft: 'auto' }} onClick={() => dispatch({ type: 'remove', id: t.id })}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}


