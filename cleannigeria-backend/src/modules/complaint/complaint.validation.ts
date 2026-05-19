import { z } from 'zod'
import { ComplaintCategory, ComplaintPriority } from '@constants/status.constants'

export const createComplaintSchema = z.object({
  category: z.nativeEnum(ComplaintCategory),
  subject: z.string().min(5).max(100),
  description: z.string().min(20),
  relatedScheduleId: z.string().optional(),
  estateId: z.string().optional(),
  businessId: z.string().optional(),
  priority: z.nativeEnum(ComplaintPriority).optional(),
})

export const addMessageSchema = z.object({
  message: z.string().min(1),
})

export const resolveComplaintSchema = z.object({
  resolutionNote: z.string().min(10),
})

export const rateComplaintSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})
