# Debugging Traps

## Summary
Common React pitfalls that cause subtle bugs or performance issues.

## Key Concepts
- Batched state updates: multiple setState calls with stale value only apply once.
- Effect dependencies: missing deps cause repeated or missed effects.
- Stale closures: effects/intervals capture old values unless you use functional updates.
- Unstable deps: new object/array/function instances retrigger effects.
- List keys: unstable keys can keep incorrect component state.

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

```js
// ❌ Unstable object dep
const options = { limit: 10 };
useEffect(() => { fetchData(options); }, [options]);

// ✅ Memoize or depend on primitives
const options = useMemo(() => ({ limit: 10 }), []);
useEffect(() => { fetchData(options); }, [options]);
```

## Situational Scenarios
- Event handlers updating the same state multiple times.
- Data fetching inside effects tied to query/state.

## Pitfalls
- Omitting dependencies in useEffect and relying on linter disable.
- Using array index as key when list can reorder or filter.
- Recreating objects/arrays in render and using them as deps.

## Interview Q&A
- Why use functional setState? Avoids stale closures and respects batching.
- Why avoid index keys? State can stick to the wrong row when order changes.

## References
- React Docs: State updates, useEffect.

## Checklist
- [ ] Prefer functional updates when deriving from previous state
- [ ] Correct effect dependency arrays
- [ ] Use stable keys for list items (id, not index)


