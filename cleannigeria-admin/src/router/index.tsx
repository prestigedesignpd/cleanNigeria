import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedAdminRoute } from '@/components/layout/ProtectedAdminRoute';

// Pages - Auth
import AdminLoginPage from '@/pages/auth/AdminLoginPage';
import AdminForgotPasswordPage from '@/pages/auth/AdminForgotPasswordPage';
import AdminResetPasswordPage from '@/pages/auth/AdminResetPasswordPage';

// Pages - Dashboard
import DashboardOverviewPage from '@/pages/dashboard/DashboardOverviewPage';
import AnalyticsOverviewPage from '@/pages/analytics/AnalyticsOverviewPage';

// Pages - Estates
import EstatesListPage from '@/pages/estates/EstatesListPage';
import EstateDetailsPage from '@/pages/estates/EstateDetailsPage';
import BusinessesListPage from '@/pages/businesses/BusinessesListPage';
import BusinessDetailsPage from '@/pages/businesses/BusinessDetailsPage';
import UsersListPage from '@/pages/users/UsersListPage';
import UserDetailsPage from '@/pages/users/UserDetailsPage';
import CollectorsListPage from '@/pages/collectors/CollectorsListPage';
import CollectorDetailsPage from '@/pages/collectors/CollectorDetailsPage';
import PaymentsListPage from '@/pages/payments/PaymentsListPage';
import SubscriptionsListPage from '@/pages/subscriptions/SubscriptionsListPage';
import ZonesListPage from '@/pages/zones/ZonesListPage';
import ZoneDetailsPage from '@/pages/zones/ZoneDetailsPage';
import SchedulesOverviewPage from '@/pages/schedules/SchedulesOverviewPage';
import ComplaintsListPage from '@/pages/complaints/ComplaintsListPage';
import ComplaintDetailsPage from '@/pages/complaints/ComplaintDetailsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import BlogListPage from '@/pages/blog/BlogListPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import FaqManagerPage from '@/pages/settings/FaqManagerPage';
import VerificationQueuePage from '@/pages/users/VerificationQueuePage';
import LandingPageCMS from '@/pages/cms/LandingPageCMS';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/forgot-password',
    element: <AdminForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <AdminResetPasswordPage />,
  },
  {
    path: '/',
    element: <ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardOverviewPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsOverviewPage />,
      },
      {
        path: 'estates',
        element: <EstatesListPage />,
      },
      {
        path: 'estates/:id',
        element: <EstateDetailsPage />,
      },
      {
        path: 'businesses',
        element: <BusinessesListPage />,
      },
      {
        path: 'businesses/:id',
        element: <BusinessDetailsPage />,
      },
      {
        path: 'users',
        element: <UsersListPage />,
      },
      {
        path: 'users/:id',
        element: <UserDetailsPage />,
      },
      {
        path: 'users/verifications',
        element: <VerificationQueuePage />,
      },
      {
        path: 'collectors',
        element: <CollectorsListPage />,
      },
      {
        path: 'collectors/:id',
        element: <CollectorDetailsPage />,
      },
      {
        path: 'payments',
        element: <PaymentsListPage />,
      },
      {
        path: 'subscriptions',
        element: <SubscriptionsListPage />,
      },
      {
        path: 'zones',
        element: <ZonesListPage />,
      },
      {
        path: 'zones/:id',
        element: <ZoneDetailsPage />,
      },
      {
        path: 'schedules',
        element: <SchedulesOverviewPage />,
      },
      {
        path: 'complaints',
        element: <ComplaintsListPage />,
      },
      {
        path: 'complaints/:id',
        element: <ComplaintDetailsPage />,
      },

      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'blog',
        element: <BlogListPage />,
      },
      {
        path: 'cms/landing',
        element: <LandingPageCMS />,
      },
      {
        path: 'settings/faq',
        element: <FaqManagerPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      // Other routes will be added here
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
