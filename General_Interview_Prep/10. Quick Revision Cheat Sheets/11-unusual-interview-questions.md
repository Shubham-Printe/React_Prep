# Unusual React & JavaScript Interview Questions

## Summary
Oddball questions that probe edge cases, mental models, and real-world debugging instincts.

## React Oddballs
- Why does React warn about keys when the UI still "looks fine"?
- When can changing a component key cause a full remount?
- What happens if you call setState during render?
- Why doesn't React batch updates inside setTimeout by default (older versions)?
- How can a memoized child still re-render even if props look identical?
- What does `useEffect` run order look like in nested component trees?
- What happens if you update state in a cleanup function?
- Why can StrictMode make effects run twice in development?
- When is `useLayoutEffect` required, and what breaks without it?
- Why does `useRef` not trigger re-renders but `useState` does?
- What happens if you mutate state directly and then call setState with the same object?
- Can a component render even if its parent didn't re-render?

## State, Effects, and Render Traps
- Why can adding a function to an effect dependency array create an infinite loop?
- What is a "stale closure" and how does it show up in callbacks?
- Why can `setState(prev => ...)` be safer than `setState(value)`?
- How do you prevent an effect from running on first render without an `if`?
- What happens if you call `setState` after a component unmounts?
- Why does `useMemo` not guarantee memoization across renders?
- When is `useCallback` a pessimization?

## JavaScript Edge Cases
- What does `typeof null` return and why?
- Why does `[] + []` yield an empty string?
- Explain `0.1 + 0.2 !== 0.3`.
- What is the output of `NaN === NaN` and why?
- Why does `parseInt("08")` behave differently in older JS engines?
- What happens with `Promise.resolve().then(...)` vs `setTimeout(..., 0)`?
- Why can `for...in` be dangerous on arrays?
- What is the difference between `Object.is` and `===`?
- Why does `this` change inside a regular function but not an arrow function?
- What happens if you `await` a non-Promise?

## Browser/DOM Oddities
- Why can a click handler run even after a component has unmounted?
- What happens if you read layout (e.g., `offsetHeight`) after a style change?
- Why do passive event listeners change scroll performance?
- Why does `position: sticky` not work in some overflow contexts?
- What is the difference between `display: none` and `visibility: hidden` for layout?
- Why can `contenteditable` break controlled inputs?

## Performance and Rendering Curiosities
- Why does a long list re-render when only one item changes?
- What is "layout thrashing" and how does React contribute to it?
- How can a memoized selector still be slow?
- Why do frequent state updates cause dropped frames even with small components?
- What happens when React suspends and then resumes a render?

## Testing/Tooling Curiosities
- Why can `act(...)` warnings appear even when tests pass?
- Why do tests pass individually but fail in a suite?
- When should you prefer `userEvent` over `fireEvent`?
- Why can snapshots hide assumptions about behavior?

## Checklist
- [ ] Explain at least 3 React re-render gotchas without code
- [ ] Explain 3 JS edge-case outputs with reasoning
- [ ] Describe 2 browser layout/perf pitfalls and fixes

