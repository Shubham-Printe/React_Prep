import { Component, ReactNode } from 'react'

export type FallbackRenderArgs = { error: unknown; reset: () => void }
export type ErrorBoundaryProps = {
  fallback?: ReactNode
  fallbackRender?: (args: FallbackRenderArgs) => ReactNode
  resetKeys?: unknown[]
  children?: ReactNode
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean; error?: unknown }> {
  
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  
  // This method is called when an error is thrown in a child component
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }

  // This method is called when an error is thrown in a child component
  // It is used to log the error to the console
  componentDidCatch(error: unknown) {
    console.error('Caught by ErrorBoundary:', error)
  }

  // Automatic reset: when resetKeys change, clear the error so children can render again.
  // Useful when "context" changes (route, selected item, etc.) and you want a fresh retry.
  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    const { resetKeys } = this.props
    if (!this.state.hasError) return
    if (!resetKeys || !prevProps.resetKeys) return
    const changed =
      resetKeys.length !== prevProps.resetKeys.length ||
      resetKeys.some((v, i) => v !== prevProps.resetKeys![i])
    if (changed) {
      this.setState({ hasError: false, error: undefined })
    }
  }

  // Manual reset: called by the fallback UI (e.g., "Try again") to clear the error and re-render.
  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  
  // This handles what we show based on whether there is an error or not in the component wrapped by the ErrorBoundary.
  render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({ error: this.state.error, reset: this.reset })
      }
      if (this.props.fallback) return this.props.fallback
      return (
        <div style={{ color: 'crimson' }}>
          Something went wrong. <button onClick={this.reset}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}
