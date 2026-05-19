import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth.service'

/** Restores auth state from persisted storage and validates token on mount */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, setUser, logout, setLoading } = useAuthStore()

  useEffect(() => {
    const validateSession = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false)
        return
      }

      try {
        const user = await authService.getCurrentUser()
        setUser(user)
      } catch (error) {
        // Token invalid or expired
        logout()
      } finally {
        setLoading(false)
      }
    }

    validateSession()
  }, [isAuthenticated, token, setUser, logout, setLoading])

  return <>{children}</>
}
