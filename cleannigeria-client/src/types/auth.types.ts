export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreedToTerms: boolean
}

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
  avatar?: string
  role: 'user' | 'admin' | 'collector'
  isEmailVerified: boolean
  isPhoneVerified: boolean
  onboardingCompleted: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface ForgotPasswordPayload { email: string }
export interface ResetPasswordPayload { token: string; password: string; confirmPassword: string }
export interface VerifyOtpPayload { code: string; type: 'email' | 'phone' }
