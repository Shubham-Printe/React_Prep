import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * onResponse hook: log request id, method, path, status, and duration.
 * Use with app.addHook("onResponse", responseLogHook).
 */
export async function responseLogHook(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  request.log.info({
    requestId: request.id,
    method: request.method,
    path: request.url,
    status: reply.statusCode,
    duration: request.startAt != null ? Date.now() - request.startAt : 0,
  });
}
