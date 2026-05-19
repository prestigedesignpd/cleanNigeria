import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminTeam() {
  return useQuery({
    queryKey: ['adminTeam'],
    queryFn: async () => {
      const res = await api.get('/admin/management/admins')
      return res.data.data || []
    },
  })
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/admin/management/admins', data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeam'] })
    },
  })
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.patch(`/admin/management/admins/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeam'] })
    },
  })
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/management/admins/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeam'] })
    },
  })
}
