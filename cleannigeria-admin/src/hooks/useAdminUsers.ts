import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminUsers(params?: any) {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: async () => {
      const res = await api.get('/admin/management/users', { params })
      return res.data
    },
  })
}

export function useUserDetails(id: string) {
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: async () => {
      const res = await api.get(`/admin/management/users/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}
export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Partial<{ isActive: boolean, isSuspended: boolean }> }) => {
      const res = await api.patch(`/admin/management/users/${id}/status`, status)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

// Stats
export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/management/stats')
      return res.data.data
    },
  })
}

export function useVerificationRequests() {
  return useQuery({
    queryKey: ['verificationRequests'],
    queryFn: async () => {
      const res = await api.get('/admin/management/verifications')
      return res.data.data || []
    },
  })
}

export function useUpdateVerificationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: 'Approved' | 'Rejected' | 'Needs Info', notes?: string }) => {
      const res = await api.patch(`/admin/management/verifications/${id}/status`, { status, notes })
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationRequests'] })
    },
  })
}

export function useAdminSubscriptions(params?: any) {
  return useQuery({
    queryKey: ['adminSubscriptions', params],
    queryFn: async () => {
      const res = await api.get('/admin/management/subscriptions', { params })
      return res.data
    },
  })
}
