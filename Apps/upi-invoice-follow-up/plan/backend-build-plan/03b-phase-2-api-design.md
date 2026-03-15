## Phase 2.5 — API design basics (versioning + pagination shape)

### Goal

Make your API predictable and evolvable by standardizing:

- versioning (`/api/v1`)
- pagination/query conventions
- response envelopes (when needed)

### Study (short)

- `node-backend-story/02-api-design.md` §12–13 (versioning, pagination/query params)

### Build (steps)

#### Step 2.5.1 — Versioning policy

Decide and document:

- route prefix: `/api/v1`
- how you’ll introduce `/api/v2` later (parallel routes, deprecation window)

**What to do**

1. **Confirm the prefix**  
   Every API route must live under `/api/v1` (e.g. `GET /api/v1/health`, `POST /api/v1/invoices`). No unversioned routes like `GET /health`. Scan `app.ts` and any route files (e.g. `src/routes/v1.ts`); fix any route that doesn’t end up under `/api/v1`. After this step, all v1 routes will be in `src/routes/v1.ts` with relative paths and the prefix enforced via Fastify.

2. **Document the policy**  
   Write the versioning rules in one place so future you (or the team) know how to add a new version. In this project the policy lives in **`backend/docs/api-versioning.md`**. It must include:

   - **Current rule:** All public API routes use the prefix `/api/v1`.
   - **When we need v2:** Add a new route plugin (e.g. `src/routes/v2.ts`) and register it with `prefix: "/api/v2"`. Do not remove or change v1 routes until they are deprecated.
   - **Deprecation:** When retiring a version, set a deprecation window (e.g. “v1 supported until 2026-08-01” or “minimum 6 months from announcement”). Return deprecation headers on that version’s responses (e.g. `Deprecation: true`, `Sunset: <date>`) and document the date in the same file. Remove the version’s routes only after the window ends.

3. **Enforce the prefix in code (recommended early)**  
   Use Fastify’s prefix so every new route automatically gets `/api/v1`. Follow the instructions below. When done, update `backend/docs/api-versioning.md` to state that the prefix is enforced in code.

   **Instructions — enforce `/api/v1` via Fastify prefix**

   **Transition note:** Up to now, all routes lived in `app.ts` (see Phase 2 / ADR 0005). This step introduces **`src/routes/`** and moves v1 API routes into a dedicated file. The goal is to enforce the version prefix in code; a side effect is a clearer split between app wiring (hooks, error handlers) in `app.ts` and route registration in `src/routes/v1.ts`. When you add v2 later, add `src/routes/v2.ts` and register it with `prefix: "/api/v2"`.

   **Step A — Create a v1 routes plugin file**

   - Create **`backend/src/routes/v1.ts`**.
   - Export a **Fastify plugin**: an `async function(fastify)` that registers all current API routes with **relative** paths (no `/api/v1` in the path).

   **Code snippet for `backend/src/routes/v1.ts`:**

   ```ts
   import type { FastifyInstance } from "fastify";
   import { parseWithSchema, zodErrorTo422 } from "../http/validate.js";
   import { CreateInvoicesBodySchema } from "../schemas/invoices/create.schema.js";

   export default async function v1Routes(fastify: FastifyInstance) {
     fastify.get("/health", async () => ({ status: "ok" }));
     fastify.get("/ready", async () => ({ status: "ok" }));

     fastify.post("/invoices", async (request, reply) => {
       const result = parseWithSchema(CreateInvoicesBodySchema, request.body);
       if (!result.success) {
         const { statusCode, body } = zodErrorTo422(result.error, request.id);
         return reply.status(statusCode).send(body);
       }
       const data = result.data;
       // TODO: call business logic / service with data
       return reply.status(201).send({ id: "stub", ...data });
     });

     fastify.get("/trigger-error", async () => {
       throw new Error("trigger");
     });
   }
   ```

   **Step B — Move route registrations into the plugin**

   Put the snippet above in `backend/src/routes/v1.ts`. Step B is done when `v1.ts` contains that plugin (imports + the four routes with relative paths). You do not need to add `errorResponse` / `ERROR_CODES` in `v1.ts` — those stay in `app.ts` for the not-found and error handlers.

   **Step C — Register the plugin in `app.ts` (and make `createApp` async)**

   - Make `createApp()` async and register the plugin inside it.
   - Update `server.ts` and all tests to use `await createApp()`.

   **1) Changes to `backend/src/app.ts`**

   - **Imports:** Remove `parseWithSchema`, `zodErrorTo422`, and `CreateInvoicesBodySchema`. Add: `import v1Routes from "./routes/v1.js";`
   - **createApp:** Change to `export const createApp = async () => {` and add `await app.register(v1Routes, { prefix: "/api/v1" });` after the error handler and before `return app`.
   - **Remove** the existing route registrations (e.g. the block from `// Keep your existing routes...` through `app.get("/api/v1/trigger-error", ...)`).

   **Snippet — relevant parts of `app.ts` after the change (full hooks and handlers so you don’t need another resource):**

   ```ts
   /// <reference path="./types/fastify.ts" />
   import Fastify from "fastify";
   import { randomUUID } from "node:crypto";
   import { ERROR_CODES, errorResponse } from "./errors/error-response.js";
   import v1Routes from "./routes/v1.js";

   function normalizeRequestId(raw: unknown): string | null {
     if (typeof raw !== "string") return null;
     const value = raw.trim();
     if (value.length < 8 || value.length > 128) return null;
     if (!/^[a-zA-Z0-9._-]+$/.test(value)) return null;
     return value;
   }

   function generateRequestId(): string {
     return randomUUID();
   }

   export const createApp = async () => {
     const app = Fastify({
       logger: true,
       requestIdHeader: "x-request-id",
       genReqId: (req) => {
         const fromHeader = normalizeRequestId(req.headers["x-request-id"]);
         return fromHeader ?? generateRequestId();
       },
     });

     app.addHook("onRequest", async (request, reply) => {
       request.startAt = Date.now();
       reply.header("x-request-id", request.id);
     });

     app.addHook("onResponse", async (request, reply) => {
       app.log.info({
         requestId: request.id,
         method: request.method,
         path: request.url,
         status: reply.statusCode,
         duration: request.startAt != null ? Date.now() - request.startAt : 0,
       });
     });

     app.setNotFoundHandler((request, reply) => {
       request.log.info(
         { requestId: request.id, method: request.method, url: request.url },
         "route not found"
       );
       const r = errorResponse(ERROR_CODES.NOT_FOUND, "Route not found", request.id);
       reply.status(r.statusCode).send(r.body);
     });

     app.setErrorHandler((error, request, reply) => {
       request.log.error(
         { err: error, requestId: request.id, method: request.method, url: request.url },
         "request error"
       );
       const r = errorResponse(ERROR_CODES.INTERNAL_ERROR, "An unexpected error occurred", request.id);
       reply.header("Cache-Control", "no-store").status(r.statusCode).send(r.body);
     });

     await app.register(v1Routes, { prefix: "/api/v1" });

     return app;
   };
   ```

   **2) Changes to `backend/src/server.ts`**

   ```ts
   import { createApp } from "./app.js";

   const app = await createApp();

   const port = Number(process.env.PORT ?? 4000);
   const host = process.env.HOST ?? "0.0.0.0";

   await app.listen({ port, host });
   ```

   **3) Changes to tests — use `await createApp()`**

   Every test that calls `createApp()` must now `await` it. Replace `const app = createApp();` with `const app = await createApp();` in all test files that use `createApp()` (e.g. `health.test.ts`, `ready.test.ts`, `error-handling.test.ts`, `validation.test.ts`).

   **Step D — Verify**

   - Run `npm test` from `backend/`. All tests must pass (health, ready, request-id, 404, 500, validation).
   - Run `npm run dev` and hit `GET http://localhost:4000/api/v1/health` (e.g. from `requests/health.http`). You should get `{ "status": "ok" }`.
   - Confirm no routes are registered with the full path `/api/v1/...` in `app.ts`; the only mention of `/api/v1` is the `prefix` option.

   **Adding new routes from now on:** Add them in `src/routes/v1.ts` with a **relative** path (e.g. `fastify.get("/invoices", ...)`). They are served under `/api/v1` (e.g. `GET /api/v1/invoices`).

**Done when**

- Every route lives under `/api/v1` (no unversioned API routes).
- The versioning policy is documented in `backend/docs/api-versioning.md`.
- Routes are registered via `app.register(v1Routes, { prefix: "/api/v1" })` so the prefix is enforced in code.

---

#### Step 2.5.2 — Pagination contract

Pick a pagination style (start simple):

- **page/limit (offset pagination)**
  - `page` starts at 1
  - `limit` has a maximum (e.g. 50 or 100)

Define default values, bounds, and validation (Zod).

**Done when**

- There is a single shared way to parse and normalize pagination query params (schema + helper).

**What to do**

1. **Define a shared pagination schema** so every list endpoint uses the same page/limit rules. Create a small schema file and a helper that returns normalized `{ page, limit, offset }` (offset for DB: `(page - 1) * limit`).

2. **Create `backend/src/schemas/common/pagination.schema.ts`** with page/limit only. List-specific query params (e.g. `status`) live in the resource schema and extend this.

   **Code snippet — `backend/src/schemas/common/pagination.schema.ts`:**

   ```ts
   import { z } from "zod";

   export const PaginationSchema = z.object({
     page: z.coerce.number().int().min(1).default(1),
     limit: z.coerce.number().int().min(1).max(50).default(20),
   });

   export type PaginationInput = z.infer<typeof PaginationSchema>;

   /** Use after validating query with a schema that includes page/limit. Computes offset for DB. */
   export function toPaginationInput(params: { page: number; limit: number }) {
     const { page, limit } = params;
     return { page, limit, offset: (page - 1) * limit };
   }
   ```

   Use a reasonable `limit` max (e.g. 50 or 100) to suit your API.

3. **Use the shared schema in list query schemas.** For invoices, extend pagination with resource-specific params. Create or update **`backend/src/schemas/invoices/list.schema.ts`** so it uses the shared pagination and adds only `status`:

   **Code snippet — `backend/src/schemas/invoices/list.schema.ts`:**

   ```ts
   import { z } from "zod";
   import { PaginationSchema } from "../common/pagination.schema.js";

   export const ListInvoicesQuerySchema = PaginationSchema.extend({
     status: z.enum(["draft", "sent", "paid"]).optional(),
   });

   export type ListInvoicesQueryInput = z.infer<typeof ListInvoicesQuerySchema>;
   ```

   In Zod v4, use `.extend()` to add keys to an object schema; `.merge()` with another object schema is deprecated.

4. **Parsing in list routes:** In the **`GET /invoices`** handler in **`backend/src/routes/v1.ts`**, use `parseWithSchema(ListInvoicesQuerySchema, request.query)`. On success use `result.data` for `page` and `limit`. When you need `offset` for a DB query, call `toPaginationInput(result.data)` (import from `../schemas/common/pagination.schema.js`). The full route is shown in Step 2.5.3. The “single helper” is **PaginationSchema + toPaginationInput**; all list endpoints share this and add their own query params via `.extend()`.

**Done when:** `PaginationSchema` and `toPaginationInput` exist, and at least one list query schema (e.g. invoices) uses them.

---

#### Step 2.5.3 — List endpoint shape

For collection endpoints, standardize the response:

```json
{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 123
}
```

- `total` can be expensive; for a cheap MVP you can omit it initially and add it later.
- Whatever you choose, document it and keep it consistent.

**Done when**

- At least one list endpoint returns this standard shape.

**What to do**

1. **Define the list response shape** in one place so all list endpoints return the same envelope (a TypeScript type and a small helper that builds the object).

2. **Add a shared type and helper** for the list envelope. Create **`backend/src/http/list-response.ts`**:

   **Code snippet — `backend/src/http/list-response.ts`:**

   ```ts
   export interface ListResponseEnvelope<T> {
     items: T[];
     page: number;
     limit: number;
     total?: number;
   }

   /** Builds the standard list response. Omit total for MVP if you don't have it yet. */
   export function listResponse<T>(
     items: T[],
     page: number,
     limit: number,
     total?: number
   ): ListResponseEnvelope<T> {
     const envelope: ListResponseEnvelope<T> = { items, page, limit };
     if (total !== undefined) envelope.total = total;
     return envelope;
   }
   ```

3. **Add a list endpoint** that uses the pagination schema and returns this shape. In **`backend/src/routes/v1.ts`**, add **`GET /invoices`** that:
   - Parses and validates query with `ListInvoicesQuerySchema` (Step 2.5.2).
   - On validation failure, returns 422 (same pattern as existing routes).
   - On success, returns `listResponse(items, page, limit, total)`. For MVP you can stub `items: []` and set `total: 0` (or omit `total`).

   **Snippet — add to `backend/src/routes/v1.ts` (imports + route):**

   At the top, add:

   ```ts
   import { ListInvoicesQuerySchema } from "../schemas/invoices/list.schema.js";
   import { listResponse } from "../http/list-response.js";
   ```

   Then register the list route (e.g. `GET /invoices` before or after `POST /invoices`):

   ```ts
   fastify.get("/invoices", async (request, reply) => {
     const result = parseWithSchema(ListInvoicesQuerySchema, request.query);
     if (!result.success) {
       const { statusCode, body } = zodErrorTo422(result.error, request.id);
       return reply.status(statusCode).send(body);
     }
     const { page, limit } = result.data;
     // TODO: fetch items from service/DB; for MVP stub empty list
     const items: unknown[] = [];
     const total = 0; // optional for MVP; omit or set when you have real data
     return reply.status(200).send(listResponse(items, page, limit, total));
   });
   ```

4. **Document the contract:** In **`backend/docs/api-versioning.md`** (or a short `backend/docs/api-conventions.md`), note that list endpoints return `{ items, page, limit, total? }` and that `total` is optional for MVP.

**Done when:** The envelope type and helper exist, and `GET /api/v1/invoices` returns `{ items, page, limit }` (and optionally `total`).

---

### Deliverable

- `/api/v1` is enforced everywhere.
- Pagination query params are validated and bounded.
- List responses use a consistent envelope.

### Key files (after Phase 2.5)

- `backend/src/app.ts` — app wiring; registers v1 plugin with prefix `/api/v1`.
- `backend/src/routes/v1.ts` — all v1 routes (relative paths).
- `backend/src/schemas/common/pagination.schema.ts` — `PaginationSchema`, `toPaginationInput`.
- `backend/src/schemas/invoices/list.schema.ts` — `ListInvoicesQuerySchema`.
- `backend/src/http/list-response.ts` — `ListResponseEnvelope`, `listResponse`.
- `backend/docs/api-versioning.md` — versioning policy and list response contract.
