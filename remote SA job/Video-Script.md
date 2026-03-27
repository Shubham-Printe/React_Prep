# Founder walkthrough — script & screen directions

**Purpose:** Short product + engineering walkthrough for Chapter’s internal operations platform (**HUB**) and the supporting **client portal**, covering product context, frontend architecture, representative implementation, and the **primary technical challenge** (fair subcontractor economics via RFQ bidding).

**Suggested length:** 8–12 minutes (tighten by cutting optional sections marked *Optional*).

**Recording tips**

- Use **sanitized or demo data**; say so once at the start if needed.
- **Product-first:** record or assemble the UI walkthrough so cuts feel natural. Optionally record the IDE segment separately and intercut.
- Keep IDE font size **large**; collapse unrelated sidebars so file paths read clearly.

---

## Segment map

| # | Segment | ~Time |
|---|---------|--------|
| A | Opening | 0:30–0:45 |
| B | Product context (HUB + portal) | 1:30–2:30 |
| C | Frontend architecture | 1:30–2:00 |
| D | Representative code (IDE) | 2:00–3:30 |
| E | Significant challenge — bidding & fair distribution | 2:30–4:00 |
| F | Closing | 0:20–0:30 |

---

## A. Opening (~30–45 s)

### Script

Hi — I’m walking through **Chapter’s internal operations platform**, what we call **HUB**, and the **client portal** that pairs with it.

This is the build I’m most proud of because I owned the **frontend end-to-end**: how teams actually work in the product every day, how the app is structured technically, and the hardest systems problem we solved — which, honestly, wasn’t “React,” but **how we protect the company’s economics while keeping execution fast**.

I’ll cover **what the product does and for whom**, **how the frontend is put together**, **a few concrete implementation details in code**, and **the RFQ / bidding architecture** we introduced so subcontractor work is allocated fairly and auditable — with performance feedback tightening decisions over time.

### Screen

| When | Show |
|------|------|
| First sentence | **HUB** logged in: default landing or dashboard that feels “internal ops” (clean, professional). |
| “client portal” | If safe to show: **client portal** home or a representative page; if not, **one static slide** with “Client portal (customer-facing)” and Chapter logo — no sensitive URLs. |
| “end-to-end” / “frontend” | Brief mouse move through **sidebar** (modules visible) to hint breadth — no need to click every item. |

---

## B. Product context (~1:30–2:30)

### Script

At a high level, Chapter runs work from **early interest through delivery and payment**. **HUB** is the internal system teams use to operate that pipeline.

**Sales and growth:** leads move into structured work — proposals and the artifacts that let the company commit with confidence.

**Execution:** once projects are live, PM and design workflows keep scope, schedules, and collaboration from collapsing into ad-hoc messages.

**Money:** finance gets views that tie operations to **cash**: invoices, payables, project-level money stories — so leadership isn’t only looking backward at what happened.

The hard design constraint is **roles**. Sales, PM, design, finance, and back-office admins shouldn’t see one undifferentiated pile of features. They need **surfaces that match their job** and **permissions that match their authority**.

Separately, the **client portal** is the outward half: customers get a **controlled window** into status and collaboration — aligned with the same underlying truth as HUB, but **scoped** for a client — transparency without exposing internal chaos.

### Screen

| Beat | Show |
|------|------|
| “pipeline / internal” | **HUB** — navigate to an area that reads as “core ops”: e.g. **Projects** list (PM or combined view your org uses). |
| “Sales / proposals” | **Sales** area: **proposals listing** or a **sales project** overview (whatever is most visual and non-sensitive). |
| “Execution / PM” | **Project management** — open **one project**; show **Project Center** (tabs: high level) — establishes “this is where work lives.” |
| “Finance / money” | **Finance management** — **FM dashboard** or **project finance** view with charts/tables (sanitized numbers). |
| “roles / permissions” | **Optional 10 s:** switch user or mention verbally while showing **sidebar** items appearing relevant to role — only if you can demo without confusion. |
| “client portal” | **Client portal** — **one representative screen** (e.g. project status, documents, or messaging) OR slide if no safe demo. |

---

## C. Frontend architecture (~1:30–2:00)

### Script

Technically, HUB is a **React** single-page app in **TypeScript**, built with **Create React App** — so it’s a classic SPA, not a server-rendered framework.

**Routing** is **React Router v6**: public routes for login and recovery, and a **protected shell** for everything authenticated — sidebar, header, global loading.

**State:** **Redux Toolkit** for shared domain state; local component state where it belongs.

**UI:** **Material UI** as the main component system, with **Formik** and **Yup** for forms validation — the usual mature pattern for enterprise internal tools.

**Data:** **Axios** through a **single HTTP layer** with interceptors for auth and session edge cases — so features don’t each invent their own broken 401 handling.

Pages are **lazy-loaded** so we’re not shipping the whole product on first paint.

The **backend is a separate REST API**; this repository is frontend-only. Our job is to be a **disciplined client**: predictable fetches, consistent errors, and **permissions enforced at the route**, not just hidden in the menu.

### Screen

| Beat | Show |
|------|------|
| “React / SPA” | Stay on **HUB** — slow scroll or tab switch to show **snappy in-app navigation** (no full page reload). |
| “routing / protected” | **Optional:** **logout** or open **login** in an incognito window for 5 seconds, then back — only if it doesn’t waste time. |
| “Redux / stack” | **IDE** (prep for D): **project root** — `package.json` dependencies in view for 3 seconds *or* **one slide** listing stack (React 18, TS, CRA, Router v6, RTK, MUI, Formik/Yup, Axios). |

---

## D. Representative code (~2:00–3:30)

### Script

I’ll show a few places that represent *how* we build — not because the code is exotic, but because the **patterns** scale.

**First — routing and permissions.** We don’t sprinkle string paths through JSX. **Route paths are centralized**, and protected routes understand **module and permission** expectations. That keeps the URL bar and the sidebar aligned with what the user is actually allowed to do.

**Second — the HTTP spine.** Domain calls go through **one Axios instance**: auth headers, consistent error handling, and a deliberate policy for **401** — session recovery without every screen implementing a half-working redirect loop.

**Third — the bidding / RFQ slice of the product.** RFQs drive **who can bid**, **when bidding is open or closed**, **manual bid entry**, **accepting a winning bid**, and **rolling winners into purchase orders** — including signals when a bid sits **above or below budget**. That’s the implementation face of the business architecture I’ll talk about next.

### Screen — IDE sequence (show in order; ~30–45 s each)

| Step | File path (from repo root) | What to highlight (say while cursor rests here) |
|------|----------------------------|--------------------------------------------------|
| D1 | `src/routes/Paths.tsx` | Central path constants — “single source of truth for URLs.” |
| D2 | `src/routes/Index.routes.tsx` + `src/routes/ProtectedRoutes.tsx` | `ProtectedRoute` with `module_name` / `permissions` — “guard matches menu intent.” |
| D3 | `src/services/http.ts` | Axios instance + interceptors — “401 behavior in one place.” |
| D4 | `src/services/projectManagement/pmProjects.services.ts` | `submitManualBidService` — POST to `.../submit-bid` — “bid persisted through API contract.” |
| D5 | `src/pages/projectManagement/projects/projectDetails/DesktopView/ProjectCenterTab/ProjectCenterTabs/RfqsTab/Modals/ManualBidModal.tsx` | Confirm handler → `submitManualBidAction` — “ops can enter or correct a bid in UI.” |
| D6 | `src/pages/projectManagement/projects/projectDetails/DesktopView/ProjectCenterTab/ProjectCenterTabs/RfqsTab/Modals/AcceptBidModal.tsx` | `acceptBidAction` — “winner is an explicit action.” |
| D7 | `src/pages/projectManagement/projects/projectDetails/DesktopView/ProjectCenterTab/ProjectCenterTabs/RfqsTab/RfqDetails/components/rfqsFooterButton.tsx` | `handleBiddingOpenButton` / status payload — “bidding_open vs bidding_close as a controlled phase.” |
| D8 | `src/pages/projectManagement/projects/projectDetails/DesktopView/ProjectCenterTab/ProjectCenterTabs/PurchaseOrderTab/Modals/GenerateNewPurchaseOrder/Index.generateNewPurchaseOrder.tsx` | `handleGeneratePo` + `getBudgetTextStyle` — “selected bids → PO; bid vs budget visible.” |

*Optional short line:* “Redux actions for PM live under `src/redux/projectManagement/pmProjects/` — same pattern as other modules.”

### Screen — product (RFQ loop, ~45–60 s)

| Step | Show |
|------|------|
| R1 | HUB → **PM project** → **Project Center** → **RFQs** tab. |
| R2 | Open **one RFQ** — attachments / scope visible (blur if sensitive). |
| R3 | **Subcontractor list** / bid amounts if present; **open vs closed** bidding state if visible in UI. |
| R4 | **Optional:** open **Generate PO** flow showing **selected bids** — don’t complete if it triggers real side effects. |

---

## E. Significant technical challenge — fair subcontractor distribution (~2:30–4:00)

### Script

If I had to name the **single hardest problem**, it wasn’t React. It was **architecture for fair contract distribution**.

Project managers naturally build a roster of subcontractors they trust. That’s human — but when that becomes **default routing** without comparison, the company pays for it: **less competitive pricing**, **missed quality**, **margin bleed** that’s hard to see until finance asks hard questions.

Policy memos don’t fix incentives. We needed a **system**.

We introduced a **bidding model on RFQs**.

**Scope first:** Work is packaged so bidders see the same job — same attachments, same expectations — before money is discussed.

**A real market window:** Bidding **opens and closes** as a defined phase. Everyone plays by the same clock.

**Comparable offers:** Subcontractors **submit bids**; we support the paths the business actually needs — including **manual bid** entry when reality doesn’t fit a perfect self-serve flow.

**A clear winner:** Acceptance is **explicit** — not a preference buried in email.

**Operational commitment:** Winning bids feed **purchase order generation**, so the decision becomes what the company **executes and pays against** — with visibility when a bid is **above or below budget**.

That’s **process and economics**, encoded in product.

The next layer — and we’re intentionally building toward it — is **ratings and performance memory** from completed work. Over time, selection isn’t only “lowest bid,” but **conscious tradeoffs** on price, delivery, and track record — so fairness doesn’t mean naive.

### Screen

| Beat | Show |
|------|------|
| “PM roster / defaults” | **Optional metaphor screen:** **Back office → Subcontractors** list or **PM project vendor** context — don’t overclaim; it’s visual grounding. |
| “RFQ / scope” | **RFQ detail** — description, **attachments**, **subcontractor** invitations. |
| “open / close” | **Footer or controls** where bidding is opened/closed, or status badge `bidding_open` / `bidding_close`. |
| “bids / winner” | **Bid amounts** in list; **Accept bid** modal or post-accept state. |
| “PO / budget” | **Generate PO** modal — **selected bids**; **green/red** (or similar) **budget vs bid** treatment if visible. |
| “ratings / future” | **Slide or honest VO:** “Post-job ratings feed future selection” — use **UI** only if a ratings surface exists in your branch; if not, **don’t fake it**. |

---

## F. Closing (~20–30 s)

### Script

That’s Chapter **HUB** and the **client portal** in one thread: **role-scoped operations software** on a **disciplined React frontend**, with the deepest problem being **vendor economics** — solved with **RFQs, phased bidding, explicit awards, and PO-backed execution** — and **performance data** making the next decision smarter.

I’m sharing the recording link by **30 March 2026**, and I can **expedite** if you’d like it sooner.

Thanks for watching.

### Screen

| When | Show |
|------|------|
| Final thanks | **HUB** dashboard or **Chapter logo** slide; fade out. |

---

## Appendix — quick reference (files mentioned)

| Topic | Path |
|-------|------|
| Paths | `src/routes/Paths.tsx` |
| Routes / protection | `src/routes/Index.routes.tsx`, `src/routes/ProtectedRoutes.tsx` |
| HTTP client | `src/services/http.ts` |
| Bid API | `src/services/projectManagement/pmProjects.services.ts` (`submitManualBidService`) |
| Manual bid UI | `.../RfqsTab/Modals/ManualBidModal.tsx` |
| Accept bid UI | `.../RfqsTab/Modals/AcceptBidModal.tsx` |
| Bidding open/close | `.../RfqsTab/RfqDetails/components/rfqsFooterButton.tsx` |
| PO from bids | `.../PurchaseOrderTab/Modals/GenerateNewPurchaseOrder/Index.generateNewPurchaseOrder.tsx` |

---

## Appendix — honesty checklist

- Say **“I led / owned frontend end-to-end”** only if accurate; otherwise **“primary frontend ownership”** or **“core contributor across architecture and delivery.”**  
- **Ratings:** present as **roadmap** or **shipping feature** according to what’s true in production.  
- **Client portal:** if not demoable, **one slide** is better than guessing URLs on camera.

---

*Last updated for founder walkthrough commitment (product + architecture + RFQ bidding narrative).*
