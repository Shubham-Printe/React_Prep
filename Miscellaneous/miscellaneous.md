Perfect 👌 — if you’re interested in **“phenomena” like request aborting**, I assume you mean subtle or lesser-known but *important* behaviors and mechanisms in **JavaScript, the web platform, and APIs** — things that affect how your app behaves under real-world conditions.

Here’s a curated list across categories 👇

---

## ⚙️ **Network / HTTP Behavior**

Subtle features of how browsers and APIs handle network requests:

1. **Request Debouncing & Throttling** — avoiding redundant API calls.
2. **AbortController** (you’ve seen this one) — canceling in-flight requests.
3. **Keep-Alive Connections** — how browsers reuse TCP connections.
4. **Caching & ETag Headers** — how to avoid unnecessary downloads.
5. **HTTP/2 multiplexing & prioritization** — how multiple requests share one connection.
6. **Service Worker Request Interception** — caching, offline mode, background sync.
7. **Preflight (CORS) requests** — why some requests trigger an OPTIONS call first.
8. **Retry-after / Exponential Backoff** — handling failed requests gracefully.
9. **Streaming Responses** — partial data handling via `ReadableStream`.
10. **Request Prioritization** — how browsers decide which resources to load first.

---

## ⚡ **JavaScript Runtime Behavior**

These are about JS itself and the event loop:

1. **Microtasks vs Macrotasks** — the real difference between `Promise.then()` and `setTimeout()`.
2. **Event Loop & Task Queue** — what actually runs when.
3. **Garbage Collection timing** — how and when memory is freed.
4. **Async Stack Traces** — why error traces jump around in async/await.
5. **Zero-delay `setTimeout(fn, 0)` not being immediate**.
6. **Web Workers** — truly parallel JS execution.
7. **SharedArrayBuffer & Atomics** — managing shared memory.
8. **Top-level await** — subtle behaviors in modules vs scripts.

---

## 🔒 **Browser & Security Phenomena**

How the browser isolates, protects, and controls resources:

1. **CORS (Cross-Origin Resource Sharing)** — why requests fail across domains.
2. **Same-Origin Policy** — foundational security rule for web pages.
3. **Content Security Policy (CSP)** — blocking inline scripts and XSS.
4. **Sandboxed iframes & postMessage** — how cross-frame communication works.
5. **COOP / COEP / CORP headers** — how browsers isolate processes.
6. **Credentialed vs Anonymous fetch requests** — cookies, auth headers, etc.

---

## 🧭 **DOM & Rendering Behavior**

What happens inside the browser’s render pipeline:

1. **Reflow vs Repaint** — performance implications of DOM changes.
2. **Layout Thrashing** — reading and writing layout in quick succession.
3. **Compositing Layers** — GPU acceleration, `will-change`, etc.
4. **Intersection Observer** — detecting visibility efficiently.
5. **Mutation Observer** — watching DOM changes.
6. **Microtask timing in rendering** — DOM updates between frames.

---

## 🧰 **API & Framework-related Mechanisms**

Common “gotchas” and behaviors across libraries:

1. **React Strict Mode double rendering** — why it happens only in dev.
2. **React’s concurrent rendering** — partial renders and Suspense.
3. **Svelte’s reactivity triggers** — assignment-based updates.
4. **Next.js ISR (Incremental Static Regeneration)** — how it rebuilds pages dynamically.
5. **Event delegation in frameworks** — how events bubble to parents efficiently.

---

Would you like me to narrow this list to a few **real-world “browser behavior” phenomena** (like request aborting, caching, streaming, preflight requests, etc.) — or do you also want the **JS runtime-level** ones (like microtasks, event loop, garbage collection)?
