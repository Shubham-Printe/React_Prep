# Interview Pitfalls (Datastack)

- **Redux vs Context**: Be clear on when you’d choose each; avoid over-engineering for simple cases.
  - **Simple answer**: Use Context for theme, locale, auth — low churn, few consumers. Use Redux when you have lots of shared state, complex updates, middleware, or need DevTools/time-travel. For a small app or a single “slice” (e.g. user prefs), Context + useReducer is enough; don’t say Redux for everything.
  - **“If Redux is so good, why do people still use Context?”** — Because “good” depends on the problem. Context is built into React, has zero extra deps, and is enough when you only need to pass a few values (theme, user) that don’t change often. Redux adds boilerplate, a learning curve, and more concepts (store, actions, reducers, middleware). For simple shared state, that’s overkill and hurts maintainability. So people use Context when the problem is simple, and Redux when they need predictable updates, middleware, DevTools, or complex shared state at scale.

- **Reusable components**: Have 1–2 concrete examples (e.g. design system component or shared hook).
  - **Simple answer**: E.g. “We built a shared `DataTable` with sort/filter/pagination props used across 5 screens,” or “A `useDebouncedSearch` hook used in search bars so we don’t hit the API on every keystroke.” Keep it short and real.

- **Code reviews**: Be ready to describe what you look for and how you give feedback (aligned with JD).
  - **Simple answer**: Correctness, readability, performance (unnecessary re-renders, heavy work in render), security (XSS, sensitive data), and tests for critical paths. Give feedback that’s specific and constructive (“use a stable key here” vs “this is wrong”), and suggest a fix or link to a doc when possible.

- **Leadership**: Even without a formal title, have examples of guiding other React developers or defining best practices.
  - **Simple answer**: E.g. ran knowledge-sharing on hooks/Redux, wrote a short “React patterns” doc, or paired with juniors on hard bugs and explained the fix. One concrete “I did X and the team adopted it” is enough.
