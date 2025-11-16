# JavaScript & Frontend Core

## Summary
Language and platform fundamentals commonly tested in frontend interviews.

## Key Concepts
- Event Delegation: one parent listener handles multiple children via bubbling.
- Event Phases: Capturing (top→down), Bubbling (bottom→up, default in React onClick).
- Prototype vs Classes: classes are syntactic sugar over prototypes; call super() before this.
- Deep vs Shallow Copy: structuredClone, _.cloneDeep; shallow copies only first level.
- Debounce vs Throttle: debounce after pause; throttle at intervals.
- Generators & Iterators: function*, yield; .next() → { value, done }.
- Browser APIs: Web Workers, IntersectionObserver, Storage APIs.

## Situational Scenarios
- Infinite scroll: IntersectionObserver over scroll listeners.
- Heavy computation: offload to Web Worker.
- Prevent spammy events: debounce search; throttle resize/scroll.

## Code Examples
```js
// Debounce
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}
```

## Pitfalls
- Forgetting to call super() before this in class constructors.
- Using shallow copy where deep copy is required (nested structures).

## Interview Q&A
- How does event delegation work? One handler on parent uses event.target to manage children.
- When to use debounce vs throttle? Debounce for pause-after-typing; throttle for regular intervals.

## References
- MDN: Event phases, Prototypes, Web APIs.

## Checklist
- [ ] Choose correct event strategy (capture vs bubble)
- [ ] Apply right rate-limiting (debounce/throttle)
- [ ] Use platform APIs for performance

