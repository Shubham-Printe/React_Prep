# Bundle Analysis Guide

This guide explains how to set up bundle analysis in any React project to identify and fix "bloated" dependencies.

## What is Bundle Analysis?
It is the process of visualizing exactly what code makes up your final application bundle. It helps you answer:
- "Why is my app 5MB?"
- "Did tree-shaking work?"
- "Is a library I imported pulling in 100 other things?"

---

## Step-by-Step Recipe (Vite / Modern React)

### Step 1: Install the Analyzer Tool
We need a tool that can read the build output and draw the visualization. Since Vite uses **Rollup** under the hood, we use the Rollup plugin.

```bash
npm install --save-dev rollup-plugin-visualizer
```

### Step 2: Wire it up in Configuration
Tell Vite: *"When you build the app, run this visualizer plugin."*

In `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 1. Import the plugin
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // 2. Add it to the plugins list (usually last)
    visualizer({
      open: true,           // Automatically open the report in browser
      filename: 'stats.html', // Output file name
      gzipSize: true,       // Show GZIP size (what actually crosses network)
      brotliSize: true,     // Show Brotli size (even better compression)
    }),
  ],
});
```

### Step 3: Run the Build
The analyzer only works when you **bundle** for production. It does NOT run in `npm run dev` (because dev mode serves individual files).

```bash
npm run build
```

**What happens inside:**
1.  Vite compiles your TS/React code.
2.  It bundles everything into optimized chunks in `dist/`.
3.  **The Plugin triggers:** It calculates the size of every module inside those chunks.
4.  It generates `stats.html` and opens it in your default browser.

---

## Hands-on Exercise (In this Lab)

1.  Open `src/App.tsx`.
2.  Uncomment the **BAD PRACTICE** lines (imports of `lodash` and `moment`).
3.  Comment out the **GOOD PRACTICE** lines (`lodash-es` and `date-fns`).
4.  Run `npm run build`.
5.  **Observe:** Look at how massive the blocks for `lodash` and `moment` are.
6.  **Fix:** Revert the changes (use the modular imports) and build again.
7.  **Verify:** The blocks disappear or shrink drastically.

---

## For Older Projects (Webpack / Create-React-App)

If you join a team using an older stack, the **concept** is identical, but the **tool** changes.

1.  **Tool:** Install `webpack-bundle-analyzer` instead of `rollup-plugin-visualizer`.
2.  **Config:** Add it to the `plugins` list in `webpack.config.js`.
3.  **Run:** `npm run build`.
