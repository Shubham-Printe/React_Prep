import { z } from "zod";

export const InvoiceIdParamsSchema = z.object({
    id: z.uuid(),
});

export type InvoiceIdParamsInput = z.infer<typeof InvoiceIdParamsSchema>;