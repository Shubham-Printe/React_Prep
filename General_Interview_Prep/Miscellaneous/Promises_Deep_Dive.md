# JavaScript Promises: The Complete API Guide

**The Core Concept**: A Promise is an object representing the eventual completion (or failure) of an asynchronous operation.

### Basic Syntax
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Perform async operation...
  const success = true;

  if (success) {
    resolve("Success Value");
  } else {
    reject("Error Reason");
  }
});
```

---

## 1. The 4 Static Methods (Handling Multiple Promises)

When you have an array of promises (e.g., multiple API calls), how do you coordinate them?

### A. `Promise.all([p1, p2, p3])`
*   **Behavior**: "All or Nothing."
*   **Success**: Resolves only if **ALL** promises resolve. Returns array of values.
*   **Failure**: Rejects **IMMEDIATELY** if **ANY** promise rejects. It does not wait for the others.
*   **Use Case**: Dependent data. You need User AND Settings to render the page. If either fails, show error.

### B. `Promise.allSettled([p1, p2, p3])` (ES2020)
*   **Behavior**: "Wait for Everyone."
*   **Success**: **ALWAYS** resolves after all promises have finished (whether success or fail).
*   **Returns**: An array of objects:
    ```javascript
    [
      { status: 'fulfilled', value: 10 },
      { status: 'rejected', reason: 'Error msg' }
    ]
    ```
*   **Use Case**: Independent data. Dashboard with Widgets. If "Weather Widget" fails, you still want to show "Stock Widget".

### C. `Promise.race([p1, p2, p3])`
*   **Behavior**: "First one wins."
*   **Result**: Resolves or Rejects as soon as the **first** promise settles.
*   **Use Case**: Timeouts. Race a `fetch()` against a 5-second `setTimeout`.

### D. `Promise.any([p1, p2, p3])` (ES2021)
*   **Behavior**: "First SUCCESS wins."
*   **Result**: Resolves as soon as the first promise **fulfills**. Ignores rejections unless *all* reject.
*   **Use Case**: Redundant mirrors. You fetch the same image from Server A, Server B, and Server C. You only need the one that loads fastest.

---

## 2. Promise Chaining & Error Handling

### The Return Rule
*   Whatever you `return` in a `.then()` becomes the value of the *next* `.then()`.
*   If you return a **Promise**, JS waits for it.
*   If you return a **Value**, JS wraps it in a resolved Promise.

### The Catch Rule
*   `.catch()` handles errors from *any* previous step.
*   Crucially: **`.catch()` returns a promise too!**
    *   If you return a value inside `.catch()`, the chain **recovers** and continues to the next `.then()`.
    *   If you want to stop the chain, you must `throw` again inside `.catch()`.

```javascript
api.get()
  .then(data => data.id)
  .then(id => { throw new Error('Oops') }) // Fails here
  .catch(err => {
    console.log(err);
    return 'Backup Value'; // Recovers!
  })
  .then(val => console.log(val)); // Prints "Backup Value"
```

---

## 3. Async/Await (Syntactic Sugar)

*   `async` function always returns a Promise.
*   `await` pauses execution until the Promise resolves.
*   **Error Handling**: Must use `try/catch`.

**Parallelism Trap**:
```javascript
// ❌ Serial (Slow): Waits for A, then starts B
const a = await fetchA();
const b = await fetchB();

// ✅ Parallel (Fast): Starts both, waits for both
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```



