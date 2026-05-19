import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Search, 
  Filter,
  Package,
  CreditCard,
  Settings,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useNotificationStore } from '@/store/notificationStore'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { notificationService } from '@/services/notification.service'
import { AppLoader } from '@/components/common/AppLoader'

const CATEGORIES = [
  { label: 'All', value: 'all', icon: Bell },
  { label: 'Service', value: 'service', icon: Package },
  { label: 'Billing', value: 'billing', icon: CreditCard },
  { label: 'System', value: 'system', icon: Settings },
]

export default function NotificationsPage() {
  const { notifications, setNotifications, markAllAsRead } = useNotificationStore()
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(notifications.length === 0)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (notifications.length === 0) setIsLoading(true)
      try {
        const notifs = await notificationService.getNotifications()
        setNotifications(Array.isArray(notifs) ? notifs : notifs.notifications || [])
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [setNotifications, notifications.length])

  const filteredNotifications = notifications.filter(n => 
    activeTab === 'all' || n.type === activeTab
  )

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <>
      <Helmet><title>Notifications | CleanNigeria</title></Helmet>
      
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Notifications</h1>
            <p className="text-slate-500">Stay updated with your service status and account alerts.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="rounded-xl border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 gap-2 h-10 px-4"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-slate-100/50 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === cat.value 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-brand-600"
                )}
              >
                <cat.icon className={cn("h-4 w-4", activeTab === cat.value ? "text-brand-600" : "text-slate-400")} />
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64 px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search notifications..." 
              className="h-10 pl-10 pr-4 rounded-xl border-slate-200 bg-white focus-visible:ring-brand-600"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer',
                  !n.isRead 
                    ? 'bg-white border-brand-200 shadow-lg shadow-brand-600/5' 
                    : 'bg-slate-50/50 border-slate-200/60 hover:bg-white hover:border-slate-300'
                )}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-brand-600 rounded-r-full" />
                )}
                
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
                  !n.isRead ? "bg-brand-50 border-brand-100" : "bg-white border-slate-200"
                )}>
                  {n.type === 'billing' ? (
                    <CreditCard className={cn("h-6 w-6", !n.isRead ? "text-brand-600" : "text-slate-400")} />
                  ) : n.type === 'service' ? (
                    <Package className={cn("h-6 w-6", !n.isRead ? "text-brand-600" : "text-slate-400")} />
                  ) : (
                    <AlertCircle className={cn("h-6 w-6", !n.isRead ? "text-brand-600" : "text-slate-400")} />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm font-black leading-none", !n.isRead ? "text-slate-900" : "text-slate-700")}>
                      {n.title}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase font-bold border-0 px-0",
                      n.type === 'billing' ? "text-blue-600" : n.type === 'service' ? "text-emerald-600" : "text-slate-500"
                    )}>
                      #{n.type}
                    </Badge>
                    <button className="text-xs font-bold text-brand-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Bell className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No notifications found</h3>
              <p className="text-slate-500">You're all caught up! No new updates in this category.</p>
              <Button variant="outline" onClick={() => setActiveTab('all')} className="rounded-xl">
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

