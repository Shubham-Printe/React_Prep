/**
 * Unit tests for the invoice service (no HTTP, no Fastify).
 * Tests the service + in-memory repo in isolation: create, getById, getByPublicId, list, markPaid.
 */

import { describe, expect, it } from "vitest";
import { createInvoiceRepoMemory } from "../src/modules/invoice/repo-memory.js";
import { createInvoiceService } from "../src/modules/invoice/service.js";

// Fixed timestamp so createdAt/updatedAt are predictable in assertions
const FIXED_NOW = "2026-01-15T12:00:00.000Z";

/** Creates a fresh service backed by an in-memory repo with fixed time. Each call = clean state. */
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

      // Input is echoed
      expect(invoice.amount).toBe(100);
      expect(invoice.description).toBe("Test invoice");
      // New invoices start as draft; optional dueDate is absent when not sent
      expect(invoice.status).toBe("draft");
      expect(invoice.dueDate).toBeUndefined();
      // Repo generates id and publicId
      expect(invoice.id).toBeDefined();
      expect(typeof invoice.id).toBe("string");
      expect(invoice.id.length).toBeGreaterThan(0);
      expect(invoice.publicId).toBeDefined();
      expect(typeof invoice.publicId).toBe("string");
      // Timestamps come from injected clock
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

      // Only the one we marked paid should appear when filtering by status "paid"
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

      // Persisted: getById returns the updated invoice
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
