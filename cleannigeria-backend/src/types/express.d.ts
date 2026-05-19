import { Request } from 'express'
import { AdminRole } from '@constants/roles.constants'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
        isEmailVerified: boolean
        isPhoneVerified: boolean
        onboardingCompleted: boolean
      }
      admin?: {
        id: string
        email: string
        role: AdminRole
        permissions: string[]
      }
    }
  }
}

export {}
