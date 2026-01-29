# JavaScript & Frontend Core

## Summary
Language and platform fundamentals commonly tested in frontend interviews.

## Key Concepts
- Event Delegation: one parent listener handles multiple children via bubbling.
- Event Phases: Capturing (top→down), Target (event hits the element), Bubbling (bottom→up, default in React onClick).
- Prototype vs Classes: classes are syntactic sugar over prototypes; call super() before this.
- Deep vs Shallow Copy: structuredClone, _.cloneDeep; 
  - shallow copies only first level (e.g., `{...obj}`, `arr.slice()`); 
  - deep copy duplicates nested objects (e.g., `structuredClone(obj)`, `JSON.parse(JSON.stringify(obj))`).
- Debounce vs Throttle: debounce after pause; throttle at intervals.
- Generators & Iterators: function*, yield; .next() → { value, done } (e.g., `function* gen(){ yield 1; } const it = gen(); it.next();`).
- Browser APIs: Web Workers, IntersectionObserver, Storage APIs.

## Situational Scenarios
- Infinite scroll: IntersectionObserver over scroll listeners.
- Heavy computation: offload to Web Worker.
- Prevent spammy events: debounce search; throttle resize/scroll.

## Code Examples
```js
// Debounce
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}

// Generator + iterator
function* counter() {
  yield 1;
  yield 2;
}
const it = counter();
it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: false }
it.next(); // { value: undefined, done: true }
```

## Pitfalls
- Forgetting to call super() before this in class constructors.
- Using shallow copy where deep copy is required (nested structures).

## JS-Unique Quirks & Gotchas
- `NaN == NaN` is false; use `Number.isNaN(x)`.
- `typeof null` is `"object"` (legacy bug).
- `[] == []` and `{}` == `{}` are false because objects/arrays compare by reference, and these are two different instances.
- `0.1 + 0.2 !== 0.3` because binary floating point cannot represent those decimals exactly (you get `0.30000000000000004`).
- `[] + {}` becomes `"[object Object]"` because `+` coerces both to strings; `{}` + `[]` can be parsed as an empty block `{}` then `+[]` → `0`.
- `null == undefined` is true because `==` does loose equality and treats them as equivalent; `===` is strict and they are different types.

## Output Questions & Gotchas
### Event Loop (Microtasks vs Macrotasks)
**Rule**: Sync Code -> Microtasks (Promises/queueMicrotask) -> Macrotasks (setTimeout/setInterval).
```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);

// Output: 1, 4, 3, 2
```

### Closures in Loops (`var` vs `let`)
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is function-scoped)

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 (let is block-scoped)
```

### Object Reference & Equality
```js
const a = { x: 1 };
const b = { x: 1 };
console.log(a === b); // false

const c = a;
c.x = 2;
console.log(a.x); // 2
```

### `this` Context
**Arrow functions** inherit `this` from the parent. **Regular functions** define `this` based on how they are called.
```js
const obj = {
  val: 10,
  regular: function() { console.log(this.val); },
  arrow: () => { console.log(this.val); }
};

obj.regular(); // 10
obj.arrow();   // undefined (global scope)
```

## Implicit Type Coercion (Examples)
```js
"5" + 1;     // "51"
"5" - 1;     // 4
true + true; // 2
[];          // 0
"";          // 0
{};          // NaN
[] == 0;     // true
"" == 0;     // true
" \t\n" == 0; // true (whitespace trims to "")
```

## Interview Q&A
- How does event delegation work? One handler on parent uses event.target to manage children.
- When to use debounce vs throttle? Debounce for pause-after-typing; throttle for regular intervals.

## References
- MDN: Event phases, Prototypes, Web APIs.

## Checklist
- [ ] Choose correct event strategy (capture vs bubble)
- [ ] Apply right rate-limiting (debounce/throttle)
- [ ] Use platform APIs for performance

