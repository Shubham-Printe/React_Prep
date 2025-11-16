## Senior React Interview Checklist

How to use: Skim each section and tick off items you can confidently explain and implement. Prioritize gaps you find before the interview.

### Core React & Rendering
- [ ] Reconciliation algorithm: keys, diffing, when re-mount vs update
- [ ] Virtual DOM vs actual DOM; costs and benefits in modern React
- [ ] JSX compilation and how it maps to `createElement`/runtime
- [ ] Component lifecycle in function components via hooks
- [ ] StrictMode effects: double-invocation in dev, detection of side-effects
- [ ] Controlled vs uncontrolled components (inputs, forms)
- [ ] Lifting state up and state colocations principles
- [ ] Conditional rendering patterns and short-circuit pitfalls
- [ ] Lists: stable keys, index-as-key tradeoffs

### Hooks Deep Dive
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

### Performance & Scalability
- [ ] Renders vs commits; React Profiler usage and flamegraphs
- [ ] Avoiding unnecessary re-renders: memoization, referential stability
- [ ] `React.memo`, `memo` with props comparators; trade-offs
- [ ] Expensive computation hoisting, worker offloading
- [ ] Windowing/virtualization (react-window, react-virtual, react-virtualized)
- [ ] Code-splitting: `React.lazy`, `Suspense`, route- and component-level splits
- [ ] Bundle analysis: source maps, Webpack/ESBuild/Vite analyzers, budgets
- [ ] Tree-shaking: sideEffects, module format (ESM), dead code elimination
- [ ] Image performance: responsive, lazy-load, preloads; `next/image`
- [ ] Web Vitals: LCP, CLS, INP; hydration and interaction latency

### Error Handling & Reliability
- [ ] Error boundaries: catch render errors; limitations (not event handlers)
- [ ] Fallback UIs and retry UX with `Suspense` and boundaries
- [ ] Logging/monitoring: Sentry, OpenTelemetry, breadcrumbs
- [ ] Graceful degradation for network/service failures
- [ ] AbortController for fetch cancellation and race handling
- [ ] Robust retry policies: backoff, jitter, idempotence

### Data Fetching & State Synchronization
- [ ] Server cache vs client state: choosing where state lives
- [ ] TanStack Query (React Query): cache, invalidation, queries/mutations
- [ ] SWR patterns: stale-while-revalidate, focus/refetch, polling
- [ ] Optimistic updates, rollback, mutation deduping
- [ ] Pagination and infinite queries; cursor vs offset
- [ ] Subscriptions: WebSockets, SSE; reconciliation with client-cache
- [ ] GraphQL clients (Apollo, urql): cache policies, normalization, fragments
- [ ] REST best practices: ETags, conditional requests, 304s, content-negotiation
- [ ] Forms and mutations: revalidation strategies, race conditions

### State Management Strategy
- [ ] Local state vs context vs global store decision matrix
- [ ] Context API: performance pitfalls; splitting contexts and selectors
- [ ] Redux Toolkit: slices, RTK Query, immutability with Immer
- [ ] Alternatives: Zustand, Jotai, Recoil, Valtio; trade-offs and scaling
- [ ] State machines/statecharts (XState): clarity, effects, testing
- [ ] Event sourcing and CQRS concepts in the frontend

### React 18/19+ Features
- [ ] Concurrent rendering mental model; transitions and interruptibility
- [ ] Suspense for data fetching; streaming SSR and selective hydration
- [ ] Server Components (RSC): boundaries, client/server directives, constraints
- [ ] Actions and form actions (React 19): progressive enhancement, server mutations
- [ ] `use()` semantics and safe usage patterns
- [ ] Preloading APIs and resource hints integration
- [ ] React Compiler concepts: automatic memoization, constraints and limitations

### Routing & App Frameworks
- [ ] React Router v6+: nested routes, loaders/actions, data routers
- [ ] Next.js App Router: RSC-first model, layouts, loading/error templates
- [ ] Next.js data fetching primitives: `fetch` caching, revalidate, ISR
- [ ] Edge, Node runtimes; streaming, dynamic render, route handlers
- [ ] Metadata, sitemaps, robots; SEO and social cards
- [ ] Navigation performance: prefetching, route segment caching

### SSR, SSG, ISR, Hydration
- [ ] Trade-offs between SSR, SSG, ISR, CSR
- [ ] Hydration mismatches: common causes and debugging
- [ ] Partial/Selective hydration; out-of-order streaming
- [ ] Caching at multiple layers: CDN, edge, server, client
- [ ] Multi-tenant rendering and config loading

### Forms & Validation
- [ ] Controlled vs uncontrolled inputs; performance considerations
- [ ] React Hook Form vs Formik; resolver patterns (Yup/Zod)
- [ ] Field arrays, dynamic forms, and conditional validation
- [ ] File uploads: drag-and-drop, resumable, chunked, retries
- [ ] Debounce/throttle patterns for input and search
- [ ] Accessibility in forms: labels, descriptions, errors, focus

### Accessibility (a11y)
- [ ] Semantics: roles, landmarks, headings, lists
- [ ] Keyboard navigation and focus management
- [ ] ARIA only when necessary; avoid div soup
- [ ] Color contrast, prefers-reduced-motion, dyslexia-friendly patterns
- [ ] Screen reader testing: NVDA/JAWS/VoiceOver basics
- [ ] Automated checks: axe, eslint-plugin-jsx-a11y, Storybook a11y

### Styling & Theming
- [ ] CSS Modules, Tailwind CSS, CSS-in-JS (Emotion, styled-components) trade-offs
- [ ] Design tokens and theming systems; dark mode strategy
- [ ] Critical CSS and extraction; style scoping and leakage
- [ ] Animations/motion: Framer Motion, React Spring; performance considerations
- [ ] Layout techniques: Grid, Flexbox, container queries, subgrid

### TypeScript with React
- [ ] Typing props, children, refs, `forwardRef`, `memo`
- [ ] Generics for components and hooks; polymorphic components
- [ ] Context typing and discriminated unions for state
- [ ] Inference-friendly APIs; avoiding `any`, using `unknown`, `never`
- [ ] Utility types and pattern matching types (satisfies, as const)
- [ ] Ambient types and module augmentation pitfalls

### Testing Strategy
- [ ] Unit vs integration vs E2E balance
- [ ] React Testing Library: queries, accessibility-first tests
- [ ] Vitest/Jest configuration: TS, ESM, coverage, watch
- [ ] Mocking strategies: MSW for network, dependency isolation
- [ ] E2E: Playwright/Cypress; flake reduction and test isolation
- [ ] Contract tests for API and GraphQL schemas
- [ ] Visual regression testing and Storybook test runner

### Security
- [ ] XSS: sanitization, `dangerouslySetInnerHTML`, template injection
- [ ] CSRF and CORS; tokens and cookie settings (SameSite, Secure, HttpOnly)
- [ ] Auth flows: OAuth/OIDC, PKCE, refresh tokens, rotation
- [ ] Secret handling: env exposure, public vs server-only vars
- [ ] Dependency risks: SCA, supply-chain attacks, lockfiles, integrity
- [ ] Content Security Policy (CSP) and Trusted Types

### Architecture & Patterns
- [ ] Component patterns: compound components, control props, state reducer
- [ ] Render props and HOCs vs hooks; migration considerations
- [ ] Module boundaries and domain-driven segmentation
- [ ] Presentational vs container components; separation of concerns
- [ ] Event-driven architecture on the client; pub-sub, observable patterns
- [ ] Microfrontends: Module Federation, single-spa; shared deps strategy
- [ ] Clean architecture influences in frontend; layering and inversion
- [ ] Error and loading states normalization across the app

### Build Tools & Dev Experience
- [ ] Vite/ESBuild/Rollup/Webpack: configuration, dev/prod parity
- [ ] Babel/TS transpilation pipelines; JSX runtime, decorators, legacy flags
- [ ] Linting: ESLint React, hooks plugin; Prettier integration and conflicts
- [ ] Path aliases, module resolution, import boundaries
- [ ] Environment configs per env/stage; `process.env` vs runtime config
- [ ] Git hooks: Husky, lint-staged; pre-commit quality gates
- [ ] Monorepos: PNPM workspaces, Turborepo, Nx; shared UI packages

### Networking & APIs
- [ ] Fetch nuances: credentials, mode, cache, `keepalive`, streaming
- [ ] Axios vs native fetch; interceptors; cancellation; retries
- [ ] GraphQL best practices: persisted queries, @defer/@stream, fragments
- [ ] File and image handling: blobs, object URLs, memory considerations
- [ ] Offline-first/PWA: Service Worker, caching strategies, background sync

### Observability & Operations
- [ ] Runtime logging strategy and redaction of PII
- [ ] Metrics and tracing in the browser; correlation IDs
- [ ] Feature flags and config delivery; kill switches
- [ ] Error triage workflows and SLOs for frontend (INP, error rate)
- [ ] Release strategies: canary, phased rollouts, A/B testing
- [ ] Performance budgets and continuous monitoring

### SEO & Marketing Integrations
- [ ] Meta tags, structured data (JSON-LD), Open Graph/Twitter cards
- [ ] Sitemaps and robots; Next.js metadata API
- [ ] Analytics: consent, privacy, script loading impact
- [ ] Localization/internationalization: i18n libraries, routing, number/date

### Platform & Browser Knowledge
- [ ] Event loop, tasks vs microtasks; React scheduling implications
- [ ] Synthetic events vs native events; propagation and batching
- [ ] IntersectionObserver, ResizeObserver; virtualization triggers
- [ ] Storage: local/session storage, IndexedDB; quotas and eviction
- [ ] Web Workers/Worklets; OffscreenCanvas for heavy work

### Edge/Server Integration
- [ ] Node vs Edge constraints; APIs available; cold starts
- [ ] Streaming responses, cache headers, revalidation semantics
- [ ] File-based routing conventions and server actions (framework-specific)
- [ ] Upload/download performance and resilience at the edge

### Team Practices & Code Quality
- [ ] Code review guidelines specific to React changes
- [ ] ADRs and documenting architectural decisions
- [ ] Storybook: component docs, composition, visual testing
- [ ] Design system alignment: tokens, theming, accessibility gates
- [ ] Tech debt management and refactor cadence

### Common Pitfalls & Debugging
- [ ] Memory leaks: subscriptions, timers, event listeners; cleanup patterns
- [ ] Stale closures and how to detect/fix with ESLint and refs
- [ ] Hydration mismatch detection and root causes
- [ ] Debugging tools: React DevTools, Profiler, network panel, coverage
- [ ] Flaky tests triage and isolation strategies

### Senior-Level Discussion Prompts (Self-Check)
- [ ] Explain how you’d migrate a large app to RSC safely
- [ ] Propose a caching strategy across CDN, server, and client
- [ ] Design a form-heavy workflow with optimistic UX and robust validation
- [ ] Reduce INP issues in an interaction-heavy page
- [ ] Plan a microfrontend split with Module Federation and shared design system
- [ ] Define performance budgets and enforce them in CI
- [ ] Roll out a feature behind flags with canary and observability

---

If you can teach and whiteboard the above, and implement small prototypes for each, you’re well-prepared for a senior React interview.*** End Patch

