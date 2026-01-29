# React Patterns & Hooks (The "Must Know")

**Goal:** Quick refresher on the tricky parts of React that interviewers love to drill.

## 1. The Golden Rules of Hooks
1.  **Top Level Only:** Don't call hooks inside loops, conditions, or nested functions.
2.  **React Functions Only:** Call them from React Components or Custom Hooks.

---

## 2. `useEffect` & Lifecycle
*The most common source of bugs.*

```javascript
useEffect(() => {
  // 1. Setup (Runs after render)
  const subscription = source.subscribe();

  // 2. Cleanup (Runs before next effect OR on unmount)
  return () => {
    subscription.unsubscribe();
  };
}, [dependencies]); // 3. Dependency Array
```

| Dependency Array | Behavior |
| :--- | :--- |
| **`[]`** (Empty) | Runs **ONCE** (Mount & Unmount). Like `componentDidMount`. |
| **`[prop, state]`** | Runs on Mount + whenever `prop` or `state` changes. |
| **(Missing)** | Runs **EVERY** render. (Usually bad). |

**Interview Trap:** "Why is my effect running in an infinite loop?"
*Answer:* You are updating a state inside the effect that is also in the dependency array (or an object/array reference is changing on every render).

---

## 3. Performance (`useMemo` vs `useCallback`)
*Used to maintain Referencial Equality.*

### `useMemo` (Cache a **Value**)
Use when a calculation is expensive OR you need a stable object reference for a dependency array.
```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### `useCallback` (Cache a **Function**)
Use when you pass a function to a memoized child component (so the child doesn't re-render unnecessarily).
```javascript
const handleClick = useCallback(() => {
  doSomething(a);
}, [a]);
```

**Key Difference:** `useMemo` calls the function and returns the result. `useCallback` returns the function itself.

---

## 4. Custom Hooks
*The standard for code reuse.*

**Pattern:** Extract logic (state + effects) into a function starting with `use`.
```javascript
// useWindowSize.js
function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

---

## 5. Context API (State Management)
*Avoid Prop Drilling.*

1.  **Create:** `const MyContext = createContext(defaultValue);`
2.  **Provide:** Wrap parent with `<MyContext.Provider value={...}>`
3.  **Consume:** Inside child, `const value = useContext(MyContext);`

**Interview Warning:** "Does Context replace Redux?"
*Answer:* Not necessarily. Context is for **passing** data (dependency injection), Redux/Zustand is for **managing** complex state updates and logic. Context updates trigger re-renders in ALL consumers.

---

## 6. React.memo
*Prevents re-renders if props haven't changed.*

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```
*Note:* Only does a shallow comparison of props. If you pass a new object/function reference, it will still re-render (unless you use `useMemo`/`useCallback` in the parent).




