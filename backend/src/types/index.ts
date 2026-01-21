// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Auth Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response Types
export interface AuthResponse {
  userId: string;
  email: string;
  name: string;
  accessToken: string;
}

export interface AuthRefreshResponse {
  accessToken: string;
}

// Task Types
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

// Error Response
export interface ErrorResponse {
  message: string;
  statusCode: number;
  timestamp: string;
}

// Authenticated Request
export interface AuthenticatedRequest extends Express.Request {
  userId?: string;
  email?: string;
  headers: Record<string, string | string[] | undefined>;
  body: any;
  query: any;
  params: any;
  cookies: Record<string, string>;
}
