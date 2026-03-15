import { z } from "zod";

export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

/**
 * Use after validating query with a schema that includes page/limit. Computes offset for DB.
 *
 * How to use:
 * 1. In a list route, parse query with a schema that has page/limit (e.g. ListInvoicesQuerySchema).
 * 2. On success, pass { page, limit } from result.data to this function.
 * 3. Use the returned { page, limit, offset } in your DB query (e.g. LIMIT limit OFFSET offset).
 *
 * @example
 *   const result = parseWithSchema(ListInvoicesQuerySchema, request.query);
 *   if (!result.success) { ... }
 *   const { page, limit, offset } = toPaginationInput(result.data);
 *   const items = await db.findMany({ take: limit, skip: offset });
 *   return listResponse(items, page, limit, total);
 */
export function toPaginationInput(params: { page: number; limit: number }) {
    const { page, limit } = params;
    return { page, limit, offset: (page - 1) * limit };
}