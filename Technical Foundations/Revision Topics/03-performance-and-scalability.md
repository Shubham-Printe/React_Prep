## Performance & Scalability

- [ ] Renders vs commits; React Profiler usage and flamegraphs
- [ ] Avoiding unnecessary re-renders: memoization, referential stability
- [ ] `React.memo`, `memo` with props comparators; trade-offs
- [ ] Expensive computation hoisting, worker offloading
- [ ] Windowing/virtualization (react-window, react-virtual, react-virtualized)
- [ ] Code-splitting: `React.lazy`, `Suspense`, route- and component-level splits
- [ ] Bundle analysis: source maps, Webpack/ESBuild/Vite analyzers, budgets
- [ ] Tree-shaking: sideEffects, module format (ESM), dead code elimination
- [ ] Image performance: responsive, lazy-load, preloads; `next/image`
- [ ] Web Vitals: LCP, CLS, INP; hydration and interaction latency

---

### Renders vs commits and profiling
“Render” is React computing what the UI should look like; “commit” is React applying changes to the DOM. Both cost time. Use React Profiler (DevTools) to measure render durations, identify frequent renders, and inspect prop changes. For production investigations, enable user timing markers or integrate a performance budget tracker.

---

### Avoiding unnecessary re-renders
Keep props stable when their meaning hasn’t changed. Use `useCallback` for stable event handlers passed to memoized children and `useMemo` for derived values with costly computation. Avoid passing new object/array literals each render when they cause child equality checks to fail.

---

### React.memo and custom comparators
Wrap pure presentational components with `React.memo` to skip re-renders when props are shallowly equal. For complex props, you may provide a custom comparator, but ensure it’s fast. Don’t memoize components that rely heavily on context or internal state changes—they’ll re-render anyway.

---

### Hoisting work and using workers
Move expensive calculations out of render paths, cache results, or perform them in Web Workers to keep the main thread responsive. For CPU-heavy parsing or image processing, offload to a worker and stream results back to React components via state updates.

---

### Windowing/virtualization
Render only visible items of long lists using libraries like `react-window` or `react-virtual`. This reduces DOM nodes and render cost significantly. Size items predictably or provide measurement for dynamic sizes. Combine with `Suspense`/placeholders for smooth loading.

---

### Code-splitting with Suspense
Split bundles by route or component using `React.lazy` and dynamic imports. Show fallbacks via `Suspense` while chunks load. Keep critical routes lean and prefetch likely next routes. In frameworks like Next.js, prefer built-in code-splitting and streaming for best UX.

---

### Bundle analysis and budgets
Analyze bundles with tools (Vite/webpack analyzers). Watch for duplicate libraries and large polyfills. Set budgets to catch regressions in CI. Prefer ESM, remove dead code paths, and mark pure modules to enhance tree-shaking.

---

### Tree-shaking and module hygiene
Ensure dependencies ship ESM and avoid side-effectful top-level code. Configure `"sideEffects": false` correctly in packages and import only what you use. Beware of wildcard imports that pull large subtrees.

---

### Image performance
Serve appropriately sized images, use modern formats (WebP/AVIF), and lazy-load below-the-fold assets. Preload critical LCP images and set explicit width/height to prevent layout shifts. In Next.js, prefer `next/image` with responsive `sizes`.

---

### Web Vitals focus: LCP, CLS, INP
- LCP (Largest Contentful Paint): prioritize critical content, inline critical CSS, preload primary image/font, avoid render-blocking JS.
- CLS (Cumulative Layout Shift): reserve space for media, avoid late-loading ads causing shifts, stabilize fonts with `font-display: optional|swap` and size hints.
- INP (Interaction to Next Paint): keep event handlers light, split heavy work via workers or transitions, and avoid synchronous layout reads in hot paths.


