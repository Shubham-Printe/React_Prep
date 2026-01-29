# Testing (Preferred Skill) — Interview Notes
What interviewers want to hear: you test **user-visible behavior**, you know **when to mock**, and you balance **speed vs confidence**.

## Jest Basics - Q&A
1. What is Jest, and what is it commonly used for?
   - Jest is a popular JavaScript testing tool used to run tests, check results (“assertions”), and create fakes (“mocks”) for dependencies.
   - Clarifying note:
     - “assertion” = the check you make, like “I expect X to be true”
     - “mock” = a fake version of a dependency (API, timer, storage) used to keep tests predictable

2. How do you structure a basic Jest test?
   - I follow Arrange → Act → Assert (set up → do the action → verify result), and group related tests with `describe`.
   - Clarifying note: `describe`/`it` are just labels that group tests and give readable names.

```js
describe("sum", () => {
  it("adds numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

3. How do you mock in Jest (and what’s the rule of thumb)?
   - For a single function: `jest.fn()`. For a dependency/module: `jest.mock(...)`.
   - Rule of thumb: mock **boundaries** (network, time, storage), not internal implementation details.
   - Clarifying note: “boundaries” = things outside your business logic that are slow or unreliable (API calls, timers, browser storage).

```js
const api = { fetchUser: jest.fn().mockResolvedValue({ id: 1 }) };
```

## React Testing Library (RTL) - Q&A
1. What is React Testing Library and its core principle?
   - React Testing Library (RTL) is used to test React components the way a user uses them.
   - I find elements the same way assistive tech does (by button text, label text, roles like “button”), and I assert what’s on screen.
   - Clarifying note: “role/label/text” basically means “find things the way a user would”, not by internal class names.

2. What queries do you use, and when?
   - `getBy...`: element must exist now (immediate).
   - `queryBy...`: element may or may not exist (immediate).
   - `findBy...`: element appears later (wait/await).

3. How do you simulate user interactions?
   - I use `userEvent` because it behaves like real user input (typing, clicking, keyboard navigation).
   - Clarifying note: `userEvent` is a helper that triggers browser-like events more realistically than firing events manually.

```js
await userEvent.type(input, "hello");
await userEvent.click(screen.getByRole("button", { name: /save/i }));
```

## Mocking API Calls - Q&A
1. How do you handle API mocking in a clean way?
   - For integration-style UI tests, I prefer MSW so the app still “makes requests”, but tests control the responses.
   - For unit tests, I mock the API module directly.

2. When should you mock modules vs mock the network?
   - **Mock modules**: when testing a single function/component in isolation.
   - **Mock the network (MSW)**: when testing flows across components, routing, and data fetching.
   - Clarifying note:
     - MSW = “Mock Service Worker” (a testing tool that intercepts network calls and returns fake responses)
     - `fetch` = the browser API used to make network requests
     - XHR = an older browser API for network requests (still used by some libraries)

3. Why is deterministic data important?
   - It prevents flaky tests: same inputs → same outputs every run (no real network, time, randomness).
   - Clarifying note: “flaky” = a test that sometimes passes and sometimes fails without code changes.

## Unit vs Integration vs E2E - Q&A
1. What’s the difference between unit, integration, and E2E tests?
   - **Unit**: one function/component, minimal dependencies.
   - **Integration**: multiple parts together (UI + state + API behavior).
   - **E2E**: full user journey in a real browser (tools like Playwright/Cypress).
   - Clarifying note: E2E = “end-to-end”, meaning “from the user’s click to the final result”.

2. When do you prefer integration tests in React?
   - When I want confidence in behavior: “user clicks → request happens → UI updates → errors handled”.
   - They catch more real bugs than very isolated component tests.

3. What’s the cost of E2E tests?
   - Highest confidence, but slower and higher maintenance—so I keep them for critical paths only.

## Test Pyramid (what to test) - Q&A
1. What is the test pyramid (in practice)?
   - Lots of fast unit/integration tests, and a smaller number of E2E “smoke tests” for key flows.
   - Clarifying note: “smoke test” = a quick test that confirms the most important flow still works.

2. What should you prioritize testing?
   - Critical user flows (signup/login/checkout), complex business rules, and error states (empty/loading/failure).

3. How do you avoid flaky tests?
   - Don’t depend on real network/time.
   - Use stable selectors (roles/labels a user would see), not brittle CSS class selectors.
   - Wait for async UI updates (`findBy`, `waitFor`) and avoid arbitrary `setTimeout` waits.
   - Clarifying note:
     - “selector” = the way you locate an element in a test
     - `waitFor` = a helper that repeatedly checks until the UI reaches the expected state
