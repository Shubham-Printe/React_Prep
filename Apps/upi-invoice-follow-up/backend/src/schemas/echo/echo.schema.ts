import { z } from "zod";

export const EchoBodySchema = z.object({
    message: z.string().max(100).optional(),
});

export type EchoBodyInput = z.infer<typeof EchoBodySchema>;
