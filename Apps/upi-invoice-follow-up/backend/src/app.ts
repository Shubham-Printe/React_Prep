/// <reference path="./types/fastify.ts" />
import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import { ERROR_CODES, errorResponse } from "./errors/error-response.js";
import v1Routes from "./routes/v1.js";


function normalizeRequestId(raw: unknown): string | null {
    if (typeof raw !== "string") return null;
  
    const value = raw.trim();
    if (value.length < 8 || value.length > 128) return null;
    if (!/^[a-zA-Z0-9._-]+$/.test(value)) return null;
  
    return value;
}

function generateRequestId(): string {
    return randomUUID();
}


export const createApp = async () => {
  const app = Fastify({
    logger: true,
    // Reads inbound request id from this header (if present)
    requestIdHeader: "x-request-id",
    // Single source of truth becomes `request.id`
    genReqId: (req) => {
      // check if the request id is availabel and valid
      const fromHeader = normalizeRequestId(req.headers["x-request-id"]);
      // if the request id is not availabel or valid, generate a new one
      return fromHeader ?? generateRequestId();
    },
  });

  // Always echo request id back to the client and record start time for duration
  app.addHook("onRequest", async (request, reply) => {
    request.startAt = Date.now();
    reply.header("x-request-id", request.id);
  });

  app.addHook("onResponse", async (request, reply) => {
    // log the request id, method, path, status, duration
    app.log.info({
      requestId: request.id,
      method: request.method,
      path: request.url,
      status: reply.statusCode,
      duration: request.startAt != null ? Date.now() - request.startAt : 0,
    });
  })

  // Register a not-found handler
  app.setNotFoundHandler((request, reply) => {
    request.log.info({
      requestId: request.id,
      method: request.method,
      url: request.url
    }, "route not found");

    const r = errorResponse(ERROR_CODES.NOT_FOUND, "Route not found", request.id);
    reply.status(r.statusCode).send(r.body);
  })

  // Register a global error handler
  app.setErrorHandler((error, request, reply) => {
    // log the request id, method, path, status, duration
    request.log.error(
      { err: error, requestId: request.id, method: request.method, url: request.url },
      "request error"
    );

    const r = errorResponse(ERROR_CODES.INTERNAL_ERROR, "An unexpected error occurred", request.id);

    reply
      .header("Cache-Control", "no-store")
      .status(r.statusCode)
      .send(r.body);
  })

  await app.register(v1Routes, { prefix: "/api/v1" });

  return app;
};