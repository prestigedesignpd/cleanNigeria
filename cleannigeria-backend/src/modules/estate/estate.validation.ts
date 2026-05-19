import { z } from 'zod'
import { CollectionType, AccountStatus } from '@constants/status.constants'

export const createEstateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  collectionType: z.nativeEnum(CollectionType).optional(),
  totalUnits: z.number().min(0).optional(),
  address: z.object({
    street: z.string().min(1),
    lga: z.string().min(1),
    state: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  zoneId: z.string().min(24), // MongoDB ID
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  managerEmail: z.string().email().optional(),
  status: z.nativeEnum(AccountStatus).optional(),
})

export const updateEstateSchema = createEstateSchema.partial()

export const addUnitSchema = z.object({
  unitNumber: z.string().min(1),
  residentName: z.string().optional(),
  residentPhone: z.string().optional(),
  residentEmail: z.string().email().optional(),
})
