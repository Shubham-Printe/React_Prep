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
    description: 'Nested routes and URL params with React Router.',
    explanation:
      'Nested <Routes> render child routes inside a layout. useParams reads the :id segment. The parent stays mounted while the nested route swaps.',
    Component: lazy(() => import('./07-routing-patterns/RouterPatternsDemo')),
  },
  {
    slug: 'debounce-vs-throttle',
    title: 'Debouncing vs Throttling',
    description: 'Compare behaviors under rapid input and scroll.',
    explanation:
      'Debounce waits for a quiet period before invoking the handler; rapid changes coalesce into one call. Throttle runs at most once per interval during continuous events.',
    Component: lazy(() => import('./08-debounce-throttle/DebounceThrottleDemo')),
  },
  {
    slug: 'virtualization',
    title: 'Virtualization (react-window)',
    description: 'Render 10,000 items smoothly with windowing.',
    explanation:
      'Only the rows visible in the viewport are rendered; as you scroll, items are recycled. This limits DOM nodes and keeps scrolling smooth.',
    Component: lazy(() => import('./09-virtualization/VirtualizationDemo')),
  },
  {
    slug: 'refs-imperative-handle',
    title: 'Refs & useImperativeHandle',
    description: 'Expose imperative methods from child components.',
    explanation:
      'The child uses useImperativeHandle to expose focus/clear methods over a ref. The parent calls these methods without reaching into DOM details directly.',
    Component: lazy(() => import('./10-refs-imperative-handle/ImperativeHandleDemo')),
  },
  {
    slug: 'error-boundary',
    title: 'Error Boundary',
    description: 'Catch render errors and display a fallback UI.',
    explanation:
      'A class component with componentDidCatch/getDerivedStateFromError intercepts render errors in its subtree and shows a fallback, preventing the whole app from crashing.',
    Component: lazy(() => import('./11-error-boundary/ErrorBoundaryDemo')),
  },
  {
    slug: 'suspense-data',
    title: 'Suspense + Data Fetch (mock)',
    description: 'Suspend UI while awaiting a mock async resource.',
    explanation:
      'The resource throws a promise while loading, which Suspense catches to show a fallback. When the promise resolves, the component re-renders with data.',
    Component: lazy(() => import('./12-suspense-data/SuspenseDataDemo')),
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
    slug: 'portals',
    title: 'Portals (Modal)',
    description: 'Render children into document.body via portals.',
    explanation:
      'createPortal renders the modal outside the parent DOM hierarchy (into body) while preserving React ownership and events. Useful for overlays and popovers.',
    Component: lazy(() => import('./14-portals/PortalsDemo')),
  },
  {
    slug: 'transitions',
    title: 'Transitions (useTransition)',
    description: 'Keep typing responsive while rendering large lists.',
    explanation:
      'Urgent updates (input value) render immediately. Non-urgent filtering runs in a transition, letting React keep the UI responsive and show a pending hint.',
    Component: lazy(() => import('./15-transitions/TransitionsDemo')),
  },
]


