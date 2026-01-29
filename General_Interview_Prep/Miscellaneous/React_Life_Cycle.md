Excellent choice 👏 — understanding the **React component lifecycle** deeply will give you an edge when reasoning about performance, side effects, data fetching, and debugging unexpected re-renders.

Let’s go step by step, from **mount → update → unmount**, covering both **class components** and **function components (with hooks)** since modern React largely revolves around the latter.

---

# ⚛️ React Component Lifecycle — From Beginning to End

---

## 🧩 1. What Is the Component Lifecycle?

Every React component goes through **three main phases** during its existence:

| Phase          | Description                                              |
| -------------- | -------------------------------------------------------- |
| **Mounting**   | When the component is created and added to the DOM.      |
| **Updating**   | When state, props, or context changes cause a re-render. |
| **Unmounting** | When the component is removed from the DOM.              |

Each phase gives you **hooks** or **methods** to run logic at the right moment.

---

## 🧱 2. Lifecycle in Class Components

Let’s start old-school (still relevant for understanding React under the hood).

### **Mounting Phase**

When a class component is first rendered:

1. **`constructor()`**

   * Initializes state.
   * Binds methods.
   * No side effects here.

   ```js
   constructor(props) {
     super(props);
     this.state = { count: 0 };
   }
   ```

2. **`static getDerivedStateFromProps(props, state)`**

   * Rarely used.
   * Lets you sync state with props.
   * Runs **before every render** (initial + updates).

3. **`render()`**

   * Returns JSX.
   * Should be pure — no side effects or data fetching.

4. **`componentDidMount()`**

   * Runs **once after** the component appears in the DOM.
   * Best place for: API calls, subscriptions, timers, event listeners.

   ```js
   componentDidMount() {
     fetchData();
     window.addEventListener('resize', this.onResize);
   }
   ```

---

### **Updating Phase**

Triggered when:

* Props change
* State changes
* Context changes
* Force update (`forceUpdate()`)

The order:

1. **`static getDerivedStateFromProps()`** *(again)*
2. **`shouldComponentUpdate(nextProps, nextState)`**

   * Lets you prevent re-rendering.

   ```js
   shouldComponentUpdate(nextProps, nextState) {
     return nextState.value !== this.state.value;
   }
   ```
3. **`render()`**
4. **`getSnapshotBeforeUpdate(prevProps, prevState)`**

   * Runs *before* the DOM is updated.
   * Lets you capture values (e.g., scroll position).
5. **`componentDidUpdate(prevProps, prevState, snapshot)`**

   * Runs *after* the DOM updates.
   * Great for reacting to prop/state changes.

---

### **Unmounting Phase**

When the component is removed from the DOM:

1. **`componentWillUnmount()`**

   * Cleanup side effects: timers, subscriptions, event listeners.

   ```js
   componentWillUnmount() {
     window.removeEventListener('resize', this.onResize);
     clearInterval(this.timer);
   }
   ```

---

### 🧭 Summary: Class Component Lifecycle Diagram

```
MOUNTING
↓
constructor()
↓
getDerivedStateFromProps()
↓
render()
↓
componentDidMount()
--------------------------
UPDATING
↓
getDerivedStateFromProps()
↓
shouldComponentUpdate()
↓
render()
↓
getSnapshotBeforeUpdate()
↓
componentDidUpdate()
--------------------------
UNMOUNTING
↓
componentWillUnmount()
```

---

## ⚡ 3. Lifecycle in Function Components (Hooks)

Hooks express the **same lifecycle** more declaratively and simply.

### **Mounting + Updating + Cleanup in one place**

React merges all phases using the `useEffect` hook:

```js
useEffect(() => {
  console.log('Component mounted or updated');

  return () => {
    console.log('Cleanup before unmount or re-run');
  };
}, [dependencies]);
```

Here’s what happens:

| Stage            | When it runs                  | Equivalent (Class)                        |
| ---------------- | ----------------------------- | ----------------------------------------- |
| Effect callback  | After DOM update              | `componentDidMount`, `componentDidUpdate` |
| Cleanup function | Before next effect or unmount | `componentWillUnmount`                    |

---

### **Mount only (run once)**

```js
useEffect(() => {
  console.log('Mounted');
  return () => console.log('Unmounted');
}, []); // empty deps
```

Runs only on **mount** and **unmount** — perfect for:

* Fetching data
* Subscribing to services
* Setting timers

---

### **Run on specific state/prop changes**

```js
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
```

Runs every time `count` changes — great for reacting to updates.

---

### **Run on every render**

```js
useEffect(() => {
  console.log('Runs after every render');
});
```

No dependencies → runs after *every* render cycle.

---

## 🪄 4. Other Related Hooks

| Hook              | Purpose                                                 | Lifecycle Role                  |
| ----------------- | ------------------------------------------------------- | ------------------------------- |
| `useLayoutEffect` | Runs *synchronously* after DOM updates but before paint | like `getSnapshotBeforeUpdate`  |
| `useMemo`         | Caches computed values                                  | optimization during rendering   |
| `useCallback`     | Caches function references                              | prevents unnecessary re-renders |
| `useRef`          | Persists mutable values across renders                  | not tied to lifecycle directly  |

---

## 🔁 5. Common Real-World Patterns

1. **Data Fetching**

   ```js
   useEffect(() => {
     const controller = new AbortController();

     fetch('/api/data', { signal: controller.signal })
       .then(res => res.json())
       .then(setData)
       .catch(err => {
         if (err.name !== 'AbortError') console.error(err);
       });

     return () => controller.abort();
   }, []);
   ```

2. **Subscriptions**

   ```js
   useEffect(() => {
     const id = setInterval(() => console.log('Tick'), 1000);
     return () => clearInterval(id);
   }, []);
   ```

3. **DOM Event Listeners**

   ```js
   useEffect(() => {
     const handleResize = () => console.log(window.innerWidth);
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);
   ```

---

## ⚙️ 6. Summary Table (Hooks vs Class)

| Lifecycle Purpose | Class Component             | Functional Component              |
| ----------------- | --------------------------- | --------------------------------- |
| On mount          | `componentDidMount()`       | `useEffect(..., [])`              |
| On update         | `componentDidUpdate()`      | `useEffect(..., [dep])`           |
| On unmount        | `componentWillUnmount()`    | cleanup function in `useEffect()` |
| Before DOM paint  | `getSnapshotBeforeUpdate()` | `useLayoutEffect()`               |
| Prevent re-render | `shouldComponentUpdate()`   | `React.memo()` or manual logic    |

---

## 🧠 Key Takeaways

* React re-renders are **pure function executions**, not “object updates.”
* In function components, **side effects always go inside `useEffect()`**.
* Cleanup functions run **before unmount or re-running** effects.
* Avoid doing side effects directly in the render body — it breaks purity.
* Understanding when effects run helps avoid bugs like **infinite loops**, **stale closures**, or **memory leaks**.

---
