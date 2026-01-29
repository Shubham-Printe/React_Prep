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

--------------------------------------------------------------------------------

### Renders vs commits and profiling
“Render” is React computing what the UI should look like; 
“commit” is React applying changes to the DOM. 
Both cost time. 
Use React Profiler (DevTools) to measure render durations, identify frequent renders, and inspect prop changes. For production investigations, enable user timing markers or integrate a performance budget tracker.

#### Profiler views: general reading guide (use for any app)
- Timeline: each “Commit” bar shows total time for a render pass. Long bars = slow commits. Drag the commit slider to inspect each commit; target the longest first.
- Flamegraph: rectangles are components in the selected commit. Color intensity = render cost this commit; gray = did not render. Width ≈ total time including children (inclusive). Wide and hot bars point to bottlenecks.
- Ranked: a flat list sorted by render time in the selected commit. The top items are the worst offenders to fix first.
- Right panel (component details): shows Self time (time in the component itself) vs Total time (self + children), and (if enabled) Why did this render? (props/state/hooks). Use this to decide: memoize component, stabilize props, or move heavy work.
- Quick triage flow:
  1) Start profiling, reproduce the slow action. 2) Pick the longest commit in Timeline. 3) In Flamegraph/Ranked, find the hottest components. 4) For each, inspect Self vs Total time and “Why did this render?” 5) Apply targeted fixes. 6) Re-profile.

#### Hands-on: React Profiler demo (from slow to fast)
Use the demo to practice, but for revision keep this procedure:
1. Open React DevTools → Profiler.
2. Profile a slow interaction. Pick the longest Commit in Timeline.
3. In Flamegraph/Ranked, find hottest components.
4. For each, check Self vs Total time and “Why did this render?”.
5. Apply fixes: memoize components, stabilize props, move heavy work out of render, or virtualize long lists.

Color legend and key readings
- Colors: hotter = slower render this commit; gray = skipped.
- Width (Flamegraph): ~total time including children. Wide + hot = bottleneck.
- Right panel: check Self vs Total time to see where work occurs.

Checklist when you see red flags in Profiler:
- Are child components memoized where appropriate (`React.memo`)?
- Are you passing stable props? Avoid new object/array/function literals each render. Use `useMemo`/`useCallback`.
- Is heavy work happening during render? Move to `useMemo`, hoist it, or offload to a worker.
- Are you rendering too many DOM nodes? Use virtualization for large lists.
- Do unrelated state updates trigger wide re-renders? Split state/contexts so only relevant subtrees update.

--------------------------------------------------------------------------------

## Avoiding unnecessary re-renders
Keep props stable when their meaning hasn’t changed:
- When it matters: children wrapped in `React.memo` (or lists of rows/cards). Shallow prop equality is used; new object/function identities force re-renders.
- Stabilize what? Objects (e.g. `style`, `config`, `options`), arrays (e.g. `columns`), and functions (event handlers).
- How:
  - Use `useMemo` for object/array/derived values; include only the true dependencies.
  - Use `useCallback` for handlers passed to memoized children; keep deps minimal (prefer state setters which are stable).
  - Hoist truly static constants outside the component (no hooks needed).
- Don’t:
  - Blanket-wrap everything with `useMemo`/`useCallback`. Measure; remove where unnecessary.
  - Capture changing values in deps accidentally; that defeats stability.
- Alternatives:
  - Pass primitives instead of objects where possible (e.g., `variant="primary"` instead of `{ variant: 'primary' }`).
  - Pass an `id` and let the child look up stable data from context/store.
  - Use a cheap custom comparator only if props are complex and stable identities are impractical.
- Red flags in Profiler: frequent re-renders of memoized children; “Props changed: onClick/rowStyle/options”.

--------------------------------------------------------------------------------

## React.memo and custom comparators
Use `React.memo` for pure components that often receive the same props.
- Why is this needed?
  - Unnecessary re-renders waste time when props are unchanged (common in lists, dashboards, and deeply nested trees). Skipping these saves CPU and shortens commits.
- How it works (brief)
  - `React.memo` does shallow prop equality per render. Objects/functions must keep the same identity for a skip. You can provide `areEqual(prev, next)` to customize the comparison (keep it very cheap).
  - Works best when parents pass stable props via `useMemo`/`useCallback` and when children are pure/presentational.
- How it solves the problem
  - Prevents child renders when inputs didn’t change. In Profiler you’ll see more gray (skipped) nodes and shorter commit times, especially in long lists.
- Exceptions & miscellaneous
  - Don’t wrap components driven by frequent local state or context—they’ll render anyway.
  - Avoid memo for tiny components where overhead > savings, or where props always change.
  - Keep `areEqual` simple (O(1) checks of a few keys). If you need deep equal, stabilize upstream instead.
  - Pair with virtualization and prop stability for multiplicative gains.

```tsx
// Only re-render Row if id or selected change
export default React.memo(Row, (prev, next) => (
  prev.id === next.id && prev.selected === next.selected
));
```

--------------------------------------------------------------------------------

## Hoisting work and using workers
Move expensive calculations out of render paths, cache results, or run them in Web Workers to keep the UI responsive.
- Why is this needed?
  - The browser’s main thread handles input, animation, and painting. CPU-heavy work (e.g., large JSON parsing, image processing, crypto, sorting millions of items) blocks it, causing jank, frozen typing, and missed clicks.
- How it works (brief)
  - A Web Worker runs JavaScript on a separate thread. You create a worker module and communicate via `postMessage`/`onmessage`. Data is copied (structured clone) or transferred (Transferables like `ArrayBuffer`). Long tasks can check a shared “abort” flag to support cooperative cancellation.
  - In Vite: `new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })`.
- How it solves the problem
  - Heavy computation runs off the main thread so the UI stays interactive (typing, scrolling, animations) while work proceeds. The main thread just sends/receives small messages; you can show progress/spinners and let users continue interacting.
- Exceptions & miscellaneous
  - Workers can’t touch the DOM directly. For small tasks, worker overhead can outweigh benefits—measure first.
  - Message passing copies data; for big binary payloads use Transferables to avoid copies.
  - Cancel options: `worker.terminate()` (hard stop) or a cooperative abort flag inside the worker (soft stop).
  - If the issue is not CPU (e.g., frequent re-renders), workers won’t help; stabilize props, memoize, or virtualize instead.
  - For extreme CPU tasks, consider WebAssembly or native-optimized libraries.
- Also: hoisting without workers
  - Use `useMemo` to cache derived values, precompute outside render where possible, and defer low-priority work to idle (`requestIdleCallback`) if acceptable.

--------------------------------------------------------------------------------

## Windowing/virtualization
Render only the visible items of long lists using `react-window` or `react-virtual`.
- Why is this needed?
  - Rendering thousands of DOM nodes is expensive (layout/paint/memory). Large lists slow initial render and scrolling, and cause long commits.
- How it works (brief)
  - A virtualizer renders a “window” of items around the viewport and recycles DOM nodes as you scroll. Use overscan (small buffer) to avoid blank gaps. Choose fixed-size lists for simplicity/throughput; use variable-size lists with `getItemSize` or measurement when rows differ.
  - Provide a stable `itemKey` so recycled nodes keep focus/ARIA semantics correct.
- How it solves the problem
  - Limits DOM size and render work to what’s on-screen (O(visible) instead of O(total)). This keeps scrolling smooth and commit times short even for very large data sets.
- Exceptions & miscellaneous
  - Sticky headers/footers and certain footers should be outside the virtualized region.
  - Preserve scroll position on updates; beware jumps when prepending/appending—record/restore offsets.
  - Dynamic media: reserve space or measure after load to prevent size thrash.
  - For wide tables, add column virtualization; for SSR/SEO-heavy pages, consider progressive rendering or pagination instead.
  - Pair with `React.memo` rows and stable props to maximize skips; use `Suspense`/placeholders while loading data.

--------------------------------------------------------------------------------

## Code-splitting with Suspense
Split bundles by route or component using `React.lazy` and dynamic imports. Show fallbacks via `Suspense` while chunks load. Keep critical routes lean and prefetch likely next routes. In frameworks like Next.js, prefer built-in code-splitting and streaming for best UX.

- Why is this needed?
  - A single large JavaScript bundle slows down the initial load (TBT/LCP). Users download code for pages/features they might never visit.
- How it works (brief)
  - `React.lazy(() => import('./Component'))` dynamically imports a module. Webpack/Vite splits this into a separate chunk. React suspends rendering of that component tree until the network request finishes, showing the nearest `<Suspense fallback={<Spinner />}>`.
- How it solves the problem
  - Reduces the main bundle size, speeding up the initial load. Code is downloaded on demand (lazy-loaded).
- Exceptions & miscellaneous
  - Do not lazy load "above the fold" critical UI (causes layout shifts/pop-in).
  - Wrap lazy components in Error Boundaries to handle network failures (chunk load errors).
  - Use `startTransition` to prevent fallback UI from hiding existing content during navigation updates.

--------------------------------------------------------------------------------

## Bundle analysis and budgets
Analyze bundles with tools (Vite/webpack analyzers). Watch for duplicate libraries and large polyfills. Set budgets to catch regressions in CI. Prefer ESM, remove dead code paths, and mark pure modules to enhance tree-shaking.

- Why is this needed?
  - Dependencies can silently grow, introducing duplicate packages (e.g., multiple versions of lodash) or large polyfills. This bloats the bundle, increasing download/parse time.
- How it works (brief)
  - Tools like `webpack-bundle-analyzer` or `rollup-plugin-visualizer` generate interactive treemaps of your output chunks. "Performance budgets" (in webpack or Lighthouse) warn/error if asset sizes exceed defined limits (e.g., 200kb initial JS).
- How it solves the problem
  - Visualizers identify "fat" dependencies to replace or tree-shake. Budgets prevent accidental regressions in CI/CD by failing builds when limits are crossed.
- Exceptions & miscellaneous
  - Sometimes large libraries (like Three.js or huge chart libs) are unavoidable; isolate them into a separate lazy-loaded chunk so they don't block the main thread.

### Hands-on Analysis Recipe
I have created a dedicated laboratory for this in `Bundle_Lab/`.

1.  **Install:** `npm install --save-dev rollup-plugin-visualizer`
2.  **Config:** Add it to `vite.config.ts`:
    ```ts
    import { visualizer } from 'rollup-plugin-visualizer';
    export default defineConfig({
      plugins: [react(), visualizer({ open: true, filename: 'stats.html', gzipSize: true })]
    });
    ```
3.  **Run:** `npm run build` (analyzers only run on production builds).
4.  **View:** Open the generated `stats.html`.

- [Link to Bundle Lab App Code](../../Bundle_Lab/src/App.tsx) (See Good vs Bad practices)


--------------------------------------------------------------------------------

## Tree-shaking and module hygiene
Ensure dependencies ship ESM and avoid side-effectful top-level code. Configure `"sideEffects": false` correctly in packages and import only what you use. Beware of wildcard imports that pull large subtrees.

- Why is this needed?
  - "Dead code" (library functions you never call) shouldn't be in your bundle. Monolithic libraries often trap unused code if not structured for tree-shaking.
- How it works (brief)
  - Bundlers (Webpack/Rollup) rely on ES Modules (`import`/`export`) static structure. They mark exported functions that are never imported/used and remove them from the final output.
- How it solves the problem
  - Drastically reduces bundle size. For example, importing `{ capitalize }` from `lodash-es` includes only ~1kb instead of the full library.
- Exceptions & miscellaneous
  - **Common Trap:** Importing from the root of a CommonJS library (e.g., `import { join } from 'path'` or standard `lodash`) often breaks tree-shaking. Use "sub-path imports" (e.g., `lodash/join`) or ESM alternatives (`lodash-es`).
  - **Side Effects:** Code that runs immediately on import (e.g., polyfills, CSS injections) cannot be safely removed even if unused.

--------------------------------------------------------------------------------

## Image performance
Serve appropriately sized images, use modern formats (WebP/AVIF), and lazy-load below-the-fold assets. Preload critical LCP images and set explicit width/height to prevent layout shifts. In Next.js, prefer `next/image` with responsive `sizes`.

- Why is this needed?
  - Images often account for 50%+ of page weight. Large/unoptimized images block the main thread (decoding) and delay LCP. Layout shifts (CLS) occur if dimensions aren't reserved.
- How it works (brief)
  - **Lazy-loading:** `loading="lazy"` tells the browser to fetch the image only when it nears the viewport.
  - **Modern formats:** WebP/AVIF compress better than PNG/JPEG at same quality.
  - **Srcset:** `srcset` lets the browser choose the right size image for the device width.
- How it solves the problem
  - Reduces network usage (faster load), reduces memory usage, and eliminates layout shifts (better CLS scores).
- Exceptions & miscellaneous
  - **Critical LCP Image:** Do NOT lazy-load the "Hero" image (above the fold). It delays LCP. Instead, `<link rel="preload">` it or use `loading="eager"`.

--------------------------------------------------------------------------------

## Web Vitals focus: LCP, CLS, INP
- **LCP (Largest Contentful Paint):** Time when the largest text/image is painted.
  - *Fixes:* Preload hero images, optimize server response time (TTFB), remove render-blocking JS/CSS.
- **CLS (Cumulative Layout Shift):** Visual stability (elements jumping around).
  - *Fixes:* Set `width`/`height` on images/videos, reserve space for ads/embeds, avoid inserting new content above existing content.
- **INP (Interaction to Next Paint):** Responsiveness (how fast it reacts to a click).
  - *Fixes:* Break up long tasks (yield to main thread), use `useTransition` for heavy UI updates, avoid complex sync logic in event handlers.


