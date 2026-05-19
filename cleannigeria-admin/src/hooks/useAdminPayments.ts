import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminPayments(params?: any) {
  return useQuery({
    queryKey: ['adminPayments', params],
    queryFn: async () => {
      const res = await api.get('/admin/management/payments', { params })
      return res.data
    },
  })
}
