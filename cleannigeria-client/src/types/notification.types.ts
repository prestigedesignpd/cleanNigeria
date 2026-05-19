export type NotificationType =
  | 'pickup_reminder' | 'pickup_completed' | 'pickup_missed'
  | 'payment_received' | 'payment_failed' | 'payment_due'
  | 'subscription_renewed' | 'subscription_expiring' | 'subscription_cancelled'
  | 'complaint_update' | 'collector_nearby' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export interface NotificationSummary {
  total: number
  unread: number
}
