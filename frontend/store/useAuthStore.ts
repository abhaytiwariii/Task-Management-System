import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

interface AuthState {
  userId: string | null;
  isHydrated: boolean;
  setHydrated: () => void;
  initializeGuest: () => Promise<void>;
  setUserId: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      setUserId: (id: string) => set({ userId: id }),
      logout: () => set({ userId: null }),
      initializeGuest: async () => {
        if (get().userId) return; // Already logged in

        try {
          const response = await api.post("/auth/guest");
          set({ userId: response.data.id });
        } catch (error) {
          console.error("Failed to create guest user:", error);
        }
      },
    }),
    {
      name: "guest-auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated();
      },
    }
  )
);

