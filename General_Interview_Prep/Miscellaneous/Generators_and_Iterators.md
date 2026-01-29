# JavaScript Generators & Iterators

**The Core Concept**: Regular functions follow a "Run-to-Completion" model. Once called, they run until they return or throw error. **Generators** are functions that can be **paused** and **resumed**.

---

## 1. Syntax & The `yield` Keyword

*   **`function*`**: The asterisk denotes a generator.
*   **`yield`**: The "Pause Button". It outputs a value to the caller and freezes the function state (local variables are preserved).
*   **`.next()`**: The "Play Button". It resumes execution from the last `yield`.

### Basic Example
```javascript
function* simpleGenerator() {
  console.log("Start");
  yield 1;          // Pause & return 1
  console.log("Middle");
  yield 2;          // Pause & return 2
  console.log("End");
}

const gen = simpleGenerator(); 
// NOTE: The code inside DOES NOT run yet. It just returns an "Iterator" object.

console.log(gen.next()); 
// Output: "Start" -> { value: 1, done: false }

console.log(gen.next()); 
// Output: "Middle" -> { value: 2, done: false }

console.log(gen.next()); 
// Output: "End" -> { value: undefined, done: true }
```

---

## 2. Two-Way Communication

Generators are not just data producers; they can receive data too. You can pass arguments to `.next()`.

```javascript
function* chattyGenerator() {
  const name = yield "What is your name?"; // Pauses here.
  // When resumed, 'name' will become whatever value was passed to next()
  
  yield `Hello, ${name}!`;
}

const chat = chattyGenerator();
console.log(chat.next().value); // "What is your name?"

console.log(chat.next("Shubham").value); // "Hello, Shubham!"
```

---

## 3. Real-World Use Cases

### A. Infinite Streams (Lazy Evaluation)
You can write infinite loops without crashing the browser.
```javascript
function* idMaker() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

const ids = idMaker();
console.log(ids.next().value); // 0
console.log(ids.next().value); // 1
// It generates values on-demand.
```

### B. Async Flow Control (Redux-Saga)
Libraries like Redux-Saga use generators to make async code look synchronous.

```javascript
// Saga Example (Pseudo-code)
function* loginFlow() {
  const user = yield call(api.login); // Wait for promise
  if (user) {
    yield put({ type: 'LOGIN_SUCCESS', user }); // Dispatch action
  }
}
```

### C. Custom Iterables
You can make your own objects compatible with `for...of` loops by adding a generator to `[Symbol.iterator]`.

```javascript
const team = {
  leads: ['Alice', 'Bob'],
  interns: ['Charlie'],
  
  // Magic method
  *[Symbol.iterator]() {
    yield* this.leads;   // Delegate to leads array
    yield* this.interns; // Delegate to interns array
  }
};

for (const member of team) {
  console.log(member); // Alice, Bob, Charlie
}
```

---

## 4. Interview "Gotchas"

1.  **Does calling `myGenerator()` run the code?**
    *   No. It returns a Generator Object (Iterator). You must call `.next()` to start.
2.  **What does `yield*` do?**
    *   It delegates to another generator or iterable (like flattening nested generators).
3.  **Can you use `yield` inside a callback (e.g., inside `.map`)?**
    *   **No.** `yield` must be directly inside the `function*` scope. You cannot use it inside nested non-generator functions.








