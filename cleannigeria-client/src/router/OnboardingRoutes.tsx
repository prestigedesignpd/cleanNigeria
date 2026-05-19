import type { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { PageLoader } from '@/components/common/PageLoader'

const OnboardingWizard = lazy(() => import('@/pages/onboarding/OnboardingWizard'))
const OnboardingSuccess = lazy(() => import('@/pages/onboarding/OnboardingSuccess'))

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const OnboardingRoutes: RouteObject[] = [
  {
    path: '/onboarding',
    element: <ProtectedRoute><S><OnboardingWizard /></S></ProtectedRoute>,
  },
  {
    path: '/onboarding/success',
    element: <ProtectedRoute><S><OnboardingSuccess /></S></ProtectedRoute>,
  },
]
