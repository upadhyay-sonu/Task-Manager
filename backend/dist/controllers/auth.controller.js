"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const validation_1 = require("../utils/validation");
class AuthController {
    async register(req, res) {
        try {
            console.log("[REGISTER] Request received:", {
                email: req.body.email,
                name: req.body.name,
                passwordLength: req.body.password?.length,
            });
            // Validate input
            (0, validation_1.validate)(req.body, validation_1.registerValidationRules);
            console.log("[REGISTER] Validation passed");
            // Register user
            const result = await auth_service_1.authService.register(req.body);
            console.log("[REGISTER] User created:", { userId: result.userId, email: result.email });
            // Create refresh token
            const refreshToken = await auth_service_1.authService.createRefreshToken(result.userId);
            console.log("[REGISTER] Refresh token created");
            // Set refresh token as HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(201).json({
                userId: result.userId,
                email: result.email,
                name: result.name,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            console.error("[REGISTER] Error:", error instanceof Error ? error.message : String(error));
            throw error; // Pass to Express error handler
        }
    }
    async login(req, res) {
        try {
            console.log("[LOGIN] Request received:", { email: req.body.email });
            (0, validation_1.validate)(req.body, validation_1.loginValidationRules);
            console.log("[LOGIN] Validation passed");
            const result = await auth_service_1.authService.login(req.body);
            console.log("[LOGIN] User authenticated:", { userId: result.userId });
            const refreshToken = await auth_service_1.authService.createRefreshToken(result.userId);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                userId: result.userId,
                email: result.email,
                name: result.name,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            console.error("[LOGIN] Error:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
    async refresh(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({
                message: "Refresh token not found",
                statusCode: 401,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        const newAccessToken = await auth_service_1.authService.refreshAccessToken(refreshToken);
        res.status(200).json({
            accessToken: newAccessToken,
        });
    }
    async logout(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await auth_service_1.authService.logout(refreshToken);
        }
        // Clear cookie
        res.clearCookie("refreshToken");
        res.status(200).json({
            message: "Logged out successfully",
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map