## Routing & App Frameworks

- [ ] React Router v6+: nested routes, loaders/actions, data routers
- [ ] Next.js App Router: RSC-first model, layouts, loading/error templates
- [ ] Next.js data fetching primitives: `fetch` caching, revalidate, ISR
- [ ] Edge, Node runtimes; streaming, dynamic render, route handlers
- [ ] Metadata, sitemaps, robots; SEO and social cards
- [ ] Navigation performance: prefetching, route segment caching

---

### React Router data routers
React Router v6+ supports nested routes with data APIs (loaders/actions) to fetch before rendering and handle mutations tied to routes. Use route-level error elements and deferred data for streaming-like behavior on the client.

---

### Next.js App Router
The App Router is RSC-first. Define layouts, nested routes, and special files (`loading.tsx`, `error.tsx`) per segment. Client components handle interactivity; server components fetch and compose. Use segment configs to control caching and revalidation behavior per route.

---

### Data fetching primitives and ISR
In Next.js, the built-in `fetch` integrates with caching: set cache policies (`force-cache`, `no-store`) and revalidation intervals (`revalidate`). ISR (Incremental Static Regeneration) rebuilds pages in the background after the revalidate window, combining the best of SSG and SSR.

---

### Runtimes and streaming
Choose Node vs Edge per route depending on APIs needed. Edge functions have faster startup but limited APIs. Use streaming to progressively send HTML and improve perceived performance for large pages.

---

### SEO and metadata
Provide structured metadata (title, description, Open Graph, JSON-LD) per route. In Next.js, use the Metadata API to generate tags and sitemaps/robots. Ensure consistent canonical URLs.

---

### Navigation performance
Prefetch routes on hover/viewport, cache route segments where appropriate, and avoid large client bundles in shared layouts. Measure client-side transitions and ship critical data with the initial route where feasible.


