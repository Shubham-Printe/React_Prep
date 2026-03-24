## Phase 3 — Service layer + repository interfaces (business logic without HTTP)

This phase corresponds to “Step 2 + Step 4” (service layer + in-memory repo) in the source plan.

### Goal

Separate concerns cleanly:
- **Routes/controllers**: HTTP only (validate input, call service, shape response)
- **Service layer**: business rules/orchestration (pure-ish)
- **Repository**: persistence interface (in-memory first, DB later)

### Study (short)

- `node-backend-story/01-core-flow.md` §6 (controllers/business logic)
- `node-backend-story/01-core-flow.md` §7 (CRUD conceptually)

### Build (steps)

#### Step 3.1 — Define module boundaries

Create a module folder per domain area, e.g. `invoice/`:
- **`model.ts`** — **What an invoice is and how to build one.** 
Types (e.g. `Invoice`, `InvoiceStatus`) and pure helpers (e.g. “build an invoice from this input and these ids/timestamps”). No HTTP, no database. Just the shape of the data and simple, testable functions.
- **`service.ts`** — **The “use cases” for invoices.** “Create an invoice”, “get by id”, “list with pagination”, “mark as paid”. It receives a repository (injected) and calls it. It does **not** know whether data lives in memory, in a DB, or in a file. That keeps business rules in one place and easy to test without starting a server or a DB.
- **`repo.ts`** — **The contract for “where invoices are stored”.** 
Only the **interface** (the list of methods: create, getById, list, markPaid, etc.). 
No implementation. Any code that implements this contract (in-memory now, Prisma later) can be swapped in without changing the service.
- **`repo-memory.ts`** — **A real implementation of that contract using RAM.** Stores invoices in a `Map` (or similar) so you can run and test the full flow without a database. Later you add `repo-prisma.ts` (or similar) that implements the same interface against a real DB; the service stays unchanged.

**Done when**
- services have zero imports from HTTP framework

**What to do**

1. **Create the folder** `backend/src/modules/invoice/`.

2. **Add `model.ts`** — domain types and pure helpers only (no Fastify, no DB). Define an `Invoice` type (e.g. id, amount, description, dueDate, status, publicId, createdAt, updatedAt). Export the type and a pure `buildInvoice(input, opts)` that returns an `Invoice` (opts supply id, publicId, createdAt, updatedAt).

**Code snippet — `backend/src/modules/invoice/model.ts`:**

```ts
export type InvoiceStatus = "draft" | "sent" | "paid";

export interface Invoice {
  id: string;
  publicId: string;
  amount: number;
  description: string;
  dueDate?: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceInput {
  amount: number;
  description: string;
  dueDate?: string;
}

export function buildInvoice(
  input: CreateInvoiceInput,
  opts: { id: string; publicId: string; createdAt: string; updatedAt: string }
): Invoice {
  return {
    ...opts,
    amount: input.amount,
    description: input.description,
    dueDate: input.dueDate,
    status: "draft",
  };
}
```

3. **Add `repo.ts`** — only the **interface** (type). No implementation.

**Code snippet — `backend/src/modules/invoice/repo.ts`:**

```ts
import type { Invoice, CreateInvoiceInput } from "./model.js";

export interface ListInvoicesOptions {
  page: number;
  limit: number;
  status?: Invoice["status"];
}

export interface InvoiceRepository {
  create(input: CreateInvoiceInput): Promise<Invoice>;
  getById(id: string): Promise<Invoice | null>;
  getByPublicId(publicId: string): Promise<Invoice | null>;
  list(options: ListInvoicesOptions): Promise<{ items: Invoice[]; total: number }>;
  markPaid(id: string): Promise<Invoice | null>;
}
```

4. **Add `service.ts`** — orchestration only. It receives the repository (injected). **Do not** import Fastify or any HTTP type. It calls `repo.create()`, `repo.getById()`, etc.

**Code snippet — `backend/src/modules/invoice/service.ts`:**

```ts
import type { CreateInvoiceInput } from "./model.js";
import type { InvoiceRepository, ListInvoicesOptions } from "./repo.js";

export function createInvoiceService(deps: { repo: InvoiceRepository }) {
  return {
    async create(input: CreateInvoiceInput) {
      return deps.repo.create(input);
    },
    async getById(id: string) {
      return deps.repo.getById(id);
    },
    async getByPublicId(publicId: string) {
      return deps.repo.getByPublicId(publicId);
    },
    async list(options: ListInvoicesOptions) {
      return deps.repo.list(options);
    },
    async markPaid(id: string) {
      return deps.repo.markPaid(id);
    },
  };
}

export type InvoiceService = ReturnType<typeof createInvoiceService>;
```

5. **Add `repo-memory.ts`** — In Step 3.1 you only need a **placeholder** so the project compiles and the service can be wired. That means a file that implements the `InvoiceRepository` interface in name only: each method can throw an error (e.g. `throw new Error("not implemented")`) or return empty/fake data (e.g. `list` returns `{ items: [], total: 0 }`). You are not building the real in-memory storage yet. The **real** implementation (using Maps, actually saving and loading invoices) comes in **Step 3.3**. So: Step 3.1 = add the file and satisfy the type checker; Step 3.3 = make it actually work.

**Check:** Ensure `service.ts` has **no** `import` from `"fastify"` or any HTTP layer.

---

#### Step 3.2 — Repository interface first

Define methods (example invoice):
- `createInvoice(input)`
- `getInvoiceById(id)`
- `getInvoiceByPublicId(publicId)`
- `markInvoicePaid(id)`
- `listInvoices({ page, limit })`

**Done when**
- you can swap repository implementations without touching service logic

**What to do**

1. **Lock the interface in `repo.ts`.** 
It should have: `create`, `getById`, `getByPublicId`, `list`, `markPaid` (see Step 3.1 snippet). Add any missing method signatures.
2. **Service depends only on `InvoiceRepository`.** 
In `service.ts` the dependency is typed as `InvoiceRepository`, not as the concrete in-memory class. That way you can later pass a different implementation (e.g. `repo-prisma.ts`) without changing the service.
3. **Wiring:** 
When you wire the app (Step 3.4), you will create the repo and service once (e.g. in `app.ts`) and pass the service into the route plugin. Routes never import the repository; they only call the service.

---

#### Step 3.3 — In-memory repository

Implement a deterministic in-memory repo:
- stable IDs
- stable time (inject clock where needed)

**Done when**
- integration tests can run without DB

**What to do**

1. **Implement `repo-memory.ts`** so it fully satisfies `InvoiceRepository`. Store invoices in a `Map<string, Invoice>` by id; optionally a second `Map` by publicId for fast lookup.
2. **Stable IDs:** Generate `id` and `publicId` in `create` (e.g. `inv_${Date.now()}_${random}` or a counter for tests). Use `buildInvoice` from model with these ids and timestamps from the clock.
3. **Inject a clock:** Accept `now?: () => string` in the repo constructor. In production use `() => new Date().toISOString()`; in tests pass a fixed string for deterministic results.
4. **Implement each method:**
   - **create(input):** Generate id/publicId, get createdAt/updatedAt from clock, call `buildInvoice`, store in Map(s), return invoice.
   - **getById(id):** Return `map.get(id) ?? null`.
   - **getByPublicId(publicId):** Look up in byPublicId map (or iterate byId); return invoice or null.
   - **list({ page, limit, status }):** Filter by status if provided; compute offset = (page - 1) * limit; slice and return `{ items, total }`.
   - **markPaid(id):** Get invoice; if null return null; otherwise return updated copy with `status: "paid"` and updatedAt from clock, and write back to Map(s).

**Code snippet — `backend/src/modules/invoice/repo-memory.ts`:**

```ts
import { buildInvoice } from "./model.js";
import type { CreateInvoiceInput } from "./model.js";
import type { InvoiceRepository, ListInvoicesOptions } from "./repo.js";
import type { Invoice } from "./model.js";

export function createInvoiceRepoMemory(deps: { now?: () => string } = {}): InvoiceRepository {
  const now = deps.now ?? (() => new Date().toISOString());
  const byId = new Map<string, Invoice>();
  const byPublicId = new Map<string, Invoice>();

  return {
    async create(input: CreateInvoiceInput): Promise<Invoice> {
      const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const publicId = `public_${id.slice(4)}`;
      const createdAt = now();
      const invoice = buildInvoice(input, { id, publicId, createdAt, updatedAt: createdAt });
      byId.set(invoice.id, invoice);
      byPublicId.set(invoice.publicId, invoice);
      return invoice;
    },
    async getById(id: string) {
      return byId.get(id) ?? null;
    },
    async getByPublicId(publicId: string) {
      return byPublicId.get(publicId) ?? null;
    },
    async list(options: ListInvoicesOptions) {
      const { page, limit, status } = options;
      let items = [...byId.values()];
      if (status) items = items.filter((i) => i.status === status);
      const total = items.length;
      const offset = (page - 1) * limit;
      items = items.slice(offset, offset + limit);
      return { items, total };
    },
    async markPaid(id: string) {
      const inv = byId.get(id);
      if (!inv) return null;
      const updated = { ...inv, status: "paid" as const, updatedAt: now() };
      byId.set(id, updated);
      byPublicId.set(inv.publicId, updated);
      return updated;
    },
  };
}
```

For **deterministic tests**, pass a custom `now` and consider id generation that does not depend on `Date.now()` or `Math.random()` (e.g. a counter).

---

#### Step 3.4 — Route handlers call the service

**Current repo shape (reference):** The app is built in `src/app.ts` with `createApp` and `await app.register(v1Routes, { prefix: "/api/v1" })`. The v1 plugin (`src/routes/v1.ts`) owns health, ready, trigger-error and mounts the invoice feature via `registerInvoice(fastify)`. The invoice module is self-contained: `src/modules/invoice/register.ts` creates the repo and service, then registers `invoiceRoutes` with `{ invoiceService }`. Invoice handlers live in `src/modules/invoice/routes.ts` and receive the service via **opts** (no `request.invoiceService`). Schemas live in `src/schemas/invoices/` (create, list, get-by-id). No `get-by-public-id.schema.ts` yet.

Add or update these endpoints (invoice routes are mounted under v1, so URLs are `/api/v1/invoices`, etc.):
- `POST /api/v1/invoices` ✓ (in `modules/invoice/routes.ts`)
- `GET /api/v1/invoices` ✓ (list; in `modules/invoice/routes.ts`)
- `GET /api/v1/invoices/:id` ✓ (in `modules/invoice/routes.ts`)
- `PATCH /api/v1/invoices/:id/paid` ✓ (in `modules/invoice/routes.ts`)
- `GET /api/v1/public/invoices/:publicId` ✓ (in `modules/invoice/routes.ts`)

**Done when**
- handlers are thin (validate → service → reply)

**What to do**

1. **Keep wiring in the invoice module.** Service and repo are already created in `src/modules/invoice/register.ts`; no changes in `src/app.ts`. v1 only calls `await registerInvoice(fastify)` — no opts passed from app.

2. **Service in invoice routes.** The invoice plugin (`src/modules/invoice/routes.ts`) already receives `InvoiceRouteOptions { invoiceService }` and uses `invoiceService` in handlers (closure). No `fastify.decorate` or `request.invoiceService`; no changes to `src/types/fastify.ts` for invoice.

3. **Thin handlers in `src/modules/invoice/routes.ts`:**
   - **POST /invoices** ✓ — Validate body with `CreateInvoicesBodySchema`, call `invoiceService.create(result.data)`, reply 201.
   - **GET /invoices** ✓ — Validate query with `ListInvoicesQuerySchema`, call `invoiceService.list({ page, limit, status })`, return `listResponse(items, page, limit, total)`.
   - **GET /invoices/:id** — Validate params with `InvoiceIdParamsSchema` (`src/schemas/invoices/get-by-id.schema.ts`). Call `invoiceService.getById(id)`. If null reply 404 with your error shape; else 200 with the invoice.
   - **PATCH /invoices/:id/paid** — Validate params (id). Call `invoiceService.markPaid(id)`. If null reply 404; else 200 with the updated invoice.
   - **GET /public/invoices/:publicId** — Register with path `"public/invoices/:publicId"`. Validate params (publicId); add a schema in `src/schemas/invoices/` (e.g. `get-by-public-id.schema.ts`). Call `invoiceService.getByPublicId(publicId)`. If null reply 404; else 200 with the invoice.

4. **Example handler (POST /invoices) — current pattern:**

   ```ts
   fastify.post("/invoices", async (request, reply) => {
     const result = parseWithSchema(CreateInvoicesBodySchema, request.body);
     if (!result.success) {
       const { statusCode, body } = zodErrorTo422(result.error, request.id);
       return reply.status(statusCode).send(body);
     }
     const invoice = await invoiceService.create(result.data);
     return reply.status(201).send(invoice);
   });
   ```
   (Handlers use the `invoiceService` from the plugin opts, not from the request.)

5. **404 handling:** When `getById`, `getByPublicId`, or `markPaid` returns null, reply with your standard 404 error shape (e.g. `errorResponse(ERROR_CODES.NOT_FOUND, "Invoice not found", request.id)` and `reply.status(r.statusCode).send(r.body)`).

6. **Schemas:** Reuse `src/schemas/invoices/get-by-id.schema.ts` for `:id`. Add `src/schemas/invoices/get-by-public-id.schema.ts` for `:publicId` (e.g. `publicId: z.string().min(1)`) and validate in the public handler before calling the service.

---

#### Step 3.5 — Phase 3 tests

Tests are specified in a separate document with full code snippets and a checklist:

- **[04b-phase-3-tests.md](./04b-phase-3-tests.md)** — Unit tests for the invoice service (no HTTP) and integration tests for all invoice endpoints (in-process `app.inject()` only). Implement the two test files described there, then run `npm test` and tick the checklist before marking Phase 3 complete.

---

### Deliverable

- unit tests for service logic (no HTTP)
- integration tests for endpoints using in-process injection (no real port)

### Repo shape (end of Phase 3)

**Current shape (invoice as a self-contained module):**

```txt
backend/
  src/
    app.ts
    server.ts
    config/
      fastify.ts
    types/
      fastify.ts
    errors/
      error-response.ts
    http/
      global-error-handler.ts
      list-response.ts
      not-found-handler.ts
      request-id-hook.ts
      response-log-hook.ts
      validate.ts
    modules/
      invoice/
        model.ts
        register.ts
        repo.ts
        repo-memory.ts
        routes.ts
        service.ts
    routes/
      v1.ts
    schemas/
      common/
        pagination.schema.ts
      invoices/
        create.schema.ts
        list.schema.ts
        get-by-id.schema.ts
        get-by-public-id.schema.ts   (add for GET by publicId)
  test/
    invoice.service.test.ts
    invoices.http.test.ts
    (existing: health, ready, error-handling, validation, smoke)
```

- **v1** (`src/routes/v1.ts`): health, ready, trigger-error; mounts invoice via `registerInvoice(fastify)`.
- **Invoice** (`src/modules/invoice/`): `register.ts` creates repo + service and registers `routes.ts` with `{ invoiceService }`. Handlers in `routes.ts` use `invoiceService` from opts (closure). No `request.invoiceService`; `src/types/fastify.ts` only augments request with `startAt` (and similar), not the invoice service.

**Optional later:** You can split `modules/invoice/routes.ts` into per-endpoint files (e.g. under `modules/invoice/routes/`) or add `src/routes/v1/invoices/` and `v1/public/` if you prefer route-centric layout; the phase is complete with the module-centric layout above.

