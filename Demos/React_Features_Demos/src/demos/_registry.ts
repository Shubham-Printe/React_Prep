import { lazy } from 'react'
import type { LazyExoticComponent } from 'react'

export interface DemoMeta {
  slug: string
  title: string
  description: string
  explanation: string
  Component: LazyExoticComponent<() => JSX.Element>
}

export const demos: DemoMeta[] = [
  {
    slug: 'memoization',
    title: 'Memoization (React.memo/useMemo/useCallback)',
    description: 'Three parts: stabilize object props, cache an expensive sum, and stabilize handlers.',
    explanation:
      'A) Stabilize object identity: A memoized child receives a config object. With “Use useMemo for config” ON, re-rendering the parent does NOT re-create the object (no child re-render). Toggling theme/pageSize updates deps and re-renders the child. ' +
      '\n\n' +
      'B) Cache expensive sum: With “Use useMemo” ON, a derived sum computes only when numbers change. The “compute calls this render” counter stays at 0 on parent re-renders and increments only when the numbers array is modified.' +
      '\n\n' +
      'C) Stabilize handlers: With “Use useCallback” ON, a memoized child receives a stable onClick prop identity across parent re-renders, so React.memo skips re-renders unless something else changes.',
    Component: lazy(() => import('./01-memoization/MemoizationDemo')),
  },
  {
    slug: 'counter',
    title: 'State: Counter (useState)',
    description: 'A simple counter demonstrating local state updates and re-renders.',
    explanation:
      'Clicking the buttons updates component state with useState. Each setState triggers a re-render, and the new count is derived from the previous state safely using an updater function.',
    Component: lazy(() => import('./02-counter/Counter')),
  },
  {
    slug: 'effect-cleanup',
    title: 'Effect Cleanup (useEffect)',
    description: 'Mount/unmount behavior and cleanup with intervals.',
    explanation:
      'Starting the timer sets up an interval inside useEffect. Toggling off or unmounting runs the cleanup to clearInterval, preventing leaks or duplicate timers.',
    Component: lazy(() => import('./03-effect-cleanup/EffectCleanup')),
  },
  {
    slug: 'context',
    title: 'Context (Provider/Consumer)',
    description: 'Share state without prop drilling using React Context.',
    explanation:
      'The ThemeProvider puts a value on context so deeply nested children can read it with useContext. Toggling updates the provider value and all consumers re-render.',
    Component: lazy(() => import('./04-context/ContextDemo')),
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks',
    description: 'Two parts: usePrevious (last value) and useLocalStorage (persisted state).',
    explanation:
      'A) usePrevious: shows Current and Previous; Previous updates on the next render to the last value.' +
      '\n\n' +
      'B) useLocalStorageState: drives an input from localStorage-backed state and updates storage on change. Includes a “Clear storage key” button and a tip to inspect the key in DevTools.',
    Component: lazy(() => import('./05-custom-hooks/CustomHooksDemo')),
  },
  {
    slug: 'reducer',
    title: 'Reducer (useReducer)',
    description: 'State transitions via reducer actions.',
    explanation:
      'State changes are modeled as actions handled by a reducer. Dispatching actions makes updates predictable and testable, separate from rendering.',
    Component: lazy(() => import('./13-reducer/ReducerDemo')),
  },
  {
    slug: 'transitions',
    title: 'Transitions (useTransition)',
    description: 'Keep typing responsive while rendering large lists.',
    explanation:
      'Urgent updates (input value) render immediately. Non-urgent filtering runs in a transition, letting React keep the UI responsive and show a pending hint.',
    Component: lazy(() => import('./15-transitions/TransitionsDemo')),
  },
  {
    slug: 'refs-imperative-handle',
    title: 'Refs & useImperativeHandle',
    description: 'Expose an imperative API: focus, select, setValue, clear, disable/enable, measure.',
    explanation:
      'The input exposes an imperative API via useImperativeHandle: focus, select, setValue, clear, disable/enable, and measure (reads size). The parent triggers these actions without directly querying the DOM.',
    Component: lazy(() => import('./10-refs-imperative-handle/ImperativeHandleDemo')),
  },
  {
    slug: 'forms',
    title: 'Forms (controlled vs uncontrolled)',
    description: 'Side-by-side: controlled with validation vs uncontrolled with refs.',
    explanation:
      'A) Controlled: inputs use value + onChange; state drives UI and inline validation. Submit reads from state.' +
      '\n\n' +
      'B) Uncontrolled: inputs use defaultValue and refs; values live in the DOM and are read on submit. Typing does not re-render the component.',
    Component: lazy(() => import('./06-forms/FormsDemo')),
  },
  {
    slug: 'routing-patterns',
    title: 'Routing Patterns',
    description: 'Nested routes, params, search params, active links, guards, programmatic nav.',
    explanation:
      'This demo shows: nested routes and index routes; URL params with useParams; search params for filtering; NavLink active styling; programmatic navigation with useNavigate; and a simple protected route that checks a “Logged in” toggle to access settings.',
    Component: lazy(() => import('./07-routing-patterns/RouterPatternsDemo')),
  },
  {
    slug: 'debounce-vs-throttle',
    title: 'Debouncing vs Throttling',
    description: 'Three clear parts: Debounce input, Throttle input, Throttle scroll.',
    explanation:
      'A) Debounce (input): handler waits 500ms after you stop typing; shows the debounced value and call count.' +
      '\n\n' +
      'B) Throttle (input): handler runs at most once per 500ms while you keep typing; shows the throttled value and call count.' +
      '\n\n' +
      'C) Throttle (scroll): raw event count increments every scroll event, throttled count increments at most once per 200ms.',
    Component: lazy(() => import('./08-debounce-throttle/DebounceThrottleDemo')),
  },
  {
    slug: 'virtualization',
    title: 'Virtualization (react-window)',
    description: 'Side-by-side: virtualized list vs plain list with item count control.',
    explanation:
      'Virtualized list renders only visible rows (and recycles them) — DOM stays tiny. Plain list mounts every row at once. Toggle between modes and adjust item count to see DOM nodes and smoothness differ.',
    Component: lazy(() => import('./09-virtualization/VirtualizationDemo')),
  },
  {
    slug: 'error-boundary',
    title: 'Error Boundary',
    description: 'Non-caught cases and nested (guarded vs unguarded).',
    explanation:
      'A) Nested boundaries: Shared container with Guarded (inner boundary) and Unguarded (no inner boundary). Guarded errors are caught inside; Unguarded errors bubble to the outer boundary.' +
      '\n\n' +
      'B) Not caught: Event handler and async/promise errors do not trip boundaries; use try/catch, .catch(), or global handlers. Includes a local “crash render” to contrast what boundaries do catch.',
    Component: lazy(() => import('./11-error-boundary/ErrorBoundaryDemo')),
  },
  {
    slug: 'suspense-data',
    title: 'Suspense + Data Fetch (mock)',
    description: 'Split boundaries, preload, refetch, and error paths for mock data.',
    explanation:
      'Two independent boundaries: “User” and “Posts” suspend separately with their own fallbacks and error retries. Controls let you select user, set delay, toggle failures, Preload into a simple cache, and Refetch to bust cache. This shows how Suspense handles loading at the nearest boundary while the rest of the UI stays responsive.',
    Component: lazy(() => import('./12-suspense-data/SuspenseDataDemo')),
  },
  {
    slug: 'suspense-data-fetching',
    title: 'Suspense + Data Fetch (step 1)',
    description: 'Static profile data displayed without async behavior yet.',
    explanation:
      'Step 1 keeps it fully synchronous: the component just renders static name/email/designation. We will add a mocked async fetch + resource to suspend in the next step.',
    Component: lazy(() => import('./20-suspense-data-fetching/SuspenseDataFetchingDemo')),
  },
  {
    slug: 'code-splitting-suspense',
    title: 'Code Splitting + Suspense (baseline)',
    description: 'A baseline tabbed UI that eagerly loads heavy panels.',
    explanation:
      'Three tabs (Analytics, Gallery, Reports) each load heavy data at module scope. Even though only one tab renders at a time, all modules load up front. This is the baseline we will optimize with code splitting + Suspense.',
    Component: lazy(() => import('./19-code-splitting-suspense/CodeSplittingSuspenseDemo')),
  },
  {
    slug: 'portals',
    title: 'Portals (Modal)',
    description: 'Modal + tooltip rendered to body to escape clipping/stacking.',
    explanation:
      'A modal and a tooltip both render into document.body via createPortal. The modal includes backdrop and ESC to close. The tooltip is anchored inside a clipped container, but portaled to body so it isn’t cut off. This demonstrates how portals escape overflow and stacking contexts while preserving React events/state.',
    Component: lazy(() => import('./14-portals/PortalsDemo')),
  },
  {
    slug: 'profiler',
    title: 'React Profiler: Find unnecessary renders',
    description: 'Profile a slow list (baseline) and compare with an optimized version.',
    explanation:
      'Baseline: typing re-renders many rows; an expensive badge runs in every render; props are unstable (inline objects/functions), so React.memo can’t skip. In Profiler, expect long commits and many ItemRow renders.' +
      '\n\n' +
      'Optimized: React.memo for rows, stable props via useMemo/useCallback, and heavy work moved into useMemo. In Profiler, commits are shorter and most rows are skipped (gray in flame/ranked views).',
    Component: lazy(() => import('./17-profiler/ProfilerDemo')),
  },
  {
    slug: 'web-workers',
    title: 'Web Workers (Offload CPU work)',
    description: 'Compare main-thread vs worker for a heavy CPU task.',
    explanation:
      'Run a CPU-heavy calculation both on the main thread and in a Web Worker. Observe that the main-thread path janks typing/animation, while the worker keeps the UI responsive. The demo shows creation, messaging, cancellation, and timing for both paths.',
    Component: lazy(() => import('./18-workers/WebWorkersDemo')),
  },
  {
    slug: 'nested-routing',
    title: 'Nested Routing (Outlet + shared layout)',
    description: 'A focused demo showing how parent layout stays while child route changes.',
    explanation:
      'This demo shows a Users layout with a left sidebar that stays mounted. The right panel is the <Outlet /> area: it renders an index (“Select a user”) for /users and a details page for /users/:id.',
    Component: lazy(() => import('./21-nested-routing/NestedRoutingDemo')),
  },
]


