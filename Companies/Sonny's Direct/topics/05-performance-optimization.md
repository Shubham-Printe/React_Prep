# Performance and Optimization
- Re-render causes and debugging
- Memoization: React.memo, useMemo, useCallback
- Code splitting and lazy loading
- Virtualization basics for large lists
- Bundle analysis and tree-shaking basics
- Web Vitals (LCP, CLS, INP) awareness

## Re-render causes and debugging - Q&A
1. What are the most common causes of unnecessary re-renders in React, and how do you confirm them using tooling (not guesses)?
   - **Common causes**:
     - Parent re-renders → children re-render by default (unless child is memoized and props are stable).
     - Unstable props: inline objects/arrays/functions passed as props create new references each render.
     - Context churn: provider `value={{...}}` created inline causes consumers to re-render.
     - Effects that trigger extra state updates: effect runs more than expected and calls `setState`.
   - **How to confirm (no guessing)**:
     - React DevTools **Profiler**: which components rendered, how often, and what triggered it.
     - React DevTools **Highlight updates**: visually spot frequent re-renders.
     - Quick debug helpers: `console.count('ComponentName render')` while iterating.

## Memoization: React.memo, useMemo, useCallback - Q&A
1. When should you use `React.memo`, and what’s a common situation where it doesn’t help (or can even make things worse)?
   - **When to use `React.memo`**:
     - When a component is expensive to render and it receives the same props across many parent re-renders.
     - It skips re-rendering when props haven’t changed (it uses a shallow props comparison by default).
   - **When it doesn’t help (or can hurt)**:
     - If props are unstable references (inline objects/arrays/functions), shallow compare sees them as “changed”
       every render, so `React.memo` can’t skip.
     - If the component is cheap to render, the extra comparisons/complexity can be wasted overhead.

2. What’s the difference between `useMemo` and `useCallback`, and what’s a common mistake people make when using them?
   - **`useMemo`**: memoizes a computed value and reuses it between renders until dependencies change.
   - **`useCallback`**: memoizes a function reference so it doesn’t look “new” on every render.
   - **Common mistakes**:
     - Using them everywhere without measuring (memoization has overhead).
     - Missing/incorrect dependencies → stale values and confusing bugs.
     - Expecting benefits without a reason (value isn’t expensive, or function/value isn’t used as a prop/dependency).

3. What’s a realistic scenario where using `useCallback` (or `useMemo`) is necessary to prevent re-renders, and what would you do if it still doesn’t fix the performance issue?
   - **Scenario**: a dashboard renders multiple expensive chart components. The parent re-renders often
     (filters, theme, live updates), and it passes computed chart data (arrays/objects) and handler
     functions (callbacks).
   - **Fix**:
     - Use `useMemo` for computed chart datasets so they don’t get recreated every render.
     - Use `useCallback` for handler functions so references stay stable.
     - Wrap chart components with `React.memo` so stable props actually skip re-renders.
   - **If it still doesn’t fix it**:
     - Use React DevTools **Profiler** to find the real hot spot.
     - Then consider splitting state, deferring/virtualizing heavy UI, reducing update frequency
       (throttle/debounce), or moving heavy computation to a Web Worker/backend.
