import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Support Agent';
  avatar?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<AdminUser>) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user, token) => set((state) => {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }),
      logout: () => set((state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }),
      updateUser: (data) => set((state) => {
        if (state.user) {
          state.user = { ...state.user, ...data };
        }
      }),
    })),
    {
      name: 'cleannigeria-admin-auth',
    }
  )
);
