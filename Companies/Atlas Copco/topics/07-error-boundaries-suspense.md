# Error Boundaries & Suspense
Focused review for resilient UIs. See `01-react-core.md` for full Q&A.

## Error Boundaries — Quick Reference

**What they catch**: Errors during rendering, in lifecycle methods, and in constructors of the child tree.

**What they don't catch**: Event handlers, async code (fetch), errors outside the React tree.

**Implementation**: Must be class components. Use `static getDerivedStateFromError` + `componentDidCatch`, or a library like `react-error-boundary`.

**Simple example**:
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Something went wrong.</p>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage: wrap a risky subtree
<ErrorBoundary>
  <RiskyWidget />
</ErrorBoundary>
```
Resetting `hasError` to `false` and re-rendering will retry rendering the children. 
Alternatively, the parent can pass a new `key` to `<ErrorBoundary key={someId} />` to force remount and reset.

**Placement**:
- **Global**: Near the root—avoids a blank screen.
- **Local**: Around risky sections—so one widget failure doesn't take down the whole page.

**Good fallback UI**: Explain in simple language, offer recovery (retry, reload, navigate back). Avoid stack traces for end users.

**Reset**: Either reset the boundary's state (retry action) or change its `key` from the parent to force remount.

---

## Suspense — Quick Reference

**React.lazy + Suspense**: Code-splitting; load components on demand. Suspense shows a fallback while the chunk loads.

**Good candidates for lazy loading**: Route-level pages, heavy dashboards, charts, rarely used modals, admin screens.

**Pitfalls**: Too many loaders, layout shifts, loading waterfalls. Mitigate with route-level splitting, prefetching, skeletons with reserved space.

**Interaction with Error Boundaries**: Suspense catches promises (loading); Error Boundaries catch errors. Use both so loading and error states are handled.

**Demo**: `Demos/React_Features_Demos/src/demos/11-error-boundary/` and `19-code-splitting-suspense/`.
