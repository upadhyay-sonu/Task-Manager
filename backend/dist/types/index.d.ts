/// <reference types="express-serve-static-core" />
export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    userId: string;
    email: string;
    name: string;
    accessToken: string;
}
export interface AuthRefreshResponse {
    accessToken: string;
}
export interface CreateTaskRequest {
    title: string;
    description?: string;
}
export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: "PENDING" | "COMPLETED";
}
export interface TaskResponse {
    id: string;
    title: string;
    description?: string;
    status: "PENDING" | "COMPLETED";
    userId: string;
    createdAt: string;
    updatedAt: string;
}
export interface TasksListResponse {
    data: TaskResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface ErrorResponse {
    message: string;
    statusCode: number;
    timestamp: string;
}
export interface AuthenticatedRequest extends Express.Request {
    userId?: string;
    email?: string;
    headers: Record<string, string | string[] | undefined>;
    body: any;
    query: any;
    params: any;
    cookies: Record<string, string>;
}
//# sourceMappingURL=index.d.ts.map