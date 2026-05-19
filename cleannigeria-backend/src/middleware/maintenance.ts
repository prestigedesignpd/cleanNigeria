import { Request, Response, NextFunction } from 'express'
import { ApiError } from '@utils/ApiError'

/**
 * Maintenance mode gate — returns 503 if MAINTENANCE_MODE=true
 * Super admins bypass this check via a maintenance bypass token header
 */
export const maintenanceCheck = (req: Request, _res: Response, next: NextFunction): void => {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  if (!isMaintenanceMode) return next()

  // Always allow health checks and admin auth
  const bypassPaths = ['/health', '/api/v1/admin/auth']
  const isBypass = bypassPaths.some((p) => req.path.startsWith(p))
  if (isBypass) return next()

  throw ApiError.serviceUnavailable(
    'CleanNigeria is currently undergoing scheduled maintenance. Please try again shortly.'
  )
}
