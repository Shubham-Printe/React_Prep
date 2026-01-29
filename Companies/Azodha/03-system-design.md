# Frontend System Design (Fast Track)

## 1. Rendering Architecture
**The "Big Three" + 1:**

1.  **CSR (Client-Side Rendering):**
    - *Flow:* Empty HTML -> JS Bundle Loads -> React Renders -> API Calls -> Content Visible.
    - *Pros:* Rich interactivity, cheap hosting (CDN).
    - *Cons:* Slow initial load (FCP), bad SEO (crawlers see empty div).
    - *Use Case:* Dashboards, gated apps (Gmail, Trello).

2.  **SSR (Server-Side Rendering):**
    - *Flow:* Server renders HTML (with data) -> Client receives HTML (fast FCP) -> JS Hydrates (TTI).
    - *Pros:* Great SEO, fast initial content.
    - *Cons:* Higher server load, slower TTFB (Time to First Byte).
    - *Use Case:* Social media feeds, news sites (Next.js `getServerSideProps`).

3.  **SSG (Static Site Generation):**
    - *Flow:* HTML generated at *build time*.
    - *Pros:* Fastest possible performance (CDN caching), secure.
    - *Cons:* Build times increase with pages; data can be stale.
    - *Use Case:* Blogs, marketing pages (Next.js `getStaticProps`, Gatsby).

4.  **ISR (Incremental Static Regeneration):**
    - Hybrid. SSG that updates in the background after a timeout. Best of both worlds.

**Senior Q:** "How do you choose between CSR and SSR?"
*Answer:* Focus on **SEO requirements** and **Time-to-Interactive**. If SEO matters = SSR/SSG. If it's a private dashboard = CSR.

---

## 2. API & Data Strategy
- **REST:** Standard, resourceful. Over-fetching/Under-fetching issues.
- **GraphQL:** Single endpoint, client asks for exactly what it needs. Solves waterfall requests.
- **BFF (Backend for Frontend):**
    - A middle layer (Node/Express) that aggregates microservices and formats data *specifically* for the UI.
    - *Benefit:* Keeps frontend logic clean, hides messy backend architecture.

**Caching Strategy (TanStack Query/SWR):**
- **Stale-While-Revalidate:** Show cached data immediately (stale), fetch new data in background, update UI.
- **Optimistic Updates:** Update UI immediately on mutation, revert if API fails. Great UX.

---

## 3. Micro-Frontends
**Concept:** Splitting a monolith frontend into smaller, independently deployable apps (e.g., Header App, Checkout App).

**Approaches:**
1.  **Iframe:** Old school, perfect isolation, bad UX (sizing/scrolling issues).
2.  **Module Federation (Webpack 5):** The modern standard. Allows apps to share dependencies (like React) at runtime while deploying separately.
3.  **Web Components:** Framework agnostic, but data passing is complex.

**Trade-off:** Adds significant **complexity** (deployment coordination, shared styling, version mismatches). Only do this if you have multiple distinct teams.

---

## 4. Security
- **XSS (Cross-Site Scripting):** Attacker injects JS.
    - *Prevention:* Sanitize inputs, use Content Security Policy (CSP), escape data (React does this by default, unless you use `dangerouslySetInnerHTML`).
- **CSRF (Cross-Site Request Forgery):** Attacker tricks user into performing action.
    - *Prevention:* Anti-CSRF tokens, SameSite cookie attributes.
- **Auth Storage:**
    - **localStorage:** Vulnerable to XSS (JS can read it).
    - **HttpOnly Cookies:** Secure against XSS (JS cannot read it), but vulnerable to CSRF (needs mitigation).

---

## 5. Scalability & Code Quality
- **Monorepo (Nx, Turborepo):** multiple packages in one git repo. Shares code (UI library, utils) easily.
- **Atomic Design:** Atoms (Button) -> Molecules (SearchBox) -> Organisms (Header) -> Templates -> Pages.
- **Feature Flags:** Deploy code but hide it behind a flag (LaunchDarkly). Allows "Trunk Based Development".






