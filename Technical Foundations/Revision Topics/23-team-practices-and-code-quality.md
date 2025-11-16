## Team Practices & Code Quality

- [ ] Code review guidelines specific to React changes
- [ ] ADRs and documenting architectural decisions
- [ ] Storybook: component docs, composition, visual testing
- [ ] Design system alignment: tokens, theming, accessibility gates
- [ ] Tech debt management and refactor cadence

---

### Code reviews for React
Review for correctness, performance (unnecessary renders, unstable refs), accessibility, and API clarity. Prefer “why” over “what” in PR descriptions; include screenshots or Storybook links. Request tests where behavior is critical.

---

### ADRs and decision logs
Use Architecture Decision Records to capture context, alternatives, and consequences. Link ADRs in PRs and docs so future maintainers understand why a path was chosen.

---

### Storybook as source of truth
Document components with interactive stories, props tables, and a11y checks. Use composition (stories of stories) to showcase real usage. Integrate visual tests to catch regressions.

---

### Design system alignment
Centralize tokens, enforce theme usage, and add lint rules or code mods to prevent ad-hoc styles. Add accessibility gates (contrast, focus) to the contribution checklist.

---

### Tech debt process
Track debt with owners and severity. Time-box refactors each sprint, and bundle debt fixes with related feature work. Celebrate removals of legacy paths to reinforce the habit.


