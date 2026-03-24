import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ERROR_CODES, errorResponse } from "../errors/error-response.js";

/**
 * Global Fastify error handler. Logs the error and returns a 500 JSON body.
 * Use with app.setErrorHandler(globalErrorHandler).
 */
export function globalErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error(
    {
      err: error,
      requestId: request.id,
      method: request.method,
      url: request.url,
    },
    "request error"
  );

  const r = errorResponse(
    ERROR_CODES.INTERNAL_ERROR,
    "An unexpected error occurred",
    request.id
  );

  reply
    .header("Cache-Control", "no-store")
    .status(r.statusCode)
    .send(r.body);
}
