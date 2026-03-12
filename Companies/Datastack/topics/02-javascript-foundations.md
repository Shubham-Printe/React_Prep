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
   - **React example:** An event handler or effect callback “closes over” the component’s state/props from the render when it was created. That’s why you can use `count` inside `onClick` — the handler remembers the `count` from that render. The pitfall: if you use that handler inside a `useEffect` with an empty dependency array, it will always see the **initial** `count` (stale closure). Fix: list the values you read in the dependency array so the effect gets a fresh closure when they change, or use the functional form of setState: `setCount(c => c + 1)`.
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
   - JavaScript runs on a single thread, so while a long synchronous task is running, the event loop can't pick up the next task. That means the main thread is busy—the browser can't paint, handle clicks, or run animations until that work finishes. So the page can feel frozen or janky. That's why we try to keep heavy work short, move it off the main thread (e.g. Web Workers), or break it up so the UI can update in between.

## Promises, Async/Await, Error Handling - Q&A

**What’s actually happening with the event loop (e.g. 3 network calls A, B, C in `useEffect`):**

- **“Scheduling” vs “added to the queue”**
  - Scheduled: When you call the async task (start A, B, C), you’re only registering: “when this Promise settles, run this continuation.” No continuation runs yet.
  - Queued: When a Promise actually resolves (e.g. C’s response arrives), the engine enqueues that continuation (the code after `await` or the `.then` callback) in the microtask queue. So “callback is added to the queue” = “continuation is enqueued when the Promise resolves.”

- **Execution order**  
  Callback order is determined by resolution order (C, B, A in your example), not by the order you started the requests. So in the event loop, it’s “run whatever continuation is next in the microtask queue,” and those get added as each Promise resolves.

- **Microtask queue** 
  The microtask queue holds only “run this callback” / “resume this async function.” It does not hold the network work. The browser/OS does the I/O; when it’s done, it resolves the Promise, and that is what causes the continuation to be enqueued. So: “nothing is really holding the execution of the promise/async task” — the async work is offloaded; only the reaction to its result (the continuation) is queued and run on the JS thread.

- **No immediate run**
  When a Promise resolves, the continuation is not run immediately; it’s queued. It runs only when the current call stack is empty and the event loop processes microtasks.

So: scheduling = “run this when this Promise settles”; queueing = “Promise settled, put this continuation in the microtask queue”; execution = “call stack empty, run the next microtask.” The doc now states this under that Q5 block.

---

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

   **Short snippet — core idea:** `await` only pauses *inside* the async function; the rest of the app (and the event loop) keeps running:

   ```javascript
   async function fetchData() {
     console.log("A: inside async, before await");
     await new Promise((r) => setTimeout(r, 500)); // "pause" here; event loop is free
     console.log("D: inside async, after await");
     return 42;
   }

   console.log("B: before calling fetchData()");
   const p = fetchData(); // runs until first await, then returns a Promise immediately
   console.log("C: after call — we're not blocked; p is", p); // p is Promise { <pending> }
   p.then((v) => console.log("E: result", v));

   // Log order: B → A → C → (500ms) → D → E
   ```

   **How I'd walk through it in an interview:**

   - First we run the top-level code, so we log **"B"**. 
   - Then we call `fetchData()`. The engine creates a Promise `p` for that call and starts running the function body, so we get **"A"** printed. 
   - When we hit the `await` on the `setTimeout` Promise, that Promise is still pending, so the engine suspends the rest of `fetchData` and returns control to the caller and `fetchData()` returns that same Promise `p`, still pending. 
   - So we're back in the caller: the assignment to `p` is done, and we run the next line and log **"C"**. 
   - Then we register the `.then` on `p`; nothing runs yet. The top-level script finishes, the call stack is empty, and the event loop keeps running. 
   - After 500 ms the timer fires, the timer callback calls the resolver `r()`, so the awaited Promise settles. The engine then schedules the resumption of `fetchData` as a microtask. When that microtask runs, we continue inside `fetchData` after the `await`, log **"D"**, and then hit `return 42`. 
   - In an async function, returning a value is like resolving the async call's Promise with that value, so `p` gets fulfilled with `42`. That triggers the `.then` callback, so we log **"E: result 42"**. 
   
   So the order you see is **B → A → C → D → E**, with a 500 ms gap between C and D.


4. How do you handle errors with `async/await`, and how does it compare to `.catch`?
   - Wrap `await` calls in `try/catch` to handle rejections. This is equivalent to attaching `.catch` on
     the promise; we can use whichever style keeping error handling clear and centralized.
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
     use utilities like `structuredClone` or libraries.