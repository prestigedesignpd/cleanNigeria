import { z } from 'zod'
import { PlanTargetType } from '@constants/status.constants'

export const createPlanSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  tagline: z.string().optional(),
  targetType: z.nativeEnum(PlanTargetType),
  pricing: z.object({
    monthly: z.number().min(0),
    yearly: z.number().min(0),
  }),
  paystackPlanCodes: z.object({
    monthly: z.string().optional(),
    yearly: z.string().optional(),
  }).optional(),
  features: z.array(z.object({
    text: z.string(),
    included: z.boolean().default(true),
  })),
  limits: z.object({
    pickupsPerCycle: z.number().min(1),
    maxUnits: z.number().optional(),
    extraPickupPrice: z.number().min(0).default(0),
  }),
  allowExtraPickups: z.boolean().default(true),
  trialDays: z.number().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
})

export const updatePlanSchema = createPlanSchema.partial()
