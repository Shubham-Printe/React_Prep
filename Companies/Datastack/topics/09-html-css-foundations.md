# HTML/CSS Foundations
- Semantic HTML, forms, inputs
- CSS box model, specificity, cascade
- Flexbox and Grid layouts
- Responsive design (media queries)
- CSS architecture (BEM or component-based)
- Styling approaches: CSS Modules, styled-components, Tailwind basics

## Semantic HTML, forms, inputs - Q&A
1. What is semantic HTML, and why use it instead of only divs/spans?
   - **Semantic HTML** uses tags that convey meaning: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<button>`, `<label>`, `<input>`, etc. Benefits: **accessibility** (screen readers and assistive tech understand structure), **SEO** (search engines infer content), and **readability** of the markup. Using only `<div>` and `<span>` loses that meaning and makes the page harder to navigate and maintain.

2. When building a form in React, what’s the difference between a controlled and an uncontrolled input? When might you use each?
   - **Controlled**: the input’s value is driven by React state (`value={state}` + `onChange` to update state). React is the single source of truth; good for live validation, conditional UI, or transforming input. 
   - **Uncontrolled**: the DOM holds the value; you read it via a ref (e.g. on submit). Simpler for basic forms when you only need the value on submit. For most React forms we use controlled inputs so we can validate and react to changes in real time.

## CSS box model, specificity, cascade - Q&A
3. What is the CSS box model? What’s the difference between content-box and border-box?
   - The **box model** describes how width/height apply to an element: **content** (inner area), then **padding**, **border**, and **margin**. 
   By default (`box-sizing: content-box`), `width`/`height` apply only to the content; padding and border add on top, so the total size is width + padding + border.
   With `box-sizing: border-box`, `width`/`height` include padding and border, so the element’s total size is predictable and layout is easier. Many projects set `* { box-sizing: border-box; }` globally.

4. How does CSS specificity work, and what order do we use to resolve conflicting rules?
   - **Specificity** ranks selectors when two rules target the same element: 
   **inline styles** > **IDs** > **classes, attributes, pseudo-classes** > **elements, pseudo-elements**. 
   More specific wins. If equal, **cascade** (order in the stylesheet) wins: later rules override earlier. 
   To override without raising specificity, use the same or higher specificity; 
   avoid `!important` except for rare overrides (e.g. utilities). 
   Prefer classes over IDs for styling so you don’t get specificity wars.

## Flexbox and Grid layouts - Q&A
5. When would you choose Flexbox vs Grid for layout?
   - **Flexbox** is for **one-dimensional** layout: arrange items in a row or a column, with alignment and distribution along that axis. 
   - Use it for nav bars, card rows, or stacking items vertically/horizontally. 
   
   - **Grid** is for **two-dimensional** layout: rows and columns at once. 
   - Use it for page structure (header, sidebar, main, footer), dashboards, or any layout that’s a clear grid. 
   
   Flexbox: “line of items”; Grid: “grid of cells.” You can combine both (e.g. Grid for the page, Flexbox inside a grid cell).

6. Name one Flexbox and one Grid property you use often and what they do.
   - **Flexbox**:  
     In a flex container, items sit along a **main axis** (the direction of the row or column) and a **cross axis** (perpendicular to it).  
     **`justify-content`** controls how items are spaced along the **main axis** (e.g. `center` to center them, `space-between` to put space between items).  
     **`align-items`** controls how items line up along the **cross axis** (e.g. `center` to vertically center items in a row, or `stretch` to fill the cross axis). 
   - **Grid**:  
     **`grid-template-columns`** sets how many columns and how wide they are. Example: `1fr 1fr` = two equal columns (each takes half the space); `repeat(3, 1fr)` = three equal columns. The `fr` unit means “fraction of available space.”  
     **`gap`** adds space between the grid cells (e.g. `gap: 1rem`).

## Responsive design (media queries) - Q&A
7. What are media queries, and how do you use them for responsive design?
   - **Media queries** apply CSS only when conditions match (e.g. viewport width, resolution). 
   Example: `@media (min-width: 768px) { ... }` applies styles when the viewport is at least 768px. We use them to change layout, font size, padding, or to show/hide elements. 

8. What does “mobile-first” mean, and why is it a common approach?
   - **Mobile-first** means writing base styles for the smallest screen, then using `min-width` media queries to add or override styles for larger screens . 
   It keeps the default simple and performant, and we progressively enhance for larger viewports. 
   The alternative often means overriding many desktop styles on mobile, which can be more work and more CSS.

## CSS architecture (BEM or component-based) - Q&A
9. What is BEM, and how do you name classes with it?
   - **BEM** stands for Block, Element, Modifier. 
   **Block**: a standalone component (e.g. `card`). 
   **Element**: part of the block (e.g. `card__title`, `card__body`). 
   **Modifier**: a variation of the block or element (e.g. `card--featured`, `card__title--large`). 
   Naming: `block__element--modifier`. Benefits: clear ownership (no accidental overrides), low specificity, and self-documenting class names. Used often in plain CSS or with preprocessors.

10. What is component-based CSS (e.g. in React), and how does it differ from a global BEM approach?
    - **Component-based CSS** scopes styles to the component: 
      - each component has its own styles so class names are local and don’t leak. 
      - In React we colocate styles with the component and avoid global naming. 
   **Difference**: BEM is a naming convention in global CSS; 
      - component-based uses tooling (modules, CSS-in-JS) to get automatic scoping and avoid global namespace clashes. 
      - Both aim for maintainability; component-based fits React’s component model and avoids naming collisions by default.

## Styling approaches (CSS Modules, styled-components, Tailwind) - Q&A
11. In one sentence each: what are CSS Modules, styled-components, and Tailwind? When might you choose one?
    - **CSS Modules**: Scoped CSS files; class names are hashed so they don’t clash (e.g. `Button.module.css` → `Button_primary_a3f2`). You get normal CSS with local scope. 
    - **styled-components**: CSS-in-JS; you write components whose styles are defined in JS, scoped by default, with dynamic props. 
    - **Tailwind**: Utility-first; you apply small utility classes in the markup (e.g. `flex`, `p-4`, `text-lg`). 
    
    Choose 
      - CSS Modules for “CSS files but scoped”; 
      - styled-components for dynamic theming or component-driven styling; 
      - Tailwind for fast UI with a design system and less custom CSS.

12. What’s the main benefit of Tailwind’s utility-first approach, and what’s a common criticism?
    - **Benefit**: Ship UI quickly with consistent spacing, colors, and typography from a design system; less context-switching (no separate CSS file); small bundle if PurgeCSS/tree-shaking removes unused classes; and responsive/state variants (`md:flex`, `hover:bg-gray-100`) are built in. 
    - **Criticism**: markup can get long and noisy with many classes; some prefer semantic class names and a smaller HTML footprint. Mitigate with `@apply` for repeated patterns or component extraction so the JSX stays readable.
