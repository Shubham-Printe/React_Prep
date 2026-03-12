## State Management Strategy

- [ ] Local state vs context vs global store decision matrix
- [ ] Context API: performance pitfalls; splitting contexts and selectors
- [ ] Redux Toolkit: slices, RTK Query, immutability with Immer
- [ ] Alternatives: Zustand, Jotai, Recoil, Valtio; trade-offs and scaling
- [ ] State machines/statecharts (XState): clarity, effects, testing
- [ ] Event sourcing and CQRS concepts in the frontend

---

### Choosing the right scope
Keep state local when only one component or tight subtree uses it. Use context to avoid prop drilling for stable, infrequently changing values (theme, auth). For dynamic or high-churn shared state, consider a dedicated store to avoid excessive renders and complex prop chains.

---

### Context performance
Context re-renders all consumers on value change. Split contexts by concern and expose selectors or memoized slices to minimize updates. Avoid passing large objects/functions that change identity every render; memoize providers’ values.

---

### Redux Toolkit
RTK reduces boilerplate with `createSlice`, `configureStore`, and Immer-powered immutable updates. Use RTK Query for data fetching, caching, and invalidation integrated with Redux. Keep slices cohesive around domains rather than components.

---

### Alternatives and trade-offs
Zustand: minimal API, selector-based subscriptions, great for co-located domain stores. Jotai: atom-based, fine-grained reactivity. Recoil: atoms/selectors with dependency graphs. Valtio: proxies for mutable syntax with reactive snapshots. Choose based on team familiarity, devtools, and performance profile.

---

### State machines and charts
XState models states and transitions explicitly, improving clarity and testability for complex workflows. Effects live in services; transitions are pure. Useful for multi-step forms and async flows with retries/timeouts.

---

### Event sourcing and CQRS on the client
For complex domains, event streams can make history and replayability explicit. Commands mutate state by emitting events; queries read from derived projections. Use sparingly due to complexity, but it can align the frontend with back-end architecture.


