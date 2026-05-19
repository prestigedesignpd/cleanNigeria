import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ScheduleStatsGridProps {
  schedules?: any[];
}

export function ScheduleStatsGrid({ schedules = [] }: ScheduleStatsGridProps) {
  const totalCount = schedules.length;
  const completedCount = schedules.filter((s: any) => s.status === 'Completed' || s.status === 'COMPLETED').length;
  const inProgressCount = schedules.filter((s: any) => s.status === 'In Progress' || s.status === 'IN_PROGRESS').length;
  const delayedCount = schedules.filter((s: any) => s.status === 'Delayed' || s.status === 'DELAYED' || s.status === 'Missed' || s.status === 'MISSED').length;

  const stats = [
    {
      label: 'Scheduled Today',
      value: totalCount,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: Truck,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Delayed / Alerts',
      value: delayedCount,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
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
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
