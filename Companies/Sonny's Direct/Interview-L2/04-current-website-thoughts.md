# Current Website — Performance Notes (Interview-ready)

## Case 1: Slow initial load (LCP ~ 6–7s)
- **Problem**: first meaningful content appears late; page feels slow.
- **Likely cause**: slow server response (TTFB), heavy hero media, render-blocking CSS/fonts, or too much JS before first paint.
- **Approach to solve**:
  - Identify the LCP element + what delays it (network vs render vs JS).
  - Optimize hero media (right size/format, don’t lazy-load LCP, preload if needed).
  - Reduce render blocking (critical CSS, fewer fonts, defer non-critical JS/3rd-party).
  - Improve caching/CDN where applicable.

## Case 2: Scroll feels janky / laggy
- **Problem**: scrolling stutters; page feels “heavy”.
- **Likely cause**: too many scroll-triggered animations, JS work during scroll, layout/paint-heavy animations.
- **Approach to solve**:
  - Measure while scrolling and remove the biggest sources of main-thread work.
  - Prefer transform/opacity animations and reduce how many run at once.

## Case 3: Too many animations on entry
- **Problem**: every section animates in, causing clutter + performance cost.
- **Likely cause**: animation defaults applied globally, or observers/listeners firing too often.
- **Approach to solve**:
  - Keep animations only where they add value, not everywhere.
