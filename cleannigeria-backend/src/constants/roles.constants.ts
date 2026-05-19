export enum UserRole {
  USER = 'USER',
  COLLECTOR = 'COLLECTOR',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATIONS_MANAGER = 'OPERATIONS_MANAGER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  FINANCE_OFFICER = 'FINANCE_OFFICER',
  ANALYST = 'ANALYST',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
}

export const ADMIN_ROLES = Object.values(AdminRole)

export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  [AdminRole.SUPER_ADMIN]: 100,
  [AdminRole.ADMIN]: 80,
  [AdminRole.OPERATIONS_MANAGER]: 60,
  [AdminRole.CONTENT_MANAGER]: 55,
  [AdminRole.FINANCE_OFFICER]: 50,
  [AdminRole.SUPPORT_AGENT]: 40,
  [AdminRole.ANALYST]: 30,
}
