# Atlas Copco — Final Round: One-Day Prep (L2 / EM)

Use this the **night before** and **morning of** your final round. Everything you need in one place.

---

## 1. How to open (first 30 seconds)

- **Ask format:** “Before we begin, should I expect this round to be more **coding**, **React deep dive**, or **design/architecture**?”
- **Ask style:** “Do you prefer I **talk through** my approach first, or start coding and explain as I go?”

---

## 2. Your intro (60–90 sec) — say this

- “I’m Shubham. I have 4+ years specializing in **React + TypeScript** and modern frontend engineering.”
- “I lead frontend planning, implementation strategy, and reviews in a small team (3 devs) for a US client, **Hello Chapter**.”
- “When I joined, the project was at risk because a previous contractor failed to deliver. I helped **scope and deliver an MVP fast** so we could demo, retain the client, and then scale.”
- “I’m strongest at **scalable UI architecture**, debugging complex issues, and keeping performance healthy with a measurement-first approach.”
- “I’m also building backend fundamentals to reason end-to-end, but my core depth is React.”

**If they ask “why Atlas Copco?”**  
“This role aligns with my strengths in high-performance UIs and pushes me deeper into full-stack thinking in an industrial context.”

---

## 3. Your two stories (rehearse out loud, 7–10 min each)

### Story 1 — Contractor failure → MVP rescue

| Part | What to say |
|------|-------------|
| **Situation** | Project at risk; prior contractor failed; needed demo-ready MVP. |
| **Constraints** | Time pressure, uncertain requirements, coordination with backend + stakeholders. |
| **Your ownership** | Broke down MVP scope (must-ship vs can-wait), set component + routing patterns, quality bar (loading/error, maintainable structure). |
| **Tradeoffs** | Clarity and reusable patterns over one-off hacks; no premature optimization — profile when needed. |
| **Outcome** | MVP demo retained client; enabled long-term scale across multiple apps. |

**Rehearse answers to:**  
“How did you decide what to cut?” “How did you prevent tech debt?” “How did you collaborate with backend/design?”

---

### Story 2 — Context menu closes before click (debugging + event model)

| Part | What to say |
|------|-------------|
| **Symptom** | Right-click opens table context menu; click on option closes menu before click registers. |
| **Hypothesis** | Global “outside click to close” firing for clicks inside menu — capture vs bubble or earlier event (pointerdown/mousedown). |
| **Diagnosis** | Reproduced; logged sequence (contextmenu, pointerdown, click), event.target, containment; confirmed close at document unmounts before item handler runs. |
| **Root cause** | Capture → target → bubble; closing on document (capture) or on pointerdown unmounts menu before item handler. |
| **Fix** | Outside-click only when target truly outside (`ref.contains(target)`); use `click` (bubble) for close; avoid stopPropagation unless needed. |
| **Prevention** | Regression test / checklist; reused pattern for other popovers. |

---

## 4. React depth — one-page cheat

- **Fiber:** Breaks rendering into units so React can pause/resume, prioritize, keep UI responsive; enables concurrent features.
- **Render vs commit:** Render = compute next UI (can restart); Commit = apply to DOM (must be consistent).
- **Keys:** Define **identity**; stable keys prevent wrong reuse/unmount and preserve state.
- **Hooks:** Stale closures, dependency arrays; `useEffect` vs `useLayoutEffect`; avoid render loops.
- **Routing:** Nested routes + `<Outlet />`; guards via loader `redirect()` or `<ProtectedRoute />`; `errorElement` + `useRouteError()`; route-level `React.lazy` + Suspense; URL for filters/sort/pagination.
- **State:** Local vs global vs server; Context for small cross-tree; Redux/RTK for large; React Query–style for server state.
- **Forms:** Controlled vs uncontrolled; validation strategy; async submit; double-submit prevention; labels, `aria-invalid`, `aria-describedby`, `role="alert"`.
- **Bundling:** Bundle analyzer; lazy routes, dynamic imports, tree-shaking, drop heavy deps.

---

## 5. Coding — quick reference

**Process:** Clarify I/O and constraints → 2–3 examples (incl. edge case) → state approach + complexity → code → quick test.

**DSA (high yield):** Two Sum (Map), Valid Parentheses (stack), Longest Substring (sliding window), Merge Intervals (sort + merge), Binary Search (lo/hi).

**Frontend:** `debounce(fn, wait)` — clearTimeout + setTimeout; `throttle(fn, wait)` — lastTime, only run if `now - lastTime >= wait`. Form: controlled state, validate(), touched, isSubmitting, aria + role="alert".

*(Full code in `02-level2-coding-practice-ideal-answers.md`.)*

---

## 6. Questions to ask the EM (pick 3)

- What does success look like in the first 30/60/90 days?
- What are the biggest UI performance or reliability challenges today?
- How do you balance delivery speed vs long-term quality (quality gates)?
- How do engineers collaborate with product/design/embedded stakeholders?

---

## 7. Company one-liners (Atlas Copco)

- **What they do:** Industrial equipment + software for **monitoring, insights, maintenance, operator tools** — factories run safer, more reliably, more efficiently.
- **Where you fit:** React UI/HMI + Python APIs + device connectivity; you bring React depth and ramp on Python + protocols.
- **Industrial UI constraints:** Reliability (weak/offline networks), low-latency feel, safety/correctness, long-lived systems, security/audit.

---

## 8. Tonight / morning checklist

**Tonight (30–45 min)**  
- [ ] Read this doc once; rehearse **intro** and **Story 1** out loud.  
- [ ] Skim **Story 2** (context menu) and **React one-page cheat**.  
- [ ] Run through **one DSA** (e.g. Two Sum) and **debounce** on paper or editor.  
- [ ] Pick your **3 EM questions** and write them down.  
- [ ] Confirm time, link, and quiet space for tomorrow.

**Morning of (15–20 min)**  
- [ ] Re-read **opening questions** and **intro**.  
- [ ] Quick pass on **two stories** (bullets only).  
- [ ] Glance at **React cheat** and **coding quick ref**.  
- [ ] Breathe; you’re prepared.

Good luck — you’ve got this.
