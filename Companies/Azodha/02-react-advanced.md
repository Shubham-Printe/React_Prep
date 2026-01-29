# React Advanced Concepts (Fast Track)

## 1. Rendering Behavior & Reconciliation
**The Core Loop:** Trigger -> Render -> Commit.

1.  **Render Phase (Computational):**
    - React calls your components.
    - Creates the Virtual DOM tree.
    - Diffs it against the previous tree (Reconciliation).
    - *Can be paused, aborted, or restarted by React (Concurrent Mode).*
2.  **Commit Phase (Side Effects):**
    - Applies changes to the actual DOM.
    - Runs `useLayoutEffect` then `useEffect`.
    - *Cannot be interrupted.*

**Reconciliation (The Diffing Algo):**
- **Type Check:** If `<div />` becomes `<span />`, React destroys the old tree and builds a new one. **State is lost.**
- **Keys:** Crucial for lists. If keys change, React treats it as a new component. If keys stay stable, React reuses the instance.
    - *Anti-pattern:* Using `index` as a key (bugs when reordering/deleting).

**Senior Q:** "Why not update the real DOM directly?"
*Answer:* Reading/writing to the DOM is slow (layout thrashing). The VDOM is a lightweight JS object, making the diff fast. We only touch the real DOM for necessary changes.

---

## 2. Hooks Deep Dive

### `useEffect` vs `useLayoutEffect`
- **`useEffect`**: Runs *after* paint. Good for data fetching, subscriptions. Non-blocking.
- **`useLayoutEffect`**: Runs *synchronously after DOM mutations but before paint*.
    - **Use Case:** Measuring DOM elements (e.g., tooltips, positioning) to avoid visual flickering.

### `useMemo` vs `useCallback`
- **`useMemo`**: Caches a *computed value*. 
    - `const expensiveValue = useMemo(() => compute(a, b), [a, b]);`
- **`useCallback`**: Caches a *function definition*.
    - `const handleClick = useCallback(() => doSomething(a), [a]);`
    - **Critical:** Only useful if passed as a prop to a `React.memo` component. If the child isn't memoized, `useCallback` does nothing but add overhead.

### Custom Hooks
- **Pattern:** Encapsulate logic, not UI.
- **Example:** `useWindowSize`, `useFetch`, `useForm`.
- **Rules:** Must start with "use", call other hooks at the top level (no loops/conditions).

---

## 3. React Concurrent Features (React 18+)
**Concept:** Rendering is no longer blocking. React can work on multiple versions of the UI at the same time.

- **`useTransition`**: Marks a state update as "low priority".
    - *Scenario:* User types in a search box. Input update is high priority (immediate). Filtering the list is low priority (can lag slightly).
    - `startTransition(() => { setQuery(input); });`
- **`useDeferredValue`**: Similar to debouncing a value, but integrated with React's render cycle.
    - `const deferredQuery = useDeferredValue(query);`

---

## 4. Performance Optimization
**1. Code Splitting (`React.lazy` + `Suspense`)**
- Load components only when needed (e.g., heavy Modals, Routes).

**2. `React.memo`**
- HOC that prevents re-render if props haven't changed.
- *Default:* Shallow comparison.
- *Custom:* Pass a comparison function as 2nd arg.

**3. Virtualization**
- Rendering a list of 10,000 items? Only render the 10 visible ones.
- Libraries: `react-window`, `react-virtualized`.

**4. Context API Pitfalls**
- Context is NOT a state manager; it's a dependency injection tool.
- **The Problem:** If Context value changes, *all* consumers re-render.
- **Fix:** Split context (StateContext vs DispatchContext) or use `useMemo` on the context value.

---

## 5. State Management Strategies
- **Server State:** TanStack Query (React Query) / SWR. Caching, deduping, background updates.
- **Client State:**
    - **Context + useReducer:** Simple apps.
    - **Redux Toolkit:** Complex, predictable flows.
    - **Zustand:** Minimalist, no provider wrapping hell.
    - **Recoil/Jotai:** Atomic updates (good for apps like Figma/Canva).






