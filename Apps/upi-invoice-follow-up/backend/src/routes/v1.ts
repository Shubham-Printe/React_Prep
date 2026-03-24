import type { FastifyInstance } from "fastify";
import { registerInvoice } from "../modules/invoice/register.js";

export default async function v1Routes(fastify: FastifyInstance) {
  fastify.get("/health", async () => ({ status: "ok" }));
  fastify.get("/ready", async () => ({ status: "ok" }));
  fastify.get("/trigger-error", async () => {
    throw new Error("trigger");
  });

  await registerInvoice(fastify);
}