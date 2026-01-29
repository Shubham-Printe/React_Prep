# JavaScript & React Interview Drill (Barclays Prep)

This document contains 60+ rapid-fire questions covering "Gotchas", internal mechanics, and code output scenarios tailored for HackerEarth-style tests.

---

## ⚡️ Section 1: JavaScript "Gotchas" & Internals

### 1. Global Leakage (Assignment Chaining)
```javascript
function foo() {
  let x = y = 0; // Parsed as: y = 0 (Global); let x = y;
  x++; y++;
  return x;
}
foo();
console.log(typeof x); // "undefined" (local scope)
console.log(typeof y); // "number" (leaked to global)
```
**Fix**: `let x = 0, y = 0;` or `"use strict"`.

### 2. Array Sorting (Stringification Trap)
```javascript
[1, 20, 3].sort(); // Result: [1, 20, 3]
// Why? Default sort converts to Strings. "20" < "3".
```
**Fix**: `arr.sort((a, b) => a - b);` (Must return number, not boolean).

### 3. Floating Point Math
```javascript
0.1 + 0.2 === 0.3; // FALSE (Result is 0.30000000000000004)
```
**Fix**: `Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON`

### 4. Array Filling (Reference Trap)
```javascript
const arr = new Array(3).fill([]); 
// arr is [[], [], []] but they all point to the SAME array in memory!
arr[0].push(5);
console.log(arr); // [[5], [5], [5]]
```
**Fix**: `Array.from({ length: 3 }, () => [])`

### 5. `this` Context (Regular vs Arrow)
```javascript
const obj = {
  name: "Me",
  reg: function() { return this.name; }, // "Me"
  arr: () => this.name // undefined (Window scope)
};
```

### 6. Mutation Cheat Sheet
*   **Mutates**: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.
*   **Safe (Returns New)**: `map`, `filter`, `reduce`, `slice`, `concat`, `toSorted`, `toReversed`.

---

## ⚛️ Section 2: React & Hooks Nuances

### 1. Stale Closures (The `setTimeout` Trap)
```javascript
function App() {
  const [count, setCount] = useState(0);
  
  const log = () => {
    setTimeout(() => console.log(count), 3000);
  };
  // If you click log(), then increment count to 5...
  // The log will still print 0.
}
```
**Why?** The closure captured `count` from the render where `log` was called.

### 2. Dependency Array Infinite Loop
```javascript
useEffect(() => {
  setObj({ id: 1 }); // Creates NEW object reference every time
}, [obj]); // Dependencies change -> Loop
```
**Fix**: `useMemo`, depend on `obj.id`, or move object outside component.

### 3. Key Prop (Index is Bad)
If list changes `['A', 'B']` -> `['B']` (Delete A):
*   `Index 0` was 'A', now `Index 0` is 'B'.
*   React reuses the component at Index 0.
*   **Result**: Inputs/State from 'A' bleed into 'B'.

### 4. Functional State Updates
```javascript
// Risky (might use stale 'count')
setCount(count + 1);

// Safe (always uses pending state)
setCount(prev => prev + 1);
```

---

## 🏗 Section 3: Promises & Async

### 1. Executor is Synchronous
```javascript
console.log('A');
new Promise(resolve => {
  console.log('B'); // Runs immediately!
  resolve();
});
console.log('C');
// Output: A, B, C
```

### 2. `Promise.all` vs `allSettled`
*   **`all`**: Fails fast. If one rejects, everything crashes.
*   **`allSettled`**: Waits for everyone. Returns status for each.

### 3. Event Loop Order
1.  **Sync Code** (A)
2.  **Microtasks** (`Promise.then`, `queueMicrotask`)
3.  **Macrotasks** (`setTimeout`, `setInterval`)

---

## 🧠 Section 4: Logical Operators

| Expression | Result | Reason |
| :--- | :--- | :--- |
| `"" || "default"` | `"default"` | `""` is falsy. |
| `"" ?? "default"` | `""` | `""` is NOT null/undefined. |
| `0 || 10` | `10` | `0` is falsy. |
| `0 ?? 10` | `0` | `0` is NOT null/undefined. |

---

## 🔍 Section 5: Object Keys

```javascript
const a = {}, b = {key:'b'}, c = {key:'c'};
a[b] = 1; // a["[object Object]"] = 1
a[c] = 2; // a["[object Object]"] = 2 (Overwrites!)
console.log(a[b]); // 2
```
**Fix**: Use `Map()` which supports object keys properly.








