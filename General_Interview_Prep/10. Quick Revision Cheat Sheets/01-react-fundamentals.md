# React Fundamentals

## Summary
Core rendering model and scheduling foundations: Virtual DOM, reconciliation, and Fiber.

## Pros and Cons of React

### Pros
- **Component-Based Architecture:** Encourages reusability, modularity, and easier maintenance of large codebases.
- **Virtual DOM:** Efficiently updates the UI by minimizing direct DOM manipulations, leading to better performance in dynamic applications.
- **Unidirectional Data Flow:** Makes data changes predictable and easier to debug compared to two-way binding.
- **Strong Ecosystem & Community:** Massive library of third-party packages, tools, and extensive community support.
- **Declarative UI:** JSX makes code more readable and easier to reason about (describing *what* the UI should look like, not *how* to update it).
- **Cross-Platform:** Learn Once, Write Anywhere (React Native for mobile, React for web).
- **Backward Compatibility:** Strong commitment to stability; easier upgrades compared to other frameworks.

### Cons
- **High Pace of Change:** The ecosystem evolves rapidly, requiring constant learning to keep up with best practices (e.g., Class vs. Functional, HOCs vs. Hooks).
- **JSX Learning Curve:** Mixing HTML and JavaScript can be confusing for developers used to separation of concerns.
- **"View Library" Only:** Not a full-fledged framework; requires decisions on routing, state management, and build tools (decision fatigue).
- **SEO Challenges (SPA):** Traditional client-side rendering can hurt SEO; requires workarounds like Server-Side Rendering (Next.js) or Prerendering.
- **Prop Drilling:** Passing data deep down the component tree can become cumbersome without state management solutions (Context API, Redux, Zustand).
- **Documentation Fragmentation:** Due to rapid evolution, older tutorials might be outdated (e.g., class components vs. hooks).

## Key Concepts
- Virtual DOM: lightweight JS representation of the real DOM.
- Reconciliation: diffing old vs new Virtual DOM → minimal real DOM updates.
- Keys: critical for stable reconciliation; bad keys cause UI bugs.
- React Fiber: incremental rendering architecture enabling pause/resume/interrupt.
- Basis for concurrent rendering features.

## Situational Scenarios
- Large dynamic lists: pick stable keys from data, never array index if order changes.
- Performance hotspots: structure and keys drive reuse vs recreation during diffing.
- Long tasks blocking UI: Fiber allows interruptible work; combine with concurrent features.

## Code Examples
```jsx
// Bad key example (index can break on reordering)
{items.map((item, idx) => (
  <Row key={idx} item={item} />
))}

// Good: stable unique id from data
{items.map((item) => (
  <Row key={item.id} item={item} />
))}
```

## Pitfalls
- Using unstable keys (index) for reorderable lists.
- Assuming reconciliation always updates in place; structure and keys matter.

## Interview Q&A
- What is Virtual DOM and why? Abstraction for efficient diffing and updates.
- How does reconciliation choose updates? By element type and keys.
- What is React Fiber? A reconciler enabling incremental, interruptible rendering.

## References
- React Docs: Reconciliation, Keys, Render and Commit phases.

## Checklist
- [ ] Keys are stable and unique per list
- [ ] Component structure optimized for minimal diffs
- [ ] Awareness of Fiber and its implications

