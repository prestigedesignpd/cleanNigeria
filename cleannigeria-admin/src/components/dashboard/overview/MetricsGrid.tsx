import { Users, CreditCard, Building2, AlertTriangle, Clock, Map, TrendingUp, Truck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminUsers';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const CountUpComponent = (CountUp as any).default || CountUp;

export function MetricsGrid() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const defaultStats = {
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    openComplaints: 0,
    activeCollectors: 0,
    revenueKobo: 0
  };

  const currentStats = stats || defaultStats;

  const metrics = [
    { title: "Total Users", value: currentStats.totalUsers, icon: Users, trend: "Live", isPositive: true },
    { title: "Active Subscriptions", value: currentStats.activeSubscriptions, icon: Users, trend: "Live", isPositive: true },
    { title: "Total Revenue", value: currentStats.revenueKobo / 100, isCurrency: true, icon: CreditCard, trend: "Live", isPositive: true },
    { title: "Open Complaints", value: currentStats.openComplaints, icon: AlertTriangle, trend: "Live", isPositive: false },
    { title: "Pending Payments", value: currentStats.pendingPayments, icon: Clock, trend: "Live", isPositive: false },
    { title: "Active Collectors", value: currentStats.activeCollectors, icon: Truck, trend: "Live", isPositive: true },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
        >
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {metric.title}
              </CardTitle>
              <div className="h-8 w-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <metric.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white flex items-baseline">
                {metric.isCurrency && <span className="text-lg mr-0.5">₦</span>}
                <CountUpComponent
                  end={metric.value}
                  duration={1.2}
                  separator=","
                  decimals={metric.isCurrency ? 2 : 0}
                />
              </div>
              <p className={`text-xs mt-1 flex items-center ${metric.isPositive ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
