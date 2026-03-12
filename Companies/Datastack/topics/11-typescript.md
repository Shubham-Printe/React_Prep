# TypeScript (Preferred Skill)
- Types, interfaces, generics
- React with TS: props, state, hooks, event types
- Utility types (Partial, Pick, Omit, Record)

## Types, Interfaces, Generics - Q&A
1. What’s the difference between `type` and `interface` in TypeScript?
   - Both are ways to describe the shape of data.
     **interface** is **reopenable**: you can declare the same name again elsewhere and TypeScript merges the declarations (declaration merging). That's why it's often used for public APIs that others might want to extend.
     **type** is **more expressive**: it can also describe unions (`A | B`), intersections and primitives—not just object shapes. Interfaces can't do that.
     Example:
     ```ts
     interface User { id: string }
     interface User { name: string } // merged (reopenable)

     type Status = "idle" | "loading";           // union of primitives
     type Coords = [number, number];             // tuple
     type WithTimestamp = User & { createdAt: Date }; // intersection
     // Interfaces cannot express unions, tuples, or intersections like these.
     ```
2. What is a generic, and when would you use one?
   - A generic is a type “placeholder” so one function can work with many data types safely. It lets
     you say “whatever type goes in, the same type comes out,” instead of using `any`.
     Example:
     ```ts
     function identity<T>(value: T): T { return value; }
     const n = identity<number>(5);
     ```
3. When should you use a union vs a generic?
   - Use a union for a fixed set of options (`"success" | "error"`). 
   - Use a generic when you want the same structure to work for many types while preserving the actual type.

     In short: union = fixed choices; generic = placeholder chosen at usage.
     Example:
     ```ts
     type Status = "success" | "error";
     type ApiResponse<T> = { data: T; status: Status };
     ```

## React with TypeScript - Q&A
1. How do you type component props in React with TypeScript?
   - Use an interface/type for props: `type Props = { title: string; onClick: () => void };` then
     `function Card({ title, onClick }: Props) { ... }`.
     Example:
     ```ts
     type Props = { title: string; onClick: () => void };
     function Card({ title, onClick }: Props) { return <button onClick={onClick}>{title}</button>; }
     ```
     Explanation: Props types document what a component expects, catch missing/incorrect props, and
     improve autocomplete for consumers of the component.
2. How do you type state and setState for `useState`?
   - Provide a generic: `const [count, setCount] = useState<number>(0);` or infer from the initial value.
     Example:
     ```ts
     const [count, setCount] = useState<number>(0);
     ```
     Explanation: Typing state prevents invalid updates (e.g., setting a number state to a string).
3. How do you type event handlers in React (e.g., input change)?
   - Use React event types: `const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }`.
     Example:
     ```ts
     const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
     const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       // form data...
     };
     ```
     Explanation: Event types give you the correct `target` shape and prevent accessing missing fields.

## Utility Types - Q&A
1. What does `Partial<T>` do?
   - Makes all properties optional: `Partial<User>` is useful for patch updates.
     Example:
     ```ts
     type User = { id: string; name: string };
     const patch: Partial<User> = { name: "Sam" };
     ```
     Explanation: Useful when you only update a subset of fields and don’t want to repeat the full type.
2. What does `Pick<T, K>` and `Omit<T, K>` do?
   - `Pick` keeps only selected keys, `Omit` removes selected keys.
     Example:
     ```ts
     type User = { id: string; name: string; email: string };
     type UserPreview = Pick<User, "id" | "name">;
     type UserNoEmail = Omit<User, "email">;
     ```
     Explanation: Helps shape types for specific views without duplicating entire interfaces.
3. What does `Record<K, V>` do?
   - Creates an object type with keys `K` and values `V`, e.g. `Record<string, number>`.
     Example:
     ```ts
     const scores: Record<string, number> = { alice: 10, bob: 8 };
     ```
     Explanation: Useful for maps/dictionaries where keys are known types and values share a type.
