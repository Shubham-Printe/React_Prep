import { z } from "zod";

export const CreateInvoicesBodySchema = z.object({
    amount: z.number().positive(),
    description: z.string().trim().min(1).max(500),
    dueDate: z.iso.datetime().optional(),
});

export type CreateInvoicesBodyInput = z.infer<typeof CreateInvoicesBodySchema>;