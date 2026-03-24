import { z } from "zod";

export const GetByPublicIdParamsSchema = z.object({
  publicId: z.string().min(1),
});

export type GetByPublicIdParamsInput = z.infer<typeof GetByPublicIdParamsSchema>;
