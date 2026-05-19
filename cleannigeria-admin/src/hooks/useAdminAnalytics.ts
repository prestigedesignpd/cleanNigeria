import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.get('/admin/management/analytics')
      return res.data.data
    },
  })
}

// Alias for the full analytics page
export const useFullAnalytics = useAdminAnalytics

export function useSystemActivity() {
  return useQuery({
    queryKey: ['systemActivity'],
    queryFn: async () => {
      const res = await api.get('/admin/management/activity')
      return res.data.data
    },
  })
}
