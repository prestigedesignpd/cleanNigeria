import type { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { PageLoader } from '@/components/common/PageLoader'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'))
const VerifyPhonePage = lazy(() => import('@/pages/auth/VerifyPhonePage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const AuthRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <S><LoginPage /></S> },
      { path: 'register', element: <S><RegisterPage /></S> },
      { path: 'verify-email', element: <S><VerifyEmailPage /></S> },
      { path: 'verify-phone', element: <S><VerifyPhonePage /></S> },
      { path: 'forgot-password', element: <S><ForgotPasswordPage /></S> },
      { path: 'reset-password', element: <S><ResetPasswordPage /></S> },
    ],
  },
]
