import { z } from 'zod'
import { BusinessType, WasteVolumeTier, AccountStatus } from '@constants/status.constants'

export const createBusinessSchema = z.object({
  name: z.string().min(3),
  businessType: z.nativeEnum(BusinessType),
  description: z.string().optional(),
  wasteVolumeTier: z.nativeEnum(WasteVolumeTier).optional(),
  address: z.object({
    street: z.string().min(1),
    lga: z.string().min(1),
    state: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  zoneId: z.string().min(24),
  ownerId: z.string().min(24),
  contactPerson: z.object({
    name: z.string().min(2),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
  status: z.nativeEnum(AccountStatus).optional(),
})

export const updateBusinessSchema = createBusinessSchema.partial()

export const addDocumentSchema = z.object({
  type: z.enum(['CAC', 'UTILITY_BILL', 'ID_CARD', 'OTHER']),
})
