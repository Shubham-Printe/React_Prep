# React Must-Know Topics

## Summary
Critical APIs and tooling every React engineer should master: Portals, Error Boundaries, Strict Mode, Profiler, and new React features.

## Key Concepts
- Portals: render outside parent DOM hierarchy (modals, tooltips); events bubble through React tree.
- Error Boundaries: catch render/lifecycle errors in child tree; show fallback UI.
- Strict Mode: dev-only warnings; double-invokes certain methods to surface side effects.
- Profiler & Performance: analyze render timings and causes; common optimizations.
- React 19+: useOptimistic, Server Components, Form Actions.

## Code Examples
```jsx
// Handling async and event errors (not caught by Error Boundaries)
async function fetchData() {
  try {
    const res = await fetch('/api');
    const data = await res.json();
    setState(data);
  } catch (e) {
    console.error('Async error:', e);
  }
}

<button onClick={() => {
  try {
    riskyOperation();
  } catch (e) {
    console.error('Event error:', e);
  }
}}>Click</button>
```

## Situational Scenarios
- Modal/tooltip rendering: use Portals to avoid overflow/clipping.
- Isolating crashes per widget: wrap with Error Boundaries.
- Investigating re-renders: Profiler to identify render waterfalls.

## Pitfalls
- Expecting Error Boundaries to catch async/event handler errors.
- Forgetting Strict Mode double-invoke in dev when debugging effects.

## Interview Q&A
- What do Error Boundaries catch? Render/lifecycle errors in descendants.
- Why use Portals? Render UI outside normal DOM flow with proper event handling.

## References
- React Docs: Portals, Error Boundaries, Strict Mode, Profiler.

## Checklist
- [ ] Wrap risky trees with Error Boundaries
- [ ] Use Portals for layered UI
- [ ] Profile renders for regressions

