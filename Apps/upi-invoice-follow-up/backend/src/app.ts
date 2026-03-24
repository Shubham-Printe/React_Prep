/// <reference path="./types/fastify.ts" />
/**
 * App factory: builds the Fastify instance and wires config, hooks, handlers, and routes.
 * See backend/README.md for what each folder under src/ contains.
 */
import Fastify from "fastify";
import { fastifyOptions } from "./config/fastify.js";
import { globalErrorHandler } from "./http/global-error-handler.js";
import { notFoundHandler } from "./http/not-found-handler.js";
import { requestIdHook } from "./http/request-id-hook.js";
import { responseLogHook } from "./http/response-log-hook.js";
import v1Routes from "./routes/v1.js";

export const createApp = async () => {
  // Create app with shared options (logger, request id header, id generation)
  const app = Fastify(fastifyOptions);

  // Run on every request: set start time, echo x-request-id to client
  app.addHook("onRequest", requestIdHook);
  // Run after every response: log request id, method, path, status, duration
  app.addHook("onResponse", responseLogHook);

  // No matching route: log and return 404 JSON
  app.setNotFoundHandler(notFoundHandler);
  // Uncaught errors: log and return 500 JSON
  app.setErrorHandler(globalErrorHandler);

  // Mount API v1 routes under /api/v1 (e.g. /api/v1/invoices)
  await app.register(v1Routes, { prefix: "/api/v1" });

  return app;
};