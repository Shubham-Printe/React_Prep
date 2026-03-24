import type { FastifyServerOptions } from "fastify";
import { randomUUID } from "node:crypto";

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

/**
 * Options for creating the Fastify app instance.
 * Centralizes logger, request id header, and id generation.
 */
export const fastifyOptions: FastifyServerOptions = {
  logger: true,
  requestIdHeader: "x-request-id",
  genReqId: (req) => {
    const fromHeader = normalizeRequestId(req.headers["x-request-id"]);
    return fromHeader ?? generateRequestId();
  },
};
