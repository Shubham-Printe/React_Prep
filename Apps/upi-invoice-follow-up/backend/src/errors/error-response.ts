const ERROR_CODES = {
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    BAD_REQUEST: "BAD_REQUEST",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT",
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** HTTP status code for each error code. Single source of truth: use NOT_FOUND → 404, etc. */
const ERROR_CODE_TO_STATUS: Record<ErrorCode, number> = {
    [ERROR_CODES.NOT_FOUND]: 404,
    [ERROR_CODES.INTERNAL_ERROR]: 500,
    [ERROR_CODES.VALIDATION_ERROR]: 422,
    [ERROR_CODES.UNAUTHORIZED]: 401,
    [ERROR_CODES.FORBIDDEN]: 403,
    [ERROR_CODES.BAD_REQUEST]: 400,
    [ERROR_CODES.UNPROCESSABLE_ENTITY]: 422,
    [ERROR_CODES.TOO_MANY_REQUESTS]: 429,
    [ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
    [ERROR_CODES.GATEWAY_TIMEOUT]: 504,
};

/** One validation issue (safe to expose to client). Path follows Zod's issue.path. */
export interface ValidationDetail {
    path: string[];
    message: string;
}

interface ErrorPayloadBody {
    code: ErrorCode;
    message: string;
    requestId: string;
    details?: ValidationDetail[];
}

function errorPayload(
    code: ErrorCode,
    message: string,
    requestId: string,
    details?: ValidationDetail[]
): { error: ErrorPayloadBody } {
    const body: ErrorPayloadBody = { code, message, requestId };
    if (details !== undefined && details.length > 0) {
        body.details = details;
    }
    return { error: body };
}

/** Returns statusCode + body so handlers can do reply.status(r.statusCode).send(r.body). */
function errorResponse(
    code: ErrorCode,
    message: string,
    requestId: string,
    details?: ValidationDetail[]
): { statusCode: number; body: { error: ErrorPayloadBody } } {
    return {
        statusCode: ERROR_CODE_TO_STATUS[code],
        body: errorPayload(code, message, requestId, details),
    };
}

export { ERROR_CODES, ERROR_CODE_TO_STATUS, errorPayload, errorResponse };