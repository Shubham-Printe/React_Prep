# Prototypes & Inheritance: The Engine Under the Hood

**The Core Truth**: JavaScript does NOT have classes (in the C++/Java sense). It has **Objects linked to other Objects**. The `class` keyword introduced in ES6 is mostly "syntactic sugar" over this existing prototype system.

---

## 1. The Prototype Chain (The "Mental Model")

Every object in JS has a hidden property called `[[Prototype]]` (accessed via `__proto__`) that points to another object.

*   When you ask for `obj.prop`:
    1.  JS checks `obj` directly.
    2.  If missing, it checks `obj.__proto__`.
    3.  If missing, it checks `obj.__proto__.__proto__`.
    4.  ...until it hits `null` (The End).

---

## 2. Instance vs Static Members

### A. Instance Methods (Shared by all copies)
These are stored on the **Constructor's Prototype**.

**The Old Way (Function)**:
```javascript
function User(name) {
  this.name = name; // Own property (Unique to instance)
}

// Added to Prototype (Shared by all instances)
User.prototype.sayHi = function() {
  console.log(this.name);
};
```

**The New Way (Class)**:
```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  
  // Exactly the same as User.prototype.sayHi
  sayHi() {
    console.log(this.name);
  }
}
```

### B. Static Methods (Utility functions)
These are stored on the **Constructor Function itself**. They are NOT available to instances.

**The Old Way**:
```javascript
// Added directly to the function object
User.compare = function(u1, u2) {
  return u1.age - u2.age;
};
```

**The New Way**:
```javascript
class User {
  static compare(u1, u2) {
    return u1.age - u2.age;
  }
}
```

**Access**:
*   `User.compare(...)` ✅ Works.
*   `const u = new User(); u.compare(...)` ❌ Fails (u.__proto__ is User.prototype, which does NOT have 'compare').

---

## 3. Inheritance (The Linkage)

When we say `Dog extends Animal`, what really happens?

1.  **Prototype Link**: `Dog.prototype.__proto__` becomes `Animal.prototype`.
    *   This means if a method isn't on Dog, it looks at Animal.
2.  **Static Link**: `Dog.__proto__` becomes `Animal`.
    *   This means static methods are also inherited (`Dog.someStatic()` works if `Animal.someStatic` exists).

### Visualizing the Chain
```javascript
const d = new Dog();

d --> Dog.prototype --> Animal.prototype --> Object.prototype --> null
```

---

## 4. Interview Cheat Sheet

| Concept | Where does it live? | Access via |
| :--- | :--- | :--- |
| **Instance Property** (`this.name`) | On the Instance itself | `user.name` |
| **Instance Method** (`sayHi()`) | On `User.prototype` | `user.sayHi()` (via delegation) |
| **Static Method** (`compare()`) | On `User` (the function) | `User.compare()` |
| **`__proto__`** | On the Instance | Points to Parent Prototype |
| **`.prototype`** | On the Class/Function | The blueprint for instances |








