import { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TasksListResponse } from "../types";
interface ListTasksOptions {
    page?: number;
    limit?: number;
    status?: "PENDING" | "COMPLETED";
    search?: string;
}
export declare class TaskService {
    createTask(userId: string, data: CreateTaskRequest): Promise<TaskResponse>;
    listTasks(userId: string, options?: ListTasksOptions): Promise<TasksListResponse>;
    getTaskById(taskId: string, userId: string): Promise<TaskResponse>;
    updateTask(taskId: string, userId: string, data: UpdateTaskRequest): Promise<TaskResponse>;
    toggleTaskStatus(taskId: string, userId: string): Promise<TaskResponse>;
    deleteTask(taskId: string, userId: string): Promise<void>;
    private taskToResponse;
}
export declare const taskService: TaskService;
export {};
//# sourceMappingURL=task.service.d.ts.map