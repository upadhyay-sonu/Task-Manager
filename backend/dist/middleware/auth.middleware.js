"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../utils/errors");
const auth_service_1 = require("../services/auth.service");
const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader ||
            typeof authHeader !== "string" ||
            !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Missing or invalid authorization header",
                statusCode: 401,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        // Verify token
        const decoded = await auth_service_1.authService.verifyAccessToken(token);
        // Attach user info to request
        req.userId = decoded.userId;
        req.email = decoded.email;
        next();
    }
    catch (error) {
        const statusCode = error instanceof errors_1.Unauthorized ? 401 : 401;
        const message = error instanceof errors_1.Unauthorized ? error.message : "Authentication failed";
        res.status(statusCode).json({
            message,
            statusCode,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map