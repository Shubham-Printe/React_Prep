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
     This matters for performance (diffing vs full DOM rebuild) and debugging (inspect element tree vs raw DOM ops).
   - Full render flow (from component call to pixels on screen):
     1) Component is invoked (function or class `render`) during the render phase to produce React elements.
     2) React builds a fiber tree for this render and compares it to the previous tree (reconciliation/diff).
     3) React computes a list of changes (effect list) needed for the DOM and schedules a commit.
     4) Commit phase mutates the DOM (create/update/remove nodes, set attributes, attach events).
     5) Browser runs layout (reflow), then paint/composite so the user sees the updated UI.
     6) After paint, React runs passive effects (`useEffect`) and schedules any follow-up updates.
2. When does React keep the same DOM node and just patch its props/attributes, and when does it discard it and create a new node?
   - React compares element type and key at the same position. If type or key changes, it replaces the DOM node/subtree.
     If they match, React reuses the node and updates props/attributes. For lists, stable keys keep items reused.
3. What is the significance of the `key` prop in lists, and what happens if it’s unstable?
   - Keys let React match list items between renders so it can reuse the correct DOM nodes.
     If keys are unstable (for example, index keys in a reordering list), React may recreate nodes,
     lose state, or apply props to the wrong item.
4. How does React batch updates, and what effect does that have on rendering?
   - React batches state updates that occur in the same event loop tick to produce a single render/commit.
     This reduces unnecessary renders and improves performance. In React 18, batching is automatic for more
     cases (timeouts, promises, native events), not just React events. Because updates apply together,
     use the functional setState form when the next state depends on the previous one.
5. In your own words, what is the difference between rendering and committing in React?
   - Render is when React runs component functions to produce a new element tree.
     Commit is when React applies those changes to the DOM and runs effects.

## Hooks - Q&A
1. Why do Hooks have to be called at the top level and in the same order on every render?
   - React tracks hook state by call position, not by name. If the order changes (because of conditionals
     or loops), React would read the wrong state/effect for a hook. Keeping hooks at the top level
     guarantees a stable call order so React can map each call to its stored state/effect.
2. What’s the difference between `useEffect` and `useLayoutEffect`, and when would you use each?
   - `useLayoutEffect` runs synchronously after DOM mutations but before paint, so it can block rendering.
     It’s used for layout measurements or DOM tweaks to avoid flicker. `useEffect` runs after paint,
     so it’s non-blocking and ideal for data fetching, subscriptions, and logging.
3. When would you use `useRef` instead of `useState`, and why?
   - `useRef` holds a mutable value that persists across renders without causing a re-render when it changes.
     Use it for DOM refs, timers/interval IDs, previous values, or instance-like variables. Use `useState`
     when changes should trigger a UI update.
4. How do you avoid stale closures in `useEffect` or event handlers?
   - Stale closures happen when an effect or handler captures outdated state/props. Avoid them by including
     all needed dependencies in `useEffect`, using functional state updates when new state depends on old
     state, and using `useRef` to hold the latest value when you need a stable handler.
5. What is a custom hook, and when should you create one?
   - A custom hook is a reusable function that calls React hooks to encapsulate stateful logic. Create one
     when multiple components need the same behavior (fetching, form handling, subscriptions) so you can
     share logic without duplicating code or coupling it to UI.

## Custom Hooks and Hook Rules - Q&A
1. What are the official Rules of Hooks, and why do they exist?
   - Call hooks only from React function components or custom hooks. Call them at the top level (not in
     loops, conditions, or nested functions). These rules exist because React tracks hook state by call
     order, so consistent ordering prevents bugs.
2. What are the benefits of custom hooks compared to higher-order components or render props?
   - Custom hooks share stateful logic without changing the component tree. Compared to HOCs/render props,
     they avoid wrapper nesting, reduce prop collisions, and compose more cleanly (multiple hooks in one
     component).
3. What should a custom hook return, and why is that design important?
   - A custom hook should return the state, derived values, and handlers needed by the component, usually
     as an object or array. This design matters because it defines the hook’s API: it should be stable,
     minimal, and easy to consume without leaking internal details.
4. What’s a common mistake when building custom hooks, and how do you avoid it?
   - A common mistake is hiding side effects or missing dependencies, which leads to stale data or extra
     re-renders. Avoid it by keeping effects explicit, listing all dependencies, and documenting the
     hook’s expected inputs/outputs.
5. How would you share async data-fetching logic across components with a custom hook?
   - Create a `useFetch`-style hook that takes inputs (URL, params), manages `loading`, `data`, and
     `error` with `useEffect`, handles cancellation, and returns `{ data, loading, error, refetch }`.

## Component Patterns - Q&A
1. What’s the difference between a controlled and an uncontrolled component?
   - A controlled component’s value is driven by React state (`value` + `onChange`), so React is the
     single source of truth. An uncontrolled component lets the DOM manage its own state and you read it
     via refs, which is simpler for basic forms but less flexible for live validation.
2. What is the container/presentational (smart/dumb) component pattern, and why use it?
   - Presentational components focus on UI and receive data/handlers via props. Container components
     manage state, data fetching, and business logic, then pass results down. This separation improves
     reuse, testability, and keeps UI components simpler.
3. What is composition in React, and why is it preferred over inheritance?
   - Composition means building UI by combining smaller components via props and children, rather than
     extending classes. It is preferred because it is flexible, reusable, and avoids rigid inheritance
     chains. Examples include `props.children` and passing components/functions as props.
4. What problem does “prop drilling” describe, and when would you replace it with Context?
   - Prop drilling is passing data through many intermediate components that do not use it, just to reach
     a deep child. Replace it with Context when shared data is needed across many levels (theme, auth,
     locale) and prop chains become noisy. For highly dynamic or frequently changing data, global state
     solutions can reduce re-render issues.
5. When would you use render props, and what’s the downside compared to hooks?
   - Render props work when a component shares logic but the UI is highly variable, so the parent passes a
     render function. Downsides vs hooks include extra nesting, more verbose code, and harder debugging.

## Lifecycle and Rendering Behavior - Q&A
1. What does React Strict Mode do in development, and why might it seem like components render twice?
   - In development, Strict Mode intentionally double-invokes certain lifecycle paths (render and effects)
     to surface unsafe side effects and ensure cleanup logic is correct. This is dev-only and does not
     affect production builds.
2. When does `useEffect` run relative to render/commit, and what should go in the cleanup function?
   - `useEffect` runs after the commit/paint. The cleanup runs before the next effect execution and on
     unmount. Use cleanup for unsubscribing, clearing timers, aborting requests, and closing sockets.
3. Why can calling `setState` in render cause an infinite loop, and how do you avoid it?
   - Calling `setState` during render triggers another render, which calls `setState` again, causing an
     infinite loop. Avoid it by only updating state in event handlers, effects, or callbacks—not during
     render.
4. What happens if you update state based on previous state, and how should you write it?
   - Because React may batch updates, using the current state variable can be stale. When the new state
     depends on the previous one, use the functional form: `setCount(prev => prev + 1)`.
5. How does React decide whether to re-render a component, and how can you reduce unnecessary re-renders?
   - React re-renders when state changes, props change, or a parent re-renders. Reduce unnecessary
     re-renders by memoizing child components with `React.memo` and stabilizing props with `useMemo` and
     `useCallback` so object/function references do not change every render.

## Lists, Keys, Conditional Rendering, Forms - Q&A
1. Why should you avoid using array indexes as keys in dynamic lists?
   - Indexes are unstable when items are added, removed, or reordered, so React can mismatch items and
     preserve the wrong state. It is only safe to use index keys for static lists that never reorder or
     change.
2. What are the common ways to do conditional rendering in React?
   - Use ternary (`condition ? A : B`), 
   - `&&` for simple show/hide, 
   - early returns (return null/component), 
   - or a switch/mapping from status to UI.
3. What’s the difference between controlled inputs and uncontrolled inputs in React forms?
   - Controlled inputs use React state (`value` + `onChange`) as the single source of truth. Uncontrolled
     inputs let the DOM manage the value and you read it via refs—simpler for basic forms but less
     flexible for live validation.
4. How do you handle form validation in React (client-side), and where should validation logic live?
   - Do inline field validation for immediate feedback and a form-level check on submit. Keep rules in the
     form layer (or a shared schema like Yup/Zod) and pass validation results to fields for display.
     Always validate again on the server.
5. How do you handle form submission and prevent the default browser behavior in React?
   - Attach an `onSubmit` handler to the `<form>` and call `event.preventDefault()` to stop the page
     reload. Then read controlled state (or for uncontrolled forms, read values via refs/`FormData`) and
     run validation before submitting.

## Error Boundaries and Fallback UI - Q&A
1. What is an error boundary in React, and what kinds of errors does it catch?
   - An error boundary catches errors during rendering, in lifecycle methods, and in constructors of its
     child tree, then shows a fallback UI. It does not catch errors in event handlers, async code (fetch),
     or errors outside the React tree.
2. How do you implement an error boundary in React (class vs hooks)?
   - Error boundaries must be class components. Implement `static getDerivedStateFromError` to set fallback
     state and `componentDidCatch` to log/report. There is no native hook-based error boundary yet, so use
     a class wrapper or a library like `react-error-boundary`.
3. Where should you place error boundaries in an app (global vs local), and why?
   - Use a global boundary near the root to avoid a blank screen, and local boundaries around risky
     sections so a single widget failure does not take down the whole page.
4. What should a good fallback UI include, and what should it avoid?
   - A good fallback UI should explain the error in simple language, offer recovery (retry, reload, or
     navigate back), and optionally log/report. It should avoid technical stack traces or sensitive details
     for end users.
5. How do you reset an error boundary after a failure?
   - Two common approaches:
     1) Reset the error boundary’s internal state (via a retry action) so it re-renders its children.
     2) Change the `key` on the error boundary from the parent to force a remount and clear state.

## Suspense and Lazy Loading - Q&A
1. What problem does `React.lazy` solve, and how does it work with `Suspense`?
   - `React.lazy` enables code-splitting by loading components on demand (dynamic import). When a lazy
     component is loading, `Suspense` shows a fallback UI until the chunk is ready. Suspense can also
     coordinate other async rendering depending on setup/framework.
2. What are good candidates for lazy loading in a React app?
   - Route-level pages, heavy dashboards, charts, rich editors, rarely used modals, and admin-only screens
     are good candidates. Avoid lazy-loading tiny shared components where the overhead outweighs benefits.
3. What’s the difference between code-splitting at route level vs component level, and what tradeoffs do you consider?
   - Route-level code splitting (pages):
     - Loads an entire page only when the user navigates there.
     - Big initial bundle savings with minimal complexity.
     - Fewer Suspense boundaries and simpler UX.
   - Component-level code splitting (widgets inside a page):
     - Loads specific heavy components only when needed (charts, editors, modals).
     - More granular savings but more loading states and requests.
     - Can improve TTI on heavy pages but risks “spinner soup.”
   - Tradeoffs: UX (fewer loaders), network (more chunks/requests), caching behavior, and complexity.
4. What are potential pitfalls or UX issues with Suspense and lazy loading, and how do you mitigate them?
   - Pitfalls include too many loaders, layout shifts, delayed interactivity, and loading waterfalls.
     Mitigate by grouping lazy chunks at route level, prefetching likely routes, using skeletons with
     reserved space, and keeping critical UI eagerly loaded.
5. How do `Suspense` boundaries interact with error boundaries (i.e., loading vs error states)?
   - Suspense handles loading by catching a thrown promise and showing its fallback. Error boundaries
     handle errors by catching thrown errors and showing an error fallback. Use both so loading and error
     states are handled independently.