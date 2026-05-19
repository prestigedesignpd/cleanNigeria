import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Store, 
  Users, 
  Truck, 
  CreditCard, 
  CalendarDays, 
  AlertTriangle, 
  Bell, 
  BarChart3, 
  FileText, 
  LogOut,
  PenTool,
  Gift,
  ShieldAlert,
  HelpCircle,
  LayoutTemplate,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import logoImg from '@/assets/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Verifications', href: '/users/verifications', icon: ShieldAlert },
  { name: 'Estates', href: '/estates', icon: Building2 },
  { name: 'Businesses', href: '/businesses', icon: Store },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Collectors', href: '/collectors', icon: Truck },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Schedules', href: '/schedules', icon: CalendarDays },
  { name: 'Zones', href: '/zones', icon: Map },
  { name: 'Complaints', href: '/complaints', icon: AlertTriangle },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Home Page CMS', href: '/cms/landing', icon: LayoutTemplate },
  { name: 'Blog', href: '/blog', icon: PenTool },
  { name: 'FAQ', href: '/settings/faq', icon: HelpCircle },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const logout = useAdminAuthStore((state) => state.logout);

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out shrink-0 h-screen",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className={cn(
        "flex h-16 shrink-0 items-center border-b border-neutral-200 dark:border-neutral-800 transition-all",
        sidebarOpen ? "px-6" : "justify-center px-0"
      )}>
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="CleanNigeria Logo"
            className={cn(
              "shrink-0 object-contain transition-all duration-300",
              sidebarOpen 
                ? "h-14 w-14 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16" 
                : "h-10 w-10"
            )}
          />
          {sidebarOpen && (
            <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight whitespace-nowrap">CleanNigeria</span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar py-6 pr-1">
        <nav className={cn(
          "flex flex-1 flex-col space-y-1 px-3",
          !sidebarOpen && "items-center"
        )}>
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                title={!sidebarOpen ? item.name : undefined}
                className={cn(
                  isActive
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white',
                  'group flex items-center rounded-xl transition-all',
                  sidebarOpen ? 'px-3 py-2.5 w-full' : 'p-3 justify-center'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-green-600 dark:text-green-400' : 'text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300',
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    sidebarOpen ? 'mr-3' : 'mr-0'
                  )}
                  aria-hidden="true"
                />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={cn(
        "p-4 border-t border-neutral-200 dark:border-neutral-800 transition-all",
        !sidebarOpen && "flex justify-center"
      )}>
        <button
          onClick={logout}
          title={!sidebarOpen ? "Sign out" : undefined}
          className={cn(
            "group flex items-center rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all",
            sidebarOpen ? "w-full px-3 py-2.5" : "p-3 justify-center"
          )}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", sidebarOpen && "mr-3")} aria-hidden="true" />
          {sidebarOpen && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}
