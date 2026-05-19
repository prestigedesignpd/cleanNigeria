import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, AlertCircle, MapPin, Zap, FileText, MessageSquare, Gift, Phone, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAuthStore } from '@/store/authStore'
import { AppLoader } from '@/components/common/AppLoader'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { subscriptionService } from '@/services/subscription.service'
import { scheduleService } from '@/services/schedule.service'
import { complaintService } from '@/services/complaint.service'
import { notificationService } from '@/services/notification.service'
import { formatPickupDate, formatRelativeTime } from '@/lib/formatters'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { Pickup } from '@/types/schedule.types'
import type { Complaint } from '@/types/complaint.types'
import type { Notification } from '@/types/notification.types'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const { subscription, setSubscription } = useSubscriptionStore()
  
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [subs, picks, comps, notifs] = await Promise.all([
          subscriptionService.getMySubscriptions(),
          scheduleService.getPickups(),
          complaintService.getComplaints(),
          notificationService.getNotifications(),
        ])
        
        // Assume the first subscription is the active one for simplicity
        setSubscription(subs[0] || null)
        setPickups(picks)
        setComplaints(comps)
        setNotifications(Array.isArray(notifs) ? notifs : notifs.notifications || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [setSubscription])

  const nextPickup = pickups.find((p) => p.status === 'scheduled')
  const openComplaints = complaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length
  const unreadNotifs = notifications.filter((n) => !n.isRead).length

  const quickActions = [
    { icon: CreditCard, label: 'Pay Now', href: ROUTES.PAYMENTS, color: 'bg-blue-50 text-blue-600' },
    { icon: Plus, label: 'Extra Pickup', href: ROUTES.REQUEST_PICKUP, color: 'bg-purple-50 text-purple-600' },
    { icon: MessageSquare, label: 'Report Issue', href: ROUTES.NEW_COMPLAINT, color: 'bg-red-50 text-red-600' },
    { icon: FileText, label: 'Invoices', href: ROUTES.INVOICES, color: 'bg-green-50 text-green-600' },
    { icon: Gift, label: 'Refer Friend', href: ROUTES.REFERRAL, color: 'bg-yellow-50 text-yellow-600' },
    { icon: Phone, label: 'Get Support', href: ROUTES.SUPPORT, color: 'bg-brand-50 text-brand-600' },
  ]

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <>
      <Helmet><title>Dashboard | CleanNigeria</title></Helmet>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* Welcome Banner */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.fullName?.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
          </div>
          <StatusBadge status={subscription?.status || 'inactive'} />
        </motion.div>

        {/* Expiring soon alert */}
        {subscription?.status === 'active' && (
          <motion.div variants={fadeUp}>
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <AlertCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Next collection: <strong>{nextPickup ? formatPickupDate(nextPickup.scheduledDate) : 'Not scheduled'}</strong>
                  {nextPickup && ` · ${nextPickup.timeWindow}`}
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Subscription renews {subscription?.currentPeriodEnd ? formatPickupDate(subscription.currentPeriodEnd) : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Next Pickup',
              value: nextPickup ? formatPickupDate(nextPickup.scheduledDate) : 'None scheduled',
              sub: nextPickup?.timeWindow ?? '',
              icon: Calendar,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              title: 'Current Plan',
              value: subscription?.plan?.name || 'No Plan',
              sub: subscription ? `${subscription.collectionsUsed}/${subscription.collectionsIncluded} collections used` : 'N/A',
              icon: CreditCard,
              color: 'text-brand-600',
              bg: 'bg-brand-50',
            },
            {
              title: 'Open Complaints',
              value: openComplaints.toString(),
              sub: openComplaints === 0 ? 'All resolved' : `${openComplaints} active`,
              icon: MessageSquare,
              color: 'text-red-600',
              bg: 'bg-red-50',
            },
            {
              title: 'Unread Notifications',
              value: unreadNotifs.toString(),
              sub: 'Latest updates',
              icon: Zap,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
          ].map((stat) => (
            <Card key={stat.title} className="border hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-lg font-bold mt-0.5">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Pickup Card */}
          {nextPickup && (
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-600" /> Next Scheduled Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-600 text-white">
                      <span className="text-lg font-bold">{format(new Date(nextPickup.scheduledDate), 'd')}</span>
                      <span className="text-xs">{format(new Date(nextPickup.scheduledDate), 'MMM')}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">{formatPickupDate(nextPickup.scheduledDate)}</p>
                      <p className="text-sm text-muted-foreground">{nextPickup.timeWindow}</p>
                      {nextPickup.collector && (
                        <div className="flex items-center gap-2 mt-2">
                          <img src={nextPickup.collector.avatar} alt={nextPickup.collector.name} className="h-7 w-7 rounded-full bg-brand-100" />
                          <span className="text-xs text-muted-foreground">
                            {nextPickup.collector.name} · ⭐ {nextPickup.collector.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={nextPickup.status} />
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                      <Link to={ROUTES.TRACKING}><MapPin className="h-3.5 w-3.5" /> Track Collector</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to={ROUTES.SCHEDULE}>View Schedule</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div variants={fadeUp}>
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-muted transition-colors group"
                    >
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110', action.color)}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp}>
          <Card className="border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-brand-600">
                <Link to={ROUTES.NOTIFICATIONS}>View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-0 divide-y divide-border">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className={cn('flex items-start gap-3 py-3', !n.isRead && 'bg-brand-50/30')}>
                  <div className={cn('mt-1 h-2 w-2 rounded-full shrink-0', !n.isRead ? 'bg-brand-600' : 'bg-muted')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeTime(n.createdAt)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}
