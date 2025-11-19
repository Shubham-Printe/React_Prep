import { Component, ReactNode, useState } from 'react'

class ErrorBoundary extends Component<{ fallback: ReactNode; children?: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: unknown) {
    console.error('Caught by ErrorBoundary:', error)
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function Buggy() {
  const [boom, setBoom] = useState(false)
  if (boom) throw new Error('Kaboom!')
  return <button onClick={() => setBoom(true)}>Trigger render error</button>
}

export default function ErrorBoundaryDemo() {
  return (
    <section>
      <ErrorBoundary fallback={<div style={{ color: 'crimson' }}>Something went wrong.</div>}>
        <Buggy />
      </ErrorBoundary>
    </section>
  )
}


