export interface User {
  id: string
  fullName: string
  displayName?: string
  email: string
  phone: string
  avatar?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'prefer_not_to_say'
  role: 'user' | 'admin' | 'collector'
  accountType: 'estate' | 'business'
  isEmailVerified: boolean
  isPhoneVerified: boolean
  onboardingCompleted: boolean
  referralCode: string
  referredBy?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationPreferences {
  emailPickupReminders: boolean
  emailPaymentReceipts: boolean
  emailComplaintUpdates: boolean
  emailNewsletter: boolean
  smsPickupReminder: boolean
  smsPaymentFailed: boolean
  pushCollectorNearby: boolean
  pushPaymentDue: boolean
  pushAnnouncements: boolean
}

export interface UpdateProfilePayload {
  fullName?: string
  displayName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  avatar?: string
}
