# JavaScript Currying

**Definition**: Currying is the technique of transforming a function that takes multiple arguments `f(a, b, c)` into a sequence of functions that each take a single argument `f(a)(b)(c)`.

## 1. Why use it?

### A. Partial Application (Pre-filling arguments)
You can create specialized versions of general functions.

```javascript
// General function
const multiply = (a) => (b) => a * b;

// Specialized function
const double = multiply(2); 

console.log(double(10)); // 20
console.log(double(5));  // 10
```

### B. Functional Composition
Curried functions are easier to compose (combine) because they accept one argument at a time. This is heavily used in libraries like Ramda or Redux middleware.

---

## 2. Interview Challenge: The "Infinite Currying" Problem

**Question**: Write a function `sum` that can be called infinitely: `sum(1)(2)(3)(4)...` and returns the total when you access it.

**Solution**:
You need to return a function that has a `.toString` or `.valueOf` method overridden.

```javascript
function sum(a) {
  let currentSum = a;
  
  function f(b) {
    currentSum += b;
    return f; // Return self to allow chaining
  }
  
  // When JS tries to convert the function to a primitive (e.g. for logging or math)
  f.toString = () => currentSum;
  
  return f;
}

console.log(sum(1)(2)(3)); // Output: 6
```

---

## 3. The "Dual Mode" Implementation

"Write a sum function that works as both `sum(2,3)` AND `sum(2)(3)`."

```javascript
function sum(x, y) {
  // Case 1: Called with both args sum(2, 3)
  if (arguments.length === 2) {
    return x + y;
  }
  
  // Case 2: Called with one arg sum(2) -> Return a function
  return function(nextArg) {
    return x + nextArg;
  }
}
```








