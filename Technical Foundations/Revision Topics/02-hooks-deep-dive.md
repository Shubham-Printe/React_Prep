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

Quick terms
- Dispatch: a function `(action) => void` returned by `useReducer`. Calling it enqueues the action; React runs your reducer and re-renders if state changes. Identity is stable across renders.
- Action: a plain object describing “what happened” (e.g., `{ type: 'increment', by: 2 }`). In TS, model as a discriminated union so the reducer is type-safe and exhaustive.

Example (TypeScript): bounded counter with multiple actions
```tsx
import * as React from "react";

type State = { count: number; min: number; max: number };

type Action =
  | { type: "increment"; by?: number }
  | { type: "decrement"; by?: number }
  | { type: "reset" }
  | { type: "setBounds"; min: number; max: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment": {
      const step = action.by ?? 1;
      return { ...state, count: clamp(state.count + step, state.min, state.max) };
    }
    case "decrement": {
      const step = action.by ?? 1;
      return { ...state, count: clamp(state.count - step, state.min, state.max) };
    }
    case "reset":
      return { ...state, count: 0 };
    case "setBounds": {
      const next = {
        ...state,
        min: action.min,
        max: action.max
      };
      return { ...next, count: clamp(next.count, next.min, next.max) };
    }
    default:
      return state; // satisfies exhaustiveness when Action type is widened
  }
}

export function Counter() {
  const [state, dispatch] = React.useReducer(reducer, { count: 0, min: 0, max: 10 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "setBounds", min: -5, max: 5 })}>
        Set bounds to [-5, 5]
      </button>
    </div>
  );
}
```

Q&A
- Q: When to switch from `useState` to `useReducer`?  
  - A: When state shape is complex, many actions touch multiple fields, or you need predictable transitions.

---

### useEffect dependencies and synchronization
`useEffect` synchronizes your component with external systems (subscriptions, network, timers) and runs after the commit phase. Treat the dependency array as a declaration of what the effect reads from the render scope: include every value you use, or stabilize references intentionally (for example, with `useCallback`). Keep effects small, single-purpose, and composed; model them as “after render, keep X in sync with Y,” and handle async races with `AbortController` or early-return guards. Cleanup runs before the next effect and on unmount.

Examples

```tsx
// AbortController: cancel in-flight work on deps change/unmount
React.useEffect(() => {
  const ctrl = new AbortController();
  setStatus('loading');

  fetch(`/api/search?q=${query}`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => ctrl.abort();
}, [query]);
```

```tsx
// Early-return guard: ignore late completions from older async calls
React.useEffect(() => {
  let active = true;
  setStatus('loading');

  doAsyncWork(query).then(
    data => { if (active) setData(data); },
    err => { if (active) setError(err); }
  );

  return () => { active = false; };
}, [query]);
```

---

### useLayoutEffect vs useEffect
`useLayoutEffect` runs after DOM mutations but before paint. Use it for layout reads/writes that must block paint (rare). Prefer `useEffect` for most side effects to avoid jank. If you can see flicker or need immediate measurement, `useLayoutEffect` may be appropriate.

Example: scroll before paint to avoid visible jump
```tsx
function ChatLog({ messages }: { messages: string[] }) {
  const listRef = React.useRef<HTMLDivElement | null>(null);

  // Runs before the browser paints, so the user never sees the "not scrolled" state.
  React.useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight; // ensure scrolled to bottom without flicker
  }, [messages]);

  return (
    <div ref={listRef} style={{ overflowY: 'auto', maxHeight: 200 }}>
      {messages.map((m, i) => <div key={i}>{m}</div>)}
    </div>
  );
}
```

---

### useRef for instance values
`useRef` stores a mutable value across renders without causing re-renders when it changes. It’s also used to hold DOM elements via `ref` attributes. Place non-render-affecting instance data in refs; avoid using refs to bypass React state for values that should trigger UI updates.

Caveats and gotchas (often asked in interviews)
- Ref writes don’t re-render: mutating `ref.current` will not update the UI; use state for anything that should affect render.
- Initializer runs every render: `useRef(expensive())` evaluates `expensive()` on each render even though only the first value is used. Prefer lazy init:
```tsx
const cache = React.useRef<Thing | null>(null);
if (cache.current === null) {
  cache.current = expensiveCreateThing();
}
```
- Don’t “dodge” dependencies with refs: using a ref to avoid listing dependencies in `useEffect` can hide stale reads/bugs. Prefer correct deps or stabilize inputs with `useCallback`/`useMemo`.
- Null during first render/SSR: DOM refs are `null` until after mount; guard `ref.current` and prefer `useLayoutEffect` for layout reads/writes to avoid flicker.
- Don’t mutate during render: setting `ref.current = ...` inside render for side-effects breaks render purity; do it in effects instead.

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
`forwardRef` lets a parent attach a `ref` to a child function component. By default the ref points to the child’s DOM node if you forward it there, but with `useImperativeHandle` you can expose a curated object (an imperative “handle”) instead of the raw DOM. This is useful for imperative actions like focusing an input, selecting text, scrolling a container, measuring size, or resetting an internal form — cases that are hard or noisy to model declaratively.

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

Examples

```tsx
// useTransition: keep typing snappy while deferring expensive filtering
function SearchWithTransition({ allItems }: { allItems: string[] }) {
  const [query, setQuery] = React.useState('');
  const [filtered, setFiltered] = React.useState<string[]>(allItems);
  const [isPending, startTransition] = React.useTransition();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q); // urgent update (input stays responsive)
    startTransition(() => {
      // deferred update (can be interrupted if user keeps typing)
      const next = heavyFilter(allItems, q);
      setFiltered(next);
    });
  };

  return (
    <div>
      <input value={query} onChange={onChange} placeholder="Type to filter..." />
      {isPending && <small>Updating results…</small>}
      <ul>
        {filtered.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}

function heavyFilter(items: string[], q: string) {
  // Simulate expensive work
  const t = performance.now() + 10; while (performance.now() < t) {}
  q = q.toLowerCase();
  return items.filter(i => i.toLowerCase().includes(q));
}
```

```tsx
// useDeferredValue: render a heavy child off a deferred copy of query
function SearchWithDeferred({ allItems }: { allItems: string[] }) {
  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query); // lower priority propagation
  const isStale = deferredQuery !== query; // show hint while heavy child catches up

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Type to filter..." />
      {isStale && <small>Rendering results…</small>}
      <ResultsList items={allItems} query={deferredQuery} />
    </div>
  );
}

const ResultsList = React.memo(function ResultsList({
  items, query
}: { items: string[]; query: string }) {
  const filtered = React.useMemo(() => heavyFilter(items, query), [items, query]);
  return (
    <ul>
      {filtered.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
});
```

Interruption/discard demo
```tsx
// A later transition can preempt an earlier one, so the earlier UI never commits.
function TransitionPreemptionDemo() {
  const [value, setValue] = React.useState('idle');
  const [isPending, startTransition] = React.useTransition();

  const scheduleBurst = () => {
    // Schedule two low-priority updates back-to-back.
    startTransition(() => {
      setValue('A');
    });
    startTransition(() => {
      setValue('B');
    });
  };

  React.useEffect(() => {
    console.log('Committed value:', value);
  }, [value]);

  return (
    <div>
      <p>Value: {value} {isPending && <em>(pending)</em>}</p>
      <button onClick={scheduleBurst}>Schedule A then B</button>
      <p style={{ maxWidth: 520 }}>
        Press the button repeatedly or type quickly in other examples: the UI may never show "A"
        because the "B" transition preempts it. The interrupted render is discarded and only the
        latest transition commits.
      </p>
    </div>
  );
}
```

Caveats and gotchas
- `useTransition`
  - Only defers updates inside `startTransition`; urgent updates still render immediately.
  - Transitions can be interrupted or discarded; don’t perform side effects inside the `startTransition` callback. Use effects keyed to the committed state.
  - `isPending` is for UI hints (spinners), not a data-fetching status. Pair with Suspense or your own status for network work.
  - Does not make synchronous heavy work cheaper; long CPU tasks still block. Use virtualization or move work off the main thread.
  - Wrap only non-urgent updates; overusing transitions can hide important feedback.
- `useDeferredValue`
  - The parent still re-renders on every change; only consumers of the deferred value lag. Pair with `React.memo` so children skip re-render until the deferred value updates.
  - Deferred values are temporarily stale by design; ensure UI tolerates mismatch and avoid mixing deferred and non-deferred values that must be consistent.
  - Not a replacement for debounce/throttle/caching; it lowers priority but doesn’t batch or cancel your computations.
  - Effects depending on the deferred value fire later; if you need immediate effects, depend on the non-deferred input.
  - Works best when the expensive subtree is pure and memoized based on the deferred value.

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

Simpler examples (easy to grok)

Example: toggle boolean state
```jsx
function useToggle(initial = false) {
  const [value, setValue] = React.useState(initial);
  const toggle = React.useCallback(() => setValue(v => !v), []);
  return [value, toggle, setValue];
}

// Usage:
// const [isOpen, toggleOpen] = useToggle();
// <button onClick={toggleOpen}>{isOpen ? 'Hide' : 'Show'}</button>
```

Example: keep previous value
```jsx
function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// Usage:
// const prevCount = usePrevious(count);
```

Example: localStorage-backed state
```jsx
function useLocalStorage(key, initialValue) {
  const [state, setState] = React.useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

// Usage:
// const [name, setName] = useLocalStorage('name', '');
```

Example: interval (repeats a callback)
```jsx
function useInterval(callback, delay) {
  const saved = React.useRef(callback);
  React.useEffect(() => { saved.current = callback; }, [callback]);
  React.useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Usage:
// useInterval(() => setCount(c => c + 1), 1000);
```

Example: debounced value
```jsx
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Usage:
// const debouncedQuery = useDebouncedValue(query, 300);
```

Testing and ergonomics
- Test hooks with a hooks testing library or render them through small harness components. Mock external dependencies (timers, network) deterministically.
- Prefer returning stable handlers to avoid re-renders downstream; wrap outputs with `useMemo`/`useCallback` inside the hook when identity matters.
- Document assumptions (e.g., “call within a component wrapped by Provider X”) and validate at runtime if misuse would be subtle.

---

### Common gotchas
Common pitfalls include missing dependencies in effects that lead to stale reads or lost updates, overusing `useMemo` and `useCallback` where they add complexity without preventing real work, storing values in state that could be derived from props or other state, and forgetting to clean up subscriptions or timers which causes memory leaks and unexpected behavior.