# Advanced React Features

## Summary
Modern React capabilities to optimize loading and responsiveness: code splitting, lazy, Suspense, and concurrent rendering APIs.

## Key Concepts
- Code Splitting: break bundle into smaller chunks (React.lazy, dynamic import, bundlers).
- Lazy Loading: load components on demand.
- Suspense: fallback UI while waiting for lazy or data.
- Concurrent Rendering: prioritize urgent vs non-urgent updates.
- useTransition: mark state updates as non-urgent.
- useDeferredValue: defer a value to keep typing responsive.

## Situational Scenarios
- Route-level or widget-level code splitting to reduce initial load.
- Large client-side filtering: useTransition/useDeferredValue to keep typing snappy.
- Slow third-party chart component: lazy load behind Suspense boundary.

## Code Examples
```jsx
// Lazy component
const Chart = React.lazy(() => import('./Chart'));

// Suspense boundary
<Suspense fallback={<Spinner />}>
  <Chart />
</Suspense>
```

## Pitfalls
- Forgetting a Suspense fallback around lazy components.
- Over-splitting into too many tiny chunks can increase total requests.

## Interview Q&A
- Debounce vs useDeferredValue? Debounce waits before firing; deferred updates state now and renders results later.
- When to use useTransition? Non-urgent state updates like filtering a large list.

## References
- React Docs: Code Splitting, Suspense, Concurrent UI Patterns.

## Checklist
- [ ] Wrap lazy components with Suspense fallback
- [ ] Identify non-urgent updates for useTransition / useDeferredValue
- [ ] Apply code splitting to heavy routes/widgets

