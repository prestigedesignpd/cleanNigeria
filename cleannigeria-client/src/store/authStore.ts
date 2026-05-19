import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { AuthUser, AuthTokens } from '@/types/auth.types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setAuth: (user: AuthUser, tokens: AuthTokens) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, tokens) =>
        set((state) => {
          state.user = user
          state.token = tokens.accessToken
          state.refreshToken = tokens.refreshToken
          state.isAuthenticated = true
        }),

      setUser: (user) =>
        set((state) => {
          state.user = user
        }),

      logout: () =>
        set((state) => {
          state.user = null
          state.token = null
          state.refreshToken = null
          state.isAuthenticated = false
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),
    })),
    {
      name: 'cleannigeria-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
