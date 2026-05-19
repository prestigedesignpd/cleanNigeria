import { Request, Response, NextFunction } from 'express'
import { ApiError } from '@utils/ApiError'
import { AdminRole, ROLE_HIERARCHY } from '@constants/roles.constants'

/**
 * Authorize by minimum admin role level.
 * e.g. authorize(AdminRole.FINANCE_OFFICER) allows FINANCE_OFFICER, ADMIN, SUPER_ADMIN
 */
export const authorize = (...allowedRoles: AdminRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!(req as any).admin) {
      throw ApiError.unauthorized()
    }

    const adminRole = (req as any).admin.role as AdminRole
    const hasRole = allowedRoles.some(
      (role) => ROLE_HIERARCHY[adminRole] >= ROLE_HIERARCHY[role]
    )

    if (!hasRole) {
      throw ApiError.forbidden(
        `Requires one of: ${allowedRoles.join(', ')}. Your role: ${adminRole}`
      )
    }

    next()
  }
}

/**
 * Authorize by exact permission string (for granular control)
 */
export const hasPermission = (permission: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!(req as any).admin) {
      throw ApiError.unauthorized()
    }

    const isSuperAdmin = (req as any).admin.role === AdminRole.SUPER_ADMIN
    const hasExactPermission = (req as any).admin.permissions.includes(permission)

    if (!isSuperAdmin && !hasExactPermission) {
      throw ApiError.forbidden(`Missing permission: ${permission}`)
    }

    next()
  }
}
