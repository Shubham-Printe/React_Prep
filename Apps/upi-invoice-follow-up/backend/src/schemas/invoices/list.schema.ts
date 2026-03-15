import { z } from "zod";
import { PaginationSchema } from "../common/pagination.schema.js";


export const ListInvoicesQuerySchema = PaginationSchema.extend({
    status: z.enum(["draft", "sent", "paid"]).optional(),
});

export type ListInvoicesQueryInput = z.infer<typeof ListInvoicesQuerySchema>;