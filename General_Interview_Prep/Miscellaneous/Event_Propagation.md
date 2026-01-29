# Event Propagation: Bubbling vs Capturing

**The Core Concept**: Events don't just happen *on* an element; they travel through the DOM tree. This journey has three phases.

---

## 1. The Three Phases

Imagine clicking a `<button>` nested inside a `<div>` inside `<body>`.

1.  **Capturing Phase (The Descent) ⬇️**
    *   The event starts at the `window` and travels **down** the DOM tree to find the target.
    *   Path: `window` → `document` → `html` → `body` → `div` → `button`.
    *   *Default listeners ignore this phase.*

2.  **Target Phase (The Impact) 🎯**
    *   The event arrives at the actual element clicked (`button`).

3.  **Bubbling Phase (The Ascent) ⬆️**
    *   The event bounces back **up** the DOM tree to the root.
    *   Path: `button` → `div` → `body` → `html` → `document` → `window`.
    *   *Most listeners fire during this phase.*

---

## 2. Event Listeners

### Default Behavior (Bubbling)
By default, `onClick` (React) and `addEventListener` (JS) listen to the **Bubbling Phase**.
This allows "Event Delegation" (putting one listener on a parent to handle children).

### Listening to Capture
Sometimes you want to catch an event *before* it reaches the target (e.g., to stop it early or for analytics).

*   **Vanilla JS**:
    ```javascript
    // Pass { capture: true } or true as 3rd arg
    div.addEventListener('click', handleClick, true);
    ```

*   **React**:
    *   Use the `Capture` suffix.
    *   `onClick` → `onClickCapture`
    *   `onChange` → `onChangeCapture`
    *   Usage: `<div onClickCapture={...}>`

---

## 3. Stopping the Flow

*   **`e.stopPropagation()`**: Stops the event from traveling further up (Bubbling) or down (Capturing).
    *   *Example*: Clicking a "Like" button inside a clickable "Card" shouldn't open the card link.
*   **`e.preventDefault()`**: Stops the *browser's default action* (e.g., submitting a form, following a link). It does **not** stop propagation.

---

## 4. Interview Cheat Sheet

| Question | Answer |
| :--- | :--- |
| **Order of phases?** | Capture (Down) → Target → Bubble (Up). |
| **Default listener phase?** | Bubbling. |
| **How to capture in React?** | `onClickCapture`. |
| **Difference between stopPropagation vs preventDefault?** | One stops the *event flow*, the other stops the *browser action*. |








