// lib/localStorage.ts
import { Workspace } from "@/redux/features/auth/authTypes";

export const STORAGE_KEYS = {
  CURRENT_WORKSPACE: "currentWorkspace",
  AUTH_TOKEN: "authToken", // if you're storing tokens
} as const;

export const storage = {
  setCurrentWorkspace: (workspace: Workspace) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_WORKSPACE,
        JSON.stringify(workspace)
      );
    } catch (error) {
      console.error("Failed to save workspace to localStorage:", error);
    }
  },

  getCurrentWorkspace: (): Workspace | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKSPACE);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to get workspace from localStorage:", error);
      return null;
    }
  },

  clearCurrentWorkspace: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKSPACE);
    } catch (error) {
      console.error("Failed to clear workspace from localStorage:", error);
    }
  },

  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },
};
