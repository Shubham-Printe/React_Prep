# React Level 2 Interview Preparation (Coditas)

This document is organized **section-wise** for a clear mental map and complete coverage for Level 2 interviews.

---

## 1. React Fundamentals
### Virtual DOM & Reconciliation
- Virtual DOM = lightweight JS object copy of real DOM.
- React diffs old vs new Virtual DOM → minimal updates applied to real DOM.
- Keys are essential for reconciliation (bad keys can cause UI bugs).

### React Fiber
- React 16+ rewrite for incremental rendering.
- Enables pausing, resuming, interrupting rendering.
- Foundation for concurrent rendering.

---

## 2. Advanced React Features
### Code Splitting
- Break bundle into smaller chunks (via React.lazy, dynamic import, Webpack, Vite).
- Improves initial load performance.

### Lazy Loading
- Dynamically load components when needed.
```jsx
const Chart = React.lazy(() => import('./Chart'));
```

### Suspense
- Provides fallback UI while waiting for lazy-loaded components or data.
- Wraps loading boundaries, not limited to lazy components.

### Concurrent Rendering
- React can prioritize urgent vs non-urgent updates.
- Improves snappiness under heavy computation.

#### `useTransition`
- Marks updates as non-urgent (e.g., filtering lists).

#### `useDeferredValue`
- Defer a value to prevent lag.
- Similar effect to debounce, but native React scheduling.
- Feels similar to debounce but uses React’s built-in scheduling instead of timers

**Follow-up:**
- Debounce vs DeferredValue? → Debounce waits, deferred updates immediately but renders results later.
- Searching an API → don’t send 50 requests while typing	✅ Debounce
- Filtering a 5,000 item list in UI → want responsive typing	✅ useDeferredValue

---

## 3. React Memoization Techniques
- **React.memo:** Prevents re-render if props unchanged.
  if a parent re-renders but the memoized component’s props are the same, React skips re-rendering that component.

- **useCallback:** Memoizes function references.
  useCallback is not about avoiding function re-creation — it's about avoiding unnecessary re-renders caused by new function references. It matters when:
  - Passing functions to memoized children (React.memo)
  - Using functions in dependency arrays (e.g., useEffect, useMemo)
  - Preventing unnecessary re-renders caused by new function references

- **useMemo:** memoizes a computed value so it only recalculates when its dependencies change.
  - Use useMemo for expensive calculations or reference stability.
  - Memoization costs memory, especially for large objects. Small calculations? Skip useMemo.
  - Combine with React.memo when optimizing child re-renders.
- **useRef:** holds data that should survive renders but not cause UI changes
and is stable (same ref object every render)
  - a place for “stuff React should remember but not track visually”

---

## 4. React Must-Know Topics
### Portals
- Render children outside parent DOM hierarchy (modals, tooltips).
- Events still bubble through React tree.

### Error Boundaries
- Catch render/lifecycle errors in child tree.
- Provide fallback UI instead of crashing.
- Do not catch async/event handler errors.

#### Handling async/event errors
```jsx
async function fetchData() {
  try {
    const res = await fetch('/api');
    const data = await res.json();
    setState(data);
  } catch (e) {
    console.error("Async error:", e);
  }
}

<button onClick={() => {
  try {
    riskyOperation();
  } catch (e) {
    console.error("Event error:", e);
  }
}}>Click</button>
```

### Strict Mode
- Dev-only tool, highlights unsafe lifecycles & side effects.
- In React 18, double invokes renders/effects.
- No effect in production.

### Profiler & Performance
- DevTools Profiler → track renders, durations, reasons.
- Optimizations: `React.memo`, `useMemo`, `useCallback`, virtualization, code splitting, batching.

### React 19+ Awareness
- **useOptimistic:** handle optimistic UI updates.
- **Server Components:** fetch data on server, stream to client.
- **Form Actions:** new APIs to handle forms more declaratively.

---

## 5. Redux
### Principles
1. Single store (source of truth).
2. State is immutable (read-only).
3. Changes via pure reducers.

### Middleware
- Functions between dispatch & reducer.
- Async, logging, error handling.
- Example:
```js
const logger = store => next => action => {
  console.log("Dispatching", action);
  const result = next(action);
  console.log("Next state", store.getState());
  return result;
};
```

---

## 6. JavaScript & Frontend Core
### Event Delegation
- One parent listener handles multiple children via bubbling.
- React supports `onClick` (bubble) & `onClickCapture` (capture).

### Event Bubbling vs Capturing
- **Capturing:** Top → Down.
- **Bubbling:** Bottom → Up (default).

### Prototype vs Classes
- Classes are syntactic sugar over prototypes.
- `super` calls parent constructor/methods.
- Must call `super()` before using `this`.

### Deep vs Shallow Copy
- Shallow: only first-level copied.
- Deep: full independent clone (use `structuredClone`, `_.cloneDeep`).

### Debounce vs Throttle
- **Debounce:** Run after pause (search input).
- **Throttle:** Run at intervals (scroll/resize).

### Generators & Iterators
- **Iterator:** `.next()` → `{value, done}`.
- **Generator:** `function*` with `yield`, can pause/resume.
- Used in Redux-Saga.

### Browser APIs (for performance & UX)
- **Web Workers:** offload heavy tasks from main thread.
- **IntersectionObserver:** efficient infinite scrolling/lazy loading.
- **Storage APIs:** LocalStorage/SessionStorage/IndexedDB for persisting state.

---

## 7. Debugging Traps
### Batched State Updates
```js
setCount(count + 1);
setCount(count + 1);
setCount(count + 1); // Only +1

// ✅ Fix
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1); // +3
```

### useEffect Dependency Trap
```js
// ❌ Runs on every render
useEffect(() => { fetchData(query); });

// ✅ Runs only when query changes
useEffect(() => { fetchData(query); }, [query]);
```

---

## 8. Practical Coding
### Digital Clock
```jsx
function DigitalClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <h2>{time.toLocaleTimeString("en-US", {hour12:false})}</h2>;
}
```

### File/Image Upload with Preview
```jsx
function ImageUploader() {
  const [preview, setPreview] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  return (
    <>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" width="200" />}
    </>
  );
}
```

---

## 9. Testing Basics
- **Unit testing React components** with Jest + React Testing Library.
```jsx
import { render, screen } from "@testing-library/react";
import DigitalClock from "./DigitalClock";

test("renders clock", () => {
  render(<DigitalClock />);
  expect(screen.getByText(/:/)).toBeInTheDocument();
});
```
- Mocking fetch in async actions.
- Testing Redux reducers with pure functions.

---

## 10. System/Architecture Design (Frontend Angle)
- Example: Designing a dashboard with multiple widgets.
  - Use **Error Boundaries** per widget.
  - Code split widgets.
  - Use virtualization for large tables.
  - Cache API results (browser storage or SWR/RTK Query).
  - Consider Web Workers for heavy data transforms.

---

## ✅ Final Checklist
- [x] React Fundamentals (Virtual DOM, Fiber)
- [x] Advanced React (Code Splitting, Suspense, Concurrent)
- [x] Memoization (memo, useMemo, useCallback, useRef)
- [x] React Must-Know (Portals, Error Boundaries, Strict Mode, Profiler, React 19+ awareness)
- [x] Redux Principles & Middleware
- [x] JS Core (delegation, bubbling/capturing, classes/prototypes, deep/shallow, debounce/throttle, generators)
- [x] Browser APIs (Web Workers, IntersectionObserver, Storage)
- [x] Debugging Traps
- [x] Practical Coding (Clock, File Upload)
- [x] Testing Basics (RTL, mocking fetch, Redux reducer tests)
- [x] System/Architecture (dashboard design, widget isolation, caching, virtualization)

---

🚀 This final doc now covers **everything we discussed + missing gaps** → giving you a truly complete prep for Coditas Level 2 interviews.

