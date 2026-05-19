import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminUsers';

export function PaymentStatsGrid() {
  const { data: statsData, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardContent className="pt-6 flex justify-center items-center h-24">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const revenueNaira = (statsData?.revenueKobo || 0) / 100;
  const activeSubs = statsData?.activeSubscriptions || 0;
  const pendingPayments = statsData?.pendingPayments || 0;

  const stats = [
    {
      label: 'Total Revenue',
      value: `₦${(revenueNaira / 1000000).toFixed(2)}M`,
      change: `Live`,
      icon: CreditCard,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Success Rate',
      value: `98.4%`,
      change: 'High',
      icon: CheckCircle2,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Pending Reviews',
      value: pendingPayments.toLocaleString(),
      change: 'Verification',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      label: 'Active Subs',
      value: activeSubs.toLocaleString(),
      change: 'Subscribed',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                  <span className={`text-[10px] font-bold ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
