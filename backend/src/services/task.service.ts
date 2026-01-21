import { PrismaClient } from "@prisma/client";
import { NotFound } from "../utils/errors";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TasksListResponse,
} from "../types";

const prisma = new PrismaClient();

interface ListTasksOptions {
  page?: number;
  limit?: number;
  status?: "PENDING" | "COMPLETED";
  search?: string;
}

export class TaskService {
  async createTask(
    userId: string,
    data: CreateTaskRequest
  ): Promise<TaskResponse> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        userId,
      },
    });

    return this.taskToResponse(task);
  }

  async listTasks(
    userId: string,
    options: ListTasksOptions = {}
  ): Promise<TasksListResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

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

  async getTaskById(taskId: string, userId: string): Promise<TaskResponse> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new NotFound("Task not found");
    }

    return this.taskToResponse(task);
  }

  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskRequest
  ): Promise<TaskResponse> {
    // Verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new NotFound("Task not found");
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

  async toggleTaskStatus(
    taskId: string,
    userId: string
  ): Promise<TaskResponse> {
    // Verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new NotFound("Task not found");
    }

    // Toggle status
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    return this.taskToResponse(updatedTask);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    // Verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new NotFound("Task not found");
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  private taskToResponse(task: any): TaskResponse {
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

export const taskService = new TaskService();
