import { useRef, useState } from 'react'

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

export default function FormsDemo() {
  // A) Controlled inputs with inline validation
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [touched, setTouched] = useState({ email: false, name: false })
  const errors = {
    name: name.trim().length < 2 ? 'Name must be at least 2 characters' : '',
    email: !validateEmail(email) ? 'Enter a valid email' : '',
  }
  const hasErrors = Boolean(errors.name || errors.email)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ email: true, name: true })
    if (!hasErrors) {
      alert(`Submitted: ${name} <${email}>`)
      setName(''); setEmail(''); setTouched({ email: false, name: false })
    }
  }

  // B) Uncontrolled inputs using refs (value lives in the DOM)
  const ucNameRef = useRef<HTMLInputElement | null>(null)
  const ucEmailRef = useRef<HTMLInputElement | null>(null)
  const [ucLastSubmitted, setUcLastSubmitted] = useState<{ name: string; email: string } | null>(null)
  const [ucRenders, setUcRenders] = useState(0)
  // Track parent re-renders to emphasize uncontrolled fields don't re-render on typing
  // (Typing in uncontrolled inputs won't change React state, so this counter stays stable until we set state.)
  // We increment this once here so it reflects initial render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = (function tick() { if (ucRenders === 0) setUcRenders(1); return null })()

  function handleUncontrolledSubmit(e: React.FormEvent) {
    e.preventDefault()
    const submitted = {
      name: ucNameRef.current?.value ?? '',
      email: ucEmailRef.current?.value ?? '',
    }
    setUcLastSubmitted(submitted)
  }

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>A) Controlled inputs (value in React state)</h3>
        <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} />
            {touched.name && errors.name && <div style={{ color: 'crimson', fontSize: 12 }}>{errors.name}</div>}
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} />
            {touched.email && errors.email && <div style={{ color: 'crimson', fontSize: 12 }}>{errors.email}</div>}
          </label>
          <button type="submit" disabled={hasErrors}>Submit</button>
        </form>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Controlled fields are driven by state (<code>value</code> + <code>onChange</code>), allowing synchronous validation and UI logic.
        </div>
      </div>

      <hr />

      <div style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>B) Uncontrolled inputs (value in the DOM)</h3>
        <form onSubmit={handleUncontrolledSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <label>
            Name
            <input ref={ucNameRef} defaultValue="" placeholder="Value lives in DOM" />
          </label>
          <label>
            Email
            <input ref={ucEmailRef} defaultValue="" placeholder="Value lives in DOM" />
          </label>
          <button type="submit">Submit (read via ref)</button>
        </form>
        <div>
          Last submitted (uncontrolled):
          <pre style={{ margin: '8px 0', background: '#f8fafc', padding: 8, borderRadius: 6 }}>
{JSON.stringify(ucLastSubmitted ?? { name: '', email: '' }, null, 2)}
          </pre>
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Uncontrolled fields use <code>defaultValue</code> and refs. Typing does not change React state, so the component does not re-render on every keystroke.
          Read values on submit or imperatively via refs.
        </div>
      </div>
    </section>
  )
}


