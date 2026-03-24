import type { FastifyReply, FastifyRequest } from "fastify";
import { ERROR_CODES, errorResponse } from "../errors/error-response.js";

/**
 * Fastify not-found handler. Logs the request and returns 404 JSON body.
 * Use with app.setNotFoundHandler(notFoundHandler).
 */
export function notFoundHandler(
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.info(
    {
      requestId: request.id,
      method: request.method,
      url: request.url,
    },
    "route not found"
  );

  const r = errorResponse(ERROR_CODES.NOT_FOUND, "Route not found", request.id);
  reply.status(r.statusCode).send(r.body);
}
