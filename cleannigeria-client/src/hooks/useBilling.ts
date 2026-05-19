import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'

export interface SavedCard {
  authorizationCode: string
  last4: string
  cardType: string
  expMonth: string
  expYear: string
  bank: string
  isDefault: boolean
}

export function useBilling() {
  const queryClient = useQueryClient()

  const cardsQuery = useQuery({
    queryKey: ['saved-cards'],
    queryFn: async () => {
      const res = await api.get('/payments/cards')
      return res.data.data as SavedCard[]
    },
  })

  const removeCardMutation = useMutation({
    mutationFn: async (last4: string) => {
      const res = await api.delete(`/payments/cards/${last4}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Card removed successfully')
      queryClient.invalidateQueries({ queryKey: ['saved-cards'] })
    },
    onError: () => {
      toast.error('Failed to remove card')
    },
  })

  return {
    cards: cardsQuery.data || [],
    isLoadingCards: cardsQuery.isLoading,
    removeCard: removeCardMutation.mutate,
    isRemovingCard: removeCardMutation.isPending,
  }
}
