## Phase 1 — HTTP foundation (request lifecycle you can trust)

By the end of this phase, the backend has a **reliable request lifecycle**: health/ready endpoints, request id end-to-end, structured logs, consistent error shape (404 + 500), and tests via in-process injection (no real TCP port). Route registration lives in `src/app.ts`; Phase 2.5 may later move routes into `src/routes/v1.ts`.

### Goal

- `health` + `ready` endpoints
- Request id end-to-end (`x-request-id`)
- Structured request-complete logs
- Consistent error response shape (404 + 500)
- Tests that hit routes without opening a real TCP port

### Study (short)

- `node-backend-story/01-core-flow.md` §1–3 (server, routes, middleware)
- `node-backend-story/01-core-flow.md` §9 (error handling)
- `node-backend-story/04-observability-ops.md` §18 (logging essentials)

---

## Step 1.0 — Baseline check (always do this first)

From `Apps/upi-invoice-follow-up/backend/`:

```bash
npm test
```

**Done when:** Tests pass (green). If any fail, fix them before continuing.

---

## Step 1.1 — Server entrypoint (bootstrap)

**Goal:** A server process that reads env (`HOST`, `PORT`) and can be started/stopped reliably.

**Instructions**

- Keep `src/server.ts` as the only file that calls `listen()`.
- Route registration lives in the app factory (`src/app.ts`). (Phase 2.5 may later register a route plugin from `src/routes/v1.ts` inside `createApp`.)

**Verify**

```bash
npm run dev
```

Stop with Ctrl+C, then start again immediately. You should not see “address already in use” on restart.

**Done when:** No “address already in use” on immediate restart.

---

## Step 1.2 — App factory (testable server)

**Goal:** Test endpoints via in-process injection (Fastify `app.inject`) without binding a port.

**Instructions**

- Export a `createApp()` (or `createApp`) from `src/app.ts`. It may be sync or async (e.g. async once you register route plugins in Phase 2.5).
- Tests must: obtain the app (e.g. `const app = await createApp()` if async, or `const app = createApp()` if sync), use `app.inject(...)`, and call `await app.close()` at the end.

**Verify**

```bash
npm test
```

**Done when:** Tests run and pass using `app.inject()` (no real port).

---

## Step 1.3 — Request ID (`x-request-id`)

### 1.3.A — Decisions (make these explicit)

**Why:** Request id is the correlation handle that connects client reports ↔ server logs ↔ error responses.

**Decisions**

- **Header name:** `x-request-id`
- **Accept client-provided id?** Yes, if valid; otherwise generate.
- **Validation rules:** `trim()`, length 8–128, charset `^[a-zA-Z0-9._-]+$`
- **Generation:** `crypto.randomUUID()`
- **Must appear in:** response header (always), structured logs (always), and later in error JSON (`error.requestId`)

### 1.3.B — Fastify wiring

**Instructions**

- Configure Fastify with `requestIdHeader: "x-request-id"` and `genReqId(req)` that validates/normalizes the header or generates a new id.
- In an `onRequest` hook, set `reply.header("x-request-id", request.id)` so the response always carries the id.

**Verify**

1. Run `npm test`.
2. Manually: without `x-request-id` the response contains a generated id; with `x-request-id: req_12345678` the response echoes it back.

**Done when:** Response header and logs include request id; client-provided valid id is echoed.

---

## Step 1.4 — Structured request-complete logs

**Goal:** One structured log line at request completion with requestId, method, path (or url), status, and duration.

**Instructions**

- Log at request completion (e.g. Fastify `onResponse` hook). Include `request.id` and, if available, method, path/url, status code, and duration (e.g. using a `request.startAt` set in `onRequest`).

**Verify:** Hit `/api/v1/health` and confirm the log line includes requestId and the expected fields.

**Done when:** Each request produces a completion log with requestId and key request/response data.

---

## Step 1.5 — Consistent error response shape (404 + 500)

**Goal:** A single error JSON shape for all errors, with requestId. Typed contract, no information leakage, structured server-side logging, and inject tests for 404 and 500.

**Quality bar**

- **Contract:** One typed error shape; error codes as constants (no magic strings).
- **Security:** Never send stack traces or internal error details to the client; log them server-side only. Use a single, generic 500 message to clients.
- **Observability:** Log every error with requestId, method, and path; for 500s include the error/stack in logs only.
- **Tests:** Automated inject tests for 404 and 500 (status, body shape, `error.requestId`).

**Standard error shape**

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable",
    "requestId": "..."
  }
}
```

**Instructions**

1. **Define a typed error contract and helper** in `src/errors/error-response.ts`.

   - Export `ERROR_CODES`, `ERROR_CODE_TO_STATUS`, `errorPayload`, and `errorResponse`.
   - Use a code→statusCode map so handlers never hardcode status codes. Handlers do: `const r = errorResponse(ERROR_CODES.NOT_FOUND, "Route not found", request.id); reply.status(r.statusCode).send(r.body);`
   - For Phase 1, include at least `NOT_FOUND` and `INTERNAL_ERROR`. Phase 2 will extend this (e.g. `VALIDATION_ERROR`, optional `details`).

   **Minimal example for Phase 1 — `src/errors/error-response.ts`:**

   ```ts
   const ERROR_CODES = {
     NOT_FOUND: "NOT_FOUND",
     INTERNAL_ERROR: "INTERNAL_ERROR",
   } as const;

   type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

   const ERROR_CODE_TO_STATUS: Record<ErrorCode, number> = {
     [ERROR_CODES.NOT_FOUND]: 404,
     [ERROR_CODES.INTERNAL_ERROR]: 500,
   };

   interface ErrorPayloadBody {
     code: ErrorCode;
     message: string;
     requestId: string;
   }

   function errorPayload(
     code: ErrorCode,
     message: string,
     requestId: string
   ): { error: ErrorPayloadBody } {
     return { error: { code, message, requestId } };
   }

   /** Returns statusCode + body so handlers do reply.status(r.statusCode).send(r.body). */
   function errorResponse(
     code: ErrorCode,
     message: string,
     requestId: string
   ): { statusCode: number; body: { error: ErrorPayloadBody } } {
     return {
       statusCode: ERROR_CODE_TO_STATUS[code],
       body: errorPayload(code, message, requestId),
     };
   }

   export { ERROR_CODES, ERROR_CODE_TO_STATUS, errorPayload, errorResponse };
   ```

2. **Register a not-found handler** *before* route registrations. Use `errorResponse(ERROR_CODES.NOT_FOUND, ...)` and log the 404 (method, path, requestId):

   ```ts
   app.setNotFoundHandler((request, reply) => {
     request.log.info(
       { requestId: request.id, method: request.method, url: request.url },
       "route not found"
     );
     const r = errorResponse(ERROR_CODES.NOT_FOUND, "Route not found", request.id);
     reply.status(r.statusCode).send(r.body);
   });
   ```

3. **Register a global error handler** *after* your routes (before `return app`):

   - Log server-side with full context and the error (including stack); never send stack or internals to the client.
   - Respond with a generic 500 message only (e.g. "An unexpected error occurred"). Do not echo `error.message` or user/DB content.
   - Set `Cache-Control: no-store` on the response.
   - For Phase 1, mapping all thrown errors to 500 is enough; later you can add 4xx codes (e.g. `VALIDATION_ERROR`).

   ```ts
   app.setErrorHandler((error, request, reply) => {
     request.log.error(
       { err: error, requestId: request.id, method: request.method, url: request.url },
       "request error"
     );
     const r = errorResponse(ERROR_CODES.INTERNAL_ERROR, "An unexpected error occurred", request.id);
     reply
       .header("Cache-Control", "no-store")
       .status(r.statusCode)
       .send(r.body);
   });
   ```

4. **Add inject tests:**
   - **404:** Request a non-existent path (e.g. `GET /api/v1/nonexistent`). Assert status 404, body has `error.code`, `error.message`, `error.requestId`, and no stack or internal details.
   - **500:** Use a route that throws (e.g. `GET /api/v1/trigger-error`). Assert status 500, same error shape, generic message, no stack in body, and `Cache-Control: no-store` on the response.

**Verify**

- Run `npm test`; 404 and 500 tests pass.
- Manually: unknown route → 404 with error shape and requestId; trigger 500 → generic message, no stack in body; stack only in server logs.

**Done when:** 404 and 500 return the same error shape with requestId; inject tests cover both; no stack or internals in client responses.

**Reference — full `app.ts` (self-contained)**

Use this as a single copy-paste reference for `src/app.ts` after you have `src/errors/error-response.ts` in place. It includes request-id helpers, hooks, not-found and error handlers. Add your routes where indicated (Step 1.6: health, ready, trigger-error). If you use a custom `request.startAt`, add a type declaration (e.g. `src/types/fastify.ts`) and reference it at the top.

```ts
/// <reference path="./types/fastify.ts" />
import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import { ERROR_CODES, errorResponse } from "./errors/error-response.js";

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

export function createApp() {
  const app = Fastify({
    logger: true,
    requestIdHeader: "x-request-id",
    genReqId: (req) => {
      const fromHeader = normalizeRequestId(req.headers["x-request-id"]);
      return fromHeader ?? generateRequestId();
    },
  });

  app.addHook("onRequest", async (request, reply) => {
    (request as { startAt?: number }).startAt = Date.now();
    reply.header("x-request-id", request.id);
  });

  app.addHook("onResponse", async (request, reply) => {
    app.log.info({
      requestId: request.id,
      method: request.method,
      path: request.url,
      status: reply.statusCode,
      duration: (request as { startAt?: number }).startAt != null
        ? Date.now() - (request as { startAt?: number }).startAt!
        : 0,
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

  // --- Register routes here (Step 1.6: GET /api/v1/health, GET /api/v1/ready, GET /api/v1/trigger-error) ---
  app.get("/api/v1/health", async () => ({ status: "ok" }));
  app.get("/api/v1/ready", async () => ({ status: "ok" }));
  app.get("/api/v1/trigger-error", async () => {
    throw new Error("trigger");
  });

  return app;
}
```

Note: Phase 2.5 will change this to an async `createApp()` that registers a route plugin with prefix `/api/v1`, and routes will use relative paths (e.g. `/health`) in `src/routes/v1.ts`.

---

## Step 1.6 — Foundation endpoints (`/health` + `/ready`)

**Goal:** The two ops endpoints every backend needs.

**Instructions**

- Ensure these exist:
  - `GET /api/v1/health` → `{ "status": "ok" }`
  - `GET /api/v1/ready` → `{ "status": "ok" }` for now (before DB); later you can add a DB ping.
- Add inject tests for both (status 200, expected body, and optionally that `x-request-id` is present).

**Verify**

```bash
npm test
```

Optional manual check: use `backend/requests/health.http` and `backend/requests/ready.http` (or curl / REST client).

**Done when:** Health and ready return 200 with the expected JSON; tests pass.

---

## Deliverable (end of Phase 1)

- `GET /api/v1/health` returns `{ "status": "ok" }`
- `GET /api/v1/ready` returns `{ "status": "ok" }` (until DB exists)
- Response includes `x-request-id` header (generated or echoed)
- Logs include method, path/url, status, duration, requestId
- 404 and 500 return the same error JSON shape with requestId
- Tests cover: health, ready, request-id (generated + echoed), 404 error shape, 500 error shape

---

## Repo shape (end of Phase 1)

- `src/server.ts` — only file that calls `listen()`; reads `HOST`/`PORT`.
- `src/app.ts` — `createApp()`, hooks (request id, logging), not-found handler, error handler, route registration (or registration of a v1 plugin).
- `src/errors/error-response.ts` — `ERROR_CODES`, `ERROR_CODE_TO_STATUS`, `errorPayload`, `errorResponse`.
- Routes for health, ready, and any test/trigger route live in `app.ts` or in a plugin registered by `app.ts` (e.g. `src/routes/v1.ts` with prefix `/api/v1` from Phase 2.5).

```txt
backend/
  src/
    app.ts
    server.ts
    errors/
      error-response.ts
    types/
      fastify.ts          # if you extend Fastify request (e.g. startAt)
  test/
    health.test.ts
    ready.test.ts
    error-handling.test.ts
  requests/               # optional
    health.http
    ready.http
```

---

## Done when (Phase 1 complete)

- [ ] Step 1.0: `npm test` passes.
- [ ] Step 1.1: `src/server.ts` is the only entrypoint that calls `listen()`; routes are registered from `app.ts` (or via a plugin in `app.ts`).
- [ ] Step 1.2: `createApp()` is exported; tests use `app.inject()` and `await app.close()`.
- [ ] Step 1.3: Request id is validated/generated, echoed in response header and present in logs.
- [ ] Step 1.4: Request completion is logged with requestId, method, path/url, status, duration.
- [ ] Step 1.5: Not-found and error handlers return the same error shape; 404 and 500 inject tests pass; no stack in client response.
- [ ] Step 1.6: `GET /api/v1/health` and `GET /api/v1/ready` return 200 with expected body; tests pass.

---

## Key files (end of Phase 1)

- `backend/src/server.ts` — Entrypoint; `listen()`; reads `PORT`, `HOST`.
- `backend/src/app.ts` — `createApp()`, hooks, not-found handler, error handler, route registration (or plugin registration).
- `backend/src/errors/error-response.ts` — `ERROR_CODES`, `ERROR_CODE_TO_STATUS`, `errorResponse` (Phase 2 adds `VALIDATION_ERROR` and optional `details`).
- `backend/src/types/fastify.ts` — Optional; extends Fastify request (e.g. `startAt`) for duration logging.
- `backend/test/health.test.ts`, `ready.test.ts`, `error-handling.test.ts` — Inject tests for health, ready, 404, 500.
