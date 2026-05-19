import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Notification } from '@/types/notification.types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isPanelOpen: boolean
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  togglePanel: () => void
  closePanel: () => void
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  immer((set) => ({
    notifications: [],
    unreadCount: 0,
    isPanelOpen: false,

    setNotifications: (notifications) =>
      set((state) => {
        state.notifications = notifications
        state.unreadCount = notifications.filter((n) => !n.isRead).length
      }),

    addNotification: (notification) =>
      set((state) => {
        state.notifications.unshift(notification)
        if (!notification.isRead) state.unreadCount += 1
      }),

    markAsRead: (id) =>
      set((state) => {
        const n = state.notifications.find((n) => n.id === id)
        if (n && !n.isRead) {
          n.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      }),

    markAllAsRead: () =>
      set((state) => {
        state.notifications.forEach((n) => { n.isRead = true })
        state.unreadCount = 0
      }),

    togglePanel: () =>
      set((state) => { state.isPanelOpen = !state.isPanelOpen }),

    closePanel: () =>
      set((state) => { state.isPanelOpen = false }),
  }))
)
