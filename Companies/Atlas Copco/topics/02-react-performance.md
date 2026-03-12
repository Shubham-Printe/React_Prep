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
     - Context: if you pass an inline object (`value={{ theme: 'dark' }}`) as value, you create a new object on every parent render. React compares context by reference, not content—so it sees a new value every time and re-renders all consumers.
     - Effects that call `setState`: if the dependency array includes an object that's recreated each render, the effect runs again, updates state, re-renders, and can repeat—causing an unwanted render loop.
   
   - **How to confirm (no guessing)**:
     - React DevTools **Profiler**: which components rendered, how often, and what triggered it.
     - React DevTools **Highlight updates**: visually spot frequent re-renders.
     - Quick debug helpers: `console.count('ComponentName render')` while iterating.

## Memoization: React.memo, useMemo, useCallback - Q&A
1. When should you use `React.memo`, and what's a common situation where it doesn't help (or can even make things worse)?
   - **When to use `React.memo`**:
     - When a component is expensive to render and it receives the same props across many parent re-renders.
     - It skips re-rendering when props haven't changed (it uses a shallow props comparison by default).
   - **When it doesn't help (or can hurt)**:
     - If props are unstable references (inline objects/arrays/functions), shallow compare sees them as "changed" every render, so `React.memo` can't skip re-rendering.
     - If the component is cheap to render, the extra comparisons/complexity can be wasted overhead.

2. What's the difference between `useMemo` and `useCallback`, and what's a common mistake people make when using them?
   - **`useMemo`**: memoizes a computed value and reuses it between renders until dependencies change.
     E.g. filtered list of objects.
   - **`useCallback`**: memoizes a function reference so it doesn't look "new" on every render.
   - **Common mistakes**:
     - Using them everywhere without measuring (memoization has overhead).
     - Missing/incorrect dependencies → stale values and confusing bugs.

3. What's a realistic scenario where using `useCallback` (or `useMemo`) is necessary to prevent re-renders, and what would you do if it still doesn't fix the performance issue?
   - **Scenario**: 
      - a dashboard renders multiple expensive chart components. 
      - The parent re-renders often (filters, theme, live updates), and it passes computed chart data (arrays/objects) and handler functions (callbacks).
   - **Fix**:
     - Use `useMemo` for computed chart datasets so they don't get recreated every render.
     - Use `useCallback` for handler functions so references stay stable.
     - Wrap chart components with `React.memo` so stable props actually skip re-renders.
   - **If it still doesn't fix it**:
     - Use React DevTools **Profiler** to find the real hot spot.
     - Then consider splitting state, virtualizing heavy UI, reducing update frequency (throttle/debounce), or moving heavy computation to a Web Worker/backend.

## Code splitting and lazy loading - Q&A
1. What is code splitting, and how do you implement it in a React app?
   - **What it is**: 
      - Splitting the bundle so users only load the code needed for the current route or feature, instead of one large bundle.
      - Improves initial load time (smaller first payload).
   - **In React**:
     - **`React.lazy()`**: wrap a dynamic import so the component is loaded only when needed, e.g. `const Admin = React.lazy(() => import('./Admin'))`.
     - **`Suspense`**: wrap lazy components and show a fallback (e.g. spinner) while the chunk loads: `<Suspense fallback={<Spinner />}><Admin /></Suspense>`.
     - **Route-based splitting**: lazy-load a page component per route so each route's JS is a separate chunk (e.g. with React Router).

2. When would you use lazy loading, and what's one pitfall to avoid?
   - **When to use**: Heavy or rarely used screens (admin panel, settings, modals), below-the-fold content, or features behind a tab so initial load stays small.
   - **Pitfall**: Avoid lazy-loading above-the-fold or critical path components. The extra network round-trip can make the first paint slower.

## Virtualization basics for large lists - Q&A
1. What is list virtualization, and why is it used?
   - **What it is**: 
      - Only rendering the items that are visible in the scroll viewport, instead of rendering every item in a long list. 
      - As the user scrolls, items are mounted/unmounted or recycled.
   - **Why**: 
      - Rendering thousands of DOM nodes (e.g. 10,000 list items) causes layout and paint cost, slow scrolling, and high memory. 
      - Virtualization keeps the DOM small (e.g. 20–30 visible items) so scrolling stays smooth.

2. How would you implement or use virtualization in a React app?
   - **How to implement**
      - Use a library like **react-window**, **react-virtuoso**, or **TanStack Virtual**. 
      - You pass in the total item count, row height (or a way to measure dynamic heights), and a render function for each item.
      - The library computes which indices are in view and only renders those rows; 
      - as you scroll, it mounts/unmounts or recycles them.
   - **When to use**: 
      - Long lists—hundreds or thousands of items. For short lists, the overhead isn't worth it.

## Bundle analysis and tree-shaking basics - Q&A
1. What is tree-shaking, and what do you need to do to benefit from it?
   - **What it is**: 
      - Build tools like Vite or Webpack remove unused exports from the final bundle ("dead code elimination"). 
      - Only the code that is actually imported and used ends up in the bundle.
   - **To benefit**: 
      - Use **ES modules** (`import`/`export`); bundlers can't tree-shake CommonJS or bundled UMD. 
      - Prefer importing specific entity rather than default imports of large objects.

2. How do you analyze bundle size and find what's making it large?
   - **Tools**: 
      - **Webpack**: `webpack-bundle-analyzer`. 
      - It produces a treemap of chunk sizes and which packages/files contribute to it.
   - **Use it**: 
      - Run a production build, open the report, and look for large dependencies (e.g. moment, lodash entire lib). 
      - Then: replace with smaller alternatives (e.g. date-fns, lodash-es + tree-shake) and use dynamic imports for heavy features.

## Web Vitals (LCP, CLS, INP) awareness - Q&A
1. What are LCP, CLS, and INP, and why do they matter?
   - **LCP (Largest Contentful Paint)**: How long until the largest visible element appears on screen. You want it under about 2.5 seconds so the page feels loaded.

   - **CLS (Cumulative Layout Shift)**: How much the page jumps around after load. Images without width/height, or late-loading content pushing things down, cause layout shift. Aim for a score under 0.1 so the page feels stable.
   
   - **INP (Interaction to Next Paint)**: How fast the page responds when the user clicks, taps, or types. It measures the delay from input to the next paint. Aim for ≤ 200 ms so interactions feel instant.
   
   - **Why they matter**: These are Core Web Vitals—Google uses them for search ranking and they reflect real-user experience: did the page load fast, stay stable, and respond quickly?

   - **How to check**: **Chrome DevTools** → Lighthouse tab runs a report and shows LCP, CLS, INP. 
   - In our app, we can use the **web-vitals** npm package to measure and send metrics for analytics.

2. What are one or two concrete things you'd do in a React app to improve LCP and CLS?
   - **LCP**: 
      - optimize and preload the main content; 
      - cut down render-blocking JS and CSS so the main content paints sooner; 
      - use SSR or streaming so above-the-fold HTML reaches the user early.

   - **CLS**: 
      — set width/height or aspect-ratio on images so the browser reserves space before they load; 
      - avoid inserting content above existing content without reserved space; 
      - defer non-critical CSS and images so they don't push layout when they load.
