## Common Pitfalls & Debugging

- [ ] Memory leaks: subscriptions, timers, event listeners; cleanup patterns
- [ ] Stale closures and how to detect/fix with ESLint and refs
- [ ] Hydration mismatch detection and root causes
- [ ] Debugging tools: React DevTools, Profiler, network panel, coverage
- [ ] Flaky tests triage and isolation strategies

---

### Memory leaks
Always cleanup subscriptions, timers, and event listeners in effects. Verify that async operations don’t set state after unmount; use AbortController or an “isMounted” guard. Monitor memory in DevTools for long-lived pages.

---

### Stale closures
Functions capture values from the render that created them. If dependencies are missing in `useEffect` or `useCallback`, handlers can read stale values. Enable `eslint-plugin-react-hooks` and fix warnings by adding deps or stabilizing references.

---

### Hydration issues
Mismatches arise from non-deterministic output between server and client (time, random, browser-only APIs). Render those values after mount (`useEffect`) or inject consistent data from the server. Compare server HTML to client by viewing page source vs inspector.

---

### Debugging toolkit
Use React DevTools to inspect props/state and highlight re-renders. The Profiler shows which components render and why. The network panel and coverage reports identify slow requests and dead code. Add trace markers or logs to correlate user actions with updates.

---

### Flaky tests
Stabilize selectors with test IDs, avoid timing assumptions, and wait for visible conditions instead of fixed timeouts. Clear global state between tests and run tests in isolation. Seed randomness and mock time deterministically.


