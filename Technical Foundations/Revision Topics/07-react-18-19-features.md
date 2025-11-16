## React 18/19+ Features

- [ ] Concurrent rendering mental model; transitions and interruptibility
- [ ] Suspense for data fetching; streaming SSR and selective hydration
- [ ] Server Components (RSC): boundaries, client/server directives, constraints
- [ ] Actions and form actions (React 19): progressive enhancement, server mutations
- [ ] `use()` semantics and safe usage patterns
- [ ] Preloading APIs and resource hints integration
- [ ] React Compiler concepts: automatic memoization, constraints and limitations

---

### Concurrent rendering and transitions
Concurrent rendering allows React to prepare updates in the background and interrupt low-priority work. Mark non-urgent updates with `useTransition` so urgent interactions stay responsive. Think in terms of priorities and deferrable UI rather than synchronous, all-or-nothing renders.

---

### Suspense for data and selective hydration
Suspense can coordinate async data with UI by showing fallbacks while data loads. On the server, React can stream HTML and progressively hydrate the most important parts first (selective hydration), improving time-to-interactive on large pages.

---

### Server Components (RSC)
RSC let you render components on the server without sending their code to the client. Use `use client` to opt components into client-side interactivity. Keep boundaries clear: server components can fetch data and compose UI; client components handle interactivity and browser APIs. Avoid leaking client-only objects across the boundary.

---

### Actions and form actions
Actions (including form actions) enable server mutations triggered from UI without custom API endpoints, with progressive enhancement for non-JS clients. Co-locate mutation logic on the server; ensure idempotency and proper validation.

---

### use() and preloading
`use()` can unwrap promises and resources inside components (framework-dependent). Use with care to avoid blocking large trees; prefer using it near boundaries that can show fallbacks. Preload critical resources (data, scripts, fonts) so they’re available when components render.

---

### React Compiler (concepts)
The compiler aims to automatically memoize components based on data dependencies, reducing manual `useMemo`/`useCallback`. It requires code adhering to constraints (purity, no dynamic prop spreads with hidden dependencies). Treat it as a future optimization contingent on ecosystem support.


