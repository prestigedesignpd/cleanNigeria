import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAdminAuthStore } from '@/store/adminAuthStore'

export function useAdminAuth() {
  const loginAction = useAdminAuthStore((state) => state.login)
  const logoutAction = useAdminAuthStore((state) => state.logout)

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await api.post('/admin/auth/login', credentials)
      return res.data.data
    },
    onSuccess: (data) => {
      const adminData = data.admin || data.user;
      
      const mappedUser = {
        id: adminData.id,
        name: adminData.name || `${adminData.firstName} ${adminData.lastName}`,
        email: adminData.email,
        role: adminData.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin',
        avatar: adminData.avatar,
      };

      loginAction(mappedUser as any, data.accessToken)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // If backend supports logout endpoint
      await api.post('/admin/auth/logout').catch(() => {})
    },
    onSettled: () => {
      logoutAction()
    },
  })

  return {
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
