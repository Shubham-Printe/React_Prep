## Error Handling & Reliability

- [ ] Error boundaries: catch render errors; limitations (not event handlers)
- [ ] Fallback UIs and retry UX with `Suspense` and boundaries
- [ ] Logging/monitoring: Sentry, OpenTelemetry, breadcrumbs
- [ ] Graceful degradation for network/service failures
- [ ] AbortController for fetch cancellation and race handling
- [ ] Robust retry policies: backoff, jitter, idempotence

---

### Error boundaries and scope
Error boundaries catch errors during rendering, lifecycle, and constructors of their child tree and render a fallback UI. They do not catch errors in event handlers or async callbacks—handle those with try/catch and error reporting. Place boundaries around risky subtrees (e.g., third-party widgets) to contain failures.

Q&A
- Q: Why didn’t my boundary catch a click handler error?  
  - A: Event handler errors are outside render; catch and report them explicitly.

---

### Fallback UIs and retries with Suspense
Use boundaries to show friendly fallbacks and provide retry actions. With Suspense for data fetching, boundaries can show loading states while data streams in, and switch to error UI if the promise rejects. Offer a “Try again” that re-triggers the data request.

---

### Observability
Report errors with context (user action, route, feature flag) to tools like Sentry. Capture breadcrumbs to reconstruct user flows. For distributed tracing, propagate correlation IDs and use OpenTelemetry to connect frontend spans to backend spans.

---

### Graceful degradation
Detect offline, partial outages, or permission failures and degrade features while keeping the core usable. Provide cached content, disable non-critical widgets, and communicate status clearly.

---

### Cancellation and race handling
Use `AbortController` for fetches to cancel stale requests on unmount or parameter changes. Guard asynchronous updates by checking a mounted flag or using controller signals to avoid setting state after unmount or out-of-order responses.

---

### Robust retries
Retry transient failures with exponential backoff and jitter. Respect idempotency: only retry idempotent operations, or design mutation endpoints to be idempotent via request IDs.


