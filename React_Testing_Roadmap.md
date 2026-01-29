# JavaScript & React Testing Roadmap

Goal: build strong, practical testing skills with JavaScript + React, and prove them by creating and running a real test suite.

## Phase 1 — Foundations (Week 1)
- Learn Jest/Vitest concepts: test structure, matchers, setup/teardown.
- Practice TDD/BDD workflow with tiny functions (pure JS).
- Understand mocks, spies, stubs, and fake timers.
- Deliverable: 15–20 focused unit tests on utility functions.

## Phase 2 — React Component Testing (Week 2)
- React Testing Library (RTL): render, queries, and `userEvent`.
- Test accessibility-first: role/label/text queries.
- Cover component states: loading, error, empty, success.
- Deliverable: 10–15 component tests covering user flows.

## Phase 3 — Integration & Async (Week 3)
- Test components with data fetching (mocked).
- Mock network with MSW or module mocks.
- Assert UI updates with async queries (`findBy`, `waitFor`).
- Deliverable: 5–8 integration tests with mocked API.

## Phase 4 — Coverage, Quality, and Patterns (Week 4)
- Add coverage reporting and threshold targets.
- Create reusable test utilities (render wrappers, mocks).
- Standardize test naming and structure.
- Deliverable: stable test suite with coverage metrics.

## Phase 5 — CI and Real-World Practice (Week 5+)
- Run tests in CI (GitHub Actions or similar).
- Add linting and pre-commit hooks (optional).
- Keep a test-first habit when adding features.
- Deliverable: CI passing with tests on each push.

## Ongoing Practice Checklist
- Write tests for every new component or hook.
- Prefer user-centric assertions over implementation details.
- Keep tests deterministic and fast.
- Review flaky tests and fix root causes.

## Proof of Progress
Create a fresh project, add tests, and run them locally. Log each step in `react-testing-roadmap-project/SETUP_LOG.md`.
