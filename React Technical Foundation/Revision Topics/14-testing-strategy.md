## Testing Strategy

- [ ] Unit vs integration vs E2E balance
- [ ] React Testing Library: queries, accessibility-first tests
- [ ] Vitest/Jest configuration: TS, ESM, coverage, watch
- [ ] Mocking strategies: MSW for network, dependency isolation
- [ ] E2E: Playwright/Cypress; flake reduction and test isolation
- [ ] Contract tests for API and GraphQL schemas
- [ ] Visual regression testing and Storybook test runner

---

### Test pyramid, not ice cream cone
Aim for many fast unit/integration tests and fewer E2E tests. Integration tests around components with realistic rendering (React Testing Library) catch most issues. E2E validates wiring and flows, but is slower and flakier—reserve for critical paths.

---

### React Testing Library (RTL)
Test from the user’s perspective using accessible queries (`getByRole`, `getByLabelText`). Avoid testing implementation details. Use `screen.findBy*` for async UI. Prefer realistic environments with providers and minimal mocking.

---

### Tooling and config
Use Vitest/Jest with TS/ESM support and jsdom for DOM. Configure coverage thresholds and fast watch mode. Split slow suites and run in parallel in CI. Snapshot sparingly for stable UI fragments.

---

### Mocking and MSW
Mock Service Worker intercepts network at the request layer, enabling realistic async behavior without hitting real backends. Prefer MSW over ad-hoc fetch mocks. Mock time and random sources deterministically.

---

### E2E: Playwright/Cypress
Set up stable test IDs, isolate state per test, run browsers headless in CI. Reduce flakiness with robust waits and deterministic seeds. Record videos/screenshots for failures. Parallelize test sharding.

---

### Contracts and visual testing
Use contract tests to lock API shapes (OpenAPI/GraphQL schemas). Visual regression tools compare screenshots or stories—integrate with Storybook’s test runner for component-level confidence.


