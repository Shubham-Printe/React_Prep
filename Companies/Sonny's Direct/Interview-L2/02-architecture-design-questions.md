# Architecture / System Design — Most Likely (Sonny’s / Quivio / Sonny’s Direct)

This file is your **primary practice list**. Each question is written in an interview-friendly structure:

- **Problem**: restate what you’re building
- **Approach**: what you would do (high level)
- **Key considerations**: edge cases, tradeoffs, failure handling

## Top 5 to prioritize
1. Scalable real-time operations dashboard (Q1)
2. Membership + billing “card-decline recovery” (Q2)
3. B2B ecommerce for parts/supplies (Q3)
4. Feature rollout + safe updates (Q7)
5. RBAC across many locations (Q9)

**============================================================**

## 1. Scalable Real-Time Operations Dashboard (Multi-site operators)

### Problem
Design a dashboard that aggregates data from multiple sources and supports real-time (or near real-time) updates across many locations.

### Approach
- Break the dashboard into **modular widgets** (charts, tables, KPIs) so each widget can load independently.
- Use an **API aggregation layer** (BFF/gateway) to normalize data.
  - Clarifying note: **BFF (Backend For Frontend)** = an endpoint tailored for the UI so the UI doesn’t call 10 services directly.
- Use a consistent **server-state** strategy (RTK Query / React Query) to handle caching, loading, and errors.
- Real-time updates (only if required):
  - **SSE** for “server → UI updates” streaming.
  - **WebSocket** if you also need two-way real-time signals (typing/presence/commands).
- Performance: memoization, virtualization for large lists/tables, lazy loading for heavy widgets.
- Use roles/permissions to control which users can see which widgets and data.

### Key considerations
- **Independent widget loading**: don’t block the whole page on one slow source.
- **Partial failure handling**: show fallback UI per widget.
- **Refresh strategy**: polling = UI asks every X seconds; push = server sends updates instantly.
- **Consistency**: define each metric once and use the same definition everywhere (e.g., what “conversion” means) so every site reports the same way.

**============================================================**

## 2. Membership + Billing “Card-Decline Recovery”

### Problem
Design a workflow to recover failed subscription payments (involuntary churn) with a good customer experience.

### Approach
- When a payment fails, immediately move the membership into a **grace period** and notify the customer (email/SMS).
- Send a **secure self-serve link** to update the payment method, then automatically retry the charge and restore the membership.
- Track outcomes: decline rate, recovery rate, time-to-recover, and retry success rate.
- Take the customer to the payment provider’s **secure card-update page** (instead of collecting card details in our UI).
  - Clarifying note: the provider returns a safe “payment token” to us, so we can retry charges without storing card numbers.

### Key considerations
- **Security**: no raw card handling; links must expire; log changes for audit.
- **Retry strategy**: balance recovery vs customer annoyance.
- **Clear membership states**: active → grace period → suspended/cancelled, with rules everyone agrees on.

**============================================================**

## 3. B2B Ecommerce for Parts/Supplies (Sonny’s Direct)

### Problem
Design an ecommerce experience for car wash operators to find and buy parts/supplies, with account-specific pricing and fulfillment realities.

### Approach
- Cover the core journey: browse/search catalog → product detail → cart → checkout → order status/history.
- Model the real B2B structure: one company account with multiple sites/locations, multiple users, and clear roles (e.g., buyer vs approver) so permissions and purchasing rules match how operators actually work.
- Enforce account-based pricing and entitlements (contracts/tiers decide what you can see and what you pay).
- Show availability and delivery estimates as “best effort”, and set expectations clearly.

### Key considerations
- **Operational edge cases**: backorders, partial shipments, returns, taxes.
- **Inventory accuracy**: treat stock/ETA as best-effort, be transparent, support refresh, and don’t over-promise.
- **Search quality**: support part numbers + synonyms, strong filters, and one-click reordering for repeat buys.

**============================================================**

## 4. Device Onboarding + Remote Monitoring (Equipment)

### Problem
Design how hardware devices register, report health, and are monitored remotely across many customer sites.

### Approach
- Give each device a unique identity, and securely attach it to the right customer and location during setup.
  - Clarifying note: **Provisioning** = securely pairing a device with the correct customer/site so it reports to the right place.
- Have the device send a simple “I’m alive” check-in plus health updates (errors, uptime, throughput).
  - Clarifying note: telemetry = these health/status signals coming from the device.
- Store last-known state in the cloud and raise alerts when something looks wrong (offline too long, error spikes).
- Provide a technician/operator view: current status, last check-in time, active alerts, and basic diagnostics.

### Key considerations
- **Unreliable connectivity**: assume dropouts, and design for reconnect/resume.
- **Clear offline UX**: show last-known state and clearly label when data is stale.
- **Alert quality**: avoid noisy alerts, dedupe repeats, and rate-limit.

**============================================================**

## 5. Offline-First Workflows for Field Technicians

### Problem
Design work orders/checklists/parts usage that works with poor connectivity and syncs later.

### Approach
- Keep a local copy of the technician’s work (work orders, checklist answers, parts used) so the app works without internet.
- Store offline data in a local database:
  - Web: **IndexedDB** (a built-in browser database for offline data)
  - Mobile: a local on-device DB
- When offline, queue changes; when the device is back online, sync automatically and show sync progress.
- Handle conflicts with simple versioning/timestamps; prompt the user when two edits can’t be merged safely.

### Key considerations
- **User trust**: always show offline/online status and whether changes are fully synced.
- **Conflict safety**: define the rules up front, and never silently overwrite someone’s work.
- **Device constraints**: storage limits, battery, and spotty connectivity.

**============================================================**

## 6. Telemetry → Analytics Dashboards (WashMetrix-like)

### Problem
Design a pipeline from equipment/transaction events to dashboards and KPIs across multiple sites and customers.

### Approach
- Capture events from devices and business systems, then normalize them into a consistent format.
- Store raw events (for debugging/audit) and processed/aggregated data (for fast dashboards).
- Compute KPIs on a schedule or near real-time, then serve them via dashboard APIs.
- Define each metric once (e.g., what “conversion” and “downtime” mean) so reporting is consistent across sites.
- Keep each customer’s data isolated.
  - Clarifying note: **Multi-tenant** = many customers share the same system, but their data must stay separated.

### Key considerations
- **Freshness**: decide what must be real-time vs hourly/daily.
- **Data quality**: handle missing, duplicate, late, or out-of-order events.
- **Scale/cost**: lots of sites means lots of events, so design for volume and cost.


**============================================================**

## 7. Feature Rollout + Safe Updates Across Customer Sites

### Problem
Roll out new features safely without breaking many customer sites at once.

### Approach
- Roll out behind feature flags, and ramp up gradually (internal → 1% → 10% → 50% → 100%).
- Monitor key health metrics during rollout, and keep a kill switch to disable quickly.

### Key considerations
- **Tradeoff**: more stages = safer but slower.
- **Safety signals**: define what “safe” means (error rate, latency, conversion).
- **Fast rollback**: ability to disable instantly, not “redeploy and pray”.


**============================================================**

## 8. Acquisition Integration Plan (Quivio + WashMetrix + others)

### Problem
Integrate systems from acquisitions without freezing feature delivery.

### Approach
- Start with the least disruptive wins: single login (identity) and consistent APIs between systems.
- Keep systems working together first, then migrate data in stages and consolidate overlapping features over time.

### Key considerations
- **Source of truth**: decide which system “owns” customers, sites, and memberships.
- **Migration risk**: staged migration, validation, and back-out plans.
- **Continuity**: keep critical customer workflows stable while consolidation happens.


**============================================================**

## 9. RBAC (Roles/Permissions) Across Many Locations

### Problem
Design permissions so different roles see/act on different data across multiple locations.

### Approach
- Define roles and map them to allowed actions (view, order, refund, manage users, etc.).
- Scope permissions to the right level (company-wide vs per-location).
- UI can hide actions, but the backend must enforce permissions every time.

### Key considerations
- **Auditability**: log permission changes and sensitive actions.
- **Complexity**: start with role-based rules; go more granular only if required.


**============================================================**

## 10. Performance Strategy for Huge Tables/Charts

### Problem
A dashboard is slow due to large tables/charts and frequent updates.

### Approach
- Start by measuring (React Profiler + browser performance tools), then fix the biggest bottlenecks first.
- Virtualize large tables/lists (render only what’s visible).
- Lazy-load heavy charts/widgets.
- Memoize expensive components and avoid unnecessary re-renders.
- Cache API results and avoid refetch loops; throttle real-time updates if needed.

### Key considerations
- **UX**: skeletons + reserved space to avoid layout shift.
- **Performance budget**: set targets (load time, interaction latency) and validate with real measurements.

**============================================================**

## 11. Complex Multi-Step Form

### Problem
Design a multi-step form with conditional fields, validation, and persistence.

### Approach
- Build step components under one “FormFlow” so navigation doesn’t lose data.
- Use a form library or central state so validation and submission are consistent across steps.
- Validate in two layers: fast client checks (required/format) and server checks (unique email, eligibility).
- Save drafts so refresh/close doesn’t wipe progress (localStorage/sessionStorage).

### Key considerations
- **No data loss** when moving between steps.
- **Clear errors**: show exactly what to fix, and focus the first invalid field.
- **Resume**: restore draft safely and handle stale drafts.


**============================================================**

## 12. Real-Time Chat Application

### Problem
Design a chat app with messages, typing indicators, and scalability.

### Approach
- Use WebSockets for two-way realtime messaging (messages + typing/presence).
- Paginate older messages (infinite scroll) and load the latest messages fast.
- Use optimistic UI when sending, then reconcile with server acknowledgement.

### Key considerations
- **Performance**: don’t re-render the full list; virtualize long histories.
- **Reconnect**: handle reconnect + dedupe so you don’t show duplicate messages.
- **Ordering**: handle ordering and “delivered” status cleanly.


**============================================================**

## 13. Offline-Capable App (General)

### Problem
App should work offline and sync later.

### Approach
- Cache the app shell so the UI loads even offline (service worker).
- Store key data and user actions locally (IndexedDB), then sync when online returns.
- Use a sync queue so actions aren’t lost.

### Key considerations
- **Conflict resolution**: versioning/timestamps, and a clear rule for “who wins”.
- **User feedback**: show offline status and sync progress so users trust the app.


**============================================================**

## 14. PWA (Progressive Web App)

### Problem
Design a fast, installable, reliable web app.

### Approach
- Use an App Shell + service worker caching so the app feels instant on repeat loads.
- Use code splitting/lazy loading so users download only what they need.
- Ensure HTTPS + correct web manifest for installability.

### Key considerations
- Push notifications only if they add real value.
- Plan update behavior (how users get the latest version) and offline fallbacks for key flows.


**============================================================**

## 15. Real-Time Collaborative Document Editor

### Problem
Multiple users edit the same document simultaneously.

### Approach
- WebSocket for real-time edits, plus presence (who’s online / cursors).
- Use a proven OT/CRDT approach for merging edits safely.
  - Clarifying note: OT/CRDT are well-known strategies to merge concurrent edits without losing changes.

### Key considerations
- Presence/cursors and permissions.
- Large doc performance (only render what’s needed, keep updates small).
- Version history / restore when needed.


**============================================================**

## 16. Media Streaming Platform (Video)

### Problem
Design video streaming that adapts to network conditions.

### Approach
- Use adaptive streaming (HLS/DASH) so video quality adjusts based on the user’s network.
- Use a CDN to deliver video chunks quickly and reliably.

### Key considerations
- Buffering UX, device/browser compatibility, and playback analytics.
- DRM if the content requires protection.
