import { z } from 'zod'

const phoneRegex = /^(\+234|0)?[789][01]\d{8}$/

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phone: z.string().regex(phoneRegex, 'Enter a valid Nigerian phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreedToTerms: z.boolean().refine((v) => v === true, 'You must agree to the terms'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  displayName: z.string().optional(),
  phone: z.string().regex(phoneRegex, 'Enter a valid Nigerian phone number'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'prefer_not_to_say']).optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const complaintSchema = z.object({
  category: z.enum([
    'missed_pickup', 'incomplete_collection', 'rude_collector',
    'billing_issue', 'app_issue', 'other',
  ]),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Max 500 characters'),
  relatedPickupDate: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(phoneRegex, 'Enter a valid Nigerian phone number'),
  subject: z.enum(['sales', 'support', 'partnership', 'press']),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type ProfileSchema = z.infer<typeof profileSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type ComplaintSchema = z.infer<typeof complaintSchema>
export type ContactSchema = z.infer<typeof contactSchema>
