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
- `model.ts` (types + pure functions)
- `service.ts` (orchestration)
- `repo.ts` (interface)
- `repo-memory.ts` (in-memory implementation)

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

5. **Add `repo-memory.ts`** — stub that implements `InvoiceRepository`. For Step 3.1 a minimal stub (e.g. `create` throws "not implemented") is enough; full implementation is Step 3.3.

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

1. **Lock the interface in `repo.ts`.** It should have: `create`, `getById`, `getByPublicId`, `list`, `markPaid` (see Step 3.1 snippet). Add any missing method signatures.
2. **Service depends only on `InvoiceRepository`.** In `service.ts` the dependency is typed as `InvoiceRepository`, not as the concrete in-memory class. That way you can later pass a different implementation (e.g. `repo-prisma.ts`) without changing the service.
3. **Wiring:** When you wire the app (Step 3.4), you will create the repo and service once (e.g. in `app.ts`) and pass the service into the route plugin. Routes never import the repository; they only call the service.

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

Add endpoints (v1):
- `POST /api/v1/invoices`
- `GET /api/v1/invoices/:id`
- `PATCH /api/v1/invoices/:id/paid`
- `GET /api/v1/public/invoices/:publicId`

**Done when**
- handlers are thin (mostly validate → service → reply)

**What to do**

1. **Wire the invoice service into the app.** In `app.ts`, before registering v1 routes, create the repo and service and pass the service into the route plugin:

   ```ts
   import { createInvoiceRepoMemory } from "./modules/invoice/repo-memory.js";
   import { createInvoiceService } from "./modules/invoice/service.js";

   const invoiceRepo = createInvoiceRepoMemory();
   const invoiceService = createInvoiceService({ repo: invoiceRepo });
   await app.register(v1Routes, { prefix: "/api/v1", invoiceService });
   ```

   In `v1.ts`, the plugin receives `(fastify, opts)`. Decorate the fastify instance so handlers can access the service: e.g. `fastify.decorate("invoiceService", opts.invoiceService)`. Extend the Fastify request type in `src/types/fastify.ts` so `request.invoiceService` is typed (e.g. add `invoiceService?: InvoiceService` to the FastifyRequest interface).

2. **Thin handlers in `v1.ts`:**
   - **POST /invoices** — Validate body with `CreateInvoicesBodySchema`. On success call `await request.invoiceService.create(result.data)` and reply 201 with the returned invoice.
   - **GET /invoices** — Replace the stub: call `request.invoiceService.list({ page, limit, status })` and return `listResponse(items, page, limit, total)`.
   - **GET /invoices/:id** — Validate params (e.g. with `InvoiceIdParamsSchema`). Call `request.invoiceService.getById(id)`. If null reply 404 with your error shape; else 200 with the invoice.
   - **PATCH /invoices/:id/paid** — Validate params (id). Call `request.invoiceService.markPaid(id)`. If null reply 404; else 200 with the updated invoice.
   - **GET /public/invoices/:publicId** — Register route with path `public/invoices/:publicId`. Validate params (publicId). Call `request.invoiceService.getByPublicId(publicId)`. If null reply 404; else 200 with the invoice.

3. **Example handler (POST /invoices):**

   ```ts
   fastify.post("/invoices", async (request, reply) => {
     const result = parseWithSchema(CreateInvoicesBodySchema, request.body);
     if (!result.success) {
       const { statusCode, body } = zodErrorTo422(result.error, request.id);
       return reply.status(statusCode).send(body);
     }
     const invoice = await request.invoiceService.create(result.data);
     return reply.status(201).send(invoice);
   });
   ```

4. **404 handling:** When `getById`, `getByPublicId`, or `markPaid` returns null, reply with your standard 404 error shape (e.g. `errorResponse(ERROR_CODES.NOT_FOUND, "Invoice not found", request.id)`).

5. **Schemas:** Add or reuse param schemas for `:id` and `:publicId` in `src/schemas/invoices/` (e.g. `get-by-id.schema.ts`, `get-by-public-id.schema.ts`) and validate in each handler before calling the service.

**Note:** You can keep all v1 routes in a single `routes/v1.ts` file; splitting into separate files under `v1/invoices/` and `v1/public/` is optional and matches the "Repo shape" below when you want finer structure.

---

### Deliverable

- unit tests for service logic (no HTTP)
- integration tests for endpoints using in-process injection (no real port)

### Repo shape (end of Phase 3)

```txt
backend/
  src/
    modules/
      invoice/
        model.ts
        service.ts
        repo.ts
        repo-memory.ts
    routes/
      v1/
        invoices/
          create.route.ts
          get-by-id.route.ts
          mark-paid.route.ts
        public/
          get-by-public-id.route.ts
  test/
    invoice.service.test.ts
    invoice.http.test.ts
```

**Note:** You can meet the phase with all v1 routes in a single `routes/v1.ts`; the split into `v1/invoices/` and `v1/public/` is optional.

