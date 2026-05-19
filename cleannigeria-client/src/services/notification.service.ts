import api from './api'
import type { Notification } from '@/types/notification.types'

export const notificationService = {
  async getNotifications(): Promise<{ notifications: Notification[], unreadCount: number }> {
    const res = await api.get('/notifications')
    return {
      notifications: res.data.data?.data || res.data.data || [],
      unreadCount: res.data.data?.unreadCount || 0
    }
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`)
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all')
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`)
  },
}
