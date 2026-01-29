# Hoisting & Temporal Dead Zone (TDZ): The Definitive Guide

**The Core Concept**: "Hoisting" is the behavior where variable and function declarations are moved to the top of their scope during the compilation phase, before code execution.

However, **HOW** they are moved (and initialized) differs by type.

---

## 1. The Three Behaviors

| Type | Hoisted? | Initialized? | Access Before Declaration? |
| :--- | :--- | :--- | :--- |
| **`function foo() {}`** | ✅ Yes | ✅ Yes (Full Function) | ✅ Works perfectly |
| **`var x = 1`** | ✅ Yes | ✅ Yes (as `undefined`) | ⚠️ Returns `undefined` |
| **`let x = 1`** | ✅ Yes | ❌ NO (Uninitialized) | ❌ Throws `ReferenceError` (TDZ) |
| **`const x = 1`** | ✅ Yes | ❌ NO (Uninitialized) | ❌ Throws `ReferenceError` (TDZ) |
| **`class X {}`** | ✅ Yes | ❌ NO (Uninitialized) | ❌ Throws `ReferenceError` |

---

## 2. Function Declaration vs Expression

This is the most common interview trap.

### A. Function Declaration (The Good)
```javascript
console.log(sayHi()); // Output: "Hi!"

function sayHi() {
  return "Hi!";
}
```
**Why**: The *entire function body* is hoisted. It is ready to run immediately.

### B. Function Expression (The Bad)
```javascript
console.log(sayBye()); // TypeError: sayBye is not a function

var sayBye = function() {
  return "Bye!";
};
```
**Why**: Only `var sayBye` is hoisted (initialized to `undefined`).
*   Execution Step 1: `sayBye` exists but is `undefined`.
*   Execution Step 2: You try to call `undefined()`. -> **CRASH**.

---

## 3. The Temporal Dead Zone (TDZ)

Why do `let` and `const` crash instead of returning `undefined`?
Because they live in the **TDZ** from the start of the block until the line where they are defined.

```javascript
{
  // TDZ STARTS HERE
  console.log(name); // ReferenceError: Cannot access 'name' before initialization
  
  let name = "Shubham"; // TDZ ENDS HERE
  console.log(name); // "Shubham"
}
```

**Why this is good**: It catches bugs. Using a variable before you define it is usually a mistake. `var` let you get away with it; `let` punishes you.

---

## 4. Interview Challenge

**What is the output?**

```javascript
var a = 1;
function test() {
  console.log(a); 
  var a = 2;
}
test();
```

*   **Result**: `undefined`.
*   **Reason**: Inside `test()`, `var a` is hoisted to the top of the function. It shadows the global `a`. So `console.log` sees the local `a` (which is `undefined` at that line), not the global `1`.








