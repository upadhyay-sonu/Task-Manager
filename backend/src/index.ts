import express from "express";
import cors from "cors";
import "express-async-errors";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use((req, res, next) => {
  const cookies: Record<string, string> = {};

  if (req.headers.cookie) {
    req.headers.cookie.split("; ").forEach((cookie) => {
      const [key, value] = cookie.split("=");
      cookies[key] = decodeURIComponent(value);
    });
  }

  req.cookies = cookies;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Public health check routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "task-manager-backend",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(
    `Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`
  );
});
