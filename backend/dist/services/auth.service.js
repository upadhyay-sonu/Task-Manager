"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
class AuthService {
    async register(data) {
        try {
            console.log("[AUTH_SERVICE] Register: Checking for existing user");
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                console.log("[AUTH_SERVICE] Register: Email already exists");
                throw new errors_1.Conflict("Email already registered");
            }
            console.log("[AUTH_SERVICE] Register: Hashing password");
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
            console.log("[AUTH_SERVICE] Register: Creating user in database");
            // Create user
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                },
            });
            console.log("[AUTH_SERVICE] Register: User created successfully, generating token");
            // Generate access token
            const accessToken = this.generateAccessToken(user.id, user.email);
            return {
                userId: user.id,
                email: user.email,
                name: user.name,
                accessToken,
            };
        }
        catch (error) {
            console.error("[AUTH_SERVICE] Register error:", {
                errorType: error instanceof Error ? error.constructor.name : typeof error,
                message: error instanceof Error ? error.message : String(error),
                code: error?.code, // Prisma error code
            });
            throw error;
        }
    }
    async login(data) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new errors_1.Unauthorized("Invalid credentials");
        }
        // Compare password
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new errors_1.Unauthorized("Invalid credentials");
        }
        // Generate access token
        const accessToken = this.generateAccessToken(user.id, user.email);
        return {
            userId: user.id,
            email: user.email,
            name: user.name,
            accessToken,
        };
    }
    async createRefreshToken(userId) {
        // Delete old refresh tokens for this user (keep it clean)
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
        // Generate new refresh token
        const token = jsonwebtoken_1.default.sign({ userId }, env_1.env.JWT_REFRESH_SECRET, { expiresIn: env_1.env.JWT_REFRESH_EXPIRY });
        // Calculate expiry date
        const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        const expiresAt = new Date(Date.now() + expiresIn);
        // Store refresh token in database
        await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
        return token;
    }
    async refreshAccessToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.env.JWT_REFRESH_SECRET);
            // Check if token exists in database and is not expired
            const storedToken = await prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new errors_1.Unauthorized("Refresh token expired");
            }
            // Get user to verify they still exist
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });
            if (!user) {
                throw new errors_1.Unauthorized("User not found");
            }
            // Generate new access token
            const newAccessToken = this.generateAccessToken(user.id, user.email);
            return newAccessToken;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.Unauthorized("Invalid refresh token");
            }
            throw error;
        }
    }
    async logout(refreshToken) {
        // Delete refresh token from database
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    }
    generateAccessToken(userId, email) {
        return jsonwebtoken_1.default.sign({ userId, email }, env_1.env.JWT_ACCESS_SECRET, { expiresIn: env_1.env.JWT_ACCESS_EXPIRY });
    }
    async verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.Unauthorized("Invalid or expired token");
            }
            throw new errors_1.InternalServerError("Token verification failed");
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map