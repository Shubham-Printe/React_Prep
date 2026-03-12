# Level 2 Round — Prep (Atlas Copco — Full-Stack Web Developer, EM Round)

This guide is for **Level 2** with an **Engineering Manager** (format not specified).

Atlas Copco focus (from L1): **React depth** (routing, state, forms, bundling, React Fiber), plus **coding/DSA** and strong engineering judgment.

---

## How to open the round (30 seconds)

Ask for format (shows maturity, reduces surprises):

- “Before we begin, should I expect this round to be more **coding**, **React deep dive**, or **design/architecture discussion**?”
- “Do you prefer I **talk through** my approach first, or start coding and explain as I go?”

---

## Your Level 2 intro (60–90 seconds)

Use this as your default:

- “I’m Shubham. I have 4+ years specializing in **React + TypeScript** and modern frontend engineering.”
- “I lead frontend planning, implementation strategy, and reviews in a small team (3 devs) for a US client, **Hello Chapter**.”
- “When I joined, the project was at risk because a previous contractor failed to deliver. I helped **scope and deliver an MVP fast** so we could demo, retain the client, and then scale.”
- “I’m strongest at building **scalable UI architecture**, debugging complex issues, and keeping performance healthy using a measurement-first approach.”
- “I’m also actively building backend fundamentals to reason end-to-end, but my core depth is React.”

If they ask “why Atlas Copco?”:
- “This role aligns with my strengths in high-performance UIs, and it pushes me deeper into full-stack thinking in an industrial context.”

---

## Your 2 core deep-dive stories (7–10 min each)

### Story 1 — Contractor failure → MVP rescue (delivery + judgment)

#### Situation
- Project at risk; prior contractor failed; needed a demo-ready MVP.

#### Constraints
- time pressure
- uncertain requirements
- coordination across backend + stakeholders

#### Your ownership
- broke down MVP scope (what must ship vs what can wait)
- established component patterns + routing approach to move fast without chaos
- set quality bar: loading/error states, maintainable structure

#### Design/tradeoffs (talk like an EM expects)
- choose clarity and reusable patterns over “one-off hacks”
- avoid premature optimization; profile when needed

#### Outcome
- MVP demo retained client and enabled long-term scale across multiple apps.

#### EM follow-ups to rehearse
- “How did you decide what to cut?”
- “How did you prevent tech debt from exploding?”
- “How did you collaborate with backend/design?”

---

### Story 2 — Context menu closes before click registers (debugging + JS event model)

#### Symptom
- Right click opens a table context menu.
- When user tries to click an option, the menu closes before the click registers.

#### Hypothesis (what you suspected)
- A global “outside click to close” handler was firing even for clicks inside the menu.
- Likely due to **event propagation order** (capture vs bubble) or using an earlier event (`pointerdown/mousedown`) that runs before the menu item handler.

#### Diagnosis approach (what you did)
- Reproduced consistently: open menu → try click → closes.
- Instrumented event flow:
  - logged the sequence (`contextmenu`, `pointerdown/mousedown`, `click`)
  - logged `event.target` and whether it’s inside the menu container
- Confirmed root cause:
  - the click was being handled at `document` (often capture/early event),
  - which triggered close/unmount before the menu option handler could run.

#### Root cause explanation (say it cleanly)
- DOM events travel **capture → target → bubble**.
- If you close on `document` during **capture**, or on `pointerdown/mousedown`, you can unmount the menu before the menu item’s handler runs.

#### Fix (multiple valid options; state what you chose)
- Make outside-click logic correct:
  - only close when the click target is truly outside the menu container (`ref.contains(target)`)
  - if portals/shadow DOM are involved, use `event.composedPath()` for robust containment
- Prefer `click` (bubble) for outside-close unless you have a specific reason to use earlier events.
- Avoid “stopPropagation everywhere” unless necessary (it can create side-effects).

#### Prevention
- Added a regression test (or a repeatable manual repro checklist):
  - open menu → click item → action fires → menu closes after action
- Reused the fixed outside-click pattern for other popovers/menus.

#### Why this story is perfect for Atlas Copco L2
- Shows deep understanding of “simple” UI bugs.
- Demonstrates a disciplined debugging loop: repro → instrument → isolate → fix → prevent.

---

## Backup story (optional)

### Legacy table headers not resizable (td vs th)

- Found `<td>` used instead of `<th>` across many tables.
- Instead of rewriting hundreds of tables, adjusted the library behavior to handle the legacy structure.
- Saved days and reduced risk.

Use this if they ask about pragmatic decision-making in legacy codebases.

---

## React depth topics (Atlas Copco emphasis)

### React Fiber (60-second explanation)
- Fiber is React’s internal architecture that breaks rendering into units so React can **pause/resume work**, **prioritize updates**, and keep the UI responsive.
- It enables scheduling and concurrent features; it’s why React can avoid blocking the main thread on large renders.

### Render vs Commit (common probe)
- **Render phase**: compute next UI (can be restarted).
- **Commit phase**: apply changes to DOM (must be consistent).

### Keys (must be crisp)
- Keys define **identity**, not uniqueness.
- Stable keys prevent wrong reuse/unmounts and preserve state correctly.

### Hooks correctness
- stale closures and dependency arrays
- `useEffect` vs `useLayoutEffect`
- avoiding render loops and heavy derived state

### Routing (what to emphasize)
- **Nested routes + layouts (React Router v6+)**
  - Use a layout route that renders shared UI (nav/shell) + `<Outlet />` for children.
  - Keep route structure close to feature boundaries (reduces “god router” files).
  - **On-ground primitives**:
    - `<Routes>`, `<Route>`, `<Outlet />`
    - `createBrowserRouter()` + `<RouterProvider />` (data router)
    - Hooks: `useLocation()`, `useNavigate()`, `useParams()`, `useSearchParams()`

- **Route guards (auth/role gating)**
  - UI-level guard pattern: `<ProtectedRoute />` that either renders children or redirects.
  - Data-router guard pattern: use `loader` to check auth/role and `redirect()` early.
  - **On-ground primitives**:
    - `<Navigate to="/login" replace />`
    - `loader: async () => { if (!isAuthed) throw redirect("/login"); }`

- **Error boundaries per route**
  - If using data router: set `errorElement` per route and read errors via `useRouteError()`.
  - Keep errors local (a failing detail page shouldn’t crash the whole app).
  - **On-ground primitives**:
    - `errorElement: <RouteError />`
    - `useRouteError()`

- **Route-level code splitting**
  - Split by “page routes” first; lazy-load heavy screens (tables, dashboards).
  - In React Router data APIs, prefer route `lazy()` for clean route-based splitting.
  - **On-ground primitives**:
    - `React.lazy(() => import("./pages/InvoicesPage"))`
    - `<Suspense fallback={<Loading />}>…</Suspense>`
    - `lazy: async () => ({ Component: (await import("./pages/InvoicesPage")).default })`

- **Practical URL-state discipline**
  - Put filter/sort/pagination in the URL (`?page=&limit=&q=`) so refresh/back works.
  - Normalize/validate query params at the route boundary (same philosophy as backend).

### State management
- local UI state vs global state vs server state
- Context for small cross-tree state; Redux Toolkit for large/global; React Query-style caching for server state

### Forms
- controlled vs uncontrolled tradeoffs
- validation strategy, async submit, preventing double submit
- accessibility basics (labels, error messages, keyboard)

### Bundling/tools
- how you analyze bundles (bundle analyzer)
- common wins: lazy-loading routes, removing heavy deps, dynamic imports, tree-shaking

---

## Coding (mix of DSA + frontend tasks)

### How you’ll run the coding (your talk track)
- Clarify inputs/outputs and constraints.
- Write 2–3 examples (include edge case).
- State time/space complexity.
- Code, then test quickly.

### DSA (high-yield set)
- Two Sum (hashmap)
- Valid Parentheses (stack)
- Longest Substring Without Repeating (sliding window)
- Merge Intervals (sorting)
- Binary Search template

### Frontend coding (very relevant)
- Implement `debounce` and `throttle`
- Data transforms for UI (group/sort/filter)
- Small form with validation + error display

---

## EM-style questions to ask (pick 3)

- “What does success look like in the first 30/60/90 days?”
- “What are the biggest UI performance or reliability challenges today?”
- “How do you balance delivery speed vs long-term quality (what are the quality gates)?”
- “How do engineers collaborate with product/design/embedded stakeholders here?”

---

## 48-hour prep plan (practical)

### Day 1 (60–90 min)
- Rehearse Story 1 + Story 2 out loud (record once; tighten to 7–10 min each).
- Do 2 DSA problems + 1 debounce/throttle implementation.
- Review Fiber notes + keys + hooks pitfalls.

### Day 2 (60–90 min)
- Do 3 DSA problems + 1 UI/data-transform task.
- Mock Q&A: routing + state + forms tradeoffs.
- Prepare 3 EM questions and your closing.

