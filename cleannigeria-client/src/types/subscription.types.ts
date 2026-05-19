export type PlanTier = 'basic' | 'standard' | 'premium' | 'enterprise'
export type BillingCycle = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'suspended'

export interface Plan {
  id: string
  name: string
  tier: PlanTier
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  collectionsPerMonth: number
  maxUnits?: number
  isPopular?: boolean
  accountType: 'estate' | 'business' | 'both'
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  plan: Plan
  status: SubscriptionStatus
  billingCycle: BillingCycle
  currentPeriodStart: string
  currentPeriodEnd: string
  collectionsUsed: number
  collectionsIncluded: number
  extraCollectionsUsed: number
  autoRenew: boolean
  cancelledAt?: string
  createdAt: string
}

export interface ChangePlanPayload {
  planId: string
  billingCycle: BillingCycle
}
