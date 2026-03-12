# React Core
- JSX, rendering, reconciliation basics (score: 9/10)
- Hooks: useState, useEffect, useRef, useMemo, useCallback, useReducer (score: 9/10)
- Custom hooks and hook rules (score: 8/10)
- Component patterns: controlled/uncontrolled, container/presenter, composition (score: 8/10)
- Lifecycle and rendering behavior (strict mode, batching) (score: 8/10)
- Lists and keys, conditional rendering, forms and validation (score: 8/10)
- Error boundaries and fallback UI (score: 8/10)
- Suspense and lazy loading basics (score: 7/10)

## JSX, Rendering, Reconciliation - Q&A
1. What does JSX compile to, and why does that matter for performance/debugging?
   - JSX compiles (via Babel) to `React.createElement(...)` calls that return plain JS objects (React elements).
     React uses these to build a virtual tree and efficiently update the DOM during reconciliation.
   - **Performance**: 
    - Without a virtual representation, you'd naively tear down and rebuild the DOM on each update which is expensive, since DOM operations trigger layout and paint. 
    - React diffs the element tree in memory and computes a minimal list of DOM changes, then applies only those patches. Fewer mutations, fewer reflows. This is comparatively much cheaper.
   - **Debugging**: 
    - Imperative DOM code shows scattered `createElement`, `appendChild`, `setAttribute` calls that are hard to trace *why* something changed. 
    - With React, the UI is a declarative tree of components and state. React DevTools lets you inspect the component hierarchy, props, and state, so you can see which component caused an update and reason about it from the tree rather than raw DOM mutations.

   - Full render flow (from component call to pixels on screen):
     1) Component is invoked during the render phase to produce React elements.
     2) React builds a fiber tree for this render and compares it to the previous tree, this process is called Reconciliation.
     3) React computes a list of changes needed for the DOM and schedules a commit.
     4) Commit phase mutates the DOM (create/update/remove nodes, set attributes, attach events).
     5) Browser runs layout, then paint so the user sees the updated UI.
     6) After paint, React runs passive effects (`useEffect`) and schedules any follow-up updates.

  - **Reconciliation vs diffing**: 
  - Reconciliation is the React's algorithm to sync the new tree with the previous one and determine DOM updates. 
  - Diffing is a *step* within that process: comparing the two trees to find what changed (type, props, children). 
  
   - **Layout/reflow**: The process where the browser calculates geometry—position and size of each element from styles and DOM. DOM changes, that affect size or position force a reflow. This is costly because it can be cascading.
   - **Paint**: After layout, the browser draws what you see, backgrounds, borders, text, shadows, into layer bitmap. It's costly because many pixels must be recomputed; even changes that don't move elements, trigger paint because those pixels must be redrawn.
   - **Composite**: The browser combines layers into the final image. Changing `transform` or `opacity` often skips layout and paint and only triggers composite, cheapest for animations.
   
2. When does React keep the same DOM node and just patch its props/attributes, and when does it discard it and create a new node?
   - React compares element type and key at the same position. If type or key changes, it replaces the DOM node.
     If they match, React reuses the node and updates attributes. 
     For lists, stable keys allow items to be reused.
3. What is the significance of the `key` prop in lists, and what happens if it's unstable?
   - Keys let React match list items between renders so it can reuse the correct DOM nodes.
     If keys are unstable, React may recreate nodes, lose state, or apply props to the wrong item.
4. How does React batch updates, and what effect does that have on rendering?
   - React batches state updates that occur in the same event-loop tick, to produce a single render/commit.
     This reduces unnecessary renders and improves performance. 
     In React 18, batching is automatic for more cases (timeouts, promises, native events), not just React events. 
     Because updates apply together, we need to use the functional setState form when the next state depends on the previous one.
5. In your own words, what is the difference between rendering and committing in React?
    - Render is when React runs component functions to produce a new react element and the corresponding element tree.
    - Commit is when React applies those changes to the DOM and runs effects.

## Hooks - Q&A
1. What are hooks in general, why were they introduced, how do they work, and how does that solve the need?
   - **What**: 
    Hooks are just functions that let you use state and side effects inside a **function component**. Before hooks, you had to use a class if you needed state.
   - **Why introduced**: 
    With class components, sharing stateful logic was messy (HOCs and render props made "wrapper hell"). 
    Lifecycle methods spread one concern across several places (e.g. mount, update, unmount). 
    React needed a simpler way to reuse logic and keep related code in one place—without classes.
   - **How they work**: 
    React attaches a list of hook states to each component instance. 
    On each render, hooks run in order: 
      `useState` returns the stored value for that slot and queues updates; 
      `useEffect` schedules a side effect to run after commit. 
      React identifies hooks by call position not by name, so the call order must stay the same every render.
   - **How that solves the need**: 
    You get state and effects in plain functions. 
    You can share logic by putting it in a **custom hook** instead of HOCs. 
    One effect can do one job (e.g. fetch on mount and cleanup on unmount) instead of splitting it across three lifecycle methods. No classes, no `this`, and the code is easier to follow.

2. Why do Hooks have to be called at the top level and in the same order on every render?
   - React tracks hook state by call position, not by name. If the order changes (because of conditionals
     or loops), React would read the wrong state/effect for a hook. Keeping hooks at the top level
     guarantees a stable call order so React can map each call to its stored state/effect.

3. What's the difference between `useEffect` and `useLayoutEffect`, and when would you use each?
  - `useLayoutEffect` runs synchronously after DOM mutations but before paint, so it can block rendering.
     It's used for layout measurements or DOM tweaks to avoid flicker. 
  - `useEffect` runs after paint, so it's non-blocking and ideal for data fetching, subscriptions, and logging.

4. When would you use `useRef` instead of `useState`, and why?
   - `useRef` holds a mutable value that persists across renders without causing a re-render when it changes.
     Use it for DOM refs, timers/interval IDs, previous values, or instance. 
     Use `useState` when changes should trigger a UI update.
   - **What not to put in useState** (use useRef instead):
     - DOM elements
     - Timer/interval IDs (e.g. from `setTimeout` / `setInterval`)
     - Mutable instances (e.g. chart, third-party widget)
     - Previous value of prop/state (for comparison)
    They all share one idea: you need to keep the value across renders, but changing it should not cause a re-render.
   - **What not to put in useRef** (use useState instead):
     - Anything that, when it changes, should update the UI (e.g. form input value, list data, display text)

5. How do you avoid stale closures in `useEffect` or event handlers?
   - Stale closures happen when an effect or handler captures outdated state/props. 
   Avoid them by including all needed dependencies in `useEffect`, using functional state updates when new state depends on old state.

6. What is a custom hook, and when should you create one?
   - A custom hook is a reusable function that calls React hooks to encapsulate stateful logic. 
   Create one when multiple components need the same behavior (fetching, form handling, subscriptions) so you can share logic without duplicating code or coupling it to UI.

## Custom Hooks and Hook Rules - Q&A

### Rules of Hooks (must follow)
1. **Call hooks only from** React function components or from other custom hooks. Never from class components, plain functions, or event handlers.
2. **Call hooks at the top level** — not inside loops, conditions, or nested functions. The same hooks must run in the same order on every render so React can match state to the correct hook.

**Why:** React associates hook state with the *position* of the call (first `useState`, second `useState`, etc.). If the order changes between renders, React would mix up state. Top-level-only and same order keeps the mapping correct.

---

### Simple custom hook examples

**Example 1 — `useToggle` (simple state + handler)**  
Reusable boolean flip; no effects, just state and a stable callback.
```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// Usage
const [isOpen, toggleOpen] = useToggle(false);
return <button onClick={toggleOpen}>{isOpen ? "Close" : "Open"}</button>;
```

**Example 2 — `useFetch` (async data with loading/error)**  
Encapsulates fetch, loading, error, and optional refetch. Uses `useEffect` and cleanup (AbortController) so in-flight requests are cancelled when the component unmounts or the URL changes.
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url, refetchKey]);

  const refetch = useCallback(() => setRefetchKey((k) => k + 1), []);

  return { data, loading, error, refetch };
}

// Usage
const { data, loading, error } = useFetch("/api/user");
if (loading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <Profile user={data} />;
```

---

### Design and pitfalls
- **What to return:** Return only what the component needs — state, derived values, and handlers — as an object or array. Keep the interface stable and minimal.
- **Dependencies:** In any `useEffect` inside the hook, list all dependencies (e.g. `url` in `useFetch`). Missing deps cause stale closures or missed updates.
- **Common mistake:** Hiding too much inside the hook or forgetting deps. Prefer a clear contract: “This hook takes X and returns Y; it does Z when X changes.”

---

### Q&A (short)
1. **Benefits vs HOCs/render props?** Custom hooks reuse stateful logic without extra wrapper components or nesting; no prop name clashes; you just call the hook and get state + handlers.
2. **How would you share async data-fetching logic?** A `useFetch`-style hook that takes a URL (and maybe options), manages `loading`, `data`, `error` in `useEffect`, uses AbortController for cleanup, and returns `{ data, loading, error, refetch }` — as in Example 2 above.

## Component Patterns - Q&A
1. What's the difference between a controlled and an uncontrolled component?
   - A controlled component's value is driven by React state (`value` + `onChange`), so React is the single source of truth. 
   - An uncontrolled component lets the DOM manage its own state and you read it via refs, which is simpler for basic forms but less flexible for live validation.

2. What is the container/presentational (smart/dumb) component pattern, and why use it?
   - Presentational components focus on UI and receive data/handlers via props. 
   - Container components manage state, data fetching, and business logic, then pass results down. 
   - This separation improves reusability, testability, and keeps UI components simpler.

3. What is composition in React, and why is it preferred over inheritance?
   - Composition means building UI by combining smaller components via props and children, rather than extending classes. 
   - It is preferred because it is flexible, reusable, and avoids rigid inheritance chains.

4. What problem does "prop drilling" describe, and when would you replace it with Context?
   - Prop drilling is passing data through many intermediate components that do not use it, just to reach a deep child. 
   - Replace it with Context when shared data is needed across many levels (theme, auth, locale) and prop chains become noisy. 
   - For highly dynamic or frequently changing data, global state solutions like redux can reduce re-render issues.

5. When would you use render props, and what's the downside compared to hooks?
   - Render props work when a component shares logic but the UI is highly variable, so the parent passes a render function.
   - Downsides vs hooks include extra nesting and harder debugging.

## Lifecycle and Rendering Behavior - Q&A
1. What does React Strict Mode do in development, and why might it seem like components render twice?
   - In development, Strict Mode intentionally double-invokes certain lifecycle paths (render and effects) to surface unsafe side effects and ensure cleanup logic is correct. This is dev-only and does not affect production builds.

2. When does `useEffect` run relative to render/commit, and what should go in the cleanup function?
   - `useEffect` runs after the commit/paint. 
   - The cleanup runs before the next effect execution and on unmount.
   - Use cleanup for unsubscribing, clearing timers, aborting requests, and closing sockets.

3. Why can calling `setState` in render cause an infinite loop, and how do you avoid it?
   - Calling `setState` during render triggers another render, which calls `setState` again, causing an infinite loop. 
     Avoid it by only updating state in event handlers, effects, or callbacks—not during render.
     
4. What happens if you update state based on previous state, and how should you write it?
   - Because React may batch updates, using the current state variable can be stale. 
   - When the new state depends on the previous one, use the functional form: `setCount(prev => prev + 1)`.

5. How does React decide whether to re-render a component, and how can you reduce unnecessary re-renders?
   - React re-renders when state changes, props change, or a parent re-renders. 
   - We can reduce unnecessary re-renders by memoizing child components with `React.memo` and stabilizing props with `useMemo` and `useCallback` so object/function references do not change every render.

## Lists, Keys, Conditional Rendering, Forms - Q&A
1. Why should you avoid using array indexes as keys in dynamic lists?
   - Indexes are unstable when items are added, removed, or reordered, so React can mismatch items and preserve the wrong state. - It is only safe to use index keys for static lists that never reorder or change.

2. What are the common ways to do conditional rendering in React?
   - Use ternary (`condition ? A : B`),
   - `&&` for simple show/hide,
   - early returns (return null/component),
   - or a switch/mapping from status to UI.

3. What's the difference between controlled inputs and uncontrolled inputs in React forms?
   - Controlled inputs use React state (`value` + `onChange`) as the single source of truth. 
   - Uncontrolled inputs let the DOM manage the value and you read it via refs—simpler for basic forms but less flexible for live validation.

4. How do you handle form validation in React (client-side), and where should validation logic live?
   - We do inline field validation for immediate feedback and a form-level check on submit. 
   - Keep rules in the form layer (or a shared schema like Yup/Zod) and pass validation results to fields for display.
   - But we should always validate again on the server.

5. How do you handle form submission and prevent the default browser behavior in React?
   - Attach an `onSubmit` handler to the `<form>` and call `event.preventDefault()` to stop the page reload. 
   - Then read controlled state (or for uncontrolled forms, read values via refs/`FormData`) and run validation before submitting.

## Error Boundaries and Fallback UI - Q&A
1. What is an error boundary in React, and what kinds of errors does it catch?
   - An error boundary catches errors during rendering, in lifecycle methods, and in constructors of its child tree, then shows a fallback UI. 
   - It does not catch errors in event handlers, async code (fetch), or errors outside the React tree.

2. How do you implement an error boundary in React (class vs hooks)?
   - Error boundaries must be class components. 
   - We implement `static getDerivedStateFromError` to set fallback state and `componentDidCatch` to log/report. 
   - There is no native hook-based error boundary yet, using a class wrapper or a library like `react-error-boundary` is the only option.

3. Where should you place error boundaries in an app (global vs local), and why?
   - We should use a global error boundary near the root to avoid a blank screen, and local boundaries around risky sections so a single widget failure does not take down the whole page.

4. What should a good fallback UI include, and what should it avoid?
   - A good fallback UI should explain the error in simple language, offer recovery (retry, reload, or navigate back), and optionally log/report. 
   - It should avoid technical stack traces or sensitive details for end users.

5. How do you reset an error boundary after a failure?
   - Two common approaches:
     1) Internal: Reset the error boundary's internal state (via a retry action) so it re-renders its children.
     2) External: Change the `key` on the error boundary from the parent to force a remount and reset state.

## Suspense and Lazy Loading - Q&A
1. What problem does `React.lazy` solve, and how does it work with `Suspense`?
   - `React.lazy` enables code-splitting by loading components on demand (dynamic import). 
   - When a lazy component is loading, `Suspense` shows a fallback UI until the chunk is ready. 
   - Suspense can also coordinate other async rendering depending on setup/framework.

2. What are good candidates for lazy loading in a React app?
   - Route-level pages, heavy dashboards, charts, rich editors, rarely used modals, and admin-only screens are good candidates. 
   - Avoid lazy-loading tiny shared components where the overhead outweighs benefits.

3. What's the difference between code-splitting at route level vs component level, and what tradeoffs do you consider?
   - Route-level code splitting (pages):
     - Loads an entire page only when the user navigates there.
     - Big initial bundle savings with minimal complexity.
     - Fewer Suspense boundaries and simpler UX.
   - Component-level code splitting (widgets inside a page):
     - Loads specific heavy components only when needed (charts, editors, modals).
     - More granular savings but also more requests.
     - Can make heavy pages become interactive sooner, but you may end up with many spinners on screen at once.
   - Tradeoffs: UX quality(fewer loaders), network calls (more chunks/requests), caching behavior, and code complexity.

4. What are potential pitfalls or UX issues with Suspense and lazy loading, and how do you mitigate them?
  - Pitfalls include too many loaders, layout shifts, delayed interactivity, and loading waterfalls.
  - Mitigate by grouping lazy chunks at route level, prefetching likely routes, using skeletons with reserved space, and keeping critical UI eagerly loaded.

5. How do `Suspense` boundaries interact with error boundaries (i.e., loading vs error states)?
   - Suspense boundary handles loading by catching a thrown promise and showing its fallback. 
   - Error boundaries handle errors by catching thrown errors and showing an error fallback. 
   - Use both so loading and error states are handled independently.
