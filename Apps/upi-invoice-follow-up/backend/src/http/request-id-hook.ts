import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * onRequest hook: record start time and echo x-request-id to the client.
 * Use with app.addHook("onRequest", requestIdHook).
 */
export async function requestIdHook(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  request.startAt = Date.now();
  reply.header("x-request-id", request.id);
}
