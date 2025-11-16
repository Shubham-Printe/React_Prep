## Hooks Deep Dive

- [ ] Rules of Hooks; linter enforcement and why
- [ ] `useState` pitfalls: stale closures, functional updates, batching
- [ ] `useReducer` for complex state; reducer purity, action typing
- [ ] `useEffect` dependency arrays; synchronization vs lifecycle mental model
- [ ] `useLayoutEffect` vs `useEffect`; layout thrash considerations
- [ ] `useRef` for instance values, DOM refs, avoiding re-renders
- [ ] `useMemo` and `useCallback`: when they help and when they hurt
- [ ] `useImperativeHandle` with `forwardRef` for escape hatches
- [ ] Concurrent features: `useTransition`, `useDeferredValue`
- [ ] Custom hooks: composition, parameters, return structure, naming, reuse
- [ ] Common gotchas: exhaustive-deps, subscribing/unsubscribing, event handlers

React hooks let function components manage state, run side effects, memoize expensive work, and coordinate asynchronous UI without classes. The rules that govern them ensure React can associate state with the correct hook calls across renders, while specific hooks like `useEffect`, `useMemo`, and `useTransition` help you express intent about synchronization, performance, and responsiveness. Read this section as a narrative reference you can recall quickly during interviews.

---

### Rules of Hooks
Hooks must be called at the top level of React function components or custom hooks—never inside loops, conditions, or nested functions. This preserves call order so React can associate state with the right hook call. ESLint’s hooks plugin enforces this and flags dependency issues for effects.

Q&A
- Q: Why can’t I call hooks in conditions?  
  - A: Conditional calls change the order across renders, breaking React’s ability to bind state to the same hook index.

---

### useState pitfalls and batching
`useState` updates schedule a re-render. In React 18+, updates in the same tick are automatically batched. When the next state depends on the previous one, use the functional form `setState(prev => next)` to avoid stale closures. Avoid storing derived values in state; derive them from minimal sources.

Q&A
- Q: My increment loop sets the same value—why?  
  - A: You used `setCount(count + 1)` repeatedly with stale `count`. Use `setCount(c => c + 1)` in loops or async flows.

---

### useReducer for complex transitions
`useReducer` centralizes state transitions in a pure reducer `(state, action) => newState`. It’s ideal when updates are interrelated or when you want predictable, logged transitions. Combine with TypeScript discriminated unions for safe, explicit actions. Keep reducers pure and side-effect free; trigger effects in `useEffect` based on state changes.

Q&A
- Q: When to switch from `useState` to `useReducer`?  
  - A: When state shape is complex, many actions touch multiple fields, or you need predictable transitions.

---

### useEffect dependencies and synchronization
`useEffect` synchronizes your component with external systems (subscriptions, network, timers) and runs after the commit phase. Treat the dependency array as a declaration of what the effect reads from the render scope: include every value you use, or stabilize references intentionally (for example, with `useCallback`). Keep effects small, single-purpose, and composed; model them as “after render, keep X in sync with Y,” and handle async races with `AbortController` or early-return guards. Cleanup runs before the next effect and on unmount.

---

### useLayoutEffect vs useEffect
`useLayoutEffect` runs after DOM mutations but before paint. Use it for layout reads/writes that must block paint (rare). Prefer `useEffect` for most side effects to avoid jank. If you can see flicker or need immediate measurement, `useLayoutEffect` may be appropriate.

---

### useRef for instance values
`useRef` stores a mutable value across renders without causing re-renders when it changes. It’s also used to hold DOM elements via `ref` attributes. Place non-render-affecting instance data in refs; avoid using refs to bypass React state for values that should trigger UI updates.

---

### useMemo and useCallback
`useMemo` caches expensive computations; `useCallback` caches function references. They are performance hints, not guarantees. Memo only when it avoids real work or prevents re-render cascades from unstable references. Overusing them can add mental and runtime overhead.

How they work with React.memo
React.memo shallowly compares a component’s props; if all props are referentially equal, React skips re-rendering that child. `useMemo` helps keep derived objects/arrays stable across renders, and `useCallback` keeps function props stable. Together, they prevent a memoized child from seeing “new” props each time and re-rendering needlessly. Note that React.memo does a shallow comparison, nested values that change still count as different if the top-level reference changes.

Where and how `useMemo` prevents unnecessary re-renders
Use `useMemo` when you pass derived objects/arrays as props to a memoized child or when an expensive computation’s result would otherwise be recalculated every render.
- Stabilizing prop identity: create options, style objects, or filter results with `useMemo` so the reference doesn’t change unless dependencies change.
- Avoiding recomputation: memoize CPU-heavy transforms (sorting, parsing) so they only recompute when inputs change.

Example:
```jsx
const options = useMemo(() => computeOptions(data, flags), [data, flags]);
return <List options={options} />; // with React.memo(List), stable options prevents re-renders
```

Where and how `useCallback` prevents unnecessary re-renders
Use `useCallback` for event handlers you pass to memoized children or to keep effect dependencies in children from re-running purely due to changing function identities.
- Stabilizing handler props: wrap `onSelect`, `onChange`, etc., so memoized children don’t re-render on every parent render.
- Preventing child effects from re-firing: if a child effect depends on a handler, a stable callback identity prevents that effect from re-running needlessly.

Example:
```jsx
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
return <Item onSelect={handleSelect} />; // with React.memo(Item), stable handler helps skip renders
```

Caveats
- `useMemo`/`useCallback` do not stop the parent from rendering; they only help children that rely on stable prop identities or expensive computations.
- Always include correct dependencies; forcing stability with empty arrays can hide bugs and stale values.
- Don’t wrap trivial values or handlers; the memoization cost can outweigh the benefit. Profile first or focus on clearly hot paths.

Q&A
- Q: Should I wrap every handler in `useCallback`?  
  - A: No. Do it when the stable identity prevents expensive child re-renders or unnecessary effects.

---

### Imperative handles and forwardRef
`forwardRef` lets a parent attach a `ref` to a child function component. By default the ref points to the child’s DOM node if you forward it there, but with `useImperativeHandle` you can expose a curated object (an imperative “handle”) instead of the raw DOM. This is useful for imperative actions like focusing an input, selecting text, scrolling a container, measuring size, or resetting an internal form—cases that are hard or noisy to model declaratively.

How it works
- `forwardRef` passes the parent’s ref into the child as the second parameter.
- Inside the child, you typically keep a private `useRef` to the actual DOM node or internal state.
- `useImperativeHandle(ref, createHandle, deps)` defines what the parent sees at `ref.current`. Update the handle only when its dependencies change to avoid exposing stale closures.

Example
```jsx
const TextInput = React.forwardRef(function TextInput(props, ref) {
  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      const el = inputRef.current;
      if (!el) return;
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true })); // keep controlled parents in sync
    }
  }), []); // include deps if methods capture changing values
  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const inputHandle = React.useRef(null);
  return (
    <>
      <TextInput ref={inputHandle} />
      <button onClick={() => inputHandle.current?.focus()}>Focus</button>
      <button onClick={() => inputHandle.current?.clear()}>Clear</button>
    </>
  );
}
```

Guidelines and caveats
- Prefer declarative props when feasible (e.g., control `open` state) and use imperative handles as escape hatches for DOM-ish actions.
- Keep the exposed API minimal and stable. If your handle methods capture props/state, include them in `useImperativeHandle`’s dependency array to avoid stale behavior.
- Combining with memo: you can wrap a component with both `memo` and `forwardRef` (e.g., `export default memo(forwardRef(Comp))`) to skip re-renders while still exposing a ref.
- A ref update itself doesn’t trigger re-renders; methods on the handle may cause the child to update if they call `setState`.
- TypeScript: type the handle (`useImperativeHandle<HandleType>(ref, ...)`) so parents get intellisense for `.focus()`, `.clear()`, etc.

---

### Concurrent features: transitions and deferred values
`useTransition` marks state updates as low priority, allowing more urgent updates (typing) to remain responsive while deferring expensive renders (results). `useDeferredValue` delays a value’s propagation to children, letting them render at a lower priority. Both improve perceived responsiveness without manual throttling.

---

### Custom hooks: composition and reuse
Encapsulate related state and effects into custom hooks. Keep a clear API: parameters in, derived state and callbacks out. Name them with `use*`. Ensure cleanup and subscriptions are correct and dependencies exhaustive. Favor composition of smaller hooks over monoliths.

What makes a good custom hook
- Clear responsibility: one domain concern per hook (e.g., “subscribe to X,” “manage selection,” “sync URL params”). Compose multiple hooks in a component rather than one giant hook.
- Minimal surface: accept inputs that affect the behavior and return only what consumers need (values, booleans, and handlers). Avoid leaking implementation details like timers, refs, or raw event sources unless they are the API.
- Deterministic effects: include all dependencies in internal effects; expose stable outputs (memoized values and callbacks) when consumers are likely to pass them further down.
- Correct cleanup: tear down subscriptions, listeners, and timers in effect cleanups. Ensure idempotency under StrictMode’s mount/unmount replays in development.

Designing the API
- Inputs should be serializable or stable (IDs, options). If you accept callbacks from consumers, document when you call them and consider stabilizing internal usage with `useRef` + effect to avoid re-subscribing unnecessarily.
- Outputs should favor booleans and simple values over opaque objects when possible. If returning an object, memoize it so referential identity is stable across renders.

Example: event listener hook
```jsx
function useEventListener(target, type, listener, options) {
  const saved = React.useRef(listener);
  React.useEffect(() => { saved.current = listener; }, [listener]);

  React.useEffect(() => {
    const el = typeof target === 'function' ? target() : target;
    if (!el || !el.addEventListener) return;
    const wrapped = (e) => saved.current(e);
    el.addEventListener(type, wrapped, options);
    return () => el.removeEventListener(type, wrapped, options);
  }, [target, type, options]);
}

// Usage:
// useEventListener(() => window, 'resize', onResize, { passive: true });
```

Example: async data with cancellation
```jsx
function useAsync(fn, deps) {
  const [state, setState] = React.useState({ status: 'idle', data: null, error: null });
  React.useEffect(() => {
    let active = true;
    setState(s => ({ ...s, status: 'loading', error: null }));
    fn()
      .then(data => active && setState({ status: 'success', data, error: null }))
      .catch(error => active && setState({ status: 'error', data: null, error }));
    return () => { active = false; };
  }, deps);
  return state;
}

// Usage:
// const { status, data, error } = useAsync(() => fetchJSON(url), [url]);
```

Testing and ergonomics
- Test hooks with a hooks testing library or render them through small harness components. Mock external dependencies (timers, network) deterministically.
- Prefer returning stable handlers to avoid re-renders downstream; wrap outputs with `useMemo`/`useCallback` inside the hook when identity matters.
- Document assumptions (e.g., “call within a component wrapped by Provider X”) and validate at runtime if misuse would be subtle.

---

### Common gotchas
Common pitfalls include missing dependencies in effects that lead to stale reads or lost updates, overusing `useMemo` and `useCallback` where they add complexity without preventing real work, storing values in state that could be derived from props or other state, and forgetting to clean up subscriptions or timers which causes memory leaks and unexpected behavior.