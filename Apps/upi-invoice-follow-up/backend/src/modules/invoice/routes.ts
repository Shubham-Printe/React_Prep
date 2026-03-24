import type { FastifyInstance } from "fastify";
import { listResponse } from "../../http/list-response.js";
import { parseWithSchema, zodErrorTo422 } from "../../http/validate.js";
import { CreateInvoicesBodySchema } from "../../schemas/invoices/create.schema.js";
import { ListInvoicesQuerySchema } from "../../schemas/invoices/list.schema.js";
import type { InvoiceService } from "./service.js";
import { InvoiceIdParamsSchema } from "../../schemas/invoices/get-by-id.schema.js";
import { GetByPublicIdParamsSchema } from "../../schemas/invoices/get-by-public-id.schema.js";
import { errorResponse, ERROR_CODES } from "../../errors/error-response.js";

export interface InvoiceRouteOptions {
  invoiceService: InvoiceService;
}

export default async function invoiceRoutes(
  fastify: FastifyInstance,
  opts: InvoiceRouteOptions
) {
  const { invoiceService } = opts;

  fastify.get("/invoices", async (request, reply) => {
    const result = parseWithSchema(ListInvoicesQuerySchema, request.query);
    if (!result.success) {
      const { statusCode, body } = zodErrorTo422(result.error, request.id);
      return reply.status(statusCode).send(body);
    }
    const { page, limit, status } = result.data;
    const { items, total } = await invoiceService.list({
      page,
      limit,
      ...(status !== undefined && { status }),
    });
    return reply.status(200).send(listResponse(items, page, limit, total));
  });


  fastify.post("/invoices", async (request, reply) => {
    const result = parseWithSchema(CreateInvoicesBodySchema, request.body);
    if (!result.success) {
      const { statusCode, body } = zodErrorTo422(result.error, request.id);
      return reply.status(statusCode).send(body);
    }
    const { amount, description, dueDate } = result.data;
    const invoice = await invoiceService.create({
      amount,
      description,
      ...(dueDate !== undefined && { dueDate }),
    });
    return reply.status(201).send(invoice);
  });

  fastify.get("/invoices/:id", async (request, reply) => {
    const result = parseWithSchema(InvoiceIdParamsSchema, request.params);

    if(!result.success){
      const { statusCode, body } = zodErrorTo422(result.error, request.id);
      return reply.status(statusCode).send(body);
    }

    const { id } = result.data;
    const invoice = await invoiceService.getById(id);
    if(!invoice){
      const r = errorResponse(ERROR_CODES.NOT_FOUND, "Invoice not found", request.id);
      return reply.status(r.statusCode).send(r.body);
    }
    return reply.status(200).send(invoice);
  });

  fastify.patch("/invoices/:id/paid", async (request, reply) => {
    const result = parseWithSchema(InvoiceIdParamsSchema, request.params);

    if(!result.success){
      const { statusCode, body } = zodErrorTo422(result.error, request.id);
      return reply.status(statusCode).send(body);
    }

    const { id } = result.data;
    const invoice = await invoiceService.markPaid(id);
    if(!invoice){
      const r = errorResponse(ERROR_CODES.NOT_FOUND, "Invoice not found", request.id);
      return reply.status(r.statusCode).send(r.body);
    }
    return reply.status(200).send(invoice);
  });

  fastify.get("/public/invoices/:publicId", async (request, reply) => {
    const result = parseWithSchema(GetByPublicIdParamsSchema, request.params);

    if(!result.success){
      const { statusCode, body } = zodErrorTo422(result.error, request.id);
      return reply.status(statusCode).send(body);
    }

    const { publicId } = result.data;
    const invoice = await invoiceService.getByPublicId(publicId);
    if (!invoice) {
      const r = errorResponse(ERROR_CODES.NOT_FOUND, "Invoice not found", request.id);
      return reply.status(r.statusCode).send(r.body);
    }
    return reply.status(200).send(invoice);
  });
}
