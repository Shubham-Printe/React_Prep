## Error Handling & Reliability

- [x] Error boundaries: catch render errors; limitations (not event handlers)
- [x] Fallback UIs and retry UX with `Suspense` and boundaries
- [x] Logging/monitoring: Sentry, OpenTelemetry, breadcrumbs
- [x] Graceful degradation for network/service failures
- [x] AbortController for fetch cancellation and race handling
- [x] Robust retry policies: backoff, jitter, idempotence

--------------------------------------------------------------------------------

### Error boundaries and scope
Error boundaries catch errors during **rendering**, **lifecycle**, and **constructors** of their child tree and render a fallback UI instead of unmounting the whole app. They are class components that implement `static getDerivedStateFromError` and/or `componentDidCatch`. Place boundaries around risky subtrees (e.g. third-party widgets, lazy-loaded routes) so one failure doesn’t take down the entire page.

What they do **not** catch
- Errors in event handlers (e.g. `onClick`). Use try/catch inside the handler and report to your error service.
- Errors in async code (setTimeout, fetch callbacks) unless they lead to a render. Guard with try/catch and/or AbortController.
- Errors in the boundary’s own render or in a boundary above it.

Q&A
- Q: Why didn’t my boundary catch a click handler error?  
  - A: Event handler errors happen outside React’s render/lifecycle; catch and report them explicitly in the handler.

Example: minimal class error boundary
```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info.componentStack);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

--------------------------------------------------------------------------------

### Fallback UIs and retries with Suspense
Use error boundaries to show friendly fallbacks (message + optional “Try again”) instead of a blank or crashed screen. With Suspense for data fetching, the boundary below the Suspense tree can catch promise rejections when the data request fails; show an error state and a button that re-triggers the request or resets local state so the suspended component retries. Keep loading states (Suspense fallback) distinct from error states (boundary fallback) so users know whether to wait or retry.

--------------------------------------------------------------------------------

### Observability
Report errors with enough context for debugging: user action, route, feature flags, and device/browser when useful. Use a service like Sentry (or similar) with source maps so production stack traces are readable. Capture **breadcrumbs** (clicks, navigation, API calls) so you can reconstruct the user’s path before an error. For distributed tracing, propagate correlation IDs in headers and use OpenTelemetry (or equivalent) to connect frontend spans to backend spans and see the full request flow.

--------------------------------------------------------------------------------

### Graceful degradation
Detect offline state, partial outages, or permission failures and degrade features while keeping the core flow usable. Use cached content where possible, disable or hide non-critical widgets when a dependency fails, and communicate status clearly (e.g. “Some data is unavailable”). Avoid a single failing dependency from blocking the whole UI when you can show a partial or cached view and retry in the background.

--------------------------------------------------------------------------------

### Cancellation and race handling
Use `AbortController` for fetch (and other abortable APIs) so you can cancel in-flight requests when the component unmounts or when inputs (e.g. search query) change. Attach `signal: controller.signal` to the request and call `controller.abort()` in the effect cleanup. Guard async updates with a mounted flag or by ignoring results when the request was aborted so you never set state after unmount or apply stale responses.

Example: fetch with AbortController and cleanup
```tsx
React.useEffect(() => {
  const ctrl = new AbortController();
  setStatus('loading');
  fetch(`/api/search?q=${query}`, { signal: ctrl.signal })
    .then((r) => r.json())
    .then((data) => setData(data))
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });
  return () => ctrl.abort();
}, [query]);
```

Caveats and gotchas
- Ignore or handle `AbortError` in catch blocks so you don’t treat cancellation as a real failure.
- For multiple concurrent requests (e.g. by id), use one controller per request or abort the previous when deps change so only the latest response is applied.

--------------------------------------------------------------------------------

### Robust retries
Retry transient failures (network blips, 5xx) with **exponential backoff** and **jitter** to avoid thundering herd and repeated immediate retries. Only retry **idempotent** operations (GET, or mutations designed to be idempotent). For non-idempotent mutations, use a request ID or idempotency key so the server can dedupe and retries are safe. Cap max retries and surface a clear error to the user after giving up.

Quick terms
- **Exponential backoff:** Wait longer after each attempt (e.g. 1s, 2s, 4s).
- **Jitter:** Add randomness to delays so many clients don’t retry at the same time.
- **Idempotence:** Same request applied once or multiple times has the same effect; required for safe retries of mutations.
