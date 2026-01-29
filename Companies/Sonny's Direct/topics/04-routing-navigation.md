# Routing and Navigation
- React Router basics (routes, params, nested routes) (score: 6/10)
- Protected routes and auth flows (score: 7/10)
- URL-driven state (query params, pagination, filters) (score: 8/10)

## React Router basics (routes, params, nested routes) - Q&A
1. What’s the difference between client-side routing and server-side routing, and what breaks on refresh/deep link if the server isn’t configured correctly?
   - **Client-side routing**: the browser loads `index.html` + JS once, then navigation happens
     inside the app. The router swaps components based on the URL without a full page reload.
   - **Server-side routing**: the server handles every URL directly and decides what
     HTML/response to return for each path.
   - **Refresh/deep link problem in SPAs**: if you open `/orders/123` directly (or refresh),
     the browser requests that exact path from the server. If the server isn’t set up for
     SPA routing, it returns **404** because `/orders/123` isn’t a real file/route on the server.
   - **Fix**: configure a **catch-all rewrite** so unknown app routes return `index.html`
     (while still serving real assets like `/assets/*`). Then the client router takes over
     and renders the correct page.
2. When would you use nested routes in React Router, and what problem does `<Outlet />` solve?
   - Use nested routes when multiple pages share the same “frame” (header/sidebar/tabs)
     and only a part of the screen should change as the URL changes.
   - Put the shared layout in the parent route and define child routes under it, instead of
     duplicating the layout for every route.
   - `<Outlet />` is the placeholder inside the parent layout where the matched child route renders.
   - Example:
     - `/users`: shows the Users layout and the content area says “Select a user”.
     - `/users/123`: shows the same Users layout, but the content area shows “User 123 details”.
3. What’s the difference between `Link` and a plain `<a href>` in a SPA, and when would you still use `<a>`?
   - **`<a href="...">`**:
     - Browser treats it as normal navigation, so it often does a **full page reload**.
     - That restarts the app, can drop in-memory state, and is usually slower.
   - **`<Link to="...">` (React Router)**:
     - Does **client-side navigation** (updates the URL + renders the new route) without reloading
       the page.
     - Keeps the SPA fast and preserves state that lives in memory.
   - **When to still use `<a>`**:
     - External links (different domain), downloads, `mailto:` / `tel:`.
     - Rarely: when you intentionally want a full reload.
4. What is an index route and when would you use it with nested routes?
   - (Pending)
5. What is programmatic navigation (`useNavigate`) and what are safe/common use-cases for it?
   - **What it is**: `useNavigate()` gives you a `navigate()` function to change routes in code,
     without the user clicking a link.
   - **Safe/common use-cases**:
     - After a successful action: submit form → go to a details page (`/orders/123`).
     - Auth flows: login success → return to the page the user originally tried to visit.
     - Logout: logout → go to `/login`.
     - “Back” buttons: `navigate(-1)`.
     - Replace history when you don’t want the back button to return to the old page:
       `navigate('/x', { replace: true })`.
   - **Good practice**: for normal navigation links in UI, prefer `<Link>` (more semantic).

## Protected routes and auth flows - Q&A
1. How would you implement a protected route in React Router, and what are two common UX behaviors when the user isn’t logged in?
   - **Implementation**: wrap protected routes with a `RequireAuth` component that checks whether
     the user is authenticated.
     - If allowed: render the requested page (often via `children` or `<Outlet />`).
     - If not allowed: block access.
   - **Common UX behaviors**:
     1) **Redirect to login**, and remember the original URL so you can send the user back after login.
     2) **Show a session-expired / not-authorized screen** with a clear action
        (log in again / request access).
   - **Good practice**: if auth status is still loading (session check in progress), show a small
     loading state to avoid flicker.
2. What’s the difference between “not authenticated” and “not authorized”, and how should the UI behave for each?
   - **Authentication** = “Who are you?” (are you logged in / does the system know you?)
   - **Authorization** = “Are you allowed?” (even if logged in, do you have permission?)
   - **UI behavior**:
     - Not authenticated: redirect to Login (and ideally return the user to the original URL after login).
     - Not authorized: show an “Access denied” screen (or disable/hide restricted actions) and provide
       a safe next step (go back / request access / contact admin).
   - **Important**: UI can guide the user, but the backend must enforce authorization (UI alone isn’t security).
3. How do you preserve the “return to” URL after login, and what’s the security pitfall to avoid?
   - **How to preserve “return to”**:
     - When blocking a protected page, redirect to `/login` and store the original URL the user tried
       to open.
     - After successful login, redirect to that stored URL (or a safe default like `/`).
     - Common ways to store it:
       - Router state (e.g., pass `{ from: location }` when redirecting to login).
       - A query param like `/login?returnTo=/orders/123`.
   - **Security pitfall to avoid**:
     - **Open redirect**: don’t trust a `returnTo` that points to an external site.
       Only allow internal paths (e.g., must start with `/`) or a known allowlist.
     - After login, re-check authorization before redirecting to the target route.
4. Where should auth checks happen (frontend vs backend), and why is frontend-only auth not enough?
   - **Backend** must enforce auth for every protected API and action (this is the real security boundary).
   - **Frontend** should also check auth for UX (hide/disable restricted UI, protect routes, show clear
     errors).
   - **In practice**:
     - Backend returns **401** when the user is not logged in (not authenticated).
     - Backend returns **403** when the user is logged in but not allowed (not authorized).
     - Frontend handles these responses: redirect to login, show “access denied”, etc.
   - **Why frontend-only isn’t enough**: people can bypass the UI and call APIs directly, so the backend
     must protect the real data/actions.
5. What are common causes of “login redirect loops” and how do you debug/fix them?
   - **Common causes**:
     - **Stale auth state**: UI thinks you’re logged in (old token/cookie), but backend returns 401
       → redirect to login → login sees “token present” and redirects back.
     - **Race condition after login**: you navigate before auth is fully saved/loaded, so the guard still
       thinks “not logged in” and redirects back to login.
     - **No loading state**: guard runs while “checking session” and redirects too early.
     - **Wrong rules**: login route is protected, or `returnTo` points to a route the user still can’t access.
   - **How to debug**:
     - Log each redirect decision (route, auth status: logged out/checking/logged in, token presence,
       user loaded, last API status 401/403).
     - In DevTools, check Network (where 401/403 comes from) and Storage/Cookies (token/cookie set/cleared).
   - **How to fix**:
     - Treat auth as a small state machine: **checking → logged in → logged out** (don’t redirect while checking).
     - Clear invalid tokens on 401 and only redirect after auth state is updated.
     - After login, redirect only after auth is ready (token/cookie saved + user/session loaded).
     - Ensure `/login` is always accessible and validate `returnTo`.

## URL-driven state (query params, pagination, filters) - Q&A
1. In React Router, what’s the difference between a path param (`/users/:id`) and a query param (`/users?id=123`), and when would you use each?
   - **Path param** (`/users/:id`):
     - Use when the value is part of the **main identity of the page** (a specific resource).
     - Example: `/users/123` = “User 123 details page”.
   - **Query param** (`?status=active&page=2`):
     - Use for **optional configuration** of the same page: filters, sorting, pagination, search,
       view mode.
     - Example: `/users?status=active&page=2` = “Users list, filtered and paginated”.
   - **Rule of thumb**: different entity/page → path param; same page with different options → query param.
2. How do you manage URL-driven state (filters/sort/pagination/search) using query params, and what are 2 benefits of keeping that state in the URL?
   - **How**:
     - Read query params (like `page`, `sort`, `q`, `status`) from the URL using `useSearchParams` (or `useLocation` + `URLSearchParams`).
     - When the user changes filters/pagination, update the query params.
     - Fetch data based on those params (often via a request that depends on them, or a `useEffect`
       that runs when they change).
   - **Benefits**:
     1) **Shareable/bookmarkable**: the URL fully represents the view, so sharing it reproduces the same filters/pagination.
     2) **Navigation-friendly**: refresh and browser back/forward preserve the same state without extra in-memory state.
3. How do you validate/sanitize query params (defaults, invalid values), and avoid breaking the page?
   - **Parse → validate → normalize**:
     - Read params as strings, then convert to the types you need (number/boolean/enum).
   - **Defaults**:
     - If a param is missing or invalid, fall back to a safe default (`page=1`, `sort=recent`).
   - **Allowlists**:
     - For enums like `sort`, only allow known values. Anything else → default.
   - **Clamping**:
     - For numbers like `page`/`limit`, clamp to a safe range (e.g., `page >= 1`, `limit <= 100`).
   - **Sanitize text**:
     - Trim whitespace for search text (`q.trim()`), and cap length if needed.
   - **Keep URL clean (optional)**:
     - Rewrite the URL to the normalized values so links stay stable/shareable.
4. How do you handle pagination in the URL without creating “off by one” bugs?
   - Pick one convention and stick to it (usually URL is **1-based**: `page=1` is the first page).
   - Convert at the boundary:
     - If the API expects 0-based pages, do it once: `apiPage = pageFromUrl - 1`.
   - Validate + clamp:
     - Parse `page` as a number, default to 1, clamp to `page >= 1`.
   - Reset page on filter changes:
     - If search/sort/filter changes, set `page=1` to avoid empty pages.
   - Keep naming consistent:
     - Prefer `page` + `pageSize`, and avoid mixing `offset` and `page` unless required.
5. When would you *not* put UI state in the URL, and keep it local instead?
   - Don’t put state in the URL when it is:
     - **Sensitive**: tokens, passwords, personal data (URLs get logged, shared, stored in history).
     - **Too noisy / constantly changing**: cursor position, live typing, hover state, open dropdown.
     - **Purely visual / temporary**: tooltips, transient UI toggles, scroll position (usually local).
     - **Too large**: big objects/long lists that make the URL huge.
     - **Not meant to be shareable**: if sharing the link shouldn’t reproduce that exact state.
   - Rule of thumb: URL is for shareable/bookmarkable “view state” (filters/sort/page/search).
