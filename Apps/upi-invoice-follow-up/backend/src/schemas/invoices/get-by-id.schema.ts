import { z } from "zod";

export const InvoiceIdParamsSchema = z.object({
    id: z.string().min(1),
});

export type InvoiceIdParamsInput = z.infer<typeof InvoiceIdParamsSchema>;