import { Request, Response } from 'express'
import { User, OTPVerification, RefreshToken, PasswordReset, Session } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { hashPassword, comparePassword } from '@utils/hashUtils'
import { signToken } from '@utils/tokenUtils'
import { generateOtp, getOtpExpiry, generateSecureToken } from '@utils/otpUtils'
import { generateReferralCode } from '@utils/referralUtils'
import { EmailService } from '@services/Email.service'
import { env } from '@config/env.config'
import mongoose from 'mongoose'

/**
 * Helper: generate access and refresh tokens for a user
 */
export const generateAuthTokens = async (user: any, req?: Request) => {
  const accessToken = signToken({
    id: user._id,
    email: user.email,
    role: user.accountType,
    type: 'access',
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    onboardingCompleted: user.onboardingCompleted,
  })

  const refreshToken = signToken({
    id: user._id,
    email: user.email,
    role: user.accountType,
    type: 'refresh',
  })

  // Save refresh token to DB
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  })

  if (req) {
    const userAgent = req.headers['user-agent'] || 'Unknown Device'
    const ip = req.ip || 'Unknown IP'
    let browser = 'Unknown Browser'
    let os = 'Unknown OS'
    let device = 'Desktop'
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) { device = 'Mobile' }
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac OS')) os = 'MacOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iPhone')) os = 'iOS'

    await Session.create({
      userId: user._id,
      refreshToken,
      device: `${device} (${os})`,
      browser,
      os,
      ipAddress: ip,
      location: 'Lagos, Nigeria', // Mock GeoIP
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
  }

  return { accessToken, refreshToken }
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, accountType, referralCode } = req.body

  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
  if (existingUser) {
    throw ApiError.conflict('User with this email or phone already exists')
  }

  // Handle referral
  let referredBy = undefined
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() })
    if (referrer) referredBy = referrer._id
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    accountType,
    referredBy,
    referralCode: generateReferralCode(),
  })

  // Generate OTP
  const otp = generateOtp()
  await OTPVerification.create({
    userId: user._id,
    code: otp,
    type: 'email',
    expiresAt: getOtpExpiry(),
  })

  // Send OTP email
  await EmailService.sendOtpEmail(user.email, user.firstName, otp)

  // Response (don't send tokens yet, require verification)
  return ApiResponse.created(res, { userId: user._id }, 'Registration successful. Please verify your email.')
})

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Find user
  const user = await User.findOne({ email }).select('+password')
  if (!user || !user.password) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  // Check password
  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  // Check account status
  if (!user.isActive || user.isSuspended) {
    throw ApiError.forbidden('Your account is inactive or suspended. Please contact support.')
  }

  // Update last login
  user.lastLoginAt = new Date()
  user.lastLoginIP = req.ip
  await user.save()

  // Generate tokens
  const tokens = await generateAuthTokens(user, req)

  return ApiResponse.success(res, {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      onboardingCompleted: user.onboardingCompleted,
    },
    ...tokens,
  }, 'Login successful')
})

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body

  const user = await User.findOne({ email })
  if (!user) throw ApiError.notFound('User not found')

  if (user.isEmailVerified) {
    return ApiResponse.success(res, null, 'Email is already verified')
  }

  const verification = await OTPVerification.findOne({
    userId: user._id,
    code: otp,
    type: 'email',
  })

  if (!verification) {
    throw ApiError.badRequest('Invalid or expired OTP')
  }

  // Update user
  user.isEmailVerified = true
  await user.save()

  // Delete OTP
  await verification.deleteOne()

  // Generate tokens (auto-login after verification)
  const tokens = await generateAuthTokens(user, req)

  return ApiResponse.success(res, tokens, 'Email verified successfully')
})

export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, type } = req.body

  const user = await User.findOne({ email })
  if (!user) throw ApiError.notFound('User not found')

  if (type === 'email' && user.isEmailVerified) {
    throw ApiError.badRequest('Email is already verified')
  }

  // Delete old OTPs
  await OTPVerification.deleteMany({ userId: user._id, type })

  // Generate new OTP
  const otp = generateOtp()
  await OTPVerification.create({
    userId: user._id,
    code: otp,
    type,
    expiresAt: getOtpExpiry(),
  })

  if (type === 'email') {
    await EmailService.sendOtpEmail(user.email, user.firstName, otp)
  }
  // TODO: Add SMS service for 'phone' type

  return ApiResponse.success(res, null, `Verification code sent to your ${type}`)
})

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw ApiError.badRequest('Refresh token required')

  const savedToken = await RefreshToken.findOne({ token: refreshToken, isRevoked: false })
  if (!savedToken) throw ApiError.unauthorized('Invalid refresh token')

  if (savedToken.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token expired')
  }

  const user = await User.findById(savedToken.userId)
  if (!user) throw ApiError.unauthorized('User not found')

  // Generate new tokens
  const tokens = await generateAuthTokens(user, req)

  // Revoke old token
  savedToken.isRevoked = true
  savedToken.replacedByToken = tokens.refreshToken
  await savedToken.save()

  return ApiResponse.success(res, tokens, 'Token refreshed')
})

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true })
    await Session.findOneAndUpdate({ refreshToken }, { isActive: false })
  }
  return ApiResponse.success(res, null, 'Logged out successfully')
})

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    // Return success even if user not found for security (prevent email enumeration)
    return ApiResponse.success(res, null, 'If an account exists, a reset link has been sent.')
  }

  // Generate token
  const token = generateSecureToken()
  await PasswordReset.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  })

  // Send email
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`
  await EmailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl)

  return ApiResponse.success(res, null, 'Password reset link sent to your email.')
})

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body

  const resetRequest = await PasswordReset.findOne({ token })
  if (!resetRequest || resetRequest.expiresAt < new Date()) {
    throw ApiError.badRequest('Invalid or expired reset token')
  }

  const user = await User.findById(resetRequest.userId)
  if (!user) throw ApiError.notFound('User not found')

  // Update password
  user.password = await hashPassword(password)
  user.passwordChangedAt = new Date()
  await user.save()

  // Delete token
  await resetRequest.deleteOne()

  // Revoke all refresh tokens for this user
  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true })

  return ApiResponse.success(res, null, 'Password reset successful. Please login.')
})

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user?.id)
  if (!user) throw ApiError.notFound('User not found')

  return ApiResponse.success(res, user)
})

export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById((req as any).user?.id).select('+password')
    if (!user || !user.password) throw ApiError.notFound('User not found')

    const isMatch = await comparePassword(oldPassword, user.password)
    if (!isMatch) throw ApiError.badRequest('Incorrect old password')

    user.password = await hashPassword(newPassword)
    user.passwordChangedAt = new Date()
    await user.save()

    return ApiResponse.success(res, null, 'Password changed successfully')
})
