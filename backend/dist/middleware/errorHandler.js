"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (error, req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    // Log error with context
    console.error(`[${timestamp}] ${method} ${path} - Error:`, {
        name: error.name,
        message: error.message,
        code: error?.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    if (error instanceof errors_1.ApiError) {
        console.log(`[ERROR_HANDLER] ApiError (${error.statusCode}): ${error.message}`);
        const response = {
            message: error.message,
            statusCode: error.statusCode,
            timestamp,
        };
        if (error.details) {
            response.details = error.details;
        }
        res.status(error.statusCode).json(response);
    }
    else if (error instanceof SyntaxError) {
        console.log("[ERROR_HANDLER] SyntaxError: Invalid JSON");
        res.status(400).json({
            message: "Invalid JSON in request body",
            statusCode: 400,
            timestamp,
        });
    }
    else {
        // Check for Prisma-specific errors
        const prismaErrorCode = error?.code;
        let statusCode = 500;
        let message = "Internal server error";
        if (prismaErrorCode === "P2002") {
            statusCode = 409;
            message = "Unique constraint violation (likely duplicate email)";
        }
        else if (prismaErrorCode === "P2025") {
            statusCode = 404;
            message = "Record not found";
        }
        else if (prismaErrorCode === "P1000" || prismaErrorCode === "P1001") {
            statusCode = 503;
            message = "Database connection failed - ensure PostgreSQL is running";
        }
        else if (prismaErrorCode) {
            statusCode = 500;
            message = `Database error (code: ${prismaErrorCode})`;
        }
        console.log(`[ERROR_HANDLER] Unhandled error (${statusCode}):`, message, prismaErrorCode ? `Prisma code: ${prismaErrorCode}` : "");
        const responseData = {
            message,
            statusCode,
            timestamp,
        };
        if (process.env.NODE_ENV === "development") {
            responseData.error = error.message;
            responseData.code = prismaErrorCode;
        }
        res.status(statusCode).json(responseData);
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map