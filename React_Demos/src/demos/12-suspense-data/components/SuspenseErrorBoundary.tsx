import { Component, ReactNode } from 'react'

export default class SuspenseErrorBoundary extends Component<
  { children?: ReactNode; fallback?: (retry: () => void, error: unknown) => ReactNode },
  { error: unknown | null }
> {
  constructor(props: { children?: ReactNode; fallback?: (retry: () => void, error: unknown) => ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: unknown) {
    return { error }
  }
  render() {
    if (this.state.error) {
      const retry = () => this.setState({ error: null })
      return this.props.fallback ? this.props.fallback(retry, this.state.error) : <div style={{ color: 'crimson' }}>Error</div>
    }
    return this.props.children as any
  }
}
