## SSR, SSG, ISR, Hydration

- [ ] Trade-offs between SSR, SSG, ISR, CSR
- [ ] Hydration mismatches: common causes and debugging
- [ ] Partial/Selective hydration; out-of-order streaming
- [ ] Caching at multiple layers: CDN, edge, server, client
- [ ] Multi-tenant rendering and config loading

---

### Rendering strategies: choosing the right one
- CSR (Client-Side Rendering): smallest server cost, largest first render latency. Good for apps after auth where SEO is not critical.
- SSR (Server-Side Rendering): HTML rendered per request; great for SEO and faster first paint. Requires server resources; careful caching matters.
- SSG (Static Site Generation): pages built at build-time; fastest delivery and cheapest to serve. Best for content that rarely changes.
- ISR (Incremental Static Regeneration): SSG with time-based revalidation at runtime. Balances freshness and performance.

Guideline: Prefer SSG/ISR for public marketing/content pages; SSR for dynamic, SEO-sensitive routes; CSR for auth-only app shells or dashboards when SEO is irrelevant.

---

### Hydration and mismatches
Hydration attaches event listeners to server-rendered HTML. A mismatch occurs when server HTML doesn’t match client render output (locale differences, time-based content, non-deterministic IDs, random values). Fix by ensuring deterministic rendering: gate browser-only logic behind `useEffect`, pass consistent data via props, and disable time-dependent rendering during SSR.

Q&A
- Q: How do I debug hydration mismatches?  
  - A: Use React warnings in the console; compare server HTML to client render; isolate varying expressions (e.g., Date.now, Math.random, window access).

---

### Partial/selective hydration and streaming
With streaming SSR, the server sends HTML in chunks; the client hydrates in priority order. Selective hydration allows interactive islands to hydrate first while non-critical areas defer. Structure routes and components to place important UI earlier, and provide fallbacks that degrade gracefully.

---

### Caching layers
Leverage CDN caching for static assets and SSG pages, edge caching for SSR responses with appropriate headers, server-side in-memory caches for hot data, and client-side caches (Query/SWR) for interactive state. Design cache keys and invalidation carefully; prefer revalidation over hard purges where feasible.

---

### Multi-tenant rendering
For multi-tenant apps, resolve tenant config (branding, features, locales) early in the request, ideally at the edge. Use route segments or domains/subdomains to isolate cache keys. Avoid leaking one tenant’s data into another’s cache by scoping keys to tenant IDs.


