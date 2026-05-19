import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminSchedules(params?: any) {
  return useQuery({
    queryKey: ['adminSchedules', params],
    queryFn: async () => {
      const res = await api.get('/schedules', { params })
      return res.data.data?.data || res.data.data || []
    },
  })
}

export function useGenerateSchedules() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/schedules/generate')
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchedules'] })
    },
  })
}

export function useUpdateScheduleStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await api.patch(`/schedules/${id}/status`, { status })
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchedules'] })
    },
  })
}
