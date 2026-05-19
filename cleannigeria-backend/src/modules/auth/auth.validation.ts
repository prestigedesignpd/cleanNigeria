import { z } from 'zod'
import { PHONE_REGEX } from '@constants/nigeria.constants'
import { AccountType } from '@constants/status.constants'

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(PHONE_REGEX, 'Invalid Nigerian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  accountType: z.nativeEnum(AccountType).optional(),
  referralCode: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['email', 'phone', '2fa']),
})

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  type: z.enum(['email', 'phone', '2fa']),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})
