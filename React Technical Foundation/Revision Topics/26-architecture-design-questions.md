# Architecture / System Design - Interview Question Bank (Plain-English)

Use this as a “think aloud” playbook. The goal is to explain ideas clearly, not to impress with jargon.

## How to Answer (60–90 seconds)
- **Ask clarifying questions**: “What exactly do users need? What matters most: speed, reliability, cost?”
- **Pick a simple first version**: “Start simple, then upgrade if requirements demand it.”
- **Mention tradeoffs**: “This is simpler but less flexible; that is more powerful but more complex.”
- **Cover failures**: “What if network fails? What if the user refreshes? What if traffic spikes?”

## Less likely system design questions (general practice)
These are still useful, but lower probability than the Sonny’s/Quivio/Sonny’s Direct set.

### Protocol mental model (modern defaults)
When an interviewer asks “what protocol should we use?”, map it to one of these buckets:

### 1) Fetch (finite request → finite response)
- **Use**: pages/assets, REST/GraphQL APIs, auth endpoints, uploads/downloads, payments, most app traffic
- **Protocol**: **HTTPS** (HTTP/1.1, HTTP/2; increasingly HTTP/3 via CDN)
- **Why**: simplest, cache/CDN friendly, debuggable, works everywhere

### 2) Server streaming (continuous server → client)
- **Use**: streaming UI updates where the client mostly listens (notifications, feeds, dashboards, progress)
- **Protocol**: **SSE** (Server-Sent Events) over **HTTPS**
- **Why**: very simple model; reconnects cleanly; still “just HTTP”
- **Note**: client → server events still go via normal HTTPS requests

### 3) Real-time messaging (continuous 2-way events)
- **Use**: chat, presence/typing indicators, collaborative edits, interactive dashboards, multiplayer events
- **Protocol**: **WebSocket (WSS)**
- **Why**: one long-lived connection; low per-message overhead; full-duplex

### 4) Real-time media + P2P
- **Use**: video/audio calls, screen sharing, low-latency media
- **Protocol**: **WebRTC** (typically needs **STUN/TURN**; plus a signaling channel via HTTPS/WebSocket)
- **Why**: purpose-built for realtime media (jitter, congestion control, NAT traversal)

### 5) Supporting infrastructure (always present)
- **DNS**: domain → IP resolution (routing, failover, CDN)
- **TLS**: encryption + integrity + server identity (what makes HTTPS/WSS “secure”)
- **TCP/UDP**: transport layer (HTTP/1.1/2 + WS on TCP; HTTP/3 on UDP via QUIC; WebRTC uses UDP heavily)

**Quick chooser**
- CRUD / normal APIs → **HTTPS**
- Server pushes updates, client mostly listens → **SSE**
- Bi-directional realtime events (chat/collab) → **WebSocket**
- Audio/video/screen share → **WebRTC**

### G1) “What protocol is suitable for an AI chatbot?”
**Problem**
- Pick a protocol for a web AI chatbot that may need streaming responses and reliable reconnection.

**Approach**
- Start with **HTTPS** for sending user messages (simple request/response).
- If the main requirement is *streaming the assistant’s reply*, stream tokens via **SSE** over HTTPS.
- If you need lots of *two-way* real-time signals (typing/presence/multi-room), use **WebSockets (WSS)**.

**Key Considerations**
- Do we need streaming tokens, or is “wait for full answer” acceptable?
- Is it only chat text, or also real-time client → server signals (typing, presence, read receipts)?
- Reconnect behavior, auth (cookies/headers), and scaling long-lived connections (sticky sessions / pub-sub fanout).

### G2) “Design a notifications system (web)”
**Problem**
- Deliver notifications to users (in-app and optionally email/SMS) and keep a history (inbox + read/unread).

**Approach**
- Store notifications per user in a DB (powers inbox, read/unread, auditability).
- Emit “notification events” from product actions (order placed, message received, etc.).
- Use a queue + background worker to fan out delivery:
  - In-app: push via **SSE/WebSocket** to update the UI instantly
  - External: send email/SMS via a provider

**Key Considerations**
- Real-time in-app vs “refresh is fine”, and how long to retain an inbox history.
- Reliability: retries with backoff, idempotency/dedup, and spike handling via queues.
- User preferences (mute categories), rate limiting, and separating critical vs marketing notifications.

### G3) “Design infinite scroll + pagination for a feed”
**Problem**
- Build infinite scroll for a feed that stays stable while new items are being added.

**Approach**
- Use **cursor pagination** (“items after this id/time”) instead of offset pagination.
- Client keeps the cursor, appends pages, and deduplicates items.
- UX polish: skeleton loaders, virtualization for large lists, and an optional “new posts available” banner.

**Key Considerations**
- Sort order (time vs relevance) and what “new items arriving” should do to the user’s scroll position.
- Prevent duplicates and handle missing items across refreshes.
- Back/forward navigation + scroll restoration, and handling partial failures/timeouts.

### G4) “Design file upload (images/docs) with progress”
**Problem**
- Upload images/docs from the browser with progress, safely, at scale.

**Approach**
- Validate inputs (type/size) and request a **pre-signed URL** from the backend.
- Upload directly browser → storage (shows progress via bytes uploaded).
- After upload, store metadata (filename/size/owner) and run async processing (thumbnails/virus scan) via a worker.

**Key Considerations**
- Large files: multipart uploads, retries/resume, and timeouts.
- Security: authz (who can upload/view), malware scanning, and limiting content types.
- UX: cancel/retry, show “processing…” states, and eventual consistency after upload.

### G5) “Design an auth flow for a SPA”
**Problem**
- Authenticate users in a SPA with secure session handling and clean refresh/logout behavior.

**Approach**
- Prefer **httpOnly cookies** for session/refresh (reduces XSS impact vs localStorage tokens).
- Add **CSRF** protection (SameSite + CSRF token where needed).
- Frontend: protected routes, bootstrap “am I logged in?” on load, and logout that clears server-side session.

**Key Considerations**
- SSO vs username/password and how sessions expire/refresh (rotation, revocation).
- XSS/CSRF tradeoffs, multi-tab behavior, and “logged out everywhere” requirements.
- Secure redirects, session fixation prevention, and least-privilege authorization checks.

### G6) “Design search with typeahead”
**Problem**
- Implement typeahead search that feels instant and doesn’t overload the backend.

**Approach**
- UI: **debounce** (200–300ms) and cancel/ignore stale requests to prevent flicker.
- Backend: fast prefix search (DB for small scale; search engine for larger scale) with sensible limits.

**Key Considerations**
- Latency target and result quality (typo tolerance, ranking, highlighting).
- Rate limiting, caching popular queries, and handling empty/very short queries.
- Accessibility (keyboard navigation) and avoiding stale/out-of-order results.

### G7) “Design real-time collaboration (doc editing)”
**Problem**
- Support multiple users editing the same document in real time without losing changes.

**Approach**
- Use **WebSockets** for low-latency edits + presence (cursor/typing).
- Use a proven merge algorithm/library (**OT/CRDT**) rather than inventing your own.
- Persist updates and periodically snapshot state for faster recovery/loading.

**Key Considerations**
- Offline edits + re-sync, conflict expectations (eventual vs strict ordering), and permissions.
- Scalability: rooms, fanout, and keeping state consistent across servers.
- Observability/debuggability of “why did this text move?” problems.

### G8) “Design feature flags rollout”
**Problem**
- Safely roll out features with targeting, gradual exposure, and an emergency kill switch.

**Approach**
- Model a flag as rules (org/user targeting, % rollout, environment gates).
- Serve flag decisions from a central service (or config) and cache on the client/server.
- Roll out gradually (1% → 10% → 50% → 100%) with a kill switch.

**Key Considerations**
- Consistency: the same user should get the same decision (bucketing/stickiness).
- Auditability: who changed what, when, and why; and safe defaults if the flag service is down.
- Performance impact (extra network calls) and measuring impact (metrics/experiments).

### G9) “Design caching strategy for a web app”
**Problem**
- Make the web app fast and resilient by caching the right things in the right places.

**Approach**
- Cache static assets aggressively with **versioned filenames** + CDN (safe long TTLs).
- Cache API data on the client to avoid refetching, and use “stale-while-revalidate” when possible.
- Use server cache headers/validators (ETag/Last-Modified) where appropriate.

**Key Considerations**
- Invalidation: how/when cached data becomes wrong (and how you bust/refresh it).
- Don’t cache sensitive user-specific data in shared caches; partition by user/session.
- Offline behavior, error fallback, and avoiding UI flicker on refresh.

### G10) “Design an error handling + monitoring plan”
**Problem**
- Detect, diagnose, and recover from failures in production with minimal user pain.

**Approach**
- Frontend: error boundary + friendly fallback + retry.
- Logging: capture errors with useful context (route, action, request id).
- Monitoring: use an error tracker (e.g., Sentry) + dashboards/alerts (error rate, latency).
- Incident routine: alert → mitigate → fix → write down learnings/prevention.

**Key Considerations**
- Avoid logging PII/secrets; use sampling to control noise/cost.
- Add source maps + release/version tagging for actionable stack traces.
- Tie frontend errors to backend traces (correlation ids) and capture user repro steps.

### G11) “Design a scalable dashboard for a large-scale application”
**Problem**
- Design a dashboard that aggregates data from multiple sources and supports real-time updates.

**Approach**
- Break the dashboard into modular widgets (charts, tables, KPIs).
- Use an API aggregation layer (**BFF** or gateway) to normalize data for the UI.
- Centralized state management (Redux / RTK / Query).
- WebSockets / SSE for real-time updates.
- Performance optimizations: memoization, virtualization, lazy loading.
- Role-based auth & authorization.

**Key Considerations**
- Independent widget loading.
- Partial failure handling.
- Data refresh strategy (polling vs push).
