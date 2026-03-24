## Phase 3 tests — Unit + integration (no HTTP in unit; in-process injection only)

This document is the test companion to **Phase 3** ([04-phase-3-service-repo.md](./04-phase-3-service-repo.md)). Implement these tests to satisfy the Phase 3 deliverable.

### Goal

- **Unit tests:** Service + in-memory repo only; no Fastify, no `createApp`, no HTTP.
- **Integration tests:** Full app via `createApp()` and `app.inject()`; no real port or `listen()`.

### Done when

- `npm test` runs unit tests for the invoice service and integration tests for all invoice endpoints.
- All tests use in-process injection only (no real server or DB).

---

### 1. Unit tests — `test/invoice.service.test.ts`

**Scope:** `createInvoiceService` + `createInvoiceRepoMemory`. Use a fixed `now` for deterministic timestamps.

**Code snippet:**

```ts
import { describe, expect, it } from "vitest";
import { createInvoiceRepoMemory } from "../src/modules/invoice/repo-memory.js";
import { createInvoiceService } from "../src/modules/invoice/service.js";

const FIXED_NOW = "2026-01-15T12:00:00.000Z";

function makeService() {
  const repo = createInvoiceRepoMemory({ now: () => FIXED_NOW });
  return createInvoiceService({ repo });
}

describe("invoice service (unit)", () => {
  describe("create", () => {
    it("returns invoice with correct shape and draft status", async () => {
      const service = makeService();
      const invoice = await service.create({
        amount: 100,
        description: "Test invoice",
      });

      expect(invoice.amount).toBe(100);
      expect(invoice.description).toBe("Test invoice");
      expect(invoice.status).toBe("draft");
      expect(invoice.dueDate).toBeUndefined();
      expect(invoice.id).toBeDefined();
      expect(typeof invoice.id).toBe("string");
      expect(invoice.id.length).toBeGreaterThan(0);
      expect(invoice.publicId).toBeDefined();
      expect(typeof invoice.publicId).toBe("string");
      expect(invoice.createdAt).toBe(FIXED_NOW);
      expect(invoice.updatedAt).toBe(FIXED_NOW);
    });

    it("includes dueDate when provided", async () => {
      const service = makeService();
      const invoice = await service.create({
        amount: 200,
        description: "With due",
        dueDate: "2026-02-01T00:00:00.000Z",
      });

      expect(invoice.amount).toBe(200);
      expect(invoice.dueDate).toBe("2026-02-01T00:00:00.000Z");
      expect(invoice.status).toBe("draft");
    });
  });

  describe("getById", () => {
    it("returns same invoice after create", async () => {
      const service = makeService();
      const created = await service.create({ amount: 50, description: "Lookup" });
      const found = await service.getById(created.id);

      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
      expect(found!.amount).toBe(50);
    });

    it("returns null for unknown id", async () => {
      const service = makeService();
      const found = await service.getById("inv_nonexistent_123");
      expect(found).toBeNull();
    });
  });

  describe("getByPublicId", () => {
    it("returns same invoice after create", async () => {
      const service = makeService();
      const created = await service.create({ amount: 75, description: "Public" });
      const found = await service.getByPublicId(created.publicId);

      expect(found).not.toBeNull();
      expect(found!.publicId).toBe(created.publicId);
      expect(found!.amount).toBe(75);
    });

    it("returns null for unknown publicId", async () => {
      const service = makeService();
      const found = await service.getByPublicId("public_unknown");
      expect(found).toBeNull();
    });
  });

  describe("list", () => {
    it("returns paginated items and total", async () => {
      const service = makeService();
      await service.create({ amount: 1, description: "A" });
      await service.create({ amount: 2, description: "B" });
      await service.create({ amount: 3, description: "C" });

      const page1 = await service.list({ page: 1, limit: 2 });
      expect(page1.items.length).toBe(2);
      expect(page1.total).toBe(3);

      const page2 = await service.list({ page: 2, limit: 2 });
      expect(page2.items.length).toBe(1);
      expect(page2.total).toBe(3);
    });

    it("filters by status when provided", async () => {
      const service = makeService();
      const a = await service.create({ amount: 10, description: "Draft" });
      await service.markPaid(a.id);

      await service.create({ amount: 20, description: "Still draft" });

      const paidOnly = await service.list({ page: 1, limit: 10, status: "paid" });
      expect(paidOnly.total).toBe(1);
      expect(paidOnly.items[0].status).toBe("paid");
    });
  });

  describe("markPaid", () => {
    it("updates status to paid and returns updated invoice", async () => {
      const service = makeService();
      const created = await service.create({ amount: 100, description: "To pay" });
      const updated = await service.markPaid(created.id);

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe("paid");
      expect(updated!.id).toBe(created.id);
      expect(updated!.updatedAt).toBe(FIXED_NOW);

      const found = await service.getById(created.id);
      expect(found!.status).toBe("paid");
    });

    it("returns null for unknown id", async () => {
      const service = makeService();
      const result = await service.markPaid("inv_nonexistent");
      expect(result).toBeNull();
    });
  });
});
```

---

### 2. Integration tests — `test/invoices.http.test.ts`

**Scope:** Full app via `createApp()`, then `app.inject()`. Use one app for the whole describe (`beforeAll` / `afterAll`) so the in-memory repo is shared. Each test that needs an invoice does its own POST first so tests stay independent of run order.

**Code snippet:**

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type { FastifyInstance } from "fastify";
import { ERROR_CODES } from "../src/errors/error-response.js";

describe("invoices API (integration)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/v1/invoices", () => {
    it("returns 201 with created invoice", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/v1/invoices",
        payload: { amount: 100, description: "Integration test invoice" },
      });

      expect(res.statusCode).toBe(201);
      const body = res.json() as {
        id: string;
        publicId: string;
        amount: number;
        description: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
      expect(body.amount).toBe(100);
      expect(body.description).toBe("Integration test invoice");
      expect(body.status).toBe("draft");
      expect(body.id).toBeDefined();
      expect(body.publicId).toBeDefined();
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
    });

    it("returns 422 for invalid payload", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/v1/invoices",
        payload: { amount: "not-a-number", description: "Test" },
      });

      expect(res.statusCode).toBe(422);
      const body = res.json() as { error: { code: string; message: string; requestId: string } };
      expect(body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(body.error.message).toBe("Validation failed");
    });
  });

  describe("GET /api/v1/invoices", () => {
    it("returns 200 with list envelope (items, page, limit, total)", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/v1/invoices?page=1&limit=10",
      });

      expect(res.statusCode).toBe(200);
      const body = res.json() as { items: unknown[]; page: number; limit: number; total?: number };
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.page).toBe(1);
      expect(body.limit).toBe(10);
      expect(typeof body.total).toBe("number");
    });

    it("includes created invoice in list", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/invoices",
        payload: { amount: 999, description: "For list test" },
      });
      expect(createRes.statusCode).toBe(201);
      const created = createRes.json() as { id: string };

      const listRes = await app.inject({
        method: "GET",
        url: "/api/v1/invoices?page=1&limit=10",
      });
      expect(listRes.statusCode).toBe(200);
      const list = listRes.json() as { items: { id: string }[]; total: number };
      expect(list.total).toBeGreaterThanOrEqual(1);
      const found = list.items.find((i) => i.id === created.id);
      expect(found).toBeDefined();
    });
  });

  describe("GET /api/v1/invoices/:id", () => {
    it("returns 200 with invoice when id exists", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/invoices",
        payload: { amount: 1, description: "Get by id" },
      });
      expect(createRes.statusCode).toBe(201);
      const created = createRes.json() as { id: string; amount: number; description: string };

      const res = await app.inject({
        method: "GET",
        url: `/api/v1/invoices/${created.id}`,
      });
      expect(res.statusCode).toBe(200);
      const body = res.json() as { id: string; amount: number; description: string };
      expect(body.id).toBe(created.id);
      expect(body.amount).toBe(created.amount);
      expect(body.description).toBe(created.description);
    });

    it("returns 404 when id does not exist", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/v1/invoices/inv_nonexistent_123",
      });
      expect(res.statusCode).toBe(404);
      const body = res.json() as { error: { code: string; message: string; requestId: string } };
      expect(body.error.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(body.error.message).toBe("Invoice not found");
    });
  });

  describe("PATCH /api/v1/invoices/:id/paid", () => {
    it("returns 200 with invoice with status paid", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/invoices",
        payload: { amount: 2, description: "To mark paid" },
      });
      expect(createRes.statusCode).toBe(201);
      const created = createRes.json() as { id: string };

      const res = await app.inject({
        method: "PATCH",
        url: `/api/v1/invoices/${created.id}/paid`,
      });
      expect(res.statusCode).toBe(200);
      const body = res.json() as { id: string; status: string };
      expect(body.id).toBe(created.id);
      expect(body.status).toBe("paid");
    });

    it("returns 404 when id does not exist", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/api/v1/invoices/inv_nonexistent_456/paid",
      });
      expect(res.statusCode).toBe(404);
      const body = res.json() as { error: { code: string; message: string } };
      expect(body.error.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(body.error.message).toBe("Invoice not found");
    });
  });

  describe("GET /api/v1/public/invoices/:publicId", () => {
    it("returns 200 with invoice when publicId exists", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/invoices",
        payload: { amount: 3, description: "Public lookup" },
      });
      expect(createRes.statusCode).toBe(201);
      const created = createRes.json() as { publicId: string; amount: number; description: string };

      const res = await app.inject({
        method: "GET",
        url: `/api/v1/public/invoices/${created.publicId}`,
      });
      expect(res.statusCode).toBe(200);
      const body = res.json() as { publicId: string; amount: number; description: string };
      expect(body.publicId).toBe(created.publicId);
      expect(body.amount).toBe(created.amount);
      expect(body.description).toBe(created.description);
    });

    it("returns 404 when publicId does not exist", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/v1/public/invoices/public_nonexistent",
      });
      expect(res.statusCode).toBe(404);
      const body = res.json() as { error: { code: string; message: string } };
      expect(body.error.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(body.error.message).toBe("Invoice not found");
    });
  });
});
```

---

### 3. Checklist before marking Phase 3 complete

- [ ] **Unit** — `test/invoice.service.test.ts`: create (shape + draft + dueDate), getById (found + null), getByPublicId (found + null), list (pagination + status filter), markPaid (success + null).
- [ ] **Integration** — `test/invoices.http.test.ts`: POST (201 + 422), GET list (200 + envelope + created in list), GET by id (200 + 404), PATCH paid (200 + 404), GET by publicId (200 + 404).
- [ ] No `listen()` or real port; all integration tests use `app.inject()` only.
- [ ] `npm test` passes.

---

### Repo shape (test files)

```txt
backend/
  test/
    invoice.service.test.ts    # unit: service + repo only
    invoices.http.test.ts      # integration: createApp + app.inject
    health.test.ts
    ready.test.ts
    error-handling.test.ts
    validation.test.ts
    smoke.test.ts
```
