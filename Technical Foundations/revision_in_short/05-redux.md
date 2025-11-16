# Redux

## Summary
Predictable state container with unidirectional data flow, pure reducers, and middleware.

## Key Concepts
- Principles:
  1. Single store (source of truth)
  2. State is read-only (immutability)
  3. Changes via pure reducers (actions → reducers)
- Middleware: functions between dispatch and reducer for async, logging, errors.

## Code Examples
```js
// Logger middleware
const logger = store => next => action => {
  console.log('Dispatching', action);
  const result = next(action);
  console.log('Next state', store.getState());
  return result;
};
```

## Situational Scenarios
- Cross-cutting concerns (analytics/logging) via middleware.
- Async flows with thunks/sagas/RTK Query.

## Pitfalls
- Mutating state in reducers instead of returning new references.
- Overusing Redux for local UI state better handled with React.

## Interview Q&A
- Why immutability? Enables change detection and time-travel debugging.
- Where do side effects go? Middleware or async thunks/sagas.

## References
- Redux Toolkit Docs; Middleware patterns; RTK Query.

## Checklist
- [ ] Reducers are pure and immutable
- [ ] Side effects handled via middleware
- [ ] Use RTK for ergonomics and conventions

