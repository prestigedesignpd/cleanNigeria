import { Request, Response, NextFunction } from 'express'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { logger } from '@utils/logger'
import mongoose from 'mongoose'
import { ZodError } from 'zod'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Already an ApiError — operational, expected error
  if (err instanceof ApiError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors)
    return
  }
  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    logger.warn('Zod validation failed:', JSON.stringify(errors, null, 2))
    ApiResponse.error(res, 'Validation failed', 400, errors)
    return
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as unknown as { keyValue: Record<string, unknown> }).keyValue || {})[0]
    ApiResponse.error(res, `${field || 'Field'} already exists`, 409)
    return
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    ApiResponse.error(res, 'Validation failed', 400, errors)
    return
  }

  // Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    ApiResponse.error(res, `Invalid ${err.path}: ${err.value}`, 400)
    return
  }

  // JWT errors handled in tokenUtils — but just in case
  if (err.name === 'JsonWebTokenError') {
    ApiResponse.error(res, 'Invalid token', 401)
    return
  }
  if (err.name === 'TokenExpiredError') {
    ApiResponse.error(res, 'Token has expired', 401)
    return
  }

  // Unknown / unhandled error — log it, don't expose details
  logger.error('Unhandled error:', { message: err.message, stack: err.stack })

  ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500
  )
}
