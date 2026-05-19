import type { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { PageLoader } from '@/components/common/PageLoader'

const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'))
const SubscriptionPage = lazy(() => import('@/pages/dashboard/subscription/SubscriptionPage'))
const ChangePlanPage = lazy(() => import('@/pages/dashboard/subscription/ChangePlanPage'))
const CancelSubscriptionPage = lazy(() => import('@/pages/dashboard/subscription/CancelSubscriptionPage'))
const PaymentsPage = lazy(() => import('@/pages/dashboard/payments/PaymentsPage'))
const PaymentDetailPage = lazy(() => import('@/pages/dashboard/payments/PaymentDetailPage'))
const InvoicesPage = lazy(() => import('@/pages/dashboard/payments/InvoicesPage'))
const SchedulePage = lazy(() => import('@/pages/dashboard/schedule/SchedulePage'))
const PickupDetailPage = lazy(() => import('@/pages/dashboard/schedule/PickupDetailPage'))
const RequestExtraPickupPage = lazy(() => import('@/pages/dashboard/schedule/RequestExtraPickupPage'))
const ComplaintsPage = lazy(() => import('@/pages/dashboard/complaints/ComplaintsPage'))
const NewComplaintPage = lazy(() => import('@/pages/dashboard/complaints/NewComplaintPage'))
const ComplaintDetailPage = lazy(() => import('@/pages/dashboard/complaints/ComplaintDetailPage'))
const NotificationsPage = lazy(() => import('@/pages/dashboard/notifications/NotificationsPage'))
const SupportPage = lazy(() => import('@/pages/dashboard/support/SupportPage'))
const SettingsPage = lazy(() => import('@/pages/dashboard/settings/SettingsPage'))

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const DashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><DashboardHome /></S> },
      { path: 'subscription', element: <S><SubscriptionPage /></S> },
      { path: 'subscription/change', element: <S><ChangePlanPage /></S> },
      { path: 'subscription/cancel', element: <S><CancelSubscriptionPage /></S> },
      { path: 'payments', element: <S><PaymentsPage /></S> },
      { path: 'payments/:id', element: <S><PaymentDetailPage /></S> },
      { path: 'invoices', element: <S><InvoicesPage /></S> },
      { path: 'schedule', element: <S><SchedulePage /></S> },
      { path: 'schedule/:id', element: <S><PickupDetailPage /></S> },
      { path: 'schedule/request', element: <S><RequestExtraPickupPage /></S> },
      { path: 'complaints', element: <S><ComplaintsPage /></S> },
      { path: 'complaints/new', element: <S><NewComplaintPage /></S> },
      { path: 'complaints/:id', element: <S><ComplaintDetailPage /></S> },
      { path: 'notifications', element: <S><NotificationsPage /></S> },
      { path: 'support', element: <S><SupportPage /></S> },
      { path: 'settings/*', element: <S><SettingsPage /></S> },
    ],
  },
]
