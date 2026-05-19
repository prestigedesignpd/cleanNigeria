import api from './api'
import type { LoginCredentials, RegisterCredentials, AuthResponse, ForgotPasswordPayload, ResetPasswordPayload, VerifyOtpPayload, AuthUser } from '@/types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await api.post('/auth/login', credentials)
    const data = res.data.data
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    }
  },

  async register(credentials: RegisterCredentials): Promise<{ message: string }> {
    const res = await api.post('/auth/register', credentials)
    return { message: res.data.message || 'Registration successful. Please verify your email.' }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const res = await api.get('/auth/me')
    return res.data.data
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const res = await api.post('/auth/google', { idToken })
    const data = res.data.data
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    }
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/verify-email', payload)
    const data = res.data.data
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    }
  },

  async resendOtp(email: string, type: string = 'email'): Promise<{ message: string }> {
    const res = await api.post('/auth/resend-otp', { email, type })
    return { message: res.data.message || 'OTP resent successfully' }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const res = await api.post('/auth/forgot-password', payload)
    return { message: res.data.message || 'Reset link sent to your email' }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const res = await api.post('/auth/reset-password', payload)
    return { message: res.data.message || 'Password reset successfully' }
  },

  async changePassword(payload: any): Promise<{ message: string }> {
    const res = await api.post('/auth/change-password', payload)
    return { message: res.data.message || 'Password changed successfully' }
  },

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken }).catch(() => {})
    }
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    const res = await api.post('/auth/refresh-token', { refreshToken })
    const data = res.data.data
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }
  },
}
