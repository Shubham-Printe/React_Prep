import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("GET /api/v1/ready", () => {
    it("returns OK", async () => {
        const app = await createApp();
        const res = await app.inject({ method: "GET", url: "/api/v1/ready" });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({ status: "ok" });
        expect(res.headers["x-request-id"]).toBeDefined();

        await app.close();
    });

    it("echoes valid x-request-id when provided", async () => {
        const app = await createApp();
        const res = await app.inject({
            method: "GET",
            url: "/api/v1/ready",
            headers: { "x-request-id": "req_12345678" },
        });

        expect(res.statusCode).toBe(200);
        expect(res.headers["x-request-id"]).toBe("req_12345678");

        await app.close();
    });
});