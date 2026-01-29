## Accessibility (a11y)

- [ ] Semantics: roles, landmarks, headings, lists
- [ ] Keyboard navigation and focus management
- [ ] ARIA only when necessary; avoid div soup
- [ ] Color contrast, prefers-reduced-motion, dyslexia-friendly patterns
- [ ] Screen reader testing: NVDA/JAWS/VoiceOver basics
- [ ] Automated checks: axe, eslint-plugin-jsx-a11y, Storybook a11y

---

### Semantics first
Use native elements (button, nav, main, header, footer, ul/li) so assistive tech understands structure by default. Ensure heading levels are hierarchical and meaningful. Landmarks help with quick navigation.

---

### Keyboard and focus
All interactive elements must be focusable and operable via keyboard. Use visible focus indicators. Manage focus on dialogs, toasts, and route transitions (focus the main heading). Trap focus within modals and return it on close.

---

### ARIA judiciously
Prefer semantics over ARIA. When needed, use ARIA to supplement (e.g., `aria-expanded`, `aria-controls`, `aria-live`). Avoid incorrect roles that mislead screen readers.

---

### Visual considerations
Meet contrast ratios (WCAG AA at minimum). Respect `prefers-reduced-motion` to disable large animations. Provide sufficient spacing and readable typography.

---

### Testing
Do quick manual checks with VoiceOver/NVDA and keyboard. Add automated checks with axe and eslint-plugin-jsx-a11y. In Storybook, use the a11y panel to spot regressions.


