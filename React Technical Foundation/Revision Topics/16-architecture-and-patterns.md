## Architecture & Patterns

- [ ] Component patterns: compound components, control props, state reducer
- [ ] Render props and HOCs vs hooks; migration considerations
- [ ] Module boundaries and domain-driven segmentation
- [ ] Presentational vs container components; separation of concerns
- [ ] Event-driven architecture on the client; pub-sub, observable patterns
- [ ] Microfrontends: Module Federation, single-spa; shared deps strategy
- [ ] Clean architecture influences in frontend; layering and inversion
- [ ] Error and loading states normalization across the app

---

### Component patterns
Compound components expose a parent API with coordinated children (Tabs/Tab/Panel) using context. Control props let parents drive state (e.g., `isOpen`) while still allowing internal state as a default. State reducer patterns let consumers intercept and customize state transitions.

---

### Render props/HOCs vs hooks
Render props and HOCs enable reuse but can cause deep trees or wrapper hell. Hooks provide composition with less nesting. Migrate render-prop logic to hooks when possible; keep HOCs for concerns like memoized injectors or error boundaries.

---

### Module boundaries and domains
Organize by feature/domain rather than by technical layer. Encapsulate UI, state, and data access inside a feature module with a small public API. This reduces coupling and clarifies ownership.

---

### Presentational vs container
Separate presentational (pure UI) from containers (data/logic) when it improves testability and reuse. Don’t force the pattern if hooks make containers trivial.

---

### Event-driven client architecture
Use pub-sub or observable streams for decoupled cross-cutting events (notifications, analytics). Keep event schemas typed and documented. Avoid global event spaghetti by scoping buses per domain.

---

### Microfrontends
Module Federation enables shared dependencies and independently deployed fragments. Establish versioning and design system sharing. Balance autonomy with consistent UX and performance budgets.

---

### Clean architecture in the frontend
Adopt layers (domain, application, presentation) and dependency rules to isolate business logic. Invert dependencies via interfaces, making UI a plug-in to the core domain where appropriate.

---

### Normalized status handling
Define a common pattern for loading, error, and empty states across components. This improves consistency and reduces ad-hoc spinners and error toasts.


