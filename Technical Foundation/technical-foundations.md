🧩 1️⃣ Common React / JS / TS Question Categories

Every React interview — no matter the company — pulls from these six buckets:

Category	
Typical Question Style	
What They’re Actually Testing


1. React Core Concepts	
“Explain React’s rendering behavior”, “What are hooks?”, “How does reconciliation work?”	
Conceptual depth, clarity


2. State Management	
“Context vs Redux?”, “When to use Redux Toolkit?”, “Prop drilling solutions?”	
Architectural thinking


3. Performance Optimization	
“How do you prevent re-renders?”, “What causes performance issues in React?”	
Real-world debugging & optimization


4. Advanced React Patterns	
“Explain custom hooks”, “What is HOC vs render props?”, “How to share logic?”	
Abstraction & reusability


5. Next.js / SSR	
“How does SSR differ from CSR?”, “What’s ISR?”, “How do you optimize SEO with Next.js?”	
Ecosystem & framework understanding


6. TypeScript & Scalability	
“How do you type React components?”, “Generics?”, “Why use TypeScript?”	
Code quality, scalability, safety

What You Do??
- Start with a crisp conceptual definition.
- Add a real use case from your own experience. (skip if there is none)
- Show awareness of trade-offs or limitations.







🧩 Topic 1: React Rendering & Reconciliation
Explain:
“React follows a declarative model where the UI is a function of state. When state or props change, React re-renders the component to produce a new virtual DOM tree. It then compares this with the previous version using its reconciliation algorithm and only updates what’s different.”

Apply:
“In one of our dashboards at Hello Chapter, we had nested components re-rendering too frequently due to changing object props. I optimized it by wrapping child components with React.memo and stabilizing function props using useCallback, which reduced unnecessary re-renders.”

Reflect:
“That experience taught me that understanding React’s render cycle is more important than just using optimizations — because sometimes, restructuring data flow can eliminate entire re-renders altogether.”

Hook Lines to Trigger Deeper Questions

“...and that’s where I started exploring React Fiber, which completely changed how React schedules rendering.”
👉 (Triggers “What is React Fiber?”)

“In some cases, I used concurrent features like useTransition to make updates feel smoother.”
👉 (Triggers “Can you explain concurrent rendering?”)

“We actually had a case where Context propagation caused unwanted re-renders.”
👉 (Triggers “How does Context cause re-renders?”)





🧩 Topic 2: React Component Lifecycle (Hooks Model)
Explain:
“React function components don’t have lifecycle methods — instead, each render is a pure function of state and props.
When we need to run side effects or respond to mounting/unmounting, we use Hooks like useEffect.
Effects run after render commits, and React re-runs them when dependencies change.
Cleanup functions inside effects handle unmounting or re-subscribing cleanly.”

Apply:
“For example, in our internal dashboard, I had to poll server data at intervals.
I used useEffect with a timer, and cleaned it up inside the return callback to prevent multiple timers from stacking up.”

Reflect:
“I’ve learned that understanding when and how effects run is more important than memorizing lifecycle phases — it helps prevent subtle bugs like infinite loops or stale closures.”

Hook Lines to Steer Interview Direction

“We had to handle cleanup carefully to avoid memory leaks when switching routes.”
👉 “Can you explain how cleanup works in useEffect?”

“Sometimes, I prefer useLayoutEffect when I need layout measurements before the paint.”
👉 “What’s the difference between useEffect and useLayoutEffect?”

“I use a pattern where data fetching and state sync are separated across effects to avoid race conditions.”
👉 “Can you explain race conditions in React effects?”

“In some cases, I replace useEffect logic with derived state to reduce dependency issues.”
👉 “How do you decide when not to use useEffect?”





🧩 Topic 3: State Management in React
1️⃣ Core Mental Model

At its core, state = data that drives UI.
React’s entire rendering system is based on reacting to state changes — when state updates, React re-renders the component tree to reflect the new UI.

But not all state is equal.
As apps grow, it’s crucial to know where the state should live and how to manage its scope.

2️⃣ Local State Management
🔹 useState
For simple, isolated state — toggles, forms, small UI data.
React re-renders the component every time the state setter runs.
The new state is merged via replacement, not shallow merge.

🔹 useReducer
Used when state transitions are complex or dependent on actions.
Perfect for form state, wizard flows, or local business logic.

3️⃣ Shared / Global State
Once state needs to be shared across multiple components, you have three main choices:

🔸 1. Context API
Lightweight solution for shared config or theming — not ideal for high-frequency updates.
✅ Best for: theme, locale, current user, config
⚠️ Caveat:
All consumers re-render when context value changes.
“Context causes full subtree re-renders, which can impact performance if not memoized properly.”

🔸 2. Redux Toolkit
Centralized, predictable state container — ideal for complex apps and team scaling.
✅ Best for: medium–large apps, async logic, shared data
Uses immutable updates
Time-travel debugging
Clear data flow (actions → reducers → store)
“Redux adds boilerplate, but Redux Toolkit simplified it with slices, Immer, and RTK Query.”

4️⃣ Server State (React Query / SWR)
Data that lives on the server and must stay in sync with it — e.g., fetched APIs.
React Query handles:
Caching
Background updates
Request deduplication
Retry logic

5️⃣ Real Example (Your Hello Chapter Project)
“In Hello Chapter, we have three separate web apps — client, contractor, and backoffice.
Each app manages a mix of local and global state.
For example, in the contractor app, I use local state for UI interactions like filters and modals, Context for user session, and Redux Toolkit for shared domain data like job lists and contractor details.
We also use React Query for server state — it keeps our API cache in sync and avoids redundant network calls when switching between tabs.”

Explain:
“React’s reactivity comes from state changes. Depending on scope, I categorize state as local, global, or server state.
Local state is handled with Hooks like useState or useReducer.
For shared state, I use Context for small data and Redux Toolkit for larger, multi-module data.
Server state is best handled by React Query — it syncs cache and reduces API load.”

Apply:
“For instance, in our contractor dashboard, Redux manages active job data, React Query handles API fetching and caching, and Context provides user session info across routes.”

Reflect:
“I’ve learned that clarity of data flow matters more than tool choice — overusing global state can make even simple updates complex.”

6️⃣ Hook Lines to Trigger Targeted Questions:

“We optimized Context usage with memoized providers to avoid unnecessary re-renders.”
👉 “How do you prevent Context from re-rendering everything?”

“I like to separate server and client state — it simplifies caching and invalidation.”
👉 “What’s the difference between client and server state?”

“Redux Toolkit’s Immer integration made immutable updates trivial.”
👉 “How does Redux handle immutability?”

“In one case, React Query’s background refetch helped us keep data fresh without manual polling.”
👉 “Can you explain how React Query caching works?”





🧩 Topic 4: React Performance Optimization
1️⃣ Core Mental Model
goal isn’t to “stop React from rendering,” but to ensure it renders only what truly needs to — and that renders are fast when they do happen.

Common Causes of Unnecessary Re-renders:
- Prop reference changes. Passing new inline functions or objects. Fixed by: useCallback, useMemo.
- Context overuse. A single context providing a large object. Fixed by: Split contexts, use selectors.
- Parent re-render cascade. Parent re-renders, forcing child re-renders. Fixed by: React.memo.
- Frequent state updates. Typing input → setState on every keystroke. Fixed by: Debouncing, batching.
- Non-memoized expensive operations. Sorting, filtering arrays. Fixed by: useMemo, lazy computations.

2️⃣ Render Optimization (Component Level)
⚡ React.memo
Skips re-render if props didn’t change (shallow compare)
Works only for pure components (same inputs → same output)
⚙️ useMemo
Memoizes expensive calculations between renders
⚙️ useCallback
Memoizes function references
Prevents re-renders in children wrapped in React.memo
Over-memoization leads to stale closures or complex dependency arrays.
Measure before optimizing.

3️⃣ Architectural Optimization
🧠 1. Keep state local
Move state down as much as possible — fewer components re-render.
⚙️ 2. Split contexts
Avoid large context objects; they trigger re-renders across consumers.
🧩 3. Derived state > Duplicated state
Don’t store what you can derive — compute it with useMemo or selectors.
⚙️ 4. Normalize data
Keep Redux or shared state flat (like a DB table) to minimize changes.

4️⃣ Bundle Optimization
Performance isn’t just runtime — it’s load time too.
🚀 Lazy Loading
Dynamically import components only when needed.
⚙️ Code Splitting
Break bundle by route, component, or feature.
Handled automatically in frameworks like Next.js.

5️⃣ Real Example (Hello Chapter Project)
“In Hello Chapter, performance was a big concern since our backoffice app handles large contractor datasets and live project data.
We reduced re-renders by wrapping stable child components with React.memo, memoizing selectors, and debouncing filters.
We also split our bundle using dynamic imports for dashboards and report pages, reducing initial load time by nearly 40%.
React Profiler helped identify wasted renders — and most of them came from unnecessary context updates, which we fixed by splitting providers.”

Explain:
“I look at React performance across three layers — rendering, architecture, and bundling.
At the render level, I use React.memo, useMemo, and useCallback to avoid unnecessary re-renders.
Architecturally, I minimize global state and split contexts to prevent cascading updates.
Finally, I apply lazy loading and code splitting for faster load times.”

Apply:
“In our internal dashboard, we used React.memo to isolate pure components, optimized context usage, and implemented route-based code splitting, cutting down initial bundle size by 40%.”

Reflect:
“I’ve learned that premature optimization can backfire — so I always measure using the React Profiler before applying any changes.”

6️⃣ Hook Lines to Trigger Targeted Questions:

“We used React Profiler to pinpoint unnecessary re-renders.”
👉 “How do you use React Profiler?”

“Context updates were our biggest performance bottleneck.”
👉 “Why does Context cause re-renders?”

“We used route-based code splitting to cut bundle size.”
👉 “How does lazy loading work in React?”

“Sometimes, I skip memoization — it’s not always worth the overhead.”
👉 “When would you not use React.memo?”





🧩 Topic 5: Component Design Patterns
1️⃣ Controlled vs Uncontrolled Components
Controlled
- state lives in react state
- Single source of truth + validation

Uncontrolled
- state lives in DOM state
- Less re-renders + better performance

use controlled for business logic forms, uncontrolled for fast simple inputs (search bars, filters).

2️⃣ Compound Components Pattern
- A parent component exposes its parts so consumers compose behavior declaratively.
- compound components to give teams freedom without exposing internal logic.

3️⃣ Higher-Order Components (HOCs)
- Function that takes a component and returns a new one.
- used to wrap cross-cutting concerns (auth, logging, analytics).
- Cons: harder debugging, name clashes, props leakage.

4️⃣ Custom Hooks Pattern
- Extract reusable logic across components — the modern way.
- Use when: logic is shared, not UI.
- Keeps components lean and readable.
- Avoid “micro-hooks” that just wrap one line.

function useFetch<T>(url: string) {
  const [data, setData] = useState<T|null>(null);
  useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);
  return data;
}

5️⃣ Container-Presenter Pattern
- Split logic (container) from UI (presenter).
- encourages testability and separation of concerns.

🚀 6️⃣ Real-World Example (Hello Chapter)

“I treat React patterns as a design vocabulary — each pattern solves a different scaling problem.
For example, I use compound components when I want flexible UIs like modals or dropdowns;
custom hooks for reusing data logic; and I’ve gradually replaced older HOCs with hooks for better type safety and debugging.
In our Digialpha project, our dropdown and modal systems use the compound component pattern with internal contexts — keeping the API clean while giving freedom to developers.”





🧩 Topic 5: Next.js & SSR (Server-Side Rendering)
🧠 1️⃣ Why Next.js Exists
React alone handles UI rendering in the browser (CSR). Next.js extends React by adding:
- Server-Side Rendering (SSR). Faster first paint, SEO-friendly
- Static Site Generation (SSG). Build-time pre-rendering for max speed
- Incremental Static Regeneration (ISR). Combines static & dynamic updates
- File-based routing. Simplifies navigation
- Image Optimization. Automatic lazy loading, resizing
- Middleware. Edge logic (auth, redirects, A/B tests)

🌐 2️⃣ Rendering Models: CSR vs SSR vs SSG vs ISR
- CSR (Client-Side Rendering). HTML is Generated at Browser (after JS loads). Use Case: Dashboards, logged-in apps.
- SSR (Server-Side Rendering). HTML is Generated at On every request (server). Use Case: SEO pages, user profiles.
- SSG (Static Site Generation). HTML is Generated at build time. Use Case: Blogs, marketing sites.
- ISR (Incremental Static Regeneration). HTML is Generated at Initially static, revalidated periodically. Use Case: Product listings, CMS pages.
Ex.
export async function getStaticProps() {
  const data = await getAllPosts();
  return { props: { data }, revalidate: 60 }; // rebuild every 60s
}

📦 3️⃣ Data Fetching Strategies (By Rendering Type)
- CSR. useEffect(fetch...); Runs on Browser
- SSR. getServerSideProps; Runs on Server
- SSG. getStaticProps; Runs on Build-time
- ISR. getStaticProps + revalidate; Runs on Build + Server

⚙️ 4️⃣ SEO, Caching & Performance
- SSR/SSG HTML. Crawlers get pre-rendered content. 
- Meta tags (next/head). Dynamic SEO metadata. 
- Image Optimization. Reduces LCP. 
- Automatic Code Splitting. Reduces JS bundle. 

🚀 5️⃣ Real-World Example (Hello Chapter)

“Our Hello Chapter platform has multiple web apps — one of them is content-heavy for marketing and client onboarding.
We used Next.js with a hybrid strategy:
Marketing pages use SSG + ISR for fast, SEO-friendly rendering.
Authenticated dashboards use CSR, since data is user-specific.
This gave us the right mix of SEO performance and interactivity.
We also leveraged next/image and dynamic imports to cut initial bundle size.”

🧰 7️⃣ Interview Delivery Template

“I like using Next.js because it lets me choose the right rendering strategy per page.
For public, SEO-driven content, I prefer SSG or ISR for speed and caching.
For user-specific or real-time data, SSR or CSR makes more sense.
With the new App Router, I rely on server components for most data-heavy views and limit client components to interactive parts.
This improves performance and reduces bundle size.”





🧩 Topic 6: TypeScript & Scalability in React
TypeScript helps make large React codebases predictable and refactor-safe.
It adds static type checking, so bugs are caught before runtime — and it doubles as living documentation for teams.

TypeScript:
- Prevents runtime errors during compile time.
- Documents props and return values automatically.
- Improves IDE auto-completion & refactoring safety.

2️⃣ Typing React Components
interface ButtonProps {
  label: string;
  onClick: () => void;
}
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
- Prefer plain function syntax over React.FC (no implicit children).
- Keep prop types separate (readable + reusable).


3️⃣ Typing Events and State
| `onChange={(e: React.ChangeEvent<HTMLInputElement>) => ...}` | Input event |
| `onSubmit={(e: React.FormEvent<HTMLFormElement>) => ...}` | Form event |
| `useState<string>('')` | State with explicit type |
| `useState<User | null>(null)` | Union type for async data |
- always type states that start as `null` with unions, like `User | null`, to avoid unnecessary null checks later.

4️⃣ Typing Hooks (Custom Hooks)
function useFetch<T>(url: string): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  // ...
  return { data, loading };
}
- Use generics (<T>) for reusable hooks — e.g., fetching different API data shapes.

5️⃣ Typing Context & Reducers
✅ Context Example
type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType | null>(null);

✅ Reducer Example
type Action = { type: 'ADD'; payload: number } | { type: 'REMOVE'; payload: number };
function reducer(state: number[], action: Action): number[] {
  switch (action.type) {
    case 'ADD': return [...state, action.payload];
    case 'REMOVE': return state.filter(i => i !== action.payload);
  }
}