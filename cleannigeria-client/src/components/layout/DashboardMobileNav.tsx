import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, CreditCard, HelpCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'

const tabs = [
  { label: 'Home', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Schedule', icon: Calendar, path: ROUTES.SCHEDULE },
  { label: 'Payments', icon: CreditCard, path: ROUTES.PAYMENTS },
  { label: 'Support', icon: HelpCircle, path: ROUTES.SUPPORT },
  { label: 'Profile', icon: User, path: ROUTES.SETTINGS_PROFILE },
]

export function DashboardMobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/90 backdrop-blur-sm lg:hidden">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === ROUTES.DASHBOARD}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors',
              isActive ? 'text-brand-600' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <tab.icon className="h-5 w-5" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
