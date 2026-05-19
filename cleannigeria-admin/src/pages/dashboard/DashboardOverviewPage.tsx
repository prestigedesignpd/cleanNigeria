import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AlertsWidget } from '@/components/dashboard/overview/AlertsWidget';
import { MetricsGrid } from '@/components/dashboard/overview/MetricsGrid';
import { RevenueWidget } from '@/components/dashboard/overview/RevenueWidget';
import { ActiveSubscriptionsWidget } from '@/components/dashboard/overview/ActiveSubscriptionsWidget';
import { RecentSignupsWidget } from '@/components/dashboard/overview/RecentSignupsWidget';
import { RecentPaymentsWidget } from '@/components/dashboard/overview/RecentPaymentsWidget';
import { ActivityFeed } from '@/components/dashboard/activity/ActivityFeed';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function DashboardOverviewPage() {
  const user = useAdminAuthStore((state) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Here's what's happening across CleanNigeria today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-medium text-neutral-900 dark:text-white">
            {format(currentTime, 'hh:mm:ss a')}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {format(currentTime, 'EEEE, MMMM do, yyyy')}
          </div>
        </div>
      </div>

      <AlertsWidget />
      <MetricsGrid />

      <div className="grid grid-cols-4 gap-4 lg:gap-8">
        <RevenueWidget />
      </div>

      <div className="grid grid-cols-4 gap-4 lg:gap-8">
        <ActiveSubscriptionsWidget />
      </div>

      <div className="grid grid-cols-4 gap-4 lg:gap-8">
        <RecentSignupsWidget />
        <RecentPaymentsWidget />
      </div>

      <ActivityFeed />
    </div>
  );
}
