import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
