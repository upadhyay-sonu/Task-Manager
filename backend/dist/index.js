"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
// Parse cookies
app.use((req, res, next) => {
    const cookies = {};
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
app.use("/auth", auth_routes_1.default);
app.use("/tasks", task_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
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
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on http://localhost:${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
});
//# sourceMappingURL=index.js.map