## Networking & APIs

- [ ] Fetch nuances: credentials, mode, cache, `keepalive`, streaming
- [ ] Axios vs native fetch; interceptors; cancellation; retries
- [ ] GraphQL best practices: persisted queries, @defer/@stream, fragments
- [ ] File and image handling: blobs, object URLs, memory considerations
- [ ] Offline-first/PWA: Service Worker, caching strategies, background sync

---

### Fetch in practice
Use the right options: `credentials` for cookies, `mode` for CORS, `cache` for caching semantics, and `keepalive` for unload beacons. Stream large responses when possible. Abort in-flight requests on parameter changes or unmount.

---

### Axios vs fetch
Fetch is built-in and standards-based; pair with small helpers for JSON and errors. Axios provides interceptors and transforms out of the box. Prefer a single approach across the codebase for consistency.

---

### GraphQL
Use persisted queries to reduce payload and improve security. Leverage `@defer`/`@stream` for incremental delivery where supported. Normalize entities and use fragments to co-locate data requirements.

---

### Files and images
Use `Blob`/`File` APIs and object URLs thoughtfully; revoke URLs when done to free memory. Chunk and resume large uploads; compute hashes to dedupe.

---

### Offline-first
Implement a Service Worker for caching strategies (stale-while-revalidate for content, network-first for fresh data). Provide background sync for queued mutations and clear UI for offline/online transitions.


