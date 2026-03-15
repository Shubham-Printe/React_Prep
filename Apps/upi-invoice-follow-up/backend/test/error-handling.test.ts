import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { ERROR_CODES } from "../src/errors/error-response.js";

describe("404 not found", () => {
  it("returns 404 with error shape and no stack/internal details", async () => {
    const app = await createApp();
    const res = await app.inject({ method: "GET", url: "/api/v1/nonexistent" });

    expect(res.statusCode).toBe(404);

    const body = res.json() as { error: { code: string; message: string; requestId: string } };
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(body.error.message).toBe("Route not found");
    expect(body.error.requestId).toBeDefined();
    expect(body.error.requestId).toBe(res.headers["x-request-id"]);

    expect(body.error).not.toHaveProperty("stack");
    expect(Object.keys(body.error)).toEqual(["code", "message", "requestId"]);

    await app.close();
  });
});

describe("500 internal error", () => {
  it("returns 500 with error shape, generic message, and no stack in body", async () => {
    const app = await createApp();
    const res = await app.inject({ method: "GET", url: "/api/v1/trigger-error" });

    expect(res.statusCode).toBe(500);

    const body = res.json() as { error: { code: string; message: string; requestId: string } };
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(body.error.message).toBe("An unexpected error occurred");
    expect(body.error.requestId).toBeDefined();
    expect(body.error.requestId).toBe(res.headers["x-request-id"]);

    expect(body.error).not.toHaveProperty("stack");
    expect(Object.keys(body.error)).toEqual(["code", "message", "requestId"]);

    expect(res.headers["cache-control"]).toBe("no-store");

    await app.close();
  });
});
