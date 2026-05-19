import type { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { PageLoader } from '@/components/common/PageLoader'

const HomePage = lazy(() => import('@/pages/marketing/HomePage'))
const AboutPage = lazy(() => import('@/pages/marketing/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/marketing/ServicesPage'))
const PricingPage = lazy(() => import('@/pages/marketing/PricingPage'))
const CoveragePage = lazy(() => import('@/pages/marketing/CoveragePage'))
const ContactPage = lazy(() => import('@/pages/marketing/ContactPage'))
const BlogPage = lazy(() => import('@/pages/marketing/BlogPage'))
const BlogDetailPage = lazy(() => import('@/pages/marketing/BlogDetailPage'))
const FaqPage = lazy(() => import('@/pages/marketing/FaqPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/marketing/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/pages/marketing/TermsOfServicePage'))

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const PublicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <S><HomePage /></S> },
      { path: '/about', element: <S><AboutPage /></S> },
      { path: '/services', element: <S><ServicesPage /></S> },
      { path: '/pricing', element: <S><PricingPage /></S> },
      { path: '/coverage', element: <S><CoveragePage /></S> },
      { path: '/contact', element: <S><ContactPage /></S> },
      { path: '/blog', element: <S><BlogPage /></S> },
      { path: '/blog/:slug', element: <S><BlogDetailPage /></S> },
      { path: '/faq', element: <S><FaqPage /></S> },
      { path: '/privacy', element: <S><PrivacyPolicyPage /></S> },
      { path: '/terms', element: <S><TermsPage /></S> },
    ],
  },
]
