import { Response } from "express";
import { taskService } from "../services/task.service";
import { AuthenticatedRequest } from "../types";
import {
  validate,
  createTaskValidationRules,
  updateTaskValidationRules,
} from "../utils/validation";

export class TaskController {
  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    validate(req.body, createTaskValidationRules);

    const task = await taskService.createTask(req.userId!, req.body);

    res.status(201).json(task);
  }

  async listTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as "PENDING" | "COMPLETED" | undefined;
    const search = req.query.search as string | undefined;

    const result = await taskService.listTasks(req.userId!, {
      page,
      limit,
      status,
      search,
    });

    res.status(200).json(result);
  }

  async getTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const task = await taskService.getTaskById(id, req.userId!);

    res.status(200).json(task);
  }

  async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;

    validate(req.body, updateTaskValidationRules);

    const task = await taskService.updateTask(id, req.userId!, req.body);

    res.status(200).json(task);
  }

  async toggleTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const task = await taskService.toggleTaskStatus(id, req.userId!);

    res.status(200).json(task);
  }

  async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;

    await taskService.deleteTask(id, req.userId!);

    res.status(204).send();
  }
}

export const taskController = new TaskController();
