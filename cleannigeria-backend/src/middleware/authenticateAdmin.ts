import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@utils/tokenUtils'
import { ApiError } from '@utils/ApiError'
import { catchAsync } from '@utils/catchAsync'

/**
 * Middleware: authenticate admin user via Bearer JWT
 * Attaches req.admin on success
 */
export const authenticateAdmin = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Admin authentication token required')
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token, 'admin_access')

  ;(req as any).admin = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role as import('@constants/roles.constants').AdminRole,
    permissions: (decoded.permissions as string[]) ?? [],
  }

  next()
})
