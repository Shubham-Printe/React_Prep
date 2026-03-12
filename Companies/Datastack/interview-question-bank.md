# Interview Question Bank (Datastack — Senior React Developer)

Aligned to JD: React workflows (Flux/Redux), reusable components, state management, APIs, code quality, leadership.  
Answers are short and expandable.

---

## React & workflows

- **Why use Flux or Redux? When is Context API enough?**  
  Redux gives predictable state updates, middleware, DevTools, and scales when many parts of the app read/write shared state. Context is enough when you have a few values (theme, user, locale) that don’t change often and few consumers; otherwise Context can cause unnecessary re-renders and gets messy.

- **How do you design reusable components and front-end libraries for future use?**  
  Clear, minimal props (and a few variants if needed); composition via `children` or render props; avoid internal state that callers can’t control; document props and usage; keep them dumb where possible so they’re easy to test and reuse across projects.

- **What causes unnecessary re-renders in React? How do you optimize?**  
  Parent re-renders (children re-render by default), unstable props (inline objects/functions), and Context value changing every render. Optimize by: `React.memo` for expensive children, stable props via `useMemo`/`useCallback`, splitting Context by concern and memoizing provider value, and lifting state down so fewer components depend on changing data.

- **useMemo/useCallback: when to use and when not to?**  
  Use when: the computed value or function is passed to a memoized child, or used in a dependency array, and re-creating it each render causes real cost (extra renders or heavy computation). Don’t use everywhere—it adds mental load and can cause stale-closure bugs if deps are wrong. Measure first if unsure.

- **How do you structure a large React app (folder structure, patterns)?**  
  Feature-based folders (e.g. `features/orders`, `features/auth`) with components, hooks, and state per feature; shared `components/`, `hooks/`, `utils/`; clear entry points (e.g. `index` files). Keep routes and global state (e.g. Redux slices) aligned with features so ownership is obvious.

---

## State management

- **Redux vs MobX vs Context API: when and why would you choose each?**  
  **Context**: theme, locale, auth—simple, low churn. 
  **Redux**: complex shared state, need for middleware, time-travel, strict predictability. 
  **MobX**: more OO/observable style, less boilerplate than Redux; pick if the team prefers it. Choose by scale and team norms, not by default.

- **How do you ensure application data flows effectively with Redux/Context?**  
  Single source of truth (one store or clear Context split); unidirectional flow (dispatch/actions → reducer → state → UI); avoid duplicating server state in multiple places—prefer one layer (e.g. RTK Query/React Query) that components read from; keep side effects in thunks/middleware, not in components.

- **How do you handle async state and side effects (thunks, sagas, React Query)?**  
  **Thunks**: good default—async logic in action creators, dispatch when done. **Sagas**: when you need complex flows (cancelable, sequenced, or event-driven). **React Query**: when the main need is server cache, loading/error, refetch—often simpler than putting all server state in Redux. Use one primary pattern per app to avoid confusion.

---

## Integration & performance

- **How do you integrate front-end with back-end services and APIs? How do you ensure high performance?**  
  Use a clear client (fetch/axios) and a single place for API calls (services or React Query/RTK Query). Ensure high performance by: caching and invalidation, avoiding over-fetching (right fields, pagination), loading states and skeletons, and not blocking the UI on waterfalls—fetch in parallel or at route level where possible.

- **How do you handle API errors, retries, and loading states?**  
  Loading: show skeleton or spinner; keep previous data if refetching. Errors: catch per request, show user-friendly message, optionally retry (with backoff) or “Try again” button. Use AbortController for cancellation on unmount or new request. Centralize in a hook or data layer so components stay simple.

- **How do you approach performance profiling and optimization?**  
  Measure first: React DevTools Profiler (what re-renders, why), Chrome Performance (long tasks, layout thrash), Network (waterfalls, payload size). Then fix the biggest win: reduce re-renders (memo, Context split), code-split routes, virtualize long lists, optimize images. Re-measure to confirm.

---

## Code quality & leadership

- **How do you write clean, maintainable code and enforce coding standards?**  
  Consistent naming, small functions/components, single responsibility, and minimal duplication. Enforce via ESLint/Prettier, PR checklist, and short style/pattern docs. Refactor when adding features so debt doesn’t pile up.

- **How do you conduct code reviews? What do you look for?**  
  Correctness and edge cases, error handling, security (XSS, sensitive data), performance (unnecessary re-renders, heavy work in render), readability and naming, tests for critical paths. Give specific, constructive feedback and suggest a fix or link to a doc; separate must-fix from nice-to-have.

- **How do you provide technical leadership and guidance to other React developers?**  
  By doing clear code reviews, pairing on hard bugs, sharing patterns (e.g. hooks, state structure) in docs or chats, and leading by example (tests, accessibility, performance). Offer to own a small “React standards” doc or run a short knowledge-sharing session.

- **How do you define and enforce best practices for front-end development?**  
  Document patterns (folder structure, state, API usage) and decisions (ADRs). Enforce via lint rules, PR templates, and review focus. Revisit in retros when something keeps breaking or slowing the team down.

---

## Practical / coding

- **Build a custom hook (e.g. debounce, fetch, localStorage).**  
  **Debounce**: `useState` + `useEffect` that sets a timer; clear on unmount and when input changes; update state when timer fires. **Fetch**: `useState` for data/loading/error, `useEffect` to call API (with AbortController), return `{ data, loading, error, refetch }`. **localStorage**: `useState(initial)` that reads from localStorage; `useEffect` to sync on change and write to localStorage.

- **Explain event loop and async rendering.**  
  JS is single-threaded: the event loop runs the call stack, then processes microtasks (e.g. promise callbacks), then one macrotask (e.g. timer, I/O). So async work doesn’t block the thread. In React, `setState` from async code (e.g. after fetch) schedules an update; React batches updates and then re-renders, so the UI updates after the async work completes.

- **How do you test components that use async data or external APIs?**  
  Mock the data layer: mock fetch/axios or use MSW (Mock Service Worker) to return fixed responses. Test loading state (e.g. spinner), success state (data rendered), and error state (message shown). For hooks that fetch, test with `renderHook` and wait for state updates (e.g. `waitFor` in RTL). Never hit the real API in unit tests.
