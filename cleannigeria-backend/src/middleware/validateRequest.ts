import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { ApiError } from '@utils/ApiError'

type ValidateSource = 'body' | 'query' | 'params'

/**
 * Validate request data against a Zod schema
 * Usage: validateRequest(MySchema) or validateRequest(MySchema, 'query')
 */
export const validateRequest = (schema: z.AnyZodObject, source: ValidateSource = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source])
      req[source] = parsed
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        console.log('DEBUG: Validation failed on', source, '. Data:', req[source], '. Issues:', err.issues)
        const errors = err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        next(ApiError.badRequest('Validation failed', errors, 'VALIDATION_ERROR'))
      } else {
        next(err)
      }
    }
  }
}
