import { forwardRef, useImperativeHandle, useRef } from 'react'

type TextInputHandle = {
  focus: () => void
  clear: () => void
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
  }))
  return <input ref={inputRef} placeholder="Imperative focus/clear" />
})

export default function ImperativeHandleDemo() {
  const ref = useRef<TextInputHandle | null>(null)
  return (
    <section>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <TextInput ref={ref} />
        <button onClick={() => ref.current?.focus()}>Focus</button>
        <button onClick={() => ref.current?.clear()}>Clear</button>
      </div>
    </section>
  )
}


