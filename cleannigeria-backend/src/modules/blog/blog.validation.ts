import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  excerpt: z.string().optional(),
  categoryId: z.string().min(24),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isFeatured: z.boolean().optional(),
  featuredImage: z.object({
    url: z.string(),
    publicId: z.string().optional().default(''),
  }).optional(),
})

export const updatePostSchema = createPostSchema.partial()

export const createCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})
