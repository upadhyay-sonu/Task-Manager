"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const validation_1 = require("../utils/validation");
class TaskController {
    async createTask(req, res) {
        (0, validation_1.validate)(req.body, validation_1.createTaskValidationRules);
        const task = await task_service_1.taskService.createTask(req.userId, req.body);
        res.status(201).json(task);
    }
    async listTasks(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const result = await task_service_1.taskService.listTasks(req.userId, {
            page,
            limit,
            status,
            search,
        });
        res.status(200).json(result);
    }
    async getTask(req, res) {
        const { id } = req.params;
        const task = await task_service_1.taskService.getTaskById(id, req.userId);
        res.status(200).json(task);
    }
    async updateTask(req, res) {
        const { id } = req.params;
        (0, validation_1.validate)(req.body, validation_1.updateTaskValidationRules);
        const task = await task_service_1.taskService.updateTask(id, req.userId, req.body);
        res.status(200).json(task);
    }
    async toggleTask(req, res) {
        const { id } = req.params;
        const task = await task_service_1.taskService.toggleTaskStatus(id, req.userId);
        res.status(200).json(task);
    }
    async deleteTask(req, res) {
        const { id } = req.params;
        await task_service_1.taskService.deleteTask(id, req.userId);
        res.status(204).send();
    }
}
exports.TaskController = TaskController;
exports.taskController = new TaskController();
//# sourceMappingURL=task.controller.js.map