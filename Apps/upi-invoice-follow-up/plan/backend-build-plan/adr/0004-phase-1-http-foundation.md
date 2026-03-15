## ADR: Phase 1 — HTTP foundation (request-id, errors, logging)

- **Date**: 2026-02-20
- **Status**: accepted

### Context

We need a request lifecycle we can trust: every request is identifiable end-to-end, failures return a consistent shape, and we log one structured line per request for observability. This phase defines the contract for request identity, error responses, and request-complete logging before we add validation or business logic.

### Decision

**Request ID (`x-request-id`)**

- **Header name**: `x-request-id`.
- **Accept client-provided id?** Yes, if valid; otherwise generate. Validation rules: `trim()`, length 8–128, charset `^[a-zA-Z0-9._-]+$`. Generation: `crypto.randomUUID()`.
- **Must appear in**: response header (always), structured logs (always), error JSON (`error.requestId`).
- **Fastify**: `requestIdHeader: "x-request-id"`, `genReqId(req)` to validate/normalize or generate, and an `onRequest` hook that sets `reply.header("x-request-id", request.id)`.

**Structured request-complete logs**

- One structured log line at request completion (Fastify `onResponse` hook). Fields: `requestId`, `method`, `path` (or `url`), `status`, `durationMs` (from a start time stored in `onRequest`). No throwing in the hook; use the app logger.

**Error response shape**

- **Single contract**: All error responses use the same JSON shape: `{ "error": { "code", "message", "requestId" } }`. Optional `details` added later for validation (Phase 2).
- **Error codes as constants**: `ERROR_CODES` and `ERROR_CODE_TO_STATUS` in `src/errors/error-response.ts`. Handlers call `errorResponse(code, message, request.id)` so status code is derived from the code (single source of truth).
- **Security**: Never send stack traces or internal error details to the client. Log them server-side only. For 500, respond with a generic message (e.g. "An unexpected error occurred"). Set `Cache-Control: no-store` on 5xx responses.
- **Not-found**: `setNotFoundHandler` returns 404 with the error shape and requestId. **Global error handler**: `setErrorHandler` logs with requestId/method/url and the error (including stack in logs only), then returns 500 with the generic message and no stack in the body.

**Foundation endpoints**

- `GET /api/v1/health` → `{ "status": "ok" }`.
- `GET /api/v1/ready` → `{ "status": "ok" }` until a DB exists; later can ping DB.

**Testing**

- All endpoint and error tests use `createApp()`, `app.inject()`, and `app.close()`. No real port binding. Tests cover health, ready, request-id (generated and echoed), 404 error shape, and 500 error shape.

### Alternatives considered

- **Different request-id header (e.g. X-Request-ID)**: `x-request-id` is lowercase and widely used; we kept it for consistency with common conventions.
- **Logging on every middleware**: We chose a single log line at response completion (onResponse) so we always have status and duration and avoid duplicate logs.
- **Per-route error handling**: A single global error handler and a single not-found handler keep the contract consistent and avoid scattered status codes.

### Consequences

- **Pros**: Every request is correlated via requestId in headers, logs, and errors. Clients get a stable error shape. Ops get one log line per request with status and duration.
- **Cons / risks**: Request-id validation (length, charset) may need tuning if clients send different formats. We must ensure no route or plugin sends raw errors to the client.
- **Follow-ups**: Phase 2 extends the error shape with optional `details` for validation. Ready endpoint will gain a DB ping when persistence is added.
