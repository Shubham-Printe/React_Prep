# CSS, Performance & Testing (Fast Track)

## 1. CSS Fundamentals
**Box Model:**
- Content -> Padding -> Border -> Margin.
- `box-sizing: border-box;` -> Includes padding/border in the width calculation. (Standard reset).

**Flexbox vs Grid:**
- **Flexbox:** 1-dimensional (Row OR Column). Good for components (Navbars, Cards).
- **Grid:** 2-dimensional (Rows AND Columns). Good for page layouts.

**Centering a Div (The Classic):**
```css
/* Flex */
display: flex; justify-content: center; align-items: center;

/* Grid */
display: grid; place-items: center;

/* Absolute */
position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
```

**CSS Architectures:**
1.  **CSS Modules:** Scoped locally (Files: `Button.module.css`). Prevents name collisions.
2.  **CSS-in-JS (Styled Components/Emotion):**
    - *Pros:* Dynamic styling based on props, component encapsulation.
    - *Cons:* Runtime overhead (parsing JS to CSS), larger bundle size.
3.  **Utility-First (Tailwind CSS):**
    - *Pros:* Zero runtime, tiny bundle (purged), rapid dev, consistent design system.
    - *Cons:* Ugly HTML classes.

---

## 2. Web Performance (Core Web Vitals)
Google's metrics for UX. Crucial for SEO.

1.  **LCP (Largest Contentful Paint):** Loading speed.
    - *Target:* < 2.5s.
    - *Fix:* Optimize images, use CDN, remove render-blocking JS.
2.  **INP (Interaction to Next Paint):** Responsiveness (Replaced FID).
    - *Target:* < 200ms.
    - *Fix:* Break up long tasks, use `useTransition`.
3.  **CLS (Cumulative Layout Shift):** Visual stability.
    - *Target:* < 0.1.
    - *Fix:* Set explicit width/height on images (`aspect-ratio`), reserve space for ads/embeds.

**Critical Rendering Path:**
1.  HTML -> DOM
2.  CSS -> CSSOM
3.  DOM + CSSOM -> **Render Tree** (Visible elements only)
4.  **Layout** (Geometry/Position)
5.  **Paint** (Pixels)
6.  **Composite** (Layers)

*Perf Tip:* Animations using `transform` and `opacity` skip Layout/Paint and only trigger Composite (GPU accelerated).

---

## 3. Testing Strategy
**The Testing Trophy (Kent C. Dodds):**
Focus heavily on **Integration Tests**.

1.  **Unit Tests (Jest/Vitest):** Test individual functions/utils.
    - `expect(add(1, 2)).toBe(3);`
2.  **Integration/Component Tests (React Testing Library):**
    - Test how the user interacts. "Click button -> Text appears".
    - *Principle:* "The more your tests resemble the way your software is used, the more confidence they give you."
    - *Avoid:* Testing implementation details (e.g., checking internal state).
3.  **E2E (Cypress/Playwright):**
    - Spins up a real browser. Clicks through the entire flow (Login -> Checkout).
    - *Cons:* Slow, flaky, expensive.

**Mocking (MSW - Mock Service Worker):**
Instead of mocking `fetch` or `axios` in every test, MSW intercepts network requests at the network layer.
- Tests are cleaner.
- You can use the same mocks for development.






