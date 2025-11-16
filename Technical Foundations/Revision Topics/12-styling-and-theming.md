## Styling & Theming

- [ ] CSS Modules, Tailwind CSS, CSS-in-JS (Emotion, styled-components) trade-offs
- [ ] Design tokens and theming systems; dark mode strategy
- [ ] Critical CSS and extraction; style scoping and leakage
- [ ] Animations/motion: Framer Motion, React Spring; performance considerations
- [ ] Layout techniques: Grid, Flexbox, container queries, subgrid

---

### Choosing a styling approach
- CSS Modules: simple, locally scoped classes, great for component isolation; relies on build tooling.
- Tailwind CSS: utility-first classes accelerate dev; ensures consistency with design tokens; risk of noisy markup if not disciplined.
- CSS-in-JS: dynamic theming, co-located styles; consider runtime cost and SSR extraction. Prefer libraries with zero/low runtime.

---

### Design tokens and theming
Centralize colors, spacing, typography as tokens. Implement theme layers (light/dark/high-contrast). Prefer CSS variables for runtime theme switching; hydrate initial theme early to avoid flashes.

---

### Critical CSS and scoping
Inline above-the-fold CSS to speed first paint. Avoid global leakage by scoping styles to components. With CSS-in-JS or Modules, ensure class name stability across SSR/CSR.

---

### Motion and performance
Animate transform and opacity for smooth 60fps; avoid layout-affecting properties. Use Framer Motion/React Spring for orchestration and accessibility (reduced motion). Throttle or disable complex animations on low-power devices.

---

### Modern layout techniques
Use CSS Grid for two-dimensional layouts and Flexbox for one-dimensional flow. Container queries enable components to adapt to their size, not just viewport. Subgrid helps align nested content consistently.


