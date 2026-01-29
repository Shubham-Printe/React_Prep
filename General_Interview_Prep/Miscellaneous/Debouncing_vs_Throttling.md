## Debouncing vs Throttling

### Exact definitions
- **Debounce**: Delay a function until there’s a quiet period of N ms. Each new event resets the timer. Result: only the final event in a burst runs.
- **Throttle**: Allow a function to run at most once every N ms. Events inside the window are ignored or coalesced. Result: regular, spaced calls.

### Where they differ
- **Trigger pattern**
  - Debounce: burst → 1 call at the end (trailing) or at start (leading) if configured.
  - Throttle: continuous → calls spaced every N ms (leading, trailing, or both).
- **UX feel**
  - Debounce: waits for user to pause (can feel delayed unless leading is used).
  - Throttle: updates steadily during activity (never exceeds a set rate).
- **Goal**
  - Debounce: collapse noise to a single action.
  - Throttle: cap work rate while preserving responsiveness.

### When to use which
- Use **Debounce**:
  - Search-as-you-type API calls
  - Autosave after typing stops
  - Resize handlers that should run after user finishes resizing
- Use **Throttle**:
  - Scroll/drag/resize listeners updating UI continuously (e.g., sticky headers, progress)
  - Pointer move events (dragging a slider/drag-and-drop)
  - Rate-limiting analytics pings or heavy computations on scroll

### Minimal implementations

```js
// Debounce: run after a quiet period. Each call resets the timer.
// Idea: keep a timeout handle 't' in a closure. Every time the returned
// function is called, we cancel the previous timer and start a new one.
// Only if no new calls come in for 'wait' ms, 'fn' actually runs.
function debounce(fn, wait) {
  let t;
  return function (...args) {
    const ctx = this;           // preserve 'this' for methods
    clearTimeout(t);            // cancel any pending run
    t = setTimeout(() => {      // schedule a new run
      // If no new call happens before 'wait' ms elapse, execute:
      fn.apply(ctx, args);      // forward original context and arguments
    }, wait);
  }
}
```

```js
// Throttle: run at most once every `wait` ms. Extra calls are ignored.
// Idea: record the timestamp of the last execution. On each call, if enough
// time has passed since the last run, execute; otherwise do nothing.
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();          // current time for rate limiting
    if (now - last >= wait) {        // has the window elapsed?
      last = now;                    // remember when we last ran
      fn.apply(this, args);          // run immediately and forward args/context
    }                                // otherwise: ignore this call
  }
}
```

### Rule of thumb
- If you need “after user stops,” use debounce.
- If you need “while user continues, but not too often,” use throttle.


