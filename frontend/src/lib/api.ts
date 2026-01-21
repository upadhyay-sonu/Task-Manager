import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add access token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Auth endpoints
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),

  logout: () => apiClient.post("/auth/logout"),

  refresh: () => apiClient.post("/auth/refresh"),
};

// Task endpoints
export const taskApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => apiClient.get("/tasks", { params }),

  create: (data: { title: string; description?: string }) =>
    apiClient.post("/tasks", data),

  get: (id: string) => apiClient.get(`/tasks/${id}`),

  update: (id: string, data: Partial<any>) =>
    apiClient.patch(`/tasks/${id}`, data),

  toggle: (id: string) => apiClient.patch(`/tasks/${id}/toggle`),

  delete: (id: string) => apiClient.delete(`/tasks/${id}`),
};

export default apiClient;
