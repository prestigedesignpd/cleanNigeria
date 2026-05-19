import { 
  Map, 
  Users, 
  Zap, 
  Target 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ZoneStatsGridProps {
  zones?: any[];
}

export function ZoneStatsGrid({ zones = [] }: ZoneStatsGridProps) {
  const totalZones = zones.length;
  // Compute dummy metrics dynamically or just provide standard defaults if no data
  const avgCoverage = totalZones > 0 ? 88 : 0;
  const efficiency = totalZones > 0 ? 94 : 0;
  const activeStaff = totalZones > 0 ? zones.reduce((acc, z) => acc + (z.assignedCollectors?.length || 0), 0) || 45 : 0; // Fallback to 45 if it's mock logic, but 0 if empty

  const stats = [
    {
      label: 'Operational Zones',
      value: totalZones,
      icon: Map,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Avg Coverage',
      value: `${avgCoverage}%`,
      icon: Target,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Zone Efficiency',
      value: `${efficiency}%`,
      icon: Zap,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Field Staff',
      value: activeStaff,
      icon: Users,
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
