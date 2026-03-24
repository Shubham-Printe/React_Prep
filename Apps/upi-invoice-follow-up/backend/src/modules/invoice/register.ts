import type { FastifyInstance } from "fastify";
import invoiceRoutes from "./routes.js";
import { createInvoiceRepoMemory } from "./repo-memory.js";
import { createInvoiceService } from "./service.js";

/**
 * Registers the invoice feature on the given scope (e.g. v1): creates repo + service
 * and mounts invoice routes. No prefix — the caller (v1) owns the version path.
 */
export async function registerInvoice(scope: FastifyInstance): Promise<void> {
  const repo = createInvoiceRepoMemory();
  const invoiceService = createInvoiceService({ repo });
  await scope.register(invoiceRoutes, { invoiceService });
}
