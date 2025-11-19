## Core React & Rendering

- [ ] Reconciliation algorithm: keys, diffing, when re-mount vs update
- [ ] Virtual DOM vs actual DOM; costs and benefits in modern React
- [ ] JSX compilation and how it maps to `createElement`/runtime
- [ ] Component lifecycle in function components via hooks
- [ ] StrictMode effects: double-invocation in dev, detection of side-effects
- [ ] Controlled vs uncontrolled components (inputs, forms)
- [ ] Lifting state up and state colocations principles
- [ ] Conditional rendering patterns and short-circuit pitfalls
- [ ] Lists: stable keys, index-as-key tradeoffs

### Reconciliation, keys, diffing — nominal detail
- React reconciliation compares the previous and next element trees and applies minimal DOM operations.
- Same element type → props are updated in place; different type → previous subtree unmounts and a new one mounts.
- Keys let React match children across renders in O(n). Stable, unique keys prevent incorrect reordering and state loss.
- Re-mount happens when the element type or its `key` changes. Updates happen when the type and key are the same.
- Avoid using array index as a key if items can be re-ordered, inserted, removed, or are stateful/interactive.
- Changing a component’s `key` intentionally resets its internal state (useful to “restart” a subtree).

Q&A
- Q: What exactly triggers a re-mount instead of an update?
  - A: A different element type (e.g., `div` → `span`, `ComponentA` → `ComponentB`) or a changed `key` value.
- Q: How do keys affect component state?
  - A: React associates state with the element’s position and `key`. Wrong/unstable keys can shuffle or lose state.
- Q: When is index-as-key acceptable?
  - A: Static lists that never re-order/filter and are not interactive. Otherwise, prefer a stable ID.
- Q: How does React diff lists efficiently?
  - A: It matches children by keys linearly and computes insert/move/delete ops; it doesn’t do deep tree reordering guesses.
- Q: How can I force a subtree to reset?
  - A: Change its `key` so React unmounts the old subtree and mounts a fresh one.

Deeper mental model:
- Identity = element type + optional key. Same identity → update path; different identity → unmount/mount.
    - Every React element has a type (div, MyComponent, etc.) and optionally a key (for lists).
    - Same identity → update path: If both type and key match the previous element, React reuses the existing component and updates it (preserving state, refs, etc.).
    - Different identity → unmount/mount: If type or key changes, React throws away the old component and mounts a new one from scratch (state is lost).

- Same host element type (e.g., `div`): React updates attributes and children; text nodes diff by content.
    - “Host elements” are the built-in HTML elements like div, span, input.
    - If React sees the same type (div) at the same position:
        - It updates attributes and children (doesn’t throw away the DOM node).
        - Text nodes are compared by content; if the string changes, React updates the text.

- Same component function/class: state and effects are preserved; props change triggers re-render; effects re-run per rules.
    - For a component created with a function or class, React keeps its state and effects as long as the component identity (type + key) stays the same.
    - If props change, React re-renders it, but:
        - State is preserved (useState, this.state).
        - Effects run according to their dependency array rules.
- Conditional branches that swap types (e.g., `isOpen ? <Modal/> : <div/>`) cause remounts when identity changes.
    - If you render different types in a conditional, React remounts the new element because its identity changed.
    - If isOpen changes:
        - From true → false: <Modal> is removed, <div> is mounted.
        - Local state in <Modal> is lost on unmount.

List diff rules (practical)
- Keys are compared among siblings only (key scope is the immediate array/iterator you render).
    - Scope: Keys are only meaningful within the same array or iterator. React does not compare keys across different lists or nested trees.
    - If you have multiple lists rendered separately, the same key in one list is completely unrelated to the same key in another list.

- Missing old key → insert; missing new key → delete; existing key at new index → treat as move.
    - React compares old keys vs new keys in the same sibling array:
        - Old key missing in new list → remove the old element.
        - New key missing in old list → create a new element.
        - Key exists in both old and new lists but at a different index → move the element.

- React’s heuristic is O(n); it will not search for optimal minimal operations across deep subtrees.
    - React uses a simple linear algorithm for list reconciliation.
    - It does not try to find the optimal minimal set of DOM operations across deep trees.

Key stability guidelines
- Use a stable unique key from data (e.g., database ID). Do not derive keys from transient values that can change between renders.
- Duplicate keys within a list cause incorrect matching and state bleed; ensure uniqueness per sibling set.
- Index-as-key is okay for append-only static lists without reordering, filtering, or removal and with no per-item local state.

Examples
Bad: index as key with interactive inputs can shuffle user-typed state after reorder/filter.
```jsx
{items.map((item, index) => (
  <input
    key={index}
    value={item.name}
    onChange={e => updateName(index, e.target.value)}
  />
))}
```

Good: stable ID preserves identity across reorder/filter.
```jsx
{items.map(item => (
  <input
    key={item.id}
    value={item.name}
    onChange={e => updateName(item.id, e.target.value)}
  />
))}
```

Force-reset a subtree by changing its key (useful to clear form state).
```jsx
function FormWrapper({ version }) {
  return <Form key={version} />; // switching version remounts Form
}
```

Quick checklist
- Do I rely on stable keys per sibling list? Never duplicate keys.
- Will reordering/filtering happen? If yes, never use index as key.
- Am I intentionally resetting state? If yes, change `key`; if not, keep identity stable.

---

### Virtual DOM vs actual DOM — what and why
React builds a lightweight in-memory tree (the virtual DOM) that mirrors your UI. On each render, React computes the difference between the previous and next trees and applies the minimal set of DOM mutations. This approach centralizes change calculation in JavaScript and avoids many ad‑hoc manual DOM updates that are error‑prone.

In modern React, the virtual DOM also enables scheduling and interruption: updates can be split, paused, or prioritized (e.g., with transitions). The trade‑off is that React must spend time rendering and diffing; if components do heavy work every render, the cost can rival or exceed naïve DOM updates. Keep render work cheap, memoize where appropriate, and avoid unnecessary re-renders.

Q&A
- Q: Is the virtual DOM always faster than direct DOM?  
  - A: No. It’s more about correctness and predictable performance. With well-structured components and minimal re-renders, it performs very well; but pathological re-render patterns can be slow.

---

### JSX compilation and the runtime
JSX is syntactic sugar that compiles to calls into the React runtime. Historically it compiled to `React.createElement(type, props, ...children)`. With the automatic JSX runtime (React 17+), the compiler injects imports from `react/jsx-runtime` and produces calls like `jsx(...)` and `jsxs(...)`, so you don’t need to import React explicitly in files using JSX.

Important details:
- The `key` is a special prop that is used by React during reconciliation and isn’t available in `props.key` inside the component (you access it on the element, not as a normal prop).
- Fragments (`<>...</>`) compile to the fragment symbol with children arrays and no wrapper element.
- TypeScript understands JSX via `JSX.IntrinsicElements` and component prop types; prefer explicit prop types for public components.

Q&A
- Q: Why can’t I read `props.key`?  
  - A: `key` is reserved for React’s internal child identity during reconciliation. Pass a different prop name if you need that value.

---

### Function component lifecycle via hooks
Function components re-run on every render. Hooks let you synchronize with external systems across those renders.
- `useEffect` runs after the commit. It’s for non-blocking side effects such as subscriptions or DOM mutations that don’t affect layout. Return a cleanup function to unsubscribe; React will run cleanup before the next effect run and on unmount.
- `useLayoutEffect` runs after DOM mutations but before the browser paints. Use it when you must read layout and synchronously re-measure or adjust; prefer `useEffect` otherwise to avoid blocking paint.
- `useMemo` and `useCallback` memoize expensive calculations and stable callbacks across renders. They do not prevent renders; they avoid redoing work or changing references unnecessarily.
- `useRef` stores a mutable value that persists across renders without causing re-renders. It’s also used to reference DOM nodes.

Q&A
- Q: Why did my effect run twice in development?  
  - A: StrictMode intentionally mounts, cleans up, and re-mounts effects in dev to surface impure effects. This won’t happen in production.

---

### StrictMode in development
`<React.StrictMode>` adds extra checks in development builds. It intentionally double-invokes render and effect setup/cleanup to reveal side-effects that are not properly isolated or cleaned up. It also warns about deprecated APIs. This behavior does not occur in production. Treat it as a safety net to ensure your components are idempotent and your effects are resilient.

---

### Controlled vs uncontrolled components
Controlled components derive their value from React state (`value`/`checked` controlled by props and updated via `onChange`). They offer a single source of truth and predictable behavior at the cost of more renders on input. Uncontrolled components store their state in the DOM (`defaultValue`/`defaultChecked`, read via refs when needed). They can be more performant for large or fast‑typing inputs but require careful synchronization when the outer state should reset them.

Guidelines:
- Prefer controlled inputs for validation, masking, and cross-field constraints.
- Use uncontrolled where performance is critical and you don’t need to react to each change; drive them with `default*` props and read on submit.

---

### Lifting state up and state colocation
Colocate state with the components that use it to reduce prop drilling, re-renders, and accidental coupling. 
Lift state up only when multiple siblings need to coordinate or share the same source of truth. If lifting causes excessive prop drilling, consider context or a state library. Avoid duplicating derived state; compute on the fly from minimal sources.

Quick checks:
- Is this state truly shared? If not, keep it local.
- Can I derive this value from existing state/props? If yes, don’t store it separately.

---

### Conditional rendering patterns and pitfalls
Use ternaries for mutually exclusive branches and `&&` for simple presence. Be careful with `&&` returning non-boolean values (e.g., `0 && <UI/>` renders `0`), and avoid nested conditionals that hurt readability. Prefer extracting small components for clarity.

Examples:
- Good: `{isOpen ? <Dialog/> : null}` for presence.  
- Good: `{items.length > 0 && <List/>}` when the left-hand side is a boolean.  
- Beware: `{count && <Badge/>}` renders `0` when `count` is zero; use `{count > 0 && <Badge/>}`.

---

### Lists and keys — quick recap
Always provide stable, unique keys per sibling list so React can preserve identity and state. Do not use array indices as keys when order can change, items can be inserted/removed, or items hold interactive state. Change a `key` intentionally to reset a subtree when you need a fresh component state.