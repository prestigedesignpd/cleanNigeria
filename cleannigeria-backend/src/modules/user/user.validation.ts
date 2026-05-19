import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(), // Should add Nigeria phone regex if allowed to change
})

export const onboardingSchema = z.object({
  address: z.object({
    street: z.string().min(1),
    lga: z.string().min(1),
    state: z.string().min(1),
  }).optional(),
  estateId: z.string().optional(),
  businessId: z.string().optional(),
  // Add other onboarding fields as needed
})

export const pushTokenSchema = z.object({
  token: z.string().min(1),
})
