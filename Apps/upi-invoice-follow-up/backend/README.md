# UPI Invoice Follow-up — Backend

Node.js API (Fastify, ESM). Run with `npm run dev` or `npm run build && npm start`.

## Source layout (`src/`)

| Folder      | Purpose |
|------------|---------|
| **config/** | App/server configuration. `fastify.ts` = options for creating the Fastify instance (logger, request id header, id generation). |
| **errors/** | Error shapes and HTTP mapping. `error-response.ts` = error codes, status codes, and `errorResponse()` for consistent JSON error bodies. |
| **http/**   | HTTP-layer plumbing: global error handler, not-found handler, request-id and response-log hooks, validation helpers, list-response helpers. No business logic. |
| **routes/** | Route mounting only. `v1.ts` registers versioned API routes (e.g. invoice module under `/invoices`). Handlers live in modules. |
| **modules/**| Feature modules. Each has `model.ts` (types + pure logic), `service.ts` (orchestration), `repo.ts` (repository interface), `repo-memory.ts` (in-memory impl), `routes.ts` (Fastify route handlers), `register.ts` (wiring for v1). |
| **schemas/**| Zod schemas for request validation (query, body) and shared bits (e.g. pagination). |
| **types/**  | TypeScript augmentations (e.g. Fastify request with `startAt`). |

Entry points: `app.ts` builds the app; `server.ts` starts the server (listen, graceful shutdown).
