import { z } from 'zod'
import { ZoneStatus, CollectionDay } from '@constants/status.constants'

export const createZoneSchema = z.object({
  name: z.string().min(3),
  state: z.string().min(1),
  lgas: z.array(z.string()).min(1),
  collectionDays: z.array(z.nativeEnum(CollectionDay)).min(1),
  timeWindows: z.array(z.object({
    label: z.string(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })),
  boundary: z.object({
    coordinates: z.array(z.array(z.array(z.number()))), // Polygon coordinates
  }),
  status: z.nativeEnum(ZoneStatus).optional(),
  coverageNotes: z.string().optional(),
})

export const updateZoneSchema = createZoneSchema.partial()

export const checkCoverageSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})
