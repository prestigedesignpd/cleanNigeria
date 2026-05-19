import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/routes'
import { AppLoader } from '@/components/common/AppLoader'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <AppLoader />
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />

  return <>{children}</>
}
