# React Fundamentals

## Summary
Core rendering model and scheduling foundations: Virtual DOM, reconciliation, and Fiber.

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

