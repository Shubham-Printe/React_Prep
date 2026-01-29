# Essential JavaScript Methods for Interviews (The "Bare Minimum")

This guide focuses on the **must-know** methods to solve common algorithmic problems (like grouping anagrams) without getting stuck on syntax. It's not about memorizing everything, but knowing the right tool for the job.

## 1. The Core Problem: "Group Anagrams"
*Context: You have `['eat', 'tea', 'tan', 'ate', 'nat', 'bat']` and want to group them: `[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]`.*

This single problem requires three key skills:
1.  **Iterating** through strings.
2.  **Sorting** characters to find a common "key" (e.g., 'ate' is the key for 'eat', 'tea', 'ate').
3.  **Grouping** items using a Map or Object.

### Solution Pattern
```javascript
const groupAnagrams = (strs) => {
  // 1. Create a storage container (Map is usually best for keys)
  const map = new Map();

  // 2. Iterate through every string
  for (let str of strs) {
    // 3. Create a unique "key" for the anagram group
    // 'eat' -> ['e','a','t'] -> ['a','e','t'] -> 'aet'
    const key = str.split('').sort().join('');

    // 4. Store it
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  // 5. Return just the groups (the values)
  return Array.from(map.values());
};
```

---

## 2. Array Methods (The Heavy Lifters)

### A. Iteration & Transformation
When you need to go through a list.

| Method | Use When... | Returns | Example |
| :--- | :--- | :--- | :--- |
| **`map`** | You want to **transform** every item into something else (1:1 ratio). | New Array | `[1, 2].map(x => x * 2)` → `[2, 4]` |
| **`filter`** | You want to **remove** items based on a condition. | New Array | `[1, 2, 3].filter(x => x > 1)` → `[2, 3]` |
| **`reduce`** | You want to **combine** all items into a single value (number, object, or another array). | Anything | Summing numbers, or converting Array → Object. |
| **`forEach`** | You just want to **do something** (side effect) and don't care about a return value. | `undefined` | Logging items, or pushing to an external array manually. |

**Pro Tip:** In modern JS, `for...of` loops are often cleaner than `forEach` if you want to use `break` or `continue`.

### B. Searching
When you need to find something inside.

| Method | Use When... | Returns | Example |
| :--- | :--- | :--- | :--- |
| **`find`** | You want the **first item** that matches. | Item or `undefined` | `users.find(u => u.id === 5)` |
| **`some`** | You want to check if **at least one** item matches. | Boolean | `[1, 2, 3].some(x => x < 0)` → `false` |
| **`every`** | You want to check if **ALL** items match. | Boolean | `[1, 2, 3].every(x => x > 0)` → `true` |
| **`includes`**| You want to check for a simple value (not an object check). | Boolean | `['a', 'b'].includes('a')` → `true` |

### C. Sorting
| Method | Use When... | Key Note |
| :--- | :--- | :--- |
| **`sort`** | Reordering elements. | **MUTATES** the original array. By default sorts alphabetically (bad for numbers!). |

**Pattern for Numbers:**
```javascript
// Ascending
nums.sort((a, b) => a - b);
// Descending
nums.sort((a, b) => b - a);
```

**Pattern for Strings:**
```javascript
// Alphabetical
strs.sort(); 
// or with localeCompare for safety
strs.sort((a, b) => a.localeCompare(b));
```

---

## 3. String Methods (Manipulation)

You'll almost always need these for parsing inputs or creating keys.

| Method | Use When... | Example |
| :--- | :--- | :--- |
| **`split(separator)`** | String → Array. Essential for algorithms. | `'abc'.split('')` → `['a', 'b', 'c']` |
| **`join(separator)`** | Array → String. Opposite of split. | `['a', 'b', 'c'].join('')` → `'abc'` |
| **`slice(start, end)`** | Extracting a part of a string (without modifying original). | `'hello'.slice(0, 2)` → `'he'` |
| **`includes(text)`** | Checking for substrings. | `'team'.includes('tea')` → `true` |

---

## 4. Object & Map Iteration (Grouping Data)

Interviews often involve frequency counters or grouping (like the anagrams).

### Using Objects (Legacy but Common)
Keys are always *strings*.

```javascript
const obj = { a: 1, b: 2 };

// Get Keys
Object.keys(obj)   // ['a', 'b']

// Get Values
Object.values(obj) // [1, 2]

// Get Both
Object.entries(obj) // [['a', 1], ['b', 2]]

// Loop
for (const [key, val] of Object.entries(obj)) {
  console.log(key, val);
}
```

### Using Map (Better for Algorithms)
Keys can be *anything* (though usually primitives in interviews). Remembers insertion order.

```javascript
const map = new Map();

map.set('key', 'value'); // Add
map.get('key');          // Retrieve
map.has('key');          // Check existence (Fast!)
map.delete('key');       // Remove

// Iterating Map
for (const [key, val] of map) { ... }

// Converting back to Array
Array.from(map.values())
```

### Set (Unique Items)
Use when you need to remove duplicates instantly.
```javascript
const uniqueNums = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]
```

---

## 5. Cheat Sheet: Which one do I pick?

1.  **Need to transform every element?** → `.map()`
2.  **Need to pick specific elements?** → `.filter()`
3.  **Need to find just one element?** → `.find()`
4.  **Need to check if it exists?** → `.includes()` (simple) or `.some()` (complex condition)
5.  **Need to group/count items?** → Use a `Map` or `Object` + Loop.
6.  **Need to remove duplicates?** → `new Set()`





