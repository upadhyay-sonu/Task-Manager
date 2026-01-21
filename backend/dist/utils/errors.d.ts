export declare class ApiError extends Error {
    statusCode: number;
    details?: unknown;
    constructor(statusCode: number, message: string, details?: unknown);
}
export declare class BadRequest extends ApiError {
    constructor(message: string, details?: unknown);
}
export declare class Unauthorized extends ApiError {
    constructor(message?: string, details?: unknown);
}
export declare class NotFound extends ApiError {
    constructor(message: string, details?: unknown);
}
export declare class Conflict extends ApiError {
    constructor(message: string, details?: unknown);
}
export declare class InternalServerError extends ApiError {
    constructor(message?: string, details?: unknown);
}
//# sourceMappingURL=errors.d.ts.map