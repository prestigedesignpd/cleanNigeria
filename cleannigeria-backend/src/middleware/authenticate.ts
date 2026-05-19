import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@utils/tokenUtils'
import { ApiError } from '@utils/ApiError'
import { catchAsync } from '@utils/catchAsync'

/**
 * Middleware: authenticate client user via Bearer JWT
 * Attaches req.user on success
 */
export const authenticate = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication token required')
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token, 'access')

  ;(req as any).user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
    isEmailVerified: decoded.isEmailVerified as boolean ?? false,
    isPhoneVerified: decoded.isPhoneVerified as boolean ?? false,
    onboardingCompleted: decoded.onboardingCompleted as boolean ?? false,
  }

  next()
})

/**
 * Middleware: require email verification before accessing protected routes
 */
export const requireEmailVerified = (req: Request, _res: Response, next: NextFunction): void => {
  if (!(req as any).user?.isEmailVerified) {
    throw ApiError.forbidden('Email verification required', 'EMAIL_NOT_VERIFIED')
  }
  next()
}

/**
 * Middleware: require completed onboarding
 */
export const requireOnboarding = (req: Request, _res: Response, next: NextFunction): void => {
  if (!(req as any).user?.onboardingCompleted) {
    throw ApiError.forbidden('Please complete onboarding first')
  }
  next()
}
