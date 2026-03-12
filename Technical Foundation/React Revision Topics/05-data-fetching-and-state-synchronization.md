## Data Fetching & State Synchronization

- [ ] Server cache vs client state: choosing where state lives
- [ ] TanStack Query (React Query): cache, invalidation, queries/mutations
- [ ] SWR patterns: stale-while-revalidate, focus/refetch, polling
- [ ] Optimistic updates, rollback, mutation deduping
- [ ] Pagination and infinite queries; cursor vs offset
- [ ] Subscriptions: WebSockets, SSE; reconciliation with client-cache
- [ ] GraphQL clients (Apollo, urql): cache policies, normalization, fragments
- [ ] REST best practices: ETags, conditional requests, 304s, content-negotiation
- [ ] Forms and mutations: revalidation strategies, race conditions

---

### Where state belongs
Prefer keeping remote server state in a cache (TanStack Query, SWR) rather than React component state. Local UI state (form inputs, modal visibility) belongs in components or lightweight stores. Avoid duplicating server data in multiple places—treat the cache as the source of truth and derive computed views from it.

---

### TanStack Query essentials
Queries fetch and cache data by key; mutations change data and coordinate invalidation. Configure stale times, background refetching, and cache lifetimes per endpoint. Use invalidation or `setQueryData` to keep the UI consistent after mutations. Use `select` to derive minimal slices for components.

---

### SWR patterns
SWR (“stale-while-revalidate”) returns cached data immediately, then revalidates in the background and updates when fresh data arrives. Common triggers include focus, reconnect, and interval polling. Prefer SWR/TanStack Query for network resilience and cache coherence over ad‑hoc `useEffect` fetches.

---

### Optimistic updates and rollback
Optimistic mutations update the UI immediately and rollback on failure. Ensure you store enough context to revert and reconcile with the server response (which might differ). Communicate pending states and disable conflicting actions during in-flight updates.

---

### Pagination and infinite scroll
Prefer cursor-based pagination for large or changing datasets. Use library helpers for infinite queries and keep keys stable per page. Prepend/append pages predictably and handle “refetch from start” when filters change.

---

### Subscriptions and real-time
Use WebSockets or Server-Sent Events for live updates. Reconcile incoming events with the client cache via immutable updates. Debounce or batch frequent events to avoid render storms.

---

### GraphQL client considerations
Choose cache policies (cache-first, network-only) per operation. Normalize entities by ID for consistent updates across queries. Use fragments for co-location and type safety; rely on codegen to keep types synced with schema.

---

### REST best practices
Use ETags and `If-None-Match` to leverage 304s. Negotiate formats and compress responses. Keep error contracts consistent and include machine-readable codes for client logic.

---

### Forms and race conditions
For form submissions, handle double-submits, cancellation, and race conditions. Use abort signals for in-flight requests and disable submit while pending. On navigation, consider preserving draft state or leveraging server actions where appropriate.


