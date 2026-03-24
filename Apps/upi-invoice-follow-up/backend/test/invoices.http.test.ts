/**
 * Integration tests for the invoice HTTP API.
 * Uses createApp() + app.inject() (no real server/port). One app is shared for all tests
 * so the in-memory repo state accumulates; tests that need an invoice create one via POST first.
 */

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
      // Response echoes input and adds server-generated fields
      expect(body.amount).toBe(100);
      expect(body.description).toBe("Integration test invoice");
      expect(body.status).toBe("draft");
      expect(body.id).toBeDefined();
      expect(body.publicId).toBeDefined();
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
    });

    it("returns 422 for invalid payload", async () => {
      // Wrong type for amount (string instead of number) must yield 422 + validation error body
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
      // List contract: array of items + pagination fields
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
      // The invoice we just created should appear in the list
      const found = list.items.find((i) => i.id === created.id);
      expect(found).toBeDefined();
    });
  });

  describe("GET /api/v1/invoices/:id", () => {
    it("returns 200 with invoice when id exists", async () => {
      // Create then fetch by id; response should match created invoice
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
      // Non-existent id must return 404 and standard error shape
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
      // Create then PATCH paid; response must have status "paid"
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
      // Non-existent id must return 404 and standard error shape
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
      // Create then fetch by publicId (public-facing URL); response must match
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
      // Unknown publicId must return 404 and standard error shape
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
