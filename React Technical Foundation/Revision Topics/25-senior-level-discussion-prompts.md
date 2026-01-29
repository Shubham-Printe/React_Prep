## Senior-Level Discussion Prompts (Self-Check)

- [ ] Explain how you’d migrate a large app to RSC safely
- [ ] Propose a caching strategy across CDN, server, and client
- [ ] Design a form-heavy workflow with optimistic UX and robust validation
- [ ] Reduce INP issues in an interaction-heavy page
- [ ] Plan a microfrontend split with Module Federation and shared design system
- [ ] Define performance budgets and enforce them in CI
- [ ] Roll out a feature behind flags with canary and observability

---

### Migrating to RSC
Identify server-only candidates (pure data/view logic) and define clear boundaries with `use client` where interactivity is needed. Migrate route-by-route behind flags, measure bundle size and TTI improvements, and ensure stable APIs for shared components.

Talking points: boundary placement, data fetching consolidation, client state strategy, testing and monitoring plan.

---

### Multi-layer caching
CDN edge for static/ISR pages, origin cache for SSR responses with revalidation, and client cache (TanStack Query) for interactive views. Define cache keys that include tenant/locale/auth variants. Document invalidation flows, and use background revalidation to keep caches warm.

---

### Form-heavy workflow
Use controlled inputs where validation/masking is required, and RHF with schema resolvers for performance. Apply optimistic updates with rollback, guard against races with abort signals, and autosave drafts. Ensure a11y and error focus management.

---

### Reducing INP
Profile interactions to identify long tasks; move heavy work to workers, split updates with transitions, and defer non-critical re-renders with `useDeferredValue`. Avoid synchronous layout reads in hot paths and batch state updates.

---

### Microfrontends plan
Split by stable domain boundaries. Share a versioned design system and critical utilities. Use Module Federation with clear dependency contracts, set performance budgets per MFE, and ensure consistent routing/analytics.

---

### Performance budgets in CI
Set budgets for JS/CSS sizes, route TTI/LCP/INP, and error rates. Fail builds on regressions and provide actionable reports. Automate bundle analysis and lighthouse runs per PR.

---

### Feature rollout with flags
Guard new features behind flags, start with internal and small user cohorts, monitor vitals and error telemetry, then ramp up. Add kill switches for quick rollback and document the decision and outcomes.


