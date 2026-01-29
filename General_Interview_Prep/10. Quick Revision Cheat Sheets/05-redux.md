# Redux

## Summary
Redux is a predictable state management library for JavaScript apps (often with React) that uses actions, reducers, and a single store.
Predictable state container with unidirectional data flow, pure reducers, and middleware.

## Key Concepts
- Principles:
  1. Single store (source of truth)
  2. State is read-only (immutability)
  3. Changes via pure reducers (actions → reducers)
- Middleware: functions between dispatch and reducer for async, logging, errors.
  ```js
  const fetchItems = () => async (dispatch) => {
    const res = await fetch('/api/items');
    const data = await res.json();
    dispatch({ type: 'loaded', payload: data });
  };

  store.dispatch(fetchItems());

  // Thunk middleware (simplified) intercepts functions
  const thunk = ({ dispatch, getState }) => next => action =>
    typeof action === 'function' ? action(dispatch, getState) : next(action);
  ```
- React-Redux:
  - Actions are plain objects describing events (what happened).
  - Reducers are pure functions: `(prevState, action) => nextState`.
  - Store is the single state container; `Provider` makes it available to the app.
  - Selectors read/derive state; `useSelector` re-renders only when selected value changes.
  - Middleware runs between `dispatch` and reducers to handle side effects (async, logging) and can intercept/transform actions.
  - Thunk example: `dispatch(async (dispatch, getState) => { const data = await api(); dispatch({ type: 'loaded', payload: data }); });`
  - Without thunk, `dispatch` expects plain objects; thunk middleware lets you dispatch functions, run async work, then dispatch a plain action.
  
- Redux Toolkit (RTK):
  - Official, recommended way to write Redux; reduces boilerplate.
  - `configureStore` sets up the store with good defaults (Thunk + DevTools).
  - `createSlice` generates reducers and action creators in one place.
  - `createAsyncThunk` standardizes async logic; RTK Query handles data fetching/caching.

## Code Examples
```js
// Logger middleware
const logger = store => next => action => {
  console.log('Dispatching', action);
  const result = next(action);
  console.log('Next state', store.getState());
  return result;
};

// Using middleware (RTK default includes thunk)
const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});
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

