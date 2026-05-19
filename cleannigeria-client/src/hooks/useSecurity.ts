import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export interface Session {
  _id: string
  device: string
  browser: string
  os: string
  ipAddress: string
  location: string
  lastActiveAt: string
  isActive: boolean
}

export function useSecurity() {
  const queryClient = useQueryClient()

  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await api.get('/sessions')
      return res.data.data as Session[]
    },
  })

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await api.delete(`/sessions/${sessionId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Session logged out successfully')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: () => {
      toast.error('Failed to log out session')
    },
  })

  return {
    sessions: sessionsQuery.data || [],
    isLoadingSessions: sessionsQuery.isLoading,
    revokeSession: revokeSessionMutation.mutate,
    isRevoking: revokeSessionMutation.isPending,
  }
}
