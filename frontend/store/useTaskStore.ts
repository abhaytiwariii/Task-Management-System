import { create } from "zustand";
import { api } from "../lib/api";
import { useAuthStore } from "./useAuthStore";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  dueDate: string | null;
  labels: string[];
  assignee: string | null;
  createdAt: string;
}


interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    const userId = useAuthStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const response = await api.get(`/tasks?userId=${userId}`);
      set({ tasks: response.data });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (data) => {
    const userId = useAuthStore.getState().userId;
    if (!userId) return;

    try {
      const response = await api.post("/tasks", { ...data, userId });
      set((state) => ({ tasks: [response.data, ...state.tasks] }));
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.patch(`/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      }));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  },

  updateTaskStatus: async (id, newStatus) => {
    // 1. Snapshot previous state for rollback
    const previousTasks = get().tasks;
    
    // 2. Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    }));

    // 3. API Call
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
      // 4. Revert on error
      set({ tasks: previousTasks });
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  },
}));
