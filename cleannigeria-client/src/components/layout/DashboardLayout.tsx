import { Outlet } from 'react-router-dom'
import { DashboardSidebar, DashboardMobileSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'
import { DashboardMobileNav } from './DashboardMobileNav'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { sidebarCollapsed } = useUiStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebars */}
      <DashboardSidebar />
      <DashboardMobileSidebar />

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardMobileNav />
    </div>
  )
}
