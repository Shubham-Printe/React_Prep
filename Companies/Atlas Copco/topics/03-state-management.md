# State Management
- Local state vs global state tradeoffs
- Context API: when it fits, tradeoffs
- Redux/RTK: store, slices, middleware, async flows (score: 8/10)
- Side-effects and async patterns (thunk basics) (score: 8/10)
- Normalization and derived state (score: 8/10)

## Local vs Global State - Q&A
1. How do you decide whether a piece of state should be local, lifted, or global?
   - Local when only one component needs it. 
   - Lifted when siblings share it via a common parent. 
   - Global when many parts of the app need it across the tree and prop-drilling becomes noisy (auth, theme, cart).

2. What are the downsides of making too much state global?
   - Downsides 
    - include extra complexity/boilerplate, 
    - tighter coupling between unrelated components,
    - harder debugging, and risk of unnecessary re-renders for subscribers.
    
3. What's "lifting state up," and when is it preferred over Context or Redux?
   - Lifting state up means moving shared state to the nearest common parent and passing it down via props. 
   - It's preferred over Context/Redux when the sharing scope is small and prop-drilling is manageable.

## Context API - Q&A
1. When is Context a good fit, and when should you avoid it?
   - Context is good for global-ish, low-frequency data like theme, locale, or auth. 
   - Avoid it for frequently changing or large state because all consumers re-render, which can hurt performance.

2. How do you prevent unnecessary re-renders with Context?
   - Split context by concern (theme vs auth vs locale), and keep provider values stable with `useMemo` so they do not change every render. 
   - Colocate providers i.e. putting each provider around only the parts of the tree that actually use it, instead of wrapping the whole app at the root.
   - Avoid passing huge objects when possible.

3. When would you choose Context + `useReducer` over Redux?
   - Use Context + `useReducer`
    - when the app is small or medium.
    - when state is scoped to a feature.
    - when you don't need Redux's DevTools, middleware (thunks/sagas), or a single global store.

## Redux/RTK - Q&A
1. What are the core pieces of Redux (store, actions, reducers), and how does RTK simplify them?
   - **Core pieces**: 
    - **store** holds the state; 
    - **actions** are plain objects describing what happened; 
    - **reducers** take the current state and an action and return the next state.

   - **Three principles (pillars)**:
     - **Single source of truth** 
      — The whole app state lives in one object tree inside a single store. Easier to debug, persist, and reason about.
     
     - **State is read-only** 
      — The only way to change state is to dispatch an **action**. 
      - No direct writes from views or callbacks. 
      - In practice this means **immutable updates**: reducers return new state instead of mutating the existing one.

     - **Changes are made with pure functions** 
      — **Reducers** are pure: `(state, action) => newState`. 
      - No side effects inside reducers; 
      - same inputs always give the same output. That makes updates predictable and testable.

   - **How RTK simplifies**: 
    - We use `configureStore` for the store and `createSlice` for a feature; 
    - `createSlice` gives you the reducer and action creators in one place, and you get sensible middleware (e.g. Redux Thunk) by default without extra config.

   - Example:
     
     ```js
     const counterSlice = createSlice({
       name: "counter",
       initialState: { value: 0 },
       reducers: { inc: state => { state.value += 1; } }
     });
     const store = configureStore({ reducer: { counter: counterSlice.reducer } });

     // createSlice auto-generates action creators from reducer names:
     counterSlice.actions.inc();  // { type: "counter/inc" }

     // In a component: dispatch the action, read state with useSelector
     dispatch(counterSlice.actions.inc());
     const value = useSelector(state => state.counter.value);
     ```

2. What is a slice in Redux Toolkit, and what does it generate for you?
   - A slice is a feature-focused piece of state plus its reducers. 
   - `createSlice` generates the reducer and action creators for each reducer case.

3. What is middleware in Redux, and why is it useful?
   - Middleware sits between dispatch and reducers to handle cross-cutting concerns like logging, analytics, async actions, or auth checks.

4. How do you handle async logic in Redux Toolkit (e.g., API calls)?
   - Use `createAsyncThunk`: 
    - you give it an action type prefix (e.g. `'users/fetch'`) and an async function;
    - RTK generates three actions—`pending`, `fulfilled`, `rejected` and dispatches them as the promise runs. 
    - In our slice, use `extraReducers` to handle those: 
      - set `loading: true` on pending, 
      - store data on fulfilled, 
      - store error on rejected. 

    - We use `extraReducers` because those actions come from outside the slice, `createAsyncThunk` generates them; our slice just reacts to them. 
    - The slice's `reducers` are for actions you define in the slice; `extraReducers` are for external actions.

   - **Sync vs async dispatch (how thunks work under the hood)**:
     - **Sync**: 
      You dispatch a plain object `{ type, payload }`. 
      The reducer receives it and returns the new state.
     - **Async**: 
      - Reducers only understand plain objects but here we do not have those. 
      - Instead, we dispatch a **function**. 
      - The thunk middleware intercepts it: when it sees a function instead of a plain object, it runs that function with `(dispatch, getState)`. 
      - The thunk then 
        (1) immediately dispatches `pending`, 
        (2) runs our async callback and awaits the promise, 
        (3) dispatches `fulfilled` with the result or `rejected` with the error. 
      - The reducer never sees a promise—it only ever receives the plain actions the thunk dispatches.

      - **Flow**: 
        `dispatch(thunk)` 
        → middleware runs `thunk(dispatch, getState)` 
        → thunk dispatches `pending` 
        → thunk awaits async work 
        → thunk dispatches `fulfilled` or `rejected` 
        → reducer updates state. 
      The promise stays inside the thunk; the reducer only sees plain actions.
   
5. What problem does RTK Query solve, and when would you use it?
   - RTK Query provides a built-in data fetching and caching layer for Redux. 
   - It manages requests, caching, re-fetching, and loading/error states with minimal boilerplate. 
   - We should use it when our app makes many API calls and you want standardized, efficient server-state handling.

## Side-effects and Async Patterns (Thunk) - Q&A
1. What is a thunk in Redux, and why do we need it?
   - A thunk is a **function you dispatch** instead of a plain object. 
   - The thunk middleware sees it's a function, runs it with `(dispatch, getState)`, 
   - the thunk can then perform async operations and dispatch plain actions when ready. 
   - Redux reducers only accept plain object actions; 
   - thunks bridge async work into that model. 

## Normalization and Derived State - Q&A
1. What is state normalization, and why is it useful?
   - **What**: 
    - Instead of nesting entities or repeating them, store a flat map of entities by ID. 
    - `byId` is an object keyed by ID (e.g. `{ 1: user1, 2: user2 }`); 
    - `allIds` is an array of IDs to preserve order.

   - **Why**: 
    - Nested data duplicates entities (e.g. the same user in multiple posts). 
    - Updating one copy leaves others stale. A single lookup requires scanning arrays. 
    - Normalized: one source per entity; updating by ID touches one place; lookup is `byId[id]`—O(1).

2. What is derived state, and where should it live?
   - Derived state is computed from existing state (e.g., filtered lists, totals). 
   - It should be computed on the fly rather than stored to avoid inconsistencies. 
   Use memoized selectors when needed for performance.
