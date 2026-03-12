# Testing (Preferred Skill) — Interview Notes
What interviewers want: you test **what users see**, you know **when to fake things**, and you balance **speed vs confidence**.

## Jest Basics - Q&A
1. What is Jest, and what is it commonly used for?
   - Jest is a JavaScript test runner. It runs tests, checks results (assertions), and lets you create fakes (mocks) for things your code depends on.
   - **Assertion** = the check you write, e.g. “I expect this to be 3”. **Mock** = a fake (e.g. fake API or timer) so the test doesn’t hit the real thing and stays predictable.

2. How do you structure a basic Jest test?
   - I use Arrange → Act → Assert: set up, do the thing, then check the result. I group tests with `describe` and name each test with `it`.
   - `describe` and `it` are just labels so test output is readable.

```js
describe("sum", () => {
  it("adds numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

3. How do you mock in Jest (and what’s the rule of thumb)?
   - Single function: `jest.fn()`. Whole module: `jest.mock(...)`.
   - Rule of thumb: mock **outside stuff** (network, time, storage), not how your code is written inside. "Boundaries" = things that are slow or unreliable (APIs, timers, storage).

```js
const api = { fetchUser: jest.fn().mockResolvedValue({ id: 1 }) };
```

## React Testing Library (RTL) - Q&A
1. What is React Testing Library and its core principle?
   - RTL tests components the way a user would use them. I find elements by what the user sees: button text, labels, roles (e.g. "button"). I don't rely on class names or internal structure.
   - So: find by role/label/text, then check what's on screen.

2. What queries do you use, and when?
   - `getBy...`: the element must be there right now (throws if missing).
   - `queryBy...`: the element might or might not be there (good for "this should not exist").
   - `findBy...`: the element shows up later (async; use with `await`).

3. How do you simulate user interactions?
   - I use `userEvent`: it types, clicks, and uses the keyboard like a real user, so tests are closer to real behavior than manually firing events.

```js
await userEvent.type(input, "hello");
await userEvent.click(screen.getByRole("button", { name: /save/i }));
```

## Mocking API Calls - Q&A
1. How do you handle API mocking in a clean way?
   - For bigger UI tests (integration-style), I use MSW: the app still sends requests, but the test controls what comes back.
   - For unit tests, I mock the API module so the code under test never hits the real API.

2. When should you mock modules vs mock the network?
   - **Mock the module**: when you're testing one function or component alone.
   - **Mock the network (e.g. MSW)**: when you're testing a flow that goes through several components, routing, or data fetching.
   - MSW = Mock Service Worker; it intercepts requests (e.g. `fetch`) and returns fake responses. XHR is the older browser API some libs still use.

3. Why is deterministic data important?
   - So tests aren't flaky: same inputs always give the same result (no real network, no real time, no randomness). **Flaky** = a test that passes sometimes and fails sometimes without you changing code.

## Unit vs Integration vs E2E - Q&A
1. What’s the difference between unit, integration, and E2E tests?
   - **Unit**: one function or component, with as few dependencies as possible.
   - **Integration**: several pieces together (UI + state + how the app talks to the API).
   - **E2E (end-to-end)**: the full path in a real browser (e.g. Playwright, Cypress)—from the user's click to the final result.

2. When do you prefer integration tests in React?
   - When I want to trust that the flow works: user clicks → request goes out → UI updates → errors are handled. They catch more real bugs than tests that only check one tiny component.

3. What’s the cost of E2E tests?
   - You get the most confidence, but they're slower and need more upkeep, so I use them only for the most important flows.

## Test Pyramid (what to test) - Q&A
1. What is the test pyramid (in practice)?
   - Many fast unit and integration tests, and fewer E2E tests for the main flows. **Smoke test** = a short test that checks the most important path still works.

2. What should you prioritize testing?
   - Important user flows (signup, login, checkout), tricky business logic, and error cases (empty list, loading, failed request).

3. How do you avoid flaky tests?
   - Don't rely on real network or real time.
   - Find elements by what the user sees (roles, labels), not by CSS classes that might change.
   - Wait for async updates with `findBy` or `waitFor` instead of random `setTimeout`s. **Selector** = how you find an element. **`waitFor`** = keeps checking until the UI is in the state you expect.
