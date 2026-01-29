## Edge/Server Integration

- [ ] Node vs Edge constraints; APIs available; cold starts
- [ ] Streaming responses, cache headers, revalidation semantics
- [ ] File-based routing conventions and server actions (framework-specific)
- [ ] Upload/download performance and resilience at the edge

---

### Node vs Edge runtimes
Node routes have full API access (sockets, large dependencies) but higher cold-start times compared to Edge (V8 isolates with restricted APIs). Choose Edge for latency-sensitive, compute-light logic (auth, A/B decisions, geolocation), and Node for heavy libraries, large zips, or complex IO.

Q&A
- Q: When is Edge a bad fit?  
  - A: When you need Node-specific modules, large binaries, or long-running connections outside platform support.

---

### Streaming and cache semantics
Stream HTML to reduce TTFB and show progressive results. Control caching via `Cache-Control`, `ETag`, and revalidation headers. At the edge, use platform caches (KV/CDN) with proper keys (method, path, tenant, locale). Ensure personalized content is not cached publicly.

---

### File-based routing and server actions
Frameworks like Next.js map filesystem to routes and support server actions for mutations without bespoke endpoints. Keep boundaries clear: validation and security on the server; minimal client data exposure. Version routes and actions carefully to support safe rollouts.

---

### Uploads and downloads at the edge
Use signed URLs for direct-to-storage uploads to bypass app servers. Chunk large transfers with resumable protocols and verify integrity checksums. For downloads, set `Content-Disposition` and support range requests; offload bandwidth to CDNs.


