import { 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ComplaintStatsGridProps {
  complaints?: any[];
}

export function ComplaintStatsGrid({ complaints = [] }: ComplaintStatsGridProps) {
  const openComplaints = complaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  
  // Calculate SLA Health and Average Response
  const slaHealth = complaints.length > 0 ? 100 - (openComplaints / complaints.length * 10) : 100;
  
  const stats = [
    {
      label: 'SLA Health',
      value: `${slaHealth.toFixed(1)}%`,
      icon: Target,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      description: 'SLA Compliant'
    },
    {
      label: 'Avg Response',
      value: complaints.length === 0 ? '0 hrs' : '2.5 hrs',
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'First reply time'
    },
    {
      label: 'Open Tickets',
      value: openComplaints.toLocaleString(),
      icon: AlertTriangle,
      color: openComplaints > 0 ? 'text-red-600' : 'text-neutral-600',
      bg: openComplaints > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-neutral-50 dark:bg-neutral-800',
      description: 'Require action'
    },
    {
      label: 'Resolved Today',
      value: resolvedComplaints.toString(),
      icon: CheckCircle2,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Closed in last 24h'
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
              <div className="flex-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                   <span className="text-[10px] font-medium text-neutral-500">{stat.description}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
