## Networking & APIs

- [ ] Fetch nuances: credentials, mode, cache, `keepalive`, streaming
- [ ] Axios vs native fetch; interceptors; cancellation; retries
- [ ] GraphQL best practices: persisted queries, @defer/@stream, fragments
- [ ] File and image handling: blobs, object URLs, memory considerations
- [ ] Offline-first/PWA: Service Worker, caching strategies, background sync

---

### Protocols: practical mental model (modern defaults)
Map “what protocol should we use?” to one of these buckets:

- **Fetch (finite request → finite response)**: **HTTPS** (HTTP/1.1, HTTP/2; increasingly HTTP/3 via CDN). Default for pages/assets, REST/GraphQL, auth, uploads/downloads.
- **Server streaming (server → client continuous updates)**: **SSE over HTTPS**. Great for notifications, live feeds, dashboards, progress streams when the client mostly listens.
- **Real-time messaging (2-way events)**: **WebSocket (WSS)**. Best for chat, presence/typing, collaboration events, interactive dashboards.
- **Real-time media / P2P**: **WebRTC** (often with STUN/TURN) for calls and screen share; still needs signaling via HTTPS/WebSocket.

Supporting pieces you should be able to name:
- **DNS**: domain → IP
- **TLS**: encryption + integrity + server identity (HTTPS/WSS)
- **TCP/UDP**: transport (WS/HTTP1/2 on TCP; HTTP/3 on UDP via QUIC; WebRTC uses UDP heavily)

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


