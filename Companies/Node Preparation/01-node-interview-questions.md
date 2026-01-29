# Node.js Interview Preparation

## Strategy: The "Frontend-First" Node Developer
> **Context:** You are a React/TS expert with limited hands-on Node production experience.
> **Goal:** Show competence and conceptual understanding without overclaiming deep backend expertise.

- **The Pitch:** "While my core expertise is in Frontend (React/TS), I have a strong grasp of the JavaScript runtime. I've used Node.js for tooling (Vite/Webpack), simple BFFs (Backend for Frontend), and I understand the async nature of JS deeply (Event Loop, Promises)."
- **Strengths to Highlight:**
  - **Shared Language:** You know JS/TS deeply (ES6+, Async patterns).
  - **Async Mental Model:** You already understand non-blocking UI; Node is just non-blocking I/O.
  - **JSON Handling:** You consume APIs daily; designing them is the flip side of the coin.
  - **Ecosystem:** You are comfortable with NPM, package.json, and dependency management.

## Prioritized Roadmap (Frontend Optimized)
We will skip deep backend internals (like OS-level piping, complex clustering, raw TCP) and focus on what connects to your existing knowledge.

### 🟢 Must Know (High Impact)
1.  **JavaScript Fundamentals (Server context):**
    -   `var/let/const`, `this`, `Promises`, `Async/Await`.
    -   *Why:* It's the same language! You can't fail here.
2.  **Core Node Concepts:**
    -   **Event Loop:** How it handles async operations (shared concept with browser).
    -   **Modules:** CommonJS (`require`) vs ESM (`import`). You see this in config files (vite.config.ts vs tailwind.config.js).
3.  **API & Web Server:**
    -   **REST Principles:** Methods (GET/POST), Status Codes (200, 404, 500).
    -   **Authentication:** JWT, Cookies (Security concerns).
    -   **Express.js:** Middleware pattern (similar to Interceptors in Axios or Redux middleware).

### 🟡 Nice to Know (Conceptual)
1.  **Architecture:** Single-threaded nature (Blocking vs Non-blocking).
2.  **Databases:** SQL vs NoSQL differences (Just high-level).
3.  **Tooling:** `package.json` scripts, devDependencies.

### 🔴 Skip / Low Priority (Deep Backend)
-   Streams & Buffers (unless asked).
-   Clustering & Worker Threads implementation.
-   Database Normalization forms.
-   Microservices inter-communication (RabbitMQ/Kafka).

---

## Questions from Colleague
- **What is Node.js?**
  - It is a JavaScript runtime environment built on Chrome's V8 JavaScript engine.
  - It allows execution of JavaScript code server-side (outside the browser).
  - Key characteristics: Asynchronous, Event-driven, Non-blocking I/O model (single-threaded event loop).
  - Best for: I/O-intensive apps (chats, streaming), Real-time apps, JSON APIs. Not best for CPU-intensive tasks.

- **Node.js Internals: V8 + Libuv**
  - **V8 Engine (Google):**
    - **What is it?** High-performance JS engine written in C++. Used in Chrome and Node.js.
    - **Function:** Compiles and executes JavaScript code into machine code. Handles memory allocation and Garbage Collection (Call Stack).
  - **Libuv:**
    - **What is it?** A multi-platform C library that provides support for asynchronous I/O based on event loops.
    - **Function:** Handles the Event Loop, Thread Pool (for heavy tasks like FS, Crypto, Compression), and OS-level non-blocking operations.
    - It bridges the gap between Node (single-threaded) and the OS (multi-threaded capabilities for I/O).

- **Why are V8 and Libuv separate? Why combine them in Node?**
  - **Separation:**
    - **V8** was built for Chrome. Browsers already have their own event loops and I/O handling (rendering engine, networking stack). V8 only cares about executing JS logic, not system operations.
    - **Libuv** is a standalone C library for cross-platform async I/O. It doesn't know about JavaScript. It can be used by other languages (like Julia, Python bindings).
  - **The Combination (Node.js):**
    - Node needs to run JS **outside** the browser (no browser Web APIs).
    - It needs **V8** to understand the JS code.
    - It needs **Libuv** to talk to the OS (File System, TCP/UDP) efficiently without blocking.
    - **Node.js acts as the glue (C++ bindings):** It exposes Libuv's system capabilities to V8's JavaScript environment, allowing JS to control the OS.

- **Clarification: Browser I/O vs. Node.js I/O**
  - **You are correct:** Browsers are **sandboxed** for security. You cannot arbitrarily read/write files on the user's machine or open ports.
  - **Browser "I/O" refers to:**
    - **Network:** `fetch`, `XHR` (strictly controlled, e.g., CORS).
    - **User Interaction:** DOM events, rendering pixels to screen.
    - **Storage:** Limited scope (LocalStorage, Cookies, IndexedDB).
  - **Node.js I/O (Server-side):**
    - **Unrestricted:** Can read/write any file the OS user has permission for.
    - Can listen on any network port.
    - Can spawn child processes.
    - This is why Node needs **Libuv** (to access OS internals) while Browsers rely on their own internal, restricted engines.

## Detailed Preparation Files (In Order)

- [02-javascript-fundamentals.md](./02-javascript-fundamentals.md) (🟢 **Start Here**: The language itself)
- [03-api-frameworks.md](./03-api-frameworks.md) (🟢 **Frontend-Relatable**: REST, Auth, Express)
- [04-core-concepts.md](./04-core-concepts.md) (🟢 **Node Logic**: Event Loop, Async, Modules)
- [05-database-orm.md](./05-database-orm.md) (🟡 **Data Layer**: SQL/NoSQL)
- [06-testing-tooling.md](./06-testing-tooling.md) (🟡 **Workflow**: NPM, Debugging)
- [07-architecture-internals.md](./07-architecture-internals.md) (🔴 **Deep Dive**: Low priority)
