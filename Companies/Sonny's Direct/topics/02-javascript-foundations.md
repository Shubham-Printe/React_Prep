# JavaScript Foundations
- Closures, prototypes, this, binding (score: 8/10)
- Event loop, microtasks vs macrotasks (score: 8/10)
- Promises, async/await, error handling (score: 8/10)
- Immutability patterns and data transforms (score: 7/10)
- ES modules, destructuring, spread, rest

## Closures, Prototypes, This, Binding - Q&A
1. What is a closure, and why is it useful in JavaScript?
   - A closure is when a function remembers variables from its lexical scope even after that scope has
     finished executing. It is useful for data privacy, function factories, and maintaining state without
     globals.
2. What does `this` refer to in JavaScript, and how does it differ in regular functions vs arrow functions?
   - `this` is the function’s execution context. In regular functions, `this` depends on how the function
     is called (method call → object, standalone → `undefined` in strict mode or `window` in non-strict).
     In arrow functions, `this` is lexically captured from the surrounding scope and cannot be rebound.
3. What’s the difference between `call`, `apply`, and `bind`?
   - `call(thisArg, a, b)` invokes immediately with arguments.
     Example: `greet.call(user, "Hello")`
   - `apply(thisArg, [a, b])` invokes immediately with an arguments array.
     Example: `greet.apply(user, ["Hello"])`
   - `bind(thisArg, a, b)` returns a new function with `this` (and optional args) pre-set.
     Example: `const bound = greet.bind(user, "Hello"); bound();`
4. What is the prototype chain, and how does JavaScript use it for property lookup?
   - The prototype chain links objects to their prototype. When you access a property, JS checks the
     object first; if not found, it walks up the prototype chain until it finds the property or reaches
     `null`.
5. How does `bind` differ from an arrow function in terms of `this`?
   - Arrow functions capture `this` from the surrounding lexical scope at definition time and it cannot be
     changed. `bind` creates a new regular function with `this` explicitly fixed to a given object (and
     optional preset args).

## Event Loop, Microtasks, Macrotasks - Q&A
1. What is the JavaScript event loop, and why is it important?
   - The event loop is the JS runtime mechanism that executes synchronous code, then processes queued
     tasks (microtasks and macrotasks) to handle async work without blocking. After the call stack is
     empty, it runs all microtasks, then takes a macrotask, then repeats—keeping JS single-threaded but
     responsive.
2. What’s the difference between microtasks and macrotasks?
   - Microtask: a job scheduled to run right after the current execution finishes, before the event loop
     takes the next task. It is a post-task queue used for promise reactions and immediate follow-ups.
   - Macrotask: a top-level task pulled from the main task queue (timers, UI events, I/O). Each macrotask
     runs to completion before the next one begins.
3. Given this snippet, what is the output order?
   - Output: A → D → C → B
4. What happens if you schedule a microtask inside a microtask?
   - A microtask scheduled inside another microtask is appended to the same microtask queue and runs
     before the next macrotask. If the inner promise has not settled yet, it will enqueue its microtask
     when it does settle; that microtask runs right after the macrotask in which it settled.
5. How can a long-running synchronous task affect the event loop, and what’s the impact on the UI?
   - A long synchronous task blocks the main thread, so the event loop cannot process other tasks. This
     freezes the UI: no rendering, no input handling, and animations jank until the task finishes.

## Promises, Async/Await, Error Handling - Q&A
1. What is a Promise, and what are its three states?
   - A Promise is an object representing the eventual result of an async operation. It has three states:
     pending, fulfilled, or rejected. Once settled, it cannot change state.
2. What’s the difference between `Promise.all`, `Promise.allSettled`, and `Promise.race`?
   - `Promise.all` resolves when all fulfill; rejects on the first rejection.
   - `Promise.allSettled` waits for all to settle and returns `{status, value|reason}` for each.
   - `Promise.race` settles with the first promise to settle (resolve or reject).
3. How does `async/await` relate to Promises, and what does `await` actually do?
   - `async/await` is syntax sugar over Promises. An `async` function always returns a Promise. `await`
     pauses execution inside that async function until the awaited Promise settles, then resumes; it
     does not block the event loop.
4. How do you handle errors with `async/await`, and how does it compare to `.catch`?
   - Wrap `await` calls in `try/catch` to handle rejections. This is equivalent to attaching `.catch` on
     the promise; use whichever style keeps error handling clear and centralized.
5. What is the difference between sequential and parallel async execution, and how would you implement both?
   - Sequential: `await` each task one after another (next starts after previous finishes).
     Parallel: start all promises first, then `await Promise.all` (or `allSettled`) to wait for completion.

## Immutability Patterns and Data Transforms - Q&A
1. What does “immutability” mean in JavaScript, and why is it important in React?
   - Immutability means you do not modify existing objects/arrays; you create new copies with changes. In
     React, this enables reliable change detection, avoids unintended side effects, and helps state
     updates trigger re-renders.
2. How do you update a nested object immutably in JavaScript?
   - Copy each level you need to change using spread, e.g.
     `const next = { ...state, user: { ...state.user, name: "Sam" } };`
     Alternatively, use a helper like Immer to simplify deep updates.
3. What are common immutable array operations for add/remove/update?
   - Add: `const next = [...arr, newItem]`
   - Remove: `const next = arr.filter(item => item.id !== id)`
   - Update: `const next = arr.map(item => item.id === id ? { ...item, done: true } : item)`
4. What is `map`, `filter`, and `reduce` typically used for in data transformations?
   - `map` transforms each element and returns a new array.
   - `filter` keeps elements that match a condition.
   - `reduce` folds an array into a single accumulator (number, object, array, etc.).
5. When would you use `structuredClone` or a library like Immer?
   - Use `structuredClone` for deep cloning when you need a full copy of nested data. Use Immer when you
     want to write “mutating” code while keeping immutability, especially for deep or frequent state
     updates.

## ES Modules, Destructuring, Spread, Rest - Q&A
1. What’s the difference between default export and named export in ES modules?
   - Default export is imported without braces and can be renamed freely: `import AnyName from "./mod"`.
     Named exports require braces and the exact name (or `as` to rename): `import { foo as bar } from "./mod"`.
2. What’s the difference between spread (`...`) and rest (`...`) syntax?
   - Spread expands an iterable/object into individual elements/props: `const b = [...a]`, `{...obj}`.
     Rest collects remaining elements/props into one variable: `function f(...args) {}`, `const { a, ...rest } = obj`.
3. How does object/array destructuring help in React components?
   - It makes props/state access concise and explicit, e.g. `function Card({ title, onClick }) { ... }`
     or `const [value, setValue] = useState(...)`, improving readability and reducing boilerplate.
4. When should you use `...rest` props in React, and what’s a common pitfall?
   - Use rest props to pass through unknown/extra attributes (e.g., `<button {...rest} />`). A common
     pitfall is unintentionally passing non-DOM props to DOM elements, causing React warnings.
5. What is the difference between shallow copy and deep copy when using spread?
   - Spread creates a shallow copy; nested objects/arrays are still shared references. For deep copies,
     use utilities like `structuredClone` or libraries.2. What’s the difference between spread (`...`) and rest (`...`) syntax?
   - Spread expands an iterable/object into individual elements/props: `const b = [...a]`, `{...obj}`.
     Rest collects remaining elements/props into one variable: `function f(...args) {}`, `const { a, ...rest } = obj`.
3. How does object/array destructuring help in React components?
   - It makes props/state access concise and explicit, e.g. `function Card({ title, onClick }) { ... }`
     or `const [value, setValue] = useState(...)`, improving readability and reducing boilerplate.
4. When should you use `...rest` props in React, and what’s a common pitfall?
   - Use rest props to pass through unknown/extra attributes (e.g., `<button {...rest} />`). A common
     pitfall is unintentionally passing non-DOM props to DOM elements, causing React warnings.
5. What is the difference between shallow copy and deep copy when using spread?
   - Spread creates a shallow copy; nested objects/arrays are still shared references. For deep copies,
     use utilities like `structuredClone` or libraries.
