import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { Unauthorized } from "../utils/errors";
import { authService } from "../services/auth.service";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        message: "Missing or invalid authorization header",
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = await authService.verifyAccessToken(token);

    // Attach user info to request
    req.userId = decoded.userId;
    req.email = decoded.email;

    next();
  } catch (error) {
    const statusCode = error instanceof Unauthorized ? 401 : 401;
    const message =
      error instanceof Unauthorized ? error.message : "Authentication failed";

    res.status(statusCode).json({
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }
};
