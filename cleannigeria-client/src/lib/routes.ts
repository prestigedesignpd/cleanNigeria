export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  PRICING: '/pricing',
  COVERAGE: '/coverage',
  CONTACT: '/contact',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:slug',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOT_FOUND: '*',

  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify-phone',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Onboarding
  ONBOARDING: '/onboarding',
  ONBOARDING_SUCCESS: '/onboarding/success',

  // Dashboard
  DASHBOARD: '/dashboard',
  SUBSCRIPTION: '/dashboard/subscription',
  CHANGE_PLAN: '/dashboard/subscription/change',
  CANCEL_SUBSCRIPTION: '/dashboard/subscription/cancel',
  PAYMENTS: '/dashboard/payments',
  PAYMENT_DETAIL: '/dashboard/payments/:id',
  INVOICES: '/dashboard/invoices',
  SCHEDULE: '/dashboard/schedule',
  PICKUP_DETAIL: '/dashboard/schedule/:id',
  REQUEST_PICKUP: '/dashboard/schedule/request',
  TRACKING: '/dashboard/tracking',
  COMPLAINTS: '/dashboard/complaints',
  NEW_COMPLAINT: '/dashboard/complaints/new',
  COMPLAINT_DETAIL: '/dashboard/complaints/:id',
  NOTIFICATIONS: '/dashboard/notifications',
  REFERRAL: '/dashboard/referral',
  SUPPORT: '/dashboard/support',
  SETTINGS: '/dashboard/settings',
  SETTINGS_PROFILE: '/dashboard/settings/profile',
  SETTINGS_SECURITY: '/dashboard/settings/security',
  SETTINGS_NOTIFICATIONS: '/dashboard/settings/notifications',
  SETTINGS_BILLING: '/dashboard/settings/billing',
  SETTINGS_ESTATE: '/dashboard/settings/estate',
  SETTINGS_DELETE: '/dashboard/settings/delete-account',
} as const

export function blogDetailRoute(slug: string) { return `/blog/${slug}` }
export function paymentDetailRoute(id: string) { return `/dashboard/payments/${id}` }
export function pickupDetailRoute(id: string) { return `/dashboard/schedule/${id}` }
export function complaintDetailRoute(id: string) { return `/dashboard/complaints/${id}` }
