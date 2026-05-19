import api from './api'
import type { Subscription, Plan, ChangePlanPayload } from '@/types/subscription.types'

export const subscriptionService = {
  async getMySubscriptions(): Promise<Subscription[]> {
    const res = await api.get('/subscriptions/my')
    return res.data.data
  },

  async getPlans(targetType?: string): Promise<Plan[]> {
    const query = targetType ? `?targetType=${targetType}` : ''
    const res = await api.get(`/plans${query}`)
    return res.data.data
  },

  async checkout(payload: { planId: string, billingCycle: 'MONTHLY' | 'YEARLY', estateId?: string, businessId?: string, unitId?: string }): Promise<{ authorization_url: string, reference: string, internal_reference: string }> {
    const res = await api.post('/subscriptions/checkout', payload)
    return res.data.data
  },

  async verifySubscription(reference: string): Promise<Subscription> {
    const res = await api.post('/subscriptions/verify', { reference })
    return res.data.data
  },

  // These might require backend implementation if missing, but we'll map them for now
  async changePlan(payload: ChangePlanPayload): Promise<Subscription> {
    const res = await api.post('/subscriptions/change-plan', payload)
    return res.data.data
  },

  async cancelSubscription(reason: string): Promise<{ message: string }> {
    const res = await api.post('/subscriptions/cancel', { reason })
    return { message: res.data.message }
  },

  async reactivateSubscription(): Promise<Subscription> {
    const res = await api.post('/subscriptions/reactivate')
    return res.data.data
  },
}
