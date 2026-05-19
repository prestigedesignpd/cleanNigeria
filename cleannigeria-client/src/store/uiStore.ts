import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UiState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  theme: 'light' | 'dark' | 'system'
  announcementDismissed: boolean
}

interface UiActions {
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setTheme: (theme: UiState['theme']) => void
  dismissAnnouncement: () => void
}

export const useUiStore = create<UiState & UiActions>()(
  immer((set) => ({
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    theme: 'light',
    announcementDismissed:
      typeof window !== 'undefined'
        ? localStorage.getItem('cn-announcement-dismissed') === 'true'
        : false,

    toggleSidebar: () => set((s) => { s.sidebarCollapsed = !s.sidebarCollapsed }),
    setSidebarCollapsed: (v) => set((s) => { s.sidebarCollapsed = v }),
    toggleMobileSidebar: () => set((s) => { s.sidebarMobileOpen = !s.sidebarMobileOpen }),
    closeMobileSidebar: () => set((s) => { s.sidebarMobileOpen = false }),
    setTheme: (theme) => set((s) => { s.theme = theme }),
    dismissAnnouncement: () => {
      localStorage.setItem('cn-announcement-dismissed', 'true')
      set((s) => { s.announcementDismissed = true })
    },
  }))
)
