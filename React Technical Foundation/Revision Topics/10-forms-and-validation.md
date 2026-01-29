## Forms & Validation

- [ ] Controlled vs uncontrolled inputs; performance considerations
- [ ] React Hook Form vs Formik; resolver patterns (Yup/Zod)
- [ ] Field arrays, dynamic forms, and conditional validation
- [ ] File uploads: drag-and-drop, resumable, chunked, retries
- [ ] Debounce/throttle patterns for input and search
- [ ] Accessibility in forms: labels, descriptions, errors, focus

---

### Controlled vs uncontrolled
Controlled inputs keep the value in React state and update via `onChange`, which enables validation and masking but can re-render on every keystroke. Uncontrolled inputs use the DOM as the source of truth (`defaultValue`, refs) and can be more performant for large forms, with validation on submit or blur.

Guideline: Default to controlled for fine-grained validation and UX; choose uncontrolled for performance-sensitive flows and simple capture.

---

### Libraries and resolvers
React Hook Form (RHF) focuses on uncontrolled inputs with refs and minimal re-renders. Use schema resolvers (Yup/Zod) for declarative validation and type-safe errors. Formik manages form state in React; it’s simpler to get started but can re-render more often. Prefer RHF for performance-critical forms.

---

### Dynamic forms and arrays
Use field arrays to add/remove repeated groups. When fields are conditional, ensure they mount/unmount cleanly and their validation is gated appropriately. Keep stable keys for repeated groups to preserve state.

---

### File uploads
Support drag-and-drop, show file previews, and handle resumable/chunked uploads for large files. Use backoff and retries on transient errors, and compute checksums for integrity. Consider background upload with progress and cancel.

---

### Debounce and throttle
Debounce validation or search queries to avoid network storms. Throttle high-frequency events like scroll/resize when they drive UI updates. Ensure cancellation of in-flight requests when inputs change.

---

### Accessibility
Provide explicit labels, descriptions, and error messages tied via `aria-describedby`. Manage focus on error to guide users, and ensure keyboard operability for complex widgets (date pickers, dropdowns). Announce validation results to assistive tech.


