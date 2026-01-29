# React Memoization Techniques

## Summary
Control re-renders and expensive calculations using memoization of components, functions, values, and refs.

## Key Concepts
- React.memo: skip re-render when props are shallowly equal.
- useCallback: memoize function identity for props/effects.
- useMemo: memoize expensive calculations or reference stability.
- useRef: persist mutable value across renders without re-rendering.

## Situational Scenarios
- Passing callbacks to memoized children to prevent needless re-renders (inline functions create new references every render; useCallback keeps props stable so React.memo can skip).
- Stabilizing derived objects in dependency arrays with useMemo.
- Storing instance-like values with useRef (e.g., DOM, timers, caches).

## Code Examples
```jsx
const Child = React.memo(({ onSelect }) => {/* ... */});

function Parent({ items }) {
  const handleSelect = useCallback((id) => {
    // ...
  }, []);

  const expensive = useMemo(() => heavyCompute(items), [items]);

  return <Child onSelect={handleSelect} value={expensive} />;
}
```

## Pitfalls
- Overusing useMemo/useCallback for trivial work; memoization has a cost.
- Functions in dependency arrays changing each render due to missing useCallback.

## Interview Q&A
- When does React.memo help? When props are stable and rendering is non-trivial.
- Difference between useMemo and useRef? useMemo memoizes computed values; useRef holds mutable values without triggering renders.

## References
- React Docs: Optimizing Performance, Memoization hooks.

## Checklist
- [ ] Memoize callbacks passed to memoized children
- [ ] Memoize expensive computations
- [ ] Avoid premature memoization

