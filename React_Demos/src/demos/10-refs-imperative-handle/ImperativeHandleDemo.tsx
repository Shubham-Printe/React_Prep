import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type TextInputHandle = {
  focus: () => void
  clear: () => void
  select: () => void
  setValue: (v: string) => void
  disable: () => void
  enable: () => void
  measure: () => { width: number; height: number } | null
}

const TextInput = forwardRef<TextInputHandle, {}>(function TextInput(_props, ref) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useImperativeHandle(ref, () => ({
    focus() { inputRef.current?.focus() },
    clear() {
      if (inputRef.current) {
        inputRef.current.value = ''
        inputRef.current.focus()
      }
    },
    select() { inputRef.current?.select() },
    setValue(v: string) {
      if (inputRef.current) {
        inputRef.current.value = v
      }
    },
    disable() { if (inputRef.current) inputRef.current.disabled = true },
    enable() { if (inputRef.current) inputRef.current.disabled = false },
    measure() {
      const el = inputRef.current
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return { width: Math.round(rect.width), height: Math.round(rect.height) }
    },
  }))
  return <input ref={inputRef} placeholder="Imperative input (focus/select/clear…)" />
})

export default function ImperativeHandleDemo() {
  const ref = useRef<TextInputHandle | null>(null)
  const [lastMeasure, setLastMeasure] = useState<{ width: number; height: number } | null>(null)
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextInput ref={ref} />
        <button onClick={() => ref.current?.focus()}>Focus</button>
        <button onClick={() => ref.current?.select()}>Select</button>
        <button onClick={() => ref.current?.setValue('Hello!')}>Set "Hello!"</button>
        <button onClick={() => ref.current?.clear()}>Clear</button>
        <button onClick={() => ref.current?.disable()}>Disable</button>
        <button onClick={() => ref.current?.enable()}>Enable</button>
        <button
          onClick={() => {
            const m = ref.current?.measure() ?? null
            setLastMeasure(m)
          }}
        >
          Measure (w×h)
        </button>
      </div>
      <div style={{ fontSize: 12, color: '#475569' }}>
        {lastMeasure ? (
          <>Last measured: {lastMeasure.width}×{lastMeasure.height}px</>
        ) : (
          <>Click “Measure” to read the input size via the exposed API.</>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#475569' }}>
        The parent controls the child input via an imperative ref using <code>useImperativeHandle</code>, without
        reaching into the DOM from outside.
      </div>
    </section>
  )
}


