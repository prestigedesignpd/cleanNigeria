import { z } from 'zod'
import { CollectorStatus, VehicleType } from '@constants/status.constants'

export const createCollectorSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2),
    phone: z.string().min(1),
    relationship: z.string(),
  }),
  vehicle: z.object({
    type: z.nativeEnum(VehicleType),
    plateNumber: z.string().min(3),
    color: z.string().optional(),
    model: z.string().optional(),
  }),
  status: z.nativeEnum(CollectorStatus).optional(),
  employmentDate: z.string().optional(),
})

export const updateCollectorSchema = createCollectorSchema.partial()

export const assignZoneSchema = z.object({
  zoneId: z.string().min(24),
})

export const updateLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})
