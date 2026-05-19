import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    sidebarOpen: true,
    theme: 'system',
    toggleSidebar: () => set((state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }),
    setSidebarOpen: (open) => set((state) => {
      state.sidebarOpen = open;
    }),
    setTheme: (theme) => set((state) => {
      state.theme = theme;
      // Also update document class
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }),
  }))
);
