import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PublicRoutes } from './PublicRoutes'
import { AuthRoutes } from './AuthRoutes'
import { DashboardRoutes } from './DashboardRoutes'
import { OnboardingRoutes } from './OnboardingRoutes'
import { PageLoader } from '@/components/common/PageLoader'

const NotFoundPage = lazy(() => import('@/pages/marketing/NotFoundPage'))

const router = createBrowserRouter([
  ...PublicRoutes,
  ...AuthRoutes,
  ...OnboardingRoutes,
  ...DashboardRoutes,
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
