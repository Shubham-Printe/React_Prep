import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { ERROR_CODES } from "../src/errors/error-response.js";

describe("POST /api/v1/invoices — validation", () => {
  it("returns 201 with valid body", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/invoices",
      payload: { amount: 100, description: "Test invoice" },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json() as { id: string; amount: number; description: string };
    expect(body.id).toBeDefined();
    expect(body.amount).toBe(100);
    expect(body.description).toBe("Test invoice");

    await app.close();
  });

  it("returns 422 for invalid payload — wrong type (amount string)", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/invoices",
      payload: { amount: "not-a-number", description: "Test" },
    });

    expect(res.statusCode).toBe(422);
    const body = res.json() as {
      error: {
        code: string;
        message: string;
        requestId: string;
        details?: { path: string[]; message: string }[];
      };
    };
    expect(body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(body.error.message).toBe("Validation failed");
    expect(body.error.requestId).toBe(res.headers["x-request-id"]);
    expect(Array.isArray(body.error.details)).toBe(true);
    expect(body.error.details!.length).toBeGreaterThan(0);
    expect(body.error.details!.some((d) => d.path.includes("amount"))).toBe(true);
    expect(body.error).not.toHaveProperty("stack");

    await app.close();
  });

  it("returns 422 for invalid payload — missing required field (description)", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/invoices",
      payload: { amount: 100 },
    });

    expect(res.statusCode).toBe(422);
    const body = res.json() as {
      error: {
        code: string;
        message: string;
        requestId: string;
        details?: { path: string[]; message: string }[];
      };
    };
    expect(body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(Array.isArray(body.error.details)).toBe(true);
    expect(body.error.details!.some((d) => d.path.includes("description"))).toBe(true);

    await app.close();
  });

  it("returns 422 for invalid payload — constraint failure (amount <= 0)", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/invoices",
      payload: { amount: 0, description: "Test" },
    });

    expect(res.statusCode).toBe(422);
    const body = res.json() as {
      error: {
        code: string;
        message: string;
        requestId: string;
        details?: { path: string[]; message: string }[];
      };
    };
    expect(body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(Array.isArray(body.error.details)).toBe(true);
    expect(body.error.details!.some((d) => d.path.includes("amount"))).toBe(true);

    await app.close();
  });
});
