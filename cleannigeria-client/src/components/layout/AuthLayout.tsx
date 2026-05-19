import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/routes'
import { AppLogo } from '@/components/common/AppLogo'

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />

  return (
    <div className="flex min-h-screen">
      {/* Left — Branded panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between gradient-brand p-12">
        <AppLogo variant="white" size="lg" />
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            A Cleaner Nigeria<br />Starts with You.
          </h1>
          <p className="text-brand-100 text-lg leading-relaxed max-w-md">
            Join 12,000+ homes and businesses that trust CleanNigeria for reliable, tech-powered waste collection.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'Homes Served', value: '12,000+' },
              { label: 'Estates Covered', value: '48' },
              { label: 'On-time Rate', value: '99%' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-brand-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-brand-300 text-sm">© {new Date().getFullYear()} CleanNigeria. All rights reserved.</p>
      </div>

      {/* Right — Form area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <AppLogo size="md" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
