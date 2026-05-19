import type { AuthUser } from '@/types/auth.types'

export const mockUser: AuthUser = {
  id: 'usr_001',
  fullName: 'Chukwuemeka Obi',
  email: 'emeka@greatestate.ng',
  phone: '08012345678',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=emeka',
  role: 'user',
  isEmailVerified: true,
  isPhoneVerified: true,
  onboardingCompleted: true,
  createdAt: '2025-01-15T08:00:00Z',
}

export const mockTokens = {
  accessToken: 'mock_access_token_abc123',
  refreshToken: 'mock_refresh_token_xyz789',
}
