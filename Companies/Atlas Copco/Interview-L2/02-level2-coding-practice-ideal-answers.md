## Level 2 — Coding Practice (Problem Statements + Ideal Answers)

Target role context: **Atlas Copco (UI/HMI Full-Stack)**. Expect a mix of **DSA-style** + **practical frontend** tasks.

Use this file to practice in “interview mode”:
- Clarify constraints
- State approach + complexity
- Code
- Test quickly with 2–3 examples

---

## DSA 1 — Two Sum (hashmap)

### Problem statement
Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.
- Exactly one solution exists.
- You may not use the same element twice.

### Ideal approach
Scan left → right. Store `value -> index` in a Map. For each `x`, check if `target - x` exists.

### Ideal TypeScript answer

```ts
export function twoSum(nums: number[], target: number): [number, number] {
  // Map: number value -> its index seen so far.
  // As we scan left-to-right, we look for the complement we already saw.
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    const need = target - x;
    const j = seen.get(need);
    // If we saw the needed complement before, we have the pair.
    if (j !== undefined) return [j, i];
    // Store current value for future elements to match against.
    seen.set(x, i);
  }

  // If interviewer says "exactly one solution", this is unreachable.
  throw new Error("No solution");
}
```

### Complexity
- Time: \(O(n)\)
- Space: \(O(n)\)

---

## DSA 2 — Valid Parentheses (stack)

### Problem statement
Given a string `s` containing only `()[]{}`, determine if the input string is valid:
- open brackets must be closed by the same type
- open brackets must be closed in correct order

### Ideal approach
Use a stack of opening brackets. When you see a closing bracket, it must match the latest opening.

### Ideal TypeScript answer

```ts
export function isValidParentheses(s: string): boolean {
  // Stack of opening brackets we still need to close.
  const stack: string[] = [];

  // For any closing bracket, what opening bracket should it match?
  const closeToOpen: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const ch of s) {
    // Push opens; close must match the most recent open (LIFO).
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
      continue;
    }

    const expectedOpen = closeToOpen[ch];
    // If `ch` isn't a recognized closing bracket, input is invalid.
    if (!expectedOpen) return false;

    const top = stack.pop();
    // Mismatch or "closing without opening" (top === undefined) => invalid.
    if (top !== expectedOpen) return false;
  }

  // If anything is left open, it's invalid (e.g. "(((" or "({[").
  return stack.length === 0;
}
```

### Complexity
- Time: \(O(n)\)
- Space: \(O(n)\)

---

## DSA 3 — Longest Substring Without Repeating Characters (sliding window)

### Problem statement
Given a string `s`, find the length of the longest substring without repeating characters.

### Ideal approach
Sliding window with last-seen indices.
- Keep `left` pointer.
- For each `right`, if character was seen inside current window, move `left` to `lastSeen + 1`.

### Ideal TypeScript answer

```ts
export function lengthOfLongestSubstring(s: string): number {
  // lastSeen[ch] = most recent index where `ch` appeared.
  const lastSeen = new Map<string, number>();
  // Window is s[left..right] with all unique characters.
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    const prev = lastSeen.get(ch);

    // If `ch` was seen inside the current window, shrink from the left.
    // Invariant after update: s[left..right] has no duplicates.
    if (prev !== undefined && prev >= left) {
      left = prev + 1;
    }

    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

### Complexity
- Time: \(O(n)\)
- Space: \(O(\min(n, \Sigma))\)

---

## DSA 4 — Merge Intervals (sorting)

### Problem statement
Given an array of intervals `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals and return the merged intervals.

### Ideal approach
Sort by start. Then iterate, merging into an output array by comparing current start to last merged end.

### Ideal TypeScript answer

```ts
export type Interval = [number, number];

export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length <= 1) return intervals.slice();

  // Sort ensures overlaps are adjacent, enabling a single pass merge.
  const sorted = intervals
    .slice()
    .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

  const merged: Interval[] = [];
  let [curStart, curEnd] = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    if (s <= curEnd) {
      // Overlap: extend the current interval.
      curEnd = Math.max(curEnd, e);
    } else {
      // No overlap: commit current, start a new one.
      merged.push([curStart, curEnd]);
      curStart = s;
      curEnd = e;
    }
  }

  // Commit the last built interval.
  merged.push([curStart, curEnd]);
  return merged;
}
```

### Complexity
- Time: \(O(n \log n)\) (sort)
- Space: \(O(n)\) (output)

---

## DSA 5 — Binary Search Template

### Problem statement
Given a sorted array `nums` and a `target`, return the index if found; otherwise return `-1`.

### Ideal approach
Standard two-pointer binary search with `lo <= hi`.

### Ideal TypeScript answer

```ts
export function binarySearch(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;

  // Invariant: if target exists, it lies within [lo, hi].
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const x = nums[mid];

    if (x === target) return mid;
    if (x < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}
```

### Complexity
- Time: \(O(\log n)\)
- Space: \(O(1)\)

---

## Frontend 1 — Implement `debounce`

### Problem statement
Implement `debounce(fn, wait)` which returns a debounced version of `fn`:
- The function is invoked only after it hasn’t been called for `wait` ms.
- Useful for search inputs, resize handlers, etc.

### Live-coding version (minimal)

```js
export function debounce(fn, waitMs) {
  // Store the latest timer so we can reset it on every call.
  let timerId;

  return (...args) => {
    // If called again before `waitMs`, cancel the pending run.
    clearTimeout(timerId);
    // Schedule `fn` to run after the caller stops triggering for `waitMs`.
    timerId = setTimeout(() => fn(...args), waitMs);
  };
}
```

### Complexity
- Time per call: \(O(1)\)
- Space: \(O(1)\)

---

## Frontend 2 — Implement `throttle`

### Problem statement
Implement `throttle(fn, wait)` which returns a throttled version of `fn`:
- Ensures `fn` runs at most once per `wait` ms.
- Useful for scroll handlers, pointer move, etc.

### Live-coding version (minimal, leading-only)

```js
export function throttle(fn, waitMs) {
  // Timestamp of the last time we actually executed `fn`.
  let lastTime = 0;

  return (...args) => {
    const now = Date.now();
    // Only run if enough time has passed since last execution.
    if (now - lastTime >= waitMs) {
      lastTime = now;
      fn(...args);
    }
  };
}
```



---

## Frontend 4 — Small form (controlled inputs + validation + async submit)

### Problem statement
Build a simple form with:
- controlled inputs
- client-side validation
- async submit with loading + server error handling
- accessibility-friendly error display

### Ideal answer (React + JavaScript)

```jsx
import React, { useMemo, useState } from "react";

function validate(values) {
  const errors = {};
  // Normalize user input before validation.
  const email = values.email.trim();
  const amountNum = Number(values.amount);

  if (!email) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email.";

  if (!values.amount.trim()) errors.amount = "Amount is required.";
  else if (!Number.isFinite(amountNum) || amountNum <= 0) errors.amount = "Amount must be > 0.";

  return errors;
}

export function SimplePaymentForm() {
  // Controlled form state.
  const [values, setValues] = useState({ email: "", amount: "" });
  // Track touched fields so we don't show errors before user interacts.
  const [touched, setTouched] = useState({});
  // Prevent double-submit and show progress.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Derive errors from values (pure, deterministic).
  const errors = useMemo(() => validate(values), [values]);
  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting;

  async function onSubmit(e) {
    e.preventDefault();
    setServerError(null);
    // Mark fields touched so validation errors are visible.
    setTouched({ email: true, amount: true });

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 500));
      // success: reset
      setValues({ email: "", amount: "" });
      setTouched({});
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          // Accessibility: expose invalid state + connect to error message.
          aria-invalid={Boolean(touched.email && errors.email)}
          aria-describedby={touched.email && errors.email ? "email-error" : undefined}
        />
        {touched.email && errors.email ? (
          <div id="email-error" role="alert">
            {errors.email}
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          // Helps mobile keyboards show numeric keypad.
          inputMode="decimal"
          value={values.amount}
          onChange={(e) => setValues((v) => ({ ...v, amount: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          aria-invalid={Boolean(touched.amount && errors.amount)}
          aria-describedby={touched.amount && errors.amount ? "amount-error" : undefined}
        />
        {touched.amount && errors.amount ? (
          <div id="amount-error" role="alert">
            {errors.amount}
          </div>
        ) : null}
      </div>

      {serverError ? (
        <div role="alert">
          {serverError}
        </div>
      ) : null}

      <button type="submit" disabled={!canSubmit}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

What interviewers like:
- validation is deterministic
- double-submit prevented (`isSubmitting`)
- accessible error UX (`role="alert"`, `aria-describedby`)
- clean state handling (values/touched/errors)

