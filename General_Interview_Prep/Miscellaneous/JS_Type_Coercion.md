# JavaScript Type Coercion (`==` vs `===`)

JavaScript is "weakly typed," meaning it tries to convert types to match each other when you use loose equality (`==`).

---

## 1. The Golden Rules of `==`

1.  **`null == undefined`** ✅ (True). They are friends.
2.  **`NaN` never equals anything**. (Not even itself).
3.  **Objects coerce to Strings** via `.toString()` (Arrays become comma-separated strings).
4.  **Booleans coerce to Numbers** (`true` -> 1, `false` -> 0).

---

## 2. The Cheat Sheet of Doom

| Expression | Result | Reasoning |
| :--- | :--- | :--- |
| `null == undefined` | **True** | Special rule. |
| `"0" == false` | **True** | `"0"` -> `0`. `false` -> `0`. `0 == 0`. |
| `[] == false` | **True** | `[]` -> `""` (Empty String) -> `0`. `false` -> `0`. |
| `[1,2] == "1,2"` | **True** | `[1,2].toString()` is `"1,2"`. |
| `{}` == `"[object Object]"` | **True** | Object default string format. |
| `[] == ![]` | **True** | `![]` is `false`. `[]` is `0`. `0 == 0`. |

---

## 3. Explicit Conversion (Best Practices)

Don't rely on implicit magic. Be explicit.

### String to Number
*   `Number("123")` (Preferred)
*   `parseInt("123", 10)` (Always specify radix 10)
*   `+"123"` (Fastest, but less readable)

### Value to Boolean
*   `Boolean(value)`
*   `!!value` (Double bang)

### Null Checks
*   **Bad**: `if (foo == null)` (This matches null OR undefined, which is okay, but vague).
*   **Good**: `if (foo === null || foo === undefined)`.
*   **Better**: `if (!foo)` (If you also want to catch 0/false/empty string).

**Conclusion**: Just use `===` (Strict Equality) and avoid this headache entirely.








