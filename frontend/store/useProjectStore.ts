import { create } from "zustand";
import { api } from "../lib/api";
import { useAuthStore } from "./useAuthStore";

export interface Project {
  id: string;
  name: string;
  priority: string | null;
  lead: string | null;
  dueDate: string | null;
  createdAt: string;
  _count?: {
    tasks: number;
  };
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (data: { name: string; priority?: string; lead?: string; dueDate?: string }) => Promise<Project | undefined>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  isLoading: false,

  fetchProjects: async () => {
    const userId = useAuthStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const response = await api.get(`/projects?userId=${userId}`);
      set({ projects: response.data });
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addProject: async (data) => {
    const userId = useAuthStore.getState().userId;
    if (!userId) return;

    try {
      const response = await api.post("/projects", { ...data, userId });
      set((state) => ({ projects: [response.data, ...state.projects] }));
      return response.data;
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  },

  deleteProject: async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  },
}));
