## Phase 2 — Validation-first endpoints (Zod at the boundary)

This phase establishes schemas and 422 handling at the HTTP boundary. Phase 2.5 (API design) later moves routes into `src/routes/v1.ts`; validation stays in those handlers.

### Goal

Make your backend resilient to bad input by enforcing:

- schemas for body, query, and params
- normalization (trim, lowercase) where appropriate
- consistent 422 validation error responses

### Study (short)

- `node-backend-story/01-core-flow.md` §5 (schemas)
- `node-backend-story/03-security-resilience.md` §17 (input sanitization)

### Build (steps)

#### Step 2.1 — Define schema conventions

Pick conventions:

- **File naming:** `*.schema.ts`
- **Exports:** `XSchema` (Zod schema) and `XInput` (type via `z.infer<>`)
- **Scope:** One schema per endpoint concern — request body, querystring, or params

**Repo shape at this state**

- Routes stay in `src/app.ts` (no `src/routes/` yet).
- Schemas live under `src/schemas/<resource>/` as `*.schema.ts`. One schema file per endpoint concern. Import schemas from `app.ts` when registering routes.

**Instructions**

1. Create `src/schemas/<resource>/` and add a `*.schema.ts` file for each endpoint input (e.g. `create.schema.ts` for body, `list.schema.ts` for querystring, `get-by-id.schema.ts` for params).
2. In each schema file, export the Zod schema and the inferred type: `XSchema` and `XInput` via `z.infer<>`.
3. In the route handler in `app.ts`, use the schema to parse/validate before calling business logic (see Step 2.2 for parsing helpers).

**Example — request body schema**

```ts
// src/schemas/invoices/create.schema.ts
import { z } from "zod";

export const CreateInvoicesBodySchema = z.object({
  amount: z.number().positive(),
  description: z.string().trim().min(1).max(500),
  dueDate: z.string().optional(),
});

export type CreateInvoicesBodyInput = z.infer<typeof CreateInvoicesBodySchema>;
```

Use `.trim()` on user-entered strings so validation applies to normalized input. For dates, use `z.string().datetime()` or your Zod version’s date helper if you need ISO format.

**Example — querystring schema**

```ts
// src/schemas/invoices/list.schema.ts
import { z } from "zod";

export const ListInvoicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["draft", "sent", "paid"]).optional(),
});

export type ListInvoicesQueryInput = z.infer<typeof ListInvoicesQuerySchema>;
```

**Example — params schema**

```ts
// src/schemas/invoices/get-by-id.schema.ts
import { z } from "zod";

export const InvoiceIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type InvoiceIdParamsInput = z.infer<typeof InvoiceIdParamsSchema>;
```

**Done when:** Every new endpoint has a schema file before implementation.

---

#### Step 2.2 — Implement schema parsing at boundary

Add helpers to:

- parse and validate input (no throw)
- map Zod errors to HTTP 422 with `VALIDATION_ERROR` and a `details` array (safe to expose)

**Done when:** Invalid payloads do not reach business logic.

---

**Exact instructions for Step 2.2**

1. **Extend the error response for validation**

   In `src/errors/error-response.ts`, add support for a validation payload:

   - Extend `errorResponse` to accept an optional fourth argument: `details` (array of validation issues).
   - The response body must include: `code: "VALIDATION_ERROR"`, `message`, `requestId`, and optionally `details`. Do not expose stack or internals.
   - Define one `detail` item as `{ path: string[], message: string }` from Zod’s `issue.path` and `issue.message`.

   **Why:** Clients need to know which fields failed and why. We extend the existing error envelope with an optional `details` list; call sites that don’t pass `details` are unchanged.

   **Code to add/change in `src/errors/error-response.ts`:**

   0. **Add `VALIDATION_ERROR` to the error codes** (if your Phase 1 only had `NOT_FOUND` and `INTERNAL_ERROR`). Add to the `ERROR_CODES` object and to `ERROR_CODE_TO_STATUS`:

   ```ts
   const ERROR_CODES = {
     NOT_FOUND: "NOT_FOUND",
     INTERNAL_ERROR: "INTERNAL_ERROR",
     VALIDATION_ERROR: "VALIDATION_ERROR",
   } as const;
   // ...
   const ERROR_CODE_TO_STATUS: Record<ErrorCode, number> = {
     [ERROR_CODES.NOT_FOUND]: 404,
     [ERROR_CODES.INTERNAL_ERROR]: 500,
     [ERROR_CODES.VALIDATION_ERROR]: 422,
   };
   ```

   1. Add the type for one validation issue (after `ERROR_CODE_TO_STATUS`, before `interface ErrorPayloadBody`):

   ```ts
   /** One validation issue (safe to expose to client). Path follows Zod's issue.path. */
   export interface ValidationDetail {
     path: string[];
     message: string;
   }
   ```

   2. Extend the error body type so it can optionally include `details`:

   ```ts
   interface ErrorPayloadBody {
     code: ErrorCode;
     message: string;
     requestId: string;
     details?: ValidationDetail[];
   }
   ```

   3. Update `errorPayload` to accept an optional fourth argument and only add `details` when provided and non-empty:

   ```ts
   function errorPayload(
     code: ErrorCode,
     message: string,
     requestId: string,
     details?: ValidationDetail[]
   ): { error: ErrorPayloadBody } {
     const body: ErrorPayloadBody = { code, message, requestId };
     if (details !== undefined && details.length > 0) {
       body.details = details;
     }
     return { error: body };
   }
   ```

   4. Update `errorResponse` to take the same optional fourth argument and pass it through:

   ```ts
   function errorResponse(
     code: ErrorCode,
     message: string,
     requestId: string,
     details?: ValidationDetail[]
   ): { statusCode: number; body: { error: ErrorPayloadBody } } {
     return {
       statusCode: ERROR_CODE_TO_STATUS[code],
       body: errorPayload(code, message, requestId, details),
     };
   }
   ```

   Existing call sites stay as they are (no fourth argument). For validation you will call `errorResponse(ERROR_CODES.VALIDATION_ERROR, "Validation failed", request.id, details)`.

2. **Create `src/http/validate.ts`**

   This file is the single place for “parse with Zod and turn failures into 422.”

   - **Parse helper (no throwing).** Accept a Zod schema and raw input (`unknown`). Use `schema.safeParse(input)` only. Return a discriminated result: `{ success: true, data: T }` or `{ success: false, error: ZodError }`. Export as `parseWithSchema(schema, input)`.

   - **ZodError → 422 mapper.** Accept a `ZodError` and `requestId`. Build `details` from `error.issues`: each item `{ path: issue.path.map(String), message: issue.message }`. Call `errorResponse(ERROR_CODES.VALIDATION_ERROR, "Validation failed", requestId, details)` and return `{ statusCode, body }` so the route can do `reply.status(r.statusCode).send(r.body)`. Export as `zodErrorTo422(error, requestId)`.

   **Why:** Route handlers get raw input. Centralising parse + error shaping in `validate.ts` ensures invalid data never reaches business logic and every route returns the same 422 shape.

   **Parse helper snippet:**

   ```ts
   import { z } from "zod";

   export function parseWithSchema<T>(
     schema: z.ZodType<T>,
     input: unknown
   ): { success: true; data: T } | { success: false; error: z.ZodError } {
     const result = schema.safeParse(input);
     if (result.success) {
       return { success: true, data: result.data };
     }
     return { success: false, error: result.error };
   }
   ```

   **ZodError → 422 mapper snippet:**

   ```ts
   import type { ZodError } from "zod";
   import { ERROR_CODES, errorResponse } from "../errors/error-response.js";
   import type { ValidationDetail } from "../errors/error-response.js";

   export function zodErrorTo422(
     error: ZodError,
     requestId: string
   ): { statusCode: number; body: { error: { code: string; message: string; requestId: string; details?: ValidationDetail[] } } } {
     const details: ValidationDetail[] = error.issues.map((issue) => ({
       path: issue.path.map(String),
       message: issue.message,
     }));
     const r = errorResponse(ERROR_CODES.VALIDATION_ERROR, "Validation failed", requestId, details);
     return { statusCode: r.statusCode, body: r.body };
   }
   ```

   Export `ValidationDetail` from `error-response.ts` if needed, or use a local type with `path: string[]` and `message: string`.

   **Convention in route handlers:** Call `parseWithSchema(schema, raw)`; if `!result.success`, call `zodErrorTo422(result.error, request.id)` and send that as 422 and return; if `result.success`, use `result.data`. Keep all Zod and 422 shaping in `validate.ts` and `error-response.ts`.

3. **Use the validator in route handlers**

   For any route with body, querystring, or params:

   - Get the raw value (e.g. `request.body`, `request.query`, `request.params`).
   - Call `parseWithSchema(appropriateSchema, raw)`.
   - If `success: false`, send 422 with the body from `zodErrorTo422(result.error, request.id)` and do not run business logic.
   - If `success: true`, use `result.data` and pass it to business logic.

   Apply this to at least one endpoint (e.g. POST create invoices) so invalid JSON, wrong types, or constraint failures return 422 with `VALIDATION_ERROR` and `details`.

   **Snippet — validating request body (e.g. POST create)**

   In `app.ts` (or in `src/routes/v1.ts` after Phase 2.5), add imports and a route that validates body:

   ```ts
   import { parseWithSchema, zodErrorTo422 } from "./http/validate.js";
   import { CreateInvoicesBodySchema } from "./schemas/invoices/create.schema.js";

   // Inside createApp() with your other routes, or in v1Routes if using src/routes/v1.ts:
   app.post("/api/v1/invoices", async (request, reply) => {
     const result = parseWithSchema(CreateInvoicesBodySchema, request.body);
     if (!result.success) {
       const { statusCode, body } = zodErrorTo422(result.error, request.id);
       return reply.status(statusCode).send(body);
     }
     const data = result.data; // typed as CreateInvoicesBodyInput
     // TODO: call business logic / service with data
     return reply.status(201).send({ id: "stub", ...data });
   });
   ```

   If routes are in `src/routes/v1.ts`, use relative paths from there (e.g. `../http/validate.js`, `../schemas/invoices/create.schema.js`) and register the route with a relative path (e.g. `fastify.post("/invoices", ...)`).

   **Querystring or params:** Same pattern with a different source and schema:

   ```ts
   // Querystring: parseWithSchema(ListInvoicesQuerySchema, request.query)
   // Params:      parseWithSchema(InvoiceIdParamsSchema, request.params)
   ```

4. **Contract for 422 validation responses**

   Treat this as the spec your implementation must follow. Verify that 422 responses match it; no new code is required if Step 2.2 is implemented correctly.

   - **HTTP status:** 422 Unprocessable Entity.
   - **Body shape (example):**

   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Validation failed",
       "requestId": "<request-id>",
       "details": [
         { "path": ["amount"], "message": "Number must be greater than 0" },
         { "path": ["description"], "message": "String must contain at least 1 character(s)" }
       ]
     }
   }
   ```

   `path` is `string[]` from Zod’s `issue.path`. Ensure `details` is always an array; do not expose `stack` or internal error properties.

5. **Checklist**

   - [ ] `error-response.ts` can return 422 with `VALIDATION_ERROR` and a `details` array.
   - [ ] `src/http/validate.ts` exists with `parseWithSchema` (safeParse, no throw) and `zodErrorTo422`.
   - [ ] At least one route validates body/query/params with the helper and sends 422 on failure without running business logic.
   - [ ] Invalid payloads (wrong type, missing required, constraint failure) are tested and return 422 with the above body shape.

#### Step 2.3 — Normalize input

Apply transformations where it helps:

- `trim()` on user-entered strings
- `toLowerCase()` for emails/ids where case-insensitive
- Strict parsing for query params (e.g. Zod `z.coerce.number()`) — no implicit coercion unless intentional

**Input normalization checklist (consider for each endpoint):**

- **Strings:** `trim()` leading/trailing whitespace on text inputs; decide whether to reject empty-after-trim or treat as empty per business rule.
- **Case:** `toLowerCase()` (or `toUpperCase()`) for case-insensitive identifiers (emails, UPI IDs, enum-like query params). Document the canonical form.
- **Numbers:** Use Zod `z.coerce.number()` or equivalent; avoid ad-hoc coercion (e.g. `+req.query.page`) unless intentional and documented.
- **Whitespace:** Collapse internal multiple spaces only if the product needs it; otherwise trim is enough.
- **Null/empty:** Treat `""`, `null`, and `undefined` consistently (e.g. optional string vs `z.string().min(1)` for required).
- **IDs and slugs:** Normalize before lookup (trim, lowercase if case-insensitive); reject or 400 if format is invalid.
- **Dates/times:** Parse into a single canonical form (e.g. ISO 8601); validate ranges in schema or service.
- **Enums:** Normalize to a canonical value then validate; return 422 for invalid values.
- **Length/cardinality:** Apply `.max()` (and optionally `.min()`) after trim so limits apply to normalized value.
- **No silent data change:** Only normalize in ways you’d document; avoid stripping or “fixing” content unless it’s an explicit product rule.

**Done when:** You can explain how each validated endpoint normalizes input (e.g. “create trims description; list coerces page/limit to integers”).

---

### Deliverable

- Invalid requests return 422 with the structured error shape above.
- Schema/validation tests exist (valid and invalid cases).

### Repo shape (end of Phase 2)

Routes stay in `app.ts`; schemas live under `src/schemas/<resource>/`. No `src/routes/` yet. Phase 2.5 (API design basics) later introduces `src/routes/v1.ts` and moves v1 routes there; validation stays in the route handlers.

```txt
backend/
  src/
    app.ts
    errors/
      error-response.ts
    http/
      validate.ts
    schemas/
      invoices/
        create.schema.ts
        list.schema.ts
        get-by-id.schema.ts
  test/
    validation.test.ts
```

**When `src/routes/` is introduced:** Phase 2.5 introduces `src/routes/v1.ts` and registers it with prefix `/api/v1`. Until then, all route registration stays in `app.ts`.

### Done when (Phase 2 complete)

- **Step 2.1 — Schemas**
  - [ ] `src/schemas/<resource>/` exists with `*.schema.ts` per endpoint concern (e.g. create, list, get-by-id).
  - [ ] Each schema file exports `XSchema` and `XInput` (via `z.infer<>`).
  - [ ] At least one route uses a schema to validate input before business logic (in `app.ts` or, after Phase 2.5, in `src/routes/v1.ts`).

- **Step 2.2 — Parsing and 422**
  - [ ] `error-response.ts` returns 422 with `VALIDATION_ERROR` and an optional `details` array (path + message); no stack or internals in client response.
  - [ ] `src/http/validate.ts` exists with `parseWithSchema` (safeParse, no throw) and `zodErrorTo422`.
  - [ ] At least one route calls the parse helper and, on failure, sends 422 without running business logic.
  - [ ] Invalid payloads (wrong type, missing required, constraint failure) return 422 with body shape: `error.code`, `error.message`, `error.requestId`, `error.details` (array).

- **Step 2.3 — Normalization**
  - [ ] You can explain how each validated endpoint normalizes input.

- **Deliverables**
  - [ ] Invalid requests return 422 with the structured error shape above.
  - [ ] `test/validation.test.ts` (or equivalent) exists and tests: valid payload → success; invalid type / missing required / constraint failure → 422 and correct body shape.

- **Repo shape**
  - [ ] Routes in `app.ts` (or in `src/routes/v1.ts` after Phase 2.5); schemas in `src/schemas/<resource>/`; `src/http/validate.ts` and `src/errors/error-response.ts` present.

### Key files (end of Phase 2)

- `backend/src/app.ts` — route registration (until Phase 2.5 moves them to `src/routes/v1.ts`).
- `backend/src/errors/error-response.ts` — `ERROR_CODES`, `ValidationDetail`, `errorResponse` (with optional `details`).
- `backend/src/http/validate.ts` — `parseWithSchema`, `zodErrorTo422`.
- `backend/src/schemas/<resource>/*.schema.ts` — per-endpoint schemas and inferred types.
- `backend/test/validation.test.ts` — tests for valid/invalid payloads and 422 shape.
