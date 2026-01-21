"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All task routes require authentication
router.use(auth_middleware_1.authMiddleware);
router.post("/", (req, res, next) => task_controller_1.taskController.createTask(req, res).catch(next));
router.get("/", (req, res, next) => task_controller_1.taskController.listTasks(req, res).catch(next));
router.get("/:id", (req, res, next) => task_controller_1.taskController.getTask(req, res).catch(next));
router.patch("/:id", (req, res, next) => task_controller_1.taskController.updateTask(req, res).catch(next));
router.patch("/:id/toggle", (req, res, next) => task_controller_1.taskController.toggleTask(req, res).catch(next));
router.delete("/:id", (req, res, next) => task_controller_1.taskController.deleteTask(req, res).catch(next));
exports.default = router;
//# sourceMappingURL=task.routes.js.map