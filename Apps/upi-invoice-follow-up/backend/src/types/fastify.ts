/**
 * Augment FastifyRequest with request timing (set in onRequest, read in onResponse).
 */
declare module "fastify" {
  interface FastifyRequest {
    startAt?: number;
  }
}

export {};
