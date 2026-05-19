import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Subscription } from '@/types/subscription.types'

interface SubscriptionState {
  subscription: Subscription | null
  isLoading: boolean
}

interface SubscriptionActions {
  setSubscription: (sub: Subscription | null) => void
  setLoading: (loading: boolean) => void
  clearSubscription: () => void
}

export const useSubscriptionStore = create<SubscriptionState & SubscriptionActions>()(
  immer((set) => ({
    subscription: null,
    isLoading: false,

    setSubscription: (sub) =>
      set((state) => {
        state.subscription = sub
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),

    clearSubscription: () =>
      set((state) => {
        state.subscription = null
      }),
  }))
)
