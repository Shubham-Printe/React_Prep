# Founder walkthrough — script & screen directions

**Purpose:** Short product + engineering walkthrough for Chapter’s internal operations platform (**HUB**) and the supporting **client portal** and **sub-portal**, covering product context, frontend architecture, representative implementation, and the broader business architecture that takes work from sales through execution, including the hardest downstream systems problem: fair subcontractor distribution.

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
| B | Product context (HUB + portals) | 1:30–2:30 |
| C | Frontend architecture | 1:30–2:00 |
| D | Representative code (IDE) | 2:00–3:30 |
| E | Business architecture + fair subcontractor distribution | 2:30–4:00 |
| F | Closing | 0:20–0:30 |

---

## A. Opening (~30–45 s)

### Screen

- Start on **HUB**, already logged in. Use a landing page or dashboard that feels clearly like an internal operations tool.
- When you mention the **client portal** and **sub-portal**, show one representative screen from each if it is safe to demo.
- If either portal is not safe to show, use one simple slide instead:
  `Client portal (customer-facing) / Sub-portal (subcontractor-facing)`
- When you say **“end-to-end”** or **“frontend”**, move briefly through the **sidebar** so the viewer can see the breadth of the system without opening every module.

### Voiceover

Hi — I’m walking through **Chapter’s internal operations platform**, what we call **HUB**, and the **client portal** and **sub-portal** that pair with it.

This is the build I’m most proud of because I owned the **frontend end-to-end**: how teams actually work in the product every day, how the app is structured technically, and how we built the system so work can move cleanly from **sales commitment** into **real operational execution**.

I’ll cover **what the product does and for whom**, **how the frontend is put together**, **a few concrete implementation details in code**, and how the product carries a project from **proposal ready for signature** into the downstream workflows that execution teams rely on.

---

## B. Product context (~1:30–2:30)

### Screen

- Start in **HUB** and move to an area that reads as core operations, like **Projects** or a sales/project overview.
- Show the **Sales** area or a **single project** where the proposal is clearly **ready for signature**.
- You do not need to open PM execution screens here. Just let the current project screen imply what comes next after signature.
- If useful, briefly show a lightweight financial summary or the proposal total.
- If it is easy and safe, hint at **roles and permissions** by briefly moving through sidebar items relevant to different functions.
- Show one **client portal** screen if safe.
- Show one **sub-portal** screen if safe.
- If either external surface is not safe to demo, use a clean slide instead.

### Voiceover

At a high level, Chapter runs work from **early interest through delivery and payment**. **HUB** is the internal system teams use to operate that pipeline.

**Sales and growth:** leads move into structured work — proposals and the artifacts that let the company commit with confidence.

**Execution:** once projects are signed and live, PM and design workflows keep scope, schedules, and collaboration from collapsing into ad-hoc messages.

**Money:** finance gets views that tie operations to **cash**: invoices, payables, project-level money stories — so leadership isn’t only looking backward at what happened.

The hard design constraint is **roles**. Sales, PM, design, finance, and back-office admins shouldn’t see one undifferentiated pile of features. They need **surfaces that match their job** and **permissions that match their authority**.

Separately, the **client portal** is the outward half for customers: a **controlled window** into status and collaboration — aligned with the same underlying truth as HUB, but **scoped** for a client — transparency without exposing internal chaos.

And the **sub-portal** matters just as much on the subcontractor side: it gives external execution partners a structured surface for the parts of the workflow they need to participate in — especially around scope, RFQs, bidding, and follow-through — without dropping them into internal-only operations views.

---

## C. Frontend architecture (~1:30–2:00)

### Screen

- Stay inside **HUB** and show quick in-app navigation so it is obvious this behaves like a SPA, not a sequence of full page loads.
- If it is easy, show the logged-in shell briefly: sidebar, header, and protected area.
- Optionally show the login screen for a few seconds only if it helps and does not interrupt the flow.
- Before the code section, show either the project root in the IDE or one simple stack slide with the main frontend technologies.

### Voiceover

Technically, HUB is a **React** single-page app in **TypeScript**, built with **Create React App** — so it’s a classic SPA, not a server-rendered framework.

**Routing** is **React Router v6**: public routes for login and recovery, and a **protected shell** for everything authenticated — sidebar, header, global loading.

**State:** **Redux Toolkit** for shared domain state; local component state where it belongs.

**UI:** **Material UI** as the main component system, with **Formik** and **Yup** for forms validation — the usual mature pattern for enterprise internal tools.

**Data:** **Axios** through a **single HTTP layer** with interceptors for auth and session edge cases — so features don’t each invent their own broken 401 handling.

Pages are **lazy-loaded** so we’re not shipping the whole product on first paint.

The **backend is a separate REST API**; this repository is frontend-only. Our job is to be a **disciplined client**: predictable fetches, consistent errors, and **permissions enforced at the route**, not just hidden in the menu.

---

## D. Representative code (~2:00–3:30)

### Screen

- In the IDE, open `src/routes/Paths.tsx` and pause on the central path constants.
- Then open `src/routes/Index.routes.tsx` and `src/routes/ProtectedRoutes.tsx` to show how protected routing and permissions are handled.
- Then open `src/services/http.ts` and rest briefly on the Axios setup and interceptors.
- Next, open the actual sales or proposal-related page from your branch that proves the **proposal-ready** flow is a real shipped surface.
- If helpful, show one shared form or detail component that demonstrates reuse or continuity across stages.
- Then cut back to the product:
  open **600 Third Avenue**, show the attached proposal or proposal summary, and rest on the **ready for signature** status.
- If it is safe, open the proposal PDF or approval view, but stop before any real action is triggered.

### Voiceover

I’ll show a few places that represent *how* we build — not because the code is exotic, but because the **patterns** scale.

**First — routing and permissions.** We don’t sprinkle string paths through JSX. **Route paths are centralized**, and protected routes understand **module and permission** expectations. That keeps the URL bar and the sidebar aligned with what the user is actually allowed to do.

**Second — the HTTP spine.** Domain calls go through **one Axios instance**: auth headers, consistent error handling, and a deliberate policy for **401** — session recovery without every screen implementing a half-working redirect loop.

**Third — feature slices that map to real business stages.** Sales, projects, finance, and downstream execution each have their own surfaces, but they stay tied together through one project record. That’s why a proposal-ready project can later become an execution workflow instead of a dead-end document.

*Optional short line:* “The same structure repeats across modules, so sales-stage work and execution-stage work don’t drift into separate mini-apps.”

---

## E. Business architecture + fair subcontractor distribution (~2:30–4:00)

### Screen

- Stay on the project and proposal view long enough for the **ready for signature** state to register clearly.
- Cut to one **client portal** page, or use a slide if that is safer.
- Cut to one **sub-portal** page, or use a slide if that is safer.
- Return to **HUB** for the final point about continuity across the lifecycle.
- Then move into the downstream challenge:
  show a **subcontractors** list, a **PM vendor context**, or another safe screen that visually grounds the subcontractor workflow.
- Show one **RFQ detail** view with scope, attachments, or invited subcontractors.
- Show where bidding is **opened / closed** if that state is visible in the UI.
- Show bid amounts or an **accept bid** state / modal if safe.
- Show the **Generate PO** flow or any screen where selected bids and budget comparison are visible.
- If a ratings surface exists in your branch, show it briefly.
- If ratings are not demoable, use a simple slide instead:
  `Performance history feeds future subcontractor selection`

### Voiceover

What I want to emphasize here is that the product isn’t a collection of disconnected screens. It’s one operating system for the business.

The part I’m showing in this recording stops at a project with a **proposal ready for signature**. That moment matters because it’s the bridge between sales work and everything that follows operationally.

In good internal software, that signature-ready proposal isn’t a dead-end PDF. It becomes the starting point for PM ownership, execution planning, finance visibility, and external communication.

That’s where HUB, the client portal, and the sub-portal fit together.

**HUB** is where internal teams structure the deal, prepare the proposal, and move the job toward commitment.

The **client portal** is where the customer sees a clean, controlled version of that same truth.

And the **sub-portal** becomes relevant once subcontractors need a defined place to participate in the downstream execution workflow.

So even though this demo stops at proposal readiness, the point is that the frontend was designed to support the entire lifecycle rather than a one-off sales tool.

That continuity is the real architectural point: one project record, multiple role-specific surfaces, and a workflow that stays coherent from pre-sale through delivery.

If I had to name the **single hardest problem**, though, it wasn’t React. It was **architecture for fair contract distribution**.

Project managers naturally build a roster of subcontractors they trust. That’s human. But when that becomes **default routing** without comparison, the company pays for it: **less competitive pricing**, **missed quality**, and **margin bleed** that only becomes obvious later.

Policy memos don’t fix incentives. We needed a **system**.

We introduced a **bidding model on RFQs**.

**Scope first:** work is packaged so bidders see the same job, the same attachments, and the same expectations before money is discussed.

**A real market window:** bidding **opens and closes** as a defined phase, so everyone plays by the same clock.

**Comparable offers:** subcontractors **submit bids**, and we support the paths the business actually needs, including **manual bid entry** when reality doesn’t fit a perfect self-serve flow.

**A clear winner:** acceptance is **explicit**, not a preference buried in email.

**Operational commitment:** winning bids feed **purchase order generation**, so the decision becomes what the company actually **executes and pays against**, with visibility when a bid is **above or below budget**.

That’s **process and economics**, encoded in product.

The next layer, and what we’re intentionally building toward, is **ratings and performance memory** from completed work. Over time, selection isn’t only “lowest bid,” but **conscious tradeoffs** on price, delivery, and track record, so fairness doesn’t mean naive.

---

## F. Closing (~20–30 s)

### Screen

- End on the **HUB** dashboard or a clean **Chapter** logo slide.
- Hold for a beat and fade out.

### Voiceover

That’s Chapter **HUB**, the **client portal**, and the **sub-portal** in one thread: **role-scoped operations software** on a **disciplined React frontend** that carries work from **sales commitment** into the rest of operations without breaking the project narrative across teams, including the harder economic problem of **fair subcontractor distribution**.

I’m sharing the recording link by **30 March 2026**, and I can **expedite** if you’d like it sooner.

Thanks for watching.

---

## Appendix — quick reference (files mentioned)

| Topic | Path |
|-------|------|
| Paths | `src/routes/Paths.tsx` |
| Routes / protection | `src/routes/Index.routes.tsx`, `src/routes/ProtectedRoutes.tsx` |
| HTTP client | `src/services/http.ts` |
| Proposal-ready surface | Use the actual sales / proposal page from your branch that shows the project and signature-ready proposal |
| Shared form or detail surface | Optional: one real component that shows validation, composition, or project continuity across stages |

---

## Appendix — honesty checklist

- Say **“I led / owned frontend end-to-end”** only if accurate; otherwise **“primary frontend ownership”** or **“core contributor across architecture and delivery.”**  
- **Client portal:** if not demoable, **one slide** is better than guessing URLs on camera.
- **Sub-portal:** if not demoable, **one slide** is better than guessing URLs or overstating the exact subcontractor flow on camera.

---

*Last updated for founder walkthrough commitment (product + architecture + proposal-to-execution narrative).*
