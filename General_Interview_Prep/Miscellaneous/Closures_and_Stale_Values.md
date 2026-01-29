# Closures & Stale Values: The Complete Guide

**The Core Concept**: A closure gives a function access to its outer scope.
*   **Crucial Detail**: Closures capture **Variables (References)**, not **Values**.
*   **Exception**: If the variable itself is constant (like in React renders), it *effectively* captures the value.

---

## 1. The Standard JS Behavior (Live Reference)

In vanilla JS, if a variable is mutable (`let`), the closure sees the *current* value, not the value when the function was created.

```javascript
function createCounter() {
  let count = 0; // Mutable variable
  
  const log = () => console.log(count);
  const increment = () => count++;
  
  return { log, increment };
}

const c = createCounter();

// Scenario: Async Execution
setTimeout(c.log, 1000); // Schedules log()
c.increment();           // Updates count to 1 immediately

// Output after 1s: 1
// Why? 'log' looks at the 'count' variable, which is now 1.
```

---

## 2. The "Stale Closure" Trap (React)

In React functional components, variables are `const` per render. A closure captures the `count` **of that specific render**.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  const handleAlert = () => {
    setTimeout(() => {
      console.log(count); // Captures 'count' from Render #1 (which is 0)
    }, 3000);
  };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleAlert}>Alert</button>
    </>
  );
}
```

**Scenario**:
1.  Count is `0`. User clicks "Alert". `setTimeout` is scheduled with `count = 0`.
2.  User clicks "Increment". React re-renders.
    *   **New Render**: `count` is now `1`.
    *   But the `setTimeout` from Render #1 is still holding onto the `count` variable from Render #1.
3.  **Result**: Alert prints `0`.

**The Fix**: Use `useRef` (which is a mutable object that survives renders) if you need the *live* value inside an old closure.

---

## 3. The Loop Trap (`var` vs `let`)

```javascript
// CASE A: var (Function Scope)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3
// Why? There is only ONE 'i' variable shared by all 3 timeouts.

// CASE B: let (Block Scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2
// Why? JS creates a NEW 'i' variable for every iteration loop.
```

---

## 4. The "Double Closure" Trick

Sometimes used in interviews to test scope chains.

```javascript
function outer() {
  let x = 10;
  function inner() {
    let y = 20;
    return function deeplyNested() {
      console.log(x + y);
    }
  }
  return inner();
}

const fn = outer();
fn(); // Output: 30
// 'deeplyNested' remembers 'y' (from inner) AND 'x' (from outer).
```








