# Debugging Traps

## Summary
Common React pitfalls that cause subtle bugs or performance issues.

## Key Concepts
- Batched state updates: multiple setState calls with stale value only apply once.
- Effect dependencies: missing deps cause repeated or missed effects.

## Code Examples
```js
// Batched updates (stale value)
setCount(count + 1);
setCount(count + 1);
setCount(count + 1); // Only +1

// ✅ Fix
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1); // +3
```

```js
// ❌ Runs on every render
useEffect(() => { fetchData(query); });

// ✅ Runs only when query changes
useEffect(() => { fetchData(query); }, [query]);
```

## Situational Scenarios
- Event handlers updating the same state multiple times.
- Data fetching inside effects tied to query/state.

## Pitfalls
- Omitting dependencies in useEffect and relying on linter disable.

## Interview Q&A
- Why use functional setState? Avoids stale closures and respects batching.

## References
- React Docs: State updates, useEffect.

## Checklist
- [ ] Prefer functional updates when deriving from previous state
- [ ] Correct effect dependency arrays


