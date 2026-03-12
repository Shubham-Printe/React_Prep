# Forms, Routing & Patterns
- React Router basics (routes, params, nested routes)
- Protected routes and auth flows
- URL-driven state (query params, pagination, filters)
- Forms: controlled vs uncontrolled, validation, submission
- Component patterns (composition, container/presenter)

## Routing (senior-level) — mental model + options
Routing is not just “URL → component”. As a senior dev, think in these 3 axes:
- **UI mapping**: what URL maps to what *layout tree* (nested routes, shared frames, tabs).
- **Data & mutations**: where data is loaded and where writes happen (component-level vs route-level vs server).
- **Navigation ownership**: who “owns” transitions (client, server, or hybrid) and what guarantees you need (SEO, auth, performance).

### Types of routing available (say it in an interview)

1. **Client-side SPA routing — the “UI router” (BrowserRouter, Routes, Route)**  
   This is what most React apps start with: you wrap the app in `BrowserRouter`, define `Routes` and `Route`, and the URL maps to components on the client. I’d use it when we’re building something like a dashboard or internal tool where SEO isn’t critical and we want a simple, client-only setup. The upside is it’s straightforward, in-app navigation is fast, and it plays well with things like React Query. The downsides: if someone refreshes on a deep link we need server rewrites so the same HTML is served; first paint and SEO are usually weaker than with SSR; and if we’re not careful, auth guards can run after the first paint, so we might briefly show protected UI.

2. **Client-side Data Router (React Router v6.4+ — createBrowserRouter + RouterProvider)**  
   Here we define routes with `loader`, `action`, `errorElement` and use `RouterProvider`. It’s still a SPA, but data loading and mutations are owned by the route. I’d choose this when we want route-level data loading, redirects, and error boundaries. The big win is that the loader runs *before* we render the route, so we can redirect in the loader and avoid the “flash of unauth content” that component-level guards sometimes cause. The trade-off is we need to understand the loader/action lifecycle and revalidation, and we have to be clear where React Query stops and the data router starts so we don’t duplicate caching.

3. **Hash-based routing (HashRouter / createHashRouter)**  
   The URL looks like `/#/users/1` — everything after the hash is client-side. I’d use it when we can’t configure server rewrites. Deep links then work without any server config. The trade-off is uglier URLs, weaker SEO, and sometimes messier analytics.

4. **Memory routing (MemoryRouter / createMemoryRouter)**  
   The history lives in memory, not in the browser URL bar. I use it in tests, Storybook, or embedded flows — and in React Native where there’s no URL bar. It’s deterministic and great for testing navigation. We wouldn’t use it for normal web navigation.

5. **Server-first / hybrid (Next.js, Remix, etc.)**  
   The server is part of routing and data — often file-based, with SSR. I’d use it for public-facing pages where SEO and fast first paint matter, or when we need auth and data checks to happen on the server before we send HTML. The upside is the strongest SEO and initial load, and guards are enforced early. The downside is more moving parts — runtime, deploy, and framework-specific data and cache conventions — and for internal tools it’s often more than we need.

### Decision cheatsheet (what to use when)
- **Internal dashboard, SEO irrelevant** → React Router SPA (**UI router** or **Data Router**)
- **Need pre-render guards + route errors** → React Router **Data Router**
- **Public-facing/SEO/fast first paint** → **Next/Remix** (SSR/SSG as needed)
- **No server control for rewrites** → **HashRouter**
- **Tests/Storybook** → **MemoryRouter**

### Route guard patterns (what seniors choose)
- **Component guard (UI router)**: `<ProtectedRoute/>` wrapper; good UX, but ensure you avoid flashing protected UI.
- **Data-router guard**: use `loader()` to check auth/role and `redirect()` early (cleaner “no flash” semantics).
- **Server guard (SSR/hybrid)**: enforce auth/role in server loaders/middleware; still handle 401/403 gracefully in UI.

## React Router basics - Q&A
1. What's the difference between client-side routing and server-side routing, and what breaks on refresh/deep link if the server isn't configured correctly?
   - **Client-side routing**: the browser loads `index.html` + JS once, then navigation happens inside the app. The router swaps components based on the URL without a full page reload.
   - **Server-side routing**: the server handles every URL directly and decides what HTML/response to return for each path.
   - **Refresh/deep link problem in SPAs**: if you open `/orders/123` directly (or refresh), the browser requests that exact path from the server. If the server isn't set up for SPA routing, it returns **404** because `/orders/123` isn't a real file/route on the server.
   - **Fix**: serve `index.html` for app routes and real files for static assets. The client-side router then loads and shows the right page.

2. When would you use nested routes, and what does `<Outlet />` solve?
   - Use nested routes when multiple pages share the same "frame" (header/sidebar/tabs) and only a part of the screen should change as the URL changes.
   - `<Outlet />` is the placeholder inside the parent layout where the matched child route renders.

2.5 Quick mental model — `<Routes />` vs `<Route />` vs `<Outlet />` (plus `index`, `*`, protected routes)
   - **`<Routes />`**: The **matcher** — it doesn’t define paths itself. It wraps one or more `<Route />` children, looks at the current URL, and **picks which Route matches**. Think of it as “the thing that decides which route we’re on.” When the URL changes, the **Router** updates the location; the app re-renders, and `<Routes />` runs again and picks the new best match. So the Router is what “listens” to navigation; `<Routes />` is what “decides” on every render based on the current location.
   - **`<Route />`**: A **single route definition** — “for *this* path, render *this* element.” Each `<Route />` has a `path`, an `element`, and can have nested `<Route />`s. Think of it as “one rule: path → component.” Many `<Route />`s live inside one `<Routes />`; `<Routes />` does the matching, each `<Route />` is one of the options.
     - Common props: `path`, `element`, `children`, `index` (and in data routers: `loader`, `action`, `errorElement`, etc.).
     - **Simple data router example:**
       ```jsx
       import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

       const router = createBrowserRouter([
         {
           path: "/",
           element: <Layout><Outlet /></Layout>,
           children: [
             { index: true, element: <Home /> },
             {
               path: "user/:id",
               loader: async ({ params }) => {
                 const res = await fetch(`/api/users/${params.id}`);
                 if (!res.ok) throw new Response("Not found", { status: 404 });
                 return res.json();
               },
               element: <UserPage />,
               errorElement: <ErrorFallback />,
             },
           ],
         },
       ]);

       function App() {
         return <RouterProvider router={router} />;
       }
       ```
       The **loader** runs before the route renders; the page component can read the data with `useLoaderData()`. **errorElement** catches errors (e.g. 404) for that route.
     - **`index`**: “default child route” for a parent path.
     - **`path`**:  
       - **Relative (no leading `/`)**: the path is *appended* to the parent’s path.  
         - Example 1: parent `path="/products"`, child `path=":id"` → full path is `/products/:id`. So we match URLs like `/products/42` or `/products/chair`; the `:id` captures that segment (e.g. `"42"`).  
         - Example 2: parent `path="/account"`, child `path="settings"` → full path is `/account/settings`. Both parts are fixed; no dynamic segment.  
       - **Absolute (leading `/`)**: the path is from the *root*, ignoring the parent. 
         - Example: parent `path="/users"`, child `path="/profile"` → matches `/profile`, not `/users/profile`. Use when you want a child route to match a top-level URL.  
   - **`<Outlet />`**: a placeholder inside a parent route’s `element` where the matched child route’s `element` renders.
   - **Protected route**: a wrapper that checks a condition and either renders the intended route (often via `children`/`<Outlet />`) or redirects/shows fallback UI.
   - **`*`**: catch-all for “not found”.

3. What's the difference between `Link` and a plain `<a href>` in a SPA?
   - **`<a href>`**: Browser does full page reload; restarts app, drops in-memory state.
   - **`<Link to="...">`**: Client-side navigation; updates URL and renders new route without reload. Keeps SPA fast and preserves in-memory state.
   - Use `<a>` for external links, downloads, `mailto:` / `tel:`.

4. What is programmatic navigation (`useNavigate`), and when would you use it?
   - `useNavigate()` gives a `navigate()` function to change routes in code.
   - Use after form submit success (→ details page), auth flows (login → return URL), logout (→ login), or "Back" buttons (`navigate(-1)`).

## Protected routes and auth flows - Q&A
1. How would you implement a protected route in React Router?
   - Wrap protected routes with a `RequireAuth` component that checks authentication.
   - If allowed: render the page (via `children` or `<Outlet />`).
   - If not: redirect to login, and store the original URL so you can send the user back after login.

2. What's the difference between "not authenticated" and "not authorized"?
   - **Authentication** answers “Who are you?” — are you logged in, do we know your identity? If not, we don’t know who the user is, so we typically redirect to login and optionally store the URL they wanted so we can send them back after login.
   - **Authorization** answers “Are you allowed to do this?” — we know who you are, but do you have permission for this resource or action? For example, a logged-in user might try to open an admin page; they’re authenticated but not authorized. We usually show something like “Access denied” and a safe next step (e.g. go to dashboard), and the backend would return 403 for protected APIs.
   - **In short:** Not authenticated → “We don’t know you” → send to login. Not authorized → “We know you, but you can’t do this” → show access denied, don’t expose sensitive data.

3. Where should auth checks happen—frontend vs backend?
   - **Backend** must enforce auth for every protected API (the real security boundary).
   - **Frontend** checks auth for UX (hide/disable restricted UI, protect routes). Backend returns 401 (not authenticated) or 403 (not authorized); frontend handles these gracefully in the UI.

## URL-driven state - Q&A
1. What's the difference between path params (`/users/:id`) and query params (`/users?id=123`)?
   - **Path param**: part of the page identity (specific resource). Example: `/users/123` = User 123 details.
   - **Query param**: optional configuration of the same page (filters, sort, pagination, search). Example: `/users?status=active&page=2`.

2. What are two benefits of keeping filters/sort/pagination in the URL?
   - **Shareable/bookmarkable**: URL fully represents the view; sharing reproduces the same state.
   - **Navigation-friendly**: refresh and browser back/forward preserve state.

## Forms - Q&A
1. What's the difference between controlled and uncontrolled inputs?
   - **Controlled**: `value` + `onChange` driven by React state; React is the single source of truth. Better for live validation.
   - **Uncontrolled**: DOM manages value; you read via refs or `FormData`. Simpler for basic forms.

2. How do you handle form validation in React?
   - Inline field validation for immediate feedback; form-level check on submit. Keep rules in the form layer (or shared schema like Yup/Zod). Always validate again on the server.

3. How do you handle form submission and prevent default?
   - Attach `onSubmit` to `<form>`, call `event.preventDefault()`. Read controlled state (or refs/FormData for uncontrolled), run validation, then submit.

## Component patterns
- **Container/presentational**: Container manages state and logic; presentational focuses on UI and receives data/handlers via props.
- **Composition**: Build UI by combining smaller components via props and `children`; prefer over inheritance.
- **Prop drilling** → replace with Context when shared data crosses many levels (theme, auth, locale).
