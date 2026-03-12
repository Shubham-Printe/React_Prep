# Accessibility (A11y)
- Labels, focus management, keyboard navigation
- ARIA basics and when to use it
- Color contrast and semantic structure

## Labels, focus management, keyboard navigation - Q&A
1. Why are labels and focus management important for accessibility, and what are two concrete things you do in React?
   - **Labels**  
     Let screen readers and assistive tech announce what a control is for; without them, users don’t know what to enter or click. In React: use `<label htmlFor="id">` linked to `<input id="id">`, or wrap the input inside `<label>`, so every form control has an associated label.

   - **Focus management**  
     Ensures keyboard and screen-reader users can reach and leave elements in a logical order and aren’t left with focus in the wrong place (e.g. after closing a modal). In React: after opening a modal, move focus into it (e.g. `ref.current.focus()` on the first focusable element) and trap focus inside until close; on close, return focus to the element that opened it so keyboard users aren’t lost.

2. What does “keyboard navigation” mean for accessibility, and how do you test it?
   - **What it means**  
     All interactive elements and flows must be reachable and usable with the keyboard only (Tab, Shift+Tab, Enter, Space, Arrow keys). Buttons, links, and custom widgets must be focusable (tab order) and activatable with Enter/Space; custom components may need arrow-key behavior (e.g. tabs, menus).

   - **How to test**  
     Unplug the mouse and use only Tab, Enter, Space, and Esc to complete key flows (e.g. open modal, submit form, close dialog). Check that focus is visible (focus ring) and that nothing is “keyboard trapped.” Use screen reader testing (e.g. NVDA, VoiceOver) for a fuller picture.

## ARIA basics and when to use it - Q&A
3. What is ARIA, and when should you use it in a React app?
   - **What ARIA is**  
     **ARIA** (Accessible Rich Internet Applications) is a set of attributes you add to HTML so assistive technologies get extra semantics (roles, states, properties) that HTML doesn’t provide.

   - **When to use it**  
     When you build **custom widgets** (tabs, modals, dropdowns, tree views) that don’t have a single native HTML element. Examples: `role="dialog"`, `aria-modal="true"`, `aria-label` or `aria-labelledby`, `aria-expanded`, `aria-hidden`.

   - **When not to**  
     Don’t use ARIA to fix wrong HTML—prefer semantic HTML first (e.g. `<button>` not `<div role="button">`). Use ARIA when there’s no suitable native element or you need to expose state (e.g. expanded/collapsed).

4. Give one example of an ARIA attribute (or role) you’d use for a modal dialog, and why.
   - **`role="dialog"`**  
     (Or `role="alertdialog"` for critical alerts.) So screen readers treat it as a dialog.

   - **`aria-modal="true"`**  
     So the rest of the page is treated as inert.

   - **`aria-labelledby`**  
     Point to the dialog title element so the dialog has an announced name. **`aria-describedby`** (optional) for the main content.

   - **Why together**  
     These tell assistive tech “this is a modal dialog with this title,” and that focus should be moved into the dialog and trapped until it’s closed. Without them, a custom modal is just a div and isn’t announced or navigated correctly.

## Color contrast and semantic structure - Q&A
5. Why does color contrast matter for accessibility, and what’s a simple rule you follow?
   - **Why it matters**  
     Text must be readable for people with low vision, in bright light, or on poor screens. If contrast between text and background is too low, many users can’t read it.

   - **Rule**  
     Follow **WCAG** guidelines—e.g. at least **4.5:1** for normal text and **3:1** for large text (AA level).

   - **Don’t rely on color alone**  
     E.g. “red = error” isn’t enough; add an icon or text so colorblind users get the same info.

   - **Tools**  
     Use DevTools Lighthouse or contrast checkers to verify contrast ratios.

6. What does “semantic structure” mean for accessibility, and how does it help?
   - **What it means**  
     Using the right HTML elements for their purpose: headings (`<h1>`–`<h6>`), lists (`<ul>`, `<ol>`), landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`), and form elements (`<label>`, `<button>`, `<input>`).

   - **How it helps**  
     Screen readers use structure to **navigate** (e.g. “list of headings,” “main,” “navigation”) and to **announce** roles (e.g. “button,” “heading level 2”).

   - **What to avoid**  
     Using `<div>` and `<span>` for everything hides that structure and makes the page harder to navigate.

   - **Bonus**  
     Semantic HTML also helps SEO and keeps the DOM meaningful without extra ARIA.
