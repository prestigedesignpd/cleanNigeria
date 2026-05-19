import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, Calendar, MapPin, MessageSquare,
  Bell, Gift, HelpCircle, Settings, ChevronLeft, ChevronRight, Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'
import { useNotificationStore } from '@/store/notificationStore'
import { ROUTES } from '@/lib/routes'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Subscription', icon: CreditCard, path: ROUTES.SUBSCRIPTION },
  { label: 'Payments', icon: CreditCard, path: ROUTES.PAYMENTS },
  { label: 'Schedule', icon: Calendar, path: ROUTES.SCHEDULE },
  { label: 'Complaints', icon: MessageSquare, path: ROUTES.COMPLAINTS },
  { label: 'Notifications', icon: Bell, path: ROUTES.NOTIFICATIONS, badge: true },
  { label: 'Support', icon: HelpCircle, path: ROUTES.SUPPORT },
  { label: 'Settings', icon: Settings, path: ROUTES.SETTINGS },
]

function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
  const { sidebarCollapsed, toggleSidebar, closeMobileSidebar } = useUiStore()
  const { unreadCount } = useNotificationStore()
  const { pathname } = useLocation()
  
  // Mobile sidebar is never collapsed
  const collapsed = !isMobile && sidebarCollapsed

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn('flex h-16 shrink-0 items-center border-b border-border px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600">
          <Truck className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground">CleanNigeria</span>
        )}
      </div>

      {/* Nav items */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = item.path === ROUTES.DASHBOARD
              ? pathname === item.path
              : pathname.startsWith(item.path)

            const link = (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD}
                onClick={isMobile ? closeMobileSidebar : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {collapsed && item.badge && unreadCount > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                )}
              </NavLink>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <div className="relative">{link}</div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return link
          })}
        </nav>
      </ScrollArea>

      {/* Collapse toggle (Desktop only) */}
      {!isMobile && (
        <div className="border-t border-border p-2">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>
        </div>
      )}
    </div>
  )
}

export function DashboardSidebar() {
  const { sidebarCollapsed } = useUiStore()
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 lg:flex',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </TooltipProvider>
  )
}

export function DashboardMobileSidebar() {
  const { sidebarMobileOpen, closeMobileSidebar } = useUiStore()
  return (
    <Sheet open={sidebarMobileOpen} onOpenChange={(open) => !open && closeMobileSidebar()}>
      <SheetContent side="left" className="w-64 p-0 border-r-border bg-sidebar text-sidebar-foreground">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation for the CleanNigeria dashboard</SheetDescription>
        <SidebarContent isMobile />
      </SheetContent>
    </Sheet>
  )
}
