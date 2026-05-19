import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, ExternalLink } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useNotificationStore } from '@/store/notificationStore'
import { notificationService } from '@/services/notification.service'
import { formatRelativeTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'

export function NotificationPanel({ children }: { children: React.ReactNode }) {
  const { notifications, setNotifications, markAsRead, markAllAsRead } = useNotificationStore()

  useEffect(() => {
    // Small delay to ensure auth token is persisted to storage after login
    const timer = setTimeout(() => {
      notificationService.getNotifications()
        .then(setNotifications)
        .catch(() => { /* Silently ignore auth errors on panel mount */ })
    }, 500)
    return () => clearTimeout(timer)
  }, [setNotifications])

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-600" />
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => { markAllAsRead(); notificationService.markAllAsRead() }}
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </Button>
        </div>

        <ScrollArea className="h-[380px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.slice(0, 10).map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => { markAsRead(notif.id); notificationService.markAsRead(notif.id) }}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors',
                    !notif.isRead && 'bg-brand-50/50 dark:bg-brand-900/10'
                  )}
                >
                  <div className="flex gap-3">
                    {!notif.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                    )}
                    <div className={cn('flex-1 space-y-0.5', notif.isRead && 'ml-5')}>
                      <p className="text-sm font-medium leading-tight">{notif.title}</p>
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{notif.message}</p>
                      <p className="text-[11px] text-muted-foreground/70">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />
        <div className="p-2">
          <Button variant="ghost" asChild className="w-full justify-center gap-2 h-9 text-sm text-brand-600">
            <Link to={ROUTES.NOTIFICATIONS}>
              View all notifications <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
