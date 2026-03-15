import type { FastifyInstance } from "fastify";
import { listResponse } from "../http/list-response.js";
import { parseWithSchema, zodErrorTo422 } from "../http/validate.js";
import { CreateInvoicesBodySchema } from "../schemas/invoices/create.schema.js";
import { ListInvoicesQuerySchema } from "../schemas/invoices/list.schema.js";

export default async function v1Routes(fastify: FastifyInstance) {

    fastify.get("/health", async () => ({ status: "ok" }));
    fastify.get("/ready", async () => ({ status: "ok" }));

    fastify.get("/invoices", async (request, reply) => {
        const result = parseWithSchema(ListInvoicesQuerySchema, request.query);
        if (!result.success) {
            const { statusCode, body } = zodErrorTo422(result.error, request.id);
            return reply.status(statusCode).send(body);
        }
        const { page, limit } = result.data;
        // TODO: fetch items from service/DB; for MVP stub empty list
        const items: unknown[] = [];
        const total = 0;
        return reply.status(200).send(listResponse(items, page, limit, total));
    });

    fastify.post("/invoices", async (request, reply) => {
        const result = parseWithSchema(CreateInvoicesBodySchema, request.body);
        if(!result.success){
            const { statusCode, body } = zodErrorTo422(result.error, request.id);
            return reply.status(statusCode).send(body);
        }
        const data = result.data; // typed as CreateInvoicesBodyInput
        // TODO: call business logic / service with data
        return reply.status(201).send({ id: "stub", ...data });
    });

    fastify.get("/trigger-error", async () => {
        throw new Error("trigger");
    });
}