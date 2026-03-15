import type { ZodError, z } from "zod";
import { ERROR_CODES, errorResponse } from "../errors/error-response.js";
import type { ValidationDetail } from "../errors/error-response.js";


export function parseWithSchema<T>(
    schema: z.ZodType<T>,
    input: unknown
): { success: true; data: T; } | { success: false; error: z.ZodError; } {
    const result = schema.safeParse(input);
    if(result.success) {
        return { success: true, data: result.data };
    }

    return { success: false, error: result.error };
}

export function zodErrorTo422( error: ZodError, requestId: string): { statusCode: number, body: { error: { code: string, message: string; requestId: string; details?: ValidationDetail[] }}} {
    
    const details: ValidationDetail[] = error.issues.map((issue) => (
        {
            path: issue.path.map(String),
            message: issue.message,
        }
    ));

    const r = errorResponse(ERROR_CODES.VALIDATION_ERROR, "Validation failed", requestId, details);
    return { statusCode: r.statusCode, body: r.body };
}