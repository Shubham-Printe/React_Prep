## Platform & Browser Knowledge

- [ ] Event loop, tasks vs microtasks; React scheduling implications
- [ ] Synthetic events vs native events; propagation and batching
- [ ] IntersectionObserver, ResizeObserver; virtualization triggers
- [ ] Storage: local/session storage, IndexedDB; quotas and eviction
- [ ] Web Workers/Worklets; OffscreenCanvas for heavy work

---

### Event loop and scheduling
The browser runs macro tasks (timers, IO, user input) and microtasks (promises) between paints. React batches state updates within the same event turn; introducing an `await` splits execution, allowing React to commit before later updates. Keep heavy work off the main thread or behind transitions to avoid blocking input and paint.

Q&A
- Q: Why do multiple `setState` calls batch in an event handler but sometimes not after `await`?  
  - A: `await` yields back to the event loop; subsequent updates run in a new turn and may commit separately unless wrapped in a transition.

---

### Synthetic vs native events
React’s synthetic events normalize browser differences and use delegation on the root for performance. Modern React no longer pools events, but handlers still receive consistent event shapes. Use `e.nativeEvent` only when you need low-level details. Stop propagation carefully; prefer local state and composition over global event hacks.

---

### IntersectionObserver and ResizeObserver
Use IntersectionObserver to lazily render or load assets when elements near the viewport, and ResizeObserver to adapt UI to container size changes. Both help avoid layout thrash and polling. Combine with virtualization to limit DOM size for long lists.

---

### Storage options and quotas
LocalStorage/sessionStorage are simple key-value stores but synchronous—avoid large writes on the main thread. Persist larger or structured data in IndexedDB via libraries (idb). Be mindful of per-origin quotas and eviction behavior (storage pressure can clear data). Encrypt or redact sensitive data; never store secrets client-side.

---

### Workers and Worklets
Web Workers move CPU-heavy logic off the main thread (parsing, image processing). Use Comlink or message passing with transferable objects to minimize copies. CSS/Animation Worklets let you run scroll/animation logic off the main thread. OffscreenCanvas enables rendering in a worker for graphics-heavy apps.


