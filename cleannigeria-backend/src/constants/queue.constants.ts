// BullMQ queue and job name constants
export const QUEUES = {
  EMAIL: 'email-queue',
  SMS: 'sms-queue',
  NOTIFICATION: 'notification-queue',
  PAYMENT: 'payment-queue',
  SCHEDULE: 'schedule-queue',
  INVOICE: 'invoice-queue',
  REPORT: 'report-queue',
  CLEANUP: 'cleanup-queue',
} as const

export const JOBS = {
  // Email jobs
  SEND_EMAIL: 'send-email',
  SEND_WELCOME_EMAIL: 'send-welcome-email',
  SEND_OTP_EMAIL: 'send-otp-email',
  SEND_RESET_PASSWORD_EMAIL: 'send-reset-password-email',
  SEND_PAYMENT_RECEIPT: 'send-payment-receipt',
  SEND_INVOICE_EMAIL: 'send-invoice-email',
  SEND_PICKUP_REMINDER: 'send-pickup-reminder',
  SEND_SUBSCRIPTION_EXPIRY_WARNING: 'send-subscription-expiry-warning',
  SEND_BROADCAST_EMAIL: 'send-broadcast-email',

  // SMS jobs
  SEND_SMS: 'send-sms',
  SEND_OTP_SMS: 'send-otp-sms',

  // Notification jobs
  SEND_IN_APP_NOTIFICATION: 'send-in-app-notification',
  SEND_BULK_NOTIFICATION: 'send-bulk-notification',

  // Payment jobs
  RETRY_FAILED_PAYMENT: 'retry-failed-payment',
  PROCESS_SUBSCRIPTION_RENEWAL: 'process-subscription-renewal',

  // Schedule jobs
  GENERATE_WEEKLY_SCHEDULES: 'generate-weekly-schedules',
  GENERATE_INVOICE: 'generate-invoice',

  // Report jobs
  GENERATE_REPORT: 'generate-report',

  // Cleanup jobs
  CLEANUP_EXPIRED_TOKENS: 'cleanup-expired-tokens',
  CLEANUP_OLD_LOGS: 'cleanup-old-logs',
} as const
