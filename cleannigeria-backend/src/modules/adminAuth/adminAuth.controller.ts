import { Request, Response } from 'express'
import { AdminUser, RefreshToken, PasswordReset } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { hashPassword, comparePassword } from '@utils/hashUtils'
import { signToken } from '@utils/tokenUtils'
import { generateSecureToken } from '@utils/otpUtils'
import { EmailService } from '@services/Email.service'
import { env } from '@config/env.config'

/**
 * Helper: generate access and refresh tokens for an admin
 */
const generateAdminTokens = async (admin: any) => {
  const accessToken = signToken({
    id: admin._id,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    type: 'admin_access',
  })

  const refreshToken = signToken({
    id: admin._id,
    email: admin.email,
    role: admin.role,
    type: 'admin_refresh',
  })

  // Save refresh token
  await RefreshToken.create({
    adminId: admin._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
  })

  return { accessToken, refreshToken }
}

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check for Env Super Admin
  if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
    const existingAdmin = await AdminUser.findOne({ email: env.ADMIN_EMAIL })
    const adminId = existingAdmin ? existingAdmin._id.toString() : '000000000000000000000000'

    const accessToken = signToken({
      id: adminId,
      email: env.ADMIN_EMAIL,
      role: 'SUPER_ADMIN',
      permissions: ['ALL'],
      type: 'admin_access',
    })

    const refreshToken = signToken({
      id: adminId,
      email: env.ADMIN_EMAIL,
      role: 'SUPER_ADMIN',
      type: 'admin_refresh',
    })

    return ApiResponse.success(res, {
      admin: {
        id: adminId,
        firstName: existingAdmin?.firstName || 'System',
        lastName: existingAdmin?.lastName || 'Administrator',
        email: env.ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        permissions: ['ALL'],
      },
      accessToken,
      refreshToken,
    }, 'Admin login successful')
  }

  const admin = await AdminUser.findOne({ email }).select('+password')
  if (!admin || !admin.password) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const isMatch = await comparePassword(password, admin.password)
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  if (!admin.isActive || admin.isSuspended) {
    throw ApiError.forbidden('Your admin account is inactive or suspended.')
  }

  admin.lastLoginAt = new Date()
  admin.lastLoginIP = req.ip
  await admin.save()

  const tokens = await generateAdminTokens(admin)

  return ApiResponse.success(res, {
    admin: {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    },
    ...tokens,
  }, 'Admin login successful')
})

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw ApiError.badRequest('Refresh token required')

  const savedToken = await RefreshToken.findOne({ token: refreshToken, isRevoked: false })
  if (!savedToken) throw ApiError.unauthorized('Invalid refresh token')

  const admin = await AdminUser.findById(savedToken.adminId)
  if (!admin) throw ApiError.unauthorized('Admin not found')

  const tokens = await generateAdminTokens(admin)

  savedToken.isRevoked = true
  savedToken.replacedByToken = tokens.refreshToken
  await savedToken.save()

  return ApiResponse.success(res, tokens, 'Admin token refreshed')
})

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true })
  }
  return ApiResponse.success(res, null, 'Logged out successfully')
})

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body
  const admin = await AdminUser.findOne({ email })
  if (!admin) return ApiResponse.success(res, null, 'Reset link sent if account exists.')

  const token = generateSecureToken()
  await PasswordReset.create({
    adminId: admin._id,
    token,
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
  })

  const resetUrl = `${env.ADMIN_URL}/reset-password?token=${token}`
  await EmailService.sendPasswordResetEmail(admin.email, admin.firstName, resetUrl)

  return ApiResponse.success(res, null, 'Password reset link sent to admin email.')
})

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body

  const resetRequest = await PasswordReset.findOne({ token })
  if (!resetRequest || resetRequest.expiresAt < new Date()) {
    throw ApiError.badRequest('Invalid or expired reset token')
  }

  const admin = await AdminUser.findById(resetRequest.adminId)
  if (!admin) throw ApiError.notFound('Admin not found')

  admin.password = await hashPassword(password)
  admin.passwordChangedAt = new Date()
  await admin.save()

  await resetRequest.deleteOne()
  await RefreshToken.updateMany({ adminId: admin._id }, { isRevoked: true })

  return ApiResponse.success(res, null, 'Admin password reset successful.')
})

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const admin = await AdminUser.findById((req as any).admin?.id)
  if (!admin) throw ApiError.notFound('Admin not found')
  return ApiResponse.success(res, admin)
})
