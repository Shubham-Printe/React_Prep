# Performance and Optimization
- Re-render causes and debugging
- Memoization: React.memo, useMemo, useCallback
- Code splitting and lazy loading
- Virtualization basics for large lists
- Bundle analysis and tree-shaking basics
- Web Vitals (LCP, CLS, INP) awareness

## Re-render causes and debugging - Q&A
1. What are the most common causes of unnecessary re-renders in React, and how do you confirm them using tooling (not guesses)?
   - **Common causes**:
     - Parent re-renders → children re-render by default (unless child is memoized and props are stable).
     - Unstable props: inline objects/arrays/functions passed as props create new references each render.
     - Context churn: provider `value={{...}}` created inline causes consumers to re-render.
     - Effects that trigger extra state updates: effect runs more than expected and calls `setState`.
   - **How to confirm (no guessing)**:
     - React DevTools **Profiler**: which components rendered, how often, and what triggered it.
     - React DevTools **Highlight updates**: visually spot frequent re-renders.
     - Quick debug helpers: `console.count('ComponentName render')` while iterating.

## Memoization: React.memo, useMemo, useCallback - Q&A
1. When should you use `React.memo`, and what’s a common situation where it doesn’t help (or can even make things worse)?
   - **When to use `React.memo`**:
     - When a component is expensive to render and it receives the same props across many parent re-renders.
     - It skips re-rendering when props haven’t changed (it uses a shallow props comparison by default).
   - **When it doesn’t help (or can hurt)**:
     - If props are unstable references (inline objects/arrays/functions), shallow compare sees them as “changed”
       every render, so `React.memo` can’t skip.
     - If the component is cheap to render, the extra comparisons/complexity can be wasted overhead.

2. What’s the difference between `useMemo` and `useCallback`, and what’s a common mistake people make when using them?
   - **`useMemo`**: memoizes a computed value and reuses it between renders until dependencies change.
   - **`useCallback`**: memoizes a function reference so it doesn’t look “new” on every render.
   - **Common mistakes**:
     - Using them everywhere without measuring (memoization has overhead).
     - Missing/incorrect dependencies → stale values and confusing bugs.
     - Expecting benefits without a reason (value isn’t expensive, or function/value isn’t used as a prop/dependency).

3. What’s a realistic scenario where using `useCallback` (or `useMemo`) is necessary to prevent re-renders, and what would you do if it still doesn’t fix the performance issue?
   - **Scenario**: a dashboard renders multiple expensive chart components. The parent re-renders often
     (filters, theme, live updates), and it passes computed chart data (arrays/objects) and handler
     functions (callbacks).
   - **Fix**:
     - Use `useMemo` for computed chart datasets so they don’t get recreated every render.
     - Use `useCallback` for handler functions so references stay stable.
     - Wrap chart components with `React.memo` so stable props actually skip re-renders.
   - **If it still doesn’t fix it**:
     - Use React DevTools **Profiler** to find the real hot spot.
     - Then consider splitting state, deferring/virtualizing heavy UI, reducing update frequency
       (throttle/debounce), or moving heavy computation to a Web Worker/backend.

## Code splitting and lazy loading - Q&A
1. What is code splitting, and how do you implement it in a React app?
   - **What it is**: Splitting the bundle so users only load the code needed for the current route or feature, instead of one large bundle. Improves initial load time (smaller first payload).
   - **In React**:
     - **`React.lazy()`**: wrap a dynamic import so the component is loaded only when needed, e.g. `const Admin = React.lazy(() => import('./Admin'))`.
     - **`Suspense`**: wrap lazy components and show a fallback (e.g. spinner) while the chunk loads: `<Suspense fallback={<Spinner />}><Admin /></Suspense>`.
     - Route-based splitting: lazy-load a page component per route so each route’s JS is a separate chunk (e.g. with React Router).

2. When would you use lazy loading, and what’s one pitfall to avoid?
   - **When to use**: Heavy or rarely used screens (admin panel, settings, modals), below-the-fold content, or features behind a tab so initial load stays small.
   - **Pitfall**: Avoid lazy-loading above-the-fold or critical path components—the extra network round-trip can make the first paint slower. Measure; use for non-critical chunks.

## Virtualization basics for large lists - Q&A
1. What is list virtualization, and why is it used?
   - **What it is**: Only rendering the items that are visible (or near-visible) in the scroll viewport, instead of rendering every item in a long list. As the user scrolls, items are mounted/unmounted or recycled.
   - **Why**: Rendering thousands of DOM nodes (e.g. 10,000 list items) causes layout and paint cost, slow scrolling, and high memory. Virtualization keeps the DOM small (e.g. 20–30 visible items) so scrolling stays smooth.

2. How would you implement or use virtualization in a React app?
   - **Libraries**: Use **react-window** or **react-virtuoso** (or TanStack Virtual). They take a list length and a row height (or dynamic height), and only render visible rows.
   - **Concept**: Provide an item count and a render function per item; the library computes which indices are in view and renders only those. Optionally use `scrollToIndex` for “scroll to item” or keyboard nav.
   - **When**: Use for long lists (hundreds/thousands of items)—tables, feeds, dropdowns with many options. Not needed for short lists.

## Bundle analysis and tree-shaking basics - Q&A
1. What is tree-shaking, and what do you need to do to benefit from it?
   - **What it is**: Build tools (e.g. Vite, Webpack) remove unused exports from the final bundle (“dead code elimination”). Only the code that is actually imported and used ends up in the bundle.
   - **To benefit**: Use **ES modules** (`import`/`export`); bundlers can’t tree-shake CommonJS or bundled UMD. Prefer importing specific symbols (e.g. `import { fn } from 'lib'`) rather than default imports of large objects. Avoid side effects at module top-level that pull in unused code.

2. How do you analyze bundle size and find what’s making it large?
   - **Tools**: **Vite**: `vite-bundle-visualizer` or `rollup-plugin-visualizer`; **Webpack**: `webpack-bundle-analyzer`. They produce a treemap of chunk sizes and which packages/files contribute.
   - **Use it**: Run a production build, open the report, and look for large dependencies (e.g. moment, lodash entire lib). Then: replace with smaller alternatives (e.g. date-fns, lodash-es + tree-shake), use dynamic imports for heavy features, or split vendor chunks.

## Web Vitals (LCP, CLS, INP) awareness - Q&A
1. What are LCP, CLS, and INP, and why do they matter?
   - **LCP (Largest Contentful Paint)**: Load performance—when the largest visible content (e.g. hero image, main text block) is painted. Goal: good LCP (e.g. ≤ 2.5s) so the page feels “loaded.”
   - **CLS (Cumulative Layout Shift)**: Visual stability—unexpected layout shifts (e.g. images without dimensions, late-loading content pushing layout). Goal: low CLS (e.g. ≤ 0.1) so the page doesn’t jump.
   - **INP (Interaction to Next Paint)**: Responsiveness—latency from user input (click, tap, key) to the next paint. Replaces FID. Goal: low INP so interactions feel instant.
   - **Why**: They’re Core Web Vitals—Google uses them for ranking and UX; they reflect real-user experience (loading, stability, interactivity).

2. What are one or two concrete things you’d do in a React app to improve LCP and CLS?
   - **LCP**: Optimize the largest content—e.g. optimize and preload the hero image; reduce render-blocking JS/CSS so the main content can paint sooner; consider SSR or streaming so above-the-fold HTML arrives early.
   - **CLS**: Reserve space for images (width/height or aspect-ratio) and avoid inserting content above existing content without reserved space; load non-critical CSS/images so they don’t shift layout when they arrive.
