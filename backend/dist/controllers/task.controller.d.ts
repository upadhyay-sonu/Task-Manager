import { Response } from "express";
import { AuthenticatedRequest } from "../types";
export declare class TaskController {
    createTask(req: AuthenticatedRequest, res: Response): Promise<void>;
    listTasks(req: AuthenticatedRequest, res: Response): Promise<void>;
    getTask(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateTask(req: AuthenticatedRequest, res: Response): Promise<void>;
    toggleTask(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteTask(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export declare const taskController: TaskController;
//# sourceMappingURL=task.controller.d.ts.map