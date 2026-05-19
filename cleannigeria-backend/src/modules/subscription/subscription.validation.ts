import { z } from 'zod'
import { BillingCycle } from '@constants/status.constants'

export const checkoutSchema = z.object({
  planId: z.string().min(24),
  billingCycle: z.nativeEnum(BillingCycle),
  estateId: z.string().optional(),
  businessId: z.string().optional(),
  unitId: z.string().optional(),
})

export const verifySubscriptionSchema = z.object({
  reference: z.string().min(1),
})
