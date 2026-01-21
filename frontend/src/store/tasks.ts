import { create } from 'zustand';
import { TaskState, Task } from '@/types';

interface ExtendedTaskState extends TaskState {
  error: string | null;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<ExtendedTaskState>((set) => ({
  tasks: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  error: null,

  setTasks: (tasks: Task[]) =>
    set({ tasks, error: null }),

  setPagination: (pagination) =>
    set({ pagination }),

  addTask: (task: Task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
      error: null,
    })),

  updateTask: (task: Task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
      error: null,
    })),

  removeTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      error: null,
    })),

  clear: () =>
    set({
      tasks: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
      error: null,
    }),

  setError: (error: string | null) =>
    set({ error }),
}));
