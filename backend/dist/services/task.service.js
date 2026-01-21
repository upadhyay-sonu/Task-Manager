"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
class TaskService {
    async createTask(userId, data) {
        const task = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description || null,
                userId,
            },
        });
        return this.taskToResponse(task);
    }
    async listTasks(userId, options = {}) {
        const page = Math.max(1, options.page || 1);
        const limit = Math.min(100, Math.max(1, options.limit || 10));
        const skip = (page - 1) * limit;
        // Build where clause
        const where = { userId };
        if (options.status) {
            where.status = options.status;
        }
        if (options.search) {
            where.title = {
                contains: options.search,
                mode: "insensitive",
            };
        }
        // Get paginated tasks
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.task.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: tasks.map((task) => this.taskToResponse(task)),
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
    async getTaskById(taskId, userId) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task || task.userId !== userId) {
            throw new errors_1.NotFound("Task not found");
        }
        return this.taskToResponse(task);
    }
    async updateTask(taskId, userId, data) {
        // Verify task exists and belongs to user
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task || task.userId !== userId) {
            throw new errors_1.NotFound("Task not found");
        }
        // Update task
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.status !== undefined && { status: data.status }),
            },
        });
        return this.taskToResponse(updatedTask);
    }
    async toggleTaskStatus(taskId, userId) {
        // Verify task exists and belongs to user
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task || task.userId !== userId) {
            throw new errors_1.NotFound("Task not found");
        }
        // Toggle status
        const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status: newStatus },
        });
        return this.taskToResponse(updatedTask);
    }
    async deleteTask(taskId, userId) {
        // Verify task exists and belongs to user
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task || task.userId !== userId) {
            throw new errors_1.NotFound("Task not found");
        }
        // Delete task
        await prisma.task.delete({
            where: { id: taskId },
        });
    }
    taskToResponse(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description || undefined,
            status: task.status,
            userId: task.userId,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
        };
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
//# sourceMappingURL=task.service.js.map