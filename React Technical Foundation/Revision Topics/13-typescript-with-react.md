## TypeScript with React

- [ ] Typing props, children, refs, `forwardRef`, `memo`
- [ ] Generics for components and hooks; polymorphic components
- [ ] Context typing and discriminated unions for state
- [ ] Inference-friendly APIs; avoiding `any`, using `unknown`, `never`
- [ ] Utility types and pattern matching types (satisfies, as const)
- [ ] Ambient types and module augmentation pitfalls

---

### Typing common React patterns
Define explicit prop interfaces. For `forwardRef`, type both props and the ref target (`HTMLInputElement` or custom handle). With `memo`, maintain correct props typing and consider generic components carefully to preserve inference.

---

### Generics and polymorphism
Generic components/hook APIs improve reuse (e.g., `<Select<T>>`). Polymorphic components accept an `as` prop to render different elements—type them to preserve proper props for the chosen element while keeping your own props typed.

---

### Context and unions
Type context values and provide non-null assertions carefully. For complex state, use discriminated unions to model state variants with exhaustive `switch` checks—this prevents impossible states and improves reducer clarity.

---

### Inference-friendly APIs
Prefer function overloads or generics over `any`. Use `unknown` for inputs you must validate, and `never` for unreachable code. Use `satisfies` to check that objects conform to narrower shapes without losing literal types.

---

### Ambient and augmentation caveats
Avoid leaking globals via ambient declarations. Module augmentation should be minimal and well-documented; prefer explicit imports and local types to reduce coupling.


