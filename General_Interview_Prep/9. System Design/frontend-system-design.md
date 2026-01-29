# Frontend System Design Framework

**Purpose**: This guide provides a structured approach to answering "Design X" questions in a senior interview. The goal is not just to "code it up," but to define the problem, architectural scope, data flow, and trade-offs.

---

## 🏗 The 5-Step Framework (RADIO)

Use the **RADIO** acronym to structure your answer:
1.  **R**equirements (What are we building?)
2.  **A**rchitecture (High-level approach)
3.  **D**ata Model (State & API Design)
4.  **I**nterface (Component Hierarchy)
5.  **O**ptimization (Performance & Edge Cases)

---

### 1. Requirements (Clarification)
*Never start coding immediately.* Ask questions to narrow the scope.

*   **Functional Requirements** (What does the user do?):
    *   "Is this mobile-only or responsive?"
    *   "Do we need real-time updates (e.g., chat/notifications)?"
    *   "Does it need to work offline?"
    *   "Are we supporting pagination or infinite scroll?"
*   **Non-Functional Requirements** (System qualities):
    *   "Performance targets (e.g., <100ms interaction)?"
    *   "Accessibility (WCAG 2.1)?"
    *   "Internationalization (i18n)?"

### 2. Architecture (High-Level)
Define the boundaries between client and server.

*   **Rendering Strategy**: CSR (Client-Side Rendering) vs SSR (Server-Side Rendering)?
    *   *Example*: "Since this is a public news site, SEO is critical, so I'd use Next.js with SSR/ISR."
*   **Communication**: REST vs GraphQL vs WebSockets?
    *   *Example*: "For a chat app, I'll use WebSockets for live messages, but REST for history/profile updates."
*   **State Management**: Where does state live? (URL, Server Cache, Local Global Store).

### 3. Data Model (The "Contract")
Define the data shape **before** the UI. This shows you understand the backend contract.

*   **Entities**:
    ```typescript
    interface Post {
      id: string;
      author: User;
      content: string;
      timestamp: string; // ISO format
      likesCount: number;
    }
    ```
*   **API Endpoints**:
    *   `GET /feed?cursor=xyz&limit=10` (Pagination strategy)
    *   `POST /post/create` (Optimistic updates strategy)

### 4. Interface (Component Hierarchy)
Break down the UI into logical components.

*   **Structure**:
    *   `AppContainer` (Providers: Auth, Theme, QueryClient)
        *   `Layout` (Navbar, Sidebar)
            *   `FeedPage`
                *   `CreatePostWidget`
                *   `FeedList` (Virtualization owner)
                    *   `FeedItem` (Memoized)
*   **State Location**:
    *   "I'll keep `isMenuOpen` in local state, but `currentUser` in Global Context/Auth Store."

### 5. Optimization & Deep Dive
Pick 1-2 difficult problems and solve them deep.

*   **Performance**: "For the feed, we'll use `react-window` for virtualization to keep DOM nodes constant."
*   **UX**: "We'll use Optimistic Updates for the 'Like' button so it feels instant."
*   **Network**: "We'll implement a 'Stale-While-Revalidate' strategy so the user always sees cached content first."
*   **Accessibility**: "We'll ensure the `FeedList` handles keyboard navigation properly."

---

## 📝 Cheat Sheet: Common Problems & Key Challenges

| Problem | Key Challenge to Discuss | Recommended Solution |
| :--- | :--- | :--- |
| **News Feed (Facebook/Twitter)** | Infinite Scroll & Memory Leaks | Virtualization (`react-window`) + Cursor-based Pagination |
| **Chat Application (WhatsApp)** | Real-time & Message Ordering | WebSockets + Optimistic UI + Local ID generation for pending messages |
| **Photo Gallery (Pinterest)** | Image Loading Performance | Lazy Loading (`loading="lazy"`) + `srcSet` for responsive images + Masonry Layout |
| **Typeahead / Search Bar** | API Spamming | Debouncing input + Aborting stale requests (`AbortController`) + Caching results |
| **Dashboard / Analytics** | Heavy Computation & Re-renders | Memoization (`useMemo`) + Web Workers for math + separating data fetching from UI |
| **E-Commerce Cart** | State Persistence | `localStorage` sync + optimistic add-to-cart + handling stock availability errors |

---

## 🗣 Sample Script (The "Opening Move")

"Okay, to tackle this [News Feed] design, I'd like to clarify the requirements first.
Are we focusing on a mobile-first responsive design? And for the feed itself, do we need real-time updates for new posts, or is a 'pull-to-refresh' model acceptable?

Once we agree on that, I'll outline the data model, then move to the component hierarchy, and finally discuss how we handle performance bottlenecks like long lists."

