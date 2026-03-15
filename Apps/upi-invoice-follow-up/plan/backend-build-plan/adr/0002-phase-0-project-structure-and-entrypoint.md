## ADR: Phase 0 — Project structure and entrypoint split

- **Date**: 2026-02-20
- **Status**: accepted

### Context

We need a backend that is testable without binding a real port, runnable in dev (watch) and prod (compiled), and clearly separated from any frontend. Phase 0 establishes where code lives and how the server is started so later phases (routes, validation, errors) have a single place to plug in.

### Decision

- **Backend as a separate folder**: `backend/` at the project root. It has its own `package.json`, `node_modules`, and scripts. The backend is a separate deployable unit.
- **Single listen() site**: Only `src/server.ts` calls `app.listen()`. It reads `HOST` and `PORT` from the environment and starts the app. No other file binds a port.
- **App factory in `src/app.ts`**: All route registration, hooks, and Fastify configuration live in a `createApp()` function exported from `src/app.ts`. The server file does `const app = createApp(); await app.listen(...)`. This allows tests to call `createApp()`, use `app.inject()`, and never open a TCP port.
- **Scripts**: `npm run dev` (tsx watch), `npm run test` (vitest run), `npm run build` (tsc), `npm run start` (node dist/server.js). `.env.example` documents `PORT` and `HOST`; `.gitignore` excludes `node_modules`, `dist`, `.env`.
- **Source layout**: `src/` for application code, `test/` for tests. TypeScript with `rootDir: src`, `outDir: dist`, `module: NodeNext`, ESM.

### Alternatives considered

- **Routes in server.ts**: Rejected; would mix bootstrap and app composition and make inject-based testing harder.
- **Multiple entrypoints (e.g. server + worker)**: Not needed at Phase 0; we can add another entrypoint later and still keep `listen()` only in one place.
- **Putting tests inside src/**: Rejected; keeping `test/` at top level matches common Node/Vitest practice and keeps test config simple.

### Consequences

- **Pros**: Clear separation (server = bootstrap + listen, app = routes + hooks). Tests use `createApp()` and `app.inject()` with no port. One place to add routes and middleware.
- **Cons / risks**: New contributors must know not to add `listen()` outside `server.ts`. ESM and `NodeNext` require `.js` extensions in imports.
- **Follow-ups**: When adding more entrypoints (e.g. queue worker), keep `listen()` only in the HTTP server entrypoint; reuse `createApp()` or a similar factory pattern.
