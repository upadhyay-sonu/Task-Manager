import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";
import {
  BadRequest,
  Unauthorized,
  Conflict,
  InternalServerError,
} from "../utils/errors";
import { JwtPayload, RegisterRequest, LoginRequest } from "../types";

const prisma = new PrismaClient();

export class AuthService {
  async register(data: RegisterRequest): Promise<{
    userId: string;
    email: string;
    name: string;
    accessToken: string;
  }> {
    try {
      console.log("[AUTH_SERVICE] Register: Checking for existing user");

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        console.log("[AUTH_SERVICE] Register: Email already exists");
        throw new Conflict("Email already registered");
      }

      console.log("[AUTH_SERVICE] Register: Hashing password");
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

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
    } catch (error) {
      console.error("[AUTH_SERVICE] Register error:", {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        code: (error as any)?.code, // Prisma error code
      });
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<{
    userId: string;
    email: string;
    name: string;
    accessToken: string;
  }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Unauthorized("Invalid credentials");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Unauthorized("Invalid credentials");
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

  async createRefreshToken(userId: string): Promise<string> {
    // Delete old refresh tokens for this user (keep it clean)
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // Generate new refresh token
    const token = jwt.sign(
      { userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY }
    );

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

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as JwtPayload;

      // Check if token exists in database and is not expired
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Unauthorized("Refresh token expired");
      }

      // Get user to verify they still exist
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Unauthorized("User not found");
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user.id, user.email);

      return newAccessToken;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Unauthorized("Invalid refresh token");
      }
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY }
    );
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
      ) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Unauthorized("Invalid or expired token");
      }
      throw new InternalServerError("Token verification failed");
    }
  }
}

export const authService = new AuthService();
