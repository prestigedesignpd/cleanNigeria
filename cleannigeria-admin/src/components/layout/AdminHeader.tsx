import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User as UserIcon, 
  Check, 
  AlertCircle, 
  Info, 
  FileText, 
  ArrowRight,
  TrendingUp,
  MapPin,
  HelpCircle,
  Megaphone,
  CreditCard,
  Building2,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/store/uiStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAdminNotifications, useMarkNotificationRead } from '@/hooks/useAdminEntities';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';

export function AdminHeader() {
  const navigate = useNavigate();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const user = useAdminAuthStore((state) => state.user);
  const logout = useAdminAuthStore((state) => state.logout);

  // Notifications State & Hooks
  const { data: notifications = [] } = useAdminNotifications();
  const markReadMutation = useMarkNotificationRead();
  const unreadNotifications = notifications.filter((n: any) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Search Command Palette State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Seeding the command items
  const commandItems = [
    { name: 'Dashboard Overview', description: 'View key metrics and operational trends', href: '/dashboard', icon: TrendingUp },
    { name: 'Analytics Dashboard', description: 'Deep dive into user, collection, and revenue metrics', href: '/analytics', icon: TrendingUp },
    { name: 'Verifications & Approvals', description: 'Review collector registrations and estate documents', href: '/users/verifications', icon: AlertCircle },
    { name: 'Estates Directory', description: 'Manage housing estates and individual households', href: '/estates', icon: Building2 },
    { name: 'Businesses Directory', description: 'Manage commercial businesses and clearance quotas', href: '/businesses', icon: Building2 },
    { name: 'Users Management', description: 'View residential administrators and accounts', href: '/users', icon: UserIcon },
    { name: 'Collectors & Trucks', description: 'Track waste collectors, ratings, and vehicle logs', href: '/collectors', icon: FileText },
    { name: 'Payments & Revenue', description: 'Audit Paystack transactions and invoice records', href: '/payments', icon: CreditCard },
    { name: 'Collection Schedules', description: 'Access live collection manifest and scheduling calendar', href: '/schedules', icon: CalendarDays },
    { name: 'Zone Mapping', description: 'Define boundaries and collection routes', href: '/zones', icon: MapPin },
    { name: 'Complaints Hub', description: 'Resolve household complaints and track SLA times', href: '/complaints', icon: AlertCircle },
    { name: 'Communication Center', description: 'Send broadcasts and alerts to collectors/residents', href: '/notifications', icon: Megaphone },
    { name: 'FAQ Manager', description: 'Update help center categories and articles', href: '/settings/faq', icon: HelpCircle },
    { name: 'Reports & Logs', description: 'Export operational summary and audit logs', href: '/reports', icon: FileText },
    { name: 'Global Settings', description: 'Configure platform parameters and admin accounts', href: '/settings', icon: Settings },
  ];

  // Filtering search items
  const filteredCommands = commandItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Command keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(open => !open);
      }
      if (searchOpen) {
        if (e.key === 'Escape') {
          setSearchOpen(false);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            navigate(filteredCommands[selectedIndex].href);
            setSearchOpen(false);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, selectedIndex, filteredCommands, navigate]);

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(unreadNotifications.map((n: any) => markReadMutation.mutateAsync(n._id || n.id)));
      toast.success('Notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark notifications read');
    }
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      await markReadMutation.mutateAsync(notif._id || notif.id);
      navigate('/notifications');
    } catch (err) {
      navigate('/notifications');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-neutral-700 dark:text-neutral-300" onClick={toggleSidebar}>
            <span className="sr-only">Toggle sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
          
          {!sidebarOpen && (
            <div className="flex items-center gap-2 transition-opacity duration-300 lg:hidden">
              <img
                src={logoImg}
                alt="CleanNigeria Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 object-contain"
              />
              <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight hidden sm:block">CleanNigeria</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400"
              aria-hidden="true"
            />
            <Input
              id="search-field"
              className="block w-full max-w-lg border-0 bg-transparent py-0 pl-10 pr-4 text-neutral-900 dark:text-white focus:ring-0 sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none cursor-pointer placeholder-neutral-400"
              placeholder="Search across all modules... (Press ⌘K)"
              type="text"
              readOnly
              onClick={() => setSearchOpen(true)}
            />
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            
            {/* Live Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 relative rounded-full">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-neutral-950" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                  <span className="text-sm font-bold text-neutral-800 dark:text-white">Alerts Inbox</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 px-2 font-bold text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                      onClick={handleMarkAllRead}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto custom-sidebar-scrollbar divide-y divide-neutral-100 dark:divide-neutral-800">
                  {notifications.length > 0 ? (
                    notifications.map((notif: any) => {
                      const isRead = notif.isRead || notif.read;
                      return (
                        <div 
                          key={notif.id}
                          className={`p-3.5 transition-colors cursor-pointer hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 flex gap-3 ${!isRead ? 'bg-green-50/10 dark:bg-green-950/5' : ''}`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <div className="shrink-0 mt-0.5">
                            {notif.type === 'Alert' ? (
                              <div className="h-7 w-7 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500">
                                <AlertCircle className="h-4 w-4" />
                              </div>
                            ) : notif.type === 'Payment' ? (
                              <div className="h-7 w-7 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-500">
                                <CreditCard className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
                                <Info className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-xs font-bold truncate ${!isRead ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                                {notif.title}
                              </span>
                              {!isRead && <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0 mt-1" />}
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-xs text-neutral-400">
                      No notifications available.
                    </div>
                  )}
                </div>
                
                <Link 
                  to="/notifications" 
                  className="p-3 text-center border-t border-neutral-100 dark:border-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 flex items-center justify-center gap-1.5 bg-neutral-50/30 dark:bg-neutral-900/30 transition-colors"
                >
                  View Communication Center <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-neutral-200 dark:lg:bg-neutral-800" aria-hidden="true" />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="-m-1.5 flex items-center p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full">
                  <span className="sr-only">Open user menu</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=16a34a&color=fff`} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-neutral-900 dark:text-white" aria-hidden="true">
                      {user?.name || 'Admin User'}
                    </span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer rounded-lg font-medium" onClick={() => navigate('/settings')}>
                  <UserIcon className="mr-2 h-4 w-4 text-neutral-400" /> Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-lg font-medium" onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4 text-neutral-400" /> Platform Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 cursor-pointer rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-950/20">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Unified Command Palette Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 pb-6 px-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSearchOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[420px] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-neutral-50/50 dark:bg-neutral-900/50">
              <Search className="h-5 w-5 text-neutral-400 mr-3 shrink-0" />
              <Input 
                placeholder="Type to search modules and features..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-0 py-1 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder-neutral-400 focus:outline-none focus:ring-0 shadow-none dark:text-white"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 px-1.5 font-mono text-[10px] font-bold text-neutral-400 shadow-sm ml-2">
                ESC
              </kbd>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar p-2">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Quick Navigation & Actions
                  </div>
                  {filteredCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={cmd.name}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-green-600 text-white shadow-sm' 
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                        onClick={() => {
                          navigate(cmd.href);
                          setSearchOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <cmd.icon className={`h-5 w-5 shrink-0 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold leading-none ${isSelected ? 'text-white' : 'text-neutral-800 dark:text-white'}`}>
                            {cmd.name}
                          </p>
                          <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-green-100' : 'text-neutral-400'}`}>
                            {cmd.description}
                          </p>
                        </div>
                        {isSelected && (
                          <kbd className="hidden sm:inline-flex h-5 select-none items-center rounded border border-green-500 bg-green-700 px-1.5 font-mono text-[9px] font-bold text-white ml-2">
                            ENTER
                          </kbd>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No matching features found. Try another query.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
