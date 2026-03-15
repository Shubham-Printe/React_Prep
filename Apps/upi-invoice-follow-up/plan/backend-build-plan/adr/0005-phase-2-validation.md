## ADR: Phase 2 — Validation (schemas, validate boundary, 422 contract)

- **Date**: 2026-02-20
- **Status**: accepted

### Context

We need to validate all incoming input (body, querystring, params) at the HTTP boundary so invalid data never reaches business logic. We want a single, consistent way to parse with Zod and to return 422 with field-level details so clients know what to fix. This phase defines where schemas live, where validation runs, and the shape of validation errors.

### Decision

**Schema location and conventions (current state)**

- **Routes stay in `src/app.ts`**: We do not introduce `src/routes/` yet. Route registration remains in the app factory.
- **Schemas under `src/schemas/<resource>/`**: One schema file per endpoint concern: e.g. `create.schema.ts` (body), `list.schema.ts` (querystring), `get-by-id.schema.ts` (params). File naming: `*.schema.ts`. Each file exports `XSchema` (Zod schema) and `XInput` (type via `z.infer<>`). Import schemas from `app.ts` when registering routes.

**Validation boundary: `src/http/validate.ts`**

- **Parse helper**: `parseWithSchema(schema, input)`. Accepts a Zod schema and raw input (`unknown`). Uses `schema.safeParse(input)` only (no throwing). Returns a discriminated result: `{ success: true, data: T } | { success: false, error: ZodError }`. Type `T` is inferred from the schema.
- **ZodError → 422 mapper**: `zodErrorTo422(error, requestId)`. Builds a `details` array from `error.issues`: each item has `path` (Zod’s `issue.path` as `string[]`) and `message` (`issue.message`). Uses `errorResponse(ERROR_CODES.VALIDATION_ERROR, "Validation failed", requestId, details)` and returns `{ statusCode: 422, body }` so the route can `reply.status(r.statusCode).send(r.body)`.
- **Convention in route handlers**: Get raw input from the request; call `parseWithSchema(schema, raw)`; if `!result.success`, call `zodErrorTo422(result.error, request.id)` and return the 422 response; if `result.success`, use `result.data` as the validated input. All Zod usage and 422 shaping stay in `validate.ts` and `error-response.ts`.

**Error contract extension**

- **ValidationDetail**: `{ path: string[]; message: string }`. Exported from `src/errors/error-response.ts`. Used in the error body when `details` is present.
- **422 response**: HTTP status 422, body with `error.code: "VALIDATION_ERROR"`, `error.message`, `error.requestId`, and `error.details` (array of `ValidationDetail`). No stack or internal properties. `details` is always an array (from Zod’s `issues`).

### Alternatives considered

- **Schemas next to routes in `src/routes/v1/<resource>/`**: Deferred until we split routes into separate files; at this state we keep routes in `app.ts` and schemas in `src/schemas/` to avoid empty or premature route folders.
- **Throwing in the parse helper**: Rejected; we use `safeParse` and a result type so handlers branch explicitly and no try/catch is required.
- **Exposing full Zod error format to clients**: Rejected; we map to a minimal `path` + `message` list and do not expose internal keys or stack.

### Consequences

- **Pros**: One place for parse and 422 shaping; handlers stay thin; clients get consistent validation errors with field-level details; invalid payloads never reach business logic.
- **Cons / risks**: Every validated route must remember to call the helper and send 422 on failure; we could later add a Fastify hook or wrapper to reduce boilerplate.
- **Follow-ups**: Step 2.3 (normalize input: trim, toLowerCase where appropriate). When we introduce `src/routes/`, we may colocate schemas with route files or keep them in `src/schemas/` and import; document the choice in a follow-up ADR if it changes.
