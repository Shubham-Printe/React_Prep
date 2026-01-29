# Core JavaScript Deep Dive (Fast Track)

## 1. Execution Context & Call Stack
**Concept:**
- **Execution Context (EC):** The environment where JS code runs.
    - **Global EC:** Created by default. `window` (browser) or `global` (Node).
    - **Function EC:** Created whenever a function is *invoked*.
- **Phases:**
    1.  **Creation Phase (Hoisting):** 
        - Variables (`var`) set to `undefined`. 
        - `let`/`const` enter "Temporal Dead Zone" (TDZ).
        - Function declarations are fully stored in memory.
    2.  **Execution Phase:** Code is executed line-by-line.

**Senior Interview Q:** "What is Hoisting?"
*Answer:* It's not moving code to the top. It's the memory allocation step during the Creation Phase.

```javascript
console.log(a); // undefined
var a = 5;

console.log(b); // ReferenceError (TDZ)
let b = 10;
```

---

## 2. Closures & Stale Closures
**Concept:** A function bundled with its lexical environment. A function "remembers" variables from where it was created, even after that scope has closed.

**Common Use Cases:** Data privacy (modules), currying, memoization.

**The "Stale Closure" Trap (React Context):**
Occurs when a closure captures an old variable value and isn't recreated when the value changes.

```javascript
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        getCount: () => count
    };
}
const counter = createCounter(); // `count` is private
```

**Interview Drill:**
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (shared `i` variable)

// Fix 1: let (block scope)
for (let i = 0; i < 3; i++) ...

// Fix 2: IIFE (creates new scope)
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(() => console.log(j), 100);
    })(i);
}
```

---

## 3. Event Loop & Async (Micro vs Macro)
**Stack:** Synchronous code.
**Heap:** Memory allocation.
**Queue:**
1.  **Microtask Queue (High Priority):** Promises (`.then`, `.catch`), `queueMicrotask`, `MutationObserver`.
2.  **Macrotask Queue (Low Priority):** `setTimeout`, `setInterval`, `setImmediate`, I/O, UI Rendering.

**Rule:** The Event Loop checks: *Is Stack empty? Yes -> Run ALL Microtasks -> Run ONE Macrotask -> Render -> Repeat.*

**Prediction Drill:**
```javascript
console.log('1'); // Sync

setTimeout(() => console.log('2'), 0); // Macro

Promise.resolve().then(() => console.log('3')); // Micro

console.log('4'); // Sync

// Order: 1, 4, 3, 2
```

---

## 4. `this` Keyword
Value depends on **call site** (how function is invoked).

1.  **Default Binding:** `func()` -> `window` (or `undefined` in strict mode).
2.  **Implicit Binding:** `obj.func()` -> `obj`.
3.  **Explicit Binding:** `func.call(ctx)`, `.apply(ctx)`, `.bind(ctx)`.
4.  **New Binding:** `new func()` -> new empty object.
5.  **Arrow Functions:** Lexical `this` (inherits from parent scope).

**Gotcha:**
```javascript
const obj = {
    name: 'Shubham',
    print: function() { console.log(this.name); },
    printArrow: () => { console.log(this.name); }
};

obj.print(); // 'Shubham'
obj.printArrow(); // undefined (inherits global scope)

const loosePrint = obj.print;
loosePrint(); // undefined (lost context)
```

---

## 5. Promises & Async/Await
**States:** Pending, Fulfilled, Rejected.

**Parallel Execution:**
- `Promise.all([p1, p2])`: Fails fast if one fails.
- `Promise.allSettled([p1, p2])`: Waits for all, returns status objects.
- `Promise.race([p1, p2])`: First one to settle (win or fail).

**Async/Await Error Handling:**
Always use `try/catch`.

```javascript
// Sequential (Slow)
const a = await getA();
const b = await getB();

// Parallel (Fast)
const [a, b] = await Promise.all([getA(), getB()]);
```

---

## 6. Prototypes & Inheritance
**Concept:** JS objects inherit properties/methods from `__proto__`.
**Prototype Chain:** `obj -> obj.__proto__ -> Object.prototype -> null`.

```javascript
function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { console.log('Woof'); }

const d = new Dog('Rex');
// d.bark() looks at d (no), then Dog.prototype (yes).
```
**ES6 Class:** Syntactic sugar over this prototype pattern.

---

## 7. ES6+ Quick Hits
- **Generators (`function*`)**: Pausable functions. Used in Redux-Saga.
- **Proxy**: Intercept object operations (get, set). Used in Vue 3, MobX.
- **WeakMap/WeakSet**: Keys are objects, weakly held (allows Garbage Collection). Good for caching or private data.






