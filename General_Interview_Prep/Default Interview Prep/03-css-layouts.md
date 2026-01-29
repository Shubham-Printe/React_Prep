# CSS Layouts & Positioning (The Visuals)

**Goal:** Don't get stuck centering a div. Understand the Box Model.

## 1. The Box Model
Every element is a box.
*   **Content:** The actual text/image.
*   **Padding:** Space *inside* the border (around content).
*   **Border:** The line around the padding.
*   **Margin:** Space *outside* the border (separates siblings).

**Crucial Reset:**
Always mention `box-sizing: border-box`. It makes `width` include padding and border, preventing layout math headaches.
```css
* {
  box-sizing: border-box;
}
```

---

## 2. Flexbox (One Dimension)
*Row OR Column.*

### Container Properties
```css
.container {
  display: flex;
  
  /* Axis */
  flex-direction: row; /* (default) -> */
  /* flex-direction: column; | v */

  /* Main Axis Alignment (X-axis for row) */
  justify-content: center; /* flex-start, flex-end, space-between, space-around */

  /* Cross Axis Alignment (Y-axis for row) */
  align-items: center; /* stretch, flex-start, flex-end */
}
```

### The "Center Div" Cheat Code
```css
.center-me {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Item Properties
*   `flex-grow: 1;` (Take up remaining space)
*   `flex-shrink: 0;` (Don't shrink if space is tight)

---

## 3. CSS Grid (Two Dimensions)
*Rows AND Columns.*

```css
.grid-container {
  display: grid;
  
  /* Define Columns */
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  /* grid-template-columns: 200px 1fr;  /* Fixed sidebar + fluid content */
  
  /* Gaps */
  gap: 16px; 
}
```

---

## 4. Positioning
"How do I stick this header to the top?"

| Value | Behavior |
| :--- | :--- |
| **`static`** | Default. Normal flow. |
| **`relative`** | Normal flow, but can be offset (`top`, `left`). **Acts as a parent for absolute children.** |
| **`absolute`** | Removed from flow. Positioned relative to nearest **non-static** ancestor. |
| **`fixed`** | Removed from flow. Positioned relative to the **viewport** (screen). |
| **`sticky`** | Toggles between relative and fixed based on scroll position. |

**Common Pattern: Overlay/Modal**
```css
.modal-overlay {
  position: fixed; /* Covers screen */
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; /* To center the content */
  justify-content: center; 
  align-items: center;
}
```

---

## 5. Specificity (Tie-Breaker)
Who wins if styles conflict?
1.  `!important` (Avoid)
2.  Inline Styles (`style="..."`)
3.  IDs (`#id`)
4.  Classes (`.class`), Pseudo-classes (`:hover`)
5.  Elements (`div`, `h1`)




