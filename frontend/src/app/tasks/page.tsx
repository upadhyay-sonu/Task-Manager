"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TaskCard, TaskModal, Button, useToast } from "@/components";
import { taskApi, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useTaskStore } from "@/store/tasks";
import { Task } from "@/types";
import { Plus, LogOut } from "lucide-react";

export default function TasksPage() {
    const router = useRouter();
    const toast = useToast();

    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const tasks = useTaskStore((state) => state.tasks);
    const pagination = useTaskStore((state) => state.pagination);
    const setTasks = useTaskStore((state) => state.setTasks);
    const setPagination = useTaskStore((state) => state.setPagination);
    const addTask = useTaskStore((state) => state.addTask);
    const updateTask = useTaskStore((state) => state.updateTask);
    const removeTask = useTaskStore((state) => state.removeTask);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<"PENDING" | "COMPLETED" | undefined>();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydration fix: Mark when client is ready
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Check authentication
    useEffect(() => {
        if (!user && isHydrated) {
            router.push("/login");
        }
    }, [user, router, isHydrated]);

    // Load tasks
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setIsLoading(true);
                const response = await taskApi.list({
                    page: currentPage,
                    status,
                    search: search || undefined,
                });

                setTasks(response.data.data);
                setPagination(response.data.pagination);

                // Clear error state and dismiss error toast on successful load
                toast.dismiss("load-tasks-error");
            } catch (error: any) {
                const message = error.response?.data?.message || "Failed to load tasks";
                // Use toast ID to prevent duplicate errors
                toast.error(message, { id: "load-tasks-error" });
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadTasks();
        }
        // Remove unstable dependencies: only watch actual state changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, status, search, user, setTasks, setPagination]);

    const handleCreateTask = async (data: {
        title: string;
        description?: string;
    }) => {
        try {
            const response = await taskApi.create(data);
            addTask(response.data);
            // Explicitly dismiss error and show success
            toast.dismiss("create-task-error");
            toast.success("Task created successfully", { id: "create-task-success" });
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to create task";
            toast.error(message, { id: "create-task-error" });
            throw error;
        }
    };

    const handleUpdateTask = async (data: {
        title: string;
        description?: string;
    }) => {
        if (!selectedTask) return;

        try {
            const response = await taskApi.update(selectedTask.id, data);
            updateTask(response.data);
            // Explicitly dismiss error and show success
            toast.dismiss("update-task-error");
            toast.success("Task updated successfully", { id: "update-task-success" });
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to update task";
            toast.error(message, { id: "update-task-error" });
            throw error;
        }
    };

    const handleToggleTask = async (taskId: string) => {
        try {
            const response = await taskApi.toggle(taskId);
            updateTask(response.data);
            // Explicitly dismiss error and show success
            toast.dismiss("toggle-task-error");
            toast.success("Task status updated", { id: "toggle-task-success" });
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to update task";
            toast.error(message, { id: "toggle-task-error" });
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await taskApi.delete(taskId);
            removeTask(taskId);
            // Explicitly dismiss error and show success
            toast.dismiss("delete-task-error");
            toast.success("Task deleted successfully", { id: "delete-task-success" });
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to delete task";
            toast.error(message, { id: "delete-task-error" });
        }
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            clearAuth();
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const openModal = (task?: Task, isEditMode: boolean = false) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(undefined);
    };

    const viewTask = (task: Task) => {
        openModal(task, false);
    };

    const editTask = (task: Task) => {
        openModal(task, true);
    };

    // Show loading state while hydrating or if not authenticated
    if (!isHydrated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <div className="w-8 h-8 border-4 border-dark-600 border-t-primary-500 rounded-full" />
                    </div>
                    <p className="mt-4 text-dark-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Decorative background */}
            <div className="fixed top-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl -z-10" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">TaskFlow</h1>
                        <p className="text-dark-500">
                            Welcome back,{" "}
                            <span className="text-primary-300">{user.name}</span>
                        </p>
                    </div>

                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-dark-700 border border-dark-600 text-white rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 placeholder:text-dark-500"
                    />

                    <select
                        value={status || ""}
                        onChange={(e) => {
                            setStatus(
                                (e.target.value as "PENDING" | "COMPLETED" | undefined) ||
                                undefined,
                            );
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-dark-700 border border-dark-600 text-white rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    <Button
                        variant="primary"
                        onClick={() => openModal()}
                        className="gap-2 justify-center md:col-span-1"
                    >
                        <Plus className="w-4 h-4" />
                        New Task
                    </Button>
                </div>

                {/* Tasks List */}
                <div className="space-y-4 mb-8">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin">
                                <div className="w-8 h-8 border-4 border-dark-600 border-t-primary-500 rounded-full" />
                            </div>
                            <p className="mt-4 text-dark-500">Loading tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-12 bg-dark-700 rounded-xl border border-dark-600">
                            <p className="text-dark-500 mb-4">No tasks yet</p>
                            <Button
                                variant="primary"
                                onClick={() => openModal()}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create your first task
                            </Button>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onClick={viewTask}
                                onEdit={editTask}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="px-4 py-2 text-dark-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                            }
                            disabled={currentPage === pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                task={selectedTask}
                onClose={closeModal}
                onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
            />
        </div>
    );
}
