# State Management
- Local state vs global state tradeoffs
- Context API: when it fits, tradeoffs
- Redux/RTK: store, slices, middleware, async flows (score: 8/10)
- Side-effects and async patterns (thunk basics) (score: 8/10)
- Normalization and derived state (score: 8/10)

## Local vs Global State - Q&A
1. How do you decide whether a piece of state should be local, lifted, or global?
   - Local when only one component needs it. Lifted when siblings share it via a common parent. Global
     when many parts of the app need it across the tree and prop-drilling becomes noisy (auth, theme, cart).
2. What are the downsides of making too much state global?
   - Downsides include extra complexity/boilerplate, tighter coupling between unrelated components,
     harder debugging, and risk of unnecessary re-renders for subscribers.
3. What’s “lifting state up,” and when is it preferred over Context or Redux?
   - Lifting state up means moving shared state to the nearest common parent and passing it down via
     props. It’s preferred over Context/Redux when the sharing scope is small and prop-drilling is
     manageable.

## Context API - Q&A
1. When is Context a good fit, and when should you avoid it?
   - Context is good for global-ish, low-frequency data like theme, locale, or auth. Avoid it for
     frequently changing or large state because all consumers re-render, which can hurt performance.
2. How do you prevent unnecessary re-renders with Context?
   - Split context by concern (theme vs auth vs locale), and keep provider values stable with `useMemo`
     so they do not change every render. Colocate providers and avoid passing huge objects when possible.
3. When would you choose Context + `useReducer` over Redux?
   - Use Context + `useReducer` for small to medium apps or feature-scoped state when you do not need
     Redux’s tooling, middleware, or global patterns. It’s simpler, but still watch re-render scope and
     state shape.

## Redux/RTK - Q&A
1. What are the core pieces of Redux (store, actions, reducers), and how does RTK simplify them?
   - **Core pieces**: The **store** holds the state; **actions** are plain objects describing what happened; **reducers** take the current state and an action and return the next state.

   - **Three principles (pillars)**:
     - **Single source of truth** — The whole app state lives in one object tree inside a single store. Easier to debug, persist, and reason about.
     - **State is read-only** — The only way to change state is to dispatch an **action**. No direct writes from views or callbacks. In practice this means **immutable updates**: reducers return new state instead of mutating the existing one.
     - **Changes are made with pure functions** — **Reducers** are pure: `(state, action) => newState`. No side effects inside reducers; same inputs always give the same output. That makes updates predictable and testable.

   - **How RTK simplifies**: You use `configureStore` for the store and `createSlice` for a feature; `createSlice` gives you the reducer and action creators in one place, and you get sensible middleware (e.g. Redux Thunk) by default without extra config.

   - Example:
     ```js
     const counterSlice = createSlice({
       name: "counter",
       initialState: { value: 0 },
       reducers: { inc: state => { state.value += 1; } }
     });
     const store = configureStore({ reducer: { counter: counterSlice.reducer } });
     ```
2. What is a slice in Redux Toolkit, and what does it generate for you?
   - A slice is a feature-focused piece of state plus its reducers. `createSlice` generates the reducer
     and action creators for each reducer case.
     Example:
     ```js
     const todosSlice = createSlice({
       name: "todos",
       initialState: [],
       reducers: { addTodo: (state, action) => { state.push(action.payload); } }
     });
     const { addTodo } = todosSlice.actions;
     ```
3. What is middleware in Redux, and why is it useful?
   - Middleware sits between dispatch and reducers to handle cross-cutting concerns like logging,
     analytics, async actions, or auth checks.
     Example:
     ```js
     const logger = store => next => action => {
       console.log(action.type);
       return next(action);
     };
     const store = configureStore({ reducer, middleware: getDefault => getDefault().concat(logger) });
     ```
4. How do you handle async logic in Redux Toolkit (e.g., API calls)?
   - Use `createAsyncThunk` (built on thunk middleware) to run async calls and handle `pending/fulfilled/rejected`.
     Example:
     ```js
     const fetchUsers = createAsyncThunk("users/fetch", async () => {
       const res = await fetch("/api/users");
       return await res.json();
     });
     const usersSlice = createSlice({
       name: "users",
       initialState: { items: [], status: "idle" },
       extraReducers: builder => {
         builder.addCase(fetchUsers.fulfilled, (state, action) => {
           state.items = action.payload;
         });
       }
     });
     ```
5. What problem does RTK Query solve, and when would you use it?
   - RTK Query provides a built-in data fetching and caching layer for Redux. It manages requests,
     caching, re-fetching, and loading/error states with minimal boilerplate. Use it when your app makes
     many API calls and you want standardized, efficient server-state handling.

## Side-effects and Async Patterns (Thunk) - Q&A
1. What is a thunk in Redux, and why do we need it?
   - A thunk is a function returned from an action creator that can perform side-effects and dispatch
     actions later. It enables async flows (API calls) in Redux, which otherwise only accepts plain object
     actions.
     Example:
     ```js
     const loadUser = () => async (dispatch) => {
       dispatch(userLoading());
       const data = await fetch("/api/user").then(r => r.json());
       dispatch(userLoaded(data));
     };
     ```
2. What are common patterns for handling async state in Redux?
   - Track `status` (`idle`/`loading`/`succeeded`/`failed`) and `error` alongside data. Dispatch
     `pending/fulfilled/rejected` actions (RTK `createAsyncThunk` does this automatically).
     Example:
     ```js
     const slice = createSlice({
       name: "users",
       initialState: { items: [], status: "idle", error: null },
       extraReducers: (b) => {
         b.addCase(fetchUsers.pending, s => { s.status = "loading"; })
          .addCase(fetchUsers.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
          .addCase(fetchUsers.rejected, (s, a) => { s.status = "failed"; s.error = a.error; });
       }
     });
     ```

## Normalization and Derived State - Q&A
1. What is state normalization, and why is it useful?
   - Normalization stores entities by ID (e.g., `byId` and `allIds`) instead of nested arrays. It avoids
     duplication, simplifies updates, and makes lookups O(1).
     Example:
     ```js
     const users = {
       byId: { "1": { id: "1", name: "Sam" } },
       allIds: ["1"]
     };
     ```
2. What is derived state, and where should it live?
   - Derived state is computed from existing state (e.g., filtered lists, totals). It should be computed
     on the fly (selectors) rather than stored to avoid inconsistencies. Use memoized selectors when
     needed for performance.
