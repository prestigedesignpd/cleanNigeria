import { Bell, Menu, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useUiStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/formatters'
import { ROUTES } from '@/lib/routes'
import { NotificationPanel } from '@/components/dashboard/notifications/NotificationPanel'

export function DashboardHeader() {
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const { toggleMobileSidebar, toggleSidebar } = useUiStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle mobile menu</span>
      </Button>

      {/* Desktop menu button */}
      <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle desktop sidebar</span>
      </Button>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 h-9" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {/* Notification Bell */}
        <NotificationPanel>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </NotificationPanel>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar?.url || user?.avatar} alt={user?.fullName} />
                <AvatarFallback className="bg-brand-100 text-brand-700 text-xs font-semibold">
                  {getInitials(user?.fullName ?? 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.SETTINGS_PROFILE}>Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.SUBSCRIPTION}>Subscription</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
