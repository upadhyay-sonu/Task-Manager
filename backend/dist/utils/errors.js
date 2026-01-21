"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.Conflict = exports.NotFound = exports.Unauthorized = exports.BadRequest = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "ApiError";
    }
}
exports.ApiError = ApiError;
class BadRequest extends ApiError {
    constructor(message, details) {
        super(400, message, details);
        this.name = "BadRequest";
    }
}
exports.BadRequest = BadRequest;
class Unauthorized extends ApiError {
    constructor(message = "Unauthorized", details) {
        super(401, message, details);
        this.name = "Unauthorized";
    }
}
exports.Unauthorized = Unauthorized;
class NotFound extends ApiError {
    constructor(message, details) {
        super(404, message, details);
        this.name = "NotFound";
    }
}
exports.NotFound = NotFound;
class Conflict extends ApiError {
    constructor(message, details) {
        super(409, message, details);
        this.name = "Conflict";
    }
}
exports.Conflict = Conflict;
class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error", details) {
        super(500, message, details);
        this.name = "InternalServerError";
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=errors.js.map